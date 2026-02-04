---
name: apm-communication
description: File-based Message Bus protocol for structured communication between Agent sessions.
---

# APM {VERSION} - Communication Skill

## 1. Overview

**Reading Agent:** Manager Agent, Worker Agent

This skill defines the Message Bus protocol for structured communication between Agent sessions. The Message Bus is a file-based system where Agents write to Bus Files and Users reference those files using platform-specific context attachment.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for initializing the Message Bus, sending messages, receiving messages, and clearing Bus Files. See §3 Communication Procedure.

**Use Operational Standards for reasoning and decisions.** When determining bus state, handling edge cases, or validating bus identity, consult the relevant standards subsection. See §2 Operational Standards.

**Follow Structural Specifications.** Bus directory structure and file naming follow the conventions defined in Structural Specifications. See §4 Structural Specifications.

### 1.2 Objectives

- Enable structured message exchange between Agent sessions via the file system
- Provide clear sending and receiving protocols that Agents follow consistently
- Maintain clean bus state through the Clear-on-Return protocol
- Support Worker identity validation through Bus File naming

### 1.3 Outputs

**Message Bus Directory:** `.apm/bus/` containing per-agent subdirectories (Agent Channels) with Bus Files for each communication direction.

**Bus File Types:**
- **Send Bus** (`apm-send-to-<agent-slug>.md`) - Manager-to-Worker communication.
- **Report Bus** (`apm-report-from-<agent-slug>.md`) - Worker-to-Manager communication.
- **Handoff Bus** (`apm-handoff-<agent-slug>.md`) - Outgoing-to-Incoming Agent communication.

### 1.4 Non-APM Agent Integration

Agents not managed by APM (external tools, standalone agents) can participate in Message Bus communication by creating their own Agent Channel. See `apm-bus-integration.md` alongside this skill for the integration methodology, then follow this skill's protocols for sending, receiving, and clearing.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Message Bus operations.

### 2.1 Bus Lifecycle Standards

Bus Files have two states: **empty** (no message present, the cleared/initial state) and **has content** (a message is present and awaiting delivery). Agents write content to send a message and truncate the file to clear it. There is no intermediate state or metadata envelope. The file either contains a message or it does not; the file content is the message itself, following the format defined by the relevant procedure (Task Assignment, Memory Logging, or Handoff).

### 2.2 Clearing Protocol Standards

Clearing follows a symmetric pattern: each Agent clears its incoming Bus File before writing to its outgoing Bus File. This prevents stale messages from accumulating:
* **Manager clearing sequence:** Clear the Report Bus (incoming), then write to the Send Bus (outgoing).
* **Worker clearing sequence:** Clear the Send Bus (incoming), then write to the Report Bus (outgoing).

Clearing is performed via terminal truncation: `truncate -s 0 <bus-file-path>`.

### 2.3 Bus Identity Standards

Workers validate that the Bus File they receive messages from matches their registered Agent identity. The Send Bus filename contains the target Agent slug (`apm-send-to-<agent-slug>.md`). The Worker extracts the Agent slug from the filename and confirms it matches their registered `agent_id`.

**Validation Rule:** If the Send Bus filename does not match the Worker's registered `agent_id`, reject the message and inform the User of the mismatch.

### 2.4 Edge Case Standards

* **Empty bus detection:** When an Agent reads a Bus File and finds it empty, the expected message has not been written yet or has already been cleared. Inform the User that no message is present and await further direction.
* **Wrong file referenced:** When a User references a Bus File intended for a different Agent, the receiving Agent detects the mismatch per §2.3 Bus Identity Standards and rejects it.

---

## 3. Communication Procedure

This section defines the sequential actions for Message Bus operations.

**Procedure:**
1. Bus Initialization (Manager Session 1 only)
2. Task Prompt Delivery (Manager writes Task Prompt to Send Bus)
3. Task Report Delivery (Worker writes Task Report to Report Bus)
4. Receiving Protocol (read message from Bus File)
5. Clearing Protocol (truncate incoming Bus File)
6. Handoff Bus Protocol (write Handoff Prompt to Handoff Bus File)

### 3.1 Bus Initialization

Execute once during Manager Agent Session 1 Initiation, after Memory Root initialization. Perform the following actions:
1. Create the `.apm/bus/` directory.
2. Read the Implementation Plan to identify all Worker Agents defined in the Agents field.
3. For each Worker Agent, derive the Agent Slug per §4.3 Agent Slug Convention and create the Agent Channel:
   - Create directory: `.apm/bus/<agent-slug>/`
   - Create empty Send Bus: `.apm/bus/<agent-slug>/apm-send-to-<agent-slug>.md`
   - Create empty Report Bus: `.apm/bus/<agent-slug>/apm-report-from-<agent-slug>.md`
   - Create empty Handoff Bus: `.apm/bus/<agent-slug>/apm-handoff-<agent-slug>.md`
