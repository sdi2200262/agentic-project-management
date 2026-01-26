/**
 * Release Manifest Schema Module
 *
 * Provides validation for apm-release.json schema.
 *
 * @module src/schemas/release
 */

/**
 * Validates an assistant object.
 *
 * @param {Object} assistant - Assistant object to validate.
 * @param {number} index - Index in array for error messages.
 * @returns {string[]} Array of error messages.
 */
function validateAssistant(assistant, index) {
  const errors = [];
  const prefix = `assistants[${index}]`;

  if (typeof assistant !== 'object' || assistant === null) {
    return [`${prefix}: must be an object`];
  }

  if (typeof assistant.id !== 'string' || !assistant.id) {
    errors.push(`${prefix}.id: required string`);
  }

  if (typeof assistant.name !== 'string' || !assistant.name) {
    errors.push(`${prefix}.name: required string`);
  }

  if (typeof assistant.bundle !== 'string' || !assistant.bundle) {
    errors.push(`${prefix}.bundle: required string`);
  }

  if (typeof assistant.configDir !== 'string' || !assistant.configDir) {
    errors.push(`${prefix}.configDir: required string`);
  }

  // description is optional
  if (assistant.description !== undefined && typeof assistant.description !== 'string') {
    errors.push(`${prefix}.description: must be a string if provided`);
  }

  return errors;
}

/**
 * Validates a release manifest object.
 *
 * @param {Object} manifest - Manifest object to validate.
 * @returns {Object} Validation result { valid: boolean, errors: string[] }.
 */
export function validateReleaseManifest(manifest) {
  const errors = [];

  if (typeof manifest !== 'object' || manifest === null) {
    return { valid: false, errors: ['Manifest must be an object'] };
  }

  // version is required
  if (typeof manifest.version !== 'string' || !manifest.version) {
    errors.push('version: required string');
  }

  // assistants is required array
  if (!Array.isArray(manifest.assistants)) {
    errors.push('assistants: required array');
  } else if (manifest.assistants.length === 0) {
    errors.push('assistants: must not be empty');
  } else {
    manifest.assistants.forEach((assistant, index) => {
      errors.push(...validateAssistant(assistant, index));
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Finds an assistant by ID in a manifest.
 *
 * @param {Object} manifest - Validated manifest object.
 * @param {string} id - Assistant ID to find.
 * @returns {Object|null} Assistant object or null if not found.
 */
export function findAssistant(manifest, id) {
  return manifest.assistants.find(a => a.id === id) || null;
}

export default {
  validateReleaseManifest,
  findAssistant
};
