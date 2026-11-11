/**
 * Placeholder Replacement Module
 *
 * Resolves template placeholders with target-specific values.
 *
 * @module build/processors/placeholders
 */

import { skillPath, skillDirectory, guidePath } from './paths.js';

/**
 * Replaces template placeholders with target-specific values.
 *
 * Supported placeholders:
 * - {VERSION}: Template version
 * - {SKILL_PATH:name}: Source skill mapped to its output file
 * - {SKILL_DIR:name}: Directory containing the mapped source skill
 * - {GUIDE_PATH:name}: Guide file (<guides dir>/<name>.md)
 * - {CLAUDE_ONLY:text}: Text kept for the claude assistant family and removed for the others
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @param {Object} context.target - Target configuration object.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const { version, target } = context;
  const assistant = target.assistant ?? target.id;

  return content
    .replace(/{VERSION}/g, version)
    .replace(/{CLAUDE_ONLY:([^}]*)}/g, (_match, text) => (assistant === 'claude' ? text : ''))
    .replace(/{SKILL_PATH:([^}]+)}/g, (_match, name) => skillPath(target, name))
    .replace(/{SKILL_DIR:([^}]+)}/g, (_match, name) => skillDirectory(target, name))
    .replace(/{GUIDE_PATH:([^}]+)}/g, (_match, name) => guidePath(target, name));
}
