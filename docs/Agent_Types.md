---
id: agent-types
slug: /agent-types
sidebar_label: Agent Types
sidebar_position: 4
---

# Agent Types

APM coordinates three specialized Agent types that work together to execute your project. Each Agent has a distinct role with carefully scoped context designed for its responsibilities. All Agents can spawn platform-native subagents for isolated work like debugging or research.

The framework achieves specialization through context scoping rather than prompt engineering. Each Agent sees only the information relevant to its role, preventing context pollution and enabling focused execution.

---

## Context Scoping

APM provides each Agent with different views of the project:

- **Planner** - Sees project requirements, constraints, and the complete vision. Operates with full context during Planning Phase to create planning documents. Interacts only with these initial documents and does not participate in the project's execution.

- **Manager** - Sees planning documents (Spec, Plan, Rules), Task Logs, the Tracker, and the Index. Maintains coordination-level perspective without implementation details, while overseeing the project's execution.

- **Workers** - See their Task Prompts, accumulated working context from prior tasks, and the Rules. No visibility into full project scope or other agents' work unless explicitly provided. Actively participate in the project's execution.

- **Subagents** - Platform-native temporary agents that see only the specific context provided for their isolated task (debugging, research). Execute autonomously and return findings.

---

## Quick Agent Comparison

| Agent Type | Role | Context Scope | Instances | Active Phase |
| :--- | :--- | :--- | :--- | :--- |
| **Planner** | Architect | Full project vision and requirements | 1 | Planning Phase |
| **Manager** | Coordinator | Planning documents and Memory | Multiple (via Handoff) | Implementation Phase |
| **Worker** | Developer | Task Prompt and working context | Multiple (via Handoff) | Implementation Phase |
| **Subagent** | Specialist | Isolated context for specific problem | Temporary | As spawned |

---

## Planner

The Planner operates once at project start to transform User requirements into planning documents. It conducts structured discovery and decomposes gathered context into the documents that guide all subsequent work.

**Operational Context:** Fresh instance with no prior project history. Has access to User-provided requirements, existing documentation, and codebase if applicable.

**Core Responsibilities:**

- **Context Gathering** - Conducts structured discovery through three Question Rounds focused on project vision, technical requirements, and implementation approach. When archived sessions exist (`.apm/archives/`), detects them and asks about their relevance before starting question rounds, using the `apm-archive-explorer` custom subagent to efficiently extract context from indicated archives. Produces an Understanding Summary for User review and approval.

