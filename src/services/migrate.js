/**
 * Migration Service Module
 *
 * Core migration logic for transforming v0.5.4 projects to v1 layout.
 * Pure file operations — no UI, no network calls.
 *
 * @module src/services/migrate
 */

import fs from 'fs-extra';
import path from 'path';
import { ARCHIVES_DIR } from '../core/constants.js';
import { generateArchiveName } from './archive.js';

/**
 * Creates a snapshot of .apm/ into archives/ without deleting originals.
 * Unlike createArchive(), this preserves originals so migration can transform them.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<string>} Archive directory path.
 */
export async function snapshotForMigration(cwd) {
  const apmDir = path.join(cwd, '.apm');
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const archiveName = await generateArchiveName(archivesDir);
  const archivePath = path.join(archivesDir, archiveName);

  await fs.ensureDir(archivePath);

  const entries = await fs.readdir(apmDir);
  for (const entry of entries) {
    if (entry === 'archives') continue;
    await fs.copy(path.join(apmDir, entry), path.join(archivePath, entry));
  }

  // Stamp archival metadata
  const metadataPath = path.join(archivePath, 'metadata.json');
  if (await fs.pathExists(metadataPath)) {
    const meta = await fs.readJson(metadataPath);
    meta.archivedAt = new Date().toISOString();
    meta.reason = 'migrate';
    await fs.writeJson(metadataPath, meta, { spaces: 2 });
  }

  return archivePath;
}

/**
 * Detects whether the project uses a legacy (v0.5.x) metadata schema.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<string|null>} Detected legacy version or null.
 */
export async function detectLegacyVersion(cwd) {
  const metadataPath = path.join(cwd, '.apm', 'metadata.json');
  if (!await fs.pathExists(metadataPath)) return null;

  const metadata = await fs.readJson(metadataPath);

  // v0.5.x uses templateVersion; v1 uses releaseVersion
  if (metadata.templateVersion && metadata.templateVersion.startsWith('v0.5')) {
    return metadata.templateVersion;
  }

  return null;
}

/**
 * Scans .apm/ and builds a human-readable migration report.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<Object>} Report with actions array and counts.
 */
export async function buildMigrationReport(cwd) {
  const apmDir = path.join(cwd, '.apm');
  const actions = [];
  const counts = { plan: false, memoryRoot: false, phases: 0, taskLogs: 0, handovers: 0, adhoc: false, guides: false, commands: 0 };

  // Plan
  if (await fs.pathExists(path.join(apmDir, 'Implementation_Plan.md'))) {
    actions.push('Rename Implementation_Plan.md → plan.md');
    counts.plan = true;
  }

  // Memory Root
  const memoryDir = path.join(apmDir, 'Memory');
  if (await fs.pathExists(path.join(memoryDir, 'Memory_Root.md'))) {
    actions.push('Split Memory_Root.md → memory/index.md + tracker.md');
    counts.memoryRoot = true;
  }

  // Phase folders → stage folders
  if (await fs.pathExists(memoryDir)) {
    const entries = await fs.readdir(memoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && /^Phase_\d+/.test(entry.name)) {
        const phaseFiles = await fs.readdir(path.join(memoryDir, entry.name));
        const logFiles = phaseFiles.filter(f => f.startsWith('Task_') && f.endsWith('.md'));
        counts.phases++;
        counts.taskLogs += logFiles.length;
      }
    }
    if (counts.phases > 0) {
      actions.push(`Migrate ${counts.phases} phase(s) → stage folders (${counts.taskLogs} task logs)`);
    }
  }

  // AdHoc
  if (await fs.pathExists(path.join(memoryDir, 'AdHoc'))) {
    actions.push('Move Memory/AdHoc/ → memory/adhoc/');
    counts.adhoc = true;
  }

  // Handovers
  const handoversDir = path.join(memoryDir, 'Handovers');
  if (await fs.pathExists(handoversDir)) {
    const agentFolders = (await fs.readdir(handoversDir, { withFileTypes: true }))
      .filter(e => e.isDirectory() && e.name.endsWith('_Handovers'));
    for (const folder of agentFolders) {
      const files = await fs.readdir(path.join(handoversDir, folder.name));
      const handoverFiles = files.filter(f => f.endsWith('.md'));
      if (handoverFiles.length > 0) {
        counts.handovers++;
        const slug = deriveAgentSlug(folder.name);
        actions.push(`Last handover from ${folder.name} → bus/${slug}/handoff.md`);
      }
    }
  }

  // Guides
  if (await fs.pathExists(path.join(apmDir, 'guides'))) {
    actions.push('Remove legacy guides/ (replaced by v1 templates)');
    counts.guides = true;
  }

  // Old commands
  const commandsDir = path.join(cwd, '.claude', 'commands');
  if (await fs.pathExists(commandsDir)) {
    const cmdFiles = (await fs.readdir(commandsDir)).filter(f => f.startsWith('apm-') && f.endsWith('.md'));
    if (cmdFiles.length > 0) {
      counts.commands = cmdFiles.length;
      actions.push(`Remove ${cmdFiles.length} legacy command(s) (replaced by v1 templates)`);
    }
  }

  return { actions, counts };
}

