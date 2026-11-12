# APM {VERSION} - Task Review Guide

This guide covers how the Manager reviews Task Reports, Task Logs and results, decides next actions, aligns planning, integrates work, cleans up workspaces and maintains the Tracker. Stage completion includes required verification, a summary and an Index entry. `{GUIDE_PATH:task-assignment}` covers the next dispatch.

A Worker records one outcome per attempt: Success, Partial or Failed. You decide whether to mark the Task Done after reviewing the result. For your own Tasks, review subagent outputs under §§2–3 and write one concluding log. Follow-up stays within the Active Task; Worker attempt and bus procedures do not apply.

## 1. Report Intake

For each report the User delivers:

1. If the sender has no row in the Tracker's Workers table, it is an agent outside APM: assess its contribution and what it changes for planning or dispatch. Record it in the Tracker's Notes, preserving consequential evidence, limits and source paths: this agent writes no Task Log. Tell the User, clear its Report Bus, and send any further work per `{GUIDE_PATH:task-assignment}` §6. Then continue with the next report.
2. If the report's `conversation` is higher than the Worker's number in the Workers table, the Worker had a Handoff. Read its Handoff Logs, `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md`, for each conversation since the one you knew, update the number, and list the Worker's Tasks from earlier Stages under Not Read Since Handoff: its new conversation did not read their logs. Remove a Task from that list once a Task Prompt has supplied its missing dependency context.
3. If the report mentions a recovery, record it in the Workers table's Context without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
4. For a batch Task Report, review each executed Task on its own per §2 and §3. Set the Tasks the batch did not start back to Ready or Waiting, and return them to dispatch.

## 2. Result Review

Read the whole Task Log named in the report, following original and previous-attempt links where needed to verify earlier evidence and unresolved findings. Check its `status` against the outcome definitions in `{GUIDE_PATH:task-logging}` §1, and its `important_findings` against the body and deliverables.

Check the delivered result and each validation criterion against the Task requirements and evidence, including counts, scope, deviations and unrun paths. Inspect outputs or run focused checks where evidence is incomplete or uncertain. Revisit relevant Spec and Plan sections when findings question the requirements or assumptions. A deliberate difference is an unmet criterion; record accepted exceptions as limitations.

If a Success log includes a failed, unrun or weaker check, tell the User and keep the Task Active. Resolve the gap per §3; incorrect requirements or proposed exceptions go through §4.

Important Findings can affect other work, reveal missing validation, record a User correction or point to a problem in the Spec, Plan or `AGENTS.md`. If the log records User authorization for an `AGENTS.md` change, check the change at its recorded `AGENTS.md` path, using the diff when tracked, and keep it. If the User declined, do not add it without asking. If a finding contradicts a planning document, correct the document per §4, even when the Worker already handled the local issue.

Choose independent subagent review during implementation according to the work’s importance, complexity and uncertainty. Scope the review around consequential questions across a Task, related Tasks or an integrated result. Supply requirements, applicable instructions, outputs, validation evidence and accepted exceptions. Ask the reviewer to challenge completeness and validation, reusing valid evidence. Verify findings, resolve confirmed issues and check affected criteria after corrections. Repeat independent review when remaining risk or uncertainty warrants it. Continue the reviewer’s conversation when useful; keep it separate from the implementer.

Include what the evidence supports, consequential findings, corrections and the next action in the next useful User update per `{SKILL_PATH:apm-2-initiate-manager}` §2.

## 3. Review Outcomes

1. Accept a Success supported by the reviewed result and evidence, with no unresolved Important Findings.
2. Investigate Important Findings and outcomes other than Success. Handle contained corrections per `{SKILL_PATH:apm-2-initiate-manager}` §4. Before editing, ensure no agent is making overlapping changes. Work in the assigned workspace, follow `AGENTS.md` and agreed commit conventions, and validate affected criteria. Record your work and validation with evidence in the Tracker's Notes, preserving the Worker's outcome.

   Compare follow-up results with the previous attempt. If another attempt has no supported approach, or remaining work substantially exceeds the assignment, present the options to the User before dispatching again.
