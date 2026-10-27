/**
 * APM Build System Entry Point
 *
 * Generates installation bundles from shared Markdown templates.
 * Both installation targets use Markdown.
 *
 * Usage: node build/index.js
 *
 * @module build
 */

import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { loadConfig } from './core/config.js';
import { buildAll } from './processors/templates.js';
import logger from './utils/logger.js';

/**
 * Main entry point for the build system.
 */
async function main() {
  try {
    const config = await loadConfig();
    await buildAll(config);
    process.exit(0);
  } catch (err) {
    logger.error(`Build failed: ${err.message}`);
    if (err.code) {
      logger.debug(`Error code: ${err.code}`);
    }
    if (err.context) {
      logger.debug(`Context: ${JSON.stringify(err.context)}`);
    }
    process.exit(1);
  }
}

// Run build when executed directly
const currentFile = fileURLToPath(import.meta.url);
const mainFile = resolve(process.argv[1]);

if (currentFile === mainFile) {
  main();
}

// Export for testing
export { main };
