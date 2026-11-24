/** Resolves installation targets and their release-defined compatibility. */

import { CLIError } from './errors.js';

/**
 * Display names of the official assistants, used when metadata written by
 * an older CLI has no names recorded.
 */
const KNOWN_ASSISTANT_NAMES = {
  agents: 'Agents supporting .agents/skills/ and AGENTS.md',
  claude: 'Claude Code',
  codex: 'Codex CLI',
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  antigravity: 'Antigravity',
  opencode: 'OpenCode'
};

/**
 * Formats an assistant as "Name (id)", or just the ID when no name is known.
 *
 * @param {string} id - Assistant ID.
 * @param {string} [name] - Display name; falls back to the official name for the ID.
 * @returns {string} Formatted assistant.
 */
export function formatAssistant(id, name) {
  const displayName = name || KNOWN_ASSISTANT_NAMES[id];
  return displayName && displayName !== id ? `${displayName} (${id})` : id;
}

/**
 * Builds an ID-to-name map from a release manifest.
 *
 * @param {Object} manifest - Release manifest.
 * @param {string[]} [ids] - Limit the map to these IDs.
 * @returns {Object} Map of assistant ID to display name.
 */
export function assistantNamesFromManifest(manifest, ids = null) {
  const names = {};
  for (const a of manifest.assistants) {
    if (!ids || ids.includes(a.id)) names[a.id] = a.name;
  }
  return names;
}

/**
 * Formats a list of assistant IDs as comma-separated "Name (id)" entries.
 *
 * @param {string[]} ids - Assistant IDs.
 * @param {Object} [names={}] - Map of assistant ID to display name.
 * @returns {string} Formatted list.
 */
export function formatAssistantList(ids, names = {}) {
  return ids.map(id => formatAssistant(id, names[id])).join(', ');
}

/**
 * Resolves installed IDs against a new release, consolidating explicitly replaced
 * IDs. Exact matches win; custom releases without replacements keep their IDs.
 * Original metadata remains untouched so cleanup can remove the old files.
 *
 * @returns {{ ids: string[], dropped: string[], migrations: Object[], sources: Map<string, string[]> }}
 */
export function resolveUpdateTargets(installedIds, manifest) {
  const ids = new Set();
  const dropped = [];
  const migrations = [];
  const sources = new Map();
  for (const id of installedIds) {
    const target = manifest.assistants.find(a => a.id === id)
      || manifest.assistants.find(a => a.replaces?.includes(id));
    if (!target) {
      dropped.push(id);
      continue;
    }
    ids.add(target.id);
    if (!sources.has(target.id)) sources.set(target.id, []);
    if (!sources.get(target.id).includes(id)) sources.get(target.id).push(id);
    if (target.id !== id) migrations.push({ from: id, to: target.id });
  }
  return { ids: [...ids], dropped, migrations, sources };
}

/** Either endpoint may declare a conflict. Pairs are unique and not transitive. */
export function findTargetConflicts(manifest, ids) {
  const selected = new Set(ids);
  const targets = manifest.assistants.filter(target => selected.has(target.id));
  const conflicts = [];
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const a = targets[i];
      const b = targets[j];
      if (a.conflictsWith?.includes(b.id) || b.conflictsWith?.includes(a.id)) {
        conflicts.push([a.id, b.id]);
      }
    }
  }
  return conflicts;
}

/** Check the complete resulting selection before downloading or changing files. */
export function assertCompatibleTargets(manifest, ids, { installedIds = [], sources } = {}) {
  const conflicts = findTargetConflicts(manifest, ids);
  if (!conflicts.length) return;

  const names = assistantNamesFromManifest(manifest);
  const details = conflicts.map(pair => `  ${pair.map(id => formatAssistant(id, names[id])).join(' and ')}`);
  let guidance = 'Choose compatible targets and try again.';
  if (sources) {
    for (const id of new Set(conflicts.flat())) {
      details.push(`  ${id} comes from installed targets: ${sources.get(id).join(', ')}`);
    }
    guidance = 'Use "apm remove" to remove all installed targets contributing to one side of each conflict, then retry the update.';
  } else {
    const installed = [...new Set(conflicts.flat())].filter(id => installedIds.includes(id));
    if (installed.length) {
      details.push(`  Already installed: ${installed.join(', ')}`);
      guidance = 'Choose different targets, or use "apm remove" to remove conflicting installed targets before adding their alternatives.';
    }
  }
  throw CLIError.targetConflict(conflicts, details, guidance);
}
