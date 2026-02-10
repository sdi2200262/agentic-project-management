# APM {VERSION} - Task Logging Guide

## 1. Overview

**Reading Agent:** Worker Agent

This guide defines how Worker Agents log Task outcomes and report results. Task Memory Logs capture task-level context using structured Markdown files, enabling the Manager Agent to track progress and make Coordination Decisions without parsing raw code or chat history.

### 1.1 How to Use This Guide

**Execute the Procedure** in §3 Task Logging Procedure — follow §3.1 Task Memory Log Procedure after Task Execution. **Use Operational Standards** in §2 for flag assessment (§2.1), status selection (§2.2), and detail calibration (§2.3). **Follow Structural Specifications** in §4 for output formats.

### 1.2 Objectives

- Capture task outcomes in a structured, reviewable format
- Enable Manager Agent coordination through consistent log structure
- Preserve execution context for progress tracking and handoff continuity
- Flag important findings and compatibility issues for Manager attention

### 1.3 Outputs

**Task Memory Log:** Structured log written after task execution. Captures outcome, validation results, deliverables, and flags for Manager attention. Location: `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

---

## 2. Operational Standards

### 2.1 Flag Assessment Standards

Boolean flags in YAML frontmatter signal conditions requiring Manager attention. Set flags based on what you observed during execution relative to your Task Assignment and working context.

**Important Findings Assessment** → Flag findings that appear to have implications beyond your current task scope:
- Execution revealed information not in your Task Assignment that seems project-relevant
- You discovered dependencies, risks, or constraints your assignment didn't account for
- Something suggests other tasks or agents might be affected

**Compatibility Issues Assessment** → Flag conflicts with existing systems encountered during execution:
- Your output conflicts with existing code, patterns, or conventions you touched
- You discovered integration concerns that might affect other parts of the system
- Breaking changes or migration requirements resulting from your work

**Default:** When uncertain whether a finding is "important" or an issue is a "compatibility" concern, set the flag to `true`. False negatives hurt coordination more than false positives.

### 2.2 Outcome Standards

Status reflects outcome — whether the objective was achieved. Select status based on the end state, not effort expended.

*Status Values:*
- **Success:** Objective achieved, all validation passed
- **Failed:** Validation failed after iteration attempts
- **Partial:** Intermediate state requiring Manager decision
- **Blocked:** External factors prevent progress

*Failure Point Values:*
- `null` — No failure (Success only)
- `Execution` — Failed during task work before validation
- `Validation` — Work completed but validation criteria not met
- `<description>` — Specific reason for Partial/Blocked status

*Valid Combinations:*
- Success + `null` → Objective achieved, all validation passed
- Failed + `Execution` → Could not complete work properly
- Failed + `Validation` → Work done, validation failed after iteration
- Partial + `Execution` → Work incomplete, cannot proceed independently
- Partial + `Validation` → Some validation passed, some failed — needs guidance
- Partial + `<description>` → Pausing due to findings or ambiguous state
- Blocked + `<description>` → External factors prevent progress

*Invalid:* Success with any failure_point other than `null`. Failed with `null` failure_point.

*Partial Status Reasoning* → Use Partial when: validation is ambiguous, important findings emerged that could affect other tasks, iteration stalled with recurring failures, or approach uncertainty depends on factors outside Worker's scope.

**Continue iterating (don't log yet) when:** Validation failed but the cause is clear and fixable, no findings require Manager awareness, and progress is being made toward resolution.

### 2.3 Detail Level Standards

Task Memory Logs serve the Manager Agent's coordination needs, not archival documentation.

*Assessment Questions:*
- Does this detail help the Manager understand what was accomplished?
- Would this detail affect the Manager's next coordination decision?
- Can this detail be found by reading the referenced artifacts directly?

*Default:* When uncertain, prefer concise but comprehensive summaries with artifact references over verbose inline content.

---

## 3. Task Logging Procedure

**Procedure:**
- Task Memory Log Procedure (after task execution)

### 3.1 Task Memory Log Procedure

After task execution, populate the Task Memory Log at the path provided in the Task Assignment (`memory_log_path`).

Perform the following actions:
1. Ensure the stage directory exists at the parent of `memory_log_path`. Create it if it doesn't exist.
2. Complete YAML frontmatter fields:
   - Set `agent` to your agent identifier
   - Set `task_id` to the task reference from the assignment
   - Set `status` based on task outcome per §2.2 Outcome Standards
   - Set `failure_point` based on where failure occurred (null if Success) per §2.2 Outcome Standards
   - Set boolean flags:
     - Set `important_findings` to true if discoveries appear to have implications beyond current task scope
     - Set `compatibility_issues` to true if output conflicts with existing systems encountered during execution
     - When uncertain, set the flag to `true`
3. Complete Markdown body sections:
   - Always include: Summary, Details, Output, Validation, Issues, Next Steps
   - Include conditional sections only when their corresponding flag is `true`
   - Apply detail level calibration:
     - **Include:** Outcomes, key decisions, blockers, validation results, artifacts produced
     - **Summarize:** Implementation approach, steps taken, rationale for choices
     - **Reference (don't reproduce):** Code blocks over 20 lines, full file contents, verbose outputs
     - **Exclude:** Routine operations, trivial details, information recoverable from artifacts
4. Write Task Report to Report Bus per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery. Inform User to reference the Report Bus file in the Manager session. Keep post-amble minimal.

---

## 4. Structural Specifications

### 4.1 Task Memory Log Format

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Naming Convention:**
- `<StageNum>`: Stage number (zero-padded, e.g., 01, 02)
- `<SequentialNum>`: Task number from task ID, zero-padded (e.g., Task 2.3 → 03)
- `<Slug>`: Brief descriptive slug derived from task title

**YAML Frontmatter Schema:**

    ---
    agent: <Agent_ID>
    task_id: <Task_ID>
    status: Success | Failed | Partial | Blocked
    failure_point: null | Execution | Validation | <description>
    important_findings: true | false
    compatibility_issues: true | false
    ---

**Field Descriptions:**
- `agent`: string, required. Worker Agent identifier.
- `task_id`: string, required. Task reference from Implementation Plan (e.g., `Task 2.1`).
- `status`: enum, required. Task outcome per §2.2 Outcome Standards.
- `failure_point`: string or null, required. Where/why the task didn't succeed; `null` for Success.
- `important_findings`: boolean, required. Whether discoveries have implications beyond current task scope.
- `compatibility_issues`: boolean, required. Whether output conflicts with existing systems.

**Markdown Body Template:**

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

### 4.2 Batch Report Format

When executing a batch of tasks, the Worker writes a consolidated Batch Report to the Report Bus after completing all tasks (or stopping on failure).

**YAML Frontmatter Schema:**

    ---
    batch: true
    batch_size: <N>
    completed: <M>
    stopped_early: true | false
    tasks:
    - task_ref: "<Stage>.<Task>"
      status: Success | Partial | Failed | Blocked
    - task_ref: "<Stage>.<Task>"
      status: Success | Partial | Failed | Blocked | "Not started"
    ---

**Markdown Body Template:**

    # Batch Report

    ## Summary
    [Brief overview: X of Y tasks completed, stopped early if applicable]

    ## Task Outcomes

    ### Task <N.M>: <Title>
    **Status:** [Success | Partial | Failed | Blocked]
    **Memory Log:** `<memory_log_path>`
    [1-2 sentence summary of outcome]

    ### Task <N.M+1>: <Title>
    **Status:** [Status or "Not started (batch stopped)"]
    ...

    ## Batch Notes
    [Any cross-cutting observations, patterns, or issues affecting multiple tasks]

**Fail-Fast Documentation:** If batch stopped early due to Blocked or Failed task, indicate which task caused the stop and list remaining tasks as "Not started (batch stopped)."

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

- **Summary:** "Made some changes and fixed issues" → "Implemented POST /api/users with validation. All tests passing."
- **Details:** "I worked on the endpoint and there were some issues" → "Added registration route with email/password validation using express-validator"
- **Output:** "Changed some files" → "Modified: `routes/users.js`, `server.js`"
- **Validation:** "It works now" → "Test suite: 5/5 passing. Manual testing confirmed expected responses."

Good logging is specific, references artifacts by path, and states outcomes clearly.

### 5.3 Common Mistakes

- **Including excessive detail:** Logs serve coordination, not archival documentation. Reference artifacts rather than reproducing them.
- **Vague summaries:** "Made some changes and fixed issues" is not useful. Specify what was done and the outcome.
- **Setting flags too conservatively:** False negatives hurt coordination more than false positives. When uncertain, set to `true`.
- **Forgetting conditional sections:** When a flag is `true`, include the corresponding section (Compatibility Concerns, Important Findings).
- **Using Partial when iteration could help:** Partial is for pausing to seek guidance, not for giving up early.
- **Missing artifact references:** When deliverables are produced, list file paths in the Output section.

---

**End of Guide**
