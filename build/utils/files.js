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
 * Recursively finds all .md template files in commands/ and skills/ directories.
 * Excludes README.md, _standards, and apm directories.
 *
 * @param {string} sourceDir - Directory to search.
 * @returns {Promise<string[]>} Array of markdown file paths.
 */
export async function findMdFiles(sourceDir) {
  const files = [];
  const items = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(sourceDir, item.name);

    // Skip _standards and apm directories (not processed as templates)
    if (item.isDirectory() && (item.name === '_standards' || item.name === 'apm')) {
      continue;
    }

    if (item.isDirectory()) {
      files.push(...await findMdFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
      files.push(fullPath);
    }
  }

  return files;
}
