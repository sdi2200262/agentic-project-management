# APM {VERSION} - Task Review Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how the Manager reviews Task results, determines review outcomes, modifies planning documents when findings warrant it, and maintains the task tracking section in Memory Root.

### 1.1 How to Use This Guide

See §3 Task Review Procedure when processing a Task Report from a Worker. See §2 Operational Standards when interpreting Task Memory Logs, determining review outcomes, assessing planning document modifications, or coordinating parallel work. See §4 Structural Specifications for task tracking, Memory Root, stage summary, and modification attribution formats.

### 1.2 Objectives

- Review Task Reports and Task Memory Logs to assess completion and determine review outcomes
- Investigate findings when needed, using self-investigation or subagents based on scope
- Modify planning documents when execution findings warrant it, with cascade and authority awareness
- Maintain the task tracking section in Memory Root as the single source of task state
- Detect Worker Handoffs and adjust dependency context treatment accordingly
- Create stage summaries to preserve high-level progress context

### 1.3 Outputs

**Stage summaries:** Appended to Memory Root after each Stage completion. Compress Stage execution into coordination-ready format with outcome, notes, and log references.

**Updated task tracking section:** The task tracking section of Memory Root, updated after each review cycle to reflect completed Tasks, readiness changes, and merge state.

**Modified planning documents:** When findings warrant it - updated Specifications, Implementation Plan, or Execution Standards with attributed modifications.

---

## 2. Operational Standards

### 2.1 Task Memory Log Review Standards

The goal is to extract information needed for the next review decision.

**Status interpretation.** Assess whether the status and flags are consistent with the log's body content - inconsistency is a common hallucination indicator. Status values: Success (objective achieved, all validation passed), Partial (some succeeded, some failed), Failed (most or all failed), Blocked (serious blockers outside Worker scope).

**Flag interpretation.** Workers set flags based on scoped observations. The Manager interprets with full project awareness:

- `important_findings: true` - Worker observed something potentially beyond Task scope. Assess whether it affects planning documents or other Tasks. When findings indicate that validation criteria from the Task Prompt were not fully exercised, this warrants investigation before marking Done.
- `compatibility_issues: true` - Worker observed conflicts with existing systems. Assess whether it indicates Implementation Plan, Specification, or Execution Standards issues.

**Content review.** Beyond flags and status, review the log body sections (Summary, Details, Output, Validation, Issues) to understand what happened and inform the review outcome.

### 2.2 Review Outcome Standards

After reviewing a Task Memory Log, the Manager determines the review outcome.

**Review the log.** If everything looks good - Success with no flags, log content supports the status - **Proceed**. If something needs attention - flags raised, non-Success status, or inconsistencies - **Investigate**.

**Investigation scope.** Small scope (few files, straightforward verification, contained to this Task) - Manager self-investigates. Large scope (context-intensive debugging/research, systemic issues, impacts multiple Tasks) - spawn subagent. {MANAGER_SUBAGENT_GUIDANCE} Default: when scope is unclear, prefer subagent to preserve Manager context.

**Post-investigation outcome:**

- *No issues* (false positives, nothing actionable) → **Proceed** to next Task(s).
- *Follow-up needed* (Worker must retry with refined instructions) → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.4 Follow-Up Task Prompt Construction.
- *Planning document modification needed* → Proceed to §3.4 Planning Document Modification.

Within-authority actions (follow-ups for small contained issues, minor planning document corrections) are executed immediately during the review cycle. Present findings to the User for awareness after acting. Only changes exceeding Manager authority per §2.3 pause for User approval.

### 2.3 Planning Document Modification Standards

**Cascade reasoning.** Specifications and Implementation Plan have bidirectional influence - changes to one may require adjustments in the other. Execution Standards are generally isolated. When modifying any document, assess cascade implications before executing. Distinguish execution adjustments within design intent (no cascade) from design assumptions that proved incorrect (cascade warranted). When uncertain, assess the related document rather than assuming isolation.

