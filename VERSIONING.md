# APM Versioning Strategy

APM uses a decoupled versioning system with two independent release tracks: the **CLI tool** (distributed via NPM) and **APM template releases** (distributed via GitHub Releases). Both tracks follow Semantic Versioning and share the same major version to ensure compatibility.

## Versioning Tracks

### 1. APM CLI (`agentic-pm` on NPM)

The CLI source code lives in `src/`. Changes to this directory trigger new NPM releases. The CLI handles template installation and updates via the `apm init`, `apm custom`, and `apm update` commands.

Pre-release versions use the `-test-N` suffix (e.g., `1.0.0-test-1`). NPM's `latest` tag always points to the most recent stable release, so `npm install agentic-pm` installs stable versions only. Pre-releases require explicit installation: `npm install agentic-pm@0.5.0-test-1`.

### 2. APM Template Releases (GitHub Releases)

Templates live in `templates/` and are processed by the build system in `build/`. Running `npm run build:release` generates ZIP bundles for each supported AI assistant plus an `apm-release.json` manifest. These artifacts are published as GitHub Releases.

Template releases are fully decoupled from CLI versioning. The release workflow auto-increments patch versions (1.0.0 → 1.0.1) based on the latest stable release tag. For minor/major bumps, provide a version override when triggering the workflow.

Pre-release versions (e.g., `v1.0.0-test-1`, `v1.1.0-beta-1`) are supported for testing. Pre-releases sort before their stable counterpart (`v1.0.0-test-1 < v1.0.0`) and are excluded when the CLI fetches the "latest" release.

### 3. Build System

The `build/` directory, CI/CD workflows, and configuration files are not versioned. Changes are tracked via git history only.

## Version Compatibility

The CLI and template releases are decoupled but tied by **major version**. CLI v1.x will only fetch v1.x.x releases from the official repository, ensuring template compatibility. Minor and patch versions can differ between CLI and templates.

## `agentic-pm` CLI Behavior

### Official Repository (`apm init`)

By default, `apm init` fetches the latest stable release matching the CLI's major version. Pre-release versions are excluded from "latest" but can be installed explicitly with `--tag` (e.g., `apm init --tag v1.0.0-test-1`).

### Custom Repositories (`apm custom`)

**Custom repositories have no version filtering.** Users can select any available release regardless of CLI version. This enables access to experimental versions, community-maintained templates, or unreleased changes. See [SECURITY.md](SECURITY.md) for security considerations.

### Updating Templates (`apm update`)

For official installs, `apm update` fetches the latest compatible release. For custom installs, users can choose to stay with their custom repository or switch to official.

## Metadata Tracking

Installed template information is stored in `.apm/metadata.json`, including the source (official or custom), repository, release version, installed assistants, and timestamps. This allows `apm update` to determine the current state and available updates.