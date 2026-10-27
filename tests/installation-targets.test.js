import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { resolveUpdateTargets } from '../src/core/assistants.js';
import { validateReleaseManifest } from '../src/schemas/release.js';
import { initCommand } from '../src/commands/init.js';
import { addCommand } from '../src/commands/add.js';
import { removeCommand } from '../src/commands/remove.js';
import { updateCommand } from '../src/commands/update.js';
import { archiveCommand } from '../src/commands/archive.js';
import { statusCommand } from '../src/commands/status.js';

// Build first: VERSION=1.1.0-test-5 npm run build
const dist = process.env.APM_TEST_DIST || fileURLToPath(new URL('../dist/', import.meta.url));
const manifest = await fs.readJson(path.join(dist, 'apm-release.json'));
const oldIds = ['claude', 'codex', 'cursor', 'copilot', 'antigravity', 'opencode'];
const oldRelease = { tag_name: 'v1.0.3', published_at: '2026-10-15T00:00:00Z', assets: [] };
const newRelease = {
  tag_name: 'v1.1.0', published_at: '2026-10-27T00:00:00Z',
  assets: ['apm-release.json', 'agents.zip', 'claude.zip'].map(name => ({ name, browser_download_url: `https://fixtures.invalid/${name}` }))
};

test('target migration declarations preserve exact IDs and custom releases', () => {
  assert.equal(validateReleaseManifest(manifest).valid, true);
  assert.deepEqual(manifest.assistants.map(a => a.id), ['agents', 'claude']);
  assert.deepEqual(resolveUpdateTargets(['codex', 'opencode', 'claude'], manifest).ids, ['agents', 'claude']);
  const custom = { version: '1.0.0', assistants: [{ id: 'codex', name: 'Custom', bundle: 'custom.zip' }] };
  assert.deepEqual(resolveUpdateTargets(['codex'], custom), { ids: ['codex'], dropped: [], migrations: [] });
  assert.deepEqual(resolveUpdateTargets(['codex'], { assistants: [...manifest.assistants, ...custom.assistants] }).ids, ['codex']);
  assert.deepEqual(resolveUpdateTargets(['unknown'], manifest).dropped, ['unknown']);
  assert.equal(validateReleaseManifest({ ...manifest, assistants: [{ ...manifest.assistants[0], replaces: 'codex' }] }).valid, false);
  assert.equal(validateReleaseManifest({ ...manifest, assistants: manifest.assistants.map(a => ({ ...a, replaces: ['codex'] })) }).valid, false);
});

