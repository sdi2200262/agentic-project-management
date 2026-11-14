---
name: apm-8-summarize-session
description: Summarize and optionally archive an APM session. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Session Summary

Follow these instructions only when the User requests a session summary or an APM instruction directs you here. Otherwise, stop.

Write a dated session summary for the User and later sessions, then offer an archive. Follow these instructions in a new chat without adopting an APM role, or as the Manager at completion or early stopping. If you are the Planner or a Worker, tell the User and stop.

Read `{SKILL_PATH:apm-communication}` if it is not already loaded.

## 1. Summary and Archive

1. Read `.apm/spec.md`, `.apm/plan.md`, `.apm/tracker.md` and `.apm/memory/index.md`.
2. Check the recorded state of active Tasks, including subagent and User-performed work. Use the Manager’s or User’s confirmation that active work has stopped when it is still current. Otherwise ask the User to pause affected work and collect its current state before continuing.
3. Check planning documents, Tracker and Stage summaries against latest relevant Task Logs and Handoff Logs, deliverables and Git, including unfinished worktrees. Follow earlier-attempt links as needed. Record material differences and validation gaps with sources, preserving uncertainty from any reconstructed context.

   Count Task IDs, not attempts, and ignore copied APM records in worktrees. Use each section for its stated purpose; summarize conclusions and link evidence rather than copying logs or repeating the same account across sections.
4. Write `.apm/session.summary.md` per §2.1. Say which work you remember from this chat and which you reconstructed from files or a compaction summary. In a new chat, all of it comes from the files.
5. Present the summary and apply the User's corrections.
6. Propose archival: it preserves `.apm/` in `.apm/archives/` for later sessions and clears active files and installed instructions; `apm init` reinstalls them. Remaining APM-managed worktrees move with uncommitted contents and remain attached to their source repositories. Ordinary project-directory changes stay in place; Task and branch states remain unchanged. Ask explicitly whether to proceed. If the User declines, stop.
7. Ask for an archive name, or use the default dated name. Run `apm archive --force`, or `apm archive --force --name <name>`. Continue only after the CLI confirms preservation and archival succeeded. If it reports a failure, show the obstacle and current paths, and follow its recovery guidance.
8. Read `.apm/archives/index.md`, creating it per §2.2 if it is missing or malformed, and add the new archive at the top of its table.
9. Tell the User the archive's path and any relocated worktrees the CLI reported. To start a new session, the User runs `apm init` (or `apm custom`) and then starts a new Planner conversation; the next Planner can use the archives.

### 1.1 Subagents

You may delegate useful source review or independent checks of deliverables and workspace state. Read only `{GUIDE_PATH:task-assignment}` §1.1 for shared native assignment guidance. Stay within the permitted summary sources, verify findings and write the final account yourself.

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
<The session’s intended outcomes and scope, why the work was needed, what it achieved, and any work left for later sessions>

## Stages and Outcomes
<Per Stage: objective, accepted results, key validation counts and scope, accepted Partial outcomes and material limits, with links to Stage summaries>

## Key Deliverables
<Main outputs with paths>

## Codebase State
<Which planned deliverables exist, which are partial or missing, where the code differs from the Spec and Plan, and unfinished outputs, branches, worktrees and uncommitted changes>

## Notable Findings
<Consequential findings and decisions, their implications and reasons, with sources; put remaining problems in Known Issues rather than repeating them>

## Known Issues
<Unresolved problems, accepted limitations and required checks not run, with source links; None only when supported by the sources>

## Sources
<Who wrote this summary, and which parts come from its own memory of the work and which from which files; give the actual source paths>

This summary reflects the session as of <date>. The code may have changed since.
```

`outcome` is `complete` when the Tracker marks every Stage in the Plan Complete, `partial` when at least one Stage is complete, and `incomplete` when none is. These values describe workflow progress; the body preserves accepted Partial outcomes and validation limits.

### 2.2 Archive Index Format

```markdown
# APM Archive Index

| Archive | Date | Scope | Stages | Tasks |
|---------|------|-------|--------|-------|
| [session-2026-03-04-001](session-2026-03-04-001/session.summary.md) | 2026-03-04 | <What the session addressed, in brief> | <Stages completed> | <Total Tasks> |
```

List newest archives first. Link each name to its summary, or to its folder if no summary exists.
