---
priority: 6
command_name: handoff-worker
description: Initiates and guides a Worker Agent through the Handoff Procedure to transfer execution context to a Continuing Worker Agent instance.
---

# APM {VERSION} — Worker Agent Handoff Command

## 1. Overview

This command initiates the Handoff Procedure for a Worker Agent approaching context window limits. The Outgoing Worker creates two artifacts:

- **Handoff Memory Log:** A markdown file stored in `.apm/Memory/Handoffs/<AgentID>_Handoffs/` containing working context from the current session
- **Handoff Prompt:** A markdown code block for User to copy-paste to a new Worker Agent session, instructing the Continuing Worker to reconstruct context

The Continuing Worker reconstructs context by reading the Handoff Memory Log and current Stage Task Memory Logs—not from the Handoff Memory Log alone.

**Important:** The Continuing Worker must indicate their Handoff status in their first Task Report. This triggers the Manager Agent's Handoff Detection, which affects how Context Dependencies are classified for future Task Assignments.

---

## 2. Handoff Eligibility

Handoff is only eligible between Tasks, not mid-Task.

### 2.1 Eligibility Requirements

The Worker MUST have completed the current Task cycle:
- Task Execution complete
- Task Validation complete
- Task Memory Log written
- Task Report output to User

### 2.2 Blocking Scenarios

Handoff requests **MUST be denied** when Worker is:
- Mid-execution (Task steps in progress)
- Mid-validation (validation not yet complete)
- Mid-delegation (Delegation Prompt issued but Delegation Report not yet received)
- Awaiting User action required by the Task (User validation pending, User coordination step pending)
- Has received a Task Assignment but not yet started execution

### 2.3 Handoff Denial

When Handoff is not eligible, deny the request using this template:
```
I cannot proceed with Handoff because I am currently [blocking scenario]. [Brief description of what's in progress]

Handoff requires a complete Task cycle. The Continuing Worker needs the Task Memory Log and Task Report from this Task to continue effectively.

Once I complete this Task and output the Task Report, Handoff will be eligible. Would you like me to proceed with Handoff after I complete this Task?
```

**After Denial — Complete Current Task:**

After denying Handoff, continue with the current Task. Once the Task is complete (Memory Log written, Task Report output), explicitly re-offer Handoff:
```
The Task is now complete and logged.

Would you still like to proceed with Handoff?
```

---

## 3. Handoff Procedure

Execute this procedure when User initiates Handoff and eligibility is confirmed.

### 3.1 Eligibility Check

* **Action 1:** Assess current state against §2 Handoff Eligibility criteria
* **Action 2:** If not eligible → Deny with specific reason per §2.3, complete current Task, then re-confirm with User
* **Action 3:** If eligible → Proceed to §3.2 Handoff Memory Log Creation

### 3.2 Handoff Memory Log Creation

* **Action 1:** Determine your Worker instance number:
  - If you are the First Worker (registered via Task Assignment) → You are **[AgentID] Worker 1**
  - If you are a Continuing Worker (registered via Handoff Prompt) → Your instance number is stated in the Handoff Prompt you received at initiation
* **Action 2:** Calculate Continuing Worker number: `<Your-Instance-Number> + 1`
* **Action 3:** Create Handoff Memory Log following §4 Handoff Memory Log Structure, including:
  - Your instance number as `outgoing_worker`
  - Working context and patterns observed during this session
  - Any notes or insights not captured in Task Memory Logs
  - Continuation guidance for the next Worker
* **Action 4:** Save to `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<Your-Instance-Number>.md`
  - Create the directory if it doesn't exist

### 3.3 Handoff Prompt Creation

