#!/usr/bin/env node

/**
 * APM CLI Entry Point
 * 
 * Main command-line interface for Agentic Project Management.
 * Handles project initialization and template updates.
 * 
 * @module cli
 */

import { Command, Option } from 'commander';
import { select, confirm, input } from '@inquirer/prompts';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import {
  DEFAULT_REPO,
  parseRepoString,
  fetchReleases,
  fetchRelease,
  fetchReleaseManifest,
  downloadAndExtractBundle,
  findLatestCompatibleTemplateTag,
  findLatestTemplateTag
} from './downloader.js';
import {
  readMetadata,
  writeMetadata,
  detectInstalledAssistants,
  compareTemplateVersions,
  restoreBackup,
  displayBanner,
  isVersionNewer,
  checkForNewerTemplates,
  installFromTempDirectory,
  updateFromTempDirectory,
  parseTemplateTagParts,
  mergeAssistants,
  createAndZipBackup,
  installScaffolds,
  migrateLegacyMetadata
} from './utils.js';
import { MANIFEST_VERSION, validateBundleManifest } from './manifest-schema.js';

const program = new Command();

// Dynamically read CLI version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const CURRENT_CLI_VERSION = packageJson.version;


/**
 * Fetches assistant choices from a release manifest
 * @param {{ owner: string, repo: string, tag: string }} config - Repository and tag configuration
 * @returns {Promise<Object[]>} Array of assistant choice objects for interactive selection
 * @private
 */
async function fetchAssistantChoices({ owner, repo, tag } = {}) {
  const manifest = await fetchReleaseManifest({ owner, repo, tag });

  return manifest.assistants.map(assistant => ({
    name: assistant.name,
    value: assistant,
    description: assistant.description || `Optimized for ${assistant.name}`
  }));
}

/**
 * Reads and parses a bundle manifest from an extracted bundle directory
 * @param {string} bundleDir - Path to extracted bundle directory
 * @returns {Object|null} Parsed bundle manifest or null if not found/invalid
 * @private
 */
function readBundleManifest(bundleDir) {
  const manifestPath = join(bundleDir, 'apm-bundle-manifest.json');

  if (!existsSync(manifestPath)) {
    return null;
  }

  try {
    const content = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    const validation = validateBundleManifest(manifest);
    if (!validation.valid) {
      logger.warn(`Invalid bundle manifest: ${validation.errors.join(', ')}`);
      return null;
    }

    return manifest;
  } catch (err) {
    logger.warn(`Failed to read bundle manifest: ${err.message}`);
    return null;
  }
}

/**
 * Displays custom help output
 * @private
 */
function displayCustomHelp() {
  const chalk = logger.chalk;

  console.log(chalk.cyan.bold('Agentic Project Management CLI'));
  console.log('');
  console.log(chalk.gray('Usage:') + ' ' + chalk.white('apm [command] [options]'));
  console.log('');
  console.log(chalk.cyan.bold('Commands:'));
  console.log(`  ${chalk.bold('init')}              Initialize a new APM project (official templates)`);
  console.log(`  ${chalk.bold('init --tag <tag>')}  Install specific template version`);
  console.log(`  ${chalk.bold('custom')}            Install from a custom repository`);
  console.log(`  ${chalk.bold('update')}            Update APM templates to latest compatible version`);
  console.log('');
  console.log(chalk.cyan.bold('Options:'));
  console.log(`  ${chalk.bold('-V, --version')}     Show version number`);
  console.log(`  ${chalk.bold('-h, --help')}        Show help`);
  console.log('');
  console.log(chalk.cyan.bold('Versioning:'));
  console.log(`  ${chalk.bold('CLI')} (${CURRENT_CLI_VERSION}):`);
  console.log(`            - Follows SemVer: ${chalk.blue.underline('https://semver.org/')}`);
  console.log(`            - Update with: ${chalk.yellow('npm update -g agentic-pm')}`);
  console.log('');
  console.log(`  ${chalk.bold('Templates')} (v${CURRENT_CLI_VERSION}+templates.N):`);
  console.log(`            - Uses CLI version + build metadata`);
  console.log(`            - Updated via: ${chalk.yellow('apm update')} or manually via: ${chalk.yellow('apm init --tag <tag>')}`);
  console.log('');
  console.log(chalk.gray('Learn more:') + ' ' + chalk.blue.underline('https://github.com/sdi2200262/agentic-project-management'));
}

