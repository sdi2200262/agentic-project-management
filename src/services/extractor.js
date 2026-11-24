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
import { isSessionPath, sameFile } from './cleanup.js';
import { fetchAsset } from './github.js';
import { CLIError } from '../core/errors.js';
import logger from '../ui/logger.js';

/** Download every selected bundle before any project files change. */
export async function downloadBundles(bundles) {
  const downloaded = [];
  for (const { assistant, asset } of bundles) {
    const stop = logger.progress(`Downloading ${assistant.bundle}`);
    try {
      const buffer = await fetchAsset(asset.browser_download_url);
      downloaded.push({ assistant, buffer });
    } finally {
      stop();
    }
  }
  return downloaded;
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

      const [directory, child] = entryPath.split('/');
      if (directory.toLowerCase() === '.apm' && child?.toLowerCase() === 'archives') {
        if (directory === '.apm' && child === 'archives') continue;
        // Resolve ambiguous casing against the archive directory on this volume.
        const archiveDir = path.join(root, '.apm', 'archives');
        await checkDestination(root, path.relative(root, archiveDir));
        await fs.ensureDir(archiveDir);
        if (await sameFile(archiveDir, path.join(root, directory, child))) continue;
      }
      if (skipApm || onlyApm) {
        const inApm = await isSessionPath(root, entryPath);
        if ((skipApm && inApm) || (onlyApm && !inApm)) continue;
      }

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

/** Install shared session files once and record each target's installed paths. */
export async function installBundles(bundles, cwd, { skipApm = false } = {}) {
  const installedFiles = {};
  for (const { assistant, buffer } of bundles) {
    const files = await extractBundle(buffer, cwd, { skipApm });
    installedFiles[assistant.id] = [];
    if (!skipApm) installedFiles._apm = [];
    for (const file of files) {
      const owner = await isSessionPath(cwd, file) ? '_apm' : assistant.id;
      installedFiles[owner].push(file);
    }
    skipApm = true;
  }
  return installedFiles;
}
