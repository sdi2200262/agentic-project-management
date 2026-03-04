---
name: apm-communication
description: File-based bus system for structured communication between agents.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Manager, Worker

This skill defines the bus system for structured communication between agents. The bus system is file-based - agents write to bus files and Users reference those files using platform-specific context attachment.

### 1.1 How to Use This Skill

See §3 Communication Procedure for bus initialization, sending, receiving, and clearing. See §2 Operational Standards when handling edge cases or validating bus identity. See §4 Structural Specifications for directory structure and file naming.

### 1.2 Objectives

- Enable structured message exchange between agents via the file system
- Provide clear sending and receiving protocols that agents follow consistently
- Maintain clean bus state by clearing incoming bus files before writing outgoing
- Support Worker identity validation through bus file naming

### 1.3 Outputs

**Bus directory:** `.apm/bus/` containing per-agent subdirectories with bus files for each communication direction.

**Bus file types:**
- *Task Bus:* (`apm-task.md`) Manager-to-Worker communication.
- *Report Bus:* (`apm-report.md`) Worker-to-Manager communication.
- *Handoff Bus:* (`apm-handoff.md`) Outgoing-to-incoming agent communication.

### 1.4 Non-APM Agent Integration

Agents not managed by APM can participate in bus communication by creating their own agent directory under `.apm/bus/`. See `apm-bus-integration.md` alongside this skill for the integration guide.

---

## 2. Operational Standards

Bus files have two states: **empty** (no message present, the cleared/initial state) and **has content** (a message is present and awaiting delivery). There is no intermediate state - the file either contains a message or it does not. The file content is the message itself.

### 2.1 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent_id`. When using `/apm-4-check-tasks` or `/apm-5-check-reports`, the agent resolves its own bus path from its identity.

**Validation rule:** If the agent directory does not match the Worker's registered `agent_id`, reject the message and inform the User of the mismatch.

### 2.2 Agent ID Resolution

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, resolve by matching against `.apm/bus/` directory names: exact match first, then prefix match (minimum 2 characters), then substring match. Ambiguous matches → list candidates and ask User. No match → inform User; if no bus directories exist, inform that the bus system is not initialized.

### 2.3 Edge Case Standards

- *Empty bus:* When an agent reads a bus file and finds it empty, inform the User that no message is present and await direction.
- *Wrong file referenced:* When a User references a bus file intended for a different agent, the receiving agent detects the mismatch per §2.1 and rejects it.

### 2.4 Batch Delivery Standards

When dispatching multiple sequential Tasks to the same Worker, the Manager sends them as a batch in a single Task Bus message. The Task Bus file contains YAML frontmatter with batch metadata, followed by individual Task Prompts separated by `---` delimiters per §4.4 Batch Envelope Format. Each Task Prompt retains its full standalone structure. If a Worker encounters a Blocked or Failed Task during batch execution, they stop the batch and report partial completion.

---

## 3. Communication Procedure

**Procedure:**
1. Bus Initialization (Manager session 1 only).
2. Task Prompt Delivery (Manager writes Task Prompt to Task Bus).
3. Task Report Delivery (Worker writes Task Report to Report Bus).
4. Receiving Protocol (read message from bus file).
5. Clear-on-Return (clear incoming bus file before writing outgoing).
6. Handoff Bus Protocol (write handoff prompt to Handoff Bus).

### 3.1 Bus Initialization

Execute once during Manager session 1 initiation, after Memory Root initialization. Perform the following actions:
1. Create the `.apm/bus/` directory.
2. Read the Implementation Plan to identify all Workers defined in the Agents field.
3. For each Worker, derive the agent slug (lowercase, hyphenated name) per §4.3 and create the agent directory:
   - Create directory: `.apm/bus/<agent-slug>/`
   - Create empty Task Bus: `.apm/bus/<agent-slug>/apm-task.md`
   - Create empty Report Bus: `.apm/bus/<agent-slug>/apm-report.md`
   - Create empty Handoff Bus: `.apm/bus/<agent-slug>/apm-handoff.md`
