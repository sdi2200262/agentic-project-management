# Build System Standards

Coding standards and patterns for the APM build pipeline.

## Module Structure

### Pure Functions

Prefer pure functions with explicit dependencies:

```javascript
// Good: Pure function with explicit inputs
export function generateReleaseManifest(config, version) {
  return {
    version,
    assistants: config.targets.map(t => ({ ... }))
  };
}

// Avoid: Side effects or implicit dependencies
export function generateManifest() {
  const config = loadConfig(); // Implicit dependency
  writeFile(...);              // Side effect
}
```

### Single Responsibility

Each module handles one concern:

- `build/core/config.js` - Configuration loading and validation
- `build/core/errors.js` - Error classes and codes
- `build/generators/manifest.js` - Manifest generation
- `build/generators/archive.js` - ZIP creation
- `build/processors/templates.js` - Template orchestration
- `build/processors/frontmatter.js` - YAML parsing
- `build/processors/placeholders.js` - Placeholder replacement
- `build/utils/files.js` - File discovery utilities
- `build/utils/logger.js` - Build logging

### Export Patterns

Named exports for functions, with optional default export aggregating all exports:

```javascript
// Named exports for module functions
export function parseFrontmatter(content) { ... }
export function validateFrontmatter(frontmatter) { ... }

// Optional default export for convenience
export default { parseFrontmatter, validateFrontmatter };
```

## Error Handling

### BuildError Class

Use the `BuildError` class with error codes:

```javascript
import { BuildError } from '../core/errors.js';

// Factory methods for consistent errors
throw BuildError.configNotFound(path);
throw BuildError.templateParseFailed(file, reason);
throw BuildError.archiveFailed(target, reason);
```

### Error Codes

Use semantic error codes from `BuildErrorCode`:

- `CONFIG_NOT_FOUND` - Missing configuration file
- `CONFIG_INVALID` - Malformed configuration
- `CONFIG_MISSING_FIELD` - Missing required config field
- `TEMPLATE_PARSE_FAILED` - Template parsing error
- `TEMPLATE_MISSING_FIELD` - Missing required frontmatter field
- `TEMPLATE_READ_FAILED` - Template file read error
- `DUPLICATE_COMMAND` - Duplicate command_name detected
- `ARCHIVE_FAILED` - ZIP creation failure
- `WRITE_FAILED` - File write error

### Fail Fast

Validate inputs early, fail with clear messages:

```javascript
async function buildTarget(target, config) {
  if (!target.directories) {
    throw BuildError.configMissingField('directories');
  }
  // Continue with build...
}
```

## Template Processing

### Directory Structure

Source templates in `templates/` (no dot prefixes):

```
templates/
  apm/              # Copied to .apm/ in bundles
  commands/         # Processed per target
  guides/           # Processed per target
  skills/           # Processed per target
  agents/           # Processed per target
  _standards/       # Not copied (build-time only)
```

### Output Structure

Each bundle contains (with dot prefixes):

```
{id}.zip/
  .apm/
    plan.md
    spec.md
    tracker.md
    memory/
      index.md
  {configDir}/
    commands/
      apm-1-initiate-planner.md
      ...
    guides/
      context-gathering.md
      ...
    skills/
      apm-communication/
        SKILL.md
        bus-integration.md
      apm-version-control/
        SKILL.md
      ...
    agents/
      apm-archive-explorer.md
      ...
```

Skills output as `<skill-name>/SKILL.md` directories (may contain additional files). Guides are flat files. Agents are flat files.

### Command Naming

Commands are named directly in source files:

```
templates/commands/
  apm-1-initiate-planner.md
  apm-2-initiate-manager.md
  apm-3-initiate-worker.md
  ...
```

Output filename matches source (extension changes for TOML targets).

### Frontmatter

Commands keep minimal frontmatter for TOML description:

```yaml
---
command_name: initiate-manager
description: Initializes a Manager Agent...
---
```

- `command_name` - Used for logging/reference
- `description` - Used in TOML output format

### Placeholder Replacement

Supported placeholders:

- `{VERSION}` - Package version
- `{TIMESTAMP}` - ISO timestamp
- `{SKILL_PATH:name}`, `{GUIDE_PATH:name}`, `{COMMAND_PATH:name}`, `{AGENT_PATH:name}` - Cross-reference paths
- `{SKILLS_DIR}`, `{GUIDES_DIR}`, `{AGENTS_DIR}` - Platform-specific directory paths
- `{ARGS}` - `$ARGUMENTS` (Markdown), `{{args}}` (TOML), `${input:args}` (Copilot)
- `{RULES_FILE}` - `CLAUDE.md` (Claude), `GEMINI.md` (Gemini), `AGENTS.md` (others)
- `{PLANNER_SUBAGENT_GUIDANCE}`, `{MANAGER_SUBAGENT_GUIDANCE}`, `{WORKER_SUBAGENT_GUIDANCE}`, `{SUBAGENT_GUIDANCE}` - Role-specific subagent syntax
- `{ARCHIVE_EXPLORER_GUIDANCE}` - Subagent spawn syntax for archive explorer agent
- `{CONTEXT_ATTACH_SYNTAX}` - Platform-specific file reference instructions

## Archive Generation

### ZIP Structure

Archives are created directly from the build directory:

```javascript
await createZipArchive(targetBuildDir, zipPath);
```

### Release Manifest

`apm-release.json` schema:

```json
{
  "version": "1.0.0",
  "assistants": [
    {
      "id": "claude",
      "name": "Claude Code",
      "bundle": "claude.zip",
      "description": "Optimized for Claude Code",
      "configDir": ".claude",
      "postInstallNote": "..."
    }
  ]
}
```

`postInstallNote` is optional (only Gemini currently uses it).

## Logging

Use the build logger module (not CLI logger):

```javascript
import logger from '../utils/logger.js';

logger.info('Processing target...');
logger.success('Build completed');
logger.warn('Missing optional field');
logger.error('Build failed');
```

## Configuration

### build-config.json

Required fields per target:

```json
{
  "id": "claude",
  "name": "Claude Code",
  "bundleName": "claude.zip",
  "format": "markdown",
  "configDir": ".claude",
  "directories": {
    "commands": ".claude/commands",
    "skills": ".claude/skills",
    "guides": ".claude/apm-guides",
    "agents": ".claude/agents"
  },
  "contextAttachSyntax": "Reference the file using `@` followed by the file path.",
  "subagentGuidance": {
    "hasSubagents": true,
    "toolSyntax": "Agent(subagent_type=\"Explore\", prompt=\"...\")",
    "explorerName": "Explore",
    "configNote": null
  },
  "postInstallNote": null
}
```

### Format Types

- `markdown` - Standard markdown output
- `toml` - TOML format with `description` and `prompt` fields
