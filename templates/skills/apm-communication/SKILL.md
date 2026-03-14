---
name: apm-communication
description: Agent communication standards and file-based bus system protocol for structured inter-agent messaging.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Planner, Manager, Worker

This skill defines agent communication standards and the file-based bus system protocol. It covers communication models, bus identity, and shared message formats. Agent-specific delivery and reporting procedures are defined in each agent's guides.

### 1.1 How to Use This Skill

See §2 Agent-to-User Communication for visible reasoning and terminology boundaries. See §3 Agent-to-System Communication for artifact writing standards. See §4 Bus System Protocol for bus identity, resolution, and shared message formats.

### 1.2 Objectives

- Define clear standards for agent-to-user communication, visible reasoning, and terminology boundaries.
- Provide the bus system protocol: identity standards, agent resolution, and shared message formats.
- Support Worker identity validation through bus file naming.

### 1.3 Outputs

**Bus directory:** `.apm/bus/` containing per-agent subdirectories with bus files for each communication direction.

**Bus file types:**
- *Task Bus:* (`task.md`) Manager-to-Worker communication.
- *Report Bus:* (`report.md`) Worker-to-Manager communication.
- *Handoff Bus:* (`handoff.md`) Outgoing-to-incoming agent communication.

### 1.4 Non-APM Agent Integration

Agents not managed by APM can participate in bus communication by creating their own agent directory under `.apm/bus/`. See `bus-integration.md` alongside this skill for the integration guide.

---

## 2. Agent-to-User Communication

### 2.1 Direct Communication

When communicating with the User - asking questions, requesting actions, providing status updates, presenting completions - use natural language adapted to the situation. Explain what happened, what was decided, and what happens next. There are no rigid templates; adapt phrasing to what the situation requires while conveying necessary information. When directing Users to perform actions (run commands, switch chats, review artifacts), provide specific actionable guidance: which command, in which agent's chat, with what arguments.

### 2.2 Visible Reasoning

At procedural decision points, present analytical thinking visibly in chat before acting. This makes decisions auditable and gives the User opportunity to redirect.

Two forms of visible reasoning exist:
- *Guided reasoning:* Some procedures define labeled reasoning frames - lists of analytical aspects to address. These frames are intentionally visible: the structure forces thorough analysis and produces better outputs. When a procedure provides a reasoning frame, follow it. The labels describe what to analyze; present findings naturally under each.
- *Free-form reasoning:* The baseline for all other decision points. Present your analysis formally and technically - the reasoning quality correlates with output quality. Explain what you are assessing, key considerations, and your conclusion. Do not use framework labels, procedure vocabulary, or structural headings from the guides as output structure.

Guided reasoning frames are defined by the procedures that invoke them. This section defines the baseline; procedures take precedence where they provide specific frames.

### 2.3 Terminology Boundaries

Formal APM terms - consistently capitalized words in APM commands and guides like Task, Stage, Worker, Manager - are part of the agent's public vocabulary. Use them naturally when communicating. All other language is natural prose; standard English capitalization applies but confers no formal status.

The following are internal authoring structure - use them for navigation but never surface them in user-facing output:
- Section references (§N.M).
- Procedure names as labels.
- Step labels and checkpoint names.
- Decision categories.

Guided reasoning frames are always surfaced as defined by their procedures per §2.2 Visible Reasoning.

---

## 3. Agent-to-System Communication

When writing to APM artifacts (Spec, Plan, Tracker, Task Logs, bus files), follow the structural format defined by the relevant guide's structural specifications section or the bus protocol in §4. Artifact content is technical, formal, structured, and precise. Internal procedure vocabulary does not appear in artifacts - use natural descriptive language for any free-text fields.

---

## 4. Bus System Protocol

Bus files have two states: **empty** (no message present, the cleared/initial state) and **has content** (a message is present and awaiting delivery). There is no intermediate state - the file either contains a message or it does not. The file content is the message itself.

