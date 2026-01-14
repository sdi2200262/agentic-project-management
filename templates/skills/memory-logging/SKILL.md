---
name: memory-logging
description: Creation and population of Memory Logs following defined formats. Defines the Memory Logging procedure for Worker Agents and Delegate Agents.
---

# APM {VERSION} - Memory Logging Skill

## 1. Overview

This skill defines how APM Worker Agents and Delegate Agents log their work to the APM Memory System. APM Memory Logs capture task-level and delegation-level context using structured Markdown files. These logs enable APM Manager Agents to track progress and make coordination decisions without parsing raw code or chat history.

### 1.1. Log Types

- **Task Memory Logs:** Written by Worker Agents after task execution
- **Delegation Memory Logs:** Written by Delegate Agents after completing delegated work

### 1.2. Audience

- **Worker Agents:** Read this skill to understand Task Memory Log format and workflow
- **Delegate Agents:** Read this skill to understand Delegation Memory Log format and workflow

## 2. Task Memory Log Format

Task Memory Logs are stored in stage directories with naming convention:
`.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

Where:
- `<StageNum>`: Stage number
- `<SequentialNum>`: Sequential task number within the stage
- `<Slug>`: Brief descriptive slug

### 2.1. YAML Frontmatter Schema

```yaml
---
agent: <Agent_ID>
task_id: <Task_ID>
status: Completed | Partial | Blocked
validation_result: Passed | Failed
failure_point: null | Execution | Validation | <description>
delegation: true | false
important_findings: true | false
compatibility_issues: true | false
---
```

**Field Descriptions:**
- `agent`: Your agent identifier (e.g., `Frontend Agent`)
- `task_id`: Task reference from Implementation Plan (e.g., `Task 2.1`)
- `status`: Overall task status
  - `Completed`: All work finished (validation may have passed or failed)
  - `Partial`: Some progress made, specific issues identified
  - `Blocked`: Cannot proceed for whatever reason
- `validation_result`: Whether task passed its defined validation criteria
  - `Passed`: Validation criteria met
  - `Failed`: Validation criteria not met
- `failure_point`: Where failure occurred (only set if status is not `Completed` with `Passed` validation)
  - `null`: No failure
  - `Execution`: Task work itself failed
  - `Validation`: Work completed but validation failed
  - `<description>`: Other failure with explanation
- `delegation`: Set `true` if Delegate Agent delegation occurred during task
- `important_findings`: Set `true` if discoveries require Manager attention
- `compatibility_issues`: Set `true` if output conflicts with existing systems

### 2.2. Markdown Body Template

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

## 3. Delegation Memory Log Format

Delegation Memory Logs are stored in stage directories alongside Task Memory Logs with naming convention:
`.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`

Where:
- `<StageNum>`: Stage number
- `<SequentialNum>`: Sequential delegation number within the stage
- `<Type>`: Delegation type (Debug, Research, Refactor, or custom)
- `<Slug>`: Brief descriptive slug

Example: `Delegation_Log_01_02_Debug_Auth_Middleware.md`

### 3.1. YAML Frontmatter Schema

```yaml
---
delegation_type: Debug | Research | Refactor | <Custom>
delegating_agent: <Agent_ID>
phase: <Phase_Number>
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

