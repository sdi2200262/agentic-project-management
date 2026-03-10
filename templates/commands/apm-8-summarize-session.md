---
command_name: summarize-session
description: Summarizes a completed APM session and optionally archives it for future reference.
---

# APM {VERSION} - Summarize Session Command

## 1. Overview

This command produces a summary of the current APM session and optionally archives it. It is a standalone command — not a Planner, Manager, or Worker workflow. Run it in a fresh session after project completion.

Read the following artifacts to build a complete picture of the session:
- `.apm/spec.md` - design decisions and constraints
- `.apm/plan.md` - Stages, Tasks, agent assignments
- `.apm/tracker.md` - task statuses, agent states, working notes
- `.apm/memory/index.md` - memory notes and stage summaries

---

## 2. Summarization Procedure

Perform the following actions:

1. Read all artifacts listed in §1 Overview.
2. For each Stage, review the stage summary in the Index. Where verification is needed, {PLANNER_SUBAGENT_GUIDANCE} to confirm key deliverables exist and match expectations.
3. Write `.apm/session-summary.md` per §4 Session Summary Structure. The summary is a point-in-time snapshot — state this explicitly.
4. Present the summary to the User.
5. Ask in a single message: "Would you like me to archive this session? If so, does this session continue from a previous one?"
   - If the User declines → Done.
   - If the User approves → Continue to §3 Archival Procedure.

---

## 3. Archival Procedure

Perform the following actions:

1. Determine the `apm archive` command arguments:
   - If the User indicated this continues a previous session, identify the archive name and use `--continues <name>`.
   - Always use `--force` to skip the confirmation prompt (the User already confirmed in §2).
2. Run `apm archive [--continues <name>] --force`.
3. Read `.apm/archives/index.md`. If it does not exist or is malformed, create it per §5 Archive Index Format.
4. Append an entry for the newly archived session to the index table.
5. Confirm to the User that archival is complete and fresh templates are ready.

---

## 4. Session Summary Structure

**Location:** `.apm/session-summary.md`

**YAML Frontmatter Schema:**

```yaml
---
date: <YYYY-MM-DD>
project: <project name>
stages_completed: <number>
total_tasks: <number>
outcome: <Success | Partial | Incomplete>
---
```

**Field Descriptions:**

- `date`: string, required, ISO date of summary creation.
- `project`: string, required, project name from the Spec.
- `stages_completed`: integer, required, number of completed Stages.
- `total_tasks`: integer, required, total Tasks across all Stages.
- `outcome`: enum, required, overall session outcome. `Success` when all Stages completed and deliverables verified. `Partial` when some Stages completed but work remains. `Incomplete` when significant work remains unfinished.

**Body sections** (order as listed):

- *Project Scope* — What was being built and why, from the Spec.
- *Stages and Outcomes* — Per-Stage summary: objective, Tasks completed, notable results.
- *Key Deliverables* — Primary outputs with file paths or descriptions.
- *Notable Findings* — Patterns, issues, or insights from memory notes and working notes.
- *Known Issues* — Unresolved problems, open questions, or caveats for future sessions.
- *Snapshot Notice* — "This summary reflects the session state as of `<date>`. The codebase may have diverged since this summary was created."

---

## 5. Archive Index Format

**Location:** `.apm/archives/index.md`

```markdown
# APM Archive Index

| Archive | Date | Scope | Stages | Tasks | Continues |
|---------|------|-------|--------|-------|-----------|
```

**Field Descriptions:**

- *Archive:* directory name (e.g., `session-2026-03-04-001`).
- *Date:* ISO date of archival.
- *Scope:* brief project description (from session summary or Spec title).
- *Stages:* number of completed Stages.
- *Tasks:* total Tasks.
- *Continues:* previous archive name if continuation, otherwise `—`.

Newest entries go at the top of the table.

---

**End of Command**
