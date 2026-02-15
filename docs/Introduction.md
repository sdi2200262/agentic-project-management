---
id: introduction
slug: /introduction
sidebar_label: Introduction
sidebar_position: 3
---

# Agentic Project Management (APM)

**A structured approach to building complex projects with AI Agents**

APM is an open-source framework that helps you manage ambitious software projects using AI assistants like Claude, Cursor, GitHub Copilot and more. Instead of working in a single, increasingly chaotic chat session, APM structures your work into a coordinated system where different AI Agents handle planning, coordination, and execution as a team.

## The Problem: Context Decay

Building complex projects with AI assistants presents a fundamental challenge: **context window limits**.

As conversations extend, context degrades. The AI loses track of original requirements, produces contradictory suggestions, and hallucinates details. Earlier parts of the conversation get compressed or discarded to make room for new messages. For substantial projects, this context decay makes sustained progress difficult.

## The Solution: Structured Multi-Agent Coordination

APM addresses context limitations by treating the AI not as a single continuous assistant, but as a team of specialized AI Agents, each focused on a specific role with intentionally scoped context. The workload distribution of the framework aims for:

- **Specialization:** Different Agents handle planning, coordination, and implementation. Each operates in its own session with only the context needed for its specific role.

- **Persistence:** Project state lives in structured documents outside Agent sessions. Coordination Artifacts define all work. A Memory System tracks the project's progression. A file-based Message Bus enables communication between Agents.

- **Continuity:** When an Agent's context window fills, a Handoff Protocol transfers working knowledge to a fresh instance, which reconstructs context using the project's documents and continues seamlessly.

This architecture mirrors how human teams collaborate: specialized roles, shared documentation, and explicit communication protocols ensure consistent progress regardless of individual capacity limits.

---

## Agent Types

APM coordinates three specialized Agent types that are all capable of using platform-native subagents:

- **Planner Agent** - Operates once at project start. Conducts structured project discovery to gather requirements and constraints, then decomposes the gathered context into detailed three Coordination Artifacts: Specifications, Implementation Plan, Standards. Acts as the project architect - designs the structure that guides all subsequent work.

- **Manager Agent** - Received the populated Coordination Artifacts from the Planner and coordinates overall the project execution. Assigns tasks to Workers, reviews completed work, manages task dependencies, and maintains the big picture.

- **Worker Agents** - Execute specific tasks within defined domains. Each Worker is assigned a specialized area (frontend, backend, API development, etc.) and receives focused task assignments. Workers operate with tightly scopedd context - they see their current task and accumulated working context from previous tasks, but not the full project scope.

- **SubAgents** - Temporary instances spawned for isolated work such as debugging or research. Solve a specific problem and close, preventing context pollution in the main Agent sessions. Modern AI platforms provide native subagent support that APM leverages.

> For detailed descripion on the three APM Agents, see [Agent Types](Agent_Types.md).

---

## Project Memory and Coordination

APM maintains project state through structured documents and protocols:

- **Coordination Artifacts** - Design and coordination documents that guide all work
  - **Specifications** - Define what is being built (design decisions and constraints)
  - **Implementation Plan** - Define how work is organized (stages, tasks, dependencies)
  - **Standards** - Define how work is performed (universal execution patterns)

- **Memory System** - A hierarchical folder structure containing Memory Logs for each completed task. Workers document their work in these logs. The Manager reads them to track progress without reviewing code directly, maintaining coordination-level focus.

- **Message Bus** - A file-based communication system for passing messages between Agent sessions. The Manager writes task assignments to Send Bus files; Workers write completion reports to Report Bus files. The User carries these files between sessions, keeping APM platform agnostic while also making communication explicit and auditable.
- **Handoff Protocol** - When an Agent's context window approaches limits, the User triggers a Handoff. The outgoing Agent creates a Handoff File capturing working knowledge. The replacement Agent reads this file and required Memory Logs to reconstruct context and continue work seamlessly.

---

## Workflow Phases

APM operates in two distinct phases:

- **Planning Phase** - The Planner Agent conducts structured discovery through question rounds, gathering comprehensive project context. It then performs Work Breakdown, decomposing requirements into a concrete Implementation Plan with defined stages, tasks, worker assignments, and dependencies.

- **Implementation Phase** - The Manager and Worker Agents execute the Implementation Plan through repeating Coordination Cycles:

  1. **Task Assignment** - Manager assesses task readiness, constructs task prompts with required context, delivers via Message Bus
  2. **Task Execution** - Worker receives task assignment, executes work, validates results, logs outcomes
  3. **Task Review** - Manager reviews completion logs, makes coordination decisions

  The cycle repeats until all tasks complete. The Manager can dispatch multiple tasks in parallel when dependencies allow, or send batches of sequential tasks to the same Worker for efficiency.

---

## Installation & Usage

APM is installed via the [`agentic-pm`](https://www.npmjs.com/package/Agentic-pm) CLI, which scaffolds the necessary commands, guides and skills into your project workspace.

To get started with installation and your first session, see [Getting Started](Getting_Started.md).

---

## Contributing

APM is open source and welcomes contributions. You can report bugs or request features via [GitHub Issues](https://github.com/sdi2200262/Agentic-project-management/issues), submit improvements via Pull Requests.

For contribution guidelines, see [CONTRIBUTING.md](https://github.com/sdi2200262/Agentic-project-management/blob/main/CONTRIBUTING.md).
