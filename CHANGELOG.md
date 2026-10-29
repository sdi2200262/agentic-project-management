# Changelog

APM versions its CLI (npm) and templates (GitHub Releases) separately using [Semantic Versioning](https://semver.org/). Entries follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). See [VERSIONING.md](VERSIONING.md) for release rules.

## CLI v1.0.3 + Templates v1.1.0 - Unreleased

### Breaking Changes

* **CLI v1.0.3 required.** Run `npm update -g agentic-pm`, then `apm update`.
* **Two installation targets.** `agents` supports assistants using `AGENTS.md` and `.agents/skills/`; `claude` supports Claude Code. Updates consolidate previous non-Claude targets into `agents`. Skills and guides install under `.agents/` or `.claude/`; Claude Code commands move to `.claude/skills/`.
* **Shared Rules.** All targets use workspace-root `AGENTS.md`. For Claude Code, the Planner adds an import to an existing `CLAUDE.md`.

### Changed

* Runtime template files are about 44% shorter, with simpler instructions and replies. Native subagents are optional.
* The Planner discusses the work breakdown and agrees Git conventions during discovery, and can scope larger goals across sessions.
* Simplified Spec, Plan, Tracker and Memory formats. Removed the Plan's dependency graph; Stage summaries become separate linked files, and Task/Handoff records identify numbered conversations.
* The Manager can summarize completed or stopped sessions in its own chat, including unfinished work and validation limits.
* `apm status` lists missing files. CLI messages give clearer next steps and GitHub rate-limit guidance.
* Builds require an explicit template `VERSION` and validate release manifests.

### Fixed

* Conflicting assistant instructions in shared skills.
* Archival breaking worktree Git connections; archives now preserve worktrees and uncommitted files. Deletion confirmations identify worktrees and unfinished changes.
* Missing bundle assets are detected before installation files change.
* Archive names could overwrite existing sessions.
* npm packages could include local assistant settings and development files.
* Commands silently failing without a terminal or returning a successful exit status after errors.

## CLI v1.0.2 + Templates v1.0.3 - 2026-10-15

### Added

* Minimum CLI version requirements in template releases, checked before installation.

### Changed

* Antigravity commands move from `.agents/workflows/` to `.agents/skills/`; Copilot commands move from `.github/prompts/` to `.github/skills/`. Both remain user-invoked.
* Updated assistant-specific subagent and new-chat instructions, archive-explorer definitions and Codex command invocations.
* Clearer archive/update confirmations, version errors and CLI help.

### Fixed

* Removing an assistant retains shared files needed by remaining assistants and removes empty assistant directories. Warns when retained files contain the removed assistant's instructions.
* `apm status` detects missing installed files and gives repair instructions.
* Explicit release tags are looked up directly, including releases outside the latest listing. Release listings include up to 100 entries.

### Security

* Updated `axios` to 1.20.0 and `adm-zip` to 0.6.1 for security fixes.

### Known Issues

* Codex and Antigravity overwrite each other's instructions in shared skill files when installed together; the last installation wins.

## Templates v1.0.2 - 2026-06-08

### Breaking Changes

* Replaced Gemini CLI with Antigravity CLI and IDE support. Configuration moves from `.gemini/` to `.agents/`, Rules from `GEMINI.md` to `AGENTS.md`, and TOML commands to Markdown workflows in `.agents/workflows/`.

## Templates v1.0.1 - 2026-04-23

### Fixed

* Codex commands and skills now install under `.agents/skills/` instead of `.codex/skills/`.

## CLI v1.0.0 + Templates v1.0.0 - 2026-04-09

Complete redesign of the APM workflow, agent roles and session files.

### Breaking Changes

* **Planning and implementation.** The Planner replaces the Setup Agent, gathering context and producing a Spec, Plan and Rules before implementation. Workers replace Implementation Agents; the Manager coordinates their work. Native subagents replace Ad-Hoc Agents and Delegate commands.
* **Session files.** Spec, Plan, Rules, Tracker and indexed Task/Handoff Logs replace the Implementation Plan and Memory Root. The Plan organises Stages, Tasks, dependencies and validation criteria; the Tracker records live progress.
* **Installation and updates.** `apm init` is for fresh installations. `apm update` archives the active session and installs fresh templates. Metadata tracks individual installed files.
* **Assistant support.** Six targets: Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI and OpenCode. Removed Windsurf, Kilo Code, Roo Code, Auggie CLI, Google Antigravity and Qwen Code.
* **Versioning.** CLI and templates version independently with a shared major version.

### Added

* **Message Bus** in `.apm/bus/` for Task Prompts, Task Reports and Handoff Prompts. The User delivers messages between agent chats.
* **Dispatch choices.** Single Tasks, batches and parallel Workers, with feature branches and isolated worktrees for parallel execution. Workers receive self-contained Task Prompts; the Manager retains planning and coordination context.
* **Continuity.** Persistent Handoff Logs and temporary Handoff Prompts transfer context to successor agents. A recovery command rebuilds context after compaction. Session summaries and archives carry completed work into later planning.
* Five CLI commands: `archive` for session archives, `add` and `remove` for assistants, `status` for installation checks, and `custom` for third-party template repositories.
* Codex support, nine assistant commands, and standalone skills for APM help, migration and customisation.

### Changed

* Template sources separate commands, guides, skills and agent definitions under shared authoring standards. Guides install in assistant directories.
* Replaced the build script with a modular pipeline producing assistant bundles and an `apm-release.json` manifest.

## CLI v0.5.4 + Templates v0.5.4 - 2026-01-24

### Added

* Google Antigravity as the eleventh assistant, with commands in `.agent/workflows/`.

### Changed

* Setup ends after plan approval or optional review. The Manager reads `Memory_Root.md` to distinguish first initialization from a handover, then loads the plan and guides.
* Manager Handoffs include explicit instructions for reading prior Memory Logs.

### Removed

* The copy-paste Bootstrap Prompt between Setup and Manager. Users can start the Manager directly after Setup.

## CLI v0.5.3 - 2025-12-05

### Fixed

* Excluded generated `dist/` bundles from the npm package.

## CLI v0.5.2 + Templates v0.5.2 - 2025-12-04

### Added

* Initial `Implementation_Plan.md` and `Memory_Root.md` headers, populated by the Setup and Manager Agents.
* Documentation website with search and setup videos.

### Changed

* Setup uses four steps: Context Synthesis, Project Breakdown, optional Plan Review and Bootstrap Prompt creation. All four question rounds must finish before Project Breakdown.
* Project Breakdown alternates phase analysis with writing that phase to the plan. Managers validate task fields and dependencies, maintain plan structure and update references when tasks change.
* Implementation Agents register an identity, reject assignments for another agent and provide a copyable Task Report for the User to return to the Manager.
* Managers inspect deliverables when logs flag important findings or compatibility issues. Debugging must delegate after three failed attempts.

### Removed

* The separate Enhancement step and Implementation Plan guide.

## CLI v0.5.1 + Templates v0.5.1 - 2025-11-03

First stable CLI release, following the v0.5.0 pre-releases.

### Added

* **npm CLI.** `agentic-pm` provides `apm init` and `apm update`. Installation selects assistants, downloads a compatible template release and creates session files. `--tag` selects a specific release.
* **Template updates.** Compatibility checks select newer template builds, warn when a CLI update is needed, and back up installations with restoration on failure.
* **Assistant bundles.** Ten targets: Cursor, GitHub Copilot, Claude Code, Gemini CLI, Qwen Code, OpenCode, Windsurf, Kilo Code, Auggie CLI and Roo Code.
* **Build system.** `scripts/build.js` generates assistant-specific Markdown/TOML bundles from shared `templates/` sources, resolving paths and placeholders.
* Installation metadata in `.apm/metadata.json` and a Troubleshooting Guide.

### Changed

* CLI installation replaces cloning or using the repository as a template. Guides install into `.apm/guides/`, with commands in assistant directories; users customise those installed files.
* Prompts and guides use Dynamic-MD memory and leave installation checks to the CLI. Handover guides become command prompts.

### Removed

* JSON planning/log formats and the single-file Simple Memory Bank.
* The user-facing `/prompts/` layout and PDF guides.

## Templates v0.4.0 - 2025-08-19

### Breaking Changes

* Rebuilt the workflow around Setup and Task Loop phases. A new Setup Agent gathers requirements and writes the plan; the Manager coordinates implementation. Existing v0.3 projects require reinitialisation with the new assets.
* Changed the license from MIT to MPL-2.0.

### Added

* **Four agent roles.** Setup, Manager and Implementation Agents, plus Ad-Hoc Agents for debugging and research delegation.
* **Project discovery and planning.** Four-round Context Synthesis, phase-by-phase task breakdown, agent assignments and dependency analysis, with optional systematic plan review.
* **Memory variants.** Simple, Dynamic-MD and experimental Dynamic-JSON storage. Dynamic variants use a Memory Root, phase directories, per-task logs and phase summaries created as work progresses.
* **Task execution.** Single-step and multi-step patterns, cross-agent dependency context and debugging delegation.
* **Handovers.** Separate Manager and Implementation handover procedures with context validation and repair.
* Rewritten documentation for workflow, customisation, context management and token costs, plus PDF user guides and experimental JSON schemas.

### Changed

* Reorganised prompts into role-specific directories and shared guides under `prompts/`.

## Templates v0.3.0 - 2025-05-21

### Added

* Recent conversation context and unlogged User directives in Handover artifacts.

### Changed

* Memory Bank paths must match the current Implementation Plan and be checked before creation.
* Plans assign agents explicitly and include task-specific guidance; assignment prompts carry that guidance to Implementation Agents.
* Logs use concise summaries and artifact references. Managers include logging requirements in assignments.
* Reorganised the Handover artifact format.

## Templates v0.2.0 - 2025-05-14

### Added

* Manager initiation and codebase guidance, with guides for planning, Memory Bank setup, task assignment, review and Handover.
* Standard formats for Memory Bank logs and Handover artifacts, plus Implementation Agent onboarding.
* Three Cursor rules for discovery, Memory Bank structure and plan formats.
* Workflow, Getting Started, core concepts, Cursor integration and troubleshooting documentation.
* Code of Conduct and a bug-report issue template.

### Changed

* Manager initiation includes asset checks and Memory Bank setup.

## Templates v0.1.0 - 2025-05-12

### Added

* Initial framework overview: Managers plan and assign work, Implementation Agents execute and log it, and specialist agents support delegated tasks. Memory Banks and Handovers preserve project context.
* README, MIT license, contributing guide and changelog.
