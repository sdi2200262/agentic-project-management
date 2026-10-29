# APM {VERSION} - Task Review Guide

This guide covers Task Review: reading Task Reports and Task Logs, deciding each Task's outcome, changing the planning documents when findings require it, merging, and keeping the Tracker current. It ends each Stage with verification, a Stage summary and an Index entry. `{GUIDE_PATH:task-assignment}` covers the dispatch that follows.

A Worker records one outcome per Task: Success, Partial or Failed. You decide whether to mark the Task Done after reviewing that outcome.

## 1. Report Intake

For each report delivered with `apm-5-check-reports`:

1. If the sender has no row in the Tracker's Workers table, it is an agent outside APM: assess its contribution and what it changes for planning or dispatch, record it in the Tracker's Notes, tell the User, and send any further work per `{GUIDE_PATH:task-assignment}` §6.
2. If the report's `conversation` is higher than the Worker's number in the Workers table, the Worker had a Handoff. Read its Handoff Logs, `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md`, for each conversation since the one you knew, update the number, and list the Worker's Tasks from earlier Stages under Not Read Since Handoff: its new conversation did not read their logs. Remove a Task from that list once a Task Prompt has given its context as a Cross-Worker dependency.
3. If the report mentions a recovery, record it in the Workers table's Context without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
4. For a batch Task Report, review each executed Task on its own per §2 and §3. Set the Tasks the batch did not start back to Ready or Waiting, and return them to dispatch.

## 2. Log Review

Read the whole Task Log, then check its `status` and `important_findings` against the body and the deliverables:

- **Success:** the objective is achieved and every validation criterion passed.
- **Partial:** some work or required validation remains, and guidance is needed to continue.
- **Failed:** the objective was not achieved despite attempts to fix the problem.

Check each validation criterion against its evidence, including counts, scope, deviations and unrun paths. A deliberate difference is still an unmet criterion unless the requirement has been changed with the required authority.

A Success log that says a check was not run, failed or was replaced by a weaker one contradicts itself. Tell the User what conflicts and keep the Task Active. Send the Worker a follow-up Task to run the check or explain the gap. If the requirement is wrong or the check is unavailable and an exception is proposed, resolve that decision per §4 rather than repeatedly requesting the same check.

Important Findings can affect other work, reveal missing validation, record a User correction or point to a problem in the Spec, Plan or Rules. If the log says the User approved a Rules addition, check the `AGENTS.md` change in the diff and keep it. If the User declined, do not add it without asking. If a finding contradicts a planning document, correct the document per §4, even when the Worker already handled the local issue.

Tell the User what the log shows, whether the evidence supports it, the Important Findings that matter and your proposed next action.

## 3. Review Outcomes

1. Accept a Success that the log supports and that has no Important Findings. With version control, commit any successful work the Worker left uncommitted, on its branch and under the Rules' conventions.
2. Investigate Important Findings and any outcome other than Success. Check contained issues yourself; trace unclear causes against the relevant files and checks. Verify the findings before deciding.
3. Decide:
   - **Accept:** the work is complete, or the User agrees to accept a Partial outcome; record what remains and the basis for acceptance in the Tracker's Notes. Preserve the Worker's outcome and evidence; acceptance does not turn unmet checks into passing results.
   - **Follow-up Task:** the Worker needs another attempt. Send one per `{GUIDE_PATH:task-assignment}` §5, noting any uncommitted work.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. Some findings need more than a Plan change: a fix needs design decisions the Spec does not cover, a change would rewrite the Spec's Overview or several Stages, or follow-up Tasks keep failing for the same reason. Do not plan the solution yourself. Present the options with your recommendation, such as changing the Plan and continuing, or pausing the session to summarize it with `apm-8-summarize-session`, archive it and plan again with a new Planner. The User decides.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Record each consequential finding as fixed, accepted with the required authority, pending, or outside current scope, with its source and reason. Keep pending decisions in the Tracker; preserve consequential decisions in the Stage summary.
7. Once the decision is made, clear the Worker's Report Bus, `.apm/bus/<agent-slug>/report.md`. Update the Tracker per §8.1 and §8.2, in one edit with the merge and dispatch changes that follow.

