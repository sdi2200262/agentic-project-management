/**
 * Template Processing Module
 *
 * Orchestrates template processing for all targets.
 *
 * @module build/processors/templates
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger.js';
import { findMdFiles } from '../utils/files.js';
import crypto from 'crypto';
import { replacePlaceholders } from './placeholders.js';
import { generateReleaseManifest } from '../generators/manifest.js';
import { createZipArchive } from '../generators/archive.js';
import { getVersion } from '../core/config.js';
import { BuildError } from '../core/errors.js';

/**
 * Determines if a template file is a guide based on its source directory.
 *
 * @param {string} templatePath - Path to template file.
 * @param {string} sourceDir - Source templates directory.
 * @returns {boolean} True if file is in guides/ directory.
 */
function isGuideTemplate(templatePath, sourceDir) {
  const relativePath = path.relative(sourceDir, templatePath);
  return relativePath.startsWith('guides' + path.sep);
}

/**
 * Processes a single template file.
 *
 * @param {string} templatePath - Path to template file.
 * @param {Object} options - Processing options.
 * @returns {Promise<void>}
 */
async function processTemplate(templatePath, options) {
  const { version, skillsDir, guidesDir, targetBuildDir, sourceDir } = options;

  const content = replacePlaceholders(await fs.readFile(templatePath, 'utf8'), { version });
  const relativePath = path.relative(sourceDir, templatePath);
  let outputPath;

  if (isGuideTemplate(templatePath, sourceDir)) {
    // Guides: flat files
    outputPath = path.join(guidesDir, path.basename(templatePath));
  } else {
    // Skills, including the commands: skills/<skill-name>/<file>.md, copied as they are
    const [, skillName, ...rest] = relativePath.split(path.sep);
    const skillDir = path.join(skillsDir, skillName);
    await fs.ensureDir(skillDir);
    outputPath = path.join(skillDir, ...rest);
  }

  await fs.writeFile(outputPath, content);
  logger.info(`${relativePath} → ${path.relative(targetBuildDir, outputPath)}`);
}

/**
 * Copies apm/ directory to .apm/ in target build directory.
 *
 * @param {string} sourceDir - Source templates directory.
 * @param {string} targetBuildDir - Target build directory.
 * @returns {Promise<void>}
 */
async function copyApmDirectory(sourceDir, targetBuildDir) {
  const apmSource = path.join(sourceDir, 'apm');
  const apmDest = path.join(targetBuildDir, '.apm');

  if (await fs.pathExists(apmSource)) {
    await fs.copy(apmSource, apmDest);
    logger.info(`Copied apm/ → .apm/`);
  }
}

/**
 * Hashes the files in a target's skills and guides folders.
 *
 * Every assistant installs the same skills and guides, so these hashes must match across targets.
 *
 * @param {string} targetBuildDir - Target build directory.
 * @param {Object} target - Target configuration.
 * @returns {Promise<Map<string, string>>} Map of path (skills/... or apm-guides/...) to SHA-256 hash.
 */
async function hashSharedFiles(targetBuildDir, target) {
  const hashes = new Map();

  async function walk(dir, base) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, base);
      } else {
        const hash = crypto.createHash('sha256').update(await fs.readFile(fullPath)).digest('hex');
        hashes.set(path.join(base, path.relative(path.join(targetBuildDir, target.directories[base === 'skills' ? 'skills' : 'guides']), fullPath)).split(path.sep).join('/'), hash);
      }
    }
  }

  await walk(path.join(targetBuildDir, target.directories.skills), 'skills');
  await walk(path.join(targetBuildDir, target.directories.guides), 'apm-guides');
  return hashes;
}

/**
 * Throws when any target's shared files differ from the first target's.
 *
 * @param {Map<string, Map<string, string>>} sharedByTarget - Hashes per target ID.
 * @throws {BuildError} When a file is missing or has different content.
 */
function checkSharedFiles(sharedByTarget) {
  const [[firstId, first], ...rest] = [...sharedByTarget];
  const problems = [];

  for (const [id, hashes] of rest) {
    for (const file of new Set([...first.keys(), ...hashes.keys()])) {
      if (!hashes.has(file) || !first.has(file)) {
        problems.push(`${file}: in ${hashes.has(file) ? id : firstId} only`);
      } else if (hashes.get(file) !== first.get(file)) {
        problems.push(`${file}: ${id} differs from ${firstId}`);
      }
    }
  }

  if (problems.length > 0) {
    throw BuildError.sharedFilesDiffer(problems);
  }
  logger.success(`Shared files identical across ${sharedByTarget.size} targets (${first.size} files)`);
}

/**
 * Builds a single target.
 *
 * @param {Object} target - Target configuration.
 * @param {Object} config - Full build configuration.
 * @param {string} version - Version string.
 * @returns {Promise<Map<string, string>>} Hashes of the target's shared files.
 */
async function buildTarget(target, config, version) {
  const { build: buildConfig } = config;
  const { outputDir, sourceDir } = buildConfig;

  const targetBuildDir = path.join(outputDir, `${target.id}-build`);
  const skillsDir = path.join(targetBuildDir, target.directories.skills);
  const guidesDir = path.join(targetBuildDir, target.directories.guides);

  logger.info(`\nProcessing target: ${target.name} (${target.id})`);

  await fs.ensureDir(skillsDir);
  await fs.ensureDir(guidesDir);

  // Copy apm/ → .apm/ (common to all targets)
  await copyApmDirectory(sourceDir, targetBuildDir);

  // Find template files (excludes _standards/ and apm/)
  const templateFiles = await findMdFiles(sourceDir);
  logger.info(`Found ${templateFiles.length} template files`);

  // Process all templates
  for (const templatePath of templateFiles) {
    await processTemplate(templatePath, {
      target,
      version,
      skillsDir,
      guidesDir,
      targetBuildDir,
      sourceDir
    });
  }

  logger.success(`Completed target: ${target.name}`);
  const sharedHashes = await hashSharedFiles(targetBuildDir, target);

  // Create ZIP archive
  const zipPath = path.join(outputDir, target.bundleName);
  logger.info(`Creating archive: ${target.bundleName}...`);

  try {
    await createZipArchive(targetBuildDir, zipPath);
    logger.success(`Archive created: ${target.bundleName}`);

    await fs.remove(targetBuildDir);
    logger.info(`Cleaned up: ${path.basename(targetBuildDir)}`);
  } catch (err) {
    throw BuildError.archiveFailed(target.name, err.message);
  }

  return sharedHashes;
}

/**
 * Main build orchestration function.
 *
 * @param {Object} config - Build configuration.
 * @returns {Promise<void>}
 */
export async function buildAll(config) {
  const { build: buildConfig, targets } = config;
  const { outputDir, cleanOutput } = buildConfig;

  if (cleanOutput) {
    await fs.emptyDir(outputDir);
  } else {
    await fs.ensureDir(outputDir);
  }

  const version = await getVersion();
  logger.info(`Building ${targets.length} targets to ${outputDir}...`);

  const sharedByTarget = new Map();
  for (const target of targets) {
    sharedByTarget.set(target.id, await buildTarget(target, config, version));
  }
  checkSharedFiles(sharedByTarget);

  // Write release manifest
  const releaseManifest = generateReleaseManifest(config, version);
  const releaseManifestPath = path.join(outputDir, 'apm-release.json');
  await fs.writeFile(releaseManifestPath, JSON.stringify(releaseManifest, null, 2));
  logger.success(`Generated apm-release.json`);

  logger.success('\nBuild completed successfully!');
}
