<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/readme-header-dark.svg"/>
  <img src="assets/readme-header-light.svg" alt="Agentic Project Management (APM) — A Spec-Driven Multi-Agent Framework for AI-Assisted Software Engineering" width="1100"/>
</picture>

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![npm](https://img.shields.io/npm/v/agentic-pm)](https://www.npmjs.com/package/agentic-pm) [![GitHub Release](https://img.shields.io/github/v/release/sdi2200262/agentic-project-management)](https://github.com/sdi2200262/agentic-project-management/releases)

APM is an open-source framework for managing ambitious software projects with AI assistants. On long tasks, the LLM behind your agent suffers from context decay and context pressure as its conversation grows. APM counters the first by recording the project's intent in planning documents, and the second by splitting the work among agents in separate conversations.

You remain responsible for the software your agents build. APM encourages you to stay involved enough to understand the work and keep authority over it, and leaves the form and frequency of that involvement to you. We call this productive friction.

## Overview

An APM session runs in two phases.

During **planning**, the **Planner** explores your codebase and questions you about purpose, requirements, and constraints. Once you approve its understanding, it writes the **Spec** (what to build) and the **Plan** (how the work is divided), each for your review and approval. It also proposes any needed updates to lasting workspace guidance in `AGENTS.md`, creating the file if it's missing.

During **implementation**, the **Manager** coordinates the work, reviews results, and records the session's progress. **Workers** carry out the Tasks, either as the Manager's subagents or in separate conversations, then validate the work and report back. Each Task's outcome is logged in the session's work history.

The Planner and Manager recommend how you stay involved, based on the nature of the work and your experience and preferences. You decide the arrangement: automated execution through the Manager, Worker conversations you coordinate by passing on their assignments and reports, work you carry out yourself with agent assistance, or any mix. You also choose what to review and when, and can change the arrangement as the work goes.

The session's state lives in shared files outside any conversation: the planning documents, the **Tracker** (the session's progress), and **Memory** (its work history). When an agent's context fills, a **Handoff** moves its role to a fresh conversation that resumes from these files. When the session ends, you can archive them for the next session's Planner to build on.

## Getting started

APM works with Claude Code and any agents that use `AGENTS.md` and `.agents/skills/`, such as Codex, Cursor and GitHub Copilot. Install the `agentic-pm` CLI with Node.js 18 or later:

```bash
npm install -g agentic-pm
```

Run `apm init` in your project folder. Choose `claude` for Claude Code or `agents` for other assistants.

To start planning, invoke `apm-1-initiate-planner` in a new chat and describe what you want to build or change. For example, in Claude Code:

```text
/apm-1-initiate-planner Let's plan this Jira ticket I had to deliver yesterday.
```

The agents will guide you through the workflow's steps. See [Getting Started](https://agentic-project-management.dev/docs/getting-started) for the full walkthrough. The rest of the [documentation](https://agentic-project-management.dev) describes the workflow and agent roles in more detail, explains APM's prompt and context engineering, and includes other practical guides.

> [!NOTE]
> Two additional research-preview targets, `claude-single-skill` and `agents-single-skill`, provide the same workflow through one `apm` skill. The preview explores whether a single skill makes the workflow more flexible.
>
> Choose one format for each assistant you use. You can mix formats: `apm init -a agents claude-single-skill`.
>
> To start planning, invoke `apm` in a new chat. For example, in Claude Code:
>
> ```text
> /apm Let's plan this Jira ticket I had to deliver yesterday.
> ```

### Updating

Before updating, check the [changelog](CHANGELOG.md) for migration notes, upgrade the CLI with `npm install -g agentic-pm@latest`, and pause active agents with their work preserved. `apm update` archives the session and installs fresh templates. Start a new Planner chat afterward.

## CLI

| Command | Description |
|---------|-------------|
| `apm init` | Install an official release |
| `apm custom` | Install from a custom repository |
| `apm update` | Archive the current session and install the newest stable release |
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
