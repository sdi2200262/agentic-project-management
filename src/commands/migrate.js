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
import { fileURLToPath } from 'url';
import { OFFICIAL_REPO, CLI_VERSION, CLI_MAJOR_VERSION } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, createMetadata, writeMetadata } from '../core/metadata.js';
import { detectLegacyVersion, buildMigrationReport, executeMigration, snapshotForMigration } from '../services/migrate.js';
import { generateArchiveName } from '../services/archive.js';
import { fetchOfficialReleases, getLatestRelease, fetchReleaseManifest, findBundleAsset } from '../services/releases.js';
import { downloadAndExtract, extractBundle } from '../services/extractor.js';
import { confirmDestructiveAction, selectAssistant } from '../ui/prompts.js';
import logger from '../ui/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const DIST_DIR = path.join(PACKAGE_ROOT, 'dist');
const REFORMAT_TEMPLATE = path.join(PACKAGE_ROOT, 'src', 'templates', 'apm-reformat-migration.md');

/**
 * Executes the migrate command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @param {string[]} [options.assistant] - Assistant ID(s) to install.
 * @param {string} [options.tag] - Specific release tag to install.
 * @param {boolean} [options.local] - Use locally built bundles from dist/.
 * @returns {Promise<void>}
 */
export async function migrateCommand(options = {}) {
  const { force = false, assistant: assistantArgs, tag, local: useLocal } = options;
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

  // --- Branch: local vs remote ---

  if (useLocal) {
    return localMigration({ cwd, metadata, legacyVersion, report, force, assistantArgs });
  }
  return remoteMigration({ cwd, metadata, legacyVersion, report, force, assistantArgs, tag });
}

/**
 * Migration using locally built bundles from dist/.
 * Reads dist/apm-release.json as manifest, maps v0.5.4 assistant names
 * to v1 IDs, extracts corresponding zips.
 */
async function localMigration({ cwd, metadata, legacyVersion, report, force, assistantArgs }) {
  // Validate dist/ exists
  const manifestPath = path.join(DIST_DIR, 'apm-release.json');
  if (!await fs.pathExists(manifestPath)) {
    logger.error('Local dist/ not found. Run "npm run build" in the APM repo first.');
    return;
  }

  const manifest = await fs.readJson(manifestPath);

  // Resolve assistant IDs: from --assistant flag, from v0.5.4 metadata, or prompt
  const assistantIds = await resolveAssistants(manifest, metadata, assistantArgs);
  if (!assistantIds || !assistantIds.length) return;

  // Confirm
  if (!force) {
    const archiveName = await generateArchiveName(path.join(cwd, '.apm', 'archives'));
    const assistantNames = assistantIds.map(id => manifest.assistants.find(a => a.id === id)?.name || id);
    const actions = [
      `Archive current v0.5.4 state to .apm/archives/${archiveName}`,
      ...report.actions,
      `Install local build templates for: ${assistantNames.join(', ')}`
    ];
    const proceed = await confirmDestructiveAction(actions, 'Migrate to v1?');
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  // Archive + migrate
  let stop = logger.progress('Archiving v0.5.4 state');
  await snapshotForMigration(cwd);
  stop();

  stop = logger.progress('Migrating project data to v1 layout');
  await executeMigration(cwd);
  stop();

  // Extract local bundles
  const installedFiles = {};
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    const bundlePath = path.join(DIST_DIR, assistant.bundle);

    if (!await fs.pathExists(bundlePath)) {
      logger.error(`Bundle ${assistant.bundle} not found in dist/, skipping.`);
      continue;
    }

    stop = logger.progress(`Installing ${assistant.name}`);
    const zipBuffer = await fs.readFile(bundlePath);
    const writtenFiles = await extractBundle(zipBuffer, cwd, { skipApm: true });
    stop();

    installedFiles[id] = writtenFiles.filter(f => !f.startsWith('.apm/'));
  }

  installedFiles._apm = await collectApmFiles(cwd);

  // Write metadata
  const newMetadata = createMetadata({
    source: 'local',
    repository: 'local',
    releaseVersion: `v${manifest.version}`,
    cliVersion: CLI_VERSION,
    assistants: assistantIds,
    installedFiles
  });
  await writeMetadata(newMetadata, cwd);

  // Install reformat command
  await installReformatCommand(cwd, manifest, assistantIds);

  logger.clearAndBanner();
  logger.success(`Migrated from ${legacyVersion} using local build (v${manifest.version})`);
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (installedFiles[id]) logger.success(`Installed ${assistant.name}`);
    if (assistant?.postInstallNote) logger.warn(assistant.postInstallNote);
  }
  logger.blank();
  logger.info('Run /apm-reformat-migration to adapt documents to v1 format.');
  logger.info('Run "apm status" to verify installation.');
}

