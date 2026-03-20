# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading Agent:** Manager

This guide defines how you construct and deliver Task Prompts for Workers, manage version control workspace isolation, and coordinate bus-based delivery. Task Prompts are self-contained - Workers receive everything needed to execute a Task without referencing the Spec or Plan.

### 1.1 How to Use This Guide

See §3 Task Assignment Procedure - execute sequentially to initialize version control, construct Task Prompts, and deliver them. See §2 Operational Standards when analyzing dependencies, extracting Spec content, assessing dispatch opportunities, managing version control, or handling follow-up assignments. See §4 Structural Specifications for Task Prompt format and version control specifications. Communication with the User and visible reasoning per `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication.

### 1.2 Objectives

- Construct self-contained Task Prompts that embed all context Workers need, without referencing the Spec or Plan by path.
- Provide appropriate dependency context based on Worker familiarity with producer work.
- Extract and include relevant Spec content for Task execution.
- Assess dispatch opportunities (batch, parallel, single) and manage version control workspace isolation.
- Initialize and maintain version control state throughout the Implementation Phase.
- Deliver Task Prompts via the Message Bus and direct the User to the appropriate Worker.

### 1.3 Outputs

**Task Prompt:** Content written to Task Bus for Worker to receive. Contains all context a Worker needs to execute a Task.

**Follow-up Task Prompt:** A new prompt issued when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines retry. Content is refined based on what went wrong.

**Feature branches:** One branch per dispatch unit, created off the base branch.

**Worktrees:** Isolated working directories under `.apm/worktrees/` for parallel dispatch.

**Tracker VC entry:** VC configuration recorded in the Version Control table within the Tracker.

---

## 2. Operational Standards

### 2.1 Dependency Context Standards

Tasks may depend on outputs from previous Tasks. The context you include depends on the Worker's familiarity with the producer's work.

**Same-agent dependencies:** The Worker previously completed the producer Task and has working familiarity. Provide light context - recall anchors, key file paths, brief reference to previous work. Detail increases with dependency complexity.

**Cross-agent dependencies:** A different Worker completed the producer Task. The Worker has zero familiarity. Provide comprehensive context - explicit file reading instructions, output summaries, integration guidance. Assume nothing.

**After Worker Handoff:** The incoming Worker only has current-Stage Task Logs loaded. Current-Stage same-agent dependencies remain same-agent. Previous-Stage same-agent dependencies are reclassified as cross-agent because the incoming Worker lacks that working context. Check cross-agent overrides in the Tracker during dependency analysis to determine which Tasks have been reclassified.

**Dependency identification:** Check the Task's Dependencies field in the Plan. Cross-agent dependencies are bolded. "None" indicates no dependencies.

**Chain reasoning:** Dependencies may have their own dependencies. Trace upstream when ancestors established patterns, schemas, or contracts the current Task must follow. Stop tracing when an intermediate node fully abstracts what came before. When uncertain, include rather than risk missing critical context.

### 2.2 Spec Extraction Standards

Task Prompts must be self-contained. Extract relevant Spec content and integrate it directly into the prompt - never reference the Spec by path. Workers should not need to look beyond their Task Prompt. When the Spec references external User documents for specific content, follow those references and extract the relevant content directly - the Task Prompt remains self-contained regardless of where the source content resides.

**Include** content that defines interfaces, schemas, or contracts the Task must implement; establishes constraints on approach or patterns; or clarifies design decisions affecting deliverables. **Exclude** content relating to other domains, providing background without actionable requirements, or already captured in the Task's Guidance field. Preserve specificity with exact constraints, not summaries.

### 2.3 Follow-Up Standards

Follow-up Task Prompts occur when the review outcome determines retry after investigation. You arrive with: original Task Log findings, investigation results, understanding of what went wrong, and potentially modified planning documents.

**Content principle:** The follow-up is a new prompt - Objective, Instructions, Output, and Validation are refined based on what went wrong. Do not copy the previous prompt.

**Log path continuity:** Use the same `log_path` as the original. The Worker overwrites the previous log. The Manager captures iteration patterns in Stage summaries when relevant.

### 2.4 Dispatch Standards

Before constructing individual Task Prompts, assess dispatch opportunities across Ready Tasks.

**Task readiness:** A Task is Ready when all its dependencies are complete. Read the Tracker for current statuses; cross-reference the Dependency Graph for newly unblocked Tasks.

**Dispatch modes** → Assess all Ready Tasks, group by Worker, and form dispatch units:
- *Batch:* multiple Ready Tasks for the same Worker, dispatched together. Candidates either form a sequential chain (each depends only on the previous or already-complete Tasks) or are an independent group (no dependencies between them, all ready simultaneously). When forming chains, weigh whether external Tasks depend on intermediate results - if so, dispatching individually allows earlier review and unblocks dependent Workers sooner. Soft guidance: 3-5 Tasks per batch.
- *Single:* one Ready Task for a Worker.
- *Parallel:* two or more dispatch units (any mix) with no unresolved cross-agent dependencies among them, dispatched simultaneously. Requires version control workspace isolation.

**Parallel prerequisites:** Parallel dispatch requires version control to be initialized (per §3.1 VC Initialization, normally done during Manager 1 initiation). Recommend configuring Worker permissions to minimize approval wait times. If the User declines VC setup, fall back to sequential dispatch.

**Intelligent waiting:** Before dispatching a ready unit, check whether a pending report would unlock Tasks that combine well with the current unit. If it's the only outstanding report, waiting costs little. If multiple reports are pending or no plausible combination exists, dispatch immediately.

**Wait state:** When no Tasks are Ready but Workers are still active, communicate what was processed, what is pending, and what the User should do next.

### 2.5 Version Control Standards

Version control provides workspace isolation during parallel dispatch. Each dispatch unit operates on its own feature branch, and you coordinate all merges during Task Review.

**Branch standards** → Every dispatch unit gets its own feature branch off the base branch per the branch convention in the Tracker. APM terminology (Task IDs, Stage numbers, agent identifiers) does not appear in branch names, commit messages, or worktree directory names - these reflect the actual work, not the framework managing it. A batch of sequential Tasks assigned to the same Worker shares one branch.

**Worktree standards** → Worktrees are created only for parallel dispatch - when multiple Workers need physically separate directories simultaneously. For sequential dispatch, the Worker operates in the main working directory on their feature branch. Layout per §4.4 Worktree Directory Layout. Concurrency limit: maximum 3-4 concurrent worktrees. Lifecycle: short-lived - created before dispatch, removed after merge. Worktrees contain only tracked files; if a Worker needs untracked assets, note this in the Task Prompt.

### 2.6 Delivery Standards

Before writing to a Worker's Task Bus, clear the Worker's Report Bus (`.apm/bus/<agent-slug>/report.md`) via terminal (e.g., `truncate -s 0` or shell redirection). Skip clearing on first Task Prompt to a Worker when no report exists.

When dispatching multiple sequential Tasks to the same Worker, send them as a batch in a single Task Bus message per `{SKILL_PATH:apm-communication}` §4.5 Batch Envelope Format.

---

## 3. Task Assignment Procedure

**Procedure:**
1. VC Initialization (Manager 1, once).
2. Dispatch Assessment - determine what to dispatch.
3. Per-Task Analysis - dependency context, Spec extraction, Plan extraction.
4. Task Prompt Construction - assemble, deliver, and direct User.
5. Follow-Up Task Prompt Construction - when review outcome requires retry.

### 3.1 VC Verification

Execute once during Manager 1 initiation, after Memory initialization. Version control is established by the Planner during the Planning Phase - the Tracker's Version Control section and the Rules contain the conventions. Perform the following actions:
1. Read VC state from the Tracker: base branch, branch convention, commit convention. If fields are empty, the User declined version control during planning - parallel dispatch is unavailable, fall back to sequential dispatch. If the User later requests version control, the Manager can initialize it mid-session: run `git init` if needed, detect or confirm the base branch, establish conventions with the User, update Rules and the Tracker, then proceed with branch-based dispatch.
2. Verify git state is consistent: the base branch exists, the repository is accessible. Navigate to the working repository if the Spec specifies a different directory.
3. Check for stale worktrees or orphaned feature branches from prior instances. Clean if found.

### 3.2 Dispatch Assessment

Assess dispatch opportunities from current project state per §2.4 Dispatch Standards. Before each dispatch decision, assess the current project state visibly in chat: which Tasks are Ready, what dependency relationships exist among them, and what dispatch mode best serves progress and efficiency. Each dispatch cycle is a fresh assessment.

Perform the following actions:
1. Identify Ready Tasks from the Tracker. Cross-reference the Dependency Graph for newly unblocked Tasks.
2. Apply intelligent waiting - if a pending report would unlock Tasks that combine well with currently Ready Tasks, consider waiting. If no beneficial combination is plausible, proceed.
3. Group Ready Tasks by assigned Worker. Form dispatch units per §2.4 Dispatch Standards.
4. Assess parallel opportunity: if 2+ dispatch units exist with no unresolved cross-agent dependencies → parallel dispatch.
5. Formulate dispatch plan: which Workers receive which units, whether parallel. For each Task, continue to per-Task analysis.

### 3.3 Per-Task Analysis

Execute for each Task in the dispatch plan.

Perform the following actions:
1. Read the Task's Dependencies field from the Plan. If "None," skip dependency context steps.
2. For each dependency, determine context depth per §2.1 Dependency Context Standards - check Worker Handoff state and auto-compaction notes in the Tracker, classify as same-agent or cross-agent, check cross-agent overrides, and trace upstream when ancestors are relevant. For Workers that recovered from auto-compaction, provide slightly more comprehensive same-agent dependency context (closer to cross-agent depth) since reconstructed context may lack working nuance.
3. For cross-agent dependencies, read unique producer Task Logs and note key outputs, file paths, and integration details. When multiple Tasks in this dispatch cycle depend on the same producer, read that log once and extract from context for subsequent Tasks.
4. Extract Spec content relevant to this Task per §2.2 Spec Extraction Standards. The Spec is in context from session start and refreshed on any modification (read-before-edit). A fresh read is warranted at the start of a new Stage's first dispatch; per-Task re-reads of an unchanged Spec are not needed.
5. Extract Task definition fields from the Plan: Objective, Steps, Guidance, Output, Validation. Transform steps into actionable instructions, incorporating Guidance and relevant Spec content.

### 3.4 Task Prompt Construction

Assemble the Task Prompt and deliver via the Message Bus.

Perform the following actions:
1. Construct YAML frontmatter per §4.1 Task Prompt Format.
2. Construct prompt body: Task Reference, Context from Dependencies (if applicable), Objective, Detailed Instructions, Workspace, Expected Output, Validation Criteria, Instruction Accuracy, Task Iteration, Task Logging instructions, Reporting Instructions.
3. Create a feature branch off the base branch per §2.5 Version Control Standards. For parallel dispatch, create a worktree: `git worktree add .apm/worktrees/<branch-slug> -b <branch-name>`. Include the branch name (sequential) or worktree path (parallel) in the Workspace section.
4. Record the branch name in the task row's Branch column when updating the Tracker.
5. Clear the incoming Report Bus per §2.6 Delivery Standards.
6. Write the Task Prompt to the Worker's Task Bus: `.apm/bus/<agent-slug>/task.md`. For batches, use `{SKILL_PATH:apm-communication}` §4.5 Batch Envelope Format.
7. Direct the User to the Worker's chat using an action directive per `{SKILL_PATH:apm-communication}` §2.1:
   - If the Worker is not yet initialized → direct the User to start a new chat and run `/apm-3-initiate-worker <agent-id>`, then `/apm-4-check-tasks`. Only on first dispatch to this Worker.
   - If the Worker is already initialized → direct the User to run `/apm-4-check-tasks` in the Worker's chat.
   - For batch dispatch → summarize what the Worker will receive (number of Tasks, sequential execution).
   - For parallel dispatch → list each Worker with its required action.

### 3.5 Follow-Up Task Prompt Construction

Execute when the review outcome (per `{GUIDE_PATH:task-review}` §3.3 Review Outcome) determines follow-up is needed.

Perform the following actions:
1. Capture follow-up context: what went wrong, investigation findings, required refinement, any planning document modifications.
2. If planning documents were modified, extract relevant updated content per §3.3 Per-Task Analysis.
3. Refine all content sections - Objective, Instructions, Output, Validation - based on what went wrong. Include a follow-up context section explaining the issue and required refinement.
4. Construct the follow-up prompt per §4.2 Follow-Up Format. Same `log_path` as the original.
5. Clear the incoming Report Bus per §2.6 Delivery Standards.
6. Write to the Worker's Task Bus: `.apm/bus/<agent-slug>/task.md`.
7. Direct the User to the Worker per §3.4 Task Prompt Construction step 7.

---

## 4. Structural Specifications

### 4.1 Task Prompt Format

Task Prompts are markdown files. Adapt based on Task needs - not all sections are required for every Task.

**YAML Frontmatter Schema:**
```yaml
---
stage: 1
task: 2
agent: frontend-agent
log_path: ".apm/memory/stage-01/task-01-02.log.md"
has_dependencies: true
---
```

**Field Descriptions:**
- `stage`: integer, required. Stage number.
- `task`: integer, required. Task number within Stage.
- `agent`: string, required. Worker identifier (kebab-case).
- `log_path`: string, required. Pre-constructed path for the Task Log. Path pattern: `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`. All Tasks in the same Stage share the same Stage directory. You construct the path; the Worker writes directly to it (the file write operation creates parent directories as needed).
- `has_dependencies`: boolean, required. Whether dependency context is present.

**Prompt Body Sections:**
- **Title:** `#` heading using Task ID and title. Each section uses `##` heading:
- *Task Reference:* Task ID and assigned agent.
- *Context from Dependencies:* Included when `has_dependencies: true`. Format depends on dependency type per §2.1 Dependency Context Standards:
  - *Same-agent:* "Building on your previous work:" intro → `**From Task <N>.<M>:**` with key outputs and recall points → `**Integration Approach:**` with brief guidance.
  - *Cross-agent:* "This Task depends on work completed by [Producer Agent]:" intro → `**Integration Steps:**` numbered file reading instructions → `**Producer Output Summary:**` key features, files, interfaces, constraints → `**Upstream Context:**` for relevant ancestors.
