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

// Pad all prefixes to match [SUCCESS] (longest at 9 chars)
const PREFIX_WIDTH = 9;
const INDENT = '  ';

/**
 * Whether stdout is an interactive terminal.
 * When false (piped, redirected, or run by an agent), skip
 * screen clearing, cursor manipulation, and progress animation.
 */
const IS_TTY = !!process.stdout.isTTY;

/**
 * Logs an informational message.
 *
 * @param {string} message - Message to log.
 * @param {Object} [options={}] - Logging options.
 * @param {boolean} [options.indent] - Whether to indent the message.
 */
export function info(message, options = {}) {
  const prefix = LOG_LEVELS.INFO('[INFO]'.padEnd(PREFIX_WIDTH));
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
  const prefix = LOG_LEVELS.WARN('[WARN]'.padEnd(PREFIX_WIDTH));
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
  const prefix = LOG_LEVELS.ERROR('[ERROR]'.padEnd(PREFIX_WIDTH));
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
  const prefix = LOG_LEVELS.SUCCESS('[SUCCESS]'.padEnd(PREFIX_WIDTH));
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

  const prefix = LOG_LEVELS.DEBUG('[DEBUG]'.padEnd(PREFIX_WIDTH));
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

// Number of lines the banner occupies (set after first render)
let bannerHeight = 0;

/**
 * Displays the APM ASCII banner with separator line.
 */
export function banner() {
  const colorA = chalk.white;
  const colorP = chalk.cyan;
  const colorM = chalk.cyan;

  const lines = [
    '',
    '',
    '',
    '                         ' + colorA('█████╗') + ' ' + colorP('██████╗') + ' ' + colorM('███╗   ███╗'),
    '                        ' + colorA('██╔══██╗') + colorP('██╔══██╗') + colorM('████╗ ████║'),
    '                     ' + colorP('█████████████████╔╝') + colorM('██╔████╔██║'),
    '                     ' + colorP('╚══') + colorA('██') + colorP('═══') + colorA('██') + colorP('═██╔═══╝ ') + colorM('██║╚██╔╝██║'),
    '                        ' + colorA('██║  ██║') + colorP('██║     ') + colorM('██║ ╚═╝ ██║'),
    '                        ' + colorA('╚═╝  ╚═╝') + colorP('╚═╝     ') + colorM('╚═╝     ╚═╝'),
    '',
    ' ' + chalk.gray('Manage complex projects with a team of AI assistants, smoothly and efficiently.'),
    '',
    ' ' + chalk.gray('─'.repeat(80)),
    ''
  ];

  lines.forEach(line => console.log(line));
  bannerHeight = lines.length;
}

/**
 * Clears content below the banner and repositions cursor.
 * On first call, clears the screen and renders the banner.
 * On subsequent calls, only clears the content area — the banner stays put.
 * In non-TTY mode, prints the banner once and skips all clearing.
 */
export function clearAndBanner() {
  if (!IS_TTY) {
    if (bannerHeight === 0) banner();
    return;
  }
  if (bannerHeight === 0) {
    console.clear();
    banner();
  } else {
    // Move cursor to line after banner, clear everything below
    process.stdout.write(`\x1b[${bannerHeight + 1};1H\x1b[J`);
  }
}

/**
 * Logs a horizontal line separator.
 *
 * @param {number} [length=50] - Length of the line.
 */
export function line(length = 50) {
  console.log(chalk.gray('-'.repeat(length)));
}

/**
 * Clears screen, shows banner, and displays an animated progress message.
 * Returns a stop function. Designed to be naturally wiped by the next
 * prompt's clearAndBanner(), but stop() should be called to clean up.
 * In non-TTY mode, prints the message once with no animation.
 *
 * @param {string} message - Progress message to display.
 * @returns {Function} Stop function to clear the animation.
 */
export function progress(message) {
  if (!IS_TTY) {
    console.log('  ' + message + '...');
    return () => {};
  }
  const frames = ['.', '..', '...'];
  let i = 0;
  process.stdout.write('  ' + chalk.dim(message + frames[0]));
  const timer = setInterval(() => {
    i = (i + 1) % frames.length;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write('  ' + chalk.dim(message + frames[i]));
  }, 300);
  return () => {
    clearInterval(timer);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  };
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
  banner,
  clearAndBanner,
  progress,
  chalk
};
