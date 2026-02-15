# APM Terminology

This document defines all terms used in the APM workflow. It serves as the single source of truth for vocabulary across all guides and commands.

Terms defined here are capitalized and formatted consistently across guides and commands. Words not defined in this document are not capitalized or treated as formal terms.

All structural patterns follow `STRUCTURE.md`. All writing conventions follow `WRITING.md`. Workflow definitions follow `WORKFLOW.md`.

---

## 1. Roles

| Term | Definition |
|------|------------|
| **Planner Agent** | Role responsible for Context Gathering and Work Breakdown. Single instance, single Session per project. |
| **Manager Agent** | Role responsible for Task assignment and orchestration. Single instance, multiple Sessions via Handoff. |
| **Worker Agent** | Role responsible for Task execution. Multiple instances defined in Implementation Plan, multiple Sessions each via Handoff. |
| **Agent Session** | A continuous execution context for an Agent. Increments on Handoff. Format: `[Agent Name] Session [N]`. |

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
| **Standards** | Universal project standards applied during Task Execution. | `AGENTS.md` (or `CLAUDE.md`) at workspace root |
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
| **Message Bus** | File-based communication system within `.apm/bus/` enabling structured message exchange between Agent Sessions. Initialized by Manager during Session 1. |
| **Agent Channel** | Per-agent subdirectory within the Message Bus containing that Agent's Bus Files. |
| **Send Bus** | Bus File for Manager-to-Worker communication (`apm-send-to-<agent-slug>.md`). Contains Task Prompts. |
| **Report Bus** | Bus File for Worker-to-Manager communication (`apm-report-from-<agent-slug>.md`). Contains Task Reports. |
| **Handoff Bus** | Bus File for Outgoing-to-Incoming Agent communication (`apm-handoff-<agent-slug>.md`). Contains Handoff Prompts. |
| **Clear-on-Return** | Protocol where an Agent clears its incoming Bus File before writing to its outgoing Bus File. |

**Message Bus Structure:**

```
.apm/bus/
├── <agent-slug>/
│   ├── apm-send-to-<agent-slug>.md
│   ├── apm-report-from-<agent-slug>.md
│   └── apm-handoff-<agent-slug>.md
└── manager/
    └── apm-handoff-manager.md
```

**Communications:**

| Term | Definition |
|------|------------|
| **Task Prompt** | Self-contained prompt delivered via Send Bus providing a Worker with everything needed to execute and validate a Task. |
| **FollowUp Task Prompt** | Refined Task Prompt issued after a Coordination Decision determines retry is needed. Contains different content from the original based on what went wrong. |
| **Handoff Prompt** | Prompt delivered via Handoff Bus instructing an Incoming Agent to reconstruct context. |
| **Task Report** | Concise summary delivered via Report Bus by Worker for Manager review. |
| **Batch Task Report** | Consolidated report covering multiple Tasks executed in a batch. Contains per-task status and Memory Log references. |

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
| **Planning Phase** | First phase of APM workflow. Planner Agent transforms User requirements into Coordination Artifacts through Context Gathering and Work Breakdown. |
| **Context Gathering** | Procedure where the Planner elicits requirements through structured Question Rounds and produces an Understanding Summary. |
| **Work Breakdown** | Procedure where the Planner decomposes gathered context into Specifications, Implementation Plan, and Standards. |
| **Question Round** | Iteration cycle within Context Gathering focused on specific discovery areas. Three rounds: vision, technical requirements, and implementation approach. |
| **Understanding Summary** | Consolidated context presentation for User review before Work Breakdown. |
| **Dependency Graph** | Mermaid diagram in the Implementation Plan header visualizing Task dependencies and Agent assignments. Generated during Work Breakdown. |

---

## 8. Implementation Phase

| Term | Definition |
|------|------------|
| **Implementation Phase** | Second phase of APM workflow. Manager and Worker Agents transform the Implementation Plan into completed deliverables through coordinated Task execution. |

