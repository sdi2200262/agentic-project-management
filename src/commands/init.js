/**
 * Init Command Module
 *
 * Handles 'apm init' command for official installation.
 * Fresh installs only — shows info and exits for existing installations.
 *
 * @module src/commands/init
 */

import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { createMetadata, writeMetadata, readMetadata } from '../core/metadata.js';
import { fetchOfficialReleases, findReleaseByTag, getLatestRelease, fetchReleaseManifest, findBundleAsset, parseVersion } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { selectAssistant } from '../ui/prompts.js';
import { formatAssistant, formatAssistantList, assistantNamesFromManifest } from '../core/assistants.js';
import logger from '../ui/logger.js';

/**
 * Executes the init command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.tag] - Specific release tag to install.
 * @param {string[]} [options.assistant] - Assistant ID(s) to install.
 * @returns {Promise<void>}
 */
export async function initCommand(options = {}) {
  const { tag, assistant: assistantArgs } = options;

  logger.clearAndBanner();

  // Fresh only — show info for existing installations
  const existing = await readMetadata();
  if (existing) {
    logger.warn(`Already initialized (${existing.source} ${existing.releaseVersion}, ${logger.plural(existing.assistants.length, 'installation target')}).`);
    logger.blank();
    logger.info('Use "apm add" to add installation targets, "apm update" to update, or "apm archive" to start fresh.');
    return;
  }

  // Fetch and filter releases
  let stop = logger.progress('Fetching releases');
  const releases = await fetchOfficialReleases();
  stop();
  if (!releases.length) {
    throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
  }

  // Find target release
  let release;
  if (tag) {
    // Look the tag up directly so it works beyond the fetched list; keep to this CLI's major version
    if (parseVersion(tag)?.major !== CLI_MAJOR_VERSION) {
      throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo} (tag: ${tag}; this CLI installs v${CLI_MAJOR_VERSION}.x releases)`);
    }
    release = releases.find(r => r.tag_name === tag)
      || await findReleaseByTag(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`, tag);
    if (!release) {
      throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo} (tag: ${tag})`);
    }
  } else {
    release = getLatestRelease(releases);
    if (!release) {
      logger.error(`No stable releases found for CLI v${CLI_MAJOR_VERSION}.x`);
      logger.blank();
      logger.info('Available pre-release versions:');
      for (const r of releases) {
        logger.info(`  ${r.tag_name}`, { indent: true });
      }
      logger.blank();
      logger.info('To install a pre-release, use: apm init --tag <tag>');
      return;
    }
  }

  // Fetch and validate manifest
  stop = logger.progress('Fetching release manifest');
  const manifest = await fetchReleaseManifest(release);
  stop();

  // Determine assistants to install
  const assistantList = assistantArgs && assistantArgs.length > 0 ? assistantArgs : null;
  let assistantIds;

  const warnings = [];

  if (assistantList) {
    // Validate all requested assistants
    assistantIds = [];
    for (const arg of new Set(assistantList)) {
      const found = manifest.assistants.find(a => a.id === arg);
      if (!found) {
        const available = formatAssistantList(manifest.assistants.map(a => a.id), assistantNamesFromManifest(manifest));
        warnings.push({ level: 'error', msg: `Installation target '${arg}' not found. Available: ${available}` });
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
    const header = `Found ${logger.plural(manifest.assistants.length, 'installation target')} available in ${release.tag_name}`;
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
      warnings.push({ level: 'error', msg: `Bundle '${assistant.bundle}' for ${formatAssistant(id, assistant.name)} not found in release, skipping.` });
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
    source: 'official',
    repository: `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: assistantIds,
    assistantNames: assistantNamesFromManifest(manifest, assistantIds),
    installedFiles
  });
  await writeMetadata(metadata);

  // Clear content for final output
  logger.clearAndBanner();
  for (const w of warnings) logger[w.level](w.msg);
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (installedFiles[id]) logger.success(`Installed ${formatAssistant(id, assistant.name)}`);
  }
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (assistant?.postInstallNote) logger.info(assistant.postInstallNote);
  }
  logger.success('APM initialized!');
  logger.info('Run "apm add" to add another installation target, or "apm update" to check for updates.');
  console.log('');
  logger.info('New to APM? Install the apm-assist skill so your AI assistant can explain how APM works and answer questions outside of APM sessions.');
  logger.info('See: https://github.com/sdi2200262/agentic-project-management/tree/main/skills#apm-assist');
}

export default initCommand;
