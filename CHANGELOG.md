# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and both release tracks follow [Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html).

> **Note:** APM ships two release tracks that version independently but share the major version: the **CLI** (`agentic-pm` on npm) and the **Templates** (GitHub Releases). Each heading names the track and version it covers - `CLI vX.Y.Z`, `Templates vX.Y.Z`, or both joined with `+` when they shipped together - and headings are ordered by date, newest first. See [VERSIONING.md](VERSIONING.md) for details.

---

## CLI v1.0.3 + Templates v1.1.0 - Unreleased

Both installation targets install the same skills and guides, each in its own folder. Run `apm update` to move an existing install to the new layout; it removes the old files and installs the new ones.

### Breaking Changes

* **Two installation targets.** Choose `agents` for agents that discover `.agents/skills/` and read `AGENTS.md`, or `claude` for Claude Code. Install both with `apm init -a agents claude`. APM no longer needs a separate bundle for each agent using the shared layout. `apm update` consolidates existing Codex, Cursor, Copilot, Antigravity and OpenCode installations into `agents`, preserving `claude` and cleaning up tracked old files. New installs and `add`/`remove` use the new IDs.

* **CLI v1.0.3 or later is required.** CLI v1.0.2 refuses Templates v1.1.0 with `v1.1.0 requires agentic-pm 1.0.3 or later. Update with: npm update -g agentic-pm` and changes nothing. CLI v1.0.1 and older don't check the required version, and they delete shared files when you remove an assistant, so update the CLI before you install. Check with `apm --version`.
* **Commands are skills for every assistant.** Claude Code, Cursor and OpenCode join Codex, Copilot and Antigravity, which already used skills. Claude Code commands install to `.claude/skills/` instead of `.claude/commands/`, and Cursor's to `.agents/skills/` instead of `.cursor/commands/`; you still run both as `/apm-…`. OpenCode's install to `.agents/skills/` instead of `.opencode/commands/`, and you run them as `@apm-…` instead of `/apm-…`.
* **Shared folder for Codex, Cursor, Copilot and OpenCode.** Commands, guides and skills install to `.agents/skills/` and `.agents/apm-guides/`, as Antigravity's already did. They previously lived in each assistant's own folder: `.codex/apm-guides/`, `.cursor/`, `.github/` and `.opencode/`.

### Added

* **An APM session can cover part of a larger goal.** When your goal is too large for one session, the Planner agrees with you during Context Gathering how far this session goes and keeps the rest as notes for later sessions. When the Manager meets a blocker that needs new design decisions, it proposes options, such as pausing to summarize, archive and plan again, instead of replanning on its own.
* **Summarize and archive from the Manager.** When the work is complete or you stop early, the Manager offers two ways to summarize the session and, optionally, archive it: in its own chat, or in a new chat with `apm-8-summarize-session`. Summaries say which parts the writer remembers doing and which come from files such as Task Logs and Handoff Logs.

### Changed

