# APM Templates Known Issues

This document tracks verified issues in the APM templates, build system, and platform configurations. Issues are ephemeral — once resolved, they are removed from this file.

---

## Claude Code: Subagent tool named `Task` instead of `Agent`

**Location:** `build/build-config.json:41` — `"toolSyntax": "Task(subagent_type=\"Explore\", prompt=\"...\")"`

**Issue:** The subagent invocation tool was renamed from `Task` to `Agent` in Claude Code v2.1.63. The old name still functions as a backward-compatible alias, but `Agent` is the canonical name in all current documentation and system prompts.

**Correct config:** `"toolSyntax": "Agent(subagent_type=\"Explore\", prompt=\"...\")"`

**Source:** <https://github.com/anthropics/claude-code/issues/29677>

---

## Gemini CLI: `{AGENTS_FILE}` placeholder resolves to `AGENTS.md` instead of `GEMINI.md`

**Location:** `build/processors/placeholders.js:71` — `const agentsFileName = id === 'claude' ? 'CLAUDE.md' : 'AGENTS.md';`

**Issue:** Gemini CLI's primary instruction file is `GEMINI.md`, not `AGENTS.md`. Both are scanned, but when both exist in the same directory, `GEMINI.md` takes precedence. The placeholder directs users to the secondary file.

**Correct config:** For Gemini targets, `{AGENTS_FILE}` should resolve to `GEMINI.md`.

**Source:** <https://geminicli.com/docs/cli/gemini-md/>

---

## Gemini CLI: Fabricated subagent invocation syntax `codebase_investigator(query="...")`

**Location:** `build/build-config.json:60` — `"toolSyntax": "codebase_investigator(query=\"...\")"`

**Issue:** There is no function-call syntax for invoking the codebase investigator. The subagent is invoked either automatically by the model via an internal `SubagentInvocation` tool, or by the user with `@codebase_investigator` followed by a natural language query.

**Correct config:** `"toolSyntax": "@codebase_investigator <natural language query>"` or a note that invocation is automatic and implicit.

**Source:** <https://geminicli.com/docs/core/subagents/>

---

## Gemini CLI: `enableAgents` config note is incomplete

**Location:** `build/build-config.json:62` — `"configNote": "Requires enableAgents: true in ~/.gemini/settings.json"`

**Issue:** The setting is nested under `"experimental"`, not top-level. The full config block also requires `codebaseInvestigatorSettings`.

**Correct config:**

```json
{
  "experimental": {
    "enableAgents": true,
    "codebaseInvestigatorSettings": {
      "enabled": true
    }
  }
}
```

**Source:** <https://github.com/google-gemini/gemini-cli/issues/20540>

---

## GitHub Copilot: `$ARGUMENTS` placeholder is not a valid Copilot variable

**Location:** `build/processors/placeholders.js:67` — `$ARGUMENTS` applied to all markdown-format platforms including Copilot.

**Issue:** `$ARGUMENTS` is not recognized by GitHub Copilot prompt files. Copilot uses `${input:variableName}` or `${input:variableName:placeholder}` for user-provided input, plus built-in variables like `${selection}`, `${file}`, and `${workspaceFolder}`.

**Correct config:** Copilot targets should use `${input:variableName}` syntax instead of `$ARGUMENTS`.

**Source:** <https://code.visualstudio.com/docs/copilot/customization/prompt-files>

---

## GitHub Copilot: Subagent tool syntax is imprecise

**Location:** `build/build-config.json:22` — `"toolSyntax": "#runSubagent with exploration focus"`

**Issue:** `#runSubagent` is the real tool reference (introduced in VS Code v1.107). "with exploration focus" is natural language, not a syntactic modifier. There is no built-in "exploration" subagent — exploration behavior requires a custom agent defined via `.agent.md` with `runSubagent` in its tools frontmatter.

**Correct config:** `"toolSyntax": "#runSubagent"` — exploration intent is expressed in the prompt passed to the subagent, not in the tool name.

**Source:** <https://imaginet.com/2025/mastering-subagents-in-vs-code-copilot-how-to-actually-use-them/>

---

## OpenCode: Commands directory uses deprecated singular `command/`

**Location:** `build/build-config.json:91` — `"commands": ".opencode/command"`

**Issue:** The canonical subdirectory names in OpenCode are all plural: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, `themes/`. The singular `command/` is only supported for backwards compatibility.

