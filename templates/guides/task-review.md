# APM {VERSION} - Task Review Guide

## 1. Overview

**Reading agent:** Manager

Review Task evidence, determine outcomes, update planning documents when warranted, and maintain the Tracker. After a Stage finishes, verify it when needed and append its summary to the Index.

## 2. Operational Standards

### 2.1 Task Log Review Standards

Compare status/flags with the log body and deliverables. Success requires the objective and all validation to be complete; Partial needs guidance; Failed means the objective was not achieved. Read the whole log, including Validation and Issues, and check each statement against the status. A Success log that says a criterion was not run, failed or was replaced by a weaker check is inconsistent. Do not settle the conflict with other evidence yourself: tell the User what conflicts, send the Worker a follow-up to run the check or explain the gap, and keep the Task Active until it answers.

Interpret scoped flags with project context. `important_findings` can affect other work, reveal missing validation or record a User correction. When the log says the User approved a Rules addition, check the Worker's Rules change in the diff and keep it. When the User declined, don't add it to the Rules without asking the User. `compatibility_issues` can indicate Spec, Plan or Rules problems. If findings contradict a planning document, correct that document through §3.4 even when the Worker already handled the local issue.

### 2.2 Review Outcome Standards

Accept a supported Success with no flags. Investigate flags and non-Success outcomes before deciding. A Success log that contradicts its own validation is not yours to resolve: follow §2.1 and wait for the Worker's answer, even if other evidence looks sufficient. Check contained issues directly. For context-intensive or unclear issues, use a subagent to investigate. Give it the investigation goal, files to examine and required findings. Verify critical claims against source.

After investigation, proceed if nothing actionable remains, send a refined follow-up if retry is needed, or modify planning documents when their content is wrong. Note uncommitted changes in a non-Success follow-up. For successful work left uncommitted, commit on the Worker's branch using Rules conventions; no follow-up is needed for that alone.

When validation is incomplete or deliverables are partial, issue a follow-up before accepting the outcome. Done is terminal. If previously-Done work needs correction, create a new Task through Plan modification, referencing the original and discovery context. Keep a Task Active while investigation, follow-up or a coordination decision is pending. A terminal decision can accept Success, accept a non-Success outcome or restructure work.

Act on small contained follow-ups/corrections and inform the User. Pause for approval when changes exceed your authority per §2.3.

### 2.3 Planning Document Modification Standards

Assess cascade effects between Spec and Plan before changing either; Rules are usually independent. Distinguish implementation adjustments within design intent from invalid design assumptions. When uncertain, inspect related documents and correct the document where the problem originates.

You may clarify one Task, add a missing dependency, make an isolated Spec addition or adjust Rules narrowly. Multiple affected Tasks, design/scope changes, new Stages or major restructuring require User collaboration. Several small changes can collectively exceed your authority. When unclear, ask the User.

### 2.4 Parallel Coordination Standards

Process reports as they arrive, in any order. Complete review, merge successful completed branches, reassess readiness and dispatch newly Ready work in the same turn. Pause when no work is Ready or a change requires User collaboration. Do not wait for unrelated reports.

In a wait state, state what was processed, what remains pending and which report the User needs to bring back next. Prioritize a report that would enable a useful dispatch combination per `{GUIDE_PATH:task-assignment}` §2.4.

### 2.5 Merge Standards

After successful review, merge the completed dispatch unit's branch into base. Merge required outputs before dependent dispatch and sweep all current-Stage branches at Stage end. Switch to the recorded base branch before merging; merge and verify autonomously for clean merges.

Resolve conflicts using Task objectives, project design and Spec; for complex conflicts, use a subagent to investigate or seek User help. If branch protection blocks direct merging, adapt through a PR, intermediate branch or User guidance and record the constraint in Tracker working notes.

After a successful merge, remove its worktree with `git worktree remove .apm/worktrees/<branch-slug>` before deleting the merged branch with `git branch -d <branch-name>`. For a multi-branch sweep, batch removals first, then deletions in one terminal invocation.

### 2.6 Stage Summary Standards

Keep Stage summaries concise for future Managers and retrospectives: outcome, Workers, consequential findings, decisions and patterns, with useful commit references. Refer to Memory notes for enduring guidance and summarize Stage-specific history once. Include historically important implementation events from working notes, but leave detailed implementation in Task Logs. Finish with log references. Store durable observations in Index Memory notes per §2.7.

### 2.7 Note-Taking Standards

Use self-contained bullets. Tracker working notes hold current coordination context: pending considerations, preferences, constraints, observations and review patterns. Add useful findings and remove stale notes throughout the Stage.

