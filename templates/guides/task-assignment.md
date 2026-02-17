# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how the Manager constructs Task Prompts for Workers. Task Prompts are self-contained prompts that provide Workers with everything needed to execute a Task without access to Coordination Artifacts.

### 1.1 How to Use This Guide

**Execute the Procedure** in §3 Task Assignment Procedure to construct and deliver Task Prompts. **Use Operational Standards** in §2 when analyzing Context Dependencies, extracting specification content, assessing dispatch opportunities, or handling follow-up assignments. **Follow Structural Specifications** in §4 for Task Prompt format guidance.

### 1.2 Objectives

- Construct self-contained Task Prompts that enable Worker execution without access to Coordination Artifacts
- Analyze Context Dependencies and provide appropriate context based on producer-consumer relationships
- Account for Worker Handoff state when classifying Context Dependencies
- Extract and include relevant specification content for task execution
- Assess dispatch opportunities (batch, parallel) and coordinate workspace isolation via the VC skill

### 1.3 Outputs

**Task Prompt:** Content written to Task Bus for Worker to receive. Contains all context a Worker needs to execute a Task.

**Follow-up Task Prompt:** A new Task Prompt with different content than the previous failed attempt, issued when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines follow-up is needed. Content is refined based on what went wrong, guided by a follow-up context section.

---

## 2. Operational Standards

### 2.1 Context Dependency Standards

Tasks may depend on outputs from previous Tasks. The dependency type determines how much context the Manager includes in the Task Prompt.

**Same-Agent Dependency.** The current Worker previously completed the producer Task and has working familiarity. Provide light context — recall anchors, key file paths, brief reference to previous work. Detail increases with dependency complexity.

**Cross-Agent Dependency.** A different Worker completed the producer Task. The current Worker has zero familiarity. Provide comprehensive context — explicit file reading instructions, output summaries, integration guidance. Assume nothing.

**Handoff Dependency.** When the target Worker has performed a Handoff (per `{GUIDE_PATH:task-review}` §2.4 Handoff Detection Standards), the Incoming Worker only has current-Stage Memory Logs loaded. Current-Stage Same-Agent Dependencies remain Same-Agent. Previous-Stage Same-Agent Dependencies are reclassified as Cross-Agent.

**Dependency identification.** Check the Task's Dependencies field in the Implementation Plan. Cross-Agent Dependencies are bolded. "None" indicates no dependencies.

**Chain reasoning.** Dependencies may have their own dependencies. Trace upstream when ancestors are relevant — when they established patterns, schemas, or contracts the current Task must follow. Stop tracing when an intermediate node fully abstracts what came before. Assess relevance by asking: does the ancestor define schemas or interfaces used by this Task? Did the ancestor establish patterns the current Task must follow? Would the Worker misunderstand the current Task without ancestor context? When uncertain, include rather than risk missing critical context.

### 2.2 Specification Content Extraction Standards

Workers only receive Task Prompts — the Manager extracts relevant specification content and integrates it into the prompt. Never reference `Specifications.md` by path.

**Include** content that defines interfaces, schemas, or contracts the Task must implement; establishes constraints on approach or patterns; or clarifies design decisions affecting deliverables. **Exclude** content relating to other domains, providing background without actionable requirements, or already captured in the Task's Guidance field. Preserve specificity with exact constraints, not summaries.

### 2.3 Follow-Up Assignment Standards

Follow-up Task Prompts occur when the review outcome determines follow-up is needed after investigation. The Manager arrives with: original Task Memory Log findings, investigation results, understanding of what went wrong, and potentially modified Coordination Artifacts.

**Content principle.** The follow-up is a new Task Prompt with different content — Objective, Instructions, Output, and Validation are refined based on what went wrong. Do not copy the previous prompt.

**Log path continuity.** Use the same `memory_log_path` as the original. The Worker overwrites the previous log. The Manager captures iteration patterns in Stage Summaries when relevant.

### 2.4 Dispatch Standards

Before constructing individual Task Prompts, the Manager assesses dispatch opportunities across tasks ready for dispatch. The Dependency Graph and Dispatch State inform these assessments.

**Task readiness.** A Task is ready when all its dependencies are complete.

**Dispatch types.** Assess all ready Tasks and determine the appropriate dispatch type for each:
- **Batch dispatch** — multiple ready Tasks assigned to the same Worker, dispatched together in a single prompt. Two qualifying patterns:
  - *Sequential chain:* Tasks form an ordered chain where each depends only on the previous (or already-complete Tasks) and no external Tasks depend on intermediate Tasks.
  - *Independent group:* Tasks have no same-Agent dependencies between them and are all ready simultaneously.
  - Soft guidance: 3-5 Tasks per batch.
