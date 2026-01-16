---
name: memory-logging
description: Creation and population of Memory Logs following defined formats. Defines the Memory Logging procedure for Worker Agents and Delegate Agents.
---

# APM {VERSION} - Memory Logging Skill

## 1. Overview

**Reading Agent:** Worker Agent, Delegate Agent

This skill defines how Worker Agents and Delegate Agents log their work to the Memory System. Memory Logs capture task-level and delegation-level context using structured Markdown files, enabling the Manager Agent to track progress and make coordination decisions without parsing raw code or chat history.

### 1.1 How to Use This Skill

**Execute the Procedure.** Follow the procedure subsection matching your agent type. See §3 Memory Logging Procedure.
- Worker Agents: §3.1 Task Memory Log Procedure
- Delegate Agents: §3.2 Delegation Memory Log Procedure

**Use Problem Space for reasoning.** Consult §2.1 Detail Level Reasoning for calibrating detail. Consult §2.3 Status Reasoning for your agent type's subsection. Worker Agents also consult §2.2 Flag Assessment Reasoning.

**Use Policies for decisions.** Consult §4.1 Status Policy for your agent type's subsection. Consult §4.3 Detail Level Policy for detail decisions. Worker Agents also apply §4.2 Flag Assessment Policy.

**Output only structured blocks.** Populate Memory Logs using the formats in §5 Structural Specifications. Worker Agents use §5.1; Delegate Agents use §5.2. Keep post-completion communication minimal.

### 1.2 Objectives

- Capture task and delegation outcomes in a structured, reviewable format
- Enable Manager Agent coordination through consistent log structure
- Preserve execution context for progress tracking and handoff continuity
- Flag important findings and compatibility issues for Manager attention

### 1.3 Log Types

- **Task Memory Logs:** Written by Worker Agents after task execution
- **Delegation Memory Logs:** Written by Delegate Agents after completing delegated work

### 1.4 Reading This Skill

Some sections apply to only one agent type. These sections are marked with **(Worker Agent)** or **(Delegate Agent)** in the heading. Sections without a marker apply to both agent types.

---

## 2. Problem Space

This section establishes the reasoning approach for Memory Log creation. It guides how to determine appropriate detail level, assess flag values, and select status.

### 2.1 Detail Level Reasoning

Memory Logs serve the Manager Agent's coordination needs, not archival documentation. Calibrate detail to support coordination decisions.

**Information Value Assessment:**
- Does this detail help the Manager understand what was accomplished?
- Would this detail affect the Manager's next coordination decision?
- Can this detail be found by reading the referenced artifacts directly?

