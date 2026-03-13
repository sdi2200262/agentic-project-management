/**
 * Update Command Module
 *
 * Handles 'apm update' command for updating installed assistants.
 * Archives current state, cleans tracked files, re-extracts fresh.
 *
 * @module src/commands/update
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION, ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, createMetadata, getInstalledFiles } from '../core/metadata.js';
import { fetchOfficialReleases, fetchCustomReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset, parseVersion, isStableRelease } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { createArchive, generateArchiveName } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction, confirmAction, selectRelease, selectPrompt, confirmSecurityDisclaimer } from '../ui/prompts.js';
import { getRepoSettings, addCustomRepo, updateRepoSettings } from '../core/config.js';
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
  const { force = false, name: archiveName } = options;

  logger.clearAndBanner();

  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  let release;

  if (metadata.source === 'official') {
    release = await findOfficialUpdate(metadata);
  } else {
    release = await findCustomUpdate(metadata);
  }

  if (!release) return;

  // Fetch manifest early to validate assistants before confirmation
  let stop = logger.progress('Fetching release manifest');
  const manifest = await fetchReleaseManifest(release);
  stop();

  // Check if any current assistants exist in the target release
  const survivingAssistants = metadata.assistants.filter(id =>
    manifest.assistants.some(a => a.id === id)
  );
  if (!survivingAssistants.length) {
    const available = manifest.assistants.map(a => a.id).join(', ');
    logger.error(`None of your assistants (${metadata.assistants.join(', ')}) are available in ${release.tag_name}.`);
    logger.info(`Available in ${release.tag_name}: ${available}`);
    logger.info('Use "apm archive" then "apm init" to install with different assistants.');
    return;
  }

  // Pre-compute archive name for confirmation message
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const resolvedName = archiveName || await generateArchiveName(archivesDir);

  // Confirm destructive action
  if (!force) {
    const currentList = metadata.assistants.join(', ');
    const survivingList = survivingAssistants.join(', ');
    const droppedAssistants = metadata.assistants.filter(id => !survivingAssistants.includes(id));

    const bullets = [
      `Snapshot all .apm/ artifacts into .apm/archives/${resolvedName}`,
      `Delete all APM-installed files for: ${currentList}`,
      `Download and install ${release.tag_name} for: ${survivingList}`
    ];
    if (droppedAssistants.length > 0) {
      bullets.push(`Drop unsupported assistant(s): ${droppedAssistants.join(', ')}`);
    }

    const proceed = await confirmDestructiveAction(
      bullets,
      `Update to ${release.tag_name}?`
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Archive current state
  let archiveStop = logger.progress('Archiving current session');
  const { archivePath } = await createArchive(cwd, { reason: 'update', name: resolvedName });
  archiveStop();

  // Clean all tracked files
  const installedFiles = getInstalledFiles(metadata);
  const { removed, keptDirs } = await removeInstalledFiles(cwd, installedFiles);

  // Download new bundles for all assistants
  const newInstalledFiles = {};
  let apmExtracted = false;
  const skippedAssistants = [];

  for (const assistantId of metadata.assistants) {
    const assistant = manifest.assistants.find(a => a.id === assistantId);
    if (!assistant) {
      skippedAssistants.push(assistantId);
      continue;
    }

    const bundleAsset = findBundleAsset(release, assistant.bundle);
    if (!bundleAsset) {
      skippedAssistants.push(assistantId);
      continue;
    }

    stop = logger.progress(`Downloading ${assistant.bundle}`);
    const writtenFiles = await downloadAndExtract(
      bundleAsset.browser_download_url,
      cwd,
      { skipApm: apmExtracted }
    );
    stop();
    newInstalledFiles[assistantId] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    if (!apmExtracted) {
      newInstalledFiles._apm = writtenFiles.filter(f => f.startsWith('.apm/') && !f.startsWith('.apm/archives/'));
    }
    apmExtracted = true;
  }

  // Compute surviving assistant list
  const updatedAssistants = metadata.assistants.filter(id => !skippedAssistants.includes(id));

  // Write fresh metadata
  const newMetadata = createMetadata({
    source: metadata.source,
    repository: metadata.repository,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: updatedAssistants,
    installedFiles: newInstalledFiles
  });
  await writeMetadata(newMetadata, cwd);

  // Offer to save custom repo if not already saved
  if (metadata.source === 'custom') {
    const repoSettings = await getRepoSettings(metadata.repository);
    if (!repoSettings) {
      const saveRepo = await confirmAction('Save this repository for future use?', {
        header: `Updated to ${release.tag_name} — repository ${metadata.repository} is not in your saved list`
      });
      if (saveRepo) {
        await addCustomRepo(metadata.repository);
        const skipDisclaimer = await confirmAction('Skip security disclaimer for this repo in the future?', {
          header: `Saved repositories can skip the security disclaimer on future use`
        });
        if (skipDisclaimer) {
          await updateRepoSettings(metadata.repository, { skipDisclaimer: true });
        }
      }
    }
  }

  // Clear content for final output
  logger.clearAndBanner();
  if (skippedAssistants.length > 0) {
    logger.warn(`Dropped ${skippedAssistants.length} assistant(s) not in ${release.tag_name}: ${skippedAssistants.join(', ')}`);
  }
  for (const id of updatedAssistants) {
    logger.success(`Updated ${manifest.assistants.find(a => a.id === id)?.name || id}`);
  }
  logger.success(`Updated to ${release.tag_name} (${updatedAssistants.length} assistant(s))!`);
}

/**
 * Finds an available official update.
 * Prefers stable over pre-release, but checks for newer pre-release
 * if currently on one and no stable update exists.
 */
