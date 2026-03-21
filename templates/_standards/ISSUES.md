# APM Templates Known Issues

This document tracks verified issues in the APM templates, build system, and platform configurations. Issues are ephemeral - once resolved, they are removed from this file.

---

## Cursor: native rules system is more capable than `AGENTS.md`

**Location:** `build/processors/placeholders.js` - resolves `{RULES_FILE}` to `AGENTS.md` for Cursor.

**Issue:** Cursor reads `AGENTS.md`, but its native instruction system is `.cursor/rules/*.mdc` files with YAML frontmatter supporting rule types (Always Apply, Apply to Specific Files, Apply Intelligently, Apply Manually) and glob-based scoping. `AGENTS.md` is the less capable cross-platform option. No build change is needed since `AGENTS.md` is functional, but templates and documentation should note the native alternative for Cursor users.

**Source:** <https://cursor.com/docs/context/rules>

---

## All platforms: `apm-guides/` directories are not auto-discovered

**Location:** `build/build-config.json` - every target defines a `"guides"` directory (e.g., `.claude/apm-guides/`, `.github/apm-guides/`, `.gemini/apm-guides/`, `.cursor/apm-guides/`, `.opencode/apm-guides/`).

**Issue:** No platform auto-discovers `apm-guides/` directories. Files placed there are only read when explicitly referenced (via `@` mention, `#file`, or linked from another file). Each platform has its own recognized directories (e.g., `.claude/commands/`, `.github/prompts/`, `.cursor/rules/`). This is a project convention, not a platform feature - it works, but users should understand these files require explicit referencing.

**Correct config:** No code change needed, but templates and documentation should clarify that `apm-guides/` contents must be explicitly referenced to enter agent context.

**Source:** Platform-specific documentation for each target.

---
