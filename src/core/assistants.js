/** Formats installation targets using manifest names or known names for older metadata. */

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
 * @returns {{ ids: string[], dropped: string[], migrations: Object[] }}
 */
export function resolveUpdateTargets(installedIds, manifest) {
  const ids = new Set();
  const dropped = [];
  const migrations = [];
  for (const id of installedIds) {
    const target = manifest.assistants.find(a => a.id === id)
      || manifest.assistants.find(a => a.replaces?.includes(id));
    if (!target) {
      dropped.push(id);
      continue;
    }
    ids.add(target.id);
    if (target.id !== id) migrations.push({ from: id, to: target.id });
  }
  return { ids: [...ids], dropped, migrations };
}
