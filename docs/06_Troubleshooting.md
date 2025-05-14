# APM Troubleshooting Guide

This guide addresses common issues, questions, and challenges that users might encounter when using the Agentic Project Management (APM) framework. If you're facing a problem not listed here, consider opening an issue on the GitHub repository.

## General Issues & Best Practices

**1. Issue: Agent seems to have forgotten previous instructions or context (Hallucinations / Context Loss).**

*   **Cause A: Context Window Limit Approaching (Especially Manager Agent)**
    *   **Solution:** This is the primary reason for the **Handover Protocol**. If the Manager Agent (or any long-running agent) starts to lose track of earlier decisions, plan details, or overall project context, it's time to initiate a handover. Don't wait until context is completely lost; be proactive.
    *   *See:* `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md` and `docs/02_Getting_Started.md` (Step 6).
*   **Cause B: Incorrect Agent Session/Tab Used**
    *   **Solution:** Ensure you are interacting with the correct agent in its designated chat tab (e.g., providing implementation details to an Implementation Agent, not the Manager). Mixing up tabs can happen very often in a multi-agent workflow when the User has to manage many AI assistant sessions concurrently! This however, can severely confuse an agent's context.
*   **Cause C: Prompt Lacks Sufficient Context for a Specific Task**
    *   **Solution:** When crafting `Task Assignment Prompts` with the Manager, ensure all necessary prior context, relevant code snippets, or data is included or clearly referenced. Sometimes an agent forgets because the *immediate* prompt was insufficient.

**2. Issue: Implementation Agent is not following the plan or is producing incorrect output.**

*   **Cause A: Ambiguous Task Assignment Prompt**
    *   **Solution:** Review the `Task Assignment Prompt` (created with the Manager). Is it crystal clear? Are the action steps precise? Does it include all necessary information? Work with the Manager to refine the prompt and re-assign the task.
*   **Cause B: Misunderstanding of Core Requirements**
    *   **Solution:** The issue might stem from an earlier misunderstanding during the Project Discovery phase. Revisit the `Implementation_Plan.md` with the Manager. If the plan itself is flawed or missing key details based on new understanding, the Manager should help you revise the plan section first, then generate a new task prompt.
*   **Cause C: Agent Needs More Granular Steps**
    *   **Solution:** Some AI models or tasks require extremely fine-grained steps. If an agent struggles, ask the Manager to help break down the problematic sub-task in the `Implementation_Plan.md` even further, then assign the more detailed micro-tasks.

**3. Issue: Workflow feels inefficient or too slow.**

*   **Cause A: Overly Chatty Interactions**
    *   **Solution:** While APM structures interaction, aim for concise communication. Provide all necessary information in a single, well-structured prompt where possible, rather than many small back-and-forth messages for a single conceptual step (e.g., provide all requirements for a task in one go to the Manager).
*   **Cause B: Not Leveraging Manager Agent Fully for Prompt Crafting**
    *   **Solution:** The Manager Agent is there to help you draft effective prompts for Implementation Agents, including recalling context from the plan. Use its expertise (guided by `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md`).

## Memory Bank Specific Issues

**4. Issue: Accidentally overwriting previous entries in `Memory_Bank.md`.**

*   **Cause:** Manually editing the file and pasting new content in the wrong place, or an agent (if it has direct edit capability and is not managed carefully) making an incorrect modification.
*   **Solution:**
    *   **Best Practice:** Always instruct agents to *append* their logs. When manually adding logs, ensure you scroll to the end of the file.
    *   **Version Control:** Use Git or another version control system for your project, including `Memory_Bank.md`. Commit changes frequently. This allows you to revert to previous versions if an overwrite occurs.
    *   **User Confirmation:** The APM workflow emphasizes User confirmation *before* an Implementation Agent logs. This step should also involve the User guiding *where* (which Memory Bank, if multiple) the log should go, ensuring it's appended.

**5. Issue: The `Memory_Bank.md` file is becoming too large and difficult for an AI agent to parse/read effectively (e.g., when Manager reviews).**

*   **Cause:** A single log file for a very large or long-running project accumulates too much text for the AI's context window when trying to process it (e.g., during reviews or handovers).
*   **Solution: Multiple Memory Banks.**
    *   The choice of Memory Bank system (single file vs. a multi-file directory) is determined during the initial project setup with the Manager Agent, guided by `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md`. For complex projects, this guide helps establish multiple, more focused Memory Bank files from the outset or as the project grows.
    *   **Strategy:** Create separate `Memory_Bank.md` files within a `/Memory` directory, for example:
        *   `Memory/Phase1_Bank.md`
        *   `Memory/Backend_API_Bank.md`
        *   `Memory/User_Auth_Feature_Bank.md`
    *   **Guidance:** When a task is assigned, the `Task Assignment Prompt` (and your instruction to the Implementation Agent) must specify *which* Memory Bank file to log to.
    *   When asking the Manager to review, point it to the specific Memory Bank file relevant to the task(s) being reviewed.
    *   The `Handover_File.md` should then list all active Memory Bank files and their purpose.
    *   This keeps individual log files manageable and contextually relevant for AI processing.

**6. Issue: Agents are not logging in the correct format.**

*   **Cause A: Onboarding Missed or Forgotten**
    *   **Solution:** Ensure every new Implementation/Specialized Agent receives the `Implementation_Agent_Onboarding.md` prompt, which references the `Memory_Bank_Log_Format.md`.
*   **Cause B: Task Assignment Prompt Lacks Reminder**
    *   **Solution:** Ensure the Manager includes a clear instruction in every `Task Assignment Prompt` to log work according to the standard format, referencing `Memory_Bank_Log_Format.md`.
    *   *See:* `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md` (Section 5).
*   **Corrective Action:** If an agent logs incorrectly, provide feedback (via the User), show them the correct format example from `Memory_Bank_Log_Format.md`, and ask them to re-log or edit their last entry.

## Handover Specific Issues

**7. Issue: Lost important context because handover was done too late.**

*   **Cause:** Waiting until an agent (especially the Manager) is severely context-limited and performing poorly before initiating the Handover Protocol.
*   **Solution:**
    *   **Proactive Handover:** Be vigilant. If the Manager Agent starts asking redundant questions, forgets key plan details, or its responses degrade, initiate the handover process sooner rather than later.
    *   **Manager Self-Awareness:** The `01_Initiation_Prompt.md` encourages the Manager to be aware of its context. While AI self-awareness of context limits is imperfect, the Manager might give clues.
    *   **Regular Check-ins:** If a project is very long, consider scheduling periodic check-ins with the Manager to assess its grasp of the overall context, even if it hasn't explicitly signaled problems.

**8. Issue: New agent doesn't understand the project after a handover.**

*   **Cause A: `Handover_File.md` was incomplete or poorly structured.**
    *   **Solution:** When the outgoing agent (with User/Manager help) prepares the `Handover_File.md`, ensure it's comprehensive, well-organized, and follows the structure in `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Formats.md`. Include all critical decisions, recent logs, plan status, and current blockers.
*   **Cause B: `Handover_Prompt.md` was unclear or didn't properly guide the new agent.**
    *   **Solution:** The `Handover_Prompt.md` must clearly instruct the new agent to thoroughly review the `Handover_File.md` and then verify its understanding *before* proceeding.
*   **Verification Step is Key:** Do not skip the step where the new agent summarizes its understanding of the project status and immediate tasks back to you (the User) for confirmation. If the summary is off, the handover wasn't fully successful, and further clarification or refinement of the handover artifacts might be needed before the new agent takes over.

If you encounter other issues, please consider contributing them to this guide or raising an issue in the project repository. 