/**
 * Build Configuration Module
 *
 * Handles loading, validation, and access to build configuration.
 *
 * @module build/core/config
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { BuildError } from './errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Validates the build configuration object.
 *
 * @param {Object} config - Configuration object to validate.
 * @returns {string[]} Array of validation error messages (empty if valid).
 */
export function validateConfig(config) {
  const errors = [];

  if (!config.build) {
    errors.push('Missing "build" section');
  } else {
    if (!config.build.sourceDir) {
      errors.push('Missing "build.sourceDir"');
    }
    if (!config.build.outputDir) {
      errors.push('Missing "build.outputDir"');
    }
  }

  if (!config.targets) {
    errors.push('Missing "targets" array');
  } else if (!Array.isArray(config.targets)) {
    errors.push('"targets" must be an array');
  } else if (config.targets.length === 0) {
    errors.push('"targets" array is empty');
  } else {
    config.targets.forEach((target, index) => {
      const prefix = `targets[${index}]`;
      if (!target.id) errors.push(`${prefix}: missing "id"`);
      if (!target.name) errors.push(`${prefix}: missing "name"`);
      if (!target.bundleName) errors.push(`${prefix}: missing "bundleName"`);
      if (!target.format) errors.push(`${prefix}: missing "format"`);
      if (!target.directories) {
        errors.push(`${prefix}: missing "directories"`);
      } else {
        if (!target.directories.commands) errors.push(`${prefix}: missing "directories.commands"`);
        if (!target.directories.skills) errors.push(`${prefix}: missing "directories.skills"`);
        if (!target.directories.guides) errors.push(`${prefix}: missing "directories.guides"`);
      }
    });
  }

  return errors;
}

/**
 * Loads and validates build-config.json.
 *
 * @returns {Promise<Object>} Validated configuration object.
 * @throws {BuildError} If config not found or invalid.
 */
export async function loadConfig() {
  const configPath = path.join(__dirname, '..', 'build-config.json');

  if (!await fs.pathExists(configPath)) {
    throw BuildError.configNotFound(configPath);
  }

  const configContent = await fs.readFile(configPath, 'utf8');
  const config = JSON.parse(configContent);

  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw BuildError.configInvalid(errors);
  }

  return config;
}

/**
 * Gets the version for the release manifest.
 * Uses VERSION env var if set (for CI), otherwise reads from package.json.
 *
 * @returns {Promise<string>} Version string.
 */
export async function getVersion() {
  // CI passes version via environment variable
  if (process.env.VERSION) {
    return process.env.VERSION.replace(/^v/, ''); // Strip leading 'v' if present
  }

  // Fallback to package.json for local development
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  const packageContent = await fs.readFile(packagePath, 'utf8');
  const { version } = JSON.parse(packageContent);
  return version;
}
