/**
 * APM Utilities Module
 * 
 * Provides utility functions for metadata management, assistant detection,
 * version comparison, backup operations, and banner display.
 * 
 * @module utils
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync, copyFileSync, renameSync } from 'fs';
import { join, dirname, basename } from 'path';
import AdmZip from 'adm-zip';
import logger from './logger.js';

/**
 * Assistant directory mapping for detection and installation
 * @constant {Object.<string, string>}
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
 * @param {string} currentCliVersion - Current CLI version for migration
 * @returns {Object|null} Metadata object or null if not found
 */
export function readMetadata(projectPath, currentCliVersion) {
  const metadataPath = join(projectPath, '.apm', 'metadata.json');
  
  if (!existsSync(metadataPath)) {
    return null;
  }
  
  let parsed;
  try {
    const content = readFileSync(metadataPath, 'utf8');
    parsed = JSON.parse(content);
  } catch (err) {
    logger.error(`Error reading metadata: ${err.message}`);
    return null;
  }

  // Detect old schema and migrate automatically
  const isOldSchema = parsed && typeof parsed === 'object' && 'version' in parsed && 'assistant' in parsed;
  
  if (!isOldSchema) {
    return parsed;
  }

  // Migrate old schema to new multi-assistant format
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

  writeMetadata(projectPath, migrated);

  return migrated;
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
 * Detects which AI assistants are installed in the current project
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
  // Pattern: v<version>+templates.<buildNumber>
  // Supports pre-release suffix in base version
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
 * @param {string} tagA - First template tag (e.g., "v0.5.1+templates.1")
 * @param {string} tagB - Second template tag (e.g., "v0.5.1+templates.2")
 * @returns {number} -1 if tagA < tagB, 0 if equal, 1 if tagA > tagB, NaN if base versions differ
 * @throws {Error} If tag format is invalid
 */
export function compareTemplateVersions(tagA, tagB) {
  const parsedA = parseTemplateTagParts(tagA);
  const parsedB = parseTemplateTagParts(tagB);
  
  if (!parsedA || !parsedB) {
    throw new Error(`Invalid template tag format: "${tagA}" or "${tagB}". Expected: v<version>+templates.<buildNumber>`);
  }
  
  // Different base versions are not directly comparable
  if (parsedA.baseVersion !== parsedB.baseVersion) {
    return NaN;
  }
  
  if (parsedA.buildNumber < parsedB.buildNumber) return -1;
  if (parsedA.buildNumber > parsedB.buildNumber) return 1;
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
      logger.dim(`Backed up: ${dir}`, { indent: true });
    }
  }
  
  return backupDir;
}

/**
 * Restores a backup to the project directory
 * @param {string} backupDir - Path to the backup directory
 * @param {string} projectPath - Path to the project directory
 * @throws {Error} If backup directory not found
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
      logger.dim(`Restored: ${item}`, { indent: true });
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
 * @param {string[]} a - First array of assistants
 * @param {string[]} b - Second array of assistants
 * @returns {string[]} Merged array with unique values
 */
export function mergeAssistants(a = [], b = []) {
  const set = new Set([...(a || []), ...(b || [])].filter(Boolean));
  return Array.from(set);
}

/**
 * Compares two SemVer version strings with pre-release awareness
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 * @private
 */
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
    
    if (ta === undefined) return -1;
    if (tb === undefined) return 1;
    
    const na = isNumeric(ta);
    const nb = isNumeric(tb);
    
    if (na && nb) {
      const iva = parseInt(ta, 10);
      const ivb = parseInt(tb, 10);
      if (iva !== ivb) return iva > ivb ? 1 : -1;
    } else if (na !== nb) {
      return na ? -1 : 1;
    } else {
      if (ta !== tb) return ta > tb ? 1 : -1;
    }
  }
  
  return 0;
}

/**
 * Checks if version v1 is newer than v2
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {boolean} True if v1 is newer than v2
 */
export function isVersionNewer(v1, v2) {
  return compareSemverVersions(v1, v2) > 0;
}

