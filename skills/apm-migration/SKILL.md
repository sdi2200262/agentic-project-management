---
name: apm-migration
description: Guides an AI agent through migrating a project from an older APM version to the current release, preserving session artifacts as archives.
---

# APM Migration Skill

## 1. Overview

**Reading Agent:** Any AI assistant in the User's project

This skill guides the migration of a project from an older APM version to the current release. Rather than hardcoding migration steps, this skill teaches the Agent how to assess the current state, understand what has changed, and propose a migration plan for User approval.

### 1.1 Objectives

- Assess the current APM installation state and version
- Research the current APM release to understand differences
- Preserve existing session artifacts as an archive
- Clean up old APM files from assistant directories without affecting non-APM content
- Leave the project ready for initialization with the current CLI

### 1.2 Outputs

- Existing `.apm/` session artifacts preserved in `.apm/archives/` with an archive index
- Old APM-installed files removed from assistant directories (APM files only, non-APM content preserved)
- Project ready for fresh `apm init` with the current CLI

---

## 2. Research the Current Version

Before proposing a migration, research what the current version of APM looks like. The official documentation is available at:

- **Documentation (v1 preview):** https://github.com/sdi2200262/apm-website/tree/main/docs
- **Repository:** https://github.com/sdi2200262/agentic-project-management

Fetch and read the following doc files from the documentation repository to understand the current workflow, file structure, and CLI:

- **Introduction.md** - What APM is and how it works
- **Getting_Started.md** - Installation, initialization, and first session walkthrough
- **CLI.md** - All CLI commands, directory structure, metadata format, and versioning

These pages are the source of truth for what the current release expects. Compare what they describe against what exists in the User's workspace to identify the differences. Note: the documentation site at `agentic-project-management.dev` may not yet reflect v1 content. Use the repository links above for current v1 documentation.

---

## 3. Known Version Landmarks

This section provides context for older versions the Agent may encounter. It is not exhaustive and may be outdated. Always cross-reference against the current documentation fetched in §2.

### v0.5.x and Earlier

Installations from v0.5.x and earlier have significant structural differences from v1.0.0+:

**CLI package:** The `agentic-pm` npm package changed significantly between v0.5.x and v1.0.0. The v0.5.x CLI only had `apm init` and `apm update`. The v1.0.0+ CLI adds `apm custom`, `apm archive`, `apm add`, `apm remove`, and `apm status`. The User needs to update the CLI itself, not just the templates.

**Metadata format:** `.apm/metadata.json` uses `templateVersion` (e.g. `"v0.5.4+templates.2"`) instead of `releaseVersion`. Assistant names are stored as full display names (`"Cursor"`, `"Claude Code"`) rather than short IDs (`"cursor"`, `"claude"`). There is no `installedFiles` tracking and no `source` or `repository` fields.

**File structure:** `.apm/` contains `Implementation_Plan.md`, `Memory/Memory_Root.md`, and `guides/` rather than the v1.0.0+ structure of `spec.md`, `plan.md`, `tracker.md`, `memory/index.md`, and `bus/`.

**Assistant directories:** v0.5.x installed only command files into assistant directories (e.g. `.cursor/commands/`). v1.0.0+ installs commands, guides, skills, and agent configurations across multiple subdirectories. The assistant directories themselves (`.cursor/`, `.claude/`, `.github/`, etc.) may also contain non-APM content the User has placed there. Only APM-installed files should be removed during migration.

**Supported assistants:** v0.5.x supported up to 11 assistants including Windsurf, Kilo Code, Qwen Code, Roo Code, and others. v1.0.0 narrowed official support to assistants with native subagent capabilities: Cursor, Claude Code, GitHub Copilot, Gemini CLI, and OpenCode.

**Terminology:** v0.5.x used different names for agent roles and procedures (Setup Agent → Planner, Implementation Agent → Worker, Context Synthesis → Context Gathering, Project Breakdown → Work Breakdown, Handover → Handoff, etc.).

---

## 4. Migration Procedure

Perform the following actions:

1. **Assess current state.** Read `.apm/metadata.json` to determine the installed version and configured assistants. List the assistant directories that contain APM files. Check for any active session artifacts in `.apm/`. Note the metadata format to identify which version era the installation belongs to.

2. **Check CLI versions.** Determine which CLI version is currently installed (`apm --version` or `npm list -g agentic-pm`). Compare against the current release. If the installed CLI is v0.5.x, the User will need to update the CLI package itself since the v1.0.0+ CLI is a different codebase with different commands and behavior.

3. **Research current version.** Fetch the current documentation per §2. Identify what the current CLI expects in terms of metadata format, directory structure, and file layout. Compare against the existing installation.

4. **Present findings to the User.** Explain:
   - Which APM version is currently installed (both CLI and templates)
   - Which assistants are configured and whether they are supported in the current release
   - What active session artifacts exist in `.apm/`
   - The key differences between the installed version and the current release
   - That the CLI itself needs updating (if applicable), not just the templates
   - What the migration will involve

