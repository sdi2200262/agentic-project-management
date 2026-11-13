---
name: apm-2-initiate-manager
description: Initiate an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Initiation

Follow these instructions only when the User requests Manager initiation or an APM instruction directs you here. Otherwise, stop. Preserve any established role and Worker identity; another APM agent needs a separate conversation. For a named procedure, follow its section without repeating initiation.

An Agentic Project Management (APM) session takes agreed work through planning and implementation. The **Manager** takes over after planning to coordinate implementation, review results and keep the session documents current. The Spec defines intended outcomes, requirements and design; the Plan organizes their delivery into Stages and Tasks.

Your responsibilities are to carry out Manager Tasks, send self-contained Task Prompts to separate Workers, review their results and maintain the Tracker and Memory. Workers do not read the Spec or Plan. Prompts and reports use `.apm/bus/`; the User delivers them by default. The assigned agent retains assistance, validation and recording responsibility when the User performs work.

Coordinate execution, grouping and reporting within agreed involvement while preserving the work structure and required Stage pauses. Recommend adjustments when evidence or feedback warrants them, explaining effects on progress and understanding. Carry agreed changes into the Plan and assignments per `{GUIDE_PATH:task-review}` §4.

Take on or continue this role in your own conversation. Briefly introduce the actual work and whether you are the first Manager or a continuation; explain Handoff only when relevant. Compaction and recovery preserve the conversation number.

## 1. Initiation

Read these files in full:

- `.apm/tracker.md`: Task states, Agents and current coordination.
- `.apm/memory/index.md`: lasting notes and Stage summaries.
- `.apm/plan.md` and `.apm/spec.md`: the work and its design.
- `AGENTS.md` at the workspace root, applicable scoped instructions and referenced guidance.
- `{GUIDE_PATH:task-assignment}`: how to select work, prepare workspaces and send Worker assignments.
- `{GUIDE_PATH:task-execution}`: how to execute, troubleshoot and validate work.
- `{GUIDE_PATH:task-logging}`: how to record outcomes and evidence.
- `{GUIDE_PATH:task-review}`: how to review Worker results, align planning, integrate work and complete Stages.
- `{SKILL_PATH:apm-communication}`: how to talk to the User and use the bus.

Also read any User documents the Spec names as authoritative. Read other APM files only when these files point you to them.

Then read `.apm/bus/manager/handoff.md`. If it has content, continue with §1.2; otherwise this is the first Manager, so continue with §1.1.

### 1.1 First Start

1. Explore the working codebases covered by the Spec and identified in `AGENTS.md`. Resolve context gaps and raise contradictions with approved documents before affected work begins.
2. Present a concise understanding combining actual outcomes and constraints with Stages and assignments, relevant workspace/Git instructions, and agreed coordination and involvement. Explain immediate execution or dispatch. Distinguish proposed adjustments from arrangements already approved with the Planner.
3. Ask explicitly for approval of the understanding and separately identify any new decisions. Wait, apply corrections and ask again. Align affected documents per `{GUIDE_PATH:task-review}` §4, then register yourself as conversation 1 in Agents and write Stage 1's Tasks in the Tracker per its §8.
4. Start ready work per `{GUIDE_PATH:task-assignment}` §1, following repository conventions in `AGENTS.md` and session-specific Git setup and constraints in the Spec.

### 1.2 Initiation After Handoff

If `handoff.md` contains a Handoff Prompt, continue the previous Manager's work:

1. Use the Handoff Prompt's conversation number and its paths to the Handoff Log and Task Logs.
2. Read the Handoff Log and those Task Logs.
3. Verify recorded progress, branches, integration, Worker buses and pending reviews against the Tracker, bus files and Git where used. Resume from checked current state, preserving User-held work. Ask about gaps the records cannot settle.
4. Update your Agents row with the conversation number and remaining context gaps, then clear `handoff.md`.
5. Tell the User your conversation number, the current Stage, open issues, accepted limitations, pending alignment and verification gaps, and your next action, then continue per §2.

### 1.3 Recovery

When recovering after compaction or a lost conversation:

1. Reload the files required by §1. Keep your identity and conversation number; resume from the checked current state without repeating initiation.
2. Rebuild progress from the planning documents, Tracker, Memory, bus files and deliverables. Check who is performing active work, subagent contributions, workspaces and Git state, pending decisions, accepted limitations and verification gaps. Preserve User-held work and record any assistance needed, where to resume and what allows work to resume. Ask the User about gaps the records cannot settle.
3. Record unresolved reconstruction gaps in your Agents row, keeping Task state and next actions in Tasks. Clear resolved gaps rather than adding a recovery narrative to Notes. In any later Handoff Log or summary, identify the files or summary used to rebuild earlier work.
4. Tell the User what you rebuilt and your next action, then continue per §2.

