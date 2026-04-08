# Agentic Project Management (APM)

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![npm](https://img.shields.io/npm/v/agentic-pm)](https://www.npmjs.com/package/agentic-pm) [![GitHub Release](https://img.shields.io/github/v/release/sdi2200262/agentic-project-management)](https://github.com/sdi2200262/agentic-project-management/releases)

*Manage complex projects with a team of AI agents, smoothly and efficiently.*

## What is APM?

APM is an open-source framework for managing ambitious software projects with AI assistants. Instead of working in a single, increasingly chaotic chat, APM structures your work into a coordinated system where different AI agents handle planning, coordination, and execution as a team.

As conversations grow, AI context degrades. The assistant loses track of requirements, produces bad code, and hallucinates details. For substantial projects, this makes sustained progress nearly impossible.

To address this, APM coordinates three specialized agent types, each operating in its own context with only the information it needs:

- **Planner** - Conducts structured project discovery and decomposes requirements into three planning documents: a Spec (what to build), a Plan (how work is organized), and Rules (how work is performed).
- **Manager** - Coordinates execution by assigning Tasks to Workers, reviewing completed work, and maintaining project state. Operates on execution summaries rather than raw code.
- **Workers** - Execute specific Tasks with tightly scoped context. Each Worker receives self-contained Task Prompts with everything it needs, executes, validates, and reports back.

Project state lives in structured files outside any agent's context. When a conversation ends or an agent reaches its limits, a Handoff transfers working knowledge to a fresh instance as needed. This also allows completed APM sessions to be archived and their context carried forward to new ones.

You mediate every exchange between agents, keeping the workflow platform-agnostic and every interaction visible. Each agent guides you through the workflow at every step, telling you exactly which command to run, in which conversation, and what to do next.

<p align="center">
  <img src="assets/apm-social-card.png" alt="Agentic Project Management" width="800"/>
</p>

## Quick Start

APM supports Claude Code, Codex CLI, Cursor, GitHub Copilot, Gemini CLI, and OpenCode.

Install the CLI:

```bash
npm install -g agentic-pm
```

Navigate to your project directory and initialize:

```bash
apm init
```

Select your AI assistant when prompted. The CLI installs commands, guides, skills, and project artifact templates into your workspace.

Next, open your AI assistant and run:

```
/apm-1-initiate-planner
```

You can also provide context about what you want to build:
```
/apm-1-initiate-planner I want you to build Claude Opus 5. Make no mistakes.
```

The Planner collaborates with you through project discovery and creates the planning documents for you to review. Once approved, it guides you to open a new conversation and run `/apm-2-initiate-manager` to begin coordinated execution. From there, each agent directs you through the workflow step by step.

For the full walkthrough, see the [Getting Started](https://agentic-project-management.dev/docs/getting-started) guide.

## Documentation

Full documentation is available at [agentic-project-management.dev](https://agentic-project-management.dev):

- **[Introduction](https://agentic-project-management.dev/docs/introduction)** - What APM is and how it works
- **[Getting Started](https://agentic-project-management.dev/docs/getting-started)** - Installation through first task cycle
- **[Agent Types](https://agentic-project-management.dev/docs/agent-types)** - Planner, Manager, and Worker roles
- **[Agent Orchestration](https://agentic-project-management.dev/docs/agent-orchestration)** - Communication, coordination, Memory, and Handoff mechanics
- **[Workflow Overview](https://agentic-project-management.dev/docs/workflow-overview)** - Every procedure in detail

The site also covers advanced topics like how APM's prompt and context engineering works under the hood, design principles behind the multi-agent coordination, tips and tricks for model selection and cost optimization, troubleshooting, and customization.

## CLI

| Command | Description |
|---------|-------------|
| `apm init` | Initialize with official releases |
| `apm custom` | Install from custom repositories |
| `apm update` | Update to latest compatible version |
| `apm archive` | Archive current session or manage archives |
| `apm add` / `apm remove` | Add or remove assistant(s) |
| `apm status` | Show installation state |

See the [CLI Guide](https://agentic-project-management.dev/docs/cli) for full details.

## Customization

APM supports custom repositories for teams that want to modify the workflow. Fork the repo (for upstream sync) or use "Use this template" (for a clean start), adjust templates, build, release, and install with `apm custom -r owner/repo`. A [customization skill](skills/apm-customization/) is included to guide AI agents through the process.

See the [Customization Guide](https://agentic-project-management.dev/docs/customization-guide) for details.

## APM Assist

The [`apm-assist`](skills/apm-assist/) skill turns your AI assistant into an APM-aware helper. Install it into any project and your assistant can explain how APM works, answer questions by reading the live documentation, detect your installation state and version, and guide migration from v0.5.x. It works with any supported platform.

```bash
# Claude Code example
mkdir -p .claude/skills/apm-assist
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-assist/SKILL.md \
  -o .claude/skills/apm-assist/SKILL.md
```

See the [standalone skills directory](skills/) for other platforms.

## Migrating from v0.5.x

v1.0.0 is a ground-up redesign - the workflow, file structure, CLI, and agent roles all changed significantly. The pre-v1 codebase is preserved on the [`v0.5.x`](https://github.com/sdi2200262/agentic-project-management/tree/v0.5.x) branch for reference.

The [Troubleshooting Guide](https://agentic-project-management.dev/docs/troubleshooting-guide#migrating-from-v05x) documents the recommended migration procedure. The `apm-assist` skill above can also walk you through it interactively.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Report bugs or suggest features via [GitHub Issues](https://github.com/sdi2200262/agentic-project-management/issues). Reach out on Discord: `cobuter_man`.

## Versioning

CLI and template releases version independently but share major version for compatibility. See [VERSIONING.md](VERSIONING.md) for details.

## License

Licensed under the **Mozilla Public License 2.0 (MPL-2.0)**. APM is free for all uses including commercial. Improvements to core APM files must be shared back with the community. See [LICENSE](LICENSE) for full details.

Versions prior to v0.4.0 were released under the MIT license. The license was updated to MPL-2.0 starting with v0.4.0.

<p align="center">
  <a href="https://github.com/sdi2200262" target="_blank">
    <img src="assets/cobuter-man.png" alt="CobuterMan" width="150"/>
  </a>
</p>
