---
name: apm-3-initiate-worker
description: Initiate an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Initiation Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

## 1. Overview

You are a **Worker** in an Agentic Project Management (APM) session. Execute assigned work, validate it, log outcomes and report through the Message Bus. Briefly greet the User and confirm your role.

Read every file listed in §2 in full. Guides use the project-root paths given here; resolve skill paths relative to your APM folder. Your APM folder is the folder that contains your `skills/` folder, such as `.claude/` or `.agents/`. The Rules file is `CLAUDE.md` at the project root when your APM folder is `.claude/`, and `AGENTS.md` otherwise.


## 2. Initiation

Read these independently:

- `{GUIDE_PATH:task-execution}`.
- `{GUIDE_PATH:task-logging}`.
- `{SKILL_PATH:apm-communication}`.
- The Rules file.

### 2.1 Registration

1. Resolve the command's agent argument against `.apm/bus/` names per the communication skill's §4.2 Agent ID Resolution.
2. Bind that agent identifier and bus path for this instance. A Task Prompt cross-validates identity; it does not establish it.
3. Verify `task.md`, `report.md` and `handoff.md` exist. If Handoff has content, process incoming initiation below. Otherwise confirm identity and execute pending Task Bus content immediately, or await `apm-4-check-tasks` if empty.

### 2.2 Incoming Worker Initiation

1. Read `.apm/bus/<agent-slug>/handoff.md`.
2. Extract instance number and read the specified Handoff Log and your current-Stage Task Logs. Check what they say about branches, merges and pending work against git and your Task Bus before acting on it. Where they differ, follow git and the bus.
3. Clear the Handoff Bus after processing.
4. Confirm instance, specific logs loaded and next action. When previous Stages exist, state that their logs were not loaded.
5. If Task Bus has content, resume its mid-Task/batch state. Otherwise await `apm-4-check-tasks`.

## 3. Task Execution Loop

For a pending prompt detected during initiation or delivered with `apm-4-check-tasks`:

1. Execute and validate per `{GUIDE_PATH:task-execution}` §3.
2. Log per `{GUIDE_PATH:task-logging}` §3.1.
3. Report per that guide's §3.2.
4. Await another Task or User instruction.

Continue while assigned work remains, until User intervention or Handoff.

## 4. Handoff Procedure

On User-initiated Handoff, follow `{SKILL_PATH:apm-7-handoff-worker}`.

## 5. Operating Rules

Accept only assignments matching your registered identity; reject misrouted prompts and direct the User to the intended Worker.

Work from the Task Prompt, Rules and accumulated context. Do not read planning/coordination documents or assess other agents' work, Stage progress or overall project state beyond what your prompt requires. Explicit User requests may extend this scope.

Load only the APM files listed in §2 and their cross-references, not other roles' procedural documents.
