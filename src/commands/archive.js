/**
 * Archive Command Module
 *
 * Handles 'apm archive' command for session archival, listing, and management.
 *
 * @module src/commands/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { METADATA_FILE, ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, getInstalledFiles } from '../core/metadata.js';
import { createArchive, listArchivesWithInfo, removeArchive, clearArchives, generateArchiveName } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the archive command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.list] - List archives instead of creating one.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @param {string} [options.name] - Custom archive name.
 * @param {string} [options.remove] - Archive name to remove.
 * @param {boolean} [options.clear] - Clear all archives.
 * @returns {Promise<void>}
 */
export async function archiveCommand(options = {}) {
  const { list, force = false, name, delete: deleteArchive, clear } = options;

  logger.clearAndBanner();

  if (list) return listMode();
  if (deleteArchive) return deleteMode(deleteArchive, force);
  if (clear) return clearMode(force);

  return createMode(force, name);
}

/**
 * Lists archives with metadata.
 */
async function listMode() {
  const cwd = process.cwd();
  const archives = await listArchivesWithInfo(cwd);

  if (!archives.length) {
    logger.info('No archives found.');
    return;
  }

  logger.info(`Archives (${archives.length}), oldest first:`);
  logger.blank();

  const chalk = logger.chalk;

  for (const { name, metadata } of archives) {
    console.log(chalk.bold(name));
    console.log(`  Version:     ${metadata.releaseVersion || 'unknown'}`);
    console.log(`  Assistants:  ${(metadata.assistants || []).join(', ') || 'unknown'}`);
    console.log(`  Archived:    ${metadata.archivedAt || 'unknown'}`);
    if (metadata.reason) {
      console.log(`  Reason:      ${metadata.reason}`);
    }
    console.log('');
  }
}

/**
 * Removes a single archive.
 */
async function deleteMode(name, force) {
  const cwd = process.cwd();
  const archivePath = path.join(cwd, ARCHIVES_DIR, name);

  if (!await fs.pathExists(archivePath)) {
    logger.error(`Archive "${name}" not found.`);
    return;
  }

  if (!force) {
    const proceed = await confirmDestructiveAction(
      [`Delete archive "${name}" permanently`],
      'Delete?'
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  await removeArchive(cwd, name);
  logger.clearAndBanner();
  logger.success(`Deleted archive: ${name}`);
}

/**
 * Clears all archives.
 */
async function clearMode(force) {
  const cwd = process.cwd();
  const archives = await listArchivesWithInfo(cwd);

  if (!archives.length) {
    logger.info('No archives to clear.');
    return;
  }

  if (!force) {
    const actions = archives.map(a => {
      const date = a.metadata.archivedAt ? new Date(a.metadata.archivedAt).toLocaleString() : 'unknown';
      return `Delete ${a.name} (archived ${date})`;
    });
    const proceed = await confirmDestructiveAction(actions, `Delete all ${archives.length} archives?`);
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  const count = await clearArchives(cwd);
  logger.clearAndBanner();
  logger.success(`Deleted ${count} archive(s).`);
}

/**
 * Creates an archive, cleans tracked files, and removes metadata.
 */
async function createMode(force, archiveName) {
  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  // Determine archive name ahead of time for the confirmation message
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const resolvedName = archiveName || await generateArchiveName(archivesDir);
  const archiveOpts = { reason: 'archive', name: resolvedName };

  // Confirm destructive action
  if (!force) {
    const assistantList = metadata.assistants.join(', ');
    const proceed = await confirmDestructiveAction(
      [
        `Snapshot all .apm/ artifacts into .apm/archives/${resolvedName}`,
        `Delete all APM-installed files for: ${assistantList}`
      ],
      'Archive and clean?'
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }
  const { archivePath } = await createArchive(cwd, archiveOpts);

  // Clean tracked files
  const installedFiles = getInstalledFiles(metadata);
  await removeInstalledFiles(cwd, installedFiles);

  // Delete metadata
  const metadataPath = path.join(cwd, METADATA_FILE);
  await fs.remove(metadataPath);

  // Clear content for final output
  logger.clearAndBanner();
  logger.success(`Archived to ${path.relative(cwd, archivePath)}`);
  logger.info('Run "apm init" to reinitialize.');
}

export default archiveCommand;
