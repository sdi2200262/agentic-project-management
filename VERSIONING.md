# Versioning

APM versions its CLI and templates separately using [Semantic Versioning](https://semver.org/). They share a major version; their minor and patch versions can differ.

## Release tracks

| Track | Source | Distribution | Version |
|---|---|---|---|
| CLI (`agentic-pm`) | `src/` | npm | `package.json` |
| Templates | `templates/` | GitHub Releases | Supplied to the build as `VERSION` |

CLI changes are released to npm separately. GitHub template releases contain ZIP bundles for `agents` and `claude`, plus `apm-release.json`. Keep locally packed CLI tarballs out of those releases.

To build templates locally, supply their version:

```bash
VERSION=1.1.0 npm run build:release
```

The release workflow supplies this value. It increments the latest stable template tag's patch version by default; provide an override for a minor, major or pre-release version. Use a new tag for every release: reusing one replaces its assets without offering existing installs an update.

## Compatibility

Official template installs stay within the CLI's major version. A release can also require a minimum CLI version through `build.minCliVersion` in `build/build-config.json`; the build records it in the manifest.

CLI 1.0.3 checks that minimum before validating the rest of the manifest. CLI 1.0.2 checks it only after validation, so an unfamiliar manifest may produce a validation error instead of an upgrade message. Earlier CLIs ignore the minimum; a major version change is required to exclude them.

Custom repositories have no major-version filter, but their manifests must still pass validation and the minimum CLI check. See [SECURITY.md](SECURITY.md) before installing custom bundles.

## Pre-releases and updates

Pre-releases use tags such as `v1.1.0-test-5` and sort before the corresponding stable release. They are excluded from the default install:

```bash
apm init --tag v1.1.0-test-5
```

From a stable official install, `apm update` selects the newest stable release. From a pre-release, it asks before moving to a newer stable or pre-release. For custom installs, it offers newer releases from the same repository.

npm's `latest` tag is reserved for the stable CLI. A published CLI pre-release must be installed by its explicit version.

## Installation metadata

`.apm/metadata.json` records the repository, release, installed targets, timestamps and installed file paths. Official targets are `agents` and `claude`; the manifest and metadata retain the `assistants` key.

A manifest target can declare `replaces` to consolidate old IDs during update. Exact matches take precedence. Cleanup uses the original file lists, and the archive preserves the old installation metadata. Custom repositories can keep their IDs or declare replacements.

## Changelog

[CHANGELOG.md](CHANGELOG.md) lists both tracks, newest first. Headings name `CLI vX.Y.Z`, `Templates vX.Y.Z`, or both when released together. Pending changes use `Unreleased` instead of a date.
