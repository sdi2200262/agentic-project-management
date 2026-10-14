/**
 * Cleanup Service Module
 *
 * Removes installed files tracked in metadata.
 *
 * @module src/services/cleanup
 */

import fs from 'fs-extra';
import path from 'path';

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
  if (!installedFiles || typeof installedFiles !== 'object') return 0;

  // _apm files are handled by the archive service, not by cleanup
  const ids = (assistantIds || Object.keys(installedFiles)).filter(id => id !== '_apm');
  let removed = 0;
  let keptShared = 0;

  // Files that assistants staying installed also list (e.g. shared .agents/skills/) are kept
  const kept = new Set(
    Object.keys(installedFiles)
      .filter(id => id !== '_apm' && !ids.includes(id))
      .flatMap(id => Array.isArray(installedFiles[id]) ? installedFiles[id] : [])
  );

  // Collect every parent directory from our installed file paths.
  // For ".github/skills/context-gathering/SKILL.md" this yields:
  //   .github/skills/context-gathering
  //   .github/skills
  //   .github (the root, removed only if empty and never reported as kept)
  // but NOT cwd.
  const ownedDirs = new Set();
  const rootDirs = new Set();

  for (const id of ids) {
    const files = installedFiles[id];
    if (!Array.isArray(files)) continue;

    for (const file of files) {
      if (kept.has(file)) {
        keptShared++;
        continue;
      }
      const fullPath = path.join(cwd, file);
      if (await fs.pathExists(fullPath)) {
        await fs.remove(fullPath);
        removed++;
      }

      // Walk path segments to collect every parent dir, including the assistant root
      // (e.g. ".agents"), which is removed only if it ends up empty
      const segments = file.split(/[\\/]/);
      for (let i = segments.length - 1; i >= 1; i--) {
        const dir = path.join(cwd, ...segments.slice(0, i));
        ownedDirs.add(dir);
        if (i === 1) rootDirs.add(dir);
      }
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

  return { removed, keptShared, keptDirs: leafKeptDirs };
}

export default { removeInstalledFiles };
