# Build System Standards

This document defines the architecture, patterns, and conventions for the APM build system.

---

## 1. Architecture Overview

```
build/
├── index.js                    # Entry point
├── build-config.json           # Build configuration
├── _standards/
│   └── BUILD.md               # This document
│
├── core/
│   ├── config.js              # Config loading + validation
│   ├── errors.js              # BuildError class hierarchy
│   └── constants.js           # MANIFEST_VERSION, SCAFFOLD_MAPPINGS
│
├── processors/
│   ├── frontmatter.js         # YAML frontmatter parsing
│   ├── placeholders.js        # Placeholder replacement
│   └── templates.js           # Template orchestration
│
├── generators/
│   ├── manifest.js            # Bundle/release manifest generation
│   └── archive.js             # ZIP creation
│
└── utils/
    └── files.js               # File discovery utilities
```

---

## 2. Module Specifications

### 2.1 Entry Point (`index.js`)

Minimal entry point that:
- Loads configuration via `loadConfig()`
- Delegates to `buildAll()` for processing
- Handles top-level errors with proper exit codes

### 2.2 Core Modules

#### `core/config.js`

| Export | Description |
|--------|-------------|
| `loadConfig()` | Load and validate build-config.json |
| `validateConfig(config)` | Schema validation returning error array |
| `getVersion()` | Read version from package.json |

#### `core/errors.js`

| Export | Description |
|--------|-------------|
| `BuildErrorCode` | Enum of error codes |
| `BuildError` | Base error class with static factory methods |

Factory methods:
- `configNotFound(path)` - Config file missing
- `configInvalid(errors)` - Config validation failed
- `configMissingField(field)` - Required field missing
- `templateParseFailed(file, reason)` - YAML parse error
- `templateMissingField(file, field)` - Required frontmatter missing
- `duplicateCommand(name, files)` - Duplicate command_name detected
- `archiveFailed(target, reason)` - ZIP creation failed

#### `core/constants.js`

| Export | Description |
|--------|-------------|
| `MANIFEST_VERSION` | Current manifest version string |
| `SCAFFOLD_MAPPINGS` | Map of scaffold files to destination paths |

### 2.3 Processor Modules

#### `processors/frontmatter.js`

| Export | Description |
|--------|-------------|
| `parseFrontmatter(content)` | Extract YAML frontmatter, returns `{frontmatter, content}` |
| `validateFrontmatter(frontmatter, filePath)` | Validate required fields |

#### `processors/placeholders.js`

| Export | Description |
|--------|-------------|
| `replacePlaceholders(content, context)` | Replace all placeholders |
| `getOutputExtension(target)` | Determine output file extension |

Context object:
```javascript
{
  version: string,
  target: Object,
  commandFileMap: Object,
  now?: Date
}
```

#### `processors/templates.js`

| Export | Description |
|--------|-------------|
| `buildAll(config)` | Main orchestration function |

Internal functions:
- `buildTarget(target, config, version)` - Build single target
- `processTemplate(templatePath, options)` - Process single template
- `buildCommandFileMap(templateFiles, target)` - Pre-compute command filenames
- `sanitizeCommandName(name)` - Sanitize command name for filenames

### 2.4 Generator Modules

#### `generators/manifest.js`

| Export | Description |
|--------|-------------|
| `generateBundleManifest(target)` | Generate per-bundle manifest |
| `generateReleaseManifest(config, version)` | Generate release manifest |

#### `generators/archive.js`

| Export | Description |
|--------|-------------|
| `createZipArchive(sourceDir, outputPath)` | Create ZIP archive |

### 2.5 Utility Modules

#### `utils/files.js`

| Export | Description |
|--------|-------------|
| `findMdFiles(sourceDir)` | Recursively find markdown templates |
| `copyScaffolds(source, dest)` | Copy scaffold files |

---

## 3. Coding Standards

### 3.1 JSDoc

All exported functions must have JSDoc comments:

```javascript
/**
 * Brief description of the function.
 *
 * @param {Type} paramName - Parameter description.
 * @returns {ReturnType} Return value description.
 * @throws {ErrorType} When this error occurs.
 */
```

