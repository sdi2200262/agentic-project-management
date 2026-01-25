/**
 * Build System Constants
 *
 * Central location for build-related constants.
 *
 * @module build/core/constants
 */

/**
 * Manifest version for bundle and release manifests.
 * @constant {string}
 */
export const MANIFEST_VERSION = '1.0';

/**
 * Scaffold file mappings for bundle manifests.
 * Maps source scaffold files to their destination paths.
 * @constant {Object}
 */
export const SCAFFOLD_MAPPINGS = {
  'Memory_Root.md': '.apm/Memory/Memory_Root.md',
  'Implementation_Plan.md': '.apm/Implementation_Plan.md',
  'Specifications.md': '.apm/Specifications.md'
};
