# Troubleshooting Guide - APM v0.5

Effective troubleshooting prevents minor issues from becoming project blockers. This guide covers common scenarios encountered during APM sessions and provides recovery strategies.

## Table of Contents

- [Setup Phase Issues](#setup-phase-issues)
  - [1. Omitted Requirements During Context Synthesis](#1-omitted-requirements-during-context-synthesis)
  - [2. Interrupted Project Breakdown](#2-interrupted-project-breakdown)
  - [3. Interrupted Implementation Plan Enhancement](#3-interrupted-implementation-plan-enhancement)
- [Task Loop Issues](#task-loop-issues)
  - [1. Missing Context Integration Instructions](#1-missing-context-integration-instructions)
  - [2. Implementation Plan Needs Revisions](#2-implementation-plan-needs-revisions)
- [Handover Problems](#handover-problems)
  - [1. Handling a Handover After the Context Window is Full](#1-handling-a-handover-after-the-context-window-is-full)
  - [2. Recovering from a Late Handover](#2-recovering-from-a-late-handover)

---

## Setup Phase Issues

Issues in the Setup Phase can affect the entire project, so it's best to resolve them before moving to the Task Loop Phase. If major problems arise, consider restarting the Setup Agent session to ensure a solid foundation.

### 1. Omitted Requirements During Context Synthesis

**Scenario:** You realize you forgot to provide a requirement during the Context Synthesis phase after the agent has already moved on.

**Impact:** Depends on the significance of the omitted information.

* **Minor Details:** If it's a small detail (e.g., a minor tech stack preference), you can usually provide this information later when relevant or during a review step. The Setup Agent can typically incorporate minor additions.
* **Major/Foundational Requirements:** If you omitted something critical (like a PRD, core architectural constraint, or key specification), it can severely compromise the Setup Agent's understanding and the resulting Implementation Plan.

**Recommended Action (Major Omissions):**
It's best to **roll back and restart Context Synthesis**. Restarting early is less costly (in tokens and time) than correcting major flaws after Project Breakdown or Enhancement. Ensure high-level documents and core requirements are provided early, ideally in Phase 1, as this shapes the agent's entire discovery strategy.

### 2. Interrupted Project Breakdown

**Scenario:** The Setup Agent's Project Breakdown sequence (the systematic chat-to-file process) gets interrupted, resulting in incomplete or fragmented output. This can happen due to the chosen model's limitations or conflicting system prompts in your AI IDE.

**Recommended Action:**

* **Instruct Agent to Continue:** If the process is interrupted, clearly instruct the agent to pick up where it left off and complete the remaining steps. Be specific about what was finished and what needs to be done. Repeat until the entire breakdown is finished.
* **Model Switching (Use with Caution):** If the model seems incapable, you can switch to a more capable one (like Claude 3 Sonnet). However, **switching models mid-breakdown risks context gaps**. To mitigate this, instruct the *new* agent to **redo the entire Project Breakdown sequence from the beginning** to ensure full context.
* **IDE System Prompts:** If the IDE itself seems to be causing interruptions even with a good model, use the "Instruct Agent to Continue" method.
* **IDE Checkpoints:** If your IDE supports checkpoints or message editing, use them to cleanly restart the Project Breakdown step after Context Synthesis.

> **Important:** Carefully review the complete output after recovery. If the sequence became too disjointed, evaluate context window usage and decide if restarting the Setup Agent is necessary.

### 3. Interrupted Implementation Plan Enhancement

**Scenario:** Similar to Project Breakdown, the Enhancement phase (where the simple plan is transformed into the detailed APM artifact format) gets interrupted.

**Recommended Action:** Follow the same troubleshooting steps as for an Interrupted Project Breakdown (instructing the agent to continue, potentially switching models carefully).

**Alternative Recovery (If Near Context Limit):**
If the interruption happens near the context window limit, you can:
1.  Start a **new Setup Agent session**.
2.  Repeat **Context Synthesis** to give the new agent the project requirements.
3.  Provide the **finalized (but simple) Implementation Plan file** (`.apm/Implementation_Plan.md`) created *before* the enhancement attempt.
4.  Instruct the new agent to **skip Project Breakdown & Review** and proceed directly to the **Enhancement** step using the provided file.
5.  The rest of the Setup Phase (Enhancement, Bootstrap Prompt) will complete in the new session.

> **Warning:** This alternative is experimental. Use it only as a last resort and carefully verify the resulting enhanced Implementation Plan.

---

## Task Loop Issues

Troubleshooting during the Task Loop often requires context-aware solutions, as issues can stem from the Setup Phase quality.

### 1. Missing Context Integration Instructions

**Scenario:** The Manager Agent issues a Task Assignment Prompt for a task with a cross-agent dependency but forgets to include the necessary `## Context from Dependencies` section with integration steps.

**How to Identify:** Check the Implementation Plan. If a task has `"Depends on: Task X.Y Output by Agent Z"` and the corresponding Task Assignment Prompt lacks detailed integration instructions (file reading, output summary), this issue is present.

**Recommended Action:** Notify the Manager Agent of the omission and request a **revised Task Assignment Prompt** that includes the required context integration steps.

### 2. Implementation Plan Needs Revisions

**Scenario:** You discover the Implementation Plan needs updates due to new requirements, scope changes, or execution insights.

**How to Identify:** You notice missing steps, outdated information, or misalignment with current goals. Sometimes the Manager Agent might flag the need for updates during task review.

**Types of Revisions:**

* **Minor Revisions:** Adding a task, updating details, small adjustments. Usually manageable by the Manager Agent. This can include adding a new phase with a few tasks if it doesn't drastically alter dependencies.
* **Major Revisions:** Changing core tech, adding/removing entire phases, major requirement shifts. Usually requires returning to the Setup Agent.

**Recommended Action:**

* **Minor Revisions:** Ask the Manager Agent to update the `.apm/Implementation_Plan.md` file. Provide **clear, detailed instructions** for the changes, including structure, content, and any affected dependencies. *Crucially, the Manager Agent lacks the Setup Agent's systematic breakdown ability, so your instructions must be explicit*.
* **Major Revisions:** Return to the Setup Agent.
    * **If original Setup Agent session has context space:** Continue in that session.
    * **If original session is near full:** Start a **new Setup Agent session**. Repeat **Context Synthesis**, providing the original context, a summary of progress (including completed tasks from the Memory System), and the required changes.
    * **For both cases:** Instruct the Setup Agent to perform **Project Breakdown only on the sections needing revision**. During **Enhancement**, only enhance the revised sections. **Skip Memory System initialization**.
    * Copy the **new Bootstrap Prompt** and provide it to the Manager Agent, explaining the major revisions.

---

## Handover Problems

Handover issues often arise when an agent's context window is exceeded *before* or *during* the handover, leading to corrupted context transfer.

### 1. Handling a Handover After the Context Window is Full

**Scenario:** You realize the outgoing agent's context is likely corrupted (due to exceeding limits) *before* completing the handover. Performing a standard handover risks transferring bad information.

**How to Identify:** Check IDE context visualization (if available) showing full capacity. Observe degraded performance: inconsistent responses, forgotten details, hallucinations.

**Recommended Action:**

1.  **Request Handover Prompt ONLY:** Instruct the outgoing agent to generate *only* the Handover Prompt using its guide, but explicitly tell it **not to create a Handover File** and to **exclude the cross-reference validation section** from the prompt template.
2.  **Manually Review Prompt:** Carefully review the generated Handover Prompt, especially dynamic sections like "Current Session State" or "Immediate Next Action". Correct any inaccuracies or hallucinations manually.
3.  **Initialize New Agent:** Start a new session for the replacement agent.
4.  **Provide Modified Prompt & Explain:** Give the new agent the **manually reviewed/corrected Handover Prompt**. Explain that the previous agent exceeded context limits and the Handover File was omitted to prevent corruption. Instruct it to restore documented context (from Memory Logs/Plan) using the prompt and ask clarifying questions to recover undocumented details.
5.  **Restore Missing Context:** After the agent processes the prompt, work with it to fill in any missing undocumented context (workflow preferences, recent decisions, etc.) that would normally be in the Handover File.

### 2. Recovering from a Late Handover

**Scenario:** You complete a handover, but during the verification step (when the new agent summarizes its understanding), you realize the transferred context is corrupted or incomplete.

**How to Identify:** The new agent's summary contains missing info, inconsistencies, hallucinations, or doesn't match the actual project state.

**Recommended Recovery Actions:**

* **If Context is Mostly Intact (Minor Gaps/Errors):**
    * Provide direct corrections, clarifications, and missing details to the new agent in response to its summary. Re-explain recent decisions or preferences if needed.
    * Verify its updated understanding, then continue the session.
* **If Context is Heavily Corrupted (Major Errors/Hallucinations):**
    * The handover was effectively unsuccessful. Treat this the same as "Handling a Handover After the Context Window is Full".
    * You likely still have the Handover Prompt generated by the (corrupted) outgoing agent. **Manually review and repair this prompt** for accuracy.
    * **Discard the Handover File** as it's unreliable.
    * Start **another new agent session** (e.g., Agent\_Backend\_3 if \_2 failed).
    * Provide the **manually repaired Handover Prompt** and explain the situation (previous agent corrupted, file omitted).
    * Work with this agent to restore undocumented context.