**Modification authority.** Small contained changes are Manager authority: single Task clarification or correction, adding a missing dependency, isolated Specification addition, minor Execution Standards adjustment. Significant changes require User collaboration: multiple Tasks affected, design direction change, scope expansion or reduction, new Stage or major restructure. Multiple small modifications that together represent significant change require User collaboration. When authority is unclear, prefer User collaboration.

### 2.4 Parallel Coordination Standards

When multiple Workers are active simultaneously, the Manager coordinates asynchronously.

**Immediate reassessment.** After processing each report, reassess readiness and continue to dispatch assessment in the same turn - review and next dispatch happen in a single response without waiting for User input. The only reasons to pause are when no Tasks are ready (wait state) or when a modification requires User collaboration per §2.3.

**Async report handling.** Reports arrive in any order. Process each as it comes: complete the review, merge if needed, reassess readiness, dispatch newly ready Tasks. Each report-to-dispatch cycle is continuous.

**Merge coordination.** After successful review during parallel dispatch, merge the completed Task's branch per `{SKILL_PATH:apm-version-control}` §3.4 Merge Coordination before dispatching dependent Tasks. At Stage end, perform a merge sweep per the VC skill.

**Wait state.** When no Tasks are ready but Workers are active, communicate what was processed, what is pending, and which report(s) the User should return next. Apply intelligent waiting per `{GUIDE_PATH:task-assignment}` §2.4 Dispatch Standards - if a pending report would unlock a better dispatch combination, recommend the User prioritize that report.

### 2.5 Stage Summary Standards

Stage summaries compress Stage execution for future incoming Manager instances (after Handoff) and project retrospectives. **Include:** overall outcome, agents involved, notable findings, compatibility concerns. **Reference** individual Task Memory Log files for Task-specific detail. **Exclude:** implementation details, code specifics, routine operations. Keep summaries ≤30 lines.

---

## 3. Task Review Procedure

**Procedure:**

1. Report Processing (receive report, clear bus, check Handoff)
2. Task Memory Log Review (read and interpret the log)
3. Review Outcome (determine outcome, update task tracking)
4. Planning Document Modification (when review outcome identifies need)
5. Stage Summary Creation (when all Stage Tasks complete)

### 3.1 Report Processing

Execute when User runs `/apm-5-check-reports` or returns with a Task Report (or batch report) from a Worker.

Perform the following actions:

1. Read the report from the Report Bus (`.apm/bus/<agent-slug>/apm-report.md`).
2. If batch report (`batch: true` in frontmatter), process each Task's outcome individually through §3.2 and §3.3. Unstarted Tasks re-enter the dispatch pool.
3. Check for Handoff indication - an incoming Worker (post-Handoff) includes a statement that it is a new instance, a list of current-Stage Task Memory Logs read, and a note that previous-Stage logs were not loaded. If detected, verify the Handoff Memory Log exists. Update agent tracking in the Project Tracker: increment the session number for this Worker. Compare the loaded Task Memory Logs against all Tasks previously completed by this Worker and record cross-agent overrides in the Project Tracker for any completed Tasks whose logs were not loaded. From this point forward, previous-Stage same-agent dependencies for this Worker are treated as cross-agent.
4. Update dispatch tracking: mark this Worker as available, note completed Task(s) for readiness assessment.
5. Merge completed branch per `{SKILL_PATH:apm-version-control}` §3.4 Merge Coordination if dependent Tasks need it.

### 3.2 Task Memory Log Review

Execute after report processing.

Perform the following actions:

1. Read the Task Memory Log at the path referenced in the Task Report.
2. Interpret content per §2.1 Task Memory Log Review Standards: status, flags, body sections. Assess consistency between status/flags and body content.
3. Proceed to §3.3 Review Outcome with interpreted findings.

### 3.3 Review Outcome

Execute after Task Memory Log review.

Perform the following actions:

