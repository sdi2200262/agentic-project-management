# Getting Started - APM v0.5

This guide walks you through launching your first APM session, from initial setup through completing your first few tasks. **The more time spent during setup and planning, the better your project execution will be.**

> For a clearer understanding of each agent's roles and responsibilities, refer to the [Agent Types document](Agent_Types.md).

> For a detailed walkthrough of APM workflows and protocols, refer to the [Workflow Overview document](Workflow_Overview.md).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Notes for specific AI IDEs](#notes-for-specific-ai-ides)
- [Step 1: Install and Initialize APM](#step-1-install-and-initialize-apm)
- [Step 2: Initialize Setup Agent](#step-2-initialize-setup-agent)
- [Step 3: Work Through Setup Phase](#step-3-work-through-setup-phase)
- [Step 4: Initialize Manager Agent](#step-4-initialize-manager-agent)
- [Step 5: First Task Assignment](#step-5-first-task-assignment)
- [Step 6: Complete First Task Cycle](#step-6-complete-first-task-cycle)
- [Establish Your Workflow](#establish-your-workflow)
- [Common First Session Issues](#common-first-session-issues)
- [Tips for Success](#tips-for-success)

---

## Prerequisites

Before starting your first APM session, ensure you have:

### Required
- **Node.js**: APM v0.5 CLI requires Node.js (v16 or higher recommended)
- **AI IDE Platform**: Access to an AI IDE with multiple chat sessions and file operations (Cursor, Windsurf, VS Code with AI extensions, etc.)
- **Project Workspace**: Dedicated directory for your project files

### Recommended Model Tiers

Each APM agent type has different model requirements, so model selection may vary by role. However, **Claude Sonnet 4** stands out for its strong reasoning and agentic capabilities, consistently performing well across all agent instances.

*  **Setup Agent**: For best results, use top-tier frontier models such as Claude Sonnet 4, Claude Sonnet 4.5 or Gemini 2.5 Pro throughout the entire Setup Phase. These models excel at the systematic reasoning required for project planning and breakdown
    > **Important**: Avoid switching models mid-conversation during the Setup Phase as this causes context gaps due to token caching disruptions. Use one model throughout the entire Setup Agent session. **Best performing model during testing was Claude Sonnet 4**.

<br/>

*  **Manager Agent**: Best practice is to use a powerful model with strong reasoning abilities. Like for the Setup Agent, Claude Sonnet 4, Claude Sonnet 4.5 and Gemini 2.5 Pro are highly recommended. You can leverage CoT models for their advanced reasoning, but be aware that some CoT models may interfere with APM workflow protocols and occasionally break responses. Alternatively, mid-tier models like Claude 3.7 Sonnet or Cursor Auto (which mixes models) offer a more economical option.
    > **Important:** Avoid switching models mid-conversation for the Manager Agent to prevent context gaps. While model-switching caused fewer issues here than with the Setup Agent, it's still best to stick to one model.
    >
    > **Note:** **During testing, Cursor Auto delivered outstanding performance as the Manager Agent.** Given its low cost, it stands out as the most efficient and cost-effective choice. For other AI Assistants compact, and agentic models like Qwen 3 and Kimi K2 have also delivered acceptable results.

<br/>

*  **Implementation Agents**: In APM, tasks are designed to be granular and clearly scoped, enabling even compact models to execute them successfully. The effectiveness of Implementation Agents depends on the quality and granularity of your Implementation Plan, so invest time perfecting it before proceeding. While high-end models like Sonnet 4.5 will provide the best results, base models such as GPT-4.1 in Copilot, Cursor Auto, or Grok Code Fast results for their price point.
    > **Note:** Because Implementation Agent context is always tightly scoped to the assigned task and session, switching between models mid-conversation (for example, to match task complexity or requirements) did not cause significant context gaps or issues during testing. Unlike with Setup or Manager Agents, context loss from token caching disruptions was minimal. **During testing, model switching was frequently performed based on task domain, for example, using Cursor Auto, GPT-4.1 in Copilot, or Windsurf's SWE-1 for most tasks, and switching to Sonnet 4.5, GPT-5 or GPT-5-Codex for especially complex or design-heavy assignments, with no major problems observed.** If you choose to experiment with model switching, proceed carefully and remain attentive to any potential context gaps.

<br/>

> **Note:** For guidance on choosing models in an economical way, be sure to read the [Token_Consumption_Tips.md](Token_Consumption_Tips.md).

---

## Notes for specific AI IDEs

> **As of November 2025, GitHub Copilot does not provide a context window consumption visualization.** Instead, it uses an internal "summarizing conversation history" mechanism that is known to be buggy and can break cached context, disrupting APM workflows.
>   - **Setup Phase**: If the summarization mechanism triggers, the agent may lose track of guides and procedures. **Stop the response immediately**, then re-provide the required prompts and guides (e.g., Setup Agent initiation prompt, planning guides) before continuing. Consider starting a new agent session and manually reconstructing context to continue where you left off.
> <br/>
>
>   - **Task Loop Phase**: The cycle is more resilient, but the same issue can occur. If summarization mechanism triggers, and you noticed degrading response quality **stop the response** then re-provide the necessary prompts/guides or task context. Consider starting a new agent session and manually reconstructing context to continue where you left off.
>
> **Tip:** Consider disabling the summarization mechanism by setting `github.copilot.chat.summarizeAgentConversationHistory.enabled` to `false` in your Copilot settings.
>
> > Additional notes for specific IDEs will be added here as new releases occur and user feedback is collected.

---

## Step 1: Install and Initialize APM

APM v0.5 introduces a CLI tool that automates the installation and setup process. Install the APM CLI globally using npm:

```bash
npm install -g agentic-pm
```

> **Alternatively:** for local installation in your project's workspace:
>
>```bash
>npm install agentic-pm
> ```
> <br/>

### Initialize Your Project

Navigate to your project directory and run:

```bash
apm init
```

The `init` command will:
1. **Prompt for AI Assistant Selection**: Ask you to select your AI assistant from a list of supported platforms (Cursor, GitHub Copilot, Windsurf, Claude Code, etc.)
2. **Download APM Assets**: Automatically fetch the latest prompts and guides from the APM repository
3. **Create Directory Structure**: Set up the `.apm/` directory with:
   - `.apm/guides/` - All template guides for APM workflows
   - `.apm/Memory/Memory_Root.md` - Empty root memory file
   - `.apm/Implementation_Plan.md` - Empty implementation plan file
   - `.apm/metadata.json` - Installation metadata
4. **Install Commands**: Create assistant-specific slash commands in the appropriate directory (e.g., `.cursor/`, `.github/copilot/`, etc.)

After initialization completes, you're ready to begin using APM with your AI assistant.

---

## Step 2: Initialize Setup Agent

The Setup Agent conducts comprehensive project planning and creates all necessary APM assets.

### 2.1 Create Setup Agent Session

1. **Open New Chat Session**: Within your AI IDE, start a dedicated chat session for the Setup Agent. The mode name varies depending on your AI Assistant platform (e.g., "AI Agent", "Agent Mode", etc.).
    > **Note:** For APM to function as intended, your LLM/AI assistant should have basic tool access. This means the ability to perform file operations (read, write, delete), run basic terminal commands, search for files, and (optionally) perform web searches or similar actions. These capabilities are essential for agents to autonomously manage project assets and follow the APM workflow.
2. **Name It Clearly**: "Setup Agent" or "APM Setup"
3. **Model Choice**: Refer to the "Prerequisites" section above for recommended models for the Setup Agent.

### 2.2 Run Setup Agent Initialization Command

The APM CLI has automatically installed slash commands for your AI assistant. To initialize the Setup Agent, simply enter the command:

```
/apm-1-initiate-setup
```

This command loads the Setup Agent Initiation Prompt automatically. The Setup Agent will greet you and outline its 5-step workflow:
1. Context Synthesis
2. Project Breakdown & Plan Creation
3. Implementation Plan Review & Refinement
4. Implemmentation Plan Enhancement & Finalization
5. Manager Bootstrap Prompt Creation

---

## Step 3: Work Through Setup Phase

The Setup Agent will guide you through each step systematically. **Be thorough during this phase**; time invested here prevents roadblocks later.

Each step of the Setup Phase is designed to support APM's spec-driven methodology. Before moving on, the Setup Agent will always ask for your confirmation, giving you the opportunity to review, clarify, or request changes to the current step. This allows you to iterate as needed, whether by providing additional explanations, making clarifications, or requesting modifications to the Implementation Plan, before proceeding to the next step.

### 3.1 Context Synthesis (Project Discovery)

**This is the most important stage.** The Setup Agent will conduct structured discovery through three phases:

1. **Existing Materials & Vision**: Share any PRDs, requirements, existing code, or project documentation
2. **Technical Requirements**: Discuss technologies, constraints, dependencies, and technical scope
3. **Process Requirements**: Explain workflow preferences, quality standards, and coordination needs

> **Tips for Context Synthesis:**
>  - **Be comprehensive**: Share all relevant project information
>  - **Think long-term**: Consider maintenance, scaling, and future requirements
>  - **Include constraints**: Timeline, technical limitations, workflow preferences
>  - **Ask questions**: If uncertain about requirements, discuss options with the Setup Agent

### 3.2 Project Breakdown

The Setup Agent will systematically break down your project:

1. **Domain Analysis**: Identify work areas and create Implementation Agent assignments
2. **Phase Definition**: Establish project progression and logical groupings
3. **Phase Cycles**: Create detailed task breakdown with dependency analysis
4. **Final Review**: Agent workload balancing and cross-agent coordination planning

**Review carefully** as tasks are created. The Setup Agent will present reasoning in chat and append phase and task contents in the Implementation Plan file.

> **Tip for Project Breakdown Manual Review:** When the Project Breakdown is finished, take time to carefully review the entire Implementation Plan. Make sure every phase and task aligns with your project and workflow needs. If you notice anything that needs to be changed or clarified, request corrections/modifications. Addressing issues at this stage is much more efficient than making adjustments later.

### 3.3 Implementation Plan Review (Optional)

The Setup Agent will offer systematic review of the Implementation Plan:

- **Recommended**: For complex projects or first-time APM users
- **Optional**: If you're satisfied with the plan quality

> **Tip for Implementation Plan AI-driven Review:** This AI-driven review will focus on AI-specific planning issues in your Implementaiton Plan (task packing, classification errors, dependencies). Any potential requirement gaps or constraints not specified will likely be missed by the Setup Agent. Make sure that you conduct your own manual review of the plan.

### 3.4 Implementation Plan Enhancement & Finalization

The Setup Agent will:
- Transform the Implementation Plan into detailed APM artifact format
- Generate comprehensive task specifications

### 3.5 Manager Bootstrap Creation

The Setup Agent generates a Bootstrap Prompt containing:
- Project context and requirements
- Implementation Plan overview
- Memory system instructions
- Next action specifications

**Store/Copy this Bootstrap Prompt** - you'll need it for the first Manager Agent initialization.

---

## Step 4: Initialize Manager Agent

### 4.1 Create Manager Agent Session

1. **Open New Chat**: Create another dedicated chat session in "agent" mode
2. **Name It Clearly**: "Manager Agent" or "APM Manager 1"
3. **Model Choice**: Refer to the "Prerequisites" section above for recommended models for the Manager Agent.

### 4.2 Run Manager Agent Initialization Command

Enter the Manager Agent initialization command:

```
/apm-2-initiate-manager
```

This command loads the Manager Agent Initiation Prompt automatically.

### 4.3 Deliver Bootstrap Prompt

The Manager Agent will ask for either a Bootstrap Prompt or Handover Prompt. Since this is the first Manager Agent instance of the session, it requires the Bootstrap Prompt from the Setup Agent to receive initial project context.

**Paste the Bootstrap Prompt** created by your Setup Agent.

The Manager Agent will:
- Read the required guides to understand APM procedures and protocols
- Read the Implementation Plan and validate structure
- Initialize the Memory System for the current phase (see note below)
- Confirm understanding of the project scope
- Request authorization to begin task execution

**Authorize the Manager Agent** once you confirm their understanding is accurate:
`"Your understanding of your responsibilities is complete. Please proceed to phase 1 execution."`

> **Note:** In some AI IDEs or with certain system prompts, the Manager Agent may *not* immediately initialize phase 1 of the Memory System for the `dynamic-md` memory strategy. Instead, it may request your confirmation to proceed with task execution, and only then initialize the phase 1 of the Memory System, then issue the first task assignment prompt in the same response. This is normal; simply confirm as requested (e.g., "Please proceed to phase 1 execution") and the Manager Agent will continue as expected.

---

## Step 5: First Task Assignment

> **Note:** The Manager Agent may proceed with phase 1 memory initialization (see note above) before the Task Assignment Prompt creation for the first task, if this was not done in the previous response.

### 5.1 Manager Creates Task Assignment

The Manager Agent will create a Task Assignment Prompt for the first task in your Implementation Plan.

The prompt will be presented **in a markdown code block** for easy copy-paste.

### 5.2 Initialize Implementation Agent

1. **Open New Chat**: Create another dedicated chat session for the assigned Implementation Agent
2. **Name Appropriately**: Use the agent name from the Implementation Plan (e.g., "Agent_Frontend")
3. **Run Implementation Agent Initialization Command**:
    ```
    /apm-3-initiate-implementation
    ```
    This command loads the Implementation Agent Initiation Prompt automatically. The Implementation Agent, after receiving their Initiation Prompt, will:
        1. Greet and confirm their role
        2. Read the Memory Log Guide (see note below)
        3. Confirm understanding of responsibilities
        4. Wait for the first Task Assignment or Handover Prompt
    > **Note:** Some AI IDEs' system prompts, or lower-cost models lacking "strong" agentic capabilities, may not autonomously read the Memory Log Guide and will instead request it directly. If this occurs, provide the Memory Log Guide in your next response *before* supplying any task assignment prompts.

### 5.3 Deliver Task Assignment

**Copy the Task Assignment Prompt** from the Manager Agent and **paste it to the Implementation Agent**.

The Implementation Agent will:
- Confirm understanding of the task requirements
- Execute the work following single-step or multi-step patterns
- Report completion and create Memory Log entry

---

## Step 6: Complete First Task Cycle

### 6.1 Task Execution

**For Single-Step Tasks**:
- Implementation Agent completes all subtasks in one response
- Proceeds directly to Memory Logging

**For Multi-Step Tasks**:
- Imlpementation Agent executes step-by-step with your confirmation at each stage; you are able to combine adjacent step executions wherever applicable
    - **Efficiency tip**: Request step combination for related work: `"Step 2 looks alright. Combine steps 3-4 and log in your next response"`
- You can provide feedback and request modifications between steps
- Implementation Agent proceeds to Memory Logging after final step

> **Explanation Tip**: If you’re working on a complex task or are unfamiliar with the task’s domain, you can request explanations to help you understand the process. You can either ask the Manager Agent to include explanation instructions in the Task Assignment Prompt, or request explanations directly from the Implementation Agent during task execution:
>    - **Manager Level** (ask the Manager Agent to include explanation requirements in the Task Assignment Prompt):  
>        - `"Task X was completed. Please review the log and proceed. Include explanation instructions for the next Task Assignment Prompt because I find task Y complex."`  
>    <br/>
>
>    - **Implementation Level** (ask the Implementation Agent directly during execution):  
>        - `"Please proceed to the next step, but include detailed explanation of your approach and rationale."`  

### 6.2 Memory Logging

The Implementation Agent will complete a standardized Memory Log entry containing:
- Task completion status
- Outputs and deliverables created
- Ad-Hoc delegation findings (if any)
- Issues encountered (if any)
- Next steps or recommendations

### 6.3 Report to Manager

**Return to your Manager Agent session** and inform them about task execution outputs. For example:
`"Agent_[Name] has completed Task [X.Y] successfully and logged the results to [Memory_Log_Path]. Please review it and proceed accordingly."`

### 6.4 Manager Review & Next Steps

The Manager Agent will:
- Review the Memory Log and possibly task execution outputs for quality and completeness
- Determine the Next Action:
  - **Continue**: Issue next Task Assignment Prompt
  - **Corrections**: Create follow-up prompt for refinements
  - **Plan Updates**: Modify Implementation Plan based on findings

---

## Establish Your Workflow

### Task Loop Pattern

You'll now repeat this cycle:
1. **Manager**: Creates Task Assignment Prompt
2. **User**: Delivers prompt to appropriate Implementation Agent
3. **Implementation Agent**: Executes task and logs work
4. **User**: Reports completion to Manager
5. **Manager**: Reviews and determines next action

### Agent Management

**Multiple Implementation Agents**: Create separate sessions for different domains (Frontend, Backend, Research, etc.)

**Agent Naming**: Use clear, consistent naming (e.g., "Agent_Frontend_1", "Manager_Agent_1")

**Session Organization**: Keep Manager and Implementation Agent sessions easily accessible


### Handover Procedure: Managing Context Window Limits

As your sessions grow, agents may approach the LLM's context window limit. When this happens, you should perform a **Handover Procedure** to ensure smooth continuation:

1. **Detect the Limit:** Watch for context window usage through your AI IDE's visualization (if any) or signs like repeated questions, forgotten details, or generic responses.
2. **Request a Handover Procedure:** Ask the agent to begin a Handover Procedure using the appropriate Handover Guide. For example:
    `"You are approaching your context window limits. Start a Handover Procedure, using the Implementation Agent Handover Guide."`
    If eligible, the agent will follow the guide and produce two artifacts:
      - **Handover File**: Captures active, undocumented context (recent work, key decisions, user preferences, blockers) not in Memory Logs.
      - **Handover Prompt**: A markdown code block with onboarding instructions for the new agent, including how to process the Handover File, complete the context transfer and resume work.
3. **Open a New Agent Session:** Start a new chat for the same agent role (e.g., "Agent_Backend_2") and initialize it accordingly.
4. **Initialize the New Agent:** Paste the Handover Prompt (and provide the Handover File as context if needed) as the very first message after initializing the new session.
5. **Verify and Resume:** Verify the new agent's understanding of the project state and context. Once verified, authorize the agent to continue work from where the previous session left off.

---

## Common First Session Issues

### Setup Agent Issues

**Problem**: Setup Agent splits responses or doesn't follow chat-to-file procedure
**Solution**: Prompt for complete systematic sequence in single response or adjust exchanges accordingly to complete project breakdown procedure

**Problem**: Implementation Plan tasks are too broad or packed
**Solution**: Request task splitting and more granular breakdown, adjust Implementation Plan to match your project's needs

### Manager Agent Issues

**Problem**: Manager creates plain text instead of markdown code block for Task Assignment
**Solution**: Clarify format requirement: "Please provide the Task Assignment Prompt in a markdown code block for copy-paste"

### Implementation Agent Issues

**Problem**: Agent doesn't follow single-step vs multi-step patterns correctly
**Solution**: Reference the task format and clarify execution expectations, match Implementation Agent responses to match your workflow references

**Problem**: Memory Logging incomplete or non-standard
**Solution**: Reference the Memory Log Guide for proper format, before providing any Task Assignment Prompts

### General Workflow Issues

**Problem**: Losing track of multiple chat sessions
**Solution**: Use clear naming conventions and bookmark/pin important sessions

**Problem**: Context confusion between agents
**Solution**: Each agent should only focus on their assigned work, avoid cross-contamination

> For more detailed troubleshooting guidance and solutions to common issues, refer to the `Troubleshooting` section in the [User Guide](guides/APM_User_Guide.pdf).

---

## Tips for Success

### Setup Phase
- **Invest time in Context Synthesis**: Thorough discovery prevents later problems
- **Review Implementation Plan carefully**: Ensure tasks match your actual project needs
- **Ask questions**: Clarify anything uncertain during setup

### Task Loop Phase
- **Stay organized**: Use clear session naming and keep track of active agents
- **Supervise task prompts and logs**: As the link between Manager and Implementation Agents, check that task prompts and logs are clear, well-formatted, and follow defined standards.
- **Use Ad-Hoc Agents for heavy tasks**: Offload context-heavy or isolated work (like debugging or research) to Ad-Hoc Agents to keep core agents focused.

### Context Management
- **Watch context usage**: Monitor session length and prepare for handovers
- **Maintain continuity**: Use Memory Logs and Handover procedures as designed
- **Keep sessions focused**: Each agent should work only on assigned tasks

---

**Congratulations!** You've successfully launched your first APM session. The structured spec-driven approach may feel too methodical initially, but it provides reliable project execution and prevents the chaos typical of AI collaboration.

**Additional Resources:**
- [`docs/Token_Consumption_Tips.md`](Token_Consumption_Tips.md) - Optimize model usage and costs
- [`docs/Context_and_Memory_Management.md`](Context_and_Memory_Management.md) - Deep dive into how APM manages context and memory for agent instances
- [`docs/Modifying_APM.md`](Modifying_APM.md) - Customize APM for your specific needs
