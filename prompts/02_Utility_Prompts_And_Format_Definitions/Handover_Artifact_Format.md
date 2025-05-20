# APM Handover Artifact Formats

## 1. Introduction

This document specifies the standard Markdown formatting for the two key artifacts generated during the APM Handover Protocol (the procedure itself is detailed in `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md`):

1.  **`Handover_File.md`**: The comprehensive context dump from the outgoing agent.
2.  **`Handover_Prompt.md`**: The initialization prompt for the incoming agent.

These formats apply to handovers involving **any type of agent** within the APM framework (Manager, Implementation, Specialized). Adherence to these structures is crucial for the successful transfer of project context and the seamless initialization of the new agent instance, regardless of the agent's role.

This document serves as the definitive structural reference for whoever prepares the handover artifacts (typically the Manager Agent or the User).

**Key Distinction:**
*   The `Handover_File.md` is a **data repository** structuring the project's state and history for the incoming agent.
*   The `Handover_Prompt.md` is an **instructional document** that bootstraps the new agent, guiding it on how to *use* the Handover File and resume project tasks.

## 2. `Handover_File.md` Format (Context Dump)

This file should be structured using clear Markdown headings to organize the dumped context. The following sections represent the comprehensive format, primarily intended for a Manager Agent handover. For handovers involving Specialized Agents, certain sections may be simplified or omitted by the preparer to match the agent's specific scope (see Section 4 for more on variations).

```
# APM Handover File - [Project Name/Identifier] - [Date]

## Section 1: Handover Overview

*   **Outgoing Agent ID:** [e.g., Manager_Instance_1, Implementer_B_v1]
*   **Incoming Agent ID:** [e.g., Manager_Instance_2, Implementer_B_v2] (If known)
*   **Reason for Handover:** [e.g., Context Limit Reached, Task Completion & Reassignment, Strategic Replacement]
*   **Memory Bank Configuration:**
    *   **Location(s):** [List the relative path(s) to the project's Memory_Bank.md file(s) or `Memory/` directory, e.g., `./Memory_Bank.md` or `./Memory/`]
    *   **Structure:** [e.g., Single file, Multi-file directory per phase]
*   **Brief Project Status Summary:** [1-3 sentences on the current overall state relevant to the handover scope. For specialized agents, focus on their specific task area.]

## Section 2: Project Goal & Current Objectives (Relevant Scope)

[For Manager Handovers, reiterate the main project goal and key current objectives. For Specialized Agents, state the goal of their *current specific task* or area of responsibility. Copy from original plan or provide current understanding.]

## Section 3: Implementation Plan Status (Relevant Scope)

*   **Link to Main Plan:** [Relative path to the `Implementation_Plan.md`]
*   **Current Phase/Focus:** [e.g., Phase 2: Frontend Development OR Task: Debugging login flow]
*   **Completed Tasks (within current scope or recently):**
    *   [Task ID/Reference from Plan relevant to this handover] - Status: Completed
    *   ...
*   **Tasks In Progress (within current scope):**
    *   [Task ID/Reference from Plan] - **Assigned Agent(s):** [Agent ID(s)] - **Current Status:** [Brief status, e.g., Coding underway, Blocked by X, Review pending]
    *   ...
*   **Upcoming Tasks (immediate next relevant to scope):**
    *   [Task ID/Reference from Plan] - **Intended Agent(s):** [Agent ID(s)]
    *   ...
*   **Deviations/Changes from Plan (Relevant Scope):** [Note any approved modifications relevant to the handover scope. State "None" if applicable.]

## Section 4: Key Decisions & Rationale Log (Relevant Scope)

[Summarize significant decisions relevant to the incoming agent's scope made since the last handover or task start. Focus on decisions impacting current or upcoming work.]
*   **Decision:** [e.g., Choice of X library over Y for feature Z] - **Rationale:** [Brief justification] - **Approved By:** [User/Manager] - **Date:** [YYYY-MM-DD]
*   ...

## Section 5: Active Agent Roster & Current Assignments (Manager Handovers)

[Typically for Manager Handovers. For specialized agents, this section might be omitted or list only direct collaborators.]
*   **Manager Agent:** [ID, if different from outgoing]
*   **Implementation Agent Alpha:**
    *   **Current Task(s):** [Task ID/Reference]
    *   **Status:** [e.g., Actively working, Awaiting review, Idle]
*   *(Add/remove agents as applicable for the project)*

## Section 6: Recent Memory Bank Entries (Contextual Snippets - Highly Relevant Scope)

[Include verbatim copies or concise summaries of the *most relevant* recent entries from the specified Memory Bank(s) that the new agent needs for immediate context. Focus on entries directly related to the ongoing/upcoming tasks within the handover scope. Prioritize recency and direct applicability.]

---
[Copy of Memory Bank Entry 1 directly related to current task]
---
[Copy of Memory Bank Entry 2 directly related to current task]
---
[...]
---

## Section 7: Recent Conversational Context & Key User Directives

**Purpose:** This section captures critical insights, directives, or contextual shifts from the most recent (e.g., last 5-10, or as specified by the Handover Protocol) interactions with the User that might not yet be fully reflected in formal logs or the Implementation Plan. It provides the "freshest layer of user intent" for the incoming agent.

**Content:**
*   **Source:** Summary generated by the Outgoing Agent based on a review of recent conversational history immediately prior to handover.
*   **Format:** Bullet points preferred, focusing on actionable information or critical context.

**[Placeholder for Outgoing Agent to insert summary of recent conversational context and key user directives]**

*Example:*
*   *User expressed a new preference for using Model X as the primary choice for final submission (ref: conversation on YYYY-MM-DD, turn N). This overrides previous discussions on Model Y.*
*   *Clarified that the deadline for current phase is now DD-MM-YYYY (ref: User message, YYYY-MM-DD, turn M).*

## Section 8: Critical Code Snippets / Configuration / Outputs (Relevant Scope)

[Embed crucial code snippets, configuration file contents, API responses, error messages, or other outputs *directly related* to the task(s) being handed over or frequently referenced. Use appropriate Markdown code blocks. Ensure this is highly targeted to avoid clutter.]

```start of python cell
# Example: Relevant function being debugged or key configuration
def specific_function_under_review(input_data):
    # ... code directly relevant to handover ...
