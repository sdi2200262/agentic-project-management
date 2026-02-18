# APM Terminology

This document defines all terms used in the APM workflow. Terms defined here are capitalized consistently across all guides and commands. Words not listed here are not capitalized or treated as formal terms. Workflow definitions follow `WORKFLOW.md`.

---

## 1. Roles

| Term | Definition |
| ------ | ------------ |
| **Planner** | Gathers requirements and decomposes them into planning documents. Single instance, single session. |
| **Manager** | Coordinates and orchestrates the Implementation Phase - assigns Tasks, reviews results, maintains planning documents and memory. Single instance, multiple sessions via Handoff. |
| **Worker** | Executes Tasks assigned by the Manager. Multiple instances (one per domain), multiple sessions each via Handoff. |

---

## 2. Phases

| Term | Definition |
| ------ | ------------ |
| **Planning Phase** | The Planner transforms User requirements into planning documents through Context Gathering and Work Breakdown. |
| **Implementation Phase** | The Manager and Workers transform the Implementation Plan into completed deliverables through coordinated Task execution. |

---

## 3. Planning Documents

Three documents form a waterfall: Specifications (what to build) → Implementation Plan (how work is organized) → Execution Standards (how work is performed).

| Term | Definition | Location |
| ------ | ------------ | ---------- |
| **Specifications** | Project-specific design decisions and constraints that inform the Implementation Plan. The Manager may update it during the Implementation Phase. | `.apm/Specifications.md` |
| **Implementation Plan** | Stage and Task breakdown with agent assignments, Dependency Graph, and validation criteria. The Manager may update it during the Implementation Phase. | `.apm/Implementation_Plan.md` |
| **Execution Standards** | Universal execution rules maintained as the APM standards block within `{AGENTS_FILE}`. Workers access this file directly; the Manager and Workers may update it during the Implementation Phase. | `{AGENTS_FILE}` at workspace root |
| **Dependency Graph** | Mermaid diagram in the Implementation Plan header that visualizes Task dependencies, agent assignments, and execution flow. Enables the Manager to identify batch candidates, parallel dispatch opportunities, and critical path bottlenecks. | Within `.apm/Implementation_Plan.md` |

---

## 4. Work Units

| Term | Definition |
| ------ | ------------ |
| **Stage** | Milestone grouping of related Tasks representing a coherent project progression. |
| **Task** | Discrete work unit with objective, deliverables, validation criteria, and dependencies. Tasks contain ordered sub-units (steps) that support failure tracing but have no independent validation. |

---

## 5. Procedures

| Term | Definition |
| ------ | ------------ |
| **Procedure** | A named workflow activity in APM. Each Procedure defines a specific phase of agent work: Context Gathering, Work Breakdown, Task Assignment, Task Execution, Task Review, Task Logging, and Handoff. |

| Term | Definition |
| ------ | ------------ |
| **Context Gathering** | Planner elicits requirements through structured question rounds and produces a consolidated summary for User review. |
| **Work Breakdown** | Planner decomposes gathered context into Specifications, Implementation Plan, and Execution Standards. |
| **Task Assignment** | Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them to Workers via Task Bus. |
| **Task Execution** | Worker receives a Task Prompt, executes instructions, validates results, iterates if needed, and logs the outcome to memory. |
| **Task Review** | Manager reviews Task Reports and Task Memory Logs, determines review outcome, modifies planning documents when findings warrant it, and maintains task tracking state. |
| **Task Logging** | Worker writes a structured Task Memory Log capturing outcome, validation, deliverables, and flags. |
| **Handoff** | Context transfer between sessions of the same agent when context window limits approach. Applies to Manager and Worker only. |

---

## 6. Communication

The communication system is a file-based bus mechanism in `.apm/bus/`. Each agent has a directory containing its bus files. Before writing to an outgoing bus file, the agent clears its incoming bus file to prevent stale messages.

| Term | Definition |
| ------ | ------------ |
| **Task Bus** | Manager-to-Worker bus file (`apm-task.md`). Contains Task Prompts. |
| **Report Bus** | Worker-to-Manager bus file (`apm-report.md`). Contains Task Reports. |
| **Handoff Bus** | Outgoing-to-incoming agent bus file (`apm-handoff.md`). Contains the handoff prompt content that instructs the incoming agent to rebuild working context. |
| **Task Prompt** | Self-contained prompt delivered via Task Bus providing a Worker with everything needed to execute and validate a Task. |
| **Task Report** | Concise summary delivered via Report Bus by Worker for Manager review. |

---

## 7. Memory

