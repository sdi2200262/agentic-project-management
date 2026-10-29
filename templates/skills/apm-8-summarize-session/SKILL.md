---
name: apm-8-summarize-session
description: Summarize and optionally archive an APM session. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Session Summary

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

This skill writes a session summary, a dated snapshot of an APM session for the User and for later sessions, and then offers to archive the session. Use it in a new chat, or as the Manager when the work is complete or the User stops early. If you are the Planner or a Worker, tell the User and stop.

Read `{SKILL_PATH:apm-communication}`.

## 1. Summary and Archive

1. Read `.apm/spec.md`, `.apm/plan.md`, `.apm/tracker.md` and `.apm/memory/index.md`.
2. Check the recorded Worker state. Use the Manager's or User's confirmation that active Workers have stopped writing; if that is still unclear, ask the User to pause them and collect their current state before continuing.
3. Check the active session's APM files against the deliverables. Read the Task Logs and relevant Handoff Logs for consequential findings, decisions and validation limits; Stage summaries and Tracker completion labels are claims to check against those sources. Inspect relevant unfinished outputs and git state in the Worker worktrees the Tracker names; keep archived sessions and copied APM artifacts in worktrees outside this review. Establish each Stage's accepted outcome, where the files and code differ, and key findings, with validation results and, with version control, commits, branches and uncommitted work. Verify the key claims against the cited sources.
4. Write `.apm/session.summary.md` per §2.1. Separate completed, partial and missing work. Preserve accepted Partial outcomes, comparison counts, accepted deviations and required checks that were not run. Select findings that affect acceptance, future work, compatibility, reproduction or unresolved risk; give source links for consequential claims. Say where each part comes from: work you did and remember in this chat, or what you took from the files or a summary after compaction. In a new chat, all of it comes from the files.
5. Present the summary and apply the User's corrections.
6. Ask whether to archive the session. Archiving copies the session's `.apm/` files into `.apm/archives/` so a later session can use them as context, and clears the active files, including the installed APM skills and guides, so a new session can start; `apm init` reinstalls them. It is optional; if the User declines, stop here.
7. Ask for an archive name, or use the default dated name. Explain that remaining worktrees move with their uncommitted contents and stay attached to their source repositories; Tasks and branches keep their current state. Run `apm archive --force`, or `apm archive --force --name <name>`. Continue only after the CLI confirms preservation and archival succeeded. If it reports a failure, show the obstacle and current paths, and follow its recovery guidance.
8. Read `.apm/archives/index.md`, creating it per §2.2 if it is missing or malformed, and add the new archive at the top of its table.
9. Tell the User the archive's path and any relocated worktrees the CLI reported. To start a new session, the User runs `apm init` (or `apm custom`) and then invokes `apm-1-initiate-planner` in a new chat; the next Planner can use the archives.

## 2. Formats

### 2.1 Session Summary Format

```markdown
---
date: <YYYY-MM-DDTHH:MM:SSZ>
stages_completed: <N>
total_tasks: <N planned>
outcome: <complete | partial | incomplete>
---

# APM Session Summary

## Scope
<What this APM session built and why, from the Spec's Overview, and any work left for later sessions>

## Stages and Outcomes
<Per Stage: objective, accepted results, accepted Partial outcomes and material limits, with links to Stage summaries>

## Key Deliverables
<Main outputs with paths; keep the list selective and leave the source-file inventory to the logs>

## Codebase State
<Which planned deliverables exist, which are partial or missing, where the code differs from the Spec and Plan, and unfinished outputs, branches, worktrees and uncommitted changes>

## Notable Findings
<Consequential discoveries, problems and their resolution, corrections, recoveries and coordination decisions, with reasons and source links to Notes, Task Logs or Handoff Logs>

## Known Issues
<Unresolved problems, accepted deviations and limitations, open questions and required checks not run, with source links. State None only when the source review supports it.>

## Sources
<Who wrote this summary, and which parts come from its own memory of the work and which from which files; give the actual source paths>

This summary reflects the session as of <date>. The code may have changed since.
```

`outcome` is `complete` when the Tracker marks every Stage in the Plan Complete, `partial` when at least one Stage is complete, and `incomplete` when none is. These values and counts describe recorded workflow progress. They do not establish that every requirement passed; preserve accepted Partial outcomes and validation limits in the body.

### 2.2 Archive Index Format

```markdown
# APM Archive Index

| Archive | Date | Scope | Stages | Tasks |
|---------|------|-------|--------|-------|
| [session-2026-03-04-001](session-2026-03-04-001/session.summary.md) | 2026-03-04 | <What the session built, in brief> | <Stages completed> | <Total Tasks> |
```

Newest archives go at the top. Link the archive name to its session summary when one exists; otherwise link to the archive folder.

## 3. Subagents

You may use native subagents for focused work within your role's scope. Give each subagent a focused question or task, the source and workspace paths, permitted changes and expected findings. Use read-only subagents for research; allow changes for implementation or troubleshooting only within your own authority. Verify the key findings against the source before you rely on them. You remain responsible for the result. Subagents use your assistant's native tools; APM messages still travel through the User and the Message Bus.

Consider delegation for broad source review or an independent check of deliverables and Git state. You verify the evidence and write the summary, preserving consequential findings and limits.
