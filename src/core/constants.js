/**
 * CLI Constants Module
 *
 * Central location for CLI-related constants.
 *
 * @module src/core/constants
 */

import path from 'path';
import os from 'os';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Read CLI version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));

/**
 * CLI version from package.json.
 *
 * @type {string}
 */
export const CLI_VERSION = packageJson.version;

/**
 * Official APM repository.
 */
export const OFFICIAL_REPO = {
  owner: 'sdi2200262',
  repo: 'agentic-project-management'
};

/**
 * CLI major version used to filter compatible releases.
 * Derived dynamically from package.json version.
 *
 * @type {number}
 */
export const CLI_MAJOR_VERSION = parseInt(CLI_VERSION.split('.')[0], 10);

/**
 * Global config directory path (~/.apm/).
 */
export const CONFIG_DIR = path.join(os.homedir(), '.apm');

/**
 * Global config file path (~/.apm/config.json).
 */
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Workspace metadata file path (.apm/metadata.json).
 */
export const METADATA_FILE = '.apm/metadata.json';

/**
 * Release manifest filename.
 */
export const RELEASE_MANIFEST = 'apm-release.json';

/**
 * GitHub API base URL.
 */
export const GITHUB_API_BASE = 'https://api.github.com';

export default {
  OFFICIAL_REPO,
  CLI_MAJOR_VERSION,
  CONFIG_DIR,
  CONFIG_FILE,
  METADATA_FILE,
  RELEASE_MANIFEST,
  GITHUB_API_BASE
};