4. Create the Manager Channel:
   - Create directory: `.apm/bus/manager/`
   - Create empty Handoff Bus: `.apm/bus/manager/apm-handoff-manager.md`

### 3.2 Task Prompt Delivery

Execute when the Manager Agent needs to send a Task Prompt or FollowUp Task Prompt to a Worker Agent. Perform the following actions:
1. Clear the Report Bus (incoming) per §3.5 Clearing Protocol. Skip on first Task Prompt when no Report exists.
2. Write the complete Task Prompt content to the Send Bus: `.apm/bus/<agent-slug>/apm-send-to-<agent-slug>.md`.
3. Inform the User that the Task Prompt is ready and provide the Send Bus path. Direct the User to reference the file in the Worker Agent's session. {CONTEXT_ATTACH_SYNTAX}

### 3.3 Task Report Delivery

Execute when a Worker Agent needs to send a Task Report to the Manager Agent. Perform the following actions:
1. Clear the Send Bus (incoming) per §3.5 Clearing Protocol.
2. Write the complete Task Report content to the Report Bus: `.apm/bus/<agent-slug>/apm-report-from-<agent-slug>.md`.
3. Inform the User that the Task Report is ready and provide the Report Bus path. Direct the User to reference the file in the Manager Agent's session. {CONTEXT_ATTACH_SYNTAX}

### 3.4 Receiving Protocol

Execute when a User references a Bus File in the Agent's session. Perform the following actions:
1. Read the referenced Bus File.
2. Validate that the file contains content. If empty → Inform the User that no message is present.
3. For Workers: Validate Bus identity per §2.3 Bus Identity Standards.
4. Process the message content according to the relevant procedure.

### 3.5 Clearing Protocol

Execute before writing to an outgoing Bus File, to clear the incoming Bus File. Perform the following actions:
1. Identify the incoming Bus File:
   - For Manager: `.apm/bus/<agent-slug>/apm-report-from-<agent-slug>.md` (the Worker's Report Bus)
   - For Worker: `.apm/bus/<agent-slug>/apm-send-to-<agent-slug>.md` (the received Send Bus)
2. Truncate the incoming Bus File via terminal: `truncate -s 0 <bus-file-path>`
3. Proceed to write the outgoing message.

### 3.6 Handoff Bus Protocol

Execute when an Agent performs a Handoff and needs to write a Handoff Prompt. Perform the following actions:
1. Determine the Handoff Bus File:
   - Manager Handoff → `.apm/bus/manager/apm-handoff-manager.md`
   - Worker Handoff → `.apm/bus/<agent-slug>/apm-handoff-<agent-slug>.md`
2. Write the Handoff Prompt content to the Handoff Bus File.
3. Inform the User that the Handoff Prompt is available at the Bus File path. Direct the User to reference the Handoff Bus file in a new session. {CONTEXT_ATTACH_SYNTAX}

---

## 4. Structural Specifications

This section defines the directory structure, file naming, and conventions for the Message Bus.

### 4.1 Directory Structure

```
.apm/bus/
├── <agent-slug>/
│   ├── apm-send-to-<agent-slug>.md
│   ├── apm-report-from-<agent-slug>.md
│   └── apm-handoff-<agent-slug>.md
└── manager/
    └── apm-handoff-manager.md
```

### 4.2 File Naming Convention

| Bus File | Pattern | Direction |
|----------|---------|-----------|
| Send Bus | `apm-send-to-<agent-slug>.md` | Manager to Worker |
| Report Bus | `apm-report-from-<agent-slug>.md` | Worker to Manager |
| Handoff Bus | `apm-handoff-<agent-slug>.md` | Outgoing to Incoming Agent |

### 4.3 Agent Slug Convention

Agent slugs are derived from the Agent names listed in the Implementation Plan Agents field. The Manager converts each name to lowercase and replaces spaces with hyphens. Examples: `Frontend Agent` → `frontend-agent`, `Backend Agent` → `backend-agent`. The Manager's own channel uses the slug `manager`.

---

## 5. Content Guidelines

### 5.1 User Guidance Standards

When directing Users to reference Bus Files, use natural language adapted to the situation. Include the file path and contextually appropriate phrasing. {CONTEXT_ATTACH_SYNTAX}

### 5.2 Common Mistakes to Avoid

- **Writing to the wrong Bus File:** Manager writes to Send Bus, Worker writes to Report Bus.
- **Forgetting to clear:** Always clear the incoming Bus File before writing to the outgoing Bus File per §3.5 Clearing Protocol.
- **Referencing bus files by wrong path:** Use the exact path per §4.1 Directory Structure, derived from the Agent Slug.
- **Not validating bus identity:** Workers must verify the Send Bus filename matches their `agent_id` per §2.3 Bus Identity Standards.

---

**End of Skill**