/**
 * Creates or updates metadata file to store APM installation information
 * @param {string} projectPath - Path to the project directory
 * @param {string[]} assistants - Installed assistants
 * @param {string} templateVersion - APM template tag (e.g., v1.0.0+templates.1)
 * @param {string} [templateRepository] - Repository string (e.g., "owner/repo")
 * @private
 */
function createOrUpdateMetadata(projectPath, assistants, templateVersion, templateRepository) {
  const metadataDir = resolve(projectPath, '.apm');
  const metadataPath = join(metadataDir, 'metadata.json');

  if (!existsSync(metadataDir)) {
    mkdirSync(metadataDir, { recursive: true });
  }

  const now = new Date().toISOString();
  const existingMetadata = existsSync(metadataPath)
    ? JSON.parse(readFileSync(metadataPath, 'utf8'))
    : null;

  const repoString = templateRepository || existingMetadata?.templateRepository || `${DEFAULT_REPO.owner}/${DEFAULT_REPO.repo}`;

  const metadata = {
    templateRepository: repoString,
    templateVersion,
    manifestVersion: MANIFEST_VERSION,
    assistants: assistants || [],
    installedAt: existingMetadata?.installedAt || now,
    lastUpdated: now
  };

  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}


/**
 * Handles the init command logic
 * @param {Object} options - Command options
 * @private
 */
