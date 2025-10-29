#!/usr/bin/env node

import { Command, Option } from 'commander';
import chalk from 'chalk';
import { select, confirm } from '@inquirer/prompts';
import { downloadAndExtract, fetchLatestRelease, findLatestCompatibleTemplateTag, findLatestTemplateTag } from './downloader.js';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readMetadata, writeMetadata, detectInstalledAssistants, compareTemplateVersions, createBackup, getAssistantDirectory, restoreBackup, displayBanner, isVersionNewer, checkForNewerTemplates, installFromTempDirectory, updateFromTempDirectory } from './utils.js';

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
 * Creates metadata file to store APM installation information
 * @param {string} projectPath - Path to the project directory
 * @param {string} assistant - Selected AI assistant
 * @param {string} version - APM version
 */
function createMetadata(projectPath, assistant, version) {
  const metadataDir = resolve(projectPath, '.apm');
  const metadataPath = join(metadataDir, 'metadata.json');
  
  // Create .apm directory if it doesn't exist
  if (!existsSync(metadataDir)) {
    mkdirSync(metadataDir, { recursive: true });
  }
  
  const metadata = {
    version: version,
    assistant: assistant,
    installedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(chalk.gray(`Metadata saved to ${metadataPath}`));
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

      // Check if APM is already initialized in current directory
      const metadataPath = resolve(process.cwd(), '.apm', 'metadata.json');
      
      if (existsSync(metadataPath)) {
        console.log(chalk.yellow('APM appears to already be initialized in this directory.'));
        console.log(chalk.yellow('   Continuing will overwrite existing files.\n'));
      }

      // Interactive prompt for AI assistant selection - all 13 assistants
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
            name: 'Codex CLI',
            value: 'Codex CLI',
            description: 'Optimized for Codex CLI'
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
            name: 'CodeBuddy',
            value: 'CodeBuddy',
            description: 'Optimized for CodeBuddy CLI'
          },
          {
            name: 'Roo Code',
            value: 'Roo Code',
            description: 'Optimized for Roo Code IDE'
          },
          {
            name: 'Amazon Q Developer CLI',
            value: 'Amazon Q Developer CLI',
            description: 'Optimized for Amazon Q Developer CLI'
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
        console.log(chalk.gray('Validating tag...\n'));
        
        // Validate the tag exists
        try {
          const release = await fetchLatestRelease(targetTag);
          releaseNotes = release.body || '';
          console.log(chalk.gray(`Found release: ${release.name || release.tag_name}`));
        } catch (error) {
          throw new Error(`Tag ${targetTag} not found or invalid: ${error.message}`);
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
      
      // Download and extract the bundle to a temporary directory first
      const tempDir = join(process.cwd(), '.apm', 'temp-init');
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
      mkdirSync(tempDir, { recursive: true });
      
      console.log(chalk.gray('Downloading and extracting bundle...'));
      await downloadAndExtract(targetTag, assistant, tempDir);

      // Install files from temp directory
      installFromTempDirectory(tempDir, assistant, process.cwd());

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

      // Create metadata file with full template tag
      createMetadata(process.cwd(), assistant, targetTag);

      // Success message with next steps
      console.log(chalk.green('\nAPM initialized successfully!'));
      console.log(chalk.gray(`CLI Version: ${CURRENT_CLI_VERSION}`));
      console.log(chalk.gray(`Template Version: ${targetTag}`));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray('1. Review the generated files in the .apm/ directory'));
      console.log(chalk.gray('2. Customize the prompts and configuration for your specific project'));
      console.log(chalk.gray('3. Start using APM with your AI assistant for project management'));
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
      console.log(chalk.gray('Checking for updates...\n'));

      // Check if APM is initialized
      const metadata = readMetadata(process.cwd());
      
      if (!metadata) {
        console.log(chalk.yellow('No APM installation detected in this directory.'));
        console.log(chalk.yellow('   Run "apm init" to initialize a new project.\n'));
        process.exit(1);
      }

      // Detect installed assistant
      const detectedAssistants = detectInstalledAssistants(process.cwd());
      
      if (detectedAssistants.length === 0) {
        console.log(chalk.yellow('No AI assistant directories detected.'));
        console.log(chalk.yellow('   APM installation may be corrupted. Consider running "apm init" again.\n'));
        process.exit(1);
      }

      let assistant = metadata.assistant;
      
      // If multiple assistants detected, ask user which one to update
      if (detectedAssistants.length > 1) {
        console.log(chalk.yellow(`Multiple AI assistants detected: ${detectedAssistants.join(', ')}`));
        assistant = await select({
          message: 'Which assistant would you like to update?',
          choices: detectedAssistants.map(a => ({ name: a, value: a }))
        });
      } else if (!detectedAssistants.includes(assistant)) {
        // Metadata doesn't match detected assistant
        console.log(chalk.yellow(`Metadata shows ${assistant}, but detected: ${detectedAssistants[0]}`));
        assistant = detectedAssistants[0];
      }

      const installedVersion = metadata.version; // This is a full template tag (e.g., "v0.5.0+templates.1")
      console.log(chalk.blue(`Current installation: ${assistant} ${installedVersion}`));
      console.log(chalk.blue(`CLI Version: ${CURRENT_CLI_VERSION}`));

      // Find latest compatible template tag for current CLI version
      console.log(chalk.gray(`\nFinding latest compatible templates for CLI v${CURRENT_CLI_VERSION}...`));
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
      
      // Compare template versions
      let comparison;
      try {
        comparison = compareTemplateVersions(installedVersion, latestCompatibleTag);
      } catch (error) {
        // Invalid tag format in metadata - might be old format
        console.log(chalk.yellow(`\n[WARN] Installed version format may be outdated: ${installedVersion}`));
        console.log(chalk.yellow('Attempting to update to latest compatible version...'));
        comparison = -1; // Force update
      }
      
      // Check if there are newer templates available for other CLI versions (for informational purposes)
      const latestOverall = await findLatestTemplateTag();
      const newerVersionInfo = checkForNewerTemplates(CURRENT_CLI_VERSION, latestOverall);
      
      // Handle comparison results
      if (isNaN(comparison)) {
        // Base versions differ - incompatibility
        console.log(chalk.red(`\n[ERROR] Version incompatibility detected!`));
        console.log(chalk.red(`Installed templates (${installedVersion}) are for a different CLI version than your current CLI (${CURRENT_CLI_VERSION}).`));
        console.log(chalk.red(`Latest compatible with your CLI: ${latestCompatibleTag}`));
        
        if (newerVersionInfo) {
          console.log(chalk.cyan(`\n[INFO] Newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
        }
        
        console.log(chalk.yellow(`\nTo resolve this:`));
        console.log(chalk.yellow(`1. Update your CLI: ${chalk.white('npm update -g agentic-pm')}`));
        console.log(chalk.yellow(`2. Then run 'apm update' again\n`));
        process.exit(1);
      } else if (comparison === 0) {
        // Already up to date with compatible version
        console.log(chalk.green(`\n[OK] You have the latest template version compatible with your CLI!`));
        console.log(chalk.gray(`Current CLI version: ${CURRENT_CLI_VERSION}`));
        console.log(chalk.gray(`Current template version: ${installedVersion}`));
        console.log(chalk.gray(`Latest compatible: ${latestCompatibleTag}`));
        
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
        console.log(chalk.gray(`Current template version: ${installedVersion}`));
        console.log(chalk.gray(`Latest compatible version: ${latestCompatibleTag}`));
        console.log(chalk.cyan(`\nUpdate: ${installedVersion} → ${latestCompatibleTag}`));
        
        if (compatibleResult.release_notes) {
          const notesPreview = compatibleResult.release_notes.substring(0, 300);
          console.log(chalk.gray(`\nRelease notes:`));
          console.log(chalk.gray(notesPreview + (compatibleResult.release_notes.length > 300 ? '...' : '')));
        }

        if (newerVersionInfo) {
          console.log(chalk.cyan(`\n[INFO] Note: Even newer templates are available for CLI v${newerVersionInfo.baseVersion}: ${newerVersionInfo.tag}`));
          console.log(chalk.yellow(`To access those, update your CLI: ${chalk.white('npm update -g agentic-pm')} then run 'apm update' again.`));
        }

        console.log(chalk.cyan('\nWhat will be updated:'));
        console.log(chalk.gray('  - Command files (slash commands)'));
        console.log(chalk.gray('  - Guide files (templates and documentation)'));

        console.log(chalk.cyan('\nWhat will be preserved:'));
        console.log(chalk.gray('  - User apm/ directories (apm/Memory/, apm/Implementation_Plan.md, etc.)'));
        console.log(chalk.gray('  - User content in directories outside APM control'));
        console.log(chalk.gray('  - Custom configurations (if any)'));
      } else {
        // Already handled (comparison === 0 or 1), return early
        return;
      }
      
      const shouldUpdate = await confirm({
        message: `Update APM templates from ${installedVersion} to ${latestCompatibleTag}?`,
        default: false
      });

      if (!shouldUpdate) {
        console.log(chalk.yellow('\nUpdate cancelled.\n'));
        return;
      }

      console.log(chalk.blue('\n[PROCESS] Starting update process...'));

      // Create backup
      const assistantDir = getAssistantDirectory(assistant);
      const dirsToBackup = [assistantDir, 'guides', '.apm'];
      
      console.log(chalk.gray('Creating backup...'));
      const backupDir = createBackup(process.cwd(), dirsToBackup);
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

        // Download and extract the latest compatible bundle
        await downloadAndExtract(latestCompatibleTag, assistant, tempDir);

        // Update files: remove old, copy new
        console.log(chalk.gray('\nUpdating files...'));
        updateFromTempDirectory(tempDir, assistant, process.cwd());

        // Update metadata
        metadata.version = latestCompatibleTag;
        metadata.lastUpdated = new Date().toISOString();
        writeMetadata(process.cwd(), metadata);
        console.log(chalk.green(`  Updated metadata`));

        // Clean up temp directory
        rmSync(tempDir, { recursive: true, force: true });

        // Success!
        console.log(chalk.green(`\nAPM templates successfully updated to ${latestCompatibleTag}!`));
        console.log(chalk.gray(`CLI Version: ${CURRENT_CLI_VERSION}`));
        console.log(chalk.gray(`Template Version: ${latestCompatibleTag}`));
        console.log(chalk.gray(`\nBackup saved at: ${backupDir}`));
        console.log(chalk.gray('You can safely delete the backup directory once you\'ve verified everything works.\n'));

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