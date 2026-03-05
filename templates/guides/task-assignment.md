# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how the Manager constructs Task Prompts for Workers. Task Prompts are self-contained - Workers receive everything needed to execute a Task. Workers do not reference Specifications or the Implementation Plan directly; all necessary context is extracted and embedded by the Manager.

### 1.1 How to Use This Guide

See §3 Task Assignment Procedure - execute sequentially to construct and deliver Task Prompts. See §2 Operational Standards when analyzing dependencies, extracting specification content, assessing dispatch opportunities, or handling follow-up assignments. See §4 Structural Specifications for Task Prompt format. Communication with the User and visible reasoning follow `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication.

### 1.2 Objectives

- Construct self-contained Task Prompts that embed all context Workers need, without referencing Specifications or the Implementation Plan by path
- Provide appropriate dependency context based on Worker familiarity with producer work
- Extract and include relevant specification content for Task execution
- Assess dispatch opportunities (batch, parallel, single) and coordinate workspace isolation via the VC skill

### 1.3 Outputs

**Task Prompt:** Content written to Task Bus for Worker to receive. Contains all context a Worker needs to execute a Task.

**Follow-up Task Prompt:** A new prompt issued when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines retry. Content is refined based on what went wrong.

---

## 2. Operational Standards

### 2.1 Dependency Context Standards

Tasks may depend on outputs from previous Tasks. The context you include depends on the Worker's familiarity with the producer's work.

**Same-agent dependencies:** The Worker previously completed the producer Task and has working familiarity. Provide light context - recall anchors, key file paths, brief reference to previous work. Detail increases with dependency complexity.

**Cross-agent dependencies:** A different Worker completed the producer Task. The Worker has zero familiarity. Provide comprehensive context - explicit file reading instructions, output summaries, integration guidance. Assume nothing.

**After Worker Handoff:** The incoming Worker only has current-Stage Task Memory Logs loaded. Current-Stage same-agent dependencies remain same-agent. Previous-Stage same-agent dependencies are reclassified as cross-agent because the incoming Worker lacks that working context. Check cross-agent overrides in the Project Tracker during dependency analysis to determine which Tasks have been reclassified.

**Dependency identification:** Check the Task's Dependencies field in the Implementation Plan. Cross-agent dependencies are bolded. "None" indicates no dependencies.

**Chain reasoning:** Dependencies may have their own dependencies. Trace upstream when ancestors established patterns, schemas, or contracts the current Task must follow. Stop tracing when an intermediate node fully abstracts what came before. When uncertain, include rather than risk missing critical context.

### 2.2 Specification Extraction Standards

Task Prompts must be self-contained. The Manager extracts relevant Specification content and integrates it directly into the prompt - never reference Specifications by path. Workers should not need to look beyond their Task Prompt. When Specifications reference external User documents for specific content, follow those references and extract the relevant content directly - the Task Prompt remains self-contained regardless of where the source content resides.

**Include** content that defines interfaces, schemas, or contracts the Task must implement; establishes constraints on approach or patterns; or clarifies design decisions affecting deliverables. **Exclude** content relating to other domains, providing background without actionable requirements, or already captured in the Task's Guidance field. Preserve specificity with exact constraints, not summaries.

### 2.3 Follow-Up Standards

Follow-up Task Prompts occur when the review outcome determines retry after investigation. The Manager arrives with: original Task Memory Log findings, investigation results, understanding of what went wrong, and potentially modified planning documents.

**Content principle:** The follow-up is a new prompt - Objective, Instructions, Output, and Validation are refined based on what went wrong. Do not copy the previous prompt.

**Log path continuity:** Use the same `memory_log_path` as the original. The Worker overwrites the previous log. The Manager captures iteration patterns in Stage summaries when relevant.

### 2.4 Dispatch Standards

Before constructing individual Task Prompts, the Manager assesses dispatch opportunities across Ready Tasks.

**Task readiness:** A Task is Ready when all its dependencies are complete. Read the task tracking section in Memory Root for current statuses; cross-reference the Dependency Graph for newly unblocked Tasks.

**Dispatch modes** → Assess all Ready Tasks, group by Worker, and form dispatch units:
- *Batch:* multiple Ready Tasks for the same Worker, dispatched together. Candidates either form a sequential chain (each depends only on the previous or already-complete Tasks, no external Tasks depend on intermediates) or are an independent group (no dependencies between them, all ready simultaneously). Soft guidance: 3-5 Tasks per batch.
- *Single:* one Ready Task for a Worker.
- *Parallel:* two or more dispatch units (any mix) with no unresolved cross-agent dependencies among them, dispatched simultaneously. Requires version control workspace isolation.

**Parallel prerequisites:** Before first parallel dispatch, initialize version control per `{SKILL_PATH:apm-version-control}` §3.1 VC Initialization. Recommend configuring Worker permissions to minimize approval wait times. If the User declines VC setup, fall back to sequential dispatch.

**Intelligent waiting:** Before dispatching a ready unit, check whether a pending report would unlock Tasks that combine well with the current unit. If it's the only outstanding report, waiting costs little. If multiple reports are pending or no plausible combination exists, dispatch immediately.

**Wait state:** When no Tasks are Ready but Workers are still active, communicate what was processed, what is pending, and what the User should do next.

---

## 3. Task Assignment Procedure

**Procedure:**
1. Dispatch Assessment - determine what to dispatch.
2. Per-Task Analysis - dependency context, specification extraction, plan extraction.
3. Task Prompt Construction - assemble and deliver.
4. Follow-Up Task Prompt Construction - when review outcome requires retry.

### 3.1 Dispatch Assessment

Assess dispatch opportunities from current project state per §2.4 Dispatch Standards. Before each dispatch decision, assess the current project state visibly in chat: which Tasks are Ready, what dependency relationships exist among them, and what dispatch mode best serves progress and efficiency. Each dispatch cycle is a fresh assessment - dispatch conditions change as Tasks complete and dependencies resolve or as execution reveals important findings.

Perform the following actions:
1. Identify Ready Tasks from the task tracking section in Memory Root. Cross-reference the Dependency Graph for newly unblocked Tasks.
2. Apply intelligent waiting - if a pending report would unlock Tasks that combine well with currently Ready Tasks, consider waiting. If no beneficial combination is plausible, proceed.
3. Group Ready Tasks by assigned Worker. Form dispatch units per §2.4 Dispatch Standards.
4. Assess parallel opportunity: if 2+ dispatch units exist with no unresolved cross-agent dependencies → parallel dispatch.
5. If parallel dispatch planned, initialize version control per `{SKILL_PATH:apm-version-control}` §3.2 Branch Operations and §3.3 Worktree Operations.
6. Formulate dispatch plan: which Workers receive which units, whether parallel. For each Task, continue to per-Task analysis.

### 3.2 Per-Task Analysis

Execute for each Task in the dispatch plan.

Perform the following actions:
1. Read the Task's Dependencies field from the Implementation Plan. If "None," skip dependency context steps.
2. For each dependency, determine context depth per §2.1 Dependency Context Standards - check Worker Handoff state, classify as same-agent or cross-agent, check cross-agent overrides in the Project Tracker, and trace upstream when ancestors are relevant.
3. For cross-agent dependencies, read the producer's Task Memory Log and note key outputs, file paths, and integration details.
4. Review Specifications for content relevant to this Task per §2.2 Specification Extraction Standards. Note relevant content for integration.
5. Extract Task definition fields from the Implementation Plan: Objective, Steps, Guidance, Output, Validation. Transform steps into actionable instructions, incorporating Guidance and relevant specification content.

### 3.3 Task Prompt Construction

Assemble the Task Prompt using extracted context.

Perform the following actions:
1. Construct YAML frontmatter per §4.1 Task Prompt Format.
2. Construct prompt body: Task Reference, Context from Dependencies (if applicable), Objective, Detailed Instructions, Workspace, Expected Output, Validation Criteria, Task Logging instructions, Reporting Instructions.
3. Include workspace context per `{SKILL_PATH:apm-version-control}` - branch name for sequential dispatch, worktree path for parallel dispatch.
4. Write to Task Bus per `{SKILL_PATH:apm-communication}` §4.6 Task Prompt Delivery. For batches, per `{SKILL_PATH:apm-communication}` §4.14 Batch Envelope Format.
5. For parallel dispatch, write to each Worker's Task Bus.
6. Direct the User to the respective Worker session(s) per `{SKILL_PATH:apm-communication}` §4.6 Task Prompt Delivery - differentiate between uninitialized Workers (initialization required) and initialized Workers.

### 3.4 Follow-Up Task Prompt Construction

Execute when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines follow-up is needed.

Perform the following actions:
1. Capture follow-up context: what went wrong, investigation findings, required refinement, any planning document modifications.
2. If planning documents were modified, extract relevant updated content per §3.2.
3. Refine all content sections - Objective, Instructions, Output, Validation - based on what went wrong. Include a follow-up context section explaining the issue and required refinement.
4. Construct the follow-up prompt per §4.2 Follow-Up Format. Same `memory_log_path` as the original.
5. Write to Task Bus per `{SKILL_PATH:apm-communication}` §4.6 Task Prompt Delivery.
6. Direct the User to the Worker session per `{SKILL_PATH:apm-communication}` §4.6 Task Prompt Delivery.

---

## 4. Structural Specifications

### 4.1 Task Prompt Format

Task Prompts are markdown files. Adapt based on Task needs - not all sections are required for every Task.

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
- `memory_log_path`: string, required. Full path for the Task Memory Log. The Stage slug is derived from the Stage name in the Implementation Plan (e.g., Stage 1 "Parallel Feature and Baseline Development" produces `Stage_1_Parallel_Feature_and_Baseline_Development`). All Tasks in the same Stage share the same Stage directory.
- `has_dependencies`: boolean, required. Whether dependency context is present.

**Prompt Body Sections:** 
- **Title:** `#` heading using Task ID and title. Each section uses `##` heading:
- *Task Reference:* Task ID and assigned agent.
- *Context from Dependencies:* Included when `has_dependencies: true`. Format depends on dependency type per §2.1 Dependency Context Standards:
  - *Same-agent:* "Building on your previous work:" intro → `**From Task <N.M>:**` with key outputs and recall points → `**Integration Approach:**` with brief guidance.
  - *Cross-agent:* "This Task depends on work completed by [Producer Agent]:" intro → `**Integration Steps:**` numbered file reading instructions → `**Producer Output Summary:**` key features, files, interfaces, constraints → `**Upstream Context:**` for relevant ancestors.
