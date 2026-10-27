# APM Versioning Strategy

APM uses a decoupled versioning system with two independent release tracks: the **CLI tool** (distributed via NPM) and **APM template releases** (distributed via GitHub Releases). Both tracks follow Semantic Versioning and share the same major version to ensure compatibility.

## Versioning Tracks

### 1. APM CLI (`agentic-pm` on NPM)

The CLI source code lives in `src/`. Changes to this directory trigger new NPM releases. The CLI handles template management via `apm init`, `apm custom`, `apm update`, `apm archive`, `apm add`, `apm remove`, and `apm status`.

Pre-release versions use the `-test-N` suffix (e.g., `1.0.0-test-1`). NPM's `latest` tag always points to the most recent stable release, so `npm install agentic-pm` installs stable versions only. Pre-releases require explicit installation: `npm install agentic-pm@1.0.0-test-1`.

### 2. APM Template Releases (GitHub Releases)

Templates live in `templates/` and are processed by the build system in `build/`. Running `npm run build:release` generates ZIP bundles for the `agents` and `claude` installation targets plus an `apm-release.json` manifest. These artifacts are published as GitHub Releases.

Template releases are fully decoupled from CLI versioning. The release workflow auto-increments patch versions (1.0.0 → 1.0.1) based on the latest stable release tag. For minor/major bumps, provide a version override when triggering the workflow. Never override with a version that is already tagged: the workflow then replaces that release's assets in place, and installs already on it are not offered an update.

Pre-release versions (e.g., `v1.0.0-test-1`, `v1.1.0-beta-1`) are supported for testing. Pre-releases sort before their stable counterpart (`v1.0.0-test-1 < v1.0.0`) and are excluded when the CLI fetches the "latest" release.

Releases before v1.0.0 used build metadata to tie templates to a CLI version (e.g. `v0.5.4+templates.1`). Since v1.0.0, template tags are plain `vX.Y.Z`.

### 3. Build System

The `build/` directory, CI/CD workflows, and configuration files are not versioned. Changes are tracked via git history only.

## Changelog

[CHANGELOG.md](CHANGELOG.md) covers both tracks in one list, ordered by date. Each heading names what it covers: `CLI vX.Y.Z`, `Templates vX.Y.Z`, or both joined with `+` when they shipped together. Unreleased work sits at the top with `Unreleased` in place of a date.

## Version Compatibility

The CLI and template releases are decoupled but tied by **major version**. CLI v1.x will only fetch v1.x.x releases from the official repository, ensuring template compatibility. Minor and patch versions can differ between CLI and templates.

A template release can also require a minimum CLI version: set `build.minCliVersion` in `build/build-config.json`, and the build writes it to the release's `apm-release.json`. From CLI v1.0.3 on, the CLI checks this field first and refuses a release that needs a newer CLI, asking the user to update. CLI v1.0.2 does the same only when the rest of the manifest passes its own checks; otherwise it reports an invalid manifest. Earlier CLIs ignore the field, so only a major version bump keeps them away from an incompatible release.

## `agentic-pm` CLI Behavior

### Official Repository (`apm init`)

By default, `apm init` fetches the latest stable release matching the CLI's major version. Pre-release versions are excluded from "latest" but can be installed explicitly with `--tag` (e.g., `apm init --tag v1.0.0-test-1`).

### Custom Repositories (`apm custom`)

**Custom repositories have no version filtering.** Users can select any available release regardless of CLI version. This enables access to experimental versions, community-maintained templates, or unreleased changes. See [SECURITY.md](SECURITY.md) for security considerations.

### Updating Templates (`apm update`)

For official installs, `apm update` moves to the newest stable release; from a stable install it never offers a pre-release. To try a pre-release, install it with `apm init --tag <tag>`. From a pre-release install, `apm update` offers the latest stable and the latest pre-release. For custom installs, `apm update` fetches newer releases from the same custom repository.

## Metadata Tracking

Installed template information is stored in `.apm/metadata.json`, including the source (official or custom), repository, release version, installed targets, and timestamps. This allows `apm update` to determine the current state and available updates.
The manifest and metadata retain the `assistants` key for compatibility. Official
v1.1.0 installs record only `agents` and/or `claude`, with their installed file lists.
A manifest target may declare `replaces` to migrate old IDs during update. Exact
IDs take precedence, and multiple replaced IDs consolidate into one target. The
old file lists remain authoritative for cleanup; archived metadata stays unchanged.
Custom repositories can retain their own IDs or explicitly declare replacements.
