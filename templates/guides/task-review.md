# APM {VERSION} - Task Review Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how the Manager reviews Task results, determines review outcomes, maintains Coordination Artifacts when findings warrant it, and tracks dispatch state. It consolidates the Manager's review-side logic into a single procedure.

### 1.1 How to Use This Guide

**Execute the Procedure** in §3 Task Review Procedure when processing a Task Report from a Worker. **Use Operational Standards** in §2 when interpreting Task Memory Logs, determining review outcomes, assessing artifact modifications, detecting Handoffs, or coordinating parallel work. **Follow Structural Specifications** in §4 for Dispatch State, Memory Root, Stage Summary, and modification attribution formats.

### 1.2 Objectives

- Review Task Reports and Task Memory Logs to assess completion and determine review outcomes
- Investigate findings when needed, using self-investigation or Subagents based on scope
- Modify Coordination Artifacts when execution findings warrant it, with cascade and authority awareness
- Maintain the Dispatch State in Memory Root as the single source of task tracking
- Detect Worker Handoffs and adjust Context Dependency treatment accordingly
- Create Stage Summaries to preserve high-level progress context

### 1.3 Outputs

**Stage Summaries:** Appended to Memory Root after each Stage completion. Compress Stage execution into coordination-ready format with outcome, notes, and log references.

**Updated Dispatch State:** The Dispatch State section of Memory Root, updated after each review cycle to reflect completed tasks, readiness changes, and merge state.

**Modified Coordination Artifacts:** When findings warrant it — updated Specifications, Implementation Plan, or Standards with attributed modifications.

---

## 2. Operational Standards

### 2.1 Task Memory Log Review Standards

The goal is to extract information needed for the next review decision.

**Status interpretation.** See `WORKFLOW.md` §5.4 Task Status Values for status definitions. Assess whether the status and flags are consistent with the log's body content — inconsistency is a common hallucination indicator.

**Flag interpretation.** Workers set flags based on scoped observations. The Manager interprets with full project awareness:
- `important_findings: true` — Worker observed something potentially beyond Task scope. Assess whether it affects Coordination Artifacts or other Tasks.
- `compatibility_issues: true` — Worker observed conflicts with existing systems. Assess whether it indicates Implementation Plan, Specification, or Standards issues.

**Content review.** Beyond flags and status, review the log body sections (Summary, Details, Output, Validation, Issues) to understand what happened and inform the review outcome.

### 2.2 Review Outcome Standards

After reviewing a Task Memory Log, the Manager determines the review outcome. The decision follows a natural reasoning flow rather than a rigid checklist.

**Review the log.** If everything looks good — Success with no flags, log content supports the status — **Proceed**. If something needs attention — flags raised, non-Success status, or inconsistencies — **Investigate**.

**Investigation scope.** Small scope (few files, straightforward verification, contained to this Task) — Manager self-investigates. Large scope (context-intensive debugging/research, systemic issues, impacts multiple Tasks) — spawn Subagent for investigation. {MANAGER_SUBAGENT_GUIDANCE} Default: when scope is unclear, prefer Subagent to preserve Manager context.

**Post-investigation outcome.** Based on findings, determine the appropriate action:
- *No issues* (false positives, nothing actionable) → **Proceed** to next Task(s).
- *Follow-up needed* (Worker must retry with refined instructions) → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.6 Follow-Up Task Prompt Creation.
- *Artifact modification needed* → Proceed to §3.4 Artifact Modification.

**Artifact modification indicators.** These anchor when modification might be warranted — not a prescriptive checklist:
- **Implementation Plan:** Task definitions incorrect, missing dependencies, scope changes, new Tasks needed.
- **Specifications:** Design decisions proved incorrect, new specifications emerged, assumptions invalidated.
- **Standards:** Universal conventions need adjustment, new standards identified, existing standards conflict with execution.

### 2.3 Artifact Modification Standards

**Modification assessment.** Identify which Coordination Artifact(s) need modification based on the nature of the findings. Findings may span both design and implementation concerns — an Implementation Plan modification may reveal an underlying Specification issue. Assess all potentially affected artifacts.

