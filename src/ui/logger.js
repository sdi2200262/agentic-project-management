/**
 * CLI Logging Module
 *
 * Provides consistent terminal output with standardized prefixes and colors.
 *
 * @module src/ui/logger
 */

import chalk from 'chalk';

const LOG_LEVELS = {
  INFO: chalk.white,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  SUCCESS: chalk.green,
  DEBUG: chalk.magenta
};

const INDENT = '  ';

/**
 * Logs an informational message.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 */
export function info(message, options = {}) {
  const prefix = LOG_LEVELS.INFO('[INFO]');
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formatted}`);
}

/**
 * Logs a warning message.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 */
export function warn(message, options = {}) {
  const prefix = LOG_LEVELS.WARN('[WARN]');
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formatted}`);
}

/**
 * Logs an error message.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 * @param {Error} [options.error] - Optional error object for stack trace.
 */
export function error(message, options = {}) {
  const prefix = LOG_LEVELS.ERROR('[ERROR]');
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.error(`${prefix} ${formatted}`);

  if (options.error?.stack) {
    console.error(chalk.gray(options.error.stack));
  }
}

/**
 * Logs a success message.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 */
export function success(message, options = {}) {
  const prefix = LOG_LEVELS.SUCCESS('[SUCCESS]');
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formatted}`);
}

/**
 * Logs a debug message (only when DEBUG=true).
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 * @param {boolean} [options.force] - Force logging even if not in debug mode.
 */
export function debug(message, options = {}) {
  const isDebug = process.env.DEBUG === 'true' || options.force;
  if (!isDebug) return;

  const prefix = LOG_LEVELS.DEBUG('[DEBUG]');
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formatted}`);
}

/**
 * Logs a dimmed message for less important information.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 */
export function dim(message, options = {}) {
  const formatted = options.indent ? `${INDENT}${message}` : message;
  console.log(chalk.gray(formatted));
}

/**
 * Logs a blank line.
 */
export function blank() {
  console.log('');
}

/**
 * Logs a horizontal line separator.
 *
 * @param {number} [length=50] - Length of the line.
 */
export function line(length = 50) {
  console.log(chalk.gray('-'.repeat(length)));
}

export default {
  info,
  warn,
  error,
  success,
  debug,
  dim,
  blank,
  line,
  chalk
};
