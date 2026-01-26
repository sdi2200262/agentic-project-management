/**
 * Update Command Module
 *
 * Handles 'apm update' command for updating installed assistants.
 *
 * @module src/commands/update
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, updateMetadataFields } from '../core/metadata.js';
import { getRepoSettings } from '../core/config.js';
import { fetchOfficialReleases, fetchCustomReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectUpdateSource, selectRelease, confirmAction, confirmSecurityDisclaimer } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the update command.
 *
 * @param {Object} [options={}] - Command options.
 * @returns {Promise<void>}
 */
export async function updateCommand(options = {}) {
  logger.clearAndBanner();

  // Read existing metadata
  const metadata = await readMetadata();

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  logger.info(`Current installation: ${metadata.releaseVersion} from ${metadata.repository}`);
  logger.info(`Installed assistant(s): ${metadata.assistants.join(', ')}`);

  let release;
  let repoString;
  let newSource = metadata.source; // Preserve source type by default

  if (metadata.source === 'official') {
    // Official installation: fetch latest v1.x
    logger.info('Fetching releases from official repository...');

    const releases = await fetchOfficialReleases();

    if (!releases.length) {
      throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
    }

    release = getLatestRelease(releases);
    repoString = `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`;

    if (!release) {
      logger.error(`No stable releases found for CLI v${CLI_MAJOR_VERSION}.x`);
      const availableTags = releases.map(r => r.tag_name).slice(0, 5);
      logger.info(`Available pre-release versions: ${availableTags.join(', ')}`);
      logger.info('Use "apm init --tag <tag>" to install a specific pre-release.');
      return;
    }

    if (release.tag_name === metadata.releaseVersion) {
      logger.success('Already on the latest version!');
      return;
    }

    logger.info(`New version available: ${release.tag_name}`);
  } else {
    // Custom installation: prompt for update source
    const source = await selectUpdateSource();

    if (source === 'official') {
      // Switch to official
      newSource = 'official';
      logger.info('Fetching releases from official repository...');

      const releases = await fetchOfficialReleases();

      if (!releases.length) {
        throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
      }

      release = getLatestRelease(releases);
      repoString = `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`;

      if (!release) {
        logger.error(`No stable releases found for CLI v${CLI_MAJOR_VERSION}.x`);
        const availableTags = releases.map(r => r.tag_name).slice(0, 5);
        logger.info(`Available pre-release versions: ${availableTags.join(', ')}`);
        logger.info('Use "apm init --tag <tag>" to install a specific pre-release.');
        return;
      }
    } else {
      // Update from custom repo - keep source as 'custom'
      newSource = 'custom';

      // Check security disclaimer for custom repo
      const repoSettings = await getRepoSettings(metadata.repository);

      if (!repoSettings?.skipDisclaimer) {
        const accepted = await confirmSecurityDisclaimer();

        if (!accepted) {
          logger.info('Aborted.');
          return;
        }
      }

      logger.info(`Fetching releases from ${metadata.repository}...`);

      const releases = await fetchCustomReleases(metadata.repository);

      if (!releases.length) {
        throw CLIError.releaseNotFound(metadata.repository);
      }

      // Let user select release
      const selectedTag = await selectRelease(releases);
      release = releases.find(r => r.tag_name === selectedTag);
      repoString = metadata.repository;
    }
  }

  // Confirm update
  const proceed = await confirmAction(`Update to ${release.tag_name}?`, true);

  if (!proceed) {
    logger.info('Aborted.');
    return;
  }

  // Fetch manifest
  logger.info('Fetching release manifest...');
  const manifest = await fetchReleaseManifest(release);

  // Update each installed assistant
  for (const assistantId of metadata.assistants) {
    const assistant = manifest.assistants.find(a => a.id === assistantId);

    if (!assistant) {
      logger.warn(`Assistant '${assistantId}' not found in new release, skipping`);
      continue;
    }

    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      logger.warn(`Bundle '${assistant.bundle}' not found in release, skipping`);
      continue;
    }

    logger.info(`Updating ${assistant.name}...`);
    await downloadAndExtract(bundleAsset.browser_download_url, process.cwd(), { skipApm: true });
    logger.success(`Updated ${assistant.name}`);
  }

  // Update metadata
  const updatedMetadata = updateMetadataFields(metadata, {
    source: newSource,
    repository: repoString,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION
  });
  await writeMetadata(updatedMetadata);

  logger.success(`Updated to ${release.tag_name}!`);
}

export default updateCommand;