**Cascade analysis.** Specifications and Implementation Plan have bidirectional influence — Specification changes may require Implementation Plan adjustments and vice versa. Standards are generally isolated. Distinguish execution adjustments within design intent (no cascade) from design assumptions that proved incorrect (cascade warranted). When uncertain whether cascade is needed, assess the related artifact rather than assuming isolation.

**Modification authority.** Manager authority (bounded): single Task clarification or correction, adding a missing dependency, isolated Specification addition, minor Standards adjustment. User collaboration required (significant): multiple Tasks affected, design direction change, scope expansion or reduction, new Stage or major restructure. Multiple small modifications that together represent significant change require User collaboration. When authority is unclear, prefer User collaboration.

### 2.4 Handoff Detection Standards

**Detection.** An Incoming Worker (post-Handoff) includes in its Task Report: a statement that it is a new instance after Handoff, a list of current-Stage Memory Logs read, and a note that previous-Stage logs were not loaded. Upon detection, verify the Handoff Memory Log exists.

**Context Dependency treatment.** From this point forward, Same-Agent Dependencies from previous Stages for this Worker must be treated as Cross-Agent Dependencies. The Incoming Worker has no working context from previous Stages.

### 2.5 Stage Summary Standards

Stage Summaries compress Stage execution for future Incoming Manager instances (after Handoff) and project retrospectives.

**Include:** Overall outcome, Agents involved, notable findings, compatibility concerns. **Reference** individual Memory Log files for Task-specific detail. **Exclude:** Implementation details, code specifics, routine operations. Keep summaries ≤30 lines.

### 2.6 Parallel Coordination Standards

When multiple Workers are active simultaneously, the Manager coordinates asynchronously.

**Async report handling.** Reports arrive in any order. Process each as it comes: complete the review, reassess readiness, dispatch newly ready Tasks if Workers are available.

**Merge coordination.** After successful Task Review during parallel dispatch, merge the completed Task's branch per `{SKILL_PATH:apm-version-control}` §3.4 Merge Coordination before dispatching dependent Tasks. At Stage end, perform a merge sweep per the VC skill.

**Wait state.** When no tasks are ready for dispatch but Workers are still active, communicate to the User what was processed, what is pending, and what to do when the next Report arrives.

**Batch report handling.** Process each completed Task's outcome individually through the review process. Unstarted Tasks from a stopped batch re-enter the dispatch pool.

---

## 3. Task Review Procedure

**Procedure:**
1. Report Processing (receive Report, clear bus, check Handoff)
2. Task Memory Log Review (read and interpret the log)
3. Review Outcome (determine outcome, update Dispatch State)
4. Artifact Modification (when review outcome identifies need)
5. Stage Summary Creation (when all Stage Tasks complete)

### 3.1 Report Processing

Execute when User runs `/apm-5-check-reports` or returns with a Task Report (or batch report) from a Worker.

Perform the following actions:
1. Read the Report from the Report Bus (`.apm/bus/<agent-slug>/apm-report.md`). Clear per `{SKILL_PATH:apm-communication}` §3.5 Clear-on-Return.
2. If batch report (`batch: true` in frontmatter), process each Task's outcome individually through §3.2 and §3.3. Unstarted Tasks re-enter the dispatch pool.
3. Check for Handoff indication per §2.4 Handoff Detection Standards. If detected, verify Handoff Memory Log exists and update Context Dependency treatment.
4. Update dispatch tracking: mark this Worker as available, note completed Task(s) for readiness assessment.
5. If parallel dispatch active: reassess tasks ready for dispatch, merge completed branch per `{SKILL_PATH:apm-version-control}` §3.4 if dependent Tasks need it, or communicate wait state per §2.6.

### 3.2 Task Memory Log Review

Execute after Report Processing.

Perform the following actions:
1. Read the Task Memory Log at the path referenced in the Task Report.
2. Interpret content per §2.1 Task Memory Log Review Standards: status, flags, body sections. Assess consistency between status/flags and body content.
3. Proceed to §3.3 Review Outcome with interpreted findings.

### 3.3 Review Outcome

Execute after Task Memory Log Review.

