---
command_name: check-tasks
description: Signals a Worker Agent to check its Task Bus for pending Task Prompts.
---

# APM {VERSION} - Worker Check Tasks Command

## 1. Overview

This command signals a Worker Agent to check its Task Bus for pending Task Prompts. It replaces manual file referencing — the Worker resolves its bus path from its registered identity or from the provided `[agent-id]` argument.

Accepts an optional `[agent-id]` argument:
- **Registered Worker:** Argument is optional (ignored if registered — the Worker knows its bus path).
- **Unregistered Worker:** Argument is required. The Worker resolves the agent-id, registers, and reads the Task Bus.

---

## 2. Task Bus Detection

Perform the following actions:

1. **Determine registration state:**
   - If Worker is registered → resolve bus path from registration. Skip to step 3.
   - If Worker is not registered → argument `{ARGS}` is required. If no argument provided, inform User that an agent-id is required before registration. Proceed to step 2.

2. **Resolve agent-id** (unregistered Workers only):
   - Resolve `{ARGS}` against `.apm/bus/` directory names per `{SKILL_PATH:apm-communication}` §2.6 Agent-ID Resolution Standards.
   - Register as the resolved Agent per `{COMMAND_PATH:apm-3-initiate-worker}` §2.1 Worker Registration.

3. **Read Task Bus** at `.apm/bus/<agent-slug>/apm-task.md`.
   - If empty → inform User that no pending task is available. Await next invocation.
   - If content present → proceed to step 4.

4. **Process Task:**
   - Cross-validate `agent_id` field in YAML frontmatter matches registered identity. Mismatch flags a routing error — inform User.
   - Process the task per `{GUIDE_PATH:task-execution}` §3 Task Execution Procedure.

---

## 3. Operating Rules

### 3.1 Instance Boundaries

After registration, only accept Task Assignments for your registered AgentID per `{COMMAND_PATH:apm-3-initiate-worker}` §5.1 Instance Boundaries. When receiving an assignment for a different AgentID, decline and direct User to the correct Worker Agent session.

### 3.2 Communication Standards

- Reference guides and skills by path — do not quote their content.
- Write to Report Bus per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery.
- Keep communication concise — detailed information belongs in Memory Logs.

---

**End of Command**
