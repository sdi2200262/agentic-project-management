/**
 * Build System Logger Module
 *
 * Simple logging for build output. Separate from CLI logger.
 *
 * @module build/utils/logger
 */

import chalk from 'chalk';

/**
 * Logs an informational message to stdout.
 *
 * @param {string} message - Message to log.
 */
export function info(message) {
  console.log(`${chalk.white('[INFO]')} ${message}`);
}

/**
 * Logs a warning message to stdout.
 *
 * @param {string} message - Message to log.
 */
export function warn(message) {
  console.log(`${chalk.yellow('[WARN]')} ${message}`);
}

/**
 * Logs an error message to stderr.
 *
 * @param {string} message - Message to log.
 */
export function error(message) {
  console.error(`${chalk.red('[ERROR]')} ${message}`);
}

/**
 * Logs a success message to stdout.
 *
 * @param {string} message - Message to log.
 */
export function success(message) {
  console.log(`${chalk.green('[SUCCESS]')} ${message}`);
}

/**
 * Logs a debug message to stdout when DEBUG=true.
 *
 * @param {string} message - Message to log.
 */
export function debug(message) {
  if (process.env.DEBUG === 'true') {
    console.log(`${chalk.magenta('[DEBUG]')} ${message}`);
  }
}

export default { info, warn, error, success, debug };
