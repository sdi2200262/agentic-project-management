---
command_name: handoff-manager
description: Perform a Handoff with an APM Manager.
---

# APM {VERSION} - Manager Handoff Command

## 1. Overview

This command initiates the Handoff procedure for a Manager approaching context window limits. The outgoing Manager creates two artifacts:
- **Handoff Log:** Working context not captured in planning documents or Task Logs, stored in `.apm/memory/handoffs/manager/`.
- **Handoff prompt:** Written to the Handoff Bus, instructing the incoming Manager to reconstruct context procedurally.

The incoming Manager rebuilds working context from planning documents, guides, skills, Task Logs, and the Handoff Log - not from the Handoff Log alone.

---

## 2. Handoff Procedure

Execute when User initiates Handoff.

### 2.1 Handoff Log Creation

Perform the following actions:
1. Determine instance numbers: your current instance number and incoming Manager instance number (yours + 1).
2. Create Handoff Log per §3 Handoff Log Structure, capturing **past actions** - what WAS done:
   - Coordination overview: Stages managed, Tasks reviewed, dispatch cycles completed.
   - Tracked Worker Handoffs (which Workers, from which Stage) - most critical for dependency context treatment.
   - If auto-compaction occurred during this instance, note it and describe which portions of working context are reconstructed rather than first-hand from the summary.
   - VC state extracted from the Tracker in context: active branches, worktrees, pending merges.
   - User preferences and communication patterns.
   - Coordination insights, decisions made, approaches tried.

**Content focus:** Strictly past tense. What was done, what was decided, what was observed. No current state - current state belongs in the handoff prompt.

### 2.2 Handoff Prompt Creation

Perform the following actions:
1. Create handoff prompt per §4 Handoff Prompt Structure, capturing **current state** - what IS happening:
   - Outstanding Tasks in full: objectives, expected outputs, detailed instructions, review criteria, relevant Spec sections, dependency context, workspace information.
   - Mid-review progress and pending review outcomes.
   - Active Workers and their dispatch state.
   - Pointers to Task Logs and files for the incoming Manager to read.

**Content focus:** Actionable, present-tense, one-time. The incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

### 2.3 User Review and Finalization

Perform the following actions:
1. Write handoff prompt to Handoff Bus per `{SKILL_PATH:apm-communication}` §4.10 Handoff Bus Protocol.
2. Present both artifacts to User: Handoff Log (file path) and handoff prompt (bus path). Request review and direct User to start a new chat and run `/apm-2-initiate-manager` - the incoming Manager will auto-detect the handoff prompt.
3. If modifications requested, update accordingly. This completes the outgoing Manager's duties.

---

## 3. Handoff Log Structure

Contains working context not captured in planning documents or Task Logs. The incoming Manager reconstructs primary context from artifacts - this file provides supplementary context.

**Location:** `.apm/memory/handoffs/manager/handoff-<NN>.log.md`

**YAML Frontmatter Schema:**
```yaml
---
agent: manager
outgoing: <N>
incoming: <N+1>
handoff: <N>
stage: <N>
---
```

**Field Descriptions:**
- `agent`: string, required. Always `manager`.
- `outgoing`: integer, required. Current instance number.
- `incoming`: integer, required. Next instance number.
- `handoff`: integer, required. Handoff sequence number.
- `stage`: integer, required. Current Stage number.

**Body:**
- *Title:* `# Manager Handoff <N> (Manager <N> → Manager <N+1>)`. Each section uses `##` heading.
- *Summary:* Stages coordinated, Tasks reviewed, dispatch cycles completed.
- *Working Context:* Tracked Worker Handoffs table (Agent, Handoff Stage, current-Stage logs loaded, notes) with dependency context implication. VC state: active branches, worktrees, pending merges, base branch. Dispatch patterns.
- *Working Notes:* Coordination insights, user preferences, decisions made, approaches tried.

---

## 4. Handoff Prompt Structure

The handoff prompt instructs the incoming Manager to reconstruct context procedurally. Written to `.apm/bus/manager/handoff.md`.

The incoming Manager processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

**Required content:**
- *Takeover statement:* "You are taking over from Manager [N] as Manager [N+1]."
- *Rebuilding context:*
  1. Read Handoff Log - note tracked Worker Handoffs and VC state.
  2. Read current-Stage Task Logs (all agents).
  3. For previous-Stage dependency context encountered later: read the specific Task Log on demand. If the Task Log is insufficient, read referenced files to reconstruct context.
- *Current State:* Current Stage, Stage progress, next Task, blockers, working notes.
- *Immediate Next Action:* Specific coordination action to resume.
- *Closing instruction:* Output a concise understanding summary (project state, Worker Handoffs and implications, VC state, next action) then proceed with coordination.

---

**End of Command**
