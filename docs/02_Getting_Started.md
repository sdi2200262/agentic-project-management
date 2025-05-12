# Getting Started with APM

This guide provides a step-by-step walkthrough for setting up and running your first project using the Agentic Project Management (APM) framework. It assumes you have a basic understanding of the APM concepts from the `00_Introduction.md` and `01_Workflow_Overview.md`.

## Prerequisites

*   **AI Assistant Platform:** Access to an LLM-based AI assistant where you can maintain distinct, ongoing chat sessions (e.g., Cursor IDE, Claude, ChatGPT Plus with GPTs, etc.). APM relies on managing multiple agent sessions.
*   **Project Idea:** A task or project complex enough to benefit from a structured, multi-agent approach.
*   **Markdown Familiarity:** Basic understanding of Markdown syntax for interacting with prompts and logs.
*   **APM Files:** Access to the APM framework files, particularly the `/prompts` directory. The complete APM library is available [here](https://github.com/sdi2200262/agentic-project-management).

## Step 1: Setup Your Project Environment

1.  **Use the APM Template (Recommended):** The easiest way to get started is to use this repository as a template. Go to the [APM GitHub Repository](https://github.com/sdi2200262/agentic-project-management) and click the "Use this template" button to create a new repository for your project, pre-populated with the correct structure and all necessary prompt files.
2.  **Manual Setup (Alternative):** If you prefer not to use the template, create a new directory for your project. Then, at minimum, create a `/prompts` directory inside it and copy the complete contents of the APM framework's `/prompts` directory (including all subdirectories: `00_...`, `01_...`, `02_...`) into your project's `/prompts` folder.
3.  **Create Initial Memory Bank:** In the root of your new project folder (whether created from the template or manually), create an empty file named `Memory_Bank.md`. This file will store the logs from your Implementation Agents. *The Manager Agent needs this file to exist to correctly guide the logging process.*

## Step 2: Initiate the Manager Agent

The Manager Agent is the central coordinator.

1.  **Start Manager Session:** Open a new, dedicated chat session with your chosen AI assistant. This session **is** your Manager Agent. Give it a clear name if your platform allows (e.g., "APM Manager - Project X").
2.  **Deliver Initiation Prompt:** **Copy the *entire* content** of the file:
    `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md`
    ...and paste it as the **very first message** in the Manager Agent's chat session.
3.  **Confirm Assets:** The Manager Agent should respond based on the prompt, likely asking you to confirm the location of the APM framework assets (the `/prompts` directory). Respond affirmately, confirming they are available within the project structure (e.g., "Yes, the prompts directory is set up correctly at `./prompts`").

## Step 3: Project Discovery & Planning

Now, work with the Manager Agent to define the project.

1.  **Provide Overview:** The Manager will ask for a high-level project overview. Describe your project's goals, main requirements, and any key constraints.
2.  **Guided Discovery (Recommended):** The Manager will likely recommend using the `02_Codebase_Guidance.md` prompt for a more structured discovery process. This is highly beneficial for complex projects. To proceed with this:
    *   **Copy the *entire* content** of `prompts/00_Initial_Manager_Setup/02_Codebase_Guidance.md`.
    *   Paste it as your next message to the Manager Agent.
    *   Answer the Manager's subsequent questions thoroughly. It will inquire about project specifics, technical details, existing codebase (if any), etc.
    *   *(Alternatively, if you skip the guided discovery, provide detailed project information conversationally.)*
3.  **Develop Implementation Plan Structure:** Based on the discovery phase, the Manager Agent will propose a high-level structure for the project plan (phases, major tasks, conceptual agent assignments).
4.  **Review & Approve Structure:** Discuss this proposed structure with the Manager. Request clarifications or suggest modifications until you are satisfied. **Explicitly state your approval** of the structure (e.g., "Okay, I approve this plan structure.").
5.  **Generate Formatted Plan:** Upon receiving your approval for the *structure*, the Manager Agent (now guided by `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md`) will generate the detailed, formatted content for the plan.
6.  **Create `Implementation_Plan.md` File:** Ask the Manager Agent to provide the complete, formatted plan content. Copy this content and create a file named `Implementation_Plan.md` in your project root (or agreed location).

## Step 4: Running the Task Cycle (The Core Loop)

This is the iterative process of getting work done.

1.  **Prepare Task Assignment Prompt:**
    *   Identify the first task (e.g., "Phase 1 / Task A / Item 1") in your `Implementation_Plan.md`. Note the assigned agent (e.g., "Agent A").
    *   In the **Manager Agent's chat**, ask it to help you prepare the Task Assignment Prompt for this specific task and agent. You can say: "Please help me prepare the task assignment prompt for Agent A to complete Phase 1 / Task A / Item 1, following the task assignment guide."
    *   The Manager (referencing `prompts/01_Manager_Agent_Core_Guides/02_Task_Assignment_Prompts_Guide.md`) will provide you with a draft prompt. Review and refine it with the Manager if needed.
2.  **Initiate Implementation Agent:**
    *   Open a **new, separate chat session**. This will be your "Agent A". Name it clearly.
    *   **Copy the *entire* content** of `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`.
    *   Paste it as the **first message** to Agent A.
    *   Agent A should acknowledge understanding and state readiness for its first task.
3.  **Deliver Task Prompt:**
    *   Copy the final Task Assignment Prompt (prepared with the Manager in step 4a).
    *   Paste it into **Agent A's chat session**.
4.  **Execute & Report:**
    *   Agent A will now execute the task. It may ask you (the User) clarifying questions. Answer them to the best of your ability.
    *   Once Agent A finishes, makes significant progress, or encounters a blocker, it will report its status and output back to **you** in its chat session.
5.  **Confirm & Instruct Logging:**
    *   Review Agent A's report.
    *   **Decide** if the work should be logged (usually yes for completion or significant progress/blockers).
    *   Instruct Agent A clearly, e.g., "Okay, thank you. Please log this work to `Memory_Bank.md` using the standard format." (Agent A knows the format from its onboarding/task prompt references to `Memory_Bank_Log_Format.md`).
6.  **Inform Manager & Review:**
    *   Go back to the **Manager Agent's chat session**.
    *   Inform the Manager: "Agent A has completed Task [Reference] and logged the results to `Memory_Bank.md`."
    *   The Manager Agent (following `prompts/01_Manager_Agent_Core_Guides/03_Review_And_Feedback_Guide.md`) will then proceed with its review process. It may ask you for the specific log entry content if it cannot access files directly.
    *   The Manager will provide its assessment (task successful, or issues found with corrective steps) back to you.
7.  **Repeat:** Based on the Manager's review feedback:
    *   If successful, return to step 4a to prepare the prompt for the *next* task in the `Implementation_Plan.md`.
    *   If issues require correction, work with the Manager to prepare a revised Task Assignment Prompt for Agent A (or potentially assign a different agent like a Debugger), then return to step 4c.

## Step 5: Handling Handovers (When Necessary)

If an agent (especially the Manager) nears its context limit, or you need to swap agents for strategic reasons, use the Handover Protocol.

1.  **Identify Need:** The Manager may warn you, or you might observe degraded performance.
2.  **Instruct Manager:** In the **current Manager Agent's chat**, instruct it to initiate the Handover Protocol as detailed in `prompts/01_Manager_Agent_Core_Guides/04_Handover_Protocol_Guide.md`.
3.  **Prepare Artifacts:** The Manager will guide you (or directly generate, if capable) the content for `Handover_File.md` (context dump) and `Handover_Prompt.md` (initialization prompt), using the formats defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Formats.md`.
4.  **Review Artifacts:** Carefully review the generated content for accuracy and completeness.
5.  **Initiate New Agent:**
    *   Start a **new, separate chat session** for the replacement agent (e.g., "APM Manager v2").
    *   Paste the prepared `Handover_Prompt.md` content as the **first message**.
    *   Ensure the `Handover_File.md` content is accessible (e.g., paste it after the prompt, or ensure the new agent can read the file if your platform allows).
6.  **Verify & Continue:** The new agent will process the handover information and should prompt you to confirm its understanding. Verify its summary, then instruct it to resume the project tasks (e.g., "Okay, please proceed with reviewing the status of Agent A's last task."). The workflow continues from where the previous agent left off.

## Conclusion

This guide covers the fundamental steps to get started with APM. Remember to:

*   Use separate chat sessions for each agent instance.
*   Be the communication bridge between agents.
*   Leverage the Manager Agent for planning, prompt crafting, and review.
*   Ensure Implementation Agents log their work consistently after your confirmation.
*   Refer back to the specific prompts, guides, and format definitions in the `/prompts` directory and the detailed explanations in the `/docs` directory whenever needed.

Happy managing! 