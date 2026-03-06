---
name: apm-communication
description: Agent communication standards and file-based bus system for structured inter-agent messaging.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Planner, Manager, Worker

This skill defines agent communication standards and the file-based bus system for structured inter-agent messaging.

### 1.1 How to Use This Skill

See §2 Agent-to-User Communication for visible reasoning and terminology boundaries. See §3 Agent-to-System Communication for artifact writing standards. See §4 Agent-to-Agent Communication for bus system protocol, including initialization, sending, receiving, and clearing.

### 1.2 Objectives

- Define clear standards for agent-to-user communication, visible reasoning, and terminology boundaries.
- Enable structured message exchange between agents via the file system.
- Provide clear sending and receiving protocols that agents follow consistently.
- Maintain clean bus state by clearing incoming bus files before writing outgoing.
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

When communicating with the User - asking questions, requesting actions, providing status updates, presenting completions - use natural language adapted to the situation. Explain what happened, what was decided, and what happens next. There are no rigid templates; adapt phrasing to what the situation requires while conveying necessary information. When directing Users to perform actions (run commands, switch sessions, review artifacts), provide specific actionable guidance: which command, in which session, with what arguments.

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

## 4. Agent-to-Agent Communication

Bus files have two states: **empty** (no message present, the cleared/initial state) and **has content** (a message is present and awaiting delivery). There is no intermediate state - the file either contains a message or it does not. The file content is the message itself.

### 4.1 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent`. When using `/apm-4-check-tasks` or `/apm-5-check-reports`, the agent resolves its own bus path from its identity.

**Validation rule:** If the agent directory does not match the Worker's registered `agent`, reject the message and inform the User of the mismatch.

### 4.2 Agent ID Resolution

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, resolve by matching against `.apm/bus/` directory names: exact match first, then prefix match (minimum 2 characters), then substring match. Ambiguous matches → list candidates and ask User. No match → inform User; if no bus directories exist, inform that the bus system is not initialized.

### 4.3 Edge Case Standards

- *Empty bus:* When an agent reads a bus file and finds it empty, inform the User that no message is present and await direction.
- *Wrong file referenced:* When a User references a bus file intended for a different agent, the receiving agent detects the mismatch per §4.1 and rejects it.

### 4.4 Batch Delivery Standards

When dispatching multiple sequential Tasks to the same Worker, the Manager sends them as a batch in a single Task Bus message. The Task Bus file contains YAML frontmatter with batch metadata, followed by individual Task Prompts separated by `---` delimiters per §4.14 Batch Envelope Format. Each Task Prompt retains its full standalone structure. If a Worker encounters a Blocked or Failed Task during batch execution, they stop the batch and report partial completion.

**Procedure:**
1. Bus Initialization (Planner, end of Planning Phase).
2. Task Prompt Delivery (Manager writes Task Prompt to Task Bus).
3. Task Report Delivery (Worker writes Task Report to Report Bus).
4. Receiving Protocol (read message from bus file).
5. Clear-on-Return (clear incoming bus file before writing outgoing).
6. Handoff Bus Protocol (write handoff prompt to Handoff Bus).

### 4.5 Bus Initialization

Execute once at the end of the Planning Phase, after all planning documents are approved. Perform the following actions:
1. Create the `.apm/bus/` directory.
2. Read the Plan to identify all Workers defined in the Agents field.
3. For each Worker, derive the agent slug (lowercase, hyphenated name) per §4.13 Agent Slug Format and create the agent directory:
   - Create directory: `.apm/bus/<agent-slug>/`
   - Create empty Task Bus: `.apm/bus/<agent-slug>/task.md`
   - Create empty Report Bus: `.apm/bus/<agent-slug>/report.md`
   - Create empty Handoff Bus: `.apm/bus/<agent-slug>/handoff.md`
4. Create the Manager's bus directory:
   - Create directory: `.apm/bus/manager/`
   - Create empty Handoff Bus: `.apm/bus/manager/handoff.md`

Create all directories and bus files using `mkdir -p` and `touch` in a single terminal command rather than individual file creation calls.

### 4.6 Task Prompt Delivery

Execute when the Manager sends a Task Prompt or follow-up prompt to a Worker. Perform the following actions:
1. Clear the incoming Report Bus per §4.9 Clear-on-Return. Skip on first Task Prompt when no report exists.
2. Write the complete Task Prompt content to the Task Bus: `.apm/bus/<agent-slug>/task.md`.
3. Provide the User with specific action guidance for Worker `<agent-slug>`:
   - If the Worker is not yet initialized → direct the User to start a new session and run `/apm-3-initiate-worker <agent-id>`, then `/apm-4-check-tasks`. Only on first dispatch to this Worker.
   - If the Worker is already initialized → direct the User to run `/apm-4-check-tasks` in the Worker's session.
   - For batch dispatch → summarize concisely what the Worker will receive (number of Tasks, sequential execution).
   - For parallel dispatch → list each Worker session with its required action.
   Markdown code blocks for commands are recommended.

