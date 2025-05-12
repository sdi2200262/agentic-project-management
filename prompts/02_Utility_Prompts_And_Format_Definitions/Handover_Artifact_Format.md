# APM Handover Artifact Formats

## 1. Introduction

This document specifies the standard Markdown formatting for the two key artifacts generated during the APM Handover Protocol (the procedure itself is detailed in `prompts/01_Manager_Agent_Core_Guides/04_Handover_Protocol_Guide.md`):

1.  **`Handover_File.md`**: The comprehensive context dump from the outgoing agent.
2.  **`Handover_Prompt.md`**: The initialization prompt for the incoming agent.

These formats apply to handovers involving **any type of agent** within the APM framework (Manager, Implementation, Specialized). Adherence to these structures is crucial for the successful transfer of project context and the seamless initialization of the new agent instance, regardless of the agent's role.

This document serves as the definitive structural reference for whoever prepares the handover artifacts (typically the Manager Agent or the User).

**Key Distinction:**
*   The `Handover_File.md` is a **data repository** structuring the project's state and history for the incoming agent.
*   The `Handover_Prompt.md` is an **instructional document** that bootstraps the new agent, guiding it on how to *use* the Handover File and resume project tasks.

## 2. `Handover_File.md` Format (Context Dump)

This file should be structured using clear Markdown headings to organize the dumped context. The following sections represent the comprehensive format, typically used for a Manager Agent handover. For handovers involving Specialized Agents, certain sections may be simplified or omitted (see Section 4).

```markdown
# APM Handover File - [Project Name/Identifier] - [Date]

## 1. Handover Overview

*   **Outgoing Agent ID:** [e.g., Manager_Instance_1, Implementer_B_v1]
*   **Incoming Agent ID:** [e.g., Manager_Instance_2, Implementer_B_v2] (If known)
*   **Reason for Handover:** [e.g., Context Limit Reached, Task Completion & Reassignment, Strategic Replacement]
*   **Memory Bank Configuration:**
    *   **Location(s):** [List the relative path(s) to the project's Memory_Bank.md file(s), e.g., `./Memory_Bank.md` or `./memory/Phase1_Memory_Bank.md`]
    *   **Number of Banks:** [e.g., 1, 2]
*   **Brief Project Status Summary:** [1-3 sentences on the current overall state relevant to the handover scope. For specialized agents, focus on their specific task area.]

## 2. Project Goal & Objectives (If applicable)

[For Manager handovers, reiterate the main project goal and key objectives. For specialized agents, state the goal of their *current* specific task or area of responsibility. Copy from original plan or provide current understanding.]

## 3. Implementation Plan Status (Focus relevant to scope)

*   **Link to Plan:** [Relative path to the `Implementation_Plan.md`]
*   **Current Phase/Focus:** [e.g., Phase 2: Frontend Development OR Task: Debugging login flow]
*   **Completed Tasks (Relevant Scope):**
    *   [Task ID/Reference from Plan relevant to this handover]
    *   ...
*   **Tasks In Progress (Relevant Scope):**
    *   [Task ID/Reference from Plan] - **Agent:** [Agent ID] - **Status:** [Brief status, e.g., Coding underway, Blocked, Reviewing]
    *   ...
*   **Upcoming Tasks (Immediate & Relevant):**
    *   [Task ID/Reference from Plan] - **Agent:** [Agent ID]
    *   ...
*   **Deviations/Changes (Relevant Scope):** [Note any approved modifications relevant to the handover scope. State "None" if applicable.]

## 4. Key Decisions & Rationale Log (Relevant Scope)

[Summarize significant decisions relevant to the incoming agent's scope made since the last handover or task start.]
*   **Decision:** [e.g., Choice of X library over Y] - **Rationale:** [Brief justification] - **Approved By:** [User/Manager] - **Date:** [YYYY-MM-DD]
*   ...

## 5. Active Agent Roster & Current Assignments (If applicable)

[Typically for Manager Handovers. For specialized agents, may only list collaborating agents.]
*   **Manager Agent:** [ID]
*   **Implementation Agent A:**
    *   **Current Task:** [Task ID/Reference]
    *   **Status:** [e.g., Actively working, Awaiting review, Idle]
*   *(Add/remove agents as applicable)*

## 6. Recent Memory Bank Entries (Contextual Snippets - Relevant Scope)

[Include verbatim copies or concise summaries of the *most relevant* recent entries from the specified `Memory_Bank.md`(s) that the new agent needs for immediate context. Focus on entries directly related to the ongoing/upcoming tasks within the handover scope.]

---
[Copy of Memory Bank Entry 1 related to current task]
---
[Copy of Memory Bank Entry 2 related to current task]
---
[...]
---

## 7. Critical Code Snippets / Configuration / Outputs (Relevant Scope)

[Embed crucial code snippets, configuration file contents, API responses, error messages, or other outputs directly related to the task(s) being handed over. Use appropriate Markdown code blocks.]

```python
# Example: Relevant function being debugged
def calculate_value(input_data):
    # ... code ...
