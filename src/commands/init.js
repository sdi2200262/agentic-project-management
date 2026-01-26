/**
 * Init Command Module
 *
 * Handles 'apm init' command for official installation.
 *
 * @module src/commands/init
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, isInitialized, readMetadata } from '../core/metadata.js';
import { fetchOfficialReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant, confirmAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the init command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.tag] - Specific release tag to install.
 * @param {string} [options.assistant] - Assistant ID to install.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @returns {Promise<void>}
 */
export async function initCommand(options = {}) {
  const { tag, assistant: assistantArg, force = false } = options;

  logger.clearAndBanner();

  // Check if already initialized
  if (!force && await isInitialized()) {
    logger.warn('APM is already initialized in this directory.');
    const proceed = await confirmAction('Re-initialize and overwrite existing installation?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  logger.info('Fetching releases from official repository...');

  // Fetch and filter releases
  const releases = await fetchOfficialReleases();

  if (!releases.length) {
    throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
  }

  // Find target release
  let release;
  if (tag) {
    release = releases.find(r => r.tag_name === tag);
    if (!release) {
      throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo} (tag: ${tag})`);
    }
    logger.info(`Using release: ${release.tag_name}`);
  } else {
    release = getLatestRelease(releases);
    if (!release) {
      logger.error(`No stable releases found for CLI v${CLI_MAJOR_VERSION}.x`);
      const availableTags = releases.map(r => r.tag_name).slice(0, 5);
      logger.info(`Available pre-release versions: ${availableTags.join(', ')}`);
      logger.info('To install a pre-release, use: apm init --tag <tag>');
      return;
    }
    logger.info(`Latest release: ${release.tag_name}`);
  }

  // Fetch and validate manifest
  logger.info('Fetching release manifest...');
  const manifest = await fetchReleaseManifest(release);
  logger.info(`Found ${manifest.assistants.length} assistant(s)`);

  // Select assistant
  let assistantId;
  let hadInteractivePrompt = false;
  if (assistantArg) {
    const found = manifest.assistants.find(a => a.id === assistantArg);
    if (!found) {
      const available = manifest.assistants.map(a => a.id).join(', ');
      throw CLIError.releaseNotFound(`Assistant '${assistantArg}' not found. Available: ${available}`);
    }
    assistantId = assistantArg;
    logger.info(`Using assistant: ${found.name}`);
  } else {
    hadInteractivePrompt = true;
    assistantId = await selectAssistant(manifest.assistants);
  }
  const assistant = manifest.assistants.find(a => a.id === assistantId);

  // Find bundle asset for new assistant
  const bundleAsset = findBundleAsset(release, assistant.bundle);

  if (!bundleAsset) {
    throw CLIError.bundleNotFound(assistant.bundle, release.tag_name);
  }

  // Check for existing installation to update existing assistants
  const existingMetadata = await readMetadata();
  const existingAssistants = existingMetadata?.assistants || [];

  // Combine assistants (new + existing, avoiding duplicates)
  const allAssistantIds = [...new Set([assistantId, ...existingAssistants])];

  // Clear and show final progress (only if we had interactive prompts)
  if (hadInteractivePrompt) {
    logger.clearAndBanner();
    logger.info(`Release: ${release.tag_name}`);
    logger.info(`Assistant: ${assistant.name}`);
    if (existingAssistants.length > 0 && !existingAssistants.includes(assistantId)) {
      logger.info(`Updating existing: ${existingAssistants.join(', ')}`);
    }
    logger.blank();
  }

  // Download and update all assistants to the same release version
  let apmExtracted = await isInitialized();
  for (const aid of allAssistantIds) {
    const assistantInfo = manifest.assistants.find(a => a.id === aid);
    if (!assistantInfo) {
      logger.warn(`Assistant '${aid}' not found in release, skipping`);
      continue;
    }

    const asset = findBundleAsset(release, assistantInfo.bundle);
    if (!asset) {
      logger.warn(`Bundle '${assistantInfo.bundle}' not found in release, skipping`);
      continue;
    }

    const isNew = aid === assistantId;
    logger.info(`${isNew ? 'Downloading' : 'Updating'} ${assistantInfo.bundle}...`);
    await downloadAndExtract(asset.browser_download_url, process.cwd(), { skipApm: apmExtracted });
    apmExtracted = true; // After first extraction, skip .apm/ for subsequent ones
    logger.success(`${isNew ? 'Installed' : 'Updated'} ${assistantInfo.name}`);
  }

  // Write metadata with all assistants
  const metadata = createMetadata({
    source: 'official',
    repository: `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: allAssistantIds
  });
  await writeMetadata(metadata);

  logger.success(`APM initialized with ${allAssistantIds.length} assistant(s)!`);
  logger.info('Run "apm update" to check for updates.');
}

export default initCommand;
