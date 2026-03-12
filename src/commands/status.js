/**
 * Status Command Module
 *
 * Handles 'apm status' command for displaying installation state.
 *
 * @module src/commands/status
 */

import { readMetadata, getInstalledFiles } from '../core/metadata.js';
import { countArchives } from '../services/archive.js';
import logger from '../ui/logger.js';

/**
 * Executes the status command.
 *
 * @returns {Promise<void>}
 */
export async function statusCommand() {
  logger.clearAndBanner();

  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    logger.info('Not initialized.');
    const archiveCount = await countArchives(cwd);
    if (archiveCount > 0) {
      logger.info(`${archiveCount} archived session(s) found. Use "apm archive -l" to list.`);
    } else {
      logger.info('Run "apm init" to get started.');
    }
    return;
  }

  // Display installation state
  const chalk = logger.chalk;

  console.log(chalk.cyan.bold('Installation'));
  console.log(`  Source:      ${metadata.source}`);
  console.log(`  Repository:  ${metadata.repository}`);
  console.log(`  Version:     ${metadata.releaseVersion}`);
  console.log(`  CLI:         ${metadata.cliVersion}`);
  console.log(`  Installed:   ${metadata.installedAt}`);
  console.log('');

  console.log(chalk.cyan.bold('Assistants'));
  const installedFiles = getInstalledFiles(metadata);
  for (const id of metadata.assistants) {
    const files = installedFiles[id];
    const fileCount = Array.isArray(files) ? files.length : 0;
    console.log(`  ${id} (${fileCount} files)`);
  }
  console.log('');

  const archiveCount = await countArchives(cwd);
  if (archiveCount > 0) {
    console.log(chalk.cyan.bold('Archives'));
    console.log(`  ${archiveCount} archived session(s). Use "apm archive -l" to list.`);
    console.log('');
  }
}

export default statusCommand;
