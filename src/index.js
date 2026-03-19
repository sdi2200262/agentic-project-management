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
import { archiveCommand } from './commands/archive.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { statusCommand } from './commands/status.js';
import { migrateCommand } from './commands/migrate.js';
import { CLI_VERSION } from './core/constants.js';
import { CLIError } from './core/errors.js';
import logger from './ui/logger.js';

/**
 * Checks for stray positional arguments and suggests using -a.
 */
function checkStrayArgs(extras, commandName) {
  if (extras.length > 0) {
    logger.clearAndBanner();
    logger.error(`Unexpected arguments: ${extras.join(' ')}`);
    logger.info(`Did you mean: apm ${commandName} -a ${extras.join(' ')}`);
    process.exit(1);
  }
}

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
  console.log(`  ${chalk.bold('init')}              Initialize APM with official releases`);
  console.log(`  ${chalk.bold('custom')}            Install from a custom repository`);
  console.log(`  ${chalk.bold('update')}            Update installed assistant releases`);
  console.log(`  ${chalk.bold('archive')}           Archive current session or list archives`);
  console.log(`  ${chalk.bold('add')}               Add assistant(s) to existing installation`);
  console.log(`  ${chalk.bold('remove')}            Remove assistant(s) from installation`);
  console.log(`  ${chalk.bold('migrate')}           Migrate v0.5.x project to v1`);
  console.log(`  ${chalk.bold('status')}            Show installation status`);
  console.log('');
  console.log(chalk.cyan.bold('Shared Options:'));
  console.log(`  ${chalk.bold('-a, --assistant <id...>')}   Target assistant(s) ${chalk.dim('(init, custom, add, remove)')}`);
  console.log(`  ${chalk.bold('-t, --tag <tag>')}           Specific release version ${chalk.dim('(init, custom)')}`);
  console.log(`  ${chalk.bold('-n, --name <name>')}         Custom archive name ${chalk.dim('(update, archive)')}`);
  console.log(`  ${chalk.bold('-f, --force')}               Skip destructive action confirmations`);
  console.log(`                              ${chalk.dim('(update, archive, remove, custom --remove-repo/--clear)')}`);
  console.log('');
  console.log(chalk.cyan.bold('Custom Repository:'));
  console.log(`  ${chalk.bold('-r, --repo <repo>')}         Repository in owner/repo format`);
  console.log(`  ${chalk.bold('--add-repo <repos...>')}     Save custom repository(ies)`);
  console.log(`  ${chalk.bold('--remove-repo <repos...>')}  Remove saved repository(ies)`);
  console.log(`  ${chalk.bold('--list')}                    List saved custom repositories`);
  console.log(`  ${chalk.bold('--clear')}                   Clear all saved custom repositories`);
  console.log('');
  console.log(chalk.cyan.bold('Archive:'));
  console.log(`  ${chalk.bold('-l, --list')}                List archived sessions`);
  console.log(`  ${chalk.bold('--delete <name>')}           Delete a specific archive`);
  console.log(`  ${chalk.bold('--clear')}                   Delete all archives`);
  console.log('');
  console.log(chalk.cyan.bold('Global:'));
  console.log(`  ${chalk.bold('-v, -V, --version')}         Show version number`);
  console.log(`  ${chalk.bold('-h, --help')}                Show help`);
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
  .allowUnknownOption(true)
  .configureHelp({
    formatHelp: () => {
      displayHelp();
      return '';
    }
  });

// Known command names for typo suggestions
const KNOWN_COMMANDS = ['init', 'custom', 'update', 'archive', 'add', 'remove', 'status', 'migrate'];

// Default action (no command or unknown command)
program.action(() => {
  logger.clearAndBanner();
  const positionalArgs = program.args;
  if (positionalArgs.length > 0) {
    const unknown = positionalArgs[0];
    const suggestion = KNOWN_COMMANDS.find(c => c !== unknown && (unknown.startsWith(c) || c.startsWith(unknown)));
    logger.error(`Unknown command: ${unknown}`);
    if (suggestion) {
      logger.info(`Did you mean: apm ${suggestion}`);
    } else {
      logger.info('Run "apm --help" for available commands.');
    }
    process.exit(1);
  }
  logger.info('Use "apm --help" for available commands.');
});

program
  .command('init')
  .description('Initialize APM with official releases')
  .argument('[extras...]')
  .option('-t, --tag <tag>', 'Install specific release version')
  .option('-a, --assistant <ids...>', 'Assistant(s) to install')
  .action(async (extras, options) => {
    checkStrayArgs(extras, 'init');
    try {
      await initCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('custom')
  .description('Install from a custom repository')
  .argument('[extras...]')
  .option('-r, --repo <repo>', 'Repository in owner/repo format')
  .option('-t, --tag <tag>', 'Install specific release version (requires --repo)')
  .option('-a, --assistant <ids...>', 'Assistant(s) to install')
  .option('--add-repo <repos...>', 'Save custom repository(ies)')
  .option('--remove-repo <repos...>', 'Remove saved repository(ies)')
  .option('--list', 'List saved custom repositories')
  .option('--clear', 'Clear all saved custom repositories')
  .option('-f, --force', 'Skip destructive action confirmations')
  .action(async (extras, options) => {
    checkStrayArgs(extras, 'custom');
    try {
      await customCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('update')
  .description('Update installed assistant templates')
  .option('-f, --force', 'Skip destructive action confirmations')
  .option('-n, --name <name>', 'Custom archive name')
  .action(async (options) => {
    try {
      await updateCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('archive')
  .description('Archive current session or list archives')
  .option('-l, --list', 'List archived sessions')
  .option('-f, --force', 'Skip destructive action confirmations')
  .option('-n, --name <name>', 'Custom archive name')
  .option('--delete <name>', 'Delete a specific archive')
  .option('--clear', 'Delete all archives')
  .action(async (options) => {
    try {
      await archiveCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('add')
  .description('Add assistant(s) to existing installation')
  .argument('[extras...]')
  .option('-a, --assistant <ids...>', 'Assistant(s) to add')
  .action(async (extras, options) => {
    checkStrayArgs(extras, 'add');
    try {
      await addCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('remove')
  .description('Remove assistant(s) from installation')
  .argument('[extras...]')
  .option('-a, --assistant <ids...>', 'Assistant(s) to remove')
  .option('-f, --force', 'Skip destructive action confirmations')
  .action(async (extras, options) => {
    checkStrayArgs(extras, 'remove');
    try {
      await removeCommand(options);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('status')
  .description('Show installation status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('migrate')
  .description('Migrate v0.5.x project to v1')
  .argument('[extras...]')
  .option('-f, --force', 'Skip destructive action confirmations')
  .option('-a, --assistant <ids...>', 'Assistant(s) to install')
  .option('-t, --tag <tag>', 'Specific release version')
  .action(async (extras, options) => {
    checkStrayArgs(extras, 'migrate');
    try {
      await migrateCommand(options);
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
  // Handle Ctrl+C during prompts
  if (err?.name === 'ExitPromptError') {
    process.exit(0);
  }

  if (err instanceof CLIError) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.error(`Unexpected error: ${err.message}`);
  if (process.env.DEBUG === 'true') {
    console.error(err.stack);
  }
  process.exit(1);
}

// Handle --version before Commander (allowUnknownOption prevents automatic interception)
if (process.argv.includes('--version') || process.argv.includes('-v') || process.argv.includes('-V')) {
  console.log(CLI_VERSION);
  process.exit(0);
}

program.parse();
