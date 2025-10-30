# APM CLI Guide

This document explains how the APM CLI installs and updates templates and how it manages multiple assistants in a project.

## Commands

### apm init
- **Default behavior:** Finds and installs the latest template tag compatible with your current CLI version.
- **Assistant selection:** You select one assistant, but **APM installs/updates _all_ recorded assistants** to the chosen tag.
- **Guides:** `.apm/guides` is scaffolded **once per run**; assistant command directories are installed under their specific folders (e.g., `.cursor/commands`, `.github/prompts`).
- **User artifacts are preserved:** `.apm/Implementation_Plan.md` and `.apm/Memory/Memory_Root.md` are created only if missing and **never overwritten** on subsequent runs.
- **Metadata:** `.apm/metadata.json` stores the unified `templateVersion`, `cliVersion`, and an `assistants` array (all installed assistants).

#### --tag policy
- **Newer template, same CLI base:** Proceed without warnings.
- **Older template, same CLI base:** Show a yellow warning and ask for confirmation.
- **Different CLI base (newer or older):** Show a red warning and ask for confirmation. **All assistants will be overwritten** to the specified tag.

### apm update
- **Always looks up the latest template tag compatible with your current CLI version.**
- **Update decision:**
  - If **installed template base < current CLI base**: proceed to update.
  - If **installed template base == current CLI base**: proceed to update if a newer build exists.
  - If **installed template base > current CLI base**: APM avoids downgrades; it suggests updating your CLI via `npm update -g agentic-pm` or installing a specific tag with `apm init --tag`.
- **Operates on _all_ assistants** listed in metadata. Missing assistant directories are re-created based on metadata.
- **Backup:** Moves all assistant directories and `.apm/guides` into `.apm/apm-backup-<templateTag>/` and creates a zip archive. `.apm/Implementation_Plan.md` and `.apm/Memory/` are left intact.

## Metadata Schema
```json
{
  "cliVersion": "<CURRENT_CLI_VERSION>",
  "templateVersion": "<CLI_VERSION>+templates.N",
  "assistants": ["Cursor", "GitHub Copilot"],
  "installedAt": "<ISO>",
  "lastUpdated": "<ISO>"
}
```
- **Migration:** older metadata (v0.5.0-test-x) with a single `assistant` and `version` is upgraded automatically to the schema above.

---

> **Notes:**
> - If `apm update` indicates newer templates exist for a newer CLI base, update your CLI: `npm update -g agentic-pm` and run `apm update` again.
> - You can always install a specific template via `apm init --tag <CLI_VERSION>+templates.N`.