- *Objective:* Single-sentence Task goal, optionally enhanced with coordination-level context.
- *Detailed Instructions:* Plan steps transformed into actionable instructions with integrated Spec content and guidance.
- *Workspace:* Branch name for sequential dispatch, worktree path for parallel dispatch. Worker operates in the specified workspace, commits there, and notes it in the Task Log. Workers do not merge.
- *Expected Output:* Deliverables from Plan Output field.
- *Validation Criteria:* From Plan Validation field with validation approaches (programmatic, artifact, user).
- *Instruction Accuracy:* The objective and expected output are authoritative - deliver those. However, the detailed instructions and steps were constructed from planning documents and may contain inaccurate details, missed prerequisites, or outdated assumptions about the codebase. When a specific instruction contradicts what the codebase actually shows, validate the actual state rather than persisting with the instruction as written.
- *Task Iteration:* When facing persistent issues that resist direct fixing, spawn a debug subagent for fresh-context resolution rather than exhausting the context window. When execution reveals discrepancies with these instructions, use exploration subagents to validate assumptions before persisting. If unresolved, log to memory and report with Partial status.
- *Task Logging:* Path and reference to `{GUIDE_PATH:task-logging}` §3.1 Task Log Procedure.
- *Task Report:* Instruction to output a Task Report for User to return to Manager.

