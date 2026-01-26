/**
 * Custom Command Module
 *
 * Handles 'apm custom' command for custom repository installation.
 *
 * @module src/commands/custom
 */

import { CLI_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, isInitialized, readMetadata } from '../core/metadata.js';
import { getCustomRepos, addCustomRepo, getRepoSettings, updateRepoSettings } from '../core/config.js';
import { fetchCustomReleases, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant, selectRelease, selectCustomRepo, inputRepository, confirmAction, confirmSecurityDisclaimer } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the custom command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.repo] - Repository in owner/repo format.
 * @param {string} [options.tag] - Specific release tag (requires --repo).
 * @param {string} [options.assistant] - Assistant ID to install.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @returns {Promise<void>}
 */
export async function customCommand(options = {}) {
  const { repo: repoArg, tag, assistant: assistantArg, force = false } = options;

  logger.clearAndBanner();

  // --tag requires --repo
  if (tag && !repoArg) {
    logger.error('--tag requires --repo to be specified');
    return;
  }

  // Check if already initialized
  if (!force && await isInitialized()) {
    logger.warn('APM is already initialized in this directory.');
    const proceed = await confirmAction('Re-initialize and overwrite existing installation?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Track if we had any interactive prompts
  let hadInteractivePrompt = false;

  // Determine repository
  let repoString;

  if (repoArg) {
    repoString = repoArg;
  } else {
    hadInteractivePrompt = true;
    const savedRepos = await getCustomRepos();

    if (savedRepos.length > 0) {
      const selected = await selectCustomRepo(savedRepos);
      repoString = selected || await inputRepository();
    } else {
      repoString = await inputRepository();
    }
  }

  // Check security disclaimer
  const repoSettings = await getRepoSettings(repoString);

  if (!repoSettings?.skipDisclaimer) {
    hadInteractivePrompt = true;
    const accepted = await confirmSecurityDisclaimer();

    if (!accepted) {
      logger.info('Aborted.');
      return;
    }
  }

  logger.info(`Fetching releases from ${repoString}...`);

  // Fetch all releases (no version filtering for custom repos)
  const releases = await fetchCustomReleases(repoString);

  if (!releases.length) {
    throw CLIError.releaseNotFound(repoString);
  }

  // Find target release
  let release;
  if (tag) {
    release = releases.find(r => r.tag_name === tag);
    if (!release) {
      throw CLIError.releaseNotFound(`${repoString} (tag: ${tag})`);
    }
    logger.info(`Using release: ${release.tag_name}`);
  } else {
    hadInteractivePrompt = true;
    const selectedTag = await selectRelease(releases);
    release = releases.find(r => r.tag_name === selectedTag);
    logger.info(`Using release: ${release.tag_name}`);
  }

  // Fetch and validate manifest
  logger.info('Fetching release manifest...');
  const manifest = await fetchReleaseManifest(release);
  logger.info(`Found ${manifest.assistants.length} assistant(s)`);

  // Select assistant
  let assistantId;
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
    logger.info(`Repository: ${repoString}`);
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
    source: 'custom',
    repository: repoString,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: allAssistantIds
  });
  await writeMetadata(metadata);

  logger.success(`APM initialized with ${allAssistantIds.length} assistant(s) from ${repoString}!`);

  // Offer to save repo
  if (!repoSettings) {
    const saveRepo = await confirmAction('Save this repository for future use?');

    if (saveRepo) {
      await addCustomRepo(repoString);

      const skipDisclaimer = await confirmAction('Skip security disclaimer for this repo in the future?');

      if (skipDisclaimer) {
        await updateRepoSettings(repoString, { skipDisclaimer: true });
      }

      logger.info('Repository saved.');
    }
  }
}

export default customCommand;
