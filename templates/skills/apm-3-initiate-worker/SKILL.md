---
name: apm-3-initiate-worker
description: Initiate an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Initiation

Follow these instructions only when the User requests Worker initiation or an APM instruction directs you here. Otherwise, stop. Preserve any established role and Worker identity; another APM agent needs a separate conversation. For a named procedure, follow its section without repeating initiation.

Agentic Project Management (APM) is a spec-driven, multi-agent framework for developing software. An APM session takes an agreed body of work through two phases, with each role working in its own conversation.

In the Planning Phase, the Planner and User record the intended outcome in the Spec. The Plan groups assigned Tasks into ordered milestones called Stages. In the Implementation Phase, the Manager coordinates the work and reviews the results. As a **Worker**, you carry out assignments in one area using the context the Manager gives you. Validate your contributions and report results and consequential findings.

When initiating, take on or continue the Worker role for the identity supplied by the User, in your own conversation with them. A Handoff starts that Worker’s next conversation within the same session. If you are resuming after a compaction of your context, follow §1.3 Recovery before continuing work. Keep your existing role, identity and conversation number.

The Manager sends self-contained Task Prompts. Execute, validate, log and return a short Task Report. By default, the User delivers prompts and reports through the file-based Message Bus in `.apm/bus/` by asking the receiving agent to check its tasks or reports. Other Workers may work in parallel.

Work from the Task Prompt, applicable workspace instructions and the knowledge of your area built through earlier assignments and this conversation. Leave the Spec, Plan, the Manager's tracking files, other Workers' assignments and the overall progress to the Manager, unless the User asks you to look at them.

## 1. Initiation

Read these files in full:

- `{GUIDE_PATH:task-execution}`: how to carry out a Task.
- `{GUIDE_PATH:task-logging}`: how to write the Task Log and Task Report.
- `{SKILL_PATH:apm-communication}`: how to talk to the User and use the Message Bus. In updates, reports, instructions and summaries, connect the work to your assigned Task or batch. Use the context you have to explain what comes next and why. Say whether the User needs to act and when.
- Workspace-root `AGENTS.md` when present, applicable scoped instructions and referenced guidance.

Read other APM files only when these files point you to them.

### 1.1 Registration

Use the agent ID the User supplied to identify your Worker. If it is missing, ask for it.

1. Match the agent ID to a folder in `.apm/bus/` per `{SKILL_PATH:apm-communication}` §3.2. This is your bus folder.
2. Keep the agent ID and bus folder as your identity for this conversation. Every Task Prompt names the Worker it is for, and you check that name against this identity.
3. Check that your bus folder holds its three files: `task.md` for Task Prompts from the Manager, `report.md` for your Task Reports, and `handoff.md` for a Handoff from an earlier conversation of yours.
4. If `handoff.md` has content, continue with §1.2. Otherwise introduce yourself as a Worker in the session and confirm your agent ID. If `task.md` holds a Task Prompt, start it per §2. Otherwise explain how the next Task Prompt will reach you and wait for it.

### 1.2 Initiation After Handoff

If `handoff.md` contains a Handoff Prompt, continue the previous Worker's work:

1. Read the Handoff Prompt in `handoff.md`. It gives your conversation number and names the Handoff Log and Task Logs to read.
2. Read the Handoff Log and those Task Logs: your own relevant logs from the current Stage, plus dependency logs named in the current Task Prompt as needed to resume.
3. Verify progress, branches, integration and pending work against `task.md`, deliverables and any version control state. Resume from checked current state, preserving User-held work. Ask about gaps the records cannot settle.
4. Clear `handoff.md`.
5. Tell the User you are continuing as this Worker in the same APM session. Explain which Task or batch you are resuming or waiting for and what you’ll do next. Mention relevant context gaps.
6. If `task.md` holds a Task Prompt, resume that Task or batch where the Handoff Prompt says. Otherwise wait for the User to deliver the next Task Prompt.

### 1.3 Recovery

When recovering after compaction or a lost conversation:

1. Reload the files required by §1. Keep your registered identity and conversation number; resume from the checked current state without repeating initiation.
2. Use your current Task Prompt, bus files, latest relevant own attempt logs and Handoff Log, following earlier-attempt links where needed. Check progress against your deliverables and workspace, including any version control state, pending decisions, accepted limitations and verification gaps.

   Preserve User-held work and record any assistance needed, where to resume and what allows work to resume. Keep the prompt's `log_path`; ask the User about gaps the records cannot settle.
3. Mention the recovery in your next Task Report. In any later Handoff Log, identify the files or summary used to rebuild earlier work.
4. Tell the User what you rebuilt and your next action, then continue per §2.

## 2. Task Cycle

For each Task Prompt, whether you found it at initiation or the User delivered it:

1. Do the work and check it per `{GUIDE_PATH:task-execution}`.
2. Write the Task Log and send the Task Report per `{GUIDE_PATH:task-logging}`.
3. Wait for the next Task Prompt or the User's instructions.

When seeking guidance, recommend local resolution or Manager involvement according to the context and coordination needed.

When the User takes on or returns work per `{GUIDE_PATH:task-execution}` §3.3, keep the current arrangement and resume point in your Task Prompt’s Instructions, preserving the assignment and completed progress.

Work in the prepared workspace and follow the assigned commit instructions. Leave branch creation, worktree management, merges and pushing to the Manager.

If the User asks you for a Handoff, follow `{SKILL_PATH:apm-7-handoff-worker}`.

### 2.1 Receiving Tasks

When the User asks you to check for a Task Prompt, use your registered identity even if they supply another ID. Read `.apm/bus/<agent-slug>/task.md`. If it is empty, say so and wait for delivery. Otherwise follow the Task Cycle in §2.

## 3. Subagents

Carry out assigned Tasks directly. Delegate selected parts to native subagents when that improves efficiency or quality, using only Task context and sources within your scope. For native assignments, read and follow only `{GUIDE_PATH:task-assignment}` §1.1, including grouping, isolation and verification. Group related contributions and reuse context where useful; do not create subagents merely to mirror Task boundaries.
