# APM Memory Bank System Guide

## 1. Purpose

This guide provides the Manager Agent (MA) with instructions for determining, proposing, and setting up the most suitable Memory Bank System for a given project. The Memory Bank is crucial for logging all significant actions, decisions, and outputs from Implementation Agents.

The choice of Memory Bank System (a single file or a multi-file directory structure) is made in conjunction with the creation of the `Implementation_Plan.md`. This guide defines how to assess project complexity (derived from the `Implementation_Plan.md`) to make this choice and specifies the initial structure and headers for the Memory Bank files.

This guide complements `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`, which details the format for *individual log entries* within these files.

## 2. Core Principles for Memory Bank System Design

When deciding on a Memory Bank System, aim for:

*   **Scalability:** The system should efficiently handle the project's current and anticipated complexity and volume of log entries.
*   **Organization:** Logs must be easy for the User and all Agents (current or future) to locate, navigate, and understand.
*   **Clarity:** The structure should be intuitive and logically mirror the project's breakdown in the `Implementation_Plan.md`.
*   **Consistency:** A uniform approach to where and how information is logged.
*   **Alignment:** The Memory Bank structure should directly reflect the organizational structure (phases, tasks) of the `Implementation_Plan.md`.

## 3. Assessing Project Complexity for System Selection

Before generating the full `Implementation_Plan.md` (but after conceptualizing its structure and summarizing it to the User), you, the Manager Agent, must assess its likely complexity to determine the appropriate Memory Bank system.

**Consider the following factors from your understanding of the forthcoming `Implementation_Plan.md`:**

*   **Project Phasing:**
    *   **High Complexity Indicator:** The plan is (or will be) divided into multiple distinct `## Phase X:` sections.
    *   **Lower Complexity Indicator:** The plan has no formal phases, or is essentially a single phase.
*   **Number and Nature of Tasks:**
    *   **High Complexity Indicator:** A large number of `### Task Y:` entries, tasks assigned to multiple different agents, or tasks covering very distinct domains of work.
    *   **Lower Complexity Indicator:** A manageable number of tasks, primarily handled by one or two closely collaborating agents.
*   **Task Granularity and Detail:**
    *   **High Complexity Indicator:** Tasks have many detailed sub-components and action steps, suggesting numerous potential log entries per task.
*   **Project Duration and Agent Count:**
    *   **High Complexity Indicator:** Anticipated long project duration or the involvement of many specialized Implementation Agents, each potentially generating many logs.
    *   **Lower Complexity Indicator:** Shorter projects, fewer agents.

**Decision Point:**

*   **Choose a Multi-File Directory System (`Memory/`) if:** Multiple high complexity indicators are present (e.g., distinct phases AND numerous complex tasks).
*   **Choose a Single-File System (`Memory_Bank.md`) if:** Primarily lower complexity indicators are present.

Use your judgment to balance these factors. When in doubt for moderately complex projects, a multi-file system can offer better long-term organization.

## 4. Memory Bank System Options

### 4.1. Option 1: Single-File System (`Memory_Bank.md`)

