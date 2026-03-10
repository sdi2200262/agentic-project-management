/**
 * Archive Service Module
 *
 * Core archival logic for session continuation.
 *
 * @module src/services/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';

/**
 * Generates the next archive directory name for today.
 * Format: session-YYYY-MM-DD-NNN (zero-padded daily counter).
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @returns {Promise<string>} Archive directory name.
 */
export async function generateArchiveName(archivesDir) {
  const today = new Date().toISOString().slice(0, 10);
  const prefix = `session-${today}-`;

  let maxCounter = 0;
  if (await fs.pathExists(archivesDir)) {
    const entries = await fs.readdir(archivesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith(prefix)) {
        const suffix = entry.name.slice(prefix.length);
        const num = parseInt(suffix, 10);
        if (!isNaN(num) && num > maxCounter) {
          maxCounter = num;
        }
      }
    }
  }

  const counter = String(maxCounter + 1).padStart(3, '0');
  return `${prefix}${counter}`;
}

/**
 * Validates that a continues reference points to a valid archive.
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @param {string} name - Archive directory name to validate.
 * @returns {Promise<boolean>} True if valid archive exists.
 */
export async function validateContinues(archivesDir, name) {
  const archivePath = path.join(archivesDir, name);
  const metadataPath = path.join(archivePath, 'metadata.json');
  return fs.pathExists(metadataPath);
}

/**
 * Lists valid archives (directories containing metadata.json).
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @returns {Promise<string[]>} Array of archive directory names.
 */
export async function listArchives(archivesDir) {
  if (!await fs.pathExists(archivesDir)) {
    return [];
  }

  const entries = await fs.readdir(archivesDir, { withFileTypes: true });
  const archives = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const metadataPath = path.join(archivesDir, entry.name, 'metadata.json');
      if (await fs.pathExists(metadataPath)) {
        archives.push(entry.name);
      }
    }
  }

  return archives.sort();
}

/**
 * Counts valid archives.
 *
 * @param {string} archivesDir - Absolute path to archives directory.
 * @returns {Promise<number>} Number of valid archives.
 */
export async function countArchives(archivesDir) {
  const archives = await listArchives(archivesDir);
  return archives.length;
}

/**
 * Moves current .apm/ artifacts to an archive directory.
 *
 * @param {string} cwd - Working directory.
 * @param {string} name - Archive directory name.
 * @param {string|null} continues - Previous archive name, or null.
 * @returns {Promise<string>} Absolute path to created archive.
 */
export async function moveApmToArchive(cwd, name, continues) {
  const apmDir = path.join(cwd, '.apm');
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const archivePath = path.join(archivesDir, name);

  await fs.ensureDir(archivePath);

  // Move planning documents and memory
  const artifacts = ['plan.md', 'spec.md', 'tracker.md', 'session-summary.md', 'memory'];
  for (const artifact of artifacts) {
    const src = path.join(apmDir, artifact);
    if (await fs.pathExists(src)) {
      await fs.move(src, path.join(archivePath, artifact));
    }
  }

  // Copy metadata.json (don't move — we'll write a fresh one)
  const metadataSrc = path.join(apmDir, 'metadata.json');
  if (await fs.pathExists(metadataSrc)) {
    const metadata = await fs.readJson(metadataSrc);
    metadata.archivedAt = new Date().toISOString();
    if (continues) {
      metadata.continues = continues;
    }
    await fs.writeJson(path.join(archivePath, 'metadata.json'), metadata, { spaces: 2 });
  }

  // Remove bus directory (ephemeral, not archived)
  const busDir = path.join(apmDir, 'bus');
  if (await fs.pathExists(busDir)) {
    await fs.remove(busDir);
  }

  return archivePath;
}

/**
 * Restores fresh template artifacts after archival.
 *
 * @param {string} cwd - Working directory.
 * @returns {Promise<void>}
 */
export async function restoreFreshTemplates(cwd) {
  const apmDir = path.join(cwd, '.apm');

  const planContent = `---
title: <Project Name>
modified: <last modification note>
---

# APM Plan

## Agents

[Agent definitions - to be filled by Planner during Work Breakdown]

## Stages

[Stage list - to be filled by Planner during Work Breakdown]

## Dependency Graph

[Mermaid diagram - to be filled by Planner during Work Breakdown]

---

[Stage and Task sections - to be filled by Planner during Work Breakdown]
`;

  const specContent = `---
title: <Project Name>
modified: <last modification note>
---

# APM Spec

## Overview

[Project overview - to be filled by Planner during Work Breakdown]

---

[Content sections determined by project needs - to be filled by Planner]
`;

  const trackerContent = `---
title: <Project Name>
---

# APM Tracker

## Task Tracking

**Base:** <base-branch>

**Stage 1:**

| Task | Status | Agent | Branch |
|------|--------|-------|--------|

## Agent Tracking

| Agent | Session | Notes |
|-------|---------|-------|

## Version Control

| Field | Value |
|-------|-------|
| Base Branch | <base-branch> |
| Branch Convention | <convention> |

## Working Notes

[Bulleted list. One item per note. Insert and remove as context evolves. Durable observations accumulate here until distilled into Memory Notes at Stage summary.]
`;

  const indexContent = `---
title: <Project Name>
---

# APM Memory Index

## Memory Notes

[Bulleted list. One item per note. Durable observations and patterns with lasting value.]

## Stage Summaries

[Appended after each Stage completion.]
`;

  await fs.writeFile(path.join(apmDir, 'plan.md'), planContent);
  await fs.writeFile(path.join(apmDir, 'spec.md'), specContent);
  await fs.writeFile(path.join(apmDir, 'tracker.md'), trackerContent);
  await fs.ensureDir(path.join(apmDir, 'memory'));
  await fs.writeFile(path.join(apmDir, 'memory', 'index.md'), indexContent);
}

export default {
  generateArchiveName,
  validateContinues,
  listArchives,
  countArchives,
  moveApmToArchive,
  restoreFreshTemplates
};
