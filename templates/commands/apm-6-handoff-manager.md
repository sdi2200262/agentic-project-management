---
command_name: handoff-manager
description: Perform a Handoff with an APM Manager.
---

# APM {VERSION} - Manager Handoff Command

## 1. Overview

This command initiates the Handoff procedure for a Manager approaching context window limits. You create two artifacts:
- **Handoff Log:** Working context not captured in planning documents or Task Logs, stored in `.apm/memory/handoffs/manager/`.
- **Handoff prompt:** Written to the Handoff Bus, instructing the incoming Manager to reconstruct context procedurally.

The incoming Manager rebuilds working context from planning documents, guides, skills, Task Logs, and the Handoff Log - not from the Handoff Log alone.

---

## 2. Handoff Procedure

Execute when User initiates Handoff.

### 2.1 Handoff Log Creation

Perform the following actions:
1. Determine instance numbers: your current instance number and incoming Manager instance number (yours + 1).
2. Create Handoff Log per §3 Handoff Log Structure, capturing **past actions** - what was done, decided, and observed. Content is strictly past tense; current state belongs in the handoff prompt.
   - Coordination overview: Stages managed, Tasks reviewed, dispatch cycles completed.
   - Tracked Worker Handoffs (which Workers, from which Stage) - most critical for dependency context treatment.
   - If auto-compaction occurred during this instance, note it and describe which portions of working context are reconstructed rather than first-hand from the summary.
   - VC state extracted from the Tracker in context: active branches, worktrees, pending merges.
   - User preferences and communication patterns.
   - Coordination insights, decisions made, approaches tried.

### 2.2 Handoff Prompt Creation

Perform the following actions:
1. Create handoff prompt per §4 Handoff Prompt Structure, capturing **current state** - what is happening now. Content is actionable and present-tense; past actions belong in the Handoff Log.
   - Outstanding Tasks in full: objectives, expected outputs, detailed instructions, review criteria, relevant Spec sections, dependency context, workspace information.
   - Mid-review progress and pending review outcomes.
   - Active Workers and their dispatch state.
   - Pointers to Task Logs and files for the incoming Manager to read.

### 2.3 User Review and Finalization

Perform the following actions:
1. Write handoff prompt to the Handoff Bus: `.apm/bus/manager/handoff.md`.
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
- `outgoing`: Current instance number.
- `incoming`: Next instance number.
- `handoff`: Handoff sequence number (equals the outgoing instance number).
- `stage`: Current Stage number.

**Body:**
- *Title:* `# Manager Handoff <N> (Manager <N> → Manager <N+1>)`. Each section uses `##` heading.
- *Summary:* Stages coordinated, Tasks reviewed, dispatch cycles completed.
- *Working Context.* Tracked Worker Handoffs table (Agent, Handoff Stage, current-Stage logs loaded, notes) with dependency context implication. VC state: active branches, worktrees, pending merges, base branch. Dispatch patterns.
- *Working Notes:* Coordination insights, user preferences, decisions made, approaches tried.

---

## 4. Handoff Prompt Structure

Written to `.apm/bus/manager/handoff.md`. The incoming Manager processes this prompt during auto-detection in the init command.

**Required content:**
- *Identity:* Outgoing and incoming instance numbers.
- *Rebuilding context:*
  1. Read Handoff Log - note tracked Worker Handoffs and VC state.
  2. Read current-Stage Task Logs (all agents).
  3. For previous-Stage dependency context encountered later: read the specific Task Log on demand. If the Task Log is insufficient, read referenced files to reconstruct context.
- *Current State:* Current Stage, Stage progress, next Task, blockers, working notes.
- *Immediate Next Action:* Specific coordination action to resume.
- *Closing instruction:* Output a concise understanding summary (project state, Worker Handoffs and implications, VC state, next action) then proceed with coordination.

---

**End of Command**
