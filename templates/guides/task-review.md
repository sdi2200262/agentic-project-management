# APM {VERSION} - Task Review Guide

This guide covers Task Review: reading Task Reports and Task Logs, deciding each Task's outcome, changing the planning documents when findings require it, merging, and keeping the Tracker current. It ends each Stage with verification, a Stage summary and an Index entry. `{GUIDE_PATH:task-assignment}` covers the dispatch that follows.

A Worker records one outcome per attempt: Success, Partial or Failed. You decide whether to mark the Task Done after reviewing the result.

## 1. Report Intake

For each report delivered with `apm-5-check-reports`:

1. If the sender has no row in the Tracker's Workers table, it is an agent outside APM: assess its contribution and what it changes for planning or dispatch. Record it in the Tracker's Notes, preserving consequential evidence, limits and source paths: this agent writes no Task Log. Tell the User, clear its Report Bus, and send any further work per `{GUIDE_PATH:task-assignment}` §6. Then continue with the next report.
2. If the report's `conversation` is higher than the Worker's number in the Workers table, the Worker had a Handoff. Read its Handoff Logs, `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md`, for each conversation since the one you knew, update the number, and list the Worker's Tasks from earlier Stages under Not Read Since Handoff: its new conversation did not read their logs. Remove a Task from that list once a Task Prompt has given its context as a Cross-Worker dependency.
3. If the report mentions a recovery, record it in the Workers table's Context without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
4. For a batch Task Report, review each executed Task on its own per §2 and §3. Set the Tasks the batch did not start back to Ready or Waiting, and return them to dispatch.

## 2. Log Review

Read the whole Task Log named in the report, following original and previous-attempt links where needed to verify earlier evidence and unresolved findings. Check its `status` and `important_findings` against the body and the deliverables:

- **Success:** the objective is achieved and every validation criterion passed.
- **Partial:** some work or required validation remains, and guidance is needed to continue.
- **Failed:** the objective was not achieved despite attempts to fix the problem.

Check each validation criterion against its evidence, including counts, scope, deviations and unrun paths. A deliberate difference is an unmet criterion; record any accepted exception as a limitation.

If a Success log includes a failed, unrun or weaker check, tell the User and keep the Task Active. Resolve the gap per §3; incorrect requirements or proposed exceptions go through §4.

Important Findings can affect other work, reveal missing validation, record a User correction or point to a problem in the Spec, Plan or Rules. If the log says the User approved a Rules addition, check the change at its recorded `AGENTS.md` path, using the diff when tracked, and keep it. If the User declined, do not add it without asking. If a finding contradicts a planning document, correct the document per §4, even when the Worker already handled the local issue.

Tell the User what the log shows, whether the evidence supports it, the Important Findings that matter and your proposed next action.

## 3. Review Outcomes

1. Accept a Success that the log supports and that has no Important Findings.
2. Investigate Important Findings and any outcome other than Success. Resolve contained questions, checks and corrections within the existing objective yourself; leave substantial implementation to Workers. Record your checks and corrections with evidence in the Tracker's Notes, preserving the Worker's outcome. Compare follow-up results with the previous attempt. If another attempt has no supported approach, or remaining work substantially exceeds the assignment, present the options to the User before dispatching again.
3. Decide:
   - **Accept:** the work is complete, or the User agrees to accept a Partial outcome; record what remains and the basis for acceptance in the Tracker's Notes. Preserve the Worker's outcome and evidence; acceptance does not turn unmet checks into passing results.
   - **Follow-up Task:** concrete work remains for the Worker, with an approach and a clear completion check. Preserve any uncommitted work for that attempt.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. Some findings need broader planning: a fix needs design decisions the Spec does not cover, or a change would rewrite the Spec's Overview or several Stages. Do not plan the solution yourself. Present the options with your recommendation, such as changing the Plan and continuing, or pausing the session to summarize it with `apm-8-summarize-session`, archive it and plan again with a new Planner. The User decides.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. With version control, commit accepted uncommitted work on the Task's branch under the Rules' conventions. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Record how each consequential finding was resolved, accepted, deferred or left pending, with its source and reason. Keep pending decisions in the Tracker; preserve consequential decisions in the Stage summary.
