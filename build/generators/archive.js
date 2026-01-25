/**
 * Archive Generation Module
 *
 * Handles ZIP archive creation for build bundles.
 *
 * @module build/generators/archive
 */

import fs from 'fs-extra';
import archiver from 'archiver';

/**
 * Creates a ZIP archive from a directory.
 *
 * @param {string} sourceDir - Directory to compress.
 * @param {string} outputPath - Path for the output .zip file.
 * @returns {Promise<void>}
 * @throws {Error} If archiving fails.
 */
export async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