### 8.1 Coordination (Manager Agent)

| Term | Definition |
|------|------------|
| **Task Assignment** | Procedure where the Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them to Workers via Send Bus. |
| **Task Review** | Procedure where the Manager reviews Task Reports and Task Memory Logs, makes Coordination Decisions, modifies Coordination Artifacts when findings warrant it, and maintains the Dispatch State. |
| **Coordination Cycle** | The repeating cycle that drives the Implementation Phase, scoped per task: Task Assignment → Task Cycle → Task Review. Each task executes through its own Coordination Cycle. Includes artifact modification and Dispatch State updates as needed within iterations. |
| **Task Cycle** | The Worker's execution loop within a Coordination Cycle: receive Task Prompt → execute → validate → iterate (if needed) → log → report. Each Coordination Cycle contains one Task Cycle. When multiple tasks are dispatched (batch or parallel), multiple Coordination Cycles occur - sequentially for batch, concurrently for parallel. |
| **Coordination Decision** | Manager's assessment after Task Review. Outcomes: Proceed to next Task, FollowUp (retry with refined instructions), or Artifact Modification plus next Task or FollowUp. |
| **Ready Task** | A Task whose dependencies are all complete and can be dispatched. |
| **Batch Dispatch** | Dispatching multiple sequential Tasks to the same Worker in a single Send Bus message. |
| **Parallel Dispatch** | Dispatching Tasks to multiple Workers simultaneously when no cross-Worker dependencies exist among them. |

### 8.2 Execution (Worker Agent)

| Term | Definition |
|------|------------|
| **Worker Registration** | Process of binding a Worker Session to a specific Agent identity from the first prompt received. |
| **Task Execution** | Procedure where the Worker executes Task instructions, validates, and iterates. |
| **Context Integration** | Pre-execution action where Worker reads and understands dependency outputs before Task Execution begins. |
| **Context Dependency** | Relationship where a Task requires outputs or context from a prior Task. Two types: Same-Agent and Cross-Agent. |
| **Same-Agent Dependency** | Dependency where producer and consumer are the same Worker. Requires light context (recall anchors). |
| **Cross-Agent Dependency** | Dependency where producer and consumer are different Workers. Requires comprehensive context. After Handoff, prior-Stage Same-Agent Dependencies are treated as Cross-Agent. |
| **Validation Types** | Methods for verifying Task completion: Programmatic (automated checks), Artifact (output existence and structure), User (human judgment). Executed in that order. |
| **Task Status** | Outcome of Task execution: Success (objective achieved), Partial (progress made, needs guidance), Failed (attempted, could not succeed), Blocked (external factors prevent progress). |
| **Iteration Cycle** | Correction loop when validation fails: correct, re-execute, re-validate until success or stop condition. |

### 8.3 Handoff

| Term | Definition |
|------|------------|
| **Handoff** | Context transfer between Sessions of the same Agent when context window limits approach. Applies to Manager and Worker only. |
| **Outgoing Agent** | The Agent performing Handoff. Creates Handoff Memory Log and Handoff Prompt. |
| **Incoming Agent** | The replacement Agent receiving Handoff. Reconstructs context from artifacts and logs. |
| **Context Reconstruction** | Process by which an Incoming Agent rebuilds working context from Coordination Artifacts, Memory Logs, and Handoff Memory Log. |

### 8.4 Subagents

| Term | Definition |
|------|------------|
| **Subagent** | A platform-native spawned agent for isolated, focused work. Executes autonomously and returns findings to the spawning Agent. APM defines behavioral expectations; the platform handles lifecycle and tool access. |
| **Debug Subagent** | Subagent for isolating and resolving complex bugs. Expected access: full (edit, terminal). |
| **Research Subagent** | Subagent for investigating knowledge gaps using current sources. Expected access: read-only, web. |

---

**End of Terminology**