/**
 * Migration using remote releases from GitHub.
 */
async function remoteMigration({ cwd, metadata, legacyVersion, report, force, assistantArgs, tag }) {
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
      logger.info('Use --tag for a pre-release, or --local for local builds.');
      return;
    }
  }

  stop = logger.progress('Fetching release manifest');
  const manifest = await fetchReleaseManifest(release);
  stop();

  // Resolve assistants
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

  // Confirm
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

  // Archive + migrate
  stop = logger.progress('Archiving v0.5.4 state');
  await snapshotForMigration(cwd);
  stop();

  stop = logger.progress('Migrating project data to v1 layout');
  await executeMigration(cwd);
  stop();

  // Download and install
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

  installedFiles._apm = await collectApmFiles(cwd);

  const newMetadata = createMetadata({
    source: 'official',
    repository: `${OFFICIAL_REPO.owner}/${OFFICIAL_REPO.repo}`,
    releaseVersion: release.tag_name,
    cliVersion: CLI_VERSION,
    assistants: assistantIds,
    installedFiles
  });
  await writeMetadata(newMetadata, cwd);

  // Install reformat command
  await installReformatCommand(cwd, manifest, assistantIds);

  logger.clearAndBanner();
  logger.success(`Migrated from ${legacyVersion} to ${release.tag_name}`);
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (installedFiles[id]) logger.success(`Installed ${assistant.name}`);
    if (assistant?.postInstallNote) logger.warn(assistant.postInstallNote);
  }
  logger.blank();
  logger.info('Run /apm-reformat-migration to adapt documents to v1 format.');
  logger.info('Run "apm status" to verify installation.');
}

/**
 * Resolves v1 assistant IDs from --assistant flag, v0.5.4 metadata names, or interactive prompt.
 * Maps v0.5.4 names (e.g. "Claude Code") to v1 IDs (e.g. "claude") by matching manifest names.
 *
 * @param {Object} manifest - v1 release manifest.
 * @param {Object} legacyMetadata - v0.5.4 metadata.
 * @param {string[]} [assistantArgs] - Explicit --assistant values.
 * @returns {Promise<string[]|null>} Resolved IDs or null.
 */
async function resolveAssistants(manifest, legacyMetadata, assistantArgs) {
  // Explicit --assistant flag takes priority
  if (assistantArgs && assistantArgs.length > 0) {
    const ids = [];
    for (const arg of assistantArgs) {
      const found = manifest.assistants.find(a => a.id === arg);
      if (!found) {
        const available = manifest.assistants.map(a => a.id).join(', ');
        logger.error(`Assistant '${arg}' not found. Available: ${available}`);
        continue;
      }
      ids.push(arg);
    }
    return ids.length ? ids : null;
  }

  // Auto-map from v0.5.4 metadata assistant names
  const legacyNames = legacyMetadata.assistants || [];
  if (legacyNames.length > 0) {
    const mapped = [];
    for (const name of legacyNames) {
      const match = manifest.assistants.find(a =>
        a.name.toLowerCase() === name.toLowerCase()
      );
      if (match) {
        mapped.push(match.id);
        logger.info(`Mapped "${name}" → ${match.id}`);
      } else {
        logger.warn(`Could not map legacy assistant "${name}" to a v1 ID, skipping.`);
      }
    }
    if (mapped.length > 0) return mapped;
  }

  // Fallback: interactive prompt
  const header = 'Select assistant(s) to install';
  const selected = await selectAssistant(manifest.assistants, { header });
  return [selected];
}

/**
 * Installs the one-shot reformat command into each installed assistant's commands directory.
 *
 * @param {string} cwd - Working directory.
 * @param {Object} manifest - Release manifest with assistant configDir info.
 * @param {string[]} assistantIds - Installed assistant IDs.
 */
async function installReformatCommand(cwd, manifest, assistantIds) {
  for (const id of assistantIds) {
    const assistant = manifest.assistants.find(a => a.id === id);
    if (!assistant?.configDir) continue;

    const dest = path.join(cwd, assistant.configDir, 'commands', 'apm-reformat-migration.md');
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(REFORMAT_TEMPLATE, dest);
  }
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