The Memory System resides in `.apm/Memory/` and captures project history for progress tracking and Handoff continuity. Allows the Manager to operate based on execution summaries and maintain the big picture while coordinating multiple Workers.

| Term | Definition | Location |
| ------ | ------------ | ---------- |
| **Memory System** | File-based repository in `.apm/Memory/` that captures project history, agent progress, and context for Handoff continuity. | `.apm/Memory/` |
| **Memory Root** | Central project state document containing the Project Tracker (task tracking, agent tracking, version control state), working notes, and stage summaries. | `.apm/Memory/Memory_Root.md` |
| **Task Memory Log** | Structured log created by Worker after Task completion. Captures outcome, validation, deliverables, and flags. | `.apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md` |
| **Handoff Memory Log** | Log created during Handoff containing working context not captured elsewhere. | `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md` |
| **Project Tracker** | Structured section of Memory Root containing task tracking, agent tracking, and version control state. Updated by the Manager throughout the Implementation Phase. Serves as the operational view for dispatch decisions, dependency analysis, and Handoff continuity. | Within `.apm/Memory/Memory_Root.md` |

---

## 8. Defined Concepts

These concepts are not formal capitalized terms but are clearly defined because they drive real workflow decisions.

**Task dependencies.** A Task may depend on outputs from a prior Task. The dependency context provided depends on the Worker's familiarity with the producer's work:

- *Same-agent dependency:* producer and consumer are the same Worker. The Worker has working familiarity - provide light context (recall anchors, file paths).
- *Cross-agent dependency:* producer and consumer are different Workers. The Worker has zero familiarity - provide comprehensive context (file reading instructions, output summaries, integration guidance). After a Worker Handoff, previous-Stage same-agent dependencies are treated as cross-agent because the incoming Worker lacks that working context.

**Dispatch modes.** The Manager determines how to dispatch ready Tasks:

- *Single:* one Task dispatched to one Worker.
- *Batch:* multiple sequential Tasks dispatched to the same Worker in a single prompt. Candidates form a chain with only internal dependencies and no external Tasks depending on intermediate results. Soft guidance: 3-5 Tasks per batch.
- *Parallel:* two or more dispatch units (singles or batches) sent to different Workers simultaneously when no unresolved cross-Worker dependencies exist. Requires version control workspace isolation.

**Task lifecycle states.** Tasks in the Project Tracker progress through: waiting (dependencies not met), ready (all dependencies complete), active (dispatched to a Worker), done (coordination decision finalized). A Task becomes done when the Manager makes a terminal coordination decision - proceeding after success, accepting a non-success outcome, or restructuring work. A Task remains active during investigation, while a follow-up is pending, or while the Manager is deciding how to proceed. Done is terminal; if completed work needs revisiting due to later findings, that is a new Task. When all Tasks in a Stage are done with no pending merges, the Stage collapses to complete.

**Task outcome statuses.** Task Memory Logs record the execution result: success (objective achieved, all validation passed), partial (some progress made, Worker needs guidance to continue), failed (Worker attempted but could not succeed within scope), blocked (external factors outside Worker scope prevent progress). Partial means "I need guidance to continue." Failed means "I tried everything within my scope." Blocked means "factors outside my control prevent progress." The `failure_point` field accompanies non-success statuses: `null` for success, `Execution` or `Validation` for failed/partial, or a description for blocked.

**Agent states.** Agents in the Project Tracker are either uninitialized (defined in the Implementation Plan but no session started) or on a specific session (Session N). Session numbers increment on Handoff. A session number greater than 1 indicates Handoff occurred; the Manager checks cross-agent overrides for dependency context depth.

**Validation approaches.** Each Task specifies validation using one or more approaches: programmatic (automated checks), artifact (output existence and structure), or user (human judgment requiring a pause). Validation follows a fixed order: programmatic, then artifact, then user.

**Cross-agent overrides.** When a Worker Handoff is detected, same-agent dependencies from Tasks whose logs were not loaded by the incoming Worker are reclassified as cross-agent. The Manager maintains an override list in the Project Tracker, recording the specific Tasks affected. During Task Assignment, the Manager checks this list to determine dependency context depth. The Dependency Graph is not modified; overrides are a runtime layer over the static plan.

**Visible reasoning (chain-of-thought).** Agents present their thinking visibly in chat before committing to file output. This makes decomposition decisions, analysis, and reasoning auditable and gives the User opportunity to redirect before artifacts are written. Used during Work Breakdown and other Procedures where reasoning transparency supports User collaboration.

---

**End of Terminology**