test('real bundles: install, add/remove in both orders, archive, and all 63 legacy combinations', async t => {
  const originalCwd = process.cwd();
  const originalAdapter = axios.defaults.adapter;
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'apm-targets-'));
  const downloads = [];
  const output = [];
  const logMock = t.mock.method(console, 'log', (...args) => output.push(args.join(' ')));
  axios.defaults.adapter = async config => {
    let data;
    if (config.url.startsWith('/repos/')) data = config.url.includes('/tags/') ? newRelease : [newRelease, oldRelease];
    else {
      const name = new URL(config.url).pathname.slice(1);
      assert.ok(newRelease.assets.some(a => a.name === name), `Unexpected download: ${config.url}`);
      downloads.push(name);
      data = name === 'apm-release.json' ? Buffer.from(JSON.stringify(manifest)) : await fs.readFile(path.join(dist, name));
    }
    return { data, status: 200, statusText: 'OK', headers: {}, config };
  };
  const metadata = () => fs.readJson('.apm/metadata.json');
  try {
    for (const first of ['agents', 'claude']) {
      const other = first === 'agents' ? 'claude' : 'agents';
      const dir = path.join(temp, `fresh-${first}`);
      await fs.ensureDir(dir); process.chdir(dir);
      await initCommand({ tag: newRelease.tag_name, assistant: [first, first] });
      assert.deepEqual((await metadata()).assistants, [first]);
      await fs.writeFile('.apm/spec.md', 'user planning content');
      await addCommand({ assistant: [other, other] });
      assert.equal(await fs.readFile('.apm/spec.md', 'utf8'), 'user planning content');
      assert.deepEqual((await metadata()).assistants, [first, other]);
      await removeCommand({ assistant: [first], force: true });
      assert.equal(await fs.pathExists('.agents/apm-guides/context-gathering.md'), true);
      const skillRoot = other === 'claude' ? '.claude' : '.agents';
      assert.equal(await fs.pathExists(`${skillRoot}/skills/apm-1-initiate-planner/SKILL.md`), true);
      await statusCommand();
      await addCommand({ assistant: [first] });
      await archiveCommand({ force: true, name: 'completed' });
      assert.equal(await fs.pathExists('.apm/metadata.json'), false);
      assert.equal(await fs.readFile('.apm/archives/completed/spec.md', 'utf8'), 'user planning content');
      assert.equal(await fs.pathExists('.agents/skills/apm-1-initiate-planner/SKILL.md'), false);
      assert.equal(await fs.pathExists('.claude/skills/apm-1-initiate-planner/SKILL.md'), false);
    }
    const missingDir = path.join(temp, 'missing-bundle');
    await fs.ensureDir(missingDir); process.chdir(missingDir);
    const before = { source: 'official', repository: 'sdi2200262/agentic-project-management',
      releaseVersion: oldRelease.tag_name, assistants: ['codex'], installedFiles: { codex: ['.codex/keep.md'] } };
    await fs.outputJson('.apm/metadata.json', before);
    await fs.outputFile('.codex/keep.md', 'unchanged');
    const completeAssets = newRelease.assets;
    newRelease.assets = completeAssets.filter(a => a.name !== 'agents.zip');
    try {
      await assert.rejects(updateCommand({ force: true }), /Bundle agents.zip not found/);
      assert.deepEqual(await metadata(), before);
      assert.equal(await fs.readFile('.codex/keep.md', 'utf8'), 'unchanged');
      assert.equal(await fs.pathExists('.apm/archives'), false);
    } finally { newRelease.assets = completeAssets; }
    for (let mask = 1; mask < 64; mask++) {
      const ids = oldIds.filter((_, i) => mask & (1 << i));
      const dir = path.join(temp, `legacy-${mask}`);
      await fs.ensureDir(dir); process.chdir(dir);
      const installedFiles = { _apm: ['.apm/spec.md'] };
      for (const id of ids) {
        const filename = `.${id}/old-apm.md`;
        await fs.outputFile(filename, id);
        installedFiles[id] = [filename];
      }
      await fs.outputFile('.apm/spec.md', `original ${mask}`);
      await fs.outputFile('.agents/memory/preserved.md', 'outside APM installation');
      await fs.outputJson('.apm/metadata.json', {
        source: 'official', repository: 'sdi2200262/agentic-project-management',
        releaseVersion: oldRelease.tag_name, cliVersion: '1.0.2', assistants: ids, installedFiles
      });
      downloads.length = 0;
      await updateCommand({ force: true, name: 'before-update' });
      const result = await metadata();
      const expected = [...new Set(ids.map(id => id === 'claude' ? 'claude' : 'agents'))];
      assert.deepEqual(result.assistants, expected, `Legacy combination ${ids}`);
      assert.deepEqual(Object.keys(result.installedFiles).sort(), ['_apm', ...expected].sort());
      assert.equal(downloads.filter(n => n === 'agents.zip').length, expected.includes('agents') ? 1 : 0);
      for (const id of ids) assert.equal(await fs.pathExists(`.${id}/old-apm.md`), false);
      assert.equal(await fs.readFile('.agents/memory/preserved.md', 'utf8'), 'outside APM installation');
      assert.equal(await fs.readFile('.apm/archives/before-update/spec.md', 'utf8'), `original ${mask}`);
      const archived = await fs.readJson('.apm/archives/before-update/metadata.json');
      assert.deepEqual(archived.assistants, ids);
      await removeCommand({ assistant: expected, force: true });
      assert.equal(await fs.pathExists('.agents/apm-guides/context-gathering.md'), false);
      assert.equal(await fs.readFile('.agents/memory/preserved.md', 'utf8'), 'outside APM installation');
    }
    assert.ok(output.some(line => line.includes('Installation targets')));
    assert.ok(output.some(line => line.includes('Consolidated')));
    assert.ok(!process.exitCode);
  } finally {
    process.chdir(originalCwd);
    axios.defaults.adapter = originalAdapter;
    logMock.mock.restore();
    await fs.remove(temp);
  }
});
