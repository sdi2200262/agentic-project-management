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
import { select, confirm } from '@inquirer/prompts';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import { downloadAndExtract, fetchLatestRelease, findLatestCompatibleTemplateTag, findLatestTemplateTag } from './downloader.js';
import { readMetadata, writeMetadata, detectInstalledAssistants, compareTemplateVersions, restoreBackup, displayBanner, isVersionNewer, checkForNewerTemplates, installFromTempDirectory, updateFromTempDirectory, parseTemplateTagParts, mergeAssistants, createAndZipBackup } from './utils.js';

const program = new Command();

// Dynamically read CLI version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const CURRENT_CLI_VERSION = packageJson.version;


/**
 * AI assistant choices for interactive selection
 * @constant {Object[]}
 */
const ASSISTANT_CHOICES = [
  { name: 'Cursor', value: 'Cursor', description: 'Optimized for Cursor IDE' },
  { name: 'GitHub Copilot', value: 'GitHub Copilot', description: 'Optimized for GitHub Copilot in VS Code' },
  { name: 'Claude Code', value: 'Claude Code', description: 'Optimized for Anthropic Claude Code CLI' },
  { name: 'Gemini CLI', value: 'Gemini CLI', description: 'Optimized for Google Gemini CLI' },
  { name: 'Qwen Code', value: 'Qwen Code', description: 'Optimized for Alibaba Qwen Code CLI' },
  { name: 'opencode', value: 'opencode', description: 'Optimized for opencode CLI' },
  { name: 'Windsurf', value: 'Windsurf', description: 'Optimized for Windsurf IDE' },
  { name: 'Kilo Code', value: 'Kilo Code', description: 'Optimized for Kilo Code IDE' },
  { name: 'Auggie CLI', value: 'Auggie CLI', description: 'Optimized for Auggie CLI' },
  { name: 'Roo Code', value: 'Roo Code', description: 'Optimized for Roo Code IDE' }
];

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
  console.log(`  ${chalk.bold('init')}              Initialize a new APM project`);
  console.log(`  ${chalk.bold('init --tag <tag>')}  Install specific template version (e.g., v0.5.1+templates.2)`);
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
 * @param {string} templateVersion - APM template tag (e.g., v0.5.1+templates.2)
 * @private
 */
