/**
 * APM Build Script - Unit Tests (Vitest)
 *
 * Validates core functions in scripts/build.js.
 * 
 * Focus: basic behaviors and edge cases using temporary fixtures.
 *
 * Note:  Tests assume POSIX "/" paths in assertions and will fail on Windows.
 *        For cross-platform runs, normalize paths in assertions or construct expected values with path.join.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// Functions under test
import {
  loadConfig,
  findMdFiles,
  parseFrontmatter,
  replacePlaceholders,
  createZipArchive,
  build,
} from '../build.js';

// Resolve paths relative to this file; avoid relying on CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const TMP_ROOT = path.join(PROJECT_ROOT, 'scripts', 'tests', '.tmp');

/**
 * Utilities for temp directories and sandboxed CWD changes
 */
async function resetTmpRoot() {
  await fs.remove(TMP_ROOT);
  await fs.ensureDir(TMP_ROOT);
}

async function withTempDir(name, fn) {
  const dir = await fs.mkdtemp(path.join(TMP_ROOT, `${name}-`));
  const oldCwd = process.cwd();
  try {
    await fn(dir, oldCwd);
  } finally {
    process.chdir(oldCwd);
    await fs.remove(dir);
  }
}

beforeAll(async () => {
  console.log('\nAPM Build Script - Unit Tests');
  console.log('Project root:', PROJECT_ROOT);
  await resetTmpRoot();
});

afterAll(async () => {
  await fs.remove(TMP_ROOT);
});

// ---------------------------------------------------------------------------
describe('loadConfig()', () => {
  it('throws when build-config.json is missing', async () => {
    await withTempDir('no-config', async (dir) => {
      process.chdir(dir);
      await expect(loadConfig()).rejects.toThrow(/build-config\.json not found/);
    });
  });

  it('loads valid JSON config', async () => {
    await withTempDir('valid-config', async (dir) => {
      const cfg = {
        build: { sourceDir: 'templates', outputDir: 'out', cleanOutput: true },
        targets: [],
      };
      await fs.writeFile(path.join(dir, 'build-config.json'), JSON.stringify(cfg), 'utf8');
      process.chdir(dir);
      const result = await loadConfig();
      expect(result.build.sourceDir).toBe('templates');
      expect(result.build.cleanOutput).toBe(true);
      expect(Array.isArray(result.targets)).toBe(true);
    });
  });

  it('throws on invalid JSON', async () => {
    await withTempDir('invalid-config', async (dir) => {
      await fs.writeFile(path.join(dir, 'build-config.json'), '{ "bad": true, }', 'utf8');
      process.chdir(dir);
      await expect(loadConfig()).rejects.toBeInstanceOf(Error);
    });
  });
});

// ---------------------------------------------------------------------------
describe('findMdFiles()', () => {
  it('finds .md files recursively and excludes README.md', async () => {
    await withTempDir('find-md', async (dir) => {
      const src = path.join(dir, 'src');
      await fs.ensureDir(path.join(src, 'nested'));
      await fs.writeFile(path.join(src, 'a.md'), '# A');
      await fs.writeFile(path.join(src, 'README.md'), '# Readme');
      await fs.writeFile(path.join(src, 'a.txt'), 'text');
      await fs.writeFile(path.join(src, 'nested', 'b.md'), '# B');
      await fs.writeFile(path.join(src, 'nested', 'README.md'), '# Nested Readme');

      const mdFiles = await findMdFiles(src);
      const rel = mdFiles.map((p) => path.relative(src, p)).sort();
      expect(rel).toEqual(['a.md', path.join('nested', 'b.md')].sort());
    });
  });
});

