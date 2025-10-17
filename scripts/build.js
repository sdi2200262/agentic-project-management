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
 * Main execution function for testing and development
 */
async function main() {
  try {
    const config = await loadConfig();
    console.log('Config loaded:', config.build);

    const sourceDir = config.build.sourceDir;
    const mdFiles = await findMdFiles(sourceDir);
    console.log('Found .md files:', mdFiles.length);

    // Find a file with COMMAND_PATH for testing
    const commandPathFile = mdFiles.find(file => file.includes('Research_Delegation_Guide.md'));
    if (commandPathFile) {
      console.log('\n--- Testing COMMAND_PATH replacement ---');
      const content = await fs.readFile(commandPathFile, 'utf8');
      const replaced = replacePlaceholders(content, '0.5.0', config.targets[0].directories);
      
      // Find the line with COMMAND_PATH
      const originalLine = content.split('\n').find(line => line.includes('COMMAND_PATH'));
      const replacedLine = replaced.split('\n').find(line => line.includes('.github/prompts'));
      
      console.log('Original line:', originalLine);
      console.log('Replaced line:', replacedLine);
      console.log('--- End COMMAND_PATH Test ---\n');
    }

    if (mdFiles.length > 0) {
      const sampleFile = mdFiles[0];
      const content = await fs.readFile(sampleFile, 'utf8');
      const parsed = parseFrontmatter(content);
      console.log('Sample frontmatter:', parsed.frontmatter);

      // Test placeholder replacement
      const replaced = replacePlaceholders(content, '0.5.0', config.targets[0].directories);
      console.log('Original sample content (first 200 chars):', content.substring(0, 200));
      console.log('Replaced sample content (first 200 chars):', replaced.substring(0, 200));
      console.log('Placeholders replaced in sample content');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { loadConfig, findMdFiles, parseFrontmatter, replacePlaceholders };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}