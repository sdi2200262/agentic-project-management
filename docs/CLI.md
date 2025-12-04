---
id: cli
slug: /cli
sidebar_label: CLI Guide
sidebar_position: 5
---

# APM CLI Guide

The APM CLI (`agentic-pm`) is the setup tool of the APM framework. It manages the installation of prompt templates, keeps your commands and guides up to date, and ensures version compatibility across different AI assistants.

## Installation

The CLI is a Node.js application. Ensure you have Node.js (v18 or higher) installed.

```bash
npm install -g agentic-pm
```

---

## Core Commands

### 1. Initialize Project (`apm init`)

The `init` command is the entry point for APM. It scaffolds the environment and configures your AI assistant.

**Usage:**

```bash
apm init
```

<div align="center">
  <img 
    src={require('@site/static/docs-img/cursor-apm-init.png').default} 
    alt="Initializing APM using `apm init` from the `agentic-pm` CLI." 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>

**The Initialization Process:**

1.  **Assistant Selection:** The CLI scans for installed extensions and prompts you to select your primary AI assistant (e.g., Cursor, GitHub Copilot, Windsurf). If you run `init` again to add a second assistant, APM tracks both in its metadata.

2.  **Compatibility Check:** It automatically fetches the latest prompt templates that are compatible with your specific CLI version.

3.  **Asset Installation:**
      * **Guides:** Installs the latest workflow documentation into `.apm/guides/`.
      * **Commands:** Installs slash commands into the assistant-specific directory (e.g., `.cursor/rules`, `.github/prompts`).

4.  **Safe Artifact Creation:**
      * Generates `.apm/Implementation_Plan.md` and `.apm/Memory/Memory_Root.md` with header templates **only if they do not exist**.
      * **Your project data is never overwritten by initialization.**

#### Installing Specific Versions

You can force the installation of a specific version using the `--tag` flag. This is useful for downgrading or ensuring team consistency.

```bash
apm init --tag v0.5.0+templates.42
```

> **Tag Policy:** The CLI will warn you if you attempt to install a template version that requires a different base CLI version (e.g., trying to install v0.5.2 templates with a v0.5.1 CLI).

### 2. Update Assets (`apm update`)

The `update` command keeps your APM framework current without disrupting your active project work.

**Usage:**

```bash
apm update
```

**Update Logic:**

  * **Smart Lookup:** The CLI checks GitHub Releases for the latest templates compatible with your installed CLI version.
  * **Multi-Assistant Sync:** If you use multiple assistants (e.g., Copilot + Cursor), `apm update` updates all of them simultaneously.
  * **Safety First (Backups):** Before touching any files, the CLI creates a complete backup of your current configuration.
      * **Backup Location:** `.apm/apm-backup-<version>.zip`
      * **Auto-Restore:** If the update process fails at any point, the CLI automatically restores your previous state.

**Update Scope:**
| Component | Status during Update |
| :--- | :--- |
| **Guides** (`.apm/guides/`) | **Overwritten** (Updated to latest) |
| **Prompt Commands** | **Overwritten** (Updated to latest) |
| **Implementation Plan** | **Preserved** (Never touched) |
| **Memory Logs** | **Preserved** (Never touched) |

-----

## Directory Structure

A fully initialized APM project follows this structure:

```text
MyProject/
├── .apm/
│   ├── guides/                 # Reference docs (Context, Workflow, etc.)
│   ├── Memory/                 # Active project memory logs
│   ├── Implementation_Plan.md  # Your project's master plan
│   └── metadata.json           # APM version & assistant tracking
├── .cursor/                    # (Example) Assistant-specific folder
│   └── commands/               # Installed APM prompt commands
└── .github/                    # (Example) If Copilot is also installed
    └── prompts/                # Installed APM prompt commands
```

-----

## Technical Reference

### Metadata Schema

The `.apm/metadata.json` file is the source of truth for your APM installation. It tracks which assistants are active to ensure updates are applied correctly.

```json
{
  "cliVersion": "0.5.0",
  "templateVersion": "v0.5.0+templates.12",
  "assistants": ["Cursor", "GitHub Copilot"],
  "installedAt": "2025-11-20T10:00:00.000Z",
  "lastUpdated": "2025-11-25T14:30:00.000Z"
}
```

### Troubleshooting Updates

**Scenario: CLI is Outdated**
If `apm update` detects that a new template requires a newer CLI version, it will abort the update to prevent incompatibility.

**Solution:**

1.  Update the global CLI tool:
    ```bash
    npm update -g agentic-pm
    ```
    
2.  Run the template update again:
    ```bash
    apm update
    ```