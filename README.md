<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/readme-header-dark.svg"/>
  <img src="assets/readme-header-light.svg" alt="Agentic Project Management (APM) — A Spec-Driven Multi-Agent Framework for AI-Assisted Software Engineering" width="1100"/>
</picture>

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![npm](https://img.shields.io/npm/v/agentic-pm)](https://www.npmjs.com/package/agentic-pm) [![GitHub Release](https://img.shields.io/github/v/release/sdi2200262/agentic-project-management)](https://github.com/sdi2200262/agentic-project-management/releases)

APM is an open-source framework for AI-assisted software development. As an agent's conversation grows, its LLM suffers from context decay and context pressure. APM counters the first by recording the project's intent in planning documents, and the second by splitting the work among agents in separate conversations.

The workflow is flexible. You can let the agents carry most of the work, or step in wherever and however you see fit, as productive friction that helps you keep authority over, and understanding of, the software being built.

## Overview

An APM session starts with a conversation where a **Planner** gathers context from your workspace and other relevant sources, then works with you to define what the session should achieve. Once you approve its understanding, it writes a **Spec** for what to build and a **Plan** for how to build it, each for your review.

Afterwards, in a new conversation, a **Manager** sends assignments to its subagents or to **Workers** in separate conversations, reviews their work, and records the session's progress. It also maintains the Spec and Plan as the session progresses. Larger changes need your agreement.

Each Worker takes the assignments of one area of the project, completes and validates them, logs the outcome, and reports back. Worker conversations and the Manager's communicate through a file-based **Message Bus**, where you mediate each exchange.

The session's state lives in shared files that outlast any conversation. The planning documents hold the session's intent, a **Tracker** holds its progress, and file-based **Memory** accumulates its history. When an agent's context fills, a **Handoff** moves its role to a fresh conversation that resumes from these files. When the session ends, you can archive it and use its documents as context for the next session's Planner.

You decide with the Planner how you take part in implementation and how the work is carried out: the Manager uses subagents for more automation, you mediate coordination with Workers for more control, you take on assignments yourself, or any mix of these. You can change this agreement with the Manager at any time.

## Getting started

APM works with Claude Code and any agents that use `AGENTS.md` and `.agents/skills/`, such as Codex, OpenCode and Cursor. Install the `agentic-pm` CLI with Node.js 18.17 or newer in the 18.x series, or Node.js 20.5 or later:

```bash
npm install -g agentic-pm
```

Run `apm init` in your project folder. Choose `claude` for Claude Code or `agents` for other assistants.

To start planning, invoke `apm-1-initiate-planner` in a new chat and describe what you want to build or change. For example, in Claude Code:

```text
/apm-1-initiate-planner Plan the Jira ticket I owe.
```

The agents will guide you through the workflow's steps. See [Getting Started](https://agentic-project-management.dev/docs/getting-started) for the full walkthrough. The rest of the [documentation](https://agentic-project-management.dev) describes the workflow and agent roles in more detail, explains APM's prompt and context engineering, and includes other practical guides.

> [!NOTE]
> Two additional research-preview installation targets, `claude-single-skill` and `agents-single-skill`, provide the same workflow through one `apm` skill. The preview explores whether a single skill makes the workflow more flexible.
>
> Choose one format for each assistant you use. You can mix formats: `apm init -a agents claude-single-skill`.
>
> To start planning, invoke `apm` in a new chat. For example, in Claude Code:
>
> ```text
> /apm Plan the Jira ticket I owe.
> ```

### Updating

Before updating, check the [changelog](CHANGELOG.md) for migration notes, upgrade the CLI with `npm install -g agentic-pm@latest`, and pause active agents with their work preserved. `apm update` archives the session and installs fresh templates. Start a new Planner chat afterward.

## CLI

| Command | Description |
|---------|-------------|
| `apm init` | Install an official release |
| `apm custom` | Install from a custom repository |
| `apm update` | Archive the session and install an available update from its source |
| `apm archive` | Archive a session or manage archives |
| `apm add` / `apm remove` | Add or remove installation targets |
| `apm status` | Show installation state |

See the [CLI Guide](https://agentic-project-management.dev/docs/cli) for options and examples.

## Customisation

You can adapt APM's workflow through a custom repository. Fork this repository to retain its history and pull in upstream changes, or use **Use this template** to start with a clean history. Change the templates, build and publish a release, then install it with `apm custom -r owner/repo`. Review a custom repository before installing it; see [SECURITY.md](SECURITY.md).

The [Customisation Guide](https://agentic-project-management.dev/docs/customisation-guide) explains the process. The [customisation skill](skills/apm-customization/) guides your assistant through the repository's structure, conventions, build, and release steps.

## Help

The [apm-assist skill](skills/apm-assist/) helps with APM questions, installation checks and migration. See the [skills README](skills/README.md) for installation instructions.

You can ask your assistant to install it:

```text
Install the apm-assist skill into this project using the instructions at:
https://github.com/sdi2200262/agentic-project-management/blob/main/skills/README.md
```

See the [Troubleshooting Guide](https://agentic-project-management.dev/docs/troubleshooting-guide).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Report bugs or suggest features through [GitHub Issues](https://github.com/sdi2200262/agentic-project-management/issues), or reach out on Discord: `cobuter_man`.

CLI and template releases are versioned separately and share a major version for compatibility. See [Releases](CONTRIBUTING.md#releases) for details.

## Licence

Licensed under the [Mozilla Public License 2.0 (MPL-2.0)](LICENSE).

<div align="center">
  <a href="https://github.com/sdi2200262" target="_blank">
    <img src="assets/cobuter-man.png" alt="CobuterMan" width="150"/>
  </a>
</div>
