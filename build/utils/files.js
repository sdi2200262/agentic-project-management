/**
 * File Utilities Module
 *
 * Provides file discovery and manipulation utilities for the build system.
 *
 * @module build/utils/files
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Recursively finds all .md template files, excluding README.md.
 *
 * @param {string} sourceDir - Directory to search.
 * @returns {Promise<string[]>} Array of markdown file paths.
 */
export async function findMdFiles(sourceDir) {
  const files = [];
  const items = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(sourceDir, item.name);

    if (item.isDirectory()) {
      files.push(...await findMdFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Copies scaffold files from source to destination.
 *
 * @param {string} source - Source scaffolds directory.
 * @param {string} dest - Destination scaffolds directory.
 * @returns {Promise<void>}
 */
export async function copyScaffolds(source, dest) {
  if (await fs.pathExists(source)) {
    await fs.copy(source, dest);
  }
}
