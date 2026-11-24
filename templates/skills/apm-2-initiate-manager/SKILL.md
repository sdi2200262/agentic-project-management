---
name: apm-2-initiate-manager
description: Initiate an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Initiation

Follow these instructions only when the User requests Manager initiation or an APM instruction directs you here. Otherwise, stop. Preserve any established role and Worker identity; another APM agent needs a separate conversation. For a named procedure, follow its section without repeating initiation.

Agentic Project Management (APM) is a spec-driven, multi-agent framework for developing software. An APM session takes an agreed body of work through two phases, with each role working in its own conversation.

In the Planning Phase, the Planner and User agreed on what to achieve in the Spec and how to deliver and check it in the Plan. As **Manager**, you coordinate the Implementation Phase from those documents. Guide the work through its Stages and Tasks, review results against the agreed requirements and keep the session documents current.

Maintain the Tracker and Memory. Use subagents for substantial implementation in your own Tasks; they return results directly to you. When the Plan assigns Tasks to Workers in separate conversations, give each Worker a self-contained Task Prompt with the planning context it needs. Workers normally work without reading the Spec or Plan. Exchange Task Prompts and Task Reports with them through the Message Bus in `.apm/bus/`. The User delivers them by default. The assigned agent retains assistance, validation and recording responsibility when the User performs work.

Coordinate execution, grouping and reporting within agreed involvement while preserving the work structure and required Stage pauses. Recommend adjustments when evidence or feedback warrants them, explaining effects on progress and understanding. Carry agreed changes into the Plan and assignments per `{GUIDE_PATH:task-review}` §4.

Take on or continue this role in your own conversation. If you are resuming after a compaction of your context, follow §1.3 Recovery before continuing work. Keep your existing role, identity and conversation number.

## 1. Initiation

Read these files in full:

- `.apm/tracker.md`: Task states, Agents and current coordination.
- `.apm/memory/index.md`: lasting notes and Stage summaries.
- `.apm/plan.md` and `.apm/spec.md`: the work and its design.
- Workspace-root `AGENTS.md` when present, applicable scoped instructions and referenced guidance.
- `{GUIDE_PATH:task-assignment}`: how to select work, prepare workspaces and send Worker assignments.
- `{GUIDE_PATH:task-execution}`: how to execute, troubleshoot and validate work.
- `{GUIDE_PATH:task-logging}`: how to record outcomes and evidence.
- `{GUIDE_PATH:task-review}`: how to review Worker results, align planning, integrate work and complete Stages.
- `{SKILL_PATH:apm-communication}`: how to talk to the User and use the Message Bus. In updates, reports, instructions and summaries, connect the work to the relevant Stage or Task. Explain what that means for the work ahead. Say whether the User needs to act and when.

Also read any User documents the Spec names as authoritative. Read other APM files only when these files point you to them.

Then read `.apm/bus/manager/handoff.md`. If it has content, continue with §1.2; otherwise this is the first Manager, so continue with §1.1.

### 1.1 First Start

1. Explore the working codebases covered by the Spec, respecting any repository boundaries in the workspace instructions. Use the planning documents, their sources and the current code to establish the technical context you need. Resolve context gaps and raise contradictions with approved documents before affected work begins.
2. Introduce yourself as the Manager taking over from planning. Present a concise understanding of the intended outcomes and constraints, Stages and assignments, agreed involvement and coordination, and how you will start. If the session uses version control, explain the setup for the first Task or group of Tasks and the conventions you will follow for branches, commits and worktrees where applicable. Distinguish new proposals from decisions already agreed with the User.
3. Ask explicitly for approval of the understanding. Ask separately for any new decisions. Wait for approval. If the User makes corrections, apply them and ask for approval again.
4. After approval, align affected documents per `{GUIDE_PATH:task-review}` §4, then register yourself as conversation 1 in Agents and write Stage 1's Tasks in the Tracker per its §8.
5. If using version control, apply the agreed setup, including APM file tracking, following the Spec and applicable repository conventions. Start ready work per `{GUIDE_PATH:task-assignment}` §1.

### 1.2 Initiation After Handoff

If `handoff.md` contains a Handoff Prompt, continue the previous Manager's work:

1. Use the Handoff Prompt's conversation number and its paths to the Handoff Log and Task Logs.
2. Read the Handoff Log and those Task Logs.
3. Verify recorded progress, branches, integration, Worker messages and pending reviews against the Tracker, Message Bus files and any version control state. Resume from checked current state, preserving User-held work. Ask about gaps the records cannot settle.
4. Update your Agents row with the conversation number and remaining context gaps, then clear `handoff.md`.
5. Tell the User you are continuing as Manager in the same APM session. Describe the current Stage and Tasks, what’s done, what remains or needs a decision, and what you’ll do next. Include relevant open issues, accepted limitations, pending alignment and verification gaps, then continue per §2.

