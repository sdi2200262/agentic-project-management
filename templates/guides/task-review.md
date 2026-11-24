# APM {VERSION} - Task Review Guide

The Manager uses this guide to review results, decide next actions, align planning, integrate work and maintain the Tracker and Memory. `{GUIDE_PATH:task-assignment}` covers dispatch.

A Worker records one outcome per attempt: Success, Partial or Failed. You decide whether to mark the Task Done after reviewing the result. For your own Tasks, review subagent outputs under §§2–3 and write one concluding log. Corrections stay within the Active Task; Worker follow-up, attempt and bus procedures do not apply.

## 1. Report Intake

For each report the User delivers:

1. Check the sender against the Workers listed in the Plan. For an outside agent, assess its contribution and effects on planning or dispatch. Preserve consequential evidence, limits and decisions in the Stage summary before clearing their only source; outside agents write no Task Log. Keep only current coordination effects in Tracker Notes. Tell the User, clear the Report Bus, send further work per `{GUIDE_PATH:task-assignment}` §6, and continue with the next report.
2. Match the reported Worker, Tasks and attempt log paths to the expected dispatch before applying outcomes. If a report cannot be matched, ask the User for clarification and continue with other reports.
3. If `conversation` exceeds the Worker’s Tracker number, read its intervening Handoff Logs at `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md` and update the number. Record earlier work whose context must be restored for future assignments in the Agents table's Context; clear gaps when the relevant prompt or checked sources restore it.
4. If the report mentions a recovery, update the Agents table's Context with any unresolved gaps without changing the conversation number. Check the report against the Task Log for anything the recovery may have lost, and ask for missing details.
5. For a batch Task Report, assess each executed Task’s result and outcome per §§2–3; related outputs may share a review. Set the Tasks the batch did not start back to Ready or Waiting, and return them to dispatch.

## 2. Result Review

For Worker results, read the whole Task Log named in the report and check that it belongs to the reported attempt. Follow original and previous-attempt links where needed to verify earlier evidence and unresolved findings. Check its `status` against the outcome definitions in `{GUIDE_PATH:task-logging}` §1, and its `important_findings` against the body and deliverables. For your own Tasks, use contribution outputs and validation evidence; the concluding Task Log is written after review.

Check the result and each validation criterion against the Task requirements and evidence. Check counts, scope, deviations and unrun paths. Investigate findings that could change the decision. Inspect outputs or run focused checks where evidence is incomplete or uncertain. Distinguish confirmed limits from possibilities. Revisit Spec and Plan sections whose requirements or assumptions the findings call into question. A deliberate deviation leaves the criterion unmet. Record accepted exceptions as limits.

For continued work, use relevant earlier logs and outputs to establish what was addressed and what still applies to the current result. Check whether reported User feedback also applies to related deliverables still in progress or awaiting review. Preserve consequential findings, remaining limits and their implications with supporting evidence in the Task Log or Stage summary.

If a Success log includes a failed, unrun or weaker check, tell the User and keep the Task Active. Resolve the gap per §3; incorrect requirements or proposed exceptions go through §4.

For an authorized `AGENTS.md` change, check the change at its recorded path, using the diff when tracked, and retain it. If the User declined, ask before adding it. Correct planning documents contradicted by findings per §4, even if the Worker resolved the local issue.

Default to independent review for substantial implementation or consequential uncertainty. Preserve required reviews. Choose coverage by importance, complexity, existing evidence and remaining uncertainty. Normally one reviewer covers related Tasks or combined outputs. Use more for distinct consequential questions or expertise. Small, well-understood changes with adequate validation usually need no independent reviewer.

Keep reviewers separate from implementers. Give them requirements, instructions, changes, evidence, accepted exceptions and scope; ask them to challenge completeness and validation. Complete required review before dependent work relies on the result. Verify findings, resolve confirmed issues and check affected criteria. Reuse valid evidence and reviewer context; repeat broad review only when changed work or remaining uncertainty warrants it.

For a Worker follow-up or corrections, choose direct verification or subagent review according to size, complexity and remaining uncertainty. A contained fix usually suits direct checks; broader changes may benefit from the previous reviewer or different expertise.