```end of python cell

## Section 9: Current Obstacles, Challenges & Risks (Relevant Scope)

[List any known blockers, unresolved issues, errors, technical challenges, or potential risks *specifically relevant* to the task or area being handed over. Be specific.]
*   **Blocker:** [Task ID/Description] - [Description of blocker] - **Status:** [e.g., Investigating, Waiting for User input, Pending external dependency]
*   **Error Encountered:** [Description of error] - **Details:** [Relevant log snippet, observation, or steps to reproduce if known]
*   **Potential Risk:** [Description of risk and potential impact]

## Section 10: Outstanding User/Manager Directives or Questions (Relevant Scope)

[List any recent instructions *relevant to this agent/task* from the User or Manager that are still pending action, or questions awaiting answers. Distinguish from general conversational context in Section 7 by focusing on explicit, unresolved items.]
*   [Directive/Question 1: e.g., "User asked to investigate alternative library Z for Task X. Investigation pending."]
*   [Directive/Question 2: e.g., "Manager requested a performance benchmark for function Y. Not yet started."]

## Section 11: Key Project File Manifest (Relevant Scope - Optional but Recommended)

[List key files the incoming agent will likely need to interact with for their immediate task(s). Provide brief context on relevance.]
*   `src/core_module/file_x.py`: [Contains the primary logic for feature Y, currently under development.]
*   `tests/unit/test_file_x.py`: [Unit tests for feature Y; some may be failing.]
*   `config/settings.json`: [Relevant configuration for the current task.]
*   ...

```

## 3. `Handover_Prompt.md` Format (New Agent Initialization)

This prompt initializes the new agent instance, regardless of type. It blends standard APM context (if needed) with handover-specific instructions.

```start of markdown cell
# APM Agent Initialization - Handover Protocol

You are being activated as an agent ([Agent Type, e.g., Manager Agent, Implementation Agent]) within the **Agentic Project Management (APM)** framework.

**CRITICAL: This is a HANDOVER situation.** You are taking over from a previous agent instance ([Outgoing Agent ID]). Your primary goal is to seamlessly integrate and continue the assigned work based on the provided context.

## 1. APM Framework Context (As Needed for Role)

**(For Manager Agents, the preparer should integrate essential Sections 1 and 2 from `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md` here, adapting "Your Role" / "Core Responsibilities" to reflect the takeover.)**
**(For Implementation/Specialized Agents, this section may be omitted or heavily condensed by the preparer, focusing only on essential concepts like the Memory Bank if the agent is already familiar with APM basics.)**

*   **Your Role:** [Briefly state the role and the fact you are taking over, e.g., "As the incoming Manager Agent, you are responsible for overseeing the project's progression...", "As Implementation Agent B, you are taking over Task X..."]
*   **Memory Bank:** You MUST log significant actions/results to the Memory Bank(s) located at [Path(s) from Handover File, Section 1] using the format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`. Logging occurs after User confirmation of task state.
*   **User:** The primary stakeholder and your main point of communication.

