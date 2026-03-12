/**
 * Custom Command Module
 *
 * Handles 'apm custom' command for custom repository installation and repo management.
 *
 * @module src/commands/custom
 */

import { CLI_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, readMetadata } from '../core/metadata.js';
import { getCustomRepos, addCustomRepo, removeCustomRepo, getRepoSettings, updateRepoSettings } from '../core/config.js';
import { fetchCustomReleases, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant, selectRelease, selectCustomRepo, inputRepository, confirmAction, confirmSecurityDisclaimer } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Validates repository format (owner/repo).
 */
function isValidRepoFormat(repo) {
  return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo);
}

/**
 * Executes the custom command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.repo] - Repository in owner/repo format.
 * @param {string} [options.tag] - Specific release tag (requires --repo).
 * @param {string[]} [options.assistant] - Assistant ID(s) to install.
 * @param {string[]} [options.addRepo] - Add custom repository(ies).
 * @param {string[]} [options.removeRepo] - Remove custom repository(ies).
 * @param {boolean} [options.list] - List saved custom repositories.
 * @param {boolean} [options.clear] - Clear all saved custom repositories.
 * @returns {Promise<void>}
 */
export async function customCommand(options = {}) {
  const { repo: repoArg, tag, assistant: assistantArgs, addRepo, removeRepo, list, clear } = options;

  logger.clearAndBanner();

  // Handle repo management flags
  if (addRepo) return handleAddRepo(addRepo);
  if (removeRepo) return handleRemoveRepo(removeRepo);
  if (list) return handleListRepos();
  if (clear) return handleClearRepos();

  // --tag requires --repo
  if (tag && !repoArg) {
    logger.error('--tag requires --repo to be specified.');
    return;
  }

  // Fresh only — show info for existing installations
  const existing = await readMetadata();
  if (existing) {
    logger.warn(`Already initialized (${existing.source} ${existing.releaseVersion}, ${existing.assistants.length} assistant(s)).`);
    logger.blank();
    logger.info('Use "apm add" to add assistants, "apm update" to update, or "apm archive" to start fresh.');
    return;
  }

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

  // Security disclaimer
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

  // Fetch releases
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

  // Fetch manifest
  logger.info('Fetching release manifest...');
  const manifest = await fetchReleaseManifest(release);
  logger.info(`Found ${manifest.assistants.length} assistant(s)`);

  // Determine assistants to install
  const assistantList = assistantArgs && assistantArgs.length > 0 ? assistantArgs : null;
  let assistantIds;

  if (assistantList) {
    assistantIds = [];
    for (const arg of assistantList) {
      const found = manifest.assistants.find(a => a.id === arg);
      if (!found) {
        const available = manifest.assistants.map(a => a.id).join(', ');
        logger.error(`Assistant '${arg}' not found. Available: ${available}`);
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) {
      return;
    }
    logger.info(`Installing: ${assistantIds.join(', ')}`);
  } else {
    hadInteractivePrompt = true;
    const selected = await selectAssistant(manifest.assistants);
    assistantIds = [selected];
  }

  if (hadInteractivePrompt) {
    logger.clearAndBanner();
    logger.info(`Repository: ${repoString}`);
    logger.info(`Release: ${release.tag_name}`);
    logger.info(`Assistants: ${assistantIds.join(', ')}`);
    logger.blank();
  }

  // Download and extract each assistant
  const installedFiles = {};
  let apmExtracted = false;

  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      logger.error(`Bundle '${assistant.bundle}' not found in release, skipping.`);
      continue;
    }

    logger.info(`Downloading ${assistant.bundle}...`);
    const writtenFiles = await downloadAndExtract(
      bundleAsset.browser_download_url,
      process.cwd(),
      { skipApm: apmExtracted }
    );
    // Track only assistant files, not .apm/ infrastructure
    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    apmExtracted = true;
    logger.success(`Installed ${assistant.name}`);
  }

  // Write metadata
  const metadata = createMetadata({
    source: 'custom',
    repository: repoString,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: assistantIds,
    installedFiles
  });
  await writeMetadata(metadata);

  logger.success(`APM initialized from ${repoString}!`);

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

// --- Repo management handlers ---

async function handleAddRepo(repos) {
  // repos is an array (variadic option)
  for (const repo of repos) {
    if (!isValidRepoFormat(repo)) {
      logger.error(`Invalid format: ${repo}. Use: owner/repo`);
      continue;
    }
    const existing = await getCustomRepos();
    if (existing.find(r => r.repo === repo)) {
      logger.warn(`Repository ${repo} is already saved.`);
      continue;
    }
    await addCustomRepo(repo);
    logger.success(`Added ${repo}`);
  }
}

async function handleRemoveRepo(repos) {
  // repos is an array (variadic option)
  for (const repo of repos) {
    const removed = await removeCustomRepo(repo);
    if (removed) {
      logger.success(`Removed ${repo}`);
    } else {
      logger.error(`Repository ${repo} not found in saved list.`);
    }
  }
}

async function handleListRepos() {
  const repos = await getCustomRepos();
  if (!repos.length) {
    logger.info('No saved custom repositories.');
    return;
  }
  logger.info(`Saved custom repositories (${repos.length}):`);
  logger.blank();
  for (const repo of repos) {
    const skipNote = repo.skipDisclaimer ? ' (disclaimer skipped)' : '';
    logger.info(`  ${repo.repo}${skipNote}`, { indent: true });
  }
}

async function handleClearRepos() {
  const repos = await getCustomRepos();
  if (!repos.length) {
    logger.info('No saved custom repositories to clear.');
    return;
  }
  logger.info(`Repositories to remove (${repos.length}):`);
  for (const repo of repos) {
    logger.info(`  ${repo.repo}`, { indent: true });
  }
  logger.blank();
  logger.dim('Use --remove-repo <repo> to remove individual repositories.');
  logger.blank();
  const proceed = await confirmAction(`Remove all ${repos.length} repositories?`);
  if (!proceed) {
    logger.info('Aborted.');
    return;
  }
  for (const repo of repos) {
    await removeCustomRepo(repo.repo);
  }
  logger.success('All custom repositories removed.');
}

export default customCommand;
