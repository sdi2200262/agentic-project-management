/**
 * Archive Command Module
 *
 * Handles 'apm archive' command for session archival.
 *
 * @module src/commands/archive
 */

import { ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { isInitialized } from '../core/metadata.js';
import { generateArchiveName, validateContinues, listArchives, moveApmToArchive, restoreFreshTemplates } from '../services/archive.js';
import { selectArchive, confirmAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';
import path from 'path';

/**
 * Executes the archive command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.continues] - Previous archive name this session continues from.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @returns {Promise<void>}
 */
export async function archiveCommand(options = {}) {
  const { continues: continuesArg, force = false } = options;

  logger.clearAndBanner();

  // Check initialization
  if (!await isInitialized()) {
    throw CLIError.notInitialized();
  }

  const cwd = process.cwd();
  const archivesDir = path.join(cwd, ARCHIVES_DIR);

  // Generate archive name
  const archiveName = await generateArchiveName(archivesDir);
  logger.info(`Archive name: ${archiveName}`);

  // Handle --continues
  let continues = null;
  if (continuesArg) {
    const valid = await validateContinues(archivesDir, continuesArg);
    if (!valid) {
      throw CLIError.invalidContinues(continuesArg);
    }
    continues = continuesArg;
  } else if (!force) {
    // Interactive: offer to select a previous archive
    const archives = await listArchives(archivesDir);
    if (archives.length > 0) {
      continues = await selectArchive(archives);
    }
  }

  if (continues) {
    logger.info(`Continues from: ${continues}`);
  }

  // Confirm unless --force
  if (!force) {
    const proceed = await confirmAction('Archive current session and restore fresh templates?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Execute archival
  try {
    const archivePath = await moveApmToArchive(cwd, archiveName, continues);
    await restoreFreshTemplates(cwd);
    logger.success(`Session archived to ${path.relative(cwd, archivePath)}`);
    logger.info('Fresh templates restored. Ready for a new session.');
  } catch (err) {
    throw CLIError.archiveFailed(err.message);
  }
}

export default archiveCommand;
