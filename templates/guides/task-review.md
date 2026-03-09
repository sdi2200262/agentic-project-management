# APM {VERSION} - Task Review Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how the Manager reviews Task results, determines review outcomes, modifies planning documents when findings warrant it, and maintains the Tracker.

### 1.1 How to Use This Guide

See §3 Task Review Procedure when processing a Task Report from a Worker. See §2 Operational Standards when interpreting Task Logs, determining review outcomes, assessing planning document modifications, coordinating parallel work, or managing notes. See §4 Structural Specifications for task tracking, Tracker, Index, stage summary, and modification attribution formats. Communication with the User and visible reasoning follow `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication.

### 1.2 Objectives

- Review Task Reports and Task Logs to assess completion and determine review outcomes.
- Investigate findings when needed, using self-investigation or subagents based on scope.
- Modify planning documents when execution findings warrant it, with cascade and authority awareness.
- Maintain the Tracker as the single source of Task state.
- Detect Worker Handoffs and adjust dependency context treatment accordingly.
- Create stage summaries to preserve high-level progress context.
- Maintain Working Notes and Memory Notes for coordination and historical continuity.

### 1.3 Outputs

**Stage summaries:** Appended to the Index after each Stage completion. Compress Stage execution into coordination-ready format with outcome, notes, and log references.

**Updated Tracker:** The Tracker, updated after each review cycle to reflect completed Tasks, readiness changes, merge state, and coordination context.

**Modified planning documents:** When findings warrant it - updated Spec, Plan, or Rules with attributed modifications.

---

## 2. Operational Standards

### 2.1 Task Log Review Standards

The goal is to extract information needed for the next review decision.

**Status interpretation:** Assess whether the status and flags are consistent with the log's body content - inconsistency is a common hallucination indicator. Status values per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards: Success (objective achieved, all validation passed), Partial (progress made, needs guidance), Failed (attempted, could not succeed), Blocked (external factors prevent progress).

**Flag interpretation** → Workers set flags based on scoped observations. The Manager interprets with full project awareness:
- `important_findings: true` - Worker observed something potentially beyond Task scope. Assess whether it affects planning documents or other Tasks. When findings indicate that validation criteria from the Task Prompt were not fully exercised, this warrants investigation before marking Done.
- `compatibility_issues: true` - Worker observed conflicts with existing systems. Assess whether it indicates Plan, Spec, or Rules issues.

**Content review:** Beyond flags and status, review the log body sections (Summary, Details, Output, Validation, Issues) to understand what happened and inform the review outcome. When findings contradict content in the Spec, Plan, or Rules - factual inaccuracies, incorrect assumptions, outdated descriptions - treat the affected document as needing correction per §3.4 regardless of whether the Worker handled the discrepancy.

### 2.2 Review Outcome Standards

After reviewing a Task Log, the Manager determines the review outcome.

**Review the log:** If everything looks good - Success status with no flags, log content supports the status - proceed to task tracking updates. If something needs attention - flags raised, non-Success status, or inconsistencies - investigate before proceeding.

**Investigation scope:** Small scope (few files, straightforward verification, contained to this Task) - Manager self-investigates. Large scope (context-intensive debugging/research, systemic issues, impacts multiple Tasks) - spawn subagent. {MANAGER_SUBAGENT_GUIDANCE} **Default:** When scope is unclear, prefer subagent to preserve Manager context.

**Post-investigation outcome:**
- *No issues:* (false positives, nothing actionable) → Continue to next Task(s).
- *Follow-up needed:* (Worker must retry with refined instructions) → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.4 Follow-Up Task Prompt Construction.
- *Planning document modification needed:* → Proceed to §3.4 Planning Document Modification.
- *Previously-Done work deficient:* (investigation of a later Task reveals issues with already-Done work) → Create a new Task through plan modification per §2.3. The original Task remains Done; the new Task references it, includes the discovery context, and specifies what needs correction.

Within-authority actions (follow-ups for small contained issues, minor planning document corrections) are executed immediately during the review cycle. Present findings to the User for awareness after acting. Only changes exceeding Manager authority per §2.3 pause for User approval.

### 2.3 Planning Document Modification Standards

**Cascade reasoning:** Spec and Plan have bidirectional influence - changes to one may require adjustments in the other. Rules are generally isolated. When modifying any document, assess cascade implications before executing. Distinguish execution adjustments within design intent (no cascade) from design assumptions that proved incorrect (cascade warranted). When uncertain, assess the related document rather than assuming isolation.

**Modification authority:** Small contained changes are Manager authority: single Task clarification or correction, adding a missing dependency, isolated Spec addition, minor Rules adjustment. Significant changes require User collaboration: multiple Tasks affected, design direction change, scope expansion or reduction, new Stage or major restructure. Multiple small modifications that together represent significant change require User collaboration. When authority is unclear, prefer User collaboration.

### 2.4 Parallel Coordination Standards

When multiple Workers are active simultaneously, the Manager coordinates asynchronously.

**Immediate reassessment:** After processing each report, reassess readiness and continue to dispatch assessment in the same turn - review and next dispatch happen in a single response without waiting for User input. The only reasons to pause are when no Tasks are Ready (wait state) or when a modification requires User collaboration per §2.2.

**Async report handling:** Reports arrive in any order. Process each as it comes: complete the review, merge if needed, reassess readiness, dispatch newly Ready Tasks. Each report-to-dispatch cycle is continuous.

**Merge coordination:** After successful review during parallel dispatch, merge the completed Task's branch per `{SKILL_PATH:apm-version-control}` §3.4 Merge Coordination before dispatching dependent Tasks. At Stage end, perform a merge sweep per the VC skill.

**Wait state:** When no Tasks are Ready but Workers are active, communicate what was processed, what is pending, and which report(s) the User should return next. Apply intelligent waiting per `{GUIDE_PATH:task-assignment}` §2.4 Dispatch Standards - if a pending report would unlock a better dispatch combination, recommend the User prioritize that report.

### 2.5 Stage Summary Standards

Stage summaries compress Stage execution for future incoming Manager instances (after Handoff) and project retrospectives. Write as descriptive prose covering outcome, agents involved, notable findings, and patterns - point to commits and key decisions. Follow with a Task Log reference list. Exclude implementation details, code specifics, and routine operations. Do not duplicate Working Notes or Memory Notes as a separate section. Keep summaries ≤30 lines.

### 2.6 Note-Taking Standards

Notes capture context that falls outside structured tracking but aids coordination and continuity. Two categories serve different purposes:

**Working Notes (Tracker):** Coordination context accumulated during the Stage. Working Notes serve two purposes: ephemeral context for upcoming decisions (pending considerations, User preferences, temporary constraints) and durable observations awaiting distillation (patterns, preferences, architectural insights). Insert when a review yields note-worthy context. Remove ephemeral items when no longer applicable. At Stage summary time, distill durable observations into Memory Notes in the Index per §3.5. Use a bulleted list - one item per note, each self-contained.

**Memory Notes (Index):** Durable observations that persist across Handoffs and inform future agents. Memory Notes are written during Stage summary creation - the Manager distills accumulated Working Notes into Memory Notes, retaining only observations with lasting value. Use a bulleted list - one item per note, each self-contained and understandable without surrounding context.

---

## 3. Task Review Procedure

**Procedure:**
1. Report Processing (receive report, clear bus, check Handoff).
2. Task Log Review (read and interpret the log).
3. Review Outcome (determine outcome, update tracking).
4. Planning Document Modification (when review outcome identifies need).
5. Stage Summary Creation (when all Stage Tasks complete).

### 3.1 Report Processing

Execute when User runs `/apm-5-check-reports` or returns with a Task Report (or batch report) from a Worker.

Perform the following actions:
1. Read the report from the Report Bus (`.apm/bus/<agent-slug>/report.md`).
2. If batch report (`batch: true` in frontmatter), process each Task's outcome individually through §3.2 and §3.3. Unstarted Tasks re-enter the dispatch pool.
3. Check for Handoff indication - an incoming Worker (post-Handoff) includes a statement that it is a new instance, a list of current-Stage Task Logs read, and a note that previous-Stage logs were not loaded. If detected, verify the Handoff Log exists. Update agent tracking in the Tracker: increment the session number for this Worker. Compare the loaded Task Logs against all Tasks previously completed by this Worker and record cross-agent overrides in the Tracker for any completed Tasks whose logs were not loaded. From this point forward, previous-Stage same-agent dependencies for this Worker are treated as cross-agent.
4. Update dispatch tracking: mark this Worker as available, note completed Task(s) for readiness assessment.
5. Merge completed branch per `{SKILL_PATH:apm-version-control}` §3.4 Merge Coordination if dependent Tasks need it.

### 3.2 Task Log Review

Execute after report processing. Present your assessment of the Task Log visibly in chat: whether the claimed status is consistent with evidence, whether flags indicate coordination-relevant findings, and what the appropriate next action is.

Perform the following actions:
1. Read the Task Log at the path referenced in the Task Report.
2. Interpret content per §2.1 Task Log Review Standards: status, flags, body sections. Assess consistency between status/flags and body content.
3. Continue to the review outcome.

### 3.3 Review Outcome

Execute after Task Log review.

Perform the following actions:
1. Review findings from the Task Log per §2.2 Review Outcome Standards. Assess deliverables against the Task's objectives and validation criteria before determining the outcome. If everything looks good → skip to step 4. If something needs attention → continue to step 2.
2. Determine investigation scope per §2.2: small scope → self-investigate, large scope → subagent.
3. Investigate and determine outcome per §2.2:
   - *No issues:* → Continue to step 4.
   - *Follow-up needed:* → Create follow-up Task Prompt per `{GUIDE_PATH:task-assignment}` §3.4 Follow-Up Task Prompt Construction. Continue to step 4.
   - *Planning document modification needed:* → Proceed to §3.4 Planning Document Modification (returns to step 4 after completion).
4. Update the Tracker: mark completed Tasks as Done, reassess Waiting Tasks for readiness, update branches. Execute pending merges per `{SKILL_PATH:apm-version-control}` §3.4 before reassessing readiness. Assess whether the review yielded note-worthy context and add to Working Notes - both ephemeral coordination items and durable observations for later distillation. Remove stale Working Notes. Batch all changes from this review cycle into a single Tracker edit per §4.1.
5. Assess next action per §2.4 Parallel Coordination Standards:
   - If all Stage Tasks are Done and merged → Collapse Stage per §4.1 and proceed to §3.5 Stage Summary Creation.
   - If Tasks are Ready → Proceed to `{GUIDE_PATH:task-assignment}` §3.1 Dispatch Assessment in the same turn.
   - If no Tasks are Ready but Workers are active → Communicate wait state per §2.4 Parallel Coordination Standards and direct User to return the next report.

### 3.4 Planning Document Modification

Execute when the review outcome identifies that planning documents need modification. Always triggered from §3.3.

Perform the following actions:
1. Capture triggering context: which Task Log revealed the findings, what specific findings indicate modification, Task status and flags, post-investigation outcome.
2. Apply §2.3 Planning Document Modification Standards: assess affected documents, analyze cascade implications, determine authority scope.
3. If any modification requires User collaboration → Present concisely: trigger, required change, authority exceeded rationale, options with trade-offs, recommendation. Integrate User guidance.
4. Execute modifications following existing document patterns per §4.6 Planning Document Modification Guidelines. Verify consistency: reference integrity across documents (same data descriptions match), terminology consistency, scope alignment between the Spec and Plan. When correcting the Spec, check whether the Plan references the same content and update accordingly.
5. When modifying Plan Tasks (adding, removing, or changing dependencies), update the Dependency Graph per §4.6.
6. Document: update `modified` field in Spec and/or Plan YAML frontmatter per §4.5 Modification Log Format.
7. Proceed to §3.3 Review Outcome step 4 to update tracking. Reassess readiness against the updated plan and proceed accordingly.

### 3.5 Stage Summary Creation

Execute when all Tasks in a Stage are complete. A Task is complete when the review concludes with no outstanding follow-ups. Write the Stage Summary once, after all follow-up cycles finish.

Perform the following actions:
1. Review all Task Logs for the completed Stage.
2. Distill durable observations from Working Notes into Memory Notes in the Index. Remove distilled items from Working Notes in the Tracker.
3. Synthesize Stage-level observations: outcome, agents involved, notable findings, patterns.
4. Append stage summary to the Index per §4.4 Stage Summary Format. Reference Task Logs rather than duplicating content.

---

## 4. Structural Specifications

### 4.1 Task Tracking Format

The Task Tracking section within the Tracker tracks Task statuses, agent assignments, and branch state per Stage. Updated by the Manager after each review cycle.

**Location:** `## Task Tracking` section of `.apm/tracker.md`.

