/**
 * CLI Error Classes Module
 *
 * Provides custom error classes for CLI operations.
 *
 * @module src/core/errors
 */

/**
 * Error codes for CLI operations.
 */
export const CLIErrorCode = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',

  // Release errors
  RELEASE_NOT_FOUND: 'RELEASE_NOT_FOUND',
  MANIFEST_MISSING: 'MANIFEST_MISSING',
  MANIFEST_INVALID: 'MANIFEST_INVALID',
  BUNDLE_NOT_FOUND: 'BUNDLE_NOT_FOUND',

  // Config errors
  CONFIG_READ_FAILED: 'CONFIG_READ_FAILED',
  CONFIG_WRITE_FAILED: 'CONFIG_WRITE_FAILED',

  // Metadata errors
  METADATA_READ_FAILED: 'METADATA_READ_FAILED',
  METADATA_WRITE_FAILED: 'METADATA_WRITE_FAILED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',

  // Extraction errors
  EXTRACTION_FAILED: 'EXTRACTION_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED'
};

/**
 * Base error class for CLI operations.
 */
export class CLIError extends Error {
  /**
   * Creates a CLIError instance.
   *
   * @param {string} message - Error message.
   * @param {string} code - Error code from CLIErrorCode.
   * @param {Object} [context={}] - Additional context data.
   */
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'CLIError';
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
   * Creates a network error.
   *
   * @param {string} url - URL that failed.
   * @param {string} reason - Failure reason.
   * @returns {CLIError} Formatted error instance.
   */
  static networkError(url, reason) {
    return new CLIError(
      `Network request failed for ${url}: ${reason}`,
      CLIErrorCode.NETWORK_ERROR,
      { url, reason }
    );
  }

  /**
   * Creates a release not found error.
   *
   * @param {string} repo - Repository name.
   * @returns {CLIError} Formatted error instance.
   */
  static releaseNotFound(repo) {
    return new CLIError(
      `No compatible releases found for ${repo}`,
      CLIErrorCode.RELEASE_NOT_FOUND,
      { repo }
    );
  }

  /**
   * Creates a manifest missing error.
   *
   * @param {string} tag - Release tag.
   * @returns {CLIError} Formatted error instance.
   */
  static manifestMissing(tag) {
    return new CLIError(
      `Release ${tag} does not contain apm-release.json`,
      CLIErrorCode.MANIFEST_MISSING,
      { tag }
    );
  }

  /**
   * Creates a manifest invalid error.
   *
   * @param {string} tag - Release tag.
   * @param {string[]} errors - Validation errors.
   * @returns {CLIError} Formatted error instance.
   */
  static manifestInvalid(tag, errors) {
    return new CLIError(
      `Invalid apm-release.json in ${tag}: ${errors.join(', ')}`,
      CLIErrorCode.MANIFEST_INVALID,
      { tag, errors }
    );
  }

  /**
   * Creates a bundle not found error.
   *
   * @param {string} bundleName - Bundle filename.
   * @param {string} tag - Release tag.
   * @returns {CLIError} Formatted error instance.
   */
  static bundleNotFound(bundleName, tag) {
    return new CLIError(
      `Bundle ${bundleName} not found in release ${tag}`,
      CLIErrorCode.BUNDLE_NOT_FOUND,
      { bundleName, tag }
    );
  }

  /**
   * Creates a not initialized error.
   *
   * @returns {CLIError} Formatted error instance.
   */
  static notInitialized() {
    return new CLIError(
      'APM is not initialized in this directory. Run "apm init" first.',
      CLIErrorCode.NOT_INITIALIZED
    );
  }

  /**
   * Creates a download failed error.
   *
   * @param {string} url - Download URL.
   * @param {string} reason - Failure reason.
   * @returns {CLIError} Formatted error instance.
   */
  static downloadFailed(url, reason) {
    return new CLIError(
      `Failed to download ${url}: ${reason}`,
      CLIErrorCode.DOWNLOAD_FAILED,
      { url, reason }
    );
  }

  /**
   * Creates an extraction failed error.
   *
   * @param {string} file - ZIP file path.
   * @param {string} reason - Failure reason.
   * @returns {CLIError} Formatted error instance.
   */
  static extractionFailed(file, reason) {
    return new CLIError(
      `Failed to extract ${file}: ${reason}`,
      CLIErrorCode.EXTRACTION_FAILED,
      { file, reason }
    );
  }
}

export default CLIError;