// ---------------------------------------------------------------------------
describe('parseFrontmatter()', () => {
  it('returns empty frontmatter when none present', () => {
    const { frontmatter, content } = parseFrontmatter('Just text');
    expect(frontmatter).toEqual({});
    expect(content).toBe('Just text');
  });

  it('parses valid YAML frontmatter', () => {
    const input = ['---', 'a: 1', 'b: test', '---', 'Body content'].join('\n');
    const { frontmatter, content } = parseFrontmatter(input);
    expect(frontmatter.a).toBe(1);
    expect(frontmatter.b).toBe('test');
    expect(content).toBe('Body content');
  });

  it('handles malformed YAML frontmatter gracefully', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const input = ['---', 'a: [1, 2', '---', 'Body'].join('\n');
      const { frontmatter, content } = parseFrontmatter(input);
      expect(frontmatter).toEqual({});
      expect(content).toBe('Body');
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it('treats missing closing fence as no frontmatter', () => {
    const input = ['---', 'a: 1', 'Body'].join('\n');
    const { frontmatter, content } = parseFrontmatter(input);
    expect(frontmatter).toEqual({});
    expect(content).toBe(input);
  });
});

// ---------------------------------------------------------------------------
describe('replacePlaceholders()', () => {
  it('replaces version, timestamp, paths and args (markdown)', () => {
    const template = [
      'Version: {VERSION}',
      'Time: {TIMESTAMP}',
      'Guide: {GUIDE_PATH:guide.md}',
      'Cmd: {COMMAND_PATH:cmd.md}',
      'Args: {ARGS}',
    ].join('\n');

    const out = replacePlaceholders(template, '1.2.3', { guides: '/g', commands: '/c' }, 'markdown');

    expect(out).toMatch(/Version: 1\.2\.3/);
    expect(out.includes('{TIMESTAMP}')).toBe(false);
    expect(out).toMatch(/Guide: \/g\/(guide\.md|guide\.md)/);
    expect(out).toMatch(/Cmd: \/c\/(cmd\.md|cmd\.md)/);
    expect(out).toMatch(/Args: \$ARGUMENTS/);
  });

  it('replaces version, timestamp, paths and args (toml)', () => {
    const template = 'Args: {ARGS}\nGuide: {GUIDE_PATH:guide.md}\n';
    const out = replacePlaceholders(template, '9.9.9', { guides: '/G', commands: '/C' }, 'toml');
    expect(out).toMatch(/Args: \{\{args\}\}/);
    expect(out).toMatch(/Guide: \/G\/(guide\.md|guide\.md)/);
  });
});

// ---------------------------------------------------------------------------
describe('createZipArchive()', () => {
  it('creates a valid ZIP archive from a directory', async () => {
    await withTempDir('zip-create', async (dir) => {
      const sourceDir = path.join(dir, 'source');
      const zipPath = path.join(dir, 'output.zip');

      // Create test files
      await fs.ensureDir(path.join(sourceDir, 'subdir'));
      await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'content1', 'utf8');
      await fs.writeFile(path.join(sourceDir, 'subdir', 'file2.txt'), 'content2', 'utf8');

      // Create archive
      await createZipArchive(sourceDir, zipPath);

      // Verify ZIP was created
      expect(await fs.pathExists(zipPath)).toBe(true);

      // Verify ZIP contents
      const zip = new AdmZip(zipPath);
      const entries = zip.getEntries();
      expect(entries.length).toBe(3); // 1 dir + 2 files

      const file1Entry = zip.getEntry('file1.txt');
      expect(file1Entry).toBeTruthy();
      expect(file1Entry.getData().toString('utf8')).toBe('content1');

      const file2Entry = zip.getEntry('subdir/file2.txt');
      expect(file2Entry).toBeTruthy();
      expect(file2Entry.getData().toString('utf8')).toBe('content2');
    });
  });

  it('creates an empty ZIP when source directory does not exist', async () => {
    await withTempDir('zip-empty', async (dir) => {
      const nonExistentDir = path.join(dir, 'does-not-exist');
      const zipPath = path.join(dir, 'output.zip');

      // archiver doesn't throw for non-existent dirs, it creates empty ZIP
      await createZipArchive(nonExistentDir, zipPath);
      
      expect(await fs.pathExists(zipPath)).toBe(true);
      const zip = new AdmZip(zipPath);
      expect(zip.getEntries().length).toBe(0);
    });
  });
});