async function handleInit(options) {
  const chalk = logger.chalk;

  displayBanner();

  // Check existing metadata and migrate if needed
  let existingMetadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
  if (existingMetadata) {
    existingMetadata = migrateLegacyMetadata(existingMetadata, process.cwd());
  }

  if (existingMetadata) {
    logger.warn('APM appears to already be initialized in this directory.');
    logger.warn('Continuing may update existing APM files.');

    const assistantsMsg = Array.isArray(existingMetadata.assistants) && existingMetadata.assistants.length
      ? `Installed assistants detected: ${existingMetadata.assistants.join(', ')}`
      : 'No assistants recorded in metadata yet.';

    logger.dim(`\n${assistantsMsg}`);
    logger.dim('Note: Selecting an assistant will install/update ALL recorded assistants to the chosen tag.');
    console.log('');
  }

  // Determine target tag first (needed for fetching assistant choices)
  let targetTag;
  const repoConfig = { ...DEFAULT_REPO };

  if (options.tag) {
    targetTag = options.tag;
    console.log('');
    logger.warn(`Installing specific tag: ${targetTag}`);
    logger.dim(`  Validating tag...`);

    try {
      await fetchRelease({ ...repoConfig, tag: targetTag });
    } catch (err) {
      throw new Error(`Tag ${targetTag} not found or invalid: ${err.message}`);
    }
  } else {
    console.log('');
    logger.dim(`Finding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`);

    const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION, repoConfig);

    if (!compatibleResult) {
      const latestOverall = await findLatestTemplateTag(repoConfig);
      const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);

      let errorMessage = `No compatible template tags found for CLI version ${CURRENT_CLI_VERSION}.`;

      if (newerInfo) {
        errorMessage += `\n\nNewer template versions are available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`;
        errorMessage += `\n\nTo access these newer templates, please update your CLI:`;
        errorMessage += `\n  npm update -g agentic-pm`;
        errorMessage += `\n\nThen run 'apm init' again.`;
      } else {
        errorMessage += `\n\nThis may indicate that no template releases have been published yet.`;
        errorMessage += `\nPlease try again later, or check for releases at:`;
        errorMessage += `\nhttps://github.com/sdi2200262/agentic-project-management/releases`;
      }

      throw new Error(errorMessage);
    }

    targetTag = compatibleResult.tag_name;
    logger.success(`Found: ${targetTag}`);

    const latestOverall = await findLatestTemplateTag(repoConfig);
    const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);

    if (newerInfo) {
      console.log('');
      logger.dim(`Note: Newer templates available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`);
      logger.dim(`  Update CLI with: npm update -g agentic-pm`);
    }
  }

  // Fetch assistant choices from release manifest
  console.log('');
  logger.dim('Fetching available assistants...');

  let assistantChoices;
  try {
    assistantChoices = await fetchAssistantChoices({ ...repoConfig, tag: targetTag });
  } catch (err) {
    throw new Error(`Failed to fetch assistant choices: ${err.message}`);
  }

  // Interactive assistant selection with custom styling
  const selectedAssistant = await select({
    message: 'Which AI assistant are you using?',
    instructions: '(up/down navigate | enter select)',
    choices: assistantChoices.map(choice => ({
      ...choice,
      name: `${choice.name}`
    })),
    theme: {
      prefix: '',
      icon: { cursor: '>' },
      style: {
        highlight: (text) => chalk.cyan(text),
        message: (text) => chalk.cyan(text)
      }
    }
  });

  console.log('');
  logger.dim(`Selected: ${selectedAssistant.name}`);

  // Determine assistants to install (store names for metadata)
  const existingAssistantNames = existingMetadata?.assistants || [];
  const assistantNamesToInstall = mergeAssistants(existingAssistantNames, [selectedAssistant.name]);

  // Download and extract bundles to temp directory
  const tempDir = join(process.cwd(), '.apm', 'temp-init');

  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir, { recursive: true });

  let scaffoldsInstalled = false;
  let guidesInstalled = false;

  // Get all assistant info from manifest for installation
  const manifest = await fetchReleaseManifest({ ...repoConfig, tag: targetTag });

  for (const assistantName of assistantNamesToInstall) {
    const assistantInfo = manifest.assistants.find(a => a.name === assistantName);

    if (!assistantInfo) {
      logger.warn(`Assistant "${assistantName}" not found in manifest, skipping...`);
      continue;
    }

    const subDir = join(tempDir, assistantInfo.id);
    mkdirSync(subDir, { recursive: true });

    await downloadAndExtractBundle({
      ...repoConfig,
      tag: targetTag,
      bundleName: assistantInfo.bundle,
      destinationPath: subDir
    });

    // Read bundle manifest for scaffold installation
    const bundleManifest = readBundleManifest(subDir);

    // Install scaffolds from first bundle only (they're all the same)
    if (!scaffoldsInstalled && bundleManifest) {
      const scaffoldResult = installScaffolds(subDir, process.cwd(), bundleManifest);
      if (scaffoldResult.installed.length > 0 || scaffoldResult.skipped.length > 0) {
        scaffoldsInstalled = true;
      }
    }

    // Install assistant files
    installFromTempDirectory(subDir, assistantName, process.cwd(), { installGuides: !guidesInstalled });
    if (!guidesInstalled) guidesInstalled = true;
  }

  // Clean up
  rmSync(tempDir, { recursive: true, force: true });

  // Save metadata with repository info
  const repoString = `${repoConfig.owner}/${repoConfig.repo}`;
  createOrUpdateMetadata(process.cwd(), assistantNamesToInstall, targetTag, repoString);

  // Success message
  console.log('');
  logger.line();
  console.log('');
  console.log(chalk.green.bold('APM initialized successfully!'));
  logger.dim(`Template Version: ${targetTag}`);
  logger.dim(`Repository: ${repoString}`);
  console.log('');
  logger.dim('Next steps:');
  logger.dim('  1. Review the generated files in the .apm/ directory');
  logger.dim('  2. Customize the prompts and configuration for your specific project');
  logger.dim('  3. Start using APM with your AI assistant');
  logger.dim('  4. Run "apm update" anytime to get the latest improvements');
  console.log('');
}

/**
 * Handles the update command logic
 * @private
 */
