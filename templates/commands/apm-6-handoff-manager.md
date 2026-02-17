---
command_name: handoff-manager
description: Initiates and guides the Manager through the Handoff Procedure to transfer coordination context to an Incoming Manager instance.
---

# APM {VERSION} - Manager Handoff Command

## 1. Overview

This command initiates the Handoff Procedure for a Manager approaching context window limits. The Outgoing Manager creates two artifacts:
- **Handoff Memory Log:** Working context not captured in Coordination Artifacts or Memory Logs, stored in `.apm/Memory/Handoffs/Manager_Handoffs/`.
- **Handoff Prompt:** Written to the Handoff Bus, instructing the Incoming Manager to reconstruct context procedurally.

The Incoming Manager rebuilds working context from Coordination Artifacts, guides, skills, Memory Logs, and the Handoff Memory Log — not from the Handoff Memory Log alone.

---

## 2. Handoff Eligibility

Handoff is eligible at any point as long as the Handoff Prompt captures comprehensive current state. The requirement is documentation completeness, not workflow stage.

**Handoff Prompt comprehensiveness requires** the Outgoing Manager to describe:
- Outstanding tasks with enough detail for the Incoming Manager to review reports properly — task objectives, expected outputs, review criteria, relevant specification sections.
- Mid-review progress if a review is in progress.
- Pending dispatches and which Workers are active.
- Any investigation or artifact modification in progress.

**No blocking scenarios.** The Manager can Handoff mid-review, with outstanding dispatches, or while awaiting Reports. The requirement shifts from "complete everything first" to "document everything comprehensively."

---

## 3. Handoff Procedure

Execute when User initiates Handoff and eligibility is confirmed.

### 3.1 Eligibility Check

Assess against §2 criteria. If not eligible, deny with reason and re-offer after completion. If eligible, proceed to §3.2.

### 3.2 Handoff Memory Log Creation

Perform the following actions:
1. Determine session numbers: your current session number and Incoming Manager session number (yours + 1).
2. Increment Manager Handoffs counter in Memory Root.
3. Create Handoff Memory Log per §4 Handoff Memory Log Structure, capturing **past actions** — what WAS done:
   - Tracked Worker Handoffs (which Workers, from which Stage) — most critical for Context Dependency treatment.
   - VC state: active branches, worktrees, pending merges per `{SKILL_PATH:apm-version-control}`.
   - User preferences and communication patterns.
   - Coordination insights, decisions made, approaches tried, not captured elsewhere.
   - Working notes from this session.

**Content focus:** Strictly past tense. What was done, what was decided, what was observed. No current state — current state belongs in the Handoff Prompt.

### 3.3 Handoff Prompt Creation

Perform the following actions:
1. Create Handoff Prompt per §5 Handoff Prompt Structure, capturing **current state** — what IS happening:
   - Outstanding tasks with review-relevant detail: objectives, expected outputs, review criteria, relevant specification sections.
   - Mid-review progress and pending review outcomes.
   - Active Workers and their dispatch state.
   - Pointers to memory logs and files the Incoming Manager should read.

**Content focus:** Actionable, present-tense, one-time. The Incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

### 3.4 User Review and Finalization

Perform the following actions:
1. Write Handoff Prompt to Handoff Bus per `{SKILL_PATH:apm-communication}` §3.6 Handoff Bus Protocol.
2. Present both artifacts to User: Handoff Memory Log (file path) and Handoff Prompt (Bus path). Request review and direct User to start a new session using `/apm-2-initiate-manager` — the Incoming Manager will auto-detect the Handoff Prompt.
3. If modifications requested, update accordingly. Session ends when User starts the new session.

---

## 4. Handoff Memory Log Structure

Contains working context not captured in Coordination Artifacts or Memory Logs. The Incoming Manager reconstructs primary context from artifacts — this file provides supplementary context.

**Location:** `.apm/Memory/Handoffs/Manager_Handoffs/Manager_Handoff_Log_<N>.md`

**YAML Frontmatter:**

    ---
    outgoing_manager: Manager_Session_<N>
    incoming_manager: Manager_Session_<N+1>
    handoff_number: <N>
    current_stage: <Stage number and name>
    timestamp: <Date/time of Handoff>
    ---

**Body Sections:** `#` title with handoff number and session. Each section uses `##` heading.

- **Tracked Worker Handoffs** — table of Workers that performed Handoffs: Agent ID, Handoff Stage, current-Stage logs loaded, notes. Include Context Dependency implication: previous-Stage Same-Agent Dependencies become Cross-Agent.
- **VC State** — active feature branches, worktrees, pending merges, base branch, any branch protection notes. Incoming Manager reads this to resume VC coordination per `{SKILL_PATH:apm-version-control}`.
- **User Preferences** — communication patterns, explanation preferences, feedback style.
- **Coordination Insights** — decisions, rationale, or observations not captured elsewhere.
- **Working Notes** — any other context that would be lost without explicit capture.

---

## 5. Handoff Prompt Structure

The Handoff Prompt instructs the Incoming Manager to reconstruct context procedurally. Written to `.apm/bus/manager/apm-handoff.md`.

The Incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

**Required content:** Structure with `#` title and `##` section headings.

- **Session takeover statement:** "You are taking over from Manager Session <N> as Manager Session <N+1>."
- **Rebuilding context:**
  1. Read Handoff Memory Log — note Tracked Worker Handoffs and VC state.
  2. Read current-Stage Memory Logs (all Agents).
  3. For previous-Stage Context Dependencies encountered later: read the specific Task Memory Log on demand. If the Task Memory Log is insufficient, read referenced files to reconstruct context.
- **Current Session State:** current Stage, Stage progress, next Task, blockers, working notes.
- **Immediate Next Action:** specific coordination action to resume.
- **Closing instruction:** Output a concise understanding summary (project state, Worker Handoffs and implications, VC state, next action) then proceed with coordination.

---

**End of Command**
