/**
 * CLI Prompts Module
 *
 * Provides user interaction prompts using Inquirer.
 *
 * @module src/ui/prompts
 */

import { select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

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
  const choices = assistants.map(a => ({
    name: `${a.name} - ${a.description}`,
    value: a.id
  }));

  return select({
    message: 'Select an assistant:',
    choices
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
  const choices = releases.map(r => ({
    name: r.name || r.tag_name,
    value: r.tag_name
  }));

  return select({
    message: 'Select a release:',
    choices
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
  const choices = [
    { name: 'Enter a new repository', value: null },
    ...savedRepos.map(r => ({
      name: r.repo,
      value: r.repo
    }))
  ];

  return select({
    message: 'Select a repository:',
    choices
  });
}

/**
 * Prompts user to enter a custom repository.
 *
 * @returns {Promise<string>} Repository in owner/repo format.
 */
export async function inputRepository() {
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
  return confirm({
    message,
    default: defaultValue
  });
}

/**
 * Prompts user to select update source for custom installations.
 *
 * @returns {Promise<string>} Selected source ('official' or 'custom').
 */
export async function selectUpdateSource() {
  return select({
    message: 'Update from:',
    choices: [
      { name: 'Official APM releases', value: 'official' },
      { name: 'Current custom repository', value: 'custom' }
    ]
  });
}

/**
 * Displays security disclaimer for custom repos and prompts for confirmation.
 *
 * @returns {Promise<boolean>} Whether user accepted the disclaimer.
 */
export async function confirmSecurityDisclaimer() {
  console.log('');
  console.log(chalk.yellow.bold('--- Security Disclaimer ---'));
  console.log('');
  console.log(chalk.white('Custom repositories are ') + chalk.red.bold('not verified') + chalk.white(' by APM.'));
  console.log(chalk.white('Only install from sources you ') + chalk.green.bold('trust') + chalk.white('.'));
  console.log('');

  return confirm({
    message: 'Do you understand and accept the risks?',
    default: false
  });
}

export default {
  selectAssistant,
  selectRelease,
  selectCustomRepo,
  inputRepository,
  confirmAction,
  selectUpdateSource,
  confirmSecurityDisclaimer
};