* **One layout for every assistant.** Each target installs its skills and guides into its own folder: Claude Code into `.claude/skills/` and `.claude/apm-guides/`, the `agents` target into `.agents/skills/` and `.agents/apm-guides/`. Skills and guides name their exact paths for each target.
* **Rules in `AGENTS.md` for every assistant.** The Planner writes the Rules to `AGENTS.md`, so Claude Code and other assistants share one Rules file in mixed installs. Claude Code reads `AGENTS.md` when the project has no `CLAUDE.md`; when it has one, the Planner adds an `@AGENTS.md` import at its top.
* **Simpler APM files.** The Spec, Plan, Tracker and Memory Index have no frontmatter, and an APM session no longer assumes it covers a whole project. The Plan names Workers by agent slug, marks each dependency Same-Worker or Cross-Worker and drops the dependency graph. The Spec, Plan, Tracker and Index each have a Notes section. The Tracker's Version Control table is gone: branches and worktrees sit in each Task row, conventions in the Rules and base branches in the Spec. Each Stage summary is its own file in its Stage folder, listed in the Index.
* **Simpler Task Prompts, logs and reports.** Task Prompts use the sections Objective, Instructions, Context from Dependencies, Workspace, Output and Validation. Task Logs have Summary, Output, Validation and Important Findings, with one `important_findings` flag that is always set for Partial and Failed outcomes. Every Task Log and Task Report carries the Worker's conversation number, which tells the Manager when a Handoff happened. Batches need no `batch` field or counts.
* **No custom subagent.** The `apm-archive-explorer` agent is gone. Agents explore archives, research and debug with whichever subagent their assistant offers, and `apm update` removes the old agent file.
* **Plain-English instructions.** Commands, guides and skills describe each action in plain English, such as "use a subagent to research…" or "run this command in a new chat", and each assistant carries it out with its own tools. They no longer carry per-assistant syntax.
* **Commands run only when you invoke them.** Each command's description says to use it only when you invoke it manually, and each command tells an agent to continue only if you invoked it, asked it to follow it, or another APM step sent it there. Every command skill also sets `disable-model-invocation: true`. Codex doesn't read that setting, so its model can still see the commands.
* **Shorter agent replies.** Agents keep chat replies short by default and present proposals, evidence and trade-offs instead of writing out their reasoning step by step. Logs, prompts and reports keep their full structure.
* **Shorter instructions.** Skills and guides are about half as long, with the same roles, steps and approval points. Each guide lists its steps in the order the agent acts and states each rule once. Skill titles no longer say "Command", and you invoke skills by name, such as `apm-5-check-reports` in the Manager's chat.
* **Numbered conversations.** Each Manager and Worker conversation has a number. A Handoff moves a role from one conversation to the next and writes a Handoff Log for that conversation; recovery after compaction keeps the same conversation.
* **The CLI names the next step.** After `apm init`, `apm archive` and `apm update`, the CLI tells you to invoke `apm-1-initiate-planner` in a new chat. The help text and README now say that `apm update` archives the current session before installing the new release.
* **Faster Context Gathering.** All three rounds remain. The Planner can present what it already knows as statements for you to confirm or correct, and asks questions only about what is missing.
* **Prompts need a terminal.** `apm remove` and other commands that ask for confirmation stop with an error when no terminal is attached, instead of doing nothing.
* **`apm status` names missing files.** It lists each missing file by name.
* **Consistent assistant names.** Every command shows assistants as name and id, such as "Claude Code (claude)".
* **Failed commands exit with an error status.** Any command that prints an error, such as for an unknown `-a` id, now exits with status 1.
* **Smaller release manifest.** `apm-release.json` no longer lists a description for each assistant. It keeps each assistant's folder (`configDir`) in v1.1.x only, so CLI v1.0.2 can read the manifest and tell you to update; the next minor release drops it. CLI v1.0.3 accepts manifests with or without these fields.
* **The CLI checks the required version first.** CLI v1.0.3 reads `minCliVersion` before it validates the rest of the manifest, so a release made for a newer CLI asks you to update instead of reporting an invalid manifest. A `minCliVersion` that isn't a version such as `1.0.3` is reported as invalid instead of being ignored.
* **No overwrite warning on remove.** Assistants that share `.agents/` now install identical files, so `apm remove` no longer warns that one assistant overwrote another's files.
* **Rate-limit errors explained.** When GitHub's API limit runs out, the error says so and suggests `GITHUB_TOKEN` or signing in with the `gh` CLI.

### Fixed

* **Incomplete releases are refused before installation.** `apm init` and `apm custom` check every selected bundle before writing files, so missing bundles cannot leave targets recorded as installed.
* **Local template builds require their own version.** Supply `VERSION` instead of inheriting the CLI version. The build also checks its generated manifest against the CLI's validator before writing output.
* **Narrower workflow instructions.** Worktree cleanup applies only when an assignment used one, git operations require active version control, and session summaries verify the active session rather than sweeping archives and worktree contents.
* **Less repeated guidance.** Task Prompts carry Task-specific additions; general execution and reporting instructions remain in the Worker guides. Customization and release instructions now match the current build.

