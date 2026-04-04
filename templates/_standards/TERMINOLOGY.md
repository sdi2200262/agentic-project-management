# APM Terminology

This document defines the formal vocabulary of the APM workflow. This is a development-time specification: agents do not read this file or any `_standards/` document during runtime. The vocabulary defined here takes effect through the commands, guides, and skills that use these terms consistently. Template authors use terms exactly as defined here; agents inherit correct terminology through the templates they read.

Formal terms are always capitalized and carry defined meaning. All other language is natural - standard English capitalization applies (headings, labels, proper nouns) but confers no formal status. There is no intermediate category between formal vocabulary and natural language. Workflow definitions follow `WORKFLOW.md`.

---

## 1. Roles

| Term | Definition |
| ------ | ------------ |
| **Planner** | Gathers requirements and decomposes them into planning documents. Single instance, no Handoff. |
| **Manager** | Coordinates and orchestrates the Implementation Phase - assigns Tasks, reviews results, maintains planning documents and memory. Single role, multiple instances via Handoff. |
| **Worker** | Executes Tasks assigned by the Manager. Multiple roles (one per domain), multiple instances each via Handoff. |

---

## 2. Phases

| Term | Definition |
| ------ | ------------ |
| **Planning Phase** | The Planner transforms User requirements into planning documents through Context Gathering and Work Breakdown. |
| **Implementation Phase** | The Manager and Workers transform the Spec, Plan and Rules into completed deliverables through coordinated Task execution. |

---

## 3. Planning Documents

Three documents form a waterfall: Spec (what to build) → Plan (how work is organized) → Rules (how work is performed).

| Term | Definition | Location |
| ------ | ------------ | ---------- |
| **Spec** | Project-specific design decisions and constraints that inform the Plan. The Manager may update it during the Implementation Phase. | `.apm/spec.md` |
| **Plan** | Stage and Task breakdown with agent assignments, Dependency Graph, and validation criteria. The Manager may update it during the Implementation Phase. | `.apm/plan.md` |
| **Rules** | Universal execution rules maintained as the APM Rules block within `{RULES_FILE}`. Workers access this file directly; the Manager and Workers may update it during the Implementation Phase. | `{RULES_FILE}` at workspace root |
| **Dependency Graph** | Mermaid diagram in the Plan header that visualizes Task dependencies, agent assignments, and execution flow. Enables the Manager to identify batch candidates, parallel dispatch opportunities, and critical path bottlenecks. | Within `.apm/plan.md` |

---

## 4. Work Units

| Term | Definition |
| ------ | ------------ |
| **Stage** | Milestone grouping of related Tasks representing a coherent project progression. |
| **Task** | Discrete work unit with objective, deliverables, validation criteria, and dependencies. Tasks contain ordered sub-units (steps) that support failure tracing but have no independent validation. |

### Task Lifecycle States

Tasks in the Tracker progress through these states:

| Term | Definition |
| ------ | ------------ |
| **Waiting** | Dependencies not met. |
| **Ready** | All dependencies complete; can be dispatched. |
| **Active** | Dispatched to a Worker; execution in progress. |
| **Done** | Coordination decision finalized - terminal state. |

Outcome statuses are inputs to the Manager's coordination decision - the Manager reviews the outcome, investigates if needed, and then decides the lifecycle transition. A Task becomes Done when the Manager makes a terminal coordination decision - proceeding after Success, accepting a non-Success outcome, or restructuring work. A Task remains Active during investigation, while a follow-up is pending, or while the Manager is deciding how to proceed. Done is terminal; if completed work needs revisiting due to later findings, the Manager creates a new Task through plan modification rather than reopening the original. The original remains Done as a historical coordination decision; the new Task references it and captures what specifically needs correction. When all Tasks in a Stage are Done with no pending merges, the Stage collapses to complete.

### Task Outcome Statuses

Task Logs record the execution result:

