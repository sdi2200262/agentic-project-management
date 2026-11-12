# APM {VERSION} - Task Assignment Guide

This guide covers Task Assignment: choosing which Ready Tasks to start and who handles them, writing Worker Task Prompts, preparing branches and worktrees, and delivering the prompts through the Message Bus. `{GUIDE_PATH:task-review}` covers the reports that come back.

A Worker works from its Task Prompts, `AGENTS.md` and its own conversation. Each Task Prompt must carry everything its Task needs; keep coordination files within the Manager's scope.

## 1. Dispatch

Select Ready Tasks using their dependencies, available agents, the Plan’s coordination preferences and current User instructions. Follow the agreed forms and frequency of involvement, including review points. When findings or changes make an adjustment useful, explain why and recommend how and when to involve the User.

Before starting either Manager or Worker work, resolve conflicting objectives, instructions and validation in the Spec, Plan and `AGENTS.md` per `{GUIDE_PATH:task-review}` §4. Check dependency context and prepare the workspace per §3. For a Task marked `manager`, mark it Active and continue per `{SKILL_PATH:apm-2-initiate-manager}` §2.1. You may coordinate your Tasks sequentially or concurrently as dependencies, workspace isolation and agreed User involvement allow.

For Worker assignments:

1. Check the Tracker and the Plan’s Dependencies fields for the selected Tasks.
2. Group them by Worker. A Worker takes one dispatch at a time: send it a new dispatch only after its current Task or batch has been reviewed. Corrections to an active Task use §5.1 instead. Then choose the dispatch:
   - **Single dispatch:** one Task to one Worker.
   - **Batch dispatch:** several Tasks to the same Worker, executed in order. A batch may be a chain whose dependencies are inside the batch or already Done, or independent Tasks that are all Ready. Keep batches to 2–3 Tasks. Send a chain's Tasks one at a time when other Workers wait on its intermediate results.
   - **Parallel dispatch:** Tasks or batches to different Workers at the same time, when no unresolved Cross-Worker dependency links them and version control gives each Worker its own worktree.
3. Wait for a pending report only when it is the only one outstanding and would make a Waiting Task Ready for a Worker you are about to dispatch. Otherwise dispatch what is Ready.
4. If nothing is Ready while Workers are busy, tell the User what you are waiting for and which report to bring next, preferring one that unblocks other work.
5. Prepare each Task per §2.

## 2. Task Context

Include prerequisite versions, configuration constraints and accepted exceptions where they affect the Task.

Write each Task Prompt per §7.1, or §7.2 for a batch, from the aligned Plan's Task entry:

1. Turn the Task’s steps and Guidance into Instructions the Worker can act on, preserving agreed User participation and review points. Include each needed Spec decision, constraint and authoritative User-document detail once, as direct content, preserving exact contracts. Include relevant Tracker context, lasting Index findings and corrections from earlier Tasks. Never refer the Worker to the Spec, Plan, Tracker, Index or other Workers' logs. Workers read `AGENTS.md` directly.
2. For code and supporting documents, name relevant paths or sections and how to use them. For supporting documents, include the relevant agreed structure and permitted updates directly in the prompt.
3. Keep the instructions on the Task. Leave out Stage structure, other Task IDs and coordination concepts, except a producer Task's ID where it identifies dependency context.
4. If the Plan lists dependencies, write Context from Dependencies. Same-Worker means both Tasks are assigned to the same agent; Cross-Worker means different agents, including you:
   - Name each earlier Task, its outputs and paths, and how to use them.
   - For Cross-Worker dependencies, read the producer’s latest accepted attempt log, following earlier-attempt links where needed. Provide numbered reading and integration steps, preserving interfaces and constraints. Do the same for Same-Worker dependencies when earlier context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Use the Tracker’s Handoff and recovery notes to identify what needs restoring.
   - Trace upstream when earlier Tasks set patterns or contracts this Task relies on. Stop where an intermediate output fully captures them.
5. Add execution, validation or logging guidance only when it is specific to this Task. The Worker's guides already cover the general rules.

Reread the Spec at the first dispatch of a Stage and after any change to it.

## 3. Version Control

Prepare each Task’s workspace under the version-control arrangement agreed in the Spec and applicable repository conventions in `AGENTS.md`.

1. Make sure required dependency outputs are available and usable in the workspace. Arrange access to needed uncommitted and untracked files; a new worktree does not automatically contain them.
2. Give Tasks running in parallel in the same repository separate worktrees, including your own Tasks. Keep APM-managed worktrees under the session root’s `.apm/worktrees/`.
3. Record the branch, any worktree and Next Action in the Tracker. Several Tasks may share a branch or workspace when the arrangement allows it.
4. In each Worker prompt, give the working directory, branch or worktree, applicable commit instructions and the session workspace root for every `.apm/` path.

You prepare workspaces and handle integration and cleanup; Workers use the assigned workspace and commit instructions. Follow the agreed timing for commits and integration, revisiting the arrangement with the User when needed. If version control is enabled later, agree and apply the setup, recording session choices in the Spec and lasting conventions in `AGENTS.md`. Without version control, parallel Worker dispatch is unavailable.

## 4. Delivery

1. Read the Worker's Task Bus, `.apm/bus/<agent-slug>/task.md`, then write the Task Prompt to it.
2. In one message, tell the User what you are sending, to whom, any dependency or isolation point that shaped the choice, and how to deliver it:
   - A Worker that has not started: start a new Worker conversation with its agent ID. It finds the waiting prompt.
   - A Worker already running: ask it to check its tasks in its conversation.
   - For a batch, give the number of Tasks and their order; for parallel dispatch, give each Worker's action.

## 5. Follow-Up Tasks

A follow-up Task sends a Task back to the same Worker after review, with a revised Task Prompt. It keeps its Task ID and stays Active.

1. Write the revised prompt per §7.3. Describe what remains, what review established and how completion will be checked. Use the Worker's established context and include the detail it still needs, restoring context lost through Handoff or recovery.
2. Choose the next unused follow-up number for this Task, starting at 01, and set its new `log_path` per `{GUIDE_PATH:task-logging}` §5.1. This applies per Task even after a batch. In Follow-Up Context, link the original log and previous follow-up, if any. Earlier logs stay unchanged.
3. Deliver it per §4.

### 5.1 Active Task Corrections

When a planning change affects an active Task whose attempt has not been reported, correct the existing dispatch:

1. Coordinate the correction through the User, checking progress and arranging a pause if needed. Align the planning documents per `{GUIDE_PATH:task-review}` §4.
2. Revise the current Task Prompt per §2, keeping its Task ID, `log_path`, branch and worktree. In Instructions, explain what changed, what completed work remains valid and what to do next. For a batch, preserve the Task list and recorded progress, changing only affected current or unstarted Tasks. Work already marked Done needs a new Task per `{GUIDE_PATH:task-review}` §3.
3. Record the correction and next action in the Tracker, then deliver the revised prompt per §4. Tell the User to ask the Worker to check its tasks in its conversation. This updates the current dispatch; do not create a new branch or worktree.

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
<The working directory, any branch or worktree, applicable commit instructions, and the session workspace root for every `.apm/` path>

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

A follow-up Task Prompt has the frontmatter and sections of §7.1, with its new `log_path` per §5, and two changes:

```markdown
# APM Follow-Up Task: <Task Title>

## Follow-Up Context
<Links to the original log and previous follow-up if any; what review established, what remains and how completion will be checked>

## Objective
...
```