4. Create the Manager's bus directory:
   - Create directory: `.apm/bus/manager/`
   - Create empty Handoff Bus: `.apm/bus/manager/apm-handoff.md`

Create all directories and bus files using `mkdir -p` and `touch` in a single terminal command rather than individual file creation calls.

### 3.2 Task Prompt Delivery

Execute when the Manager sends a Task Prompt or follow-up prompt to a Worker. Perform the following actions:
1. Clear the incoming Report Bus per §3.5 Clear-on-Return. Skip on first Task Prompt when no report exists.
2. Write the complete Task Prompt content to the Task Bus: `.apm/bus/<agent-slug>/apm-task.md`.
3. Provide the User with specific action guidance for Worker `<agent-slug>`:
   - If the Worker is not yet initialized → direct the User to start a new session and run `/apm-3-initiate-worker <agent-id>`, then `/apm-4-check-tasks`. Only on first dispatch to this Worker.
   - If the Worker is already initialized → direct the User to run `/apm-4-check-tasks` in the Worker's session.
   - For batch dispatch → summarize concisely what the Worker will receive (number of Tasks, sequential execution).
   - For parallel dispatch → list each Worker session with its required action.
   Markdown code blocks for commands are recommended.

### 3.3 Task Report Delivery

Execute when a Worker sends a Task Report to the Manager. Perform the following actions:
1. Clear the incoming Task Bus per §3.5 Clear-on-Return.
2. Write the complete Task Report content to the Report Bus: `.apm/bus/<agent-slug>/apm-report.md`.
3. Direct the User to deliver the report to the Manager. Provide both:
   - `/apm-5-check-reports <agent-id>` for targeted retrieval of this Worker's report.
   - `/apm-5-check-reports` (no argument) as an alternative when multiple Workers may have finished.
   Markdown code blocks for commands are recommended. Workers operate asynchronously - cover only this Worker's end.

### 3.4 Receiving Protocol

Execute when a trigger command is invoked or a User references a bus file. Perform the following actions:
1. Read the bus file (resolved from agent identity for trigger commands, or directly referenced by User).
2. Validate that the file contains content. If empty → inform the User that no message is present.
3. For Workers: validate bus identity per §2.1 Bus Identity Standards.
4. Process the message content according to the relevant procedure.

### 3.5 Clear-on-Return