**Format:**
```markdown
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

The Manager writes the end state of each task for the review-dispatch cycle. When a Task is unblocked and dispatched in the same turn, write directly from Waiting to Active. When a Task is unblocked but cannot be dispatched - the assigned Worker has an Active Task or intelligent waiting applies per `{GUIDE_PATH:task-assignment}` §2.4 - write Ready.

**Stage collapse:** When all Tasks in a Stage are Done with no branches remaining: replace all task rows with `**Stage N:** Complete`.

**Batch edits:** Task ID column guarantees edit tool uniqueness for targeting individual rows. When multiple rows or Working Notes change in the same review-dispatch cycle, batch all Tracker updates into a single edit.

### 4.2 Tracker Format

**Location:** `.apm/tracker.md`

**Title:** `# APM Tracker`. YAML `title` field contains the project name.

The Tracker contains four sections:
- *`## Task Tracking`:* Per-Stage Task state per §4.1 Task Tracking Format.
- *`## Agent Tracking`:* Records agent states, session numbers, and coordination notes. The Manager updates agent tracking when agents are first dispatched to and when Handoffs are detected. Cross-agent overrides are recorded below the agent table when Worker Handoffs reclassify dependencies, listing the specific Tasks affected and referencing the Handoff that triggered the reclassification.
- *`## Version Control`:* Base branch and naming convention per `{SKILL_PATH:apm-version-control}` §4.3 Tracker VC Entry Format. Static after initialization - branch state is tracked in the task table's Branch column.
- *`## Working Notes`:* Ephemeral coordination context per §2.6 Note-Taking Standards. Contents are inserted and removed as context evolves.

