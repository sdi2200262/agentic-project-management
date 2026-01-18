/**
 * APM Build Script
 * 
 * Generates AI assistant-specific command bundles from markdown templates.
 * Supports Markdown (Claude, Copilot, etc.) and TOML (Gemini, Qwen) formats.
 * 
 * Usage: node build.js
 * 
 * @module build
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

/**
 * Build log levels and prefixes for consistent terminal output
 * @constant {Object}
 */
const LOG = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => process.env.DEBUG === 'true' && console.log(`[DEBUG] ${msg}`)
};

/**
 * Loads and parses build-config.json
 * @returns {Promise<Object>} Configuration with build settings and target assistants
 * @throws {Error} If config file not found or invalid JSON
 */
async function loadConfig() {
  const configPath = 'build-config.json';
  
  if (!await fs.pathExists(configPath)) {
    throw new Error('build-config.json not found');
  }
  
  const configContent = await fs.readFile(configPath, 'utf8');
  return JSON.parse(configContent);
}

/**
 * Recursively finds all .md template files, excluding README.md
 * @param {string} sourceDir - Directory to search
 * @returns {Promise<string[]>} Array of markdown file paths
 */
async function findMdFiles(sourceDir) {
  const files = [];
  const items = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(sourceDir, item.name);
    
    if (item.isDirectory()) {
      files.push(...await findMdFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parses YAML frontmatter from markdown content
 * @param {string} content - Markdown content with potential frontmatter
 * @returns {Object} Object with {frontmatter, content} properties
 */
function parseFrontmatter(content) {
  // Normalize line endings and remove BOM
  content = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const lines = content.split('\n');
  
  if (lines[0] !== '---') {
    return { frontmatter: {}, content };
  }

  const endIndex = lines.indexOf('---', 1);
  
  if (endIndex === -1) {
    return { frontmatter: {}, content };
  }

  const frontmatterStr = lines.slice(1, endIndex).join('\n');
  const body = lines.slice(endIndex + 1).join('\n');

  let frontmatter = {};
  
  try {
    frontmatter = yaml.load(frontmatterStr) || {};
  } catch (err) {
    LOG.warn(`Failed to parse frontmatter: ${err.message}`);
  }

  return { frontmatter, content: body };
}

/**
 * Replaces template placeholders with target-specific values
 * 
 * Supported placeholders:
 * - {VERSION}: Package version
 * - {TIMESTAMP}: ISO timestamp
 * - {SKILL_PATH:path}: Path to skill file
 * - {COMMAND_PATH:filename}: Path to command file
 * - {ARGS}: $ARGUMENTS (markdown) or {{args}} (toml)
 * - {AGENTS_FILE}: Platform-specific agents file name
 * - {SKILLS_DIR}: Platform-specific skills directory
 * 
 * @param {string} content - Template content with placeholders
 * @param {string} version - Version string
 * @param {Object} targetDirectories - Target directory configuration
 * @param {string} format - Target format ('markdown' or 'toml')
 * @param {Object} target - Target configuration object
 * @param {Object} options - Additional options
 * @param {Date} options.now - Timestamp for replacement
 * @param {Object} options.commandFileMap - Map of command filenames
 * @returns {string} Content with placeholders replaced
 */
function replacePlaceholders(content, version, targetDirectories, format, target, options = {}) {
  const { now = new Date(), commandFileMap = {} } = options;
  
  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, now.toISOString());

  // Replace SKILL_PATH placeholder
  replaced = replaced.replace(/{SKILL_PATH:([^}]+)}/g, (_match, skillPath) => {
    return path.join(targetDirectories.skills, skillPath);
  });

  // Replace COMMAND_PATH placeholder
  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (_match, filename) => {
    const base = path.basename(filename, path.extname(filename));
    const resolved = commandFileMap[base] || commandFileMap[filename] || filename;
    return path.join(targetDirectories.commands, resolved);
  });

  // Replace ARGS placeholder based on format
  const argsPlaceholder = format === 'toml' ? '{{args}}' : '$ARGUMENTS';
  replaced = replaced.replace(/{ARGS}/g, argsPlaceholder);

  // Replace AGENTS_FILE placeholder
  const agentsFileName = target.id === 'claude' ? 'CLAUDE.md' : 'AGENTS.md';
  replaced = replaced.replace(/{AGENTS_FILE}/g, agentsFileName);

  // Replace SKILLS_DIR placeholder
  replaced = replaced.replace(/{SKILLS_DIR}/g, targetDirectories.skills);

  return replaced;
}

/**
 * Creates a ZIP archive from a directory
 * @param {string} sourceDir - Directory to compress
 * @param {string} outputPath - Path for the output .zip file
 * @returns {Promise<void>}
 * @throws {Error} If archiving fails
 */
async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

/**
 * Builds command filename map for COMMAND_PATH placeholder resolution
 * @param {string[]} templateFiles - Array of template file paths
 * @param {Object} target - Target configuration
 * @returns {Promise<Object>} Map of original filename to built filename
 * @private
 */
