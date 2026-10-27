/**
 * Update Command Module
 *
 * Handles 'apm update' command for updating installed assistants.
 * Archives the current session, cleans tracked files, re-extracts fresh.
 *
 * @module src/commands/update
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION, ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, writeMetadata, createMetadata, getInstalledFiles, getAssistantNames } from '../core/metadata.js';
import { formatAssistant, formatAssistantList, assistantNamesFromManifest, resolveUpdateTargets } from '../core/assistants.js';
import { fetchOfficialReleases, fetchCustomReleases, getLatestRelease, fetchReleaseManifest, getRequiredBundles, parseVersion, isStableRelease } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { createArchive, generateArchiveName } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction, confirmAction, selectRelease, selectPrompt, confirmSecurityDisclaimer, isInteractive } from '../ui/prompts.js';
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

  // Names from the target release, falling back to those recorded at install
  const names = { ...getAssistantNames(metadata), ...assistantNamesFromManifest(manifest) };

  // Check if any current assistants exist in the target release
  const { ids: survivingAssistants, dropped: droppedAssistants, migrations } = resolveUpdateTargets(metadata.assistants, manifest);
  if (!survivingAssistants.length) {
    const available = formatAssistantList(manifest.assistants.map(a => a.id), names);
    logger.error(`None of your installation targets (${formatAssistantList(metadata.assistants, names)}) are available in ${release.tag_name}.`);
    logger.info(`Available in ${release.tag_name}: ${available}`);
    logger.info('Use "apm archive" then "apm init" to install with different installation targets.');
    return;
  }

  const bundles = getRequiredBundles(release, manifest, survivingAssistants);

  // Pre-compute archive name for confirmation message
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const resolvedName = archiveName || await generateArchiveName(archivesDir);

  // Confirm destructive action
  if (!force) {
    const currentList = formatAssistantList(metadata.assistants, names);
    const survivingList = formatAssistantList(survivingAssistants, names);

    const bullets = [
      `Snapshot all .apm/ contents (except archives/) into .apm/archives/${resolvedName}`,
      `Remove active session files and installed templates for: ${currentList}`,
      `Download and install ${release.tag_name} for: ${survivingList}`
    ];
    if (migrations.length) {
      bullets.push(`Consolidate ${formatAssistantList(migrations.map(m => m.from), names)} into ${formatAssistantList([...new Set(migrations.map(m => m.to))], names)}`);
    }
    if (droppedAssistants.length > 0) {
      bullets.push(`Drop unsupported ${droppedAssistants.length === 1 ? 'installation target' : 'installation targets'}: ${formatAssistantList(droppedAssistants, names)}`);
    }

    const proceed = await confirmDestructiveAction(
      bullets,
      `Update to ${release.tag_name}?`,
      { hint: 'Pass -f to update without confirmation.' }
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Archive current state
  const archiveStop = logger.progress('Archiving current session');
  await createArchive(cwd, { reason: 'update', name: resolvedName });
  archiveStop();

  // Clean all tracked files
  const installedFiles = getInstalledFiles(metadata);
  await removeInstalledFiles(cwd, installedFiles);

  // Download new bundles for all assistants
  const newInstalledFiles = {};
  let apmExtracted = false;
  for (const { assistant, asset } of bundles) {
    const assistantId = assistant.id;
    stop = logger.progress(`Downloading ${assistant.bundle}`);
    const writtenFiles = await downloadAndExtract(
      asset.browser_download_url,
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

  // Write fresh metadata
  const newMetadata = createMetadata({
    source: metadata.source,
    repository: metadata.repository,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: survivingAssistants,
    assistantNames: assistantNamesFromManifest(manifest, survivingAssistants),
    installedFiles: newInstalledFiles
  });
  await writeMetadata(newMetadata, cwd);

  // Offer to save custom repo if not already saved (optional, so skipped without a terminal)
  if (metadata.source === 'custom' && isInteractive()) {
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
  if (migrations.length) {
    logger.info(`Consolidated ${formatAssistantList(migrations.map(m => m.from), names)} into ${formatAssistantList([...new Set(migrations.map(m => m.to))], names)}.`);
  }
  if (droppedAssistants.length > 0) {
    logger.warn(`Dropped ${logger.plural(droppedAssistants.length, 'installation target')} not in ${release.tag_name}: ${formatAssistantList(droppedAssistants, names)}`);
  }
  for (const id of survivingAssistants) {
    logger.success(`Updated ${formatAssistant(id, names[id])}`);
  }
  for (const id of survivingAssistants) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (assistant?.postInstallNote) logger.info(assistant.postInstallNote);
  }
  logger.success(`Updated to ${release.tag_name} (${logger.plural(survivingAssistants.length, 'installation target')})!`);
  logger.info(`Your previous session is in .apm/archives/${resolvedName}. To start a new session, invoke apm-1-initiate-planner in a new chat.`);
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
      logger.success(`Already on the latest pre-release (${metadata.releaseVersion}).`);
      if (!latest) {
        logger.info(`No stable release available yet for v${CLI_MAJOR_VERSION}.x.`);
      }
      return null;
    }

    const currentHeader = `Currently on ${metadata.releaseVersion} (pre-release)`;
    const hint = 'Run "apm update" in an interactive terminal to choose whether to leave the pre-release.';

    // Only one option — use a simple confirm
    if (newerStable && !newestPrerelease) {
      const proceed = await confirmAction(`Update to stable release ${newerStable.tag_name}?`, {
        header: currentHeader,
        hint
      });
      return proceed ? newerStable : null;
    }
    if (!newerStable && newestPrerelease) {
      const proceed = await confirmAction(`Update to pre-release ${newestPrerelease.tag_name}?`, {
        header: currentHeader,
        hint
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
      header: currentHeader,
      hint
    });
    if (!selected) return null;
    return selected === newerStable.tag_name ? newerStable : newestPrerelease;
  }

  // On stable
  if (newerStable) {
    return newerStable;
  }

  if (latest) {
    logger.success(`Already on the latest version (${metadata.releaseVersion}).`);
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
    logger.success(`Already on the latest version (${metadata.releaseVersion}).`);
    return null;
  }

  const header = `Found ${logger.plural(newerReleases.length, 'release')} from ${metadata.repository} newer than ${metadata.releaseVersion}`;
  const selectedTag = await selectRelease(newerReleases, {
    header,
    hint: 'Run "apm update" in an interactive terminal to choose the release.'
  });
  return newerReleases.find(r => r.tag_name === selectedTag);
}

export default updateCommand;
