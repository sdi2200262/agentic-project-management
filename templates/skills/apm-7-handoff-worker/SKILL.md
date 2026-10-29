---
name: apm-7-handoff-worker
description: Perform a Handoff with an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Handoff

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill hands your work to a new conversation of the same Worker. You write two files. The Handoff Log preserves this conversation's working context. The Handoff Prompt, in your bus folder's `handoff.md`, tells the next conversation what to read and where to resume. The next conversation acts on them per `{SKILL_PATH:apm-3-initiate-worker}` §1.2.

Your conversation number is 1 if you started from initiation, or the number the Handoff Prompt gave you. The next conversation's number is one higher.

## 1. Current State

Your memory of earlier turns may be out of date, so check the current state before writing either file:

- Read `task.md` and `report.md` in your bus folder.
- With version control, use git to check your branch, its commits and whether the Manager has merged it.

Use the checked state in both files, including unresolved contract questions, accepted limitations and verification gaps with source paths.

## 2. Handoff Log

Write the Handoff Log per §5.1. Record in past tense what this conversation did: the Tasks you completed, and the patterns, conventions, decisions with their reasons and environment notes that the Task Logs do not hold. For a Handoff in the middle of a Task, include the steps already done. If your context was compacted or recovered in this conversation, say which parts you rebuilt from a summary or from files, and from where.

## 3. Handoff Prompt

Write the Handoff Prompt per §5.2 to `.apm/bus/<agent-slug>/handoff.md`. Its Next Action depends on where you stopped:

- In the middle of a Task: the Task Prompt stays in `task.md`. Say what is done and where to resume.
- In the middle of a batch: the batch Task Prompt stays in `task.md`. Say which Tasks are done and logged, how far the current one got and where to resume.
- Between Tasks: `task.md` is empty. The next conversation waits for the User to invoke `apm-4-check-tasks`.

## 4. User Review

Give the User both file paths and ask them to review the two files. Apply their corrections and ask again. After they approve, tell them to invoke `apm-3-initiate-worker <agent-id>` in a new chat; it finds the Handoff Prompt on its own. Your work in this conversation then ends.

## 5. Formats

### 5.1 Handoff Log Format

The Handoff Log is written at `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md`, where `<NN>` is your conversation number, zero-padded, such as `handoff-01.log.md`.

```markdown
---
agent: <agent-slug>
conversation: <number>
stage: <N>
---

# <agent-slug> Handoff Log - Conversation <number>

## Summary
<The Tasks completed in this conversation and the Stage's progress>

## Working Context
<Patterns, conventions, decisions with reasons and environment notes that the Task Logs do not hold; for a Handoff in the middle of a Task, the steps already done>
```

### 5.2 Handoff Prompt Format

```markdown
---
agent: <agent-slug>
conversation: <number + 1>
handoff_log: <path of the Handoff Log>
---

# <agent-slug> Handoff Prompt - Conversation <number + 1>

<What to read: the Handoff Log and your Task Logs from the current Stage, by path>

## Current State
<Checked state: Tasks completed, the pending Task or batch, branches and merges; unresolved contract questions, accepted limitations and verification gaps, with source paths>

## Next Action
<Where to resume the Task or batch, or wait for the User to invoke apm-4-check-tasks>
```

`conversation` is the next conversation's number, which it writes in every Task Log and Task Report.
