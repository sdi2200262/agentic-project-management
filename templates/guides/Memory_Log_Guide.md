# APM {VERSION} - Memory Log Guide
This guide defines how Implementation Agents and Ad-Hoc Agents log their work to the APM Memory System.

## 1. Overview

Memory Logs capture task-level and delegation-level context using structured Markdown files. These logs enable Manager Agents to track progress and make coordination decisions without parsing raw code or chat history.

### 1.1. Log Types

- **Task Memory Logs:** Written by Implementation Agents after task execution
- **Delegation Logs:** Written by Ad-Hoc Agents after completing delegated work

### 1.2. Audience

- **Implementation Agents:** Read this guide to understand Task Memory Log format and workflow
- **Ad-Hoc Agents:** Read this guide to understand Delegation Log format and workflow

---

## 2. Task Memory Log Format

Task Memory Logs are stored in phase directories with naming convention:
`.apm/Memory/Phase_<NN>_<Slug>/Task_<NN>_<MM>_<Slug>.md`

### 2.1. YAML Frontmatter Schema

```yaml
---
agent: <Agent_ID>
task_ref: <Task_ID>
status: Completed | Partial | Blocked
validation_result: Passed | Failed
failure_point: null | Execution | Validation | <description>
delegation: true | false
important_findings: true | false
compatibility_issues: true | false
---
```

**Field Descriptions:**
- `agent`: Your agent identifier (e.g., `Agent_Frontend`)
- `task_ref`: Task reference from Implementation Plan (e.g., `Task 2.1`)
- `status`: Overall task status
  - `Completed`: All work finished (validation may have passed or failed)
  - `Partial`: Some progress made, specific issues identified
  - `Blocked`: Cannot proceed without external input or resolution
- `validation_result`: Whether task passed its defined validation criteria
  - `Passed`: Validation criteria met
  - `Failed`: Validation criteria not met
- `failure_point`: Where failure occurred (only set if status is not `Completed` with `Passed` validation)
  - `null`: No failure
  - `Execution`: Task work itself failed
  - `Validation`: Work completed but validation failed
  - `<description>`: Other failure with explanation
- `delegation`: Set `true` if Ad-Hoc delegation occurred during task
- `important_findings`: Set `true` if discoveries require Manager attention
- `compatibility_issues`: Set `true` if output conflicts with existing systems

### 2.2. Markdown Body Template

```markdown
# Task Log: <Task Reference>

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
[Summary of Ad-Hoc delegation: type, outcome, delegation log reference]

## Important Findings
[Only include if important_findings: true]
[Project-relevant discoveries that Manager must know]

## Next Steps
[Recommendations for follow-up actions, or "None"]
```

---

## 3. Delegation Log Format

Delegation Logs are stored in phase directories alongside Task Memory Logs with naming convention:
`.apm/Memory/Phase_<NN>_<Slug>/Delegation_<NN>_<MM>_<Type>_<Slug>.md`

Where:
- `<NN>`: Phase number
- `<MM>`: Sequential delegation number within the phase
- `<Type>`: Delegation type (Debug, Research, Refactor, or custom)
- `<Slug>`: Brief descriptive slug

Example: `Delegation_01_02_Debug_Auth_Middleware.md`

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
- `delegating_agent`: Agent that initiated the delegation (e.g., `Agent_Backend`, `Manager`)
- `phase`: Phase number where delegation was initiated
- `status`: Delegation outcome
  - `Resolved`: Issue solved, findings ready for integration
  - `Unresolved`: Issue not fully solved, partial findings available
  - `Escalated`: Issue requires Manager intervention

### 3.2. Markdown Body Template

```markdown
# Delegation Log: <Title>

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

## 4. Implementation Agent Workflow

### 4.1. Task Execution and Logging Sequence

**Action 1:** Receive Task Assignment with `memory_log_path` in YAML frontmatter

**Action 2:** Execute task work following the Task Assignment instructions

**Action 3:** Perform validation according to task's defined validation criteria:
- **Programmatic:** Run tests, compile, execute and verify expected behavior
- **Artifact:** Verify files exist, format is correct, content is complete
- **User:** Request user review/approval for subjective outputs

**Action 4:** Fill in the Memory Log at `memory_log_path`:
- Complete ALL frontmatter fields accurately
- Set `validation_result` based on validation outcome
- Set `failure_point` if validation failed or task blocked
- Complete all applicable body sections

**Action 5:** Output Task Report to User (keep post-amble minimal)

### 4.2. Validation Failure Handling

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

---

## 5. Ad-Hoc Agent Workflow

### 5.1. Delegation Logging Sequence

**Action 1:** Receive Delegation Prompt with delegation context

**Action 2:** Execute delegated work (debug, research, refactor, etc.)

**Action 3:** Determine delegation log path:
- Get phase number from delegation context
- Get next sequential delegation number for that phase
- Construct path: `.apm/Memory/Phase_<NN>_<Slug>/Delegation_<NN>_<MM>_<Type>_<Slug>.md`

**Action 4:** Create and fill Delegation Log:
- Create the file at the determined path
- Complete ALL frontmatter fields
- Complete all body sections with findings

**Action 5:** Output Delegation Report to User (keep post-amble minimal)

### 5.2. Setup Phase Delegations

For delegations initiated by Setup Agent (during Context Synthesis or Project Breakdown):
- Phase number is `00`
- Directory is `Phase_00_Setup/`
- Create directory if it doesn't exist
- Example: `.apm/Memory/Phase_00_Setup/Delegation_00_01_Research_Tech_Stack.md`

---

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
agent: Agent_Backend
task_ref: Task 2.3
status: Completed
validation_result: Passed
failure_point: null
delegation: false
important_findings: false
compatibility_issues: false
---
```
```markdown
# Task Log: Task 2.3 - API User Endpoint

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

**End of Guide**
