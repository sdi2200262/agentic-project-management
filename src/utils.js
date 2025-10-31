import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import chalk from 'chalk';

/**
 * Assistant directory mapping for detection
 */
const ASSISTANT_DIRECTORIES = {
  'Cursor': '.cursor/commands',
  'GitHub Copilot': '.github/prompts',
  'Claude Code': '.claude/commands',
  'Gemini CLI': '.gemini/commands',
  'Qwen Code': '.qwen/commands',
  'opencode': '.opencode/command',
  'Codex CLI': '.codex/prompts',
  'Windsurf': '.windsurf/workflows',
  'Kilo Code': '.kilocode/workflows',
  'Auggie CLI': '.augment/commands',
  'CodeBuddy': '.codebuddy/commands',
  'Roo Code': '.roo/commands'
};

/**
 * Reads APM metadata from the project directory
 * @param {string} projectPath - Path to the project directory
 * @returns {Object|null} Metadata object or null if not found
 */
export function readMetadata(projectPath) {
  const metadataPath = join(projectPath, '.apm', 'metadata.json');
  
  if (!existsSync(metadataPath)) {
    return null;
  }
  
  try {
    const content = readFileSync(metadataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(chalk.red(`Error reading metadata: ${error.message}`));
    return null;
  }
}

/**
 * Writes APM metadata to the project directory
 * @param {string} projectPath - Path to the project directory
 * @param {Object} metadata - Metadata object to write
 */
export function writeMetadata(projectPath, metadata) {
  const metadataDir = join(projectPath, '.apm');
  const metadataPath = join(metadataDir, 'metadata.json');
  
  if (!existsSync(metadataDir)) {
    mkdirSync(metadataDir, { recursive: true });
  }
  
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Detects which AI assistant is installed in the current project
 * @param {string} projectPath - Path to the project directory
 * @returns {string[]} Array of detected assistant names
 */
export function detectInstalledAssistants(projectPath) {
  const detected = [];
  
  for (const [assistant, directory] of Object.entries(ASSISTANT_DIRECTORIES)) {
    const dirPath = join(projectPath, directory);
    if (existsSync(dirPath)) {
      detected.push(assistant);
    }
  }
  
  return detected;
}

/**
 * Compares two semantic version strings
 * @param {string} v1 - First version (e.g., "0.5.0")
 * @param {string} v2 - Second version (e.g., "0.5.1")
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  
  return 0;
}

/**
 * Creates a backup of specified directories
 * @param {string} projectPath - Path to the project directory
 * @param {string[]} directories - Array of directory paths to backup
 * @returns {string} Path to the backup directory
 */
export function createBackup(projectPath, directories) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(projectPath, '.apm', `backup-${timestamp}`);
  
  mkdirSync(backupDir, { recursive: true });
  
  for (const dir of directories) {
    const sourcePath = join(projectPath, dir);
    if (existsSync(sourcePath)) {
      const destPath = join(backupDir, dir);
      mkdirSync(dirname(destPath), { recursive: true });
      cpSync(sourcePath, destPath, { recursive: true });
      console.log(chalk.gray(`  Backed up: ${dir}`));
    }
  }
  
  return backupDir;
}

/**
 * Restores a backup
 * @param {string} backupDir - Path to the backup directory
 * @param {string} projectPath - Path to the project directory
 */
export function restoreBackup(backupDir, projectPath) {
  if (!existsSync(backupDir)) {
    throw new Error('Backup directory not found');
  }
  
  const items = readdirSync(backupDir);
  
  for (const item of items) {
    const sourcePath = join(backupDir, item);
    const destPath = join(projectPath, item);
    
    if (statSync(sourcePath).isDirectory()) {
      if (existsSync(destPath)) {
        rmSync(destPath, { recursive: true, force: true });
      }
      cpSync(sourcePath, destPath, { recursive: true });
      console.log(chalk.gray(`  Restored: ${item}`));
    }
  }
}

/**
 * Gets the directory path for a specific assistant
 * @param {string} assistant - Assistant name
 * @returns {string|null} Directory path or null if not found
 */
export function getAssistantDirectory(assistant) {
  return ASSISTANT_DIRECTORIES[assistant] || null;
}

/**
 * Generates an ASCII banner for APM CLI with custom colors for ASCII art
 * @param {string} version - APM version
 * @returns {string[]} Array of colored banner lines
 */
export function generateBanner(version = '0.5.0') {
  // Define colors for each letter in the ASCII art
  // You can change these to any chalk color: red, green, yellow, blue, magenta, cyan, white, gray, etc.
  const colorA = chalk.white;      // Color for letter "A"
  const colorP = chalk.cyan;   // Color for letter "P" 
  const colorM = chalk.cyan;    // Color for letter "M"
  
  const border = chalk.blue('║');
  const lines = [
    chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'),
    border + chalk.blue('                                                                              ') + border,
    border + chalk.blue('                                                                              ') + border,
    // A letter              P letter              M letter
    border + '                           ' + colorA('█████╗') + ' ' + colorP('██████╗') + ' ' + colorM('███╗   ███╗') + '                         ' + border,
    border + '                          ' + colorA('██╔══██╗') + colorP('██╔══██╗') + colorM('████╗ ████║') + '                         ' + border,
    border + '                       ' + colorP('█████████████████╔╝') + colorM('██╔████╔██║') + '                         ' + border,
    border + '                       ' + colorP('╚══')+ colorA('██')+ colorP('═══') + colorA('██') + colorP('═██╔═══╝ ') + colorM('██║╚██╔╝██║') + '                         ' + border,
    border + '                          ' + colorA('██║  ██║') + colorP('██║     ') + colorM('██║ ╚═╝ ██║') + '                         ' + border,
    border + '                          ' + colorA('╚═╝  ╚═╝') + colorP('╚═╝     ') + colorM('╚═╝     ╚═╝') + '                         ' + border,
    border + chalk.blue('                                                                              ') + border,
    border + chalk.cyan.bold('                      Agentic Project Management v' + version + '                       ') + border,
    border + chalk.blue('                                                                              ') + border,
    border + chalk.gray('              Manage complex projects with a team of AI assistants            ') + border,
    border + chalk.gray('                          smoothly and efficiently                            ') + border,
    border + chalk.blue('                                                                              ') + border,
    border + '                               ' + chalk.cyan.underline('\x1b]8;;https://github.com/sdi2200262/agentic-project-management\x1b\\View on GitHub\x1b]8;;\x1b\\') + '                                 ' + border,
    border + '                                ' + chalk.yellow.underline('\x1b]8;;https://www.npmjs.com/package/agentic-pm\x1b\\View on NPM\x1b]8;;\x1b\\') + '                                   ' + border,
    border + chalk.blue('                                                                              ') + border,
    chalk.blue('╚══════════════════════════════════════════════════════════════════════════════╝')
  ];
  
  return lines;
}

/**
 * Displays the APM banner with optional version
 * @param {string} version - APM version
 * @param {boolean} useColors - Whether to use colors
 */
export function displayBanner(version = '0.5.0', useColors = true) {
  const lines = generateBanner(version);
  
  if (useColors) {
    // Lines are already colored, just print them
    lines.forEach(line => console.log(line));
    console.log(); // Add blank line for spacing
  } else {
    // Strip colors for plain text version
    const plainLines = lines.map(line => {
      // This is a simplified version - in real use you'd strip ANSI codes
      return line;
    });
    plainLines.forEach(line => console.log(line));
  }
}