### 4.7 Task Report Delivery

Execute when a Worker sends a Task Report to the Manager. Perform the following actions:
1. Clear the incoming Task Bus per §4.9 Clear-on-Return.
2. Write the complete Task Report content to the Report Bus: `.apm/bus/<agent-slug>/report.md`.
3. Direct the User to deliver the report to the Manager. Provide both:
   - `/apm-5-check-reports <agent-id>` for targeted retrieval of this Worker's report.
   - `/apm-5-check-reports` (no argument) as an alternative when multiple Workers may have finished.
   Markdown code blocks for commands are recommended. Workers operate asynchronously - cover only this Worker's end.

### 4.8 Receiving Protocol

Execute when a trigger command is invoked or a User references a bus file. Perform the following actions:
1. Read the bus file (resolved from agent identity for trigger commands, or directly referenced by User).
2. Validate that the file contains content. If empty → inform the User that no message is present.
3. For Workers: validate bus identity per §4.1 Bus Identity Standards.
4. Process the message content according to the relevant procedure.

### 4.9 Clear-on-Return

Before writing to an outgoing bus file, clear the incoming bus file to prevent stale messages. Perform the following actions:
1. Identify the incoming bus file:
   - For Manager: `.apm/bus/<agent-slug>/report.md` (the Worker's Report Bus)
   - For Worker: `.apm/bus/<agent-slug>/task.md` (the received Task Bus)
2. Clear the file contents via terminal (e.g., `truncate -s 0` or shell redirection).
3. Write the outgoing message.

### 4.10 Handoff Bus Protocol

Execute when an agent performs a Handoff. Perform the following actions:
1. Determine the Handoff Bus file:
   - Manager Handoff → `.apm/bus/manager/handoff.md`
   - Worker Handoff → `.apm/bus/<agent-slug>/handoff.md`
2. Write the handoff prompt content to the Handoff Bus file.
3. Inform the User that the handoff prompt is available. Direct the User to start a new session using the appropriate init command - the incoming agent will auto-detect the handoff prompt.

### 4.11 Directory Structure

```
.apm/bus/
├── <agent-slug>/
│   ├── task.md
│   ├── report.md
│   └── handoff.md
└── manager/
    └── handoff.md
```

### 4.12 File Naming Convention

| Bus File | Pattern | Direction |
|----------|---------|-----------|
| Task Bus | `task.md` | Manager to Worker |
| Report Bus | `report.md` | Worker to Manager |
| Handoff Bus | `handoff.md` | Outgoing to incoming agent |

### 4.13 Agent Slug Format

Agent slugs are derived from the agent names listed in the Plan Agents field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

### 4.14 Batch Envelope Format

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

**Worker processing:** Worker parses the batch envelope, executes Tasks sequentially, logs each to its `log_path`, and writes a batch report upon completion or failure. See `{GUIDE_PATH:task-execution}` §2.7 Batch Rules for batch execution and §4.15 Batch Report Envelope Format for batch report structure.

### 4.15 Batch Report Envelope Format

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
- `tasks[].status`: enum, required. Task outcome per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards, or `"Not started"` for unexecuted Tasks.

**Markdown Body Template:**
```markdown
# Batch Report

## Summary
[Brief overview: X of Y Tasks completed, stopped early if applicable]

## Task Outcomes

### <Title>
**Status:** [Success | Partial | Failed | Blocked]
**Task Log:** `<log_path>`
[1-2 sentence summary of outcome]

...

## Batch Notes
[Any cross-cutting observations, patterns, or issues affecting multiple Tasks]
```

**Fail-fast documentation:** If the batch stopped early due to a Blocked or Failed Task, indicate which Task caused the stop and list remaining Tasks as "Not started (batch stopped)."

### 4.16 Common Mistakes

- *Writing to the wrong bus file:* Manager writes to Task Bus, Worker writes to Report Bus.
- *Forgetting to clear:* Always clear the incoming bus file before writing to the outgoing bus file per §4.9 Clear-on-Return.
- *Referencing bus files by wrong path:* Use the exact path per §4.11 Directory Structure, derived from the agent slug.
- *Not validating bus identity:* Workers must verify the agent directory matches their `agent` per §4.1 Bus Identity Standards.

---

**End of Skill**
