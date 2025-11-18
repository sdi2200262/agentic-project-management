---
id: getting-started
slug: /getting-started
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started - APM v0.5

This guide walks you through launching your first APM session, from initial setup through completing your first few tasks. **The more time spent during setup and planning, the better your project execution will be.**

 - For a clearer understanding of each agent's roles and responsibilities, refer to the [Agent Types document](Agent_Types.md).

 - For a detailed walkthrough of APM workflows and protocols, refer to the [Workflow Overview document](Workflow_Overview.md).

---

## Prerequisites

Before starting your first APM session, ensure you have the following in place:

### Required Resources
* **Node.js**: APM v0.5 CLI requires Node.js (v18 or higher recommended).
* **AI IDE Platform**: Access to one of the supported AI Assistants.
* **Project Workspace**: A dedicated directory for your project files.

### Recommended Model Tiers

APM agents function best with models that excel at systematic reasoning and context management. Model selection can be optimized by role, but **Claude Sonnet 4** stands out for its consistent performance across all agent instances.

| Agent Type | Recommended Models (Best Results) | Cost-Effective Alternatives | Key Model Selection Note |
| :--- | :--- | :--- | :--- |
| **Setup Agent** | Claude Sonnet 4, Claude Sonnet 4.5 | - | **Crucial:** Avoid switching models mid-conversation during the Setup Phase to prevent context gaps. Use one model throughout. |
| **Manager Agent** | Claude Sonnet 4, Claude Sonnet 4.5, Gemini 2.5 Pro | Claude 3.7 Sonnet, Cursor Auto, Cursor's Composer 1 | Switching models mid-session is not encouraged, though testing showed fewer issues here than with the Setup Agent. **Cursor Auto delivered outstanding performance in testing.** |
| **Implementation Agent** | Sonnet 4.5, GPT-5, GPT-5-Codex, Gemini 2.5 Pro | GPT-4.1 in Copilot, Cursor Auto, Cursor's Comopser 1, Grok Code | **Flexible:** Context is tightly scoped, making model switching viable for matching task complexity (e.g., switching to premium for design-heavy tasks). |

> **Note:** For guidance on choosing models in an economical way, be sure to read the [Token_Consumption_Tips.md](Token_Consumption_Tips.md).

---

## Notes for specific AI IDEs

> **As of November 2025, GitHub Copilot does not provide a context window consumption visualization.** Instead, it uses an internal "summarizing conversation history" mechanism that is known to be buggy and can break cached context, disrupting APM workflows.
>
> * **If summarization triggers (in any phase)**: The agent may lose track of crucial context (guides, prompts, task details), resulting in degraded responses. **Stop the response immediately**, then re-provide the necessary prompts, guides, or task context before continuing. If issues persist, consider starting a new agent session and manually rebuilding context to resume work where you left off.
>
> **Tip:** Consider disabling the summarization mechanism by setting `github.copilot.chat.summarizeAgentConversationHistory.enabled` to `false` in your Copilot settings.
>
> > Additional notes for specific IDEs will be added here as new releases occur and user feedback is collected.

---

## Step 1: Install and Initialize APM

APM v0.5 introduces a CLI tool that automates the installation and setup process.

### 1.1 Install the CLI

Install the APM CLI globally using npm:

