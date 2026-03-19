---
name: apm-customization
description: Guides an AI agent through customizing APM templates, building releases, and managing a custom APM repository.
---

# APM Customization Skill

## 1. Overview

**Reading Agent:** Any AI assistant working within a forked or templated APM repository

This skill guides the customization of APM templates. It assumes the Agent is operating within the APM codebase itself (a fork or template of the official repository) and can explore the repository structure directly.

### 1.1 Objectives

- Navigate the APM repository structure and understand what each part does
- Make targeted changes to templates, commands, guides, skills, or agent configurations
- Build and test changes locally
- Produce releases that can be installed via `apm custom`

### 1.2 How to Use

The User describes what they want to change or add. The Agent explores the relevant parts of the repository, proposes changes, and implements them after User approval. This skill provides the orientation needed to find the right files and understand how they connect.

---

## 2. Repository Structure

Explore the repository to understand the layout. The key directories are:

**`templates/`** - The source files that become the APM installation. Everything the User receives when running `apm init` or `apm custom` originates here. Changes to APM's workflow, procedures, communication patterns, or agent behavior happen in this directory.

**`templates/commands/`** - Slash commands the User sends to the model. These are the entry points for each Agent role (Planner, Manager, Worker) and for workflow actions (check-tasks, check-reports, handoff, recover, summarize).

**`templates/guides/`** - Procedural files Agents read autonomously. Each guide contains a single procedure with operational standards, step-by-step actions, output specifications, and content guidelines. Guides are the most detailed procedural documents in the system.

**`templates/skills/`** - Shared capabilities read by multiple Agent roles. Each skill lives in its own directory with a `SKILL.md` file and optional supporting files.

**`templates/agents/`** - Subagent configurations shipped with APM bundles.

**`templates/apm/`** - Artifact templates that become the `.apm/` directory (Spec, Plan, Tracker, Memory Index templates).

**`templates/_standards/`** - Development-time specifications that define how templates should be written. These files are not included in builds. Read them to understand the design rules:
- `WORKFLOW.md` - The formal workflow specification. This is the source of truth for all behavior. Any change to APM's workflow must be reflected here first, then propagated to runtime files.
- `TERMINOLOGY.md` - Formal vocabulary and defined concepts
- `STRUCTURE.md` - Structural standards for each file type
- `WRITING.md` - Writing patterns, tone, formatting
- `ISSUES.md` - Known issues tracker for the official APM repository. Internal development doc, not relevant to custom repos unless the User has added their own entries.
- `NOTES.md` - Development notes and research findings for the official repository. Internal development doc, not relevant to custom repos unless the User has added their own entries.

**`build/`** - The build system that processes templates into platform-specific bundles. `build-config.json` defines the supported targets (assistants) and their directory layouts.

**`src/`** - The `agentic-pm` CLI source code. Changes here affect the CLI tool itself, not the templates.

**`skills/`** - Standalone skills (like this one) that are not part of the main APM bundles.

---

## 3. How Templates Become Installations

Templates use placeholders that the build system resolves per platform at build time. Understanding this is essential for making changes.

Explore `build/processors/placeholders.js` to see all supported placeholders. Common ones include:

- `{VERSION}` - Release version
- `{RULES_FILE}` - Platform-specific rules file name (e.g. `CLAUDE.md`, `AGENTS.md`)
- `{SKILL_PATH:name}` - Resolved path to a skill file
- `{GUIDE_PATH:name}` - Resolved path to a guide file
- `{COMMAND_PATH:name}` - Resolved path to a command file
- `{ARGS}` - Platform-specific argument syntax
- `{SUBAGENT_GUIDANCE}` - Platform-native subagent invocation

Explore `build/build-config.json` to see each target's directory layout, format (Markdown or TOML), and platform-specific values.

**Building locally:**

```bash
npm install
npm run build:release
```

This produces a `dist/` directory with ZIP bundles per assistant and an `apm-release.json` manifest. The User can test locally by extracting a bundle into a project.

---

## 4. Making Changes

When the User requests a change, identify which layer it affects. All workflow changes follow a top-down propagation:

1. **Update `WORKFLOW.md` first** - Any change that affects APM's behavior, procedures, or coordination patterns must be reflected in the workflow specification before modifying runtime files. `WORKFLOW.md` is the source of truth.
2. **Propagate to runtime files** - Commands, guides, skills, and agent configurations implement the workflow spec. Update these to match the changes made in `WORKFLOW.md`, following the conventions in `STRUCTURE.md`, `WRITING.md`, and `TERMINOLOGY.md`.

Changes that do not affect the workflow (e.g. adjusting wording within existing procedures, adding examples to guidance fields) can be made directly in runtime files without updating `WORKFLOW.md`.

### Template Content Changes

Most customizations involve modifying template files in `templates/`. The `_standards/` files define the conventions:

- Commands follow structural profiles defined in `STRUCTURE.md` (strict for initiation, lightweight for utility)
- Guides follow a five-section pattern (Overview, Operational Standards, Procedure, Structural Specifications, Content Guidelines)
- Skills have a required Overview section and free-form internal organization
- All files use the terminology defined in `TERMINOLOGY.md`
- Writing follows the patterns in `WRITING.md` (imperative mood, token efficiency, de-duplication)

Read the relevant `_standards/` file before making changes to understand the conventions in play.

### Adding New Files

When adding a new guide, skill, command, or agent:

1. Follow the structural conventions from `STRUCTURE.md` for that file type
2. Add YAML frontmatter where required (commands and skills require it, guides do not)
3. Use placeholders for any paths, rules file references, or platform-specific values
4. Update cross-references in other files if the new file should be loaded by an Agent

### Build Configuration Changes

If adding a new target (assistant), modify `build/build-config.json` to add the target definition with its directories, format, and platform-specific values. Explore existing targets as examples.

### CLI Changes

Changes to `src/` affect the CLI tool. These follow different conventions defined in `src/_standards/CLI.md` and require their own release cycle (npm publish, separate from template releases).

---

## 5. Releasing

After making changes, the User creates a release that can be installed via `apm custom`.

1. **Build** - Run `npm run build:release` to generate bundles in `dist/`
2. **Test** - Extract a bundle into a test project and verify the changes work
3. **Tag** - Create a git tag following the versioning convention
4. **Release** - Create a GitHub Release and attach all files from `dist/` (the ZIP bundles and `apm-release.json`)

The `apm-release.json` manifest is what the CLI reads to discover available assistants in the release. Explore `build/generators/manifest.js` to understand its structure.

Note: the `.github/workflows/` directory contains CI workflows configured for the official APM repository's release pipeline. These workflows are tailored to the official repo's versioning and publishing process. For custom repositories, the manual build-tag-release approach described above is more straightforward. The User can set up their own CI workflows if needed, but the official ones should not be assumed to work as-is in a fork.

Users install from the custom repository with:

```bash
apm custom -r owner/repo
```

---

## 6. Communicating Changes

When the User's custom repository diverges from the official APM release, changes should be documented:

- Update the repository's README to describe what was customized and why
- If the changes affect the workflow (new procedures, modified coordination patterns), note how the customization differs from the official documentation
- If adding new commands or skills, document their purpose and usage

---

**End of Skill**
