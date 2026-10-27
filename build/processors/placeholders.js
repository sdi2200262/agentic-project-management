/**
 * Placeholder Replacement Module
 *
 * Resolves template placeholders with target-specific values.
 *
 * @module build/processors/placeholders
 */

/**
 * Replaces template placeholders with target-specific values.
 *
 * Supported placeholders:
 * - {VERSION}: Package version
 * - {SKILL_PATH:name}: Skill file (<skills dir>/<name>/SKILL.md)
 * - {SKILL_DIR:name}: Skill folder (<skills dir>/<name>)
 * - {GUIDE_PATH:name}: Guide file (<guides dir>/<name>.md)
 * - {CLAUDE_ONLY:text}: Text kept for the claude target and removed for the others
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @param {Object} context.target - Target configuration object.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const { version, target } = context;
  const { directories, id } = target;

  return content
    .replace(/{VERSION}/g, version)
    .replace(/{CLAUDE_ONLY:([^}]*)}/g, (_match, text) => (id === 'claude' ? text : ''))
    .replace(/{SKILL_PATH:([^}]+)}/g, (_match, name) => `${directories.skills}/${name}/SKILL.md`)
    .replace(/{SKILL_DIR:([^}]+)}/g, (_match, name) => `${directories.skills}/${name}`)
    .replace(/{GUIDE_PATH:([^}]+)}/g, (_match, name) => `${directories.guides}/${name}.md`);
}
