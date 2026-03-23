# APM {VERSION} - Task Logging Guide

## 1. Overview

**Reading Agent:** Worker

This guide defines how you log Task outcomes and report results. Task Logs capture Task-level context using structured markdown files, enabling the Manager to track progress and make review decisions without parsing raw code or chat history.

### 1.1 Outputs

- *Task Log:* Structured log at `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` capturing outcome, validation, deliverables, and flags.
- *Task Report:* Concise summary written to the Report Bus for the Manager to process.

---

## 2. Operational Standards

### 2.1 Flag Assessment Standards

Boolean flags in YAML frontmatter signal conditions requiring Manager attention. Set flags based on what you observed during execution relative to your Task Prompt and working context.

**`important_findings`:** Set to `true` when execution revealed information not in your Task Prompt that seems project-relevant, you discovered dependencies, risks, or constraints your assignment didn't account for, or something suggests other Tasks or agents might be affected.

**`compatibility_issues`:** Set to `true` when your output conflicts with existing code, patterns, or conventions you touched, you discovered integration concerns that might affect other parts of the system, or breaking changes or migration requirements resulted from your work.

**Default:** When uncertain whether a finding warrants a flag, set to `true`. False negatives hurt coordination more than false positives.

### 2.2 Outcome Standards

Status reflects whether the objective was achieved. Select based on end state, not effort expended.

- *Success:* Objective achieved, all validation passed. `failure_point: null`
- *Partial:* Some progress made but incomplete; Worker needs guidance to continue. `failure_point: <description>`
- *Failed:* Objective not achieved; Worker attempted but could not resolve the issue. `failure_point: <description>`

Use Partial when: validation is ambiguous, important findings emerged that could affect other Tasks, iteration stalled with recurring failures, or approach uncertainty depends on factors outside Worker's scope. Continue iterating (do not log yet) when validation failed but the cause is clear and fixable, no findings require Manager awareness, and progress is being made.

### 2.3 Detail Level Standards

Task Logs serve the Manager's coordination needs, not archival documentation. Ask: does this detail help the Manager understand what was accomplished? Would it affect the Manager's next review decision? Can it be found by reading the referenced artifacts directly?

**Default:** Prefer concise but comprehensive summaries with artifact references over verbose inline content. Reference artifacts by path rather than including large code blocks. Include code snippets only for novel, complex, or critical logic (20 lines or fewer). For error messages, include relevant stack traces or diagnostic details.

---

## 3. Task Logging Procedure

Execute after Task completion per `{GUIDE_PATH:task-execution}` §3.6 Task Completion.

### 3.1 Task Log Procedure

After Task execution, populate the Task Log at the path provided in the Task Prompt (`log_path`).

Perform the following actions:
1. Assess execution outcomes visibly in chat: what was delivered, what issues or important findings arose, and what to flag for the Manager.
2. Complete YAML frontmatter fields:
   - Set `status` per §2.2 Outcome Standards.
   - Set `failure_point`: `null` for Success, or a description for Partial and Failed.
   - Set `important_findings` and `compatibility_issues` per §2.1 Flag Assessment Standards.
   - Set `stage`, `task`, `title`, and `agent` from the Task Prompt.
3. Complete markdown body sections per §4.1 Task Log Format. Always include: Summary, Details, Output, Validation, Issues. Include conditional sections (Compatibility Concerns, Important Findings) only when their corresponding flag is `true`.
4. Write the Task Log to `log_path`.

### 3.2 Task Report Delivery

Perform the following actions:
1. Clear the incoming Task Bus: truncate `.apm/bus/<agent-slug>/task.md` via terminal (e.g., `truncate -s 0` or shell redirection).
2. Write the Task Report to the Report Bus: `.apm/bus/<agent-slug>/report.md`. The report is a concise summary - key outcome, status, log path, and any flags. Detail belongs in the Task Log.
3. Direct the User to deliver the report to the Manager per `{SKILL_PATH:apm-communication}` §2.1 Direct Communication - provide `/apm-5-check-reports <agent-id>` for targeted retrieval.

For batch execution, write a single batch report per `{SKILL_PATH:apm-communication}` §4.5 Batch Report Envelope Format after completing all Tasks (or stopping on failure).

---

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
failure_point: null | <description>
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
- `failure_point`: `null` for Success; description of where/why the Task didn't succeed for Partial and Failed.
- `important_findings`: Whether discoveries have implications beyond current Task scope per §2.1.
- `compatibility_issues`: Whether output conflicts with existing systems per §2.1.

**Markdown Body Template:**

```markdown
# Task <N>.<M> - <Title>

## Summary
[1-2 sentences describing main outcome]

## Details
[Work performed, decisions made, steps taken in logical order]

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

---

## 5. Content Guidelines

### 5.1 Good vs Poor Logging
- *Summary:* "Made some changes and fixed issues" → "Implemented POST /api/users with validation. All tests passing."
- *Details:* "I worked on the endpoint and there were some issues" → "Added registration route with email/password validation using express-validator"
- *Output:* "Changed some files" → "Modified: `routes/users.js`, `server.js`"
- *Validation:* "It works now" → "Test suite: 5/5 passing. Manual testing confirmed expected responses."

### 5.2 Common Mistakes

- *Setting flags too conservatively:* False negatives hurt coordination more than false positives. When uncertain, set to `true`.
- *Forgetting conditional sections:* When a flag is `true`, include the corresponding section (Compatibility Concerns, Important Findings).
- *Missing artifact references:* When deliverables are produced, list file paths in the Output section.

---

**End of Guide**
