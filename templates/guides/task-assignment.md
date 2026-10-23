# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading agent:** Manager

Construct self-contained Task Prompts, prepare branches/workspaces and deliver work through the Message Bus. Workers execute from their prompt, Rules and accumulated context without consulting Spec or Plan. Follow-up prompts refine work after review.

## 2. Operational Standards

### 2.1 Dependency Context Standards

Use Plan dependencies and Tracker overrides to determine context depth. Same-agent dependencies need recall anchors and key paths; cross-agent dependencies need explicit reading instructions, producer outputs, interfaces and integration guidance. Increase detail with complexity.

After Worker Handoff, current-Stage same-agent dependencies remain same-agent; previous-Stage ones require cross-agent context. Check the Tracker's specific overrides. Recovery can also reduce familiarity, so expand same-agent context where notes indicate reconstructed knowledge.

Trace upstream when ancestors established required patterns, schemas or contracts. Stop where an intermediate output fully abstracts them; include uncertain but potentially important context. Read each unique cross-agent producer log once per dispatch cycle.

### 2.2 Task Prompt Content Standards

Embed exact design decisions, constraints, Task definitions, relevant coordination findings and authoritative User-document content. Present them as direct context without references to Spec, Plan, Tracker, Index or Memory. The Worker must not need those documents. Exclude unrelated background and duplicate guidance.

For codebase content, give targeted paths and what to inspect instead of copying files. Keep objectives, instructions and validation within Worker scope. Producer Task IDs may identify dependency context; do not put Stage structure, other Task IDs or coordination concepts into execution instructions.

### 2.3 Follow-Up Standards

Create a refined prompt from review/investigation findings, not a copy of the prior attempt. Explain the issue and update Objective, Instructions, Output and Validation to bridge the Worker's scoped context with what you learned. Preserve the original `log_path`; the Worker overwrites that log. Capture useful iteration patterns in Stage summaries.

### 2.4 Dispatch Standards

Read readiness from the Tracker and cross-check the Dependency Graph. Dependencies must be Done before dependent work executes. Form units from single Tasks or same-Worker batches; batch candidates are independent Ready Tasks or chains whose dependencies are internal or already complete. Prefer 2–3 Tasks per batch, and dispatch individually when intermediate results would unblock other Workers sooner.

Dispatch units to different Workers in parallel when there are no unresolved cross-agent dependencies and version control provides workspace isolation. Otherwise dispatch sequentially. Recommend appropriate platform tool approvals for parallel Workers to reduce waits.

A pending report may unlock a better combination. Wait when it is the only outstanding report and a useful combination makes waiting worthwhile; otherwise dispatch Ready work. If none is Ready while Workers are active, state what is pending and direct the User to return the next report, prioritizing one that unblocks work when useful.

### 2.5 Version Control Standards

Use the Tracker's per-repository conventions and base branch; identify working repositories from the Spec. Each dispatch unit gets a feature branch off base; a batch shares one branch. Merge required producer branches before creating a dependent branch. Workers commit; you manage branches, worktrees, merges and cleanup.

Use the main working directory for sequential work. For parallel work, give every unit a separate short-lived worktree under `.apm/worktrees/`, keeping the main directory on base. Limit concurrent worktrees to 3–4. Worktrees contain tracked files only; identify any needed untracked assets in the prompt. All runtime `.apm/` paths target the project root, even if a worktree has its own tracked copy.

Names and commits describe actual work, without Task IDs, Stage numbers or agent identifiers. Do not commit generated build files; update `.gitignore` when needed. Keep Task rows current with branches/worktrees and pending merges for Handoff.

If the User later enables version control, initialize git where needed, confirm base/conventions, update Rules and Tracker, then use branch-based dispatch. Without version control, parallel dispatch is unavailable.

### 2.6 Delivery Standards

Use the bus files the Planner created. Before outgoing delivery, clear the Worker's incoming Report Bus via terminal; skip this on its first dispatch when no report exists. Read the Task Bus before writing. Send a batch as one envelope per §4.5.

### 2.7 Non-APM Agent Dispatch

For a participating non-APM agent, write a plain assignment to its Task Bus with the objective, output and reporting instruction. Omit Memory logging, Handoff metadata and Worker tracking.

## 3. Task Assignment Procedure

Assess dispatch, prepare context and construct prompts. Follow-ups use the separate path below. Explain the selected work, material dependency/isolation considerations and next User action without a fixed analytical header.

### 3.1 Dispatch Assessment

1. Identify Ready Tasks from the Tracker and graph.
2. Consider whether a pending report makes waiting worthwhile per §2.4.
3. Group work by Worker and evaluate single, batch and parallel opportunities.
4. Select parallel dispatch where independent units and isolation permit it.
5. State the dispatch plan and prepare each Task's context.

### 3.2 Per-Task Analysis

1. Read the Plan's Dependencies field; skip dependency preparation for “None.”
2. Apply §2.1, checking Handoff/recovery notes and overrides, and trace relevant upstream contracts.
3. Read unique cross-agent producer logs for outputs, paths and integration details.
4. Extract relevant Spec and authoritative source content per §2.2. Refresh the Spec at the first dispatch of a Stage or after modification, rather than rereading an unchanged Spec for each Task.
5. Extract Plan Objective, Steps, Guidance, Output and Validation. Resolve source references and turn steps into actionable instructions with the needed context.

### 3.3 Task Prompt Construction

