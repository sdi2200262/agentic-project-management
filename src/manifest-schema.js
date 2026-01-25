/**
 * APM Manifest Schema Module
 *
 * Provides manifest version constant and validation functions for
 * release and bundle manifests.
 *
 * @module manifest-schema
 */

/**
 * Current manifest version supported by this CLI
 * @constant {string}
 */
export const MANIFEST_VERSION = '1.0';

/**
 * Checks if a manifest version is supported by this CLI
 * @param {string} version - Manifest version to check
 * @returns {boolean} True if version is supported
 */
export function isManifestVersionSupported(version) {
  return version === MANIFEST_VERSION;
}

/**
 * Validates a release manifest structure
 * @param {Object} manifest - Release manifest object to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateReleaseManifest(manifest) {
  const errors = [];

  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be an object'] };
  }

  // Check manifestVersion
  if (!manifest.manifestVersion) {
    errors.push('Missing required field: manifestVersion');
  } else if (!isManifestVersionSupported(manifest.manifestVersion)) {
    errors.push(`Unsupported manifest version: ${manifest.manifestVersion}. Supported: ${MANIFEST_VERSION}`);
  }

  // Check templateVersion
  if (!manifest.templateVersion) {
    errors.push('Missing required field: templateVersion');
  } else if (typeof manifest.templateVersion !== 'string') {
    errors.push('Field templateVersion must be a string');
  }

  // Check assistants array
  if (!manifest.assistants) {
    errors.push('Missing required field: assistants');
  } else if (!Array.isArray(manifest.assistants)) {
    errors.push('Field assistants must be an array');
  } else {
    manifest.assistants.forEach((assistant, index) => {
      if (!assistant.name) {
        errors.push(`Assistant at index ${index} missing required field: name`);
      }
      if (!assistant.id) {
        errors.push(`Assistant at index ${index} missing required field: id`);
      }
      if (!assistant.bundle) {
        errors.push(`Assistant at index ${index} missing required field: bundle`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a bundle manifest structure
 * @param {Object} manifest - Bundle manifest object to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateBundleManifest(manifest) {
  const errors = [];

  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be an object'] };
  }

  // Check manifestVersion
  if (!manifest.manifestVersion) {
    errors.push('Missing required field: manifestVersion');
  } else if (!isManifestVersionSupported(manifest.manifestVersion)) {
    errors.push(`Unsupported manifest version: ${manifest.manifestVersion}. Supported: ${MANIFEST_VERSION}`);
  }

  // Check assistant object
  if (!manifest.assistant) {
    errors.push('Missing required field: assistant');
  } else if (typeof manifest.assistant !== 'object') {
    errors.push('Field assistant must be an object');
  } else {
    if (!manifest.assistant.name) {
      errors.push('Assistant missing required field: name');
    }
    if (!manifest.assistant.id) {
      errors.push('Assistant missing required field: id');
    }
  }

  // Check directories object
  if (!manifest.directories) {
    errors.push('Missing required field: directories');
  } else if (typeof manifest.directories !== 'object') {
    errors.push('Field directories must be an object');
  } else {
    if (!manifest.directories.commands) {
      errors.push('Directories missing required field: commands');
    }
  }

  // Check scaffold object (optional but must be valid if present)
  if (manifest.scaffold && typeof manifest.scaffold !== 'object') {
    errors.push('Field scaffold must be an object');
  }

  return { valid: errors.length === 0, errors };
}