- **Parallel dispatch** — ready Tasks assigned to different Workers with no unresolved Cross-Agent Dependencies among them, dispatched simultaneously to their respective Workers. Requires version control workspace isolation.
- **Single dispatch** — one ready Task dispatched to its assigned Worker. Applies when a Task has no batch or parallel partners.

**Parallel dispatch prerequisites.** Before first parallel dispatch, the Manager initializes version control per `{SKILL_PATH:apm-version-control}` §3.1 VC Initialization — creating feature branches and worktrees for workspace isolation. The Manager also recommends configuring Worker permissions to minimize approval wait times. If the User declines VC setup, fall back to sequential dispatch.

**Dispatch tracking.** During parallel dispatch, track which Workers have active Tasks and which Reports are pending. Reassess readiness as Reports arrive.

**Wait state.** When no tasks are ready for dispatch but Workers are still active, communicate to the User what was processed, what is pending, and what to do when the next Report arrives.

---

## 3. Task Assignment Procedure

**Procedure:**
1. Dispatch Assessment — determine what to dispatch (single, batch, parallel)
2. Per-Task Analysis (for each Task in dispatch plan):
   - Context Dependency Analysis
   - Extract relevant specification content
   - Implementation Plan Context Extraction
3. Task Prompt Creation — construct and write prompts
4. Follow-Up Task Prompt Creation — when review outcome requires retry

### 3.1 Dispatch Assessment

Assess dispatch opportunities before constructing individual Task Prompts per §2.4 Dispatch Standards.

Perform the following actions:
1. Identify tasks ready for dispatch — read the Dispatch State in Memory Root for current task statuses, cross-reference the Dependency Graph for newly unblocked Tasks.
2. Group ready Tasks by assigned Worker.
3. Assess dispatch type for each group per §2.4 Dispatch Standards:
   - *Batch:* same-Worker group with 2+ ready Tasks — check for sequential chain (internal-only dependencies, no external dependents on intermediates) or independent group (no same-Agent dependencies, all ready).
   - *Parallel:* multiple Workers each have ready Tasks — verify no unresolved Cross-Agent Dependencies among them.
   - *Single:* one ready Task for a Worker with no batch or parallel partners.
4. If parallel dispatch planned, initialize version control per `{SKILL_PATH:apm-version-control}` §3.2 Branch Operations and §3.3 Worktree Operations.
5. Formulate dispatch plan: which Workers receive dispatches, dispatch type per Worker (single, batch, or parallel).
6. For each Task in the dispatch plan, proceed to §3.2-§3.4, then §3.5.

### 3.2 Context Dependency Analysis

*Execute for each Task in the dispatch plan.*

Perform the following actions:
1. Read the Task's Dependencies field from the Implementation Plan. If "None," skip to §3.3.
2. Check tracked Handoff state for the target Worker.
3. Classify each dependency as Same-Agent, Cross-Agent, or Handoff per §2.1 Context Dependency Standards.
4. For Cross-Agent/Handoff dependencies, trace upstream — include relevant ancestors, stop when a node fully abstracts what came before.
5. For each relevant dependency, read the producer's Task Memory Log and note key outputs, file paths, and integration details.

### 3.3 Extract Relevant Specification Content

*Execute for each Task in the dispatch plan.*

Perform the following actions:
1. Review `Specifications.md` for content relevant to this Task per §2.2 Specification Content Extraction Standards.
2. Note relevant content for contextual integration into the Task Prompt. Preserve specificity with exact constraints.

### 3.4 Implementation Plan Context Extraction

*Execute for each Task in the dispatch plan.*

Extract Task definition fields that the Worker needs for execution.

Perform the following actions:
1. Extract Task Objective — single-sentence goal from the Implementation Plan.
2. Extract Steps and Guidance — transform into actionable instructions, incorporating Guidance and relevant Specification content.
3. Extract Output and Validation — deliverables and validation criteria with types.

### 3.5 Task Prompt Creation

Assemble the Task Prompt using extracted context.

Perform the following actions:
1. Construct YAML frontmatter per §4.1 Task Prompt Format.
2. Construct prompt body: Task Reference, Context from Dependencies (if applicable), Objective, Detailed Instructions, Workspace (if parallel dispatch), Expected Output, Validation Criteria, Task Logging instructions, Reporting Instructions.
3. If parallel dispatch, include workspace path per `{SKILL_PATH:apm-version-control}` — worktree path or branch name.
4. Write to Task Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery. For batches, use `{SKILL_PATH:apm-communication}` §4.4 Batch Envelope Format.
5. For parallel dispatch, write to each Worker's Task Bus.
6. Direct the User to run `/apm-4-check-tasks` in the respective Worker session(s).

### 3.6 Follow-Up Task Prompt Creation