At an agreed review or the next useful chat reporting point, briefly identify the relevant Stage and Tasks. Explain what review established and what it means for the next work, including evidence, findings, corrections, remaining decisions and the next action. Follow the shared communication guidance.

## 3. Review Outcomes

1. Accept a Success supported by the reviewed result and evidence, with no unresolved Important Findings.
2. Investigate Important Findings and outcomes other than Success. Handle contained corrections per `{SKILL_PATH:apm-2-initiate-manager}` §4. Before editing, ensure no agent is making overlapping changes. Work in the assigned workspace, follow applicable workspace instructions and agreed commit conventions, and validate affected criteria. For Worker results, preserve the reported outcome. Retain consequential corrections and validation with evidence for the Stage summary; Tracker Notes hold only their current coordination effects or decisions awaiting resolution.

   Compare follow-up results with the previous attempt. If another attempt has no supported approach, or remaining work substantially exceeds the assignment, present the options to the User before dispatching again.
3. Decide:
   - **Accept:** the work is complete, including validated corrections, or the User accepts the remaining limits. Check whether recorded agreement covers those limits and their effects on other Tasks. Ask only about new consequences or unclear decisions. For acceptance proposals, follow `{GUIDE_PATH:task-execution}` §6 and consider effects on the session and dependent work.

     Preserve reported outcomes and evidence. Keep unmet checks marked as unmet after acceptance. Record remaining coordination in the Tracker and the acceptance and its basis in the Stage summary before context is lost.
   - **Follow-up Task:** concrete work remains for the Worker, with an approach and a clear completion check. Preserve any uncommitted work for that attempt.
   - **Planning change:** a planning document is wrong. Change it per §4.
4. Investigate broader design or scope questions enough to present viable options. Follow §4 for contained corrections and broader approvals. Options include revising the Plan or pausing to summarize per `{SKILL_PATH:apm-8-summarize-session}`, archive and replan.
5. Keep a Task Active while investigation, a follow-up Task or a decision is pending. Follow the agreed commit conventions, retaining the location and state of uncommitted work in the Tracker. Mark it Done once you accept the outcome or restructure the work. Done is final: if Done work later needs a fix, add a new Task through a Plan change that refers to the original.
6. Record how each consequential finding was resolved, accepted, deferred or left pending, with its source and reason. Keep pending decisions in the Tracker; preserve consequential decisions in the Stage summary.
7. For Worker results, once the decision is recorded, clear the Report Bus, `.apm/bus/<agent-slug>/report.md`, then send any follow-up per `{GUIDE_PATH:task-assignment}` §5. Update the Tracker per §8.1 and §8.2, in one edit with the integration and dispatch changes that follow.

## 4. Planning and AGENTS.md Changes

When a finding, correction or decision changes the planning documents (the Spec and Plan) or `AGENTS.md`, update the related content and Task instructions.

You may correct one Task, add a dependency or an isolated Spec point, or propose an `AGENTS.md` update. Follow existing User authorization for changes to workspace conventions. Changes to several Tasks, design direction, scope, Stages or overall structure need the User's approval. Consider their combined effect when several small changes are involved.

1. Identify the change, its evidence, affected documents and dependent or active work. Check how the change affects ongoing work and coordinate any needed adjustment with whoever is performing it. Preserve valid progress, Task identity, current attempt and workspace.
2. Carry forward decisions already agreed with the User and resolve any further approval needed. If further approval is needed, record the pending decision in the Tracker, present the proposal and wait; unrelated work may continue.
3. Revise affected Spec and Plan sections in place, replacing superseded wording. Check related sections in both documents and update any the change affects. Record agreed changes to ongoing User involvement and coordination in the Plan, and update authorized workspace guidance. For new or revised Tasks, follow the prescribed format and give concrete work, outputs and checks. Reflect agreed involvement in responsibilities, Task size and review points. When reassigning, consider progress, retained knowledge and coordination demands. Preserve unrelated content.
4. Align Task instructions with the updated documents. Update affected Tracker entries in place, including next actions and the reason for changes that affect coordination (§8.2). Preserve consequential decisions in the Stage summary (§8.4) and update the Index when a change matters to later work (§8.3). Complete these updates before sending revised instructions, continuing affected work, waiting or handing off. Update your subagents directly. Ask the User to deliver Worker corrections per `{GUIDE_PATH:task-assignment}` §5.1, or use a follow-up for a reported attempt. Coordinate User-performed portions with the User.

