/**
 * Placeholder Replacement Module
 *
 * Resolves template placeholders. The output is the same for every target.
 *
 * @module build/processors/placeholders
 */

import path from 'path';

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
 * - {COMMAND_PATH:name}: Command file; commands are skills (skills/<name>/SKILL.md)
 * - {SKILLS_DIR}: Skills directory (skills)
 * - {GUIDES_DIR}: Guides directory (.agents/apm-guides)
 * - {PLANNER_SUBAGENT_GUIDANCE}: Subagent exploration guidance for the Planner
 * - {MANAGER_SUBAGENT_GUIDANCE}: Subagent guidance for Manager investigation
 * - {WORKER_SUBAGENT_GUIDANCE}: Subagent guidance for Worker context integration
 * - {SUBAGENT_GUIDANCE}: Subagent guidance for non-role agents (standalone commands)
 * - {ARCHIVE_EXPLORER_GUIDANCE}: Guidance for spawning the apm-archive-explorer custom agent
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const { version } = context;
  const reference = 'the call for your assistant is in the `apm-communication` skill §5 Assistant Reference';

  return content
    .replace(/{VERSION}/g, version)
    .replace(/{SKILL_PATH:([^}]+)}/g, (_match, name) => `${SKILLS_DIR}/${name}/SKILL.md`)
    .replace(/{GUIDE_PATH:([^}]+)}/g, (_match, name) => `${GUIDES_DIR}/${name}.md`)
    .replace(/{COMMAND_PATH:([^}]+)}/g, (_match, name) => `${SKILLS_DIR}/${path.basename(name, '.md')}/SKILL.md`)
    .replace(/{SKILLS_DIR}/g, SKILLS_DIR)
    .replace(/{GUIDES_DIR}/g, GUIDES_DIR)
    .replace(/{PLANNER_SUBAGENT_GUIDANCE}/g, `Spawn your assistant's explorer subagent for substantial research - it runs in its own context window, preserving yours for planning; ${reference}. Structure the prompt with specific research questions and expected sources. Verify findings against the codebase, then present a summary to the User before using them in the round.`)
    .replace(/{MANAGER_SUBAGENT_GUIDANCE}/g, `Spawn your assistant's explorer subagent for investigation - it runs in its own context window, preserving yours for coordination; ${reference}. Structure the prompt with the investigation goal, files to examine, and what to report back.`)
    .replace(/{WORKER_SUBAGENT_GUIDANCE}/g, `For complex cross-agent dependencies or multi-file exploration, spawn your assistant's explorer subagent rather than inline searching - it runs in its own context window and returns consolidated findings; ${reference}. Structure the prompt with specific files to read and questions to answer.`)
    .replace(/{SUBAGENT_GUIDANCE}/g, `Spawn your assistant's explorer subagent - it runs in its own context window and returns findings when complete; ${reference}.`)
    .replace(/{ARCHIVE_EXPLORER_GUIDANCE}/g, 'spawn the `apm-archive-explorer` subagent by name and pass it the archive path(s) to explore');
}

