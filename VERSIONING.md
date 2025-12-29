# APM Versioning Strategy

Agentic Project Management (APM) employs a dual versioning system to clearly distinguish between updates to the core CLI tool and updates to the agent prompt & guide templates. This ensures users can reliably manage both the delivery mechanism (CLI) and the agent content (templates).

## Core Components and Versioning Tracks

1.  **APM CLI (`agentic-pm` on NPM):**
    * **Scope:** The command-line tool itself, located in the `src/` directory. This includes the `apm init` and `apm update` commands and associated logic.
    * **Versioning:** Follows **Semantic Versioning (SemVer)** (e.g., `0.5.0`, `0.5.1`, `0.6.0`).
    * **Trigger:** A new version is released **only** when changes are made to the code within the `src/` directory.
    * **Release Mechanism:** Published to the NPM registry. A corresponding Git tag (e.g., `v0.5.1`) is created in the repository.

2.  **APM Templates (Prompts & Guides):**
    * **Scope:** The agent prompts and workflow guides located in the `templates/` directory and distributed as `.zip` bundles. These define the context and behavior of the agents in the APM workflow.
    * **Versioning:** Uses the **current CLI version** plus **SemVer build metadata** (e.g., `v0.5.0+templates.1`, `v0.5.0+templates.2`).
    * **Trigger:** A new build is released **only** when changes are made to files within the `templates/` directory.
    * **Release Mechanism:** Built assets (`.zip` bundles for each supported AI assistant) are published as **GitHub Releases**. A corresponding Git tag (e.g., `v0.5.0+templates.2`) is created in the repository, pointing to the commit containing the template changes.

3.  **Build System & Configuration:**
    * **Scope:** Files related to the build process (`scripts/`, `build-config.json`), testing, and CI/CD workflows (`.github/workflows/`).
    * **Versioning:** Changes to these files **do not trigger new version numbers, tags, or releases.** They are tracked via standard Git commit history.

## CLI Behavior for Users

The CLI manages template versions based on compatibility with the running CLI version:

* **`apm init` (default behavior):**
    * Automatically finds and installs the latest template tag compatible with the *currently running CLI version*.
    * For example, if you're running CLI `0.5.0`, it will find the latest `v0.5.0+templates.N` tag available.
    * This ensures that templates are always compatible with your CLI installation.

* **`apm init --tag <tag>` (specific version):**
    * Allows installing a *specific* template tag by explicitly providing it (e.g., `apm init --tag v0.5.0+templates.1`).
    * This can bypass the default compatibility check and install any specified template version.
    * The CLI may issue a warning if the base version of the specified tag doesn't match your current CLI version, as this could lead to incompatibilities.

* **`apm update`:**
    * Finds the latest template tag compatible with the *currently running CLI version*.
    * Compares it to the installed template version (stored in `.apm/metadata.json`) using the build number (`+templates.N`).
    * Only updates if a newer compatible build exists (higher build number with matching base version).
    * If newer templates exist but require a different CLI version (e.g., templates for `v0.6.0` when you're running `0.5.1`), the CLI will inform you that a CLI update is available via `npm update -g agentic-pm` to access those newer templates.

## User Impact

### Workflow Implications

The dual versioning system provides a clear separation of concerns and practical benefits:

* **CLI Updates:** Users update the CLI independently via NPM (e.g., `npm update -g agentic-pm`). CLI updates bring new features, bug fixes, and improvements to the tool itself. Since the CLI version determines which templates are compatible, updating the CLI may "unlock" access to newer template versions.

* **Template Updates:** Template updates are delivered independently via GitHub Releases and managed through `apm update`. Users can receive improved prompts and guides without needing to update the CLI package, as long as the templates match their current CLI version. This allows for rapid iteration on agent behavior without disrupting the CLI tool's stability.

This dual system ensures that CLI stability is maintained with standard SemVer, while allowing for more frequent iteration and delivery of the agent templates via GitHub Releases and the `apm update` command.