*   **When to Use:** Recommended for straightforward projects, smaller scopes, or when the `Implementation_Plan.md` is relatively simple (e.g., few tasks, no distinct phases, limited agent involvement).
*   **Setup:**
    1.  You will create a single file named `Memory_Bank.md` at the root of the project workspace.
    2.  Populate this file with the following header:

    ```markdown
    # APM Project Memory Bank
    
    Project Goal: [Brief project goal, taken or summarized from the Implementation Plan's introduction]
    Date Initiated: [YYYY-MM-DD of Memory Bank creation]
    Manager Agent Session ID: [Your current session identifier, if applicable/available]
    Implementation Plan Reference: `Implementation_Plan.md`
    
    ---
    
    ## Log Entries
    
    *(All subsequent log entries in this file MUST follow the format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`)*
    ```

### 4.2. Option 2: Multi-File Directory System (`Memory/`)

*   **When to Use:** Recommended for complex projects, especially those with multiple phases, numerous distinct tasks, multiple diverse workstreams, or long anticipated durations, as reflected in the structure of the `Implementation_Plan.md`.
*   **Setup:**
    1.  You will create a root directory named `Memory/` at the project root.
    2.  **Inside the `Memory/` directory, create a `README.md` file** to explain its structure. Example content for `Memory/README.md`:
        ```markdown
        # APM Project Memory Bank Directory
        
        This directory houses the detailed log files for the [Project Name] project.
        
        ## Structure:
        
        (Describe the structure chosen, e.g.:
        - Logs are organized into subdirectories corresponding to each Phase in the `Implementation_Plan.md`.
        - Within each phase directory, individual `.md` files capture logs for specific tasks.
        OR
        - Logs for each major task from the `Implementation_Plan.md` are stored as individual `.md` files directly in this directory.)
        
        All log entries within these files adhere to the format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`.
        ```
    3.  **Determine Sub-directory and File Naming Strategy based on `Implementation_Plan.md`:**
        *   **A. If `Implementation_Plan.md` has Phases (e.g., `## Phase 1: Backend Setup`):**
            *   For each Phase, create a corresponding subdirectory within `Memory/`. Use clear, filesystem-friendly names derived from the plan (e.g., `Memory/Phase_1_Backend_Setup/`, `Memory/Phase_2_Frontend_Dev/`).
            *   Within each phase subdirectory, create individual Markdown files for logging tasks belonging to that phase.
            *   **Log File Naming Convention:** `Task_[Task_Identifier]_Log.md` (e.g., `Task_A_User_Auth_Log.md`, `Task_B_Activity_API_Log.md`). The `Task_Identifier` should be concise and map clearly to the task in `Implementation_Plan.md`.
            *   **Example Path:** `Memory/Phase_1_Backend_Setup/Task_A_User_Auth_Log.md`
        *   **B. If `Implementation_Plan.md` has no Phases but is Complex (Many Distinct Tasks):**
            *   Create individual Markdown log files directly under the `Memory/` directory.
            *   **Log File Naming Convention:** `Task_[Task_Identifier]_Log.md` (e.g., `Task_Data_Processing_Log.md`).
            *   **Example Path:** `Memory/Task_Data_Processing_Log.md`
    4.  **Populate each individual log file (`Task_..._Log.md`) with the following header:**

        ```markdown
        # APM Task Log: [Full Task Title from Implementation_Plan.md]
        
        Project Goal: [Brief project goal, from Implementation Plan]
        Phase: [Phase Name from Implementation_Plan.md, if applicable, otherwise "N/A"]
        Task Reference in Plan: [Full Task Heading from Implementation_Plan.md, e.g., "### Task A - Agent A: User Authentication Module"]
        Assigned Agent(s) in Plan: [Agent(s) listed for the task in Implementation_Plan.md]
        Log File Creation Date: [YYYY-MM-DD]
        
        ---
        
        ## Log Entries
        
        *(All subsequent log entries in this file MUST follow the format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`)*
        ```
    5.  As the MA, you are responsible for creating the `Memory/` directory, its `README.md`, and the *initial set* of phase subdirectories (if any) and task log files with their headers, corresponding to the initial tasks in the `Implementation_Plan.md`.

## 5. Proposing and Creating the Memory Bank System to the User

This process aligns with the "Consolidated Proposal & Creation" step of your initiation, where you also present the `Implementation_Plan.md` summary.

1.  **Analyze:** Based on your (MA's) understanding of the project's scope and the planned structure of `Implementation_Plan.md`, decide between the Single-File or Multi-File Memory Bank system using the criteria in Section 3.
2.  **Formulate Proposal:** Prepare a brief statement for the User that includes:
    *   The chosen Memory Bank system (e.g., "a single `Memory_Bank.md` file" or "a multi-file system within a `Memory/` directory, with subdirectories per phase").
    *   A concise justification linked to the project's complexity as reflected in the (upcoming) `Implementation_Plan.md` (e.g., "...due to the project's straightforward nature," or "...to effectively manage logs for the multiple phases and complex tasks outlined").
3.  **Deliver Proposal with Plan Summary:** Present this Memory Bank proposal to the User *at the same time* you deliver the high-level summary of the `Implementation_Plan.md`.
    *   **Example User Communication (Multi-File):**
        > "Based on the phased structure and multiple complex tasks anticipated for this project (which will be detailed in the `Implementation_Plan.md`), I propose a multi-file Memory Bank system. This will involve a `Memory/` directory, potentially with subdirectories for each phase (e.g., `Memory/Phase_1_Design/`) and individual log files for key tasks (e.g., `Task_Alpha_User_Research_Log.md`). This will keep our project logs organized and traceable.
        >
        > I will now proceed to create the initial `Implementation_Plan.md` file and this Memory Bank structure. Please review both once they are created."
    *   **Example User Communication (Single-File):**
        > "Given the focused scope of the project (which will be detailed in the `Implementation_Plan.md`), a single `Memory_Bank.md` file should be sufficient for our logging needs. This will provide a centralized location for all task updates.
        >
        > I will now proceed to create the initial `Implementation_Plan.md` file and this `Memory_Bank.md` file. Please review both once they are created."
4.  **Create Files:** After presenting, and assuming no immediate objections from the User to the high-level plan summary and Memory Bank concept, proceed to create:
    *   The full `Implementation_Plan.md` (as per `01_Implementation_Plan_Guide.md`).
    *   The chosen Memory Bank file(s)/directory structure with the correct headers, as detailed in Section 4 of *this* guide.
5.  **Invite Review:** After creation, explicitly invite the User to review the *content* of the newly created `Implementation_Plan.md` AND the structure/headers of the `Memory_Bank.md` file or `Memory/` directory and its initial files.

## 6. Ongoing Logging

*   This guide covers the *setup* of the Memory Bank system.
*   All *actual log entries* made by Implementation Agents (after User confirmation) into these files **must** strictly adhere to the formatting rules defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`.
*   As new tasks are defined or phases initiated in an evolving `Implementation_Plan.md`, you (the MA) may need to guide the creation of new log files within the established multi-file system, maintaining the same naming conventions and header formats.

