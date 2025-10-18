import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Loads and parses the build configuration from build-config.json
 * @returns {Promise<Object>} The parsed configuration object
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
 * Recursively finds all .md files in the source directory, excluding README.md
 * @param {string} sourceDir - The directory to search in
 * @returns {Promise<string[]>} Array of file paths
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
 * @param {string} content - The markdown content
 * @returns {Object} Object with frontmatter and body content
 */
function parseFrontmatter(content) {
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
 * Replaces placeholders in template content with actual values
 * @param {string} content - The content to process
 * @param {string} version - Version string to replace {VERSION}
 * @param {Object} targetDirectories - Directory configuration for the target
 * @returns {string} Content with placeholders replaced
 */
function replacePlaceholders(content, version, targetDirectories) {
  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, new Date().toISOString());

  // Replace GUIDE_PATH placeholders with relative paths
  replaced = replaced.replace(/{GUIDE_PATH:([^}]+)}/g, (_match, filename) => {
    return path.join(targetDirectories.guides, filename);
  });

  // Replace COMMAND_PATH placeholders with relative paths
  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (_match, filename) => {
    return path.join(targetDirectories.commands, filename);
  });

  return replaced;
}

/**
 * Main build function that orchestrates the entire build process
 * @param {Object} config - The build configuration
 * @param {string} version - Version string for placeholder replacement
 * @returns {Promise<void>}
 */
async function build(config, version) {
  const { build: buildConfig, targets } = config;
  const { outputDir, cleanOutput } = buildConfig;

  // Create clean output directory
  if (cleanOutput) {
    await fs.emptyDir(outputDir);
  } else {
    await fs.ensureDir(outputDir);
  }

  console.log(`Building ${targets.length} targets to ${outputDir}...`);

  // Process each target
  for (const target of targets) {
    const targetBuildDir = path.join(outputDir, `${target.id}-build`);
    const commandsDir = path.join(targetBuildDir, 'commands');
    const guidesDir = path.join(targetBuildDir, 'guides');

    console.log(`\nProcessing target: ${target.name} (${target.id})`);

    // Create target build directories
    await fs.ensureDir(commandsDir);
    await fs.ensureDir(guidesDir);

    // Find all template files
    const templateFiles = await findMdFiles(buildConfig.sourceDir);
    console.log(`Found ${templateFiles.length} template files`);

    // Process each template file
    for (const templatePath of templateFiles) {
      const content = await fs.readFile(templatePath, 'utf8');
      const { frontmatter } = parseFrontmatter(content);

      // Categorize as command or guide based on frontmatter
      const isCommand = frontmatter.command_name !== undefined;
      const category = isCommand ? 'command' : 'guide';

      // Replace placeholders
      const processedContent = replacePlaceholders(content, version, target.directories);

      // Determine output filename
      const originalFilename = path.basename(templatePath, '.md');
      let outputFilename;
      if (isCommand && frontmatter.command_name) {
        // Use command_name for commands
        outputFilename = `${frontmatter.command_name}.md`;
      } else {
        // Keep original filename for guides
        outputFilename = `${originalFilename}.md`;
      }

      // Determine output directory
      const outputDirPath = isCommand ? commandsDir : guidesDir;
      const outputPath = path.join(outputDirPath, outputFilename);

      // Write file
      await fs.writeFile(outputPath, processedContent);

      console.log(`  ${category}: ${originalFilename}.md → ${path.relative(outputDir, outputPath)}`);
    }

    console.log(`Completed target: ${target.name}`);
  }

  console.log('\nBuild completed successfully!');
}

/**
 * Main execution function
 */
async function main() {
  try {
    const config = await loadConfig();
    const version = '0.5.0'; // In a real implementation, this would come from package.json or CLI args

    await build(config, version);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

export { loadConfig, findMdFiles, parseFrontmatter, replacePlaceholders, build };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}