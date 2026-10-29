# Versioning

APM versions its CLI and templates separately using [Semantic Versioning](https://semver.org/). They share a major version; minor and patch versions can differ.

| Track | Source | Distribution | Version |
|---|---|---|---|
| CLI (`agentic-pm`) | `src/` | npm | `package.json` |
| Templates | `templates/` | GitHub Releases | Build variable `VERSION` |

## Compatibility and updates

Official template releases must match the CLI's major version and meet the release's `minCliVersion`. Older CLIs may ignore that minimum or report a manifest error; keep the CLI up to date.

`apm update` archives the current session before installing a new release:

- Stable official installs update to the newest stable release.
- Pre-release installs ask which newer stable or pre-release to use.
- Custom installs offer newer releases from the same repository, without a major-version filter. Manifest and minimum-CLI checks still apply.

`apm status` shows the installed versions. Use `apm init --tag <tag>` to install a specific release, including a pre-release.

## Publishing

Set the CLI version in `package.json` and publish to npm. Reserve npm's `latest` tag for stable releases; install CLI pre-releases by explicit version.

Supply the template version when building:

```bash
VERSION=1.1.0 npm run build:release
```

Publish the target ZIPs and `apm-release.json` to GitHub Releases. The release workflow increments the latest stable tag's patch version by default; supply an override for minor, major or pre-release versions. Use a new tag for each release.

Record changes in [CHANGELOG.md](CHANGELOG.md), naming the CLI version, template version or both. Use `Unreleased` for pending changes.