Execute when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines follow-up is needed.

Perform the following actions:
1. Capture follow-up context: what went wrong, investigation findings, required refinement, any Coordination Artifact modifications.
2. If Coordination Artifacts were modified, extract relevant updated content per §3.3 and §3.4.
3. Refine all content sections — Objective, Instructions, Output, Validation — based on what went wrong. Include a follow-up context section explaining the issue and required refinement.
4. Construct the follow-up prompt using §4.2 Follow-Up Assignment Format. Same `memory_log_path` as the original.
5. Write to Task Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery.
6. Direct the User to run `/apm-4-check-tasks` in the Worker session.

---

## 4. Structural Specifications

### 4.1 Task Prompt Format

Task Prompts are markdown files. Adapt based on Task needs — not all sections are required for every Task.

**YAML Frontmatter:**
```yaml
---
stage: <N>
task: <M>
agent_id: <domain>-agent
memory_log_path: ".apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md"
has_dependencies: true | false
---
```

**Field Descriptions:**
- `stage`: integer, required. Stage number.
- `task`: integer, required. Task number within Stage.
- `agent_id`: string, required. Worker identifier (lowercase, hyphenated).
- `memory_log_path`: string, required. Full path for the Task Memory Log.
- `has_dependencies`: boolean, required. Whether Context Dependency context is present.

**Prompt Body Sections:** Title with `#` using Task ID and title. Each section uses `##` heading.
- **Task Reference** — Task ID and assigned Agent.
- **Context from Dependencies** — included when `has_dependencies: true`. Format depends on dependency type per §2.1:
  - *Same-Agent format:* `## Context from Dependencies` heading → "Building on your previous work:" intro → `**From Task <N.M>:**` with key outputs and recall points → `**Integration Approach:**` with brief guidance.
  - *Cross-Agent format:* `## Context from Dependencies` heading → "This Task depends on work completed by <Producer Agent>:" intro → `**Integration Steps:**` numbered file reading instructions → `**Producer Output Summary:**` key features, files, interfaces, constraints → `**Upstream Context:**` for relevant ancestors.
- **Objective** — single-sentence Task goal from Implementation Plan, optionally enhanced with coordination-level context.
- **Detailed Instructions** — Implementation Plan steps transformed into actionable instructions with integrated Specification content and Guidance.
- **Workspace** — included for parallel dispatch. Worktree path or branch per `{SKILL_PATH:apm-version-control}`. Worker operates in the specified workspace, commits there, and notes it in the Task Memory Log. Workers do not merge.
- **Expected Output** — deliverables from Implementation Plan Output field.
- **Validation Criteria** — from Implementation Plan Validation field with Validation Types (Programmatic, Artifact, User).
- **Task Logging** — path and reference to `{GUIDE_PATH:task-logging}` §3.1 Task Memory Log Procedure.
- **Task Report** — instruction to output a Task Report for User to return to Manager.

### 4.2 Follow-Up Assignment Format

Follow-up Task Prompts use the same structure as §4.1 with these modifications:
- **Title:** `APM Follow-Up Task: <Task Title>`
- **Follow-up context section** after Task Reference — previous issue, investigation findings, required refinement, additional guidance.
- **All content sections** (Objective, Instructions, Output, Validation) are refined based on what went wrong, not copied from the previous attempt.
- **Same `memory_log_path`** as the original Task Prompt.

---

## 5. Content Guidelines

### 5.1 Prompt Quality

- **Self-contained:** Workers should never need to ask "where do I find X?"
- **Specific:** Specify files, patterns, constraints — avoid vague instructions.
- **Actionable:** Every instruction should be directly executable.
- **Scoped:** Include only what is relevant to this Task.

### 5.2 Context Quality

- **Same-Agent:** Reference previous work concisely. Assume working familiarity, provide recall anchors and file paths.
- **Cross-Agent (including Handoff):** Assume zero familiarity. Explicit file reading instructions before main work, complete output summaries with integration guidance.

### 5.3 Common Mistakes

- **Referencing inaccessible artifacts:** Never tell Worker to "see Specifications.md" or "check Implementation Plan" — they cannot access these.
- **Under-scoped Cross-Agent context:** Cross-Agent Dependencies require comprehensive context regardless of perceived simplicity. Workers cannot access other Workers' Task Memory Logs directly — the Manager must extract and include all needed context.
- **Ignoring Handoff state:** Previous-Stage Same-Agent Dependencies must be treated as Cross-Agent after Worker Handoff.
- **Missing dependency chain:** Failing to trace upstream when ancestors are relevant.
- **Vague instructions:** "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success."
- **Wrong memory_log_path on follow-up:** Follow-up Task Prompts must use the same path as the original.

---

**End of Guide**
