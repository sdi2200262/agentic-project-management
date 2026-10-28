/** Git worktrees preserved inside APM session archives. */
import fs from 'fs-extra';
import path from 'path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

async function git(args) {
  try {
    return (await exec('git', args, { maxBuffer: 64 * 1024 * 1024 })).stdout.trimEnd();
  } catch (error) {
    throw new Error(`git ${args.join(' ')}: ${(error.stderr || error.message).trim()}`);
  }
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

async function registrations(repository) {
  const output = await git(['--git-dir', repository, 'worktree', 'list', '--porcelain', '-z']);
  return output.split('\0\0').filter(Boolean).map(record => {
    const fields = record.split('\0');
    return {
      location: fields.find(s => s.startsWith('worktree '))?.slice(9),
      branch: fields.find(s => s.startsWith('branch '))?.slice(7) || null,
      locked: fields.some(s => s === 'locked' || s.startsWith('locked ')),
      prunable: fields.some(s => s === 'prunable' || s.startsWith('prunable '))
    };
  });
}

async function state(location) {
  return {
    head: await git(['-C', location, 'rev-parse', 'HEAD']),
    status: await git(['-C', location, 'status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignored=matching']),
    staged: await git(['-C', location, 'diff', '--cached', '--binary']),
    unstaged: await git(['-C', location, 'diff', '--binary'])
  };
}

/** Discover registered linked worktrees, rejecting unexplained files and checkouts. */
export async function inspectWorktrees(root, { allowOtherFiles = false, repositoryHint } = {}) {
  const found = [];
  const repositories = new Set();
  if (repositoryHint) {
    let common;
    try { common = await git(['-C', repositoryHint, 'rev-parse', '--git-common-dir']); } catch { /* A workspace may contain separate repositories. */ }
    if (common) repositories.add(await fs.realpath(path.resolve(repositoryHint, common)));
  }
  async function visit(location, isRoot = false) {
    const stat = await fs.lstat(location);
    if (stat.isSymbolicLink()) throw new Error(`Worktree path is a symbolic link: ${location}`);
    if (!stat.isDirectory()) {
      if (allowOtherFiles) return;
      throw new Error(`Unexpected file in the worktree directory: ${location}`);
    }
    const marker = path.join(location, '.git');
    if (await fs.pathExists(marker)) {
      if (!(await fs.lstat(marker)).isFile()) throw new Error(`Expected a linked Git worktree at ${location}`);
      const common = await git(['-C', location, 'rev-parse', '--git-common-dir']);
      const repository = await fs.realpath(path.resolve(location, common));
      const registered = (await registrations(repository)).find(w => path.resolve(w.location) === path.resolve(location));
      if (!registered || registered.prunable) throw new Error(`Worktree registration needs repair: ${location}`);
      if (registered.locked) throw new Error(`Worktree is locked: ${location}. Unlock it explicitly before archiving or deleting it.`);
      repositories.add(repository);
      found.push({ from: location, repository, branch: registered.branch, state: await state(location) });
      return;
    }
    const entries = await fs.readdir(location);
    if (!entries.length && !isRoot && !allowOtherFiles) throw new Error(`Unregistered empty worktree directory: ${location}`);
    for (const name of entries) await visit(path.join(location, name));
  }
  if (await fs.pathExists(root)) await visit(root, true);
  for (const repository of repositories) {
    for (const entry of await registrations(repository)) {
      if (inside(root, entry.location) && !found.some(w => path.resolve(w.from) === path.resolve(entry.location))) {
        throw new Error(`Stale or unexpected worktree registration: ${entry.location}`);
      }
    }
  }
  return found;
}

export async function moveWorktree(worktree, destination) {
  const files = await git(['-C', worktree.from, 'ls-files', '--stage']);
  if (/^160000 /m.test(files)) throw new Error(`Worktree contains submodules and cannot be moved by Git: ${worktree.from}`);
  await fs.ensureDir(path.dirname(destination));
  await git(['--git-dir', worktree.repository, 'worktree', 'move', worktree.from, destination]);
}

export async function verifyMovedWorktree(worktree, destination) {
  const registered = (await registrations(worktree.repository)).find(w => path.resolve(w.location) === path.resolve(destination));
  if (!registered || registered.prunable) throw new Error(`Moved worktree registration was not preserved: ${destination}`);
  const after = await state(destination);
  if (JSON.stringify(after) !== JSON.stringify(worktree.state)) throw new Error(`Worktree changed while it was being archived: ${destination}. Stop agents before archiving.`);
}

export async function restoreWorktree(worktree, destination) {
  await fs.ensureDir(path.dirname(worktree.from));
  await git(['--git-dir', worktree.repository, 'worktree', 'move', destination, worktree.from]);
  const registered = (await registrations(worktree.repository)).find(w => path.resolve(w.location) === path.resolve(worktree.from));
  if (!registered || registered.prunable) throw new Error(`Restored worktree registration needs repair: ${worktree.from}`);
}

export async function checkWorktreeRemoval(worktrees, discardWorktrees = false) {
  for (const worktree of worktrees) {
    if (worktree.state.status && !discardWorktrees) {
      throw new Error(`Archive contains unfinished work in ${worktree.from}. Keep it, or explicitly authorize deletion with --discard-worktrees; --force only skips confirmation.`);
    }
  }
}

export async function removeWorktrees(worktrees, discardWorktrees = false) {
  for (const worktree of worktrees) {
    await git(['--git-dir', worktree.repository, 'worktree', 'remove', ...(discardWorktrees ? ['--force'] : []), worktree.from]);
  }
}