| Term | Definition |
| ------ | ------------ |
| **Success** | Objective achieved, all validation passed. |
| **Partial** | Some progress made; Worker needs guidance to continue. |
| **Failed** | Objective not achieved; Worker attempted but could not resolve the issue. |

Partial means "I need guidance to continue." Failed means "I could not achieve the objective."

---

## 5. Procedures

| Term | Definition |
| ------ | ------------ |
| **Procedure** | A defined workflow operation in APM. Each Procedure covers a specific part of agent work: Context Gathering, Work Breakdown, Task Assignment, Task Execution, Task Review, Task Logging, and Handoff. |

| Term | Definition |
| ------ | ------------ |
| **Context Gathering** | Planner elicits requirements through structured question rounds and produces a consolidated summary for User review. |
| **Work Breakdown** | Planner decomposes gathered context into Spec, Plan, and Rules. |
| **Task Assignment** | Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them to Workers via Task Bus. |
| **Task Execution** | Worker receives a Task Prompt, executes instructions, validates results, iterates if needed, and logs the outcome to memory. |
| **Task Review** | Manager reviews Task Reports and Task Logs, determines review outcome, modifies planning documents when findings warrant it, and updates the Tracker. |
| **Task Logging** | Worker writes a structured Task Log capturing outcome, validation, deliverables, and flags. |
| **Handoff** | Context transfer between successive instances of the same agent role when context window limits approach. Applies to Manager and Worker only. |

---

## 6. Communication

The communication system is a file-based Message Bus in `.apm/bus/`. Each agent has a directory containing its bus files. Before writing to an outgoing bus file, the agent clears its incoming bus file to prevent stale messages.

| Term | Definition |
| ------ | ------------ |
| **Message Bus** | The file-based communication system in `.apm/bus/` through which agents exchange Task Prompts, Task Reports, and Handoff content. The User mediates every exchange. |
| **Task Bus** | Manager-to-Worker bus file (`task.md`). Contains Task Prompts. |
| **Report Bus** | Worker-to-Manager bus file (`report.md`). Contains Task Reports. |
| **Handoff Bus** | Outgoing-to-incoming agent bus file (`handoff.md`). Contains the handoff prompt content that instructs the incoming agent to rebuild working context. |
| **Task Prompt** | Self-contained prompt delivered via Task Bus providing a Worker with everything needed to execute and validate a Task. |
| **Task Report** | Concise summary delivered via Report Bus by Worker for Manager review. |

---

## 7. Memory

Memory resides in `.apm/memory/` and captures project history for progress tracking and Handoff continuity.

| Term | Definition | Location |
| ------ | ------------ | ---------- |
| **Memory** | The hierarchical file structure in `.apm/memory/` that captures project history for progress tracking and Handoff continuity. Contains the Index, Task Logs, and Handoff Logs. | `.apm/memory/` |
| **Tracker** | Live project state document containing Task tracking, Worker tracking, version control state, and working notes. Updated by the Manager throughout the Implementation Phase as the operational view for dispatch decisions, dependency analysis, and Handoff continuity. | `.apm/tracker.md` |
| **Index** | Durable project memory containing Memory notes (persistent observations and patterns) and Stage summaries (appended after each Stage completion). | `.apm/memory/index.md` |
| **Task Log** | Structured log created by Worker after Task completion. Captures outcome, validation, deliverables, and flags. | `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` |
| **Handoff Log** | Log created during Handoff containing working context not captured elsewhere. | `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md` |

---

## 8. Defined Concepts

These concepts are not formal capitalized terms but are clearly defined because they drive real workflow decisions.

**Task dependencies.** A Task may depend on outputs from a prior Task. The dependency context provided depends on the Worker's familiarity with the producer's work:

- *Same-agent dependency:* producer and consumer are the same Worker. The Worker has working familiarity - provide light context (recall anchors, file paths).
- *Cross-agent dependency:* producer and consumer are different Workers. The Worker has zero familiarity - provide comprehensive context (file reading instructions, output summaries, integration guidance). After a Worker Handoff, previous-Stage same-agent dependencies are treated as cross-agent because the incoming Worker lacks that working context.