7. Once the decision is recorded, clear the Worker's Report Bus, `.apm/bus/<agent-slug>/report.md`, then send any follow-up per `{GUIDE_PATH:task-assignment}` §5. Update the Tracker per §8.1 and §8.2, in one edit with the merge and dispatch changes that follow.

Tell the User about contained corrections. Pause for approval when a change exceeds the limits in §4.

## 4. Planning Document Changes

When a finding, correction or decision changes the Spec, Plan or Rules, update the related content and Task instructions.

You may correct one Task, add a dependency or an isolated Spec point, or adjust a Rule. Changes to several Tasks, design direction, scope, Stages or overall structure need the User's approval. Consider their combined effect when several small changes are involved.

1. Identify the change, its evidence and any approval needed.
2. Check the affected documents and dependent or active Tasks. Update the requirement where it belongs in the Spec, the affected Task fields and dependencies in the Plan, or shared Worker execution conventions inside `APM_RULES`. Use the existing format for new Tasks. Keep Notes consistent with their document's purpose and replace stale content.
3. Apply authorized changes together. If approval is needed, record the pending decision in the Tracker, ask the User to pause affected work and present the proposal. Wait for approval; unrelated work can continue.
4. Update Task next actions and record the change and reason in the Tracker. Deliver corrections to active work per `{GUIDE_PATH:task-assignment}` §5.1; reported attempts use a follow-up Task. Preserve consequential decisions in the Stage summary.

Keep the Worker's recorded outcome and evidence. Manager acceptance is a separate decision. Follow-up logs retain consequential earlier findings and their resolution.

## 5. Merging

With version control, merge a dispatch's branch into its base branch after a successful review, before dispatching Tasks that depend on it, and merge every branch of a Stage before the next Stage begins.

1. Switch to the recorded base branch, merge and check the result. Clean merges need no approval.
2. Resolve conflicts from the Task objectives and the Spec. Investigate complex conflicts against the affected contracts, or ask the User when a decision is needed.
3. If branch protection blocks a direct merge, use a pull request, an intermediate branch or the User's guidance, and record the constraint in the Tracker's Notes.
4. After the merge, remove the worktree with `git worktree remove .apm/worktrees/<branch-slug>` if there was one, delete the branch with `git branch -d <branch-name>`, and clear the Task's Branch and Worktree in the Tracker. When cleaning up several branches, remove their worktrees before deleting the branches.

## 6. Next Dispatch

Reports arrive in any order. Review each as it comes, without waiting for unrelated reports, and in the same turn dispatch newly Ready Tasks per `{GUIDE_PATH:task-assignment}` §1.

## 7. Stage Completion

When every Task in a Stage is Done and no follow-up Task is pending:

1. Decide whether the Stage needs verification as a whole. Verify when the User asked for it, the Plan's Notes call for it, or any of its Tasks needed a follow-up Task or reported Important Findings. Otherwise you may skip it and say so in the Stage summary.
2. To verify, use relevant checks on the Stage's combined result, examine the deliverables and exercise integration and edge cases at the validation level the work already uses. Keep reference inputs separate from generated results and preserve usable evidence paths through cleanup. Resolve contained verification questions yourself. Add a new Task for fixes to Done work, or ask the User when the required scope is unclear.
3. Account for every consequential Important Finding: its resolution or acceptance, effects on other work, and source. Preserve unresolved or accepted limitations and unrun checks. Sort the Tracker's Notes: move findings with lasting value to the Index's Notes with sources, put Stage-specific findings and decisions into its summary, and keep notes the next Stage still needs.
4. Write the Stage summary per §8.4 and add its row to the Index per §8.3, with any lasting notes in the same edit. Then remove Tracker notes whose context is preserved there and no longer needed for ongoing work. Use the reviewed logs still in your context, and reread logs that changed or that you no longer have.
5. Once all Tasks are Done, required Stage verification is resolved and, with version control, its branches are merged, replace the Stage's rows with `**Stage N:** Complete — [Summary](memory/stage-<NN>/stage-<NN>.summary.md)`. Completion records accepted work; the summary preserves accepted Partial outcomes and limits.

