---
command_name: handoff-worker
description: Initiates and guides a Worker through the Handoff Procedure to transfer execution context to an Incoming Worker instance.
---

# APM {VERSION} - Worker Handoff Command

## 1. Overview

This command initiates the Handoff Procedure for a Worker approaching context window limits. The Outgoing Worker creates two artifacts:
- **Handoff Memory Log:** Working context from the current session, stored in `.apm/Memory/Handoffs/<AgentID>_Handoffs/`.
- **Handoff Prompt:** Written to the Handoff Bus, instructing the Incoming Worker to reconstruct context.

The Incoming Worker rebuilds working context from the Handoff Memory Log and current Stage Task Memory Logs — not from the Handoff Memory Log alone.

**Important:** The Incoming Worker must indicate Handoff status in their first Task Report. This triggers the Manager's Handoff Detection, which affects Context Dependency classification for future task assignments.

---

## 2. Handoff Eligibility

Handoff is eligible at any point — between Tasks or mid-Task — as long as the Handoff Prompt captures comprehensive current state.

**Between-Tasks handoff:** Standard handoff. Task Bus is cleared (Clear-on-Return fired when writing the report). Handoff Prompt states "no active task, await `/apm-4-check-tasks`."

**Mid-Task handoff:** Task Bus still contains the original task prompt (Clear-on-Return hasn't fired). Handoff Prompt references it directly: "Read the task from `apm-task.md`, I completed steps 1-4, resume from step 5." Execution progress must be captured in detail.

**No blocking scenarios.** The requirement shifts from "complete everything first" to "document everything comprehensively."

---

## 3. Handoff Procedure

Execute when User initiates Handoff and eligibility is confirmed.

### 3.1 Eligibility Check

Assess against §2 criteria. If not eligible, deny with reason and re-offer after Task completion. If eligible, proceed to §3.2.

### 3.2 Handoff Memory Log Creation

Perform the following actions:
1. Determine session numbers: your current session number and Incoming Worker session number (yours + 1).
2. Create Handoff Memory Log per §4 Handoff Memory Log Structure, capturing **past actions** — what WAS done:
   - Tasks completed and Stage progress this session.
   - Working context, patterns, and approaches established during this session.
   - Technical notes not captured in Task Memory Logs.
   - If mid-task, include execution progress framed as past work (steps completed, approaches tried).

**Content focus:** Strictly past tense. What was done, what was tried, what was observed. No current state — current state belongs in the Handoff Prompt.

### 3.3 Handoff Prompt Creation

Perform the following actions:
1. Create Handoff Prompt per §5 Handoff Prompt Structure, capturing **current state** — what IS happening.
2. Apply Worker handoff asymmetry:
   - *Mid-Task:* "Read the task from `apm-task.md`, I completed steps 1-4, resume from step 5." Reference the intact Task Bus. Include execution progress detail.
   - *Between-Tasks:* "No active task, await `/apm-4-check-tasks`." State session context and readiness.
3. Include: session takeover statement, Handoff Memory Log path, instructions to read current Stage Task Memory Logs, reminder to indicate Incoming Worker status in first Task Report, and continuation guidance.

**Content focus:** Actionable, present-tense, one-time. The Incoming Worker processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

### 3.4 User Review and Finalization

Perform the following actions:
1. Write Handoff Prompt to Handoff Bus per `{SKILL_PATH:apm-communication}` §3.6 Handoff Bus Protocol.
2. Present both artifacts to User: Handoff Memory Log (file path) and Handoff Prompt (Bus path). Request review and direct User to start a new session using `/apm-3-initiate-worker <agent-id>` — the Incoming Worker will auto-detect the Handoff Prompt.
3. If modifications requested, update accordingly. Session ends when User starts the new session.

---

## 4. Handoff Memory Log Structure

Contains working context from this session that supports the Incoming Worker's execution. Task Memory Logs contain task-specific details — this file provides session-level context.

**Location:** `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`

**YAML Frontmatter:**

    ---
    agent_id: <AgentID>
    outgoing_worker: <AgentID>_Session_<N>
    incoming_worker: <AgentID>_Session_<N+1>
    handoff_number: <N>
    current_stage: <Stage number and name>
    timestamp: <Date/time of Handoff>
    ---

**Body Sections:** `#` title with Agent ID and handoff number. Each section uses `##` heading.

- **Session Summary** — Tasks completed count, current Stage, Stage progress for this Worker.
- **Working Context** — Patterns, approaches, or context established during this session.
- **Technical Notes** — Technical details or environment observations not captured in Task Memory Logs.
- **Continuation Guidance** — Specific guidance for the Incoming Worker about in-progress patterns or upcoming work.

---

## 5. Handoff Prompt Structure

The Handoff Prompt instructs the Incoming Worker to reconstruct context. Written to `.apm/bus/<agent-slug>/apm-handoff.md`.

The Incoming Worker processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

**Required content:** Structure with `#` title and `##` section headings.

- **Session takeover statement:** "You are taking over from [AgentID] Session <N> as [AgentID] Session <N+1>."
- **Rebuilding context:**
  1. Read Handoff Memory Log — note working context, technical notes, continuation guidance.
  2. Read current Stage Task Memory Logs (this Worker's logs only).
  3. Previous Stage logs are not loaded; Manager provides comprehensive context via Task Prompts for Cross-Stage dependencies.
- **Current Session State:** current Stage, Tasks completed this session, notes.
- **Incoming Worker Indication:** Remind Incoming Worker to include Handoff status in first Task Report — state session number and list current Stage logs loaded. This triggers Manager Handoff Detection.
- **Immediate Next Action:** Await next Task Prompt from User via `/apm-4-check-tasks`.
- **Closing instruction:** Confirm to User that Handoff Memory Log and Stage context have been read, then state readiness for next Task Prompt.

---

**End of Command**
