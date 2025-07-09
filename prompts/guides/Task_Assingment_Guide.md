# APM v0.4 - Task Assignment Guide
This guide defines how Manager Agents issue task assignments to Implementation Agents and evaluate their completion. It defines two Task Assignment Prompt variants:
- Markdown
- JSON
Task assignments coordinate agent work during the Task Loop of an APM session, following the Implementation Plan.

---

## 1. Task Loop Overview
Below follows an overview of the APM Task Loop:

Manager Agent issues Task Assignment Prompt → User passes to Implementation Agent → Implementation Agent executes task and logs work → User returns log to Manager → Manager reviews and determines next action (continue, follow-up, delegate, or plan update).

---

## 2. Task Assignment Prompt Format
Task Assignment Prompts must correlate 1-1 with Implementation Plan tasks and include all necessary context for successful execution. Manager Agent must issue these prompts following this format:

### 2.1. YAML Frontmatter
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

### 2.2. Prompt Structure
Include optional sections only when their front-matter boolean is true

```markdown
# APM Task Assignment: [Task Title]

## Task Reference
Implementation Plan: **Task X.Y - [Title]** assigned to **[Agent_<Domain>]**

## Context from Dependencies
[Only include if dependency_context: true]
- Previous work summary from related producer tasks
- Key deliverables and outputs to build upon
- Code snippets, file paths, or artifacts from dependencies
- Integration points and compatibility requirements

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
Based on Implementation Plan delegation step, specify:
- What to delegate (research, analysis, investigation)
- Reference relevant ad-hoc/ guide by name if available for delegation type
- Expected deliverables from Ad-Hoc agent
- How Implementation Agent should integrate findings

See section §7 for complete delegation protocol.
```

---

## 3. JSON Variant Specification
JSON prompts follow identical content requirements as Markdown but use schema validation at `prompts/schemas/task_assignment.schema.json`. All sections for context, instructions, outputs, and logging apply as described above.

---

## 4. Dependency Context Integration
When Tasks have cross-agent dependencies then the Manager Agent is responsible of providing required context in the Task Assignment prompt for task completion:

### 4.1. Producer Output Extraction
- From producer task completion extract specific deliverables mentioned in producer's Output field
- Include relevant code, files, schemas, or specifications

### 4.2. Consumer Context Provision
- Summarize producer work and key decisions
- Provide concrete artifacts (code snippets, file references) and explain integration requirements and compatibility constraints
- Reference producer task ID for traceability

---

## 5. Memory Log Review Process
When Implementation Agent returns:

### 5.1. Log Assessment
- Verify log format compliance with Memory Log Guide
- Check task completion against assigned instructions
- Identify any blockers, issues, or deviations reported

### 5.2. Quality Evaluation
- Compare deliverables with expected outputs
- Assess adherence to Implementation Plan requirements
- Note any outstanding work or follow-up needs

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
For tasks with explicit Ad-Hoc delegation steps in the Implementation Plan:

### 7.1. When to Include Delegation
Set `ad_hoc_delegation: true` only when Implementation Plan contains explicit delegation steps for the task.

### 7.2. Manager Responsibilities  
- Extract delegation requirements from Implementation Plan step
- Reference ad-hoc/ directory if relevant guides exist for delegation type
- Specify what to delegate and expected deliverables in prompt

### 7.3. Integration Requirements
- Implementation Agent creates delegation prompt and manages workflow
- Ad-Hoc agents work in a separate branch managed by the assigning Implementation Agent; they do not log into Memory
- Original agent incorporates findings and logs delegation while User deletes delegation chat session (optional)

---

**End of Guide**