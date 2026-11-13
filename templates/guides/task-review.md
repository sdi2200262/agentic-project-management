# APM {VERSION} - Task Review Guide

The Manager uses this guide to review results, decide next actions, align planning, integrate work and maintain the Tracker and Memory. `{GUIDE_PATH:task-assignment}` covers dispatch.

A Worker records one outcome per attempt: Success, Partial or Failed. You decide whether to mark the Task Done after reviewing the result. For your own Tasks, review subagent outputs under §§2–3 and write one concluding log. Follow-up stays within the Active Task; Worker attempt and bus procedures do not apply.

## 1. Report Intake

For each report the User delivers:

1. For a sender absent from the Workers table, assess its contribution and effects on planning or dispatch. Record evidence, limits and paths in Tracker Notes; outside agents write no Task Log. Tell the User, clear the Report Bus, send further work per `{GUIDE_PATH:task-assignment}` §6, and continue with the next report.
2. If `conversation` exceeds the Worker’s Tracker number, read its intervening Handoff Logs at `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md` and update the number. List its earlier-Stage Tasks under Not Read Since Handoff; remove each once a Task Prompt restores its missing dependency context.
3. If the report mentions a recovery, record it in the Workers table's Context without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
4. For a batch Task Report, assess each executed Task’s result and outcome per §§2–3; related outputs may share a review. Set the Tasks the batch did not start back to Ready or Waiting, and return them to dispatch.

## 2. Result Review

Read the whole Task Log named in the report, following original and previous-attempt links where needed to verify earlier evidence and unresolved findings. Check its `status` against the outcome definitions in `{GUIDE_PATH:task-logging}` §1, and its `important_findings` against the body and deliverables.

Check the delivered result and each validation criterion against the Task requirements and evidence, including counts, scope, deviations and unrun paths. Inspect outputs or run focused checks where evidence is incomplete or uncertain. Revisit relevant Spec and Plan sections when findings question the requirements or assumptions. A deliberate difference is an unmet criterion; record accepted exceptions as limitations.

If a Success log includes a failed, unrun or weaker check, tell the User and keep the Task Active. Resolve the gap per §3; incorrect requirements or proposed exceptions go through §4.

For an authorized `AGENTS.md` change, check the change at its recorded path, using the diff when tracked, and retain it. If the User declined, ask before adding it. Correct planning documents contradicted by findings per §4, even if the Worker resolved the local issue.

Decide whether independent subagent review is needed, and choose its scope and reviewer count by importance, complexity, uncertainty and needed expertise. Preserve required reviews. Group related Tasks or integrated outputs in one review where shared context helps; split around distinct consequential questions. Supply requirements, applicable instructions, outputs, validation evidence and accepted exceptions. Ask the reviewer to challenge completeness and validation, reusing valid evidence. Verify findings, resolve confirmed issues and check affected criteria after corrections. Repeat independent review only when remaining risk or uncertainty warrants it. Continue the reviewer’s conversation when useful; keep it separate from the implementer.

In the next useful User update, briefly recall the relevant Stage and Tasks, explain what review established and what it means for the next work, with evidence, findings, corrections, remaining decisions and the next action, per `{SKILL_PATH:apm-2-initiate-manager}` §2.

## 3. Review Outcomes

1. Accept a Success supported by the reviewed result and evidence, with no unresolved Important Findings.
2. Investigate Important Findings and outcomes other than Success. Handle contained corrections per `{SKILL_PATH:apm-2-initiate-manager}` §4. Before editing, ensure no agent is making overlapping changes. Work in the assigned workspace, follow `AGENTS.md` and agreed commit conventions, and validate affected criteria. Record a brief account of your corrections and validation in Tracker Notes, linking detailed evidence and preserving the Worker’s outcome.

   Compare follow-up results with the previous attempt. If another attempt has no supported approach, or remaining work substantially exceeds the assignment, present the options to the User before dispatching again.
3. Decide:
   - **Accept:** the work is complete, including corrections validated during review, or the User agrees to accept remaining limits. Check whether any recorded agreement covers those limits and their effects on other Tasks; ask only about new consequences or unclear decisions. Offer a recommendation when the User asks for guidance or evidence clarifies a consequential trade-off. For any proposed acceptance of remaining limits, explain their effects on the session and dependent work and why acceptance is preferable to further work or a planning change. Record what remains and the basis for acceptance in Tracker Notes, preserving the Worker’s outcome and evidence. Acceptance does not turn unmet checks into passes.
   - **Follow-up Task:** concrete work remains for the Worker, with an approach and a clear completion check. Preserve any uncommitted work for that attempt.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. Investigate broader design or scope questions enough to present viable options. Follow §4 for contained corrections and broader approvals. Options include revising the Plan or pausing to summarize per `{SKILL_PATH:apm-8-summarize-session}`, archive and replan.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. Follow the agreed commit conventions, retaining the location and state of uncommitted work in the records. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Record how each consequential finding was resolved, accepted, deferred or left pending, with its source and reason. Keep pending decisions in the Tracker; preserve consequential decisions in the Stage summary.
7. Once the decision is recorded, clear the Worker's Report Bus, `.apm/bus/<agent-slug>/report.md`, then send any follow-up per `{GUIDE_PATH:task-assignment}` §5. Update the Tracker per §8.1 and §8.2, in one edit with the integration and dispatch changes that follow.

