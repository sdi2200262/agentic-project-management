/**
 * Centralized logging utility for APM CLI
 * Provides consistent terminal output with standardized prefixes and colors
 * 
 * @module logger
 */

import chalk from 'chalk';

/**
 * Log levels and their corresponding chalk color functions
 */
const LOG_LEVELS = {
  INFO: chalk.white,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  SUCCESS: chalk.green,
  DEBUG: chalk.magenta,
};

/**
 * Indentation for continuation lines
 */
const INDENT = '  ';

/**
 * Logs an informational message
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 */
export function info(message, options = {}) {
  const prefix = LOG_LEVELS.INFO('[INFO]');
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formattedMessage}`);
}

/**
 * Logs a warning message
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 */
export function warn(message, options = {}) {
  const prefix = LOG_LEVELS.WARN('[WARN]');
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formattedMessage}`);
}

/**
 * Logs an error message
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 * @param {Error} options.error - Optional error object for stack trace
 */
export function error(message, options = {}) {
  const prefix = LOG_LEVELS.ERROR('[ERROR]');
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.error(`${prefix} ${formattedMessage}`);
  
  if (options.error && options.error.stack) {
    console.error(chalk.gray(options.error.stack));
  }
}

/**
 * Logs a success message
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 */
export function success(message, options = {}) {
  const prefix = LOG_LEVELS.SUCCESS('[SUCCESS]');
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formattedMessage}`);
}

/**
 * Logs a debug message (only in debug mode)
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 * @param {boolean} options.force - Force logging even if not in debug mode
 */
export function debug(message, options = {}) {
  const isDebug = process.env.DEBUG === 'true' || options.force;
  
  if (!isDebug) {
    return;
  }
  
  const prefix = LOG_LEVELS.DEBUG('[DEBUG]');
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(`${prefix} ${formattedMessage}`);
}

/**
 * Logs a gray/dimmed message (for less important information)
 * @param {string} message - The message to log
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 */
export function dim(message, options = {}) {
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(chalk.gray(formattedMessage));
}

/**
 * Logs a message with a custom prefix and color
 * @param {string} prefix - The prefix to use
 * @param {string} message - The message to log
 * @param {Function} colorFn - Chalk color function
 * @param {Object} options - Logging options
 * @param {boolean} options.indent - Whether to indent the message
 */
export function custom(prefix, message, colorFn = chalk.white, options = {}) {
  const formattedPrefix = colorFn(`[${prefix}]`);
  const formattedMessage = options.indent ? `${INDENT}${message}` : message;
  console.log(`${formattedPrefix} ${formattedMessage}`);
}

/**
 * Logs a blank line
 */
export function blank() {
  console.log('');
}

/**
 * Logs a horizontal line separator
 * @param {number} length - Length of the line (default: 50)
 */
export function line(length = 50) {
  console.log(chalk.gray('─'.repeat(length)));
}

/**
 * Default export with all logging functions
 */
export default {
  info,
  warn,
  error,
  success,
  debug,
  dim,
  custom,
  blank,
  line,
  // Re-export chalk for custom coloring needs
  chalk,
};