- **Work Breakdown** - Decomposes gathered context into three planning documents:
  - **Spec** - Project-specific design decisions and constraints defining what is being built
  - **Plan** - Stage and Task breakdown with agent assignments, validation criteria, and Dependency Graph defining how work is organized
  - **Rules** - Universal execution patterns defining how work is performed (written as the APM standards block in the platform's agents file)

  Reviews each planning document with the User for approval before proceeding. Iterates based on feedback until all three are finalized. Initializes the bus system for all agents defined in the Plan.

The Planner's work establishes the foundation for the entire Implementation Phase. Thoroughness during Planning Phase prevents ambiguity and blockers during execution.

---

## Manager

The Manager coordinates execution of the Plan. It operates throughout the project, assigning tasks to Workers, reviewing completed work, making review outcome decisions, and maintaining project state.

**Operational Context:** Sees all planning documents, the Tracker, the Index, and the bus system. Maintains coordination-level perspective without diving into code, unless explicitly required or requested.

**Core Responsibilities:**

- **Task Assignment** - Assesses task readiness based on dependency completion and the current Tracker. Constructs Task Prompts with objective, instructions, validation criteria, and context extracted from the Spec when needed. Determines dispatch mode (single, batch, or parallel) and delivers Task Prompts via Task Bus.

- **Task Review** - Reads Task Reports from Report Bus and Task Logs from Workers. Determines review outcome: proceed to next task, issue a follow-up (retry with refined instructions), or modify planning documents then proceed or follow up.

- **Planning Document Maintenance** - Updates the Spec, Plan, or Rules when execution reveals issues with initial design decisions, task definitions, dependencies, or universal patterns. Assesses cascade implications and determines whether modifications require User collaboration.

- **Memory Maintenance** - Updates the Tracker after each Task Review to track task statuses (Ready, Active, Done, Waiting), agent assignments, active branches, and merge state. Appends stage summaries to the Index after Stage completion. Maintains working notes in the Tracker for ephemeral coordination context.

- **Version Control Coordination** - Initializes and manages feature branches and worktrees for parallel task execution. Performs merge sweeps at Stage boundaries to ensure all work is integrated before advancing.

- **Completion Recommendation** - After all Stages complete, recommends running `/apm-8-summarize-session` in a new chat to summarize and optionally archive the completed APM session for future reference.

The Manager operates through multiple instances via Handoff when context limits approach. Each instance continues from where the previous left off using Handoff Logs and the Tracker and Index.

---

## Workers

Workers execute Tasks assigned by the Manager. Each Worker is defined in the Plan with a specific domain (frontend, backend, API, infrastructure, etc.). Multiple Workers operate in parallel when dependencies allow.

**Operational Context:** Sees the current Task Prompt (including extracted Spec context, instructions, validation criteria), accumulated working context from prior tasks executed, and the Rules. No visibility into full project scope, other agents' work, or planning documents unless explicitly provided in Task Prompt.

**Core Responsibilities:**

- **Task Execution** - Receives Task Prompt via Task Bus. If cross-agent dependencies exist, reads specified files to integrate context from prior tasks of other Workers. Executes instructions step by step, validates results per specified criteria (programmatic tests, artifact checks, User review), iterates on failure until success or stop condition.

- **Task Logging** - Creates Task Log at specified path documenting outcome, validation results, deliverables, technical decisions, and flags for Manager review. This serves as context abstraction layer between Manager's coordination view and Worker's execution details.

- **Task Reporting** - Writes Task Report to Report Bus summarizing completion status, execution notes, and key findings for Manager review.

- **Rules Updates** - Updates Rules when discovering universal patterns or conflicts during execution. Changes apply across all agents.

- **Subagent Spawning** - Spawns platform-native subagents (Debug Subagent, Research Subagent etc) for isolated context-heavy work that would pollute the main context. Waits for subagent findings or works in parallel and integrates results to continue task execution.
Workers operate through multiple instances via Handoff when context limits approach. After Handoff, previous-Stage same-agent dependencies are treated as cross-agent dependencies requiring explicit file reading.

---

## Subagents

Subagents are platform-native temporary agents spawned for isolated, focused work. APM defines behavioral expectations - the platform handles lifecycle and tool access. Subagents execute autonomously and return findings to the spawning Agent.

**Operational Context:** Sees only the specific context provided for their isolated task. No access to broader project state unless explicitly given. Executes in isolated scope that closes after completion.

**Common Types and Responsibilities:**

- **Debug Subagent** - Isolates and resolves complex bugs. Expected access: full (edit, terminal). Spawned when debugging would require extensive work (reading many library files, analyzing complex error logs) that would pollute the Worker's context. Returns findings with solution or diagnostic results.

- **Research Subagent** - Investigates knowledge gaps using current sources. Expected access: read-only, web. Spawned when research requires reading extensive documentation, exploring unfamiliar libraries, or gathering information from external sources. Returns findings with recommendations or answers.

APM also ships custom agent configurations (e.g., `apm-archive-explorer` for archive exploration) that platforms load as predefined subagents. These are installed in the platform's agents directory alongside commands and skills.

Subagents prevent context pollution in long-running Agents by handling context-intensive work in disposable instances. Workers and Managers can spawn subagents when execution requires isolated investigation.

---

**Next Steps:**

- Understand the Planning Phase and Implementation Phase in [Workflow Overview](Workflow_Overview.md)
- Learn about model selection for each Agent type in [Token Consumption Tips](Token_Consumption_Tips.md)
- Explore Agent communication and memory in [Agent Orchestration](Agent_Orchestration.md)
