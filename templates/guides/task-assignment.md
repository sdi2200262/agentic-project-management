# APM {VERSION} - Task Assignment Guide

The Manager uses this guide to select and assign Ready Tasks, prepare workspaces and send Worker Task Prompts. The Planner, Workers and session summarizer use only §1.1 when making native subagent assignments. `{GUIDE_PATH:task-review}` covers incoming reports.

A Worker works from its Task Prompts, `AGENTS.md` and its own conversation. Each Task Prompt must carry everything its Task needs; keep coordination files within the Manager's scope.

## 1. Dispatch

Select Ready Tasks from dependencies, available agents, Plan preferences and current User instructions. Follow agreed involvement and review points; explain and recommend adjustments when findings warrant them.

Before starting either Manager or Worker work, resolve conflicting objectives, instructions and validation in the Spec, Plan and `AGENTS.md` per `{GUIDE_PATH:task-review}` §4. Check dependency context and prepare the workspace per §3. For Tasks marked `manager`, mark the selected Ready Tasks Active and continue per `{SKILL_PATH:apm-2-initiate-manager}` §2.1. You may coordinate your Tasks sequentially or concurrently as dependencies, workspace isolation and agreed User involvement allow.

For your own Tasks, group related work or split it into coherent contributions where shared context, expertise, resources, isolation or useful parallelism justify it. Sequence dependent work and keep each Task’s outputs and validation traceable. Prepare native assignments per §1.1. Results return directly; review useful results and continue newly unblocked work without waiting for an entire group. Worker batch-report and attempt rules do not apply to native contributions.

For Worker assignments:

1. Check the Tracker and the Plan’s Dependencies fields for the selected Tasks.
2. Group them by Worker. A Worker takes one dispatch at a time: send it a new dispatch only after its current Task or batch has been reviewed. Corrections to an active Task use §5.1 instead. Then choose the dispatch:
   - **Single dispatch:** one Task to one Worker.
   - **Batch dispatch:** several Tasks to the same Worker, executed in order. A batch may be a chain whose dependencies are inside the batch or already Done, or independent Tasks that are all Ready. Keep batches to 2–3 Tasks. Send a chain's Tasks one at a time when other Workers wait on its intermediate results.
   - **Parallel dispatch:** Tasks or batches to different Workers at the same time, when no unresolved dependency links them and their workspaces and shared resources are safely separated per §3.
3. Wait for a pending report only when it is the only one outstanding and would make a Waiting Task Ready for a Worker you are about to dispatch. Otherwise dispatch what is Ready.
4. If nothing is Ready while Workers are busy, tell the User what you are waiting for and which report to bring next, preferring one that unblocks other work.
5. Prepare each Task per §2.

### 1.1 Native Subagent Assignments

Follow your role's delegation policy. Delegate where focused work, expertise or useful parallelism justifies the context and coordination. Group related questions or contributions; split for a concrete benefit, not merely a Task boundary. Reuse agents where retained context helps.

Give each subagent an objective, necessary requirements and sources, workspace instructions, dependencies, accepted exceptions, permitted changes, commit timing and approvals, and expected outputs and evidence.

- For implementation, carry applicable validation and conditions for seeking guidance from Task Execution §§3.1 and 4 into the brief. Keep Task outputs and checks traceable when grouping implementation work.
- Other roles scope the brief to their research or preparation and specify the evidence and escalation conditions their contribution needs.

Stay within your permitted scope. Recommend Git when arranging parallel work for safer isolation and broader parallel options.

- With Git, parallel Tasks in one repository use separate worktrees. Worktrees do not isolate shared external resources.
- Without Git, assignments must be independent, with disjoint writable files, directories and resources. They must not change inputs another assignment needs. Each no-Git parallel assignment must state that Git isolation is unavailable and identify writable boundaries, shared resources and when to coordinate or pause.

Sequence overlapping changes, broad formatting, generation and shared test/service operations unless isolated.

Verify findings and actual outputs before relying on them, checking combined behavior where contributions interact. Collect useful results without waiting for unrelated work; preserve valid progress when updating briefs. Native subagents are not APM Workers and do not use Worker bus, attempt or Handoff procedures.

## 2. Task Context

Include prerequisite versions, configuration constraints and accepted exceptions where they affect the Task.

Write each Task Prompt per §7.1, or §7.2 for a batch, from the aligned Plan's Task entry:

1. Turn the Task’s steps and Guidance into actionable Instructions, preserving agreed User participation and review points. Include each needed Spec decision, constraint and authoritative User-document detail once, as direct content, preserving exact contracts. Include relevant Tracker context, lasting Index findings and corrections from earlier Tasks.

   Never refer the Worker to the Spec, Plan, Tracker or Index. Supply dependency logs per step 4. Workers read `AGENTS.md` directly.
