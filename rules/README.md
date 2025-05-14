# APM Framework - Optional Cursor IDE Rules

This directory, `rules/` (intended to be mirrored as `.cursor/rules/` in a user's project if they choose to use this feature), contains optional [Cursor IDE Rules](https://docs.cursor.com/context/rules). These rules are designed to enhance the robustness and efficiency of the Agentic Project Management (APM) framework when used within the Cursor IDE.

**Their use is entirely optional and primarily benefits users operating APM within Cursor.** The core APM prompts are designed to function effectively without these rules.

## How These Rules Work

Cursor Rules allow you to provide persistent, scoped instructions to the AI. For context, the Manager Agent has been prompted with conditional "self-notes" at specific points in its core protocols (e.g., in `01_Initiation_Prompt.md` or `02_Codebase_Guidance.md`). These self-notes suggest that *if* the User has Cursor Rules enabled and the MA deems it helpful, it *may consider requesting* the relevant rule by its name (e.g., `@rule_name`).

This approach ensures:
1.  **Optionality:** The APM framework doesn't break if rules aren't used or if used outside Cursor.
2.  **Targeted Assistance:** Rules are invoked only when potentially beneficial for specific, fragile parts of the workflow.
3.  **Contextual Relevance:** The AI (Manager Agent) uses the rule's description and its current operational context to decide if activating the rule is appropriate.

## Current Rules 

The following rules are initially provided to support the Manager Agent during the critical **Initiation Phase**:

1.  **`apm_discovery_synthesis_reminder.mdc`**
    *   **Type:** `Agent Requested`
    *   **Purpose:** Provides a reminder to the agent managing project discovery (typically the Manager Agent using `02_Codebase_Guidance.md`) to focus on synthesizing gathered information and correctly transitioning to Phase B (Strategic Planning).
    *   **Trigger:** The Manager Agent is prompted in `02_Codebase_Guidance.md` to consider requesting this rule if information gathering has been extensive or complex and it needs to ensure it stays on track with the APM protocol for synthesis and transition.
    *   **Key Benefit:** Helps prevent context drift or the agent getting bogged down after processing large amounts of information during project discovery.

2.  **`apm_plan_format_source.mdc`**
    *   **Type:** `Agent Requested`
    *   **Purpose:** A concise reminder that the definitive guide for creating/formatting `Implementation_Plan.md` is `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md`.
    *   **Trigger:** The Manager Agent is prompted in `01_Initiation_Prompt.md` (during Phase B, when stating it will create the `Implementation_Plan.md`) to consider requesting this rule if it needs to re-confirm the correct source guide, especially if the User is providing prompt content manually.
    *   **Key Benefit:** Ensures the MA refers to the correct formatting standard, maintaining consistency.

3.  **`apm_memory_system_format_source.mdc`**
    *   **Type:** `Agent Requested`
    *   **Purpose:** A concise reminder that the definitive guide for proposing, deciding, and setting up the Memory Bank *system* (including choosing between single-file vs. multi-file, directory structure, and initial file/directory headers) is `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md`.
    *   **Trigger:** The Manager Agent is prompted in `01_Initiation_Prompt.md` (during Phase B, when stating it will create the Memory Bank system) to consider requesting this rule if it needs to re-confirm the correct source guide for system setup.
    *   **Key Benefit:** Ensures the MA refers to the correct guide for Memory Bank system architecture and initial setup, maintaining consistency with APM protocols.

## Using These Rules in Cursor

1.  If you clone the APM framework, this `rules/` directory is included.
2.  To make these rules active in your Cursor project, copy the contents of this `rules/` directory into a `.cursor/rules/` directory at the root of your project.
3.  Ensure that "Project Rules" are enabled in your Cursor settings.