/**
 * Executes the full migration of .apm/ from v0.5.4 to v1 layout.
 *
 * Uses a staging directory to avoid macOS case-insensitive filesystem conflicts
 * (Memory/ and memory/ resolve to the same path on HFS+/APFS).
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<void>}
 */
export async function executeMigration(cwd) {
  const apmDir = path.join(cwd, '.apm');
  const stagingDir = path.join(apmDir, '_migrate_staging');
  await fs.ensureDir(stagingDir);

  try {
    await migratePlan(apmDir);
    await migrateMemoryRoot(apmDir, stagingDir);
    await migrateTaskLogs(apmDir, stagingDir);
    await migrateAdHoc(apmDir, stagingDir);
    await migrateHandovers(apmDir);
    await cleanLegacy(cwd);

    // Move staged memory/ to final location (safe now that Memory/ is gone)
    const stagedMemory = path.join(stagingDir, 'memory');
    if (await fs.pathExists(stagedMemory)) {
      await fs.move(stagedMemory, path.join(apmDir, 'memory'));
    }
  } finally {
    await fs.remove(stagingDir);
  }
}

/**
 * Renames Implementation_Plan.md → plan.md.
 */
async function migratePlan(apmDir) {
  const src = path.join(apmDir, 'Implementation_Plan.md');
  if (!await fs.pathExists(src)) return;

  await fs.move(src, path.join(apmDir, 'plan.md'));
}

/**
 * Splits Memory_Root.md into memory/index.md (staged) and creates tracker.md scaffold.
 */
async function migrateMemoryRoot(apmDir, stagingDir) {
  const src = path.join(apmDir, 'Memory', 'Memory_Root.md');
  if (!await fs.pathExists(src)) return;

  const content = await fs.readFile(src, 'utf8');
  const memoryIndexDir = path.join(stagingDir, 'memory');
  await fs.ensureDir(memoryIndexDir);

  // memory/index.md — preserve all Memory_Root content under v1 structure
  const indexContent = [
    '---',
    'title: Migrated from v0.5.4',
    '---',
    '',
    '# APM Memory Index',
    '',
    '## Memory Notes',
    '',
    '[Migrated from v0.5.4 Memory_Root.md — review and reorganize as needed.]',
    '',
    '## Stage Summaries',
    '',
    content
  ].join('\n');

  await fs.writeFile(path.join(memoryIndexDir, 'index.md'), indexContent);

  // tracker.md — fresh scaffold
  const trackerContent = [
    '---',
    'title: Migrated from v0.5.4',
    '---',
    '',
    '# APM Tracker',
    '',
    '## Task Tracking',
    '',
    '**Base:** <base-branch>',
    '',
    '[Populate from migrated plan.md when starting a v1 Manager session.]',
    '',
    '## Agent Tracking',
    '',
    '| Agent | Instance | Notes |',
    '|-------|----------|-------|',
    '',
    '## Version Control',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Base Branch | <base-branch> |',
    '| Branch Convention | <convention> |',
    '',
    '## Working Notes',
    '',
    '[Migrated from v0.5.4. Populate when starting a v1 Manager session.]'
  ].join('\n');

  await fs.writeFile(path.join(apmDir, 'tracker.md'), trackerContent);
}

/**
 * Migrates Phase_XX_* folders to stage-XX/ with renamed task logs (staged).
 */
