# Getting Started with APM

This guide provides a step-by-step walkthrough for setting up and running your first project using the Agentic Project Management (APM) framework. It assumes you have a basic understanding of the APM concepts from the `00_Introduction.md` and `01_Workflow_Overview.md`.

## Prerequisites

*   **AI Assistant Platform:** Access to an LLM-based AI assistant where you can maintain distinct, ongoing chat sessions (e.g., Cursor IDE, Claude, ChatGPT Plus with GPTs, etc.). APM relies on managing multiple agent sessions.
*   **Project Idea:** A task or project complex enough to benefit from a structured, multi-agent approach. 
*   **Markdown Familiarity:** Basic understanding of Markdown syntax for interacting with prompts and logs.
*   **APM Files:** Access to the APM assets (prompts, guides, and protocol definitions), particularly the `/prompts` directory. The complete APM library is available [here](https://github.com/sdi2200262/agentic-project-management).

## 1. Understand the APM Framework

Before diving in, familiarize yourself with the core concepts of APM:

*   **Roles:** Manager Agent, Implementation Agent(s), User.
*   **Key Artifacts:** `Implementation_Plan.md`, `Memory_Bank.md` (or `Memory/` directory for the Memory Bank System), `Handover_File.md` and the Handover Prompt.
*   **Core Workflow:** Review the [Workflow Overview](01_Workflow_Overview.md) and the main `README.md`.
*   **Prompt Library:** Understand that the `prompts/` directory contains the core instructions for agents.
*   **(Optional) Cursor Rules:** The `rules/` directory (mirrored as `.cursor/rules/` in your project) contains optional rules for users of the Cursor IDE to enhance agent reliability and workflow efficiency. See the `rules/README.md` and the [Cursor Integration Guide](04_Cursor_Integration_Guide.md) for details.

## 2. Setting Up Your Project: Accessing APM Assets

You have a few options to get the APM prompts, guides, and protocol definitions:

1.  **Use the APM Template (Recommended for Custom Projects):**
    *   Click the "Use this template" button on the [APM GitHub Repository](https://github.com/sdi2200262/agentic-project-management).
    *   This creates *your own repository* pre-filled with the entire APM structure.
    *   **Ideal Setup:** Clone *your new repository* to the root of your project workspace. This ensures the Manager Agent can easily reference all APM guides if you confirm full asset availability.
2.  **Clone the Official APM Repository (Recommended for Direct Use & Updates):**
    *   Clone the main [APM GitHub Repository](https://github.com/sdi2200262/agentic-project-management) directly into your project workspace, ideally at the root.
    *   This gives you direct access to the latest version and all assets.
3.  **Manual Copy-Pasting (Basic Usage):**
    *   You can copy-paste the content of prompts (like `01_Initiation_Prompt.md`) directly from the official APM GitHub repository into your AI assistant as needed.
    *   This requires more manual effort from you to provide guide contents when the Manager Agent requests them.

**Important:** For the Manager Agent to operate with full file awareness (if your AI platform supports it), the APM assets (especially the `prompts/` directory) should ideally be located at the root of your project workspace.

## 3. Initiating APM within your Project

This is the first crucial step to get APM running:

1.  **Open your AI Assistant (e.g., Cursor).** Dedicate a new, clean chat tab or session for your Manager Agent.
2.  **Provide the Initiation Prompt:**
    *   Navigate to `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md` (in your chosen APM asset location).
    *   Copy its *entire content*.
    *   Paste this into the chat with your designated Manager Agent as the very first message.
3.  **Follow the Lead:** Your new Manager Agent (MA), guided by this prompt, will then:
    *   Verify APM asset availability with you (you'll confirm your setup: full clone, partial, or copy-pasting).
    *   Ask for a high-level project overview.
    *   Present options for detailed project discovery (User-Directed or MA-Guided via `02_Codebase_Guidance.md`).
    *   Engage in the chosen discovery process.

## 4. Developing the Implementation Plan & Memory Bank System

This phase is driven by the Manager Agent after it has gathered sufficient context:

1.  **Autonomous Planning Trigger:** The MA will *autonomously determine* when it has a comprehensive understanding to proceed with planning. 
2.  **Consolidated Proposal & Creation:** In a single, comprehensive message, the MA will:
    *   Present a **high-level summary** of its proposed `Implementation_Plan.md`.
    *   Propose a **Memory Bank System structure** (e.g., a single `Memory_Bank.md` file or a `Memory/` directory with multiple files), with justification (guided by `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md`).
    *   **Proceed to create the `Implementation_Plan.md` file** in your project workspace, using `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md`.
    *   **Proceed to create the initial Memory Bank file(s) and structure** (e.g., `Memory_Bank.md` or the `Memory/` directory with its `README.md` and initial log files), using the system design principles and header formats detailed in `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md`.
3.  **User Review and Refinement:**
    *   The MA will invite you to **review the content of the newly created files**.
    *   Discuss any necessary modifications with the MA, who will update the files.
4.  **Final Confirmation:** Confirm with the MA when you are satisfied with the `Implementation_Plan.md` and Memory Bank System setup.

## Step 5: Running the Task Cycle (The Core Loop)

This is the iterative process of getting work done.

1.  **Prepare Task Assignment Prompt:**
    *   Identify the first task (e.g., "Phase 1 / Task A / Item 1") in your `Implementation_Plan.md`. Note the assigned agent (e.g., "Agent A").
    *   In the **Manager Agent's chat**, ask it to help you prepare the Task Assignment Prompt for this specific task and agent. You can say: "Give me the task assignment prompt for Agent A to complete Phase 1 / Task A / Item 1, following the task assignment guide."
    *   The Manager (referencing `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md`) will provide you with a draft prompt. Review and refine it with the Manager if needed.
2.  **Initiate Implementation Agent:**
    *   Open a **new, separate chat session**. This will be your "Agent A". Name it clearly.
    *   **Copy the *entire* content** of `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`.
    *   Paste it as the **first message** to Agent A.
    *   Agent A should acknowledge understanding and state readiness for its first task.
3.  **Deliver Task Prompt:**
    *   Copy the Task Assignment Prompt that the Manager gave you.
    *   Paste it into **Agent A's chat session**.
4.  **Execute & Report:**
    *   Agent A will now execute the task. It may ask you (the User) clarifying questions. Answer them to the best of your ability.
    *   Once Agent A finishes, makes significant progress, or encounters a blocker, it will report its status and output back to **you** in its chat session.
5.  **Confirm & Instruct Logging:**
    *   Review Agent A's report.
    *   **Decide** if the work should be logged (usually yes for completion or significant progress/blockers).
    *   Instruct Agent A clearly, e.g., "Okay, thank you. Please log this work to `Memory_Bank.md` using the standard format." (Agent A already knows the format from its onboarding/task prompt references to `Memory_Bank_Log_Format.md`).
6.  **Inform Manager & Review:**
    *   Go back to the **Manager Agent's chat session**.
    *   Inform the Manager: "Agent A has completed Task [Reference] and logged the results to `Memory_Bank.md`."
    *   The Manager Agent (following `prompts/01_Manager_Agent_Core_Guides/04_Review_And_Feedback_Guide.md`) will then proceed with its review process. It may ask you for the specific log entry content if it cannot access files directly.
    *   The Manager will provide its assessment (task successful, or issues found with corrective steps) back to you.
7.  **Repeat:** Based on the Manager's review feedback:
    *   If successful, the Manager will proceed to prepare the prompt for the *next* task in the `Implementation_Plan.md`.
    *   If issues require correction, the Manager will prepare a revised Follow-up Task Assignment Prompt for Agent A (or potentially assign a different agent like a Debugger). You will revise the cycle with said prompt until completion.

## Step 6: Handling Handovers (When Necessary)

If an agent (especially the Manager) nears its context limit, or you need to swap agents for strategic reasons, use the Handover Protocol.

1.  **Identify Need:** The Manager may warn you, or you might observe degraded performance.
2.  **Instruct Manager:** In the **current Manager Agent's chat**, instruct it to initiate the Handover Protocol as detailed in `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md`.
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