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
 * @returns {Promise<void>}
 * @throws {CLIError} On extraction failure.
 */
export async function extractBundle(zipBuffer, destPath, options = {}) {
  const { skipApm = false } = options;

  try {
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryPath = entry.entryName;

      // Skip .apm/ directory if requested
      if (skipApm && entryPath.startsWith('.apm/')) {
        continue;
      }

      const fullPath = path.join(destPath, entryPath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, entry.getData());
    }
  } catch (err) {
    throw CLIError.extractionFailed('bundle', err.message);
  }
}

/**
 * Downloads and extracts a bundle in one operation.
 *
 * @param {string} url - Download URL.
 * @param {string} destPath - Destination directory.
 * @param {Object} [options={}] - Extraction options.
 * @returns {Promise<void>}
 */
export async function downloadAndExtract(url, destPath, options = {}) {
  const buffer = await downloadBundle(url);
  await extractBundle(buffer, destPath, options);
}

export default {
  downloadBundle,
  extractBundle,
  downloadAndExtract
};
