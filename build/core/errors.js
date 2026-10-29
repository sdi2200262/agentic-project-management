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

  // Build errors
  ARCHIVE_FAILED: 'ARCHIVE_FAILED',
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