### 3.2. Markdown Body Template

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
[only include if status: Escalated]
[Concise reasoning on why this delegation requires Manager intervention]
```

## 4. Worker Agent Responsibilities

### 4.1. Task Memory Log Creation

After task execution, fill in the Task Memory Log at the path provided in the Task Assignment (`memory_log_path`):
- **Action 1:** Complete ALL YAML frontmatter fields accurately:
  - Set `agent` to your agent identifier
  - Set `task_id` to the task reference from the assignment
  - Set `status` based on task outcome (`Completed`, `Partial`, or `Blocked`)
  - Set `validation_result` based on validation outcome (`Passed` or `Failed`)
  - Set `failure_point` if validation failed or task blocked
  - Set boolean flags (`delegation`, `important_findings`, `compatibility_issues`) as appropriate
- **Action 2:** Complete all applicable Markdown body sections:
  - Always include: Summary, Details, Output, Validation, Issues, Next Steps
  - Include conditional sections only when their corresponding flag is `true`
- **Action 3:** Output Task Report to User (keep post-amble minimal)

### 4.2. Validation Result Recording

If validation passes:
- Set `status: Completed`, `validation_result: Passed`, `failure_point: null`

If validation fails:
- Set `status: Completed` (work was done)
- Set `validation_result: Failed`
- Set `failure_point: Validation`
- Document what failed in the Validation section
- Include remediation suggestions in Next Steps

If execution fails before validation:
- Set `status: Blocked` or `Partial`
- Set `validation_result: Failed`
- Set `failure_point: Execution` or specific description
- Document blockers in Issues section

## 5. Delegate Agent Responsibilities

### 5.1. Delegation Memory Log Creation

After completing delegated work, create and fill the Delegation Memory Log:
- **Action 1:** Determine delegation log path:
  - Get stage number from Delegation Prompt context
  - Get next sequential delegation number for that stage
  - Construct path: `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`
- **Action 2:** Complete ALL YAML frontmatter fields:
  - Set `delegation_type` to the type of work performed
  - Set `delegating_agent` to the agent that initiated the delegation
  - Set `stage` to the stage number
  - Set `status` based on outcome (`Resolved`, `Unresolved`, or `Escalated`)
- **Action 3:** Complete all Markdown body sections:
  - Always include: Summary, Delegation Context, Findings, Resolution, Integration Notes
  - Include Escalation Justification only if `status: Escalated`
- **Action 4:** Output Delegation Report to User (keep post-amble minimal)

### 5.2. Planning Phase Delegations

For delegations initiated by Planner Agent (during Context Gathering or Work Breakdown):
- Stage number is `00`
- Directory is `Stage_00_Planning/`
- Create directory if it doesn't exist
- Example: `.apm/Memory/Stage_00_Planning/Delegation_Log_00_01_Research_Tech_Stack.md`

## 6. Content Guidelines

### 6.1. Writing Effectively

- Summarize outcomes instead of listing every action taken
- Focus on key decisions and their rationale
- Reference artifacts by path rather than including large code blocks
- Include code snippets only for novel, complex, or critical logic (≤20 lines)
- Link actions to requirements from the task/delegation description

### 6.2. Code and Output Handling

- For code changes: show relevant snippets with file paths, not entire files
- For large outputs: save to separate file and reference the path
- For error messages: include relevant stack traces or diagnostic details
- For configurations: note key settings changed and why

### 6.3. Post-Completion Brevity

After completing Memory Log or Delegation Log:
- Keep post-amble minimal
- Do not over-explain what was logged
- User and Manager can read the artifact directly

### 6.4. Quality Comparison

**Poor logging:**
"I worked on the API endpoint. I made some changes to the file. There were some issues but I fixed them. The endpoint works now."

**Good logging:**
```yaml
---
agent: Backend Agent
task_id: Task 2.3
status: Completed
validation_result: Passed
failure_point: null
delegation: false
important_findings: false
compatibility_issues: false
---
```
```markdown
# Task Memory Log: Task 2.3 - API User Endpoint

## Summary
Implemented POST /api/users endpoint with input validation. All tests passing.

## Details
- Added user registration route in routes/users.js using express-validator
- Implemented email format, password length, and required name validation
- Updated CORS settings in server.js for frontend integration

## Output
- Modified: `routes/users.js`, `server.js`
- Endpoint: POST /api/users accepts {email, password, name}
- Returns: 201 on success, 400 on validation error

## Validation
Ran test suite: 5/5 tests passing. Manual testing confirmed expected responses for valid and invalid inputs.

## Issues
None

## Next Steps
None
```

---

**End of Skill**
