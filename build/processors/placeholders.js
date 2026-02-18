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
 * - {SKILL_PATH:name}: Full path to skill file (<name>/SKILL.md)
 * - {GUIDE_PATH:name}: Full path to guide file (<name>.md) - flat structure, no frontmatter
 * - {COMMAND_PATH:name}: Full path to command file (resolves extension per target)
 * - {ARGS}: $ARGUMENTS (markdown) or {{args}} (toml)
 * - {AGENTS_FILE}: Platform-specific agents file name
 * - {SKILLS_DIR}: Platform-specific skills directory
 * - {PLANNER_SUBAGENT_GUIDANCE}: Platform-specific subagent exploration guidance for Planner
 * - {MANAGER_SUBAGENT_GUIDANCE}: Platform-specific subagent guidance for Manager investigation
 * - {WORKER_SUBAGENT_GUIDANCE}: Platform-specific subagent guidance for Worker context integration
 * - {CONTEXT_ATTACH_SYNTAX}: Platform-specific instructions for how Users reference files in chat
 *
 * @param {string} content - Template content with placeholders.
 * @param {Object} context - Replacement context.
 * @param {string} context.version - Version string.
 * @param {Object} context.target - Target configuration object.
 * @param {Date} [context.now] - Timestamp for replacement.
 * @returns {string} Content with placeholders replaced.
 */
export function replacePlaceholders(content, context) {
  const {
    version,
    target,
    now = new Date()
  } = context;

  const { directories, format, id } = target;
  const subagentGuidance = target.subagentGuidance;

  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, now.toISOString());

  // Replace SKILL_PATH placeholder (skills are in <name>/SKILL.md structure)
  replaced = replaced.replace(/{SKILL_PATH:([^}]+)}/g, (_match, skillName) => {
    return path.join(directories.skills, skillName, 'SKILL.md');
  });

  // Replace GUIDE_PATH placeholder (guides are flat files, no frontmatter)
  replaced = replaced.replace(/{GUIDE_PATH:([^}]+)}/g, (_match, guideName) => {
    return path.join(directories.guides, `${guideName}.md`);
  });

  // Replace COMMAND_PATH placeholder (resolves to full path with target-specific extension)
  const commandExt = getOutputExtension(target);
  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (_match, commandName) => {
    const base = path.basename(commandName, path.extname(commandName));
    return path.join(directories.commands, `${base}${commandExt}`);
  });

  // Replace ARGS placeholder based on format
  const argsPlaceholder = format === 'toml' ? '{{args}}' : '$ARGUMENTS';
  replaced = replaced.replace(/{ARGS}/g, argsPlaceholder);

  // Replace AGENTS_FILE placeholder
  const agentsFileName = id === 'claude' ? 'CLAUDE.md' : 'AGENTS.md';
  replaced = replaced.replace(/{AGENTS_FILE}/g, agentsFileName);

  // Replace SKILLS_DIR placeholder
  replaced = replaced.replace(/{SKILLS_DIR}/g, directories.skills);

  // Replace PLANNER_SUBAGENT_GUIDANCE placeholder
  const configNote = subagentGuidance.configNote
    ? ` ${subagentGuidance.configNote}.`
    : '';
  const plannerGuidanceText = `Use the ${subagentGuidance.explorerName} subagent: \`${subagentGuidance.toolSyntax}\`. Integrate findings into the current Question Round.${configNote}`;
  replaced = replaced.replace(/{PLANNER_SUBAGENT_GUIDANCE}/g, plannerGuidanceText);

  // Replace MANAGER_SUBAGENT_GUIDANCE placeholder
  const managerGuidanceText = `Use the ${subagentGuidance.explorerName} subagent to explore files, verify deliverables, and gather context: \`${subagentGuidance.toolSyntax}\`.`;
  replaced = replaced.replace(/{MANAGER_SUBAGENT_GUIDANCE}/g, managerGuidanceText);

  // Replace WORKER_SUBAGENT_GUIDANCE placeholder
  const workerGuidanceText = `For complex cross-agent dependencies with multiple files or unfamiliar patterns, use the ${subagentGuidance.explorerName} subagent to explore and understand the producer's work: \`${subagentGuidance.toolSyntax}\`.`;
  replaced = replaced.replace(/{WORKER_SUBAGENT_GUIDANCE}/g, workerGuidanceText);

  // Replace CONTEXT_ATTACH_SYNTAX placeholder
  replaced = replaced.replace(/{CONTEXT_ATTACH_SYNTAX}/g, target.contextAttachSyntax || 'Reference the file path in your message.');

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

