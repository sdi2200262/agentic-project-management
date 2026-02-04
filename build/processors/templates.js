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
import { replacePlaceholders, getOutputExtension, getAgentExtension } from './placeholders.js';
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
 * Determines if a template file is an agent definition based on its source directory.
 *
 * @param {string} templatePath - Path to template file.
 * @param {string} sourceDir - Source templates directory.
 * @returns {boolean} True if file is in agents/ directory.
 */
function isAgentTemplate(templatePath, sourceDir) {
  const relativePath = path.relative(sourceDir, templatePath);
  return relativePath.startsWith('agents' + path.sep);
}

/**
 * Processes agent definition files.
 *
 * Agent templates are now minimal - delegates only need memory-logging capability.
 * Skill content embedding has been removed; delegating agents read delegation skills
 * to understand HOW to create prompts, while delegates receive those prompts directly.
 *
 * @param {string} content - Agent template content.
 * @returns {string} Content (unchanged, placeholders handled by replacePlaceholders).
 */
function processAgentContent(content) {
  // Agent templates no longer embed skill content.
  // Placeholders like {CLAUDE_SKILLS_FIELD:*} and {DELEGATE_MEMORY_LOGGING_INSTRUCTION}
  // are handled by replacePlaceholders() in placeholders.js.
  return content;
}

/**
 * Processes a single template file.
 *
 * @param {string} templatePath - Path to template file.
 * @param {Object} options - Processing options.
 * @returns {Promise<void>}
 */
async function processTemplate(templatePath, options) {
  const { target, version, commandsDir, skillsDir, guidesDir, agentsDir, targetBuildDir, sourceDir } = options;

  const content = await fs.readFile(templatePath, 'utf8');

  const isCommand = isCommandTemplate(templatePath, sourceDir);
  const isGuide = isGuideTemplate(templatePath, sourceDir);
  const isAgent = isAgentTemplate(templatePath, sourceDir);
  const category = isCommand ? 'command' : (isGuide ? 'guide' : (isAgent ? 'agent' : 'skill'));

  const context = { version, target };
  const basename = path.basename(templatePath, '.md');
  const ext = getOutputExtension(target);
  let finalContent;
  let outputPath;

  if (isGuide) {
    // Guides: plain markdown, no frontmatter, flat files
    finalContent = replacePlaceholders(content, context);
    outputPath = path.join(guidesDir, `${basename}.md`);
  } else if (isAgent) {
    // Agent definitions: process content, then placeholders
    let processedContent = processAgentContent(content);
    processedContent = replacePlaceholders(processedContent, context);

    // Clean up empty lines in frontmatter that result from removed placeholders
    processedContent = cleanAgentFrontmatter(processedContent);

    finalContent = processedContent;
    const agentExt = getAgentExtension(target);
    outputPath = path.join(agentsDir, `${basename}${agentExt}`);
  } else {
    // Commands and Skills: parse frontmatter
    const { frontmatter, content: body } = parseFrontmatter(content);
    const processedBody = replacePlaceholders(body, context);
    const processedFull = replacePlaceholders(content, context);

    if (isCommand) {
      if (target.format === 'toml') {
        const description = frontmatter.description || 'APM command';
        finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
      } else {
        finalContent = processedFull;
      }
      outputPath = path.join(commandsDir, `${basename}${ext}`);
    } else {
      // Skills: directory-based structure (skills/<skill-name>/SKILL.md + optional files)
      finalContent = processedFull;
      const relativePath = path.relative(sourceDir, templatePath);
      const pathParts = relativePath.split(path.sep);
      // pathParts: ['skills', '<skill-name>', '<file>.md']
      const skillName = pathParts[1];
      const fileName = pathParts[pathParts.length - 1];
      const skillDir = path.join(skillsDir, skillName);
      await fs.ensureDir(skillDir);
      outputPath = path.join(skillDir, fileName);
    }
  }

  await fs.writeFile(outputPath, finalContent);
  logger.info(`${category}: ${basename}.md → ${path.relative(targetBuildDir, outputPath)}`);
}

/**
 * Cleans up agent frontmatter by removing empty lines from removed placeholders.
 *
 * @param {string} content - Agent content with frontmatter.
 * @returns {string} Cleaned content.
 */
function cleanAgentFrontmatter(content) {
  // Split into frontmatter and body
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return content;

  const [, frontmatter, body] = match;

  // Remove empty lines from frontmatter
  const cleanedFrontmatter = frontmatter
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

  return `---\n${cleanedFrontmatter}\n---\n${body}`;
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
  const guidesDir = path.join(targetBuildDir, target.directories.guides);
  const agentsDir = path.join(targetBuildDir, target.directories.agents);

  logger.info(`\nProcessing target: ${target.name} (${target.id})`);

  await fs.ensureDir(commandsDir);
  await fs.ensureDir(skillsDir);
  await fs.ensureDir(guidesDir);
  await fs.ensureDir(agentsDir);

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
      guidesDir,
      agentsDir,
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