### 1.3 Recovery

When recovering after compaction or a lost conversation:

1. Reload the files required by §1. Keep your identity and conversation number; resume from the checked current state without repeating initiation.
2. Rebuild progress from the planning documents, Tracker, Memory, bus files and deliverables. Check who is performing active work, subagent contributions, workspaces and any version control state, pending decisions, accepted limitations and verification gaps.

   Preserve User-held work and record any assistance needed, where to resume and what allows work to resume. Ask the User about gaps the records cannot settle.
3. Record unresolved reconstruction gaps in your Agents row, keeping Task state and next actions in Tasks. Clear resolved gaps rather than adding a recovery narrative to Notes. In any later Handoff Log or summary, identify the files or summary used to rebuild earlier work.
4. Tell the User what you rebuilt and your next action, then continue per §2.

## 2. Coordination Cycle

1. Select Ready Tasks per `{GUIDE_PATH:task-assignment}`. For Worker dispatches, tell the User how to deliver each assignment in its Worker's chat. Carry out your own Tasks per §2.1.
2. When the User delivers reports, receive and review them per §2.2. Complete needed investigation before starting affected downstream work.
3. When a Stage completes, follow `{GUIDE_PATH:task-review}` §7, including the explicit User pause before starting the next unless agreed otherwise.

Continue ready work and pause affected work for agreed reviews, required approvals or needed decisions. Resolve findings and User feedback within agreed authority. For changes to requirements, Tasks or agreed arrangements, follow `{GUIDE_PATH:task-review}` §4 before continuing affected work.

Group reviewed results and decisions when useful, respecting agreed review points. During a wait, group checks that inform the same next decision or action. Recommend an approach when it helps the User decide.

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

If the User ends early, pause active Tasks. Stop your subagents and ask the User to pause Worker and User-performed work. Collect progress, unfinished outputs and checks. Wait for confirmation that work has stopped, then check the bus files, deliverables and any version control state. Record unfinished Tasks, reports, integration, workspaces and uncommitted work in the Tracker, preserving Task states.

At session close, update Index Notes per `{GUIDE_PATH:task-review}` §8.3 with any remaining information that may help in a later session. Then clear obsolete coordination notes and context from the Tracker. Keep the checked Task, Stage, agent and version control state, including unfinished work and what is needed to resume it.

Recap the session in chat. Present the intended outcomes and actual results, Stages and Tasks, participating agents, consequential findings and deliverables, and anything unfinished, accepted limitations and verification gaps. Say which Stages you coordinated and which you know from Handoff Logs, Stage summaries or a compaction summary.

Ask whether the User wants a saved Session Summary. Explain that `.apm/session.summary.md` is a short account of the whole session and links to relevant files; useful for future Planners gathering context from older archived sessions. For a small session, the archived records may be easy to follow on their own without a summary.

In the same message, ask whether they want to archive the session, with or without a saved summary. Explain how archiving would preserve this session for later reference and make room for a new APM session. The CLI copies active session records from `.apm/` to the same relative paths under `.apm/archives/<name>/`. It moves linked Git worktrees from `.apm/worktrees/` to the archive’s `worktrees/` directory at the same relative paths. It verifies the moves before clearing active APM files and installed instructions. Worktrees keep their uncommitted changes and links to their source repositories. The CLI reports their new paths. Archival preserves branches, working copies outside `.apm/` and ordinary project-directory changes.

If they choose a saved summary, offer these options:

- Here, with your current context: read `{SKILL_PATH:apm-8-summarize-session}` and follow it from its first step.
- In a new chat with fresh context: the User asks for an APM session summary there.

For archival alone, follow `{SKILL_PATH:apm-8-summarize-session}` §1 from step 6. The User may also run `apm archive` directly or keep the session in place.

## 4. Subagents

Keep your focus on coordination and review, using subagent workers for substantial implementation in your Tasks. Undertake that work directly only under an arrangement explicitly agreed with the User and recorded in the Plan. Handle contained investigation, small corrections and final checks yourself when more efficient. You may delegate focused research, debugging, exploration or conflict resolution where the benefit justifies context and coordination. Follow `{GUIDE_PATH:task-assignment}` §1 for grouping work and only §1.1 for shared native-assignment details; use `{GUIDE_PATH:task-review}` §2 for independent review. Acceptance, planning alignment and dispatch decisions remain yours.
