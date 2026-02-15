---
id: getting-started
slug: /getting-started
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started with APM

This guide walks you through your first APM session, from installation through completing your first few tasks. The time invested in planning determines execution quality - thorough planning prevents roadblocks during implementation.

For deeper context on Agent roles and workflow structure, see [Agent Types](Agent_Types.md) and [Workflow Overview](Workflow_Overview.md).

---

## Prerequisites

Before starting, ensure you have:

### Required Resources
- **Node.js** - Version 18 or higher for the APM CLI
- **AI Assistant Platform** - Access to Claude, Cursor, GitHub Copilot, or similar
- **Project Workspace** - A dedicated directory for your project

### Recommended Models

APM Agents perform best with models that excel at systematic reasoning and context management. **Claude Sonnet 4.5** provides consistent performance across all Agent types.

| Agent Type | Recommended Models | Cost-Effective Alternatives | Notes |
| :--- | :--- | :--- | :--- |
| **Planner Agent** | Claude Sonnet 4/4.5, Claude Opus 4.5/4.6, | - | Prefer the recommended models for best planning output. Avoid switching models during Planning Phase to prevent context gaps. Use one model throughout. |
| **Manager Agent** | Claude Sonnet 4/4.5, Claude Opus 4.5/4.6, Gemini 3 Pro | Claude Haiku 4.5, Cursor Auto | Model switching mid-session not recommended though less critical than for Planner. |
| **Worker Agents** | Claude Sonnet 4.5, Claude Opus 4.5/4.6, GPT-5.x, GPT-5.x-Codex, Gemini 3 Pro | Claude Haiku 4.5, GPT-5.x-mini, GPT-5.x-Codex-mini, Grok Code, Cursor Composer, Cursor Auto | Context is tightly scoped, making model switching viable for matching task complexity. |

> For guidance on economical model selection, see [Token Consumption Tips](Token_Consumption_Tips.md).

---

## Platform-Specific Notes

Platform-specific guidance will be added as new releases occur and user feedback is collected.

> **GitHub Copilot Context Summarization:** As of November 2025, GitHub Copilot lacks context window visualization and uses internal "conversation history summarization" that can break cached context. If summarization triggers during any phase, the Agent may lose crucial context (guides, commands, task details). Stop the response immediately and re-provide necessary context. Consider disabling summarization via `github.copilot.chat.summarizeAgentConversationHistory.enabled: false` in settings.

---

## Installation

APM provides a CLI tool that automates installation and setup.

### Install the CLI

Install globally via npm:

```bash
npm install -g agentic-pm
```

Or locally in your project workspace:

```bash
npm install agentic-pm
```

### Initialize Your Project

Navigate to your project directory and run:

```bash
apm init
```

The initialization command will:

- **Prompt for AI Assistant** - Select your platform from supported assistants
- **Download APM Assets** - Fetch the latest commands, guides, and skills
- **Create APM Directory Structure** - Set up `.apm/` with:
  - `.apm/Memory/Memory_Root.md` - Central memory file (populated by Manager)
  - `.apm/Implementation_Plan.md` - Plan template (populated by Planner)
  - `.apm/Specifications.md` - Specifications template (populated by Planner)
  - `.apm/metadata.json` - Installation metadata
- **Install Procedural Files** - Create required commands, guides and skills in platform-specific directories (`.cursor/`, `.github/`, `claude/` etc.):
  - `.cursor/commands/` - Agent initiation and handoff commands
  - `.cursor/guides/` - Procedure guides for Agents
  - `.cursor/skills/` - Shared procedural skills

After initialization completes, you're ready to begin.

---

## Step 1: Initiate Planner Agent

The Planning Phase creates the Coordination Artifacts that guide all subsequent work.

### Create Planner Agent Session

1. Open a new chat session in your AI assistant (Agent mode if available)
2. Name it clearly: "Planner Agent" or "APM Planner"
3. Select a top-tier model as recommended in Prerequisites

### Run Initialization Command

Enter the command:

```
/apm-1-initiate-planner
```

The Planner will greet you and outline its two-step process:
1. Context Gathering - Structured project discovery through question rounds
2. Work Breakdown - Decomposition into Coordination Artifacts

---

## Step 2: Work Through the Planning Phase

The Planner guides you through two sequential procedures: Context Gathering and Work Breakdown.

### Context Gathering

The Planner conducts structured discovery through three question rounds. This is the most critical phase - thoroughness here prevents issues during implementation.

**Question Round 1: Existing Materials and Vision**
- Share project type, goals, and scope
- Provide any existing documentation, PRDs, or requirements
- Describe success criteria and deliverables

**Question Round 2: Technical Requirements**
- Discuss work structure, dependencies, and complexity
- Specify technical requirements and constraints
- Identify validation criteria for each requirement

**Question Round 3: Implementation Approach and Quality**
- Define technical constraints and preferences
- Establish workflow patterns and quality standards
- Clarify domain organization and coordination requirements

After all rounds, the Planner presents an Understanding Summary for your review. You can request modifications or approve to proceed.

