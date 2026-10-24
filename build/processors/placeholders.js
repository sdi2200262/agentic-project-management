/**
 * Placeholder Replacement Module
 *
 * Resolves template placeholders. The output is the same for every target.
 *
 * @module build/processors/placeholders
 */

const SKILLS_DIR = 'skills';
const GUIDES_DIR = '.agents/apm-guides';

/**
 * Replaces template placeholders.
 *
 * Every assistant installs the same text, so placeholders resolve the same way for all targets.
 * Guides are in `.agents/apm-guides/` for every assistant. Skill paths are relative to the assistant's
 * skills folder (`.claude/skills/` for Claude Code, `.agents/skills/` for the others); the communication
 * skill's Assistant Reference lists it and everything else that differs between assistants.
 *
 * Supported placeholders:
 * - {VERSION}: Package version
 * - {SKILL_PATH:name}: Skill file (skills/<name>/SKILL.md)
 * - {GUIDE_PATH:name}: Guide file (.agents/apm-guides/<name>.md)
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const { version } = context;

  return content
    .replace(/{VERSION}/g, version)
    .replace(/{SKILL_PATH:([^}]+)}/g, (_match, name) => `${SKILLS_DIR}/${name}/SKILL.md`)
    .replace(/{GUIDE_PATH:([^}]+)}/g, (_match, name) => `${GUIDES_DIR}/${name}.md`);
}