async function buildCommandFileMap(templateFiles, target) {
  const commandFileMap = {};
  
  for (const templatePath of templateFiles) {
    const content = await fs.readFile(templatePath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    
    if (frontmatter.command_name === undefined) {
      continue;
    }

    const originalBase = path.basename(templatePath, '.md');
    const priority = frontmatter.priority || 'default';
    const sanitizedCommandName = String(frontmatter.command_name || '').replace(/[^a-zA-Z0-9-_]/g, '-');
    const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;

    // Determine extension based on target format
    let finalExt;
    if (target.format === 'toml') {
      finalExt = '.toml';
    } else {
      finalExt = target.id === 'copilot' ? '.prompt.md' : '.md';
    }
    
    const finalFilename = `${fullCommandName}${finalExt}`;
    commandFileMap[originalBase] = finalFilename;
    commandFileMap[`${originalBase}.md`] = finalFilename;
  }
  
  return commandFileMap;
}

/**
 * Processes a single template file
 * @param {string} templatePath - Path to template file
 * @param {Object} target - Target configuration
 * @param {string} version - Version string
 * @param {Object} commandFileMap - Command filename map
 * @param {string} commandsDir - Output commands directory
 * @param {string} skillsDir - Output skills directory
 * @param {string} targetBuildDir - Target build directory
 * @returns {Promise<void>}
 * @private
 */
async function processTemplate(templatePath, target, version, commandFileMap, commandsDir, skillsDir, targetBuildDir) {
  const content = await fs.readFile(templatePath, 'utf8');
  const { frontmatter, content: body } = parseFrontmatter(content);

  const isCommand = frontmatter.command_name !== undefined;
  const category = isCommand ? 'command' : 'skill';

  const processedBody = replacePlaceholders(body, version, target.directories, target.format, target, { commandFileMap });
  const processedFull = replacePlaceholders(content, version, target.directories, target.format, target, { commandFileMap });

  const originalFilename = path.basename(templatePath, '.md');
  let outputFilename;
  let finalContent;

  if (isCommand && frontmatter.command_name) {
    const priority = frontmatter.priority || 'default';
    const sanitizedCommandName = frontmatter.command_name.replace(/[^a-zA-Z0-9-_]/g, '-');
    const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;

    if (target.format === 'toml') {
      outputFilename = `${fullCommandName}.toml`;
      const description = frontmatter.description || 'APM command';
      finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
    } else {
      outputFilename = `${fullCommandName}.md`;
      finalContent = processedFull;
    }
  } else {
    outputFilename = `${originalFilename}.md`;
    finalContent = processedFull;
  }

  const outputDirPath = isCommand ? commandsDir : skillsDir;
  const outputPath = path.join(outputDirPath, outputFilename);

  await fs.writeFile(outputPath, finalContent);
  LOG.info(`${category}: ${originalFilename}.md → ${path.relative(targetBuildDir, outputPath)}`);
}

/**
 * Renames Copilot command files from .md to .prompt.md
 * @param {string} commandsDir - Commands directory path
 * @returns {Promise<void>}
 * @private
 */
async function renameCopilotCommands(commandsDir) {
  const commandFiles = await fs.readdir(commandsDir);
  
  for (const file of commandFiles) {
    if (file.endsWith('.md') && !file.endsWith('.prompt.md')) {
      const oldPath = path.join(commandsDir, file);
      const newPath = path.join(commandsDir, file.replace(/\.md$/, '.prompt.md'));
      await fs.rename(oldPath, newPath);
      LOG.info(`Renamed: ${file} → ${path.basename(newPath)}`);
    }
  }
}

/**
 * Main build function - processes templates for all target assistants
 * @param {Object} config - Build configuration from build-config.json
 * @param {string} version - Version string for placeholder replacement
 * @returns {Promise<void>}
 */
async function build(config, version) {
  const { build: buildConfig, targets } = config;
  const { outputDir, cleanOutput } = buildConfig;

  if (cleanOutput) {
    await fs.emptyDir(outputDir);
  } else {
    await fs.ensureDir(outputDir);
  }

  LOG.info(`Building ${targets.length} targets to ${outputDir}...`);

  for (const target of targets) {
    const targetBuildDir = path.join(outputDir, `${target.id}-build`);
    const commandsDir = path.join(targetBuildDir, 'commands');
    const skillsDir = path.join(targetBuildDir, 'skills');

    LOG.info(`\nProcessing target: ${target.name} (${target.id})`);

    await fs.ensureDir(commandsDir);
    await fs.ensureDir(skillsDir);

    const templateFiles = await findMdFiles(buildConfig.sourceDir);
    LOG.info(`Found ${templateFiles.length} template files`);

    // Pre-compute command filename mapping
    const commandFileMap = await buildCommandFileMap(templateFiles, target);

    // Process all templates
    for (const templatePath of templateFiles) {
      await processTemplate(templatePath, target, version, commandFileMap, commandsDir, skillsDir, targetBuildDir);
    }

    // Handle target-specific post-processing
    if (target.id === 'copilot') {
      await renameCopilotCommands(commandsDir);
    }

    LOG.success(`Completed target: ${target.name}`);

    // Create ZIP archive
    const zipPath = path.join(outputDir, target.bundleName);
    LOG.info(`Creating archive: ${target.bundleName}...`);
    
    try {
      await createZipArchive(targetBuildDir, zipPath);
      LOG.success(`Archive created: ${target.bundleName}`);
      
      await fs.remove(targetBuildDir);
      LOG.info(`Cleaned up: ${path.basename(targetBuildDir)}`);
    } catch (err) {
      LOG.error(`Failed to create archive for ${target.name}: ${err.message}`);
      throw err;
    }
  }

  LOG.success('\nBuild completed successfully!');
}

/**
 * Main entry point - loads config and executes build
 */
async function main() {
  try {
    const config = await loadConfig();
    
    const packageJson = await fs.readFile('package.json', 'utf8');
    const { version } = JSON.parse(packageJson);

    await build(config, version);

  } catch (err) {
    LOG.error(`Build failed: ${err.message}`);
    process.exit(1);
  }
}

// Export functions for testing
export { loadConfig, findMdFiles, parseFrontmatter, replacePlaceholders, createZipArchive, build };

// Run build when executed directly
const currentFile = fileURLToPath(import.meta.url);
const mainFile = resolve(process.argv[1]);

if (currentFile === mainFile) {
  main();
}