Perform the following actions:
1. Review findings from the Task Memory Log per §2.2 Review Outcome Standards. If everything looks good → **Proceed** (skip to step 4). If something needs attention → continue to step 2.
2. Determine investigation scope per §2.2: small scope → self-investigate, large scope → Subagent.
3. Investigate and determine outcome per §2.2:
   - *No issues* → **Proceed** to step 4.
   - *Follow-up needed* → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.6 Follow-Up Task Prompt Creation. Continue to step 4.
   - *Artifact modification needed* → Proceed to §3.4 Artifact Modification (returns to step 4 after completion).
4. Update Dispatch State in Memory Root per §4.1: mark completed Tasks as Done, reassess blocked Tasks for newly ready status, update merge state.
   - If all Stage Tasks are Done and merged → collapse Stage per §4.1 and proceed to §3.5 Stage Summary Creation.
   - Otherwise → return to the per-task assignment-execution-review cycle for next dispatch.

### 3.4 Artifact Modification

Execute when the review outcome identifies that Coordination Artifacts need modification. This is not a standalone entry point — it is always triggered from §3.3.

Perform the following actions:
1. Capture triggering context: which Memory Log revealed the findings, what specific findings indicate modification, Task Status and flags, post-investigation outcome.
2. Apply §2.3 Artifact Modification Standards: assess affected artifacts, analyze cascade implications, determine authority scope.
3. If any modification requires User collaboration → present concisely: *trigger*, *required change*, *authority exceeded rationale*, *options with trade-offs*, *recommendation*. Integrate User guidance.
4. Execute modifications following existing document patterns per §4.6 Coordination Artifact Modification. Verify consistency: reference integrity across artifacts, terminology consistency, scope alignment between Specifications and Implementation Plan.
5. When modifying Implementation Plan Tasks (adding, removing, or changing dependencies), update the Dependency Graph per §4.6.
6. Document: update Last Modification field in Specifications and/or Implementation Plan per §4.4 Modification Log Format.
7. Return to §3.3 step 4 to update Dispatch State. Reassess readiness against the updated plan and proceed accordingly.

### 3.5 Stage Summary Creation

Execute when all Tasks in a Stage are complete.

Perform the following actions:
1. Review all Task Memory Logs for the completed Stage.
2. Synthesize Stage-level observations: overall outcome, Agents involved, notable findings, patterns, compatibility concerns.
3. Append Stage Summary to Memory Root per §4.3 Stage Summary Format. Keep ≤30 lines, reference logs rather than duplicating content.

---

## 4. Structural Specifications

### 4.1 Dispatch State Format

The Dispatch State is a section within Memory Root that tracks task statuses, agent assignments, active branches, and merge state per Stage. Updated by the Manager after each review cycle.

**Location:** Within `.apm/Memory/Memory_Root.md`, after the header fields and before Working Notes / Stage Summaries.

**Format:**

    ## Dispatch State

    **Base:** <base-branch>

    **Stage 1:** Complete

    **Stage 2:**
    - 2.1 | Done | frontend-agent
    - 2.2 | Active | backend-agent | feat/backend-models
    - 2.3 | Active | frontend-agent | feat/frontend-auth
    - 2.4 | Blocked: 2.1 | backend-agent
    - 2.5 | Ready | frontend-agent

**Task statuses:** `Ready`, `Active`, `Done`, `Blocked: <deps>`.

**Task lifecycle:**
- `Blocked: N.M` — dependencies not met. May list multiple dependencies.
- `Ready` — all dependencies complete, can be dispatched.
- `Active | branch-name` — dispatched, Worker is on a branch.
- `Done | branch-name` — reviewed, branch pending merge.
- `Done` (no branch) — merged.

**Stage collapse.** When all Tasks in a Stage are Done with no branches remaining: replace all task lines with `**Stage N:** Complete`.

**One line per task.** Task ID prefix guarantees Edit tool uniqueness. Each status change is a single-line edit (~70-100 chars).

**Batch unlock.** No special notation needed. The Manager sees agent columns and dependency info and reasons about batch candidacy during Dispatch Assessment.

### 4.2 Memory Root Format

