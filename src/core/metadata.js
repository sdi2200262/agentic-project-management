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
import logger from '../ui/logger.js';

/**
 * Reads the workspace metadata file.
 *
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<Object|null>} Metadata object or null if not found.
 */
export async function readMetadata(cwd = process.cwd()) {
  const metadataPath = path.join(cwd, METADATA_FILE);

  try {
    if (await fs.pathExists(metadataPath)) {
      return await fs.readJson(metadataPath);
    }
  } catch (err) {
    logger.debug(`Failed to read metadata: ${err.message}`);
  }

  return null;
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
 * Creates initial metadata for a new installation.
 *
 * @param {Object} options - Installation options.
 * @param {string} options.source - 'official' or 'custom'.
 * @param {string} options.repository - Repository in owner/repo format.
 * @param {string} options.releaseVersion - Release tag.
 * @param {string[]} options.assistants - Array of assistant IDs.
 * @param {string} options.cliVersion - CLI version that performed the installation.
 * @param {Object} [options.installedFiles={}] - Map of assistantId to file paths.
 * @returns {Object} Metadata object.
 */
export function createMetadata({ source, repository, releaseVersion, assistants, cliVersion, installedFiles = {} }) {
  return {
    source,
    repository,
    releaseVersion,
    cliVersion,
    assistants,
    installedFiles,
    installedAt: new Date().toISOString()
  };
}

export default {
  readMetadata,
  writeMetadata,
  getInstalledFiles,
  createMetadata
};
