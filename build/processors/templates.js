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
import { parseFrontmatter, stripEnhancedFields, rebuildWithFrontmatter, translateFrontmatter } from './frontmatter.js';
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
 * Determines if a template file is an agent based on its source directory.
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
 * Collects command names that are replaced by enhanced skills or agents.
 * Only applies when the target supports enhanced skills.
 *
 * @param {string[]} templateFiles - Array of template file paths.
 * @param {string} sourceDir - Source templates directory.
 * @param {Object} target - Target configuration.
 * @returns {Promise<Set<string>>} Set of command_name values to exclude.
 */
async function collectReplacedCommands(templateFiles, sourceDir, target) {
  const replaced = new Set();
  if (!target.enhancedSkills) return replaced;

  for (const filePath of templateFiles) {
    const relativePath = path.relative(sourceDir, filePath);
    const isSkill = relativePath.startsWith('skills' + path.sep);
    const isAgent = relativePath.startsWith('agents' + path.sep);
    if (!isSkill && !isAgent) continue;

    const content = await fs.readFile(filePath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    if (frontmatter.replaces) {
      replaced.add(frontmatter.replaces);
      const type = isSkill ? 'Skill' : 'Agent';
      logger.info(`${type} ${frontmatter.name || relativePath} replaces command: ${frontmatter.replaces}`);
    }
  }
  return replaced;
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
  } else {
    // Commands and Skills: parse frontmatter
    const { frontmatter, content: body } = parseFrontmatter(content);
    const processedBody = replacePlaceholders(body, context);
    const processedFull = replacePlaceholders(content, context);

    // Determine if this skill should be promoted to agent on this target
    const promoteList = target.promoteToAgent || [];
    const isSkill = !isCommand && !isGuide && !isAgent;
    let promoted = false;
    let skillName = null;
    if (isSkill) {
      const relativePath = path.relative(sourceDir, templatePath);
      const pathParts = relativePath.split(path.sep);
      skillName = pathParts[1];
      promoted = promoteList.includes(skillName);
    }

    // Enhanced: use full frontmatter (with translation). Non-enhanced: strip.
    const useEnhanced = target.enhancedSkills && (isAgent || promoted || isSkill);
    const translatedFrontmatter = useEnhanced ? translateFrontmatter(frontmatter, target) : frontmatter;
    const outputFrontmatter = useEnhanced ? translatedFrontmatter : stripEnhancedFields(frontmatter);

    if (isCommand) {
      if (target.format === 'toml') {
        const description = frontmatter.description || 'APM command';
        finalContent = `description = "${description}"\n\nprompt = """\n${processedBody}\n"""\n`;
      } else {
        finalContent = processedFull;
      }
      outputPath = path.join(commandsDir, `${basename}${ext}`);
    } else if (isAgent || promoted) {
      // Agents (and promoted skills): flat files in agents directory
      finalContent = useEnhanced
        ? rebuildWithFrontmatter(translatedFrontmatter, processedBody)
        : rebuildWithFrontmatter(outputFrontmatter, processedBody);
      const agentExt = target.id === 'copilot' ? '.agent.md' : '.md';
      const agentBasename = promoted ? skillName : basename;
      outputPath = path.join(agentsDir, `${agentBasename}${agentExt}`);
      if (promoted) {
        logger.info(`Promoted skill ${skillName} to agent for ${target.name}`);
      }
    } else {
      // Skills: directory-based structure (skills/<skill-name>/SKILL.md + optional files)
      finalContent = useEnhanced
        ? rebuildWithFrontmatter(translatedFrontmatter, processedBody)
        : rebuildWithFrontmatter(outputFrontmatter, processedBody);
      const relativePath = path.relative(sourceDir, templatePath);
      const pathParts = relativePath.split(path.sep);
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

  // Collect commands replaced by enhanced skills for this target
  const replacedCommands = await collectReplacedCommands(templateFiles, sourceDir, target);

  // Process all templates
  for (const templatePath of templateFiles) {
    // Skip commands that are replaced by enhanced skills on this target
    if (isCommandTemplate(templatePath, sourceDir) && replacedCommands.size > 0) {
      const content = await fs.readFile(templatePath, 'utf8');
      const { frontmatter } = parseFrontmatter(content);
      if (replacedCommands.has(frontmatter.command_name)) {
        logger.info(`Skipped command: ${path.basename(templatePath)} (replaced by skill on ${target.name})`);
        continue;
      }
    }

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