1. Construct frontmatter per §4.1.
2. Construct the relevant body sections, preserving the objective, exact constraints, dependency context, output and validation. Refer to loaded Worker guidance for generic execution rules.
3. If version control is active, create the feature branch from the repository's recorded base. For parallel work use `git worktree add .apm/worktrees/<branch-slug> -b <branch-name>`. Include workspace/branch and project-root paths in the prompt.
4. Record the branch in the Task row's Branch column.
5. Clear the incoming Report Bus per §2.6.
6. Read and write `.apm/bus/<agent-slug>/task.md`; use §4.5 for batches.
7. Direct the User to an uninitialized Worker's new chat with `apm-3-initiate-worker <agent-id>`; it will detect the pending prompt. For initialized Workers, use `apm-4-check-tasks` in their chat. Identify the number/order of batched Tasks, or each Worker's required action for parallel dispatch. Resolve invocation/new-chat details through the communication skill.

### 3.4 Follow-Up Task Prompt Construction

1. Capture the failure, investigation, required refinement and any document updates.
2. Extract updated planning content per §3.2 when needed.
3. Refine the content per §2.3, explaining the issue and required changes.
4. Use §4.2 with the original `log_path`.
5. Clear the incoming Report Bus per §2.6.
6. Read and write the Worker's Task Bus.
7. Give delivery instructions per §3.3 step 7.

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

- `stage`: Stage number.
- `task`: Task number within Stage.
- `agent`: Worker identifier (kebab-case).
- `log_path`: Pre-constructed path for the Task Log. Path pattern: `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` (relative to the project root). All Tasks in the same Stage share the same Stage directory. You construct the path; the Worker writes directly to it.
- `has_dependencies`: Whether dependency context is present.

**Prompt Body Sections:**

- *Title.* `#` heading using Task ID and title. Each section uses `##` heading:
- *Task Reference:* Task ID and assigned agent.
- *Context from Dependencies.* Included when `has_dependencies: true`. Format depends on dependency type per §2.1 Dependency Context Standards.
  - *Same-agent.* "Building on your previous work:" intro - `**From Task <N>.<M>:**` with key outputs and recall points - `**Integration Approach:**` with brief guidance.
  - *Cross-agent.* "This Task depends on work completed by [Producer Agent]:" intro - `**Integration Steps:**` numbered file reading instructions - `**Producer Output Summary:**` key features, files, interfaces, constraints - `**Upstream Context:**` for relevant ancestors.
- *Objective:* Single-sentence Task goal, optionally enhanced with coordination-level context.
- *Detailed Instructions:* Plan steps transformed into actionable instructions with integrated Spec content and guidance.
- *Workspace:* Working directory and branch name for sequential dispatch, or worktree path and project root for parallel dispatch. For worktree dispatch, instruct the Worker to perform code work in the worktree but resolve all `.apm/` paths (Task Log, bus files) from the project root. Worker operates in the specified workspace, commits there, and notes it in the Task Log. Workers do not merge.
- *Expected Output:* Deliverables from Plan Output field.
- *Validation Criteria:* From Plan Validation field.
- *Instruction Accuracy:* The objective and expected output are authoritative. Verify instructions against the codebase when details, prerequisites or assumptions appear inaccurate; use the actual state rather than persist with a contradicted step.
- *Task Iteration:* Follow `{GUIDE_PATH:task-execution}` §2.3 Iteration Standards, including debug delegation after an unsuccessful correction. Add only Task-specific investigation or validation guidance here.
- *Task Logging:* Path and reference to `{GUIDE_PATH:task-logging}` §3.1 Task Log Procedure.
- *Task Report:* Instruction to output a Task Report for User to return to Manager.

### 4.2 Follow-Up Format

Follow-up Task Prompts use the same structure as §4.1 Task Prompt Format with these modifications:

- *Title:* `APM Follow-Up Task: <Task Title>`
- *Follow-up context section* after Task Reference - previous issue, investigation findings, required refinement, additional guidance.
- *All content sections* refined based on what went wrong, not copied from the previous attempt.
- *Same `log_path`* as the original Task Prompt.

### 4.3 Branch and Worktree Standards

Branch naming follows the convention recorded in the Tracker Version Control table. Branch names are descriptive of the actual work; for batches, the name reflects the batch scope. Worktrees are placed under `.apm/worktrees/`. Each subdirectory name is derived from the branch name (e.g., replacing `/` with `-`). Each worktree directory contains a full checkout of all tracked files. Untracked files are not present.

### 4.4 Tracker VC Entry Format

VC configuration recorded in the Version Control table within the Tracker, with one row per repository. Branch state is tracked per-Task in the Task table's Branch column - an incoming Manager reads Task rows to rebuild working VC context.

**Format:**

```markdown
## Version Control

| Repository | Base Branch | Branch Convention | Commit Convention |
|-----------|-------------|-------------------|-------------------|
| <repo-name> | <branch-name> | <convention> | <convention> |
```

### 4.5 Batch Envelope Format

When sending multiple Tasks to a Worker in a batch, the Task Bus file uses this structure:

**YAML Frontmatter Schema:**
```yaml
---
batch: true
batch_size: <N>
tasks:
  - stage: 1
    task: 1
    log_path: ".apm/memory/stage-01/task-01-01.log.md"
  - stage: 1
    task: 2
    log_path: ".apm/memory/stage-01/task-01-02.log.md"
---
```

**Field Descriptions:**

- `batch`: Always `true` for batch envelopes.
- `batch_size`: Total Tasks in the batch.
- `tasks[].stage`: Stage number.
- `tasks[].task`: Task number within Stage.
- `tasks[].log_path`: Pre-constructed path for the Task Log, following the same pattern as single Task Prompts.

**Body:** Individual Task Prompts separated by `---` delimiters. Each Task Prompt retains its full structure (YAML frontmatter and body) as if standalone.

---
