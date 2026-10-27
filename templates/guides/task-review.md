# APM {VERSION} - Task Review Guide

## 1. Overview

**Reading agent:** Manager

Review Task evidence, determine outcomes, update planning documents when warranted, and maintain the Tracker. After a Stage finishes, verify it when needed and write its summary and add it to the Memory Index.

## 2. Operational Standards

### 2.1 Task Log Review Standards

Compare the status and `important_findings` with the log body and deliverables. Success requires the objective and all validation to be complete; Partial needs guidance; Failed means the objective was not achieved. Read the whole log, including Validation and Important Findings, and check each statement against the status. A Success log that says a criterion was not run, failed or was replaced by a weaker check is inconsistent. Do not settle the conflict with other evidence yourself: tell the User what conflicts, send the Worker a follow-up to run the check or explain the gap, and keep the Task Active until it answers.

Interpret Important Findings with project context. They can affect other work, reveal missing validation, record a User correction, or show conflicts that point to Spec, Plan or Rules problems. When the log says the User approved a Rules addition, check the Worker's `AGENTS.md` change in the diff and keep it. When the User declined, don't add it to the Rules without asking the User. If findings contradict a planning document, correct that document through §3.4 even when the Worker already handled the local issue.

### 2.2 Review Outcome Standards

Accept a supported Success without Important Findings. Investigate Important Findings and non-Success outcomes before deciding. A Success log that contradicts its own validation is not yours to resolve: follow §2.1 and wait for the Worker's answer, even if other evidence looks sufficient. Check contained issues directly. For context-intensive or unclear issues, use a subagent to investigate. Give it the investigation goal, files to examine and required findings. Verify critical claims against source.

After investigation, proceed if nothing actionable remains, send a refined follow-up if retry is needed, or modify planning documents when their content is wrong. Note uncommitted changes in a non-Success follow-up. When version control is active, commit successful uncommitted work on the Worker's branch using Rules conventions; no follow-up is needed for that alone.

When validation is incomplete or deliverables are partial, issue a follow-up, or, if the User agrees, accept the Partial outcome and record what remains in the Tracker's Notes. Done is terminal. If previously-Done work needs correction, create a new Task through Plan modification, referencing the original and discovery context. Keep a Task Active while investigation, follow-up or a coordination decision is pending. A terminal decision can accept Success, accept a non-Success outcome or restructure work.

Act on small contained follow-ups/corrections and inform the User. Pause for approval when changes exceed your authority per §2.3.

### 2.3 Planning Document Modification Standards

Assess cascade effects between Spec and Plan before changing either; Rules are usually independent. Distinguish implementation adjustments within design intent from invalid design assumptions. When uncertain, inspect related documents and correct the document where the problem originates.

You may clarify one Task, add a missing dependency, make an isolated Spec addition or adjust Rules narrowly. Multiple affected Tasks, design/scope changes, new Stages or major restructuring require User collaboration. Several small changes can collectively exceed your authority. When unclear, ask the User.

### 2.4 Parallel Coordination Standards

Process reports as they arrive, in any order. Complete review, merge successful completed branches, reassess readiness and dispatch newly Ready work in the same turn. Pause when no work is Ready or a change requires User collaboration. Do not wait for unrelated reports.

In a wait state, state what was processed, what remains pending and which report the User needs to bring back next. Prioritize a report that would enable a useful dispatch combination per `{GUIDE_PATH:task-assignment}` §2.4.

### 2.5 Merge Standards

When version control is active, merge the completed dispatch unit's branch into base after successful review. Merge required outputs before dependent dispatch and sweep all current-Stage branches at Stage end. Switch to the recorded base branch before merging; merge and verify autonomously for clean merges.

Resolve conflicts using Task objectives, project design and Spec; for complex conflicts, use a subagent to investigate or seek User help. If branch protection blocks direct merging, adapt through a PR, intermediate branch or User guidance and record the constraint in the Tracker's Notes.

After a successful merge, remove the assignment’s worktree with `git worktree remove .apm/worktrees/<branch-slug>` if it used one, then delete the merged branch with `git branch -d <branch-name>`. For a multi-branch sweep, batch removals first, then deletions in one terminal invocation.

