---
command_name: handoff-worker
description: Perform a Handoff with an APM Worker.
---

# APM {VERSION} - Worker Handoff Command

## 1. Overview

This command initiates the Handoff procedure for a Worker approaching context window limits. You create two artifacts:
- **Handoff Log:** Working context from the current instance, stored in `.apm/memory/handoffs/<agent>/`.
- **Handoff prompt:** Written to the Handoff Bus, instructing the incoming Worker to reconstruct context.

The incoming Worker rebuilds working context from the Handoff Log and current Stage Task Logs - not from the Handoff Log alone.

The incoming Worker must indicate Handoff status in their first Task Report. This triggers the Manager's Handoff detection, which affects dependency context classification for future Task assignments.

---

## 2. Handoff Procedure

Execute when User initiates Handoff.

### 2.1 Handoff Log Creation

Perform the following actions:
1. Determine instance numbers: your current instance number and incoming Worker instance number (yours + 1).
2. Create Handoff Log per §3 Handoff Log Structure, capturing **past actions** - what was done, tried, and observed. Content is strictly past tense; current state belongs in the handoff prompt.
   - Tasks completed and Stage progress this instance.
   - Working context, patterns, and approaches established during this instance.
   - Technical notes not captured in Task Logs.
   - If mid-Task, include execution progress framed as past work (steps completed, approaches tried).
   - If auto-compaction occurred during this instance, note it and describe which portions of working context are reconstructed rather than first-hand from the summary.

### 2.2 Handoff Prompt Creation

Perform the following actions:
1. Create handoff prompt per §4 Handoff Prompt Structure, capturing **current state** - what is happening now. Content is actionable and present-tense; past actions belong in the Handoff Log.
2. Apply Worker Handoff asymmetry:
   - *Mid-Task:* "Read the Task from `task.md`, I completed steps 1-4, resume from step 5." Direct the incoming Worker to read the Task Bus file directly (intact since Task receipt). Include execution progress detail.
   - *Mid-batch:* The batch is still in `task.md`. Describe the state of each Task in the batch: which are complete (logs written), which is in progress and how far, and which have not been started. The incoming Worker reads the intact batch from the Task Bus and continues from where work left off.
   - *Between-Tasks:* "No active Task, await `/apm-4-check-tasks`." State context and readiness.
3. Include: Handoff Log path, instructions to read current Stage Task Logs, and reminder to indicate incoming Worker status in first Task Report (listing specific Task Log files loaded and, when previous Stages exist, noting that previous-Stage logs were not loaded).

### 2.3 User Review and Finalization

Perform the following actions:
1. Write handoff prompt to the Handoff Bus: `.apm/bus/<agent-slug>/handoff.md`.
2. Present both artifacts to User: Handoff Log (file path) and handoff prompt (bus path). Request review and direct User to start a new chat and run `/apm-3-initiate-worker <agent-id>` - the incoming Worker will auto-detect the handoff prompt.
3. If modifications requested, update accordingly. This completes the outgoing Worker's duties.

---

## 3. Handoff Log Structure

Contains working context from this instance that supports the incoming Worker's execution. Task Logs contain Task-specific details - this file provides instance-level context.

**Location:** `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md`

**YAML Frontmatter Schema:**
```yaml
---
agent: <agent-slug>
outgoing: <N>
incoming: <N+1>
handoff: <N>
stage: <N>
---
```

**Field Descriptions:**
- `agent`: Worker identifier (kebab-case).
- `outgoing`: Current instance number.
- `incoming`: Next instance number.
- `handoff`: Handoff sequence number (equals the outgoing instance number).
- `stage`: Current Stage number.

**Body:**
- *Title:* `# <Display Name> Handoff <N> (<Display Name> <N> → <Display Name> <N+1>)`. Each section uses `##` heading. The display name is the Title Case form of the agent identifier (e.g., `frontend-agent` → `Frontend Agent`).
- *Summary:* Tasks completed count, current Stage, Stage progress for this Worker.
- *Working Context:* Patterns, approaches, or context established during this instance.
- *Working Notes:* Technical details, environment observations, or other context not captured in Task Logs.

---

## 4. Handoff Prompt Structure

Written to `.apm/bus/<agent-slug>/handoff.md`. The incoming Worker processes this prompt during auto-detection in the init command.

**Required content:**
- *Identity:* Outgoing and incoming instance numbers.
- *Rebuilding context:*
  1. Read Handoff Log - note working context and technical notes.
  2. Read current Stage Task Logs (this Worker's logs only).
  3. Do not load previous-Stage logs - the Manager provides comprehensive context via Task Prompts for cross-Stage dependencies.
- *Current State:* Current Stage, Tasks completed this instance, notes.
- *Continuation guidance:* Specific guidance for the incoming Worker about in-progress patterns or upcoming work.
- *Incoming Worker indication:* Remind incoming Worker to include Handoff status in first Task Report - state instance number, list specific Task Log files loaded, and when previous Stages exist note that previous-Stage logs were not loaded. This triggers Manager Handoff detection.
- *Immediate Next Action:* For mid-Task or mid-batch, instruct the incoming Worker to read the Task Bus and continue. For between-Tasks, state readiness to await `/apm-4-check-tasks`.
- *Closing instruction:* Confirm to User that Handoff Log and Stage context have been read, then state readiness.

---

**End of Command**
