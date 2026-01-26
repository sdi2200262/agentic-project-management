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
import { CLIError } from './core/errors.js';
import logger from './ui/logger.js';

const program = new Command();

program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version('1.0.0');

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