3. Decide:
   - **Accept:** the work is complete, including corrections validated during review, or the User agrees to accept remaining limits. Check whether any recorded agreement covers those limits and their effects on other Tasks; ask only about new consequences or unclear decisions. Offer a recommendation when the User asks for guidance or evidence clarifies a consequential trade-off. For any proposed acceptance of remaining limits, explain their effects on the session and dependent work and why acceptance is preferable to further work or a planning change. Record what remains and the basis for acceptance in Tracker Notes, preserving the Worker’s outcome and evidence. Acceptance does not turn unmet checks into passes.
   - **Follow-up Task:** concrete work remains for the Worker, with an approach and a clear completion check. Preserve any uncommitted work for that attempt.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. When findings require broader design or scope changes, investigate the affected requirements and dependencies enough to present viable options. Resolve contained corrections per §4; agree broader changes with the User. Options include revising the Plan and continuing, or pausing to summarize the session per `{SKILL_PATH:apm-8-summarize-session}`, archive it and plan again with a new Planner.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. Follow the agreed commit conventions, retaining the location and state of uncommitted work in the records. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Record how each consequential finding was resolved, accepted, deferred or left pending, with its source and reason. Keep pending decisions in the Tracker; preserve consequential decisions in the Stage summary.
7. Once the decision is recorded, clear the Worker's Report Bus, `.apm/bus/<agent-slug>/report.md`, then send any follow-up per `{GUIDE_PATH:task-assignment}` §5. Update the Tracker per §8.1 and §8.2, in one edit with the integration and dispatch changes that follow.

## 4. Planning and AGENTS.md Changes

When a finding, correction or decision changes the Spec, Plan or `AGENTS.md`, update the related content and Task instructions.

You may correct one Task, add a dependency or an isolated Spec point, or propose an `AGENTS.md` update. Follow existing User authorization for changes to workspace conventions. Changes to several Tasks, design direction, scope, Stages or overall structure need the User's approval. Consider their combined effect when several small changes are involved.

1. Identify the change, its evidence, affected documents and dependent or active work. Check how the change affects ongoing work and coordinate any needed adjustment with whoever is performing it. Preserve valid progress, Task identity, current attempt and workspace.
2. Carry forward decisions already agreed with the User and resolve any further approval needed. If further approval is needed, record the pending decision in the Tracker, present the proposal and wait; unrelated work may continue.
3. Update requirements in the Spec, Task fields and dependencies in the Plan, and lasting workspace guidance in `AGENTS.md` as authorized. Keep Notes consistent with their document’s purpose. For new or changed Tasks, use the existing format with concrete work, outputs and completion checks. Tie agreed involvement to that work through responsibility, size and review points. When revising assignments, consider progress, knowledge built in each conversation, and current context and coordination demands. Extend or replace workspace guidance where possible, keeping additions concise and preserving unrelated content.
4. Update affected instructions and record what should happen next, the change and its reason in the Tracker. Update your subagents directly; ask the User to deliver Worker corrections per `{GUIDE_PATH:task-assignment}` §5.1, or use a follow-up for a reported attempt. Coordinate User-performed portions with the User. Preserve consequential decisions in the Stage summary.

Keep requirements in the Spec, planned work in the Plan, live coordination in the Tracker, and work history in Memory. Add supporting documents only for retained material outside those responsibilities. Propose their purpose, paths under `.apm/`, structure, maintenance responsibility and intended readers to the User. Choose a structure readers can navigate as the session grows, reusing existing documents and conventions where suitable. Refine the proposal with their feedback and record the agreed arrangement in the Spec for this session only. Put any implementation work to create, use or maintain them in the relevant Plan Tasks. Give Workers relevant reading and maintenance instructions through Task Prompts. Use the change procedure above for new document types or structures.

## 5. Integration and Cleanup

Integrate completed work according to the agreed version-control arrangement. Before starting dependent work, make sure required outputs are available in its actual workspace.

1. Integrate into the agreed branch or workspace and check the combined result.
2. Resolve conflicts from the Task objectives and the Spec. Investigate complex conflicts against affected contracts, or ask the User when a decision is needed.
3. If branch protection blocks a direct merge, use a pull request, an intermediate branch or the User’s guidance, and record the constraint in the Tracker’s Notes.
4. Remove branches and worktrees only when no longer needed and their work is preserved. Remove worktrees before deleting their branches. Clear obsolete locations from the Tracker. Record pending integration, cleanup and shared workspace use in Notes, and keep the affected Tasks’ Next Action current.

## 6. Next Dispatch

Review reports as they arrive. Complete needed investigation and document alignment before starting affected downstream work. Continue unrelated Ready work without waiting for other reports, per `{GUIDE_PATH:task-assignment}` §1.

## 7. Stage Completion

When every Task in a Stage is Done and no follow-up Task is pending:

