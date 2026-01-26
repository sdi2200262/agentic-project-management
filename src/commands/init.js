/**
 * Init Command Module
 *
 * Handles 'apm init' command for official installation.
 *
 * @module src/commands/init
 */

import { OFFICIAL_REPO } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, isInitialized } from '../core/metadata.js';
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
    logger.info(`Latest release: ${release.tag_name}`);
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
    source: 'official',
    repository: `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`,
    releaseVersion: release.tag_name,
    assistants: [assistantId]
  });
  await writeMetadata(metadata);

  logger.success(`APM initialized with ${assistant.name}!`);
  logger.info('Run "apm update" to check for updates.');
}

export default initCommand;
