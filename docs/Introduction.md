---
id: introduction
slug: /introduction
sidebar_label: Introduction
sidebar_position: 3
---

# Agentic Project Management (APM)

**A structured approach to building complex projects with AI Agents**

APM is an open-source framework that helps you manage ambitious software projects using AI assistants like Claude, Cursor, GitHub Copilot and more. Instead of working in a single, increasingly chaotic chat, APM structures your work into a coordinated system where different AI Agents handle planning, coordination, and execution as a team.

## The Problem: Context Decay

Building complex projects with AI assistants presents a fundamental challenge: **context window limits**.

As conversations extend, context degrades. The AI loses track of original requirements, produces contradictory suggestions, and hallucinates details. Earlier parts of the conversation get compressed or discarded to make room for new messages. For substantial projects, this context decay makes sustained progress difficult.

## The Solution: Structured Multi-Agent Coordination

APM addresses context limitations by treating the AI not as a single continuous assistant, but as a team of specialized AI Agents, each focused on a specific role with intentionally scoped context. The workload distribution of the framework aims for:

- **Specialization:** Different Agents handle planning, coordination, and implementation. Each operates in its own context with only the information needed for its specific role.

- **Persistence:** Project state lives in structured documents outside Agent contexts. Planning documents define all work. Memory tracks the project's progression. A file-based bus system enables communication between Agents.

- **Continuity:** When an Agent's context window fills, a Handoff Protocol transfers working knowledge to a fresh instance, which reconstructs context using the project's documents and continues seamlessly. Completed sessions can be archived and preserved for future reference, enabling new sessions to build on prior work.

This architecture mirrors how human teams collaborate: specialized roles, shared documentation, and explicit communication protocols ensure consistent progress regardless of individual capacity limits.

---

## Agent Types

APM coordinates three specialized Agent types that are all capable of using platform-native subagents:

- **Planner** - Operates once at project start. Conducts structured project discovery to gather requirements and constraints, then decomposes the gathered context into three planning documents: Spec, Plan, and Rules. Initializes the bus system for the Implementation Phase. Acts as the project architect - designs the structure that guides all subsequent work.

- **Manager** - Receives the populated planning documents from the Planner and coordinates overall project execution. Assigns tasks to Workers, reviews completed work, manages task dependencies, and maintains the big picture.

- **Workers** - Execute specific tasks within defined domains. Each Worker is assigned a specialized area (frontend, backend, API development, etc.) and receives focused task assignments. Workers operate with tightly scoped context - they see their current task and accumulated working context from previous tasks, but not the full project scope.

- **Subagents** - Temporary instances spawned for isolated work such as debugging or research. Solve a specific problem and close, preventing context pollution in the main Agent contexts. Modern AI platforms provide native subagent support that APM leverages.

> For detailed description on the three APM agent types, see [Agent Types](Agent_Types.md).

---

## Project Memory and Coordination

APM maintains project state through structured documents and protocols:

- **Planning Documents** - Design and coordination documents that guide all work
  - **Spec** - Defines what is being built (design decisions and constraints)
  - **Plan** - Defines how work is organized (Stages, Tasks, dependencies)
  - **Rules** - Define how work is performed (universal execution patterns, maintained in the platform's agents file)

- **Memory** - A hierarchical structure containing the Tracker (live project state with task tracking, agent tracking, and working notes), the Index (durable project memory with stage summaries), and Task Logs for each completed Task. Workers document their work in Task Logs. The Manager reads them to track progress without reviewing code directly, maintaining coordination-level focus.

- **Bus System** - A file-based communication mechanism for passing messages between Agent chats. The Manager writes Task Prompts to Task Bus files; Workers write Task Reports to Report Bus files. The User triggers bus checks using commands (`/apm-4-check-tasks`, `/apm-5-check-reports`), keeping APM platform agnostic while making communication explicit and auditable.
- **Handoff** - When an Agent's context window approaches limits, the User triggers a Handoff. The outgoing Agent creates a Handoff Log capturing working knowledge and writes a handoff prompt to the Handoff Bus with reconstruction instructions. The incoming Agent reads these artifacts and relevant Task Logs to reconstruct context and continue work seamlessly.

---

## Workflow Phases

APM operates in two distinct phases:

- **Planning Phase** - The Planner conducts structured discovery through question rounds, gathering comprehensive project context. It then performs Work Breakdown, decomposing requirements into a concrete Plan with defined Stages, Tasks, Worker assignments, and dependencies.

- **Implementation Phase** - The Manager and Workers execute the Plan through repeating assignment-execution-review cycles:

  1. **Task Assignment** - Manager assesses task readiness, constructs task prompts with required context, delivers via Task Bus
  2. **Task Execution** - Worker receives task assignment via trigger command, executes work, validates results, logs outcomes
  3. **Task Review** - Manager reviews completion logs via trigger command, determines review outcome

  The cycle repeats until all tasks complete. The Manager can dispatch multiple tasks in parallel when dependencies allow, or send batches of sequential tasks to the same Worker for efficiency.

- **Session Continuation** - After a session completes, it can be archived and a fresh session started in its place. Archived sessions are preserved in `.apm/archives/` and accessible to future Planners during Context Gathering, enabling iterative development across multiple sessions.

---

## Installation & Usage

APM is installed via the [`agentic-pm`](https://www.npmjs.com/package/Agentic-pm) CLI, which scaffolds the necessary commands, guides and skills into your project workspace.

To get started with installation and your first session, see [Getting Started](Getting_Started.md).

---

## Contributing

APM is open source and welcomes contributions. You can report bugs or request features via [GitHub Issues](https://github.com/sdi2200262/Agentic-project-management/issues), submit improvements via Pull Requests.

For contribution guidelines, see [CONTRIBUTING.md](https://github.com/sdi2200262/Agentic-project-management/blob/main/CONTRIBUTING.md).
