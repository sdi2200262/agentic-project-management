/**
 * Status Command Module
 *
 * Handles 'apm status' command for displaying installation state.
 *
 * @module src/commands/status
 */

import fs from 'fs-extra';
import path from 'path';
import { readMetadata, getInstalledFiles, getAssistantNames } from '../core/metadata.js';
import { formatAssistant } from '../core/assistants.js';
import { countArchives } from '../services/archive.js';
import logger from '../ui/logger.js';

/**
 * Most missing files listed per assistant before the rest are summarized.
 */
const MAX_MISSING_SHOWN = 10;

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
      logger.info(`${logger.plural(archiveCount, 'archived session')} found. Use "apm archive -l" to list.`);
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

  console.log(chalk.cyan.bold('Installation targets'));
  const installedFiles = getInstalledFiles(metadata);
  if (!metadata.assistants.length) {
    console.log('  none (run "apm add" to add one)');
  }
  const names = getAssistantNames(metadata);
  const incomplete = [];
  for (const id of metadata.assistants) {
    const files = Array.isArray(installedFiles[id]) ? installedFiles[id] : [];
    const missing = [];
    for (const file of files) {
      if (!(await fs.pathExists(path.join(cwd, file)))) missing.push(file);
    }
    if (missing.length) {
      incomplete.push(id);
      console.log(`  ${formatAssistant(id, names[id])}: ${files.length} files, ${chalk.yellow(`${missing.length} missing`)}`);
      for (const file of missing.slice(0, MAX_MISSING_SHOWN)) {
        console.log(chalk.yellow(`    - ${file}`));
      }
      if (missing.length > MAX_MISSING_SHOWN) {
        console.log(chalk.yellow(`    ... and ${missing.length - MAX_MISSING_SHOWN} more`));
      }
    } else {
      console.log(`  ${formatAssistant(id, names[id])}: ${files.length} files`);
    }
  }
  console.log('');

  if (incomplete.length) {
    const ids = incomplete.join(' ');
    logger.warn(`Some APM files are missing. To restore them, run "apm remove -a ${ids}", then "apm add -a ${ids}".`);
    console.log('');
  }

  const archiveCount = await countArchives(cwd);
  if (archiveCount > 0) {
    console.log(chalk.cyan.bold('Archives'));
    console.log(`  ${logger.plural(archiveCount, 'archived session')}. Use "apm archive -l" to list.`);
    console.log('');
  }
}

export default statusCommand;
