# APM Workflow

This document is the formal specification of the APM workflow. It defines the phases, systems, and procedures that govern how agents coordinate to deliver project outcomes. This is a development-time specification: agents do not read this file during runtime. All commands, guides, and skills derive their behavior from this specification — the rules defined here take effect through those implementation files.

Terms used here are defined in `TERMINOLOGY.md`. Writing conventions follow `WRITING.md`.

---

## 1. Design

APM is a multi-agent project management framework that coordinates agent sessions through file-based communication and structured planning documents.

**User-mediated coordination** - The User initiates sessions, triggers bus checks, approves key decisions, and triggers Handoffs. All inter-agent communication passes through the file system; agents never communicate directly. The User decides when messages are delivered by running trigger commands in the appropriate session.

**Platform agnosticism** - Core concepts (the bus system, the Memory System, planning documents) are platform-independent. Platform-specific capabilities are additive and delivered through the build pipeline's conditional placeholder system.

**Context scoping** - Each agent operates within intentionally limited context. Workers are scoped to their Task Prompts, Execution Standards, and accumulated working context. This scoping is architectural discipline, not programmatic enforcement - Workers are normal agent instances capable of reading any file. Task Prompts are designed to be fully self-contained so Workers have no reason to look beyond them. The Manager holds coordination-level context: planning documents, the Memory System, and the full project picture. The Planner holds initial project context during the Planning Phase but does not participate during implementation. This scoping prevents context overload and keeps agents focused on their role.

**Structured memory** - The Memory System captures project history in a hierarchical file structure that enables Handoff continuity and efficient progress tracking. The Manager operates on execution summaries rather than raw implementation detail, enabling coordination of multiple Workers without context overload.

**Decision-point reasoning** - At procedural decision points - where agents assess, determine, or choose between alternatives - agents state brief reasoning grounded in current project conditions before acting on the conclusion. This makes decision logic visible and auditable, enabling the User to follow agent reasoning and redirect when needed.

---

## 2. Phases

### 2.1 Planning Phase

The Planner transforms User requirements into planning documents through two sequential procedures: Context Gathering, then Work Breakdown. After the User approves all three planning documents, the Planner initializes the bus system for all agents defined in the Implementation Plan and directs the User to start the Implementation Phase by initiating the Manager.

### 2.2 Implementation Phase

The Manager and Workers transform the Implementation Plan into completed deliverables. The Implementation Phase begins when the User initiates the Manager session.

