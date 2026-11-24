# APM {VERSION} - Task Logging Guide

Use this guide to record outcomes and evidence in Task Logs for later conversations. Workers log each attempt and send a Task Report for Manager review.

As Manager, write one concluding log for each of your Tasks after review, validation and any remaining decisions. Keep the Task Active until requirements are met or the User accepts the limits. Record any agreement and its scope in the log, then mark the Task Done and link the log in the Tracker. Later fixes need a new Task.

## 1. Outcome

Choose the Task's outcome from the validation results per `{GUIDE_PATH:task-execution}` §4:

- **Success:** the objective is achieved and every validation criterion passed.
- **Partial:** some work or required validation remains.
- **Failed:** the objective was not achieved despite attempts to fix the problem.

Assess the whole Task, including earlier evidence and unresolved criteria. Use Partial when checks are unclear or unavailable, failures recur, or problems outside the Task remain. When unsure, choose Partial and state what remains. A deliverable or deliberate deviation leaves any unmet check outstanding. Use Success when all criteria pass and record any findings per §2.

## 2. Important Findings

Set `important_findings: true` when the outcome is Partial or Failed, or when a finding affects acceptance or may matter to later work beyond the Task’s result:

- remaining work, blockers or unmet criteria
- a deviation from the Task instructions, or a choice it left open that affects the result, with your reason
- a hard problem you solved or an approach that did not work, when it may matter to later work
- information the Task instructions lacked that may affect other work, such as a new dependency, risk or constraint
- a conflict with existing code or conventions, a breaking change or a needed migration
- a User correction affecting later work; state the correction and any authorized `AGENTS.md` update

Separate evidence from uncertainty about possible wider effects. Record User agreements and the limits they cover. When you are unsure, set it to true. Write the findings in the Task Log's Important Findings section in whatever form explains them best.

## 3. Logging

Write for current and later Managers and for Workers who continue or build on the Task. Use your available context and link to evidence the reader can consult. Follow §5.1 for frontmatter and sections. Workers use the Task Prompt's `log_path`. The Manager uses the original-log path for the Task's Stage and number. Aim for one short Summary paragraph and put supporting detail in its section or linked source.

- Describe results, checked evidence and consequential decisions, naming contributions by the User or other agents. Include changes in who performed the work when they explain the result, validation or remaining work; omit routine execution narration.
- Link deliverables, supporting documents and evidence by stable paths, not temporary Tracker notes. Include code or diagnostic output only when it explains a consequential finding.
- Record Task-specific checks and results separately from unverified claims. Preserve comparison counts and distinguish checks run live, run in isolation and not run. Do not describe partial comparisons or isolated checks as complete validation.
- For a follow-up, leave earlier logs unchanged. Link the original log and previous follow-up, if any. Record the new work and checks, which earlier findings were resolved and which remain. Refer to earlier evidence that still applies rather than repeating it.
- If your context was compacted or recovered during the Task, say in the Summary which parts you rebuilt from files.

## 4. Reporting

When your role requires a Task Report, send it after the Task or whole batch has ended:

1. Clear `.apm/bus/<agent-slug>/task.md`.
2. Write the Task Report to `.apm/bus/<agent-slug>/report.md` per §5.2, or one batch Task Report per §5.3. Include deviations, unmet checks, any User agreement about their limits and decisions still needed. When work remains, explain what prevents completion and what is needed next; keep detail in the Task Logs.
3. Tell the User the report is ready. In the Manager's conversation, they can ask it to check your report, giving your agent ID, or to check all pending reports.
4. Wait for the next Task Prompt or User instructions. They can ask you to check tasks in this conversation or prepare a Handoff.

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
