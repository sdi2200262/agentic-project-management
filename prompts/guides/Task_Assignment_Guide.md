# APM v0.4 - Task Assignment Guide
This guide defines how Manager Agents issue task assignments to Implementation Agents and evaluate their completion. It defines two Task Assignment Prompt variants:
- Markdown
- JSON
Task assignments coordinate agent work during the Task Loop of an APM session, following the Implementation Plan.

---

## 1. Task Loop Overview
Manager Agent issues Task Assignment Prompt → User passes to Implementation Agent → Implementation Agent executes task and logs work → User returns log to Manager → Manager reviews and determines next action (continue, follow-up, delegate, or plan update).

---

## 2. Task Assignment Prompt Format
Task Assignment Prompts must correlate 1-1 with Implementation Plan tasks and include all necessary context for successful execution. Manager Agent must issue these prompts following this format:

### 2.1. Prompt Structure with YAML Frontmatter
Include optional sections only when their front-matter boolean is true
```yaml
---
task_ref: "Task <m.n> - Title"
agent_assignment: "Agent_<Domain>"
memory_log_path: "path/to/log/file"
execution_type: "single-step | multi-step"
dependency_context: true | false
ad_hoc_delegation: true | false
---
```
```markdown
# APM Task Assignment: [Task Title]

## Task Reference
Implementation Plan: **Task X.Y - [Title]** assigned to **[Agent_<Domain>]**

## Context from Dependencies
[Only include if dependency_context: true]
[Manager fills this section with section §4 content guidance]

## Objective
[One-sentence task goal from Implementation Plan]

## Detailed Instructions
[Based on Implementation Plan subtasks:]
- For single-step tasks: "Complete all items in one response"
- For multi-step tasks: "Complete in X exchanges, one step per response. **AWAIT USER CONFIRMATION** before proceeding to each subsequent step."
- Transform subtask bullets into actionable instructions specifying: what to do, how to approach it, where to implement, and what constraints/libraries to use
- Include context from task Objective, Output, and Guidance fields

## Expected Output
- Deliverables: [from Implementation Plan Output field]
- Success criteria: [clear completion definition]
- File locations: [specific paths for created/modified files]

## Memory Logging
Upon completion, you **MUST** log work in: `[memory_log_path]`
Follow `guides/Memory_Log_Guide.md` instructions.

## Ad-Hoc Delegation
[Only include if ad_hoc_delegation: true]
[Manager fills this section with section §7 content guidance]
```

### 2.2. Delivery Format
Present Task Assignment Prompts in **markdown code blocks with YAML frontmatter included.** This ensures smooth workflow transfer between Manager and Implementation Agents via the User.

---

## 3. JSON Variant Specification
JSON prompts follow identical content requirements as Markdown but use schema validation at `prompts/schemas/task_assignment.schema.json`. All sections for context, instructions, outputs, and logging apply as described above.

---

## 4. Context Dependency Integration
When consumer tasks depend on producer outputs ("Depends on: Task X.Y Output" in Implementation Plan Guidance), Manager provides context based on agent assignment:
- **Same agent assigned to producer & consumer**: Minimal context - reference "your previous work from Task X.Y"
- **Different agents**: Comprehensive integration context (see §4.1)

### 4.1. Different Agent Context Provision
For cross-agent dependencies, include in "Context from Dependencies":
1. **Producer Summary**: What Task X.Y built and its core functionality
2. **Output Locations**: Specific file paths and access instructions
3. **Integration Pathway**: Preliminary steps before main task execution (examples):
    - Review producer deliverables to understand their design and structure
    - Examine documentation and specifications created by producer if any
    - Understand interfaces, contracts, and data formats established
4. **Usage Notes**: How outputs integrate with current task

**Example context for cross-agent dependencies task prompt:**
```markdown
## Context from Dependencies
This Task is based on Task 2.1 which created authentication API with:
- Endpoints: `src/api/auth.js` implementing POST /api/login
- Documentation: `docs/auth-api.md` with request/response schemas
- Tests: `tests/api/auth.test.js` showing usage examples

Integration steps before main task:
1. Review API documentation for endpoint details
2. Run `npm test tests/api/auth.test.js` to see working examples
3. Note JWT token format for frontend state management
```

### 4.2. Blocked Dependencies
If producer task status is Partial/Blocked:
- First attempt resolution via follow-up prompt(s)
- OR adapt consumer task to work with available outputs
- OR update Implementation Plan to restructure dependencies

---

## 5. Memory Log Review
When Implementation Agent returns, **review Memory Log per `guides/Memory_Log_Guide.md` section §5**. Assess task completion status, identify blockers, and verify outputs match Implementation Plan expectations.

---

## 6. Next Action Framework
Based on log review, determine appropriate next step:

### 6.1. Continue Workflow
- Task complete and successful → Issue **next Task Assignment Prompt** per Implementation Plan (Task Loop continues)
- Phase complete → **Create phase summary**, begin next phase

### 6.2. Follow-Up Actions
- Task needs refinement → Send correction **follow-up prompt** to same agent
- Technical blockers persist → Consider **Ad-Hoc delegation**
- Plan assumptions invalid or any other changes needed → **Update Implementation Plan**

### 6.3. Decision Criteria
- **Complete**: All deliverables produced, requirements met
- **Partial**: Some progress made, specific issues identified
- **Blocked**: Cannot proceed without external input or resolution

---

## 7. Ad-Hoc Delegation Protocol
Set `ad_hoc_delegation: true` only when Implementation Plan contains explicit delegation steps for the task.

### 7.1. Manager Responsibilities  
- Extract delegation requirements from Implementation Plan step
- Reference `ad-hoc/` directory if relevant guides exist for delegation type
- Specify what to delegate and expected deliverables in prompt

### 7.2. Integration Requirements
- Implementation Agent creates delegation prompt and manages workflow
- Ad-Hoc agents work in a separate branch managed by the assigning Implementation Agent; they do not log into Memory
- Original agent incorporates findings and logs delegation while User deletes delegation chat session (optional)

---

**End of Guide**