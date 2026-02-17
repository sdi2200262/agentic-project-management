---
name: apm-communication
description: File-based Message Bus for structured communication between agents.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Manager, Worker

This skill defines the Message Bus for structured communication between agents. The Message Bus is a file-based system where agents write to Bus Files and Users reference those files using platform-specific context attachment.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for initializing the Message Bus, sending messages, receiving messages, and clearing Bus Files. See §3 Communication Procedure.

**Use Operational Standards for reasoning and decisions.** When determining bus state, handling edge cases, or validating bus identity, consult the relevant standards subsection. See §2 Operational Standards.

**Follow Structural Specifications.** Bus directory structure and file naming follow the conventions defined in Structural Specifications. See §4 Structural Specifications.

### 1.2 Objectives

- Enable structured message exchange between agents via the file system
- Provide clear sending and receiving protocols that agents follow consistently
- Maintain clean bus state through Clear-on-Return
- Support Worker identity validation through Bus File naming

### 1.3 Outputs

**Message Bus Directory:** `.apm/bus/` containing per-agent subdirectories (agent directories) with Bus Files for each communication direction.

**Bus File Types:**
- **Task Bus** (`apm-task.md`) — Manager-to-Worker communication.
- **Report Bus** (`apm-report.md`) — Worker-to-Manager communication.
- **Handoff Bus** (`apm-handoff.md`) — Outgoing-to-Incoming Agent communication.

### 1.4 Non-APM Agent Integration

Agents not managed by APM (external tools, standalone agents) can participate in Message Bus communication by creating their own agent directory under `.apm/bus/`. See `apm-bus-integration.md` alongside this skill for the integration guide, then follow this skill's protocols for sending, receiving, and clearing.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Message Bus operations.

### 2.1 Bus Lifecycle Standards

Bus Files have two states: **empty** (no message present, the cleared/initial state) and **has content** (a message is present and awaiting delivery). Agents write content to send a message and truncate the file to clear it. There is no intermediate state or metadata envelope. The file either contains a message or it does not; the file content is the message itself, following the format defined by the relevant procedure (Task Assignment, Task Logging, or Handoff).

### 2.2 Clear-on-Return Standards

Clearing follows a symmetric pattern: each agent clears its incoming Bus File before writing to its outgoing Bus File. This prevents stale messages from accumulating:
- **Manager clearing sequence:** Clear the Report Bus (incoming), then write to the Task Bus (outgoing).
- **Worker clearing sequence:** Clear the Task Bus (incoming), then write to the Report Bus (outgoing).

Clearing is performed via terminal truncation: `truncate -s 0 <bus-file-path>`.

### 2.3 Bus Identity Standards

Agent identity is derived from the agent directory name (`.apm/bus/<agent-slug>/`). Workers validate by confirming the directory matches their registered `agent_id`. When using `/apm-4-check-tasks` or `/apm-5-check-reports`, the agent resolves its own bus path from its identity, making explicit validation implicit.

**Validation Rule:** If the agent directory does not match the Worker's registered `agent_id`, reject the message and inform the User of the mismatch.

### 2.4 Edge Case Standards

- **Empty bus detection:** When an agent reads a Bus File and finds it empty, the expected message has not been written yet or has already been cleared. Inform the User that no message is present and await further direction.
- **Wrong file referenced:** When a User references a Bus File intended for a different agent, the receiving agent detects the mismatch per §2.3 Bus Identity Standards and rejects it.

### 2.5 Batch Delivery Standards

When dispatching multiple sequential tasks to the same Worker, the Manager sends them as a batch in a single Task Bus message:
- **Batch envelope:** The Task Bus file contains YAML frontmatter with batch metadata, followed by individual Task Prompts separated by `---` delimiters. See §4.4 Batch Envelope Format.
- **Task Independence:** Each Task Prompt in a batch retains its full structure as if it were standalone. The batch envelope adds coordination metadata; it does not alter task content.
- **Fail-Fast:** If a Worker encounters a Blocked or Failed task during batch execution, they stop the batch and do not proceed to remaining tasks. The batch report reflects partial completion.

### 2.6 Resolving Agent IDs

When `/apm-4-check-tasks` or `/apm-5-check-reports` accept an `[agent-id]` argument, the agent resolves it by matching against `.apm/bus/` directory names:

1. **Exact match** against `.apm/bus/` directory names.
2. **Prefix match** (e.g., `fe` → `frontend-agent`). Minimum 2 characters for prefix matching; single character requires exact match.
3. **Substring match** (e.g., `front` → `frontend-agent`).
4. **Ambiguous matches** → list candidates and ask User to clarify.
5. **No match** → inform User. If no bus directories exist, inform User that the Message Bus is not initialized.