```bash
npm install -g agentic-pm
````

**Alternatively:** for local installation in your project's workspace:

```bash
npm install agentic-pm
```

### 1.2 Initialize Your Project

Navigate to your project directory and run:

```bash
apm init
```

<div align="center">
  <img 
    src={require('@site/static/docs-img/cursor-apm-init.png').default} 
    alt="Initialize APM for your project using the `agentic-pm` CLI." 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>


The `init` command will:

  * **Prompt for AI Assistant Selection**: Select your AI assistant from a list of supported platforms.
  * **Download APM Assets**: Automatically fetch the latest prompts and guides.
  * **Create Directory Structure**: Set up the `.apm/` directory with:
      * `.apm/guides/` - All template guides for APM workflows
      * `.apm/Memory/Memory_Root.md` - Empty root memory file
      * `.apm/Implementation_Plan.md` - Empty implementation plan file
      * `.apm/metadata.json` - Installation metadata
  * **Install Commands**: Create assistant-specific slash commands in the appropriate directory (e.g., `.cursor/`, `.github/copilot/`, etc.)

After initialization completes, you're ready to begin using APM.

<div align="center">
  <img 
    src={require('@site/static/docs-img/cursor-apm-init-complete.png').default} 
    alt="Installed assets for your APM session." 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>

---

## Step 2: Initialize Setup Agent

The Setup Agent conducts comprehensive project planning and creates all necessary APM assets.

### 2.1 Create Setup Agent Session

1.  **Open New Chat Session**: Start a dedicated chat session for the Setup Agent (e.g., "AI Agent" mode).
2.  **Name It Clearly**: Use a clear name like "Setup Agent" or "APM Setup."
3.  **Model Choice**: Select a top-tier model as recommended in the [Prerequisites](#prerequisites).

### 2.2 Run Setup Agent Initialization Command

To initialize the Setup Agent, simply enter the command:

```
/apm-1-initiate-setup
```

<div align="center">
  <img 
    src={require('@site/static/docs-img/cursor-apm-setup-agent.png').default} 
    alt="Initialize Setup Agent using the `/apm-initiate-setup` command." 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>

---

## Step 3: Work Through Setup Phase
The Setup Agent will greet you and outline its 5-step workflow:

1.  Context Synthesis
2.  Project Breakdown & Plan Creation
3.  Implementation Plan Review & Refinement
4.  Implementation Plan Enhancement & Finalization
5.  Manager Bootstrap Prompt Creation

The Setup Agent will guide you through each step systematically, always asking for your confirmation before moving on so you can review, clarify, or request changes. **Be thorough during this phase** - time invested here prevents roadblocks later.

### 3.1 Context Synthesis (Project Discovery)

**This is the most important stage.** The Setup Agent will conduct structured discovery through three phases:

  * **Existing Materials & Vision**: Share PRDs, requirements, existing code, or project documentation.
  * **Technical Requirements**: Discuss technologies, constraints, dependencies, and technical scope.
  * **Process Requirements**: Explain workflow preferences, quality standards, and coordination needs.

> **Tips for Context Synthesis:** Share all relevant project details and constraints, consider long-term needs, and discuss any uncertainties or options with the Setup Agent.

### 3.2 Project Breakdown

The Setup Agent will systematically break down your project through key stages:

  * **Domain Analysis**: Identify work areas and create Implementation Agent assignments.
  * **Phase Definition**: Establish project progression and logical groupings.
  * **Phase Cycles**: Create detailed task breakdown with dependency analysis.
  * **Final Review**: Agent workload balancing and cross-agent coordination planning.

> **Tips for Project Breakdown:** Review the Agent's reasoning in the chat and thoroughly check the full Implementation Plan at the end. Request any changes or clarifications now. **Fixing issues early is much easier and cheaper than later adjustments.**

### 3.3 Implementation Plan Review (Optional)

The Setup Agent will offer systematic review of the Implementation Plan:

  * **Recommended**: For complex projects or first-time APM users.
  * **Optional**: If you're satisfied with the plan quality.

> **Tip for Implementation Plan AI-driven Review:** This AI-driven review focuses on AI-specific planning issues (task packing, classification errors). **You must still conduct your own manual review** for requirement gaps or constraints.

### 3.4 Implementation Plan Enhancement & Finalization

The Setup Agent will:

  * Transform the Implementation Plan into detailed APM artifact format.
  * Generate comprehensive task specifications.

### 3.5 Manager Bootstrap Creation

The Setup Agent will create a **Bootstrap Prompt** summarizing project context, key requirements, and next steps for the Manager Agent. 

**Save or copy this prompt** — you'll need it to initialize the Manager Agent session.

---

## Step 4: Initialize Manager Agent

### 4.1 Create Manager Agent Session

1.  **Open New Chat**: Create another dedicated chat session in "agent" mode.
2.  **Name It Clearly**: Use a clear name, such as "Manager Agent" or "APM Manager 1."
3.  **Model Choice**: Select a model as recommended in the [Prerequisites](#prerequisites).

### 4.2 Run Manager Agent Initialization Command

Enter the Manager Agent initialization command:

```
/apm-2-initiate-manager
```

### 4.3 Deliver Bootstrap Prompt

The Manager Agent requires the Bootstrap Prompt to receive initial project context.

**Paste the Bootstrap Prompt** created by your Setup Agent.

The Manager Agent will review project materials, initialize the Memory System, and confirm understanding before requesting authorization to begin tasks. **Authorize the Manager Agent** once you confirm their understanding is accurate. For example:

`"Your understanding of your responsibilities is complete. Please proceed to phase 1 execution."`

---

## Step 5: First Task Assignment

### 5.1 Manager Creates Task Assignment

The Manager Agent will create a **Task Assignment Prompt** for the first task in your Implementation Plan. The prompt will be presented **in a markdown code block** for easy copy-paste.

### 5.2 Initialize Implementation Agent

1.  **Open New Chat**: Create another dedicated chat session for the assigned Implementation Agent.
2.  **Name Appropriately**: Use the agent name from the Implementation Plan (e.g., "Agent_Frontend").
3.  **Enter the Implementation Agent Initialization Command**:
    ```
    /apm-3-initiate-implementation
    ```
The Implementation Agent will confirm its role, read the Memory Log Guide, and wait for the Task Assignment.

### 5.3 Deliver Task Assignment

**Copy the Task Assignment Prompt** from the Manager Agent and **paste it to the Implementation Agent**.

The Implementation Agent will confirm task requirements, carry out the work, and report completion with a Memory Log entry.

---

## Step 6: Complete First Task Cycle

### 6.1 Task Execution & Memory Logging
The Implementation Agent will execute the task in one of two ways:
  * **Single-Step Tasks**: Agent completes all subtasks and proceeds directly to Memory Logging.
  * **Multi-Step Tasks**: Agent executes step-by-step with your confirmation at each stage. You can provide feedback and request modifications between steps.

> **Efficiency tip**: Request step combination for related work: `"Step 2 looks alright. Combine steps 3-4 and log in your next response."`
> **Explanation Tip:** Ask the Manager Agent to include explanation instructions in Task Assignment Prompts, or request detailed explanations directly from the Implementation Agent during task execution.

Once task is complete, or faced serious blockers, the Agent will create a concise Memory Log entry summarizing task completion, outputs, any delegations or any issues encountered, and next steps or recommendations.

### 6.2 Report to Manager for Review & Next Steps

**Return to your Manager Agent session** and inform them of the task status. For example:

`"Agent_[Name] has completed Task [X.Y] successfully and logged the results to [Memory_Log_Path]. Please review it and proceed accordingly."`

The Manager Agent will review the Memory Log and task outputs, then decide to either continue with the next task, request corrections, or update the Implementation Plan as needed.

---

## Establish Your Workflow

### Task Loop Pattern

You'll repeat this cycle:

1.  **Manager**: Creates Task Assignment Prompt.
2.  **User**: Delivers prompt to the appropriate Implementation Agent.
3.  **Implementation Agent**: Executes task and logs work.
4.  **User**: Reports completion to the Manager.
5.  **Manager**: Reviews and determines the next action.

### Agent Management

  * **Multiple Implementation Agents**: Create separate sessions for different domains (Frontend, Backend, Research).
  * **Agent Naming**: Use clear, consistent naming (e.g., "Agent_Frontend_1", "Manager_Agent_1").
  * **Session Organization**: Keep Manager and Implementation Agent sessions easily accessible.

### Handover Procedure: Managing Context Window Limits

When agents approach the context window limit, perform a **Handover Procedure** for smooth continuation.

<div align="center">
  <img 
    src={require('@site/static/docs-img/cursor-apm-handover-implementation.png').default} 
    alt="Handover Implementation Agents using `/apm-6-handover-implementation` command" 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>

1.  **Detect the Limit:** Watch for context window usage (if your IDE provides a visualization) or signs like repeated questions or generic responses.
2.  **Request a Handover:** Ask the agent to begin a Handover Procedure using the appropriate command.
      * The agent will produce a **Handover File** (active, undocumented context) and a **Handover Prompt** (onboarding instructions).
3.  **Open a New Agent Session:** Start a new chat for the same agent role (e.g., "Agent_Backend_2") and initialize it.
4.  **Initialize the New Agent:** Paste the **Handover Prompt** (and provide the Handover File as context if needed) as the first message.
5.  **Verify and Resume:** **Verify the new agent's understanding** of the project state. Once verified, authorize the agent to continue work.

---

## Common First Session Issues & Tips

### Common First Session Issues

| Agent | Problem | Solution |
| :--- | :--- | :--- |
| **Setup Agent** | Splits responses or doesn't follow chat-to-file procedure. | Prompt for a complete systematic sequence in a single response, or adjust exchanges to complete the procedure. |
| **Setup Agent** | Implementation Plan tasks are too broad or packed. | Request task splitting and a more granular breakdown. |
| **Manager Agent** | Creates plain text instead of a markdown code block for Task Assignment. | Clarify format requirement: `"Please provide the Task Assignment Prompt in a markdown code block for copy-paste."` |
| **Implementation Agent** | Doesn't follow single-step vs multi-step patterns correctly. | Reference the task format and clarify execution expectations. |
| **Implementation Agent** | Memory Logging is incomplete or non-standard. | Reference the Memory Log Guide for the proper format *before* providing the next Task Assignment. |

> For more detailed troubleshooting guidance and solutions to common issues, refer to the [`docs/Troubleshooting_Guide.md`](https://www.google.com/search?q=Troubleshooting_Guide.md)

---

**Congratulations!** You've successfully launched your first APM session. The structured, spec-driven approach provides reliable project execution and prevents the chaos typical of AI collaboration.

**Additional Resources:**

  * [`Token_Consumption_Tips.md`](Token_Consumption_Tips.md) - Optimize model usage and costs
  * [`Context_and_Memory_Management.md`](Context_and_Memory_Management.md) - Deep dive into how APM manages context and memory
  * [`Modifying_APM.md`](Modifying_APM.md) - Customize APM for your specific needs