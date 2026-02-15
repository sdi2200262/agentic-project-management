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

- **Planner Agent** - Sees project requirements, constraints, and the complete vision. Operates with full context during Planning Phase to create Coordination Artifacts. Interacts only with these initial documents and does not participate in the project's execution.

- **Manager Agent** - Sees Coordination Artifacts (Specifications, Implementation Plan, Standards), Task Memory Logs, and Working Notes. Maintains coordination-level perspective without implementation details, while overseeing the project's execution.

- **Worker Agents** - See their Task Prompts, accumulated working context from prior tasks, and Standards document. No visibility into full project scope or other Agents' work unless explicitly provided. Actively participates in the project's execution.

- **Subagents** - Platform-native temporary agents that see only the specific context provided for their isolated task (debugging, research). Execute autonomously and return findings.

---

## Quick Agent Comparison

| Agent Type | Role | Context Scope | Sessions | Active Phase |
| :--- | :--- | :--- | :--- | :--- |
| **Planner** | Architect | Full project vision and requirements | 1 | Planning Phase |
| **Manager** | Coordinator | Coordination Artifacts and Memory System | Multiple (via Handoff) | Implementation Phase |
| **Worker** | Developer | Task Prompt and working context | Multiple (via Handoff) | Implementation Phase |
| **Subagent** | Specialist | Isolated context for specific problem | Temporary | As spawned |

---

## Planner Agent

The Planner operates once at project start to transform User requirements into Coordination Artifacts. It conducts structured discovery and decomposes gathered context into the documents that guide all subsequent work.

**Operational Context:** Fresh session with no prior project history. Has access to User-provided requirements, existing documentation, and codebase if applicable.

**Core Responsibilities:**

- **Context Gathering** - Conducts structured discovery through three Question Rounds focused on project vision, technical requirements, and implementation approach. Produces an Understanding Summary for User review and approval.

- **Work Breakdown** - Decomposes gathered context into three Coordination Artifacts:
  - **Specifications** - Project-specific design decisions and constraints defining what is being built
  - **Implementation Plan** - Stage and Task breakdown with Agent assignments, validation criteria and Dependency Graph defining how work is organized
  - **Standards** - Universal execution patterns defining how work is performed

  Reviews each Coordination Artifact with the User for approval before proceeding. Iterates based on feedback until all three artifacts are finalized.

The Planner's work establishes the foundation for the entire Implementation Phase. Thoroughness during Planning Phase prevents ambiguity and blockers during execution.

---

## Manager Agent

The Manager coordinates execution of the Implementation Plan. It operates throughout the project, assigning tasks to Workers, reviewing completed work, making coordination decisions, and maintaining project state.

**Operational Context:** Sees all Coordination Artifacts, the Memory System and the Message Bus. Maintains coordination-level perspective without diving into code, unless explicitly required or requested.

**Core Responsibilities:**

- **Task Assignment** - Assesses task readiness based on dependency completion and the current Dispatch State. Constructs Task Prompts with objective, instructions, validation criteria, and context extracted from Specifications when needed. Determines dispatch mode (single, batch or parallel) and delivers Task Prompts via Send Bus.

- **Task Review** - Reads Task Reports from Report Bus and Task Memory Logs from Workers. Makes Coordination Decisions: Proceed to next task, FollowUp (retry with refined instructions), or Artifact Modification followed proceedding by next task or a FollowUp.

- **Coordination Artifact Maintenance** - Updates Specifications, Implementation Plan, or Standards when execution reveals issues with initial design decisions, task definitions, dependencies, or universal patterns. Assesses cascade implications and determines whether modifications require User collaboration.

- **Memory System Maintenance** - Updates Dispatch State in Memory Root after each Task Review to track task statuses (Ready, Active, Done, Blocked), agent assignments, active branches, and merge state. Creates Stage Summaries after Stage completion. Maintains Working Notes for ephemeral coordination context.

- **Version Control Coordination** - Initializes and manages feature branches and worktrees for parallel task execution. Performs merge sweeps at Stage boundaries to ensure all work is integrated before advancing.

The Manager operates through multiple Sessions via Handoff when context limits approach. Each Session continues from where the previous left off using Handoff Memory Logs and the Memory System.

---

## Worker Agents

Workers execute Tasks assigned by the Manager. Each Worker is defined in the Implementation Plan with a specific domain (frontend, backend, API, infrastructure, etc.). Multiple Workers operate in parallel when dependencies allow.

**Operational Context:** Sees the current Task Prompt (including extracted Specifications context, instructions, validation criteria), accumulated working context from prior tasks executed, and Standards document. No visibility into full project scope, other Agents' work, or Coordination Artifacts unless explicitly provided in Task Prompt.

**Core Responsibilities:**

- **Task Execution** - Receives Task Prompt via Send Bus. If Cross-Agent Dependencies exist, reads specified files to integrate context from prior tasks of other Workers. Executes instructions step by step, validates results per specified criteria (programmatic tests, artifact checks, User review), iterates on failure until success or stop condition.

- **Task Memory Logging** - Creates Task Memory Log at specified path documenting outcome, validation results, deliverables, technical decisions, and flags for Manager review. This serves as context abstraction layer between Manager's coordination view and Worker's execution details.

- **Task Reporting** - Writes Task Report to Report Bus summarizing completion status, execution notes, and key findings for Manager review.

- **Standards Updates** - Updates Standards file when discovering universal patterns or conflicts during execution. Changes apply across all Agents.

- **Subagent Spawning** - Spawns platform-native subagents (Debug Subagent, Research Subagent etc) for isolated context-heavy work that would pollute the main session. Waits for subagent findings or works in parallel and integrates results to continue task execution.

Workers operate through multiple Sessions via Handoff when context limits approach. After Handoff, prior-Stage Same-Agent Dependencies are treated as Cross-Agent Dependencies requiring explicit file reading.

---

## Subagents

Subagents are platform-native temporary agents spawned for isolated, focused work. APM defines behavioral expectations - the platform handles lifecycle and tool access. Subagents execute autonomously and return findings to the spawning Agent.

**Operational Context:** Sees only the specific context provided for their isolated task. No access to broader project state unless explicitly given. Executes in isolated session that closes after completion.

**Common Types and Responsibilities:**

- **Debug Subagent** - Isolates and resolves complex bugs. Expected access: full (edit, terminal). Spawned when debugging would require extensive context (reading many library files, analyzing complex error logs) that would pollute the Worker's session. Returns findings with solution or diagnostic results.

- **Research Subagent** - Investigates knowledge gaps using current sources. Expected access: read-only, web. Spawned when research requires reading extensive documentation, exploring unfamiliar libraries, or gathering information from external sources. Returns findings with recommendations or answers.

Subagents prevent context pollution in long-running Agent sessions by handling context-intensive work in disposable instances. Workers and Managers can spawn subagents when execution requires isolated investigation.

---

**Next Steps:**

- Understand the Planning Phase and Implementation Phase in [Workflow Overview](Workflow_Overview.md)
- Learn about model selection for each Agent type in [Token Consumption Tips](Token_Consumption_Tips.md)
- Explore APM's memory architecture in [Context and Memory Management](Context_and_Memory_Management.md)
