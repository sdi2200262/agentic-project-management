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
import { parseFrontmatter } from './frontmatter.js';
import { replacePlaceholders, getOutputExtension } from './placeholders.js';
import { generateReleaseManifest } from '../generators/manifest.js';
import { createZipArchive } from '../generators/archive.js';
import { getVersion } from '../core/config.js';
import { BuildError } from '../core/errors.js';

/**
 * Determines if a template file is a command based on its source directory.
 *
 * @param {string} templatePath - Path to template file.
 * @param {string} sourceDir - Source templates directory.
 * @returns {boolean} True if file is in commands/ directory.
 */
function isCommandTemplate(templatePath, sourceDir) {
  const relativePath = path.relative(sourceDir, templatePath);
  return relativePath.startsWith('commands' + path.sep);
}

/**
 * Processes a single template file.
 *
 * @param {string} templatePath - Path to template file.
 * @param {Object} options - Processing options.
 * @returns {Promise<void>}
 */
async function processTemplate(templatePath, options) {
  const { target, version, commandsDir, skillsDir, targetBuildDir, sourceDir } = options;

  const content = await fs.readFile(templatePath, 'utf8');
  const { frontmatter, content: body } = parseFrontmatter(content);

  const isCommand = isCommandTemplate(templatePath, sourceDir);
  const category = isCommand ? 'command' : 'skill';

  const context = { version, target };
  const processedBody = replacePlaceholders(body, context);
  const processedFull = replacePlaceholders(content, context);

  const basename = path.basename(templatePath, '.md');
  const ext = getOutputExtension(target);
  let outputFilename;
  let finalContent;

  if (isCommand) {
    outputFilename = `${basename}${ext}`;

    if (target.format === 'toml') {
      const description = frontmatter.description || 'APM command';
      finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
    } else {
      finalContent = processedFull;
    }
  } else {
    // Skills output to <skillName>/SKILL.md
    finalContent = processedFull;
  }

  let outputPath;
  if (isCommand) {
    outputPath = path.join(commandsDir, `${basename}${ext}`);
  } else {
    // Skills: create subdirectory and write SKILL.md
    const skillDir = path.join(skillsDir, basename);
    await fs.ensureDir(skillDir);
    outputPath = path.join(skillDir, 'SKILL.md');
  }

  await fs.writeFile(outputPath, finalContent);
  logger.info(`${category}: ${basename}.md → ${path.relative(targetBuildDir, outputPath)}`);
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
  const commandsDir = path.join(targetBuildDir, target.directories.commands);
  const skillsDir = path.join(targetBuildDir, target.directories.skills);

  logger.info(`\nProcessing target: ${target.name} (${target.id})`);

  await fs.ensureDir(commandsDir);
  await fs.ensureDir(skillsDir);

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
      commandsDir,
      skillsDir,
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

  if (cleanOutput) {
    await fs.emptyDir(outputDir);
  } else {
    await fs.ensureDir(outputDir);
  }

  const version = await getVersion();
  logger.info(`Building ${targets.length} targets to ${outputDir}...`);

  for (const target of targets) {
    await buildTarget(target, config, version);
  }

  // Write release manifest
  const releaseManifest = generateReleaseManifest(config, version);
  const releaseManifestPath = path.join(outputDir, 'apm-release.json');
  await fs.writeFile(releaseManifestPath, JSON.stringify(releaseManifest, null, 2));
  logger.success(`Generated apm-release.json`);

  logger.success('\nBuild completed successfully!');
}
