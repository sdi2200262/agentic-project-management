import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync, copyFileSync, renameSync } from 'fs';
import { join, dirname, basename } from 'path';
import AdmZip from 'adm-zip';
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
  'Windsurf': '.windsurf/workflows',
  'Kilo Code': '.kilocode/workflows',
  'Auggie CLI': '.augment/commands',
  'Roo Code': '.roo/commands'
};

/**
 * Reads APM metadata from the project directory
 * @param {string} projectPath - Path to the project directory
 * @returns {Object|null} Metadata object or null if not found
 */
export function readMetadata(projectPath, currentCliVersion) {
  const metadataPath = join(projectPath, '.apm', 'metadata.json');
  
  if (!existsSync(metadataPath)) {
    return null;
  }
  
  try {
    const content = readFileSync(metadataPath, 'utf8');
    const parsed = JSON.parse(content);

    // Detect old schema and migrate automatically
    const isOldSchema = parsed && typeof parsed === 'object' && 'version' in parsed && 'assistant' in parsed;
    if (!isOldSchema) {
      return parsed;
    }

    const oldAssistant = parsed.assistant ? [parsed.assistant] : [];
    const detected = detectInstalledAssistants(projectPath);
    const assistants = Array.from(new Set([...oldAssistant, ...detected]));

    const migrated = {
      cliVersion: currentCliVersion || (parsed.version ? parsed.version.replace(/^v(\d+\.\d+\.\d+).*/, '$1') : ''),
      templateVersion: parsed.version,
      assistants,
      installedAt: parsed.installedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Persist migrated schema
    writeMetadata(projectPath, migrated);
    console.log(chalk.gray('  Migrated .apm/metadata.json to multi-assistant schema'));
    return migrated;
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
export function parseTemplateTagParts(tag) {
  // Match pattern: v<version>+templates.<buildNumber>
  // Support pre-release suffix in base version, e.g., v0.5.0-test-1+templates.1
  const match = tag.match(/^v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)\+templates\.(\d+)$/);
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
 * Merges two assistant arrays into a unique, ordered union
 * @param {string[]} a
 * @param {string[]} b
 * @returns {string[]}
 */
export function mergeAssistants(a = [], b = []) {
  const set = new Set([...(a || []), ...(b || [])].filter(Boolean));
  return Array.from(set);
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
  
  // Detect basic hyperlink support (OSC 8). Many Windows consoles don't support this.
  const supportsHyperlinks = process.platform !== 'win32' && process.stdout && process.stdout.isTTY;
  const ghLabel = 'View on GitHub';
  const npmLabel = 'View on NPM';
  const ghUrl = 'https://github.com/sdi2200262/agentic-project-management';
  const npmUrl = 'https://www.npmjs.com/package/agentic-pm';
  const formatLink = (label, url) => supportsHyperlinks
    ? `\x1b]8;;${url}\x1b\\${label}\x1b]8;;\x1b\\`
    : label;

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
    border + '                               ' + chalk.cyan.underline(formatLink(ghLabel, ghUrl)) + '                                 ' + border,
    border + '                                ' + chalk.yellow.underline(formatLink(npmLabel, npmUrl)) + '                                   ' + border,
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
// SemVer compare with pre-release awareness (no build metadata support)
function compareSemverVersions(v1, v2) {
  const parse = (v) => {
    const [core, pre = ''] = String(v).split('-');
    const [maj, min, pat] = core.split('.').map(n => parseInt(n, 10));
    const preTokens = pre === '' ? [] : pre.split('.');
    return { maj, min, pat, preTokens };
  };
  const isNumeric = (s) => /^\d+$/.test(s);
  const a = parse(v1);
  const b = parse(v2);
  if (a.maj !== b.maj) return a.maj > b.maj ? 1 : -1;
  if (a.min !== b.min) return a.min > b.min ? 1 : -1;
  if (a.pat !== b.pat) return a.pat > b.pat ? 1 : -1;
  // Handle prerelease: no pre > with pre
  if (a.preTokens.length === 0 && b.preTokens.length === 0) return 0;
  if (a.preTokens.length === 0) return 1;
  if (b.preTokens.length === 0) return -1;
  const len = Math.max(a.preTokens.length, b.preTokens.length);
  for (let i = 0; i < len; i++) {
    const ta = a.preTokens[i];
    const tb = b.preTokens[i];
    if (ta === undefined) return -1; // shorter < longer (alpha < alpha.1)
    if (tb === undefined) return 1;
    const na = isNumeric(ta);
    const nb = isNumeric(tb);
    if (na && nb) {
      const iva = parseInt(ta, 10);
      const ivb = parseInt(tb, 10);
      if (iva !== ivb) return iva > ivb ? 1 : -1;
    } else if (na !== nb) {
      // Numeric identifiers have lower precedence than non-numeric
      return na ? -1 : 1;
    } else {
      if (ta !== tb) return ta > tb ? 1 : -1; // ASCII lexical
    }
  }
  return 0;
}

export function isVersionNewer(v1, v2) {
  return compareSemverVersions(v1, v2) > 0;
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
export function installFromTempDirectory(tempDir, assistant, projectRoot, options = {}) {
  const { installGuides = true } = options;
  // Install guides directory into .apm/
  const tempGuidesDir = join(tempDir, 'guides');
  const apmDir = join(projectRoot, '.apm');
  const apmGuidesDir = join(apmDir, 'guides');
  
  if (installGuides && existsSync(tempGuidesDir)) {
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
export function updateFromTempDirectory(tempDir, assistant, projectRoot, options = {}) {
  const { installGuides = true } = options;
  
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

  // Update guides directory (in .apm/guides) only when requested
  const apmGuidesDir = join(projectRoot, '.apm', 'guides');
  const newGuidesDir = join(tempDir, 'guides');
  
  if (installGuides) {
    if (existsSync(apmGuidesDir)) {
      rmSync(apmGuidesDir, { recursive: true, force: true });
    }
    if (existsSync(newGuidesDir)) {
      mkdirSync(apmGuidesDir, { recursive: true });
      const items = readdirSync(newGuidesDir, { withFileTypes: true });
      for (const item of items) {
        const src = join(newGuidesDir, item.name);
        const dest = join(apmGuidesDir, item.name);
        if (item.isDirectory()) {
          cpSync(src, dest, { recursive: true });
        } else {
          copyFileSync(src, dest);
        }
      }
      console.log(chalk.green(`  Updated guides`));
    }
  }
}

/**
 * Creates and zips a backup by MOVING assistant directories and .apm/guides
 * Leaves Implementation_Plan.md and Memory/ intact
 * @param {string} projectPath
 * @param {string[]} assistants
 * @param {string} templateTag
 * @returns {string} backup directory path
 */
export function createAndZipBackup(projectPath, assistants, templateTag) {
  const safeTag = String(templateTag || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '-');
  const apmDir = join(projectPath, '.apm');
  const backupDir = join(apmDir, `apm-backup-${safeTag}`);
  mkdirSync(backupDir, { recursive: true });

  // Helper to move preserving structure
  const movePath = (src, relativeDest) => {
    const dest = join(backupDir, relativeDest);
    mkdirSync(dirname(dest), { recursive: true });
    try {
      renameSync(src, dest);
    } catch (err) {
      // Fallback to copy+remove if cross-device
      cpSync(src, dest, { recursive: true });
      rmSync(src, { recursive: true, force: true });
    }
    console.log(chalk.gray(`  Moved to backup: ${relativeDest}`));
  };

  // Move assistant directories
  for (const assistant of assistants || []) {
    const relAssistantDir = getAssistantDirectory(assistant);
    if (!relAssistantDir) continue;
    const absAssistantDir = join(projectPath, relAssistantDir);
    if (existsSync(absAssistantDir)) {
      movePath(absAssistantDir, relAssistantDir);
    } else {
      console.log(chalk.yellow(`  Assistant directory missing, skipping: ${relAssistantDir}`));
    }
  }

  // Move guides directory from .apm/guides
  const guidesDir = join(apmDir, 'guides');
  if (existsSync(guidesDir)) {
    // Store under apm/guides relative inside backup
    movePath(guidesDir, join('apm', 'guides'));
  } else {
    console.log(chalk.yellow('  Guides directory missing, skipping: .apm/guides'));
  }

  // Create a cross-platform zip archive using AdmZip
  let zipPath = '';
  try {
    const backupBase = basename(backupDir);
    const zipName = `${backupBase}.zip`;
    zipPath = join(apmDir, zipName);
    const zip = new AdmZip();
    // Add the whole backup folder under its base name
    zip.addLocalFolder(backupDir, backupBase);
    zip.writeZip(zipPath);
    console.log(chalk.gray(`  Created zip archive: .apm/${zipName}`));
  } catch (err) {
    console.log(chalk.yellow(`  Could not create zip archive for backup: ${err.message}`));
  }

  return { backupDir, zipPath };
}

