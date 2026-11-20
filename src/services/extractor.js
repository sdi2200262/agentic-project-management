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

async function checkDestination(root, relativePath) {
  let current = root;
  for (const segment of relativePath.split(path.sep)) {
    current = path.join(current, segment);
    const info = await fs.lstat(current).catch(error => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (!info) return;
    if (info.isSymbolicLink()) {
      throw new Error(`Cannot extract through symbolic link: ${current}`);
    }
  }
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

  try {
    const zip = new AdmZip(zipBuffer);
    const root = path.resolve(destPath);
    const destinations = [];

    for (const entry of zip.getEntries()) {
      if (entry.isDirectory) continue;

      const fullPath = path.resolve(root, entry.entryName);
      const relativePath = path.relative(root, fullPath);
      const entryPath = relativePath.split(path.sep).join('/');
      if (!entryPath || entryPath === '..' || entryPath.startsWith('../') || path.isAbsolute(relativePath)) {
        logger.warn(`Blocked path traversal entry: ${entry.entryName}`);
        continue;
      }

      const normalized = entryPath.toLowerCase();
      if (normalized === '.apm/archives' || normalized.startsWith('.apm/archives/')) continue;
      const inApm = normalized.startsWith('.apm/');
      if ((skipApm && inApm) || (onlyApm && !inApm)) continue;

      await checkDestination(root, relativePath);
      destinations.push({ entry, fullPath, entryPath });
    }

    const writtenFiles = [];
    for (const { entry, fullPath, entryPath } of destinations) {
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
