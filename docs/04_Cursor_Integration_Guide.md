# APM Cursor Integration Guide

## 1. Introduction

This guide provides specific instructions and best practices for implementing the Agentic Project Management (APM) framework effectively within the Cursor IDE.

Cursor's unique features, such as its integrated AI chat, multiple chat tabs, and file context awareness (`@` symbol), make it an exceptionally well-suited environment for managing the multi-agent workflows defined by APM.

## 2. Core APM Setup in Cursor

### 2.1. Managing Agents with Dedicated Cursor Tabs

The core principle for running APM in Cursor is:

**One Cursor Chat Tab = One APM Agent Instance**

*   **Dedicate Tabs:** Maintain a separate, persistent AI chat tab for each active agent in your project (e.g., Manager Agent, Implementation Agent A, Implementation Agent B, Debugger Agent).
*   **Name Tabs Clearly:** Use Cursor's tab renaming feature to label each tab according to its agent role and potential focus (e.g., "APM Manager - Main", "APM Agent A - Backend"). This is crucial for organization.
*   **Maintain Separation:** Always interact with an agent within its designated tab. Avoid cross-contamination of roles between tabs to prevent context confusion.

### 2.2. Using APM Prompts for Agent Initialization and Tasks

*   **Initialization:** Start each agent by copying the *entire* content of its corresponding initialization prompt from the `/prompts` directory and pasting it as the **very first message** in that agent's dedicated Cursor tab.
    *   Manager Agent: Use `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md`.
    *   Implementation/Specialized Agents: Use `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`.
*   **Task Assignment:**
    1.  Work with the **Manager Agent** (in its tab) to prepare the `Task Assignment Prompt` (referencing `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md`).
    2.  Copy the finalized prompt.
    3.  Paste the prompt into the designated **Implementation Agent's** tab.
*   **Other Prompts/Guides:** Similarly, copy content from relevant guides (e.g., `02_Codebase_Guidance.md`, handover prompts) when instructing agents as specified in the APM workflow.

## 3. Leveraging Cursor's IDE Features

Cursor's built-in capabilities can significantly enhance APM interactions:

*   **Contextualizing with Files/Folders (`@` symbol):** Use `@` to attach relevant files (e.g., `Implementation_Plan.md`, specific code files) or entire folders. This is crucial for providing context to the Manager Agent for reviews or to Implementation Agents for code understanding.
*   **Automatic Codebase Context:** Cursor automatically attempts to provide relevant codebase context. You can improve this by explicitly referencing key files or symbols.
*   **Direct File Edits (Use with Care):** Cursor agents can propose direct file edits (`Cmd+K` or `Ctrl+K` with code selected, or via chat suggestions). This can speed up implementation for simple changes.
    *   **User Review:** Always carefully review any direct edits proposed by an agent before applying them.
    *   **Logging Still Required:** Even if an agent makes a direct edit, ensure it reports its action back. You must then confirm logging and instruct the agent to log the change (or log it yourself) in the `Memory_Bank.md` using the standard format.
*   **Diff Viewer:** Pay attention to Cursor's built-in diff viewer when agents propose changes via chat or direct edits.

## 4. Interacting with APM Artifacts (e.g., Memory Bank)

*   **User as Bridge:** You, the User, typically act as the intermediary for file content. Copy relevant code snippets, error messages, or outputs between agent chat tabs as needed (e.g., pasting an Implementation Agent's output into the Manager's tab for review, or copying a code snippet into `Memory_Bank.md`).
*   **Reviewing the Memory Bank:** When asking the Manager Agent to review completed work:
    1.  Have `Memory_Bank.md` open in your editor.
    2.  Use `@Memory_Bank.md` in your prompt to the Manager (e.g., "Please review the latest log entry for Agent A in `@Memory_Bank.md`").
    3.  Alternatively, copy the relevant log entry text from the file and paste it directly into the Manager's chat.

## 5. Optional: Enhancing APM with Cursor Project Rules (Recommended)

