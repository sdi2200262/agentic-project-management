# APM v0.4 - Memory System Guide 
This guide explains how APM sessions store and evolve memory. It defines three Memory System variants:
- Simple
- Dynamic-MD
- Dynamic-JSON

Memory duties are split between the *Setup Agent* and the *Manager Agent*. Details on individual Memory Log files reside in `guides/Memory_Log_Guide.md`.

## 1  Memory System Variant Overview
Summary of the three Memory System variants, their storage layouts, log formats and memory summarization strategies:

- Simple
    - Storage layout: Folder `Memory/` + Single file `Memory_Bank.md` in the `apm/` directory
    - Log format: Inline subsections inside the same MD file
    - Each inline subsection acts as a task memory log; summaries are appended after each logical group of tasks (if any) is complete. Summarization approach is determined by the Manager Agent.

- Dynamic-MD
    - Storage layout: Folder `Memory/` + `Memory_Root.md` + sub-folders `Phase_XX_<slug>/` in the `apm/` directory,
    - Log format: One `Task_XX_<slug>.md` Memory Log per task
    - After each phase completes, an inline subsection is appended to the `Memory_Root.md` file summarizing the phase.

- Dynamic-JSON **(Testing Preview)**
    - Storage layout: Same as Dynamic-MD (markdown root) in the `apm/` directory,
    - Log format: One `Task_XX_<slug>.json` Memory Log per task
    - After each phase completes, an inline subsection is appended to the `Memory_Root.md` file summarizing the phase.
    - **Testing Preview - Not for Production (JSON):**
        - Intended for advanced testing scenarios requiring strict workflow validation, maximum LLM parsing fidelity, and active context retention
        - Designed for "token-wealthy" Users unconcerned with token consumption, or APM contributors seeking to experiment and provide feedback on asset structure and parsing efficiency
        - Experimental only; not suitable for production or resource-constrained use due to much higher token consumption
        - **WARNING:** JSON artifacts consume at least 15% more tokens, often 2x–3x higher than Markdown, and will fill the context window much faster, resulting in more frequent Handovers and context resets

**Memory Logs** capture granular, task-level context and are written by Implementation Agents after each task completion. See `guides/Memory_Log_Guide.md` for schemas and writing rules.

## 2  Setup Agent Responsibilities
Main responsibilities of the Setup Agent when initializing the Memory System for an APM session:

### 2.1. Select Memory Strategy
Review the Implementation Plan using these criteria:

#### Check for Phases First
- Multiple phases (Phase 1, Phase 2, etc.)? → **Use `dynamic-md`**

#### Otherwise, Check Task Count  
- More than 8 tasks? → **Use `dynamic-md`**
- 8 or fewer tasks with low-medium complexity? → **Use `simple`**

#### Special Cases
- **User has requested JSON** OR high complexity validation? → **Use `dynamic-json`**

**Default for most projects: `dynamic-md`**

### 2.2. Record strategy 
Add `memory_strategy: <simple|dynamic-md|dynamic-json>` to the Bootstrap-prompt YAML.

### 2.3. Initialize Memory System
For the memory system variant you decided, do the following:
- **Simple:**  
    - Create `Memory/` folder if missing in the `apm/` directory
    - Add `Memory_Bank.md` containing the following:
      ```yaml
      ---
      memory_strategy: simple
      format: markdown
      ---
      ```
      ```markdown
      # Project_Name – APM Simple Memory Bank
      All Implementation Plan Task Memory Logs and Task Summaries are to be stored here.
      ```

- **Dynamic (MD/JSON):**  
    - Create `Memory/` folder if missing in the `apm/` directory
    - Add `Memory/Memory_Root.md` containing the following:
      ```yaml
      ---
      memory_strategy: dynamic-md | dynamic-json
      memory_log_format: markdown | json
      ---
      ```
      ```markdown
      # Project_Name - APM Dynamic Memory Bank Root
      Implementation Plan Phase Summarizes are to be stored here; detailed Task Memory Logs are stored in Markdown or JSON format in the sub-directories.
      ```
    - Subfolders (e.g., `Phase_01_<slug>/`) are created by the Manager Agent as needed.

## 3  Manager Agent Responsibilities
Main responsibilities of the Manager Agent when maintaining the Memory System during an APM session:

### All Variants
1. Keep the Memory System structure (folders/logs or sections) in sync with the current Implementation Plan. Update as Phases or Tasks change.
3. After each phase (or group of tasks), create and append a concise summary referencing the relevant Memory Logs or inline memory log sections.

### Simple Memory System
1. Ensure `Memory/Memory_Bank.md` exists at the `apm/` directory
2. At the start of each group of tasks (phase/milestone), add a header:
    ```markdown
    ## <Group/Phase Name>
    ```
3. At the end of each group, append a summary:
    ```markdown
    ## <Group/Phase Name> Summary 
    * Outcome summary (≤ 200 words)
    * List of involved Agents
    * List of relevant task subsections
    ```
    (≤ 20 lines)

### Dynamic-MD and Dynamic-JSON
1. On phase entry, create `Memory/Phase_XX_<slug>/` if missing. For each task in the phase, create a **completely empty** Memory Log, following `guides/Memory_Log_Guide.md`:
    - `Task_Y_Z_<slug>.md` (Dynamic-MD)
    - `Task_Y_Z_<slug>.json` (Dynamic-JSON)

**All Memory Logs for the current phase must be created BEFORE the first Task Assingment Prompt for each task.**
**Use task ID and title from Implementation Plan (exclude agent assignment).**
**Example: Task "Task 2.1 - Deploy Updates | Agent_Backend" → `Task_2_1_Deploy_Updates.md`**

2. After each task, review the Memory Log **populated by the Implementation Agent**, provided via the User. For Dynamic-JSON, validate the log structure against the required schema.

3. At phase end, append a summary to `Memory/Memory_Root.md`:
    ```markdown
    ## Phase XX – <Phase Name> Summary 
    * Outcome summary (≤ 200 words)
    * List of involved Agents
    * Links to all phase task logs
    ```
    Keep summaries ≤ 20 lines.

---

**End of Guide**