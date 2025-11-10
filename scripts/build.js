/**
 * APM Build Script
 * 
 * Generates AI assistant-specific command bundles from markdown templates.
 * Supports Markdown (Claude, Copilot, etc.) and TOML (Gemini, Qwen) formats.
 * 
 * Usage: node build.js
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import archiver from 'archiver';

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
  // Normalize line endings and remove BOM for robustness
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
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error.message);
  }

  return { frontmatter, content: body };
}

/**
 * Replaces template placeholders with target-specific values
 * 
 * Supported placeholders:
 * - {VERSION}: Package version
 * - {TIMESTAMP}: ISO timestamp
 * - {GUIDE_PATH:filename}: Path to guide file
 * - {COMMAND_PATH:filename}: Path to command file
 * - {ARGS}: $ARGUMENTS (markdown) or {{args}} (toml)
 * 
 * @param {string} content - Template content with placeholders
 * @param {string} version - Version string
 * @param {Object} targetDirectories - Target directory configuration
 * @param {string} format - Target format ('markdown' or 'toml')
 * @param {Date} [now] - Optional timestamp for deterministic testing
 * @returns {string} Content with placeholders replaced
 */
function replacePlaceholders(content, version, targetDirectories, format, options = {}) {
  const { now = new Date(), commandFileMap = {} } = options;
  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, now.toISOString());

  replaced = replaced.replace(/{GUIDE_PATH:([^}]+)}/g, (_match, filename) => {
    return path.join(targetDirectories.guides, filename);
  });

  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (_match, filename) => {
    // Map referenced template filename to the final built command filename for this target
    const base = path.basename(filename, path.extname(filename));
    const resolved = commandFileMap[base] || commandFileMap[filename] || filename;
    return path.join(targetDirectories.commands, resolved);
  });

  const argsPlaceholder = format === 'toml' ? '{{args}}' : '$ARGUMENTS';
  replaced = replaced.replace(/{ARGS}/g, argsPlaceholder);

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

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
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

  console.log(`Building ${targets.length} targets to ${outputDir}...`);

  for (const target of targets) {
    const targetBuildDir = path.join(outputDir, `${target.id}-build`);
    const commandsDir = path.join(targetBuildDir, 'commands');
    const guidesDir = path.join(targetBuildDir, 'guides');

    console.log(`\nProcessing target: ${target.name} (${target.id})`);

    await fs.ensureDir(commandsDir);
    await fs.ensureDir(guidesDir);

    const templateFiles = await findMdFiles(buildConfig.sourceDir);
    console.log(`Found ${templateFiles.length} template files`);

    // Pre-compute command filename mapping for {COMMAND_PATH:*} replacements
    // Map original template base filename (without extension) -> final built command filename (with correct extension)
    const commandFileMap = {};
    for (const templatePath of templateFiles) {
      const content = await fs.readFile(templatePath, 'utf8');
      const { frontmatter } = parseFrontmatter(content);
      const isCommand = frontmatter.command_name !== undefined;
      if (!isCommand) continue;

      const originalBase = path.basename(templatePath, '.md');
      const priority = frontmatter.priority || 'default';
      const sanitizedCommandName = String(frontmatter.command_name || '')
        .replace(/[^a-zA-Z0-9-_]/g, '-');
      const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;

      // Determine final extension per target
      let finalExt;
      if (target.format === 'toml') {
        finalExt = '.toml';
      } else {
        // Markdown
        finalExt = target.id === 'copilot' ? '.prompt.md' : '.md';
      }
      const finalFilename = `${fullCommandName}${finalExt}`;

      // Store mapping by base and by original filename w/ extension for robustness
      commandFileMap[originalBase] = finalFilename;
      commandFileMap[`${originalBase}.md`] = finalFilename;
    }

    for (const templatePath of templateFiles) {
      const content = await fs.readFile(templatePath, 'utf8');
      const { frontmatter, content: body } = parseFrontmatter(content);

      const isCommand = frontmatter.command_name !== undefined;
      const category = isCommand ? 'command' : 'guide';

      const processedBody = replacePlaceholders(body, version, target.directories, target.format, { commandFileMap });
      const processedFull = replacePlaceholders(content, version, target.directories, target.format, { commandFileMap });

      const originalFilename = path.basename(templatePath, '.md');
      let outputFilename;
      let fileExtension;
      let finalContent;

      if (isCommand && frontmatter.command_name) {
        // Command files: apm-{priority}-{command_name}
        const priority = frontmatter.priority || 'default';
        const sanitizedCommandName = frontmatter.command_name.replace(/[^a-zA-Z0-9-_]/g, '-');
        const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;

        if (target.format === 'toml') {
          // TOML format for Gemini/Qwen CLI
          fileExtension = '.toml';
          outputFilename = `${fullCommandName}${fileExtension}`;

          const description = frontmatter.description || 'APM command';
          finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
        } else {
          // Markdown format for most assistants
          fileExtension = '.md';
          outputFilename = `${fullCommandName}${fileExtension}`;
          finalContent = processedFull;
        }
      } else {
        // Guide files: keep original name, always markdown
        fileExtension = '.md';
        outputFilename = `${originalFilename}${fileExtension}`;
        finalContent = processedFull;
      }

      const outputDirPath = isCommand ? commandsDir : guidesDir;
      const outputPath = path.join(outputDirPath, outputFilename);

      await fs.writeFile(outputPath, finalContent);
      console.log(`  ${category}: ${originalFilename}.md → ${path.relative(targetBuildDir, outputPath)}`);
    }

    // Handle target-specific post-processing
    if (target.id === 'copilot') {
      // Rename all command .md files to .prompt.md for Copilot
      const commandFiles = await fs.readdir(commandsDir);
      for (const file of commandFiles) {
        if (file.endsWith('.md') && !file.endsWith('.prompt.md')) {
          const oldPath = path.join(commandsDir, file);
          const newPath = path.join(commandsDir, file.replace(/\.md$/, '.prompt.md'));
          await fs.rename(oldPath, newPath);
          console.log(`  Renamed: ${file} → ${path.basename(newPath)}`);
        }
      }
    }

    console.log(`Completed target: ${target.name}`);

    // Create ZIP archive from build directory
    const zipPath = path.join(outputDir, target.bundleName);
    console.log(`Creating archive: ${target.bundleName}...`);
    
    try {
      await createZipArchive(targetBuildDir, zipPath);
      console.log(`Archive created successfully: ${target.bundleName}`);
      
      // Clean up temporary build directory
      await fs.remove(targetBuildDir);
      console.log(`Cleaned up temporary directory: ${path.basename(targetBuildDir)}`);
    } catch (error) {
      console.error(`Failed to create archive for ${target.name}:`, error.message);
      throw error;
    }
  }

  console.log('\nBuild completed successfully!');
}

/**
 * Main entry point - loads config and executes build
 */
async function main() {
  try {
    const config = await loadConfig();
    
    // Read version dynamically from package.json
    const packageJson = await fs.readFile('package.json', 'utf8');
    const { version } = JSON.parse(packageJson);

    await build(config, version);

  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Export functions for testing
export { loadConfig, findMdFiles, parseFrontmatter, replacePlaceholders, createZipArchive, build };

// Run build when executed directly
// Check if this module is the main module being run
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const currentFile = fileURLToPath(import.meta.url);
const mainFile = resolve(process.argv[1]);

if (currentFile === mainFile) {
  main();
}