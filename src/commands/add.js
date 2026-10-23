/**
 * Add Command Module
 *
 * Handles 'apm add' command for adding assistants to existing installation.
 *
 * @module src/commands/add
 */

import { CLI_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, getInstalledFiles, getAssistantNames } from '../core/metadata.js';
import { formatAssistant, formatAssistantList, assistantNamesFromManifest } from '../core/assistants.js';
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
  const names = { ...getAssistantNames(metadata), ...assistantNamesFromManifest(manifest) };
  const warnings = [];
  let assistantIds;
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      if (metadata.assistants.includes(arg)) {
        warnings.push({ level: 'warn', msg: `${formatAssistant(arg, names[arg])} is already installed, skipping.` });
        continue;
      }
      const found = uninstalled.find(a => a.id === arg);
      if (!found) {
        const available = formatAssistantList(uninstalled.map(a => a.id), names);
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
    const header = `Found ${logger.plural(uninstalled.length, 'uninstalled assistant')} in ${metadata.releaseVersion}`;
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
      warnings.push({ level: 'error', msg: `Bundle '${assistant.bundle}' for ${formatAssistant(id, assistant.name)} not found in release, skipping.` });
      continue;
    }

    const dlStop = logger.progress(`Downloading ${assistant.bundle}`);
    const writtenFiles = await downloadAndExtract(bundleAsset.browser_download_url, process.cwd(), { skipApm: true });
    dlStop();
    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    newAssistants.push(id);
    added.push(id);
  }

  // Update metadata
  metadata.assistants = newAssistants;
  metadata.assistantNames = { ...getAssistantNames(metadata), ...assistantNamesFromManifest(manifest, added) };
  metadata.installedFiles = installedFiles;
  metadata.cliVersion = CLI_VERSION;
  await writeMetadata(metadata);

  // Clear content for final output
  logger.clearAndBanner();
  for (const w of warnings) logger[w.level](w.msg);
  if (added.length) {
    logger.success(`Added ${formatAssistantList(added, names)} to installation.`);
  }
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (assistant?.postInstallNote) logger.info(assistant.postInstallNote);
  }
}

export default addCommand;
