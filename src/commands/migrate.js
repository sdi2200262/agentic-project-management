/**
 * Migrate Command Module
 *
 * Handles 'apm migrate' command for upgrading v0.5.4 projects to v1.
 * All-in-one: transforms project data + installs v1 assistant templates.
 *
 * @module src/commands/migrate
 */

import fs from 'fs-extra';
import path from 'path';
import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, createMetadata, writeMetadata } from '../core/metadata.js';
import { detectLegacyVersion, buildMigrationReport, executeMigration, snapshotForMigration } from '../services/migrate.js';
import { generateArchiveName } from '../services/archive.js';
import { fetchOfficialReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract } from '../services/extractor.js';
import { confirmDestructiveAction, selectAssistant } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the migrate command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @param {string[]} [options.assistant] - Assistant ID(s) to install.
 * @param {string} [options.tag] - Specific release tag to install.
 * @returns {Promise<void>}
 */
export async function migrateCommand(options = {}) {
  const { force = false, assistant: assistantArgs, tag } = options;
  const cwd = process.cwd();

  logger.clearAndBanner();

  // --- Step 1: Detect legacy version ---

  const metadata = await readMetadata(cwd);
  if (!metadata) {
    throw CLIError.notInitialized();
  }

  // Reject if already v1
  if (metadata.releaseVersion) {
    logger.warn('This project is already using v1 format.');
    logger.info('Use "apm update" to update templates.');
    return;
  }

  const legacyVersion = await detectLegacyVersion(cwd);
  if (!legacyVersion) {
    logger.error('Could not detect a v0.5.x installation to migrate.');
    return;
  }

  logger.info(`Detected legacy installation: ${legacyVersion}`);
  logger.blank();

  // --- Step 2: Build migration report ---

  const report = await buildMigrationReport(cwd);

  // --- Step 3: Fetch v1 release (before confirmation, so we can show what will be installed) ---

  let stop = logger.progress('Fetching v1 releases');
  const releases = await fetchOfficialReleases();
  stop();

  if (!releases.length) {
    throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`);
  }

  let release;
  if (tag) {
    release = releases.find(r => r.tag_name === tag);
    if (!release) {
      throw CLIError.releaseNotFound(`${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo} (tag: ${tag})`);
    }
  } else {
    release = getLatestRelease(releases);
    if (!release) {
      logger.error(`No stable v${CLI_MAJOR_VERSION}.x releases found.`);
      logger.info('Use --tag to specify a pre-release version.');
      return;
    }
  }

  stop = logger.progress('Fetching release manifest');
  const manifest = await fetchReleaseManifest(release);
  stop();

  // --- Step 4: Select assistant(s) ---

  let assistantIds;
  if (assistantArgs && assistantArgs.length > 0) {
    assistantIds = [];
    for (const arg of assistantArgs) {
      const found = manifest.assistants.find(a => a.id === arg);
      if (!found) {
        const available = manifest.assistants.map(a => a.id).join(', ');
        logger.error(`Assistant '${arg}' not found. Available: ${available}`);
        continue;
      }
      assistantIds.push(arg);
    }
    if (!assistantIds.length) return;
  } else {
    const header = `Select assistant(s) to install from ${release.tag_name}`;
    const selected = await selectAssistant(manifest.assistants, { header });
    assistantIds = [selected];
  }

  // --- Step 5: Confirm ---

  if (!force) {
    const archiveName = await generateArchiveName(path.join(cwd, '.apm', 'archives'));
    const actions = [
      `Archive current v0.5.4 state to .apm/archives/${archiveName}`,
      ...report.actions,
      `Install ${release.tag_name} templates for: ${assistantIds.join(', ')}`
    ];
    const proceed = await confirmDestructiveAction(actions, 'Migrate to v1?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // --- Step 6: Archive old state ---

  stop = logger.progress('Archiving v0.5.4 state');
  const archivePath = await snapshotForMigration(cwd);
  stop();

  // --- Step 7: Execute migration ---

  stop = logger.progress('Migrating project data to v1 layout');
  await executeMigration(cwd);
  stop();

  // --- Step 8: Download and install v1 templates ---

  const installedFiles = {};

  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundleAsset = findBundleAsset(release, assistant.bundle);

    if (!bundleAsset) {
      logger.error(`Bundle '${assistant.bundle}' not found in release, skipping.`);
      continue;
    }

    stop = logger.progress(`Installing ${assistant.name}`);
    const writtenFiles = await downloadAndExtract(
      bundleAsset.browser_download_url,
      cwd,
      { skipApm: true }
    );
    stop();

    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
  }

  // Track migrated .apm/ files
  installedFiles._apm = await collectApmFiles(cwd);

  // --- Step 9: Write v1 metadata ---

  const newMetadata = createMetadata({
    source: 'official',
    repository: `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: assistantIds,
    installedFiles
  });
  await writeMetadata(newMetadata, cwd);

  // --- Done ---

  logger.clearAndBanner();
  logger.success(`Migrated from ${legacyVersion} to ${release.tag_name}`);
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (installedFiles[id]) logger.success(`Installed ${assistant.name}`);
    if (assistant?.postInstallNote) logger.warn(assistant.postInstallNote);
  }
  logger.info('Run "apm status" to verify.');
}

/**
 * Collects all .apm/ files (excluding archives) for metadata tracking.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<string[]>} Relative file paths.
 */
async function collectApmFiles(cwd) {
  const apmDir = path.join(cwd, '.apm');
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(cwd, fullPath);

      if (entry.name === 'archives') continue;
      if (entry.name === 'metadata.json') continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        files.push(relativePath);
      }
    }
  }

  await walk(apmDir);
  return files;
}

export default migrateCommand;