At Stage end, promote observations with lasting impact on future work to Index Memory notes. Put historical Stage-specific details into summary prose. Retain working notes still needed for the next Stage. New findings from the final review can go directly to these destinations.

### 2.8 Stage Verification Standards

After all Tasks are Done, assess holistic verification before the summary. Use User-confirmed needs, review difficulties/flags/follow-ups, edge cases, compatibility concerns, Planner notes and accumulated observations. A simple Stage with clean evidence may need none.

When warranted, rerun key checks, examine source/artifacts and exercise integration/edge cases at the project's established validation level. For context-intensive checks, use a subagent and verify its findings. Fix contained issues, delegate focused investigation, create a new Task for Worker-level work, or seek User direction when scope is unclear. Pause for required User judgment or action.

### 2.9 Non-APM Agent Reports

Reports from agents absent from Worker tracking have no Task Log or dispatch state to update. Assess the contribution and its effect on planning/dispatch, record the agent and contribution in working notes, and inform the User. Assign follow-ups per `{GUIDE_PATH:task-assignment}` §2.7.

## 3. Task Review Procedure

### 3.1 Report Processing

On `apm-5-check-reports` or a delivered report:

1. Read `.apm/bus/<agent-slug>/report.md`. Handle non-APM agents per §2.9.
2. For `batch: true`, process each executed outcome through log review and outcome determination; return `Not started` Tasks to dispatch assessment.
3. If a Worker reports a new instance, verify its Handoff Log, increment Worker tracking and compare its loaded log list with all work it previously completed. Record overrides for completed Tasks whose logs were not loaded; these dependencies now need cross-agent context.
4. Record reported recovery in Worker Notes, without incrementing identity or reclassifying dependencies. Check the report against the Task Log for evidence recovery may have omitted and request missing details. Supply more comprehensive context when future same-agent dependencies need it.
5. Note Worker availability and completed items for readiness assessment. Continue to log review before merging or accepting the result.

### 3.2 Task Log Review

Read the referenced Task Log and apply §2.1. Explain the material findings, consistency with evidence, relevant flags and proposed next action. Use the detail needed for the User to assess that conclusion.

### 3.3 Review Outcome

1. Assess deliverables against objectives and validation per §2.2. Commit successful uncommitted work when needed.
2. Investigate issues; for a Success log that contradicts its own validation, follow §2.1 instead. Proceed if resolved, construct a follow-up per `{GUIDE_PATH:task-assignment}` §3.4, or apply §3.4 below for document changes.
3. Update the Tracker per §4.1 after review/decisions. Keep unresolved work Active and mark terminal outcomes Done. Merge per §2.5 before reassessing dependencies. Update readiness, branch state and working notes; batch review/dispatch changes into one Tracker edit.
4. If the Stage is Done and merged, collapse its tracking and continue to §3.5. Otherwise dispatch Ready Tasks in the same turn per `{GUIDE_PATH:task-assignment}` §3.1, or state the wait condition and next report needed.

### 3.4 Planning Document Modification

1. Capture the triggering log, findings, status/flags and investigation result.
2. Assess affected documents, cascade effects and authority per §2.3.
3. For significant changes, present the problem, proposed change, reasons, material options and recommendation; wait for User guidance before modifying.
4. Update documents per §4.5 and check source references, terminology and scope consistency. When changing Spec content, check and update Plan references as needed.
5. Update the Dependency Graph for changed Tasks/dependencies.
6. Update Spec/Plan `modified` fields per §4.4.
7. Return to §3.3 step 3 for tracking and readiness updates.

### 3.5 Stage Summary Creation

After all Tasks are Done with no outstanding follow-ups:

1. List the Stage's Task Logs. Use reviewed logs still in context; reread when changed or unavailable.
2. Assess and perform warranted verification per §2.8 before continuing.
3. Distill working notes per §2.7.
4. Append the summary per §4.3. Memory notes and the summary can be written in one Index edit.

## 4. Structural Specifications

### 4.1 Task Tracking Format

The Task Tracking section within the Tracker tracks Task statuses, agent assignments, and branch state per Stage. Update after each review cycle.

**Location:** `## Task Tracking` section of `.apm/tracker.md`.

**Format:**
```markdown
**Stage 1:** Complete

**Stage 2:**

| Task | Status | Agent | Branch |
|------|--------|-------|--------|
| 2.1 | Done | frontend-agent | |
| 2.2 | Active | backend-agent | feat/backend-models |
| 2.3 | Active | frontend-agent | feat/frontend-auth |
| 2.4 | Waiting: 2.1 | backend-agent | |
| 2.5 | Ready | frontend-agent | |
```

