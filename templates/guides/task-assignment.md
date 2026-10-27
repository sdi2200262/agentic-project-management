# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading agent:** Manager

Construct self-contained Task Prompts, prepare branches/workspaces and deliver work through the Message Bus. Workers execute from their prompt, Rules and accumulated context without consulting Spec or Plan. Follow-up prompts refine work after review.

## 2. Operational Standards

### 2.1 Dependency Context Standards

Use the Plan's dependencies and the Tracker's Not Read Since Handoff column to determine context depth. For Same-Worker dependencies, give recall anchors and key paths, increasing detail with complexity. For Cross-Worker dependencies, assume the Worker has no familiarity with the producer’s work: always provide comprehensive reading instructions, producer outputs, interfaces and integration guidance, regardless of perceived simplicity.

After a Worker's Handoff, current-Stage Same-Worker dependencies stay Same-Worker; earlier-Stage ones become Cross-Worker. Check the Workers table's Not Read Since Handoff column and Notes. Recovery can also reduce familiarity, so expand Same-Worker context where notes indicate reconstructed knowledge.

Trace upstream when ancestors established required patterns, schemas or contracts. Stop where an intermediate output fully abstracts them; include uncertain but potentially important context. Read each unique Cross-Worker producer log once per dispatch cycle.

### 2.2 Task Prompt Content Standards

Embed exact design decisions, constraints, Task definitions, relevant coordination findings and authoritative User-document content. Present them as direct context without references to Spec, Plan, Tracker, Index or Memory. The Worker must not need those documents. Select source content with actionable requirements for this Worker’s domain. Integrate requirements already in Task Guidance once, alongside the context needed to execute them.

For codebase content, name the path and concrete operation, such as “Read `src/api/routes.py` and use its error response schema.” Keep objectives, instructions and validation within Worker scope. Producer Task IDs may identify dependency context; do not put Stage structure, other Task IDs or coordination concepts into execution instructions.

### 2.3 Follow-Up Standards

Rewrite affected prompt sections from review/investigation findings. Explain the issue and update Objective, Instructions, Output and Validation to bridge the Worker's scoped context with what you learned. Preserve the original `log_path`; the Worker overwrites that log. Capture useful iteration patterns in Stage summaries.

### 2.4 Dispatch Standards

At each dispatch cycle, reassess readiness and work groupings from the current Tracker and the Plan's dependencies. For dispatch readiness, dependencies outside a batch must be Done; a batch may contain a sequential chain whose internal dependencies are completed by preceding Tasks. Form units from single Tasks or same-Worker batches; independent batch candidates must all be Ready. Prefer 2–3 Tasks per batch, and dispatch individually when intermediate results would unblock other Workers sooner.

Dispatch units to different Workers in parallel when there are no unresolved Cross-Worker dependencies and version control provides workspace isolation. Otherwise dispatch sequentially. Recommend appropriate platform tool approvals for parallel Workers to reduce waits.

A pending report may unlock a better combination. Wait only when it is the only outstanding report and it would make a Waiting Task Ready for the same Worker in this dispatch; otherwise dispatch Ready work. If none is Ready while Workers are active, state what is pending and direct the User to return the next report, prioritizing one that unblocks work when useful.

### 2.5 Version Control Standards

When version control is active, use the branch and commit conventions in the Rules and the base branches in the Spec's Workspace section. When a repository's conventions differ from the others, name them in the Task Prompt. Each dispatch unit gets a feature branch off base; a batch shares one branch. Merge required producer branches before creating a dependent branch. Workers commit; you manage branches, worktrees, merges and cleanup.

Use the main working directory for sequential work. For parallel work, give every unit a separate short-lived worktree under `.apm/worktrees/`, keeping the main directory on base. Run at most 4 worktrees at once. Worktrees contain tracked files only; identify any needed untracked assets in the prompt. All runtime `.apm/` paths target the project root, even if a worktree has its own tracked copy.

Names and commits describe actual work, without Task IDs, Stage numbers or agent identifiers. Derive worktree directory names from branch names, replacing `/` with `-`; a batch name reflects its combined scope. Do not commit generated build files; update `.gitignore` when needed. Keep each Task row's Branch and Worktree current, so a later Manager conversation can see pending merges.

If the User later enables version control, initialize git where needed, confirm base branches and conventions, update the Rules and the Spec's Workspace section, then use branch-based dispatch. Without version control, parallel dispatch is unavailable.

### 2.6 Delivery Standards

Use the bus files the Planner created. Before outgoing delivery, clear the Worker's incoming Report Bus via terminal; skip this on its first dispatch when no report exists. Read the Task Bus before writing. Send a batch as one batch Task Prompt per §4.4.

