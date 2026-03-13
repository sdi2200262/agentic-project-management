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

  return archives.sort((a, b) => a.name.localeCompare(b.name));
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
 * Creates an archive from current .apm/ artifacts.
 *
 * @param {string} cwd - Working directory.
 * @param {Object} [options={}] - Archive options.
 * @param {string} [options.name] - Custom archive name (auto-generated if omitted).
 * @param {string} [options.reason] - Reason for archival (e.g., 'update', 'archive').
 * @returns {Promise<string>} Absolute path to created archive.
 */
export async function createArchive(cwd, options = {}) {
  const apmDir = path.join(cwd, '.apm');
  const archivesDir = path.join(cwd, ARCHIVES_DIR);

  const archiveName = options.name || await generateArchiveName(archivesDir);
  const archivePath = path.join(archivesDir, archiveName);

  await fs.ensureDir(archivePath);

  // Move planning documents and memory
  const artifacts = ['plan.md', 'spec.md', 'tracker.md', 'session-summary.md', 'memory'];
  for (const artifact of artifacts) {
    const src = path.join(apmDir, artifact);
    if (await fs.pathExists(src)) {
      await fs.move(src, path.join(archivePath, artifact));
    }
  }

  // Copy metadata.json with archival info
  const metadataSrc = path.join(apmDir, 'metadata.json');
  if (await fs.pathExists(metadataSrc)) {
    const metadata = await fs.readJson(metadataSrc);
    metadata.archivedAt = new Date().toISOString();
    if (options.reason) {
      metadata.reason = options.reason;
    }
    await fs.writeJson(path.join(archivePath, 'metadata.json'), metadata, { spaces: 2 });
  }

  // Remove bus directory (ephemeral, not archived)
  const busDir = path.join(apmDir, 'bus');
  if (await fs.pathExists(busDir)) {
    await fs.remove(busDir);
  }

  return archivePath;
}

export default {
  generateArchiveName,
  listArchivesWithInfo,
  countArchives,
  createArchive
};
