---
name: apm-communication
description: Agent communication standards and file-based Message Bus protocol for structured inter-agent messaging.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading agents:** Planner, Manager, Worker

Use this skill for User-facing communication and the file-based Message Bus. Role-specific guides define delivery, reporting and artifact formats. Use your assistant's own way to run commands, spawn subagents and start new chats. When you use a subagent for research, tell it to read files and run checks without changing anything. A subagent used for debugging may change files to test fixes.

Non-APM agents can use the bus without joining the full workflow. See `bus-integration.md` alongside this skill.

## 2. Agent-to-User Communication

### 2.1 Direct Communication

Write plain English for the User, using the conversation as context. Open with the answer, outcome, finding, proposal or question. Give only the evidence and detail needed to understand or act, state each point once, and end with the last useful detail.

Keep the whole reply within these defaults:

| Reply | Word ceiling |
|---|---:|
| Direct answer | 100 |
| Explanation or work report | 250 |
| Broad plan or review | 500 |

Follow the User's requested length or level of detail when specified. Put substantial supporting detail in the relevant artifact and point to it. Artifacts follow their required schemas and coverage.

Use a casually formal tone, concrete subjects and active verbs. Keep sentences to one main thought and related words together. Use short paragraphs, lists for steps/parallel items and tables for comparisons. Explain unfamiliar concepts and put consequential limits beside the claims they qualify. Before sending, check the opening and total reply length against the request and applicable ceiling.

When the User needs to act, specify the command, target chat and argument or the artifact to review. Put commands to run in fenced blocks, and paths and values in inline code. Write the command the way the User's assistant runs it, and say how to start a new chat in that assistant. At a transition, give only the context and next action needed to continue.

### 2.2 Decisions and Evidence

Present the decision or proposal first, then the evidence, material trade-offs and uncertainty needed to assess consequential choices. Scale explanation to complexity and the User's request.

Questions name the understanding or gap and ask for a focused answer or correction. Proposals state the intended result and any approval needed. Progress updates communicate a meaningful change or blocker. Completion reports lead with the outcome, then deliverables, validation, limits and any required action. Reviews connect findings to evidence and the next step.

A proposal does not replace a required approval. Pause at the gates defined by the relevant procedure, incorporate corrections, and obtain approval before proceeding.

Give the User the project reason for what you do or ask, such as a risk, a dependency or what later work needs. Don't cite APM guides, procedures or rules to the User as the reason.

### 2.3 Terminology Boundaries

Use formal APM terms such as Task, Stage, Worker and Manager naturally where the procedure allows them. During Context Gathering rounds, follow `{GUIDE_PATH:context-gathering}` §2.2 for project-focused language. In User-facing prose, describe actions, findings and decisions in ordinary language. Reserve section references, procedure and step names, checkpoint labels and decision categories for internal navigation. Choose headings that help the User find relevant information.

## 3. Agent-to-System Communication

Follow the artifact schemas in the relevant guide and the bus protocol below. Write free-text content for its reader and purpose: a future agent needs self-contained context. Use narrative free text for the work, evidence and implications; reserve procedure and section labels for navigation and required reading instructions. Follow the schema for structured labels and fields. Record concrete outcomes, evidence, paths, consequential decisions and reasons, unresolved issues and continuation steps. Give each fact one useful location, verify claims against source and distinguish recorded state from assumptions.

## 4. Message Bus Protocol

Bus directories and files are initialized during planning. A bus file is empty or holds a message awaiting delivery. Before writing an outgoing message, clear the incoming bus file after processing it. Read a bus file before writing it so the file tools recognize empty or cleared files.

### 4.1 Bus Identity Standards

Identity comes from `.apm/bus/<agent-slug>/`. Workers confirm that this directory matches their registered `agent`. Reject a message for another identity and inform the User of the mismatch.

### 4.2 Agent ID Resolution

Resolve an `[agent-id]` argument to `apm-4-check-tasks` or `apm-5-check-reports` against bus directory names: exact match, then prefix, then best plausible match. Use a unique exact or prefix match. Confirm any other single match with the User before using it, and list multiple plausible candidates for the User to choose. If no directories exist, report that the Message Bus is not initialized.

### 4.3 Agent Slug Format

Convert Plan Worker names to lowercase with hyphens in place of spaces: `Frontend Agent` becomes `frontend-agent`. The Manager directory is `manager`.
