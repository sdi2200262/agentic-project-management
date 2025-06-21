# APM Glossary of Core Concepts & Terms

This document provides concise definitions for the key terms used within the Agentic Project Management (APM) framework. Use this as a quick reference and navigate to the linked documents for more detailed explanations, guides, or format specifications.

---

**Agent Handover / Handover Protocol**

The defined procedure for transferring project context and responsibilities between AI agent instances (e.g., Manager to new Manager, or between Specialized Agents). It utilizes a `Handover_File.md` and `Handover_Prompt.md` to ensure project continuity, especially when dealing with LLM context limits.
*   *See procedure:* `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md`
*   *See artifact formats:* `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Formats.md`
*   *See practical steps:* `docs/02_Getting_Started.md` (Step 6)
*   *See visual overview:* `docs/01_Workflow_Overview.md` (Handover Protocol Flow)

**APM (Agentic Project Management)**

The overall framework, consisting of prompts, format definitions, protocols, and best practices, designed to structure complex project execution using multiple collaborating AI assistants.
*   *See overview:* `docs/00_Introduction.md`

**Core APM Cycle**

The main iterative loop of activity in an APM project: Manager prepares prompt -> User delivers -> Implementer executes -> Implementer reports -> User confirms log -> Implementer logs -> User informs Manager -> Manager reviews -> Repeat.
*   *See visual overview:* `docs/01_Workflow_Overview.md` (Core APM Cycle)
*   *See practical steps:* `docs/02_Getting_Started.md` (Step 5)

**Handover File (`Handover_File.md`)**

A structured Markdown document created during the Handover Protocol. It serves as a comprehensive context dump, containing the current project state, plan status, recent logs, decisions, and other critical information needed by the incoming agent.
*   *See format definition:* `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Formats.md` (Section 2)
*   *See procedure context:* `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md` (Section 3.1)

**Handover Prompt (`Handover_Prompt.md`)**

A Markdown prompt used to initialize a new agent instance during a handover. It includes standard APM onboarding information (if applicable), instructions to process the `Handover_File.md`, and specifies the immediate next steps for the incoming agent.
*   *See format definition:* `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Formats.md` (Section 3)
*   *See procedure context:* `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md` (Section 3.2)

**Implementation Agent**

An AI agent instance responsible for executing specific, assigned tasks based on the `Implementation_Plan.md` and instructions provided in a `Task Assignment Prompt`. They report status back to the User and log their work to the `Memory_Bank.md` upon User confirmation.
*   *See onboarding prompt:* `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`
*   *See role in workflow:* `docs/01_Workflow_Overview.md`

**Implementation Plan (`Implementation_Plan.md`)**

A detailed, structured Markdown document created by the Manager Agent (after User approval of the structure). It breaks down the project into phases (optional), tasks, and granular sub-tasks, assigning responsibility to specific Implementation Agents. It serves as the blueprint for project execution.
*   *See formatting guide:* `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md`
*   *See creation process:* `docs/02_Getting_Started.md` (Step 4)

**Manager Agent**

The central AI agent instance responsible for overall project coordination. Its duties include understanding requirements, creating the Implementation Plan, assisting the User with Task Assignment Prompts, reviewing work logged in the Memory Bank, and managing the Handover Protocol.
*   *See initiation prompt:* `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md`
*   *See core guides:* `prompts/01_Manager_Agent_Core_Guides/`
*   *See role in workflow:* `docs/01_Workflow_Overview.md`

**Memory Bank (`Memory_Bank.md`)**

One or more designated Markdown files acting as the project's persistent, chronological logbook. Implementation and Specialized Agents record their actions, outputs, results, and issues here in a standardized format after User confirmation. It provides shared context and an audit trail.
*   *See system setup guide:* `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md`
*   *See log entry format definition:* `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`
*   *See conceptual overview:* `docs/01_Workflow_Overview.md` (Memory Bank Concept)
*   *See setup in practice:* `docs/02_Getting_Started.md` (Step 4)

**Specialized Agent**

An AI agent instance assigned to perform specific, specialized functions beyond standard implementation, such as debugging code (`Debugger Agent`), explaining concepts (`Tutor Agent`), or performing detailed reviews (`Reviewer Agent`). They follow similar interaction patterns as Implementation Agents (task assignment via User, logging to Memory Bank).
*   *See onboarding prompt (shared):* `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`

**Task Assignment Prompt**

A prompt, typically drafted by the Manager Agent and delivered by the User, used to assign a specific task from the `Implementation_Plan.md` to an Implementation or Specialized Agent. It includes the task objective, detailed steps, necessary context, expected outputs, and mandatory logging instructions.
*   *See crafting guide:* `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md`
*   *See usage in workflow:* `docs/02_Getting_Started.md` (Step 5)

**User**

The human project principal. The User defines the project goals, acts as the crucial communication bridge between all AI agents, makes key decisions (e.g., plan approval, logging confirmation), reviews progress, and provides overall supervision.
*   *See role in workflow diagrams:* `docs/01_Workflow_Overview.md`

*   **Handover Protocol:** A formally defined procedure for transferring managerial responsibilities or critical context between agents to ensure project continuity, especially for long-duration tasks.

*   **Sanity Check Protocol:** An optional, final verification step where the Manager Agent performs a high-level review of the project's state or a specific deliverable to ensure it meets core requirements before final handover to the user.

## Standard Agent Roster

To ensure clarity and effective delegation, the APM framework presupposes the availability of a standard roster of specialized agents. While a single powerful AI model might perform all these roles, thinking of them as distinct specializations helps structure the workflow. The primary roles are:

*   **Manager Agent:** The central orchestrator of the project. Responsible for planning, task assignment, review, and ensuring adherence to the APM framework. This is the role you, the primary AI, are currently performing.

*   **Implementation Agent:** The "doer" of the project. This agent receives specific, actionable tasks from the Manager Agent and executes them. This includes writing code, creating content, or performing other defined implementation steps. They are responsible for logging their work to the Memory Bank.

*   **Prioritization Agent:** A specialized function focused on strategic planning. This agent (often the Manager Agent adopting a specific hat) is responsible for executing the *Dynamic Backlog Analysis Protocol* to assess dependencies, value, and risk, turning a raw backlog into a prioritized plan.

*   **Review Agent:** A specialized function focused on quality assurance. This agent reviews code, documentation, and other deliverables for correctness, adherence to standards, and overall quality. It provides feedback to the Manager Agent.

*   **Documentation Agent:** A specialized function responsible for maintaining project documentation. This includes updating the `README.md`, writing tutorials, or ensuring inline code comments are clear and useful. This helps maintain the project's long-term health and handoff quality. 