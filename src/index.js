#!/usr/bin/env node

/**
 * APM CLI Entry Point
 *
 * Agentic Project Management CLI for installing and managing
 * AI assistant configurations.
 *
 * @module src/index
 */

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { customCommand } from './commands/custom.js';
import { updateCommand } from './commands/update.js';
import { CLI_VERSION } from './core/constants.js';
import { CLIError } from './core/errors.js';
import logger from './ui/logger.js';

/**
 * Displays custom formatted help output.
 */
function displayHelp() {
  const chalk = logger.chalk;

  console.log(chalk.cyan.bold('Agentic Project Management'));
  console.log('');
  console.log(chalk.gray('Usage:') + ' ' + chalk.white('apm [command] [options]'));
  console.log('');
  console.log(chalk.cyan.bold('Commands:'));
  console.log(`  ${chalk.bold('init')}              Initialize APM with official templates`);
  console.log(`  ${chalk.bold('init --tag <tag>')}  Install specific template version`);
  console.log(`  ${chalk.bold('custom')}            Install from a custom repository`);
  console.log(`  ${chalk.bold('update')}            Update installed assistant templates`);
  console.log('');
  console.log(chalk.cyan.bold('Options:'));
  console.log(`  ${chalk.bold('-v, -V, --version')}    Show version number`);
  console.log(`  ${chalk.bold('-h, --help')}           Show help`);
  console.log(`  ${chalk.bold('-r, --repo <repo>')}    Repository in owner/repo format (custom only)`);
  console.log(`  ${chalk.bold('-t, --tag <tag>')}      Install specific release version`);
  console.log(`  ${chalk.bold('-a, --assistant <id>')} Assistant to install (e.g., claude, copilot)`);
  console.log(`  ${chalk.bold('-f, --force')}          Skip confirmation prompts`);
  console.log('');
  console.log(chalk.cyan.bold('Versioning:'));
  console.log(`  ${chalk.bold('agentic-pm CLI')} (v${CLI_VERSION}):`);
  console.log(`            - Follows SemVer: ${chalk.blue.underline('https://semver.org/')}`);
  console.log(`            - Update with: ${chalk.yellow('npm update -g agentic-pm')}`);
  console.log('');
  console.log(`  ${chalk.bold('APM Releases')} (v1.x.x):`);
  console.log(`            - Follows SemVer: ${chalk.blue.underline('https://semver.org/')}`);
  console.log(`            - Compatible with v1.x.x agentic-pm CLI`);
  console.log(`            - Update via: ${chalk.yellow('apm update')}`);
  console.log('');
  console.log(chalk.gray('Learn more:') + ' ' + chalk.blue.underline('https://github.com/sdi2200262/agentic-project-management'));
}

const program = new Command();

program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version(CLI_VERSION, '-v, -V, --version')
  .configureHelp({
    formatHelp: () => {
      displayHelp();
      return '';
    }
  });

// Default action (no command)
program.action(() => {
  logger.banner();
  logger.dim('\nUse --help to see available commands.\n');
});

program
  .command('init')
  .description('Initialize APM with official templates')
  .option('-t, --tag <tag>', 'Install specific release version')
  .option('-a, --assistant <id>', 'Assistant to install (e.g., claude, copilot)')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('custom')
  .description('Initialize APM from a custom repository')
  .option('-r, --repo <repo>', 'Repository in owner/repo format')
  .option('-t, --tag <tag>', 'Install specific release version (requires --repo)')
  .option('-a, --assistant <id>', 'Assistant to install (e.g., claude, copilot)')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      await customCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('update')
  .description('Update installed assistant templates')
  .action(async (options) => {
    try {
      await updateCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

/**
 * Handles CLI errors and exits the process.
 *
 * @param {Error} err - Error to handle.
 */
function handleError(err) {
  if (err instanceof CLIError) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.error('An unexpected error occurred');
  logger.error(err.message, { error: err });
  process.exit(1);
}

program.parse();
