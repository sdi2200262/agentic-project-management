/**
 * Cleanup Service Module
 *
 * Removes installed files tracked in metadata.
 *
 * @module src/services/cleanup
 */

import fs from 'fs-extra';
import path from 'path';

export async function sameFile(first, second) {
  try {
    const a = await fs.lstat(first, { bigint: true });
    const b = await fs.lstat(second, { bigint: true });
    return a.dev === b.dev && a.ino === b.ino;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
  }
}

/** A custom bundle may have a separate .APM directory on a case-sensitive volume. */
export async function isSessionPath(cwd, relativePath) {
  const [directory] = relativePath.split('/');
  if (directory === '.apm') return true;
  if (directory.toLowerCase() !== '.apm') return false;
  return sameFile(path.join(cwd, '.apm'), path.join(cwd, directory));
}

async function sharesRetainedEntry(cwd, file, candidates) {
  for (const other of candidates) {
    if (file === other) return true;
    if (!(await sameFile(path.join(cwd, file), path.join(cwd, other)))) continue;

    // Separate hard links can share an inode. Keep only the same directory entry.
    const parent = path.join(cwd, path.dirname(file));
    if (!(await sameFile(parent, path.join(cwd, path.dirname(other))))) continue;
    const name = path.basename(file);
    const otherName = path.basename(other);
    if (name === otherName) return true;
    const names = await fs.readdir(parent);
    if (!names.includes(name) || !names.includes(otherName)) return true;
  }
  return false;
}

function foldedPath(file) {
  return file.normalize('NFD').toUpperCase();
}

/** Check every file selected for removal before changing the installation. */
export async function validateInstalledFileRemoval(cwd, installedFiles, assistantIds = null) {
  const selected = new Set();
  const retained = new Map();
  for (const [id, files] of Object.entries(installedFiles || {})) {
    if (id === '_apm') continue; // Session files are preserved by the archive service.
    for (const file of files) {
      const relative = path.relative(cwd, path.resolve(cwd, file));
      if (!relative || path.isAbsolute(file) || path.isAbsolute(relative) || relative === '..'
        || relative.startsWith('..' + path.sep) || relative.split(path.sep)[0] === '.apm') {
        throw new Error(`Invalid installed file path: ${file}`);
      }
      // Older metadata could record a case alias of the session directory under a target.
      if (await isSessionPath(cwd, relative.split(path.sep).join('/'))) continue;
      if (!assistantIds || assistantIds.includes(id)) {
        selected.add(relative);
      } else {
        const key = foldedPath(relative);
        if (!retained.has(key)) retained.set(key, []);
        retained.get(key).push(relative);
      }
    }
  }
  for (const file of selected) {
    const candidates = retained.get(foldedPath(file));
    if (candidates && await sharesRetainedEntry(cwd, file, candidates)) {
      selected.delete(file);
      continue;
    }
    let current = cwd;
    const destination = path.join(cwd, file);
    for (const segment of file.split(path.sep)) {
      current = path.join(current, segment);
      try {
        const stat = await fs.lstat(current);
        if (current === destination ? !stat.isFile() : !stat.isDirectory()) {
          throw new Error(`Cannot remove installed file "${file}": unexpected file type at ${current}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') break;
        throw error;
      }
    }
  }
  return selected;
}

/**
 * Removes installed files for specified assistants, then cleans up
 * empty directories that belonged to those files.
 *
 * Safety rules:
 * - Only deletes files explicitly listed in installedFiles.
 * - Keeps files that an assistant staying installed also lists.
 * - Only removes directories that are parent segments of those files.
 * - Removes the assistant root directory (e.g. .agents/) only when it is empty.
 * - Stops climbing at any directory that still contains other content
 *   (user files, non-APM subdirectories, etc.).
 *
 * @param {string} cwd - Working directory.
 * @param {Object} installedFiles - Map of assistantId to file paths.
 * @param {string[]} [assistantIds] - Assistant IDs to clean (all if omitted).
 * @returns {Promise<{removed: number, keptDirs: string[]}>} Count of removed files and list of dirs kept due to non-APM content.
 */
export async function removeInstalledFiles(cwd, installedFiles, assistantIds = null) {
  const files = await validateInstalledFileRemoval(cwd, installedFiles, assistantIds);
  let removed = 0;

  // Collect every parent directory from our installed file paths.
  // For ".github/skills/context-gathering/SKILL.md" this yields:
  //   .github/skills/context-gathering
  //   .github/skills
  //   .github (the root, removed only if empty and never reported as kept)
  // but NOT cwd.
  const ownedDirs = new Set();
  const rootDirs = new Set();

  for (const file of files) {
    try {
      await fs.unlink(path.join(cwd, file));
      removed++;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const segments = file.split(path.sep);
    for (let i = segments.length - 1; i >= 1; i--) {
      const dir = path.join(cwd, ...segments.slice(0, i));
      ownedDirs.add(dir);
      if (i === 1) rootDirs.add(dir);
    }
  }

  // Remove owned directories that are now empty, deepest first.
  // Track dirs we skip because they still have non-APM content.
  const sorted = [...ownedDirs].sort((a, b) => b.length - a.length);
  const removedDirs = new Set();
  const keptDirs = [];

  for (const dir of sorted) {
    try {
      const entries = await fs.readdir(dir);
      if (entries.length === 0) {
        await fs.rmdir(dir);
        removedDirs.add(dir);
      } else {
        // Only report if all remaining entries are non-APM content
        // (not a parent dir we already cleaned — that would be noise)
        const hasRealContent = entries.some(e => !removedDirs.has(path.join(dir, e)));
        if (hasRealContent && !rootDirs.has(dir)) {
          keptDirs.push(path.relative(cwd, dir));
        }
      }
    } catch {
      // Directory already gone or inaccessible — skip
    }
  }

  // Only report leaf-level kept dirs (filter out parents of other kept dirs)
  const leafKeptDirs = keptDirs.filter(d =>
    !keptDirs.some(other => other !== d && other.startsWith(d + path.sep))
  );

  return { removed, keptDirs: leafKeptDirs };
}

export default { removeInstalledFiles };
