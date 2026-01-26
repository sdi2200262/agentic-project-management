# Agentic Project Management (APM)

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![agentic-pm CLI version](https://img.shields.io/badge/agentic--pm_CLI-v1.0.0-blue)](https://www.npmjs.com/package/agentic-pm) [![APM Releases](https://img.shields.io/badge/APM_Releases-v1.0.0-blue)](https://github.com/sdi2200262/agentic-project-management/releases) [![Website](https://img.shields.io/badge/website-agentic--project--management.dev-blue)](https://agentic-project-management.dev)

*Manage complex projects with a team of AI assistants, smoothly and efficiently.*

## What is APM?

**Agentic Project Management (APM)** is a AI workflow framework that brings real-world project management principles into your AI-assisted workflows. It addresses a fundamental challenge of LLMs: **context window limitations**. 

APM uses various prompt and context engineering techniques, coordinating a team of specialized AI agents in a structured way so that you can maintain productive AI-assisted work for longer periods before facing model hallucinations and needing to start over. When context window does fill up, APM ensures a smooth transition to a "fresh" chat session without important context loss.

Think of it like having a project planner, manager, developers, and ad-hoc specialists all powered by AI and working together under your guidance.

<p align="center">
  <img src="assets/apm-banner.png" alt="apm-banner" style="border-radius: 16px; display: block; margin-left: auto; margin-right: auto;" />
</p>

## Installation

Install APM CLI globally via NPM:

```bash
npm install -g agentic-pm
```

Or install locally in your project:

```bash
npm install agentic-pm
```

<details>
<summary><strong>Supported AI Assistants</strong></summary>

APM supports the following AI assistants and IDEs:

| Assistant           | Type                    | Format   | Command Directory      |
|---------------------|-------------------------|----------|------------------------|
| Cursor              | IDE & CLI               | Markdown | `.cursor/commands`     |
| Claude Code         | IDE & CLI               | Markdown | `.claude/commands`     |
| GitHub Copilot      | IDE                     | Markdown | `.github/prompts`      |
| Windsurf            | IDE                     | Markdown | `.windsurf/workflows`  |
| Roo Code            | IDE                     | Markdown | `.roo/commands`        |
| Kilo Code           | IDE                     | Markdown | `.kilocode/workflows`  |
| Qwen Code           | CLI                     | TOML     | `.qwen/commands`       |
| opencode            | CLI                     | Markdown | `.opencode/command`    |
| Gemini CLI          | CLI                     | TOML     | `.gemini/commands`     |
| Auggie CLI          | CLI                     | Markdown | `.augment/commands`    |
| Google Antigravity  | IDE                     | Markdown | `.antigravity/prompts` |

When you run `apm init`, simply select your AI assistant from the list, and APM will automatically configure the appropriate command structure for your environment.

</details>

## Getting Started

Follow these simple steps to start using APM in your project:

1. **Navigate to your project directory** in your terminal.

2. **Run the APM initialization command:**
   ```bash
   apm init
   ```
   
   By default, `apm init` automatically finds and installs the latest template version compatible with your current CLI version. To install a specific template version (e.g., for rollbacks or testing), you can use the `--tag` option:
   ```bash
   apm init --tag v0.5.0+templates.1
   ```

3. **Select your AI assistant** when prompted (e.g., Cursor, Copilot, Claude Code, etc.).

4. **APM automatically installs:**
   - `.apm/` directory with APM guides and initial assets
   - APM slash commands in your AI assistant's command directory
   - Necessary installation meta-data

5. **Open your AI assistant chat** and enter the slash command:
   ```
   /apm-1-initiate-planner
   ```

6. **Follow the established APM workflow:** <br/>
Planning Phase (Project Discovery & Planning) → Implementation Phase (Plan Execution)

For step-by-step guidance with video coverage, see the **[Getting Started Guide](https://agentic-project-management.dev/docs/getting-started)**. For detailed CLI behavior and policies, see the **[CLI Guide](https://agentic-project-management.dev/docs/cli)**.

## Customization

APM supports two customization approaches:
- **Local edits:** Modify files in `.apm/` after running `apm init`
- **Custom repositories:** Use `apm custom` to install templates from your own or third-party custom repositories

See [Modifying APM](https://agentic-project-management.dev/docs/modifying-apm) for detailed customization guidance.

## Documentation

Full documentation is available at [agentic-project-management.dev](https://agentic-project-management.dev).

**Essential reading:**
- **[Getting Started](https://agentic-project-management.dev/docs/getting-started)** - Step-by-step setup and first session guide
- **[Workflow Overview](https://agentic-project-management.dev/docs/workflow-overview)** - Complete workflow walkthrough with process diagrams
- **[CLI Guide](https://agentic-project-management.dev/docs/cli)** - Detailed CLI usage and commands

For a complete documentation index, visit the **[Documentation Hub](https://agentic-project-management.dev/docs)**.

## Contributing

APM is an open-source project, and your contributions are welcome! Whether it's improving prompts, enhancing documentation, suggesting new features, or reporting bugs, please feel free to open an issue or submit a pull request.

**Ways to contribute:**
- **Report bugs or workflow issues**
- **Suggest features or improvements**
- **Improve documentation**
- **Share customizations/adaptations** for specific domains or use-cases
- **Extend support** for new AI assistants

**Areas particularly seeking contributions:**

- **Assistant Support:** Help expand APM support for additional AI assistants beyond the ones currently supported.
- **Delegation Skills:** The framework includes Debug and Research Delegation Skills, but there's opportunity to create specialized Delegation Skills for other context-intensive tasks such as testing automation, security analysis, data extraction and more.
- **Workflow Optimizations:** Share improvements to agent procedures or memory system enhancements.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and contribution process.

## Versioning

APM uses a decoupled versioning system where the CLI and templates version independently but share the same major version number. The CLI follows Semantic Versioning on NPM, while templates are released via GitHub Releases. See [VERSIONING.md](VERSIONING.md) for details.

## Security

When using custom template repositories with `apm custom`, security warnings are displayed to inform users about potential risks. APM validates template manifests (`apm-release.json`) before installation. See [SECURITY.md](SECURITY.md) for our security policy.

## License

This project is licensed under the **Mozilla Public License 2.0** - see the [LICENSE](LICENSE) file for full details.

### License Update: MIT → MPL-2.0

As APM has matured from an experimental framework into a comprehensive multi-agent coordination system with growing commercial interest, its license has been upgraded from MIT to **Mozilla Public License 2.0 (MPL-2.0)**. This change helps protect the Open Source Software community while maintaining full commercial compatibility.

**What this means:** APM remains completely free and Open Source for all uses (personal, commercial, enterprise). You can build proprietary products using APM, integrate it into commercial IDEs, and create paid services around it. The only requirements are that improvements to core APM files must be shared back with the community, and that you attribute the creators and the APM project as required by the MPL 2.0 license. Make sure to read the [LICENSE](LICENSE) file for full details.

<p align="center">
  <a href="https://github.com/sdi2200262" target="_blank">
    <img src="assets/cobuter-man.png" alt="CobuterMan" width="150"/>
  </a>
</p>