**Task statuses:** `Ready`, `Active`, `Done`, `Waiting: <deps>`.

**Task lifecycle:**

- `Waiting: N.M` - dependencies not met. May list multiple dependencies.
- `Ready` - all dependencies complete, can be dispatched.
- `Active | branch-name` - dispatched, Worker is on a branch.
- `Done | branch-name` - reviewed, branch pending merge.
- `Done` (no branch) - merged.

Write the end state of each Task for the review-dispatch cycle. When a Task is unblocked and dispatched in the same turn, write directly from Waiting to Active. When a Task is unblocked but cannot be dispatched - the assigned Worker has an Active Task or a pending report would unlock a better dispatch per `{GUIDE_PATH:task-assignment}` §2.4 Dispatch Standards - write Ready.

**Branch cleanup:** After merging a completed branch per §2.5 Merge Standards, clear the Branch column for that Task row.

**Stage collapse:** When all Tasks in a Stage are Done with no branches remaining, replace all Task rows with `**Stage N:** Complete`.

**Batch edits:** Task ID column guarantees edit tool uniqueness for targeting individual rows. When multiple rows or working notes change in the same review-dispatch cycle, batch all Tracker updates into a single edit.

### 4.2 Tracker Format

**Location:** `.apm/tracker.md`

**YAML Frontmatter Schema:**
```yaml
---
title: <project name>
completed_at: <datetime>  # set by Manager at project completion - absence means in-progress, ISO 8601 UTC
---
```

**Tracker sections:**

- *`## Task Tracking`:* Per-Stage Task state per §4.1 Task Tracking Format.
- *`## Worker Tracking`:* Records Worker states, instance numbers, and coordination notes. Update Worker tracking when Workers are first dispatched to, when Handoffs are detected, and when a Worker recovery is reported. Cross-agent overrides are recorded below the Worker table when Worker Handoffs reclassify dependencies, listing the specific Tasks affected and referencing the Handoff that triggered the reclassification.
- *`## Version Control`:* Per-repository base branch, branch convention, and commit convention per `{GUIDE_PATH:task-assignment}` §4.4 Tracker VC Entry Format. Branch state is tracked per-Task in the Task table's Branch column.
- *`## Working Notes`:* Ephemeral coordination context per §2.7 Note-Taking Standards. Contents are inserted and removed as context evolves.

**Worker Tracking Table:**
```markdown
| Agent | Instance | Notes |
|-------|----------|-------|
| frontend-agent | 2 | Handoff after Stage 1 |
| backend-agent | 1 | |
```

**Cross-Agent Overrides** (below Worker Tracking table, when applicable):
```markdown
**Cross-Agent Overrides:**
- frontend-agent: Tasks 1.1, 1.3 (pre-Handoff) - treat as cross-agent
```

### 4.3 Index Format

**Location:** `.apm/memory/index.md`

**YAML Frontmatter Schema:**
```yaml
---
title: <project name>
---
```

**Index sections:**

- *`## Memory Notes`:* Durable observations per §2.7 Note-Taking Standards. Patterns, preferences, and insights that persist across Handoffs.
- *`## Stage Summaries`:* Appended after each Stage completion. Each entry:
```markdown
### Stage <N> - <Stage Name>

[Prose summary: outcome, agents involved, notable findings, patterns, key commits]

**Task Logs:**
- task-<NN>-<MM>.log.md
- task-<NN>-<MM>.log.md
```

### 4.4 Modification Log Format

Update the `modified` field in YAML frontmatter when modifying the Spec or Plan:
```yaml
modified: Task 2.3 scope clarified based on task-02-02.log.md findings. Modified by the Manager.
```

### 4.5 Planning Document Modification Guidelines

**Spec:** Maintain existing section structure. Add content under relevant headings. Use `##` for top-level categories. Keep specifications concrete and actionable - design decisions that affect what is being built and apply across multiple Tasks. Task-specific details belong in Task guidance, not here.

**Plan:**

- *Adding Tasks:* Insert under the appropriate Stage, maintain numbering sequence, specify all fields (Objective, Output, Validation, Guidance, Dependencies, Steps).
- *Modifying Tasks:* Preserve existing structure, update only affected fields.
- *Removing Tasks:* Delete the Task section AND update any other Tasks that referenced it as a dependency.

**Rules:** Modifications stay within the `APM_RULES {}` block. Use `##` headings for categories. Only add genuinely universal patterns.

**Dependency Graph:** When Task dependencies change, regenerate the relevant graph section. Same-agent dependencies use `-->`, cross-agent use `-.->`. Update node styles if agents change.

---
