# CLI Standards

Coding standards and patterns for the APM CLI.

## Error Handling

### CLIError Class

Use the `CLIError` class with error codes:

```javascript
import { CLIError } from '../core/errors.js';

// Factory methods for consistent errors
throw CLIError.networkError(url, reason);
throw CLIError.releaseNotFound(repo);
throw CLIError.manifestMissing(tag);
throw CLIError.manifestInvalid(tag, errors);
throw CLIError.bundleNotFound(bundleName, tag);
throw CLIError.notInitialized();
```

### Fail Fast

Validate early, exit with clear messages:

```javascript
const metadata = await readMetadata();
if (!metadata) {
  throw CLIError.notInitialized();
}
```

### Error Codes

Use semantic codes from `CLIErrorCode`:

- `NETWORK_ERROR` - HTTP request failures
- `RELEASE_NOT_FOUND` - No matching releases
- `MANIFEST_MISSING` - Missing apm-release.json
- `MANIFEST_INVALID` - Schema validation failures
- `BUNDLE_NOT_FOUND` - Missing bundle asset
- `NOT_INITIALIZED` - No .apm/metadata.json

## Module Structure

### Single Responsibility

Each module handles one concern:

- `core/constants.js` - Configuration constants
- `core/errors.js` - Error classes
- `core/config.js` - Global config (~/.apm/config.json)
- `core/metadata.js` - Workspace metadata (.apm/metadata.json)
- `services/github.js` - GitHub API access
- `services/releases.js` - Release operations
- `services/extractor.js` - ZIP extraction
- `ui/logger.js` - Terminal output
- `ui/prompts.js` - User interactions
- `commands/init.js` - Init command
- `commands/custom.js` - Custom command
- `commands/update.js` - Update command

### Export Patterns

Named exports for functions, default for primary export:

```javascript
// Named exports for utility functions
export async function readConfig() { ... }
export async function writeConfig(config) { ... }

// Default export for single-responsibility modules
export default { readConfig, writeConfig, ... };
```

## Async Patterns

### Async/Await

Use async/await, not Promise chains:

```javascript
// Good
const releases = await fetchReleases(repo);
const manifest = await fetchReleaseManifest(release);

// Avoid
fetchReleases(repo)
  .then(releases => fetchReleaseManifest(...))
  .then(manifest => ...);
```

### Timeout Handling

Configure timeouts for network requests:

```javascript
const response = await axios.get(url, {
  timeout: 30000,  // 30 seconds for API
  maxRedirects: 5
});
```

## UI Patterns

### Logger Module

Use logger for all output:

```javascript
import logger from '../ui/logger.js';

logger.info('Fetching releases...');
logger.success('Installation complete!');
logger.warn('Already initialized');
logger.error('Network request failed');
```

### Prompts Module

Use prompts for all user interaction:

```javascript
import { selectAssistant, confirmAction } from '../ui/prompts.js';

const assistantId = await selectAssistant(assistants);
const proceed = await confirmAction('Continue?', true);
```

### Output Style

- Use `logger.info()` for progress updates
- Use `logger.success()` for completion messages
- Use `logger.warn()` for non-fatal issues
- Use `logger.error()` only for failures
- No emojis or ASCII in output

## Data Schemas

### ~/.apm/config.json

Global CLI configuration:

```json
{
  "customRepos": [
    {
      "repo": "owner/repo",
      "addedAt": "2024-01-01T00:00:00.000Z",
      "skipDisclaimer": false
    }
  ]
}
```

### .apm/metadata.json

Workspace installation state:

```json
{
  "source": "official",
  "repository": "owner/repo",
  "releaseVersion": "v1.0.0",
  "assistants": ["claude"],
  "installedAt": "2024-01-01T00:00:00.000Z",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### apm-release.json

Release manifest schema:

```json
{
  "version": "1.0.0",
  "assistants": [
    {
      "id": "claude",
      "name": "Claude Code",
      "bundle": "claude.zip",
      "description": "Optimized for Claude Code",
      "configDir": ".claude"
    }
  ]
}
```

## Version Filtering

The CLI filters releases by major version:

- v1.x CLI → fetches only v1.x.x releases from official repo
- Custom repos: no filtering (user selects release)

```javascript
import { CLI_MAJOR_VERSION } from '../core/constants.js';

const filtered = filterByMajorVersion(releases, CLI_MAJOR_VERSION);
```

## Command Patterns

### Command Structure

Each command follows this pattern:

```javascript
export async function initCommand(options = {}) {
  // 1. Check preconditions
  if (!force && await isInitialized()) {
    const proceed = await confirmAction('Re-initialize?');
    if (!proceed) return;
  }

  // 2. Fetch data
  const releases = await fetchOfficialReleases();
  const latest = getLatestRelease(releases);

  // 3. User interaction
  const assistantId = await selectAssistant(manifest.assistants);

  // 4. Perform action
  await downloadAndExtract(url, destPath);

  // 5. Update state
  await writeMetadata(metadata);

  // 6. Success message
  logger.success('Initialized!');
}
```

### Entry Point

The entry point handles errors at the top level:

```javascript
program
  .command('init')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (err) {
      handleError(err);
    }
  });
```