// ---------------------------------------------------------------------------
describe('build()', () => {
  it('generates command and guide outputs for both markdown and toml targets', async () => {
    await withTempDir('build-run', async (dir) => {
      const sourceDir = path.join(dir, 'templates');
      const outDir = path.join(dir, 'out');
      await fs.ensureDir(path.join(sourceDir, 'commands'));

      // Guide template (no frontmatter)
      const guideTemplate = [
        '# Guide Title',
        'This is a guide for {VERSION}.',
        'Args echo: {ARGS}',
      ].join('\n');
      await fs.writeFile(path.join(sourceDir, 'Guide.md'), guideTemplate, 'utf8');

      // Command template (with frontmatter)
      const commandTemplate = [
        '---',
        'description: "Example command"',
        'command_name: "run"',
        'priority: "low"',
        '---',
        'Body with placeholders:',
        ' - {ARGS}',
        ' - {GUIDE_PATH:Guide.md}',
        ' - {COMMAND_PATH:Example.md}',
      ].join('\n');
      await fs.writeFile(path.join(sourceDir, 'commands', 'Example.md'), commandTemplate, 'utf8');

      const cfg = {
        build: { sourceDir: sourceDir, outputDir: outDir, cleanOutput: true },
        targets: [
          {
            id: 'copilot',
            name: 'GitHub Copilot',
            bundleName: 'apm-copilot.zip',
            format: 'markdown',
            directories: { guides: '.github/prompts', commands: '.github/prompts' },
          },
          {
            id: 'gemini',
            name: 'Gemini CLI',
            bundleName: 'apm-gemini.zip',
            format: 'toml',
            directories: { guides: '.gemini/guides', commands: '.gemini/commands' },
          },
        ],
      };

      // Provide a minimal package.json for version resolution path in build()
      await fs.writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify({ name: 'tmp', version: '0.0.0' }),
        'utf8'
      );

      await build(cfg, '0.5.0-test');

      // Validate Copilot (markdown) - check ZIP file
      const copilotZip = path.join(outDir, 'apm-copilot.zip');
      expect(await fs.pathExists(copilotZip)).toBe(true);

      // Verify ZIP contents
      const copilotZipFile = new AdmZip(copilotZip);
      const copilotEntries = copilotZipFile.getEntries();
      
      const copilotCmdEntry = copilotEntries.find(e => e.entryName === 'commands/apm-low-run.md');
      expect(copilotCmdEntry).toBeTruthy();
      const copilotCmdContent = copilotCmdEntry.getData().toString('utf8');
      expect(copilotCmdContent.includes('$ARGUMENTS')).toBe(true);
      expect(copilotCmdContent.includes('.github/prompts')).toBe(true);

      const copilotGuideEntry = copilotEntries.find(e => e.entryName === 'guides/Guide.md');
      expect(copilotGuideEntry).toBeTruthy();
      const copilotGuideContent = copilotGuideEntry.getData().toString('utf8');
      expect(copilotGuideContent.includes('$ARGUMENTS')).toBe(true);
      expect(copilotGuideContent.includes('0.5.0-test')).toBe(true);

      // Verify temporary build directory was cleaned up
      const copilotBuildDir = path.join(outDir, 'copilot-build');
      expect(await fs.pathExists(copilotBuildDir)).toBe(false);

      // Validate Gemini (toml) - check ZIP file
      const geminiZip = path.join(outDir, 'apm-gemini.zip');
      expect(await fs.pathExists(geminiZip)).toBe(true);

      // Verify ZIP contents
      const geminiZipFile = new AdmZip(geminiZip);
      const geminiEntries = geminiZipFile.getEntries();

      const geminiCmdEntry = geminiEntries.find(e => e.entryName === 'commands/apm-low-run.toml');
      expect(geminiCmdEntry).toBeTruthy();
      const geminiCmdContent = geminiCmdEntry.getData().toString('utf8');
      expect(geminiCmdContent.startsWith('description = "Example command"')).toBe(true);
      expect(/prompt\s*=\s*"""[\s\S]*"""/m.test(geminiCmdContent)).toBe(true);
      expect(geminiCmdContent.includes('description:')).toBe(false);
      expect(geminiCmdContent.includes('{{args}}')).toBe(true);
      expect(geminiCmdContent.includes('.gemini/guides')).toBe(true);

      const geminiGuideEntry = geminiEntries.find(e => e.entryName === 'guides/Guide.md');
      expect(geminiGuideEntry).toBeTruthy();

      // Verify temporary build directory was cleaned up
      const geminiBuildDir = path.join(outDir, 'gemini-build');
      expect(await fs.pathExists(geminiBuildDir)).toBe(false);

      // Clean up out dir
      await fs.remove(outDir);
    });
  });

  it('treats frontmatter without command_name as a guide', async () => {
    await withTempDir('build-guide-fm', async (dir) => {
      const sourceDir = path.join(dir, 'templates');
      const outDir = path.join(dir, 'out');
      await fs.ensureDir(path.join(sourceDir, 'commands'));

      const template = [
        '---',
        'description: "Has frontmatter but no command_name"',
        '---',
        'Content here',
      ].join('\n');
      await fs.writeFile(path.join(sourceDir, 'SomeGuide.md'), template, 'utf8');

      const cfg = {
        build: { sourceDir, outputDir: outDir, cleanOutput: true },
        targets: [
          { id: 'copilot', name: 'GitHub Copilot', bundleName: 'apm-copilot.zip', format: 'markdown', directories: { guides: '.github/prompts', commands: '.github/prompts' } },
        ],
      };

      await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: 'tmp', version: '1.0.0' }), 'utf8');
      await build(cfg, '1.2.3');

      // Check ZIP file was created
      const zipPath = path.join(outDir, 'apm-copilot.zip');
      expect(await fs.pathExists(zipPath)).toBe(true);

      // Verify ZIP contents
      const zip = new AdmZip(zipPath);
      const guideEntry = zip.getEntry('guides/SomeGuide.md');
      expect(guideEntry).toBeTruthy();
      const guideContent = guideEntry.getData().toString('utf8');
      expect(guideContent.includes('Content here')).toBe(true);

      // Verify temp directory was cleaned up
      const buildDir = path.join(outDir, 'copilot-build');
      expect(await fs.pathExists(buildDir)).toBe(false);

      await fs.remove(outDir);
    });
  });

  it('respects cleanOutput: false by not clearing existing files', async () => {
    await withTempDir('build-no-clean', async (dir) => {
      const sourceDir = path.join(dir, 'templates');
      const outDir = path.join(dir, 'out');
      await fs.ensureDir(sourceDir);

      // Create a dummy existing file
      const existingFile = path.join(outDir, 'existing.txt');
      await fs.ensureDir(outDir);
      await fs.writeFile(existingFile, 'existing content', 'utf8');

      const guideTemplate = '# Guide\nContent';
      await fs.writeFile(path.join(sourceDir, 'Guide.md'), guideTemplate, 'utf8');

      const cfg = {
        build: { sourceDir, outputDir: outDir, cleanOutput: false },
        targets: [
          { id: 'copilot', name: 'GitHub Copilot', bundleName: 'apm-copilot.zip', format: 'markdown', directories: { guides: '.', commands: '.' } },
        ],
      };

      await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: 'tmp', version: '1.0.0' }), 'utf8');
      await build(cfg, '1.2.3');

      // Check existing file still exists
      expect(await fs.pathExists(existingFile)).toBe(true);
      expect(await fs.readFile(existingFile, 'utf8')).toBe('existing content');

      // Check ZIP file was created
      const zipPath = path.join(outDir, 'apm-copilot.zip');
      expect(await fs.pathExists(zipPath)).toBe(true);

      // Verify ZIP contains the guide
      const zip = new AdmZip(zipPath);
      const guideEntry = zip.getEntry('guides/Guide.md');
      expect(guideEntry).toBeTruthy();

      // Verify temp directory was cleaned up
      const buildDir = path.join(outDir, 'copilot-build');
      expect(await fs.pathExists(buildDir)).toBe(false);

      await fs.remove(outDir);
    });
  });

  it('defaults priority to "default" when missing and sanitizes command_name', async () => {
    await withTempDir('build-missing-priority', async (dir) => {
      const sourceDir = path.join(dir, 'templates');
      const outDir = path.join(dir, 'out');
      await fs.ensureDir(path.join(sourceDir, 'commands'));

      const template = [
        '---',
        'command_name: "run task"',
        'description: "Test command"',
        '---',
        'Body content',
      ].join('\n');
      await fs.writeFile(path.join(sourceDir, 'commands', 'Test.md'), template, 'utf8');

      const cfg = {
        build: { sourceDir, outputDir: outDir, cleanOutput: true },
        targets: [
          { id: 'copilot', name: 'GitHub Copilot', bundleName: 'apm-copilot.zip', format: 'markdown', directories: { guides: '.github/prompts', commands: '.github/prompts' } },
        ],
      };

      await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: 'tmp', version: '1.0.0' }), 'utf8');
      await build(cfg, '1.2.3');

      // Check ZIP file was created
      const zipPath = path.join(outDir, 'apm-copilot.zip');
      expect(await fs.pathExists(zipPath)).toBe(true);

      // Verify ZIP contents
      const zip = new AdmZip(zipPath);
      const cmdEntry = zip.getEntry('commands/apm-default-run-task.md');
      expect(cmdEntry).toBeTruthy();
      const cmdContent = cmdEntry.getData().toString('utf8');
      expect(cmdContent.includes('Body content')).toBe(true);

      // Verify temp directory was cleaned up
      const buildDir = path.join(outDir, 'copilot-build');
      expect(await fs.pathExists(buildDir)).toBe(false);

      await fs.remove(outDir);
    });
  });
});

