---
name: apm-6-handoff-manager
description: Perform a Handoff with an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Handoff

Follow these instructions only when the User requests a Manager Handoff or an APM instruction directs you here. Otherwise, stop.

A Manager Handoff continues coordination in a new Manager conversation within the same session. As the outgoing Manager, write two files. The Handoff Log preserves this conversation's working context. The Handoff Prompt, in `.apm/bus/manager/handoff.md`, tells the next conversation what to read and where to resume. The next conversation also reads the planning documents, the Tracker and the Index at initiation, per `{SKILL_PATH:apm-2-initiate-manager}`.

Your conversation number is 1 if you started from initiation, or the number the Handoff Prompt gave you. The next conversation's number is one higher.

## 1. Current State

If subagents are running when a Handoff is requested, tell the User, pause them and collect their progress, outputs and pending checks before preparing the Handoff.

Your memory of earlier turns may be out of date, so check the current state before writing either file:

- Read the Tracker and each Worker’s bus files. Check progress, outputs and pending validation for your active Tasks, including subagent contributions.
- With version control, use git to check branches, worktrees and merges.

Check the continuation details in §3 and bring the Tracker up to date before writing the two files.

## 2. Handoff Log

Write the Handoff Log per §5.1. Record in past tense what this conversation did: the Stages, Tasks and reviews you handled, decisions with their reasons, User preferences, dispatch patterns and coordination observations that the Tracker, the Index and the Task Logs do not hold. If your context was compacted or recovered in this conversation, say which parts you rebuilt from a summary or from files, and from where.

## 3. Handoff Prompt

Write the Handoff Prompt per §5.2 to `.apm/bus/manager/handoff.md`. Name the latest relevant attempt logs for Tasks in the current Stage and earlier Tasks that pending reviews or upcoming dependencies rely on. Earlier attempts can be followed through links where needed. In Current State, list your active Tasks and where to resume, reports awaiting review, Workers with dispatched Tasks, and branches, worktrees and pending integration or cleanup. Include pending alignment decisions and verification gaps with source paths.

If the User is performing part of the work, record what they are doing, any assistance they may need, and when the agent should resume. Carry forward agreed review points, pending decisions and accepted limitations, with links to their evidence.

## 4. User Review

Give the User both file paths and ask them to review the two files. Apply their corrections and ask again. After they approve, tell them to start a new Manager conversation; it finds the Handoff Prompt on its own. Your work in this conversation then ends.

## 5. Formats

### 5.1 Handoff Log Format

The Handoff Log is written at `.apm/memory/handoffs/manager/handoff-<NN>.log.md`, where `<NN>` is your conversation number, zero-padded, such as `handoff-01.log.md`.

```markdown
---
agent: manager
conversation: <number>
stage: <N>
---

# Manager Handoff Log - Conversation <number>

## Summary
<The Stages, Tasks, reviews and dispatches handled in this conversation>

## Working Context
<Decisions with reasons, User preferences, dispatch patterns and coordination observations that the Tracker, the Index and the Task Logs do not hold>
```

### 5.2 Handoff Prompt Format

```markdown
---
agent: manager
conversation: <number + 1>
handoff_log: <path of the Handoff Log>
---

# Manager Handoff Prompt - Conversation <number + 1>

<What to read: the Handoff Log and the Task Logs the next conversation needs, by path>

## Current State
<Checked state: your active Tasks and progress, reports awaiting review, Workers with dispatched Tasks, work locations and pending integration or cleanup; pending alignment decisions, accepted limitations and verification gaps, with source paths>

## Next Action
<The coordination step to resume with>
```