By following this guide, you will establish a Memory Bank system that is well-organized, scalable, and effectively supports the APM workflow.

## Strict Adherence to Implementation Plan

The integrity of the Memory Bank relies on its faithful reflection of the project's planned structure and progress as defined in the `Implementation_Plan.md`.

*   **Authoritative Source:** All Memory Bank directory and file names MUST precisely mirror the Phase and Task identifiers and descriptions found in the *current, authoritative* `Implementation_Plan.md`.
*   **Verification Obligation:** Before creating any directory or file, the responsible agent (whether Manager Agent or a specialized agent) MUST verify the proposed name and location against the `Implementation_Plan.md`.
*   **Phase Directory Naming:** Phase directory names MUST follow the exact naming convention: `Memory/Phase_X_Title_From_Plan/`.
    *   `X` is the phase number (e.g., 1, 2, 3).
    *   `Title_From_Plan` is the exact title string used for that phase in the `Implementation_Plan.md`. Spaces in the plan's phase title should be replaced with underscores in the directory name.
    *   Example: If Phase 1 is titled "Project Setup & Data Exploration" in the plan, the directory will be `Memory/Phase_1_Project_Setup_Data_Exploration/`.
*   **Task Log File Naming:** Task log file names MUST follow the exact naming convention: `Task_[Phase.Task]_Short_Task_Description_Log.md`.
    *   `[Phase.Task]` is the precise identifier from the plan (e.g., 1.1, 2.3).
    *   `Short_Task_Description` is a concise, underscore_separated version of the task's title or primary objective from the `Implementation_Plan.md`.
    *   Example: If Task 1.1 is "Environment, Constants & Initial Notebook Setup", the log file could be `Task_1.1_Env_Init_Notebook_Setup_Log.md`. Strive for clarity and direct correlation with the plan.

## Validation Before Creation

To prevent errors arising from outdated information or misunderstandings:

*   **Clarification Protocol:** If an agent is tasked with creating a memory structure and finds that the `Implementation_Plan.md` is unclear regarding the specific naming, if the plan has recently undergone changes, or if a proposed name appears inconsistent with the current plan, the agent MUST seek clarification from the Manager Agent BEFORE proceeding with creation.
*   **Dynamic but Verified Creation:** The dynamic, incremental creation of memory structures is encouraged as it allows the Memory Bank to adapt to the project's evolution. However, this dynamism must always be rooted in the *actively confirmed and current* state of the `Implementation_Plan.md` at the moment of creation. Do not create structures based on anticipated or outdated plan versions. 