---
name: apm-7-handoff-worker
description: Perform a Handoff with an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Handoff

Follow these instructions only when the User requests a Worker Handoff or an APM instruction directs you here. Otherwise, stop.

A Worker Handoff continues assigned work in a new conversation of the same Worker within the same session. As the outgoing Worker, write two files. The Handoff Log preserves this conversation's working context. The Handoff Prompt, in your bus folder's `handoff.md`, tells the next conversation what to read and where to resume. The next conversation acts on them per `{SKILL_PATH:apm-3-initiate-worker}` §1.2.

Your conversation number is 1 if you started from initiation, or the number the Handoff Prompt gave you. The next conversation's number is one higher.

## 1. Current State

If subagents are running when a Handoff is requested, tell the User, pause them and collect their progress, outputs and pending checks before preparing the Handoff.

Your memory of earlier turns may be out of date, so check the current state before writing either file:

- Read `task.md` and `report.md` in your bus folder.
- Check your assigned workspace and, with version control, its branch, commits and uncommitted work. Record integration details supported by your available evidence, noting anything unresolved.

Use the checked state in both files, including unresolved contract questions and verification gaps with source paths.

## 2. Handoff Log

Write the Handoff Log per §5.1. Record in past tense what this conversation did: completed Tasks, completed steps in unfinished Tasks, and patterns, conventions, decisions with reasons and environment notes absent from Task Logs. If context was compacted or recovered, identify the parts rebuilt from summaries or files and their sources.

## 3. Handoff Prompt

Write the Handoff Prompt per §5.2 to `.apm/bus/<agent-slug>/handoff.md`. Its Next Action depends on where you stopped:

- In the middle of a Task: the Task Prompt stays in `task.md`. Say what is done and where to resume, keeping its current `log_path` even during a follow-up.
- In the middle of a batch: the batch Task Prompt stays in `task.md`. Say which Tasks are done and logged, how far the current one got and where to resume.
- Between Tasks: `task.md` is empty. The next conversation waits for the User to deliver the next Task Prompt.

Record what work the User holds, any assistance needed, where to resume and what allows work to resume. Carry forward agreed review points, pending decisions and accepted limits with evidence links.

## 4. User Review

Give the User both file paths and ask them to review the two files. Apply their corrections and ask again. After they approve, tell them to start a new Worker conversation with your agent ID; it finds the Handoff Prompt on its own. Your work in this conversation then ends.

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
<The Tasks completed in this conversation and progress on unfinished work>

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

<What to read: the Handoff Log and latest relevant attempt logs for your Tasks in the current Stage, by path; earlier attempts through links where needed>

## Current State
<Checked state: Tasks completed, the pending Task or batch, workspace, commits, uncommitted work and known integration state; unresolved contract questions, accepted limitations and verification gaps, with source paths>

## Next Action
<Where to resume the Task or batch, or wait for the User to deliver the next Task Prompt>
```

`conversation` is the next conversation's number, which it writes in every Task Log and Task Report.