### 2.6 Stage Summary Standards

Keep Stage summaries concise for future Managers and retrospectives: outcome, Workers, consequential findings, decisions and patterns, with useful commit references. Refer to the Index's Notes for lasting guidance and summarize Stage-specific history once, including changes to the Spec or Plan. Include important implementation events from the Tracker's Notes, but leave detailed implementation in Task Logs. Finish with log references. Store lasting observations in the Index's Notes per §2.7.

### 2.7 Note-Taking Standards

Use self-contained bullets. The Tracker's Notes hold current coordination context: pending considerations, preferences, constraints, observations and review patterns. Add useful findings and remove stale notes throughout the Stage.

At Stage end, move observations with lasting impact on future work to the Index's Notes. Put historical Stage-specific details into the Stage summary. Keep the Tracker's Notes still needed for the next Stage. New findings from the final review can go directly to these destinations.

### 2.8 Stage Verification Standards

After all Tasks are Done, assess holistic verification before the summary. Use User-confirmed needs, review difficulties, Important Findings, follow-ups, edge cases, the Plan's Notes and accumulated observations. Verify when the User asked for it, the Plan's notes name this Stage, or any Task in the Stage needed a follow-up or reported Important Findings. Otherwise you may skip it; say so in the Stage summary.

When verifying, rerun key checks, examine source/artifacts and exercise integration/edge cases at the project's established validation level. For context-intensive checks, use a subagent and verify its findings. Fix contained issues, delegate focused investigation, create a new Task for Worker-level work, or seek User direction when scope is unclear. Pause for required User judgment or action.

### 2.9 Non-APM Agent Reports

Reports from agents absent from the Workers table have no Task Log or dispatch state to update. Assess the contribution and its effect on planning/dispatch, record the agent and contribution in the Tracker's Notes, and inform the User. Assign follow-ups per `{GUIDE_PATH:task-assignment}` §2.7.

## 3. Task Review Procedure

### 3.1 Report Processing

On `apm-5-check-reports` or a delivered report:

1. Read `.apm/bus/<agent-slug>/report.md`. Handle non-APM agents per §2.9.
2. For a batch Task Report, process each executed outcome through log review and outcome determination; return `Not started` Tasks to dispatch assessment.
3. If the report's `conversation` is higher than the Worker's number in the Workers table, the Worker had a Handoff. Verify its Handoff Log and update the number. The new conversation read only current-Stage Task Logs, so list the Worker's Tasks from earlier Stages under Not Read Since Handoff per §4.2.
4. Record a reported recovery in the Notes column of the Workers table, without changing its Conversation number or reclassifying dependencies. Check the report against the Task Log for evidence recovery may have omitted and request missing details. Supply more comprehensive context when future Same-Worker dependencies need it.
5. Note Worker availability and completed items for readiness assessment. Continue to log review before merging or accepting the result.

### 3.2 Task Log Review

Read the referenced Task Log and apply §2.1. Explain the material findings, consistency with evidence, relevant Important Findings and proposed next action. Use the detail needed for the User to assess that conclusion.

### 3.3 Review Outcome

1. Assess deliverables against objectives and validation per §2.2. Commit successful uncommitted work when version control is active.
2. Investigate issues; for a Success log that contradicts its own validation, follow §2.1 instead. Proceed if resolved, construct a follow-up per `{GUIDE_PATH:task-assignment}` §3.4, or apply §3.4 below for document changes.
3. Update the Tracker per §4.1 after review/decisions. Keep unresolved work Active and mark terminal outcomes Done. Merge per §2.5 before reassessing dependencies. Update readiness, branch state and the Tracker's Notes; batch review/dispatch changes into one Tracker edit.
4. If the Stage is Done and merged, continue to §3.5. Otherwise dispatch Ready Tasks in the same turn per `{GUIDE_PATH:task-assignment}` §3.1, or state the wait condition and next report needed.

### 3.4 Planning Document Modification

