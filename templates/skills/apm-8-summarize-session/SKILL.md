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
3. Use a subagent to check the active session's APM files, including Task Logs and Handoff Logs, against the deliverables. Inspect relevant unfinished outputs and git state in the Worker worktrees the Tracker names; keep archived sessions and copied APM artifacts in worktrees outside this review. Ask for each Stage's outcome, where the files and code differ, and key findings, with validation results and, with version control, commits, branches and uncommitted work. Verify the key claims against the cited sources.
4. Write `.apm/session-summary.md` per §2.1. Separate completed, partial and missing work. Say where each part comes from: work you did and remember in this chat, or what you took from the files or a summary after compaction. In a new chat, all of it comes from the files.
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
<Per Stage: objective, Tasks completed, notable results>

## Key Deliverables
<Main outputs with paths>

## Codebase State
<Which planned deliverables exist, which are partial or missing, where the code differs from the Spec and Plan, and unfinished outputs, branches, worktrees and uncommitted changes>

## Notable Findings
<Problems met and how they were solved, corrections, recoveries and coordination lessons, from the Notes and Task Logs>

## Known Issues
<Unresolved problems, open questions and caveats>

## Sources
<Who wrote this summary, and which parts come from its own memory of the work and which from which files>

This summary reflects the session as of <date>. The code may have changed since.
```

`outcome` is `complete` when the Tracker marks every Stage in the Plan Complete, `partial` when at least one Stage is complete, and `incomplete` when none is.

### 2.2 Archive Index Format

```markdown
# APM Archive Index

| Archive | Date | Scope | Stages | Tasks |
|---------|------|-------|--------|-------|
| session-2026-03-04-001 | 2026-03-04 | <What the session built, in brief> | <Stages completed> | <Total Tasks> |
```

Newest archives go at the top.