**Manager initialization** - During its first session, the Manager reads all planning documents, initializes version control (if not already implemented), populates the Project Tracker in Memory Root (task tracking with the first Stage's Tasks, agent tracking with all Workers, version control state), presents an understanding summary, and requests User approval before dispatching work.

**Task cycle** - Each Task progresses through three procedures: Task Assignment (Manager assesses readiness, constructs a Task Prompt, delivers it via Task Bus) → Task Execution (Worker executes, validates, iterates if needed, writes a Task Memory Log and Task Report) → Task Review (Manager reviews the report and log, determines outcome and next steps). This cycle repeats per Task. When multiple Tasks are dispatched as a batch or in parallel, each maintains its own cycle.

**Continuous coordination** - After each Task Review, the Manager reassesses readiness and dispatches the next Task in the same turn when one is Ready. Review and dispatch happen without waiting for User input. The Manager pauses only when no Tasks are Ready and Workers are active, when a decision requires User collaboration, or when waiting for an outstanding Task to complete will unblock more efficient dispatches.

**Stage completion** - After all Tasks in a Stage complete, the Manager creates a stage summary capturing Stage-level outcomes, then proceeds to the next Stage.

**Project completion** - After all Stages complete, the Manager presents a project completion summary covering: Stages completed, total Tasks executed, Workers involved, Stage outcomes, notable findings, and final deliverables.

**Version control** - Version control provides workspace isolation during parallel dispatch. Each dispatch unit operates on its own branch, and the Manager coordinates all merges. Workers commit to their assigned branch but do not create branches, manage worktrees, or merge.

**Handoff** - Handoff transfers context between sessions of the same agent when context window limits approach. The Planner does not Handoff (single session).

---

## 3. Planning Documents

| Document | Purpose | Location | Access |
| -------- | ------- | -------- | ------ |
| Specifications | Define what is being built | `.apm/Specifications.md` | Manager reads directly; relevant content extracted into Task Prompts by Manager |
| Implementation Plan | Define how work is organized | `.apm/Implementation_Plan.md` | Manager reads directly; Task definitions extracted into Task Prompts by Manager |
| Execution Standards | Define how work is performed | `{AGENTS_FILE}` at workspace root | All agents |

### 3.1 Specifications

Specifications define what is being built - project-specific design decisions and constraints. They reside at `.apm/Specifications.md` with a free-form markdown structure determined by project needs. Specifications inform the Implementation Plan.

Workers do not reference Specifications directly. The Manager extracts relevant content into Task Prompts during Task Assignment, making them self-contained, and may update Specifications during the Implementation Phase when execution findings warrant it.

### 3.2 Implementation Plan

The Implementation Plan defines how work is organized - Stages, Tasks, agent assignments, a dependency graph, and validation criteria. It resides at `.apm/Implementation_Plan.md`.

The plan contains a header (project name, overview, agents, Stages, dependency graph) followed by Stage sections containing Tasks. Each Task specifies an objective, output, validation criteria, guidance, dependencies, and steps. The dependency graph is a mermaid diagram that visualizes Task dependencies and agent assignments, enabling the Manager to identify batch candidates, parallel dispatch opportunities, and critical path bottlenecks.

Task dependencies are listed in each Task's dependencies field. Cross-agent dependencies - between different Workers - are bolded for visual distinction.

Workers do not reference the Implementation Plan directly. The Manager extracts Task content into Task Prompts during Task Assignment. The Manager may update the Implementation Plan during the Implementation Phase, updating the dependency graph when modifications affect Task dependencies.

### 3.3 Execution Standards

Execution Standards define how work is performed - universal execution patterns applied during Task Execution. They are stored within the APM standards block in `{AGENTS_FILE}` at the workspace root. Content outside this block is user-managed and preserved. When relevant standards already exist outside the block, the APM standards block references them rather than duplicating.

All agents have direct access to this file. Both the Manager and Workers may update Execution Standards during the Implementation Phase.

Execution Standards are read directly by every Worker in the project - including Workers assigned to different domains. A frontend Worker and a backend Worker read the same file. Content must therefore be genuinely universal: applicable to every Worker regardless of domain. Domain-specific execution patterns belong in Task Prompts via Specification extraction, not here.

### 3.4 Document Modification

Specifications and the Implementation Plan have bidirectional influence - changes to one may require adjustments in the other. Execution Standards are generally isolated from architecture and coordination-level documents. When modifying any planning document, the Manager assesses cascade implications before executing changes.

**Manager authority** (small contained changes):

- Single Task clarification or correction
- Adding a missing dependency
- Isolated Specification addition
- Minor Execution Standards adjustment

**User collaboration required** (significant changes):

- Multiple Tasks affected
- Design direction change
- Scope change
- New Stage addition or major restructure
- Multiple small modifications that together represent significant change

---

## 4. Communication System

### 4.1 Communication Models

Agent communication follows three models based on audience:

**Agent-to-user communication.** Agents explain decisions and actions to Users in natural language. No framework vocabulary - section references (§N.M), procedure step names, checkpoint labels, decision categories - is exposed. Only terms defined in `TERMINOLOGY.md` are used formally. When describing decisions, agents explain what happened, what was decided, and what happens next - not which procedure branch was taken. When directing Users to perform actions, agents provide specific actionable guidance: which command, in which session, with what arguments.

 **Visible reasoning.** Agents present analytical thinking visibly in chat to make decisions auditable and give the User opportunity to redirect and steer. Two forms exist: guided reasoning, where specific procedures define labeled reasoning frames that structure the analysis (the structure forces thorough analysis and produces better outputs - these frames are intentionally visible); and free-form reasoning, the baseline for all other decision points - formal and technical, but presented naturally without framework labels or procedure vocabulary. Guided reasoning frames are defined by the procedures that use them; the communication skill defines the baseline for everything else.

**Agent-to-agent and agent-to-system communication.** Structured per schemas and format specifications. Bus messages, artifact writing, memory logs. Precise, uses formal identifiers. Governed by the communication skill (bus protocol) and each guide's structural specifications (artifact formats).

**Terminology boundary.** Only terms defined in `TERMINOLOGY.md` are part of the agent's public vocabulary. Section references (§N.M), procedure names, step labels, checkpoint labels, and decision categories are internal authoring structure - agents use them for navigation and internal decision making but never surface them in user-facing output. Guided reasoning frame labels are the exception - they are surfaced as defined by their procedures because the labeled structure is the output.

### 4.2 Bus System

The bus system is a file-based communication mechanism in `.apm/bus/`. The Planner initializes it at the end of the Planning Phase. Each Worker has a bus directory containing three bus files. The Manager has a bus directory containing only a Handoff Bus.

| Bus File | File Name | Direction | Contains |
| -------- | --------- | --------- | -------- |
| Task Bus | `apm-task.md` | Manager → Worker | Task Prompts (single or batched) |
| Report Bus | `apm-report.md` | Worker → Manager | Task Reports |
| Handoff Bus | `apm-handoff.md` | Outgoing → incoming agent | Handoff prompt content |

A bus file is either empty (no message present) or contains a message awaiting delivery. Before writing to an outgoing bus file, an agent clears its incoming bus file. This prevents stale messages from accumulating and signals that the previous message was processed.

Workers read their Task Bus when the User runs `/apm-4-check-tasks` in the Worker's session. The Manager reads Report Buses when the User runs `/apm-5-check-reports`. Both commands accept an optional agent identifier argument for targeted delivery.

When dispatching multiple sequential Tasks to the same Worker, the Manager sends them as a batch in a single Task Bus message. Each Task Prompt within the batch retains its full standalone structure.

### 4.3 Communication Flow

1. Manager writes a Task Prompt to a Worker's Task Bus and provides the User with specific action guidance - which command to run, in which session, and whether the Worker needs initialization first.
2. User runs the indicated command(s) in the Worker's session.
3. Worker executes the Task, writes a Task Memory Log, writes a Task Report to the Report Bus, and directs the User to deliver the report to the Manager - including the agent identifier for targeted retrieval.
4. User runs `/apm-5-check-reports` in the Manager's session.
5. Manager reviews the report and log, determines next steps.

The User is the trigger puller at every boundary - there is no direct agent-to-agent communication. Each agent provides concise, actionable guidance covering only their end of the exchange.

---

## 5. Memory System

### 5.1 Structure

The Memory System resides in `.apm/Memory/` with this hierarchy:

```text
.apm/Memory/
├── Memory_Root.md
├── Stage_<N>_<Slug>/
│   └── Task_Log_<N>_<M>_<Slug>.md
└── Handoffs/
    └── <AgentID>_Handoffs/
        └── <AgentID>_Handoff_Log_<N>.md
```

**Memory Root** (`Memory_Root.md`) is the central project state document. It contains the Project Tracker, working notes, and stage summaries.

**Project Tracker** (within Memory Root) is a structured section containing task tracking, agent tracking, and version control state. The Manager updates it throughout the Implementation Phase. It serves as the operational view for dispatch decisions, dependency analysis, and Handoff continuity.

**Task tracking** (within Project Tracker) records Task statuses, agent assignments, active branches, and merge state per Stage. The Manager updates it after each Task Review. Tasks progress through lifecycle states per `TERMINOLOGY.md` §4: Waiting, Ready, Active, Done.

**Agent tracking** (within Project Tracker) records agent states and session numbers. Agents start as uninitialized and transition to Session N when initialized. The Manager updates it when agents are first dispatched to, and when Handoffs are detected. Cross-agent overrides are recorded below the agent table when Worker Handoffs reclassify dependencies.

**Stage directories** (`Stage_<N>_<Slug>/`) contain Task Memory Logs for each Stage. Workers create the directory when writing their first Task Memory Log for that Stage.

**Task Memory Logs** are structured logs written by Workers after Task completion. They capture outcome status, validation results, deliverables, and flags.

**Handoff Memory Logs** (`Handoffs/<AgentID>_Handoffs/`) are logs created during Handoff containing working context not captured elsewhere.

**Working notes** are ephemeral coordination context maintained by the Manager and User within Memory Root. Contents include User preferences, coordination insights, and other context not captured in the Project Tracker. Working notes are inserted and removed as context evolves - they are not permanent records.

### 5.2 Interactions

Both the Manager and Workers interact with the Memory System and its components at various parts of the workflow:

1. The Manager initializes Memory Root and populates the Project Tracker (task tracking with Stage 1 Tasks, agent tracking with all Workers, version control state) during session 1.
2. Workers create Task Memory Logs after each Task completion.
3. The Manager updates Task tracking after each Task Review: completed Tasks, readiness changes, merge state.
4. The Manager appends a stage summary to Memory Root after all Tasks in a Stage complete.
5. Outgoing agents create Handoff Memory Logs during Handoff.

### 5.3 Task Memory Log Flags

Workers set flags based on what they observe during execution. The Manager interprets these flags with full project awareness:

| Flag | Interpretation |
| ---- | -------------- |
| `important_findings` | The Worker observed something potentially beyond the Task's scope. The Manager assesses whether it affects planning documents or other Tasks. |
| `compatibility_issues` | The Worker observed dependency or system conflicts. The Manager assesses whether this indicates issues with the Implementation Plan, Specifications, or Execution Standards. |

When uncertain whether a finding warrants a flag, Workers set it to true. False negatives harm coordination more than false positives.

### 5.4 Task Outcome Status

Task outcome status reflects whether the objective was achieved:

| Status | Definition |
| ------ | ---------- |
| Success | Objective achieved, all validation passed |
| Partial | Some execution or validation succeeded, some failed; the Worker needs guidance to continue |
| Failed | The Worker attempted but could not succeed; the issue is within scope but beyond resolution |
| Blocked | External factors outside the Worker's scope or authority prevent progress |

---

## 6. Procedures

### 6.1 Context Gathering

The Planner gathers project requirements through three progressive rounds of questions, deriving technical formalization from natural User responses rather than asking Users to produce technical content directly:

**Round 1 - Existing Materials and Vision.** Project type, problem, scope, skills, existing documentation, current vision.

**Round 2 - Technical Requirements.** Design decisions and constraints, work structure, dependencies, technical requirements, validation criteria.

**Round 3 - Implementation Approach and Quality.** Technical constraints, workflow preferences, quality standards, coordination needs, domain organization, design decisions and constraints, finalizing Specifications and Execution Standards.

Each round follows an iteration cycle: ask initial questions, assess gaps after each response, follow up until understanding is complete, present a round summary, advance. When User responses reference codebase elements, the Planner proactively explores before continuing - subagent usage is encouraged to avoid context bloat. The Planner captures validation criteria for each requirement, proposing concrete measures when the User does not specify them.

After all rounds, the Planner presents a consolidated understanding summary for User review. Modifications loop back through targeted follow-ups. User approval triggers transition to Work Breakdown.

### 6.2 Work Breakdown

The Planner decomposes gathered context into planning documents through visible reasoning - thinking is presented in chat before file output. The User sees decomposition decisions and can redirect before artifacts are written.

**Sequence:**

1. **Specifications Analysis** - Analyze design decisions, write Specifications, present for User approval.
2. **Implementation Plan Analysis** - Identify work domains and Workers, identify all Stages with objectives and Tasks, complete detailed Task breakdown per Stage (objective, output, validation, guidance, dependencies, steps), assess workload distribution, review cross-agent dependencies, generate the dependency graph, present for User approval.
3. **Execution Standards Analysis** - Extract universal execution patterns, write the APM standards block, present for User approval.

**Task decomposition principles.** Each Task produces a meaningful deliverable with clear boundaries, scoped to a single Worker's domain, with specified validation criteria (programmatic, artifact, or user-based). Steps within Tasks support failure tracing but have no independent validation. Subagent steps are included when investigation or research is needed. Decomposition granularity adapts to project size and complexity - smaller projects warrant lighter breakdown.

### 6.3 Task Assignment

The Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them via the Task Bus.

**Dispatch assessment** - The Manager identifies Ready Tasks from the Project Tracker in Memory Root, groups them by Worker, and forms dispatch units. Three dispatch modes exist:

| Mode | Description | Prerequisites |
| ---- | ----------- | ------------- |
| Single | One Task dispatched to one Worker | Task is Ready |
| Batch | Multiple Tasks dispatched to the same Worker in one message | Tasks form a sequential chain or are independent same-Worker Tasks all Ready simultaneously |
| Parallel | Dispatch units sent to different Workers simultaneously | No unresolved cross-agent dependencies; version control workspace isolation |

**Intelligent waiting** - Before dispatching a ready unit, the Manager checks whether a pending report would unlock Tasks that combine well with the current unit. If waiting costs little and a plausible combination exists, the Manager may wait. If multiple reports are pending or no beneficial combination is plausible, the Manager dispatches immediately.

**Wait state** - When no Tasks are Ready but Workers are active, the Manager communicates what was processed, what is pending, and what the User should do next

**Per-Task analysis** - For each Task, the Manager synthesizes content from three sources into the Task Prompt: dependency context (familiarity classification, producer Task Memory Log content when applicable, integration guidance), relevant Specification content (design decisions and constraints for this Task, extracted inline), and Implementation Plan Task fields (objective, steps, guidance, output, validation criteria). Execution Standards are not included in Task Prompts - Workers read `{AGENTS_FILE}` directly and the Task Prompt assumes those standards are in effect. Dependency context depth depends on Worker familiarity with the producer's work. Same-agent dependencies receive light context: recall anchors and file paths. Cross-agent dependencies receive comprehensive context: file reading instructions, output summaries, and integration guidance. After a Worker Handoff, previous-Stage same-agent dependencies become cross-agent because the incoming Worker lacks that working context. The Manager traces dependency chains upstream when ancestors established patterns, schemas, or contracts the current Task must follow. Specification content is extracted inline - the Manager never references Specifications or the Implementation Plan by path in Task Prompts.

**Task Prompt construction** - The Manager assembles each Task Prompt as a self-contained document with metadata (Stage, Task, agent identifier, memory log path, dependency indicator) and a body containing the Task objective, dependency context, detailed instructions, expected output, validation criteria, and reporting instructions. For parallel dispatch, the Task Prompt includes the workspace path where the Worker operates. Workers commit to their assigned branch and note the workspace in their Task Memory Log.

**Dispatch delivery** - For each dispatch, the Manager writes to the Worker's Task Bus and directs the User to the Worker's session with specific action guidance. For uninitialized Workers, the Manager directs the User to create a new session and initialize with the agent identifier; for initialized Workers, to deliver the Task Prompt. For batch dispatch, the Manager summarizes what the Worker will receive. For parallel dispatch, the Manager lists each Worker session with its required action. Parallel dispatch may contain any combination of single or batch dispatch for multiple Workers concurrently.

**Follow-up Task Prompts** - When a Task Review determines retry is needed, the Manager issues a follow-up. The follow-up is a new Task Prompt with objective, instructions, output, and validation refined based on what went wrong. It uses the same memory log path as the original (the Worker overwrites the previous log) and includes context explaining the issue and required refinement.

### 6.4 Task Execution

The Worker executes Task instructions, validates results, iterates if needed, logs the outcome, and reports back.

**Worker registration** - A Worker binds to an agent identity during session initiation by resolving the provided agent identifier against `.apm/bus/` directory names. This identity persists across the session. The Task Prompt's agent identifier field is used for cross-validation, not identity binding.

**Execution flow** - The Worker integrates dependency context if present, executes steps sequentially, then validates per the Task Prompt's validation criteria. Validation follows a fixed order: automated checks first, then output verification, then user approval if specified. When validation fails, the Worker corrects and re-validates until Success or a stop condition is reached. Stop conditions: same error three or more times, fixes causing new issues, or the issue requires external resolution.

**Batch execution** - When receiving a batch of Tasks, the Worker executes them sequentially. After each Task, a Task Memory Log is written immediately before proceeding to the next. If any Task results in a Failed or Blocked status, execution stops. After completing all Tasks (or stopping on failure), the Worker writes a batch Task Report to the Report Bus containing outcomes for each Task.

**Subagent usage** - When a Task includes subagent steps, the Worker spawns the relevant subagent. Findings are integrated into the Worker's context and reflected during execution.

**Completion** - After execution, the Worker commits work to the assigned branch if VC is implemented, writes a Task Memory Log, clears the incoming bus file, writes a Task Report to the Report Bus, and directs the User to deliver the report - providing both the targeted command with agent identifier and the general command, since multiple Workers may finish concurrently.

### 6.5 Task Review

The Manager reviews Worker results, determines review outcomes, modifies planning documents when needed, and updates Task tracking in Memory Root.

**Report processing** - The Manager reads the Task Report from the Report Bus. For batch reports, each Task's outcome is processed individually. Unstarted Tasks from a stopped batch re-enter the dispatch pool.

**Handoff detection** - An incoming Worker (post-Handoff) indicates in its first Task Report that it is a new instance and lists the specific Task Memory Logs it loaded during Handoff initialization and notes that previous-Stage logs were not loaded. When the Manager detects this, it verifies the Handoff Memory Log exists, compares the loaded logs against all Tasks previously completed by this Worker, and records cross-agent overrides in the Project Tracker for any completed Tasks whose logs were not loaded. The Manager checks these overrides during future Task Assignments to determine dependency context depth.

**Log review** - The Manager reads the Task Memory Log, interprets status, flags, and body content. Consistency between claimed status and actual content is assessed; inconsistency is a hallucination indicator.

**Review outcome** - If the log shows Success with no flags and the content supports the status, the Manager proceeds to the next Task. If something needs attention (flags raised, non-Success status, or inconsistencies), the Manager investigates. For small-scope issues, the Manager self-investigates. For large-scope issues (context-intensive, systemic, multi-Task impact), the Manager uses a subagent. When scope is unclear, prefer subagent to preserve Manager context. After investigation, three outcomes are possible: no issues found (proceed to next Task), follow-up needed (issue a follow-up Task Prompt), or planning document modification needed (assess cascade per §3.4 Document Modification, determine authority, execute or collaborate with User). When investigation of a later Task reveals deficiencies in previously-Done work, the Manager creates a new Task through plan modification rather than reopening the original — Done is terminal per `TERMINOLOGY.md` §4. Every outcome path ends with updating Task tracking.

**Parallel report handling** - During parallel dispatch, reports arrive asynchronously. The Manager processes each as it arrives, completes the review, merges the completed Task's branch before dispatching dependent Tasks, reassesses readiness, and dispatches newly Ready Tasks, all in a single turn.

**Stage summary** - After all Tasks in a Stage complete, the Manager reviews the Stage's Task Memory Logs and appends a stage summary to Memory Root capturing Stage-level outcomes, agents involved, notable findings, and references to individual logs.

### 6.6 Handoff

Handoff transfers context between sessions of the same agent when context window limits approach. It applies to the Manager and Workers only - the Planner operates in a single session. Handoff is User-initiated: the User provides the command when they observe context pressure or the agent signals it.

**Eligibility** - An agent can Handoff at any point (mid-Task, between Tasks, while awaiting reports) as long as the handoff prompt captures comprehensive current state.

**Two artifacts** - Handoff produces two artifacts with distinct purposes:

| Artifact | Location | Content | Lifecycle |
| -------- | -------- | ------- | --------- |
| Handoff prompt | Handoff Bus | Current state: outstanding Tasks, mid-Task progress, pointers to logs and files | Ephemeral; cleared after incoming agent processes it |
| Handoff Memory Log | Memory System | Past actions: working context, decisions made, approaches tried | Persistent archival context |

**Worker and Manager asymmetry** - Workers and the Manager have different Handoff characteristics due to their bus clearing behavior. A mid-Task Worker Handoff occurs while the Task Bus still contains the original Task Prompt (the bus has not been cleared yet); the handoff prompt references the intact Task Prompt directly. A between-Tasks Worker Handoff occurs after the Task Bus was cleared; the handoff prompt states readiness to await the next Task. A Manager Handoff must describe outstanding Tasks in full because Workers may have already cleared their Task Buses.

**Context rebuilding** - An incoming Manager reads Memory Root stage summaries, the Handoff Memory Log, and relevant recent Task Memory Logs to reconstruct working context. An incoming Worker reads the Handoff Memory Log and current-Stage Task Memory Logs only. The Manager accounts for this limited context in future Task Prompts by treating previous-Stage same-agent dependencies as cross-agent.

---

## 7. Subagent Usage

Subagents are platform-native spawned agents used for isolated, focused work. APM defines behavioral expectations; the platform handles subagent lifecycle and tool access. Users may also use their own custom subagent configurations.

Two common behavioral types exist: debug subagents (full access - editing, terminal) for isolating and resolving complex bugs, and research subagents (read-only, with web access) for investigating knowledge gaps. These are expectations, not a closed set - platforms and Users may provide additional types.

Subagents are spawned through platform-native tools. The build pipeline's placeholder system replaces subagent guidance placeholders with platform-specific invocations at build time, keeping templates platform-agnostic. The spawning agent structures a Task description and passes it to the platform's subagent mechanism.

Debug subagents are appropriate when a bug resists initial fix attempts, spans multiple components, or debugging would consume significant agent context. Research subagents are appropriate when current knowledge is outdated, documentation needs verification, or codebase exploration is needed. Findings are integrated into the spawning agent's context. Workers log subagent usage in their Task Memory Log.

---

## 8. Implementation Reference

| Spec Section | Implementation Files |
| ------------- | --------------------- |
| §2.1 Planning Phase | `commands/apm-1-initiate-planner.md`, `guides/context-gathering.md`, `guides/work-breakdown.md` |
| §2.2 Implementation Phase | `commands/apm-2-initiate-manager.md`, `commands/apm-3-initiate-worker.md` |
| §3 Planning Documents | `apm/Specifications.md`, `apm/Implementation_Plan.md` |
| §4 Communication System | `skills/apm-communication/SKILL.md` (§4.1 communication models, §4.2-§4.3 bus system), `commands/apm-4-check-tasks.md`, `commands/apm-5-check-reports.md` |
| §5 Memory System | `apm/Memory/Memory_Root.md`, `guides/task-logging.md` |
| §6.1 Context Gathering | `guides/context-gathering.md` |
| §6.2 Work Breakdown | `guides/work-breakdown.md` |
| §6.3 Task Assignment | `guides/task-assignment.md` |
| §6.4 Task Execution | `guides/task-execution.md` |
| §6.5 Task Review | `guides/task-review.md` |
| §6.6 Handoff | `commands/apm-6-handoff-manager.md`, `commands/apm-7-handoff-worker.md` |
| §7 Subagent Usage | Platform-specific (build pipeline placeholders) |

---

**End of Workflow Specification**
