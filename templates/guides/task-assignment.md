# APM {VERSION} - Task Assignment Guide

This guide covers Task Assignment: choosing which Ready Tasks to send and how, writing their Task Prompts, preparing branches and worktrees, and delivering the prompts through the Message Bus. `{GUIDE_PATH:task-review}` covers the reports that come back.

A Worker works from its Task Prompts, the Rules and its own conversation. Each Task Prompt must carry everything its Task needs; keep coordination files within the Manager's scope.

## 1. Dispatch

1. Find the Ready Tasks from the Tracker and the Plan's Dependencies fields.
2. Group them by Worker. A Worker takes one dispatch at a time: send it a new dispatch only after its current Task or batch has been reviewed. Corrections to an active Task use §5.1 instead. Then choose the dispatch:
   - **Single dispatch:** one Task to one Worker.
   - **Batch dispatch:** several Tasks to the same Worker, executed in order. A batch may be a chain whose dependencies are inside the batch or already Done, or independent Tasks that are all Ready. Keep batches to 2–3 Tasks. Send a chain's Tasks one at a time when other Workers wait on its intermediate results.
   - **Parallel dispatch:** Tasks or batches to different Workers at the same time, when no unresolved Cross-Worker dependency links them and version control gives each Worker its own worktree. Suggest tool approvals that keep parallel Workers from waiting on the User.
3. Wait for a pending report only when it is the only one outstanding and would make a Waiting Task Ready for a Worker you are about to dispatch. Otherwise dispatch what is Ready.
4. If nothing is Ready while Workers are busy, tell the User what you are waiting for and which report to bring next, preferring one that unblocks other work.
5. Prepare each Task per §2.

## 2. Task Context

Before writing a prompt, resolve conflicting objectives, instructions and validation in the Spec, Plan and Rules per `{GUIDE_PATH:task-review}` §4. Include prerequisite versions, configuration constraints and accepted exceptions where they affect the Task.

Write each Task Prompt per §7.1, or §7.2 for a batch, from the aligned Plan's Task entry:

1. Turn the Task's steps and Guidance into Instructions the Worker can act on. Copy in the exact Spec decisions, constraints and authoritative User-document content the Task needs, as direct content. Never refer the Worker to the Spec, Plan, Tracker or Memory. Workers read the Rules directly.
2. For code, name the path and what to do with it, such as "Read `src/api/routes.py` and use its error response schema."
3. Keep the instructions on the Task. Leave out Stage structure, other Task IDs and coordination concepts, except a producer Task's ID where it identifies dependency context.
4. If the Plan lists dependencies, write Context from Dependencies:
   - **Same-Worker dependency:** the Worker remembers its own work. Name the earlier Task, its key outputs and paths, and how to build on them, with more detail for complex work.
   - **Cross-Worker dependency:** the Worker has not seen this work. Read the producer's Task Log, then give numbered reading steps, the producer's outputs, interfaces and constraints, and how to integrate them, however simple the work seems.
   - Tasks listed under Not Read Since Handoff in the Tracker's Workers table count as Cross-Worker. A Worker that recovered after compaction may need more detail; the table's Context says so.
   - Trace upstream when earlier Tasks set patterns or contracts this Task relies on. Stop where an intermediate output fully captures them.
5. Add execution, validation or logging guidance only when it is specific to this Task. The Worker's guides already cover the general rules.

Reread the Spec at the first dispatch of a Stage and after any change to it.

## 3. Version Control

With version control, follow the branch and commit conventions in the Rules and the base branches in the Spec's Workspace section. Name a repository's conventions in the Task Prompt when they differ from the others.

1. Merge any producer branch the Task needs before you create its branch.
2. Create one branch per single or batch dispatch, from the repository's base branch. A batch shares one branch.
3. For sequential work, use the main working directory. For parallel dispatch, give each Worker its own worktree: `git worktree add .apm/worktrees/<branch-slug> -b <branch-name>`, with `<branch-slug>` the branch name with `/` replaced by `-`. Keep the main directory on the base branch and run at most four worktrees at once. A worktree holds tracked files only, so name any untracked files the Worker needs.
4. Name branches after the actual work.
5. Record the branch, any worktree and Next Action in the Task's row in the Tracker.