1. Decide whether the Stage needs verification as a whole. Verify when the User asked for it, the Plan's Notes call for it, or any of its Tasks needed a follow-up Task or recorded Important Findings. Otherwise you may skip it and say so in the Stage summary.
2. To verify, use relevant checks on the Stage's combined result, examine the deliverables and exercise integration and edge cases at the validation level the work already uses. Keep reference inputs separate from generated results and preserve usable evidence paths through cleanup. Resolve contained verification questions yourself. Add a new Task for fixes to Done work, or ask the User when the required scope is unclear.
3. Account for every consequential Important Finding: its resolution or acceptance, effects on other work, and source. Preserve unresolved or accepted limitations and unrun checks. Sort the Tracker's Notes: move findings with lasting value to the Index's Notes with sources, put Stage-specific findings and decisions into its summary, and keep notes the next Stage still needs, including workspace locations and pending integration or cleanup.
4. Write the Stage summary per §8.4 and add its row to the Index per §8.3, with any lasting notes in the same edit. Then remove Tracker notes whose context is preserved there and no longer needed for ongoing work. Use the reviewed logs still in your context, and reread logs that changed or that you no longer have.
5. Once all Tasks are Done and required integration and Stage verification are complete, replace the Stage's rows with `**Stage N:** Complete — [Summary](memory/stage-<NN>/stage-<NN>.summary.md)`. Completion records accepted work; the summary preserves accepted Partial outcomes and limits.

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
- `Active`: started by the Manager, dispatched to a Worker, under review or awaiting a follow-up Task.
- `Done`: final decision made, including any explicitly accepted Partial outcome. Record remaining limitations and any pending integration or cleanup explicitly in Tracker Notes, and keep Next Action current.

The Agent column uses the Plan’s Worker slug or `manager`. Record each Task’s branch and any worktree; several Tasks may share these values. Use Notes for arrangements affecting several Tasks.

Link each Task ID to the latest reported Worker attempt or completed Manager log; use a plain ID before either exists. A pending Worker follow-up's destination stays in its Task Prompt until reported.

Next Action names what happens next and who must act when that is unclear: execute, await a report, review, resolve a decision, follow up, integrate or clean up. Leave it empty when nothing remains. Keep the explanation of a broader blocker or decision in Notes rather than duplicating it here.

Write each state and next action at the end of the review and dispatch cycle. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active. A Task whose responsible agent is still busy, or that waits for a better dispatch, stays Ready.

### 8.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Notes
<Blockers, pending decisions and context needed to coordinate the current Stage, with sources and reasons. Keep notes across Stage boundaries while they still require attention.>

## Tasks
<Per §8.1>

## Workers

| Agent | Conversation | Not Read Since Handoff | Context |
|-------|--------------|------------------------|---------|
| frontend-agent | 2 | 1.1, 1.3 | |
| backend-agent | 1 | | Recovered during Task 2.2 |
```

Add a Worker's row at its first dispatch. Not Read Since Handoff lists the Worker's Tasks from earlier Stages whose logs its current conversation has not read. Context records recoveries and remaining context gaps that affect later Task Prompts; update it as context is rebuilt. Keep top-level Notes as self-contained bullets for current coordination and pending decisions, including findings awaiting durable recording. Link actions to lasting findings in Memory rather than repeating their account. Link supporting documents used for coordination from the relevant Notes or Next Action. Retain and distill notes at Stage completion per §7.

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

Keep Index Notes brief: findings and implications later work should remember, linked to supporting attempts or summaries. Pending decisions belong in the Tracker; accepted limits relevant to later work remain here. Session requirements stay in the Spec, work structure in the Plan and workspace conventions in `AGENTS.md`; Stage summaries preserve the decisions and evidence.

### 8.4 Stage Summary Format

Each Stage summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

## Outcome
<Final decision for each Task and agents involved, relevant commits and uncommitted work, accepted Partial outcomes and what remains>

## Findings and Decisions
<Consequential discoveries, their resolution or acceptance, reasons, and changes to the Spec, Plan or `AGENTS.md`, with source links>

## Validation and Limits
<Stage verification performed or skipped and why; key results with counts and scope, accepted deviations and unrun checks, with evidence paths>

## Task Logs

- Task <N>.<M>: [Original](task-<NN>-<MM>.log.md), [Follow-up 1](task-<NN>-<MM>.followup-01.log.md)
```

Group each Task's original and follow-up logs together, identifying the final reviewed attempt. Select findings that affect future work, acceptance, compatibility, reproduction or unresolved risk. Keep implementation detail in Task Logs. The Index gives lasting context and navigation; each Stage summary preserves its decisions and evidence without repeating the full logs.
