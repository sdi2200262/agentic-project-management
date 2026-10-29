---
name: apm-assist
description: Explain APM, answer documentation questions, inspect installations and help with setup or migration.
---

# APM Assist

Use this skill to answer questions about APM and help with installation or migration. Planner, Manager and Worker duties run in their own dedicated chats. To start a session, follow the [Getting Started](https://agentic-project-management.dev/docs/getting-started) guide and direct the User to a new Planner chat.

## 1. APM Overview

APM coordinates work across AI assistants using planning documents, a file-based Message Bus and persistent work records. The User delivers messages between chats and approves decisions.

- The **Planner** explores the workspace, questions the User and writes the Spec, Plan and Rules for separate approval.
- The **Manager** assigns Tasks, reviews results and maintains the Tracker and Memory.
- **Workers** execute and validate their Task Prompts, write Task Logs and report to the Manager. They work from their prompts and Rules.

The session's records live in `.apm/`. A Handoff moves a Manager or Worker to a new conversation; recovery rebuilds context after compaction. A session can cover part of a larger goal and can be archived for later planning.

Install the CLI with `npm install -g agentic-pm`. The `agents` target uses `.agents/skills/` and `AGENTS.md`; `claude` supports Claude Code. Both can be installed with `apm init -a agents claude`.

## 2. Documentation

Fetch the page relevant to the question and match it to the installed release. Use [llms.txt](https://agentic-project-management.dev/llms.txt) for the current documentation index, or [llms-full.txt](https://agentic-project-management.dev/llms-full.txt) for the complete text.

| Page | URL path |
|---|---|
| Introduction | `/docs/introduction` |
| Getting Started | `/docs/getting-started` |
| Quick Reference | `/docs/quick-reference` |
| Agent Roles | `/docs/agent-roles` |
| Agent Orchestration | `/docs/agent-orchestration` |
| Workflow Overview | `/docs/workflow-overview` |
| Prompt Engineering | `/docs/prompt-engineering` |
| Context Engineering | `/docs/context-engineering` |
| CLI Guide | `/docs/cli` |
| Troubleshooting and migration | `/docs/troubleshooting-guide` |
| Customisation | `/docs/customisation-guide` |
| Security | `/docs/security` |
| Model choice, cost and workflow tips | `/docs/tips-and-tricks` |
| Research | `/research` |

Paths use `https://agentic-project-management.dev`. Source documentation is in [apm-website](https://github.com/sdi2200262/apm-website/tree/main/docs); framework source and releases are in [agentic-project-management](https://github.com/sdi2200262/agentic-project-management).

## 3. Installation State

When the setup matters to the answer:

1. Read `.apm/metadata.json` for `source`, `repository`, `releaseVersion`, `cliVersion`, `assistants` (installed target IDs) and `installedFiles`.
2. Run `apm --version` for the current CLI version; metadata records the CLI used at installation.
3. Inspect relevant installed files and session records. Missing or unfamiliar metadata needs investigation against the installed release's source before choosing an update procedure.
4. If APM is not installed, guide the User through `apm init` or `apm custom` as appropriate.

## 4. Migration

For an installation that needs migration:

1. Inspect its metadata, session records, installed instructions and Git worktrees. Read the relevant release documentation and source to identify the required changes.
2. Explain the installed and target versions, what will be preserved or replaced, and the proposed steps. Obtain approval before modifying the installation.
3. Pause active agents. Use supported CLI update/archive commands where available. If manual steps are needed, identify them explicitly. Preserve session records and unfinished work, use Git for worktree moves, and verify preservation before cleanup.
4. Remove only identified APM-installed files. Keep User files and content whose ownership is uncertain; ask about unresolved cases. Preserve the source version in archived metadata and any summary.
5. Complete the update or fresh installation, check it with `apm status`, and direct the User to a new Planner chat. Earlier archives remain available as planning context.

## 5. Answers

Ground the answer in the User's installation and the relevant documentation. State the result, needed action and material limits, then link to the source page. If source and documentation disagree, identify the versions involved and verify behavior against the matching code or templates.
