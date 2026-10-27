---
name: apm-6-handoff-manager
description: Perform a Handoff with an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Handoff Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

## 1. Overview

On User-initiated Manager Handoff, transfer working context through a persistent Handoff Log and a current continuation prompt on the Handoff Bus. The incoming Manager also loads planning documents, guides, skills and Task Logs; the log supplements those artifacts.

## 2. Handoff Procedure

Before writing either artifact, check the current state yourself: read the Tracker and each Worker's bus files. When version control is active, check branches, worktrees and merges with git. Write only checked state in the log and the prompt; your memory of earlier turns may be out of date.

### 2.1 Handoff Log Creation

Write the log’s narrative in past tense, recording actions, decisions and observations from this instance. Put current state and continuation in the Handoff Bus prompt. Include the bus path in the log and the log path in the prompt.

Determine your instance number and the next one (current + 1). Write the log per §3 with past work, decisions, approaches and useful observations not already captured elsewhere. Include tracked Worker Handoffs and their dependency implications, VC actions and repository state observed in the Tracker, User preferences and coordination insights. If your context was compacted or recovered in this conversation, say which parts of the log you rebuilt from a summary or from files rather than remember yourself, and name where they came from.

### 2.2 Handoff Prompt Creation

Prepare the prompt per §4 with current state and an actionable resumption step. Describe outstanding Tasks fully: objectives, outputs, instructions, review criteria, relevant Spec content, dependencies and workspace. Worker Task Buses may already be cleared. Include pending reviews/outcomes, active Workers and required log/file reads.

### 2.3 User Review and Finalization

Read and write `.apm/bus/manager/handoff.md`. Give the User both artifact paths and ask them to review both files. Apply corrections and ask again. After the User approves, direct them to invoke `apm-2-initiate-manager` in a new chat. The next Manager detects the bus automatically. Your outgoing duties then end.

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

- `agent`: Always `manager`.
- `outgoing`: Current instance number.
- `incoming`: Next instance number.
- `handoff`: Handoff sequence number (equals the outgoing instance number).
- `stage`: Current Stage number.

**Body:**

- *Title:* `# Manager Handoff <N> (Manager <N> → Manager <N+1>)`. Each section uses `##` heading.
- *Summary:* Stages coordinated, Tasks reviewed, dispatch cycles completed.
- *Working Context.* Tracked Worker Handoffs table (Agent, Handoff Stage, current-Stage logs loaded, notes) with dependency context implication. VC actions and observed branch, worktree, merge and base-branch state. Dispatch patterns.
- *Working Notes:* Coordination insights, User preferences, decisions made, approaches tried.

---

## 4. Handoff Prompt Structure

Written to `.apm/bus/manager/handoff.md`. The incoming Manager processes this prompt during auto-detection in the init command.

**Required content:**

- *Identity:* Outgoing and incoming instance numbers.
- *Rebuilding context:*
  1. Read Handoff Log - note tracked Worker Handoffs and VC state.
  2. Read current-Stage Task Logs (all agents).
  3. For previous-Stage dependency context encountered later: read the specific Task Log on demand. If the Task Log is insufficient, read referenced files to reconstruct context.

- *Current State:* Current Stage, Stage progress, next Task, blockers, working notes and current VC state (active branches, worktrees, pending merges, base branch).
- *Immediate Next Action:* Specific coordination action to resume.
- *Closing instruction:* Output a concise understanding summary (project state, Worker Handoffs and implications, VC state, next action) then proceed with coordination.
