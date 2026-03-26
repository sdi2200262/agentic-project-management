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
import { getRepoSettings } from '../core/config.js';
import { fetchReleaseByTag, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant, confirmSecurityDisclaimer } from '../ui/prompts.js';
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

  // Security disclaimer for custom installations
  if (metadata.source === 'custom') {
    const repoSettings = await getRepoSettings(metadata.repository);
    if (!repoSettings?.skipDisclaimer) {
      const accepted = await confirmSecurityDisclaimer();
      if (!accepted) {
        logger.info('Aborted.');
        return;
      }
    }
  }

  // Fetch the same release
  const stop = logger.progress('Fetching release manifest');
  const release = await fetchReleaseByTag(metadata.repository, metadata.releaseVersion);
  const manifest = await fetchReleaseManifest(release);
  stop();

  // Filter to uninstalled assistants
  const uninstalled = manifest.assistants.filter(a => !metadata.assistants.includes(a.id));

  if (!uninstalled.length) {
    logger.info('All available assistants are already installed.');
    return;
  }

  // Determine which assistants to add
  const warnings = [];
  let assistantIds;
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      if (metadata.assistants.includes(arg)) {
        warnings.push({ level: 'warn', msg: `Assistant '${arg}' is already installed, skipping.` });
        continue;
      }
      const found = uninstalled.find(a => a.id === arg);
      if (!found) {
        const available = uninstalled.map(a => a.id).join(', ');
        warnings.push({ level: 'error', msg: `Assistant '${arg}' not found. Available: ${available}` });
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) {
      logger.clearAndBanner();
      for (const w of warnings) logger[w.level](w.msg);
      return;
    }
  } else {
    const header = `Found ${uninstalled.length} uninstalled assistant(s) in ${metadata.releaseVersion}`;
    const selected = await selectAssistant(uninstalled, { header });
    assistantIds = [selected];
  }

  // Download and install each assistant
  const installedFiles = getInstalledFiles(metadata);
  const newAssistants = [...metadata.assistants];
  const added = [];

  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      warnings.push({ level: 'error', msg: `Bundle '${assistant.bundle}' not found in release, skipping.` });
      continue;
    }

    const dlStop = logger.progress(`Downloading ${assistant.bundle}`);
    const writtenFiles = await downloadAndExtract(bundleAsset.browser_download_url, process.cwd(), { skipApm: true });
    dlStop();
    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    newAssistants.push(id);
    added.push(assistant.name);
  }

  // Update metadata
  metadata.assistants = newAssistants;
  metadata.installedFiles = installedFiles;
  metadata.cliVersion = CLI_VERSION;
  await writeMetadata(metadata);

  // Clear content for final output
  logger.clearAndBanner();
  for (const w of warnings) logger[w.level](w.msg);
  if (added.length === 1) {
    logger.success(`Added ${added[0]} to installation.`);
  } else if (added.length > 1) {
    logger.success(`Added ${added.length} assistants to installation.`);
  }
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (assistant?.postInstallNote) logger.warn(assistant.postInstallNote);
  }
}

export default addCommand;
