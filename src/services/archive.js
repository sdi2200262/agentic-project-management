/**
 * Archive Service Module
 *
 * Core archival logic for session continuation.
 *
 * @module src/services/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { ARCHIVES_DIR } from '../core/constants.js';
import { inspectWorktrees, moveWorktree, verifyMovedWorktree, restoreWorktree, checkWorktreeRemoval, removeWorktrees } from './worktrees.js';

/**
 * Generates the next archive directory name for today.
 * Format: session-YYYY-MM-DD-NNN (zero-padded daily counter).
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @returns {Promise<string>} Archive directory name.
 */
export async function generateArchiveName(archivesDir) {
  const today = new Date().toISOString().slice(0, 10);
  const prefix = `session-${today}-`;

  let maxCounter = 0;
  if (await fs.pathExists(archivesDir)) {
    const entries = await fs.readdir(archivesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(prefix)) {
        const suffix = entry.name.slice(prefix.length);
        const num = /^\d+$/.test(suffix) ? Number(suffix) : NaN;
        if (!isNaN(num) && num > maxCounter) {
          maxCounter = num;
        }
      }
    }
  }

  const counter = String(maxCounter + 1).padStart(3, '0');
  return `${prefix}${counter}`;
}

/**
 * Lists archives with their metadata.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<Array<{name: string, metadata: Object}>>} Archives with metadata.
 */
export async function listArchivesWithInfo(cwd) {
  const archivesDir = path.join(cwd, ARCHIVES_DIR);

  if (!await fs.pathExists(archivesDir)) {
    return [];
  }

  const entries = await fs.readdir(archivesDir, { withFileTypes: true });
  const archives = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const metadataPath = path.join(archivesDir, entry.name, 'metadata.json');
      if (await fs.pathExists(metadataPath)) {
        try {
          const metadata = await fs.readJson(metadataPath);
          archives.push({ name: entry.name, metadata });
        } catch {
          // Skip archives with unreadable metadata
        }
      }
    }
  }

  return archives.sort((a, b) => {
    const dateA = a.metadata.archivedAt || '';
    const dateB = b.metadata.archivedAt || '';
    return dateA.localeCompare(dateB);
  });
}

/**
 * Counts valid archives.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<number>} Number of valid archives.
 */
export async function countArchives(cwd) {
  const archives = await listArchivesWithInfo(cwd);
  return archives.length;
}

/** Validate a single archive directory name for creation and deletion. */
export function archivePathFor(cwd, name) {
  if (typeof name !== 'string' || !name || name === '.' || name === '..' || /[\\/\0]/.test(name)) {
    throw new Error('Archive name must be a single directory name.');
  }
  return path.join(cwd, ARCHIVES_DIR, name);
}

async function reserveArchive(cwd, requestedName) {
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  await fs.ensureDir(archivesDir);
  if ((await fs.lstat(archivesDir)).isSymbolicLink()) throw new Error(`Archive directory is a symbolic link: ${archivesDir}`);
  while (true) {
    const name = requestedName || await generateArchiveName(archivesDir);
    const archivePath = archivePathFor(cwd, name);
    try {
      await fs.mkdir(archivePath);
      return archivePath;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (requestedName) throw new Error(`Archive "${name}" already exists. Choose another name.`);
    }
  }
}

