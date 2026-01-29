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
 * - {COMMAND_PATH:name}: Full path to command file (resolves extension per target)
 * - {ARGS}: $ARGUMENTS (markdown) or {{args}} (toml)
 * - {AGENTS_FILE}: Platform-specific agents file name
 * - {SKILLS_DIR}: Platform-specific skills directory
 * - {PLANNER_SUBAGENT_GUIDANCE}: Platform-specific subagent exploration guidance for Planner
 * - {MANAGER_SUBAGENT_GUIDANCE}: Platform-specific subagent guidance for Manager investigation
 * - {WORKER_SUBAGENT_GUIDANCE}: Platform-specific subagent guidance for Worker context integration
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

  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, now.toISOString());

  // Replace SKILL_PATH placeholder (skills are in <name>/SKILL.md structure)
  replaced = replaced.replace(/{SKILL_PATH:([^}]+)}/g, (_match, skillName) => {
    return path.join(directories.skills, skillName, 'SKILL.md');
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
  // For subagent platforms: prefer subagents, delegation as fallback
  // For non-subagent platforms: use APM delegation workflow
  const subagentGuidance = target.subagentGuidance;

  if (subagentGuidance?.hasSubagents) {
    const configNote = subagentGuidance.configNote
      ? ` ${subagentGuidance.configNote}.`
      : '';
    const plannerGuidanceText = `**Preferred: Use subagent.** Invoke the ${subagentGuidance.explorerName} subagent with: \`${subagentGuidance.toolSyntax}\`. Integrate findings into the current Question Round.${configNote}

**Alternative: Request Delegation** if subagent exploration is insufficient or User prefers the APM Delegation workflow. See "If requesting Delegation" below.`;
    replaced = replaced.replace(/{PLANNER_SUBAGENT_GUIDANCE}/g, plannerGuidanceText);
  } else {
    // Non-subagent platforms: APM Delegation is the primary option
    const plannerDelegationText = `**Use APM Delegation.** Request Delegation from the User to preserve Planner context. See "If requesting Delegation" below for the workflow.`;
    replaced = replaced.replace(/{PLANNER_SUBAGENT_GUIDANCE}/g, plannerDelegationText);
  }

  // Replace MANAGER_SUBAGENT_GUIDANCE placeholder
  // For subagent platforms: Manager can use subagents for efficient investigation
  // For non-subagent platforms: no additional guidance (manual investigation or delegation)
  if (subagentGuidance?.hasSubagents) {
    const managerGuidanceText = `**Efficient Investigation:** Use the ${subagentGuidance.explorerName} subagent to efficiently explore files, verify deliverables, and gather context: \`${subagentGuidance.toolSyntax}\`. This preserves Manager context for coordination decisions.`;
    replaced = replaced.replace(/{MANAGER_SUBAGENT_GUIDANCE}/g, managerGuidanceText);
  } else {
    // Non-subagent platforms: remove placeholder (manual investigation is the default)
    replaced = replaced.replace(/{MANAGER_SUBAGENT_GUIDANCE}/g, '');
  }

  // Replace WORKER_SUBAGENT_GUIDANCE placeholder
  // For subagent platforms: Workers can use subagents to efficiently integrate cross-agent context
  // For non-subagent platforms: no additional guidance (manual file reading as currently specified)
  if (subagentGuidance?.hasSubagents) {
    const workerGuidanceText = `**Efficient Integration:** For complex Cross-Agent dependencies with multiple files or unfamiliar patterns, use the ${subagentGuidance.explorerName} subagent to efficiently explore and understand the producer's work: \`${subagentGuidance.toolSyntax}\`. This can help quickly grasp interfaces, patterns, and integration points before proceeding with execution.`;
    replaced = replaced.replace(/{WORKER_SUBAGENT_GUIDANCE}/g, workerGuidanceText);
  } else {
    // Non-subagent platforms: remove placeholder (manual approach is the default)
    replaced = replaced.replace(/{WORKER_SUBAGENT_GUIDANCE}/g, '');
  }

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