2. For code and supporting documents, name relevant paths or sections and how to use them. For supporting documents, include the relevant agreed structure and permitted updates directly in the prompt.
3. Keep the instructions on the Task. Supply enough purpose and participation context for the Worker to explain its Task, without copying the wider Stage structure or unrelated coordination. Include other Task IDs only where they identify dependencies.
4. If the Plan lists dependencies, write Context from Dependencies. Same-Worker means both Tasks are assigned to the same agent; Cross-Worker means different agents, including you:
   - Name each earlier Task, its outputs and paths, and how to use them.
   - For Cross-Worker dependencies, read the producer’s latest accepted attempt log, following earlier-attempt links where needed. Name that log in the prompt for the Worker to read before using its outputs. Provide numbered reading and integration steps, preserving interfaces and constraints. Do the same for Same-Worker dependencies when earlier context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Use the Agents table's context gaps to identify what needs restoring.
   - Trace upstream when earlier Tasks set patterns or contracts this Task relies on. Stop where an intermediate output fully captures them.
5. Add execution, validation or logging guidance only when it is specific to this Task. The Worker's guides already cover the general rules.

Reread the Spec at the first dispatch of a Stage and after any change to it.

## 3. Version Control

Prepare each Task’s workspace under the version-control arrangement agreed in the Spec and applicable repository conventions in `AGENTS.md`.

1. Make sure required dependency outputs are available and usable in the workspace. Arrange access to needed uncommitted and untracked files; a new worktree does not automatically contain them.
2. Apply the parallel-isolation rules in §1.1 to your Tasks, native contributions and Worker dispatches. Keep APM-managed worktrees under the session root's `.apm/worktrees/`.
3. Record the branch, any worktree and Next Action in the Tracker. Several Tasks may share a branch or workspace when the arrangement allows it.
4. In each Worker prompt, give the working directory, branch or worktree, applicable commit instructions and the session root for every `.apm/` path. Put any no-Git parallel arrangement and its constraints in Workspace per §7.1.

You prepare workspaces and handle integration and cleanup; Workers use the assigned workspace and commit instructions. Follow agreed commit and integration timing, revisiting it with the User when needed. If Git is enabled later, agree and apply the setup, recording session choices in the Spec and lasting conventions in `AGENTS.md`.

## 4. Delivery

1. Read the Worker's Task Bus, `.apm/bus/<agent-slug>/task.md`, then write the Task Prompt to it.
2. In one message, tell the User what you are sending, to whom, any dependency or isolation point that shaped the choice, and how to deliver it:
   - A Worker that has not started: start a new Worker conversation with its agent ID. It finds the waiting prompt.
   - A Worker already running: ask it to check its tasks in its conversation.
   - For a batch, give the number of Tasks and their order; for parallel dispatch, give each Worker's action.

## 5. Follow-Up Tasks

A follow-up Task sends a Task back to the same Worker after review, with a revised Task Prompt. It keeps its Task ID and stays Active.

1. Write the revised prompt per §7.3: review findings, remaining work and completion checks. Use retained Worker context and restore missing detail after Handoff or recovery.
2. Choose the next unused follow-up number for this Task, starting at 01, and set its new `log_path` per `{GUIDE_PATH:task-logging}` §5.1. This applies per Task even after a batch. In Follow-Up Context, link the original log and previous follow-up, if any. Earlier logs stay unchanged.
3. Deliver it per §4.

### 5.1 Active Task Corrections

When a planning change affects an active Task whose attempt has not been reported, correct the existing dispatch:

1. Coordinate the correction through the User, checking progress and arranging a pause if needed. Align the planning documents per `{GUIDE_PATH:task-review}` §4.
2. Revise the current Task Prompt per §2, keeping its Task ID, `log_path`, branch and worktree. In Instructions, explain what changed, what completed work remains valid and what to do next. For a batch, preserve the Task list and recorded progress, changing only affected current or unstarted Tasks. Work already marked Done needs a new Task per `{GUIDE_PATH:task-review}` §3.
3. Record the correction and next action in the Tracker and deliver per §4. This revises the current dispatch, preserving its branch and worktree.

After a reported attempt, review it and use a follow-up Task per §5 instead.

## 6. Agents Outside APM

An agent outside APM can join the Message Bus with its own bus folder. Write it a plain assignment in its Task Bus with the objective, the expected output and how to report back. Leave out Task Log paths, Handoff details and the Tracker's Agents table. Tell the User to ask that agent to read `.apm/bus/<slug>/task.md`.

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
<Working directory, branch/worktree and commit instructions where applicable, and the session root for `.apm/` paths. For no-Git parallel work: explicit writable scope, shared resources and coordination/pause conditions per §3>

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