async function handleUpdate() {
  const chalk = logger.chalk;

  displayBanner();
  logger.custom('UPDATE', 'APM Update Tool', chalk.blue);
  logger.dim('Checking for updates...\n', { indent: true });

  let metadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);

  if (!metadata) {
    logger.warn('No APM installation detected in this directory.');
    logger.warn('Run "apm init" to initialize a new project.\n');
    process.exit(1);
  }

  // Migrate legacy metadata if needed
  metadata = migrateLegacyMetadata(metadata, process.cwd());

  const assistants = Array.isArray(metadata.assistants) && metadata.assistants.length > 0
    ? metadata.assistants
    : detectInstalledAssistants(process.cwd());

  const installedVersion = metadata.templateVersion || metadata.version;

  // Get repository from metadata or use default
  const repoString = metadata.templateRepository || `${DEFAULT_REPO.owner}/${DEFAULT_REPO.repo}`;
  const repoConfig = parseRepoString(repoString) || DEFAULT_REPO;

  console.log(chalk.blue(`Current installation (all assistants): ${assistants.join(', ') || 'none'}`));
  console.log(chalk.blue(`Template Version: ${installedVersion}`));
  console.log(chalk.blue(`Repository: ${repoString}`));

  logger.dim(`\nFinding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`, { indent: true });

  const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION, repoConfig);

  if (!compatibleResult) {
    const latestOverall = await findLatestTemplateTag(repoConfig);
    const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);

    logger.warn(`\nNo compatible template tags found for CLI version ${CURRENT_CLI_VERSION}.`);

    if (newerInfo) {
      console.log(chalk.cyan(`\n[INFO] Newer template versions are available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`));
      logger.warn(`\nYour current CLI version (${CURRENT_CLI_VERSION}) is incompatible with the latest templates.`);
      logger.warn('To access these newer templates, please update your CLI:');
      console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
      logger.dim(`\nAfter updating your CLI, run 'apm update' again to get the latest templates.\n`);
    } else {
      logger.warn('\nThis may indicate that no template releases have been published yet.');
      logger.warn('Please try again later, or check for releases at:');
      console.log(chalk.blue.underline(`https://github.com/${repoString}/releases\n`));
    }
    process.exit(1);
  }

  const latestCompatibleTag = compatibleResult.tag_name;

  // Determine update policy
  let comparison;
  const installedParsed = parseTemplateTagParts(installedVersion);

  if (installedParsed && installedParsed.baseVersion !== CURRENT_CLI_VERSION) {
    if (isVersionNewer(installedParsed.baseVersion, CURRENT_CLI_VERSION)) {
      logger.error(`\nInstalled templates are for a newer CLI base than your current CLI.`);
      logger.error(`Installed: v${installedParsed.baseVersion}`);
      logger.error(`Current CLI: v${CURRENT_CLI_VERSION}`);
      logger.warn('\nTo align with installed templates, update your CLI:');
      console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
      logger.dim('\nAlternatively, you can re-install templates compatible with your CLI using:');
      console.log(chalk.white(`  ${chalk.bold('apm init --tag <tag-for-your-CLI>')}`));
      return;
    } else {
      comparison = -1;
    }
  } else {
    try {
      comparison = compareTemplateVersions(installedVersion, latestCompatibleTag);
    } catch {
      logger.warn(`\nInstalled version format may be outdated: ${installedVersion}`);
      logger.warn('Attempting to update to latest compatible version...');
      comparison = -1;
    }
  }

  const latestOverall = await findLatestTemplateTag(repoConfig);
  const newerVersionInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);

  let baseMismatch = false;
  if (isNaN(comparison)) {
    baseMismatch = true;
    comparison = -1;
  }

  if (comparison === 0) {
    logger.success('\nYou have the latest template version compatible with your CLI!');
    logger.dim(`Current template version: ${installedVersion}`, { indent: true });
    logger.dim(`Latest compatible: ${latestCompatibleTag}`, { indent: true });

    if (newerVersionInfo) {
      console.log(chalk.cyan(`\n[INFO] Newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
      logger.warn('\nTo access these newer templates, update your CLI:');
      console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
      logger.dim('Then run \'apm update\' again.\n');
    } else {
      logger.dim('\nNo update needed.\n');
    }
    return;
  } else if (comparison === 1) {
    logger.warn(`\nInstalled version (${installedVersion}) appears newer than latest found (${latestCompatibleTag}).`);
    logger.warn('This is unusual but safe. No update needed.\n');
    return;
  }

  // Update available
  console.log(chalk.cyan('\n[UPDATE] Update available for your CLI version!'));
  logger.dim(`Current template version: ${installedVersion}`, { indent: true });
  logger.dim(`Latest compatible version: ${latestCompatibleTag}`, { indent: true });
  console.log(chalk.cyan(`\nUpdate: ${installedVersion} -> ${latestCompatibleTag}`));

  if (compatibleResult.release_notes) {
    const notesPreview = compatibleResult.release_notes.substring(0, 300);
    logger.dim('Release notes:');
    logger.dim(`${notesPreview}${compatibleResult.release_notes.length > 300 ? '...' : ''}`, { indent: true });
  }

  if (newerVersionInfo) {
    console.log(chalk.cyan(`\n[INFO] Note: Even newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
    console.log(chalk.yellow(`To access those, update your CLI: ${chalk.white('npm update -g agentic-pm')} then run 'apm update' again.`));
  }

  console.log(chalk.cyan('\nWhat will be updated:'));
  logger.dim('- Command files (slash commands)', { indent: true });
  logger.dim('- Guide files (templates and documentation)', { indent: true });

  console.log(chalk.cyan('\nWhat will be preserved:'));
  logger.dim('- User .apm/ files (Memory/, Implementation_Plan.md, etc.)', { indent: true });
  logger.dim('- User content in directories outside APM control', { indent: true });
  logger.dim('- Custom configurations (if any)', { indent: true });

  if (baseMismatch) {
    console.log(chalk.cyan('\n[INFO] Installed templates are for a different CLI base. Updating to latest compatible.'));
  }

  console.log('');
  const shouldUpdate = await confirm({
    message: `Update ALL assistants from ${installedVersion} to ${latestCompatibleTag}?`,
    default: false
  });

  if (!shouldUpdate) {
    logger.warn('\nUpdate cancelled.\n');
    return;
  }

  logger.custom('PROCESS', '\nStarting update process...', chalk.blue);

  // Create backup
  logger.dim('Creating backup...');
  const { backupDir, zipPath } = createAndZipBackup(process.cwd(), assistants, installedVersion);
  logger.success(`Backup created at: ${backupDir}`);

  try {
    // Download and extract new version
    logger.dim('\nDownloading update...');
    const tempDir = join(process.cwd(), '.apm', 'temp-update');

    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });

    // Fetch manifest for assistant info
    const manifest = await fetchReleaseManifest({ ...repoConfig, tag: latestCompatibleTag });

    logger.dim('\nDownloading update bundles...');
    let guidesUpdated = false;

    for (const assistantName of assistants) {
      const assistantInfo = manifest.assistants.find(a => a.name === assistantName);

      if (!assistantInfo) {
        logger.warn(`Assistant "${assistantName}" not found in manifest, skipping...`);
        continue;
      }

      const subDir = join(tempDir, assistantInfo.id);
      mkdirSync(subDir, { recursive: true });

      await downloadAndExtractBundle({
        ...repoConfig,
        tag: latestCompatibleTag,
        bundleName: assistantInfo.bundle,
        destinationPath: subDir
      });

      updateFromTempDirectory(subDir, assistantName, process.cwd(), { installGuides: !guidesUpdated });
      if (!guidesUpdated) guidesUpdated = true;
    }

    // Update metadata
    metadata.templateVersion = latestCompatibleTag;
    metadata.templateRepository = repoString;
    metadata.manifestVersion = MANIFEST_VERSION;
    metadata.assistants = assistants;
    metadata.lastUpdated = new Date().toISOString();
    writeMetadata(process.cwd(), metadata);
    logger.success('Updated metadata');

    // Clean up temp
    rmSync(tempDir, { recursive: true, force: true });

    // Success
    console.log(chalk.green(`\nAPM templates successfully updated to ${latestCompatibleTag}!`));
    logger.dim(`Template Version: ${latestCompatibleTag}`);
    logger.dim(`Repository: ${repoString}`);

    try {
      rmSync(backupDir, { recursive: true, force: true });
      if (zipPath) {
        logger.dim(`\nBackup archive saved at: ${zipPath}`);
      } else {
        logger.dim(`\nBackup directory saved at: ${backupDir}`);
      }
    } catch {
      logger.warn(`\nCould not clean backup directory: ${backupDir}`);
    }
    console.log('');

  } catch (updateError) {
    logger.error('\nUpdate failed', { error: updateError });
    logger.warn('Attempting to restore from backup...');

    try {
      restoreBackup(backupDir, process.cwd());
      logger.success('Successfully restored from backup.');
    } catch (restoreError) {
      logger.error('Failed to restore backup', { error: restoreError });
      console.log(chalk.red(`Manual restoration may be required. Backup location: ${backupDir}`));
    }

    process.exit(1);
  }
}