* **Required steps are stated directly.** Agents often skipped these steps in v1.0.3 as well, so each instruction now says what to do and when:
  * The Planner scans the workspace itself, then uses subagents for broader research and checks their findings before relying on them.
  * The Planner waits for your reply after each Context Gathering round, and asks for each planning approval even after you say to skip reviews or run straight through during implementation.
  * The Manager asks the Worker about a Task Log that contradicts its own status before accepting it.
  * A Worker you corrected in a way that applies to later Tasks asks, before writing its Task Log, whether to add the correction to the Rules. It records your answer in the log and commits an approved Rules change with the Task.
  * An outgoing agent checks git and the Message Bus before writing a handoff, and the incoming agent checks what the handoff says before acting on it.
  * Agents give you reasons about the work instead of citing APM's own procedures, and explain an APM term the first time you meet it.
  * Workers log Partial only when required work or validation is incomplete, not for findings alone.
  * The Manager asks before initializing git, can accept a Partial outcome when you agree, and verifies a Stage when you asked for it or a Task needed a follow-up.
  * After a handoff, agents give you the command for the new chat only once you have approved the handoff files.
  * Agents wait for your reply after presenting options when they are stuck.
* **The Manager merges after review.** A Task's branch is merged only after its Task Log has been reviewed. Before, one step merged it while the report was still being processed.
* **Codex and Antigravity no longer overwrite each other's skills.** Both now install identical files to `.agents/skills/`, so installing, updating or removing one leaves the other's instructions intact. This resolves the Templates v1.0.3 known issue. Run `apm update` to apply the fix.

## CLI v1.0.2 + Templates v1.0.3 - 2026-10-15

### Changed

* **Antigravity commands are skills.** Commands install to `.agents/skills/` instead of `.agents/workflows/`, because Antigravity CLI no longer runs workflows and the Antigravity app stops running them on October 19, 2026. Subagent guidance uses `invoke_subagent` and the built-in `research` agent. Run `apm update` to switch an existing install.
* **Copilot commands are skills.** Commands install to `.github/skills/` instead of `.github/prompts/`. Skills work in Copilot CLI as well as VS Code, where prompt files are deprecated. Run `apm update` to switch an existing install.
* **Codex commands use `$`.** Instructions in the Codex bundle now say `$apm-…` instead of `/apm-…`, which Codex rejects.
* **Subagent and new-chat guidance per assistant.** Each assistant's subagent syntax and new-chat instructions now match its current tools and cover both its editor and CLI. The archive explorer is called by name, with `mode: subagent` for OpenCode, an explicit tool list for Antigravity, and `user-invocable: false` for Copilot. It no longer appears in agent pickers.
* **Commands stay user-triggered in Copilot and Antigravity.** Command skills set `disable-model-invocation: true`. They appear in the `/` menu but not in the model's skill list.
* **Assistant order.** `apm init` lists assistants as Claude Code, Codex CLI, Cursor, GitHub Copilot, Antigravity, OpenCode.
* **Clearer prompts and messages.** The archive and update confirmations say exactly what is removed and that archives are kept. `apm update` names the version you're on, post-install notes show as information rather than warnings, and help says which command `--list` and `--clear` belong to. Help text, the release-not-found error and the skills link match current behaviour.
* **`apm remove` keeps shared files.** When two assistants install the same file, such as Codex and Antigravity's `.agents/skills/`, removing one keeps the file for the other. A warning shows when the removed one had overwritten it. An assistant's folder is removed once it's empty.
* **`apm status` checks files on disk.** It flags missing files and says how to restore them.
* **Clearer counts and errors.** Messages say "1 assistant" rather than "1 assistant(s)", and `apm init --tag` says when a tag belongs to another major version.
* **`--tag` finds any release.** Tags are looked up directly, and release lists cover the newest 100 releases.

### Added

* **Minimum CLI version.** A template release can set `minCliVersion` in its manifest; the CLI refuses it and asks you to update when it's older.

### Security

* **Updated dependencies.** `axios` 1.20.0 and `adm-zip` 0.6.1 fix published advisories, including zip-bomb and symlink issues in extraction.

### Known Issues

