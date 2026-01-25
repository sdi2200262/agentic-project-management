/**
 * Manifest Generation Module
 *
 * Generates bundle and release manifests.
 *
 * @module build/generators/manifest
 */

import { MANIFEST_VERSION, SCAFFOLD_MAPPINGS } from '../core/constants.js';

/**
 * Generates a bundle manifest for a specific target.
 *
 * @param {Object} target - Target configuration object.
 * @returns {Object} Bundle manifest object.
 */
export function generateBundleManifest(target) {
  return {
    manifestVersion: MANIFEST_VERSION,
    assistant: {
      name: target.name,
      id: target.id
    },
    directories: {
      commands: target.directories.commands,
      skills: target.directories.skills
    },
    scaffold: SCAFFOLD_MAPPINGS
  };
}

/**
 * Generates a release manifest for all targets.
 *
 * @param {Object} config - Build configuration.
 * @param {string} version - Template version string.
 * @returns {Object} Release manifest object.
 */
export function generateReleaseManifest(config, version) {
  const assistants = config.targets.map(target => ({
    name: target.name,
    id: target.id,
    bundle: target.bundleName,
    description: `Optimized for ${target.name}`
  }));

  return {
    manifestVersion: MANIFEST_VERSION,
    templateVersion: version,
    assistants
  };
}
