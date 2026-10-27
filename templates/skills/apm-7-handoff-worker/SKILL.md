---
name: apm-7-handoff-worker
description: Perform a Handoff with an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Handoff Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

## 1. Overview

On User-initiated Worker Handoff, write a persistent Handoff Log and a current continuation prompt on the Handoff Bus. The successor loads these and its own current-Stage Task Logs. Its first report must identify the new instance and loaded logs so the Manager can adjust future dependency context.

## 2. Handoff Procedure

Before writing either artifact, check the current state yourself: read your Task Bus and Report Bus files. When version control is active, use git to check your branch, its commits and whether the Manager has merged it. Write only checked state in the log and the prompt; your memory of earlier turns may be out of date.

### 2.1 Handoff Log Creation

Write the log’s narrative in past tense, recording actions, decisions and observations from this instance. Put current state and continuation in the Handoff Bus prompt. Include the bus path in the log and the log path in the prompt.

Determine your instance number and the next one (current + 1). Write the log per §3 with completed work, approaches tried, established patterns and technical context not in Task Logs. Include completed steps for a mid-Task transfer. If your context was compacted or recovered in this conversation, say which parts of the log you rebuilt from a summary or from files rather than remember yourself, and name where they came from.

### 2.2 Handoff Prompt Creation

Write current state and concrete continuation instructions per §4.

- Mid-Task: the original prompt remains in Task Bus. Identify completed work and where to resume; direct the successor to read it.
- Mid-batch: the envelope remains in Task Bus. Identify each completed/logged Task, current progress and unstarted work, with the exact continuation point.
- Between Tasks: Task Bus is cleared. State readiness to await `apm-4-check-tasks`.

Include the Handoff Log path and current-Stage log reads. Require the first report to state the new instance and specific logs loaded, noting when previous-Stage logs were not loaded.

### 2.3 User Review and Finalization

Read and write `.apm/bus/<agent-slug>/handoff.md`. Give the User both artifact paths and ask them to review both files. Apply corrections and ask again. After the User approves, direct them to invoke `apm-3-initiate-worker <agent-id>` in a new chat. The next Worker detects the handoff automatically. Your outgoing duties then end.

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
- *Summary:* Tasks completed and Stage progress during this instance.
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
- *Immediate Next Action:* For mid-Task or mid-batch, instruct the incoming Worker to read the Task Bus and continue. For between-Tasks, state readiness to await `apm-4-check-tasks`.
- *Closing instruction:* Tell the User which files you read and what you'll do next.
