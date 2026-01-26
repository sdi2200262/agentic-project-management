/**
 * Frontmatter Processing Module
 *
 * Handles YAML frontmatter parsing and validation.
 *
 * @module build/processors/frontmatter
 */

import yaml from 'js-yaml';
import logger from '../utils/logger.js';

/**
 * Parses YAML frontmatter from markdown content.
 *
 * @param {string} content - Markdown content with potential frontmatter.
 * @returns {Object} Object with {frontmatter, content} properties.
 */
export function parseFrontmatter(content) {
  // Normalize line endings and remove BOM
  content = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const lines = content.split('\n');

  if (lines[0] !== '---') {
    return { frontmatter: {}, content };
  }

  const endIndex = lines.indexOf('---', 1);

  if (endIndex === -1) {
    return { frontmatter: {}, content };
  }

  const frontmatterStr = lines.slice(1, endIndex).join('\n');
  const body = lines.slice(endIndex + 1).join('\n');

  let frontmatter = {};

  try {
    frontmatter = yaml.load(frontmatterStr) || {};
  } catch (err) {
    logger.warn(`Failed to parse frontmatter: ${err.message}`);
  }

  return { frontmatter, content: body };
}

/**
 * Validates frontmatter has required fields for commands.
 *
 * @param {Object} frontmatter - Parsed frontmatter object.
 * @param {string} filePath - Path to the template file (for error messages).
 * @returns {Object} Validation result with {valid, errors} properties.
 */
export function validateFrontmatter(frontmatter, filePath) {
  const errors = [];

  // Commands require command_name
  if (frontmatter.command_name !== undefined && !frontmatter.command_name) {
    errors.push(`Empty command_name in ${filePath}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
