import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

// Read and parse build-config.json
async function loadConfig() {
  const configPath = 'build-config.json';
  if (!await fs.pathExists(configPath)) {
    throw new Error('build-config.json not found');
  }
  const configContent = await fs.readFile(configPath, 'utf8');
  return JSON.parse(configContent);
}

// Recursively find all .md files in sourceDir, ignoring README.md
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

// Read file content and parse YAML frontmatter
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

// Replace placeholders in content
function replacePlaceholders(content, version, targetDirectories) {
  let replaced = content
    .replace(/{VERSION}/g, version)
    .replace(/{TIMESTAMP}/g, new Date().toISOString());

  // Replace GUIDE_PATH placeholders
  replaced = replaced.replace(/{GUIDE_PATH:([^}]+)}/g, (match, filename) => {
    return path.join('guides', filename);
  });

  // Replace COMMAND_PATH placeholders
  replaced = replaced.replace(/{COMMAND_PATH:([^}]+)}/g, (match, filename) => {
    return path.join(targetDirectories.commands, filename);
  });

  return replaced;
}

// Example usage for testing
async function main() {
  try {
    const config = await loadConfig();
    console.log('Config loaded:', config.build);

    const sourceDir = config.build.sourceDir;
    const mdFiles = await findMdFiles(sourceDir);
    console.log('Found .md files:', mdFiles.length);

    if (mdFiles.length > 0) {
      const sampleFile = mdFiles[0];
      const content = await fs.readFile(sampleFile, 'utf8');
      const parsed = parseFrontmatter(content);
      console.log('Sample frontmatter:', parsed.frontmatter);

      // Test placeholder replacement
      const replaced = replacePlaceholders(content, '0.5.0', config.targets[0].directories);
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