1. Review findings from the Task Memory Log per §2.2 Review Outcome Standards. If everything looks good → **Proceed** (skip to step 4). If something needs attention → continue to step 2.
2. Determine investigation scope per §2.2: small scope → self-investigate, large scope → subagent.
3. Investigate and determine outcome per §2.2:
   - *No issues* → **Proceed** to step 4.
   - *Follow-up needed* → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.4 Follow-Up Task Prompt Construction. Continue to step 4.
   - *Planning document modification needed* → Proceed to §3.4 Planning Document Modification (returns to step 4 after completion).
4. Update task tracking and agent tracking (when applicable) in Memory Root per §4.1 and §4.2: mark completed Tasks as Done, reassess waiting Tasks for newly ready status, update merge state. Execute pending merges per `{SKILL_PATH:apm-version-control}` §3.4 before reassessing readiness.
5. Assess next action per §2.4 Parallel Coordination Standards:
   - If all Stage Tasks are Done and merged → collapse Stage per §4.1 and proceed to §3.5 Stage Summary Creation.
   - If Tasks are ready → continue to `{GUIDE_PATH:task-assignment}` §3.1 Dispatch Assessment in the same turn.
   - If no Tasks are ready but Workers are active → communicate wait state per §2.4 and direct User to return the next report.

### 3.4 Planning Document Modification

Execute when the review outcome identifies that planning documents need modification. Always triggered from §3.3.

Perform the following actions:

1. Capture triggering context: which Task Memory Log revealed the findings, what specific findings indicate modification, Task status and flags, post-investigation outcome.
2. Apply §2.3 Planning Document Modification Standards: assess affected documents, analyze cascade implications, determine authority scope.
3. If any modification requires User collaboration → present concisely: trigger, required change, authority exceeded rationale, options with trade-offs, recommendation. Integrate User guidance.
4. Execute modifications following existing document patterns per §4.5 Planning Document Modification Guidelines. Verify consistency: reference integrity across documents (same data descriptions match), terminology consistency, scope alignment between Specifications and Implementation Plan. When correcting Specifications, check whether the Implementation Plan references the same content and update accordingly.
5. When modifying Implementation Plan Tasks (adding, removing, or changing dependencies), update the Dependency Graph per §4.5.
6. Document: update Last Modification field in Specifications and/or Implementation Plan per §4.4 Modification Log Format.
7. Return to §3.3 step 4 to update task tracking. Reassess readiness against the updated plan and proceed accordingly.

### 3.5 Stage Summary Creation

Execute when all Tasks in a Stage are complete. A Task is complete when its final review outcome is Proceed with no outstanding follow-ups. Write the Stage Summary once, after all follow-up cycles finish.

Perform the following actions:

1. Review all Task Memory Logs for the completed Stage.
2. Synthesize Stage-level observations: overall outcome, agents involved, notable findings, patterns, compatibility concerns.
3. Append stage summary to Memory Root per §4.3 Stage Summary Format. Keep ≤30 lines, reference logs rather than duplicating content.

---

## 4. Structural Specifications

### 4.1 Task Tracking Format

The task tracking section within Memory Root tracks task statuses, agent assignments, active branches, and merge state per Stage. Updated by the Manager after each review cycle.

**Location:** Within the `## Project Tracker` section of `.apm/Memory/Memory_Root.md`.

**Format:**

```markdown
### Task Tracking

**Base:** <base-branch>

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

**Stage collapse.** When all Tasks in a Stage are Done with no branches remaining: replace all task rows with `**Stage N:** Complete`.

**One table row per task.** Task ID column guarantees edit tool uniqueness. Each status change is a single-row edit.

### 4.2 Memory Root Format

**Location:** `.apm/Memory/Memory_Root.md`

**Title:** `# <Project Name> - APM Memory Root`. Replace `<Project Name>` with actual project name.

**`## Project Tracker`** contains three subsections:

