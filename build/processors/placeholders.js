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
 * - {DELEGATE_TOOLS_READ}: Platform-specific read-only tools for delegate agents
 * - {DELEGATE_TOOLS_FULL}: Platform-specific full tools for delegate agents
 * - {DELEGATE_MODEL}: Platform-specific model for delegate agents
 * - {CLAUDE_SKILLS_FIELD:name}: Claude's native skills: field (empty for other platforms)
 * - {DELEGATE_MEMORY_LOGGING_INSTRUCTION}: Platform-specific memory logging instruction for delegates
 * - {DELEGATE_SPAWN_INSTRUCTION:name}: Platform-specific spawn syntax for delegate subagents
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
  // All supported platforms have subagents - use subagent with delegation as fallback
  const configNote = subagentGuidance.configNote
    ? ` ${subagentGuidance.configNote}.`
    : '';
  const plannerGuidanceText = `Use the ${subagentGuidance.explorerName} subagent: \`${subagentGuidance.toolSyntax}\`. Integrate findings into the current Question Round.${configNote}`;
  replaced = replaced.replace(/{PLANNER_SUBAGENT_GUIDANCE}/g, plannerGuidanceText);

  // Replace MANAGER_SUBAGENT_GUIDANCE placeholder
  const managerGuidanceText = `Use the ${subagentGuidance.explorerName} subagent to explore files, verify deliverables, and gather context: \`${subagentGuidance.toolSyntax}\`.`;
  replaced = replaced.replace(/{MANAGER_SUBAGENT_GUIDANCE}/g, managerGuidanceText);

  // Replace WORKER_SUBAGENT_GUIDANCE placeholder
  const workerGuidanceText = `For complex Cross-Agent dependencies with multiple files or unfamiliar patterns, use the ${subagentGuidance.explorerName} subagent to explore and understand the producer's work: \`${subagentGuidance.toolSyntax}\`.`;
  replaced = replaced.replace(/{WORKER_SUBAGENT_GUIDANCE}/g, workerGuidanceText);

  // Replace CONTEXT_ATTACH_SYNTAX placeholder
  replaced = replaced.replace(/{CONTEXT_ATTACH_SYNTAX}/g, target.contextAttachSyntax || 'Reference the file path in your message.');

  // Replace delegate agent placeholders
  replaced = replaceDelegatePlaceholders(replaced, target);

  return replaced;
}

/**
 * Replaces delegate agent-specific placeholders.
 *
 * @param {string} content - Content with placeholders.
 * @param {Object} target - Target configuration object.
 * @returns {string} Content with delegate placeholders replaced.
 */
function replaceDelegatePlaceholders(content, target) {
  const { id } = target;

  // Define platform-specific delegate configurations
  const delegateConfig = getDelegateConfig(id);

  let replaced = content
    .replace(/{DELEGATE_TOOLS_READ}/g, delegateConfig.toolsRead)
    .replace(/{DELEGATE_TOOLS_FULL}/g, delegateConfig.toolsFull)
    .replace(/{DELEGATE_MODEL}/g, delegateConfig.model);

  // Replace CLAUDE_SKILLS_FIELD placeholder
  // For Claude: outputs "skills:\n  - <skillname>"
  // For others: outputs empty string (skill content embedded instead)
  replaced = replaced.replace(/{CLAUDE_SKILLS_FIELD:([^}]+)}/g, (_match, skillName) => {
    if (id === 'claude') {
      return `skills:\n  - ${skillName}`;
    }
    return '';
  });

  // Replace DELEGATE_SPAWN_INSTRUCTION placeholder
  // Outputs platform-specific syntax for spawning a delegate subagent by name
  replaced = replaced.replace(/{DELEGATE_SPAWN_INSTRUCTION:([^}]+)}/g, (_match, delegateName) => {
    return getDelegateSpawnSyntax(id, delegateName);
  });

  // Replace DELEGATE_MEMORY_LOGGING_INSTRUCTION placeholder
  // For Claude: skill is injected via frontmatter, reference it
  // For others: instruct delegate to read the guide
  const { directories } = target;
  if (id === 'claude') {
    replaced = replaced.replace(
      /{DELEGATE_MEMORY_LOGGING_INSTRUCTION}/g,
      'Upon completion, log findings to Memory per the memory-logging skill (preloaded), §3.2 Delegation Memory Log Procedure. Then provide a brief summary of findings for the Delegating Agent.'
    );
  } else {
    replaced = replaced.replace(
      /{DELEGATE_MEMORY_LOGGING_INSTRUCTION}/g,
      `Upon initiatiton, read \`${directories.guides}/memory-logging.md\`. Upon completion, log findings to Memory per §3.2 Delegation Memory Log Procedure. Then provide a brief summary of findings for the Delegating Agent.`
    );
  }

  return replaced;
}

/**
 * Gets platform-specific spawn syntax for a delegate subagent.
 *
 * @param {string} targetId - Target platform identifier.
 * @param {string} delegateName - Delegate subagent name (e.g., 'research-delegate').
 * @returns {string} Spawn instruction text with platform-specific syntax.
 */
function getDelegateSpawnSyntax(targetId, delegateName) {
  const syntaxMap = {
    claude: (name) => `\`Task(subagent_type="${name}", prompt="<task description>")\``,
    cursor: (name) => `\`Task(subagent_type="${name}", prompt="<task description>")\``,
    copilot: (name) => `\`#runSubagent\` with the \`${name}\` agent, providing the task description as prompt`,
    gemini: (name) => `\`${name}(objective="<task description>")\``,
    opencode: (name) => `\`task(subagent_type="${name}", prompt="<task description>")\``
  };

  const syntaxFn = syntaxMap[targetId] || syntaxMap.cursor;
  return `Spawn using: ${syntaxFn(delegateName)}`;
}

/**
 * Gets delegate configuration for a specific platform.
 *
 * @param {string} targetId - Target platform identifier.
 * @returns {Object} Delegate configuration with tools and model.
 */
function getDelegateConfig(targetId) {
  const configs = {
    claude: {
      toolsRead: 'Read, Grep, Glob, WebFetch, WebSearch',
      toolsFull: 'Read, Grep, Glob, Bash, Edit, Write, WebFetch, WebSearch',
      model: 'sonnet'
    },
    cursor: {
      toolsRead: 'read_file, list_dir, codebase_search, grep_search, file_search, web_search',
      toolsFull: 'read_file, list_dir, codebase_search, grep_search, file_search, edit_file, run_terminal_cmd, web_search',
      model: 'inherit'
    },
    copilot: {
      toolsRead: 'read, search, web',
      toolsFull: 'read, search, web, edit, execute',
      model: 'inherit'
    },
    gemini: {
      toolsRead: 'read_file, grep_search, glob, google_web_search, web_fetch',
      toolsFull: 'read_file, grep_search, glob, write_file, replace, run_shell_command, google_web_search, web_fetch',
      model: 'inherit'
    },
    opencode: {
      toolsRead: 'read, glob, grep, webfetch, websearch',
      toolsFull: 'read, glob, grep, edit, write, bash, webfetch, websearch',
      model: 'inherit'
    }
  };

  return configs[targetId] || configs.cursor; // Default to cursor config
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

/**
 * Gets the output extension for agent files.
 *
 * @param {Object} target - Target configuration object.
 * @returns {string} File extension for agent files.
 */
export function getAgentExtension(target) {
  if (target.id === 'copilot') {
    return '.agent.md';
  }
  return '.md';
}
