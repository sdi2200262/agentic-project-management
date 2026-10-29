# Security

## Bundle trust

The CLI extracts release ZIPs into your project. Bundles can overwrite any project file at a path they contain, including source code and configuration. Installed instructions can direct an AI assistant to run commands, access data or change files when used.

Installation extracts files without running bundle scripts. The CLI rejects entries whose paths resolve outside the project and skips entries under `.apm/archives/`. It does not scan file contents or verify release signatures.

## Custom repositories

Review the repository and its bundle contents before installing. Use a known release tag with `--tag`, and check the source and version in `.apm/metadata.json`.

`apm custom`, `apm add` and `apm update` ask for a security acknowledgement unless you saved the repository with `skipDisclaimer` enabled. That setting suppresses the prompt on later installs and updates; it does not verify the repository. Review saved sources with `apm custom --list`.

See the [Security Guide](https://agentic-project-management.dev/docs/security) for more detail.

## Reporting vulnerabilities

Report security issues through [GitHub Issues](https://github.com/sdi2200262/agentic-project-management/issues) or contact the maintainers directly. Share sensitive details privately until the issue is addressed.
