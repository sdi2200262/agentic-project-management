# APM {VERSION} - Task Logging Guide

This guide covers recording Task outcomes in a Task Log and delivering its outcome through a Task Report when required by your role. Later conversations, including your own after a Handoff, continue from these records.

Workers write a Task Log for each attempt and report the outcome for Manager review. The Manager writes one concluding log for each Task it carries out, after reviewing the work, resolving outstanding decisions and validating the result. It keeps the Task Active while work or a decision remains pending, and marks it Done when requirements are met or the User agrees to accept remaining limitations. It records that agreement and the limits in the concluding log and links it from the Tracker. Later fixes to Done work need a new Task.

## 1. Outcome

Choose the Task's status:

- **Success:** the objective is achieved and every validation criterion passed.
- **Partial:** some work or required validation remains.
- **Failed:** the objective was not achieved despite attempts to fix the problem.

The outcome assesses the whole Task, including earlier evidence and any unresolved criteria.

A Partial outcome can mean a check was unclear or unavailable, a failure keeps recurring, or the remaining problem is outside the Task.

When you are unsure which status applies, choose Partial and state what remains. A deliverable can exist while a required check is unmet or unverified; a deliberate deviation does not make that check pass. Keep Success when all its criteria passed, and record any findings per §2.

## 2. Important Findings

Set `important_findings: true` when the status is Partial or Failed, or when a finding affects acceptance or may matter to later work beyond the Task’s result:

- remaining work, blockers or unmet criteria
- a deviation from the Task instructions, or a choice it left open that affects the result, with your reason
- a hard problem you solved or an approach that did not work, when it may matter to later work
- information the Task instructions lacked that may affect other work, such as a new dependency, risk or constraint
- a conflict with existing code or conventions, a breaking change or a needed migration
- a User correction affecting later work; state the correction and any authorized `AGENTS.md` update

Separate evidence from uncertainty about possible wider effects. Record User agreements and the limits they cover. When you are unsure, set it to true. Write the findings in the Task Log's Important Findings section in whatever form explains them best.

## 3. Logging

Write the Task Log per §5.1, using the assigned `log_path` when provided. Write from your role's perspective and the context available to you. The log must make sense to a later reader with access to the workspace and files.

- Describe the result and the evidence you checked, identifying contributions made by the User or other agents. Include changes in who performed the work and coordination decisions when they explain the result, validation or remaining work.
- Point to deliverables by path and link supporting documents used or updated to relevant results or findings. Include code or diagnostic output only when it explains a consequential finding.
- Keep the checks you ran apart from claims you did not verify. Preserve comparison counts and distinguish checks run live, run in isolation and not run. For example, 45 of 47 matching responses plus 13 matching probes is not full parity.
- For a follow-up, leave earlier logs unchanged. Link the original log and previous follow-up, if any. Record the new work and checks, which earlier findings were resolved and which remain. Refer to earlier evidence that still applies rather than repeating it.
- If your context was compacted or recovered during the Task, say in the Summary which parts you rebuilt from files.

## 4. Reporting

When your role requires a Task Report, send it after the Task or whole batch has ended:

1. Clear `.apm/bus/<agent-slug>/task.md`.
2. Write the Task Report to `.apm/bus/<agent-slug>/report.md` per §5.2, or one batch Task Report per §5.3. Include deviations, unmet checks, any User agreement about their limits and decisions still needed; keep the detail in the Task Logs.
3. Tell the User the report is ready. In the Manager's conversation, they can ask it to check your report, giving your agent ID, or to check all pending reports.
4. Tell the User you are ready for the next Task; they can ask you to check your tasks in this conversation. Wait for their next delivery or a Handoff.

## 5. Formats

### 5.1 Task Log Format

The original log is `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`; follow-ups use `task-<NN>-<MM>.followup-<FF>.log.md` in the same folder. The Manager chooses the next unused `<FF>`, numbered 01, 02 and onward for each Task, independently of conversation numbers.

```markdown
---
agent: <worker-slug or manager>
conversation: <number>
stage: <N>
task: <M>
status: Success | Partial | Failed
important_findings: true | false
---

# Task <N>.<M> - <Title>

<For a follow-up: links to the original log and previous follow-up, if any>

## Summary
<The outcome against the Objective, how you reached it when that matters, and any part of the log you could not verify>

## Output
<Deliverables and changed paths, the workspace or branch you used, relevant commits and any uncommitted work>

## Validation
<Each required check: what you ran, its result, counts and scope, or why it was not run; distinguish live and isolated checks>

## Important Findings
<Only when important_findings is true, per §2>
```

`agent` identifies the author: the responsible Worker slug or `manager`. `conversation` is your conversation number: 1 from initiation, or the number the Handoff Prompt gave you after a Handoff.

### 5.2 Task Report Format

```markdown
---
agent: <agent-slug>
conversation: <number>
stage: <N>
task: <M>
status: Success | Partial | Failed
log_path: <log_path from the Task Prompt>
---

<The outcome in a sentence, consequential deviations or limits, and anything the Manager must act on>
[If your context was compacted or recovered during the Task, say so]
```

### 5.3 Batch Task Report Format

```markdown
---
agent: <agent-slug>
conversation: <number>
tasks:
  - stage: <N>
    task: <M>
    status: Success | Partial | Failed | Not started
    log_path: <log_path from the Task Prompt>
  ...
---

<How many Tasks were done, and which Task stopped the batch if one did>

- Task <N>.<M> - <Title>: <status>, <the outcome and consequential deviations or limits in a sentence>
...

[Observations that affect several Tasks]
[If your context was compacted or recovered during the batch, say so]
```

Tasks you did not start have the status `Not started`.
