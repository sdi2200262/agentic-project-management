---
name: apm-communication
description: Agent communication standards and file-based Message Bus protocol for structured inter-agent messaging.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Planner, Manager, Worker

This skill defines agent communication standards and the file-based Message Bus protocol. It covers communication models, bus identity, and shared message formats. Agent-specific delivery and reporting procedures are defined in each agent's guides.

Agents not managed by APM can participate in bus communication by creating their own agent directory under `.apm/bus/`. See `bus-integration.md` alongside this skill for the integration guide.

---

## 2. Agent-to-User Communication

### 2.1 Direct Communication

When communicating with the User - asking questions, requesting actions, providing status updates, presenting completions - use natural language adapted to the situation. Explain what happened, what was decided, and what happens next. There are no rigid templates; adapt phrasing to what the situation requires while conveying necessary information.

When directing Users to perform actions (run commands, switch chats, review artifacts), provide specific actionable guidance naturally: which command, in which agent's chat, with what arguments. Present commands the User needs to run in code blocks so they are easy to copy. Use inline code for file paths, values, and references within prose. When multiple actions are needed (open a new chat, run initiation, check tasks), list them clearly with enough spacing to distinguish each step. When the action requires a new chat, include the platform guidance per {NEW_CHAT_GUIDANCE}.

Communication at workflow transitions should orient the User: what was just completed, what comes next, and what action is needed. Adapt naturally to the moment rather than following a fixed format.

### 2.2 Visible Reasoning

At procedural decision points, present your analysis visibly in chat before acting. The User needs to understand why you are making each decision - explain your assessments, justify your choices, and surface trade-offs so they can review and audit your reasoning and redirect if needed. Reasoning quality correlates with output quality. Internal reasoning or thinking may reach conclusions before visible chat output begins - but visible analysis in chat must still walk through the reasoning that led to those conclusions. Present how you arrived at each decision, not just what you decided. The User cannot audit or redirect decisions that appear in chat as given.

When a procedure prescribes specific headers for reasoning, present those headers visibly and address each section beneath them. When a procedure describes aspects to cover without prescribing headers, cover all indicated aspects using whatever format suits the content - prose, lists, tables, or any combination. In both cases, the output is analysis presented for the User's review. When no reasoning frame is provided, present what you are assessing, the key considerations, and your conclusion.

### 2.3 Terminology Boundaries

Formal APM terms - consistently capitalized words in APM commands and guides like Task, Stage, Worker, Manager - are part of the agent's public vocabulary. Use them naturally when communicating. All other language is natural prose; standard English capitalization applies but confers no formal status.

The following are internal authoring structure - use them for navigation but never surface them in User-facing output:
- Section references (§N.M).
- Procedure names and named sections from your guides.
- Step labels and checkpoint names.
- Decision categories.

When transitioning between sections, describe what you are doing and why rather than announcing which section you are executing. Describe your findings and move naturally into the next topic rather than stating "Beginning [section name]" or "Entering [step name]."

Reasoning frame headers prescribed by your procedures are always surfaced as defined per §2.2 Visible Reasoning. These are analytical output structure, not section announcements.

---

## 3. Agent-to-System Communication

When writing to APM artifacts (Spec, Plan, Tracker, Task Logs, bus files), follow the structural format defined by the relevant guide's structural specifications section or the bus protocol in §4 Message Bus Protocol. Artifact content is technical, formal, structured, and precise. Internal procedure vocabulary does not appear in artifacts - use natural descriptive language for any free-text fields.

---

## 4. Message Bus Protocol

Bus directories and files are initialized during the Planning Phase. Bus files are either empty (no message present) or contain a message awaiting delivery. Before writing to an outgoing bus file, an agent clears its incoming bus file. Always read a bus file before writing to it - this ensures the platform's file tools recognize the file and avoids write failures on empty or cleared files.

### 4.1 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent`. If the agent directory does not match, reject the message and inform the User of the mismatch.

### 4.2 Agent ID Resolution

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, resolve it against `.apm/bus/` directory names: exact match, then prefix, then best plausible match. When only one plausible candidate exists, resolve to it. When multiple candidates are plausible, list them and ask the User. When no bus directories exist, inform that the Message Bus is not initialized.

### 4.3 Agent Slug Format

Agent slugs are derived from the Worker names listed in the Plan Workers field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

---

**End of Skill**
