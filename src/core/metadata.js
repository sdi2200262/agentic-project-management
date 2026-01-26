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
 * Checks if the workspace is initialized with APM.
 *
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<boolean>} True if initialized.
 */
export async function isInitialized(cwd = process.cwd()) {
  const metadata = await readMetadata(cwd);
  return metadata !== null;
}

/**
 * Checks if the installation is from the official source.
 *
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<boolean>} True if official source.
 */
export async function isOfficialSource(cwd = process.cwd()) {
  const metadata = await readMetadata(cwd);
  return metadata?.source === 'official';
}

/**
 * Gets the list of installed assistants.
 *
 * @param {string} [cwd=process.cwd()] - Working directory.
 * @returns {Promise<string[]>} Array of installed assistant IDs.
 */
export async function getInstalledAssistants(cwd = process.cwd()) {
  const metadata = await readMetadata(cwd);
  return metadata?.assistants || [];
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
 * @returns {Object} Metadata object.
 */
export function createMetadata({ source, repository, releaseVersion, assistants, cliVersion }) {
  const now = new Date().toISOString();
  return {
    source,
    repository,
    releaseVersion,
    cliVersion,
    assistants,
    installedAt: now,
    lastUpdated: now
  };
}

/**
 * Updates metadata with new installation info.
 *
 * @param {Object} existing - Existing metadata object.
 * @param {Object} updates - Updates to apply.
 * @returns {Object} Updated metadata object.
 */
export function updateMetadataFields(existing, updates) {
  return {
    ...existing,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
}

export default {
  readMetadata,
  writeMetadata,
  isInitialized,
  isOfficialSource,
  getInstalledAssistants,
  createMetadata,
  updateMetadataFields
};
