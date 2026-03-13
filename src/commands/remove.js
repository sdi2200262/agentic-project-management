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
import { selectPrompt, confirmDestructiveAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the remove command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string[]} [options.assistant] - Assistant ID(s) to remove.
 * @returns {Promise<void>}
 */
export async function removeCommand(options = {}) {
  const { assistant: assistantArgs, force = false } = options;

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

  // Determine which assistants to remove
  let assistantIds;
  let skipped = [];
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      if (!metadata.assistants.includes(arg)) {
        skipped.push(arg);
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) {
      logger.error(`None of the specified assistants are installed. Installed: ${metadata.assistants.join(', ')}`);
      return;
    }
  } else {
    const choices = metadata.assistants.map(id => ({ name: id, value: id }));
    const header = `Found ${metadata.assistants.length} assistant(s) installed from ${metadata.releaseVersion}`;
    const selected = await selectPrompt({ message: 'Select assistant to remove:', choices, header });
    assistantIds = [selected];
  }

  // Confirm destructive action
  if (!force) {
    const actions = [`Remove APM-installed files for: ${assistantIds.join(', ')}`];
    if (skipped?.length) {
      actions.push(`Skip: ${skipped.join(', ')} (not installed)`);
    }
    if (assistantIds.length === metadata.assistants.length) {
      actions.push('This removes all assistants — .apm/ project artifacts will remain');
    }
    const proceed = await confirmDestructiveAction(actions, 'Remove?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Clean tracked files for removed assistants
  const installedFiles = getInstalledFiles(metadata);
  await removeInstalledFiles(process.cwd(), installedFiles, assistantIds);

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

  // Clear content for final output
  logger.clearAndBanner();
  if (remaining.length === 0) {
    logger.success('All assistants removed.');
    logger.info('Run "apm archive" to archive, or "apm add" to add new assistants.');
  } else {
    const names = assistantIds.join(', ');
    logger.success(`Removed ${names}. ${remaining.length} assistant(s) remaining.`);
  }
}

export default removeCommand;