> **Tips for Context Gathering:**
> - Share all relevant constraints and uncertainties
> - Provide documents early - this improves subsequent questions
> - Be specific about validation criteria - how will you know each requirement is met?

### Work Breakdown

The Planner decomposes gathered context into three Coordination Artifacts that serve different roles during execution:

**Specifications** - Project-specific design decisions and constraints defining what is being built. The Planner analyzes your requirements across scope, entities, behaviors, relationships, and constraints, then writes the Specifications file. Workers do not access this file directly - the Manager extracts relevant content into Task Prompts as needed. You'll review and approve before continuing.

**Implementation Plan** - Stage and Task breakdown with Agent assignments, a Dependency Graph, and validation criteria defining how work is organized. The Planner:
- Identifies logical work domains and creates Worker Agent assignments
- Defines project stages with clear objectives
- Breaks down each stage into tasks with validation criteria
- Reviews workload distribution and cross-agent dependencies making relevant updates if needed
- Generates a Dependency Graph visualizing final task dependencies and workflow

Workers do not access the Implementation Plan - the Manager extracts Task contents and creates Task Prompts accordingly. You'll review the complete plan and request any changes before approval.

**Standards** - Universal execution patterns defining how work is performed. The Planner extracts patterns that apply across all tasks (coding conventions, quality requirements, prohibited patterns) and writes them in an APM_STANDARDS block in the Standards file (AGENTS.md or CLAUDE.md at workspace root). All Agents have direct access to this file - both Manager and Workers may update it during the Implementation Phase. You'll review and approve to complete the Planning Phase.

After all three approvals, the Planner confirms completion. You're ready to initialize the Manager Agent.

---

## Step 3: Initiate Manager Agent

The Manager Agent coordinates execution of the Implementation Plan.

### Create Manager Agent Session

1. Open a new chat session in Agent mode
2. Name it clearly: "Manager Agent" or "APM Manager 1"
3. Select a model as recommended in Prerequisites

### Run Initialization Command

Enter the command:

```
/apm-2-initiate-manager
```

The Manager will:
- Read the Coordination Artifacts (Specifications, Implementation Plan, Standards)
- Initialize the Memory System
- Initialize the Message Bus for Agent communication
- Initialize version control if a git repository exists
- Present an understanding summary

Review the Manager's summary carefully. If it accurately reflects your project authorize it to proceed, otherwise make corrections as needed. The Manager will then prepare the first Coordination Cycle.

---

## Step 4: Work Through the Implementation Phase

The Implementation Phase executes the Implementation Plan through repeating Coordination Cycles. This step walks through your first cycle as an example.

### Manager Creates Task Assignment

The Manager:
- Assesses which tasks are ready (dependencies satisfied)
- Constructs a Task Prompt with all required context
- Writes it to a Send Bus file in `.apm/bus/<agent-slug>/`
- Provides you with the file path to carry to the Worker

### Initialize Worker Agent

1. Open a new chat session for the assigned Worker
2. Name it appropriately using the Agent name from the Implementation Plan (e.g., "Frontend Agent")
3. Select a model as recommended in Prerequisites
4. Enter the initialization command:

```
/apm-3-initiate-worker
```

The Worker will confirm initialization and await input.

### Deliver Task Assignment

Reference the Send Bus file in the Worker's session. Most platforms support direct file attachment or path reference. The Worker will:
- Read the Task Prompt
- Register with the specified Agent identity
- Confirm task requirements
- Begin execution

### Worker Executes Task

The Worker executes the task following these steps:

1. **Context Integration** - If the task depends on prior work, the Worker reads specified files and integrates context as instructed in the Task Prompt
2. **Execution** - Works through the task instructions step by step
3. **Validation** - Validates results per the specified criteria (programmatic tests, artifact checks, user review)
4. **Iteration** - If validation fails, attempts tocorrect and re-validates until success or a stop condition
5. **Logging** - Creates a Task Memory Log at the specified path documenting the outcome
6. **Reporting** - Writes a Task Report to the Report Bus file

The Worker provides the Report Bus file path for you to carry back to the Manager.

> **Tips for Task Execution:**
> - Workers pause for user validation when specified in the Task Prompt; when prompted, review the work and provide feedback
> - The Workers iterate on agentic loops trying to autonomously correct themselfs, however you are free to interrupt or steer the conversation as needed

### Manager Reviews and Decides

Once the Worker finishes, reference the Report Bus file in the Manager's session. The Manager will:
- Read the Task Report and Task Memory Log of the Worker
- Make a Coordination Decision:
  - **Proceed** - Task successful, assess readiness and move to next task(s)
  - **FollowUp** - Issue refined Task Prompt to the same Worker to retry with different approach
  - **Artifact Modification** - Update Coordination Artifacts if findings warrant it, then proceed or issue FollowUp as needed
- Update the Memory System to track progress

This completes one Coordination Cycle for this task. The pattern repeats for each task until all stages complete.

