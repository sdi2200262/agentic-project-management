/** Maps shared template sources and references to each target's output layout. */

import path from 'path';

const singleSkillFiles = {
  'apm-1-initiate-planner': 'roles/planner.md',
  'apm-2-initiate-manager': 'roles/manager.md',
  'apm-3-initiate-worker': 'roles/worker.md',
  'apm-6-handoff-manager': 'guides/handoff-manager.md',
  'apm-7-handoff-worker': 'guides/handoff-worker.md',
  'apm-8-summarize-session': 'guides/summarize-session.md',
  'apm-9-recover': 'guides/recover.md',
  'apm-communication': 'communication/communication.md'
};

const receiptCommands = new Set(['apm-4-check-tasks', 'apm-5-check-reports']);

export function isSingleSkill(target) {
  return target.format === 'single-skill';
}

export function skillPath(target, name) {
  if (!isSingleSkill(target)) {
    return path.posix.join(target.directories.skills, name, 'SKILL.md');
  }
  const file = singleSkillFiles[name];
  if (!file) throw new Error(`No single-skill reference mapping for "${name}"`);
  return path.posix.join(target.directories.skills, 'apm', file);
}

export function skillDirectory(target, name) {
  return path.posix.dirname(skillPath(target, name));
}

export function guidePath(target, name) {
  return path.posix.join(target.directories.guides, `${name}.md`);
}

/** Returns a bundle-relative path, or null for an entrypoint omitted from this format. */
export function templateOutputPath(target, relativePath) {
  const [kind, name, ...rest] = relativePath.split('/');
  if (relativePath === 'entrypoints/apm/SKILL.md') {
    return isSingleSkill(target) ? path.posix.join(target.directories.skills, 'apm/SKILL.md') : null;
  }
  if (kind === 'guides' && rest.length === 0 && name.endsWith('.md')) {
    return guidePath(target, name.slice(0, -3));
  }
  if (kind === 'skills' && rest.length > 0) {
    if (isSingleSkill(target) && receiptCommands.has(name)) return null;
    return rest.join('/') === 'SKILL.md'
      ? skillPath(target, name)
      : path.posix.join(skillDirectory(target, name), ...rest);
  }
  throw new Error(`No output mapping for "${relativePath}"`);
}
