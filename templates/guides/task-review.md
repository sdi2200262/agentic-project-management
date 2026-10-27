# APM {VERSION} - Task Review Guide

This guide covers Task Review: reading Task Reports and Task Logs, deciding each Task's outcome, changing the planning documents when findings require it, merging, and keeping the Tracker current. It ends each Stage with verification, a Stage summary and an Index entry. `{GUIDE_PATH:task-assignment}` covers the dispatch that follows.

A Worker records one outcome per Task: Success, Partial or Failed. The outcome informs your decision but does not set the Task's state; only your final decision makes a Task Done.

## 1. Report Intake

For each report delivered with `apm-5-check-reports`:

1. If the sender has no row in the Tracker's Workers table, it is an agent outside APM: assess its contribution and what it changes for planning or dispatch, record it in the Tracker's Notes, tell the User, and send any further work per `{GUIDE_PATH:task-assignment}` §6.
2. If the report's `conversation` is higher than the Worker's number in the Workers table, the Worker had a Handoff. Read its Handoff Log, update the number, and list the Worker's Tasks from earlier Stages under Not Read Since Handoff: its new conversation did not read their logs.
3. If the report mentions a recovery, record it in the Workers table's Notes without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
4. For a batch Task Report, review each executed Task on its own per §2 and §3. Tasks the batch did not start return to dispatch.

## 2. Log Review

Read the whole Task Log, then check its `status` and `important_findings` against the body and the deliverables:

- **Success** needs the objective achieved and every validation check passed.
- **Partial** means progress was made and the Worker needs guidance.
- **Failed** means the objective was not achieved.

A Success log that says a check was not run, failed or was replaced by a weaker one contradicts itself. Do not settle it with other evidence: tell the User what conflicts, send the Worker a follow-up Task to run the check or explain the gap, and keep the Task Active until it answers.

Important Findings can affect other work, reveal missing validation, record a User correction or point to a problem in the Spec, Plan or Rules. If the log says the User approved a Rules addition, check the `AGENTS.md` change in the diff and keep it. If the User declined, do not add it without asking. If a finding contradicts a planning document, correct the document per §4, even when the Worker already handled the local issue.

Tell the User what the log shows, whether the evidence supports it, the Important Findings that matter and your proposed next action.

## 3. Review Outcomes

1. Accept a Success that the log supports and that has no Important Findings. With version control, commit any successful work the Worker left uncommitted, on its branch and under the Rules' conventions.
2. Investigate Important Findings and any outcome other than Success before deciding. Check contained issues yourself. When an issue needs a lot of context or its cause is unclear, use a subagent: give it the question, the files to examine and the findings to return, and verify its key claims against the source.
3. Decide:
   - **Accept:** the work is complete, or the User agrees to accept a Partial outcome; record what remains in the Tracker's Notes.
   - **Follow-up Task:** the Worker needs another attempt. Send one per `{GUIDE_PATH:task-assignment}` §5, noting any uncommitted work.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. Some findings need more than a Plan change: a fix needs design decisions the Spec does not cover, a change would rewrite the Spec's Overview or several Stages, or follow-up Tasks keep failing for the same reason. Do not plan the solution yourself. Present the options with your recommendation, such as changing the Plan and continuing, or pausing the session to summarise it with `apm-8-summarize-session`, archive it and plan again with a new Planner. The User decides.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Update the Tracker per §8.1 and §8.2, in one edit with the merge and dispatch changes that follow.

Make small follow-ups and corrections on your own and tell the User. Pause for approval when a change exceeds the limits in §4.

## 4. Planning Document Changes

A change to the Spec can affect the Plan, and the reverse; the Rules are usually independent. Before changing any of them, check what else the change affects, and correct the document where the problem starts.

You may clarify or correct one Task, add a missing dependency, add an isolated point to the Spec or adjust a Rule. Changes to several Tasks, to the design or scope, a new Stage or a major restructuring need the User. Several small changes together can also need the User. For those, present the problem, the proposed change, the options and your recommendation, and wait for the User's answer.

- **Spec:** add content under the relevant heading. Keep it to design decisions that apply across Tasks; Task-specific detail goes in the Task's Guidance.
- **Plan:** add a Task under its Stage with every field per `{GUIDE_PATH:work-breakdown}` §5.2, keeping the numbering; change only the affected fields of an existing Task; when removing a Task, update every Task that depends on it.
- **Rules:** change only the inside of the `APM_RULES` block in `AGENTS.md`, under `##` category headings, and only for patterns that apply to all Workers.
- **Notes:** keep the Spec's and the Plan's Notes describing the present: update the Plan's Notes when dispatch paths, blockers or the work's structure change, and the Spec's Notes when assumptions or constraints change.

