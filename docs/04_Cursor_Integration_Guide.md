# APM Cursor Integration Guide

## 1. Introduction

This guide provides specific instructions and best practices for implementing the Agentic Project Management (APM) framework effectively within the Cursor IDE.

Cursor's unique features, such as its integrated AI chat, multiple chat tabs, and file context awareness (`@` symbol), make it an exceptionally well-suited environment for managing the multi-agent workflows defined by APM.

## 2. Managing Agents with Cursor Tabs

The core principle for running APM in Cursor is:

**One Cursor Chat Tab = One APM Agent Instance**

*   **Dedicate Tabs:** Maintain a separate, persistent AI chat tab for each active agent in your project.
    *   One tab for your **Manager Agent**.
    *   One tab for **Implementation Agent A**.
    *   One tab for **Implementation Agent B**.
    *   One tab for a **Debugger Agent** (if needed), etc.
*   **Name Tabs Clearly:** Use Cursor's tab renaming feature to label each tab according to its agent role and potentially its focus (e.g., "APM Manager - Main", "APM Agent A - Backend", "APM Agent B - Frontend", "APM Debugger - Login Bug"). This is crucial for organization.
*   **Maintain Separation:** Always interact with an agent within its designated tab. Avoid asking the Manager Agent to perform an Implementation Agent's task or vice-versa within the wrong tab, as this confuses context.

## 3. Using APM Prompts in Cursor

*   **Initialization:** Start each agent by copying the *entire* content of its corresponding initialization prompt from the `/prompts` directory and pasting it as the **very first message** in that agent's dedicated Cursor tab.
    *   Manager Agent: Use `prompts/00_Initial_Manager_Setup/01_Initiation_Prompt.md`.
    *   Implementation/Specialized Agents: Use `prompts/02_Utility_Prompts_And_Format_Definitions/Implementation_Agent_Onboarding.md`.
*   **Task Assignment:** Follow the workflow outlined in `docs/02_Getting_Started.md`:
    1.  Work with the **Manager Agent** (in its tab) to prepare the `Task Assignment Prompt` (referencing `prompts/01_Manager_Agent_Core_Guides/02_Task_Assignment_Prompts_Guide.md`).
    2.  Copy the finalized prompt.
    3.  Paste the prompt into the designated **Implementation Agent's** tab.
*   **Other Prompts/Guides:** Similarly, copy content from relevant guides (e.g., `02_Codebase_Guidance.md`, handover prompts) when instructing the Manager or other agents as specified in the APM workflow.

## 4. Leveraging Cursor's Context Features

Cursor's built-in context features can enhance APM interactions *within* a single agent's session:

*   **`@` Symbol:** Use the `@` symbol within your prompts to an agent to grant it temporary access to specific files (`@src/my_module.py`) or code symbols (`@my_function`). This is useful for providing immediate context for a specific task (e.g., "Refactor the `@calculate_total` function in `@src/utils.py`").
*   **Complementary, Not Replacement:** These features are powerful for *in-session task execution* but **do not replace** APM's core mechanisms for long-term project management:
    *   The **Memory Bank** is still essential for persistent, structured logging and providing historical context beyond the immediate chat history.
    *   The **Handover Protocol** is still required for managing context limits across long-running sessions or agent transitions.

APM provides the **structured process**, while Cursor's `@` features provide **tooling within that process**.

## 5. Interacting with Files & Memory Bank

*   **User as Bridge:** You, the User, typically act as the intermediary for file content. Copy relevant code snippets, error messages, or outputs from an agent's chat tab when needed (e.g., pasting an Implementation Agent's output into the Manager's tab for review, or copying a code snippet into `Memory_Bank.md`).
*   **Direct Edits (Use with Care):** Cursor agents can propose direct file edits (`Cmd+K` or `Ctrl+K` with code selected, or via chat suggestions). This can speed up implementation for simple changes.
    *   **User Review:** Always carefully review any direct edits proposed by an agent before applying them.
    *   **Logging Still Required:** Even if an agent makes a direct edit, ensure it still reports its action back to you. You must then confirm logging and instruct the agent to log the change (or log it yourself) in the `Memory_Bank.md` using the standard format to maintain the project record.
*   **Reviewing the Memory Bank:** When asking the Manager Agent to review completed work:
    1.  Have `Memory_Bank.md` open in your editor.
    2.  Use `@Memory_Bank.md` in your prompt to the Manager (e.g., "Please review the latest log entry for Agent A in `@Memory_Bank.md`").
    3.  Alternatively, copy the relevant log entry text from the file and paste it directly into the Manager's chat.

## 6. Potential Use of `.cursor/rules.json` for Custom Behavior (Advanced)

Cursor offers an advanced feature for tailoring AI behavior on a per-project basis using a `.cursor/rules.json` file.

*   **Concept:** This file allows you to define custom rules that trigger specific AI instructions or behaviors based on context like cursor position, selected text, file type, or commands entered.
*   **APM Potential (Conceptual):** While **not required** for APM, `rules.json` *could potentially* be configured to assist the workflow. Examples:
    *   Automatically suggesting the standard Memory Bank logging instruction when the Manager drafts a Task Assignment Prompt.
    *   Providing rule-based reminders (e.g., "Remember to get User confirmation before logging").
    *   Creating custom commands or shortcuts for frequently used APM instructions.
*   **Disclaimer & Caution:**
    *   **APM works fine without `rules.json`.** The manual workflow using the provided prompts is the fully supported baseline.
    *   Creating effective rules requires a deep understanding of Cursor's rules engine, JSON syntax, and potentially regular expressions. It's an advanced feature for power users.
    *   **I would greately value contributions intergrating Cursor's automated tools into APM's workflow!!**
*   **Further Resources:** **This guide does not provide specific rule implementations.** Crafting effective rules is complex and specific to individual workflows and preferences. Users interested in exploring this advanced feature should consult Cursor's official documentation on `rules.json` [here](https://docs.cursor.com/context/rules).

## 7. Tips for Efficient Cursor Usage with APM

*   **Split Views:** Use Cursor's split editor feature (View > Editor Layout > Split...) to see multiple agent tabs simultaneously (e.g., Manager and Implementation Agents).
*   **Diff Viewer:** Pay attention to Cursor's built-in diff viewer when agents propose changes via chat or direct edits.
*   **Focus:** Keep each agent tab focused on its designated APM role. Avoid asking the Manager to write implementation code or an Implementer to devise high-level plans.

By leveraging Cursor's tabbed interface and context features within the structured APM framework, you can create a powerful and organized environment for tackling complex projects with AI assistance. 