/** Snapshot session records, relocate linked worktrees, then clear active records. */
export async function createArchive(cwd, options = {}) {
  const apmDir = path.join(cwd, '.apm');
  const worktreesDir = path.join(apmDir, 'worktrees');
  const worktrees = await inspectWorktrees(worktreesDir, { repositoryHint: cwd });
  const entries = (await fs.readdir(apmDir)).filter(entry => entry !== 'archives');
  const metadataSrc = path.join(apmDir, 'metadata.json');
  const metadata = await fs.pathExists(metadataSrc) ? await fs.readJson(metadataSrc) : {};
  const trackedTopLevel = new Set((metadata.installedFiles?._apm || []).map(file => file.replace(/^\.apm\//, '').split(/[\\/]/)[0]));
  trackedTopLevel.add('metadata.json');
  const runtimeEntries = entries.filter(entry => !trackedTopLevel.has(entry));
  const archivePath = await reserveArchive(cwd, options.name);
  const moved = [];
  try {
    for (const entry of entries) {
      if (entry !== 'worktrees') await fs.copy(path.join(apmDir, entry), path.join(archivePath, entry), { overwrite: false, errorOnExist: true });
    }
    for (const worktree of worktrees) {
      const destination = path.join(archivePath, 'worktrees', path.relative(worktreesDir, worktree.from));
      moved.push({ worktree, destination });
      await moveWorktree(worktree, destination);
      await verifyMovedWorktree(worktree, destination);
    }
    const relocations = moved.map(({ worktree, destination }) => ({
      from: worktree.from, to: destination, repository: worktree.repository,
      branch: worktree.branch, unfinished: !!worktree.state.status
    }));
    await fs.writeJson(path.join(archivePath, 'metadata.json'), {
      ...metadata, archivedAt: new Date().toISOString(),
      ...(options.reason ? { reason: options.reason } : {}), archivedWorktrees: relocations
    }, { spaces: 2 });
  } catch (error) {
    const failures = [];
    for (const { worktree, destination } of [...moved].reverse()) {
      try {
        const sourceExists = await fs.pathExists(worktree.from);
        const destinationExists = await fs.pathExists(destination);
        if (destinationExists && !sourceExists) await restoreWorktree(worktree, destination);
        else if (destinationExists || !sourceExists) {
          throw new Error('Worktree locations need inspection; automatic rollback would risk overwriting files.');
        }
      } catch (rollbackError) { failures.push(`${worktree.from} -> ${destination}: ${rollbackError.message}`); }
    }
    if (!failures.length) {
      await fs.remove(archivePath);
      throw new Error(`Archive stopped; active session files were kept. ${error.message}`);
    }
    throw new Error(`Archive stopped; active session records were kept and the partial archive remains at ${archivePath}. Inspect and repair these worktree locations: ${failures.join('; ')}. Original error: ${error.message}`);
  }

  // Preservation has succeeded. Keep the archive if clearing active files fails.
  try {
    for (const entry of entries) {
      if (entry !== 'metadata.json') await fs.remove(path.join(apmDir, entry));
    }
  } catch (error) {
    throw new Error(`Session preserved at ${archivePath}, but active-file cleanup failed: ${error.message}. Check both locations before continuing.`);
  }
  return { archivePath, runtimeEntries, worktrees: moved.map(({ worktree, destination }) => ({ from: worktree.from, to: destination, unfinished: !!worktree.state.status })) };
}

async function deletionPlan(cwd, name, options) {
  const archivePath = archivePathFor(cwd, name);
  if (!await fs.pathExists(archivePath)) return null;
  if ((await fs.lstat(path.join(cwd, ARCHIVES_DIR))).isSymbolicLink()) throw new Error('Archive directory is a symbolic link.');
  if ((await fs.lstat(archivePath)).isSymbolicLink()) throw new Error(`Archive is a symbolic link: ${archivePath}`);
  const worktrees = await inspectWorktrees(path.join(archivePath, 'worktrees'), { allowOtherFiles: true });
  await checkWorktreeRemoval(worktrees, options.discardWorktrees);
  return { archivePath, worktrees };
}

/** Remove archived worktrees through Git before deleting their session records. */
export async function removeArchive(cwd, name, options = {}) {
  const plan = await deletionPlan(cwd, name, options);
  if (!plan) return false;
  await removeWorktrees(plan.worktrees, options.discardWorktrees);
  await fs.remove(plan.archivePath);
  return true;
}

/** Check every archive before deleting any, including explicit discard authorization. */
export async function clearArchives(cwd, options = {}) {
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  if (!await fs.pathExists(archivesDir)) return 0;
  if ((await fs.lstat(archivesDir)).isSymbolicLink()) throw new Error('Archive directory is a symbolic link.');
  const entries = await fs.readdir(archivesDir, { withFileTypes: true });
  const plans = [];
  for (const entry of entries) {
    if (entry.isDirectory()) plans.push(await deletionPlan(cwd, entry.name, options));
  }
  for (const plan of plans) {
    await removeWorktrees(plan.worktrees, options.discardWorktrees);
    await fs.remove(plan.archivePath);
  }
  return plans.length;
}

export default {
  generateArchiveName,
  listArchivesWithInfo,
  countArchives,
  createArchive,
  removeArchive,
  clearArchives
};
