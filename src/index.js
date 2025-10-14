#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { fetchReleaseAssetUrl, downloadAndExtract } from './downloader.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

const program = new Command();

program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version('0.5.0');

program
  .command('init')
  .description('Initialize a new APM project')
  .action(async () => {
    try {
      console.log(chalk.blue('🚀 APM v0.5 Initializer'));
      console.log(chalk.gray('Setting up your Agentic Project Management environment...\n'));

      // Check if APM is already initialized in current directory
      const apmDir = resolve(process.cwd(), 'apm');
      const cursorBundleDir = resolve(process.cwd(), 'apm-cursor-bundle');
      const copilotBundleDir = resolve(process.cwd(), 'apm-copilot-bundle');
      
      if (existsSync(apmDir) || existsSync(cursorBundleDir) || existsSync(copilotBundleDir)) {
        console.log(chalk.yellow('⚠️  APM appears to already be initialized in this directory.'));
        console.log(chalk.yellow('   Continuing will overwrite existing files.\n'));
      }

      // Interactive prompt for AI assistant selection
      const assistant = await select({
        message: 'Which AI assistant are you using?',
        choices: [
          {
            name: 'Cursor',
            value: 'Cursor',
            description: 'Optimized for Cursor AI assistant'
          },
          {
            name: 'GitHub Copilot',
            value: 'GitHub Copilot',
            description: 'Optimized for GitHub Copilot'
          }
        ]
      });

      console.log(chalk.blue(`\n🎯 Selected: ${assistant}`));
      console.log(chalk.gray('Fetching appropriate asset bundle...\n'));

      // Fetch the asset URL
      const assetUrl = await fetchReleaseAssetUrl(assistant);
      
      // Download and extract the bundle
      await downloadAndExtract(assetUrl, process.cwd());

      // Success message with next steps
      console.log(chalk.green('\n🎉 APM project initialized successfully!'));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray('1. Review the generated files in the apm/, prompts/, and guides/ directories'));
      console.log(chalk.gray('2. Customize the prompts and configuration for your specific project'));
      console.log(chalk.gray('3. Start using APM with your AI assistant for project management\n'));

    } catch (error) {
      console.error(chalk.red('\n❌ Initialization failed:'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();