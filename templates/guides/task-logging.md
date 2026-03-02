# APM {VERSION} - Task Logging Guide

## 1. Overview

**Reading Agent:** Worker

This guide defines how Workers log Task outcomes and report results. Task Memory Logs capture task-level context using structured markdown files, enabling the Manager to track progress and make review decisions without parsing raw code or chat history.

### 1.1 How to Use This Guide

See §3 Task Logging Procedure - follow §3.1 Task Memory Log Procedure after Task execution. See §2 Operational Standards for visible reasoning (§2.1), flag assessment (§2.2), status selection (§2.3), and detail calibration (§2.4). See §4 Structural Specifications for output formats.

### 1.2 Objectives

- Capture Task outcomes in a structured, reviewable format
- Enable Manager coordination through consistent log structure
- Preserve execution context for progress tracking and Handoff continuity
- Flag important findings and compatibility issues for Manager attention

### 1.3 Outputs

**Task Memory Log:** Structured log written after Task execution. Captures outcome, validation results, deliverables, and flags. Location: `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

---

## 2. Operational Standards

### 2.1 Visible Reasoning

Before writing a Task Memory Log, assess execution outcomes visibly in chat: what was delivered, what important findings or issues arose, and what the Manager may need to know for coordination decisions.

### 2.2 Flag Assessment Standards

Boolean flags in YAML frontmatter signal conditions requiring Manager attention. Set flags based on what you observed during execution relative to your Task Prompt and working context.

**`important_findings`** - set to `true` when execution revealed information not in your Task Prompt that seems project-relevant, you discovered dependencies, risks, or constraints your assignment didn't account for, or something suggests other Tasks or agents might be affected.

**`compatibility_issues`** - set to `true` when your output conflicts with existing code, patterns, or conventions you touched, you discovered integration concerns that might affect other parts of the system, or breaking changes or migration requirements resulted from your work.

**Default:** When uncertain whether a finding warrants a flag, set to `true`. False negatives hurt coordination more than false positives.

### 2.3 Outcome Standards

Status reflects whether the objective was achieved. Select based on end state, not effort expended.

- *Success:* Objective achieved, all validation passed. `failure_point: null`
- *Partial:* Some progress made but incomplete; Worker needs guidance to continue. `failure_point: Execution`, `Validation`, or `<description>`
- *Failed:* Worker attempted but could not succeed; issue is within scope but beyond resolution. `failure_point: Execution` or `Validation`
- *Blocked:* External factors outside Worker scope prevent progress. `failure_point: <description>`

Use Partial when: validation is ambiguous, important findings emerged that could affect other Tasks, iteration stalled with recurring failures, or approach uncertainty depends on factors outside Worker's scope. Continue iterating (don't log yet) when validation failed but the cause is clear and fixable, no findings require Manager awareness, and progress is being made.

### 2.4 Detail Level Standards

Task Memory Logs serve the Manager's coordination needs, not archival documentation. Ask: does this detail help the Manager understand what was accomplished? Would it affect the Manager's next review decision? Can it be found by reading the referenced artifacts directly?

**Default:** Prefer concise but comprehensive summaries with artifact references over verbose inline content.

---

## 3. Task Logging Procedure

**Procedure:**
- Task Memory Log Procedure (after Task execution).

### 3.1 Task Memory Log Procedure

After Task execution, populate the Task Memory Log at the path provided in the Task Prompt (`memory_log_path`).

Perform the following actions:
1. Assess execution outcomes per §2.1 Visible Reasoning: what was delivered, what issues or important findings arose, and what to flag for the Manager.
2. Ensure the Stage directory exists at the parent of `memory_log_path`. Create it if it doesn't exist.
3. Complete YAML frontmatter fields:
   - Set `agent` to your agent identifier.
   - Set `task_id` to the Task reference from the assignment.
   - Set `status` based on Task outcome per §2.3 Outcome Standards.
   - Set `failure_point` based on where failure occurred (`null` if Success) per §2.3 Outcome Standards.
   - Set `important_findings` per §2.2 Flag Assessment Standards.
   - Set `compatibility_issues` per §2.2 Flag Assessment Standards.
4. Complete markdown body sections:
   - Always include: Summary, Details, Output, Validation, Issues, Next Steps.
   - Include conditional sections only when their corresponding flag is `true`.
   - *Include:* Outcomes, key decisions, blockers, validation results, artifacts produced.
   - *Summarize:* Implementation approach, steps taken, rationale for choices.
   - *Reference (don't reproduce):* Code blocks over 20 lines, full file contents, verbose outputs.
   - *Exclude:* Routine operations, trivial details, information recoverable from artifacts.
5. Write Task Report to Report Bus per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery. Direct User to deliver the report per the communication skill - provide the targeted command with agent identifier and the general command. Keep post-amble minimal.

For batch execution, write a batch report to the Report Bus per `{SKILL_PATH:apm-communication}` §4.5 Batch Report Envelope Format.

---

## 4. Structural Specifications

### 4.1 Task Memory Log Format

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Naming Convention:**

- `<StageNum>`: Stage number (zero-padded, e.g., 01, 02)
- `<SequentialNum>`: Task number from task ID, zero-padded (e.g., Task 2.3 → 03)
- `<Slug>`: Brief descriptive slug derived from Task title

**YAML Frontmatter Schema:**

```yaml
---
agent: <Agent_ID>
task_id: <Task_ID>
status: Success | Failed | Partial | Blocked
failure_point: null | Execution | Validation | <description>
important_findings: true | false
compatibility_issues: true | false
---
```

**Field Descriptions:**

- `agent`: string, required. Worker identifier.
- `task_id`: string, required. Task reference from Implementation Plan (e.g., `Task 2.1`).
- `status`: enum, required. Task outcome per §2.3 Outcome Standards.
- `failure_point`: string or null, required. Where/why the Task didn't succeed; `null` for Success.
- `important_findings`: boolean, required. Whether discoveries have implications beyond current Task scope.
- `compatibility_issues`: boolean, required. Whether output conflicts with existing systems.

**Markdown Body Template:**

```markdown
# Task Memory Log: <Task_ID> - <Slug>

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