**Detail Inclusion Guidance:**
- Include: Outcomes, key decisions, blockers, validation results, artifacts produced
- Summarize: Implementation approach, steps taken, rationale for choices
- Reference (don't reproduce): Large code blocks, full file contents, verbose outputs
- Exclude: Routine operations, trivial details, information recoverable from artifacts

### 2.2 Flag Assessment Reasoning (Worker Agent)

Boolean flags in YAML frontmatter signal conditions requiring Manager attention. Set flags based on coordination impact, not subjective importance.

**Important Findings Assessment:**
- Did execution reveal information that affects other tasks or project scope?
- Did execution uncover dependencies, risks, or constraints not in the Implementation Plan?
- Would the Manager need this information to make accurate coordination decisions?

**Compatibility Issues Assessment:**
- Does the output conflict with existing systems, patterns, or conventions?
- Did execution reveal integration concerns affecting other agents' work?
- Are there breaking changes or migration requirements?

### 2.3 Status Reasoning

Status reflects outcome—whether the objective was achieved. Select status based on the end state, not effort expended. For field values and valid combinations, see §4.1 Status Policy.

#### 2.3.1 Worker Agent Status

Consider what happened during task execution:
- Did the objective get achieved with all validation passing? → Success
- Did the task fail despite iteration attempts? → Failed
- Is the task in an intermediate state where guidance would help? → Partial
- Are external factors blocking progress entirely? → Blocked

**Partial Status Reasoning:**

Partial represents an intermediate state where the Worker pauses to seek guidance rather than continuing iteration.

**When to pause (use Partial):**
- Validation is ambiguous—some criteria passed, some failed, unclear if iteration will help
- Important findings emerged that could affect other tasks or project direction
- Iteration stalled—same failures recurring despite fix attempts
- Approach uncertainty—multiple valid paths forward, choice depends on factors outside Worker's scope

**When to continue iterating (don't log yet):**
- Validation failed but the cause is clear and fixable
- No findings require Manager awareness
- Progress is being made toward resolution

#### 2.3.2 Delegate Agent Status

Consider the delegation outcome:
- Was the issue solved with findings ready for integration? → Resolved
- Was the issue not fully solved but partial findings available? → Unresolved
- Does the issue require Manager intervention beyond the calling agent? → Escalated

**Escalated Status Reasoning:**

Use Escalated when the delegated work reveals issues that the calling agent cannot address—systemic problems, incorrect Implementation Plan assumptions, or decisions requiring Manager coordination across multiple agents.

---

## 3. Memory Logging Procedure

This section defines the sequential actions for creating Memory Logs. Worker Agents follow §3.1; Delegate Agents follow §3.2.

**Output Blocks:** Memory Logs use the **Task Memory Log Format** or **Delegation Memory Log Format**. Status and flag decisions draw from §2 Problem Space for reasoning guidance and §4 Policies for decision rules. See §5 Structural Specifications.

**Procedure Flow:**
1. Task Memory Log Procedure (Worker Agents) OR
2. Delegation Memory Log Procedure (Delegate Agents)

### 3.1 Task Memory Log Procedure (Worker Agent)

After task execution, populate the Task Memory Log at the path provided in the Task Assignment (`memory_log_path`).

**Action 1:** Complete YAML frontmatter fields:
- Set `agent` to your agent identifier
- Set `task_id` to the task reference from the assignment
- Set `status` based on task outcome. See §4.1 Status Policy.
- Set `failure_point` based on where failure occurred (null if Success). See §4.1 Status Policy.
- Set boolean flags (`delegation`, `important_findings`, `compatibility_issues`). See §4.2 Flag Assessment Policy.

**Action 2:** Complete Markdown body sections:
- Always include: Summary, Details, Output, Validation, Issues, Next Steps
- Include conditional sections only when their corresponding flag is `true`
- Apply detail level guidance. See §2.1 Detail Level Reasoning.

**Action 3:** Output Task Report to User. Keep post-amble minimal—User and Manager can read the log directly.

### 3.2 Delegation Memory Log Procedure (Delegate Agent)

After completing delegated work, create and populate the Delegation Memory Log.

**Action 1:** Determine delegation log path:
- Get stage number from Delegation Prompt context
- Get next sequential delegation number for that stage
- Construct path: `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`
- Create directory if it doesn't exist

**Planning Phase Note:** For delegations initiated by Planner Agent (during Context Gathering or Work Breakdown), use stage `00` and directory `Stage_00_Planning/`. Example: `Delegation_Log_00_01_Research_Tech_Stack.md`

**Action 2:** Complete YAML frontmatter fields:
- Set `delegation_type` to the type of work performed
- Set `delegating_agent` to the agent that initiated the delegation
- Set `stage` to the stage number
- Set `status` based on outcome (`Resolved`, `Unresolved`, or `Escalated`)

**Action 3:** Complete Markdown body sections:
- Always include: Summary, Delegation Context, Findings, Resolution, Integration Notes
- Include Escalation Justification only if `status: Escalated`
- Apply detail level guidance. See §2.1 Detail Level Reasoning.

**Action 4:** Output Delegation Report to User. Keep post-amble minimal.

---

## 4. Policies

This section defines the decision rules that govern choices during Memory Log creation.

### 4.1 Status Policy

**Decision Domain:** How to set status fields.

#### 4.1.1 Worker Agent Status

**Status Field:**
- **Success:** Task objective achieved, all validation criteria passed
- **Failed:** Task attempted, validation did not pass after iteration attempts
- **Partial:** Intermediate state requiring Manager decision—execution incomplete, validation ambiguous, or findings warrant pausing
- **Blocked:** Cannot proceed due to external factors (missing dependencies, access issues, unresolvable blockers)

**Failure Point Field:**
- **null:** No failure (status is Success)
- **Execution:** Failed during task work before validation could be performed
- **Validation:** Task work completed but validation criteria not met
- **\<description\>:** Other specific failure or reason for Partial/Blocked status

**Valid Combinations:**

| Status | Failure Point | Meaning |
|--------|---------------|---------|
| Success | null | Task objective achieved, all validation passed |
| Failed | Validation | Work done, validation failed after iteration |
| Failed | Execution | Could not complete work properly |
| Partial | Execution | Work incomplete, cannot proceed independently |
| Partial | Validation | Some validation passed, some failed—needs guidance |
| Partial | \<description\> | Pausing due to findings or ambiguous state |
| Blocked | \<description\> | External factors prevent progress |

**Invalid Combinations:**
- `Success` with any failure_point other than `null`
- `Failed` with `failure_point: null`

#### 4.1.2 Delegate Agent Status

**Status Field:**
- **Resolved:** Issue solved, findings ready for integration by calling agent
- **Unresolved:** Issue not fully solved, partial findings available
- **Escalated:** Issue requires Manager intervention beyond the calling agent's scope

### 4.2 Flag Assessment Policy (Worker Agent)

**Decision Domain:** How to set boolean flags (`delegation`, `important_findings`, `compatibility_issues`).

**Delegation Flag:**
- **true:** Delegate Agent delegation occurred during task execution
- **false:** No delegation occurred

**Important Findings Flag:**
- **true:** Discoveries require Manager attention—information that affects other tasks, reveals undocumented dependencies, or impacts project scope
- **false:** No findings beyond normal task execution

**Compatibility Issues Flag:**
- **true:** Output conflicts with existing systems—breaking changes, integration concerns, or migration requirements affecting other agents' work
- **false:** No compatibility concerns identified

**Default:** When uncertain whether a finding is "important" or an issue is a "compatibility" concern, set the flag to `true`. False negatives (missing flags) are worse than false positives (extra flags) for coordination.

### 4.3 Detail Level Policy

**Decision Domain:** How much detail to include in Memory Log sections.

**Include Full Detail When:**
- Information directly affects Manager's next coordination decision
- Context would be lost without explicit documentation
- Findings are not recoverable from referenced artifacts

**Summarize When:**
- Implementation details that don't affect coordination
- Standard operations performed as expected
- Information that provides context but isn't decision-critical

**Reference Without Reproducing When:**
- Code blocks exceed 20 lines
- Full file contents available at documented paths
- Verbose outputs (logs, traces) saved to separate files

**Default:** When uncertain, prefer concise summaries with artifact references over verbose inline content.

---

## 5. Structural Specifications

This section defines the output formats for Memory Logs.

### 5.1 Task Memory Log Format (Worker Agent)

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Naming Convention:**
- `<StageNum>`: Stage number (zero-padded, e.g., 01, 02)
- `<SequentialNum>`: Sequential task number within the stage
- `<Slug>`: Brief descriptive slug derived from task title

**YAML Frontmatter Schema:**

```yaml
---
agent: <Agent_ID>
task_id: <Task_ID>
status: Success | Failed | Partial | Blocked
failure_point: null | Execution | Validation | <description>
delegation: true | false
important_findings: true | false
compatibility_issues: true | false
---
```

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

## Delegation
[Only include if delegation: true]
[Summary of Delegate Agent delegation: type, outcome, Delegation Memory Log reference]

## Important Findings
[Only include if important_findings: true]
[Project-relevant discoveries that Manager must know]

## Next Steps
[Recommendations for follow-up actions, or "None"]
```

### 5.2 Delegation Memory Log Format (Delegate Agent)

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`

**Naming Convention:**
- `<StageNum>`: Stage number
- `<SequentialNum>`: Sequential delegation number within the stage
- `<Type>`: Delegation type (Debug, Research, Refactor, or custom)
- `<Slug>`: Brief descriptive slug

**Example:** `Delegation_Log_01_02_Debug_Auth_Middleware.md`

**YAML Frontmatter Schema:**

```yaml
---
delegation_type: Debug | Research | Refactor | <Custom>
delegating_agent: <Agent_ID>
stage: <Stage_Number>
status: Resolved | Unresolved | Escalated
---
```

**Field Descriptions:**
- `delegation_type`: Type of delegation performed
- `delegating_agent`: Agent that initiated the delegation (e.g., `Backend Agent`, `Manager`)
- `stage`: Stage number where delegation was initiated
- `status`: Delegation outcome
  - `Resolved`: Issue solved, findings ready for integration
  - `Unresolved`: Issue not fully solved, partial findings available
  - `Escalated`: Issue requires Manager intervention

**Markdown Body Template:**

```markdown
# Delegation Memory Log: <Slug>

## Summary
[1-2 sentences describing delegation outcome]

## Delegation Context
[Why was this delegated? What was the calling agent trying to accomplish?]

## Findings
[Key discoveries, solutions, or information gathered]

## Resolution
[How the issue was resolved, or why it remains unresolved]

## Integration Notes
[Specific guidance for how the calling agent should integrate these findings]

## Escalation Justification
[Only include if status: Escalated]
[Concise reasoning on why this delegation requires Manager intervention]
```

---

## 6. Content Guidelines

### 6.1 Writing and Output Handling

- Summarize outcomes instead of listing every action taken
- Focus on key decisions and their rationale
- Reference artifacts by path rather than including large code blocks
- Include code snippets only for novel, complex, or critical logic (≤20 lines)
- For large outputs: save to separate file and reference the path
- For error messages: include relevant stack traces or diagnostic details

### 6.2 Good vs Poor Logging

| Aspect | Poor | Good |
|--------|------|------|
| **Summary** | "Made some changes and fixed issues" | "Implemented POST /api/users with validation. All tests passing." |
| **Details** | "I worked on the endpoint and there were some issues but I fixed them" | "Added registration route with email/password validation using express-validator" |
| **Output** | "Changed some files" | "Modified: `routes/users.js`, `server.js`" |
| **Validation** | "It works now" | "Test suite: 5/5 passing. Manual testing confirmed expected responses." |

**Key Difference:** Good logging is specific, references artifacts by path, and states outcomes clearly. Poor logging is vague and leaves the Manager guessing.

### 6.3 Common Mistakes to Avoid

- **Setting flags too conservatively:** False negatives (missing flags) hurt coordination more than false positives (extra flags). When uncertain, set the flag to `true`.
- **Including excessive detail:** Logs serve coordination, not archival documentation. Reference artifacts rather than reproducing them.
- **Forgetting conditional sections:** When a flag is `true`, the corresponding section must be included (Compatibility Concerns, Delegation, Important Findings).
- **Using Partial when iteration could help:** Partial is for pausing to seek guidance, not for giving up early. If the cause of failure is clear and fixable, continue iterating.
- **Vague summaries:** "Made some changes and fixed issues" is not useful. Specify what was done and what the outcome was.
- **Missing artifact references:** When deliverables are produced, list file paths in the Output section.

---

**End of Skill**
