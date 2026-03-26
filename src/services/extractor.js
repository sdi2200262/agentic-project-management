/**
 * Bundle Extractor Module
 *
 * Provides ZIP download and extraction functionality.
 *
 * @module src/services/extractor
 */

import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { fetchAsset } from './github.js';
import { CLIError } from '../core/errors.js';
import logger from '../ui/logger.js';

/**
 * Downloads a bundle from a URL.
 *
 * @param {string} url - Download URL.
 * @returns {Promise<Buffer>} Bundle contents as buffer.
 */
export async function downloadBundle(url) {
  return fetchAsset(url);
}

/**
 * Extracts a ZIP buffer to a destination directory.
 *
 * @param {Buffer} zipBuffer - ZIP file contents.
 * @param {string} destPath - Destination directory.
 * @param {Object} [options={}] - Extraction options.
 * @param {boolean} [options.skipApm=false] - Skip .apm/ directory during extraction.
 * @param {boolean} [options.onlyApm=false] - Extract only .apm/ directory.
 * @returns {Promise<string[]>} Array of written file paths (relative to destPath).
 * @throws {CLIError} On extraction failure.
 */
export async function extractBundle(zipBuffer, destPath, options = {}) {
  const { skipApm = false, onlyApm = false } = options;
  const writtenFiles = [];

  try {
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryPath = entry.entryName;

      // Filter by extraction mode
      if (skipApm && entryPath.startsWith('.apm/')) continue;
      if (onlyApm && !entryPath.startsWith('.apm/')) continue;

      // Never overwrite archives during extraction
      if (entryPath.startsWith('.apm/archives/')) continue;

      const fullPath = path.join(destPath, entryPath);
      const resolvedDest = path.resolve(destPath);
      const resolvedFull = path.resolve(fullPath);

      // Block path traversal — skip entries that escape the destination
      if (!resolvedFull.startsWith(resolvedDest + path.sep) && resolvedFull !== resolvedDest) {
        logger.warn(`Blocked path traversal entry: ${entryPath}`);
        continue;
      }

      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, entry.getData());
      writtenFiles.push(entryPath);
    }

    return writtenFiles;
  } catch (err) {
    if (err instanceof CLIError) throw err;
    throw CLIError.extractionFailed('bundle', err.message);
  }
}

/**
 * Downloads and extracts a bundle in one operation.
 *
 * @param {string} url - Download URL.
 * @param {string} destPath - Destination directory.
 * @param {Object} [options={}] - Extraction options.
 * @returns {Promise<string[]>} Array of written file paths.
 */
export async function downloadAndExtract(url, destPath, options = {}) {
  const buffer = await downloadBundle(url);
  return extractBundle(buffer, destPath, options);
}

export default {
  downloadBundle,
  extractBundle,
  downloadAndExtract
};
