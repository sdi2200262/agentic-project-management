/**
 * CLI Prompts Module
 *
 * Provides user interaction prompts using Inquirer.
 *
 * @module src/ui/prompts
 */

import { select, input, confirm, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import logger from './logger.js';

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
    new Separator(chalk.dim('  ↑↓ navigate • Enter select • Ctrl+C cancel'))
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
export async function selectAssistant(assistants) {
  logger.clearAndBanner();
  const choices = assistants.map(a => ({
    name: `${a.name} - ${a.description}`,
    value: a.id
  }));

  return select({
    message: 'Select an assistant:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
}

/**
 * Prompts user to select a release from a list.
 *
 * @param {Object[]} releases - Array of release objects.
 * @param {string} releases[].tag_name - Release tag name.
 * @param {string} releases[].name - Release name.
 * @returns {Promise<string>} Selected release tag name.
 */
export async function selectRelease(releases) {
  logger.clearAndBanner();
  const choices = releases.map(r => ({
    name: r.name || r.tag_name,
    value: r.tag_name
  }));

  return select({
    message: 'Select a release:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
}

/**
 * Prompts user to select from saved custom repos or enter a new one.
 *
 * @param {Object[]} savedRepos - Array of saved repo objects.
 * @param {string} savedRepos[].repo - Repository in owner/repo format.
 * @returns {Promise<string|null>} Selected repo or null for new repo entry.
 */
export async function selectCustomRepo(savedRepos) {
  logger.clearAndBanner();
  const choices = [
    { name: 'Enter a new repository', value: null },
    ...savedRepos.map(r => ({
      name: r.repo,
      value: r.repo
    }))
  ];

  return select({
    message: 'Select a repository:',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
}

/**
 * Prompts user to enter a custom repository.
 *
 * @returns {Promise<string>} Repository in owner/repo format.
 */
export async function inputRepository() {
  logger.clearAndBanner();
  return input({
    message: 'Enter repository (owner/repo):',
    validate: value => {
      if (!value.includes('/')) {
        return 'Please enter in owner/repo format';
      }
      return true;
    }
  });
}

/**
 * Prompts user to confirm an action.
 *
 * @param {string} message - Confirmation message.
 * @param {boolean} [defaultValue=false] - Default value.
 * @returns {Promise<boolean>} User's confirmation.
 */
export async function confirmAction(message, defaultValue = false) {
  logger.clearAndBanner();
  return confirm({
    message,
    default: defaultValue
  });
}

/**
 * Prompts user to select a previous archive for continuation, or skip.
 *
 * @param {string[]} archives - Array of archive directory names.
 * @returns {Promise<string|null>} Selected archive name or null if skipped.
 */
export async function selectArchive(archives) {
  logger.clearAndBanner();
  const choices = [
    { name: 'No continuation (fresh session)', value: null },
    ...archives.map(a => ({
      name: a,
      value: a
    }))
  ];

  return select({
    message: 'Does this session continue from a previous archive?',
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
}

/**
 * Displays security disclaimer for custom repos and prompts for confirmation.
 *
 * @returns {Promise<boolean>} Whether user accepted the disclaimer.
 */
export async function confirmSecurityDisclaimer() {
  logger.clearAndBanner();
  logger.warn('Security Disclaimer');
  logger.blank();
  logger.warn('Custom repositories are NOT verified by APM.');
  logger.warn('Only install from sources you trust.');
  logger.blank();

  return confirm({
    message: 'Do you understand and accept the risks?',
    default: false
  });
}

/**
 * Confirms a destructive action by listing what will happen.
 *
 * @param {string[]} actions - List of actions that will be performed.
 * @param {string} [confirmMessage='Proceed?'] - Confirmation prompt message.
 * @returns {Promise<boolean>} User's confirmation.
 */
export async function confirmDestructiveAction(actions, confirmMessage = 'Proceed?') {
  logger.clearAndBanner();
  console.log(chalk.yellow.bold('This will:'));
  for (const action of actions) {
    console.log(chalk.yellow(`  \u2022 ${action}`));
  }
  console.log('');

  return confirm({
    message: confirmMessage,
    default: false
  });
}

/**
 * Generic select prompt wrapper.
 *
 * @param {Object} options - Prompt options.
 * @param {string} options.message - Prompt message.
 * @param {Object[]} options.choices - Array of { name, value } choices.
 * @param {boolean} [options.clearScreen=true] - Whether to clear screen first.
 * @returns {Promise<*>} Selected value.
 */
export async function selectPrompt({ message, choices, clearScreen = true }) {
  if (clearScreen) {
    logger.clearAndBanner();
  }

  return select({
    message,
    choices: withSelectHint(choices),
    pageSize: choices.length + HINT_LINES,
    clearPromptOnDone: true,
    theme: SELECT_THEME
  });
}

export default {
  selectAssistant,
  selectRelease,
  selectCustomRepo,
  selectArchive,
  inputRepository,
  confirmAction,
  confirmSecurityDisclaimer,
  confirmDestructiveAction,
  selectPrompt
};
