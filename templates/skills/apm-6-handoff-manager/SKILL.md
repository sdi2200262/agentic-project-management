---
name: apm-6-handoff-manager
description: Perform a Handoff with an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Handoff

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

This skill hands your coordination to a new Manager conversation. You write two files. The Handoff Log is a lasting record of what this conversation did that the Tracker, the Index and the Task Logs do not hold. The Handoff Prompt, in `.apm/bus/manager/handoff.md`, tells the next conversation what to read and where to resume. The next conversation also reads the planning documents, the Tracker and the Index at initiation, per `{SKILL_PATH:apm-2-initiate-manager}`.

Your conversation number is 1 if you started from first initiation, or the number the Handoff Prompt gave you. The next conversation's number is one higher.

## 1. Current State

Your memory of earlier turns may be out of date, so check the current state before writing either file:

- Read the Tracker and each Worker's bus files.
- With version control, use git to check branches, worktrees and merges.

Bring the Tracker up to date with what you find. Write only checked state in the two files.

## 2. Handoff Log

Write the Handoff Log per §5.1. Record in past tense what this conversation did: the Stages and reviews you handled, decisions with their reasons, User preferences, dispatch patterns and coordination observations that the Tracker, the Index and the Task Logs do not hold. If your context was compacted or recovered in this conversation, say which parts you rebuilt from a summary or from files, and from where.

## 3. Handoff Prompt

Write the Handoff Prompt per §5.2 to `.apm/bus/manager/handoff.md`. Name the Task Logs the next conversation needs: those from the current Stage, and any earlier ones that pending reviews or upcoming dependencies rely on. In Current State, list the reports awaiting review, the Workers with dispatched Tasks, and branches, worktrees and merges still pending.

## 4. User Review

Give the User both file paths and ask them to review the two files. Apply their corrections and ask again. After they approve, tell them to invoke `apm-2-initiate-manager` in a new chat; it finds the Handoff Prompt on its own. Your work in this conversation then ends.

## 5. Formats

### 5.1 Handoff Log Format

The Handoff Log is written at `.apm/memory/handoffs/manager/handoff-<NN>.log.md`, where `<NN>` is your conversation number.

```markdown
---
agent: manager
conversation: <number>
stage: <N>
---

# Manager Handoff Log - Conversation <number>

## Summary
<The Stages, reviews and dispatches handled in this conversation>

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
<Checked state: reports awaiting review, Workers with dispatched Tasks, pending branches, worktrees and merges>

## Next Action
<The coordination step to resume with>
```
