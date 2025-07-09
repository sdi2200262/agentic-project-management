# APM v0.4 - Debug Delegation Guide
This guide defines how Implementation Agents delegate complex debugging work to Ad-Hoc Debugger agents. Use this guide when encountering major bugs (> 2 exchanges OR immediately complex/systemic issues) as defined in Implementation Agent Initiation Prompt.

---

## 1  Delegation Workflow Overview
Ad-Hoc Debugger agents operate in **separate chat sessions** managed by the delegating Implementation Agent:

### Branch Management
- **Independent Operation**: Ad-Hoc agents work in isolated branched sessions without access to main project context
- **User Coordination**: User opens new chat session, pastes delegation prompt, returns with findings
- **Context Preservation**: Delegation session remains open for potential re-delegation until formal closure

### Handoff Process
1. **Create Prompt**: Use template below with complete debugging context
2. **User Opens Session**: User initiates new Ad-Hoc Debugger chat and pastes prompt
3. **Debugger Works**: Ad-Hoc agent analyzes issue works to provide solution/findings collaborating with User
4. **User Returns**: User brings findings back to Implementation Agent for integration

---

## 2  Delegation Prompt Template
Create delegation prompts using this structured format:

### YAML Frontmatter
```yaml
---
bug_type: [crash|logic_error|performance|integration|environment|other]
complexity: [complex|systemic|unknown]
previous_attempts: [number of debugging exchanges already attempted by Implementation Agent]
delegation_attempt: [1|2|3|...]
---
```

### Required Content Sections
```markdown
# Debug Delegation: [Brief Bug Description]

## Bug Context
[Describe what the code/system is supposed to do and where the bug occurs]

## Reproduction Steps
1. [Step-by-step instructions to reproduce the bug]
2. [Include specific inputs, conditions, or triggers]
3. [Note any environment dependencies]

## Current Behavior vs Expected
- **Current**: [What actually happens, include error messages/logs]
- **Expected**: [What should happen instead]

## Attempted Solutions
[Document debugging attempts already made by Implementation Agent:]
- [Solution 1 and why it failed]
- [Solution 2 and outcome]
- [Any insights gained during debugging]

## Environment Context
- [Programming language, framework versions, Operating System, dependencies]
- [Configuration details or any recent changes likely relevant to the bug]

## Code/File Context
[Provide relevant code snippets, file paths, or system components involved]

## Previous Delegation Findings
[Only include if delegation_attempt > 1]
[Summarize findings from previous Ad-Hoc debugging attempts and why they were inadequate]
```

---

## 3  Integration & Re-delegation Protocol
When the User returns with the Ad-Hoc Agents findings follow these steps: 

### Solution Integration
- **Validate Findings**: Test Ad-Hoc solution in actual task context before proceeding
- **Partial Solutions**: Integrate helpful insights even if complete solution not provided
- **Documentation**: Record delegation process and outcomes in task Memory Log

### Re-delegation Decision Framework
**Adequate Solution**: Close delegation session, proceed with task completion
**Inadequate Solution**: Refine prompt using Ad-Hoc findings and re-delegate to the same Ad-Hoc Agent instance:
- **Incorporate Insights**: Update "Previous Delegation Findings" section with specific learnings
- **Refine Context**: Add missing details identified by previous attempt  
- **Increment Counter**: Update `delegation_attempt` field in YAML

### Session Closure Criteria
- **Success**: Solution found and validated in task context
- **Resource Limit**: After 3-4 delegation attempts without adequate solution
- **Escalation**: Formal escalation to Manager Agent with delegation session reference for persistent systemic issues

### Memory Logging Requirements
Document in task Memory Log:
- **Delegation Rationale**: Why debugging was delegated
- **Session Summary**: Number of attempts and key findings
- **Solution Applied**: Final resolution and validation results
- **Session Status**: Closed with solution OR escalated with session reference

---

**End of Guide**