* **Codex and Antigravity overwrite each other's skills.** Both install their commands and the communication skill to the same 11 files in `.agents/skills/`, with different text: `$` or `/` commands, and `.codex/` or `.agents/` guide paths. The one installed or updated last overwrites the other's copy. Removing that one leaves the other with its instructions. To restore an assistant's instructions, run `apm remove -a <id>`, then `apm add -a <id>`. With both installed, this overwrites the other's. CLI v1.0.2 keeps these files on remove and warns in that case. Older CLIs delete them, and the same two commands restore them. Fixed in Templates v1.1.0; run `apm update`.

## Templates v1.0.2 - 2026-06-08

### Breaking Changes

* **Gemini CLI Migration:** Transitioned support from Gemini CLI to the new Antigravity platform. The configuration directory has moved from `.gemini` to `.agents`, and the rules file has been renamed from `GEMINI.md` to `AGENTS.md`. Output format has been updated from TOML to Markdown.

### Added

* **Antigravity Support:** Support for Antigravity (CLI and IDE), with commands in `.agents/workflows/` and skills in `.agents/skills/`.

## Templates v1.0.1 - 2026-04-23

### Fixed

* **Codex CLI fixes:** Resolved issues with Codex CLI command invocation and path handling.

## CLI v1.0.0 + Templates v1.0.0 - 2026-04-09