Then add the next Stage's Tasks to the Tracker per §8.1 and dispatch them per `{GUIDE_PATH:task-assignment}` §1. When every Stage is complete, continue with `{SKILL_PATH:apm-2-initiate-manager}` §3.

## 8. Formats

### 8.1 Tasks Section Format

The Tracker's `## Tasks` section holds each Stage's Task states:

```markdown
**Stage 1:** Complete — [Summary](memory/stage-01/stage-01.summary.md)

**Stage 2:**

| Task | Agent | Status | Branch | Worktree | Next Action |
|------|-------|--------|--------|----------|-------------|
| [2.1](memory/stage-02/task-02-01.log.md) | frontend-agent | Done | | | |
| [2.2](memory/stage-02/task-02-02.followup-01.log.md) | backend-agent | Active | feat/backend-models | .apm/worktrees/feat-backend-models | Review report |
| [2.3](memory/stage-02/task-02-03.log.md) | frontend-agent | Done | feat/frontend-auth | | Merge branch |
| 2.4 | backend-agent | Waiting: 2.2 | | | Await dependency |
| 2.5 | frontend-agent | Ready | | | Dispatch when Worker is free |
```

Status values:

- `Waiting: N.M`: a dependency is not Done. It may list several.
- `Ready`: all dependencies are Done.
- `Active`: dispatched, under review or awaiting a follow-up Task.
- `Done`: final decision made. A Branch value means the branch still awaits merging.

Link each Task ID to the latest reported attempt's `log_path`; use a plain ID before its first report. A pending follow-up's destination stays in its Task Prompt until reported.

Next Action names what happens next and who must act when that is unclear: execute, await a report, review, resolve a decision, follow up or merge. Leave it empty when nothing remains. Keep the explanation of a broader blocker or decision in Notes rather than duplicating it here.

Write each state and next action at the end of the review and dispatch cycle. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active. A Task whose Worker is still busy, or that waits for a better dispatch, stays Ready.

### 8.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Notes
<Coordination context: pending decisions, blockers, alignment changes and accepted limits awaiting durable recording; affected work, source, reason and any action needed>

## Tasks
<Per §8.1>

## Workers

| Agent | Conversation | Not Read Since Handoff | Context |
|-------|--------------|------------------------|---------|
| frontend-agent | 2 | 1.1, 1.3 | |
| backend-agent | 1 | | Recovered during Task 2.2 |
```

Add a Worker's row at its first dispatch. Not Read Since Handoff lists the Worker's Tasks from earlier Stages whose logs its current conversation has not read. Context records recoveries and remaining context gaps that affect later Task Prompts; update it as context is rebuilt. Keep top-level Notes as self-contained bullets while ongoing coordination needs them or their findings and decisions await recording in the Stage summary or Index.

### 8.3 Memory Index Format

The Index is `.apm/memory/index.md`:

```markdown
# APM Memory Index

## Notes
<Lasting findings and accepted or unresolved limits: their implications for later work, with source links>

## Stage Summaries

| Stage | Outcome | Summary |
|-------|---------|---------|
| 1 - <Stage Name> | <Accepted result and material limits, in brief> | [Stage 1](stage-01/stage-01.summary.md) |
```

Keep Index Notes brief: record what later assignments need to know and link to the specific attempt or summary that supports the finding. Requirements stay in the Spec, Plan or Rules; Stage summaries preserve the decisions and evidence.

### 8.4 Stage Summary Format

Each Stage summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

## Outcome
<Final review decision for each Task and Workers involved, useful commits, accepted Partial outcomes and what remains>

## Findings and Decisions
<Consequential discoveries, their resolution or acceptance, reasons, and changes to the Spec, Plan or Rules, with source links>

## Validation and Limits
<Stage verification performed or skipped and why; key results with counts and scope, accepted deviations and unrun checks, with evidence paths>

## Task Logs

- Task <N>.<M>: [Original](task-<NN>-<MM>.log.md), [Follow-up 1](task-<NN>-<MM>.followup-01.log.md)
```

Group each Task's original and follow-up logs together, identifying the final reviewed attempt. Select findings that affect future work, acceptance, compatibility, reproduction or unresolved risk. Keep implementation detail in Task Logs. The Index gives lasting context and navigation; each Stage summary preserves its decisions and evidence without repeating the full logs.
