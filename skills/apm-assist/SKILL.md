---
name: apm-assist
description: Reference and procedures for helping users understand APM, detect their installation state, answer questions from live docs, and handle migration from older versions.
---

# APM Assist

## 1. Overview

This skill provides the context and procedures needed to help users with APM (Agentic Project Management). It covers explaining concepts, detecting installation state, answering questions from the live documentation, and guiding migration from older versions.

**This skill is not part of the APM workflow.** APM sessions run in their own dedicated conversations - the Planner, Manager, and Workers each get a separate chat. This skill is for answering questions about APM and helping with setup or migration. If the user wants to start an APM session, fetch the [Getting Started](https://agentic-project-management.dev/docs/getting-started) guide and walk them through the steps it describes. Do not attempt to run APM procedures in this conversation.

### 1.1 What This Skill Covers

- **Explaining APM** - How APM works, its concepts, workflow, and architecture
- **Detecting state** - Reading `.apm/metadata.json` to identify the installed version, source, and assistants
- **Answering questions** - Fetching live documentation pages to give accurate, up-to-date answers
- **Migration** - Guiding users from older APM versions to the current release (see §5)

### 1.2 How to Use This Skill

- Fetch the relevant documentation page before answering questions. Training data may be outdated.
- Be direct and practical. Users asking about APM want actionable information, not theory.
- When a question maps to a specific doc page, summarize the relevant section and link to the full page.
- When the user has an active APM installation, ground answers in their actual project state.

---

## 2. APM at a Glance

APM (Agentic Project Management) is a framework for building complex software projects with AI assistants. Instead of one long chat that degrades as context fills, APM structures work into a coordinated system with three Agent types:

- **Planner** - Runs once at project start. Gathers requirements through structured discovery, then creates three planning documents: the Spec (what to build), the Plan (how work is organized into Stages and Tasks), and the Rules (how work is performed).
- **Manager** - Coordinates execution. Assigns Tasks to Workers via self-contained Task Prompts, reviews completed work, and maintains project state.
- **Workers** - Execute Tasks in specific domains (frontend, backend, etc.). Each Worker sees only its Task Prompt and the Rules, not the full project scope.

Agents communicate through a file-based Message Bus in `.apm/bus/`. The user carries messages between Agent conversations by running commands. Project state lives in structured files (`.apm/`) so nothing is lost when a conversation ends.

When an Agent's context fills, a Handoff transfers working knowledge to a fresh instance. Sessions can be archived and built upon by future Planners.

APM is installed via the `agentic-pm` CLI (`npm install -g agentic-pm`) and supports Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenCode, and Codex.

---

## 3. Documentation Reference

The official documentation is the source of truth. Always fetch the relevant page rather than relying on the overview above or on training data.

**LLM entry point:** https://agentic-project-management.dev/llms.txt - structured index of all docs with descriptions, follows the llms.txt standard.

**Documentation site:** https://agentic-project-management.dev/docs

| Page | URL path | Covers |
| :--- | :--- | :--- |
| Introduction | `/docs/introduction` | What APM is, the problem it solves, high-level overview |
| Getting Started | `/docs/getting-started` | Installation, first session walkthrough, all steps |
| Quick Reference | `/docs/quick-reference` | Commands, CLI, file structure, workflow cheat sheet |
| Agent Types | `/docs/agent-types` | Planner, Manager, Worker roles and responsibilities |
| Agent Orchestration | `/docs/agent-orchestration` | Planning documents, Message Bus, Task Prompts, Memory, Handoff |
| Workflow Overview | `/docs/workflow-overview` | Every procedure in both phases, step by step |
| Prompt Engineering | `/docs/prompt-engineering` | How APM's files are designed and structured |
| Context Engineering | `/docs/context-engineering` | How Agent context is scoped and why |
| CLI Guide | `/docs/cli` | All CLI commands, options, directory structure, metadata schema |
| Troubleshooting | `/docs/troubleshooting-guide` | Common issues, recovery procedures, migration |
| Customization Guide | `/docs/customization-guide` | Custom repositories, build pipeline, template modification |
| Security Guide | `/docs/security` | Trust model, custom bundle risks, mitigation |
| Tips and Tricks | `/docs/tips-and-tricks` | Model selection, cost optimization, workflow efficiency |

**Repository:** https://github.com/sdi2200262/agentic-project-management

The full documentation is also available as a single file:
`https://agentic-project-management.dev/llms-full.txt`

When the documentation site is unreachable, fetch docs directly from the website repository:
`https://raw.githubusercontent.com/sdi2200262/apm-website/main/docs/<filename>.md`

---

## 4. Version Detection

When the user asks about their APM installation, or when knowing the setup would help answer a question:

1. **Check for `.apm/metadata.json`** - If it exists, read it. Key fields:
   - `source`: `"official"` or `"custom"`
   - `repository`: e.g. `"sdi2200262/agentic-project-management"`
   - `releaseVersion`: e.g. `"v1.0.0"`
   - `cliVersion`: CLI version that performed the install
   - `assistants`: Array of installed assistant IDs

2. **Check for old metadata formats** - If `metadata.json` exists but uses `templateVersion` instead of `releaseVersion`, or stores assistant names as full display names instead of short IDs, this is a pre-v1.0.0 installation. See §5 for migration.

3. **Check CLI version** - `apm --version` or `npm list -g agentic-pm` shows the installed CLI version.

4. **No `.apm/` directory** - APM is not initialized. The user can run `apm init` after installing the CLI.

---

## 5. Migration

When a pre-v1.0.0 installation is detected, or when the user asks about migration, follow this procedure. The goal is to preserve existing work as an archive and leave the project ready for the current CLI.

### 5.1 Assess

1. Read `.apm/metadata.json` to determine the installed version and configured assistants
2. Check which CLI version is installed (`apm --version` or `npm list -g agentic-pm`)
3. Fetch the current CLI Guide from the documentation to understand the expected metadata schema and directory structure
4. List what exists in `.apm/` and in assistant directories (`.claude/`, `.cursor/`, etc.)

### 5.2 Explain

Present findings to the user:
- Which version is installed (CLI and templates)
- What active session artifacts exist
- Key differences from the current release
- What the migration will involve

### 5.3 v0.5.x to v1.0.0 Migration Map

This section provides the specific mappings between v0.5.x and v1.0.0. Always cross-reference against the current documentation as well.

**Agent roles:**

| v0.5.x | v1.0.0 | Notes |
| :--- | :--- | :--- |
| Setup Agent | Planner | Same role (discovery + planning), renamed |
| Manager Agent | Manager | Unchanged |
| Implementation Agent | Worker | Same role (task execution), renamed. Workers now have identifiers (e.g. `frontend-agent`) |
| Ad-Hoc Agent | (removed) | Subagent spawning is now native to Planner, Manager, and Workers |

**Commands:**

| v0.5.x | v1.0.0 |
| :--- | :--- |
| `/apm-1-initiate-setup` | `/apm-1-initiate-planner` |
| `/apm-2-initiate-manager` | `/apm-2-initiate-manager` |
| `/apm-3-initiate-implementation` | `/apm-3-initiate-worker <id>` |
| `/apm-4-delegate` | (removed - native subagents) |
| `/apm-5-handover-manager` | `/apm-6-handoff-manager` |
| `/apm-5-handover-implementation` | `/apm-7-handoff-worker` |
| (none) | `/apm-4-check-tasks` (Message Bus delivery) |
| (none) | `/apm-5-check-reports` (Message Bus delivery) |
| (none) | `/apm-8-summarize-session` |
| (none) | `/apm-9-recover` |

**File structure:**

| v0.5.x | v1.0.0 |
| :--- | :--- |
| `.apm/Implementation_Plan.md` | `.apm/spec.md` + `.apm/plan.md` (split into two) |
| `.apm/Memory/Memory_Root.md` | `.apm/memory/index.md` |
| `.apm/Memory/<phase>/<task>.md` | `.apm/memory/stage-NN/task-NN-NN.log.md` |
| `.apm/guides/` | Platform directory (e.g. `.claude/apm-guides/`) |
| (none) | `.apm/tracker.md` (live project state) |
| (none) | `.apm/bus/` (file-based Message Bus) |

**Metadata (v0.5.x):** Two formats exist depending on the minor version:

Early v0.5.x (single-assistant):
```json
{ "version": "v0.5.0", "assistant": "Cursor", "installedAt": "..." }
```

Later v0.5.x (multi-assistant, auto-migrated by CLI):
```json
{
  "cliVersion": "0.5.4",
  "templateVersion": "v0.5.4+templates.2",
  "assistants": ["Cursor", "Claude Code"],
  "installedAt": "...",
  "lastUpdated": "..."
}
```

Key differences from v1.0.0 metadata: v0.5.x uses `templateVersion` (with `+templates.N` build suffix) instead of `releaseVersion`, stores assistant names as full display names (`"Claude Code"`) instead of short IDs (`"claude"`), has no `source`, `repository`, or `installedFiles` fields.

**Metadata (v1.0.0):**
```json
{
  "source": "official",
  "repository": "sdi2200262/agentic-project-management",
  "releaseVersion": "v1.0.0",
  "cliVersion": "1.0.0",
  "assistants": ["cursor", "claude"],
  "installedFiles": { "cursor": ["..."], "claude": ["..."] },
  "installedAt": "..."
}
```

Archive metadata adds `archivedAt` and `reason` (e.g. `"migration"`) fields.

**Guides and installed files:** In v0.5.x, procedural guides lived in `.apm/guides/`. In v1.0.0, guides, skills, agent configs, and commands are all installed into the platform-specific directory (e.g. `.claude/apm-guides/`, `.claude/skills/`, `.claude/agents/`, `.claude/commands/`). The `.apm/` directory in v1.0.0 contains only project artifacts (Spec, Plan, Tracker, Memory, Bus, metadata).

**Archives:** v0.5.x `apm update` created backup directories at `.apm/apm-backup-<tag>/` with optional zip files - no structured archive metadata. v1.0.0 uses `.apm/archives/session-YYYY-MM-DD-NNN/` with proper `metadata.json` inside each archive. During migration, old backup directories should be consolidated into the v1.0.0 archive format.

**Workflow changes:**
- Context Synthesis (4 question rounds) became Context Gathering (3 rounds)
- Project Breakdown became Work Breakdown, now produces Spec + Plan + Rules instead of a single Implementation Plan
- Task delivery changed from copy-paste (code blocks) to file-based Message Bus
- Ad-Hoc delegation replaced by native subagent spawning
- Enhancement phase and AI Review phase removed

**CLI changes:** v0.5.x CLI had only `apm init` and `apm update`. v1.0.0 adds `apm archive`, `apm custom`, `apm add`, `apm remove`, and `apm status`. The `apm init` command in v1.0.0 is fresh-install only (refuses to run if already initialized).

**Platform support:** v0.5.x supported 11 assistants (including Windsurf, Kilo Code, Roo Code, Auggie CLI, Google Antigravity, Qwen Code). v1.0.0 narrowed to Cursor, Claude Code, GitHub Copilot, Gemini CLI, OpenCode, and Codex.

### 5.4 Execute

**Step 1 - Archive.** Move existing `.apm/` artifacts into `.apm/archives/session-YYYY-MM-DD-001/`. Convert old `metadata.json` to the current archive schema (fetch the CLI Guide for the current schema). Create an archive index at `.apm/archives/index.md`.

**Step 2 (optional) - Session summary.** If the user wants, generate a `session-summary.md` from the old artifacts. Include a Migration Notice at the top stating the old version and terminology differences. Adapt sections to whatever the old artifacts contain.

**Step 3 - Clean assistant directories.** Remove only APM-installed files from assistant directories. List every file before deleting. Do NOT remove non-APM content. When uncertain, ask.

**Step 4 - Clean metadata.** Remove `.apm/metadata.json` from the root so the current CLI sees a clean state.

### 5.5 Next Steps

After migration, the user should:
1. Update the CLI: `npm install -g agentic-pm`
2. Initialize: `apm init`
3. The new Planner will detect the migration archive during Context Gathering

---

## 6. Answering Questions

When the user asks a question about APM:

1. **Identify which doc page covers it** using the table in §3
2. **Fetch that page** from the documentation site or repository
3. **Answer based on the fetched content** - summarize the relevant section, quote key details
4. **Link to the full page** so the user can read more

If the question spans multiple pages, fetch the most relevant one and reference the others. If the question is about the user's specific project, also check their `.apm/` artifacts for context.

For questions about models, cost, or workflow tips - fetch Tips and Tricks.
For questions about commands or file structure - fetch CLI Guide or Quick Reference.
For questions about errors or unexpected behavior - fetch Troubleshooting Guide.

---

**End of Skill**
