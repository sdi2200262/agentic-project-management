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
| **Manager Agent** | Claude Sonnet 4/4.5, Claude Opus 4.5/4.6, Gemini 3 Pro | Claude Haiku 4.5, Cursor Auto | Model switching mid-chat not recommended though less critical than for Planner. |
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
  - `.apm/spec.md` - Spec template (populated by Planner)
  - `.apm/plan.md` - Plan template (populated by Planner)
  - `.apm/tracker.md` - Project state tracker (populated by Manager)
  - `.apm/memory/index.md` - Project memory index (populated by Manager)
  - `.apm/metadata.json` - Installation metadata
- **Install Procedural Files** - Create required commands, guides, skills, and agents in platform-specific directories (`.cursor/`, `.github/`, `.claude/`, etc.):
  - `.cursor/commands/` - Agent initiation, handoff, and utility commands
  - `.cursor/apm-guides/` - Procedure guides for Agents
  - `.cursor/skills/` - Shared procedural skills
  - `.cursor/agents/` - Custom subagent configurations

After initialization completes, you're ready to begin.

---

## Step 1: Initiate Planner

The Planning Phase creates the planning documents that guide all subsequent work.

### 1. Create Planner Chat

1. Open a new chat in your AI assistant (Agent mode if available)
2. Name it clearly: "Planner" or "APM Planner"
3. Select a top-tier model as recommended in Prerequisites

### 2. Run Initialization Command

Enter the command:

```markdown
/apm-1-initiate-planner
```

The Planner will greet you and outline its two-step process:

1. Context Gathering - Structured project discovery through question rounds
2. Work Breakdown - Decomposition into planning documents

---

## Step 2: Work Through the Planning Phase

The Planner guides you through Context Gathering and Work Breakdown to create the planning documents.

### 1. Context Gathering

The Planner asks questions across three rounds to understand your project:

- **Round 1:** Project vision, existing materials, and goals
- **Round 2:** Technical requirements and validation criteria
- **Round 3:** Implementation approach and quality standards

After each round, the Planner iterates on gaps before advancing. After all rounds, it presents an Understanding Summary for your approval.

> **Tips:**
>
> - Share all relevant constraints and uncertainties upfront
>
> - Provide existing documentation early to improve subsequent questions
> - Be specific about validation criteria - how will you know each requirement is met?

### 2. Work Breakdown

The Planner creates three planning documents:

