# APM {VERSION} - Task Logging Guide

This guide covers what you record when an attempt ends: the Task Log, the record of the work, and the Task Report, a short message that gives the Manager its outcome and log path. The Manager reviews the result and decides what happens next. Later conversations, including your own after a Handoff, continue from these records.

## 1. Outcome

Choose the Task's status:

- **Success:** the objective is achieved and every validation criterion passed.
- **Partial:** some work or required validation remains, and guidance is needed to continue.
- **Failed:** the objective was not achieved despite attempts to fix the problem.

The outcome assesses the whole Task, including earlier evidence and any unresolved criteria.

A Partial outcome can mean a check was unclear or unavailable, a failure keeps recurring, or the remaining problem is outside the Task.

When you are unsure which status applies, choose Partial and state what remains. A deliverable can exist while a required check is unmet or unverified; a deliberate deviation does not make that check pass. Keep Success when all its criteria passed, and record any findings per §2.

## 2. Important Findings

Set `important_findings: true` when the status is Partial or Failed, or when the Manager needs to know something beyond the Task's result:

- remaining work, blockers or unmet criteria
- a deviation from the Task Prompt, or a choice it left open that affects the result, with your reason
- a hard problem you solved or an approach that did not work, when it may matter to later work
- information the prompt lacked that may affect other work, such as a new dependency, risk or constraint
- a conflict with existing code or conventions, a breaking change or a needed migration
- a User correction affecting later work; state the correction and any approved Rules update

When you are unsure, set it to true. Write the findings in the Task Log's Important Findings section in whatever form explains them best.

## 3. Logging

Write the Task Log at the prompt's `log_path` per §5.1. The log must make sense to the Manager with access to the workspace and files.

- Describe the result and its evidence.
- Point to deliverables by path. Include code or diagnostic output only when it explains a consequential finding.
- Keep the checks you ran apart from claims you did not verify. Preserve comparison counts and distinguish checks run live, run in isolation and not run. For example, 45 of 47 matching responses plus 13 matching probes is not full parity.
- For a follow-up, leave earlier logs unchanged. Link the original log and previous follow-up, if any. Record the new work and checks, which earlier findings were resolved and which remain. Refer to earlier evidence that still applies rather than repeating it.
- If your context was compacted or recovered during the Task, say in the Summary which parts you rebuilt from files.

## 4. Reporting

After the Task, or the whole batch, has ended:

1. Clear `.apm/bus/<agent-slug>/task.md`.
2. Write the Task Report to `.apm/bus/<agent-slug>/report.md` per §5.2, or one batch Task Report per §5.3. Include deviations, unmet checks and decisions needed; keep the detail in the Task Logs.
3. Tell the User the report is ready, with both ways to deliver it in the Manager's chat: invoke `apm-5-check-reports <agent-id>` for this report, or `apm-5-check-reports` with no agent ID to collect every pending report.
4. Tell the User you are ready for the next Task, which they deliver by invoking `apm-4-check-tasks` in this chat. Wait for it or for a Handoff.

## 5. Formats

### 5.1 Task Log Format

Write at the prompt's `log_path`. The original log is `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`; follow-ups use `task-<NN>-<MM>.followup-<FF>.log.md` in the same folder. The Manager assigns `<FF>`, numbered 01, 02 and onward for each Task, independently of conversation numbers.

```markdown
---
agent: <agent-slug>
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
<Deliverables and changed paths, the workspace or branch you used, and your commits>

## Validation
<Each required check: what you ran, its result, counts and scope, or why it was not run; distinguish live and isolated checks>

## Important Findings
<Only when important_findings is true, per §2>
```

`conversation` is your conversation number: 1 from initiation, or the number the Handoff Prompt gave you after a Handoff.

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
