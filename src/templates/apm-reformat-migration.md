# APM Migration Reformat

You are a one-shot reformatting agent. Your job is to adapt migrated v0.5.4 APM documents to v1 format. This command should be run exactly once after `apm migrate`. Delete this file when done.

## Procedure

Execute these steps in order. Present reasoning before writing. Pause for User approval after each major artifact.

### Step 1: Read Current State

Read these files to understand the project:
1. `.apm/plan.md` — migrated Implementation Plan (v0.5.4 format)
2. `.apm/tracker.md` — empty scaffold
3. `.apm/memory/index.md` — migrated Memory Root
4. `.apm/bus/manager/handoff.md` — last Manager handover (if exists, contains active context)
5. A sample of task logs from `.apm/memory/stage-*/` — to understand task statuses and agent names

### Step 2: Reformat plan.md

Transform the v0.5.4 Implementation Plan into v1 Plan format. The v0.5.4 format uses `Phase`, `Task X.Y`, `Agent_Name`, `Objective/Output/Guidance` with numbered steps. The v1 format requires:

**YAML Frontmatter:**
```yaml
---
title: <Project Name>
modified: "Reformatted from v0.5.4 by migration reformat."
---
```

**Plan Header** (before all Stages):
- `## Agents` table: `| Agent ID | Domain | Description |` — derive from agent names found in the plan and task logs. Convert `Agent_Backend` → `backend-agent`, `Agent_Frontend_UI` → `frontend-ui-agent`, etc. (kebab-case).
- `## Stages` table: `| Stage | Name | Tasks | Agents |` — one row per stage.
- `## Dependency Graph` — generate a mermaid `graph TB` diagram with subgraphs per stage, nodes per task (with agent), solid arrows for same-agent dependencies, dotted arrows for cross-agent. Style nodes with consistent colors per agent.

**Per-Stage sections** (`## Stage N: <Name>`):

Each task uses this format:
```markdown
### Task N.M: <Title> - <Domain> Agent

* **Objective:** [from original]
* **Output:** [from original]
* **Validation:** [derive from original context — programmatic if tests mentioned, artifact if file outputs, user if approval needed]
* **Guidance:** [from original Guidance field, plus any relevant context]
* **Dependencies:** [convert from original. Bold cross-agent: **Task N.M by <Agent>**. "None" if no deps.]

1. [Step from original]
2. [Step from original]
```

**Conversion rules:**
- "Phase X" → "Stage X"
- `Task X.Ya` (letter suffix) → `Task X.Y` (drop letter, or keep as `Task X.Y-a` if disambiguation needed)
- Agent names: `Agent_Backend` → `backend-agent` (kebab-case, drop "Agent_" prefix)
- Preserve all original content — restructure, don't lose information
- Tasks marked as completed in task logs: keep them in the plan (the Manager uses plan + tracker together)

Present the reformatted plan in chat for review before writing. After User approval, write to `.apm/plan.md`.

### Step 3: Populate tracker.md

Build the tracker from real project data:

```yaml
---
title: <Project Name>
---
```

**Task Tracking** — For each stage, create a table:

```markdown
**Base:** <branch from handoff or detect from git>

**Stage N:**

| Task | Status | Agent | Branch |
|------|--------|-------|--------|
| N.1 <Title> | <status> | <agent-slug> | — |
```

Derive task statuses from task log frontmatter (`status: Completed|Partial|Blocked|Error`). Tasks without logs are `Not started`. Use the v1 agent slugs from Step 2.

**Agent Tracking:**

```markdown
| Agent | Instance | Notes |
|-------|----------|-------|
| <agent-slug> | — | Migrated from v0.5.4 |
```

**Version Control** — detect from git or handoff context:

```markdown
| Field | Value |
|-------|-------|
| Base Branch | <detected> |
| Branch Convention | <detected or "to be established"> |
```

**Working Notes** — extract key working notes from the Manager handoff file if available. These are durable observations about the project state.

Present for review, then write to `.apm/tracker.md`.

### Step 4: Clean up memory/index.md

The current memory/index.md has the full Memory_Root content dumped under Stage Summaries. Reorganize:

**Memory Notes** — Extract durable observations, patterns, and decisions from the Memory Root content. These are things that remain true regardless of which stage is active (tech stack decisions, data patterns discovered, architectural choices, user preferences).

**Stage Summaries** — Keep the per-stage/phase summaries but clean up formatting. Each should be a concise summary with:
- Outcome (what was delivered)
- Key achievements (bullet list)
- Agents involved

Remove redundant content that's already captured in task logs. The index should be a reference, not a duplication of all log content.

Present for review, then write to `.apm/memory/index.md`.

### Step 5: Completion

After all artifacts are approved and written:
1. State: "Migration reformat complete. All documents are now in v1 format."
2. Instruct the User to delete this command file: `rm .claude/commands/apm-reformat-migration.md`
3. Suggest next step: "Start a Manager session to begin v1 operations." (The exact invocation depends on the platform — a skill like `/apm-manager`, or a command like `/apm-2-initiate-manager`.)
