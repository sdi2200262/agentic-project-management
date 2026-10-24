/**
 * CLI Prompts Module
 *
 * Provides user interaction prompts using Inquirer.
 *
 * @module src/ui/prompts
 */

import { select, input, confirm, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import { CLIError } from '../core/errors.js';
import { formatAssistant } from '../core/assistants.js';
import logger from './logger.js';

/**
 * Whether the CLI can prompt: both stdin and stdout must be a terminal.
 * Without one (piped, redirected, or run by an agent), a prompt would read
 * end-of-input and the process would exit without doing anything.
 *
 * @returns {boolean} True when prompts can run.
 */
export function isInteractive() {
  return !!(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Throws when a prompt cannot run, naming the option that avoids it.
 *
 * @param {string} question - The question the prompt would ask.
 * @param {string} [hint] - How to run the command without the prompt.
 */
function requireInteractive(question, hint) {
  if (!isInteractive()) {
    throw CLIError.notInteractive(question, hint);
  }
}

/**
 * Shared theme for select prompts — disables default hint.
 */
const SELECT_THEME = { helpMode: 'never' };

/**
 * Number of extra lines appended by withSelectHint().
 */
const HINT_LINES = 4;

/**
 * Appends a separator and navigation hint to a choices array.
 */
function withSelectHint(choices) {
  return [
    ...choices,
    new Separator(' '),
    new Separator(chalk.gray('─'.repeat(80))),
    new Separator(' '),
    new Separator(chalk.dim(' ↑↓ to navigate • Enter to select • Ctrl+C to cancel'))
  ];
}

/**
 * Prompts user to select an assistant from a list.
 *
 * @param {Object[]} assistants - Array of assistant objects.
 * @param {string} assistants[].id - Assistant identifier.
 * @param {string} assistants[].name - Display name.
 * @param {string} assistants[].description - Description text.
 * @returns {Promise<string>} Selected assistant ID.
 */
export async function selectAssistant(assistants, { header, hint = 'Pass -a <id> to choose the assistant.' } = {}) {
  requireInteractive('Select an assistant:', hint);
  logger.clearAndBanner();
  if (header) {
    console.log('  ' + chalk.dim(header));
    console.log('');
  }
  const choices = assistants.map(a => ({
    name: a.description ? `${formatAssistant(a.id, a.name)} - ${a.description}` : formatAssistant(a.id, a.name),
    value: a.id
  }));

  const result = await select({
    message: 'Select an assistant:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Prompts user to select a release from a list.
 *
 * @param {Object[]} releases - Array of release objects.
 * @param {string} releases[].tag_name - Release tag name.
 * @param {string} releases[].name - Release name.
 * @returns {Promise<string>} Selected release tag name.
 */
export async function selectRelease(releases, { header, hint = 'Pass -t <tag> to choose the release.' } = {}) {
  requireInteractive('Select a release:', hint);
  logger.clearAndBanner();
  if (header) {
    console.log('  ' + chalk.dim(header));
    console.log('');
  }
  const choices = releases.map(r => ({
    name: r.name || r.tag_name,
    value: r.tag_name
  }));

  const result = await select({
    message: 'Select a release:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Prompts user to select from saved custom repos or enter a new one.
 *
 * @param {Object[]} savedRepos - Array of saved repo objects.
 * @param {string} savedRepos[].repo - Repository in owner/repo format.
 * @returns {Promise<string|null>} Selected repo or null for new repo entry.
 */
export async function selectCustomRepo(savedRepos, { header, hint = 'Pass -r <owner/repo> to choose the repository.' } = {}) {
  requireInteractive('Select a repository:', hint);
  logger.clearAndBanner();
  if (header) {
    console.log('  ' + chalk.dim(header));
    console.log('');
  }
  const choices = [
    { name: 'Enter a new repository', value: null },
    ...savedRepos.map(r => ({
      name: r.repo,
      value: r.repo
    }))
  ];

  const result = await select({
    message: 'Select a repository:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Prompts user to enter a custom repository.
 *
 * @returns {Promise<string>} Repository in owner/repo format.
 */
export async function inputRepository({ hint = 'Pass -r <owner/repo> to choose the repository.' } = {}) {
  requireInteractive('Repository:', hint);
  logger.clearAndBanner();
  console.log('  ' + chalk.dim('Enter a custom APM repository in owner/repo format'));
  console.log('  ' + chalk.dim('Example: my-org/my-custom-apm-repo'));
  console.log('');
  console.log('  ' + chalk.dim('Enter to submit • Ctrl+C to cancel'));
  console.log('');
  const result = await input({
    message: 'Repository:',
    validate: value => {
      if (!value.includes('/')) {
        return 'Please enter in owner/repo format';
      }
      return true;
    }
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Prompts user to confirm an action.
 *
 * @param {string} message - Confirmation message.
 * @param {Object} [options={}] - Options.
 * @param {boolean} [options.defaultValue=false] - Default value.
 * @param {string} [options.header] - Header hint text.
 * @param {string} [options.hint] - How to run the command without this prompt.
 * @returns {Promise<boolean>} User's confirmation.
 */
export async function confirmAction(message, { defaultValue = false, header, hint } = {}) {
  requireInteractive(message, hint);
  logger.clearAndBanner();
  if (header) {
    console.log('  ' + chalk.dim(header));
    console.log('');
  }
  const result = await confirm({
    message,
    default: defaultValue
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Displays security disclaimer for custom repos and prompts for confirmation.
 *
 * @returns {Promise<boolean>} Whether user accepted the disclaimer.
 */
export async function confirmSecurityDisclaimer({ hint } = {}) {
  requireInteractive('Do you understand and accept the risks?', hint
    || 'Run it once in an interactive terminal and choose to skip the disclaimer for this repository.');
  logger.clearAndBanner();
  console.log('  ' + chalk.yellow.bold('Security Disclaimer'));
  console.log('');
  console.log('  ' + chalk.yellow('Custom repositories are NOT verified by APM.'));
  console.log('  ' + chalk.yellow('Only install from sources you trust.'));
  console.log('');

  const result = await confirm({
    message: 'Do you understand and accept the risks?',
    default: false
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Confirms a destructive action by listing what will happen.
 *
 * @param {string[]} actions - List of actions that will be performed.
 * @param {string} [confirmMessage='Proceed?'] - Confirmation prompt message.
 * @returns {Promise<boolean>} User's confirmation.
 */
export async function confirmDestructiveAction(actions, confirmMessage = 'Proceed?', { hint = 'Pass -f to proceed without confirmation.' } = {}) {
  requireInteractive(confirmMessage, hint);
  logger.clearAndBanner();
  console.log(chalk.yellow.bold('This will:'));
  for (const action of actions) {
    console.log(chalk.yellow(`  \u2022 ${action}`));
  }
  console.log('');

  const result = await confirm({
    message: confirmMessage,
    default: false
  });
  logger.clearAndBanner();
  return result;
}

/**
 * Generic select prompt wrapper.
 *
 * @param {Object} options - Prompt options.
 * @param {string} options.message - Prompt message.
 * @param {Object[]} options.choices - Array of { name, value } choices.
 * @param {boolean} [options.clearScreen=true] - Whether to clear screen first.
 * @param {string} [options.header] - Header hint text.
 * @param {string} [options.hint] - How to run the command without this prompt.
 * @returns {Promise<*>} Selected value.
 */
export async function selectPrompt({ message, choices, clearScreen = true, header, hint }) {
  requireInteractive(message, hint);
  if (clearScreen) {
    logger.clearAndBanner();
  }
  if (header) {
    console.log('  ' + chalk.dim(header));
    console.log('');
  }

  const result = await select({
    message,
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
  logger.clearAndBanner();
  return result;
}

export default {
  isInteractive,
  selectAssistant,
  selectRelease,
  selectCustomRepo,
  inputRepository,
  confirmAction,
  confirmSecurityDisclaimer,
  confirmDestructiveAction,
  selectPrompt
};