- **`### Task Tracking`** - per-Stage task state per §4.1 Task Tracking Format.
- **`### Agent Tracking`** - records agent states and session numbers. Agents start as uninitialized and transition to Session N when initialized. The Manager updates agent tracking when agents are first dispatched to, and when Handoffs are detected. Cross-agent overrides are recorded below the agent table when Worker Handoffs reclassify dependencies, listing the specific Tasks affected and referencing the Handoff that triggered the reclassification.
- **`### Version Control`** - per `{SKILL_PATH:apm-version-control}` §4.3 Project Tracker VC Entry Format.

**`## Working Notes`** - ephemeral coordination context maintained by Manager and User. Contents are inserted and removed as context evolves.

**`## Stage Summaries`** - appended after each Stage completion per §4.3 Stage Summary Format.

### 4.3 Stage Summary Format

Append to Memory Root after each Stage completion:

```markdown
## Stage <N> - <Stage Name> Summary

**Outcome:** [Stage results]

**Notes:** [Undocumented context, findings, compatibility issues - omit if none]

**Agents Involved:** [Workers who worked on this Stage]

**Task Memory Logs:**
- [Task_Log_<N>_<M>_<Slug>.md] - [Status]
```

Keep ≤30 lines. Reference logs rather than duplicating content.

### 4.4 Modification Log Format

Update the Last Modification field when modifying Specifications or Implementation Plan:

```markdown
**Last Modification:** [Brief description] based on [Memory Log reference]. Modified by the Manager.
```

**Example:** `Task 2.3 scope clarified based on Task_Log_02_02_API_Integration.md findings. Modified by the Manager.`

### 4.5 Planning Document Modification Guidelines

**Specifications:** Maintain existing section structure. Add content under relevant headings. Use `##` for top-level categories. Keep specifications concrete and actionable - design decisions that affect what is being built and apply across multiple Tasks. Task-specific details belong in Task guidance, not here.

**Implementation Plan:**

- *Adding Tasks:* Insert under the appropriate Stage, maintain numbering sequence, specify all fields (Objective, Output, Validation, Guidance, Dependencies, Steps).
- *Modifying Tasks:* Preserve existing structure, update only affected fields.
- *Removing Tasks:* Delete the Task section AND update any other Tasks that referenced it as a dependency.

**Execution Standards:** Modifications stay within the `APM_STANDARDS {}` block. Use `##` headings for categories. Only add genuinely universal patterns.

**Dependency Graph:** When Task dependencies change, regenerate the relevant graph section. Same-agent dependencies use `-->`, cross-agent use `-.->`. Update node styles if agents change.

---

## 5. Content Guidelines

### 5.1 Communication Standards

- **Managerial perspective:** Focus on coordination, progress, and decisions - leave implementation details to Workers.
- **Concise updates:** Summarize log findings briefly; User can read full logs if needed.
- **Investigation outcomes:** Clearly state the outcome (no issues, follow-up, or planning document modification) with structured rationale. Acknowledge false positives when flags don't indicate real coordination issues.

### 5.2 Common Mistakes

- **Duplicating log content:** Stage summaries should reference logs, not reproduce them.
- **Ignoring flags:** `important_findings` and `compatibility_issues` force deeper review - skipping breaks the coordination loop.
- **Fake Success:** If a Worker claims Success but log content doesn't support it, treat as investigation needed.
- **Skipping Handoff detection:** Failing to track Worker Handoff leads to incorrect dependency context treatment.
- **Premature self-investigation on large scope:** Prefer subagent investigation for context-intensive issues to preserve Manager context.
- **Forgetting task tracking updates:** Task tracking must be updated after every review cycle to maintain accurate readiness tracking.
- **Symptom treatment:** Modifying one document to work around an issue that should be addressed in another.
- **Orphaned references:** Removing items without updating references from other documents.
- **Missing cascade:** Updating Specifications or Implementation Plan without assessing impact on the other.
- **Unauthorized modifications:** Making significant changes without User collaboration.

---

**End of Guide**
