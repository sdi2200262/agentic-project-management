---
name: apm-6-handoff-manager
description: Perform a Handoff with an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Handoff

Follow these instructions only when the User requests a Manager Handoff or an APM instruction directs you here. Otherwise, stop.

A Manager Handoff continues coordination in a new Manager conversation within the same session. As the outgoing Manager, write two files. The Handoff Log preserves this conversation's working context. The Handoff Prompt, in `.apm/bus/manager/handoff.md`, tells the next conversation what to read and where to resume. The next conversation also reads the planning documents, the Tracker and the Index at initiation, per `{SKILL_PATH:apm-2-initiate-manager}`.

Your conversation number starts at 1 and advances only at Handoff. Use the number from your incoming Handoff Prompt if present; the next conversation is one higher.

## 1. Current State

If subagents are running when a Handoff is requested, tell the User, pause them and collect their progress, outputs and pending checks before preparing the Handoff.

Check current state before writing either file:

- Read the Tracker and each Worker’s bus files. Check progress, outputs and pending validation for your active Tasks, including subagent contributions.
- With version control, use git to check branches, worktrees and merges.

Check the continuation details in §3 and bring the Tracker up to date before writing the two files.

## 2. Handoff Log

Write the Handoff Log per §5.1. Record in past tense what this conversation did: Stages, Tasks and reviews handled, decisions with reasons, User preferences, dispatch patterns and coordination observations absent from the Tracker, Index and Task Logs. If context was compacted or recovered, identify the parts rebuilt from summaries or files, their sources and any resulting uncertainty or unverified claims.

## 3. Handoff Prompt

Write `.apm/bus/manager/handoff.md` per §5.2. Name the latest relevant attempt logs for current Tasks and earlier work needed by pending reviews or dependencies; earlier attempts remain accessible through links. Include resume points and sources for pending alignment or verification gaps.

Record what work the User holds, any assistance needed, where to resume and what allows work to resume. Carry forward agreed review points, pending decisions and accepted limits with evidence links.

## 4. Continuation Instructions

Give a small chat recap of the work and context being passed on, pending decisions or checks, and the next action. Explain how the User starts a new Manager conversation; it finds the Handoff Prompt. You may link the files for optional review, but do not require inspection or approval.

By default your preparation ends here: wait while the User completes delivery to the new conversation. Do not claim to transfer yourself. Follow a different coordination mechanism only when explicitly agreed with the User.

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