1. Capture the triggering log, findings, status, Important Findings and investigation result.
2. Assess affected documents, cascade effects and authority per §2.3.
3. For significant changes, present the problem, proposed change, reasons, material options and recommendation; wait for User guidance before modifying.
4. Update documents per §4.4 and check source references, terminology and scope consistency. When changing Spec content, check and update Plan references as needed.
5. Return to §3.3 step 3 for tracking and readiness updates.

### 3.5 Stage Summary Creation

After all Tasks are Done with no outstanding follow-ups:

1. List the Stage's Task Logs. Use reviewed logs still in context; reread when changed or unavailable.
2. Assess and perform warranted verification per §2.8 before continuing.
3. Sort the Tracker's Notes per §2.7.
4. Write the Stage summary and add its row to the Memory Index per §4.3, with any lasting notes in the same Index edit.
5. Collapse the Stage's tracking per §4.1, now that verification can no longer add Tasks to it.

## 4. Structural Specifications

### 4.1 Task Tracking Format

The `## Tasks` section of the Tracker holds each Stage's Task states. Update it after each review cycle.

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

Task statuses:

- `Waiting: N.M`: dependencies are not met. It may list several.
- `Ready`: all dependencies are complete and the Task can be dispatched.
- `Active`: dispatched; the Worker is on the Task.
- `Done`: reviewed. A Branch value means the branch still awaits merging.

Write each Task's state at the end of the review and dispatch cycle. When a Task is unblocked and dispatched in the same turn, write it from Waiting straight to Active. When it is unblocked but cannot be dispatched yet, because its Worker has an Active Task or a pending report would allow a better dispatch per `{GUIDE_PATH:task-assignment}` §2.4, write Ready.

After merging a branch per §2.5, clear the Task's Branch and Worktree. When all Tasks in a Stage are Done, no branches remain and its Stage summary is written, replace the Stage's rows with `**Stage N:** Complete`. Make related Tracker changes in one edit.

### 4.2 Tracker Format

The Tracker is `.apm/tracker.md`:

```markdown
# APM Tracker

## Tasks
<Per §4.1>

## Workers

| Agent | Conversation | Not Read Since Handoff | Notes |
|-------|--------------|------------------------|-------|
| frontend-agent | 2 | 1.1, 1.3 | |
| backend-agent | 1 | | Recovered during Task 2.2 |

## Notes
<The Tracker's notes: current coordination context, per §2.7>
```

Add a Worker row when you first dispatch to it. Update its Conversation when a report shows a Handoff, and record a recovery in Notes. Not Read Since Handoff lists the Worker's Tasks from earlier Stages, whose logs its current conversation has not read; treat dependencies on them as Cross-Worker.

### 4.3 Memory Index Format

The Memory Index is `.apm/memory/index.md`:

```markdown
# APM Memory Index

## Notes
<The Index's notes: lasting observations for later Stages and conversations, per §2.7>

## Stage Summaries

| Stage | Summary | Folder |
|-------|---------|--------|
| 1 - <Stage Name> | <The Stage's outcome in one or two sentences> | `stage-01/` |
```

Each Stage's full summary is `.apm/memory/stage-<NN>/stage-<NN>.summary.md`, beside its Task Logs:

```markdown
# Stage <N> - <Stage Name>

<The outcome, the Workers involved, consequential findings, decisions and patterns, and useful commits>

## Task Logs
- `task-<NN>-<MM>.log.md`
```

### 4.4 Planning Document Changes

**Spec:** keep the existing sections and add content under the relevant heading. Keep specifications concrete design decisions that apply across Tasks; Task-specific details belong in the Task's Guidance.

**Plan:**

- Adding a Task: insert it under its Stage, keep the numbering, and give every field per `{GUIDE_PATH:work-breakdown}` §4.2.
- Changing a Task: update only the affected fields.
- Removing a Task: delete it and update every Task that lists it as a dependency.

**Rules:** change only the inside of the `APM_RULES` block in `AGENTS.md`, under `##` category headings, and add only patterns that apply to all Workers.

**Notes:** keep the Spec's and the Plan's Notes current. They describe the present situation: update the Plan's Notes when dispatch paths, blockers or the work's structure change, and the Spec's Notes when assumptions or constraints change.

Record each change to the Spec or Plan, and why, in the Tracker's Notes. The Stage summary keeps it.
