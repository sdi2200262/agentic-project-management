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
  const assistants = config.targets.map(target => {
    const entry = {
      id: target.id,
      name: target.name,
      bundle: target.bundleName
    };
    if (target.postInstallNote) {
      entry.postInstallNote = target.postInstallNote;
    }
    return entry;
  });

  const manifest = { version, assistants };
  // Optional: CLI versions older than this refuse the release (only CLI v1.0.2 and later read it)
  if (config.build?.minCliVersion) {
    manifest.minCliVersion = config.build.minCliVersion;
  }
  return manifest;
}