### 4.1 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent`. When using `/apm-4-check-tasks` or `/apm-5-check-reports`, the agent resolves its own bus path from its identity.

**Validation rule:** If the agent directory does not match the Worker's registered `agent`, reject the message and inform the User of the mismatch.

### 4.2 Agent ID Resolution

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, resolve by matching against `.apm/bus/` directory names: exact match first, then prefix match (minimum 2 characters), then substring match. Ambiguous matches → list candidates and ask User. No match → inform User; if no bus directories exist, inform that the bus system is not initialized.

### 4.3 Edge Case Standards

- *Empty bus:* When an agent reads a bus file and finds it empty, inform the User that no message is present and await direction.
- *Wrong file referenced:* When a User references a bus file intended for a different agent, the receiving agent detects the mismatch per §4.1 Bus Identity Standards and rejects it.

### 4.4 Agent Slug Format

Agent slugs are derived from the agent names listed in the Plan Agents field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

### 4.5 Batch Envelope Format

When sending multiple Tasks to a Worker in a batch, the Task Bus file uses this structure:

**YAML Frontmatter Schema:**
```yaml
---
batch: true
batch_size: <N>
tasks:
  - stage: 1
    task: 1
    log_path: ".apm/memory/stage-01/task-01-01.log.md"
  - stage: 1
    task: 2
    log_path: ".apm/memory/stage-01/task-01-02.log.md"
---
```

**Field Descriptions:**
- `batch`: boolean, required. Always `true` for batch envelopes.
- `batch_size`: number, required. Total Tasks in the batch.
- `tasks`: list, required. Per-Task metadata for the batch.
- `tasks[].stage`: integer, required. Stage number.
- `tasks[].task`: integer, required. Task number within Stage.
- `tasks[].log_path`: string, required. Pre-constructed path for the Task Log.

**Body:** Individual Task Prompts separated by `---` delimiters. Each Task Prompt retains its full structure (YAML frontmatter and body) as if standalone.
```markdown
---
stage: 1
task: 1
agent: <agent-slug>
...
---
# APM Task Assignment: <Title>
...

---

---
stage: 1
task: 2
agent: <agent-slug>
...
---
# APM Task Assignment: <Title>
...
```

### 4.6 Batch Report Envelope Format

When a Worker completes a batch of Tasks (or stops early on failure), the Report Bus file uses this structure:

**YAML Frontmatter Schema:**
```yaml
---
batch: true
batch_size: <N>
completed: <M>
stopped_early: true | false
tasks:
  - stage: 1
    task: 1
    status: Success
  - stage: 1
    task: 2
    status: Failed
  - stage: 1
    task: 3
    status: "Not started"
---
```

**Field Descriptions:**
- `batch`: boolean, required. Always `true` for batch reports.
- `batch_size`: number, required. Total Tasks in the batch.
- `completed`: number, required. Tasks that were executed (excludes unstarted).
- `stopped_early`: boolean, required. Whether the batch stopped before completing all Tasks.
- `tasks`: list, required. Per-Task reference and outcome status.
- `tasks[].stage`: integer, required. Stage number.
- `tasks[].task`: integer, required. Task number within Stage.
- `tasks[].status`: enum, required. `Success`, `Partial`, `Failed` (per Task outcome), or `"Not started"` for unexecuted Tasks.

**Markdown Body Template:**
```markdown
# Batch Report

## Summary
[Brief overview: X of Y Tasks completed, stopped early if applicable]

## Task Outcomes

### <Title>
**Status:** [Success | Partial | Failed]
**Task Log:** `<log_path>`
[1-2 sentence summary of outcome]

...

## Batch Notes
[Any cross-cutting observations, patterns, or issues affecting multiple Tasks]
```

**Fail-fast documentation:** If the batch stopped early due to a Failed Task, indicate which Task caused the stop and list remaining Tasks as "Not started (batch stopped)."

---

**End of Skill**
