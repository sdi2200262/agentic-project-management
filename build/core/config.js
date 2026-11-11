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
      if (target.format !== undefined && !['multi-skill', 'single-skill'].includes(target.format)) {
        errors.push(`${prefix}: "format" must be "multi-skill" or "single-skill"`);
      }
      if (target.assistant !== undefined && !['agents', 'claude'].includes(target.assistant)) {
        errors.push(`${prefix}: "assistant" must be "agents" or "claude"`);
      }
      if (target.format === 'single-skill' && !target.assistant) {
        errors.push(`${prefix}: single-skill targets require "assistant"`);
      }
      if (!target.directories) {
        errors.push(`${prefix}: missing "directories"`);
      } else {
        if (!target.directories.skills) errors.push(`${prefix}: missing "directories.skills"`);
        if (!target.directories.guides) errors.push(`${prefix}: missing "directories.guides"`);
        if (target.format === 'single-skill' && target.directories.guides !== `${target.directories.skills}/apm/guides`) {
          errors.push(`${prefix}: single-skill guides must be under "directories.skills" at apm/guides`);
        }
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

/** Reads the template version supplied by local builds or the release workflow. */
export async function getVersion() {
  const version = process.env.VERSION?.replace(/^v/, '');
  if (!version) {
    throw BuildError.configInvalid(['Set VERSION to the template version, for example VERSION=1.1.0 npm run build']);
  }
  return version;
}