The APM framework includes a `rules/` directory (which you should mirror to `.cursor/rules/` in your project) containing pre-defined [Cursor Project Rules](https://docs.cursor.com/context/rules). These are designed to further enhance the reliability and efficiency of APM agents when working within the Cursor IDE. **Using these rules is entirely optional but highly recommended for Cursor users.**

### 5.1. Purpose and Benefits of APM Project Rules

These rules provide persistent, scoped instructions to the AI, particularly the Manager Agent, at critical junctures in the APM workflow. They aim to:

*   **Reinforce Core Protocols:** Help the Manager Agent stay on track with APM procedures, especially during complex information gathering or when context might become fragmented.
*   **Ensure Consistency:** Remind the agent of standard formats and source documents for key APM artifacts (e.g., `Implementation_Plan.md`, Memory Bank files).
*   **Improve Efficiency:** Provide quick, targeted reminders that can prevent errors or reduce the need for re-prompting, minimizing impact on context window usage.
*   **Increased Reliability:** Reduces instances of agents deviating from the APM protocol.
*   **Reduced User Overhead:** Minimizes the need for users to manually repeat common instructions or corrections.

### 5.2. How APM Rules Work (Agent Requested Type)

The APM rules provided are primarily of the `Agent Requested` type. This means:

1.  Core APM prompts (e.g., `01_Initiation_Prompt.md`, `02_Codebase_Guidance.md`) contain conditional "self-notes" for the Manager Agent.
2.  These notes suggest that if the User has Cursor Rules enabled and the Manager Agent deems it helpful, it *may consider requesting* the relevant rule by its name (e.g., `@apm_discovery_synthesis_reminder`).
3.  The agent uses the rule's `description` (in its `.mdc` file) and current context to decide if activating the rule is appropriate.

This design ensures APM remains functional even if rules are not used or if APM is used outside Cursor.

### 5.3. Available Rules (Supporting the Initiation Phase)

Initially, rules are provided to support the Manager Agent's **Initiation Phase**. These are in `agentic-project-management/rules/`:

*   **`apm_discovery_synthesis_reminder.mdc`**
    *   **Purpose:** Helps the MA synthesize information and transition to planning after extensive discovery.

*   **`apm_plan_format_source.mdc`**
    *   **Purpose:** Reminds the MA of the correct guide for `Implementation_Plan.md` formatting.

*   **`apm_memory_system_format_source.mdc`**
    *   **Purpose:** Reminds the MA of the correct guide for Memory Bank formatting.

*   **`apm_impl_plan_critical_elements_reminder.mdc`**
    *   **Purpose:** Reminds the MA to ensure that the `Implementation_Plan.md` includes: 1) Explicit Agent Assignment for every task (considering task distribution), and 2) "Guiding Notes" for critical action steps to ensure methodological consistency.
    

*   **`apm_memory_naming_validation_reminder.mdc`**
    *   **Purpose:** Prompts the MA to validate all Memory Bank file/directory names against the `Implementation_Plan.md` *before* their creation and to strictly adhere to defined naming conventions.
    

*   **`apm_task_prompt_plan_guidance_incorporation_reminder.mdc`**
    *   **Purpose:** Ensures that when the MA is crafting `Task Assignment Prompts`, it explicitly incorporates and expands upon any "Guiding Notes" found in the `Implementation_Plan.md` for the relevant task steps.


Refer to `rules/README.md` for detailed descriptions of each rule and their suggestive descriptions for the agent.

### 5.4. Activating APM Project Rules in Your Project

1.  **Locate Rules:** Find the `agentic-project-management/rules/` directory.
2.  **Create `.cursor/rules/`:** In your project's root, create `.cursor/rules/` if it doesn't exist.
3.  **Copy Rules:** Copy desired `.mdc` rule files from the APM `rules/` directory into your project's `.cursor/rules/` directory.
4.  **Enable in Cursor:** Ensure "Project Rules" are enabled in `Cursor Settings > Rules`.

Conditional prompts in APM will then allow the MA to leverage these rules.

### 5.5. Concept for Other IDEs

The principle of IDE-specific, persistent, scoped instructions could be adapted for other AI-integrated IDEs offering similar features. Consider sharing insights via the APM GitHub repository if you explore this.

### 5.6. Further Resources on Cursor Rules
For detailed information on creating and managing rules in Cursor, including the `.mdc` format and different rule types, please consult [Cursor's official documentation on Rules](https://docs.cursor.com/context/rules).

## 6. Best Practices and Important Considerations

*   **Focus:** Keep each agent tab focused on its designated APM role. Avoid asking the Manager to write implementation code or an Implementer to devise high-level plans.
*   **Context Management:** Be mindful of context window limits in Cursor. For long conversations or large projects:
    *   Use the APM Handover Protocol when an agent nears its context limit.
    *   Summarize information where possible.
*   **Rule Activation & Updates:**
    *   Rules are activated based on the Manager Agent's judgment. If a rule isn't working as expected, ensure it's enabled and the MA is aware of it.
    *   Keep your local copies of APM rules up-to-date with any changes from the main APM framework.

By leveraging Cursor's tabbed interface and context features within the structured APM framework, you can create a powerful and organized environment for tackling complex projects with AI assistance. 