**Correct config:** `"commands": ".opencode/commands"`

**Source:** <https://opencode.ai/docs/commands/>

---

## OpenCode: Subagent tool name should be capitalized `Task`

**Location:** `build/build-config.json:98` — `"toolSyntax": "task(subagent_type=\"explore\", prompt=\"...\")"`

**Issue:** The tool name is `Task` (capitalized), not `task`. Documentation and feature requests consistently use `Task(...)`. The tool also accepts a `description` parameter alongside `prompt` and `subagent_type`.

**Correct config:** `"toolSyntax": "Task(subagent_type=\"explore\", prompt=\"...\", description=\"...\")"`

**Source:** <https://github.com/anomalyco/opencode/issues/6651>

---

## GitHub API: Accept header uses deprecated `v3` format

**Location:** `src/services/github.js:41` — `Accept: 'application/vnd.github.v3+json'`

**Issue:** GitHub now recommends `application/vnd.github+json` without the `.v3` segment. API versioning is handled via a separate `X-GitHub-Api-Version` header. The project sends no version header, implicitly defaulting to the `2022-11-28` API version.

**Correct config:** `Accept: 'application/vnd.github+json'` and optionally add `'X-GitHub-Api-Version': '2022-11-28'` (or later) for explicit version pinning.

**Source:** <https://docs.github.com/rest/guides/getting-started-with-the-rest-api>

---

## GitHub Actions: `actions/checkout@v4` is two major versions behind

**Location:** `.github/workflows/deploy-website.yml:35`

**Issue:** The latest major version is v6 (v6.0.2, January 2025). v5 added Node 24 support; v6 changed credential persistence behavior.

**Correct config:** `uses: actions/checkout@v6`

**Source:** <https://github.com/actions/checkout/releases>

---

## GitHub Actions: `actions/configure-pages@v4` is one major version behind

**Location:** `.github/workflows/deploy-website.yml:55`

**Issue:** The latest major version is v5 (v5.0.0, March 2025).

**Correct config:** `uses: actions/configure-pages@v5`

**Source:** <https://github.com/actions/configure-pages/releases>

---

## GitHub Actions: `actions/upload-pages-artifact@v3` is one major version behind

**Location:** `.github/workflows/deploy-website.yml:58`

**Issue:** The latest major version is v4 (v4.0.0, August 2024). v3 artifact actions were formally deprecated by GitHub. Breaking change: dotfiles are no longer included by default in v4.

**Correct config:** `uses: actions/upload-pages-artifact@v4`

**Source:** <https://github.blog/changelog/2024-12-05-deprecation-notice-github-pages-actions-to-require-artifacts-actions-v4-on-github-com/>

---

## Cursor: `{AGENTS_FILE}` resolves to `AGENTS.md` instead of native `.cursor/rules/*.mdc`

**Location:** `build/processors/placeholders.js:71` — resolves to `AGENTS.md` for Cursor.

**Issue:** Cursor reads `AGENTS.md` (it is supported), but Cursor's native instruction system is `.cursor/rules/*.mdc` files with YAML frontmatter supporting rule types (Always, Auto-Attached, Agent-Requested, Manual) and glob-based scoping. `AGENTS.md` is the less capable option. The placeholder should at minimum note the native alternative.

**Correct config:** For Cursor targets, reference `.cursor/rules/` as the primary instruction location, with `AGENTS.md` as a cross-platform supplement.

**Source:** <https://cursor.com/docs/context/rules>

---

## All platforms: `apm-guides/` directories are not auto-discovered

**Location:** `build/build-config.json` — every target defines a `"guides"` directory (e.g., `.claude/apm-guides/`, `.github/apm-guides/`, `.gemini/apm-guides/`, `.cursor/apm-guides/`, `.opencode/apm-guides/`).

**Issue:** No platform auto-discovers `apm-guides/` directories. Files placed there are only read when explicitly referenced (via `@` mention, `#file`, or linked from another file). Each platform has its own recognized directories (e.g., `.claude/commands/`, `.github/prompts/`, `.cursor/rules/`). This is a project convention, not a platform feature — it works, but users should understand these files require explicit referencing.

**Correct config:** No code change needed, but templates and documentation should clarify that `apm-guides/` contents must be explicitly referenced to enter agent context.

**Source:** Platform-specific documentation for each target (linked in individual issues above).

---