5. **Propose migration plan.** The migration involves four steps (step 2 is optional):

   **Step 1: Archive the existing session.** Rather than discarding old `.apm/` artifacts, preserve them as an archive that the current version's Planner can detect during future Context Gathering:
   - Create `.apm/archives/` if it does not exist
   - Move the existing session artifacts into a dated archive directory (e.g. `.apm/archives/session-YYYY-MM-DD-001/`). Include whatever exists: Implementation Plan, Memory directory, any planning documents, and the old metadata.json (renamed or copied for reference).
   - Create `.apm/archives/index.md` with an entry noting this is a migration archive from the previous version:
     ```markdown
     # APM Archive Index

     | Archive | Date | Scope | Stages | Tasks |
     |---------|------|-------|--------|-------|
     | session-YYYY-MM-DD-001 | YYYY-MM-DD | Migration archive from APM vX.X.X | N/A | N/A |
     ```

   When creating the archive, convert the old `metadata.json` to the current schema so that `apm archive --list` and `apm status` display it correctly. The current archive metadata schema is documented in the [CLI Guide](https://github.com/sdi2200262/apm-website/blob/main/docs/CLI.md). Map old fields to current equivalents (e.g. `templateVersion` → `releaseVersion`, full assistant names → short IDs), add `archivedAt` with the current timestamp, and set `reason` to `"migration"`. Fetch the CLI Guide if needed to confirm the current schema.

   Inform the User of the archive directory name and ask if they would like to rename it to something more descriptive.

   **Step 2 (optional): Session summary.** Ask the User if they would like a summary of the old session. If yes, write a `session-summary.md` file into the archive directory based on the artifacts assessed in the procedure's step 1. The summary follows the same structure as the standard APM session summary:

   *YAML frontmatter:*
   ```yaml
   ---
   date: <YYYY-MM-DDTHH:MM:SSZ>
   project: <project name from old artifacts>
   stages_completed: <number, or 0 if not applicable>
   total_tasks: <number, or 0 if not applicable>
   outcome: <complete | partial | incomplete>
   ---
   ```

   *Body sections (in order):*
   - **Migration Notice** - State prominently at the top that this summary was produced during migration from APM vX.X.X, that the old release used different terminology and artifact formats (e.g. v0.5.x used "phases" where the current version uses "Stages", "Implementation Agents" where the current version uses "Workers", etc.), and that the codebase may have diverged since the old session ended. This context is essential for future Planners reading the archive.
   - **Project Scope** - What was being built and why, from the Implementation Plan or equivalent
   - **Work Completed** - Summary of work completed, using the old version's own terminology as found in the artifacts. If the old artifacts have phase-level or task-level structure, summarize per-phase. Do not force current APM terminology onto old artifacts, but note correspondences where helpful (e.g. "Phase 2 (equivalent to a Stage in current APM)").
   - **Key Deliverables** - Primary outputs with file paths or descriptions
   - **Codebase State** - How deliverables relate to the current codebase, what exists in code vs what was planned
   - **Notable Findings** - Patterns, issues, or insights visible in the old artifacts
   - **Known Issues** - Unresolved problems, open questions, or caveats

   Adapt the sections to whatever the old artifacts actually contain. Not all sections may be fillable from older releases. Future Planners examining the archive will read the Migration Notice first to understand the context before parsing the rest.

   **Step 3: Clean up assistant directories.** Remove only APM-installed files from assistant directories. This requires care:
   - Identify which files in assistant directories (e.g. `.cursor/commands/`, `.claude/commands/`) were installed by APM. v0.5.x files typically have `apm-` prefixes or match known APM command patterns.
   - List every file that will be removed and present the list to the User before deleting anything.
   - Do NOT remove entire assistant directories (`.cursor/`, `.claude/`, etc.) as they may contain non-APM content (user rules, custom commands, IDE configurations).
   - Do NOT remove files that are clearly not APM-related. When uncertain, ask the User.
   - If the old version installed a `guides/` directory inside `.apm/`, that will already be handled by the archive step.

   **Step 4: Clean metadata.** Remove `.apm/metadata.json` from the root `.apm/` directory (the archived copy in `.apm/archives/` is preserved). The current CLI will see a clean state and allow `apm init`.

6. **Request User approval.** Present the complete list of actions: which files will be archived, which will be removed from assistant directories, and what the final state will look like. Wait for confirmation before proceeding.

7. **Execute the migration.** Perform the approved steps in order: archive (step 1), session summary if requested (step 2), clean assistant directories (step 3), clean metadata (step 4).

8. **Guide next steps.** Direct the User to:
   - Update or install the current CLI: `npm install -g agentic-pm`
   - Verify the CLI version: `apm --version`
   - Initialize: `apm init`
   - Select their assistant and begin a new APM session
   - During the new Planner's Context Gathering, the Planner will detect the migration archive in `.apm/archives/` and can use it to carry context forward from the previous version

9. **Offer to answer questions.** Ask the User if they have any questions about the current APM release, how it works, or how it differs from what they had. If the old installation has not been cleaned up yet, compare specific aspects side by side. If it has, reference the archived artifacts and the current documentation. Fetch relevant doc pages to answer questions accurately rather than guessing.

---

## 5. Important Notes

- Old session artifacts are generally not directly compatible across major version changes. The archive preserves them for reference, and the current Planner can examine them during Context Gathering.
- The current CLI refuses to initialize if `.apm/metadata.json` exists with a format it does not recognize. Removing it from the root `.apm/` directory is necessary.
- If the User's assistant is no longer officially supported in the current release, inform them and suggest the closest supported alternative.
- Assistant directories often contain non-APM content (IDE rules, custom commands, project configurations). Only remove files that are clearly APM-installed. When in doubt, ask the User.
- Always fetch the current documentation rather than relying solely on the landmarks in §3. APM evolves between releases and the docs are the source of truth.
- **Reverting the migration.** If the User migrates and decides the current release is not for them, the old artifacts are preserved in the archive created during Step 1. To revert: restore the archived `.apm/` contents, downgrade the CLI to the previously installed version (`npm install -g agentic-pm@<version>`), and run `apm init` to reinstall the old assistant files. Recommend the User commits or stashes their workspace before migrating for extra safety.

---

**End of Skill**
