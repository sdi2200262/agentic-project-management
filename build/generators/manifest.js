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
      bundle: target.bundleName,
      // Kept for v1.1.x only: CLI 1.0.2 rejects a manifest without configDir before it reads
      // minCliVersion. Remove in the next minor template release.
      configDir: target.directories.skills.split('/')[0]
    };
    if (target.replaces) entry.replaces = target.replaces;
    if (target.postInstallNote) {
      entry.postInstallNote = target.postInstallNote;
    }
    return entry;
  });

  const manifest = { version, assistants };
  // Optional: CLI versions older than this refuse the release (only CLI v1.0.2 and later read it)
  if (config.build?.minCliVersion) {
    // CLI 1.0.2 ignores a version it can't parse, so fail the build instead
    if (!/^\d+\.\d+\.\d+$/.test(config.build.minCliVersion)) {
      throw new Error(`build.minCliVersion "${config.build.minCliVersion}" must be a version such as 1.0.3`);
    }
    manifest.minCliVersion = config.build.minCliVersion;
  }
  return manifest;
}