---

## 3. Communication Procedure

This section defines the sequential actions for Message Bus operations.

**Procedure:**
1. Bus Initialization (Manager session 1 only)
2. Task Prompt Delivery (Manager writes Task Prompt to Task Bus)
3. Task Report Delivery (Worker writes Task Report to Report Bus)
4. Receiving Protocol (read message from Bus File)
5. Clear-on-Return (truncate incoming Bus File)
6. Handoff Bus Protocol (write Handoff Prompt to Handoff Bus File)

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

### 3.2 Task Prompt Delivery

Execute when the Manager needs to send a Task Prompt or follow-up task prompt to a Worker. Perform the following actions:
1. Clear the Report Bus (incoming) per §3.5 Clear-on-Return. Skip on first Task Prompt when no Report exists.
2. Write the complete Task Prompt content to the Task Bus: `.apm/bus/<agent-slug>/apm-task.md`.
3. Inform the User that the Task Prompt is ready for Worker `<agent-slug>`. Direct the User to run `/apm-4-check-tasks` in the Worker's session.

### 3.3 Task Report Delivery

Execute when a Worker needs to send a Task Report to the Manager. Perform the following actions:
1. Clear the Task Bus (incoming) per §3.5 Clear-on-Return.
2. Write the complete Task Report content to the Report Bus: `.apm/bus/<agent-slug>/apm-report.md`.
3. Inform the User that the Task Report is ready. Direct the User to run `/apm-5-check-reports` in the Manager's session.

### 3.4 Receiving Protocol

Execute when a trigger command is invoked or a User references a Bus File in the agent's session. Perform the following actions:
1. Read the Bus File (resolved from agent identity for trigger commands, or directly referenced by User).
2. Validate that the file contains content. If empty → Inform the User that no message is present.
3. For Workers: Validate Bus identity per §2.3 Bus Identity Standards.
4. Process the message content according to the relevant procedure.

### 3.5 Clear-on-Return

Execute before writing to an outgoing Bus File, to clear the incoming Bus File. Perform the following actions:
1. Identify the incoming Bus File:
   - For Manager: `.apm/bus/<agent-slug>/apm-report.md` (the Worker's Report Bus)
   - For Worker: `.apm/bus/<agent-slug>/apm-task.md` (the received Task Bus)
2. Truncate the incoming Bus File via terminal: `truncate -s 0 <bus-file-path>`
3. Proceed to write the outgoing message.

### 3.6 Handoff Bus Protocol

Execute when an agent performs a Handoff and needs to write a Handoff Prompt. Perform the following actions:
1. Determine the Handoff Bus File:
   - Manager Handoff → `.apm/bus/manager/apm-handoff.md`
   - Worker Handoff → `.apm/bus/<agent-slug>/apm-handoff.md`
2. Write the Handoff Prompt content to the Handoff Bus File.
3. Inform the User that the Handoff Prompt is available. Direct the User to start a new session using the appropriate init command — the Incoming Agent will auto-detect the Handoff Prompt.

---

## 4. Structural Specifications

This section defines the directory structure, file naming, and conventions for the Message Bus.

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
| Handoff Bus | `apm-handoff.md` | Outgoing to Incoming Agent |

### 4.3 Agent Slug Format

Agent slugs are derived from the agent names listed in the Implementation Plan Agents field by converting to lowercase and replacing spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own directory uses the slug `manager`.

### 4.4 Batch Envelope Format

When sending multiple tasks to a Worker in a batch, the Task Bus file uses this structure:

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

**Worker Processing:** Worker parses the batch envelope, executes tasks sequentially, logs each to its `memory_log_path`, and writes a batch report upon completion or failure. See `{GUIDE_PATH:task-execution}` for batch execution and `{GUIDE_PATH:task-logging}` for batch report format.

---

## 5. Content Guidelines

### 5.1 User Guidance Standards

When directing Users to trigger bus checks, use natural language adapted to the situation. Reference the appropriate trigger command (`/apm-4-check-tasks` or `/apm-5-check-reports`) and the target session.

### 5.2 Common Mistakes to Avoid

- **Writing to the wrong Bus File:** Manager writes to Task Bus, Worker writes to Report Bus.
- **Forgetting to clear:** Always clear the incoming Bus File before writing to the outgoing Bus File per §3.5 Clear-on-Return.
- **Referencing bus files by wrong path:** Use the exact path per §4.1 Directory Structure, derived from the agent slug.
- **Not validating bus identity:** Workers must verify the agent directory matches their `agent_id` per §2.3 Bus Identity Standards.

---

**End of Skill**
