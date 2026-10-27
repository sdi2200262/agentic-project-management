# APM {VERSION} - Task Logging Guide

This guide covers what you record when a Task ends: the Task Log, the full record of the work, and the Task Report, a short message that tells the Manager the Task has ended and where its log is. The Manager reviews your work from the log and decides what happens next. Later conversations, including your own after a Handoff, continue from it.

## 1. Outcome

Choose the Task's status:

- **Success:** the Objective is reached and every check in the prompt's Validation section passed.
- **Partial:** some work or validation remains and you need the Manager's guidance. For example, a check was unclear or unavailable, a failure keeps recurring, or the remaining problem is outside the Task.
- **Failed:** the Objective is not reached despite your attempts to fix it.

When you are unsure which status applies, choose Partial and state what remains. A finding alone does not change a Success; record it per §2.

## 2. Important Findings

Set `important_findings: true` when the status is Partial or Failed, or when the Manager needs to know something beyond the Task's result:

- remaining work, blockers or unmet criteria
- a deviation from the Task Prompt, or a choice it left open that affects the result, with your reason
- a hard problem you solved or an approach that did not work, when it may matter to later work
- information the prompt lacked that may affect other work, such as a new dependency, risk or constraint
- a conflict with existing code or conventions, a breaking change or a needed migration
- a User correction that would also apply to later Tasks; state the correction and whether the User approved adding it to the Rules

When you are unsure, set it to true. Write the findings in the Task Log's Important Findings section in whatever form explains them best.

## 3. Logging

Write the Task Log at the prompt's `log_path` per §5.1. The Manager reads the log, not your conversation, so it must make sense on its own.

- Describe the result and its evidence, not the order you worked in.
- Point to deliverables by path instead of copying them. Include a code snippet only for new, complex or critical logic, at most 20 lines, and diagnostic output only where it explains an error.
- Keep the checks you ran apart from claims you did not verify.
- If your context was compacted or recovered during the Task, say in the Summary which parts you rebuilt from files.

## 4. Reporting

After the Task, or the whole batch, has ended:

1. Clear `.apm/bus/<agent-slug>/task.md` using the terminal.
2. Write the Task Report to `.apm/bus/<agent-slug>/report.md` per §5.2, or one batch Task Report per §5.3. Keep the detail in the Task Logs.
3. Tell the User the report is ready, with both ways to deliver it in the Manager's chat: invoke `apm-5-check-reports <agent-id>` for this report, or `apm-5-check-reports` with no agent ID to collect every pending report.
4. Tell the User you are ready for the next Task, which they deliver by invoking `apm-4-check-tasks` in this chat. Wait for it or for a Handoff.

## 5. Formats

### 5.1 Task Log Format

The Task Log is written at `log_path`, `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`. A follow-up Task's log replaces the earlier one.

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

## Summary
<The outcome against the Objective, how you reached it when that matters, and any part of the log you could not verify>

## Output
<Deliverables and changed paths, the workspace or branch you used, and your commits>

## Validation
<Each check from the prompt's Validation section: what you ran and the result, or why it was not run>

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

<The outcome in a sentence, and anything the Manager must act on>
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

- Task <N>.<M> - <Title>: <status>, <the outcome in a sentence>
...

[Observations that affect several Tasks]
[If your context was compacted or recovered during the batch, say so]
```

Tasks you did not start have the status `Not started`.
