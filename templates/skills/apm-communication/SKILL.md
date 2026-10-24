---
name: apm-communication
description: Agent communication standards and file-based Message Bus protocol for structured inter-agent messaging.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading agents:** Planner, Manager, Worker

Use this skill for User-facing communication and the file-based Message Bus. Role-specific guides define delivery, reporting and artifact formats. Guide paths start at the project root; skill paths are relative to your assistant's APM folder. Resolve locations, command invocations and native calls through §5 Assistant Reference.

Non-APM agents can use the bus without joining the full workflow. See `bus-integration.md` alongside this skill.

## 2. Agent-to-User Communication

### 2.1 Direct Communication

Write plain English for the User, who already has the conversation as context. Lead with the answer, outcome, finding, proposal or question they need. Give the reasons and details needed to understand or act. State each point once and end with the last useful detail.

Use a casually formal tone, concrete subjects and active verbs. Keep sentences to one main thought and related words together. Use short paragraphs, lists for parallel items or steps, and tables for comparisons. Explain unfamiliar concepts before relying on their names. State claims at the certainty the evidence supports, with consequential limits beside them. Before sending a substantial reply, check that its opening and length fit the request.

When the User must act, specify the command, target chat and argument or the artifact to review. Put commands to run in fenced blocks, and paths and values in inline code. Resolve the assistant's command prefix and new-chat instructions through §5 Assistant Reference. At a transition, give only the context and next action needed to continue.

### 2.2 Decisions and Evidence

Present decisions and proposals with the supporting evidence, material trade-offs and uncertainty the User needs to assess them. Explain consequential choices. Match detail to complexity and the User's request.

Questions name the understanding or gap and ask for a focused answer or correction. Proposals state the intended result and any approval needed. Progress updates communicate a meaningful change or blocker. Completion reports lead with the outcome, then deliverables, validation, limits and any required action. Reviews connect findings to evidence and the next step.

A proposal does not replace a required approval. Pause at the gates defined by the relevant procedure, incorporate corrections, and obtain approval before proceeding.

### 2.3 Terminology Boundaries

Use formal APM terms such as Task, Stage, Worker and Manager naturally. Describe procedure transitions and decisions in ordinary language. Choose headings that help the User find relevant information.

## 3. Agent-to-System Communication

Follow the artifact schemas in the relevant guide and the bus protocol below. Write free-text content for its reader and purpose: a future agent needs self-contained context. Keep outcomes, evidence, paths, decisions and reasons, unresolved issues and continuation steps concrete. Verify claims against source and distinguish recorded state from assumptions. Describe the subject and the decisions its reader needs.

## 4. Message Bus Protocol

Bus directories and files are initialized during planning. A bus file is empty or holds a message awaiting delivery. Before writing an outgoing message, clear the incoming bus file after processing it. Read a bus file before writing it so the file tools recognize empty or cleared files.

### 4.1 Bus Identity Standards

Identity comes from `.apm/bus/<agent-slug>/`. Workers confirm that this directory matches their registered `agent`. Reject a message for another identity and inform the User of the mismatch.

### 4.2 Agent ID Resolution

Resolve an `[agent-id]` argument to `apm-4-check-tasks` or `apm-5-check-reports` against bus directory names: exact match, then prefix, then best plausible match. Use a unique candidate; list multiple plausible candidates and ask the User. If no directories exist, report that the Message Bus is not initialized.

### 4.3 Agent Slug Format

Convert Plan Worker names to lowercase with hyphens in place of spaces: `Frontend Agent` becomes `frontend-agent`. The Manager directory is `manager`.

## 5. Assistant Reference

APM installs the same commands, guides and skills for every assistant. Where assistants differ, use the entry for the assistant you are running in.

| Assistant | APM folder | Run a command | Rules file |
|---|---|---|---|
| Claude Code | `.claude/` | `/apm-1-initiate-planner` | `CLAUDE.md` |
| Codex CLI | `.agents/` | `$apm-1-initiate-planner` | `AGENTS.md` |
| Cursor | `.agents/` | `/apm-1-initiate-planner` | `AGENTS.md` |
| GitHub Copilot | `.agents/` | `/apm-1-initiate-planner` | `AGENTS.md` |
| Antigravity | `.agents/` | `/apm-1-initiate-planner` | `AGENTS.md` |
| OpenCode | `.agents/` | `@apm-1-initiate-planner` | `AGENTS.md` |

Guides are in `.agents/apm-guides/` for every assistant. Skills, including the commands, are in `skills/` inside the APM folder. The User types any command argument after the command name, such as `/apm-3-initiate-worker frontend-agent`.

**Explorer subagent.** Spawn it with:
- Claude Code: `Agent(subagent_type="Explore", description="...", prompt="...")`
- Codex CLI: `spawn_agent(task_name="explore_<topic>", agent_type="explorer", fork_turns="none", message="...")`
- Cursor: `Task(subagent_type="explore", description="...", prompt="...")`
- GitHub Copilot: `runSubagent` with `agentName: "Explore"` in VS Code, or `task` with `agent_type: "explore"` in Copilot CLI
- Antigravity: the `invoke_subagent` tool with the `research` agent
- OpenCode: `subagent(agent="explore", description="...", prompt="...")`

The `apm-archive-explorer` subagent is installed with APM. Spawn it by name with the same tool.

**New chat.** Tell the User to:
- Claude Code: open a new terminal and run `claude`, or open a new Claude Code tab in VS Code or a new session in the desktop app
- Codex CLI: open a new terminal and run `codex`, or start a new chat in the Codex IDE extension or app
- Cursor: start a new Agent chat in the Cursor editor, or open a new terminal in the project root and run `agent`
- GitHub Copilot: start a new chat in the VS Code Chat view, or open a new terminal and run `copilot`
- Antigravity: start a new conversation in the Antigravity app or IDE agent panel, or open a new terminal and run `agy`
- OpenCode: open a new terminal and run `opencode`, or start a new session in the OpenCode desktop app
