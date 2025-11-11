# APM {VERSION} - Implementation Plan Format Guide

This guide explains how to transform Implementation Plan files into detailed, structured APM artifacts and how to maintain them throughout APM sessions. Enhanced task details help Manager Agents create precise Task Assignment Prompts while preserving all task content and structure from the reviewed file. It also explains Manager Agent maintenance responsibilities of the live Implementation Plan artifact throughout an APM session.

---

## 1  Implementation Plan Enhancement Overview

Transform simple project decomposition file into detailed Implementation Plan artifact:

**Enhancement Process:**
- **Simple File** → Basic task descriptions, agent assignments, dependencies from review phase
- **Enhanced Format** → Detailed, structured task descriptions with clear deliverables and explicit, detailed instructions for Implementation Agent success

**Content Preservation:**
Task content, objectives, execution patterns, agent assignments, and dependencies remain identical to reviewed file. Enhancement adds detail level and structured formatting without changing what tasks accomplish or how they're executed.

**Enhancement Purpose:**
Enable Manager Agents to create precise Task Assignment Prompts through detailed task specifications while maintaining all reviewed task boundaries and structure.

---

## 2  Document Structure Specifications

### 2.1  Document Header (Lines 1-15)
```markdown
# <Project Name> – Implementation Plan 

**Memory Strategy:**  Dynamic-MD (directory structure with Markdown logs)
**Last Modification:** [Summary of last modification by Manager Agent]
**Project Overview:** [High-level project overview with context and objectives]
```
Keep this header < 15 lines so diff tools can catch version bumps cheaply.

### 2.2  Phase Sections
- Use level 2 headings (`##`) for phases: `## Phase <n>: <Name>`.
- Each phase groups related tasks as determined during project decomposition
- For small or strictly linear projects, omit phases and list tasks directly under the header.

### 2.3. Task Blocks
- Use a level 3 heading (`###`) for each task, assigned to one agent:  
    `### Task <n.m> – <Title> │ <Agent_<Domain>>`
- Each task is a focused, actionable unit of work for an Implementation Agent with one clear objective that delivers independent value.
- Directly under the heading, add an unordered list with these meta-fields:
    - **Objective:** One-sentence task goal with comprehensive context
    - **Output:** Concrete deliverable with detailed specifications (e.g., function, module, configuration)
    - **Guidance:** Key constraints, requirements, and implementation approach with detailed context

### 2.4. Sub-Task Formatting
Sub-tasks break down a parent task into logical steps and must be included for every task:

**Single-step format [unordered list (`-`)]:**
```markdown
- Detailed activity/component 1 with comprehensive specifications
- Detailed activity/component 2 with comprehensive specifications
- (...)
```

**Multi-step format [ordered list (`1.`, `2.`, ...)]:**
```markdown
1. **Step Name:** Detailed step description with clear action and comprehensive context.
2. **Step Name:** Detailed step description with clear action and comprehensive context.
(...)
```

### 2.5. Task Dependency Declaration Format
*  **Producer Task:** Specify concrete deliverables in the `Output` field for consumer task integration
*  **Consumer Task:** Reference dependency in `Guidance` field using format: 
    - Same-agent: `"Depends on: Task X.Y Output"`
    - Cross-agent: `"Depends on: Task X.Y Output by Agent Z"`

---

## 4  Setup Agent Responsibilities
Transform reviewed Implementation Plan file into detailed APM artifact:

### 4.1. Enhancement Process
**Content Preservation Requirements:**
- Maintain all task objectives, execution patterns (subtask steps or subtask instructions), and agent assignments from reviewed file
- Preserve all dependencies and phase structure exactly as reviewed
- Keep task boundaries and scope identical to reviewed file

**Detail Enhancement Requirements:**
- Transform basic task descriptions into comprehensive specifications
- Add detailed context to task objectives, outputs, and guidance
- Enhance subtask descriptions with comprehensive instructions and technical context
- Provide detailed specifications that enable Manager Agent to create precise Task Assignment Prompts

### 4.2. Phase-by-Phase Enhancement Approach
**Sequential Phase Enhancement:**
- Enhance the Implementation Plan one phase section at a time, proceeding sequentially through the file
- Each phase enhancement represents one edit operation to the Implementation Plan file
- Complete enhancement of current phase before proceeding to next phase

**Enhancement Execution:**
- **Phase Analysis**: For each phase, read the corresponding section in the reviewed file to fully understand its structure, tasks, and dependencies
- **Phase Enhancement**: Apply the document structure specifications from §2 to reformat and enrich the current phase, ensuring all tasks are transformed into detailed task blocks with enhanced meta-fields
- **Content Enhancement**: Enhance each task's contents following §4.1 guidance, ensuring that the content of the reviewed file is retained, only with more detailed context
- **Phase Completion**: Complete the enhancement of the current phase before moving on to the next, ensuring no phase is skipped or partially enhanced
- **File Update**: Update Implementation Plan file with enhanced phase content
- **Progression Gate**: Continue this process until all phases in the Implementation Plan have been fully enhanced

**Quality Assurance:**
- After each phase enhancement, review the updated content to confirm that detailed specifications are sufficient for Manager Agent Task Assignment Prompt creation
- Ensure all original task content, execution patterns, and agent assignments are preserved from the reviewed file for the current phase
- Iterate and refine current phase enhancement based on user feedback until the phase provides the necessary detail for systematic and effective task execution
- Proceed to next phase only after current phase is complete and approved

---

## 5  Manager Agent Responsibilities
Maintain detailed Implementation Plan throughout APM session:

### 5.1. Plan Validation & Improvement
**Initial Plan Assessment:**
- Read guide, evaluate plan structure and detail level
- Assess plan integrity and propose improvements to the User if critical gaps or issues are found

**Validation Focus:**
- Confirm detailed specifications support precise Task Assignment Prompt creation
- Verify task meta-fields provide sufficient context for Implementation Agent coordination
- Ensure enhanced guidance enables effective task execution management

### 5.2. Live Plan Maintenance
**Plan Updates:**
- Sync plan with project changes while maintaining detailed specification level
- Add/remove/modify phases and tasks as needed with comprehensive context
- Update "Last Modification" for all changes
- Keep task numbering and dependencies consistent

**Structure Maintenance:**
- Maintain enhanced meta-field structure during plan updates
- Preserve detailed specifications when modifying task content
- Update task details as implementation progresses and requirements evolve

### 5.3. Execution Coordination
**Task Assignment Creation:**
- Use detailed meta-fields to create comprehensive Task Assignment Prompts
- Extract enhanced producer task outputs for consumer task assignment integration
- Reference detailed guidance for Implementation Agent context and constraints
- Leverage enhanced specifications for precise task instruction development

**Cross-Agent Coordination:**
- Manage cross-agent handoffs using detailed dependency specifications
- Use enhanced output specifications for seamless task integration
- Reference comprehensive guidance for effective agent coordination

### 5.4. Phase Management
**Phase Execution:**
- Track phase completion using detailed task specifications
- Manage phase transitions with comprehensive context understanding
- Use enhanced plan structure for effective phase coordination

---

**End of Guide**