## Next Steps
[Recommendations for follow-up actions, or "None"]
```

---

## 5. Content Guidelines

### 5.1 Writing and Output Handling

- Summarize outcomes instead of listing every action taken
- Focus on key decisions and their rationale
- Reference artifacts by path rather than including large code blocks
- Include code snippets only for novel, complex, or critical logic (≤20 lines)
- For large outputs: save to separate file and reference the path
- For error messages: include relevant stack traces or diagnostic details

### 5.2 Good vs Poor Logging

- *Summary:* "Made some changes and fixed issues" → "Implemented POST /api/users with validation. All tests passing."
- *Details:* "I worked on the endpoint and there were some issues" → "Added registration route with email/password validation using express-validator"
- *Output:* "Changed some files" → "Modified: `routes/users.js`, `server.js`"
- *Validation:* "It works now" → "Test suite: 5/5 passing. Manual testing confirmed expected responses."

### 5.3 Common Mistakes

- *Including excessive detail:* Logs serve coordination, not archival documentation. Reference artifacts rather than reproducing them.
- *Vague summaries:* "Made some changes and fixed issues" is not useful. Specify what was done and the outcome.
- *Setting flags too conservatively:* False negatives hurt coordination more than false positives. When uncertain, set to `true`.
- *Forgetting conditional sections:* When a flag is `true`, include the corresponding section (Compatibility Concerns, Important Findings).
- *Using Partial when iteration could help:* Partial is for pausing to seek guidance, not for giving up early.
- *Missing artifact references:* When deliverables are produced, list file paths in the Output section.

---

**End of Guide**
