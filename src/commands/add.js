/**
 * Add Command Module
 *
 * Handles 'apm add' command for adding assistants to existing installation.
 *
 * @module src/commands/add
 */

import { CLI_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, getInstalledFiles } from '../core/metadata.js';
import { fetchReleaseByTag, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the add command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string[]} [options.assistant] - Assistant ID(s) to add.
 * @returns {Promise<void>}
 */
export async function addCommand(options = {}) {
  const { assistant: assistantArgs } = options;

  logger.clearAndBanner();

  // Must be initialized
  const metadata = await readMetadata();
  if (!metadata) {
    throw CLIError.notInitialized();
  }

  logger.info(`Current: ${metadata.releaseVersion} (${metadata.assistants.join(', ')})`);

  // Fetch the same release
  logger.info('Fetching release manifest...');
  const release = await fetchReleaseByTag(metadata.repository, metadata.releaseVersion);
  const manifest = await fetchReleaseManifest(release);

  // Filter to uninstalled assistants
  const uninstalled = manifest.assistants.filter(a => !metadata.assistants.includes(a.id));

  if (!uninstalled.length) {
    logger.info('All available assistants are already installed.');
    return;
  }

  // Determine which assistants to add
  let assistantIds;
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      if (metadata.assistants.includes(arg)) {
        logger.warn(`Assistant '${arg}' is already installed, skipping.`);
        continue;
      }
      const found = uninstalled.find(a => a.id === arg);
      if (!found) {
        const available = uninstalled.map(a => a.id).join(', ');
        logger.error(`Assistant '${arg}' not found. Available: ${available}`);
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) {
      return;
    }
  } else {
    const selected = await selectAssistant(uninstalled);
    assistantIds = [selected];
  }

  // Download and install each assistant
  const installedFiles = getInstalledFiles(metadata);
  const newAssistants = [...metadata.assistants];

  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      logger.error(`Bundle '${assistant.bundle}' not found in release, skipping.`);
      continue;
    }

    logger.info(`Downloading ${assistant.bundle}...`);
    const writtenFiles = await downloadAndExtract(bundleAsset.browser_download_url, process.cwd(), { skipApm: true });
    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    newAssistants.push(id);
    logger.success(`Installed ${assistant.name}`);
  }

  // Update metadata
  metadata.assistants = newAssistants;
  metadata.installedFiles = installedFiles;
  metadata.cliVersion = CLI_VERSION;
  await writeMetadata(metadata);

  if (assistantIds.length === 1) {
    const name = manifest.assistants.find(a => a.id === assistantIds[0])?.name;
    logger.success(`Added ${name} to installation.`);
  } else {
    logger.success(`Added ${assistantIds.length} assistants to installation.`);
  }
}

export default addCommand;
