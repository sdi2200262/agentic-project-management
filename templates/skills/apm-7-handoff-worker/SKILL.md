---
name: apm-7-handoff-worker
description: Perform a Handoff with an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Handoff

Only the Worker whose work is continuing can prepare this handoff. If the User gives you this file or requests a handoff in another conversation, tell them to ask in that Worker’s current conversation and stop.

Begin when the User requests a Worker Handoff or an APM instruction directs you here.

A Worker Handoff continues your assigned work in a new conversation in the same session. Write a Handoff Log to preserve your working context and a Handoff Prompt to direct the incoming conversation. It follows `{SKILL_PATH:apm-3-initiate-worker}` §1.2.

Your conversation number starts at 1 and advances only at Handoff. Use the number from your incoming Handoff Prompt if present; the next conversation is one higher.

## 1. Current State

If subagents are running when a Handoff is requested, tell the User, pause them and collect their progress, outputs and pending checks before preparing the Handoff.

Check current state before writing either file:

- Read `task.md` and `report.md` in your bus folder.
- Check your assigned workspace, including its branch, commits and uncommitted work where applicable. Record integration details supported by your available evidence, noting anything unresolved.

Use the checked state in both files, including unresolved contract questions and verification gaps with source paths.

## 2. Handoff Log

Write the Handoff Log in past tense per §5.1. If context was compacted or recovered, identify what you rebuilt from summaries or files. Name the sources and any uncertainty or unverified claims that remain.

## 3. Handoff Prompt

Write the Handoff Prompt per §5.2 to `.apm/bus/<agent-slug>/handoff.md`. Its Next Action depends on where you stopped:

- In the middle of a Task: the Task Prompt stays in `task.md`. Say what is done and where to resume, keeping its current `log_path` even during a follow-up.
- In the middle of a batch: the batch Task Prompt stays in `task.md`. Say which Tasks are done and logged, how far the current one got and where to resume.
- Between Tasks: `task.md` is empty. The next conversation waits for the User to deliver the next Task Prompt.

Record what work the User holds, any assistance needed, where to resume and what allows work to resume. Carry forward agreed review points, pending decisions and accepted limits with evidence links.

## 4. Continuation Instructions

Give a small chat recap of the work and context being passed on, pending decisions or checks, and the next action. Explain how the User starts a new Worker conversation with your agent ID; it finds the Handoff Prompt. You may link the files for optional review, but do not require inspection or approval.

By default your preparation ends here: wait while the User completes delivery to the new conversation. Do not claim to transfer yourself. Follow a different coordination mechanism only when explicitly agreed with the User.

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

<What to read: the Handoff Log, latest relevant own attempt logs from the current Stage and dependency logs needed to resume, by path; earlier attempts through links where needed>

## Current State
<Checked state: Tasks completed, the pending Task or batch, workspace, commits, uncommitted work and known integration state; unresolved contract questions, accepted limitations and verification gaps, with source paths>

## Next Action
<Where to resume the Task or batch, or wait for the User to deliver the next Task Prompt>
```

`conversation` is the next conversation's number, which it writes in every Task Log and Task Report.
