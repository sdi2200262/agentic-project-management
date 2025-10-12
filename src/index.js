#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('apm')
  .description('Agentic Project Management CLI')
  .version('0.5.0');

program
  .command('init')
  .description('Initialize a new APM project')
  .action(() => {
    console.log(chalk.blue('APM v0.5 Initializer'));
  });

program.parse();