/**
 * Placeholder Replacement Module
 *
 * Handles replacement of template placeholders with target-specific values.
 *
 * @module build/processors/placeholders
 */

import path from 'path';

/**
 * Replaces template placeholders with target-specific values.
 *
 * Supported placeholders:
 * - {VERSION}: Package version
 * - {TIMESTAMP}: ISO timestamp
 * - {SKILL_PATH:path}: Path to skill file
 * - {COMMAND_PATH:filename}: Path to command file
 * - {ARGS}: $ARGUMENTS (markdown) or {{args}} (toml)
 * - {AGENTS_FILE}: Platform-specific agents file name
 * - {SKILLS_DIR}: Platform-specific skills directory
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @param {Object} context.target - Target configuration object.
 * @param {Object} context.commandFileMap - Map of command filenames.
 * @param {Date} [context.now] - Timestamp for replacement.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const {
    version,
    target,
    commandFileMap = {},
    now = new Date()
  } = context;

  const { directories, format, id } = target;

  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, now.toISOString());

  // Replace SKILL_PATH placeholder
  replaced = replaced.replace(/{SKILL_PATH:([^}]+)}/g, (_match, skillPath) => {
    return path.join(directories.skills, skillPath);
  });

  // Replace COMMAND_PATH placeholder
  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (_match, filename) => {
    const base = path.basename(filename, path.extname(filename));
    const resolved = commandFileMap[base] || commandFileMap[filename] || filename;
    return path.join(directories.commands, resolved);
  });

  // Replace ARGS placeholder based on format
  const argsPlaceholder = format === 'toml' ? '{{args}}' : '$ARGUMENTS';
  replaced = replaced.replace(/{ARGS}/g, argsPlaceholder);

  // Replace AGENTS_FILE placeholder
  const agentsFileName = id === 'claude' ? 'CLAUDE.md' : 'AGENTS.md';
  replaced = replaced.replace(/{AGENTS_FILE}/g, agentsFileName);

  // Replace SKILLS_DIR placeholder
  replaced = replaced.replace(/{SKILLS_DIR}/g, directories.skills);

  return replaced;
}

/**
 * Determines the output file extension for a target.
 *
 * @param {Object} target - Target configuration object.
 * @returns {string} File extension including dot (e.g., '.md', '.toml', '.prompt.md').
 */
export function getOutputExtension(target) {
  if (target.format === 'toml') {
    return '.toml';
  }
  if (target.id === 'copilot') {
    return '.prompt.md';
  }
  return '.md';
}
