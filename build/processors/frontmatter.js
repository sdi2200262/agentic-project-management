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
 * Enhanced frontmatter fields only supported by platforms with enhancedSkills.
 * Stripped from output for platforms that do not support them.
 */
const ENHANCED_FIELDS = [
  'model', 'tools', 'disallowedTools', 'context',
  'replaces', 'argument-hint', 'hooks',
  'disable-model-invocation', 'user-invocable'
];

/**
 * Strips enhanced frontmatter fields not supported by the target platform.
 * Returns new frontmatter object without modifying the original.
 *
 * @param {Object} frontmatter - Parsed frontmatter object.
 * @returns {Object} Frontmatter with enhanced fields removed.
 */
export function stripEnhancedFields(frontmatter) {
  const result = { ...frontmatter };
  for (const field of ENHANCED_FIELDS) {
    delete result[field];
  }
  return result;
}

/**
 * Rebuilds markdown content with modified frontmatter.
 *
 * @param {Object} frontmatter - Frontmatter object to serialize.
 * @param {string} body - Markdown body content.
 * @returns {string} Complete markdown with YAML frontmatter.
 */
export function rebuildWithFrontmatter(frontmatter, body) {
  const yamlStr = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (value === null) return `${key}: null`;
      if (typeof value === 'string') return `${key}: ${value}`;
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');
  return `---\n${yamlStr}\n---\n${body}`;
}

/**
 * Translates model and tool values in frontmatter to platform-specific equivalents.
 * Removes fields that map to null (no equivalent on this platform).
 *
 * @param {Object} frontmatter - Parsed frontmatter object.
 * @param {Object} target - Target configuration with optional modelMapping and toolMapping.
 * @returns {Object} Frontmatter with translated values.
 */
export function translateFrontmatter(frontmatter, target) {
  const result = { ...frontmatter };
  const modelMapping = target.modelMapping || {};
  const toolMapping = target.toolMapping || {};

  // Translate model
  if (result.model && modelMapping[result.model] !== undefined) {
    if (modelMapping[result.model] === null) {
      delete result.model;
    } else {
      result.model = modelMapping[result.model];
    }
  }

  // Translate tools
  if (result.tools && typeof result.tools === 'string') {
    const tools = result.tools.split(',').map(t => t.trim());
    const mapped = tools.map(t => toolMapping[t] || t).filter(Boolean);
    const unique = [...new Set(mapped)];
    result.tools = unique;
  }

  // Translate disallowedTools
  if (result.disallowedTools && typeof result.disallowedTools === 'string') {
    const tools = result.disallowedTools.split(',').map(t => t.trim());
    const mapped = tools.map(t => toolMapping[t] || t).filter(Boolean);
    const unique = [...new Set(mapped)];
    result.disallowedTools = unique;
  }

  return result;
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
