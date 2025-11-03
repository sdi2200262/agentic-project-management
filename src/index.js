#!/usr/bin/env node

import { Command, Option } from 'commander';
import chalk from 'chalk';
import { select, confirm } from '@inquirer/prompts';
import { downloadAndExtract, fetchLatestRelease, findLatestCompatibleTemplateTag, findLatestTemplateTag } from './downloader.js';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readMetadata, writeMetadata, detectInstalledAssistants, compareTemplateVersions, getAssistantDirectory, restoreBackup, displayBanner, isVersionNewer, checkForNewerTemplates, installFromTempDirectory, updateFromTempDirectory, parseTemplateTagParts, mergeAssistants, createAndZipBackup } from './utils.js';

const program = new Command();

// Dynamically read CLI version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const CURRENT_CLI_VERSION = packageJson.version;

// Custom help output function
function displayCustomHelp() {
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

program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version(CURRENT_CLI_VERSION)
  .configureHelp({
    formatHelp: (cmd, helper) => {
      displayCustomHelp();
      return ''; // Return empty string to prevent default output
    }
  });

// Display banner when no command is provided
program.action(() => {
  displayBanner(CURRENT_CLI_VERSION);
  console.log(chalk.gray('\nUse --help to see available commands.\n'));
});

/**
 * Creates or updates metadata file to store APM installation information (multi-assistant schema)
 * @param {string} projectPath - Path to the project directory
 * @param {string[]} assistants - Installed assistants
 * @param {string} templateVersion - APM template tag (e.g., v0.5.1+templates.2)
 */
function createOrUpdateMetadata(projectPath, assistants, templateVersion) {
  const metadataDir = resolve(projectPath, '.apm');
  const metadataPath = join(metadataDir, 'metadata.json');
  
  if (!existsSync(metadataDir)) {
    mkdirSync(metadataDir, { recursive: true });
  }
  
  const now = new Date().toISOString();
  const metadata = {
    cliVersion: CURRENT_CLI_VERSION,
    templateVersion,
    assistants: assistants || [],
    installedAt: existsSync(metadataPath) ? JSON.parse(readFileSync(metadataPath, 'utf8')).installedAt || now : now,
    lastUpdated: now
  };
  
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(chalk.gray(`  Metadata saved to ${metadataPath}`));
}

program
  .command('init')
  .description('Initialize a new APM project')
  .addOption(new Option('-t, --tag <tag>', 'Install templates from a specific Git tag (e.g., v0.5.1+templates.1)'))
  .addHelpText('after', `
${chalk.gray('Examples:')}
  ${chalk.white('apm init')}              Install latest compatible templates for current CLI version
  ${chalk.white('apm init --tag v0.5.1+templates.2')}  Install specific template version

${chalk.gray('Note:')} If no --tag is specified, the CLI will automatically find the latest
template version compatible with your current CLI version.
`)
  .action(async (options) => {
    try {
      // Display the APM banner
      displayBanner(CURRENT_CLI_VERSION);
      console.log(chalk.gray('Setting up Agentic Project Management in this directory...\n'));

      // Check existing metadata and migrate if needed
      const existingMetadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
      if (existingMetadata) {
        console.log(chalk.yellow('APM appears to already be initialized in this directory.'));
        console.log(chalk.yellow('Continuing may update existing APM files.'));
        const existingAssistantsMsg = Array.isArray(existingMetadata.assistants) && existingMetadata.assistants.length
          ? `Installed assistants detected: ${existingMetadata.assistants.join(', ')}`
          : 'No assistants recorded in metadata yet.';
        console.log(chalk.gray(`\n${existingAssistantsMsg}`));
        console.log(chalk.gray(`Note: Selecting an assistant will install/update ALL recorded assistants to the chosen tag.`));
        console.log('');
      }

      // Interactive prompt for AI assistant selection - all 10 assistants
      const assistant = await select({
        message: 'Which AI assistant are you using?',
        choices: [
          {
            name: 'Cursor',
            value: 'Cursor',
            description: 'Optimized for Cursor IDE'
          },
          {
            name: 'GitHub Copilot',
            value: 'GitHub Copilot',
            description: 'Optimized for GitHub Copilot in VS Code'
          },
          {
            name: 'Claude Code',
            value: 'Claude Code',
            description: 'Optimized for Anthropic Claude Code CLI'
          },
          {
            name: 'Gemini CLI',
            value: 'Gemini CLI',
            description: 'Optimized for Google Gemini CLI'
          },
          {
            name: 'Qwen Code',
            value: 'Qwen Code',
            description: 'Optimized for Alibaba Qwen Code CLI'
          },
          {
            name: 'opencode',
            value: 'opencode',
            description: 'Optimized for opencode CLI'
          },
          {
            name: 'Windsurf',
            value: 'Windsurf',
            description: 'Optimized for Windsurf IDE'
          },
          {
            name: 'Kilo Code',
            value: 'Kilo Code',
            description: 'Optimized for Kilo Code IDE'
          },
          {
            name: 'Auggie CLI',
            value: 'Auggie CLI',
            description: 'Optimized for Auggie CLI'
          },
          {
            name: 'Roo Code',
            value: 'Roo Code',
            description: 'Optimized for Roo Code IDE'
          }
        ]
      });

      console.log(chalk.blue(`\nSelected: ${assistant}`));
      
      // Determine target tag: either user-specified or latest compatible
      let targetTag;
      let releaseNotes = '';
      
      if (options.tag) {
        // User specified a specific tag
        targetTag = options.tag;
        console.log(chalk.yellow(`\nInstalling specific tag: ${targetTag}`));
        console.log(chalk.gray('  Validating tag...'));
        
        // Validate the tag exists
        try {
          const release = await fetchLatestRelease(targetTag);
          releaseNotes = release.body || '';
          console.log(chalk.gray(`  Found release: ${release.name || release.tag_name}`));
        } catch (error) {
          throw new Error(`Tag ${targetTag} not found or invalid: ${error.message}`);
        }

        // Apply warning policy for --tag
        const parsedTarget = parseTemplateTagParts(targetTag);
        if (!parsedTarget) {
          throw new Error(`Invalid tag format: ${targetTag}. Expected v<version>+templates.<build>`);
        }

        // Determine assistants which will be affected (ALL recorded + selected)
        const preExistingAssistants = existingMetadata?.assistants || detectInstalledAssistants(process.cwd());
        const assistantsAffected = mergeAssistants(preExistingAssistants, [assistant]);

        if (parsedTarget.baseVersion !== CURRENT_CLI_VERSION) {
          console.log('');
          console.log(chalk.red('[WARN] Different CLI base detected'));
          console.log(chalk.red(`  Target tag base: v${parsedTarget.baseVersion}`));
          console.log(chalk.red(`  Your CLI base:   v${CURRENT_CLI_VERSION}`));
          console.log(chalk.red(`  This will overwrite ALL assistants (${assistantsAffected.join(', ') || 'none'}) to ${targetTag}.`));
          const proceed = await confirm({
            message: chalk.red(`May cause incompatibilities. Proceed with init using ${targetTag}?`),
            default: false
          });
          if (!proceed) {
            console.log(chalk.yellow('\nInit cancelled.'));
            return;
          }
        } else {
          // Same base - check if older build than latest compatible
          const compatible = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);
          if (compatible) {
            const cmp = compareTemplateVersions(targetTag, compatible.tag_name);
            if (cmp === -1) {
              console.log('');
              console.log(chalk.yellow('[WARN] Template downgrade on same CLI base'));
              console.log(chalk.yellow(`  Selected tag:      ${targetTag}`));
              console.log(chalk.yellow(`  Latest compatible: ${compatible.tag_name}`));
              console.log(chalk.yellow(`  This will overwrite ALL assistants (${assistantsAffected.join(', ') || 'none'}) to ${targetTag}.`));
              const proceedOlder = await confirm({
                message: chalk.yellow('Proceed with downgrade?'),
                default: false
              });
              if (!proceedOlder) {
                console.log(chalk.yellow('\nInit cancelled.'));
                return;
              }
            }
          }
        }
      } else {
        // Find latest compatible template tag for current CLI version
        console.log(chalk.gray(`Finding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...\n`));
        const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);
        
        if (!compatibleResult) {
          // Check if there are newer templates available for other CLI versions
          const latestOverall = await findLatestTemplateTag();
          const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
          let errorMessage = `No compatible template tags found for CLI version ${CURRENT_CLI_VERSION}.`;
          
          if (newerInfo) {
            errorMessage += `\n\n[INFO] Newer template versions are available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`;
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
        releaseNotes = compatibleResult.release_notes;
        console.log(chalk.green(`[OK] Found compatible template version: ${targetTag}`));
        
        // Check if there are newer templates available for other CLI versions
        const latestOverall = await findLatestTemplateTag();
        const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
        if (newerInfo) {
          console.log(chalk.cyan(`\n[INFO] Note: Even newer templates are available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`));
          console.log(chalk.yellow(`To access those, update your CLI: ${chalk.white('npm update -g agentic-pm')} then run 'apm init' again.`));
        }
        
        if (releaseNotes) {
          const notesPreview = releaseNotes.substring(0, 200);
          console.log(chalk.gray(`\nRelease notes: ${notesPreview}${releaseNotes.length > 200 ? '...' : ''}`));
        }
        console.log('');
      }
      
      // Determine assistants to install/update (union existing + selected)
      const existingAssistants = existingMetadata?.assistants || [];
      const assistantsToInstall = mergeAssistants(existingAssistants, [assistant]);

      // Download and extract the bundle(s) to a temporary directory first
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

      // Create Memory directory with empty Memory_Root.md
      const apmDir = join(process.cwd(), '.apm');
      const memoryDir = join(apmDir, 'Memory');
      if (!existsSync(memoryDir)) {
        mkdirSync(memoryDir, { recursive: true });
      }
      const memoryRootPath = join(memoryDir, 'Memory_Root.md');
      if (!existsSync(memoryRootPath)) {
        writeFileSync(memoryRootPath, '');
        console.log(chalk.gray('  Created Memory/Memory_Root.md'));
      }

      // Create empty Implementation_Plan.md
      const implementationPlanPath = join(apmDir, 'Implementation_Plan.md');
      if (!existsSync(implementationPlanPath)) {
        writeFileSync(implementationPlanPath, '');
        console.log(chalk.gray('  Created Implementation_Plan.md'));
      }

      // Clean up temp directory
      rmSync(tempDir, { recursive: true, force: true });

      // Create/update metadata file with full template tag and assistants
      createOrUpdateMetadata(process.cwd(), assistantsToInstall, targetTag);

      // Success message with next steps
      console.log(chalk.green.bold('\nAPM initialized successfully!'));
      console.log(chalk.gray(`CLI Version: ${CURRENT_CLI_VERSION}`));
      console.log(chalk.gray(`Template Version: ${targetTag}`));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray('1. Review the generated files in the .apm/ directory'));
      console.log(chalk.gray('2. Customize the prompts and configuration for your specific project'));
      console.log(chalk.gray('3. Start using APM with your AI assistant'));
      console.log(chalk.gray('4. Run "apm update" anytime to get the latest improvements\n'));

    } catch (error) {
      console.error(chalk.red('\nInitialization failed...'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update APM templates to the latest compatible version')
  .addHelpText('after', `
${chalk.gray('Note:')} This command updates templates to the latest version compatible with your
current CLI version. To update the CLI itself, use: ${chalk.yellow('npm update -g agentic-pm')}
`)
  .action(async () => {
    try {
      // Display the APM banner
      displayBanner(CURRENT_CLI_VERSION);
      console.log(chalk.blue('[UPDATE] APM Update Tool'));
      console.log(chalk.gray('  Checking for updates...\n'));

      // Check if APM is initialized (and migrate if needed)
      const metadata = readMetadata(process.cwd(), CURRENT_CLI_VERSION);
      
      if (!metadata) {
        console.log(chalk.yellow('No APM installation detected in this directory.'));
        console.log(chalk.yellow('   Run "apm init" to initialize a new project.\n'));
        process.exit(1);
      }
      const assistants = Array.isArray(metadata.assistants) && metadata.assistants.length > 0
        ? metadata.assistants
        : detectInstalledAssistants(process.cwd());

      const installedVersion = metadata.templateVersion || metadata.version; // support migrated/old
      console.log(chalk.blue(`Current installation (all assistants): ${assistants.join(', ') || 'none'}`));
      console.log(chalk.blue(`Template Version: ${installedVersion}`));
      console.log(chalk.blue(`CLI Version: ${CURRENT_CLI_VERSION}`));

      // Find latest compatible template tag for current CLI version
      console.log(chalk.gray(`\n  Finding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`));
      const compatibleResult = await findLatestCompatibleTemplateTag(CURRENT_CLI_VERSION);
      
      if (!compatibleResult) {
        // Check if there are newer templates available for other CLI versions
        const latestOverall = await findLatestTemplateTag();
        const newerInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
        
        console.log(chalk.yellow(`\n[WARN] No compatible template tags found for CLI version ${CURRENT_CLI_VERSION}.`));
        
        if (newerInfo) {
          console.log(chalk.cyan(`\n[INFO] Newer template versions are available for CLI v${newerInfo.baseVersion}: ${newerInfo.tag}`));
          console.log(chalk.yellow(`\nYour current CLI version (${CURRENT_CLI_VERSION}) is incompatible with the latest templates.`));
          console.log(chalk.yellow(`To access these newer templates, please update your CLI:`));
          console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
          console.log(chalk.gray(`\nAfter updating your CLI, run 'apm update' again to get the latest templates.\n`));
        } else {
          console.log(chalk.yellow(`\nThis may indicate that no template releases have been published yet.`));
          console.log(chalk.yellow(`Please try again later, or check for releases at:`));
          console.log(chalk.blue.underline(`https://github.com/sdi2200262/agentic-project-management/releases\n`));
        }
        process.exit(1);
      }
      
      const latestCompatibleTag = compatibleResult.tag_name;
      
      // Decide update policy per rules:
      // - If installed base < CURRENT_CLI_VERSION: update available for sure
      // - If installed base == CURRENT_CLI_VERSION: compare build numbers
      // - If installed base > CURRENT_CLI_VERSION: do NOT downgrade; advise CLI update
      let comparison;
      const installedParsed = parseTemplateTagParts(installedVersion);
      if (installedParsed && installedParsed.baseVersion !== CURRENT_CLI_VERSION) {
        if (isVersionNewer(installedParsed.baseVersion, CURRENT_CLI_VERSION)) {
          // Installed templates are for a NEWER CLI base than current CLI → do not downgrade
          console.log(chalk.red(`\n[WARN] Installed templates are for a newer CLI base than your current CLI.`));
          console.log(chalk.red(`  Installed: v${installedParsed.baseVersion}`));
          console.log(chalk.red(`  Current CLI: v${CURRENT_CLI_VERSION}`));
          console.log(chalk.yellow(`\nTo align with installed templates, update your CLI:`));
          console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
          console.log(chalk.gray(`\nAlternatively, you can re-install templates compatible with your CLI using a specific tag via:`));
          console.log(chalk.white(`  ${chalk.bold('apm init --tag <tag-for-your-CLI>')}`));
          return;
        } else {
          // Installed templates are for an OLDER CLI base → update available
          comparison = -1;
        }
      } else {
        try {
          comparison = compareTemplateVersions(installedVersion, latestCompatibleTag);
        } catch (error) {
          // Invalid tag format in metadata - might be old format
          console.log(chalk.yellow(`\n[WARN] Installed version format may be outdated: ${installedVersion}`));
          console.log(chalk.yellow('Attempting to update to latest compatible version...'));
          comparison = -1; // Force update
        }
      }
      
      // Check if there are newer templates available for other CLI versions (for informational purposes)
      const latestOverall = await findLatestTemplateTag();
      const newerVersionInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
      
      // Handle comparison results
      let baseMismatch = false;
      if (isNaN(comparison)) {
        baseMismatch = true; // Shouldn't happen after explicit base policy above, but keep flag for messaging
        comparison = -1;
      }
      if (comparison === 0) {
        // Already up to date with compatible version
        console.log(chalk.green(`\n[OK] You have the latest template version compatible with your CLI!`));
        console.log(chalk.gray(`  Current CLI version: ${CURRENT_CLI_VERSION}`));
        console.log(chalk.gray(`  Current template version: ${installedVersion}`));
        console.log(chalk.gray(`  Latest compatible: ${latestCompatibleTag}`));
        
        if (newerVersionInfo) {
          console.log(chalk.cyan(`\n[INFO] Newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
          console.log(chalk.yellow(`\nTo access these newer templates, update your CLI:`));
          console.log(chalk.white(`  ${chalk.bold('npm update -g agentic-pm')}`));
          console.log(chalk.gray(`Then run 'apm update' again.\n`));
        } else {
          console.log(chalk.gray(`\nNo update needed.\n`));
        }
        return;
      } else if (comparison === 1) {
        // Installed version is newer (shouldn't happen, but handle gracefully)
        console.log(chalk.yellow(`\n[WARN] Installed version (${installedVersion}) appears newer than latest found (${latestCompatibleTag}).`));
        console.log(chalk.yellow('This is unusual but safe. No update needed.\n'));
        return;
      } else if (comparison === -1) {
        // Update available
        console.log(chalk.cyan(`\n[UPDATE] Update available for your CLI version!`));
        console.log(chalk.gray(`  Current template version: ${installedVersion}`));
        console.log(chalk.gray(`  Latest compatible version: ${latestCompatibleTag}`));
        console.log(chalk.cyan(`\n  Update: ${installedVersion} → ${latestCompatibleTag}`));
        
        if (compatibleResult.release_notes) {
          const notesPreview = compatibleResult.release_notes.substring(0, 300);
          console.log(chalk.gray(`  Release notes:`));
          console.log(chalk.gray(`  ${notesPreview + (compatibleResult.release_notes.length > 300 ? '...' : '')}`));
        }

        if (newerVersionInfo) {
          console.log(chalk.cyan(`\n[INFO] Note: Even newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
          console.log(chalk.yellow(`To access those, update your CLI: ${chalk.white('npm update -g agentic-pm')} then run 'apm update' again.`));
        }

        console.log(chalk.cyan('\n  What will be updated:'));
        console.log(chalk.gray('    - Command files (slash commands)'));
        console.log(chalk.gray('    - Guide files (templates and documentation)'));

        console.log(chalk.cyan('\n  What will be preserved:'));
        console.log(chalk.gray('    - User apm/ directories (apm/Memory/, apm/Implementation_Plan.md, etc.)'));
        console.log(chalk.gray('    - User content in directories outside APM control'));
        console.log(chalk.gray('    - Custom configurations (if any)'));
      } else {
        // Already handled (comparison === 0 or 1), return early
        return;
      }
      
      // Announce update normally; include a light note if base mismatched
      if (baseMismatch) {
        console.log(chalk.cyan(`\n[INFO] Installed templates are for a different CLI base. Updating to latest compatible.`));
      }
      console.log('');
      const shouldUpdate = await confirm({
        message: `Update ALL assistants from ${installedVersion} to ${latestCompatibleTag}?`,
        default: false
      });
      if (!shouldUpdate) {
        console.log(chalk.yellow('\nUpdate cancelled.\n'));
        return;
      }

      console.log(chalk.blue('\n[PROCESS] Starting update process...'));

      // Create backup by moving assistant directories and .apm/guides, then zipping
      console.log(chalk.gray('Creating backup...'));
      const { backupDir, zipPath } = createAndZipBackup(process.cwd(), assistants, installedVersion);
      console.log(chalk.green(`Backup created at: ${backupDir}`));

      try {
        // Download and extract new version to a temporary directory
        console.log(chalk.gray('\nDownloading update...'));
        const tempDir = join(process.cwd(), '.apm', 'temp-update');
        
        // Ensure temp directory is clean
        if (existsSync(tempDir)) {
          rmSync(tempDir, { recursive: true, force: true });
        }
        mkdirSync(tempDir, { recursive: true });

        // Download and extract the latest compatible bundles per assistant
        console.log(chalk.gray('\nDownloading update bundles...'));
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
        console.log(chalk.green(`  Updated metadata`));

        // Clean up temp directory
        rmSync(tempDir, { recursive: true, force: true });

        // Success!
        console.log(chalk.green(`\nAPM templates successfully updated to ${latestCompatibleTag}!`));
        console.log(chalk.gray(`CLI Version: ${CURRENT_CLI_VERSION}`));
        console.log(chalk.gray(`Template Version: ${latestCompatibleTag}`));
        // Remove unzipped backup folder, keep archive
        try {
          rmSync(backupDir, { recursive: true, force: true });
          if (zipPath) {
            console.log(chalk.gray(`\nBackup archive saved at: ${zipPath}`));
          } else {
            console.log(chalk.gray(`\nBackup directory saved at: ${backupDir}`));
          }
        } catch (_) {
          // If cleanup fails, still continue
          console.log(chalk.yellow(`\nCould not clean backup directory: ${backupDir}`));
        }
        console.log('');

      } catch (updateError) {
        console.error(chalk.red('\nUpdate failed...'), updateError.message);
        console.log(chalk.yellow('\nAttempting to restore from backup...'));
        
        try {
          // Restore from backup
          restoreBackup(backupDir, process.cwd());
          console.log(chalk.green('Successfully restored from backup.'));
        } catch (restoreError) {
          console.error(chalk.red('Failed to restore backup...'), restoreError.message);
          console.log(chalk.red(`Manual restoration may be required. Backup location: ${backupDir}`));
        }
        
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red('\nUpdate failed...'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();