**Agent Tracking Table:**
```markdown
| Agent | Session | Notes |
|-------|---------|-------|
| frontend-agent | 2 | Handoff after Stage 1 |
| backend-agent | 1 | |
```

**Cross-Agent Overrides** (below Agent Tracking table, when applicable):
```markdown
**Cross-Agent Overrides:**
- frontend-agent: Tasks 1.1, 1.3 (pre-Handoff) - treat as cross-agent
```

### 4.3 Index Format

**Location:** `.apm/memory/index.md`

**Title:** `# APM Memory Index`. YAML `title` field contains the project name.

The Index contains two sections:
- *`## Memory Notes`:* Durable observations per §2.6 Note-Taking Standards. Patterns, preferences, and insights that persist across Handoffs.
- *`## Stage Summaries`:* Appended after each Stage completion per §4.4 Stage Summary Format.

### 4.4 Stage Summary Format

Append to the Index `## Stage Summaries` section after each Stage completion:
```markdown
### Stage <N> - <Stage Name>

[Prose summary: outcome, agents involved, notable findings, patterns, key commits. ≤20 lines.]

**Task Logs:**
- task-<NN>-<MM>.log.md
- task-<NN>-<MM>.log.md
```

### 4.5 Modification Log Format

Update the `modified` field in YAML frontmatter when modifying the Spec or Plan:
```yaml
modified: Task 2.3 scope clarified based on task-02-02.log.md findings. Modified by the Manager.
```

