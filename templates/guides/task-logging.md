# APM {VERSION} - Task Logging Guide

## 1. Overview

**Reading agent:** Worker

Write a Task Log at the prompt's `log_path`, then a concise Report Bus message. The Manager uses the log to assess outcomes and coordinate further work from the recorded evidence.

## 2. Operational Standards

### 2.1 Flag Assessment Standards

Set flags from scoped observations:

- `important_findings`: new project-relevant information, dependencies, risks or constraints absent from the prompt, or findings that may affect other work. Include User corrections as directed by the execution guide.
- `compatibility_issues`: conflicts with existing code/conventions, integration concerns, breaking changes or migration requirements.

When uncertain whether a flag applies, set it to true. Explain the finding in its conditional body section.

### 2.2 Outcome Standards

Select status from results:

- Success: objective achieved and all validation passed.
- Partial: progress made but incomplete; guidance is needed.
- Failed: objective not achieved despite attempts to resolve it.

Use Partial for ambiguous or unavailable required validation, important findings that could affect other Tasks, recurring failures or uncertainty beyond your scope. State remaining work and unmet criteria. When the outcome classification is unclear, prefer Partial. Keep iterating before logging when a failure is clear and fixable, no findings require Manager attention and progress continues.

### 2.3 Detail Level Standards

Write for the Manager's next decision and future continuation. Lead with the outcome; give concrete deliverables, checks/results, limits, consequential decisions and unresolved issues. Provide paths to the relevant artifacts. Use snippets only for novel, complex or critical logic, at most 20 lines. Include diagnostic output needed to understand errors.

Use the required sections to present the evidence needed for review. Distinguish performed checks from unverified claims.

## 3. Task Logging Procedure

### 3.1 Task Log Procedure

1. Capture the completion outcome and evidence.
2. Set `stage`, `task`, `title` and `agent` from the prompt; select status and flags per §2.
3. Fill Summary, Details, Output, Validation and Issues per §4.1. Add Compatibility Concerns and Important Findings only when their flags are true. Note subagent usage when applicable.
4. Write to `log_path`. For a batch, do this after each Task, before the next begins.

### 3.2 Task Report Delivery

After the single Task or the entire batch finishes/stops:

1. Clear `.apm/bus/<agent-slug>/task.md` via terminal.
2. Read and write `.apm/bus/<agent-slug>/report.md` with the outcome, status, log path and flags per §4.2, or one batch report per §4.3. Keep detail in the logs.
3. Direct the User to the Manager with both `apm-5-check-reports <agent-id>` for targeted delivery and `apm-5-check-reports` for multiple concurrent results. Write each command the way the User runs it in their assistant.

## 4. Structural Specifications

### 4.1 Task Log Format

**Location:** `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`

**Naming Convention:**

- `<NN>`: Stage number, zero-padded (e.g., 01, 02).
- `<MM>`: Task number within Stage, zero-padded (e.g., 01, 02).

**YAML Frontmatter Schema:**

```yaml
---
stage: <N>
task: <M>
title: <Task title from Plan>
agent: <agent-slug>
status: Success | Partial | Failed
important_findings: true | false
compatibility_issues: true | false
---
```

**Field Descriptions:**

- `stage`: Stage number from the Task Prompt.
- `task`: Task number from the Task Prompt.
- `title`: Task title from the Task Prompt.
- `agent`: Your agent identifier.
- `status`: Task outcome per §2.2 Outcome Standards. `Success`, `Partial`, or `Failed`.
- `important_findings`: Whether discoveries have implications beyond current Task scope per §2.1 Flag Assessment Standards.
- `compatibility_issues`: Whether output conflicts with existing systems per §2.1 Flag Assessment Standards.

**Markdown Body Template:**

```markdown
# Task <N>.<M> - <Title>

## Summary
[1-2 sentences describing main outcome]

## Details
[Work performed, decisions made, steps taken in logical order. Note subagent usage when applicable.]

## Output
- File paths for created/modified files
- Code snippets (if necessary, ≤20 lines)
- Configuration changes
- Results or deliverables

## Validation
[Description of validation performed and result]

## Issues
[Specific blockers or errors encountered, or "None"]

## Compatibility Concerns
[Only include if compatibility_issues: true]
[Description of compatibility issues identified]

## Important Findings
[Only include if important_findings: true]
[Project-relevant discoveries that Manager must know]
```

### 4.2 Task Report Format

Task Reports are concise summaries written to the Report Bus for the Manager to process. Detail belongs in the Task Log - the report provides enough for the Manager to assess the outcome and locate the log.

**Location:** `.apm/bus/<agent-slug>/report.md`

**YAML Frontmatter Schema:**

```yaml
---
stage: <N>
task: <M>
agent: <agent-slug>
status: Success | Partial | Failed
log_path: ".apm/memory/stage-<NN>/task-<NN>-<MM>.log.md"
important_findings: true | false
compatibility_issues: true | false
---
```

**Field Descriptions:**

- `stage`: Stage number from the Task Prompt.
- `task`: Task number from the Task Prompt.
- `agent`: Your agent identifier.
- `status`: Task outcome per §2.2 Outcome Standards.
- `log_path`: Path to the Task Log for this Task.
- `important_findings`: Same value as the Task Log.
- `compatibility_issues`: Same value as the Task Log.

**Markdown Body:** 1-2 sentences summarizing the outcome. Reference the Task Log for detail.

For batch reports, use §4.3 Batch Report Format instead.

### 4.3 Batch Report Format

When completing a batch of Tasks (or stopping early on failure), the Report Bus file uses this structure.

**Location:** `.apm/bus/<agent-slug>/report.md`

**YAML Frontmatter Schema:**

```yaml
---
batch: true
batch_size: <N>
completed: <M>
stopped_early: true | false
tasks:
  - stage: 1
    task: 1
    status: Success
  - stage: 1
    task: 2
    status: Failed
  - stage: 1
    task: 3
    status: "Not started"
---
```

**Field Descriptions:**

- `batch`: Always `true` for batch reports.
- `batch_size`: Total Tasks in the batch.
- `completed`: Tasks that were executed (excludes unstarted).
- `stopped_early`: Whether the batch stopped before completing all Tasks.
- `tasks[].stage`: Stage number.
- `tasks[].task`: Task number within Stage.
- `tasks[].status`: `Success`, `Partial`, `Failed`, or `"Not started"` for unexecuted Tasks.

**Markdown Body Template:**

```markdown
# Batch Report

## Summary
[Brief overview: X of Y Tasks completed, stopped early if applicable]

## Task Outcomes

### <Title>
**Status:** [Success | Partial | Failed]
**Task Log:** `<log_path>`
[1-2 sentence summary of outcome]

...

## Batch Notes
[Any cross-cutting observations, patterns, or issues affecting multiple Tasks]
```

If the batch stopped early due to a Failed Task, indicate which Task caused the stop and list remaining Tasks as "Not started (batch stopped)."

---
