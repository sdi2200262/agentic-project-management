/**
 * Archive Command Module
 *
 * Handles 'apm archive' command for session archival, listing, and management.
 *
 * @module src/commands/archive
 */

import fs from 'fs-extra';
import path from 'path';
import { METADATA_FILE, ARCHIVES_DIR } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { readMetadata, getInstalledFiles, getAssistantNames } from '../core/metadata.js';
import { formatAssistantList } from '../core/assistants.js';
import { createArchive, listArchivesWithInfo, removeArchive, clearArchives, generateArchiveName, archivePathFor } from '../services/archive.js';
import { removeInstalledFiles } from '../services/cleanup.js';
import { confirmDestructiveAction } from '../ui/prompts.js';
import logger from '../ui/logger.js';

/**
 * Executes the archive command.
 *
 * @param {Object} [options={}] - Command options.
 * @param {boolean} [options.list] - List archives instead of creating one.
 * @param {boolean} [options.force] - Skip confirmation prompt.
 * @param {string} [options.name] - Custom archive name.
 * @param {string} [options.remove] - Archive name to remove.
 * @param {boolean} [options.clear] - Clear all archives.
 * @returns {Promise<void>}
 */
export async function archiveCommand(options = {}) {
  const { list, force = false, name, delete: deleteArchive, clear, discardWorktrees = false } = options;

  logger.clearAndBanner();

  if (discardWorktrees && (list || (!deleteArchive && !clear))) throw new Error('--discard-worktrees applies only to --delete or --clear.');
  if (list) return listMode();
  if (deleteArchive) return deleteMode(deleteArchive, force, discardWorktrees);
  if (clear) return clearMode(force, discardWorktrees);

  return createMode(force, name);
}

/**
 * Lists archives with metadata.
 */
async function listMode() {
  const cwd = process.cwd();
  const archives = await listArchivesWithInfo(cwd);

  if (!archives.length) {
    logger.info('No archives found.');
    return;
  }

  logger.info(`Archives (${archives.length}), oldest first:`);
  logger.blank();

  const chalk = logger.chalk;

  for (const { name, metadata } of archives) {
    console.log(chalk.bold(name));
    console.log(`  Version:     ${metadata.releaseVersion || 'unknown'}`);
    console.log(`  Targets:     ${formatAssistantList(metadata.assistants || [], getAssistantNames(metadata)) || 'unknown'}`);
    console.log(`  Archived:    ${metadata.archivedAt || 'unknown'}`);
    if (metadata.archivedWorktrees?.length) console.log(`  Worktrees:   ${metadata.archivedWorktrees.length} (attached to source repositories)`);
    if (metadata.reason) {
      console.log(`  Reason:      ${metadata.reason}`);
    }
    console.log('');
  }
}

/**
 * Removes a single archive.
 */
async function deleteMode(name, force, discardWorktrees) {
  const cwd = process.cwd();
  const archivePath = archivePathFor(cwd, name);

  if (!await fs.pathExists(archivePath)) {
    logger.error(`Archive "${name}" not found.`);
    return;
  }

  if (!force) {
    const proceed = await confirmDestructiveAction(
      [`Delete archive "${name}" permanently${discardWorktrees ? ", including preserved unfinished worktrees" : " and its clean worktrees"}`],
      'Delete?'
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  await removeArchive(cwd, name, { discardWorktrees });
  logger.clearAndBanner();
  logger.success(`Deleted archive: ${name}`);
}

/**
 * Clears all archives.
 */
async function clearMode(force, discardWorktrees) {
  const cwd = process.cwd();
  const archives = await listArchivesWithInfo(cwd);

  if (!archives.length) {
    logger.info('No archives to clear.');
    return;
  }

  if (!force) {
    const actions = archives.map(a => {
      const date = a.metadata.archivedAt ? new Date(a.metadata.archivedAt).toLocaleString() : 'unknown';
      return `Delete ${a.name} (archived ${date})${discardWorktrees ? ", including preserved unfinished worktrees" : " and its clean worktrees"}`;
    });
    const proceed = await confirmDestructiveAction(actions, `Delete all ${archives.length} archives?`);
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }

  const count = await clearArchives(cwd, { discardWorktrees });
  logger.clearAndBanner();
  logger.success(`Deleted ${logger.plural(count, 'archive')}.`);
}

/**
 * Creates an archive, cleans tracked files, and removes metadata.
 */
async function createMode(force, archiveName) {
  const cwd = process.cwd();
  const metadata = await readMetadata(cwd);

  if (!metadata) {
    throw CLIError.notInitialized();
  }

  // Determine archive name ahead of time for the confirmation message
  const archivesDir = path.join(cwd, ARCHIVES_DIR);
  const resolvedName = archiveName || await generateArchiveName(archivesDir);
  archivePathFor(cwd, resolvedName);
  const archiveOpts = { reason: 'archive', name: archiveName };

  // Confirm destructive action
  if (!force) {
    const assistantList = formatAssistantList(metadata.assistants, getAssistantNames(metadata));
    const proceed = await confirmDestructiveAction(
      [
        `Snapshot session records into .apm/archives/${resolvedName} and move worktrees there with Git`,
        `Agents must have stopped writing before archival starts`,
        `Remove active session files, installed templates for ${assistantList}, and active metadata (archives are kept)`
      ],
      'Archive and clean?'
    );
    if (!proceed) {
      logger.info('Aborted.');
      return;
    }
  }
  const { archivePath, worktrees } = await createArchive(cwd, archiveOpts);

  try {
    // Clean tracked files
    const installedFiles = getInstalledFiles(metadata);
    await removeInstalledFiles(cwd, installedFiles);

    // Delete metadata
    const metadataPath = path.join(cwd, METADATA_FILE);
    await fs.remove(metadataPath);
  } catch (error) {
    const preserved = worktrees.map(worktree => worktree.to).join(', ');
    throw new Error(`Session preserved at ${archivePath}${preserved ? `; worktrees: ${preserved}` : ''}, but installed-file cleanup failed: ${error.message}. Check the active installation before continuing.`);
  }

  // Clear content for final output
  logger.clearAndBanner();
  logger.success(`Archived to ${path.relative(cwd, archivePath)}`);
  if (worktrees.length) {
    logger.info(`Preserved ${logger.plural(worktrees.length, 'worktree')}; they remain attached to their source repositories.`);
    for (const worktree of worktrees) logger.info(`${worktree.from} -> ${worktree.to}${worktree.unfinished ? ' (unfinished work)' : ''}`);
  }
  logger.info('To start a new session, run "apm init" (or "apm custom"), then invoke apm-1-initiate-planner in a new chat.');
}

export default archiveCommand;
