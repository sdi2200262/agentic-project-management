---
priority: 8
command_name: delegate-debug
description: Provides the template for delegating a complex debugging task to an Ad-Hoc agent
---

# APM {VERSION} - Debug Delegation Guide
This guide defines how Implementation Agents delegate complex debugging work to Ad-Hoc Debug agents. Use this guide when encountering major bugs (> 2 exchanges OR immediately complex/systemic issues) as defined in Implementation Agent Initiation Prompt or if explicitly defined in Task Assignment Prompt.

---

## 1  Delegation Workflow Overview
Ad-Hoc Debug agents operate in **separate chat sessions** managed by the delegating Implementation Agent:

### Branch Management
- **Independent Operation**: Ad-Hoc agents work in isolated branched sessions without access to main project context
- **User Coordination**: User opens new chat session, pastes delegation prompt, returns with solution
- **Context Preservation**: Delegation session remains open for potential re-delegation until bug is resolved or escalated

### Handoff Process
1. **Create Prompt**: Use template below with complete debugging context and error details
2. **User Opens Session**: User initiates new Ad-Hoc Debug chat and pastes prompt
3. **Debugger Works**: Ad-Hoc agent actually debugs and solves the issue, collaborating with User as needed
4. **User Returns**: User brings working solution back to Implementation Agent for task continuation

---

## 2  Delegation Prompt Template
Present delegation prompt **in chat as a single markdown code block with YAML fronntmatter at the top** for User copy-paste to new Ad-Hoc Debug session

```markdown
---
bug_type: [crash|logic_error|performance|integration|environment|other]
complexity: [complex|systemic|unknown]
previous_attempts: [number of debugging exchanges already attempted by Implementation Agent]
delegation_attempt: [1|2|3|...]
---

# Debug Delegation: [Brief Bug Description]

## Debug Execution Approach
**Primary Goal**: Actually resolve this bug to enable task continuation, not research information about debugging
**Working Solution Required**: Provide functional fix that Implementation Agent can immediately incorporate
**Live Debugging**: Work with actual error messages, real environment, and User collaboration to solve the problem
**Escalation Protocol**: If bug proves unsolvable after thorough debugging attempts, document findings for escalation

## Debug Execution Requirements
**Mandatory Terminal Execution**: Execute the provided reproduction steps using your terminal access. Follow the steps listed to reproduce the bug yourself.
**Tool Usage Protocol**: You have terminal and file system access. Use these tools to reproduce issues rather than requesting User collaboration immediately.
**Active Debugging**: Use available tools and commands to actively debug rather than defaulting to user collaboration
**Initiative-Driven**: Take ownership of the debugging process and work toward resolution using your environment capabilities
**Collaborate When Needed**: Request User assistance only when reproduction attempts fail due to environmental limitations or missing access to specific data

## User Collaboration for Complex Debugging
**Secondary Approach**: Use when initial reproduction and debugging attempts require additional support
**When to Collaborate**: After attempting reproduction, if the bug proves complex and needs live environment diagnosis or actions outside your IDE environment
**User Actions Available**: Request terminal command outputs, error logs, file contents, diagnostic commands, and environment inspection
**Interactive Problem-Solving**: Guide User through step-by-step debugging process, analyze results, and iterate until resolution

## Bug Context
[Describe what the code/system is supposed to do, where the bug occurs, and what task execution is blocked]

## Reproduction Steps
1. [Step-by-step instructions to reproduce the bug]
2. [Include specific inputs, conditions, or triggers]
3. [Note any environment dependencies or setup requirements]

## Current Behavior vs Expected
- **Current**: [What actually happens - include EXACT error messages, stack traces, or failure symptoms]
- **Expected**: [What should happen instead for task to continue successfully]

## Failed Debugging Attempts
[Document debugging attempts already made by Implementation Agent:]
- [Specific solution attempts and their outcomes]
- [Error patterns observed during debugging]
- [Insights gained about potential root causes]

## Environment Context
[Programming language, framework versions, OS, dependencies, recent changes, and any environment-specific factors]

## Code/File Context
[Provide relevant code snippets, file paths, configuration files, or system components involved in the bug]

## Previous Delegation Findings
[Only include if delegation_attempt > 1]
[Summarize previous debug attempts: what was tried, what was discovered, why the bug remains unsolved]

## Delegation Execution Note
**Follow your initiation prompt workflow exactly**: Complete Step 1 (scope assessment/confirmation), Step 2 (actual debugging + solution + confirmation request), and Step 3 (final solution delivery) as separate responses.
```

### Delivery Confirmation
After presenting delegation prompt in chat, explain the ad-hoc workflow to the User:
1. Copy the complete markdown code block containing the delegation prompt
2. Open new Ad-Hoc agent chat session & initialize it with {COMMAND_PATH:Ad_Hoc_Agent_Initiation_Prompt.md}
3. Paste delegation prompt to start ad-hoc work
4. Return with findings for integration

---

## 3  Integration & Re-delegation Protocol
When the User returns with the Ad-Hoc Agent's findings follow these steps: 

### Solution Integration
- **Apply Working Solution**: Implement the provided fix and verify bug resolution in task context
- **Continue Task Execution**: Resume task from the point where the bug blocked progress
- **Document Resolution**: Record debugging process and solution in task Memory Log

### Re-delegation Decision Framework
**Bug Resolved**: Close delegation session, continue with task completion using provided solution
**Bug Partially Resolved**: If fix is incomplete, refine prompt with new findings and re-delegate:
- **Incorporate Debug Progress**: Update "Previous Delegation Findings" with specific discoveries and partial solutions
- **Refine Problem Context**: Add details discovered during debugging attempts
- **Increment Counter**: Update `delegation_attempt` field in YAML

**Bug Unsolvable**: If delegation returns escalation findings, stop task execution and escalate to Manager Agent

### Session Closure Criteria
- **Success**: Bug resolved with working solution, task execution can continue
- **Resource Limit**: After 3-4 delegation attempts without resolution
- **Escalation**: Ad-Hoc agent determines bug is unsolvable and provides escalation documentation

### Escalation Protocol
When Ad-Hoc Debug agent returns findings indicating unsolvable bug:
- **Stop task execution immediately**
- **Preserve debugging context** for potential future resolution attempts
- **Log technical blocker and context** in Memory Log with delegation session reference and root cause analysis
- **User reports to Manager Agent** for task reassignment, plan modification, or technical escalation

### Memory Logging Requirements
Document in task Memory Log:
- **Bug Description**: Original issue that blocked task execution
- **Debug Session Summary**: Number of attempts, collaboration approach, and technical findings
- **Solution Applied**: Working fix provided and how it enables task continuation
- **Session Status**: Resolved with solution OR escalated with technical details

---

**End of Guide**