### 2.7 Non-APM Agent Dispatch

For a participating non-APM agent, write a plain assignment to its Task Bus with the objective, output and reporting instruction. Omit Memory logging, Handoff metadata and the Workers table.

## 3. Task Assignment Procedure

Assess dispatch, prepare context and construct prompts. Follow-ups use the separate path below. Explain the selected work, material dependency/isolation considerations and next User action.

### 3.1 Dispatch Assessment

1. Identify Ready Tasks from the Tracker and the Plan's Dependencies fields.
2. Consider whether a pending report makes waiting worthwhile per §2.4.
3. Group work by Worker and evaluate single, batch and parallel opportunities.
4. Select parallel dispatch where independent units and isolation permit it.
5. State the dispatch plan and prepare each Task's context.

### 3.2 Per-Task Analysis

1. Read the Plan's Dependencies field; skip dependency preparation for “None.”
2. Apply §2.1, checking the Workers table for Handoffs and recoveries, and trace relevant upstream contracts.
3. Read unique Cross-Worker producer logs for outputs, paths and integration details.
4. Extract relevant Spec and authoritative source content per §2.2. Refresh the Spec at the first dispatch of a Stage or after modification.
5. Extract Plan Objective, Steps, Guidance, Output and Validation. Resolve source references and turn steps into actionable instructions with the needed context.

### 3.3 Task Prompt Construction

1. Construct frontmatter per §4.1.
2. Construct the relevant body sections, preserving the objective, exact constraints, dependency context, output and validation. Refer to loaded Worker guidance for generic execution rules.
3. If version control is active, create the feature branch from the repository's recorded base. For parallel work use `git worktree add .apm/worktrees/<branch-slug> -b <branch-name>`. Include workspace/branch and project-root paths in the prompt.
4. Record the branch and any worktree in the Task row.
5. Clear the incoming Report Bus per §2.6.
6. Read and write `.apm/bus/<agent-slug>/task.md`; use §4.4 for batches.
7. Direct the User to an uninitialized Worker's new chat with `apm-3-initiate-worker <agent-id>`; it will detect the pending prompt. For initialized Workers, direct the User to invoke `apm-4-check-tasks` in their chat. Identify the number/order of batched Tasks, or each Worker's required action for parallel dispatch.

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

Task Prompts are Markdown files. Include Context from Dependencies only when the Task builds on earlier Tasks.

```markdown
---
agent: <agent-slug>
stage: <N>
task: <M>
log_path: ".apm/memory/stage-<NN>/task-<NN>-<MM>.log.md"
---

# Task <N>.<M> - <Title>

## Objective
<The Task's goal in one sentence, with coordination context when it helps>

## Instructions
<Plan steps turned into actionable instructions, with the Spec content and guidance they need>

## Context from Dependencies
<Per §2.1: for a Same-Worker dependency, the earlier Task, its key outputs and how to build on them; for a Cross-Worker dependency, numbered reading steps, the producer's outputs, interfaces and constraints, and relevant upstream context>

## Workspace
<The working directory; with version control, the branch, and for parallel dispatch the worktree path for the work and the project root for every `.apm/` path>

## Output
<Deliverables from the Plan's Output field>

## Validation
<Checks from the Plan's Validation field>
```

`log_path` is the path where the Worker writes its Task Log. All Tasks in a Stage share its Stage folder.

Add investigation, validation, logging or reporting guidance only when it is specific to this Task. The Worker already follows the execution and logging guides.

### 4.2 Follow-Up Format

Follow-up Task Prompts use the same structure as §4.1 Task Prompt Format with these modifications:

- *Title:* `APM Follow-Up Task: <Task Title>`
- *`## Follow-Up Context` section* before Objective: previous issue, investigation findings, required refinement, additional guidance.
- *All content sections* refined to address the issue and investigation findings.
- *Same `log_path`* as the original Task Prompt.

### 4.3 Branch and Worktree Standards

Use the version control conventions and worktree rules in §2.5.

### 4.4 Batch Task Prompt Format

A batch Task Prompt sends several Tasks to one Worker in a single Task Bus file:

```markdown
---
agent: <agent-slug>
tasks:
  - stage: <N>
    task: <M>
    log_path: ".apm/memory/stage-<NN>/task-<NN>-<MM>.log.md"
  ...
---

# Task <N>.<M> - <Title>

## Objective
...

# Task <N>.<M> - <Title>
...
```

Each Task in the body has the sections of §4.1, without its own frontmatter.