async function migrateTaskLogs(apmDir, stagingDir) {
  const memoryDir = path.join(apmDir, 'Memory');
  if (!await fs.pathExists(memoryDir)) return;

  const targetMemoryDir = path.join(stagingDir, 'memory');
  await fs.ensureDir(targetMemoryDir);

  const entries = await fs.readdir(memoryDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const phaseMatch = entry.name.match(/^Phase_(\d+)/);
    if (!phaseMatch) continue;

    const phaseNum = phaseMatch[1].padStart(2, '0');
    const stageDir = path.join(targetMemoryDir, `stage-${phaseNum}`);
    await fs.ensureDir(stageDir);

    const phaseDir = path.join(memoryDir, entry.name);
    const files = await fs.readdir(phaseDir);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      // Pattern: Task_{phase}_{task}{letter?}_{followup?_}slug.md
      const taskMatch = file.match(/^Task_(\d+)_(\d+)([a-z]?)_(?:(followup)_)?/);
      if (taskMatch) {
        const [, , taskNum, letter, followup] = taskMatch;
        const stageStr = phaseNum;
        const taskStr = taskNum.padStart(2, '0');
        const suffix = followup ? `-${followup}` : '';
        const newName = `task-${stageStr}-${taskStr}${letter}${suffix}.log.md`;
        await fs.copy(path.join(phaseDir, file), path.join(stageDir, newName));
      } else {
        // Non-task files (e.g. Phase_03_Summary.md) — preserve with lowercase name
        await fs.copy(path.join(phaseDir, file), path.join(stageDir, file.toLowerCase()));
      }
    }
  }
}

/**
 * Moves AdHoc/ to memory/adhoc/ (staged).
 */
async function migrateAdHoc(apmDir, stagingDir) {
  const src = path.join(apmDir, 'Memory', 'AdHoc');
  if (!await fs.pathExists(src)) return;

  const dest = path.join(stagingDir, 'memory', 'adhoc');
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest);
}

/**
 * Migrates the last handover per agent folder to bus/<slug>/handoff.md.
 */
async function migrateHandovers(apmDir) {
  const handoversDir = path.join(apmDir, 'Memory', 'Handovers');
  if (!await fs.pathExists(handoversDir)) return;

  const agentFolders = (await fs.readdir(handoversDir, { withFileTypes: true }))
    .filter(e => e.isDirectory() && e.name.endsWith('_Handovers'));

  for (const folder of agentFolders) {
    const folderPath = path.join(handoversDir, folder.name);
    const files = (await fs.readdir(folderPath))
      .filter(f => f.endsWith('.md'))
      .sort(byHandoverNumber);

    if (files.length === 0) continue;

    const lastHandover = files[files.length - 1];
    const slug = deriveAgentSlug(folder.name);
    const busDir = path.join(apmDir, 'bus', slug);
    await fs.ensureDir(busDir);

    await fs.copy(
      path.join(folderPath, lastHandover),
      path.join(busDir, 'handoff.md')
    );
  }
}

/**
 * Removes legacy directories and files that are replaced by v1 templates.
 */
async function cleanLegacy(cwd) {
  const apmDir = path.join(cwd, '.apm');

  // Remove legacy guides
  await fs.remove(path.join(apmDir, 'guides'));

  // Remove legacy Memory directory (content already migrated)
  await fs.remove(path.join(apmDir, 'Memory'));

  // Remove legacy commands
  const commandsDir = path.join(cwd, '.claude', 'commands');
  if (await fs.pathExists(commandsDir)) {
    const files = await fs.readdir(commandsDir);
    for (const file of files) {
      if (file.startsWith('apm-') && file.endsWith('.md')) {
        await fs.remove(path.join(commandsDir, file));
      }
    }
  }
}

/**
 * Derives a v1 agent slug from a v0.5.4 handover folder name.
 *
 * @param {string} folderName - e.g. "Manager_Agent_Handovers", "Agent_Backend_Handovers"
 * @returns {string} Agent slug e.g. "manager", "agent-backend"
 */
function deriveAgentSlug(folderName) {
  const base = folderName.replace(/_Handovers$/, '');
  if (base === 'Manager_Agent') return 'manager';
  return base.toLowerCase().replace(/_/g, '-');
}

/**
 * Sort comparator for handover filenames by their trailing number.
 *
 * @param {string} a - Filename
 * @param {string} b - Filename
 * @returns {number} Sort order
 */
function byHandoverNumber(a, b) {
  const numA = extractHandoverNumber(a);
  const numB = extractHandoverNumber(b);
  return numA - numB;
}

/**
 * Extracts the numeric suffix from a handover filename.
 *
 * @param {string} filename - e.g. "Handover_File_2.md"
 * @returns {number} The number, or 0 if not found.
 */
function extractHandoverNumber(filename) {
  const match = filename.match(/(\d+)\.md$/);
  return match ? parseInt(match[1], 10) : 0;
}

export default {
  snapshotForMigration,
  detectLegacyVersion,
  buildMigrationReport,
  executeMigration
};
