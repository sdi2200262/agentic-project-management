---
priority: 5
command_name: handoff-manager
description: Initiates and guides the Manager Agent through the Handoff Procedure to transfer coordination context to an Incoming Manager Agent instance.
---

# APM {VERSION} - Manager Agent Handoff Command

## 1. Overview

This command initiates the Handoff Procedure for a Manager Agent approaching context window limits. The Outgoing Manager creates two artifacts:
- **Handoff Memory Log:** A markdown file stored in `.apm/Memory/Handoffs/Manager_Handoffs/` containing working context not captured in Coordination Artifacts or Memory Logs
- **Handoff Prompt:** A markdown code block for User to copy-paste to a new chat session, instructing the Incoming Manager to reconstruct context procedurally

The Incoming Manager reconstructs context by reading Coordination Artifacts, Skills, Memory Logs, and the Handoff Memory Log-not from the Handoff Memory Log alone.

---

## 2. Handoff Eligibility

Handoff is only eligible when the current Task Cycle is complete.

**Eligibility Requirements:**

The Manager MUST have completed:
- Task Assignment Prompt issued to Worker Agent
- Task Report received from User
- Task Memory Log reviewed
- Coordination Decision made (proceed to next Task, FollowUp, or Coordination Artifact modification)

**Blocking Scenarios:**

