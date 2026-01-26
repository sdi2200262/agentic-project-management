/**
 * Global Config Module
 *
 * Manages ~/.apm/config.json for CLI settings and saved custom repos.
 *
 * @module src/core/config
 */

import fs from 'fs-extra';
import { CONFIG_DIR, CONFIG_FILE } from './constants.js';
import logger from '../ui/logger.js';

/**
 * Reads the global config file.
 *
 * @returns {Promise<Object>} Config object or default structure.
 */
export async function readConfig() {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJson(CONFIG_FILE);
    }
  } catch (err) {
    logger.debug(`Failed to read config: ${err.message}`);
  }

  return { customRepos: [] };
}

/**
 * Writes the global config file.
 *
 * @param {Object} config - Config object to write.
 * @returns {Promise<void>}
 */
export async function writeConfig(config) {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

/**
 * Gets the list of saved custom repositories.
 *
 * @returns {Promise<Object[]>} Array of custom repo objects.
 */
export async function getCustomRepos() {
  const config = await readConfig();
  return config.customRepos || [];
}

/**
 * Adds a custom repository to the saved list.
 *
 * @param {string} repo - Repository in owner/repo format.
 * @returns {Promise<void>}
 */
export async function addCustomRepo(repo) {
  const config = await readConfig();
  const existing = config.customRepos.find(r => r.repo === repo);

  if (!existing) {
    config.customRepos.push({
      repo,
      addedAt: new Date().toISOString(),
      skipDisclaimer: false
    });
    await writeConfig(config);
  }
}

/**
 * Updates settings for a custom repository.
 *
 * @param {string} repo - Repository in owner/repo format.
 * @param {Object} settings - Settings to update.
 * @returns {Promise<void>}
 */
export async function updateRepoSettings(repo, settings) {
  const config = await readConfig();
  const repoEntry = config.customRepos.find(r => r.repo === repo);

  if (repoEntry) {
    Object.assign(repoEntry, settings);
    await writeConfig(config);
  }
}

/**
 * Gets settings for a specific custom repository.
 *
 * @param {string} repo - Repository in owner/repo format.
 * @returns {Promise<Object|null>} Repo settings or null if not found.
 */
export async function getRepoSettings(repo) {
  const config = await readConfig();
  return config.customRepos.find(r => r.repo === repo) || null;
}

export default {
  readConfig,
  writeConfig,
  getCustomRepos,
  addCustomRepo,
  updateRepoSettings,
  getRepoSettings
};