**Location:** `.apm/Memory/Memory_Root.md`

**Header Fields:**
- **Project Name:** Actual project name (replace `<Project Name>` placeholder).
- **Manager Handoffs:** Count of Manager Handoffs (increment on each Handoff).

**Dispatch State:** Section immediately after header, tracking per-Stage task state per §4.1.

**Body:** Working Notes (ephemeral coordination context maintained by Manager and User) and Stage Summaries appended after each Stage completion.

### 4.3 Stage Summary Format

Append to Memory Root after each Stage completion:

    ## Stage <N> – <Stage Name> Summary

    **Outcome:** [Stage results]

    **Notes:** [Undocumented context, findings, compatibility issues — omit if none]

    **Agents Involved:** [Workers who worked on this Stage]

    **Task Memory Logs:**
    - [Task_Log_<N>_<M>_<Slug>.md] - [Status]

Keep ≤30 lines. Reference logs rather than duplicating content.

### 4.4 Modification Log Format

Update the Last Modification field when modifying Specifications or Implementation Plan:

    **Last Modification:** [Brief description] based on [Memory Log reference]. Modified by the Manager.

**Example:** `Task 2.3 scope clarified based on Task_Log_02_02_API_Integration.md findings. Modified by the Manager.`

### 4.5 Directory Structure

```
.apm/Memory/
├── Memory_Root.md
├── Stage_01_<Slug>/
│   ├── Task_Log_01_01_<Slug>.md
│   └── Task_Log_01_02_<Slug>.md
├── Stage_02_<Slug>/
│   └── ...
└── Handoffs/
    ├── Manager_Handoffs/
    │   └── Manager_Handoff_Log_<N>.md
    └── <AgentID>_Handoffs/
        └── <AgentID>_Handoff_Log_<N>.md
```

### 4.6 Coordination Artifact Modification

**Specifications:** Maintain existing section structure. Add content under relevant headings. Use `##` for top-level categories. Keep specifications concrete and actionable — design decisions, not implementation details.

**Implementation Plan:**
- *Adding Tasks:* Insert under the appropriate Stage, maintain numbering sequence, specify all fields (Objective, Output, Validation, Guidance, Dependencies, Steps).
- *Modifying Tasks:* Preserve existing structure, update only affected fields.
- *Removing Tasks:* Delete the Task section AND update any other Tasks that referenced it as a dependency.

**Standards:** Modifications stay within the `APM_STANDARDS {}` block. Use `##` headings for categories. Only add genuinely universal patterns.

**Dependency Graph:** When Task dependencies change, regenerate the relevant graph section. Same-Agent dependencies use `-->`, Cross-Agent use `-.->`. Update node styles if agents change.

---

## 5. Content Guidelines

### 5.1 Communication Standards

- **Managerial perspective:** Focus on coordination, progress, and decisions — leave implementation details to Workers.
- **Concise updates:** Summarize log findings briefly; User can read full logs if needed.
- **Investigation outcomes:** Clearly state the outcome (no issues, follow-up, or artifact modification) with structured rationale. Acknowledge false positives when flags don't indicate real coordination issues.

### 5.2 Common Mistakes

- **Duplicating log content:** Stage Summaries should reference logs, not reproduce them.
- **Ignoring flags:** `important_findings` and `compatibility_issues` force deeper review — skipping breaks the coordination loop.
- **Fake Success:** If a Worker claims Success but log content doesn't support it, treat as investigation needed.
- **Skipping Handoff detection:** Failing to track Worker Handoff leads to incorrect Context Dependency treatment.
- **Premature self-investigation on large scope:** Prefer Subagent investigation for context-intensive issues to preserve Manager context.
- **Forgetting Dispatch State updates:** Dispatch State must be updated after every review cycle to maintain accurate readiness tracking.
- **Symptom treatment:** Modifying one artifact to work around an issue that should be addressed in another.
- **Orphaned references:** Removing items without updating references from other artifacts.
- **Missing cascade:** Updating Specifications or Implementation Plan without assessing impact on the other.
- **Unauthorized modifications:** Making significant changes without User collaboration.

---

**End of Guide**
