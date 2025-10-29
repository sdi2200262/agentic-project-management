import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync, copyFileSync } from 'fs';
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
  'Roo Code': '.roo/commands',
  'Amazon Q Developer CLI': '.amazonq/prompts'
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
 * Parses a template tag to extract base version and build number
 * @param {string} tag - Template tag (e.g., "v0.5.1+templates.2")
 * @returns {Object|null} Object with baseVersion and buildNumber, or null if invalid
 */
function parseTemplateTagParts(tag) {
  // Match pattern: v<version>+templates.<buildNumber>
  const match = tag.match(/^v(\d+\.\d+\.\d+)\+templates\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    baseVersion: match[1],
    buildNumber: parseInt(match[2], 10)
  };
}

/**
 * Compares two template version tags
 * First compares base versions - if they differ, returns NaN (indicating incompatibility)
 * If base versions match, compares build numbers
 * @param {string} tagA - First template tag (e.g., "v0.5.1+templates.1")
 * @param {string} tagB - Second template tag (e.g., "v0.5.1+templates.2")
 * @returns {number} -1 if tagA < tagB, 0 if equal, 1 if tagA > tagB, NaN if base versions differ
 */
export function compareTemplateVersions(tagA, tagB) {
  const parsedA = parseTemplateTagParts(tagA);
  const parsedB = parseTemplateTagParts(tagB);
  
  // Handle invalid tags
  if (!parsedA || !parsedB) {
    throw new Error(`Invalid template tag format: "${tagA}" or "${tagB}". Expected format: v<version>+templates.<buildNumber>`);
  }
  
  // First, compare base versions
  // If base versions differ, these tags are not directly comparable
  if (parsedA.baseVersion !== parsedB.baseVersion) {
    return NaN;
  }
  
  // Base versions are the same, compare build numbers
  if (parsedA.buildNumber < parsedB.buildNumber) {
    return -1;
  } else if (parsedA.buildNumber > parsedB.buildNumber) {
    return 1;
  } else {
    return 0;
  }
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
  
  // Banner width is 78 characters (based on horizontal border line)
  const BANNER_WIDTH = 80;
  const border = chalk.blue('║');
  const innerWidth = BANNER_WIDTH - 2; // Subtract 2 for border characters
  
  // Calculate spacing for version line to center it
  const versionText = `Agentic Project Management v${version}`;
  const versionTextLength = versionText.length;
  const spacesOnEachSide = Math.floor((innerWidth - versionTextLength) / 2);
  const leftSpaces = ' '.repeat(spacesOnEachSide);
  const rightSpaces = ' '.repeat(innerWidth - versionTextLength - spacesOnEachSide);
  
  const lines = [
    chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'),
    border + chalk.blue(' '.repeat(innerWidth)) + border,
    border + chalk.blue(' '.repeat(innerWidth)) + border,
    // A letter              P letter              M letter
    border + '                           ' + colorA('█████╗') + ' ' + colorP('██████╗') + ' ' + colorM('███╗   ███╗') + '                         ' + border,
    border + '                          ' + colorA('██╔══██╗') + colorP('██╔══██╗') + colorM('████╗ ████║') + '                         ' + border,
    border + '                       ' + colorP('█████████████████╔╝') + colorM('██╔████╔██║') + '                         ' + border,
    border + '                       ' + colorP('╚══')+ colorA('██')+ colorP('═══') + colorA('██') + colorP('═██╔═══╝ ') + colorM('██║╚██╔╝██║') + '                         ' + border,
    border + '                          ' + colorA('██║  ██║') + colorP('██║     ') + colorM('██║ ╚═╝ ██║') + '                         ' + border,
    border + '                          ' + colorA('╚═╝  ╚═╝') + colorP('╚═╝     ') + colorM('╚═╝     ╚═╝') + '                         ' + border,
    border + chalk.blue(' '.repeat(innerWidth)) + border,
    border + chalk.blue(leftSpaces) + chalk.cyan.bold(versionText) + chalk.blue(rightSpaces) + border,
    border + chalk.blue(' '.repeat(innerWidth)) + border,
    border + chalk.gray('              Manage complex projects with a team of AI assistants            ') + border,
    border + chalk.gray('                          smoothly and efficiently                            ') + border,
    border + chalk.blue(' '.repeat(innerWidth)) + border,
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

/**
 * Compares two base version strings to determine if v1 is newer than v2
 * @param {string} v1 - First version (e.g., "0.5.1")
 * @param {string} v2 - Second version (e.g., "0.5.0")
 * @returns {boolean} True if v1 is newer than v2
 */
export function isVersionNewer(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return true;
    if (parts1[i] < parts2[i]) return false;
  }
  
  return false; // Equal versions
}

/**
 * Checks if there are newer templates available for a different CLI version
 * @param {string} currentCliVersion - Current CLI version
 * @param {Object|null} latestOverall - Latest template tag across all versions (from findLatestTemplateTag)
 * @returns {Object|null} Object with tag and baseVersion if newer templates exist, null otherwise
 */
export function checkForNewerTemplates(currentCliVersion, latestOverall) {
  if (!latestOverall) {
    return null;
  }
  
  const latestBaseVersion = latestOverall.baseVersion;
  if (latestBaseVersion !== currentCliVersion && isVersionNewer(latestBaseVersion, currentCliVersion)) {
    return {
      tag: latestOverall.tag_name,
      baseVersion: latestBaseVersion
    };
  }
  
  return null;
}

/**
 * Installs guides and commands from a temporary directory to the project
 * @param {string} tempDir - Temporary directory containing extracted files
 * @param {string} assistant - Assistant name
 * @param {string} projectRoot - Project root directory
 */
export function installFromTempDirectory(tempDir, assistant, projectRoot) {
  // Install guides directory into .apm/
  const tempGuidesDir = join(tempDir, 'guides');
  const apmDir = join(projectRoot, '.apm');
  const apmGuidesDir = join(apmDir, 'guides');
  
  if (existsSync(tempGuidesDir)) {
    if (!existsSync(apmDir)) {
      mkdirSync(apmDir, { recursive: true });
    }
    if (existsSync(apmGuidesDir)) {
      rmSync(apmGuidesDir, { recursive: true, force: true });
    }
    cpSync(tempGuidesDir, apmGuidesDir, { recursive: true });
    console.log(chalk.gray('  Installed guides/'));
  }

  // Install commands directory into assistant-specific directory at PROJECT ROOT
  const assistantDir = getAssistantDirectory(assistant);
  const tempCommandsDir = join(tempDir, 'commands');
  const rootAssistantDir = join(projectRoot, assistantDir);
  
  if (existsSync(tempCommandsDir)) {
    if (existsSync(rootAssistantDir)) {
      rmSync(rootAssistantDir, { recursive: true, force: true });
    }
    mkdirSync(rootAssistantDir, { recursive: true });
    cpSync(tempCommandsDir, rootAssistantDir, { recursive: true });
    console.log(chalk.gray(`  Installed ${assistantDir}/`));
  }
}

/**
 * Updates files from a temporary directory (for update command)
 * @param {string} tempDir - Temporary directory containing extracted files
 * @param {string} assistant - Assistant name
 * @param {string} projectRoot - Project root directory
 */
export function updateFromTempDirectory(tempDir, assistant, projectRoot) {
  
  // Update assistant-specific directory
  const assistantDir = getAssistantDirectory(assistant);
  const oldAssistantDir = join(projectRoot, assistantDir);
  const newCommandsDir = join(tempDir, 'commands');
  
  if (existsSync(oldAssistantDir)) {
    rmSync(oldAssistantDir, { recursive: true, force: true });
  }
  if (existsSync(newCommandsDir)) {
    mkdirSync(oldAssistantDir, { recursive: true });
    const items = readdirSync(newCommandsDir, { withFileTypes: true });
    for (const item of items) {
      const src = join(newCommandsDir, item.name);
      const dest = join(oldAssistantDir, item.name);
      if (item.isDirectory()) {
        cpSync(src, dest, { recursive: true });
      } else {
        copyFileSync(src, dest);
      }
    }
    console.log(chalk.green(`  Updated ${assistantDir}`));
  }

  // Update guides directory
  const oldGuidesDir = join(projectRoot, 'guides');
  const newGuidesDir = join(tempDir, 'guides');
  
  if (existsSync(oldGuidesDir)) {
    rmSync(oldGuidesDir, { recursive: true, force: true });
  }
  if (existsSync(newGuidesDir)) {
    mkdirSync(oldGuidesDir, { recursive: true });
    const items = readdirSync(newGuidesDir, { withFileTypes: true });
    for (const item of items) {
      const src = join(newGuidesDir, item.name);
      const dest = join(oldGuidesDir, item.name);
      if (item.isDirectory()) {
        cpSync(src, dest, { recursive: true });
      } else {
        copyFileSync(src, dest);
      }
    }
    console.log(chalk.green(`  Updated guides`));
  }
}

