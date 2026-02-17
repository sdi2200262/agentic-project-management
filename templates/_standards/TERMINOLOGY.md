# APM Terminology

This document defines all terms used in the APM workflow. It serves as the single source of truth for vocabulary across all guides and commands.

Terms defined here are capitalized and formatted consistently across guides and commands. Words not defined in this document are not capitalized or treated as formal terms.

All structural patterns follow `STRUCTURE.md`. All writing conventions follow `WRITING.md`. Workflow definitions follow `WORKFLOW.md`.

---

## 1. Roles

| Term | Definition |
|------|------------|
| **Planner** | Role responsible for Context Gathering and Work Breakdown. Single instance, single session per project. |
| **Manager** | Role responsible for Task assignment and orchestration. Single instance, multiple sessions via Handoff. |
| **Worker** | Role responsible for Task execution. Multiple instances defined in Implementation Plan, multiple sessions each via Handoff. |

**Role Characteristics:**

| Role | Instances | Sessions | Handoff | Initiated By |
|------|-----------|----------|---------|--------------|
| Planner | 1 | 1 | No | User |
| Manager | 1 | Multiple | Yes | User |
| Worker | Multiple | Multiple | Yes | User |

---

## 2. Coordination Artifacts

| Term | Definition | Location |
|------|------------|----------|
| **Coordination Artifact** | Document that guides project coordination. Three types exist: Specifications, Implementation Plan, Standards. | `.apm/` and workspace root |
| **Specifications** | Project-specific design decisions and constraints that inform the Implementation Plan. | `.apm/Specifications.md` |
| **Implementation Plan** | Stage and Task breakdown with Agent assignments, Dependency Graph, and validation criteria. | `.apm/Implementation_Plan.md` |
| **Standards** | Universal project standards applied during task execution. | `AGENTS.md` (or `CLAUDE.md`) at workspace root |
| **APM_STANDARDS Block** | Namespace block within Standards file containing APM-managed content. | Within Standards file |

**Coordination Artifact Hierarchy:**

| Level | Artifact | Purpose |
|-------|----------|---------|
| Architectural | Specifications | Define what is being built |
| Coordination | Implementation Plan | Define how work is organized |
| Execution | Standards | Define how work is performed |

---

## 3. Work Units

| Term | Definition |
|------|------------|
| **Stage** | Milestone grouping of related Tasks representing a coherent project progression. |
| **Task** | Discrete work unit with objective, deliverables, validation criteria, and dependencies. |
| **Step** | Ordered sub-unit within a Task. Supports failure tracing but has no independent validation. |

---

## 4. Communication System

| Term | Definition |
|------|------------|
| **Message Bus** | File-based communication system within `.apm/bus/`. Each agent has a directory containing its Bus Files. Initialized by Manager during session 1. |
| **Task Bus** | Bus File for Manager-to-Worker communication (`apm-task.md`). Contains Task Prompts. Direction: Manager → Worker. |
| **Report Bus** | Bus File for Worker-to-Manager communication (`apm-report.md`). Contains Task Reports. Direction: Worker → Manager. |
| **Handoff Bus** | Bus File for Outgoing-to-Incoming Agent communication (`apm-handoff.md`). Contains Handoff Prompts. Direction: Outgoing → Incoming. |
| **Clear-on-Return** | Before writing to an outgoing Bus File, an Agent clears its incoming Bus File. This prevents stale messages from accumulating. |

**Message Bus Structure:**

```
.apm/bus/
├── <agent-slug>/
│   ├── apm-task.md
│   ├── apm-report.md
│   └── apm-handoff.md
└── manager/
    └── apm-handoff.md
```

**Communications:**

| Term | Definition |
|------|------------|
| **Task Prompt** | Self-contained prompt delivered via Task Bus providing a Worker with everything needed to execute and validate a Task. |
| **Handoff Prompt** | Prompt delivered via Handoff Bus instructing an Incoming Agent to rebuild working context. |
| **Task Report** | Concise summary delivered via Report Bus by Worker for Manager review. |

---

## 5. Memory System

| Term | Definition | Location |
|------|------------|----------|
| **Memory System** | Hierarchical storage for project history enabling progress tracking and Handoff continuity. | `.apm/Memory/` |
| **Memory Root** | Central project state document containing Handoff count, Dispatch State, Working Notes, and Stage Summaries. | `.apm/Memory/Memory_Root.md` |
| **Dispatch State** | Section within Memory Root tracking task statuses, agent assignments, active branches, and merge state per Stage. Task statuses: Ready (can be dispatched), Active (in progress), Done (reviewed), Blocked (dependencies not met). Updated by the Manager after each review cycle. | Within Memory Root |
| **Working Notes** | Ephemeral coordination notes in Memory Root maintained by the Manager and User during the Implementation Phase. Inserted and removed as context evolves. | Within Memory Root |
| **Stage Summary** | Compressed Stage-level outcome appended to Memory Root after Stage completion. | Within Memory Root |
| **Stage Directory** | Directory containing all Task Memory Logs for a Stage. | `.apm/Memory/Stage_<N>_<Slug>/` |
| **Task Memory Log** | Structured log created by Worker after Task completion. Captures outcome, validation, deliverables, and flags. | `Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md` |
| **Handoff Memory Log** | Log created during Handoff containing working context not captured elsewhere. | `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md` |

