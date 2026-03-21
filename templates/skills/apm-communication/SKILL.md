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

**Action directives.** When directing Users to take action - whether APM workflow navigation or any other action requiring User involvement outside the conversation - present as an action directive. Use a blockquote with the action described in natural language. Each step on its own line for easy reference and copying. When the action requires a new chat, include the platform guidance per {NEW_CHAT_GUIDANCE}. Commands are presented in code format for easy copying.

Single action:

> **Next:** Run `/apm-5-check-reports` in this chat.

Multiple actions:

> **Next:**
> 1. {NEW_CHAT_GUIDANCE}
> 2. Run `/apm-3-initiate-worker frontend-agent`
> 3. Run `/apm-4-check-tasks`

Non-APM action:

> **Action needed:** Enable billing in the cloud console and confirm when done so I can proceed with the deployment configuration.

Adapt the label and content to the situation - `Next:` for workflow progression, `Action needed:` for external actions, or any label that fits. The pattern is the blockquote with clear steps; use it whenever the User needs to do something, not only for APM-specific moments.

### 2.2 Visible Reasoning

At procedural decision points, present analytical thinking visibly in chat before acting. This makes decisions auditable and gives the User opportunity to redirect. Reasoning quality correlates with output quality. When a procedure provides a labeled reasoning frame, follow it - the structure forces thorough analysis. Present findings naturally under each label. Otherwise, reason analytically: what you are assessing, key considerations, and your conclusion. Do not use framework labels, procedure vocabulary, or structural headings from the guides as output structure.

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

## 4. Message Bus Protocol

Bus files are either empty (no message present) or contain a message awaiting delivery. Before writing to an outgoing bus file, an agent clears its incoming bus file.

### 4.1 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent`. If the agent directory does not match, reject the message and inform the User of the mismatch.

### 4.2 Agent ID Resolution

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, resolve by matching against `.apm/bus/` directory names: exact match first, then prefix match (minimum 2 characters), then substring match. Ambiguous matches → list candidates and ask User. No match → inform User; if no bus directories exist, inform that the Message Bus is not initialized.

### 4.3 Agent Slug Format

Agent slugs are derived from the Worker names listed in the Plan Workers field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

### 4.4 Batch Envelope Format

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

`tasks[].log_path` is the pre-constructed path for the Task Log, following the same pattern as single Task Prompts.

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

### 4.5 Batch Report Envelope Format

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

- `completed`: Tasks that were executed (excludes unstarted).
- `stopped_early`: Whether the batch stopped before completing all Tasks.
- `tasks[].status`: `Success`, `Partial`, `Failed`, or `"Not started"` for unexecuted Tasks.

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

If the batch stopped early due to a Failed Task, indicate which Task caused the stop and list remaining Tasks as "Not started (batch stopped)."

---

**End of Skill**