### 4.6 Planning Document Modification Guidelines

**Spec:** Maintain existing section structure. Add content under relevant headings. Use `##` for top-level categories. Keep specifications concrete and actionable - design decisions that affect what is being built and apply across multiple Tasks. Task-specific details belong in Task guidance, not here.

**Plan:**
- *Adding Tasks:* Insert under the appropriate Stage, maintain numbering sequence, specify all fields (Objective, Output, Validation, Guidance, Dependencies, Steps).
- *Modifying Tasks:* Preserve existing structure, update only affected fields.
- *Removing Tasks:* Delete the Task section AND update any other Tasks that referenced it as a dependency.

**Rules:** Modifications stay within the `APM_STANDARDS {}` block. Use `##` headings for categories. Only add genuinely universal patterns.

**Dependency Graph:** When Task dependencies change, regenerate the relevant graph section. Same-agent dependencies use `-->`, cross-agent use `-.->`. Update node styles if agents change.

---

## 5. Content Guidelines

### 5.1 Communication Standards

- *Managerial perspective:* Focus on coordination, progress, and decisions - leave implementation details to Workers.
- *Concise updates:* Summarize log findings briefly; User can read full logs if needed.
- *Investigation outcomes:* Clearly state the outcome (no issues, follow-up, or planning document modification) with structured rationale. Acknowledge false positives when flags do not indicate real coordination issues.

### 5.2 Common Mistakes

- *Duplicating log content:* Stage summaries should reference logs, not reproduce them.
- *Ignoring flags:* `important_findings` and `compatibility_issues` force deeper review - skipping breaks the coordination loop.
- *Fake Success:* If a Worker claims Success but log content doesn't support it, treat as investigation needed.
- *Skipping Handoff detection:* Failing to track Worker Handoff leads to incorrect dependency context treatment.
- *Premature self-investigation on large scope:* Prefer subagent investigation for context-intensive issues to preserve Manager context.
- *Forgetting Tracker updates:* The Tracker must be updated after every review cycle to maintain accurate readiness tracking.
- *Symptom treatment:* Modifying one document to work around an issue that should be addressed in another.
- *Orphaned references:* Removing items without updating references from other documents.
- *Missing cascade:* Updating the Spec or Plan without assessing impact on the other.
- *Unauthorized modifications:* Making significant changes without User collaboration.

---

**End of Guide**
