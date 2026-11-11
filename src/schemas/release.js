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

  // Defense-in-depth: reject path traversal patterns
  if (typeof assistant.bundle === 'string' && assistant.bundle.includes('..')) {
    errors.push(`${prefix}.bundle: must not contain path traversal sequences`);
  }

  if (assistant.replaces !== undefined && (!Array.isArray(assistant.replaces)
    || assistant.replaces.some(id => typeof id !== 'string' || !id))) {
    errors.push(`${prefix}.replaces: must be an array of non-empty IDs`);
  }

  if (assistant.conflictsWith !== undefined) {
    if (!Array.isArray(assistant.conflictsWith)
      || assistant.conflictsWith.some(id => typeof id !== 'string' || !id.trim())) {
      errors.push(`${prefix}.conflictsWith: must be an array of non-empty IDs`);
    } else if (new Set(assistant.conflictsWith).size !== assistant.conflictsWith.length) {
      errors.push(`${prefix}.conflictsWith: duplicate ID`);
    }
  }

  // description is optional
  if (assistant.description !== undefined && typeof assistant.description !== 'string') {
    errors.push(`${prefix}.description: must be a string if provided`);
  }

  // postInstallNote is optional
  if (assistant.postInstallNote !== undefined && typeof assistant.postInstallNote !== 'string') {
    errors.push(`${prefix}.postInstallNote: must be a string if provided`);
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

  // minCliVersion is optional
  if (manifest.minCliVersion !== undefined && typeof manifest.minCliVersion !== 'string') {
    errors.push('minCliVersion: must be a string if provided');
  }

  // assistants is required array
  if (!Array.isArray(manifest.assistants)) {
    errors.push('assistants: required array');
  } else if (manifest.assistants.length === 0) {
    errors.push('assistants: must not be empty');
  } else {
    const ids = new Set();
    const replacements = new Set();
    manifest.assistants.forEach((assistant, index) => {
      errors.push(...validateAssistant(assistant, index));
      if (!assistant || typeof assistant !== 'object') return;
      if (ids.has(assistant.id)) errors.push(`assistants[${index}].id: duplicate ID`);
      ids.add(assistant.id);
      if (Array.isArray(assistant.replaces)) {
        for (const id of assistant.replaces) {
          if (replacements.has(id)) errors.push(`assistants[${index}].replaces: duplicate replacement ID`);
          replacements.add(id);
        }
      }
    });

    // Resolve references after collecting every target ID, including later entries.
    let hasConflicts = false;
    manifest.assistants.forEach((assistant, index) => {
      if (!Array.isArray(assistant?.conflictsWith)) return;
      if (assistant.conflictsWith.length) hasConflicts = true;
      for (const id of assistant.conflictsWith) {
        if (id === assistant.id) errors.push(`assistants[${index}].conflictsWith: cannot reference itself`);
        else if (!ids.has(id)) errors.push(`assistants[${index}].conflictsWith: unknown target "${id}"`);
      }
    });
    if (hasConflicts) {
      // CLI 1.0.4 first enforces conflicts. Require a stable numeric minimum;
      // older manifests without conflicts keep their existing version rules.
      const minimum = typeof manifest.minCliVersion === 'string'
        && manifest.minCliVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);
      const supported = minimum && (Number(minimum[1]) > 1
        || (Number(minimum[1]) === 1 && (Number(minimum[2]) > 0 || Number(minimum[3]) >= 4)));
      if (!supported) errors.push('conflictsWith requires minCliVersion 1.0.4 or later (stable X.Y.Z)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  validateReleaseManifest
};