```

## 8. Current Obstacles, Challenges & Risks (Relevant Scope)

[List any known blockers, unresolved issues, errors, technical challenges, or potential risks *specifically relevant* to the task or area being handed over.]
*   **Blocker:** [Task ID/Description] - [Description of blocker] - **Status:** [e.g., Investigating, Waiting for User input]
*   **Error:** [Description of error encountered] - **Details:** [Relevant log snippet or observation]

## 9. Outstanding User/Manager Directives or Questions (Relevant Scope)

[List any recent instructions *relevant to this agent/task* that are still pending action or questions awaiting answers.]
*   [Directive/Question 1]

## 10. Key Project File Manifest (Relevant Scope - Optional but Recommended)

[List key files the incoming agent will likely need to interact with for their task.]
*   `/src/utils/calculation_logic.py`: [Brief description of relevance]
*   `/tests/test_calculation.py`: [Brief description of relevance]
*   ...

```

## 3. `Handover_Prompt.md` Format (New Agent Initialization)

This prompt initializes the new agent instance, regardless of type. It blends standard APM context (if needed) with handover-specific instructions.

```markdown
# APM Agent Initialization - Handover Protocol

You are being activated as an agent ([Agent Type, e.g., Manager Agent, Implementation Agent]) within the **Agentic Project Management (APM)** framework.

**CRITICAL: This is a HANDOVER situation.** You are taking over from a previous agent instance ([Outgoing Agent ID]). Your primary goal is to seamlessly integrate and continue the assigned work based on the provided context.

## 1. APM Framework Context (As Needed)

**(For Manager Agents, integrate essential Sections 1 and 2 from `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md` here, adapting "Your Role" / "Core Responsibilities".)**
**(For Implementation/Specialized Agents, this section may be omitted or heavily condensed by the preparer, focusing only on essential concepts like the Memory Bank if necessary.)**

*   **Your Role:** [Briefly state the role, e.g., "As the incoming Manager Agent...", "As Implementation Agent B taking over Task X..."]
*   **Memory Bank:** You MUST log significant actions/results to the Memory Bank(s) located at [Path(s) from Handover File] using the format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md` (pending User confirmation).
*   **User:** The primary stakeholder and communication conduit.

## 2. Handover Context Assimilation

A detailed **`Handover_File.md`** has been prepared containing the necessary context for your role/task.

*   **File Location:** [Relative path to the generated `Handover_File.md`]
*   **File Contents Overview:** This file contains the state of your assigned task(s) / project scope, including: Plan status, relevant decisions, recent activity logs, necessary code/outputs, known obstacles, and outstanding directives.

**YOUR IMMEDIATE TASK:**

1.  **Thoroughly Read and Internalize:** Carefully read the *entire* `Handover_File.md`. Pay close attention to the sections most relevant to your immediate task(s), such as Plan Status, Recent Memory Bank Entries, Critical Outputs, Obstacles, and Directives.
2.  **Identify Next Steps:** Based *only* on the Handover File, determine the most immediate priorities and next actions required for your role/task.
3.  **Confirm Understanding:** Signal your readiness to the User by:
    *   Briefly summarizing the current status *of your specific task/scope* based on the file.
    *   Listing the 1-2 most immediate actions you will take.
    *   Asking any critical clarifying questions needed *before* proceeding.

Do not begin work until you have completed this assimilation and verification step with the User.

## 3. Initial Operational Objective

Once confirmed by the User, your first operational objective is:

*   **[State the explicit first task derived from the Handover File, e.g., "Resume implementation of feature X based on section 7", "Analyze the error detailed in section 8", "Prepare the prompt for the next sub-task identified in section 3", "Review the Memory Bank entries in section 6"]**

Proceed with the Handover Context Assimilation now. Acknowledge receipt of this prompt and confirm you are beginning the review of the `Handover_File.md`.

```

## 4. Notes on Variations for Specialized Agent Handovers

As indicated in the templates above, handovers for Specialized Agents (Implementer, Debugger, etc.) typically involve **scope-limited versions** of these formats:

*   **`Handover_File.md` (Simplified):** Focuses context **only** on the specific task(s) being handed over. Sections like overall project goals, full agent roster, and extensive decision logs may be omitted or heavily summarized by the preparer (usually the Manager or User).
*   **`Handover_Prompt.md` (Simplified):** Often omits the general APM framework introduction. Instructions focus directly on understanding the *task-specific* context from the simplified Handover File and resuming that specific work.

The Manager Agent or User preparing the handover should tailor the content of both artifacts to the specific needs and scope of the specialized agent receiving the handover.

## 5. General Formatting Notes

*   **Clarity and Conciseness:** Prioritize clear, unambiguous language. While comprehensive, focus information on what the incoming agent *needs* to proceed effectively.
*   **Recency and Relevance:** Emphasize the most recent and directly relevant information, especially for Memory Bank entries and outputs.
*   **Markdown Usage:** Use standard Markdown consistently for headings, lists, code blocks, etc., to ensure readability.
*   **Placeholders:** Replace all bracketed placeholders `[like this]` with the actual project-specific information.
*   **Verification:** The verification step in the `Handover_Prompt.md` is crucial; ensure the instructions for the incoming agent are explicit.
