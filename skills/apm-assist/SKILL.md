---
name: apm-assist
description: Explain APM, answer documentation questions, inspect installations and help with setup or migration.
---

# APM Assist

Use this skill to answer questions about APM and help with installation or migration. Planner, Manager and Worker duties run in their own dedicated chats. To start a session, follow the [Getting Started](https://agentic-project-management.dev/docs/getting-started) guide and direct the User to a new Planner chat.

## 1. APM Overview

APM is a spec-driven multi-agent framework for AI-assisted software engineering. Planning documents preserve intent, separate agent conversations distribute context, and persistent records support work beyond a conversation's context window.

- The **Planner** explores the workspace, questions the User and writes the Spec and Plan for separate approval. It proposes needed updates to lasting workspace guidance in `AGENTS.md`.
- The **Manager** coordinates implementation, carries out Tasks through subagents or assigns them to Worker conversations, reviews results and maintains the planning documents, Tracker and Memory.
- **Workers** execute and validate their Task Prompts, write Task Logs and report to the Manager. They work from self-contained prompts, workspace instructions and permitted dependency context.

The Planner and Manager recommend involvement that helps the User understand and retain authority over the work. The User chooses its form and frequency, for example automated Manager execution, Worker conversations the User coordinates by delivering Message Bus notifications, or User-led work with assistance, and can combine them.

The session's records live in `.apm/`. A Handoff moves a Manager or Worker to a new conversation; recovery rebuilds context after compaction. A session can cover part of a larger goal and can be archived for later planning.

Install or upgrade the CLI with `npm install -g agentic-pm@latest`, and compare `apm --version` with the release's `minCliVersion`.

| Targets | Format and startup |
|---|---|
| `agents`, `claude` | Separate skills; invoke `apm-1-initiate-planner` in a new chat. |
| `agents-single-skill`, `claude-single-skill` | Single skill (research preview); invoke `apm` in a new chat and ask it to start planning. |

`agents` targets use `.agents/skills/` and `AGENTS.md`; `claude` targets support Claude Code. Both formats give agents the same workflow and `.apm/` records. Install one format for `agents` and one for `claude`, for example `apm init -a agents claude-single-skill`. With the single skill installed, an agent may suggest APM and starts a session only with the User's request or agreement.

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

1. Inspect its metadata, session records, installed instructions and Git worktrees. Read the relevant changelog entries, release notes and source to identify compatibility requirements and migration steps, including any manual updates to workspace guidance.
2. Explain the installed and target versions, what will be preserved or replaced, and the proposed steps. Obtain approval before modifying the installation.
3. Pause active agents and upgrade the CLI. Use `apm update` or `apm archive` where they apply, and name any manual steps. `apm update` archives the session and installs fresh templates. Preserve session records and unfinished work, use Git for worktree moves, and verify preservation before cleanup.
4. Remove only identified APM-installed files. Keep User files and content whose ownership is uncertain; ask about unresolved cases. Preserve the source version in archived metadata and any summary.
5. Complete the update or fresh installation, check it with `apm status`, and direct the User to a new Planner chat. Earlier archives remain available as planning context.

### Changing Formats

Updates keep the installed format. To switch, pause affected chats and preserve customised installed instructions, then run `apm remove -a <old-target>` and `apm add -a <new-target>`. Both keep `.apm/` records, and `add` installs the same release. Check with `apm status` and continue in fresh chats. On a target conflict, explain the incompatible pair and let the User choose which target to remove; `--force` does not bypass the check.

## 5. Answers

Ground the answer in the User's installation and the relevant documentation. State the result, needed action and material limits, then link to the source page. If source and documentation disagree, identify the versions involved and verify behavior against the matching code or templates.
