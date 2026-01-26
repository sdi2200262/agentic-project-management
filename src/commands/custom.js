/**
 * Custom Command Module
 *
 * Handles 'apm custom' command for custom repository installation.
 *
 * @module src/commands/custom
 */

import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, isInitialized } from '../core/metadata.js';
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

  logger.banner();

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

  // Determine repository
  let repoString;

  if (repoArg) {
    repoString = repoArg;
  } else {
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
    const selectedTag = await selectRelease(releases);
    release = releases.find(r => r.tag_name === selectedTag);
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
    assistantId = await selectAssistant(manifest.assistants);
  }
  const assistant = manifest.assistants.find(a => a.id === assistantId);

  // Find bundle asset
  const bundleAsset = findBundleAsset(release, assistant.bundle);

  if (!bundleAsset) {
    throw CLIError.bundleNotFound(assistant.bundle, release.tag_name);
  }

  // Download and extract (skip .apm/ if it already exists)
  logger.info(`Downloading ${assistant.bundle}...`);
  const apmExists = await isInitialized();
  await downloadAndExtract(bundleAsset.browser_download_url, process.cwd(), { skipApm: apmExists });
  logger.success(`Extracted to current directory`);

  // Write metadata
  const metadata = createMetadata({
    source: 'custom',
    repository: repoString,
    releaseVersion: release.tag_name,
    assistants: [assistantId]
  });
  await writeMetadata(metadata);

  logger.success(`APM initialized with ${assistant.name} from ${repoString}!`);

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