/**
 * Checks if there are newer templates available for a different CLI version
 * @param {string} currentCliVersion - Current CLI version
 * @param {Object|null} latestOverall - Latest template tag across all versions
 * @returns {Object|null} Object with tag and baseVersion if newer exists, null otherwise
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
 * @param {Object} options - Installation options
 * @param {boolean} options.installGuides - Whether to install guides
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
    logger.dim(`  Installed guides/`);
  }

  // Install commands directory into assistant-specific directory at project root
  const assistantDir = getAssistantDirectory(assistant);
  const tempCommandsDir = join(tempDir, 'commands');
  const rootAssistantDir = join(projectRoot, assistantDir);

  if (existsSync(tempCommandsDir)) {
    if (existsSync(rootAssistantDir)) {
      rmSync(rootAssistantDir, { recursive: true, force: true });
    }
    mkdirSync(rootAssistantDir, { recursive: true });
    cpSync(tempCommandsDir, rootAssistantDir, { recursive: true });
    logger.dim(`  Installed ${assistantDir}/`);
  }
}

/**
 * Updates files from a temporary directory (for update command)
 * @param {string} tempDir - Temporary directory containing extracted files
 * @param {string} assistant - Assistant name
 * @param {string} projectRoot - Project root directory
 * @param {Object} options - Update options
 * @param {boolean} options.installGuides - Whether to update guides
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
    logger.dim(`  Updated ${assistantDir}/`);
  }

  // Update guides directory
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
      logger.dim(`  Updated guides/`);
    }
  }
}

/**
 * Creates and zips a backup by moving assistant directories and guides
 * @param {string} projectPath - Project path
 * @param {string[]} assistants - Array of assistant names
 * @param {string} templateTag - Current template tag for naming
 * @returns {Object} Object with backupDir and zipPath
 */
export function createAndZipBackup(projectPath, assistants, templateTag) {
  const safeTag = String(templateTag || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '-');
  const apmDir = join(projectPath, '.apm');
  const backupDir = join(apmDir, `apm-backup-${safeTag}`);
  
  mkdirSync(backupDir, { recursive: true });

  const movePath = (src, relativeDest) => {
    const dest = join(backupDir, relativeDest);
    mkdirSync(dirname(dest), { recursive: true });
    
    try {
      renameSync(src, dest);
    } catch {
      // Fallback to copy+remove if cross-device
      cpSync(src, dest, { recursive: true });
      rmSync(src, { recursive: true, force: true });
    }
  };

  // Move assistant directories
  for (const assistant of assistants || []) {
    const relAssistantDir = getAssistantDirectory(assistant);
    if (!relAssistantDir) continue;

    const absAssistantDir = join(projectPath, relAssistantDir);

    if (existsSync(absAssistantDir)) {
      movePath(absAssistantDir, relAssistantDir);
    }
  }

  // Move guides directory
  const guidesDir = join(apmDir, 'guides');

  if (existsSync(guidesDir)) {
    movePath(guidesDir, join('apm', 'guides'));
  }

  // Create cross-platform zip archive
  let zipPath = '';

  try {
    const backupBase = basename(backupDir);
    const zipName = `${backupBase}.zip`;
    zipPath = join(apmDir, zipName);

    const zip = new AdmZip();
    zip.addLocalFolder(backupDir, backupBase);
    zip.writeZip(zipPath);
  } catch {
    // Zip creation is optional
  }

  return { backupDir, zipPath };
}

/**
 * Generates a minimal ASCII banner for APM CLI
 * @param {string} version - APM version
 * @returns {string[]} Array of colored banner lines
 */
export function generateBanner(version = '0.5.0') {
  const chalk = logger.chalk;
  
  const colorA = chalk.white;
  const colorP = chalk.cyan;
  const colorM = chalk.cyan;

  const lines = [
    '',
    '                         ' + colorA('█████╗') + ' ' + colorP('██████╗') + ' ' + colorM('███╗   ███╗'),
    '                        ' + colorA('██╔══██╗') + colorP('██╔══██╗') + colorM('████╗ ████║'),
    '                     ' + colorP('█████████████████╔╝') + colorM('██╔████╔██║'),
    '                     ' + colorP('╚══') + colorA('██') + colorP('═══') + colorA('██') + colorP('═██╔═══╝ ') + colorM('██║╚██╔╝██║'),
    '                        ' + colorA('██║  ██║') + colorP('██║     ') + colorM('██║ ╚═╝ ██║'),
    '                        ' + colorA('╚═╝  ╚═╝') + colorP('╚═╝     ') + colorM('╚═╝     ╚═╝'),
    '',
    chalk.gray('Manage complex projects with a team of AI assistants, smoothly and efficiently.'),
    ''
  ];

  return lines;
}

/**
 * Displays the APM banner
 * @param {string} version - APM version (unused in minimal banner)
 * @param {boolean} useColors - Whether to use colors (default: true)
 */
export function displayBanner(version = '0.5.0', useColors = true) {
  const lines = generateBanner(version);
  lines.forEach(line => console.log(line));
}