Make small follow-ups and corrections on your own and tell the User. Pause for approval when a change exceeds the limits in §4.

## 4. Planning Document Changes

A finding, User correction or change to the Spec, Plan or Rules can affect the others. Correct the document where the problem starts, then align the affected content. Apply this procedure at first start as well as during review.

You may clarify or correct one Task, add a missing dependency, add an isolated point to the Spec or adjust a Rule. Changes to several Tasks, to the design or scope, a new Stage or a major restructuring need the User. Several small changes together can also need the User. For those, present the problem, the proposed change, the options and your recommendation, and wait for the User's answer.

For each change:

1. Identify the finding or decision, its source and the authority needed to act on it.
2. Inspect affected Spec, Plan and Rules sections, including Notes, Task guidance and validation. Check dependent Tasks and instructions already sent to Workers.
3. Apply authorized changes together, removing stale or contradictory statements. When approval is needed, present the proposal and wait; record the affected work, source, pending decision and who needs to act in the Tracker's Notes. Keep affected work pending while unrelated work can continue.
4. If an active Worker has affected instructions, send an in-place correction per `{GUIDE_PATH:task-assignment}` §5.1. Use a follow-up Task after a reported attempt. A changed coordination document alone does not deliver the correction.
5. Record each change and its reason in the Tracker's Notes, and update Task next actions. Remove redundant Notes once the authoritative content carries the settled choice; preserve consequential decisions in the Stage summary.

Use these homes for the changes:

- **Spec:** add content under the relevant heading. Keep it to design decisions that apply across Tasks; Task-specific detail goes in the Task's Guidance.
- **Plan:** add a Task under its Stage with every field per `{GUIDE_PATH:work-breakdown}` §5.2, keeping the numbering; change only the affected fields of an existing Task; when removing a Task, update every Task that depends on it.
- **Rules:** change only the inside of the `APM_RULES` block in `AGENTS.md`, under `##` category headings, and only for conventions shared by all or most work.
- **Notes:** keep current assumptions and context in Spec Notes, and coordination judgement in Plan Notes. Settled requirements and constraints belong in the main content; explicit dependencies and validation belong in Task fields. Remove stale or redundant observations.

Keep the Worker's recorded outcome and evidence intact when you accept work or change a requirement. Record the Manager's later decision separately. A follow-up log still replaces the earlier attempt; it retains consequential earlier findings and explains their resolution.

## 5. Merging

With version control, merge a dispatch's branch into its base branch after a successful review, before dispatching Tasks that depend on it, and merge every branch of a Stage before the next Stage begins.

1. Switch to the recorded base branch, merge and check the result. Clean merges need no approval.
2. Resolve conflicts from the Task objectives and the Spec. Investigate complex conflicts against the affected contracts, or ask the User when a decision is needed.
3. If branch protection blocks a direct merge, use a pull request, an intermediate branch or the User's guidance, and record the constraint in the Tracker's Notes.
4. After the merge, remove the worktree with `git worktree remove .apm/worktrees/<branch-slug>` if there was one, delete the branch with `git branch -d <branch-name>`, and clear the Task's Branch and Worktree in the Tracker. When cleaning up several branches, run all removals and then all deletions in one terminal command.

## 6. Next Dispatch

Reports arrive in any order. Review each as it comes, without waiting for unrelated reports, and in the same turn dispatch newly Ready Tasks per `{GUIDE_PATH:task-assignment}` §1.

## 7. Stage Completion

When every Task in a Stage is Done and no follow-up Task is pending:

1. Decide whether the Stage needs verification as a whole. Verify when the User asked for it, the Plan's Notes name this Stage, or any of its Tasks needed a follow-up Task or reported Important Findings. Otherwise you may skip it and say so in the Stage summary.
2. To verify, rerun key checks, examine the deliverables and exercise integration and edge cases at the validation level the work already uses. Fix contained issues yourself, add a Task for work that needs a Worker, or ask the User when the scope is unclear.
3. Account for every consequential Important Finding: its resolution or acceptance, effects on other work, and source. Preserve unresolved or accepted limitations and unrun checks. Sort the Tracker's Notes: move findings with lasting value to the Index's Notes with sources, put Stage-specific findings and decisions into its summary, and keep notes the next Stage still needs.
4. Write the Stage summary per §8.4 and add its row to the Index per §8.3, with any lasting notes in the same edit. Use the reviewed logs still in your context, and reread logs that changed or that you no longer have.
5. Once required Stage verification is resolved and, with version control, its branches are merged, replace the Stage's rows with `**Stage N:** Complete — [Summary](memory/stage-<NN>/stage-<NN>.summary.md)`. Completion records accepted work; the summary preserves accepted Partial outcomes and limits.