## 2. Handover Context Assimilation

A detailed **`Handover_File.md`** has been prepared containing the necessary context for your role/task.

*   **File Location:** [Relative path to the generated `Handover_File.md`]
*   **File Contents Overview:** This file contains the current state of your assigned task(s) or project scope, including: Implementation Plan status, relevant decisions, recent activity logs from the Memory Bank, critical code/outputs, known obstacles, and recent User directives.

**YOUR IMMEDIATE TASK:**

1.  **Thoroughly Read and Internalize:** Carefully read the *entire* `Handover_File.md`. Pay extremely close attention to sections most relevant to your immediate responsibilities, such as:
    *   `Section 3: Implementation Plan Status` (for your assigned tasks)
    *   `Section 6: Recent Memory Bank Entries`
    *   `Section 7: Recent Conversational Context & Key User Directives`
    *   `Section 8: Critical Code Snippets / Configuration / Outputs`
    *   `Section 9: Current Obstacles, Challenges & Risks`
    *   `Section 10: Outstanding User/Manager Directives or Questions`
2.  **Identify Next Steps:** Based *only* on the information within the `Handover_File.md`, determine the most immediate priorities and the next 1-2 actions required for your role/task.
3.  **Confirm Understanding to User:** Signal your readiness to the User by:
    *   Briefly summarizing the current status *of your specific task(s) or overall project scope*, based on your understanding of the `Handover_File.md`.
    *   Listing the 1-2 most immediate, concrete actions you will take.
    *   Asking any critical clarifying questions you have that are essential *before* you can proceed with those actions. Focus on questions that, if unanswered, would prevent you from starting.

Do not begin any operational work until you have completed this assimilation and verification step with the User and received their go-ahead.

## 3. Initial Operational Objective

Once your understanding is confirmed by the User, your first operational objective will typically be:

*   **[The preparer of this prompt should state the explicit first task derived from the Handover File, e.g., "Address the primary blocker identified in Section 9 of the Handover_File.md for Task X", "Resume implementation of feature Y as detailed in Section 3 and Section 8 of the Handover_File.md", "Prepare the task assignment prompt for the next sub-task identified in Section 3", "Action the outstanding User directive noted in Section 10"]**

Proceed with the Handover Context Assimilation now. Acknowledge receipt of this prompt and confirm you are beginning the review of the `Handover_File.md`.
```

## 4. Notes on Variations for Specialized Agent Handovers

As indicated in the templates above, handovers for Specialized Agents (e.g., Implementer, Debugger, Tester) typically involve **scope-limited versions** of these formats:

*   **`Handover_File.md` (Simplified & Focused):** The preparer (Manager Agent or User) must ensure the content is highly focused on the *specific task(s)* being handed over. Sections like overall project goals, full agent roster, or extensive historical decision logs (if not directly relevant to the specific task) may be omitted or properely summarized. The goal is to provide all necessary context for *the next tasks* without overwhelming the next Agent with past info not particularly useful for the next task or the rest of the project.
*   **`Handover_Prompt.md` (Simplified):** Contains the general APM framework introduction (Section 1) or a dense summary if the Agent has been activated before. Instructions in Section 2 and 3 should focus directly on understanding the *task-specific* context from the tailored Handover File and resuming that specific work.

The key is that the Manager Agent or User preparing the handover artifacts must tailor the content of both `Handover_File.md` and `Handover_Prompt.md` to the precise needs, role, and scope of the incoming specialized agent.

## 5. General Formatting Notes

*   **Clarity and Conciseness:** Prioritize clear, unambiguous language. While comprehensive for Manager Handovers, always focus information on what the incoming agent *needs* to proceed effectively within its designated scope.
*   **Recency and Relevance:** Emphasize the most recent and directly relevant information, especially for Memory Bank entries, conversational context, and outputs.
*   **Markdown Usage:** Use standard Markdown consistently for headings, lists, code blocks, etc., to ensure readability by both humans and AI agents.
*   **Placeholders:** Replace all bracketed placeholders `[like this]` with the actual project-specific information.
*   **Verification Step:** The User confirmation step outlined in the `Handover_Prompt.md` (Section 2, item 3) is crucial; ensure the instructions for the incoming agent are explicit about summarizing status, next actions, and asking critical questions.
