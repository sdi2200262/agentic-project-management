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
import { selectAssistant, selectRelease, selectCustomRepo, inputRepository, confirmAction, confirmDestructiveAction, confirmSecurityDisclaimer } from '../ui/prompts.js';
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
  const { repo: repoArg, tag, assistant: assistantArgs, addRepo, removeRepo, list, clear, force = false } = options;

  logger.clearAndBanner();

  // Handle repo management flags
  if (addRepo) return handleAddRepo(addRepo);
  if (removeRepo) return handleRemoveRepo(removeRepo, force);
  if (list) return handleListRepos();
  if (clear) return handleClearRepos(force);

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
      const selected = await selectCustomRepo(savedRepos, {
        header: `Found ${savedRepos.length} saved repository(ies)`
      });
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

  // Fetch releases
  let stop = logger.progress(`Fetching releases from ${repoString}`);
  const releases = await fetchCustomReleases(repoString);
  stop();
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
  } else {
    hadInteractivePrompt = true;
    const selectedTag = await selectRelease(releases);
    release = releases.find(r => r.tag_name === selectedTag);
  }

  // Fetch manifest
  stop = logger.progress('Fetching release manifest');
  const manifest = await fetchReleaseManifest(release);
  stop();

  // Determine assistants to install
  const assistantList = assistantArgs && assistantArgs.length > 0 ? assistantArgs : null;
  let assistantIds;

  const warnings = [];

  if (assistantList) {
    assistantIds = [];
    for (const arg of assistantList) {
      const found = manifest.assistants.find(a => a.id === arg);
      if (!found) {
        const available = manifest.assistants.map(a => a.id).join(', ');
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
    hadInteractivePrompt = true;
    const header = `Found ${manifest.assistants.length} assistant(s) available in ${release.tag_name}`;
    const selected = await selectAssistant(manifest.assistants, { header });
    assistantIds = [selected];
  }

  // Download and extract each assistant
  const installedFiles = {};
  let apmExtracted = false;

  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      warnings.push({ level: 'error', msg: `Bundle '${assistant.bundle}' not found in release, skipping.` });
      continue;
    }

    stop = logger.progress(`Downloading ${assistant.bundle}`);
    const writtenFiles = await downloadAndExtract(
      bundleAsset.browser_download_url,
      process.cwd(),
      { skipApm: apmExtracted }
    );
    stop();
    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
    if (!apmExtracted) {
      installedFiles._apm = writtenFiles.filter(f => f.startsWith('.apm/') && !f.startsWith('.apm/archives/'));
    }
    apmExtracted = true;
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

  // Offer to save repo
  let repoSaved = false;
  if (!repoSettings) {
    const saveRepo = await confirmAction('Save this repository for future use?', {
      header: `Initialized from ${repoString} — repository is not in your saved list`
    });
    if (saveRepo) {
      await addCustomRepo(repoString);
      const skipDisclaimer = await confirmAction('Skip security disclaimer for this repo in the future?', {
        header: `Saved repositories can skip the security disclaimer on future use`
      });
      if (skipDisclaimer) {
        await updateRepoSettings(repoString, { skipDisclaimer: true });
      }
      repoSaved = true;
    }
  }

  // Clear content for final output
  logger.clearAndBanner();
  for (const w of warnings) logger[w.level](w.msg);
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (installedFiles[id]) logger.success(`Installed ${assistant.name}`);
  }
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (assistant?.postInstallNote) logger.warn(assistant.postInstallNote);
  }
  logger.success(`APM initialized from ${repoString}!`);
  if (repoSaved) logger.info('Repository saved.');
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

async function handleRemoveRepo(repos, force) {
  // Validate all repos exist first
  const existing = await getCustomRepos();
  const valid = [];
  for (const repo of repos) {
    if (!existing.find(r => r.repo === repo)) {
      logger.error(`Repository ${repo} not found in saved list.`);
    } else {
      valid.push(repo);
    }
  }
  if (!valid.length) return;

  if (!force) {
    const actions = valid.map(r => `Remove saved repository: ${r}`);
    const proceed = await confirmDestructiveAction(actions, 'Remove?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  for (const repo of valid) {
    await removeCustomRepo(repo);
    logger.success(`Removed ${repo}`);
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

async function handleClearRepos(force) {
  const repos = await getCustomRepos();
  if (!repos.length) {
    logger.info('No saved custom repositories to clear.');
    return;
  }

  if (!force) {
    const actions = repos.map(r => `Remove saved repository: ${r.repo}`);
    const proceed = await confirmDestructiveAction(actions, `Remove all ${repos.length} repositories?`);
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  for (const repo of repos) {
    await removeCustomRepo(repo.repo);
  }
  logger.success('All custom repositories removed.');
}

export default customCommand;