function createOrUpdateMetadata(projectPath, assistants, templateVersion) {
  const metadataDir = resolve(projectPath, '.apm');
  const metadataPath = join(metadataDir, 'metadata.json');
  
  if (!existsSync(metadataDir)) {
    mkdirSync(metadataDir, { recursive: true });
  }
  
  const now = new Date().toISOString();
  const existingMetadata = existsSync(metadataPath) 
    ? JSON.parse(readFileSync(metadataPath, 'utf8'))
    : null;
  
  const metadata = {
    cliVersion: CURRENT_CLI_VERSION,
    templateVersion,
    assistants: assistants || [],
    installedAt: existingMetadata?.installedAt || now,
    lastUpdated: now
  };
  
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Creates initial project files (Memory_Root.md, Implementation_Plan.md, Specifications.md)
 * @param {string} apmDir - Path to .apm directory
 * @private
 */
function createInitialFiles(apmDir) {
  const memoryDir = join(apmDir, 'Memory');
  
  if (!existsSync(memoryDir)) {
    mkdirSync(memoryDir, { recursive: true });
  }
  
  // Create Memory_Root.md
  const memoryRootPath = join(memoryDir, 'Memory_Root.md');
  if (!existsSync(memoryRootPath)) {
    const memoryRootContent = `# <Project Name> – APM Memory Root
**Project Overview:** [To be filled by Manager Agent before first stage execution]
**Manager Handoffs:** 0

---

`;
    writeFileSync(memoryRootPath, memoryRootContent);
    logger.dim(`  Created Memory/Memory_Root.md`);
  }

  // Create Implementation_Plan.md
  const implementationPlanPath = join(apmDir, 'Implementation_Plan.md');
  if (!existsSync(implementationPlanPath)) {
    const implementationPlanContent = `# <Project Name> – APM Implementation Plan
* **Last Modification:** [To be filled by Planner Agent before Work Breakdown]
* **Project Overview:** [To be filled by Planner Agent before Work Breakdown]
* **Agents:** [To be filled by Planner Agent during Work Breakdown]
* **Stages:** [To be filled by Planner Agent during Work Breakdown]

---

`;
    writeFileSync(implementationPlanPath, implementationPlanContent);
    logger.dim(`  Created Implementation_Plan.md`);
  }

  // Create Specifications.md
  const specificationsPath = join(apmDir, 'Specifications.md');
  if (!existsSync(specificationsPath)) {
    const specificationsContent = `# <Project Name> – APM Specifications
**Last Modification:** [To be filled by Planner Agent during Work Breakdown]

---

`;
    writeFileSync(specificationsPath, specificationsContent);
    logger.dim(`  Created Specifications.md`);
  }
}

/**
 * Handles the init command logic
 * @param {Object} options - Command options
 * @private
 */
async function handleInit(options) {
  const chalk = logger.chalk;
  
  displayBanner(CURRENT_CLI_VERSION);

  // Check existing metadata
  const existingMetadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
  
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

  // Interactive assistant selection with custom styling
  const assistant = await select({
    message: 'Which AI assistant are you using?',
    instructions: '(↑↓ navigate | enter select)',
    choices: ASSISTANT_CHOICES.map(choice => ({
      ...choice,
      name: `○ ${choice.name}`
    })),
    theme: {
      prefix: '',
      icon: { cursor: ' ' },
      style: {
        highlight: (text) => chalk.cyan(text.replace('○', '●')),
        message: (text) => chalk.cyan(text)
      }
    }
  });

  console.log('');
  logger.dim(`Selected: ${assistant}`);

  // Determine target tag
  let targetTag;

  if (options.tag) {
    targetTag = options.tag;
    console.log('');
    logger.warn(`Installing specific tag: ${targetTag}`);
    logger.dim(`  Validating tag...`);

    try {
      await fetchLatestRelease(targetTag);
    } catch (err) {
      throw new Error(`Tag ${targetTag} not found or invalid: ${err.message}`);
    }

    const parsedTarget = parseTemplateTagParts(targetTag);
    if (!parsedTarget) {
      throw new Error(`Invalid tag format: ${targetTag}. Expected v<version>+templates.<build>`);
    }

    const preExistingAssistants = existingMetadata?.assistants || detectInstalledAssistants(process.cwd());
    const assistantsAffected = mergeAssistants(preExistingAssistants, [assistant]);

    if (parsedTarget.baseVersion !== CURRENT_CLI_VERSION) {
      console.log('');
      logger.error('Different CLI base detected');
      logger.error(`Target tag base: v${parsedTarget.baseVersion}`);
      logger.error(`Your CLI base:   v${CURRENT_CLI_VERSION}`);
      logger.error(`This will overwrite ALL assistants (${assistantsAffected.join(', ') || 'none'}) to ${targetTag}.`);
      
      const proceed = await confirm({
        message: chalk.red(`May cause incompatibilities. Proceed with init using ${targetTag}?`),
        default: false
      });
      
      if (!proceed) {
        logger.warn('\nInit cancelled.');
        return;
      }
    } else {
      const compatible = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);
      
      if (compatible) {
        const cmp = compareTemplateVersions(targetTag, compatible.tag_name);
        
        if (cmp === -1) {
          console.log('');
          logger.warn('Template downgrade on same CLI base');
          logger.warn(`Selected tag:      ${targetTag}`);
          logger.warn(`Latest compatible: ${compatible.tag_name}`);
          logger.warn(`This will overwrite ALL assistants (${assistantsAffected.join(', ') || 'none'}) to ${targetTag}.`);
          
          const proceedOlder = await confirm({
            message: chalk.yellow('Proceed with downgrade?'),
            default: false
          });
          
          if (!proceedOlder) {
            logger.warn('\nInit cancelled.');
            return;
          }
        }
      }
    }
  } else {
    console.log('');
    logger.dim(`Finding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`);

    const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);

    if (!compatibleResult) {
      const latestOverall = await findLatestTemplateTag();
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

    const latestOverall = await findLatestTemplateTag();
    const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);

    if (newerInfo) {
      console.log('');
      logger.dim(`Note: Newer templates available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`);
      logger.dim(`  Update CLI with: npm update -g agentic-pm`);
    }
  }
  
  // Determine assistants to install
  const existingAssistants = existingMetadata?.assistants || [];
  const assistantsToInstall = mergeAssistants(existingAssistants, [assistant]);

  // Download and extract bundles to temp directory
  const tempDir = join(process.cwd(), '.apm', 'temp-init');
  
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir, { recursive: true });
  
  let guidesInstalled = false;
  
  for (const a of assistantsToInstall) {
    const subDir = join(tempDir, a.replace(/[^a-zA-Z0-9._-]/g, '_'));
    mkdirSync(subDir, { recursive: true });
    await downloadAndExtract(targetTag, a, subDir);
    installFromTempDirectory(subDir, a, process.cwd(), { installGuides: !guidesInstalled });
    if (!guidesInstalled) guidesInstalled = true;
  }

  // Create initial project files
  const apmDir = join(process.cwd(), '.apm');
  createInitialFiles(apmDir);

  // Clean up
  rmSync(tempDir, { recursive: true, force: true });

  // Save metadata
  createOrUpdateMetadata(process.cwd(), assistantsToInstall, targetTag);

  // Success message
  console.log('');
  logger.line();
  console.log('');
  console.log(chalk.green.bold('APM initialized successfully!'));
  logger.dim(`CLI Version: ${CURRENT_CLI_VERSION}`);
  logger.dim(`Template Version: ${targetTag}`);
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
  
  displayBanner(CURRENT_CLI_VERSION);
  logger.custom('UPDATE', 'APM Update Tool', chalk.blue);
  logger.dim('Checking for updates...\n', { indent: true });

  const metadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
  
  if (!metadata) {
    logger.warn('No APM installation detected in this directory.');
    logger.warn('Run "apm init" to initialize a new project.\n');
    process.exit(1);
  }
  
  const assistants = Array.isArray(metadata.assistants) && metadata.assistants.length > 0
    ? metadata.assistants
    : detectInstalledAssistants(process.cwd());

  const installedVersion = metadata.templateVersion || metadata.version;
  
  console.log(chalk.blue(`Current installation (all assistants): ${assistants.join(', ') || 'none'}`));
  console.log(chalk.blue(`Template Version: ${installedVersion}`));
  console.log(chalk.blue(`CLI Version: ${CURRENT_CLI_VERSION}`));

  logger.dim(`\nFinding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`, { indent: true });
  
  const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);
  
  if (!compatibleResult) {
    const latestOverall = await findLatestTemplateTag();
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
      console.log(chalk.blue.underline('https://github.com/sdi2200262/agentic-project-management/releases\n'));
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
  
  const latestOverall = await findLatestTemplateTag();
  const newerVersionInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
  
  let baseMismatch = false;
  if (isNaN(comparison)) {
    baseMismatch = true;
    comparison = -1;
  }
  
  if (comparison === 0) {
    logger.success('\nYou have the latest template version compatible with your CLI!');
    logger.dim(`Current CLI version: ${CURRENT_CLI_VERSION}`, { indent: true });
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
  console.log(chalk.cyan(`\nUpdate: ${installedVersion} → ${latestCompatibleTag}`));
  
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
  logger.dim('- User apm/ directories (apm/Memory/, apm/Implementation_Plan.md, etc.)', { indent: true });
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

    logger.dim('\nDownloading update bundles...');
    let guidesUpdated = false;
    
    for (const a of assistants) {
      const subDir = join(tempDir, a.replace(/[^a-zA-Z0-9._-]/g, '_'));
      mkdirSync(subDir, { recursive: true });
      await downloadAndExtract(latestCompatibleTag, a, subDir);
      updateFromTempDirectory(subDir, a, process.cwd(), { installGuides: !guidesUpdated });
      if (!guidesUpdated) guidesUpdated = true;
    }

    // Update metadata
    metadata.templateVersion = latestCompatibleTag;
    metadata.cliVersion = CURRENT_CLI_VERSION;
    metadata.assistants = assistants;
    metadata.lastUpdated = new Date().toISOString();
    writeMetadata(process.cwd(), metadata);
    logger.success('Updated metadata');

    // Clean up temp
    rmSync(tempDir, { recursive: true, force: true });

    // Success
    console.log(chalk.green(`\nAPM templates successfully updated to ${latestCompatibleTag}!`));
    logger.dim(`CLI Version: ${CURRENT_CLI_VERSION}`);
    logger.dim(`Template Version: ${latestCompatibleTag}`);
    
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
  displayBanner(CURRENT_CLI_VERSION);
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

program.parse();