/**
 * Handles the custom command logic for installing from custom repositories
 * @param {Object} options - Command options
 * @private
 */
async function handleCustom(options) {
  const chalk = logger.chalk;

  displayBanner();
  logger.custom('CUSTOM', 'Install from custom repository', chalk.magenta);
  console.log('');

  // Get repository
  let repoConfig;
  if (options.repo) {
    repoConfig = parseRepoString(options.repo);
    if (!repoConfig) {
      throw new Error(`Invalid repository format: ${options.repo}. Expected: owner/repo`);
    }
    logger.dim(`Using repository: ${options.repo}`);
  } else {
    const repoInput = await input({
      message: 'Enter GitHub repository (owner/repo):',
      default: `${DEFAULT_REPO.owner}/${DEFAULT_REPO.repo}`,
      validate: (value) => {
        const parsed = parseRepoString(value);
        return parsed ? true : 'Invalid format. Expected: owner/repo';
      }
    });
    repoConfig = parseRepoString(repoInput);
  }

  const repoString = `${repoConfig.owner}/${repoConfig.repo}`;
  console.log('');

  // Fetch available releases
  logger.dim('Fetching available releases...');
  let releases;
  try {
    releases = await fetchReleases(repoConfig);
  } catch (err) {
    throw new Error(`Failed to fetch releases from ${repoString}: ${err.message}`);
  }

  if (releases.length === 0) {
    throw new Error(`No releases found in ${repoString}`);
  }

  // Determine target tag
  let targetTag;
  if (options.tag) {
    targetTag = options.tag;
    logger.dim(`Using specified tag: ${targetTag}`);

    // Validate tag exists
    const tagExists = releases.some(r => r.tag_name === targetTag);
    if (!tagExists) {
      throw new Error(`Tag ${targetTag} not found in ${repoString}`);
    }
  } else {
    // Interactive version selection
    const releaseChoices = releases.slice(0, 20).map(release => ({
      name: `${release.tag_name}${release.prerelease ? ' (prerelease)' : ''}`,
      value: release.tag_name,
      description: release.name || ''
    }));

    targetTag = await select({
      message: 'Select a version to install:',
      instructions: '(up/down navigate | enter select)',
      choices: releaseChoices,
      theme: {
        prefix: '',
        icon: { cursor: '>' },
        style: {
          highlight: (text) => chalk.cyan(text),
          message: (text) => chalk.cyan(text)
        }
      }
    });
  }

  console.log('');
  logger.dim(`Selected version: ${targetTag}`);

  // Fetch assistant choices from release manifest
  console.log('');
  logger.dim('Fetching available assistants...');

  let assistantChoices;
  try {
    assistantChoices = await fetchAssistantChoices({ ...repoConfig, tag: targetTag });
  } catch (err) {
    throw new Error(`Failed to fetch assistant choices: ${err.message}`);
  }

  // Interactive assistant selection
  const selectedAssistant = await select({
    message: 'Which AI assistant are you using?',
    instructions: '(up/down navigate | enter select)',
    choices: assistantChoices.map(choice => ({
      ...choice,
      name: `${choice.name}`
    })),
    theme: {
      prefix: '',
      icon: { cursor: '>' },
      style: {
        highlight: (text) => chalk.cyan(text),
        message: (text) => chalk.cyan(text)
      }
    }
  });

  console.log('');
  logger.dim(`Selected: ${selectedAssistant.name}`);

  // Check existing metadata
  let existingMetadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
  if (existingMetadata) {
    existingMetadata = migrateLegacyMetadata(existingMetadata, process.cwd());

    logger.warn('\nAPM appears to already be initialized in this directory.');

    const proceed = await confirm({
      message: 'Continuing will update existing APM files. Proceed?',
      default: false
    });

    if (!proceed) {
      logger.warn('\nInstallation cancelled.\n');
      return;
    }
  }

  // Determine assistants to install
  const existingAssistantNames = existingMetadata?.assistants || [];
  const assistantNamesToInstall = mergeAssistants(existingAssistantNames, [selectedAssistant.name]);

  // Download and extract bundles
  const tempDir = join(process.cwd(), '.apm', 'temp-custom');

  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir, { recursive: true });

  let scaffoldsInstalled = false;
  let guidesInstalled = false;

  // Fetch manifest for assistant info
  const manifest = await fetchReleaseManifest({ ...repoConfig, tag: targetTag });

  console.log('');
  logger.dim('Installing templates...');

  for (const assistantName of assistantNamesToInstall) {
    const assistantInfo = manifest.assistants.find(a => a.name === assistantName);

    if (!assistantInfo) {
      logger.warn(`Assistant "${assistantName}" not found in manifest, skipping...`);
      continue;
    }

    const subDir = join(tempDir, assistantInfo.id);
    mkdirSync(subDir, { recursive: true });

    await downloadAndExtractBundle({
      ...repoConfig,
      tag: targetTag,
      bundleName: assistantInfo.bundle,
      destinationPath: subDir
    });

    // Read bundle manifest for scaffold installation
    const bundleManifest = readBundleManifest(subDir);

    // Install scaffolds from first bundle only
    if (!scaffoldsInstalled && bundleManifest) {
      const scaffoldResult = installScaffolds(subDir, process.cwd(), bundleManifest);
      if (scaffoldResult.installed.length > 0 || scaffoldResult.skipped.length > 0) {
        scaffoldsInstalled = true;
      }
    }

    // Install assistant files
    installFromTempDirectory(subDir, assistantName, process.cwd(), { installGuides: !guidesInstalled });
    if (!guidesInstalled) guidesInstalled = true;
  }

  // Clean up
  rmSync(tempDir, { recursive: true, force: true });

  // Save metadata
  createOrUpdateMetadata(process.cwd(), assistantNamesToInstall, targetTag, repoString);

  // Success message
  console.log('');
  logger.line();
  console.log('');
  console.log(chalk.green.bold('APM installed successfully from custom repository!'));
  logger.dim(`Template Version: ${targetTag}`);
  logger.dim(`Repository: ${repoString}`);
  console.log('');
  logger.dim('Next steps:');
  logger.dim('  1. Review the generated files in the .apm/ directory');
  logger.dim('  2. Customize the prompts and configuration for your specific project');
  logger.dim('  3. Start using APM with your AI assistant');
  logger.dim('  4. Run "apm update" anytime to get the latest improvements');
  console.log('');
}

