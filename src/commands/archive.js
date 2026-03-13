/**
 * Archive Command Module
 *
 * Handles 'apm archive' command for session archival and listing.
 *
 * @module src/commands/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { METADATA_FILE } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, getInstalledFiles } from '../core/metadata.js';
import { createArchive, listArchivesWithInfo } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the archive command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.list] - List archives instead of creating one.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @returns {Promise<void>}
 */
export async function archiveCommand(options = {}) {
  const { list, force = false } = options;

  logger.clearAndBanner();

  if (list) {
    return listMode();
  }

  return createMode(force);
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

  logger.info(`Archives (${archives.length}):`);
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
 * Creates an archive, cleans tracked files, and removes metadata.
 */
async function createMode(force) {
  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  // Confirm destructive action
  if (!force) {
    const proceed = await confirmDestructiveAction(
      [
        'Archive current APM session',
        'Remove all installed assistant files',
        'Delete installation metadata'
      ],
      'Archive and clean?'
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Create archive
  const archivePath = await createArchive(cwd, { reason: 'archive' });
  logger.info(`Archived to ${path.relative(cwd, archivePath)}`);

  // Clean tracked files
  const installedFiles = getInstalledFiles(metadata);
  const { removed, keptDirs } = await removeInstalledFiles(cwd, installedFiles);
  if (removed > 0) {
    logger.info(`Removed ${removed} tracked file(s)`);
  }
  for (const dir of keptDirs) {
    logger.info(`Kept ${dir}/ — contains non-APM files`);
  }

  // Delete metadata
  const metadataPath = path.join(cwd, METADATA_FILE);
  await fs.remove(metadataPath);

  logger.success('Session archived.');
  logger.info('Run "apm init" to reinitialize.');
}

export default archiveCommand;