Handoff requests **MUST be denied** when Manager is:
- Waiting for Task Report (Task Assignment issued but Worker hasn't completed)
- Mid-review (Task Report received but Coordination Decision not yet made)
- Mid-investigation (investigating flags or non-Success status)
- Mid-artifact modification (Coordination Artifact modification in progress)

**If not eligible** → Deny using this template:
```
I cannot proceed with the Handoff because I'm currently [blocking scenario: waiting for Task Report / reviewing Task Report / investigating issues / modifying Coordination Artifact]. [Brief description of what's in progress]

Handoff requires a complete Task Cycle. The Incoming Manager needs [what's missing] to continue coordination effectively.

Once [condition for completion] is done, Handoff will be eligible. Would you like me to proceed with Handoff after I complete this step?
```

**After denial** → Complete the current Task Cycle step. Once complete, re-offer Handoff:
```
Handoff was not eligible when requested - I was [specific Task Cycle action in progress].

That Task Cycle step is now complete. Would you still like to proceed with Handoff?
```

---

## 3. Handoff Procedure

Execute this procedure when User initiates Handoff and eligibility is confirmed.

### 3.1 Eligibility Check

Assess current coordination state against §2 Handoff Eligibility criteria.
- **If not eligible** → Deny with specific reason, complete current step, then re-confirm with User.
- **If eligible** → Proceed to §3.2 Handoff Memory Log Creation.

### 3.2 Handoff Memory Log Creation

Perform the following actions:
1. Determine your Manager Agent session number:
   - If you are Manager Agent Session 1 (first Manager Agent) → Your session number is **1**
   - If you are an Incoming Manager → Your session number is stated in the Handoff Prompt you received at initiation
2. Calculate Incoming Manager session number: `<Your-Session-Number> + 1`
3. Increment the Manager Handoffs counter in Memory Root (`.apm/Memory/Memory_Root.md`)
4. Create Handoff Memory Log per §4 Handoff Memory Log Structure, including:
   - Your session number as `outgoing_manager`
   - Handoff number equals your session number (first handoff = Manager_Handoff_Log_1.md)
   - Tracked Worker Handoffs (most critical) - which Workers performed Handoffs, from which Stage
   - User preferences, communication patterns observed during this session
   - Coordination insights or decisions not captured in Coordination Artifacts or Memory Logs
   - Any working notes that would otherwise be lost

### 3.3 Handoff Prompt Creation

Perform the following actions:
1. Create Handoff Prompt per §5 Handoff Prompt Structure.
2. Include:
   - Explicit statement: "You are taking over from Manager Agent Session <Your Session Number> as Manager Agent Session <Incoming Session Number>"
   - Instructions for Incoming Manager to read Coordination Artifacts and Skills
   - Path to Handoff Memory Log: `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<Your Session Number>.md`
   - Instructions to read ALL current Stage Memory Logs (all Agents)
   - Note about reading previous Stage Task Memory Logs when Context Dependencies require
   - Current session state summary (current Stage, next Task, any blockers)
   - Immediate next action

### 3.4 User Review and Finalization

Perform the following actions:
1. Present both artifacts to User:
   - Handoff Memory Log (created as file)
   - Handoff Prompt (output as markdown code block)
2. Request User review:
   ```
   Handoff artifacts created:

   **Handoff Memory Log:** `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<N>.md`

   **Handoff Prompt:** Ready for copy-paste below.

   Please review both artifacts. Let me know if any modifications are needed, otherwise copy the Handoff Prompt to a new chat session to initialize the Incoming Manager.
   ```
3. If User requests modifications → Update artifacts accordingly
4. User copies Handoff Prompt to new session; this session ends

---

## 4. Handoff Memory Log Structure

The Handoff Memory Log contains working context not captured in Coordination Artifacts or Memory Logs. The Incoming Manager reconstructs primary context from artifacts and logs-this file provides supplementary context only.

**Location:** `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<N>.md`

**YAML Frontmatter Structure:**
```yaml
---
outgoing_manager: Manager_Session_<N>
incoming_manager: Manager_Session_<N+1>
handoff_number: <N>
current_stage: <Stage number and name>
timestamp: <Date/time of Handoff>
---
```

**Markdown Body Structure:**
```markdown
# Manager Agent Handoff Memory Log

## Tracked Worker Handoffs

[List all Worker Agents that performed Handoffs during this Manager Agent session]

| Worker Agent | Handoff Stage | Current Stage Logs Loaded | Notes |
|--------------|---------------|---------------------------|-------|
| <Agent ID> | Stage <N> | [List of logs] | [Any relevant context] |

**Context Dependency Implication:** For these Incoming Worker Agents, any Same-Agent Context Dependencies from Stages before their Handoff must be treated as Cross-Agent Context Dependencies.

## User Preferences

[Communication patterns, explanation preferences, feedback style observed during this session]

- [Preference 1]
- [Preference 2]

## Coordination Insights

[Decisions, rationale, or observations not captured in Coordination Artifacts or Memory Logs]

- [Insight 1]
- [Insight 2]

## Working Notes

[Any other context that would be lost without explicit capture]

- [Note 1]
- [Note 2]
```

---

## 5. Handoff Prompt Structure

The Handoff Prompt instructs the Incoming Manager to reconstruct context procedurally from Coordination Artifacts, Skills, and Memory Logs. The Handoff Memory Log provides supplementary context only. The Handoff Prompt is presented as a **markdown code block** in the chat:
````markdown
# APM Manager Agent Session <N+1> Handoff

You are taking over from **Manager Agent Session <N>** as **Manager Agent Session <N+1>**.

## Context Reconstruction Protocol

Follow this sequence to reconstruct coordination context:

### Read Handoff Memory Log
- `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<N>.md` (where <N> is the outgoing Manager Agent session number from the prompt above)
- **Critical:** Note all Tracked Worker Handoffs-these affect Context Dependency classification

### Read Current Stage Memory Logs
Read ALL Memory Logs from the current Stage (Stage <N>):
- `.apm/Memory/Stage_<N>_<Slug>/` - All Task Memory Logs from all Agents

### Previous Stage Context Dependencies
When you encounter Context Dependencies referencing Tasks from previous Stages that you have no context of:
- Read the specific Task Memory Log when you encounter the dependency
- If the Task Memory Log does not provide sufficient context, read referenced files to reconstruct context needed for accurate Task Assignment Prompt creation

## Current Session State

- **Current Stage:** Stage <N> - <Stage Name>
- **Stage Progress:** <X>/<Y> Tasks complete
- **Next Task:** Task <N.M> - <Title> assigned to <Agent>
- **Blockers:** [Any coordination issues requiring attention, or "None"]
- **Notes:** [Any working notes from current session important for coordination]

## Immediate Next Action

[Specific next coordination action based on when Handoff was requested]

---

After completing context reconstruction, output a concise understanding summary of:
1. Project state and current Stage progress and any working notes
2. Tracked Worker Handoffs and their Context Dependency implications
3. Immediate next action

Then proceed with coordination duties.
````

---

**End of Command**
