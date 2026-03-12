/**
 * Update Command Module
 *
 * Handles 'apm update' command for updating installed assistants.
 * Archives current state, cleans tracked files, re-extracts fresh.
 *
 * @module src/commands/update
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, createMetadata, getInstalledFiles } from '../core/metadata.js';
import { fetchOfficialReleases, fetchCustomReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset, parseVersion } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { createArchive } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction, selectRelease, confirmSecurityDisclaimer } from '../ui/prompts.js';
import { getRepoSettings } from '../core/config.js';
import logger from '../ui/logger.js';
import path from 'path';

/**
 * Executes the update command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @returns {Promise<void>}
 */
export async function updateCommand(options = {}) {
  const { force = false } = options;

  logger.clearAndBanner();

  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  logger.info(`Current: ${metadata.releaseVersion} from ${metadata.repository}`);
  logger.info(`Assistants: ${metadata.assistants.join(', ')}`);

  let release;

  if (metadata.source === 'official') {
    release = await findOfficialUpdate(metadata);
  } else {
    release = await findCustomUpdate(metadata);
  }

  if (!release) return;

  // Confirm destructive action
  if (!force) {
    const proceed = await confirmDestructiveAction(
      [
        'Archive current APM session',
        'Remove all installed assistant files',
        `Download and install ${release.tag_name}`
      ],
      `Update to ${release.tag_name}?`
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Fetch manifest
  logger.info('Fetching release manifest...');
  const manifest = await fetchReleaseManifest(release);

  // Archive current state
  logger.info('Archiving current session...');
  const archivePath = await createArchive(cwd, { reason: 'update' });
  logger.info(`Archived to ${path.relative(cwd, archivePath)}`);

  // Clean all tracked files
  const installedFiles = getInstalledFiles(metadata);
  const removed = await removeInstalledFiles(cwd, installedFiles);
  if (removed > 0) {
    logger.info(`Cleaned ${removed} tracked file(s)`);
  }

  // Download new bundles for all assistants
  const newInstalledFiles = {};
  let apmExtracted = false;
  const skippedAssistants = [];

  for (const assistantId of metadata.assistants) {
    const assistant = manifest.assistants.find(a => a.id === assistantId);
    if (!assistant) {
      logger.warn(`Assistant '${assistantId}' not found in ${release.tag_name}, dropping.`);
      skippedAssistants.push(assistantId);
      continue;
    }

    const bundleAsset = findBundleAsset(release, assistant.bundle);
    if (!bundleAsset) {
      logger.warn(`Bundle '${assistant.bundle}' not found, dropping.`);
      skippedAssistants.push(assistantId);
      continue;
    }

    logger.info(`Downloading ${assistant.bundle}...`);
    const writtenFiles = await downloadAndExtract(
      bundleAsset.browser_download_url,
      cwd,
      { skipApm: apmExtracted }
    );
    // Track only assistant files, not .apm/ infrastructure
    newInstalledFiles[assistantId] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    apmExtracted = true;
    logger.success(`Updated ${assistant.name}`);
  }

  // Write fresh metadata — only include assistants that were actually updated
  const updatedAssistants = Object.keys(newInstalledFiles);
  const newMetadata = createMetadata({
    source: metadata.source,
    repository: metadata.repository,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: updatedAssistants,
    installedFiles: newInstalledFiles
  });
  await writeMetadata(newMetadata, cwd);

  if (skippedAssistants.length > 0) {
    logger.warn(`Dropped ${skippedAssistants.length} assistant(s) not in ${release.tag_name}: ${skippedAssistants.join(', ')}`);
  }
  logger.success(`Updated to ${release.tag_name} (${updatedAssistants.length} assistant(s))!`);
}

/**
 * Finds an available official update.
 * Prefers stable over pre-release, but checks for newer pre-release
 * if currently on one and no stable update exists.
 */
async function findOfficialUpdate(metadata) {
  logger.info('Fetching releases from official repository...');
  const releases = await fetchOfficialReleases();

  if (!releases.length) {
    throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
  }

  const currentVersion = parseVersion(metadata.releaseVersion);

  // Check for stable update first
  const latest = getLatestRelease(releases);
  if (latest && latest.tag_name !== metadata.releaseVersion) {
    const latestVersion = parseVersion(latest.tag_name);
    if (isNewer(latestVersion, currentVersion)) {
      logger.info(`New version available: ${latest.tag_name}`);
      return latest;
    }
  }

  // If on a pre-release and no stable update, check for newer pre-release
  if (currentVersion?.prereleaseLabel) {
    const newerPrerelease = findNewerPrerelease(releases, currentVersion);
    if (newerPrerelease) {
      logger.info(`New pre-release available: ${newerPrerelease.tag_name}`);
      return newerPrerelease;
    }
  }

  // No updates available
  if (!latest) {
    logger.error(`No stable releases found for CLI v${CLI_MAJOR_VERSION}.x`);
    logger.blank();
    logger.info('Available pre-release versions:');
    for (const r of releases) {
      logger.info(`  ${r.tag_name}`, { indent: true });
    }
    logger.blank();
    logger.info('Use "apm init --tag <tag>" to install a specific pre-release.');
  } else {
    logger.success('Already on the latest version!');
  }

  return null;
}

/**
 * Finds an available custom update.
 * Lets user select from available releases.
 */
async function findCustomUpdate(metadata) {
  const repoSettings = await getRepoSettings(metadata.repository);
  if (!repoSettings?.skipDisclaimer) {
    const accepted = await confirmSecurityDisclaimer();
    if (!accepted) {
      logger.info('Aborted.');
      return null;
    }
  }

  logger.info(`Fetching releases from ${metadata.repository}...`);
  const releases = await fetchCustomReleases(metadata.repository);

  if (!releases.length) {
    throw CLIError.releaseNotFound(metadata.repository);
  }

  const selectedTag = await selectRelease(releases);
  if (selectedTag === metadata.releaseVersion) {
    logger.info('Selected the same version — no update needed.');
    return null;
  }

  return releases.find(r => r.tag_name === selectedTag);
}

/**
 * Finds a newer pre-release with the same label and base version.
 */
function findNewerPrerelease(releases, currentVersion) {
  let best = null;
  let bestNum = currentVersion.prereleaseNum ?? -1;

  for (const release of releases) {
    const v = parseVersion(release.tag_name);
    if (!v || !v.prereleaseLabel) continue;
    if (v.major !== currentVersion.major || v.minor !== currentVersion.minor || v.patch !== currentVersion.patch) continue;
    if (v.prereleaseLabel !== currentVersion.prereleaseLabel) continue;
    if (v.prereleaseNum != null && v.prereleaseNum > bestNum) {
      best = release;
      bestNum = v.prereleaseNum;
    }
  }

  return best;
}

/**
 * Checks if version a is newer than version b.
 * A stable release is newer than a pre-release at the same version.
 */
function isNewer(a, b) {
  if (!a || !b) return false;
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  if (a.patch !== b.patch) return a.patch > b.patch;
  // Same major.minor.patch: stable > pre-release
  if (b.prereleaseLabel && !a.prereleaseLabel) return true;
  return false;
}

export default updateCommand;