Then add the next Stage's Tasks to the Tracker per §8.1 and dispatch them per `{GUIDE_PATH:task-assignment}` §1. When every Stage is complete, continue with `{SKILL_PATH:apm-2-initiate-manager}` §3.

## 8. Formats

### 8.1 Tasks Section Format

The Tracker's `## Tasks` section holds each Stage's Task states:

```markdown
**Stage 1:** Complete — [Summary](memory/stage-01/stage-01.summary.md)

**Stage 2:**

| Task | Agent | Status | Branch | Worktree | Next Action |
|------|-------|--------|--------|----------|-------------|
| 2.1 | frontend-agent | Done | | | |
| 2.2 | backend-agent | Active | feat/backend-models | .apm/worktrees/feat-backend-models | Review report |
| 2.3 | frontend-agent | Done | feat/frontend-auth | | Merge branch |
| 2.4 | backend-agent | Waiting: 2.2 | | | Await dependency |
| 2.5 | frontend-agent | Ready | | | Dispatch when Worker is free |
```

Status values:

- `Waiting: N.M`: a dependency is not Done. It may list several.
- `Ready`: all dependencies are Done.
- `Active`: dispatched, under review or awaiting a follow-up Task.
- `Done`: final decision made. A Branch value means the branch still awaits merging.

Next Action names what happens next and who must act when that is unclear: execute, await a report, review, resolve a decision, follow up or merge. Leave it empty when nothing remains. Keep the explanation of a broader blocker or decision in Notes rather than duplicating it here.

Write each state and next action at the end of the review and dispatch cycle. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active. A Task whose Worker is still busy, or that waits for a better dispatch, stays Ready.

### 8.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Notes
<Pending decisions, blockers and alignment changes: affected work, source, reason and who needs to act>

## Tasks
<Per §8.1>

## Workers

| Agent | Conversation | Not Read Since Handoff | Context |
|-------|--------------|------------------------|---------|
| frontend-agent | 2 | 1.1, 1.3 | |
| backend-agent | 1 | | Recovered during Task 2.2 |
```

Add a Worker's row at its first dispatch. Not Read Since Handoff lists the Worker's Tasks from earlier Stages whose logs its current conversation has not read. Context records recovery and context reliability, without repeating Task states or Stage completion. Keep top-level Notes as self-contained bullets and remove them once stale.

### 8.3 Memory Index Format

The Index is `.apm/memory/index.md`:

```markdown
# APM Memory Index

## Notes
<Lasting discoveries, accepted constraints and unresolved limitations useful beyond a Stage, with source links>

## Stage Summaries

| Stage | Outcome | Summary |
|-------|---------|---------|
| 1 - <Stage Name> | <Accepted result and material limits, in brief> | [Stage 1](stage-01/stage-01.summary.md) |
```

### 8.4 Stage Summary Format

Each Stage summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

## Outcome
<Accepted work and Workers involved, useful commits, accepted Partial outcomes and what remains>

## Findings and Decisions
<Consequential discoveries, their resolution or acceptance, reasons, and changes to the Spec, Plan or Rules, with source links>

## Validation and Limits
<Stage verification performed or skipped and why; key results with counts and scope, accepted deviations and unrun checks, with evidence paths>

## Task Logs

- [Task <N>.<M>](task-<NN>-<MM>.log.md)
```

Select findings that affect future work, acceptance, compatibility, reproduction or unresolved risk. Keep implementation detail in Task Logs. The Index gives lasting context and navigation; each Stage summary preserves its decisions and evidence without repeating the full logs.
