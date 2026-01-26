/**
 * Config Command Module
 *
 * Handles 'apm config' command for managing CLI configuration.
 *
 * @module src/commands/config
 */

import { getCustomRepos, addCustomRepo, removeCustomRepo } from '../core/config.js';
import { select, confirm, input } from '@inquirer/prompts';
import logger from '../ui/logger.js';

/**
 * Validates repository format (owner/repo).
 *
 * @param {string} repo - Repository string to validate.
 * @returns {boolean} True if valid format.
 */
function isValidRepoFormat(repo) {
  return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo);
}

/**
 * Executes the config command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {string} [options.add] - Add a custom repository.
 * @param {string} [options.remove] - Remove a custom repository.
 * @param {boolean} [options.list] - List saved custom repositories.
 * @param {boolean} [options.clear] - Clear all saved custom repositories.
 * @returns {Promise<void>}
 */
export async function configCommand(options = {}) {
  const { add, remove, list, clear } = options;

  logger.clearAndBanner();

  if (add) {
    await addRepo(add);
    return;
  }

  if (remove) {
    await removeRepo(remove);
    return;
  }

  if (list) {
    await listRepos();
    return;
  }

  if (clear) {
    await clearAllRepos();
    return;
  }

  // Interactive mode - show menu
  await interactiveMenu();
}

/**
 * Adds a custom repository.
 *
 * @param {string} repo - Repository in owner/repo format.
 */
async function addRepo(repo) {
  if (!isValidRepoFormat(repo)) {
    logger.error('Invalid repository format. Use: owner/repo');
    return;
  }

  const repos = await getCustomRepos();
  const existing = repos.find(r => r.repo === repo);

  if (existing) {
    logger.warn(`Repository ${repo} is already saved.`);
    return;
  }

  await addCustomRepo(repo);
  logger.success(`Added ${repo}`);
}

/**
 * Removes a custom repository.
 *
 * @param {string} repo - Repository in owner/repo format.
 */
async function removeRepo(repo) {
  const removed = await removeCustomRepo(repo);

  if (removed) {
    logger.success(`Removed ${repo}`);
  } else {
    logger.error(`Repository ${repo} not found in saved list.`);
  }
}

/**
 * Lists all saved custom repositories.
 */
async function listRepos() {
  const repos = await getCustomRepos();

  if (!repos.length) {
    logger.info('No saved custom repositories.');
    return;
  }

  logger.info(`Saved custom repositories (${repos.length}):`);
  logger.blank();

  for (const repo of repos) {
    const skipNote = repo.skipDisclaimer ? ' (disclaimer skipped)' : '';
    logger.info(`  ${repo.repo}${skipNote}`, { indent: true });
  }
}

/**
 * Clears all saved custom repositories.
 */
async function clearAllRepos() {
  const repos = await getCustomRepos();

  if (!repos.length) {
    logger.info('No saved custom repositories to clear.');
    return;
  }

  const proceed = await confirm({
    message: `Remove all ${repos.length} saved custom repositories?`,
    default: false
  });

  if (!proceed) {
    logger.info('Aborted.');
    return;
  }

  for (const repo of repos) {
    await removeCustomRepo(repo.repo);
  }

  logger.success('All custom repositories removed.');
}

/**
 * Interactive menu for config management.
 */
async function interactiveMenu() {
  const repos = await getCustomRepos();

  const choices = [
    { name: 'List saved repositories', value: 'list' },
    { name: 'Add a repository', value: 'add' },
    { name: 'Remove a repository', value: 'remove', disabled: !repos.length },
    { name: 'Clear all repositories', value: 'clear', disabled: !repos.length },
    { name: 'Exit', value: 'exit' }
  ];

  const action = await select({
    message: 'What would you like to do?',
    choices
  });

  switch (action) {
    case 'list':
      logger.blank();
      await listRepos();
      break;

    case 'add':
      await addRepoInteractive();
      break;

    case 'remove':
      await removeRepoInteractive(repos);
      break;

    case 'clear':
      await clearAllRepos();
      break;

    case 'exit':
      break;
  }
}

/**
 * Interactive repo addition.
 */
async function addRepoInteractive() {
  const repo = await input({
    message: 'Enter repository (owner/repo):',
    validate: value => {
      if (!isValidRepoFormat(value)) {
        return 'Please enter in owner/repo format';
      }
      return true;
    }
  });

  await addRepo(repo);
}

/**
 * Interactive repo removal.
 *
 * @param {Object[]} repos - List of saved repos.
 */
async function removeRepoInteractive(repos) {
  logger.clearAndBanner();

  const choices = repos.map(r => ({
    name: r.repo,
    value: r.repo
  }));

  const selected = await select({
    message: 'Select repository to remove:',
    choices
  });

  const removed = await removeCustomRepo(selected);

  if (removed) {
    logger.success(`Removed ${selected}`);
  } else {
    logger.error(`Failed to remove ${selected}`);
  }
}

export default configCommand;