For work cancelled, superseded or deferred beyond the session, retain its ID, disposition, reason and any replacement. Reconcile requirements, tables, dependencies and instructions so obsolete work is no longer actionable. After scope agreement, mark it Done and record its disposition in the Tracker and Stage summary, distinct from delivery. Preserve existing logs; do not invent execution logs for unperformed work.

Keep requirements in the Spec, work in the Plan, live coordination in the Tracker and history in Memory. Supporting documents hold only retained material outside these responsibilities. Agree their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents and conventions and keeping them navigable as the session grows. Record each specification in its own subsection under Supporting Documents, immediately after Notes in the Spec. Put any implementation work in Plan Tasks. Give Workers relevant instructions through Task Prompts. Use the change procedure above for new document types or structures.

## 5. Integration and Cleanup

Integrate completed work according to the agreed version-control arrangement. Before starting dependent work, make sure required outputs are available in its actual workspace.

1. Integrate into the agreed branch or workspace and check the combined result.
2. Resolve conflicts from the Task objectives and the Spec. Investigate complex conflicts against affected contracts, or ask the User when a decision is needed.
3. If branch protection blocks a direct merge, use a pull request, an intermediate branch or the User’s guidance, and record the constraint in the Tracker’s Notes.
4. Remove branches and working copies only when their work is preserved and they are no longer needed. Follow the agreed tools' cleanup procedures. For Git, remove worktrees before deleting their branches. Clear obsolete locations from the Tracker. Record pending integration, cleanup and shared workspace use in Notes, and keep the affected Tasks' Next Action current.

## 6. Next Dispatch

Review reports as they arrive. Complete needed investigation and document alignment before starting affected downstream work. Continue unrelated Ready work without waiting for other reports, per `{GUIDE_PATH:task-assignment}` §1.

## 7. Stage Completion

When every Task in a Stage is Done and no follow-up Task is pending:

1. Perform required User and Plan checks. Reuse Task validation and review evidence that still applies. Focus further review on gaps that could affect acceptance. Record what you checked or skipped and why.
2. For those checks and gaps, verify combined deliverables at the work's validation level. Keep reference inputs separate from generated results and preserve usable evidence through cleanup. Resolve questions within scope; add Tasks for fixes to Done work or ask where scope is unclear.
3. Use Task Logs and the Tracker to account for consequential findings, decisions, accepted limits and unrun checks. Cite their sources. Reuse reviewed logs still in context and reread those that changed or are no longer available.
4. Write or update the Stage summary per §8.4. Record the Stage outcome in the Index. Update Index Notes with what later work needs (§8.3). Keep Tracker Notes current for any coordination that carries forward (§8.2).
5. Once all Tasks are Done and required integration and verification are complete, replace their rows with `**Stage N:** Complete — [Summary](memory/stage-<NN>/stage-<NN>.summary.md)`. The summary retains accepted Partial outcomes and limits.
6. Briefly report the Stage and actual result, verification, remaining limits and consequential carryover. Explain the next Stage's work and ask explicitly before starting it, unless a different arrangement was explicitly agreed. Do not infer permission from approval of the overall Plan. Resolve acceptance of remaining limits separately where needed.

After agreement to advance, add the next Stage's Tasks per §8.1 and dispatch per Task Assignment. When every Stage is complete, follow the Manager's session-completion responsibilities.

## 8. Formats

Write the Tracker, Index and Stage summaries for current and later Managers. They can consult the Spec, Plan and linked logs; retain the coordination or findings each record needs and link supporting detail.

When a note points to a consequential document update, briefly state what the document recorded before and what it records now. Give the reason and effect on the work, and link to the updated section.

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
- `Done`: final decision made, including any explicitly accepted Partial outcome. Keep pending integration or cleanup in Next Action, with only necessary supporting coordination in Notes. Accepted limits and their evidence belong in Memory; link those that affect current coordination.

