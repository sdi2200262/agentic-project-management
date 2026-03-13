/**
 * Archive Service Module
 *
 * Core archival logic for session continuation.
 *
 * @module src/services/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { ARCHIVES_DIR } from '../core/constants.js';

/**
 * Generates the next archive directory name for today.
 * Format: session-YYYY-MM-DD-NNN (zero-padded daily counter).
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @returns {Promise<string>} Archive directory name.
 */
export async function generateArchiveName(archivesDir) {
  const today = new Date().toISOString().slice(0, 10);
  const prefix = `session-${today}-`;

  let maxCounter = 0;
  if (await fs.pathExists(archivesDir)) {
    const entries = await fs.readdir(archivesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith(prefix)) {
        const suffix = entry.name.slice(prefix.length);
        const num = parseInt(suffix, 10);
        if (!isNaN(num) && num > maxCounter) {
          maxCounter = num;
        }
      }
    }
  }

  const counter = String(maxCounter + 1).padStart(3, '0');
  return `${prefix}${counter}`;
}

/**
 * Lists archives with their metadata.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<Array<{name: string, metadata: Object}>>} Archives with metadata.
 */
export async function listArchivesWithInfo(cwd) {
  const archivesDir = path.join(cwd, ARCHIVES_DIR);

  if (!await fs.pathExists(archivesDir)) {
    return [];
  }

  const entries = await fs.readdir(archivesDir, { withFileTypes: true });
  const archives = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const metadataPath = path.join(archivesDir, entry.name, 'metadata.json');
      if (await fs.pathExists(metadataPath)) {
        try {
          const metadata = await fs.readJson(metadataPath);
          archives.push({ name: entry.name, metadata });
        } catch {
          // Skip archives with unreadable metadata
        }
      }
    }
  }

  return archives.sort((a, b) => {
    const dateA = a.metadata.archivedAt || '';
    const dateB = b.metadata.archivedAt || '';
    return dateA.localeCompare(dateB);
  });
}

/**
 * Counts valid archives.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<number>} Number of valid archives.
 */
export async function countArchives(cwd) {
  const archives = await listArchivesWithInfo(cwd);
  return archives.length;
}

/**
 * Creates an archive by snapshotting everything in .apm/ except archives/.
 * Copies all contents (template artifacts, runtime files, metadata) into
 * the archive directory, then cleans originals from .apm/.
 *
 * @param {string} cwd - Working directory.
 * @param {Object} [options={}] - Archive options.
 * @param {string} [options.name] - Custom archive name (auto-generated if omitted).
 * @param {string} [options.reason] - Reason for archival (e.g., 'update', 'archive').
 * @returns {Promise<{archivePath: string, runtimeEntries: string[]}>} Archive path and list of runtime entries not in _apm.
 */
export async function createArchive(cwd, options = {}) {
  const apmDir = path.join(cwd, '.apm');
  const archivesDir = path.join(cwd, ARCHIVES_DIR);

  const archiveName = options.name || await generateArchiveName(archivesDir);
  const archivePath = path.join(archivesDir, archiveName);

  await fs.ensureDir(archivePath);

  // Read metadata to determine which entries are tracked vs runtime-created
  const metadataSrc = path.join(apmDir, 'metadata.json');
  let metadata = {};
  if (await fs.pathExists(metadataSrc)) {
    metadata = await fs.readJson(metadataSrc);
  }

  // Build set of top-level .apm/ entries that came from the template
  const trackedTopLevel = new Set();
  const apmFiles = metadata.installedFiles?._apm || [];
  for (const file of apmFiles) {
    // e.g. ".apm/plan.md" → "plan.md", ".apm/memory/index.md" → "memory"
    const relative = file.replace(/^\.apm\//, '');
    const topLevel = relative.split(/[\\/]/)[0];
    trackedTopLevel.add(topLevel);
  }
  trackedTopLevel.add('metadata.json');

  // Copy everything in .apm/ except archives/ into the archive snapshot
  const entries = await fs.readdir(apmDir);
  const runtimeEntries = [];
  for (const entry of entries) {
    if (entry === 'archives') continue;
    const src = path.join(apmDir, entry);
    const dest = path.join(archivePath, entry);
    await fs.copy(src, dest);
    if (!trackedTopLevel.has(entry)) {
      runtimeEntries.push(entry);
    }
  }

  // Stamp archival info on the archived metadata copy
  const archivedMetaPath = path.join(archivePath, 'metadata.json');
  if (await fs.pathExists(archivedMetaPath)) {
    metadata.archivedAt = new Date().toISOString();
    if (options.reason) {
      metadata.reason = options.reason;
    }
    await fs.writeJson(archivedMetaPath, metadata, { spaces: 2 });
  }

  // Clean originals from .apm/ (keep archives/ and metadata.json)
  for (const entry of entries) {
    if (entry === 'archives' || entry === 'metadata.json') continue;
    await fs.remove(path.join(apmDir, entry));
  }

  return { archivePath, runtimeEntries };
}

/**
 * Removes a single archive by name.
 *
 * @param {string} cwd - Working directory.
 * @param {string} name - Archive directory name.
 * @returns {Promise<boolean>} Whether the archive was found and removed.
 */
export async function removeArchive(cwd, name) {
  const archivePath = path.join(cwd, ARCHIVES_DIR, name);
  if (await fs.pathExists(archivePath)) {
    await fs.remove(archivePath);
    return true;
  }
  return false;
}

/**
 * Removes all archives.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<number>} Number of archives removed.
 */
export async function clearArchives(cwd) {
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  if (!await fs.pathExists(archivesDir)) return 0;

  const entries = await fs.readdir(archivesDir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await fs.remove(path.join(archivesDir, entry.name));
      count++;
    }
  }
  return count;
}

export default {
  generateArchiveName,
  listArchivesWithInfo,
  countArchives,
  createArchive,
  removeArchive,
  clearArchives
};
