---
name: apm-8-summarize-session
description: Summarize and optionally archive an APM session. Use only when the User runs this command.
disable-model-invocation: true
---

# APM {VERSION} - Summarize Session Command

Summarize the session and optionally archive it. Run as a standalone agent; Planners, Managers and Workers decline without action.

Read `{SKILL_PATH:apm-communication}` for communication and your assistant's native calls/invocations.

1. Read `.apm/spec.md`, `.apm/plan.md`, `.apm/tracker.md` and `.apm/memory/index.md` directly; these reads are independent. Read the Task Logs referenced for claims that need verification; the subagent in the next step reviews the full log set.
2. Use a subagent to check all `.apm/` artifacts, including Task Logs, against the codebase. Ask it to verify deliverables, expected commits/branches and key validation results, and return Stage outcomes, stale artifact/code differences and consequential findings. Verify critical claims against the referenced sources.
3. Write `.apm/session-summary.md` using the format below. Ground claims in artifacts and verification; distinguish completed, partial and missing work and state the snapshot's date.
4. Present the summary for review. Apply additions, corrections or emphasis the User requests before finalizing.
5. Ask whether to archive. If declined, stop. If approved, ask for a custom name or the default dated name.
6. Run `apm archive --force` or `apm archive --force --name <name>`. The CLI snapshots `.apm/` except `archives/` into `.apm/archives/<name>/`, adds archival metadata, and removes active session files, installed templates and active metadata while keeping archives.
7. Read `.apm/archives/index.md`; create it in the format below if missing or malformed.
8. Add the new archive entry, newest first.
9. Confirm archival with the archive path. To begin a fresh session, direct the User to run CLI `apm init` (or `apm custom`) for fresh templates/scaffolds, then `apm-1-initiate-planner` in their assistant. The next Planner can consult these archives during Context Gathering.

**Session summary structure:**

*Location:* `.apm/session-summary.md`

*YAML frontmatter schema:*
```yaml
---
date: <YYYY-MM-DDTHH:MM:SSZ>
project: <project name>
stages_completed: <number>
total_tasks: <number>
outcome: <complete | partial | incomplete>
---
```

*Field descriptions:*

- `date`: string, required, ISO 8601 datetime of summary creation (includes date and time).
- `project`: string, required, project name from the Spec.
- `stages_completed`: integer, required, number of completed Stages.
- `total_tasks`: integer, required, total Tasks across all Stages.
- `outcome`: enum, required, derived from session state. `complete` when the Tracker's YAML frontmatter contains `completed_at` (Manager has authoritatively confirmed). `partial` when `stages_completed >= 1` (at least one Stage finished). `incomplete` when `stages_completed == 0` (no Stages finished).

*Body sections* (order as listed):

- *Project Scope:* What was being built and why, from the Spec.
- *Stages and Outcomes.* Per-Stage summary: objective, Tasks completed, notable results.
- *Key Deliverables:* Primary outputs with file paths or descriptions.
- *Codebase State.* Compare the actual codebase against the planning artifacts: which planned deliverables exist as code, which are partial or missing, whether the code evolved past what the Spec and Plan describe, and any gaps between what was planned and what was implemented.
- *Notable Findings:* Operational lessons and patterns - issues encountered and how they were resolved, self-corrections during execution, recovery events, coordination insights. Draw from Memory notes, working notes, and Task Logs.
- *Known Issues:* Unresolved problems, open questions, or caveats.
- *Snapshot Notice:* "This summary reflects the session state as of `<datetime>`. The codebase may have diverged since this summary was created."

**Archive index format:**

*Location:* `.apm/archives/index.md`

```markdown
# APM Archive Index

| Archive | Date | Scope | Stages | Tasks |
|---------|------|-------|--------|-------|
```

*Field descriptions:*

- *Archive:* directory name (e.g., `session-2026-03-04-001`).
- *Date:* ISO date of archival.
- *Scope:* brief project description (from session summary or Spec title).
- *Stages:* number of completed Stages.
- *Tasks:* total Tasks.

Newest entries go at the top of the table.