Record each change to the Spec or Plan, and why, in the Tracker's Notes. The Stage summary keeps it.

## 5. Merging

With version control, merge a dispatch's branch into its base branch after a successful review, before dispatching Tasks that depend on it, and merge every branch of a Stage before the next Stage begins.

1. Switch to the recorded base branch, merge and check the result. Clean merges need no approval.
2. Resolve conflicts from the Task objectives and the Spec. For complex conflicts, use a subagent to investigate or ask the User.
3. If branch protection blocks a direct merge, use a pull request, an intermediate branch or the User's guidance, and record the constraint in the Tracker's Notes.
4. After the merge, remove the worktree with `git worktree remove .apm/worktrees/<branch-slug>` if there was one, delete the branch with `git branch -d <branch-name>`, and clear the Task's Branch and Worktree in the Tracker. When cleaning up several branches, run all removals and then all deletions in one terminal command.

## 6. Next Dispatch

Reports arrive in any order. Review each as it comes, without waiting for unrelated reports. In the same turn, merge, reassess readiness and dispatch newly Ready Tasks per `{GUIDE_PATH:task-assignment}` §1.

Pause only when nothing is Ready or a change needs the User. When you wait, say what you processed, what is still pending and which report the User should bring next.

## 7. Stage Completion

When every Task in a Stage is Done and no follow-up Task is pending:

1. Decide whether the Stage needs verification as a whole. Verify when the User asked for it, the Plan's Notes name this Stage, or any of its Tasks needed a follow-up Task or reported Important Findings. Otherwise you may skip it and say so in the Stage summary.
2. To verify, rerun key checks, examine the deliverables and exercise integration and edge cases at the validation level the work already uses. Use a subagent for checks that need a lot of context, and verify its findings. Fix contained issues yourself, add a Task for work that needs a Worker, or ask the User when the scope is unclear.
3. Sort the Tracker's Notes: move findings with lasting value to the Index's Notes, put details about this Stage into its summary, and keep notes the next Stage still needs.
4. Write the Stage summary per §8.4 and add its row to the Index per §8.3, with any lasting notes in the same edit. Use the reviewed logs still in your context, and reread logs that changed or that you no longer have.
5. Once its branches are merged, replace the Stage's rows in the Tracker with `**Stage N:** Complete`.

Then dispatch the next Stage. When every Stage is complete, continue with `{SKILL_PATH:apm-2-initiate-manager}` §3.

## 8. Formats

### 8.1 Tasks Section Format

The Tracker's `## Tasks` section holds each Stage's Task states:

```markdown
**Stage 1:** Complete

**Stage 2:**

| Task | Agent | Status | Branch | Worktree |
|------|-------|--------|--------|----------|
| 2.1 | frontend-agent | Done | | |
| 2.2 | backend-agent | Active | feat/backend-models | .apm/worktrees/feat-backend-models |
| 2.3 | frontend-agent | Done | feat/frontend-auth | |
| 2.4 | backend-agent | Waiting: 2.1 | | |
| 2.5 | frontend-agent | Ready | | |
```

Status values:

- `Waiting: N.M`: a dependency is not Done. It may list several.
- `Ready`: all dependencies are Done.
- `Active`: dispatched, under review or awaiting a follow-up Task.
- `Done`: final decision made. A Branch value means the branch still awaits merging.

Write each state at the end of the review and dispatch cycle. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active.

### 8.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Tasks
<Per §8.1>

## Workers

| Agent | Conversation | Not Read Since Handoff | Notes |
|-------|--------------|------------------------|-------|
| frontend-agent | 2 | 1.1, 1.3 | |
| backend-agent | 1 | | Recovered during Task 2.2 |

## Notes
<Short-lived coordination context: pending decisions, preferences, constraints, observations and changes to the Spec or Plan>
```

Add a Worker's row at its first dispatch. Not Read Since Handoff lists the Worker's Tasks from earlier Stages whose logs its current conversation has not read. Keep notes as self-contained bullets and remove them once stale.

### 8.3 Memory Index Format

The Index is `.apm/memory/index.md`:

```markdown
# APM Memory Index

## Notes
<Lasting observations for later Stages and conversations, as self-contained bullets>

## Stage Summaries

| Stage | Summary | Folder |
|-------|---------|--------|
| 1 - <Stage Name> | <The Stage's outcome in one or two sentences> | `stage-01/` |
```

### 8.4 Stage Summary Format

Each Stage summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

<The outcome, the Workers involved, consequential findings, decisions, changes to the Spec or Plan, and useful commits. Leave implementation detail to the Task Logs.>

## Task Logs
- `task-<NN>-<MM>.log.md`
```