Before writing to an outgoing bus file, clear the incoming bus file to prevent stale messages. Perform the following actions:
1. Identify the incoming bus file:
   - For Manager: `.apm/bus/<agent-slug>/apm-report.md` (the Worker's Report Bus)
   - For Worker: `.apm/bus/<agent-slug>/apm-task.md` (the received Task Bus)
2. Clear the file contents via terminal (e.g., `truncate -s 0` or shell redirection).
3. Proceed to write the outgoing message.

### 3.6 Handoff Bus Protocol

Execute when an agent performs a Handoff. Perform the following actions:
1. Determine the Handoff Bus file:
   - Manager Handoff → `.apm/bus/manager/apm-handoff.md`
   - Worker Handoff → `.apm/bus/<agent-slug>/apm-handoff.md`
2. Write the handoff prompt content to the Handoff Bus file.
3. Inform the User that the handoff prompt is available. Direct the User to start a new session using the appropriate init command - the incoming agent will auto-detect the handoff prompt.

---

## 4. Structural Specifications

### 4.1 Directory Structure

```
.apm/bus/
├── <agent-slug>/
│   ├── apm-task.md
│   ├── apm-report.md
│   └── apm-handoff.md
└── manager/
    └── apm-handoff.md
```

### 4.2 File Naming Convention

| Bus File | Pattern | Direction |
|----------|---------|-----------|
| Task Bus | `apm-task.md` | Manager to Worker |
| Report Bus | `apm-report.md` | Worker to Manager |
| Handoff Bus | `apm-handoff.md` | Outgoing to incoming agent |

### 4.3 Agent Slug Format

Agent slugs are derived from the agent names listed in the Implementation Plan Agents field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

### 4.4 Batch Envelope Format

When sending multiple Tasks to a Worker in a batch, the Task Bus file uses this structure:

**YAML Frontmatter:**

```yaml
---
batch: true
batch_size: <N>
tasks:
  - task_ref: "<Stage>.<Task>"
    memory_log_path: "<path>"
  - task_ref: "<Stage>.<Task>"
    memory_log_path: "<path>"
---
```

**Body:** Individual Task Prompts separated by `---` delimiters. Each Task Prompt retains its full structure (YAML frontmatter and body) as if standalone.

```markdown
---
stage: <N>
task: <M>
agent_id: <agent-slug>
...
---
# APM Task Assignment: <Title>
...

---

---
stage: <N>
task: <M+1>
agent_id: <agent-slug>
...
---
# APM Task Assignment: <Title>
...
```

**Worker processing:** Worker parses the batch envelope, executes Tasks sequentially, logs each to its `memory_log_path`, and writes a batch report upon completion or failure. See `{GUIDE_PATH:task-execution}` for batch execution and §4.5 Batch Report Envelope Format for batch report structure.

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
  - task_ref: "<Stage>.<Task>"
    status: Success | Partial | Failed | Blocked
  - task_ref: "<Stage>.<Task>"
    status: Success | Partial | Failed | Blocked | "Not started"
---
```

**Field Descriptions:**
- `batch`: boolean, required. Always `true` for batch reports.
- `batch_size`: number, required. Total Tasks in the batch.
- `completed`: number, required. Tasks that were executed (excludes unstarted).
- `stopped_early`: boolean, required. Whether the batch stopped before completing all Tasks.
- `tasks`: list, required. Per-Task reference and outcome status.
- `tasks[].task_ref`: string, required. Task reference in `<Stage>.<Task>` format.
- `tasks[].status`: enum, required. Task outcome per `{GUIDE_PATH:task-logging}` §2.3, or `"Not started"` for unexecuted Tasks.

**Markdown Body Template:**

```markdown
# Batch Report

## Summary
[Brief overview: X of Y Tasks completed, stopped early if applicable]

## Task Outcomes

### Task <N.M>: <Title>
**Status:** [Success | Partial | Failed | Blocked]
**Memory Log:** `<memory_log_path>`
[1-2 sentence summary of outcome]

### Task <N.M+1>: <Title>
**Status:** [Status or "Not started (batch stopped)"]
...

## Batch Notes
[Any cross-cutting observations, patterns, or issues affecting multiple Tasks]
```

**Fail-fast documentation:** If the batch stopped early due to a Blocked or Failed Task, indicate which Task caused the stop and list remaining Tasks as "Not started (batch stopped)."

---

## 5. Content Guidelines

### 5.1 User Guidance Standards

When directing Users to trigger bus actions, provide specific actionable guidance: which command to run, in which session, with what arguments. For dispatch, differentiate between uninitialized Workers (initialization command with agent identifier) and initialized Workers (check-tasks command). For reporting, include the agent identifier for targeted delivery and the general command as an alternative. Markdown code blocks for commands are recommended. Each agent covers only their own end of the communication - Workers cannot know what other Workers are doing.

### 5.2 Common Mistakes

- *Writing to the wrong bus file:* Manager writes to Task Bus, Worker writes to Report Bus.
- *Forgetting to clear:* Always clear the incoming bus file before writing to the outgoing bus file per §3.5 Clear-on-Return.
- *Referencing bus files by wrong path:* Use the exact path per §4.1 Directory Structure, derived from the agent slug.
- *Not validating bus identity:* Workers must verify the agent directory matches their `agent_id` per §2.1 Bus Identity Standards.

---

**End of Skill**