> **Tips for Task Dispatch** For efficiency, the Manager may dispatch multiple tasks, each with their own Coordination Cycle:
> - **Batch Dispatch** - When multiple sequential tasks are assigned to the same Worker with no external dependencies between them, the Manager can send them as a batch in a single Send Bus message. The Worker executes them sequentially, logging each task individually, and returns a consolidated Batch Report.
> - **Parallel Dispatch** - When multiple tasks across different Workers have no cross-Worker dependencies among them, the Manager can dispatch them simultaneously. You'll manage multiple Worker sessions concurrently, carrying Send Bus files to each Worker and Report Bus files back to the Manager as they complete in any order. The Manager initializes version control (feature branches and worktrees) for workspace isolation during parallel work.

---

## Step 5: Establish Your Workflow

Understanding how Coordination Cycles repeat and scale across your project.

### The Coordination Cycle Pattern

Each task executes through its own Coordination Cycle, which follows this flow:

1. **Manager assigns task** - Creates Task Prompt, writes to Send Bus
2. **User carries message** - References Send Bus file in Worker session
3. **Worker executes** - Completes work, validates, iterates on failure, logs to memory, writes to Report Bus
4. **User carries message** - References Report Bus file in Manager session
5. **Manager reviews** - Reads logs, makes coordination decision, updates Memory System

This pattern repeats for each task until all tasks in all stages complete. When the Manager dispatches multiple tasks (batch or parallel), each task has its own Coordination Cycle - they may run sequentially or concurrently, but the per-task cycle structure remains the same.

### FollowUp Tasks

When a Coordination Decision determines retry is needed, the Manager creates a FollowUp Task Prompt with different content than the original attempt:
- Refined objective and instructions based on what went wrong
- Updated output expectations and validation criteria
- FollowUp Context section explaining the issue and required changes
- Same Memory Log path (Worker overwrites the previous log)

FollowUps enter the Coordination Cycle like any task assignment.

### Artifact Modifications

When execution reveals issues with Coordination Artifacts, the Manager may modify them:
- **Specifications** - Design decisions proved incorrect or new constraints emerged
- **Implementation Plan** - Task definitions need adjustment, dependencies changed, new tasks required
- **Standards** - Universal patterns need updating or conflicts with execution discovered

The Manager assesses cascade implications and determines whether modifications require User collaboration (significant changes) or fall within Manager authority (bounded corrections). After modifications, the Manager reassesses task readiness and continues coordination.

### Batch Dispatch

When the Manager identifies batch candidates (sequential same-Worker tasks with only internal dependencies):
- Writes all Task Prompts to a single Send Bus message with batch envelope
- Worker parses the batch and executes tasks sequentially
- Worker creates individual Task Memory Logs immediately after each task
- If any task results in Blocked or Failed status, Worker stops (fail-fast) and reports partial completion
- Worker returns a consolidated Batch Report covering all completed tasks

Soft guidance: 3-4 tasks per batch. The Manager balances efficiency gains against granular progress tracking.

### Parallel Dispatch

During parallel dispatch:
- Manager tracks which Workers have active tasks and which Reports are pending
- User manages multiple Worker sessions simultaneously
- As Reports arrive, Manager processes each, merges completed branches, reassesses readiness, dispatches newly Ready tasks
- When no Ready tasks exist but Workers are still active, Manager communicates wait state

At Stage end, Manager performs merge sweep to ensure all feature branches are integrated before advancing to next Stage.

---

## When Agents Reach Context Limits

When an Agent's context window approaches limits, perform a Handoff to transfer context to a fresh instance.

### When to Handoff

- Look for signs: repeated questions, forgetting constraints, degraded responses
- Handoff proactively at 70-80% capacity to reduce hallucination risk

### Handoff Process

1. **Trigger Handoff** - When context pressure appears, use the appropriate command:
   - `/apm-5-handoff-manager` for Manager Agent
   - `/apm-6-handoff-worker` for Worker Agent

2. **Outgoing Agent Actions** - The Agent creates:
   - Handoff Memory Log capturing working knowledge not in formal logs (tracked Worker handoffs and VC state for Manager; working context and technical notes for Worker)
   - Handoff Prompt with context reconstruction instructions
   - Writes Handoff Prompt to Handoff Bus file

3. **Create New Session** - Open a new session for the same Agent role (e.g., "Manager Agent 2" or "Frontend Agent 2")

4. **Initialize Incoming Agent** - Enter the same initialization command (`/apm-2-initiate-manager` or `/apm-3-initiate-worker`), then reference the Handoff Bus file

5. **Verify and Resume** - The Incoming Agent reconstructs context from:
   - Coordination Artifacts
   - Handoff Memory Log
   - Relevant Task Memory Logs (current-Stage for Workers, Stage Summaries and recent logs for Manager)

---

**Congratulations!** You've launched your first APM session. The structured multi-agent approach provides consistent project execution and prevents the chaos typical of single-session AI collaboration.

**Next Steps:**

- [Token Consumption Tips](Token_Consumption_Tips.md) - Optimize model usage and costs
- [Context and Memory Management](Context_and_Memory_Management.md) - Deep dive into APM's memory architecture
- [Modifying APM](Modifying_APM.md) - Customize APM for your specific needs
