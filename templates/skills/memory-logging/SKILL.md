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

**Use Problem Space for reasoning.** Consult §2.2 Status Reasoning for your agent type's subsection. Worker Agents also consult §2.1 Flag Assessment Reasoning.

**Use Policies for decisions.** Consult §4.1 Outcome Fields Policy for your agent type's subsection. Consult §4.3 Detail Level Policy for detail decisions. Worker Agents also apply §4.2 Flag Assessment Policy.

**Output only structured blocks.** Populate Memory Logs using the formats in §5 Structural Specifications. Worker Agents use §5.1; Delegate Agents use §5.2. Keep post-completion communication minimal.

### 1.2 Objectives

- Capture task and delegation outcomes in a structured, reviewable format
- Enable Manager Agent coordination through consistent log structure
- Preserve execution context for progress tracking and handoff continuity
- Flag important findings and compatibility issues for Manager attention

### 1.3 Outputs

**Task Memory Log:** Structured log written by Worker Agents after task execution. Captures outcome, validation results, deliverables, and flags for Manager attention. Location: `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Delegation Memory Log:** Structured log written by Delegate Agents after completing delegated work. Captures findings, resolution, and integration notes for the calling agent. Location: `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`

### 1.4 Reading This Skill

Some sections apply to only one agent type. These sections are marked with **(Worker Agent)** or **(Delegate Agent)** in the heading. Sections without a marker apply to both agent types.

---

## 2. Problem Space

This section establishes the reasoning approach for Memory Log creation. It guides how to assess flag values and select status.

### 2.1 Flag Assessment Reasoning (Worker Agent)

Boolean flags in YAML frontmatter signal conditions requiring Manager attention. Set flags based on what you observed during execution relative to your Task Assignment and working context.

**Important Findings Assessment:**

Flag findings that appear to have implications beyond your current task scope:
- Did execution reveal information not mentioned in your Task Assignment that seems relevant to the broader project?
- Did you discover dependencies, risks, or constraints that your assignment didn't account for?
- Did you encounter something that suggests other tasks or agents might be affected?

You cannot know the full project context—flag anything that *seems* significant from your scoped view. The Manager has full artifact awareness and will assess actual impact.

**Compatibility Issues Assessment:**

Flag conflicts with existing systems you encountered during execution:
- Does your output conflict with existing code, patterns, or conventions you touched?
- Did you discover integration concerns that might affect other parts of the system?
- Are there breaking changes or migration requirements resulting from your work?

### 2.2 Status Reasoning

Status reflects outcome—whether the objective was achieved. Select status based on the end state, not effort expended. For field values and valid combinations, see §4.1 Outcome Fields Policy.

#### 2.2.1 Task Status Reasoning (Worker Agent)

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

#### 2.2.2 Delegation Status Reasoning (Delegate Agent)

Consider the delegation outcome:
- Was the issue solved with findings ready for integration? → Resolved
- Was the issue not fully solved but partial findings available? → Unresolved

**Unresolved Status Reasoning:**

Use Unresolved when the delegated work did not fully solve the issue but produced partial findings. Document what was discovered, what remains unclear, and any observations that might help the calling agent or Manager determine next steps. The calling agent receives the findings and decides how to proceed—either incorporating partial results, requesting further investigation, or surfacing the issue to the Manager for coordination.

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
- Set `status` based on task outcome. See §4.1 Outcome Fields Policy.
- Set `failure_point` based on where failure occurred (null if Success). See §4.1 Outcome Fields Policy.
- Set boolean flags (`delegation`, `important_findings`, `compatibility_issues`). See §4.2 Flag Assessment Policy.

**Action 2:** Complete Markdown body sections:
- Always include: Summary, Details, Output, Validation, Issues, Next Steps
- Include conditional sections only when their corresponding flag is `true`
- Apply detail level guidance. See §4.3 Detail Level Policy.

**Action 3:** Output Task Report to User. Keep post-amble minimal—User and Manager can read the log directly.

### 3.2 Delegation Memory Log Procedure (Delegate Agent)

After completing delegated work, create and populate the Delegation Memory Log.

**Action 1:** Determine delegation log path:
- Get stage number from Delegation Prompt context
- Get next sequential delegation number: List existing `Delegation_Log_*` files in the stage directory and use the next sequential number (01 if none exist)
- Construct path: `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`
- Create directory if it doesn't exist

**Planning Phase Note:** For delegations initiated by Planner Agent (during `{SKILL_PATH:context-gathering/SKILL.md}` or `{SKILL_PATH:work-breakdown/SKILL.md}`), use stage `00` and directory `Stage_00_Planning/`. Example: `Delegation_Log_00_01_Research_Tech_Stack.md`

**Action 2:** Complete YAML frontmatter fields:
- Set `delegation_type` to the type of work performed
- Set `delegating_agent` to the agent that initiated the delegation
- Set `stage` to the stage number
- Set `status` based on outcome (`Resolved` or `Unresolved`)

**Action 3:** Complete Markdown body sections:
- Always include: Summary, Delegation Context, Findings, Resolution, Integration Notes
- Apply detail level guidance. See §4.3 Detail Level Policy.

**Action 4:** Output Delegation Report to User. Keep post-amble minimal.

---

## 4. Policies

This section defines the decision rules that govern choices during Memory Log creation.

### 4.1 Outcome Fields Policy

**Decision Domain:** How to set outcome fields in Memory Logs.

#### 4.1.1 Task Outcome Fields (Worker Agent)

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

#### 4.1.2 Delegation Outcome Fields (Delegate Agent)

**Status Field:**
- **Resolved:** Issue solved, findings ready for integration by calling agent
- **Unresolved:** Issue not fully solved, partial findings available for calling agent to assess

### 4.2 Flag Assessment Policy (Worker Agent)

**Decision Domain:** How to set boolean flags (`delegation`, `important_findings`, `compatibility_issues`).

**Delegation Flag:**
- **true:** Delegate Agent delegation occurred during task execution
- **false:** No delegation occurred

**Important Findings Flag:**
- **true:** Discoveries that appear to have implications beyond your current task—information not in your Task Assignment that seems project-relevant, unexpected dependencies or constraints, or anything suggesting other tasks might be affected
- **false:** No findings beyond what was expected from the Task Assignment

**Compatibility Issues Flag:**
- **true:** Your output conflicts with existing systems you encountered—breaking changes, integration concerns with code you touched, or migration requirements resulting from your work
- **false:** No compatibility concerns observed in your working context

**Default:** When uncertain whether a finding is "important" or an issue is a "compatibility" concern, set the flag to `true`. False negatives (missing flags) hurt coordination more than false positives. The Manager has full artifact awareness and will assess actual impact.

### 4.3 Detail Level Policy

**Decision Domain:** How much detail to include in Memory Log sections.

#### 4.3.1 Task Detail Level (Worker Agent)

Task Memory Logs serve the Manager Agent's coordination needs, not archival documentation. Calibrate detail to support coordination decisions.

**Assessment Questions:**
- Does this detail help the Manager understand what was accomplished?
- Would this detail affect the Manager's next coordination decision?
- Can this detail be found by reading the referenced artifacts directly?

**Detail Guidance:**
- **Include:** Outcomes, key decisions, blockers, validation results, artifacts produced
- **Summarize:** Implementation approach, steps taken, rationale for choices
- **Reference (don't reproduce):** Code blocks over 20 lines, full file contents, verbose outputs
- **Exclude:** Routine operations, trivial details, information recoverable from artifacts

**Default:** When uncertain, prefer concise but comprehensive summaries with artifact references over verbose inline content.

#### 4.3.2 Delegation Detail Level (Delegate Agent)

Delegation Memory Logs serve the calling agent's needs. Calibrate detail to the delegation request—if the calling agent requested comprehensive research findings, include them in full.

**Assessment Questions:**
- What level of detail did the calling agent request?
- Does the calling agent need this information to complete their task?
- Is this finding essential for the Integration Notes to make sense?

**Default:** When uncertain, prefer including findings that support integration over brevity. The calling agent can skim if needed, but cannot recover omitted details.

---

## 5. Structural Specifications

This section defines the output formats for Memory Logs.

### 5.1 Task Memory Log Format (Worker Agent)

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Naming Convention:**
- `<StageNum>`: Stage number (zero-padded, e.g., 01, 02)
- `<SequentialNum>`: Task number from task ID, zero-padded (e.g., Task 2.3 → 03)
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
- **Type:** [Debug|Research|Refactor|Custom]
- **Log:** [Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md]
- **Outcome:** [Resolved|Unresolved]
- **Summary:** [Brief description of what was delegated and key findings]

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
status: Resolved | Unresolved
---
```

