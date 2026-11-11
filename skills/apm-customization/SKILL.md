---
name: apm-customization
description: Guide changes to an APM source repository, including templates, builds and custom releases.
---

# APM Customisation

Use this skill when editing a fork or template of the APM repository. Read the relevant source and authoring standards, propose the changes, and implement the User's approved scope. Editing a session's Spec, Plan or workspace guidance follows that session's workflow.

## 1. Source Layout

| Path | Content |
|---|---|
| `templates/skills/` | Command skills (`apm-N-…`), shared skills and support files |
| `templates/entrypoints/apm/SKILL.md` | Entry for the single-skill research preview |
| `templates/guides/` | Procedures, followed by their artifact formats |
| `templates/apm/` | Initial Spec, Plan, Tracker and Memory Index |
| `templates/_standards/` | Workflow, terminology, structure and writing standards |
| `build/` | Template processing, target configuration, ZIPs and manifest generation |
| `src/` | CLI |
| `skills/` | Standalone skills |

A fork retains history for upstream merges. **Use this template** starts a repository with a clean history.

## 2. Template Changes

For behavior changes, update `templates/_standards/WORKFLOW.md` first, then the affected skills, guides, formats and examples. Wording-only edits can go directly in runtime files. Follow `TERMINOLOGY.md`, `STRUCTURE.md` and `WRITING.md`.

Command skills have `name`, `description` and `disable-model-invocation: true` frontmatter. Shared skills and the single-skill entry have `name` and `description`; guides have no frontmatter. When adding a file, update the reading instructions and references that lead to it.

Describe assistant actions in plain English. All targets share the workflow sources and initial `.apm/` artifacts. Lasting workspace guidance lives in `AGENTS.md`; for Claude Code, the Planner adds an import to an existing workspace `CLAUDE.md` or `.claude/CLAUDE.md`.

`build/build-config.json` gives each target an `assistant` (`agents` or `claude`) and a `format` (`multi-skill` or `single-skill`). `assistant` controls Claude-specific text; `format` and the configured directories control layout.

- `agents` and `claude` install numbered and shared skills under `.agents/skills/` or `.claude/skills/`, with guides under the corresponding `apm-guides/` directory.
- `agents-single-skill` and `claude-single-skill` install one `skills/apm/SKILL.md`, with role, guide and communication references beneath `skills/apm/`.

`build/processors/paths.js` maps shared sources to both layouts. The build strips skill frontmatter from reference documents without rewriting prose. Keep the single-skill entry explanatory and navigational, and keep the workflow in one source tree. When adding a shared skill, extend its single-skill mapping.

Use the placeholders defined in `build/processors/placeholders.js`:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template release version |
| `{SKILL_PATH:name}` | Source skill mapped to its output skill, role or procedure file |
| `{SKILL_DIR:name}` | Directory containing that mapped file, for support references |
| `{GUIDE_PATH:name}` | `<configured guides directory>/<name>.md` |
| `{CLAUDE_ONLY:text}` | Text kept for both Claude formats |

### Release Manifest

The build generates `apm-release.json` from `build/build-config.json` and validates it with `src/schemas/release.js`. Each target becomes an `assistants` entry with `id`, `name` and `bundle`.

Optional target fields define installation behavior:

- `postInstallNote`: startup guidance shown after installation. For a preview target, say it is a research preview and give its entry action. Without a note, the CLI shows generic guidance.
- `replaces`: historical installed IDs that map to this target during update. Exact current IDs take precedence, and each historical ID may appear in only one target's list.
- `conflictsWith`: current target IDs that cannot be installed alongside this target. A declaration on either side forbids the pair, and conflicts are not transitive. Entries must be unique, nonblank, current IDs other than the target's own.

Any nonempty `conflictsWith` requires a stable `minCliVersion` of at least `1.0.4`. The official targets forbid two formats for the same `assistant`. Single-skill targets have no `replaces` migration.

During updates, the CLI applies `replaces`, then checks the resulting target set for conflicts before downloading or changing files. A conflict rejects the request, even with `--force`. Do not add the obsolete `configDir` field: older CLIs that ignore `minCliVersion` could otherwise accept a release whose conflicts they cannot enforce.

## 3. Build and Check

Replace `<version>` with the intended template version:

```bash
npm ci
VERSION='<version>' npm run build:release
```

Inspect every target ZIP and `apm-release.json` in `dist/`: check paths, frontmatter, resolved placeholders, cross-references, startup notes and conflicts. Each single-skill bundle contains exactly one `SKILL.md`. Test changed instructions with an assistant in a separate project. For CLI changes, exercise the affected commands and inspect a local `npm pack` package.

## 4. Release

1. Obtain the User's release approval.
2. Build and validate the intended version.
3. Create a new version tag and GitHub Release.
4. Attach the template ZIPs and `apm-release.json` from `dist/`.

CLI changes use a separate npm release. See the Releases section of `CONTRIBUTING.md` for version rules. Adapt the repository's GitHub workflows before using them for custom releases.

Users install a custom release with:

```bash
apm custom -r owner/repo
```

Custom installation offers the repository's releases; updates use the same repository. Private sources require `GITHUB_TOKEN` or authentication through `gh`.

## 5. Documentation

Describe the custom behavior and usage in the README. Document workflow differences, new skills and any bundled files outside the standard APM directories. See `SECURITY.md` for bundle risks and the [Customisation Guide](https://agentic-project-management.dev/docs/customisation-guide) for the user walkthrough.
