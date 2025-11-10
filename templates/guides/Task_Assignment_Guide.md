# APM {VERSION} - Task Assignment Guide
This guide defines how Manager Agents issue task assignments to Implementation Agents and evaluate their completion. Task assignments coordinate agent work during the Task Loop of an APM session, following the Implementation Plan.

## 1. Task Loop Overview
Manager Agent issues Task Assignment Prompt → User passes to Implementation Agent → Implementation Agent executes task and logs work → User returns log to Manager → Manager reviews and determines next action (continue, follow-up, delegate, or plan update).

## 2. Task Assignment Prompt Format
Task Assignment Prompts must correlate 1-1 with Implementation Plan tasks and include all necessary context for successful execution. Manager Agent must issue these prompts following this format:

### 2.1. Dependency Check
Before creating any Task Assignment Prompt check for task dependencies.

**Step 1: Identify Dependencies**
Check Implementation Plan task's `Guidance` field for dependency declarations:
- `"Depends on: Task X.Y Output"` = Same-agent dependency
- `"Depends on: Task X.Y Output by Agent Z"` = **CROSS-AGENT DEPENDENCY**

**Step 2: Determine Context Integration Approach**
- **Same Agent** (no "by Agent X" tag) → Use **Simple Contextual Reference** (Section 4.1)
- **Cross Agent** (has "by Agent X" tag) → Use **MANDATORY Comprehensive Integration Context** (Section 4.2)

### **Cross-Agent Dependency Warning**
**CRITICAL**: Cross-agent dependencies require Implementation Agents to complete detailed file reading and integration steps BEFORE starting main task work.

### 2.2. User Explanation Requests
When Users request explanations for upcoming complex tasks, Manager Agent should include detailed explanation instructions within the `## Detailed Instructions` section of the Task Assignment Prompt.

**Explanation Timing Protocol**:
- **Single-Step Tasks**: Provide brief approach introduction BEFORE execution, detailed explanation AFTER task completion
- **Multi-Step Tasks**: Apply same pattern to each step - brief approach introduction BEFORE each step execution, detailed explanation AFTER each step completion

**Integration Approach**: Add explanation instructions as part of the task execution flow, specifying:
- **What aspects** need detailed explanation (technical approach, decision rationale, architectural impact)  
- **Explanation scope** for complex technical areas
- **Timing requirements** following the protocol above

**Implementation**: Include explanation instructions alongside normal task instructions in the `## Detailed Instructions` section. Use clear formatting to distinguish explanation requirements from execution requirements. **Only include explanation instructions when they are explicitly requested by the User.**

### 2.3. Prompt Structure with YAML Frontmatter
Include optional sections only when their front-matter boolean is true

```markdown
---
task_ref: "Task <m.n> - Title"
agent_assignment: "Agent_<Domain>"
memory_log_path: "path/to/log/file"
execution_type: "single-step | multi-step"
dependency_context: true | false
ad_hoc_delegation: true | false
---

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
Follow {GUIDE_PATH:Memory_Log_Guide.md} instructions.

## Ad-Hoc Delegation
[Only include if ad_hoc_delegation: true]
[Manager fills this section with section §7 content guidance, including explicit command references for Debug/Research delegations ({COMMAND_PATH:Debug_Delegation_Guide.md} or {COMMAND_PATH:Research_Delegation_Guide.md})]
```

### 2.4. Delivery Format  
Present Task Assignment Prompts as **a single markdown code block with YAML frontmatter at the top.** This ensures smooth copy-paste workflow for users transferring prompts between Manager and Implementation Agents.

## 3. Context Dependency Integration
When consumer tasks depend on producer outputs ("Depends on: Task X.Y Output" in Implementation Plan Guidance), Manager provides context based on agent assignment:

### 3.1. Same-Agent Dependencies (Contextual Guidance)
When **same Implementation Agent** worked on both producer and consumer tasks:

**Contextual Approach:**
- Provide specific output references and key implementation details to recall
- Include relevant file locations and important artifacts created
- Assume working familiarity but provide concrete guidance for integration
- Detail level varies based on dependency complexity and time gap between tasks

**Simple Same-Agent Context Example:**
```markdown
## Context from Dependencies
Based on your Task 2.1 work, use the authentication middleware you created in `src/middleware/auth.js` and the JWT validation functions for this frontend integration task.
```

**Complex Same-Agent Context Example:**
```markdown
## Context from Dependencies
Building on your Task 2.3 API implementation:

**Key Outputs to Use:**
- Authentication endpoints in `src/api/auth.js` (POST /api/login, GET /api/verify)
- User validation middleware in `src/middleware/auth.js`
- Database schema updates in `migrations/003_add_user_roles.sql`

**Implementation Details to Recall:**
- JWT tokens include user role and permissions in payload
- Error handling returns standardized error objects with code/message format
- Rate limiting applied to login attempts (implemented in middleware)

**Integration Approach:**
For this task, extend the existing role-based permissions system you built to handle the new admin dashboard requirements.
```

#### Same-Agent Context Guidelines
- **Simple Dependencies**: Reference key files and outputs with brief integration guidance
- **Complex Dependencies**: Include key outputs list, important implementation details, and clear integration approach
- **Time-Gap Considerations**: More detail when significant time passed between related tasks
- **File References**: Always include specific file paths for outputs that need to be used or extended
- **Implementation Continuity**: Emphasize building on previous work rather than starting fresh

