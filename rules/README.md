# APM Framework - Optional Cursor IDE Rules

This directory, `rules/` (intended to be mirrored as `.cursor/rules/` in a user's project if they choose to use this feature), contains optional [Cursor IDE Rules](https://docs.cursor.com/context/rules). These rules are designed to enhance the robustness and efficiency of the Agentic Project Management (APM) framework when used within the Cursor IDE.

**Their use is entirely optional and primarily benefits users operating APM within Cursor.** The core APM prompts are designed to function effectively without these rules.

## How These Rules Work

Cursor Rules allow you to provide persistent, scoped instructions to the AI. For context, the Manager Agent has been prompted with conditional "self-notes" at specific points in its core protocols (e.g., in `01_Initiation_Prompt.md` or `02_Codebase_Guidance.md`). These self-notes suggest that *if* the User has Cursor Rules enabled and the MA deems it helpful, it *may consider requesting* the relevant rule by its name (e.g., `@rule_name`).

This approach ensures:
1.  **Optionality:** The APM framework doesn't break if rules aren't used or if used outside Cursor.
2.  **Targeted Assistance:** Rules are invoked only when potentially beneficial for specific, fragile parts of the workflow.
3.  **Contextual Relevance:** The AI (Manager Agent) uses the rule's description and its current operational context to decide if activating the rule is appropriate.

## Available Rules (Supporting Manager Agent)

### General Initiation & Planning Phase

*   **`apm_discovery_synthesis_reminder.mdc`**
    *   **Description (from rule):** "When the MA has gathered extensive info (e.g., via `codebase_search`, `read_file`), this rule prompts it to synthesize findings, identify next steps for planning, and explicitly consult the User before deep-diving into `Implementation_Plan.md` generation. Helps prevent premature planning based on incomplete synthesis."
    *   **Purpose:** Aids the Manager Agent in transitioning from information gathering (Discovery) to structured planning, ensuring user alignment before committing to a detailed plan.

*   **`apm_plan_format_source.mdc`**
    *   **Description (from rule):** "Reminds MA that `01_Implementation_Plan_Guide.md` is the authoritative source for formatting the `Implementation_Plan.md`."
    *   **Purpose:** Ensures the MA uses the correct guide when tasked with generating or modifying the Implementation Plan, promoting consistency.

*   **`apm_memory_system_format_source.mdc`**
    *   **Description (from rule):** "Reminds MA that `02_Memory_Bank_Guide.md` is the authoritative source for Memory Bank system setup (single vs multi-file) and initial file headers."
    *   **Purpose:** Ensures the MA uses the correct guide for proposing and setting up the project's Memory Bank, aligning with project complexity.

### Implementation Plan Integrity

*   **`apm_impl_plan_critical_elements_reminder.mdc`** (New)
    *   **Description (from rule):** "Reminder for Implementation Plan: Ensure 1) Explicit Agent Assignment (consider distribution) and 2) 'Guiding Notes' for critical action steps are defined for ALL tasks."
    *   **Purpose:** Reinforces the necessity of assigning agents to every task and including crucial "Guiding Notes" for methodological consistency directly within the `Implementation_Plan.md`. Helps prevent ambiguity and ensures tasks are well-defined for subsequent agent assignment.

### Memory System Integrity

*   **`apm_memory_naming_validation_reminder.mdc`** (New)
    *   **Description (from rule):** "Reminder: Validate ALL Memory Bank file/directory names against the Implementation Plan BEFORE creation. Adhere to conventions in 02_Memory_Bank_Guide.md."
    *   **Purpose:** Promotes strict adherence to Memory Bank naming conventions and validation against the `Implementation_Plan.md` *before* any file or directory is created. This is crucial for preventing structural errors in the Memory Bank.

### Task Assignment Consistency

*   **`apm_task_prompt_plan_guidance_incorporation_reminder.mdc`** (New)
    *   **Description (from rule):** "Reminder for Task Assignment Prompts: Explicitly incorporate and expand upon any 'Guiding Notes' found in the Implementation Plan's action steps."
    *   **Purpose:** Ensures that when the Manager Agent generates detailed `Task Assignment Prompts`, it correctly uses and elaborates on the "Guiding Notes" provided in the `Implementation_Plan.md`. This maintains a consistent line of instruction from high-level plan to detailed task execution.

## Using These Rules in Cursor

1.  If you clone the APM framework, this `rules/` directory is included.
2.  To make these rules active in your Cursor project, copy the contents of this `rules/` directory into a `.cursor/rules/` directory at the root of your project.
3.  Ensure that "Project Rules" are enabled in your Cursor settings.