- **Spec** - Design decisions and constraints defining what is being built
- **Plan** - Stages, Tasks, Worker assignments, and Dependency Graph defining how work is organized
- **Rules** - Universal execution patterns defining how work is performed (written as the APM standards block in the platform's agents file)

You'll review and approve each document before the Planner proceeds to the next. After all three approvals, the Planner initializes the bus system and the Planning Phase completes.

> For detailed mechanics of Context Gathering and Work Breakdown, see [Workflow Overview](Workflow_Overview.md).

---

## Step 3: Initiate Manager

The Manager coordinates execution of the Plan.

### 1. Create Manager Chat

1. Open a new chat in Agent mode
2. Name it clearly: "Manager" or "APM Manager 1"
3. Select a model as recommended in Prerequisites

### 2. Run Initialization Command

Enter the command:

```markdown
/apm-2-initiate-manager
```

The Manager will:

- Read the planning documents (Spec, Plan, Rules)
- Populate the Tracker and initialize the Index
- Initialize version control if a git repository exists
- Present an understanding summary

Review the Manager's summary carefully. If it accurately reflects your project authorize it to proceed, otherwise make corrections as needed. The Manager will then prepare the first assignment-execution-review cycle.

---

## Step 4: Work Through the Implementation Phase

This step walks through your first assignment-execution-review cycle as an example of the repeating pattern.

### 1. Manager Assigns Task

The Manager assesses which tasks are ready and creates a Task Prompt with all required context. It writes this to the Worker's Task Bus file and provides you with the file path.

### 2. Initialize Worker

1. Open a new chat for the assigned Worker
2. Name it using the Agent name from the Plan (e.g., "Frontend Agent")
3. Select a model as recommended in Prerequisites
4. Run the initialization command:

```markdown
/apm-3-initiate-worker
```

### 3. Deliver Task Assignment

Run `/apm-4-check-tasks` in the Worker's chat. The Worker reads the Task Prompt from its Task Bus, registers its identity, and begins execution.

### 4. Worker Executes

The Worker works through the task, validates results, and creates a Task Log documenting the outcome. It then writes a Task Report to the Report Bus and directs you to run `/apm-5-check-reports` in the Manager's chat.

> **Tips:**
>
> - Workers pause for your review when User validation is specified
> - You can interrupt or steer the conversation as needed during execution

### 5. Carry Report to Manager

Run `/apm-5-check-reports` in the Manager's chat. The Manager reads the Task Report and Task Log, then determines the review outcome:

- **Proceed** - Move to next task
- **Follow-up** - Send refined Task Prompt to retry
- **Document Modification** - Update planning documents, then proceed or follow up

The Manager updates the Tracker to track progress. This completes one assignment-execution-review cycle.

> For detailed mechanics of Task Assignment, Task Execution, and Task Review, see [Workflow Overview](Workflow_Overview.md).

---

## Step 5: Establish Your Workflow

The cycle from Step 4 repeats for each task. As you work through the project, you'll encounter variations:

### Follow-up Tasks

When a task needs retry, the Manager creates a follow-up Task Prompt with refined instructions based on what went wrong. The Worker uses the same Task Log path and overwrites the previous attempt.

### Document Modifications

When execution reveals issues, the Manager may update planning documents:

- **Spec** - Design decisions need adjustment
- **Plan** - Task definitions or dependencies changed
- **Rules** - Universal patterns need updating

The Manager determines whether modifications require your collaboration or fall within its authority.

### Batch and Parallel Dispatch

For efficiency, the Manager may dispatch multiple tasks:

**Batch Dispatch** - Sequential tasks to the same Worker in a single message. The Worker executes each task, logs immediately, and stops if any task fails. Returns a consolidated Batch Report.

**Parallel Dispatch** - Tasks to multiple Workers simultaneously when no cross-Worker dependencies exist. You manage multiple Workers, carrying messages as each completes in any order. The Manager initializes version control using git worktrees for workspace isolation.

---

## When Agents Reach Context Limits

When an Agent's context window approaches limits, perform a Handoff to transfer context to a fresh instance.

### When to Handoff

- Look for signs: repeated questions, forgetting constraints, degraded responses
- Handoff proactively at 70-80% capacity to reduce hallucination risk

### Handoff Process

1. **Trigger Handoff** - When context pressure appears, use the appropriate command:
   - `/apm-6-handoff-manager` for Manager
   - `/apm-7-handoff-worker` for Worker

2. **Outgoing Agent Actions** - The Agent creates:
   - Handoff Log capturing working knowledge not in formal logs (tracked Worker handoffs and VC state for Manager; working context and technical notes for Worker)
   - Handoff prompt with context reconstruction instructions, written to Handoff Bus

3. **Create New Chat** - Open a new chat for the same agent role (e.g., "Manager 2" or "Frontend Agent 2")

4. **Initialize Incoming Agent** - Enter the same initialization command (`/apm-2-initiate-manager` or `/apm-3-initiate-worker`) — the incoming Agent auto-detects the handoff prompt from the Handoff Bus

5. **Verify and Resume** - The incoming Agent reconstructs context from:
   - Planning documents
   - Handoff Log
   - Relevant Task Logs (current-Stage for Workers; Tracker, Index, and recent logs for Manager)

### Recovery from Auto-Compaction

If the platform auto-compacts an Agent's context window (rather than you proactively triggering Handoff), use the recovery command to reconstruct working context:

```markdown
/apm-9-recover manager
/apm-9-recover frontend-agent
```

Recovery re-reads procedural guides and role-specific state artifacts to rebuild context. Unlike Handoff, recovery does not require creating a new instance — the Agent continues as the same instance with reconstructed context.

---

## After Project Completion

When the Manager completes all tasks and stages, it recommends running `/apm-8-summarize-session` in a new chat to summarize the completed APM session.

### Session Summary and Archival

1. **Open a new chat** and run `/apm-8-summarize-session`
2. The summarization agent reads all `.apm/` artifacts, produces a session summary, and presents it to you
3. You can then choose to **archive** the session — this moves the current `.apm/` artifacts to `.apm/archives/` and restores fresh templates for a new session

You can also archive directly via the CLI:

```bash
apm archive
```

If the new session continues from a previous one, use the `--continues` flag:

```bash
apm archive --continues session-2026-03-04-001
```

### Starting a New Session

After archival, `.apm/` contains fresh templates ready for a new APM session. Previous session archives remain accessible in `.apm/archives/`. When the new Planner runs Context Gathering, it detects existing archives and asks about their relevance — enabling iterative development where each session builds on prior work.

> For details on Session Continuation mechanics, see [Workflow Overview](Workflow_Overview.md).

---

**Congratulations!** You've launched your first APM session. The structured multi-agent approach provides consistent project execution and prevents the chaos typical of single-chat AI collaboration.

**Next Steps:**

- [Token Consumption Tips](Token_Consumption_Tips.md) - Optimize model usage and costs
- [Agent Orchestration](Agent_Orchestration.md) - Understand Agent communication and memory architecture
- [CLI Guide](CLI.md) - Session management, archival, and custom installations
- [Modifying APM](Modifying_APM.md) - Customize APM for your specific needs