Workers commit; you create branches and worktrees, merge them and clean up. Do not commit generated build files; update `.gitignore` when needed. In a worktree, every `.apm/` path still points to the workspace root, so the prompt's Workspace section says so.

If the User enables version control later, initialize git where needed, confirm base branches and conventions, and record them in the Spec's Workspace section and the Rules. Without version control, parallel dispatch is unavailable.

## 4. Delivery

1. Read the Worker's Task Bus, `.apm/bus/<agent-slug>/task.md`, then write the Task Prompt to it.
2. In one message, tell the User what you are sending, to whom, any dependency or isolation point that shaped the choice, and how to deliver it:
   - A Worker that has not started: invoke `apm-3-initiate-worker <agent-slug>` in a new chat. It finds the waiting prompt.
   - A Worker already running: invoke `apm-4-check-tasks` in its chat.
   - For a batch, give the number of Tasks and their order; for parallel dispatch, give each Worker's action.

## 5. Follow-Up Tasks

A follow-up Task sends a Task back to the same Worker after review, with a revised Task Prompt. It keeps its Task ID and stays Active.

1. Rewrite the prompt per §7.3. Explain what went wrong and what review or investigation found, and revise the Objective, Instructions, Output and Validation so the Worker can close the gap from its own context.
2. Keep the original `log_path`; the new Task Log replaces the old one. Tell the Worker to retain consequential earlier findings and explain their resolution.
3. Deliver it per §4.

### 5.1 Active Task Corrections

When a planning change affects an active Task whose attempt has not been reported, correct the existing dispatch:

1. Ask the User to pause the affected Worker and confirm its current progress. Align the planning documents per `{GUIDE_PATH:task-review}` §4.
2. Revise the current Task Prompt per §2, keeping its Task ID, `log_path`, branch and worktree. In Instructions, explain what changed, what completed work remains valid and where to resume. For a batch, preserve the Task list and recorded progress, changing only affected current or unstarted Tasks. Work already marked Done needs a new Task per `{GUIDE_PATH:task-review}` §3.
3. Record the correction and next action in the Tracker, then deliver the revised prompt per §4. Tell the User to invoke `apm-4-check-tasks` in the paused Worker's chat. This updates the current dispatch; do not create a new branch or worktree.

After a reported attempt, review it and use a follow-up Task per §5 instead.

## 6. Agents Outside APM

An agent outside APM can join the Message Bus with its own bus folder. Write it a plain assignment in its Task Bus with the objective, the expected output and how to report back. Leave out Task Log paths, Handoff details and the Tracker's Workers table. Tell the User to ask that agent to read `.apm/bus/<slug>/task.md`.

## 7. Formats

### 7.1 Task Prompt Format

```markdown
---
agent: <agent-slug>
stage: <N>
task: <M>
log_path: ".apm/memory/stage-<NN>/task-<NN>-<MM>.log.md"
---

# Task <N>.<M> - <Title>

## Objective
<The Task's goal in one sentence>

## Instructions
<The Plan's steps as actions, with the Spec content and guidance they need>

## Context from Dependencies
<Only when the Task has dependencies, per §2 step 4>

## Workspace
<The working directory; with version control, the branch, and for parallel dispatch the worktree and the workspace root for every `.apm/` path>

## Output
<The deliverables from the Plan's Output field>

## Validation
<The checks from the Plan's Validation field>
```

`log_path` is where the Worker writes its Task Log, in the Stage's folder.

### 7.2 Batch Task Prompt Format

A batch Task Prompt sends several Tasks to one Worker in one Task Bus file. The `tasks` list marks it as a batch.

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

Each Task in the body has the sections of §7.1, without its own frontmatter.

### 7.3 Follow-Up Task Prompt Format

A follow-up Task Prompt has the frontmatter and sections of §7.1, with the same `log_path`, and two changes:

```markdown
# APM Follow-Up Task: <Task Title>

## Follow-Up Context
<What went wrong, what review or investigation found, and what must change>

## Objective
...
```