The Agent column uses the Plan's Worker slug or `manager`. Record each Task's branch where applicable and put any separate working-copy path in Worktree. Several Tasks may share these values. Use Notes for arrangements affecting several Tasks.

Link each Task ID to the latest reported Worker attempt or completed Manager log; use a plain ID before either exists or when work was removed without execution. A pending Worker follow-up's destination stays in its Task Prompt until reported.

Next Action names what happens next and who must act when that is unclear: execute, await a report, review, resolve a decision, follow up, integrate or clean up. Leave it empty when nothing remains. Keep the explanation of a broader blocker or decision in Notes rather than duplicating it here.

Update the Tracker with changes to assignments, responsibilities, Task states and outcomes, blockers, decisions, work locations and next actions that affect coordination. Keep any progress needed to resume work. Combine related changes in one edit at the end of a coordination cycle. Update it sooner when dependent work or a wait comes first, and before a Handoff so the incoming Manager can resume. For a wait, record what will let work continue and how the next check or action will start. A Task unblocked and dispatched in the same turn goes straight from Waiting to Active. A Task whose responsible agent is still busy, or that waits for a better dispatch, stays Ready.

### 8.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Notes
<Blockers, pending decisions and other context that affects current coordination, with sources and reasons. Keep notes across Stage boundaries while they still require attention.>

## Tasks
<Per §8.1>

## Agents

| Agent | Conversation | Context |
|-------|--------------|---------|
| manager | 1 | |
| frontend-agent | 2 | Restore Task 1.3 dependency context before assigning related work |
| backend-agent | 1 | |
```

Register the Manager at startup and Workers at first dispatch. Agents holds conversation numbers and unresolved continuation or recovery gaps, not Task states, workspaces, next actions or a list of temporary subagents. Clear gaps when restored; recovery does not change the number.

Use Notes for context needed to coordinate or resume work, including blockers, pending decisions, cross-Task arrangements and resume conditions. Include tentative observations about User preferences and coordination proposals only when they affect current work. Describe what you observed and under what conditions, or what remains open. Give the effect on the next action or decision and cite the source. Distinguish earlier events from what applies now where it matters.

Revise affected Task rows and Notes together. Replace superseded information, update references and clear resolved notes and context gaps during ordinary updates. Before removing the only record of a consequential event, preserve it in its Task Log or Stage summary. Keep a short reference while coordination still needs it.

### 8.3 Memory Index Format

The Index is `.apm/memory/index.md`:

```markdown
# APM Memory Index

## Notes
<Findings, limits, established User preferences and agreed changes that matter to later work, with their scope, implications and sources>

## Stage Summaries

| Stage | Outcome | Summary |
|-------|---------|---------|
| 1 - <Stage Name> | <Accepted result and material limits, in brief> | [Stage 1](stage-01/stage-01.summary.md) |
```

Keep Index Notes brief and limited to what later work needs. State the scope and implications and link the supporting log or summary. Preserve the conditions and evidence of observations and revise notes when their implications for later work change. Current requirements, arrangements and conventions stay in their owning documents. Use the Stage outcome table for results and material limits. Keep pending decisions and live status in the Tracker.

### 8.4 Stage Summary Format

Each Stage summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

## Outcome
<Current Stage results, Task decisions and agents involved, relevant commits and uncommitted work, accepted Partial outcomes and what remains>

## Findings and Decisions
<Consequential discoveries, their resolution or acceptance, reasons, and changes to the Spec, Plan or `AGENTS.md`, with source links>

## Validation and Limits
<Stage verification performed or skipped and why; key results with counts and scope, accepted deviations and unrun checks, with evidence paths>

## Task Logs

- Task <N>.<M>: [Original](task-<NN>-<MM>.log.md), [Follow-up 1](task-<NN>-<MM>.followup-01.log.md)
```

Group original and follow-up logs by Task and identify the final reviewed attempt. Preserve findings affecting future work, acceptance, compatibility, reproduction or unresolved risk. Keep implementation details in logs; the Index provides lasting context and navigation, the summary decisions and evidence.

Keep the Stage summary current until the next Stage starts or the session closes. Revise affected results and checks in place. Keep earlier decisions under Findings and Decisions. When a later Stage changes an earlier result, record the change in that Stage’s summary and link to the earlier work.