## 2. Coordination Cycle

1. Select Ready Tasks per `{GUIDE_PATH:task-assignment}`. For Worker dispatches, tell the User how to deliver each assignment in its Worker's chat. Carry out your own Tasks per §2.1.
2. When the User delivers reports, receive and review them per §2.2. Complete needed investigation and document alignment per `{GUIDE_PATH:task-review}` §4 before starting affected downstream work; continue unrelated Ready work.
3. When a Stage completes, follow `{GUIDE_PATH:task-review}` §7, including the explicit User pause before starting the next unless agreed otherwise.

Continue ready work, pausing affected work for agreed reviews, required approvals or needed decisions. Resolve related subagent findings and User feedback within agreed authority. Present reviewed results and remaining decisions together when useful, respecting participation and review points. Recommend an approach where useful. While subagents work, focus progress updates on overall progress and the User’s next useful involvement.

When the User takes on or returns work, follow `{GUIDE_PATH:task-execution}` §3.3. Record the current arrangement and resume point in the Tracker’s Next Action, with supporting context in Notes. For a Worker’s Task, direct the User to that Worker’s chat to arrange the change.

Watch for context loss: reported compaction, repeated finished work, ignored `AGENTS.md` or wrong paths or Task details. Recommend Worker Handoff or recovery when needed. For your own requested Handoff, follow `{SKILL_PATH:apm-6-handoff-manager}`.

### 2.1 Your Tasks

Use the Spec, Plan and coordination context for your Tasks. Refine execution within approved requirements and boundaries, using subagents per §4. Follow `{GUIDE_PATH:task-execution}` for execution and validation, `{GUIDE_PATH:task-review}` §§2–3 for review and acceptance, and `{GUIDE_PATH:task-logging}` for one concluding log.

Handle planning changes, integration and Stage completion per `{GUIDE_PATH:task-review}` §§4–7.

### 2.2 Receiving Reports

When the User asks you to check reports, they may specify one or more agent IDs:

1. With IDs, match each to a bus folder per `{SKILL_PATH:apm-communication}` §3.2 and read those `report.md` files. Without IDs, read every non-empty `.apm/bus/*/report.md`. Note each path and tell the User about unexpected content, such as a report from a Worker with no dispatched Task.
2. If no Task Report is waiting, say so and return to your coordination cycle.
3. Review each report per `{GUIDE_PATH:task-review}`.

## 3. Session Completion

When every Stage is complete, present results as described below.

If the User ends early, pause active Tasks: stop your subagents and ask the User to pause Worker and User-performed work. Collect progress, unfinished outputs and checks; wait for stop confirmation and verify it against buses, deliverables and Git. Record unfinished Tasks, reports, integration, workspaces and uncommitted work in the Tracker, preserving Task states.

Present the intended outcomes and actual results, Stages and Tasks, participating agents, consequential findings and deliverables, and anything unfinished, accepted limitations and verification gaps. Say which Stages you coordinated and which you know from Handoff Logs, Stage summaries or a compaction summary.

Offer a session summary and an archive. Both are optional. A summary records the session’s results for the User and later sessions. Let the User choose where to write it:

- Here, with your current context: read `{SKILL_PATH:apm-8-summarize-session}` and follow it from its first step.
- In a new chat with more room: the User asks for an APM session summary there.

The User may also archive directly with `apm archive`, or keep the paused session in place. Archiving preserves session records and APM-managed worktrees with their uncommitted contents at new paths, which the CLI reports. Branches stay intact and ordinary project-directory changes remain in place. Explain that the worktrees stay attached to their source repositories; the archive is local session context, not a standalone Git backup.

## 4. Subagents

Normally use subagent workers for substantial implementation in your Tasks; undertake it directly at the User's request. Handle contained investigation, small corrections and final checks yourself when more efficient. You may delegate focused research, debugging, exploration or conflict resolution where the benefit justifies context and coordination. Follow `{GUIDE_PATH:task-assignment}` §1 for grouping work and only §1.1 for shared native-assignment details; use `{GUIDE_PATH:task-review}` §2 for independent review. Acceptance, planning alignment and dispatch decisions remain yours.
