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
apm init -a claude
apm init -a claude copilot -t v1.0.0
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-t, --tag <tag>` | Install a specific release version |
| `-a, --assistant <id...>` | Assistant(s) to install (variadic) |

**What it does:**

1. Prompts for AI assistant selection (or uses `--assistant`)
2. Fetches the latest compatible release from GitHub
3. Creates `.apm/` with project artifact templates (`spec.md`, `plan.md`, `tracker.md`, `memory/index.md`, `metadata.json`)
4. Installs commands, guides, skills, and agents into platform-specific directories

If APM is already initialized, it shows the current installation state and suggests using `apm add`, `apm update`, or `apm archive`.

### `apm custom`

Installs APM from a custom repository instead of the official releases. Also manages saved custom repositories.

```bash
apm custom
apm custom -r owner/repo -t v1.0.0
apm custom -r owner/repo -a claude copilot
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-r, --repo <repo>` | Repository in `owner/repo` format |
| `-t, --tag <tag>` | Install specific release version (requires `--repo`) |
| `-a, --assistant <id...>` | Assistant(s) to install (variadic) |
| `--add-repo <repos...>` | Save custom repository(ies) |
| `--remove-repo <repos...>` | Remove saved repository(ies) |
| `--list` | List saved custom repositories |
| `--clear` | Clear all saved custom repositories |

Without `--repo`, offers to select from saved custom repositories (managed via `--add-repo`/`--remove-repo`). If already initialized, shows info and suggests `apm add`/`apm update`/`apm archive`.

**Repository management examples:**

```bash
apm custom --add-repo owner/repo
apm custom --remove-repo owner/repo
apm custom --list
apm custom --clear
```

### `apm update`

Updates installed assistant templates to the latest compatible version.

```bash
apm update
apm update --force
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-f, --force` | Skip confirmation prompt |

**What it does:**

1. Archives the current session to `.apm/archives/`
2. Removes all tracked assistant files
3. Downloads and installs the latest compatible release
4. Writes fresh metadata

For official installations, prefers stable releases over pre-releases. If currently on a pre-release and no stable update exists, checks for a newer pre-release with the same label. For custom installations, lets you select from available releases.

**Update scope:**

| Component | Behavior |
| :--- | :--- |
| Commands, guides, skills, agents | Updated to latest |
| `.apm/` project artifacts | Archived before update |
| `.apm/archives/` | Preserved |

### `apm archive`

Archives the current session and removes the installation.

```bash
apm archive
apm archive --force
apm archive --list
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-l, --list` | List archived sessions |
| `-f, --force` | Skip confirmation prompt |

**What it does:**

1. Moves current `.apm/` artifacts (spec, plan, tracker, memory, session summary) to `.apm/archives/session-YYYY-MM-DD-NNN/`
2. Writes `metadata.json` to the archive with archival timestamp
3. Removes all tracked assistant files
4. Deletes installation metadata

After archival, the project is uninitialized. Run `apm init` to begin a new session with fresh templates. Archives remain accessible in `.apm/archives/`.

> For workflow context on Session Continuation, see [Workflow Overview](Workflow_Overview.md).

### `apm add`

Adds assistant(s) to an existing installation.

```bash
apm add
apm add -a copilot
apm add -a copilot opencode cursor
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-a, --assistant <id...>` | Assistant(s) to add (variadic) |

Fetches the same release version currently installed and shows only uninstalled assistants. Without `--assistant`, prompts for selection.

### `apm remove`

Removes assistant(s) from the installation.

```bash
apm remove
apm remove -a copilot
apm remove -a copilot opencode
```

**Options:**

| Flag | Description |
| :--- | :--- |
| `-a, --assistant <id...>` | Assistant(s) to remove (variadic) |

Removes tracked files for the specified assistant(s) and updates metadata. Without `--assistant`, prompts for selection. Warns when removing all assistants.

### `apm status`

Shows the current installation state.

```bash
apm status
```

Displays source, repository, version, CLI version, installed assistants with file counts, and archive count. If not initialized, shows archive count (if any) or suggests `apm init`.

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

**Already initialized:** Running `apm init` when APM is already initialized shows the current state and suggests `apm add`, `apm update`, or `apm archive`. Use `apm archive` first to start fresh.
