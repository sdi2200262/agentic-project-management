---
id: token-consumption-tips
slug: /token-consumption-tips
sidebar_label: Token Consumption Tips
sidebar_position: 10
---

# Token Consumption Tips - APM v0.5

APM is designed for better structure, but multi-agent coordination introduces overhead. This guide provides strategies for optimizing cost while maintaining effectiveness across different model tiers.

> **Note:** All percentages and statistics in this document are approximate estimates based on testing.

---

## Economic Strategies

Choose the model allocation strategy that matches your budget and project stakes.

### Performance-First Approach
*Recommended for projects and tasks where quality > cost.*

* **Philosophy:** Use top-tier frontier models throughout for maximum consistency and reasoning.
* **Model Map:**
    * **All Agents:** Claude Sonnet 4/4.5, Gemini 2.5 Pro, or equivalent.
* **Outcome:** Highest token costs, but delivers the best consistency, reasoning, and error prevention.

### Hybrid Approach
*Recommended for users who want to manage costs effectively*

* **Philosophy:** Strategic model deployment based on specific task complexity.
* **Model Map:**
    * **Setup:** Premium.
    * **Manager:** Premium or Mid-tier.
    * **Implementation:** Budget for routine tasks; Premium for architecture/design.
* **Outcome:** Balanced cost profile with low quality impact.

---

## Model Recommendations by Agent Type

### Setup Agent

The Setup Agent creates your project foundation. Poor planning cascades through the session, causing expensive fixes later. **Invest in quality here to save tokens downstream.**

* **Best Performers:** **Claude Sonnet 4/4.5**

> **Critical Warnings:**
> * **Do Not Switch Models:** Stick with one model throughout the Setup Phase. Context gaps from switching can compromise the project discovery and planning.
> * **Avoid "Thinking" Models:** These models disrupt the 'forced Chain-of-Thought' chat-to-file technique used during Project Breakdown in this phase.

### Manager Agent 

* **Best Performers:** **Claude Sonnet 4/4.5**, Gemini 2.5 Pro, GPT-5
* **Effective Budget Options:** **Cursor Auto**, Cursor's Composer 1, Windsurf's SWE-1, Claude Haiku 4.5

> **Note:** While switching is possible, sticking to a single model is safer. In testing, **Cursor Auto** proved highly effective for coordination despite being a budget option.

### Implementation Agents

Implementation context is tightly scoped, making it safe to switch models based on the specific task type.

| Task Type | Recommended Models |
| :--- | :--- |
| **Complex / Creative** | **Sonnet 4, GPT-5, Gemini 2.5** |
| **Routine / Granular** | **Grok Code, Gemini 3 Flash, GPT-5-mini** |

**Efficiency Tactics for Task Execution:**

* **Step Combination:** For multi-step tasks, request the Agent to combine related steps (e.g., `"Combine config setup and dependency installation"`). This reduces confirmation overhead.
* **Context Injection:** If a task requires a file, attach it manually to the prompt. This allows the Agent to skip calling file read tools, saving tokens.
* **Iterative Correction:** When a step fails on a multi-step tasks, or if the task drifts , ask for a revision immediately. Do not proceed to the next step on a shaky foundation.

### Ad-Hoc Agents 

Select the model based on the complexity of the delegated task. For complex tasks choose premium models, while sticking to budget-friendly options for typical/routine delegations.

---

## Optimization by Phase

### 1. The Setup Phase
This phase consumes the most tokens but offers the highest ROI.

* **Context Synthesis:** Prepare materials (PRDs, code excerpts) *before* starting. Comprehensive initial responses prevent expensive back-and-forth.
* **Project Breakdown:** This is inherently expensive due to the systematic chat-to-file process. **Do not cut corners here.**
* **AI Plan Review:**
    * **Skip** if budget-constrained and you are comfortable reviewing manually.
    * **Use** for complex projects or first-time users.

### 2. Handover Procedures
Handovers are expensive because the Agent must reconstruct context from logs and files.

* **Proactive Timing (Recommended):** Initiate a handover when you reach **70-80%** of the context window. This helps prevent carrying over "contaminated" or outdated context, avoiding costly rework and unnecessary token usage.
* **Strategic Triggering:** When nearing context window limits, initiate handovers *before* starting a complex multi-step task to ensure the new Agent has a clean window for the heavy lifting.