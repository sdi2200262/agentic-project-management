/**
 * Workspace Metadata Module
 *
 * Manages .apm/metadata.json for tracking installation state.
 *
 * @module src/core/metadata
 */

import fs from 'fs-extra';
import path from 'path';
import { METADATA_FILE } from './constants.js';

/**
 * Reads the workspace metadata file.
 *
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<Object|null>} Metadata object or null if not found.
 */
export async function readMetadata(cwd = process.cwd()) {
  const metadataPath = path.join(cwd, METADATA_FILE);

  try {
    if (!(await fs.lstat(path.dirname(metadataPath))).isDirectory()) {
      throw new Error('Expected .apm to be a directory in the workspace');
    }
    if (!(await fs.lstat(metadataPath)).isFile()) {
      throw new Error('Expected a regular metadata file');
    }
    const metadata = await fs.readJson(metadataPath);
    if (!Array.isArray(metadata?.assistants) || !metadata.assistants.every(id => typeof id === 'string')
      || !['source', 'repository', 'releaseVersion'].every(key => typeof metadata[key] === 'string' && metadata[key])) {
      throw new Error('Missing or invalid installation fields');
    }
    // Older installations may predate installedFiles.
    const files = metadata.installedFiles;
    if (files !== undefined && (!files || typeof files !== 'object' || Array.isArray(files)
      || !Object.values(files).every(list => Array.isArray(list) && list.every(file => typeof file === 'string')))) {
      throw new Error('Invalid installedFiles list');
    }
    return metadata;
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new Error(`Cannot read installation metadata at ${metadataPath}: ${err.message}`, { cause: err });
  }
}

/**
 * Writes the workspace metadata file.
 *
 * @param {Object} metadata - Metadata object to write.
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<void>}
 */
export async function writeMetadata(metadata, cwd = process.cwd()) {
  const metadataPath = path.join(cwd, METADATA_FILE);
  await fs.ensureDir(path.dirname(metadataPath));
  await fs.writeJson(metadataPath, metadata, { spaces: 2 });
}

/**
 * Gets the installed files map from metadata.
 *
 * @param {Object} metadata - Metadata object.
 * @returns {Object} Map of assistantId to file paths.
 */
export function getInstalledFiles(metadata) {
  return metadata?.installedFiles || {};
}

/**
 * Gets the assistant display names recorded in metadata.
 * Metadata written before CLI 1.0.3 has none; callers then fall back to known names.
 *
 * @param {Object} metadata - Metadata object.
 * @returns {Object} Map of assistantId to display name.
 */
export function getAssistantNames(metadata) {
  return metadata?.assistantNames || {};
}

/**
 * Creates initial metadata for a new installation.
 *
 * @param {Object} options - Installation options.
 * @param {string} options.source - 'official' or 'custom'.
 * @param {string} options.repository - Repository in owner/repo format.
 * @param {string} options.releaseVersion - Release tag.
 * @param {string[]} options.assistants - Array of assistant IDs.
 * @param {string} options.cliVersion - CLI version that performed the installation.
 * @param {Object} [options.installedFiles={}] - Map of assistantId to file paths.
 * @param {Object} [options.assistantNames={}] - Map of assistantId to display name.
 * @returns {Object} Metadata object.
 */
export function createMetadata({ source, repository, releaseVersion, assistants, cliVersion, installedFiles = {}, assistantNames = {} }) {
  return {
    source,
    repository,
    releaseVersion,
    cliVersion,
    assistants,
    assistantNames,
    installedFiles,
    installedAt: new Date().toISOString()
  };
}

export default {
  readMetadata,
  writeMetadata,
  getInstalledFiles,
  getAssistantNames,
  createMetadata
};
