/**
 * Manifest Generation Module
 *
 * Generates release manifest for CLI consumption.
 *
 * @module build/generators/manifest
 */

/**
 * Generates a release manifest for all targets.
 *
 * @param {Object} config - Build configuration.
 * @param {string} version - Version string.
 * @returns {Object} Release manifest object.
 */
export function generateReleaseManifest(config, version) {
  const assistants = config.targets.map(target => ({
    id: target.id,
    name: target.name,
    bundle: target.bundleName,
    description: `Optimized for ${target.name}`,
    configDir: target.configDir
  }));

  return {
    version,
    assistants
  };
}
