/**
 * Build System Error Classes
 *
 * Provides custom error classes with error codes for consistent
 * error handling across the build system.
 *
 * @module build/core/errors
 */

/**
 * Error codes for build operations.
 * @enum {string}
 */
export const BuildErrorCode = {
  // Config errors
  CONFIG_NOT_FOUND: 'CONFIG_NOT_FOUND',
  CONFIG_INVALID: 'CONFIG_INVALID',
  CONFIG_MISSING_FIELD: 'CONFIG_MISSING_FIELD',

  // Template errors
  TEMPLATE_PARSE_FAILED: 'TEMPLATE_PARSE_FAILED',
  TEMPLATE_MISSING_FIELD: 'TEMPLATE_MISSING_FIELD',
  TEMPLATE_READ_FAILED: 'TEMPLATE_READ_FAILED',

  // Build errors
  DUPLICATE_COMMAND: 'DUPLICATE_COMMAND',
  ARCHIVE_FAILED: 'ARCHIVE_FAILED',
  WRITE_FAILED: 'WRITE_FAILED'
};

/**
 * Base error class for build operations.
 */
export class BuildError extends Error {
  /**
   * Creates a BuildError instance.
   *
   * @param {string} message - Error message.
   * @param {string} code - Error code from BuildErrorCode enum.
   * @param {Object} [context={}] - Additional context data.
   */
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'BuildError';
    this.code = code;
    this.context = context;
  }

  /**
   * Converts the error to a JSON-serializable object.
   *
   * @returns {Object} JSON representation.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context
    };
  }

  /**
   * Creates a BuildError for missing config file.
   *
   * @param {string} path - Expected config file path.
   * @returns {BuildError} Formatted error instance.
   */
  static configNotFound(path) {
    return new BuildError(
      `Configuration file not found: ${path}`,
      BuildErrorCode.CONFIG_NOT_FOUND,
      { path }
    );
  }

  /**
   * Creates a BuildError for invalid config.
   *
   * @param {string[]} errors - Array of validation error messages.
   * @returns {BuildError} Formatted error instance.
   */
  static configInvalid(errors) {
    return new BuildError(
      `Invalid configuration: ${errors.join(', ')}`,
      BuildErrorCode.CONFIG_INVALID,
      { errors }
    );
  }

  /**
   * Creates a BuildError for missing config field.
   *
   * @param {string} field - Missing field name.
   * @returns {BuildError} Formatted error instance.
   */
  static configMissingField(field) {
    return new BuildError(
      `Missing required configuration field: ${field}`,
      BuildErrorCode.CONFIG_MISSING_FIELD,
      { field }
    );
  }

  /**
   * Creates a BuildError for template parse failure.
   *
   * @param {string} file - Template file path.
   * @param {string} reason - Parse failure reason.
   * @returns {BuildError} Formatted error instance.
   */
  static templateParseFailed(file, reason) {
    return new BuildError(
      `Failed to parse template ${file}: ${reason}`,
      BuildErrorCode.TEMPLATE_PARSE_FAILED,
      { file, reason }
    );
  }

  /**
   * Creates a BuildError for missing frontmatter field.
   *
   * @param {string} file - Template file path.
   * @param {string} field - Missing field name.
   * @returns {BuildError} Formatted error instance.
   */
  static templateMissingField(file, field) {
    return new BuildError(
      `Missing required frontmatter field "${field}" in ${file}`,
      BuildErrorCode.TEMPLATE_MISSING_FIELD,
      { file, field }
    );
  }

  /**
   * Creates a BuildError for duplicate command names.
   *
   * @param {string} name - Duplicate command name.
   * @param {string[]} files - Files containing the duplicate.
   * @returns {BuildError} Formatted error instance.
   */
  static duplicateCommand(name, files) {
    return new BuildError(
      `Duplicate command_name "${name}" in: ${files.join(', ')}`,
      BuildErrorCode.DUPLICATE_COMMAND,
      { name, files }
    );
  }

  /**
   * Creates a BuildError for archive creation failure.
   *
   * @param {string} target - Target name.
   * @param {string} reason - Failure reason.
   * @returns {BuildError} Formatted error instance.
   */
  static archiveFailed(target, reason) {
    return new BuildError(
      `Failed to create archive for ${target}: ${reason}`,
      BuildErrorCode.ARCHIVE_FAILED,
      { target, reason }
    );
  }
}
