---
command_name: summarize-session
description: Summarize and optionally archive an APM session.
---

# APM {VERSION} - Summarize Session Command

This command summarizes the current APM session and optionally archives it. You are a standalone agent - not a Planner, Manager, or Worker. If you are one of those roles, concisely decline and take no action.

**Procedure:**
1. Read the following artifacts directly (these reads are independent):
   - `.apm/spec.md` - design decisions and constraints
   - `.apm/plan.md` - Stages, Tasks, agent assignments
   - `.apm/tracker.md` - Task statuses, Worker states, working notes
   - `.apm/memory/index.md` - Memory notes and Stage summaries
   If working notes or Stage summaries reference specific Task Logs for claims or findings that need verification, read those logs directly. Do not read all Task Logs - comprehensive log review is handled by the subagent in step 2.
2. {SUBAGENT_GUIDANCE} Prompt it to read all `.apm/` artifacts including Task Logs in `.apm/memory/` and cross-validate against the current codebase. The subagent verifies that deliverables exist, commits are on the expected branches, and key validation results hold. It reports back: per-Stage outcomes with log-level detail, codebase staleness relative to `.apm/` state, and notable findings from execution.
3. Write `.apm/session-summary.md` per the session summary structure below. The summary is a point-in-time snapshot - state this explicitly.
4. Present the summary to the User. Ask if there is anything to add, correct, or emphasize before finalizing. If the User provides input, update the summary accordingly.
5. Ask: "Would you like me to archive this session?" If yes, ask whether the User wants a custom archive name or the default dated name.
   - If the User declines → No further action.
   - If the User approves → Continue to step 6.
6. Run `apm archive --force` or `apm archive --force --name <name>` if a custom name was provided.
7. Read `.apm/archives/index.md`. If it does not exist or is malformed, create it per the archive index format below.
8. Append an entry for the newly archived session to the index table.
9. Confirm to the User that archival is complete and direct them to run `apm init` (or `apm custom`) to reinitialize with fresh templates.

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
- *Codebase State.* How deliverables relate to `.apm/` artifacts: Tasks reflected in code, pending work, gaps between Plan and implementation.
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

---

**End of Command**
