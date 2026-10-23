/**
 * Assistant Names Module
 *
 * Formats assistants the same way in every command: the display name from
 * the release manifest, followed by the ID the user types in -a flags,
 * e.g. "Codex CLI (codex)".
 *
 * @module src/core/assistants
 */

/**
 * Display names of the official assistants, used when metadata written by
 * an older CLI has no names recorded.
 */
const KNOWN_ASSISTANT_NAMES = {
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
  for (const a of manifest?.assistants || []) {
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

export default {
  formatAssistant,
  formatAssistantList,
  assistantNamesFromManifest
};