- *Objective:* Single-sentence Task goal, optionally enhanced with coordination-level context.
- *Detailed Instructions:* Implementation Plan steps transformed into actionable instructions with integrated specification content and guidance.
- *Workspace:* Branch name for sequential dispatch, worktree path for parallel dispatch per `{SKILL_PATH:apm-version-control}`. Worker operates in the specified workspace, commits there, and notes it in the Task Memory Log. Workers do not merge.
- *Expected Output:* Deliverables from Implementation Plan Output field.
- *Validation Criteria:* From Implementation Plan Validation field with validation approaches (programmatic, artifact, user).
- *Task Logging:* Path and reference to `{GUIDE_PATH:task-logging}` §3.1 Task Memory Log Procedure.
- *Task Report:* Instruction to output a Task Report for User to return to Manager.

### 4.2 Follow-Up Format

Follow-up Task Prompts use the same structure as §4.1 with these modifications:
- *Title:* `APM Follow-Up Task: <Task Title>`
- *Follow-up context section* after Task Reference - previous issue, investigation findings, required refinement, additional guidance.
- *All content sections* refined based on what went wrong, not copied from the previous attempt.
- *Same `memory_log_path`* as the original Task Prompt.

---

## 5. Content Guidelines

### 5.1 Prompt Quality