### 4.2 Follow-Up Format

Follow-up Task Prompts use the same structure as §4.1 Task Prompt Format with these modifications:
- *Title:* `APM Follow-Up Task: <Task Title>`
- *Follow-up context section* after Task Reference - previous issue, investigation findings, required refinement, additional guidance.
- *All content sections* refined based on what went wrong, not copied from the previous attempt.
- *Same `log_path`* as the original Task Prompt.

### 4.3 Branch Naming

Branch naming follows the convention recorded in the Tracker Version Control table (established by the Planner during the Planning Phase). Branch names are descriptive of the actual work; for batches, the name reflects the batch scope.

### 4.4 Worktree Directory Layout

Worktrees are placed under `.apm/worktrees/`. Each subdirectory name is derived from the branch name (e.g., replacing `/` with `-`). Each worktree directory contains a full checkout of all tracked files. Untracked files are not present.

### 4.5 Tracker VC Entry Format

VC configuration recorded in the Version Control table within the Tracker. The Planner populates this during Planning Phase Completion. Branch state is tracked per-task in the task table's Branch column - an incoming Manager reads task rows to rebuild working VC context.

**Format:**

```markdown
## Version Control

| Field | Value |
|-------|-------|
| Base Branch | <branch-name> |
| Branch Convention | <convention> |
| Commit Convention | <convention> |
```