async function findOfficialUpdate(metadata) {
  const stop = logger.progress('Fetching releases');
  const releases = await fetchOfficialReleases();
  stop();

  if (!releases.length) {
    throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
  }

  const currentRelease = releases.find(r => r.tag_name === metadata.releaseVersion);
  const currentDate = currentRelease?.published_at || currentRelease?.created_at || '';
  const currentVersion = parseVersion(metadata.releaseVersion);
  const latest = getLatestRelease(releases);

  const onPrerelease = !!currentVersion?.prereleaseLabel;

  // Check for stable update
  const newerStable = (latest && latest.tag_name !== metadata.releaseVersion &&
    (latest.published_at || latest.created_at || '') > currentDate) ? latest : null;

  // If on a pre-release, prompt before switching to anything
  if (onPrerelease) {
    const newerPrereleases = releases
      .filter(r => !isStableRelease(r) && r.tag_name !== metadata.releaseVersion)
      .filter(r => (r.published_at || r.created_at || '') > currentDate);

    const newestPrerelease = newerPrereleases.length
      ? newerPrereleases.reduce((a, b) =>
          (b.published_at || b.created_at || '') > (a.published_at || a.created_at || '') ? b : a
        )
      : null;

    // Nothing available
    if (!newerStable && !newestPrerelease) {
      logger.success('Already on the latest pre-release!');
      if (!latest) {
        logger.info(`No stable release available yet for v${CLI_MAJOR_VERSION}.x.`);
      }
      return null;
    }

    const currentHeader = `Currently on ${metadata.releaseVersion} (pre-release)`;

    // Only one option — use a simple confirm
    if (newerStable && !newestPrerelease) {
      const proceed = await confirmAction(`Update to stable release ${newerStable.tag_name}?`, {
        header: currentHeader
      });
      return proceed ? newerStable : null;
    }
    if (!newerStable && newestPrerelease) {
      const proceed = await confirmAction(`Update to pre-release ${newestPrerelease.tag_name}?`, {
        header: currentHeader
      });
      return proceed ? newestPrerelease : null;
    }

    // Both available — let user pick
    const stableDate = newerStable.published_at || newerStable.created_at || '';
    const prereleaseDate = newestPrerelease.published_at || newestPrerelease.created_at || '';
    const stableIsNewer = stableDate >= prereleaseDate;

    const choices = [
      {
        name: `${newerStable.tag_name} (stable)${stableIsNewer ? ' — newest' : ''}`,
        value: newerStable.tag_name
      },
      {
        name: `${newestPrerelease.tag_name} (pre-release)${!stableIsNewer ? ' — newest' : ''}`,
        value: newestPrerelease.tag_name
      },
      {
        name: 'Cancel',
        value: null
      }
    ];

    const selected = await selectPrompt({
      message: 'Select a version:',
      choices,
      header: currentHeader
    });
    if (!selected) return null;
    return selected === newerStable.tag_name ? newerStable : newestPrerelease;
  }

  // On stable
  if (newerStable) {
    return newerStable;
  }

  if (latest) {
    logger.success('Already on the latest version!');
  } else {
    logger.info(`No stable releases found for v${CLI_MAJOR_VERSION}.x.`);
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

  const stop = logger.progress(`Fetching releases from ${metadata.repository}`);
  const allReleases = await fetchCustomReleases(metadata.repository);
  stop();

  if (!allReleases.length) {
    throw CLIError.releaseNotFound(metadata.repository);
  }

  // Filter to only releases published after the current one
  const currentRelease = allReleases.find(r => r.tag_name === metadata.releaseVersion);
  const currentDate = currentRelease?.published_at || currentRelease?.created_at || '';
  const newerReleases = currentDate
    ? allReleases.filter(r => {
        const releaseDate = r.published_at || r.created_at || '';
        return releaseDate > currentDate;
      })
    : allReleases.filter(r => r.tag_name !== metadata.releaseVersion);

  if (!newerReleases.length) {
    logger.success('Already on the latest version!');
    return null;
  }

  const header = `Found ${newerReleases.length} release(s) from ${metadata.repository} newer than ${metadata.releaseVersion}`;
  const selectedTag = await selectRelease(newerReleases, { header });
  return newerReleases.find(r => r.tag_name === selectedTag);
}

export default updateCommand;
