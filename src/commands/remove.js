/**
 * Remove Command Module
 *
 * Handles 'apm remove' command for removing assistants from installation.
 *
 * @module src/commands/remove
 */

import { CLI_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, getInstalledFiles } from '../core/metadata.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { selectPrompt } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the remove command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string[]} [options.assistant] - Assistant ID(s) to remove.
 * @returns {Promise<void>}
 */
export async function removeCommand(options = {}) {
  const { assistant: assistantArgs } = options;

  logger.clearAndBanner();

  // Must be initialized
  const metadata = await readMetadata();
  if (!metadata) {
    throw CLIError.notInitialized();
  }

  if (!metadata.assistants.length) {
    logger.info('No assistants installed.');
    return;
  }

  logger.info(`Current: ${metadata.releaseVersion} (${metadata.assistants.join(', ')})`);

  // Determine which assistants to remove
  let assistantIds;
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      if (!metadata.assistants.includes(arg)) {
        logger.error(`Assistant '${arg}' is not installed. Installed: ${metadata.assistants.join(', ')}`);
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) {
      return;
    }
  } else {
    const choices = metadata.assistants.map(id => ({ name: id, value: id }));
    const selected = await selectPrompt({ message: 'Select assistant to remove:', choices });
    assistantIds = [selected];
  }

  // Warn if removing all
  if (assistantIds.length === metadata.assistants.length) {
    logger.warn('Removing all assistants. Consider "apm archive" to archive the entire session.');
  }

  // Clean tracked files for removed assistants
  const installedFiles = getInstalledFiles(metadata);
  const { removed, keptDirs } = await removeInstalledFiles(process.cwd(), installedFiles, assistantIds);
  if (removed > 0) {
    logger.info(`Removed ${removed} file(s)`);
  }
  for (const dir of keptDirs) {
    logger.info(`Kept ${dir}/ — contains non-APM files`);
  }

  // Update metadata
  const remaining = metadata.assistants.filter(id => !assistantIds.includes(id));
  const remainingFiles = { ...metadata.installedFiles };
  for (const id of assistantIds) {
    delete remainingFiles[id];
  }

  metadata.assistants = remaining;
  metadata.installedFiles = remainingFiles;
  metadata.cliVersion = CLI_VERSION;
  await writeMetadata(metadata);

  if (remaining.length === 0) {
    logger.success('All assistants removed.');
    logger.info('Run "apm archive" to archive, or "apm add" to add new assistants.');
  } else {
    const names = assistantIds.join(', ');
    logger.success(`Removed ${names}. ${remaining.length} assistant(s) remaining.`);
  }
}

export default removeCommand;