**Field Descriptions:**
- `delegation_type`: Type of delegation performed
- `delegating_agent`: Agent that initiated the delegation (e.g., `Backend Agent`, `Manager`)
- `stage`: Stage number where delegation was initiated
- `status`: Delegation outcome
  - `Resolved`: Issue solved, findings ready for integration
  - `Unresolved`: Issue not fully solved, partial findings available for calling agent to assess

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

**Task Memory Log (Worker Agent):**

| Aspect | Poor | Good |
|--------|------|------|
| **Summary** | "Made some changes and fixed issues" | "Implemented POST /api/users with validation. All tests passing." |
| **Details** | "I worked on the endpoint and there were some issues but I fixed them" | "Added registration route with email/password validation using express-validator" |
| **Output** | "Changed some files" | "Modified: `routes/users.js`, `server.js`" |
| **Validation** | "It works now" | "Test suite: 5/5 passing. Manual testing confirmed expected responses." |

**Delegation Memory Log (Delegate Agent):**

| Aspect | Poor | Good |
|--------|------|------|
| **Findings** | "Found some issues with the code" | "Auth middleware fails on expired tokens due to missing refresh logic in `auth.js:45`" |
| **Resolution** | "Fixed it" | "Added token refresh check before validation. Tested with expired tokens—now returns 401 with refresh prompt." |
| **Integration Notes** | "Should work now" | "Calling agent should update error handling to catch new `TOKEN_REFRESH_NEEDED` error code." |

**Key Difference:** Good logging is specific, references artifacts by path, and states outcomes clearly. Poor logging is vague and leaves the reader guessing.

### 6.3 Common Mistakes to Avoid

**Both Agent Types:**
- **Including excessive detail:** Logs serve coordination, not archival documentation. Reference artifacts rather than reproducing them.
- **Vague summaries:** "Made some changes and fixed issues" is not useful. Specify what was done and what the outcome was.

**Task Memory Log (Worker Agent):**
- **Setting flags too conservatively:** False negatives hurt coordination more than false positives. When uncertain, set the flag to `true`.
- **Forgetting conditional sections:** When a flag is `true`, include the corresponding section (Compatibility Concerns, Delegation, Important Findings).
- **Using Partial when iteration could help:** Partial is for pausing to seek guidance, not for giving up early.
- **Missing artifact references:** When deliverables are produced, list file paths in the Output section.

**Delegation Memory Log (Delegate Agent):**
- **Vague Integration Notes:** The calling agent needs specific guidance on how to use your findings—not just "should work now."
- **Not explaining Unresolved status:** When Unresolved, clearly state what was discovered, what remains unclear, and what might help.

---

**End of Skill**