**Dispatch modes.** The Manager determines how to dispatch Ready Tasks:

- *Single:* one Task dispatched to one Worker.
- *Batch:* multiple sequential Tasks dispatched to the same Worker in a single prompt. Candidates either form a chain with only internal dependencies, or are an independent group of same-Worker Tasks all Ready simultaneously. When forming chains, the Manager weighs whether external Tasks depend on intermediate results - if so, dispatching individually allows earlier review and unblocks dependent Workers sooner. Soft guidance: 2-3 Tasks per batch.
- *Parallel:* two or more dispatch units (singles or batches) sent to different Workers simultaneously when no unresolved cross-Worker dependencies exist. Requires version control workspace isolation.

**Agent instances.** Each agent role is numbered sequentially. Manager 1 is the first Manager; Manager 2 takes over after Handoff. Workers follow the same pattern (e.g., Frontend Agent 1, Frontend Agent 2). Instance numbers are tracked in the Tracker's Worker tracking table. Auto-compaction recovery does not increment the instance number - the recovered agent continues as the same instance. Instance number increments via Handoff.

**Worker states.** Workers in the Tracker are either uninitialized (defined in the Plan but no instance started) or on a specific instance (Instance N). An instance number greater than 1 indicates Handoff occurred; the Manager checks cross-agent overrides for dependency context depth.

**Recovery.** Context reconstruction after platform auto-compaction within an agent instance. The recovered agent re-reads the initiation command and follows its document loading instructions to rebuild procedural knowledge and project state. Recovery does not increment the instance number or constitute a Handoff. The agent notes the recovery in its next communication (Task Report for Workers, Tracker for the Manager) and in its eventual Handoff Log.

**APM session.** One complete workflow cycle operating on a single set of `.apm/` artifacts. Multiple agent instances participate across Handoffs, and the artifact set remains continuous until archival. An APM session spans at least three chat conversations (Planner, Manager, and one or more Workers); a chat conversation hosts one agent instance at a time.

**Session continuation.** Archiving the current session's artifacts and reinitializing for a new session. The summarization command produces an optional session summary, then the `apm archive` CLI command moves artifacts into `.apm/archives/` and removes the current installation. The user runs `apm init` (or `apm custom`) to begin a new session with fresh templates while retaining read access to archived context.

**Session archive.** A snapshot of a session's artifacts stored as a dated directory in `.apm/archives/` (`session-YYYY-MM-DD-NNN`). Contains planning documents, Tracker, Memory, and an optional session summary. The snapshot captures whatever state the session was in at archival time - completed, partial, or in-progress. The `metadata.json` file is the canonical archive marker.

**Session summary.** Optional artifact (`.apm/session-summary.md`) produced by a standalone agent via the summarization command - not a Planner, Manager, or Worker. Captures a point-in-time snapshot of the session: project scope, stage outcomes, key deliverables, notable findings, known issues, and current codebase state including how deliverables relate to the `.apm/` artifacts. Can be produced at any point during a session, not only after completion.

**Understanding summary.** A consolidated presentation of gathered context for User review and approval. The Planner presents one at the end of Context Gathering, covering requirements, design decisions, work structure signals, and technical context. The Manager presents one during first initiation, covering project scope, design decisions, and proposed version control conventions. Both serve as approval gates - the User reviews and approves before the agent proceeds.

**Cross-agent overrides.** When a Worker Handoff is detected, same-agent dependencies from Tasks whose logs were not loaded by the incoming Worker are reclassified as cross-agent. The Manager maintains an override list in the Tracker, recording the specific Tasks affected. During Task Assignment, the Manager checks this list to determine dependency context depth. The Dependency Graph is not modified; overrides are a runtime layer over the static plan.

---

**End of Terminology**