### 3.2. Cross-Agent Dependencies (Comprehensive Integration Context)
When **different Implementation Agents** worked on producer and consumer tasks (Tasks have "by Agent X" tag):

**Comprehensive Context Approach:**
- Always provide detailed integration steps with explicit file reading instructions
- Include comprehensive output summaries and usage guidance regardless of dependency complexity
- Provide User clarification protocols for ambiguous integration points
- Complexity only affects the amount of integration work, not the level of detail provided

**Cross-Agent Context Template:**

From each section below use the options that best fits the specific context integration requirements.
```markdown
## Context from Dependencies
This task [depends on/builds upon/integrates with] [Task X.Y description] implemented by [Producer_Agent]:

**Integration Steps (complete in one response):**
1. [Read/Review/Examine] [specific file/documentation] at [file path] to understand [specific aspect/functionality]
2. [Study/Analyze] [implementation files] in [directory/file paths] to understand [technical approach/data structures/patterns]
3. [Examine/Review] [test files/examples] at [file paths] for [usage patterns/expected behaviors/integration examples]
4. [Additional integration steps as needed for specific outputs]

**Producer Output Summary:**
- [Key functionality/feature]: [Description of what was built and how it works]
- [Important files/endpoints]: [Locations and purposes of key outputs]
- [Data structures/interfaces]: [Important data formats, types, or contracts]
- [Error handling/validation]: [How errors are handled and what formats are used]
- [Security/authentication]: [Any security measures or authentication requirements]

**Integration Requirements:**
- [Specific requirement 1]: [How consumer task must integrate with producer output]
- [Specific requirement 2]: [Additional integration specifications]
- [Usage patterns]: [How to properly use the producer outputs]
- [Constraints/limitations]: [Important limitations or constraints to consider]

**User Clarification Protocol:**
If [specific integration aspect] is ambiguous after completing integration steps, ask User about [specific clarification areas].
```

**Cross-Agent Context Creation Guidelines:**
- **Always Comprehensive**: Regardless of dependency complexity, provide full integration steps, output summaries, and requirements selecting from the options that match the dependency requirements
- **File-Specific Instructions**: Always include explicit file paths and what to look for in each file
- **Complete Output Coverage**: Document all relevant outputs, interfaces, and usage patterns from producer task
- **Integration Requirements**: Specify exactly how consumer task should integrate with producer outputs
- **Clarification Protocols**: Always include User clarification pathway for ambiguous integration points
- **Assumption**: Consumer Agent has zero familiarity with producer work - explain everything needed for successful integration

### 3.3. Context Integration Execution
**For Same-Agent Dependencies:**
- No separate integration steps section in Task Assignment Prompt
- Include minimal "Context from Dependencies" section with `dependency_context: true` in YAML

**For Cross-Agent Dependencies:**
- Include detailed "Context from Dependencies" section with `dependency_context: true` in YAML
- Implementation Agent completes all integration steps in one response before main task

### 3.4. Context Integration Guidelines for Manager Agents

**Same-Agent Context Creation:**
- Review producer task Memory Log for key outputs and deliverables
- Reference previous work without repeating detailed instructions
- Focus on output connection and continuation of work

**Cross-Agent Context Creation:**
- Review producer task Memory Log thoroughly for outputs, file locations, approaches
- Create detailed file reading and review instructions
- Provide comprehensive output summary and usage guidance
- Include User clarification protocol for complex integrations

## 5. Memory Log Review
When Implementation Agent returns, **review Memory Log per {GUIDE_PATH:Memory_Log_Guide.md} section §5**. Assess task completion status, identify blockers, and verify outputs match Implementation Plan expectations.

## 6. Next Action Framework
Based on log review, determine appropriate next step:

### 6.1. Continue Workflow
- Task complete and successful → Issue **next Task Assignment Prompt** per Implementation Plan (Task Loop continues)
- Phase complete → **Create phase summary**, begin next phase

### 6.2. Follow-Up Actions
- Task needs refinement → Send correction **follow-up prompt** to same agent (if technical blockers persist, consider **Ad-Hoc delegation in the follow-up prompt**)
- Plan assumptions invalid or any other changes needed → **Update Implementation Plan**

### 6.3. Decision Criteria
- **Complete**: All deliverables produced, requirements met
- **Partial**: Some progress made, specific issues identified
- **Blocked**: Cannot proceed without external input or resolution

## 7. Ad-Hoc Delegation Protocol
Set `ad_hoc_delegation: true` only when Implementation Plan contains explicit delegation steps for the task.

### 7.1. Manager Responsibilities  
When Implementation Plan contains explicit delegation steps, Manager Agents must:
- Extract delegation requirements from Implementation Plan step
- **Identify delegation type** (Debug, Research, or other) from the Implementation Plan delegation step
- **Include explicit guide references** for standard delegation types in the Task Assignment Prompt if possible
- Specify what to delegate and expected deliverables in prompt

**Standard Delegation Command References**:
- **Debug Delegation**: Reference {COMMAND_PATH:Debug_Delegation_Guide.md}
- **Research Delegation**: Reference {COMMAND_PATH:Research_Delegation_Guide.md}  
- **Custom Delegations**: Reference appropriate custom command files if available

### 7.2. Integration Requirements
- Implementation Agent creates delegation prompt and manages workflow
- Ad-Hoc agents work in a separate branch managed by the assigning Implementation Agent; they do not log into Memory
- Original agent incorporates findings and logs delegation while User deletes delegation chat session (optional)

---

**End of Guide**