### 3.2 Error Handling

- Use `BuildError` class with appropriate error codes
- Use static factory methods for common error types
- Include context object with relevant data
- Let errors propagate to entry point for logging

### 3.3 Logging

Use the shared logger from `src/logger.js`:

```javascript
import logger from '../src/logger.js';

logger.info('Informational message');
logger.success('Success message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message');  // Only shown when DEBUG=true
```

### 3.4 Naming Conventions

- **Files**: `kebab-case.js`
- **Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Classes**: `PascalCase`
- **Error codes**: `SCREAMING_SNAKE_CASE`

---

## 4. Configuration Schema

### `build-config.json`

```json
{
  "build": {
    "sourceDir": "templates",      // Required: Source templates directory
    "outputDir": "dist",           // Required: Output directory
    "cleanOutput": true,           // Optional: Clean output before build
    "scaffoldsDir": "_scaffolds"   // Optional: Scaffolds subdirectory
  },
  "targets": [
    {
      "id": "claude",              // Required: Unique target identifier
      "name": "Claude Code",       // Required: Display name
      "bundleName": "apm-claude.zip", // Required: Output bundle filename
      "format": "markdown",        // Required: "markdown" or "toml"
      "directories": {
        "commands": ".claude/commands", // Required: Commands directory
        "skills": ".claude/skills"      // Required: Skills directory
      }
    }
  ]
}
```

---

## 5. Build Pipeline

### Step 1: Configuration

1. Load `build-config.json`
2. Validate against schema
3. Read version from `package.json`

### Step 2: Setup

1. Clean or create output directory
2. Find all markdown templates in source directory

### Step 3: Per-Target Processing

For each target:

1. Create target build directory structure
2. Build command filename map (detects duplicates)
3. Process each template:
   - Parse frontmatter
   - Replace placeholders
   - Determine output path and extension
   - Write processed content
4. Copy scaffolds
5. Generate bundle manifest
6. Create ZIP archive
7. Clean up build directory

### Step 4: Finalization

1. Generate release manifest
2. Log completion status

---

## 6. Placeholder Reference

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `{VERSION}` | Package version | `0.5.3` |
| `{TIMESTAMP}` | ISO timestamp | `2024-01-15T10:30:00.000Z` |
| `{SKILL_PATH:file}` | Path to skill file | `.claude/skills/file` |
| `{COMMAND_PATH:file}` | Path to command file | `.claude/commands/apm-default-file.md` |
| `{ARGS}` | Arguments placeholder | `$ARGUMENTS` (md) or `{{args}}` (toml) |
| `{AGENTS_FILE}` | Agents file name | `CLAUDE.md` or `AGENTS.md` |
| `{SKILLS_DIR}` | Skills directory | `.claude/skills` |

---

## 7. Template Frontmatter

### Command Templates

```yaml
---
command_name: my-command
description: Command description
priority: default
---
```

- `command_name`: Required for commands, determines output filename
- `description`: Used in TOML format output
- `priority`: Prefix for filename (default: `default`)

### Skill Templates

Skill templates have no required frontmatter fields. They are identified by the absence of `command_name`.

---

## 8. Output Formats

### Markdown (Claude, Copilot, Cursor, etc.)

Commands retain frontmatter with placeholders replaced.

### TOML (Gemini, Qwen)

Commands are converted to TOML format:

```toml
description = "Command description"

prompt = """
[body content with placeholders replaced]
"""
```

### Copilot Extension

Copilot commands use `.prompt.md` extension instead of `.md`.

---

## 9. Testing

### Manual Verification

1. Run build: `node build/index.js`
2. Check output: Verify `dist/` contains all ZIP bundles
3. Validate bundles: Extract and verify manifest + file structure
4. Test placeholders: Verify all placeholders are replaced correctly
5. Test error handling:
   - Remove config file → should show clear error
   - Add duplicate command_name → should detect and report

### Comparing Outputs

When making changes, compare new build output against previous build to ensure no regressions.