**Memory System Structure:**

```
.apm/Memory/
├── Memory_Root.md
├── Stage_01_<Slug>/
│   ├── Task_Log_01_01_<Slug>.md
│   └── Task_Log_01_02_<Slug>.md
├── Stage_02_<Slug>/
│   └── ...
└── Handoffs/
    ├── Manager_Handoffs/
    │   └── Manager_Handoff_Log_<N>.md
    └── <AgentID>_Handoffs/
        └── <AgentID>_Handoff_Log_<N>.md
```

---

## 6. Documents

| Term | Definition |
|------|------------|
| **Guide** | Agent-facing document containing procedural instructions and operational standards. Each guide is read only by one Agent Role. |
| **Skill** | Universal Agent-facing document containing procedural instructions and operational standards. Each skill may be read by multiple Agent Roles. |
| **Command** | User-facing prompt that initiates workflow actions. |
| **Procedure** | Structured sequence of actions within a Guide or Command. |

---

## 7. Planning Phase

| Term | Definition |
|------|------------|
| **Planning Phase** | First phase of APM workflow. The Planner transforms User requirements into Coordination Artifacts through Context Gathering and Work Breakdown. |
| **Context Gathering** | Procedure where the Planner elicits requirements through structured rounds of questions and produces a consolidated summary for User review. |
| **Work Breakdown** | Procedure where the Planner decomposes gathered context into Specifications, Implementation Plan, and Standards. |
| **Dependency Graph** | Mermaid diagram in the Implementation Plan header visualizing Task dependencies and agent assignments. Generated during Work Breakdown. |

---

## 8. Implementation Phase

| Term | Definition |
|------|------------|
| **Implementation Phase** | Second phase of APM workflow. The Manager and Workers transform the Implementation Plan into completed deliverables through coordinated task execution. |

### 8.1 Coordination (Manager)

| Term | Definition |
|------|------------|
| **Task Assignment** | Procedure where the Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them to Workers via Task Bus. |
| **Task Review** | Procedure where the Manager reviews Task Reports and Task Memory Logs, determines the review outcome, modifies Coordination Artifacts when findings warrant it, and maintains the Dispatch State. |
| **Batch Dispatch** | Dispatching multiple sequential Tasks to the same Worker in a single Task Bus message. |
| **Parallel Dispatch** | Dispatching Tasks to multiple Workers simultaneously when no cross-Worker dependencies exist among them. |

### 8.2 Execution (Worker)

| Term | Definition |
|------|------------|
| **Context Dependency** | Relationship where a Task requires outputs or context from a prior Task. Two types: Same-Agent and Cross-Agent. |
| **Same-Agent Dependency** | Dependency where producer and consumer are the same Worker. Requires light context (recall anchors). |
| **Cross-Agent Dependency** | Dependency where producer and consumer are different Workers. Requires comprehensive context. After Handoff, prior-Stage Same-Agent Dependencies are treated as Cross-Agent. |
| **Validation Types** | Methods for verifying Task completion: Programmatic (automated checks), Artifact (output existence and structure), User (human judgment). Executed in that order. |
| **Task Status** | Outcome of task execution: Success (objective achieved), Partial (progress made, needs guidance), Failed (attempted, could not succeed), Blocked (external factors prevent progress). |

### 8.3 Handoff

| Term | Definition |
|------|------------|
| **Handoff** | Context transfer between sessions of the same Agent when context window limits approach. Applies to Manager and Worker only. |
| **Outgoing Agent** | The Agent performing Handoff. Creates Handoff Memory Log and Handoff Prompt. |
| **Incoming Agent** | The replacement Agent receiving Handoff. Rebuilds working context from Coordination Artifacts, logs, and Handoff Prompt. |

### 8.4 Subagents

| Term | Definition |
|------|------------|
| **Subagent** | A platform-native spawned agent for isolated, focused work. Executes autonomously and returns findings to the spawning Agent. APM defines behavioral expectations; the platform handles lifecycle and tool access. Two common types: debug subagents (full access: edit, terminal) and research subagents (read-only, web). |

---

**End of Terminology**