* **Action 1:** Create Handoff Prompt following §5 Handoff Prompt Structure
* **Action 2:** Include:
  - Explicit statement: "You are taking over from [AgentID] Worker <N> as Continuing [AgentID] Worker <N+1>"
  - Path to Handoff Memory Log
  - Instructions to read current Stage Task Memory Logs (only this Worker's logs)
  - Reminder to indicate Continuing Worker status in first Task Report
  - Current session state summary
* **Action 3:** Output as markdown code block for User copy-paste

### 3.4 User Review and Finalization

* **Action 1:** Present both artifacts to User:
  - Handoff Memory Log (created as file)
  - Handoff Prompt (output as markdown code block)
* **Action 2:** Request User review:
  ```
  Handoff artifacts created:

  **Handoff Memory Log:** `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`

  **Handoff Prompt:** Ready for copy-paste below.

  Please review both artifacts. Let me know if any modifications are needed, otherwise copy the Handoff Prompt to a new Worker Agent session to initialize the Continuing Worker.
  ```
* **Action 3:** If User requests modifications → Update artifacts accordingly
* **Action 4:** User copies Handoff Prompt to new session; this session ends

---

## 4. Handoff Memory Log Structure

The Handoff Memory Log contains working context from this session that supports the Continuing Worker's execution. Task Memory Logs contain task-specific details—this file provides session-level context.

**Location:** `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`

**YAML Frontmatter Structure:**

```yaml
---
agent_id: <AgentID>
outgoing_worker: <AgentID>_Worker_<N>
continuing_worker: <AgentID>_Worker_<N+1>
handoff_number: <N>
current_stage: <Stage number and name>
timestamp: <Date/time of Handoff>
---
```

**Markdown Body Structure:**

```markdown
# Worker Agent Handoff Memory Log

## Session Summary

**Tasks Completed This Session:** [Count and brief list]
**Current Stage:** Stage <N> — <Name>
**Stage Progress:** [X/Y Tasks complete for this Worker in current Stage]

## Working Context

[Patterns, approaches, or context established during this session that inform future Task execution]

- [Context item 1]
- [Context item 2]

## Technical Notes

[Technical details, environment observations, or implementation notes not captured in Task Memory Logs]

- [Note 1]
- [Note 2]

## Continuation Guidance

[Specific guidance for the Continuing Worker about in-progress patterns or upcoming work]

- [Guidance item 1]
- [Guidance item 2]
```

---

## 5. Handoff Prompt Structure

The Handoff Prompt instructs the Continuing Worker to reconstruct context from the Handoff Memory Log and current Stage Task Memory Logs. The Handoff Prompt is presented as a **markdown code block** in the chat:

````markdown
# APM Worker Agent Handoff — <AgentID>

You are taking over from **<AgentID> Worker <N>** as **Continuing <AgentID> Worker <N+1>**.

## Context Reconstruction Protocol

Follow this sequence to reconstruct execution context:

### 1. Read Handoff Memory Log
- Path: `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`
- Note working context, technical notes, and continuation guidance

### 2. Read Current Stage Task Memory Logs
Read your Task Memory Logs from the current Stage:
- Directory: `.apm/Memory/Stage_<N>_<Slug>/`
- Files: All `Task_Log_*` files created by <AgentID>

**Note:** Previous Stage Task Memory Logs are not loaded for efficiency. The Manager Agent tracks this and will provide comprehensive context in future Task Assignments when Cross-Stage dependencies exist.

## Current Session State

- **Current Stage:** Stage <N> — <Stage Name>
- **Tasks Completed (this Worker):** [List of Task IDs completed this session]
- **Notes:** [Any specific notes about current state]

## Continuing Worker Indication

**Important:** In your first Task Report after completing a Task, you must indicate that you are a Continuing Worker. Include in your Task Report:

    **Continuing Worker:** This is <AgentID> Worker <N+1>, continuing from Worker <N>.
    **Current Stage Logs Loaded:** [List the Task Memory Logs you read]

This indication allows the Manager Agent to track Worker Handoffs and adjust Context Dependency handling accordingly.

## Immediate Next Action

Await the next Task Assignment Prompt from User. When received, proceed with Task Execution per `{SKILL_PATH:task-execution/SKILL.md}`.

---

After completing context reconstruction, confirm to User:

    Handoff complete. I have read the Handoff Memory Log and [N] Task Memory Logs from Stage <N>.

    Ready to receive the next Task Assignment Prompt for **<AgentID>**.
````

---

**End of Command**