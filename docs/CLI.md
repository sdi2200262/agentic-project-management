---
id: cli
slug: /cli
sidebar_label: CLI Guide
sidebar_position: 5
---

# APM CLI Guide

The APM CLI (`agentic-pm`) manages installation, updates, and session lifecycle for the APM framework. It scaffolds commands, guides, skills, and agents into your project workspace and handles session archival for multi-session workflows.

## Installation

The CLI requires Node.js v18 or higher.

```bash
npm install -g agentic-pm
```

---

## Commands

### `apm init`

Initializes APM with official releases. Prompts for AI assistant selection, fetches the latest compatible release, and installs all files.

```bash
apm init
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-t, --tag <tag>` | Install a specific release version |
| `-a, --assistant <id>` | Assistant to install (e.g., `claude`, `copilot`, `cursor`) |
| `-f, --force` | Skip confirmation prompt |

**What it does:**

1. Prompts for AI assistant selection (or uses `--assistant`)
2. Fetches the latest compatible release from GitHub
3. Creates `.apm/` with project artifact templates (`spec.md`, `plan.md`, `tracker.md`, `memory/index.md`, `metadata.json`)
4. Installs commands, guides, skills, and agents into platform-specific directories

If APM is already initialized, it warns and asks before re-initializing. Existing archives in `.apm/archives/` are preserved during re-initialization.

### `apm custom`

Installs APM from a custom repository instead of the official releases. Useful for modified or forked APM templates.

```bash
apm custom
apm custom -r owner/repo -t v1.0.0
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-r, --repo <repo>` | Repository in `owner/repo` format |
| `-t, --tag <tag>` | Install specific release version (requires `--repo`) |
| `-a, --assistant <id>` | Assistant to install |
| `-f, --force` | Skip confirmation prompt |

Without `--repo`, offers to select from saved custom repositories (managed via `apm config`).

### `apm update`

Updates installed assistant templates to the latest compatible version.

```bash
apm update
```

Checks GitHub Releases for the latest templates compatible with the installed CLI version. If multiple assistants are configured, updates all simultaneously. Creates a backup before updating and auto-restores on failure.

**Update scope:**

| Component | Behavior |
| :--- | :--- |
| Commands, guides, skills, agents | Updated to latest |
| `.apm/` project artifacts | Preserved |
| `.apm/archives/` | Preserved |

### `apm archive`

Archives the current session and restores fresh templates for a new session.

```bash
apm archive
apm archive --continues session-2026-03-04-001
apm archive --force
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-c, --continues <name>` | Previous archive this session continues from |
| `-f, --force` | Skip confirmation prompt |

**What it does:**

1. Moves current `.apm/` artifacts (spec, plan, tracker, memory, bus) to `.apm/archives/session-YYYY-MM-DD-NNN/`
2. Writes `metadata.json` to the archive (with optional `continues` key)
3. Restores fresh templates in `.apm/`

Without `--continues`, prompts interactively if archives exist. The archive name is auto-generated with a daily counter (e.g., `session-2026-03-10-001`, `session-2026-03-10-002`).

> For workflow context on Session Continuation, see [Workflow Overview](Workflow_Overview.md).

### `apm config`

Manages saved custom repositories for use with `apm custom`.

```bash
apm config --list
apm config --add owner/repo
apm config --remove owner/repo
apm config --clear
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-a, --add <repo>` | Add a custom repository |
| `-r, --remove <repo>` | Remove a custom repository |
| `-l, --list` | List saved custom repositories |
| `--clear` | Clear all saved custom repositories |

---

## Directory Structure

A fully initialized APM project follows this structure (using Cursor as example):

```text
MyProject/
├── .apm/
│   ├── spec.md                # Design decisions and constraints
│   ├── plan.md                # Stages, Tasks, dependencies
│   ├── tracker.md             # Live project state
│   ├── memory/
│   │   └── index.md           # Durable project memory
│   ├── bus/                   # Agent communication (created by Planner)
│   ├── archives/              # Archived sessions (created by apm archive)
│   └── metadata.json          # Installation metadata
├── .cursor/
│   ├── commands/              # APM commands (init, handoff, utility)
│   ├── apm-guides/            # Procedure guides for Agents
│   ├── skills/                # Shared procedural skills
│   └── agents/                # Custom subagent configurations
└── ...
```

Platform-specific directories vary by assistant (`.claude/`, `.github/`, `.gemini/`, `.opencode/`).

---

## Versioning

CLI and templates version independently but share major version for compatibility:

- **CLI** follows semver on npm. Update with `npm update -g agentic-pm`.
- **Template releases** are GitHub releases with auto-incrementing patch versions. Update via `apm update`.
- CLI v1.x only fetches v1.x.x template releases.

---

## Troubleshooting

**CLI is outdated:** If `apm update` detects that new templates require a newer CLI version, it aborts to prevent incompatibility. Update the CLI first:

```bash
npm update -g agentic-pm
apm update
```

**Re-initialization with archives:** Running `apm init` when APM is already initialized warns about the existing installation and archive count. Archives are never deleted by `init` — only by manual cleanup.