v1.0.0 is a complete redesign of the APM workflow. The scope of changes across both the codebase and the workflow itself is too large to cover exhaustively here. This is a concise summary of the most significant changes. For the full specification, see the [documentation](https://github.com/sdi2200262/apm-website/tree/main/docs).

### Breaking Changes

* **Workflow redesigned.** Two-phase workflow: Planning Phase (Context Gathering + Work Breakdown) produces three planning documents (Spec, Plan, Rules). Implementation Phase cycles through Task Assignment, Task Execution, Task Logging, and Task Review, with support for batch and parallel dispatch across multiple Workers. All coordination is User-mediated through a file-based Message Bus, with Agents guiding the User at every step.

* **Agent roles changed.** Setup Agent → Planner. Implementation Agent → Worker. Ad-Hoc Agents removed (subagents are now spawned natively by Planner, Manager, and Workers). Manager unchanged.

* **9 commands** (up from 5): `apm-1-initiate-planner`, `apm-2-initiate-manager`, `apm-3-initiate-worker`, `apm-4-check-tasks`, `apm-5-check-reports`, `apm-6-handoff-manager`, `apm-7-handoff-worker`, `apm-8-summarize-session`, `apm-9-recover`.

* **New artifact structure.** Spec (`.apm/spec.md`), Plan with dependency graphs (`.apm/plan.md`), Rules (platform rules file), Tracker (`.apm/tracker.md`), Memory hierarchy (`.apm/memory/` with Index, Task Logs, Handoff Logs). Replaces Implementation Plan and Memory Root.

* **Platform support narrowed** to Claude Code, Cursor, GitHub Copilot, Gemini CLI, and OpenCode.

* **Template file structure changed.** Commands in `templates/commands/`, guides in `templates/guides/`, skills in `templates/skills/`, agents in `templates/agents/`. Governed by `templates/_standards/` (WORKFLOW.md, TERMINOLOGY.md, STRUCTURE.md, WRITING.md).

* **CLI redesigned.** New commands: `apm archive`, `apm add`, `apm remove`, `apm status`, `apm custom`. `apm init` is fresh-install only. Per-file install tracking via `installedFiles` in metadata.

* **Decoupled versioning.** CLI and templates version independently. Template releases use standard SemVer. See [VERSIONING.md](VERSIONING.md).

### Added

* **Message Bus** (`.apm/bus/`): file-based Agent communication with Task Bus, Report Bus, and Handoff Bus per Worker.
* **Session continuation:** archive completed sessions, start fresh with archived context carried forward via Planner detection.
* **Recovery command** (`/apm-9-recover`): reconstructs working context after platform auto-compaction.
* **Handoff system:** structured context transfer between Agent instances with Handoff Log (persistent) and Handoff Prompt (ephemeral).
* **Standalone skills** (`skills/`): independently installable skills for migration and customization.
* **Custom repository support** (`apm custom`): install templates from forked or third-party repositories.
* **Build pipeline** (`build/`): processes templates into platform-specific bundles with placeholder system, TOML conversion for Gemini, and `apm-release.json` manifest.
* **Modular CLI architecture** (`src/`): commands, services, core, UI, and schemas modules.

### Removed

* Ad-Hoc Agents and Delegate commands.
* Implementation Plan, Memory Root, and `guides/` directory format.
* Support for Windsurf, Kilo Code, Roo Code, Auggie CLI, Google Antigravity, and Qwen Code.
* Legacy build system (`scripts/build.js`).

---

## CLI v0.5.4 + Templates v0.5.4 - 2026-01-24

### Added

* **Google Antigravity Support:** Added support for Google Antigravity as the 11th AI assistant.

### Deprecated

* **Bootstrap Prompt:** The Bootstrap Prompt has been deprecated and will be removed in v1.0.0.

---

## CLI v0.5.3 - 2025-12-05

### Fixed

* **NPM Package:** Fixed `.npmignore` to exclude `dist/` directory from published package. Previous releases (v0.5.2 and earlier) incorrectly included build artifacts (zip files) in the npm package.

---

## CLI v0.5.2 + Templates v0.5.2 - 2025-12-04

### Added

* **Header Templates:** CLI now creates `Implementation_Plan.md` and `Memory_Root.md` with pre-filled header templates containing placeholders. Setup Agent must fill Implementation Plan header before Project Breakdown, and Manager Agent must fill Memory Root header before first phase execution.

### Changed

* **Workflow Streamlining:** Removed Enhancement phase and `Implementation_Plan_Guide.md`. Setup workflow now consists of 4 steps instead of 5, with structured file format built directly into Project Breakdown Guide.
* **Context Synthesis:** Renamed terminology from "Phase" to "Question Round" with stricter sequence enforcement and mandatory completion requirements.
* **Error Handling:** Strengthened Implementation Agent error handling protocol with 3-attempt limit before mandatory delegation (increased from 2 attempts).
* **Project Breakdown:** Added stricter instructions for interleaved Project Breakdown sequence with strict guardrails to prevent pattern matching and ensure quality task breakdown.
* **Task Assignment:** Added Reporting Protocol requiring Implementation Agents to output Final Task Report code blocks for better UX.
* **Agent Management:** Added Agent Name Registration & Assignment Validation protocol for Implementation Agents to prevent task assignment errors.

### Removed

* **Implementation_Plan_Guide.md:** Removed separate Enhancement guide. Structured format now integrated directly into Project Breakdown Guide workflow.

---

## CLI v0.5.1 + Templates v0.5.1 - 2025-11-03

First stable release of the CLI. Version 0.5.0 shipped only as pre-releases (`0.5.0-test-1` to `0.5.0-test-4`, from 2025-10-29).

### Added

* **NPM CLI Tool (`agentic-pm`):** Introduced a command-line interface for managing APM installations.
* **`apm init` Command:** Automates project setup, including AI assistant selection, asset download from GitHub Releases, and creation of the `.apm` directory structure (`.apm/guides`, `.apm/Memory`, `.apm/Implementation_Plan.md`, `.apm/metadata.json`). By default, automatically finds and installs the latest template version compatible with the current CLI version. Supports `--tag <tag>` option for installing specific template versions (e.g., `apm init --tag v0.5.0+templates.1`).
* **`apm update` Command:** Allows users to update their local APM installation to the latest compatible template version. Includes intelligent version compatibility checking that compares installed templates against available releases, only updating if a newer compatible build exists. Informs users when newer templates require a CLI update via `npm update -g agentic-pm`. Includes backup and restore functionality for safe updates.
* **Version Compatibility System:** Dynamic CLI version reading from `package.json` with automatic template version matching. The CLI automatically finds templates compatible with the running CLI version and compares build numbers for update decisions.
* **Support for 10 AI Assistants:** CLI downloads and installs specific bundles tailored for Cursor, GitHub Copilot, Claude Code, Gemini CLI, Qwen Code, OpenCode, Windsurf, Kilo Code, Auggie CLI, and Roo Code.
* **Build Process (`npm run build`):** New script (`scripts/build.js`) processes source templates (`templates/`) into distributable bundles (`dist/`) for each assistant, handling formatting (Markdown/TOML) and placeholders.
* **Metadata File (`.apm/metadata.json`):** Tracks the installed APM version (template tag) and selected AI assistant within the project.
* **`Troubleshooting_Guide.md`:** Added a dedicated guide based on the v0.4 User Guide's troubleshooting section.

### Changed

* **Installation Method:** APM is now installed via NPM (`npm install agentic-pm`) instead of Git clone or GitHub Template.
* **Customization Workflow:** Customization is now done by editing files locally within the `.apm/guides/` directory or the assistant-specific command directory *after* running `apm init`. Acknowledged as a work-in-progress for improving flexibility.
* **Source File Structure:** Core prompt and guide templates moved to the `templates/` directory in the repository. The `/prompts` directory is no longer the source or user-facing structure.
* **Prompt/Guide Compliance:** Updated all agent initiation prompts, handover prompts, and core guides (`Memory_System`, `Memory_Log`, `Task_Assignment`, `Implementation_Plan`, `Project_Breakdown`, `Context_Synthesis`) to be v0.5 compliant:
    * Removed all instructions related to actions now handled by the CLI (e.g., Asset Verification).
    * Added CLI awareness to the Setup Agent.
    * Removed all references to JSON assets.
    * Removed all references to the Simple Memory system.
* **File Re-branding & Relocation:**
    * `Context_Synthesis_Prompt.md` re-branded to `Context_Synthesis_Guide.md` and moved conceptually to the guides directory.
    * `Manager_Agent_Handover_Guide.md` re-branded to `Manager_Agent_Handover_Prompt.md` with command name `handover-manager`.
    * `Implementation_Agent_Handover_Guide.md` re-branded to `Implementation_Agent_Handover_Prompt.md` with command name `handover-implementation`.
* **Documentation Update:** Updated `README.md` (main), `docs/README.md`, `CONTRIBUTING.md`, `Getting_Started.md`, `Introduction.md`, `Workflow_Overview.md`, `Modifying_APM.md`, `Agent_Types.md`, and `Token_Consumption_Tips.md` to reflect all v0.5 changes, including CLI usage, new file structures, deprecations, and customization workflow. Removed references to now-obsolete PDF guides.

### Deprecated

* **JSON Asset Format:** No longer supported for Implementation Plans or Memory Logs.
* **Simple Memory Bank:** The single-file `Memory_Bank.md` strategy is no longer supported. APM v0.5 exclusively uses the Dynamic-MD system.

### Removed

* **GitHub Template:** The "Use this template" approach for installation and customization is removed in favor of the CLI.
* **User-facing `/prompts` Directory:** The structured `/prompts` directory is no longer part of the user installation; assets are placed directly by the CLI.
* **PDF Guides:** `APM_Quick_Start_Guide.pdf` and `APM_User_Guide.pdf` are removed from the documentation set; relevant content integrated into Markdown files.

---

## Templates v0.4.0 - 2025-08-19

APM v0.4 represents a complete framework refinement. The v0.3 architecture is enhanced to provide a more sophisticated, scalable approach to multi-agent project management while maintaining the core principles that made APM effective.

### Major Changes

**Architecture Enhancements**
- **Expanded from 2 to 4 agent types**: Added Setup Agent for project initialization and Ad-Hoc Agents for specialized delegation
- **Two-phase workflow**: Setup Phase for comprehensive planning, Task Loop Phase for execution
- **Advanced memory system**: Dynamic Memory Bank with multiple variants and progressive creation
- **Sophisticated dependency management**: Cross-agent coordination with comprehensive context integration
- **Handovers are now practical context repair mechanisms** not just context dumps, with built-in safety and validation steps

**Complete File Structure Overhaul**
- All prompts redesigned and reorganized under new directory structure
- New `docs/` directory with comprehensive updated documentation
- Added `schemas/` directory with experimental JSON asset format for testing/research preview

**Enhanced Capabilities**
- **Systematic project discovery**: 4-phase Context Synthesis with progression gates
- **Advanced task execution**: Single-step and multi-step patterns with dependency context integration
- **Error handling protocol**: Mandatory delegation system for complex debugging scenarios
- **Token optimization**: Economic model proposals and cost-effective strategies

### License Change
- **Updated from MIT to Mozilla Public License 2.0 (MPL-2.0)**
- Ensures community protection while maintaining full commercial compatibility

### Migration Notes
APM v0.4 is not backward compatible with v0.3. assets - **yet**. However:
- **New users** will find v0.4 significantly easier to get started with using the comprehensive documentation
- **v0.3 users** will find the core concepts familiar but greatly enhanced with more sophisticated workflows and capabilities

> **Note:** Existing v0.3 projects should be re-initialized using the new Setup Agent methodology and all v0.3 assets should be removed..

### **Getting Started**
See the complete [documentation suite](docs/) for detailed setup instructions, concepts, and advanced usage. Read [Getting Started](docs/Getting_Started.md) for your first APM v0.4 session.

---

## Templates v0.3.0 - 2025-05-21

### Added
- New section in `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Format.md` for "Recent Conversational Context & Key User Directives" in the `Handover_File.md`.

### Changed
- **Memory System Robustness (High Priority):**
  - Updated `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md` to mandate strict adherence to `Implementation_Plan.md` for all directory/file naming and to include a validation step before creation. Phase and Task naming conventions clarified.
  - Significantly revised `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md` to emphasize conciseness, provide clear principles for achieving it, and added concrete examples of good vs. overly verbose log entries.
  - Updated `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md` to instruct Manager Agents to explicitly remind specialized agents of their obligations regarding Memory Bank structure and log quality (this earlier change remains valid alongside the newer one below).
- **Handover Protocol Enhancement:**
  - Modified `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md` to include a new mandatory step for the Outgoing Manager Agent: review recent conversational turns with the User and incorporate a summary of unlogged critical directives or contextual shifts into the handover artifacts.
- **Implementation Plan and Task Assignment Process:**
  - Enhanced `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md` to:
    - Emphasize and clarify the requirement for explicit agent assignment per task.
    - Mandate the inclusion of brief "Guiding Notes" (e.g., key methods, libraries, parameters) within task action steps to ensure inter-task consistency and provide clearer direction.
  - Updated `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md` to ensure Manager Agents incorporate and expand upon these "Guiding Notes" from the `Implementation_Plan.md` when creating detailed task assignment prompts for Implementation Agents.
- **Handover Artifacts Refinement:**
  - Restructured and clarified `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Format.md` for better usability and understanding.

### Removed
- Removed the `Complex_Task_Prompting_Best_Practices.md` guide to maintain a more general framework.
- Removed explicit guidelines for Jupyter Notebook cell generation from `prompts/02_Utility_Prompts_And_Format_Definitions/Imlementation_Agent_Onboarding.md` to keep agent guidance general.

---

## Templates v0.2.0 - 2025-05-14
### Added
- New Manager Agent Guide for dynamic Memory Bank setup (`02_Memory_Bank_Guide.md`).
- Cursor Rules system with 3 initial rules and `rules/README.md` for MA reliability upon Initiation Phase.
- Enhanced MA Initiation with improved asset verification, file structure display and more.

### Changed
- Refined Manager Agent Initiation Flow (`01_Initiation_Prompt.md`) for Memory Bank, planning, and codebase guidance.
- Comprehensive documentation updates across key files (Root `README.md`, `Getting Started`, `Cursor Integration`, `Core Concepts`, `Troubleshooting`) reflecting all v0.2.0 changes.
- Renumbered core MA guides in `prompts/01_Manager_Agent_Core_Guides/` and updated framework references.

---

## Templates v0.1.0 - 2025-05-12
### Added
- Initial framework structure
- Defined Memory Bank log format and Handover Artifact formats.
- Created core documentation: Introduction, Workflow Overview, Getting Started, Glossary, Cursor Integration Guide, Troubleshooting.
- Established basic repository files: README, LICENSE, CONTRIBUTING, CHANGELOG, CODE OF CONDUCT.
- Added initial GitHub issue template for bug reports.



