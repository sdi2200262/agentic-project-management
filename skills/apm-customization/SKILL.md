---
name: apm-customization
description: Guide changes to an APM source repository, including templates, builds and custom releases.
---

# APM Customisation

Use this skill when editing a fork or template of the APM repository. Read the relevant source and authoring standards, propose the changes, and implement the User's approved scope. Editing a session's Spec, Plan or Rules follows that session's workflow.

## 1. Source Layout

| Path | Content |
|---|---|
| `templates/skills/` | Command skills (`apm-N-…`), shared skills and support files |
| `templates/guides/` | Procedures, followed by their artifact formats |
| `templates/apm/` | Initial Spec, Plan, Tracker and Memory Index |
| `templates/_standards/` | Workflow, terminology, structure and writing standards |
| `build/` | Template processing, target configuration, ZIPs and manifest generation |
| `src/` | CLI |
| `skills/` | Standalone skills |

A fork retains history for upstream merges. **Use this template** starts a repository with a clean history.

## 2. Template Changes

For behavior changes, update `templates/_standards/WORKFLOW.md` first, then the affected skills, guides, formats and examples. Wording-only edits can go directly in runtime files. Follow `TERMINOLOGY.md`, `STRUCTURE.md` and `WRITING.md`.

Command skills have `name`, `description` and `disable-model-invocation: true` frontmatter. Shared skills have `name` and `description`; guides have no frontmatter. When adding a file, update the reading instructions and references that lead to it.

Describe assistant actions in plain English. Each target installs its own skills and guides: `agents` under `.agents/`, `claude` under `.claude/`. Rules live in workspace-root `AGENTS.md`; the Planner adds an import to an existing workspace `CLAUDE.md` for Claude Code.

Use the placeholders defined in `build/processors/placeholders.js`:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template release version |
| `{SKILL_PATH:name}` | Target path to `skills/<name>/SKILL.md` |
| `{SKILL_DIR:name}` | Target skill directory |
| `{GUIDE_PATH:name}` | Target path to `apm-guides/<name>.md` |
| `{CLAUDE_ONLY:text}` | Text kept in the Claude target |

`build/build-config.json` defines target directories. Reuse `agents` for assistants that read `.agents/skills/` and `AGENTS.md`; add a target for a different layout. A target's optional `replaces` list maps installed IDs to it during update. Exact IDs take precedence.

## 3. Build and Check

```bash
npm ci
VERSION=1.1.0 npm run build:release
```

Use the intended template version. Inspect the ZIPs and `apm-release.json` in `dist/`: check paths, frontmatter, resolved placeholders and cross-references. Test changed instructions with an assistant in a separate project. For CLI changes, exercise the affected commands and inspect a local `npm pack` package.

## 4. Release

1. Obtain the User's release approval.
2. Build and validate the intended version.
3. Create a new version tag and GitHub Release.
4. Attach the template ZIPs and `apm-release.json` from `dist/`.

CLI changes use a separate npm release. See `VERSIONING.md` for version rules. Adapt the repository's GitHub workflows before using them for custom releases.

Users install a custom release with:

```bash
apm custom -r owner/repo
```

Custom installation offers the repository's releases; updates use the same repository. Private sources require `GITHUB_TOKEN` or authentication through `gh`.

## 5. Documentation

Describe the custom behavior and usage in the README. Document workflow differences, new skills and any bundled files outside the standard APM directories. See `SECURITY.md` for bundle risks and the [Customisation Guide](https://agentic-project-management.dev/docs/customisation-guide) for the user walkthrough.
