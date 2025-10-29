#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { select, confirm } from '@inquirer/prompts';
import { fetchReleaseAssetUrl, downloadAndExtract, fetchLatestRelease } from './downloader.js';
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, cpSync, copyFileSync, readFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readMetadata, writeMetadata, detectInstalledAssistants, compareVersions, createBackup, getAssistantDirectory, restoreBackup, displayBanner } from './utils.js';

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
  console.log(`  ${chalk.bold('init')}          Initialize a new APM project`);
  console.log(`  ${chalk.bold('update')}        Update APM templates to the latest version`);
  console.log('');
  console.log(chalk.cyan.bold('Options:'));
  console.log(`  ${chalk.bold('-V, --version')}  Show version number`);
  console.log(`  ${chalk.bold('-h, --help')}     Show help`);
  console.log('');
  console.log(chalk.cyan.bold('Versioning:'));
  console.log(`  ${chalk.bold('CLI')} (${CURRENT_CLI_VERSION}) - Update with: ${chalk.yellow('npm update -g agentic-pm')}`);
  console.log(`  ${chalk.bold('Templates')} (v${CURRENT_CLI_VERSION}+templates.N) - Update with: ${chalk.yellow('apm update')}`);
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
  .action(async () => {
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
      console.log(chalk.gray('Fetching latest release...\n'));

      // Fetch the latest release to get version info
      const release = await fetchLatestRelease();
      const releaseVersion = release.tag_name.replace(/^v/, ''); // Remove 'v' prefix

      // Fetch the asset URL for the selected assistant, passing the release object to avoid duplicate API call
      const assetUrl = await fetchReleaseAssetUrl(assistant, release);
      
      // Download and extract the bundle to a temporary directory first
      const tempDir = join(process.cwd(), '.apm', 'temp-init');
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
      mkdirSync(tempDir, { recursive: true });
      
      console.log(chalk.gray('Downloading and extracting bundle...'));
      await downloadAndExtract(assetUrl, tempDir);

      // Create the .apm directory structure
      const apmDir = join(process.cwd(), '.apm');
      if (!existsSync(apmDir)) {
        mkdirSync(apmDir, { recursive: true });
      }

      // Move guides directory into .apm/
      const tempGuidesDir = join(tempDir, 'guides');
      const apmGuidesDir = join(apmDir, 'guides');
      if (existsSync(tempGuidesDir)) {
        if (existsSync(apmGuidesDir)) {
          rmSync(apmGuidesDir, { recursive: true, force: true });
        }
        cpSync(tempGuidesDir, apmGuidesDir, { recursive: true });
        console.log(chalk.gray('  Installed guides/'));
      }

      // Move commands directory into assistant-specific directory at PROJECT ROOT
      const assistantDir = getAssistantDirectory(assistant);
      const tempCommandsDir = join(tempDir, 'commands');
      const rootAssistantDir = join(process.cwd(), assistantDir);
      if (existsSync(tempCommandsDir)) {
        if (existsSync(rootAssistantDir)) {
          rmSync(rootAssistantDir, { recursive: true, force: true });
        }
        mkdirSync(rootAssistantDir, { recursive: true });
        cpSync(tempCommandsDir, rootAssistantDir, { recursive: true });
        console.log(chalk.gray(`  Installed ${assistantDir}/`));
      }

      // Create Memory directory with empty Memory_Root.md
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

      // Create metadata file
      createMetadata(process.cwd(), assistant, releaseVersion);

      // Success message with next steps
      console.log(chalk.green('\nAPM initialized successfully!'));
      console.log(chalk.gray(`Version: ${releaseVersion}`));
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
  .description('Update APM to the latest version')
  .action(async () => {
    try {
      // Display the APM banner
      displayBanner(CURRENT_CLI_VERSION);
      console.log(chalk.blue('🔄 APM Update Tool'));
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

      console.log(chalk.blue(`Current installation: ${assistant} v${metadata.version}`));

      // Fetch latest release
      const release = await fetchLatestRelease();
      const latestVersion = release.tag_name.replace(/^v/, '');

      // Compare versions
      const comparison = compareVersions(metadata.version, latestVersion);

      if (comparison >= 0) {
        console.log(chalk.green(`\nAPM is already at the latest version (v${metadata.version})`));
        console.log(chalk.gray('No update needed.\n'));
        return;
      }

      // Show update information
      console.log(chalk.cyan(`\nUpdate available: v${metadata.version} → v${latestVersion}`));
      console.log(chalk.gray(`Release: ${release.name || release.tag_name}`));
      if (release.body) {
        console.log(chalk.gray(`\nRelease notes:`));
        console.log(chalk.gray(release.body.substring(0, 300) + (release.body.length > 300 ? '...' : '')));
      }

      console.log(chalk.cyan('\nWhat will be updated:'));
      console.log(chalk.gray('  - Command files (slash commands)'));
      console.log(chalk.gray('  - Guide files (templates and documentation)'));

      console.log(chalk.cyan('\nWhat will be preserved:'));
      console.log(chalk.gray('  - User apm/ directories (apm/Memory/, apm/Implementation_Plan.md, etc.)'));
      console.log(chalk.gray('  - User content in directories outside APM control'));
      console.log(chalk.gray('  - Custom configurations (if any)'));

      // Confirm update
      const shouldUpdate = await confirm({
        message: `Update APM from v${metadata.version} to v${latestVersion}?`,
        default: false
      });

      if (!shouldUpdate) {
        console.log(chalk.yellow('\nUpdate cancelled.\n'));
        return;
      }

      console.log(chalk.blue('\n🔧 Starting update process...'));

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

        // Fetch and download the latest bundle
        const assetUrl = await fetchReleaseAssetUrl(assistant);
        await downloadAndExtract(assetUrl, tempDir);

        // Update files: remove old, copy new
        console.log(chalk.gray('\nUpdating files...'));
        
        // Update assistant-specific directory
        const oldAssistantDir = join(process.cwd(), assistantDir);
        const newCommandsDir = join(tempDir, 'commands');
        
        if (existsSync(oldAssistantDir)) {
          rmSync(oldAssistantDir, { recursive: true, force: true });
        }
        if (existsSync(newCommandsDir)) {
          mkdirSync(oldAssistantDir, { recursive: true });
          const items = readdirSync(newCommandsDir, { withFileTypes: true });
          for (const item of items) {
            const src = join(newCommandsDir, item.name);
            const dest = join(oldAssistantDir, item.name);
            if (item.isDirectory()) {
              cpSync(src, dest, { recursive: true });
            } else {
              copyFileSync(src, dest);
            }
          }
          console.log(chalk.green(`  Updated ${assistantDir}`));
        }

        // Update guides directory
        const oldGuidesDir = join(process.cwd(), 'guides');
        const newGuidesDir = join(tempDir, 'guides');
        
        if (existsSync(oldGuidesDir)) {
          rmSync(oldGuidesDir, { recursive: true, force: true });
        }
        if (existsSync(newGuidesDir)) {
          mkdirSync(oldGuidesDir, { recursive: true });
          const items = readdirSync(newGuidesDir, { withFileTypes: true });
          for (const item of items) {
            const src = join(newGuidesDir, item.name);
            const dest = join(oldGuidesDir, item.name);
            if (item.isDirectory()) {
              cpSync(src, dest, { recursive: true });
            } else {
              copyFileSync(src, dest);
            }
          }
          console.log(chalk.green(`  Updated guides`));
        }

        // Update metadata
        metadata.version = latestVersion;
        metadata.lastUpdated = new Date().toISOString();
        writeMetadata(process.cwd(), metadata);
        console.log(chalk.green(`  Updated metadata`));

        // Clean up temp directory
        rmSync(tempDir, { recursive: true, force: true });

        // Success!
        console.log(chalk.green(`\nAPM successfully updated to v${latestVersion}!`));
        console.log(chalk.gray(`View release notes: ${release.html_url}`));
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