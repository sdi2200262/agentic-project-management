/**
 * Template Processing Module
 *
 * Orchestrates template processing for all targets.
 *
 * @module build/processors/templates
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '../../src/logger.js';
import { findMdFiles, copyScaffolds } from '../utils/files.js';
import { parseFrontmatter } from './frontmatter.js';
import { replacePlaceholders, getOutputExtension } from './placeholders.js';
import { generateBundleManifest, generateReleaseManifest } from '../generators/manifest.js';
import { createZipArchive } from '../generators/archive.js';
import { getVersion } from '../core/config.js';
import { BuildError } from '../core/errors.js';

/**
 * Sanitizes a command name for use in filenames.
 *
 * @param {string} name - Command name to sanitize.
 * @returns {string} Sanitized command name.
 */
function sanitizeCommandName(name) {
  return String(name || '').replace(/[^a-zA-Z0-9-_]/g, '-');
}

/**
 * Builds command filename map for COMMAND_PATH placeholder resolution.
 *
 * @param {string[]} templateFiles - Array of template file paths.
 * @param {Object} target - Target configuration.
 * @returns {Promise<Object>} Map of original filename to built filename.
 */
async function buildCommandFileMap(templateFiles, target) {
  const commandFileMap = {};
  const commandNames = new Map(); // Track command_name -> files for duplicate detection

  for (const templatePath of templateFiles) {
    const content = await fs.readFile(templatePath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);

    if (frontmatter.command_name === undefined) {
      continue;
    }

    const commandName = frontmatter.command_name;

    // Track for duplicate detection
    if (!commandNames.has(commandName)) {
      commandNames.set(commandName, []);
    }
    commandNames.get(commandName).push(templatePath);

    const originalBase = path.basename(templatePath, '.md');
    const priority = frontmatter.priority || 'default';
    const sanitizedCommandName = sanitizeCommandName(commandName);
    const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;
    const finalExt = getOutputExtension(target);
    const finalFilename = `${fullCommandName}${finalExt}`;

    commandFileMap[originalBase] = finalFilename;
    commandFileMap[`${originalBase}.md`] = finalFilename;
  }

  // Check for duplicates
  for (const [name, files] of commandNames) {
    if (files.length > 1) {
      throw BuildError.duplicateCommand(name, files);
    }
  }

  return commandFileMap;
}

/**
 * Processes a single template file.
 *
 * @param {string} templatePath - Path to template file.
 * @param {Object} options - Processing options.
 * @param {Object} options.target - Target configuration.
 * @param {string} options.version - Version string.
 * @param {Object} options.commandFileMap - Command filename map.
 * @param {string} options.commandsDir - Output commands directory.
 * @param {string} options.skillsDir - Output skills directory.
 * @param {string} options.targetBuildDir - Target build directory.
 * @returns {Promise<void>}
 */
async function processTemplate(templatePath, options) {
  const { target, version, commandFileMap, commandsDir, skillsDir, targetBuildDir } = options;

  const content = await fs.readFile(templatePath, 'utf8');
  const { frontmatter, content: body } = parseFrontmatter(content);

  const isCommand = frontmatter.command_name !== undefined;
  const category = isCommand ? 'command' : 'skill';

  const context = { version, target, commandFileMap };
  const processedBody = replacePlaceholders(body, context);
  const processedFull = replacePlaceholders(content, context);

  const originalFilename = path.basename(templatePath, '.md');
  let outputFilename;
  let finalContent;

  if (isCommand && frontmatter.command_name) {
    const priority = frontmatter.priority || 'default';
    const sanitizedCommandName = sanitizeCommandName(frontmatter.command_name);
    const fullCommandName = `apm-${priority}-${sanitizedCommandName}`;
    const ext = getOutputExtension(target);

    outputFilename = `${fullCommandName}${ext}`;

    if (target.format === 'toml') {
      const description = frontmatter.description || 'APM command';
      finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
    } else {
      finalContent = processedFull;
    }
  } else {
    outputFilename = `${originalFilename}.md`;
    finalContent = processedFull;
  }

  const outputDirPath = isCommand ? commandsDir : skillsDir;
  const outputPath = path.join(outputDirPath, outputFilename);

  await fs.writeFile(outputPath, finalContent);
  logger.info(`${category}: ${originalFilename}.md → ${path.relative(targetBuildDir, outputPath)}`);
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
  const { outputDir, scaffoldsDir } = buildConfig;

  const targetBuildDir = path.join(outputDir, `${target.id}-build`);
  const commandsDir = path.join(targetBuildDir, 'commands');
  const skillsDir = path.join(targetBuildDir, 'skills');
  const scaffoldsBuildDir = path.join(targetBuildDir, 'scaffolds');

  logger.info(`\nProcessing target: ${target.name} (${target.id})`);

  await fs.ensureDir(commandsDir);
  await fs.ensureDir(skillsDir);
  await fs.ensureDir(scaffoldsBuildDir);

  const templateFiles = await findMdFiles(buildConfig.sourceDir);
  logger.info(`Found ${templateFiles.length} template files`);

  // Pre-compute command filename mapping (also detects duplicates)
  const commandFileMap = await buildCommandFileMap(templateFiles, target);

  // Process all templates
  for (const templatePath of templateFiles) {
    await processTemplate(templatePath, {
      target,
      version,
      commandFileMap,
      commandsDir,
      skillsDir,
      targetBuildDir
    });
  }

  // Copy scaffolds into bundle
  if (scaffoldsDir) {
    const scaffoldsSourceDir = path.join(buildConfig.sourceDir, scaffoldsDir);
    await copyScaffolds(scaffoldsSourceDir, scaffoldsBuildDir);
    if (await fs.pathExists(scaffoldsSourceDir)) {
      logger.info(`Copied scaffolds to bundle`);
    }
  }

  // Write bundle manifest
  const bundleManifest = generateBundleManifest(target);
  const bundleManifestPath = path.join(targetBuildDir, 'apm-bundle-manifest.json');
  await fs.writeFile(bundleManifestPath, JSON.stringify(bundleManifest, null, 2));
  logger.info(`Generated apm-bundle-manifest.json`);

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
  const releaseManifestPath = path.join(outputDir, 'apm-release-manifest.json');
  await fs.writeFile(releaseManifestPath, JSON.stringify(releaseManifest, null, 2));
  logger.success(`Generated apm-release-manifest.json`);

  logger.success('\nBuild completed successfully!');
}