## 4. Planning and AGENTS.md Changes

When a finding, correction or decision changes the Spec, Plan or `AGENTS.md`, update the related content and Task instructions.

You may correct one Task, add a dependency or an isolated Spec point, or propose an `AGENTS.md` update. Follow existing User authorization for changes to workspace conventions. Changes to several Tasks, design direction, scope, Stages or overall structure need the User's approval. Consider their combined effect when several small changes are involved.

1. Identify the change, its evidence, affected documents and dependent or active work. Check how the change affects ongoing work and coordinate any needed adjustment with whoever is performing it. Preserve valid progress, Task identity, current attempt and workspace.
2. Carry forward decisions already agreed with the User and resolve any further approval needed. If further approval is needed, record the pending decision in the Tracker, present the proposal and wait; unrelated work may continue.
3. Update Spec requirements, Plan tables, Task fields and dependencies, and authorized workspace guidance. Keep Notes within their document’s purpose. Use existing Task formats with concrete work, outputs and checks; preserve agreed involvement through responsibility, size and review points. Reassign with regard to progress, retained knowledge and coordination demands. Extend or replace guidance concisely, preserving unrelated content.
4. Update affected instructions and record what should happen next, the change and its reason in the Tracker. Update your subagents directly; ask the User to deliver Worker corrections per `{GUIDE_PATH:task-assignment}` §5.1, or use a follow-up for a reported attempt. Coordinate User-performed portions with the User. Preserve consequential decisions in the Stage summary.

For work cancelled, superseded or deferred beyond the session, retain its ID, disposition, reason and any replacement. Reconcile requirements, tables, dependencies and instructions so obsolete work is no longer actionable. After scope agreement, mark it Done and record its disposition in the Tracker and Stage summary, distinct from delivery. Preserve existing logs; do not invent execution logs for unperformed work.

Keep requirements in the Spec, work in the Plan, live coordination in the Tracker and history in Memory. Supporting documents hold only retained material outside these responsibilities. Agree their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents and conventions and keeping them navigable as the session grows. Record the arrangement in this session’s Spec and any implementation work in Plan Tasks. Give Workers relevant instructions through Task Prompts. Use the change procedure above for new document types or structures.

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
2. When verifying, check combined deliverables, integration and edge cases at the work’s validation level. Keep reference inputs separate from generated results and preserve evidence paths through cleanup. Resolve contained questions yourself; add Tasks for fixes to Done work or ask when scope is unclear.
3. Account for consequential Important Findings: resolution or acceptance, wider effects and sources, including limits and unrun checks. Move lasting Tracker findings to Index Notes, Stage-specific findings and decisions to the summary, and retain coordination needed next Stage, including workspaces and pending integration or cleanup.
4. Write the Stage summary (§8.4) and its Index row (§8.3), adding lasting notes in the same edit. Remove Tracker notes only once preserved and no longer needed; update references to their lasting locations. Reuse reviewed logs in context, rereading any that changed or are no longer in context.
5. Once all Tasks are Done and required integration and Stage verification are complete, replace the Stage's rows with `**Stage N:** Complete — [Summary](memory/stage-<NN>/stage-<NN>.summary.md)`. Completion records accepted work; the summary preserves accepted Partial outcomes and limits.

Then add the next Stage's Tasks to the Tracker per §8.1 and dispatch them per `{GUIDE_PATH:task-assignment}` §1. When every Stage is complete, continue with `{SKILL_PATH:apm-2-initiate-manager}` §3.

## 8. Formats

Write the Tracker, Index and Stage summaries for current and later Managers. They can consult the Spec, Plan and linked logs; retain the coordination or findings each record needs and link supporting detail.

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

Link each Task ID to the latest reported Worker attempt or completed Manager log; use a plain ID before either exists or when work was removed without execution. A pending Worker follow-up's destination stays in its Task Prompt until reported.

Next Action names what happens next and who must act when that is unclear: execute, await a report, review, resolve a decision, follow up, integrate or clean up. Leave it empty when nothing remains. Keep the explanation of a broader blocker or decision in Notes rather than duplicating it here.

Update the Tracker when assignments, responsibilities, outcomes, blockers or decisions change, or progress must be preserved to resume. Combine related state and next-action changes at the end of a coordination cycle, before dependent work, a wait or a Handoff. Omit routine execution detail and transient states. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active. A Task whose responsible agent is still busy, or that waits for a better dispatch, stays Ready.

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

Add Workers at first dispatch. Not Read Since Handoff lists each Worker’s earlier-Stage Tasks whose logs its current conversation has not read. Context records recoveries and remaining gaps; update it as context is rebuilt. Keep Notes to current coordination, pending decisions and findings awaiting durable recording, usually one compact bullet of 1–3 sentences per issue. Revise superseded notes in the same update so the current state is clear. Preserve consequential history in Memory before removing its only record. Link lasting findings and supporting documents from Notes or Next Action rather than repeating them. Distill Notes at Stage completion per §7.

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

Group original and follow-up logs by Task and identify the final reviewed attempt. Preserve findings affecting future work, acceptance, compatibility, reproduction or unresolved risk. Keep implementation details in logs; the Index provides lasting context and navigation, the summary decisions and evidence.
