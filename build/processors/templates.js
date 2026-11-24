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
import { replacePlaceholders } from './placeholders.js';
import { isSingleSkill, templateOutputPath } from './paths.js';
import { generateReleaseManifest } from '../generators/manifest.js';
import { createZipArchive } from '../generators/archive.js';
import { getVersion } from '../core/config.js';
import { BuildError } from '../core/errors.js';

/** Renders one source using the same path mapping used by cross-file references. */
async function processTemplate(templatePath, options) {
  const { version, target, targetBuildDir, sourceDir } = options;
  const relativePath = path.relative(sourceDir, templatePath).split(path.sep).join('/');
  const destination = templateOutputPath(target, relativePath);
  if (destination === null) return;

  let source = await fs.readFile(templatePath, 'utf8');
  if (isSingleSkill(target) && relativePath !== 'entrypoints/apm/SKILL.md') {
    // Reference documents are ordinary Markdown, not discoverable skills.
    source = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n(?:\r?\n)?/, '');
  }
  const content = replacePlaceholders(source, { version, target });
  const outputPath = path.join(targetBuildDir, destination);
  await fs.outputFile(outputPath, content);
  logger.info(`${relativePath} → ${destination}`);
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
 * Builds a single target.
 *
 * @param {Object} target - Target configuration.
 * @param {Object} config - Full build configuration.
 * @param {string} version - Version string.
 * @returns {Promise<void>}
 */
async function buildTarget(target, config, version) {
  const { build: buildConfig } = config;
  const { outputDir, sourceDir } = buildConfig;

  const targetBuildDir = path.join(outputDir, `${target.id}-build`);

  logger.info(`\nProcessing target: ${target.name} (${target.id})`);

  // Copy apm/ → .apm/ (common to all targets)
  await copyApmDirectory(sourceDir, targetBuildDir);

  const templateFiles = [
    ...await findMdFiles(path.join(sourceDir, 'skills')),
    ...await findMdFiles(path.join(sourceDir, 'guides'))
  ];
  if (isSingleSkill(target)) {
    templateFiles.push(path.join(sourceDir, 'entrypoints/apm/SKILL.md'));
  }
  logger.info(`Found ${templateFiles.length} template files`);

  // Process all templates
  for (const templatePath of templateFiles) {
    await processTemplate(templatePath, {
      target,
      version,
      targetBuildDir,
      sourceDir
    });
  }

  logger.success(`Completed target: ${target.name}`);

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
  const version = await getVersion();
  const releaseManifest = generateReleaseManifest(config, version);

  if (cleanOutput) {
    await fs.emptyDir(outputDir);
  } else {
    await fs.ensureDir(outputDir);
  }

  logger.info(`Building ${targets.length} targets to ${outputDir}...`);

  for (const target of targets) {
    await buildTarget(target, config, version);
  }

  // Write the validated release manifest
  const releaseManifestPath = path.join(outputDir, 'apm-release.json');
  await fs.writeFile(releaseManifestPath, JSON.stringify(releaseManifest, null, 2));
  logger.success(`Generated apm-release.json`);

  logger.success('\nBuild completed successfully!');
}
