---
name: apm-8-summarize-session
description: Summarize and optionally archive an APM session. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Session Summary

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill writes a session summary, a dated snapshot of an APM session for the User and for later sessions, and then offers to archive the session. Use it in a new chat, or as the Manager when the work is complete or the User stops early. If you are the Planner or a Worker, tell the User and stop.

Read `{SKILL_PATH:apm-communication}` if it is not already loaded.

## 1. Summary and Archive

1. Read `.apm/spec.md`, `.apm/plan.md`, `.apm/tracker.md` and `.apm/memory/index.md`.
2. Check the recorded Worker state. Use the Manager's or User's confirmation that active Workers have stopped writing; if that is still unclear, ask the User to pause them and collect their current state before continuing.
3. Compare the Spec, Plan, Tracker and Stage summaries with latest relevant Task Logs, following earlier-attempt links where needed, relevant Handoff Logs, deliverables and Git state, including unfinished worktrees. Record material differences and validation gaps with source paths. Count Tasks by ID, not attempt files. Review the active session only; ignore copied APM records in worktrees.
4. Write `.apm/session.summary.md` per §2.1. Say which work you remember from this chat and which you reconstructed from files or a compaction summary. In a new chat, all of it comes from the files.
5. Present the summary and apply the User's corrections.
6. Ask whether to archive the session. Archiving copies the session's `.apm/` files into `.apm/archives/` so a later session can use them as context, and clears the active files, including the installed APM skills and guides, so a new session can start; `apm init` reinstalls them. It is optional; if the User declines, stop here.
7. Ask for an archive name, or use the default dated name. Explain that remaining worktrees move with their uncommitted contents and stay attached to their source repositories; Tasks and branches keep their current state. Run `apm archive --force`, or `apm archive --force --name <name>`. Continue only after the CLI confirms preservation and archival succeeded. If it reports a failure, show the obstacle and current paths, and follow its recovery guidance.
8. Read `.apm/archives/index.md`, creating it per §2.2 if it is missing or malformed, and add the new archive at the top of its table.
9. Tell the User the archive's path and any relocated worktrees the CLI reported. To start a new session, the User runs `apm init` (or `apm custom`) and then invokes `apm-1-initiate-planner` in a new chat; the next Planner can use the archives.

### 1.1 Subagents

You may delegate focused work to native subagents. Give them the question, relevant paths, permitted changes and expected evidence. Keep them within your role's scope and verify their findings before using them. Native subagents are separate from APM Workers; bus messages still go through the User.

Consider delegation for broad source review or an independent check of deliverables and Git state. You verify the evidence and write the summary, preserving consequential findings and limits.

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
<Per Stage: objective, accepted results, key validation counts and scope, accepted Partial outcomes and material limits, with links to Stage summaries>

## Key Deliverables
<Main outputs with paths>

## Codebase State
<Which planned deliverables exist, which are partial or missing, where the code differs from the Spec and Plan, and unfinished outputs, branches, worktrees and uncommitted changes>

## Notable Findings
<Findings and decisions affecting acceptance, future work, compatibility, reproduction or unresolved risk, with reasons and source links>

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
| [session-2026-03-04-001](session-2026-03-04-001/session.summary.md) | 2026-03-04 | <What the session built, in brief> | <Stages completed> | <Total Tasks> |
```

List newest archives first. Link each name to its summary, or to its folder if no summary exists.