- *Self-contained:* Workers should never need to ask "where do I find X?"
- *Specific:* Specify files, patterns, constraints - avoid vague instructions.
- *Actionable:* Every instruction should be directly executable.
- *Scoped:* Include only what is relevant to this Task. Task Prompts do not reference Stage numbers, other Task IDs, or coordination-level concepts. Validation criteria are Worker-scoped.

### 5.2 Context Quality

- *Same-agent:* Reference previous work concisely. Assume working familiarity, provide recall anchors and file paths.
- *Cross-agent (including after Handoff):* Assume zero familiarity. Explicit file reading instructions before main work, complete output summaries with integration guidance.

### 5.3 Common Mistakes

- *Referencing planning documents in Task Prompts:* Never tell Worker to "see Specifications.md" or "check Implementation Plan" - Task Prompts must be self-contained and Workers should not need to reference planning documents.
- *Under-scoped cross-agent context:* Cross-agent dependencies require comprehensive context regardless of perceived simplicity. Workers cannot access other Workers' Task Memory Logs - the Manager must extract and include all needed context.
- *Ignoring Handoff state:* Previous-Stage same-agent dependencies must be treated as cross-agent after Worker Handoff.
- *Missing dependency chain:* Failing to trace upstream when ancestors are relevant.
- *Vague instructions:* "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success."
- *Wrong memory_log_path on follow-up:* Follow-up Task Prompts must use the same path as the original.

---

**End of Guide**
