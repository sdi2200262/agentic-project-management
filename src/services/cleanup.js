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
 * Removes installed files for specified assistants.
 * Only deletes files explicitly tracked in metadata. Skips missing files.
 *
 * @param {string} cwd - Working directory.
 * @param {Object} installedFiles - Map of assistantId to file paths.
 * @param {string[]} [assistantIds] - Assistant IDs to clean (all if omitted).
 * @returns {Promise<number>} Number of files removed.
 */
export async function removeInstalledFiles(cwd, installedFiles, assistantIds = null) {
  if (!installedFiles || typeof installedFiles !== 'object') return 0;

  const ids = assistantIds || Object.keys(installedFiles);
  let removed = 0;

  for (const id of ids) {
    const files = installedFiles[id];
    if (!Array.isArray(files)) continue;

    for (const file of files) {
      const fullPath = path.join(cwd, file);
      if (await fs.pathExists(fullPath)) {
        await fs.remove(fullPath);
        removed++;
      }
    }
  }

  return removed;
}

export default { removeInstalledFiles };
