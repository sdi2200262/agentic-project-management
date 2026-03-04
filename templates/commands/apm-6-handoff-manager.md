---
command_name: handoff-manager
description: Initiates and guides the Manager through the Handoff procedure to transfer coordination context to an incoming Manager instance.
---

# APM {VERSION} - Manager Handoff Command

## 1. Overview

This command initiates the Handoff procedure for a Manager approaching context window limits. The outgoing Manager creates two artifacts:
- **Handoff Memory Log:** Working context not captured in planning documents or Task Memory Logs, stored in `.apm/Memory/Handoffs/Manager_Handoffs/`.
- **Handoff prompt:** Written to the Handoff Bus, instructing the incoming Manager to reconstruct context procedurally.

The incoming Manager rebuilds working context from planning documents, guides, skills, Task Memory Logs, and the Handoff Memory Log - not from the Handoff Memory Log alone.

---

## 2. Handoff Eligibility

Handoff is eligible at any point as long as the handoff prompt captures comprehensive current state. The requirement is documentation completeness, not workflow stage.

**Handoff prompt comprehensiveness** → The outgoing Manager must describe:
- Outstanding Tasks with enough detail for the incoming Manager to review reports properly - Task objectives, expected outputs, review criteria, relevant Specification sections.
- Mid-review progress if a review is in progress.
- Pending dispatches and which Workers are active.
- Any investigation or artifact modification in progress.

**No blocking scenarios:** The Manager can Handoff mid-review, with outstanding dispatches, or while awaiting reports.

---

## 3. Handoff Procedure

Execute when User initiates Handoff and eligibility is confirmed.

### 3.1 Eligibility Check

Assess against §2 Handoff Eligibility criteria. If not eligible, deny with reason and re-offer after completion. If eligible, proceed to §3.2 Handoff Memory Log Creation.

### 3.2 Handoff Memory Log Creation

Perform the following actions:
1. Determine session numbers: your current session number and incoming Manager session number (yours + 1).
2. Create Handoff Memory Log per §4 Handoff Memory Log Structure, capturing **past actions** - what WAS done:
   - Tracked Worker Handoffs (which Workers, from which Stage) - most critical for dependency context treatment.
   - VC state from the Project Tracker: active branches, worktrees, pending merges.
   - User preferences and communication patterns.
   - Coordination insights, decisions made, approaches tried, not captured elsewhere.
   - Working notes from this session.

**Content focus:** Strictly past tense. What was done, what was decided, what was observed. No current state - current state belongs in the handoff prompt.

### 3.3 Handoff Prompt Creation

Perform the following actions:
1. Create handoff prompt per §5 Handoff Prompt Structure, capturing **current state** - what IS happening:
   - Outstanding Tasks with review-relevant detail: objectives, expected outputs, review criteria, relevant Specification sections.
   - Mid-review progress and pending review outcomes.
   - Active Workers and their dispatch state.
   - Pointers to Task Memory Logs and files for the incoming Manager to read.

**Content focus:** Actionable, present-tense, one-time. The incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

### 3.4 User Review and Finalization

Perform the following actions:
1. Write handoff prompt to Handoff Bus per `{SKILL_PATH:apm-communication}` §3.6 Handoff Bus Protocol.
2. Present both artifacts to User: Handoff Memory Log (file path) and handoff prompt (bus path). Request review and direct User to start a new session using `/apm-2-initiate-manager` - the incoming Manager will auto-detect the handoff prompt.
3. If modifications requested, update accordingly. Session ends when User starts the new session.

---

## 4. Handoff Memory Log Structure

Contains working context not captured in planning documents or Task Memory Logs. The incoming Manager reconstructs primary context from artifacts - this file provides supplementary context.

**Location:** `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<N>.md`

**YAML Frontmatter:**
```yaml
---
outgoing_manager: Manager_Session_<N>
incoming_manager: Manager_Session_<N+1>
handoff_number: <N>
current_stage: <Stage number and name>
timestamp: <Date/time of Handoff>
---
```

**Body Sections:** `#` title with handoff number and session. Each section uses `##` heading.

- *Tracked Worker Handoffs:* Table of Workers that performed Handoffs: Agent ID, Handoff Stage, current-Stage logs loaded, notes. Include dependency context implication: previous-Stage same-agent dependencies become cross-agent.
- *VC State:* Active feature branches, worktrees, pending merges, base branch, any branch protection notes. Sourced from the Project Tracker. The incoming Manager reads this to resume VC coordination.
- *User Preferences:* Communication patterns, explanation preferences, feedback style.
- *Coordination Insights:* Decisions, rationale, or observations not captured elsewhere.
- *Working Notes:* Any other context that would be lost without explicit capture.

---

## 5. Handoff Prompt Structure

The handoff prompt instructs the incoming Manager to reconstruct context procedurally. Written to `.apm/bus/manager/apm-handoff.md`.

The incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

**Required content:** Structure with `#` title and `##` section headings.

- *Session takeover statement:* "You are taking over from Manager Session [N] as Manager Session [N+1]."
- *Rebuilding context:*
  1. Read Handoff Memory Log - note tracked Worker Handoffs and VC state.
  2. Read current-Stage Task Memory Logs (all agents).
  3. For previous-Stage dependency context encountered later: read the specific Task Memory Log on demand. If the Task Memory Log is insufficient, read referenced files to reconstruct context.
- *Current Session State:* current Stage, Stage progress, next Task, blockers, working notes.
- *Immediate Next Action:* specific coordination action to resume.
- *Closing instruction:* Output a concise understanding summary (project state, Worker Handoffs and implications, VC state, next action) then proceed with coordination.

---

**End of Command**
