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

### 1. Create Planner Agent Session

1. Open a new chat session in your AI assistant (Agent mode if available)
2. Name it clearly: "Planner Agent" or "APM Planner"
3. Select a top-tier model as recommended in Prerequisites

### 2. Run Initialization Command

Enter the command:

```
/apm-1-initiate-planner
```

The Planner will greet you and outline its two-step process:
1. Context Gathering - Structured project discovery through question rounds
2. Work Breakdown - Decomposition into Coordination Artifacts

---

## Step 2: Work Through the Planning Phase

The Planner guides you through Context Gathering and Work Breakdown to create the Coordination Artifacts.

### 1. Context Gathering

The Planner asks questions across three rounds to understand your project:
- **Round 1:** Project vision, existing materials, and goals
- **Round 2:** Technical requirements and validation criteria
- **Round 3:** Implementation approach and quality standards

After each round, the Planner iterates on gaps before advancing. After all rounds, it presents an Understanding Summary for your approval.

> **Tips:**
> - Share all relevant constraints and uncertainties upfront
> - Provide existing documentation early to improve subsequent questions
> - Be specific about validation criteria - how will you know each requirement is met?

### 2. Work Breakdown

The Planner creates three Coordination Artifacts:

- **Specifications** - Design decisions and constraints defining what is being built
- **Implementation Plan** - Stages, Tasks, Worker assignments, and Dependency Graph defining how work is organized
- **Standards** - Universal execution patterns defining how work is performed

You'll review and approve each artifact before the Planner proceeds to the next. After all three approvals, the Planning Phase completes.

> For detailed mechanics of Context Gathering and Work Breakdown, see [Workflow Overview](Workflow_Overview.md).

---

## Step 3: Initiate Manager Agent

The Manager Agent coordinates execution of the Implementation Plan.

### 1. Create Manager Agent Session

1. Open a new chat session in Agent mode
2. Name it clearly: "Manager Agent" or "APM Manager 1"
3. Select a model as recommended in Prerequisites

### 2. Run Initialization Command

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

This step walks through your first Coordination Cycle as an example of the repeating pattern.

### 1. Manager Assigns Task

The Manager assesses which tasks are ready and creates a Task Prompt with all required context. It writes this to the Worker's Task Bus file and provides you with the file path.

### 2. Initialize Worker Agent

1. Open a new chat session for the assigned Worker
2. Name it using the Agent name from the Implementation Plan (e.g., "Frontend Agent")
3. Select a model as recommended in Prerequisites
4. Run the initialization command:

```
/apm-3-initiate-worker
```

### 3. Deliver Task Assignment

Run `/apm-4-check-tasks` in the Worker's session. The Worker reads the Task Prompt from its Task Bus, registers its identity, and begins execution.

### 4. Worker Executes

The Worker works through the task, validates results, and creates a Task Memory Log documenting the outcome. It then writes a Task Report to the Report Bus and directs you to run `/apm-5-check-reports` in the Manager's session.

> **Tips:**
> - Workers pause for your review when User validation is specified
> - You can interrupt or steer the conversation as needed during execution

### 5. Carry Report to Manager

Run `/apm-5-check-reports` in the Manager's session. The Manager reads the Task Report and Task Memory Log, then makes a Coordination Decision:
- **Proceed** - Move to next task
- **FollowUp** - Send refined Task Prompt to retry
- **Artifact Modification** - Update Coordination Artifacts, then proceed or follow up

The Manager updates the Memory System to track progress. This completes one Coordination Cycle.

> For detailed mechanics of Task Assignment, Task Cycle, and Task Review, see [Workflow Overview](Workflow_Overview.md).

---

## Step 5: Establish Your Workflow

The Coordination Cycle from Step 4 repeats for each task. As you work through the project, you'll encounter variations:

### FollowUp Tasks

When a task needs retry, the Manager creates a FollowUp Task Prompt with refined instructions based on what went wrong. The Worker uses the same Memory Log path and overwrites the previous attempt.

### Artifact Modifications

When execution reveals issues, the Manager may update Coordination Artifacts:
- **Specifications** - Design decisions need adjustment
- **Implementation Plan** - Task definitions or dependencies changed
- **Standards** - Universal patterns need updating

The Manager determines whether modifications require your collaboration or fall within its authority.

### Batch and Parallel Dispatch

For efficiency, the Manager may dispatch multiple tasks:

**Batch Dispatch** - Sequential tasks to the same Worker in a single message. The Worker executes each task, logs immediately, and stops if any task fails. Returns a consolidated Batch Report.

**Parallel Dispatch** - Tasks to multiple Workers simultaneously when no cross-Worker dependencies exist. You manage multiple Worker sessions, carrying messages as each completes in any order. The Manager initializes version control using git worktrees for workspace isolation.

---

## When Agents Reach Context Limits

When an Agent's context window approaches limits, perform a Handoff to transfer context to a fresh instance.

### When to Handoff

- Look for signs: repeated questions, forgetting constraints, degraded responses
- Handoff proactively at 70-80% capacity to reduce hallucination risk

### Handoff Process

1. **Trigger Handoff** - When context pressure appears, use the appropriate command:
   - `/apm-6-handoff-manager` for Manager Agent
   - `/apm-7-handoff-worker` for Worker Agent

2. **Outgoing Agent Actions** - The Agent creates:
   - Handoff Memory Log capturing working knowledge not in formal logs (tracked Worker handoffs and VC state for Manager; working context and technical notes for Worker)
   - Handoff Prompt with context reconstruction instructions
   - Writes Handoff Prompt to Handoff Bus file

3. **Create New Session** - Open a new session for the same Agent role (e.g., "Manager Agent 2" or "Frontend Agent 2")

4. **Initialize Incoming Agent** - Enter the same initialization command (`/apm-2-initiate-manager` or `/apm-3-initiate-worker`) — the Incoming Agent auto-detects the Handoff Prompt from the Handoff Bus

5. **Verify and Resume** - The Incoming Agent reconstructs context from:
   - Coordination Artifacts
   - Handoff Memory Log
   - Relevant Task Memory Logs (current-Stage for Workers, Stage Summaries and recent logs for Manager)

---

**Congratulations!** You've launched your first APM session. The structured multi-agent approach provides consistent project execution and prevents the chaos typical of single-session AI collaboration.

**Next Steps:**

- [Token Consumption Tips](Token_Consumption_Tips.md) - Optimize model usage and costs
- [Agent Orchestration](Agent_Orchestration.md) - Understand Agent communication and memory architecture
- [Modifying APM](Modifying_APM.md) - Customize APM for your specific needs