// Configure program
program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version(CURRENT_CLI_VERSION)
  .configureHelp({
    formatHelp: () => {
      displayCustomHelp();
      return '';
    }
  });

// Default action (no command)
program.action(() => {
  displayBanner();
  logger.dim('\nUse --help to see available commands.\n');
});

// Init command
program
  .command('init')
  .description('Initialize a new APM project')
  .addOption(new Option('-t, --tag <tag>', 'Install templates from a specific Git tag (e.g., v0.5.1+templates.1)'))
  .addHelpText('after', `
${logger.chalk.gray('Examples:')}
  ${logger.chalk.white('apm init')}              Install latest compatible templates for current CLI version
  ${logger.chalk.white('apm init --tag v0.5.1+templates.2')}  Install specific template version

${logger.chalk.gray('Note:')} If no --tag is specified, the CLI will automatically find the latest
template version compatible with your current CLI version.
`)
  .action(async (options) => {
    try {
      await handleInit(options);
    } catch (err) {
      logger.error('\nInitialization failed');
      logger.error(err.message);
      process.exit(1);
    }
  });

// Update command
program
  .command('update')
  .description('Update APM templates to the latest compatible version')
  .addHelpText('after', `
${logger.chalk.gray('Note:')} This command updates templates to the latest version compatible with your
current CLI version. To update the CLI itself, use: ${logger.chalk.yellow('npm update -g agentic-pm')}
`)
  .action(async () => {
    try {
      await handleUpdate();
    } catch (err) {
      logger.error('\nUpdate failed');
      logger.error(err.message);
      process.exit(1);
    }
  });

// Custom command
program
  .command('custom')
  .description('Install APM templates from a custom repository')
  .addOption(new Option('-r, --repo <owner/repo>', 'GitHub repository (e.g., user/repo)'))
  .addOption(new Option('-t, --tag <tag>', 'Specific release tag'))
  .addHelpText('after', `
${logger.chalk.gray('Examples:')}
  ${logger.chalk.white('apm custom')}                              Interactive repository and version selection
  ${logger.chalk.white('apm custom --repo user/repo')}             Install from custom repository
  ${logger.chalk.white('apm custom --repo user/repo --tag v1.0')}  Install specific version from custom repo

${logger.chalk.gray('Note:')} Use this command to install templates from custom or forked repositories.
The repository must have releases with APM-compatible bundle assets.
`)
  .action(async (options) => {
    try {
      await handleCustom(options);
    } catch (err) {
      logger.error('\nCustom installation failed');
      logger.error(err.message);
      process.exit(1);
    }
  });

program.parse();
