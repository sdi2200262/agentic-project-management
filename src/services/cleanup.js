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
 * - Only removes directories that are intermediate path segments of
 *   those files (i.e., directories APM created).
 * - Never removes the assistant root directory (e.g. .github/, .claude/).
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

  // Collect every intermediate directory from our installed file paths.
  // For ".github/skills/context-gathering/SKILL.md" this yields:
  //   .github/skills/context-gathering
  //   .github/skills
  // but NOT .github (the root) and NOT cwd.
  const ownedDirs = new Set();

  for (const id of ids) {
    const files = installedFiles[id];
    if (!Array.isArray(files)) continue;

    for (const file of files) {
      const fullPath = path.join(cwd, file);
      if (await fs.pathExists(fullPath)) {
        await fs.remove(fullPath);
        removed++;
      }

      // Walk path segments to collect intermediate dirs (skip root segment)
      const segments = file.split(/[\\/]/);
      // segments[0] is the assistant root (e.g. ".github") — skip it
      for (let i = segments.length - 1; i > 1; i--) {
        const dir = path.join(cwd, ...segments.slice(0, i));
        ownedDirs.add(dir);
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
        if (hasRealContent) {
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
