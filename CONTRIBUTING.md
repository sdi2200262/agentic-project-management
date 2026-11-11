# Contributing to APM

Contributions can improve the workflow, templates, CLI, build system, documentation or standalone skills.

## Report an issue

Search [existing issues](https://github.com/sdi2200262/agentic-project-management/issues) first. For a bug, include:

- CLI and template versions, Node.js and npm versions.
- Assistant, installation target and affected role.
- Reproduction steps, expected behavior and actual behavior.
- Relevant errors or example interactions.

Describe the use case and proposed behavior for feature requests. Follow [SECURITY.md](SECURITY.md) for vulnerabilities.

## Set up

Fork and clone the repository, then install dependencies and create a branch:

```bash
npm ci
git checkout -b feature/description
```

## Make changes

| Area | Location |
|---|---|
| Runtime skills, guides and initial artifacts | `templates/` |
| Template authoring standards | `templates/_standards/` |
| Build system and target layouts | `build/` |
| CLI | `src/` |
| Standalone skills | `skills/` |
| Website documentation | [apm-website](https://github.com/sdi2200262/apm-website), under `docs/` |

For workflow changes, update `WORKFLOW.md` first, then the affected runtime files. Follow `TERMINOLOGY.md`, `STRUCTURE.md` and `WRITING.md`. The [customisation skill](skills/apm-customization/SKILL.md) explains the source layout and build placeholders.

Use plain-English assistant actions in templates. The same sources build every target.

## Validate and submit

For template or build changes, replace `<version>` with the template version you intend to test:

```bash
VERSION='<version>' npm run build:release
```

Inspect all four ZIPs and the manifest in `dist/` using the [build checks](skills/apm-customization/SKILL.md#3-build-and-check). Exercise changed workflows with an assistant. For CLI changes, run the affected commands and check their files and output; use `npm pack` to check the package.

Submit a pull request describing the change, related issues and validation performed. Use concise `type: description` commit titles, with an optional scope. Record changes in [CHANGELOG.md](CHANGELOG.md) under `Unreleased`, naming the CLI version, template version or both.

Contributions are licensed under [MPL-2.0](LICENSE). Preserve copyright and license notices.

For questions, open an issue or contact `cobuter_man` on Discord.

## Releases

The CLI (`src/`) is published to npm, with its version in `package.json`. Templates (`templates/`) are published to GitHub Releases, with the version given to the build. Both follow [Semantic Versioning](https://semver.org/) and share a major version. Each template release sets `minCliVersion` in `build/build-config.json`. Raise it when the templates depend on newer CLI behavior.

Reserve npm's `latest` tag for stable CLI releases. For templates, publish every target ZIP and `apm-release.json` from `dist/`, and mark research-preview targets in the release notes. The release workflow bumps the latest stable tag's patch version by default; supply the version for minor, major or pre-releases.