---

## 5. Content Guidelines

### 5.1 Prompt Quality

- *Self-contained:* Workers should never need to ask "where do I find X?"
- *Specific:* Specify files, patterns, constraints - avoid vague instructions.
- *Actionable:* Every instruction should be directly executable.
- *Scoped:* Include only what is relevant to this Task. Task Prompt instructions and objectives do not reference Stage numbers, other Task IDs, or coordination-level concepts (dependency context sections reference producer Tasks by ID as needed). Validation criteria are Worker-scoped.

### 5.2 Context Quality

- *Same-agent:* Reference previous work concisely. Assume working familiarity, provide recall anchors and file paths.
- *Cross-agent (including after Handoff):* Assume zero familiarity. Explicit file reading instructions before main work, complete output summaries with integration guidance.

### 5.3 Common Mistakes

- *Referencing planning documents in Task Prompts:* Never tell Worker to "see the Spec" or "check the Plan" - Task Prompts must be self-contained and Workers should not need to reference planning documents.
- *Under-scoped cross-agent context:* Cross-agent dependencies require comprehensive context regardless of perceived simplicity. Workers cannot access other Workers' Task Logs - the Manager must extract and include all needed context.
- *Ignoring Handoff state:* Previous-Stage same-agent dependencies must be treated as cross-agent after Worker Handoff.
- *Missing dependency chain:* Failing to trace upstream when ancestors are relevant.
- *Vague instructions:* "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success."
- *Wrong log_path on follow-up:* Follow-up Task Prompts must use the same path as the original.
- *Dispatching before merging dependencies:* If Task B depends on Task A's output and A was on a separate branch, A must be merged before B's branch is created.
- *Accumulating worktrees:* Worktrees are short-lived. Remove promptly after merge.
- *Assuming base branch name:* Read the base branch from the Tracker. Do not assume `main` or `master`.
- *Forgetting VC state in Handoff:* Ensure task rows reflect current branch state before Handoff. Include active branches, worktrees, and pending merges in the Handoff Log.
- *Committing build artifacts:* Do not commit generated files. Create or update `.gitignore` for build directories.

---

**End of Guide**
