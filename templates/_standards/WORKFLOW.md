# APM Workflow

This document is the formal specification of the APM workflow. It defines phases, procedures, protocols, and decision models that govern how Agents coordinate to deliver project outcomes. All guides and commands derive their behavior from this specification.

Terms used here are defined in `TERMINOLOGY.md`. Structural patterns follow `STRUCTURE.md`. Writing conventions follow `WRITING.md`.

---

## 1. Design

APM is a multi-agent project management framework that coordinates Agent Sessions through file-based communication and structured Coordination Artifacts. The framework operates on these principles:

**User-mediated coordination.** The User initiates Agent Sessions, carries Bus Files between sessions via the Message Bus (markdown files in `.apm/bus/`), approves key decisions, and triggers Handoffs. All inter-agent communication occurs through file-based coordination rather than direct programmatic connection. This user-mediated model works universally across tools and environments without requiring platform-specific integrations.

**Platform agnosticism.** Core concepts (Message Bus, Memory System, Coordination Artifacts) are platform-independent. Platform-specific capabilities are additive and delivered through the build pipeline's conditional placeholder system.

**Context scoping.** Each Agent operates with intentionally scoped context. Workers receive only Task Prompts and their accumulated working context. The Manager holds coordination-level context and only when requested dives into execution-level. The Planner holds full initial project context during planning but does not intervene during coordination or execution. This scoping prevents context overload and keeps Agents focused.

**Structured memory.** The Memory System captures project history in a hierarchical structure that enables Handoff continuity and efficient progress tracking. As the project evolves, this archive provides rich context for coordination decisions and future reference.

---

## 2. Roles

### 2.1 Planner Agent

Single instance, single Session. Responsible for the Planning Phase: transforming User requirements into Coordination Artifacts through Context Gathering and Work Breakdown. Does not participate in the Implementation Phase.

### 2.2 Manager Agent

Single instance, multiple Sessions via Handoff. Responsible for coordination and orchestration during the Implementation Phase. Assigns Tasks, reviews results, maintains Coordination Artifacts and the Memory System. Does not execute implementation work unless explicitly directed by the User.

### 2.3 Worker Agent

Multiple instances (one per domain defined in the Implementation Plan), multiple Sessions each via Handoff. Responsible for Task Execution. Workers operate with scoped context: they receive Task Prompts, interact with the workspace and have access to the Standards file, but not to the Implementation Plan, Specifications, or Memory System - apart from their own Task Memory Logs.

### 2.4 Agent Sessions

An Agent Session is a continuous execution context. Sessions are initiated by the User. The Planner has one Session. The Manager and Workers have multiple Sessions, incrementing on Handoff. Format: `[Agent Name] Session [N]`.

---

## 3. Phases

### 3.1 Planning Phase

The Planner Agent transforms User requirements into Coordination Artifacts. Two procedures execute sequentially:

1. **Context Gathering** — elicits requirements through structured Question Rounds, produces an Understanding Summary.
2. **Work Breakdown** — decomposes gathered context into Specifications, Implementation Plan, and Standards.

The Planning Phase concludes when the User approves all Coordination Artifacts. Control transfers to the User, who initiates the Manager Agent to begin the Implementation Phase.

### 3.2 Implementation Phase

The Manager and Worker Agents transform the Implementation Plan into completed deliverables. The phase operates through the Coordination Cycle:

1. **Task Assignment** — Manager assesses readiness, determines dispatch mode, constructs Task Prompts, delivers via Send Bus.
2. **Task Cycle(s)** — Worker's execution loop. Each Task Cycle includes: receiving Task Prompt, Task Execution (execute instructions, validate results, iterate if needed), logging to Task Memory Log, and writing Task Report to Report Bus. Multiple Task Cycles may occur within a single Coordination Cycle when parallel or batch dispatch is used.
3. **Task Review** — Manager reviews Task Report(s) and Task Memory Log(s), makes a Coordination Decision.

The Coordination Cycle repeats per Task(s). After all Tasks in a Stage complete, the Manager creates a Stage Summary. After all Stages complete, the Manager presents a Project Completion summary.

Supporting procedures run as needed within the cycle:
- **Version Control** — Manager initializes and coordinates version control for workspace isolation during parallel dispatch.
- **Handoff** — Context transfer between Sessions of the same Agent when context window limits approach.

---

## 4. Communication System

### 4.1 Message Bus

The Message Bus is a file-based communication system in `.apm/bus/`. The Manager initializes it during Session 1. Each Worker has an Agent Channel (subdirectory) containing their Bus Files. The Manager has a channel for its Handoff Bus only. Operational procedures for Bus initialization and message delivery are defined in the communication skill.

### 4.2 Bus File Types

| Bus File | Direction | Contains |
|----------|-----------|----------|
| Send Bus | Manager → Worker | Task Prompts (single or batched) |
| Report Bus | Worker → Manager | Task Reports or Batch Reports |
| Handoff Bus | Outgoing → Incoming Agent | Handoff Prompts |

### 4.3 Clear-on-Return Protocol

Before writing to an outgoing Bus File, an Agent clears its incoming Bus File. This prevents stale messages from accumulating and signals that the previous message was processed.

### 4.4 Communication Flow

1. Manager writes Task Prompt to Worker's Send Bus.
2. User references the Send Bus file in the Worker's session.
3. Worker executes, logs, writes Task Report to Report Bus.
4. User references the Report Bus file in the Manager's session.
5. Manager reviews and makes Coordination Decision.

The User is the message carrier at every boundary - there is no direct Manager-Worker communication.

---

## 5. Memory System

### 5.1 Structure

The Memory System resides in `.apm/Memory/` with this hierarchy:

- **Memory Root** (`Memory_Root.md`) — Central project state. Contains Handoff count, Dispatch State, Working Notes, and Stage Summaries.
- **Dispatch State** (section within Memory Root) — Tracks task statuses, agent assignments, active branches, and merge state per Stage. Updated by the Manager after each review cycle.
- **Stage Directories** (`Stage_<N>_<Slug>/`) — Contain Task Memory Logs for each Stage. Created by the Worker when writing their first Task Memory Log for that Stage.
- **Task Memory Logs** — Structured logs written by Workers after Task completion. Capture status, validation results, deliverables, and flags.
- **Handoff Memory Logs** (`Handoffs/<AgentID>_Handoffs/`) — Logs created during Handoff containing working context not captured elsewhere.

### 5.2 Lifecycle

1. **Initialization** — Manager initializes Memory Root during Session 1.
2. **Dispatch State Initialization** — Manager populates Dispatch State with Stage 1 tasks during Session 1.
3. **Task Logging** — Workers create Task Memory Logs after each Task completion.
4. **Dispatch State Update** — Manager updates Dispatch State after each review cycle: completed tasks, readiness changes, merge state.
5. **Stage Summary** — Manager appends Stage Summary to Memory Root after all Tasks in a Stage complete.
6. **Handoff Logging** — Outgoing Agent creates Handoff Memory Log during Handoff.

### 5.3 Task Memory Log Flags

Workers set flags based on scoped observations. The Manager interprets these with full project awareness:

| Flag | Meaning | Manager Action |
|------|---------|----------------|
| `important_findings` | Worker observed something potentially beyond its Task scope | Assess whether it affects Coordination Artifacts or other Tasks |
| `compatibility_issues` | Worker observed conflicts with existing systems or with Task's dependencies | Assess whether it indicates Implementation Plan, Specification, or Standards issues |

### 5.4 Task Status Values

| Status | Definition |
|--------|------------|
| Success | Task objective achieved, all validation passed |
| Partial | Some execution/validation succeeded, some failed |
| Failed | Most or all execution/validation failed |
| Blocked | Serious blockers that the Worker lacks scope or authority to address |

---

## 6. Coordination Artifacts

### 6.1 Hierarchy

| Level | Artifact | Purpose | Location |
|-------|----------|---------|----------|
| Architectural | Specifications | Define what is being built | `.apm/Specifications.md` |
| Coordination | Implementation Plan | Define how work is organized | `.apm/Implementation_Plan.md` |
| Execution | Standards | Define how work is performed | `AGENTS.md` (or `CLAUDE.md`) at workspace root |
| Operational | Memory System | Track project state and execution history | `.apm/Memory/` |

### 6.2 Specifications

Project-specific design decisions and constraints. Free-form markdown structure determined by project needs. Informs the Implementation Plan. Workers do not have direct access — the Manager extracts relevant content into Task Prompts and updates it as needed during the Implementation Phase.

### 6.3 Implementation Plan

Stage and Task breakdown with Agent assignments, Dependency Graph, and validation criteria. Contains:

- **Header** — Project name, overview, Agents, Stages, Dependency Graph (mermaid).
- **Stages** — Milestone groupings containing Tasks.
- **Tasks** — Discrete work units with Objective, Output, Validation, Guidance, Dependencies, and Steps.

The **Dependency Graph** is a mermaid diagram generated by the Planner during Work Breakdown. It visualizes Task dependencies and Agent assignments, enabling the Manager to identify batch candidates, parallel dispatch opportunities, and critical path bottlenecks. The Manager updates the Dependency Graph when significant plan modifications occur during Task Review.

**Task Dependencies** are listed in each Task's Dependencies field. Cross-Agent Dependencies (between different Workers) are bolded for visual distinction.

The Implementation Plan is not accessed by the Workers - the Manager extracts relevant Task contents creating Task Prompts accordingly and updates it as needed during the Implementation Phase.

### 6.4 Standards

Universal execution patterns applied during Task Execution. Stored in the APM_STANDARDS block within the Standards file. Content outside this block is user-managed and preserved. If relevant standards already exist outside the block, the APM_STANDARDS block references them rather than duplicating. All Agents have direct access to this file, and both the Manager and Worker may update it during the Implementation Phase.

### 6.5 Cascade Patterns

Specifications and Implementation Plan have bidirectional influence — Specification changes may require Implementation Plan adjustments and vice versa. Standards are generally isolated from architecture and coordination-level artifacts. When modifying any artifact, the Manager assesses cascade implications before executing changes and proceeds accordingly to ensure coherence.

---

## 7. Procedures

### 7.1 Context Gathering

**Agent:** Planner. **Phase:** Planning.

The Planner elicits project requirements through three Question Rounds, each focused on progressive discovery:

1. **Round 1 — Existing Materials and Vision.** Project type, problem, scope, skills, existing documentation, current vision.
2. **Round 2 — Technical Requirements.** Work structure, dependencies, technical requirements, emerging Specifications and Standards, validation criteria.
3. **Round 3 — Implementation Approach and Quality.** Technical constraints, workflow preferences, quality standards, coordination needs, domain organization, finalizing Specifications and Standards.

**Iteration within rounds.** Each round follows an iteration cycle: ask initial questions, assess gaps after each response, follow up until round understanding is complete, present round summary, advance.

**Exploration on signal.** When User responses reference codebase elements or documentation, the Planner proactively explores to gather concrete information before continuing questions. Research Subagent use is encouraged to avoid consuming the Planner's context window during exploration.

**Validation criteria gathering.** The Planner captures success states and criteria for each requirement. If the User does not specify how a requirement will be validated, the Planner proposes concrete measures. Criteria are categorized by Validation Type (Programmatic, Artifact, User) during Context Finalization.

**Context Finalization.** After all rounds, the Planner presents an Understanding Summary for User review. Modifications loop back through targeted follow-ups. User approval triggers transition to Work Breakdown.

### 7.2 Work Breakdown

**Agent:** Planner. **Phase:** Planning.

The Planner decomposes gathered context into Coordination Artifacts through a forced Chain-of-Thought methodology — reasoning is presented in chat before file output.

**Procedure sequence:**

1. **Specifications Analysis** — Analyze design decisions across universal dimensions (scope, entities, behaviors, relationships, constraints, interfaces). Write Specifications. Present for User review. Modification requests are applied and updated Specifications are presented again for review until approval to proceed.
2. **Implementation Plan Header** — Set project name, overview.
3. **Domain Analysis** — Identify logical work domains, define initial Worker Agents.
4. **Stage Analysis** — Identify all Stages with objectives and Tasks upfront.
5. **Stage Cycles** — For each Stage, complete detailed Task breakdown (objective, output, validation, guidance, dependencies, steps). Append Stage contents to Implementation Plan.
6. **Plan Review** — Assess workload distribution (flag Agents with 8+ tasks for subdivision). Review Cross-Agent Dependencies. Generate Dependency Graph. Present for User review. Modification requests are applied and the updated Implementation Plan is presented again for review until approval to proceed.
7. **Standards Analysis** — Extract universal execution patterns. Write APM_STANDARDS block. Present for User review. Modification requests are applied and the updated Standards are presented again for review until approval to proceed.

**Task decomposition principles:**
- Each Task produces a meaningful deliverable with clear boundaries.
- Tasks are scoped to a single Agent's domain.
- Validation criteria are specified per Task with type (Programmatic, Artifact, User).
- Steps within Tasks support failure tracing but have no independent validation.
- When investigation or research is needed within a Task, include a Subagent step.

**Scope adaptation.** Decomposition granularity adapts to project size, complexity and other factors. Stages, Tasks, and Steps are relative concepts — smaller projects warrant lighter breakdown and larger projects might require more detail accordingly.

### 7.3 Task Assignment

**Agent:** Manager. **Phase:** Implementation.

The Manager assesses readiness, determines dispatch mode, constructs Task Prompts, and delivers them via Send Bus. This procedure operates in three parts: dispatch assessment, per-task analysis, and prompt creation.

#### 7.3.1 Dispatch Assessment

Before constructing Task Prompts, the Manager assesses dispatch opportunities:

1. **Identify Ready Tasks** — Read the Dispatch State for current task statuses, cross-reference the Dependency Graph for newly unblocked Tasks.
2. **Group by Worker** — Ready Tasks grouped by assigned Worker Agent.
3. **Assess Batch Candidacy** — For each Worker with multiple Ready Tasks, evaluate whether they may be batched. Candidates form a sequential chain with only internal dependencies and no external Tasks depend on intermediate Tasks in the chain. Soft guidance: 3-4 Tasks per batch. Result: each Worker gets either a single Task, a batch, or remains unscheduled.
4. **Assess Parallel Candidacy** — Across Workers, identify which dispatch units (singles or batches from step 3) may proceed in parallel if no unresolved cross-Worker dependencies exist among them.
5. **Formulate Dispatch Plan** — Determine overall dispatch mode: single Worker, multiple Workers in parallel, or a combination (e.g. one single; one batch; one batch and one single in parallel; two batches in parallel; etc.).

**Parallel dispatch prerequisites.** Before first parallel dispatch, the Manager initializes version control per the VC skill — creating feature branches and worktrees for workspace isolation. The Manager also recommends configuring Worker permissions to minimize approval wait times.

**In-flight tracking.** During parallel dispatch, the Manager tracks which Workers have active Tasks and which Reports are pending in its working context.

**Wait state.** When no Ready Tasks exist but Workers are still active, the Manager communicates what was processed, what is pending, what the User should do when the next Report arrives and waits.

#### 7.3.2 Per-Task Analysis

For each Task in the dispatch plan:

1. **Context Dependency Analysis** — Classify dependencies as Same-Agent (light context: recall anchors, file paths), Cross-Agent (comprehensive context: integration steps, output summaries, explicit file reading instructions), or Handoff-reclassified (prior-Stage Same-Agent Dependencies treated as Cross-Agent after Worker Handoff). Trace upstream chains when ancestors are relevant.
2. **Specification Extraction** — Extract relevant Specification content for contextual integration into the Task Prompt. Never reference Specifications by path — Workers cannot access them.
3. **Implementation Plan Context Extraction** — Extract Task definition fields (objective, steps, guidance, output, validation).

#### 7.3.3 Task Prompt Construction

Assemble the Task Prompt with YAML frontmatter (stage, task, agent_id, memory_log_path, flags) and markdown body (task reference, context from dependencies, objective, detailed instructions, workspace path if applicable, expected output, validation criteria, memory logging instructions, reporting instructions).

**Dispatch delivery** per the communication skill:
- **Single** — Write prompt to Worker's Send Bus.
- **Batch** — Write multiple prompts with batch envelope (YAML frontmatter with batch metadata, prompts separated by delimiters) to Worker's Send Bus.
- **Parallel** — Write to multiple Workers' Send Buses. Inform User of all pending deliveries.

**Workspace instructions.** Included for parallel dispatch per the VC skill. Worker operates in the specified worktree/branch, commits work there, and notes workspace in the Task Memory Log. Workers do not merge — the Manager coordinates merges.

#### 7.3.4 FollowUp Task Prompts

Issued when a Coordination Decision determines retry is needed. A FollowUp Task Prompt is a new prompt with different content — objective, instructions, output, and validation are refined based on what went wrong previously. Uses the same `memory_log_path` as the original (Worker overwrites the previous log). Includes a FollowUp Context section explaining the issue and required refinement.

### 7.4 Task Execution

**Agent:** Worker. **Phase:** Implementation.

The Worker executes Task instructions, validates results, and reports back.

**Worker Registration.** On first Task Prompt, the Worker binds to the Agent identity specified in the prompt's `agent_id` field. This identity persists across the Worker's Session.

**Context Integration.** If included, before executing the Worker reads and integrates dependency context as specified in the Task Prompt's Context from Dependencies section.

**Execution and Validation.** The Worker executes Steps sequentially, then validates per the Task Prompt's Validation Criteria. Validation Types execute in order: Programmatic first, then Artifact, then User. User validation requires pausing for review before proceeding. Many Tasks may have multiple Validation Types.

**Iteration Cycle.** When validation fails, the Worker corrects and re-validates. This cycle repeats until success or a stop condition (Blocked/Failed Task Status).

**Batch Execution.** When receiving a batch, the Worker parses all Task Prompts and validates agent_id. For each Task in the batch, the Worker executes sequentially, writes a Task Memory Log immediately after, then proceeds to the next Task. If any Task results in Blocked or Failed status, the Worker stops execution (fail-fast) and reports partial completion. Unstarted Tasks are listed as "Not started (batch stopped)." This immediate logging per Task enables early detection and prevents wasted effort on dependent Tasks.

**Subagent usage.** When a Task includes Subagent steps, the Worker spawns the relevant Subagent per its instructions. Findings are integrated into the Worker's context and reflected during execution.

**Task Logging.** After execution, the Worker writes a structured Task Memory Log at the path specified in the Task Prompt.

**Task Reporting.** After logging, the Worker clears the Send Bus per Clear-on-Return protocol, writes a Task Report (or Batch Report for batch execution) to the Report Bus per the communication skill.

### 7.5 Task Review

**Agent:** Manager. **Phase:** Implementation.

The Manager reviews Worker results, makes Coordination Decisions, modifies Coordination Artifacts when needed, and maintains project state through the Dispatch State.

#### 7.5.1 Report Processing and Log Review

1. Read the Report from the Report Bus. Clear per Clear-on-Return protocol.
2. If Batch Report, process each Task's outcome individually and sequentially.
3. Check for Worker Handoff indication. If detected, verify the Handoff Memory Log exists, update Context Dependency treatment: previous-Stage Same-Agent Dependencies for that Worker are reclassified as Cross-Agent.
4. Update dispatch tracking — note Worker as available, note completed Tasks for readiness reassessment.
5. If parallel dispatch active, merge the completed Task's branch per the VC skill before dispatching dependent Tasks. Reassess Ready Tasks and dispatch if possible, wait for next Report otherwise.
6. Read the Task Memory Log referenced in the Task Report. Interpret status, flags, and body sections. Assess whether status and flags are consistent with log content.

#### 7.5.2 Coordination Decision

Review the Task Memory Log. If everything looks good — Success with no flags, log content supports the status — **Proceed**. If something needs attention — flags raised, non-Success status, or inconsistencies — **Investigate**.

**Investigation scope.** Small scope (few files, straightforward verification, contained to this Task) → Manager self-investigates. Large scope (context-intensive debugging/research, systemic issues, impacts multiple Tasks) → Subagent. Default: when scope is unclear, prefer Subagent to preserve Manager context.

**Post-investigation outcome:**
- *No issues* → **Proceed** — update Dispatch State, check Stage completion, dispatch next Task(s).
- *FollowUp needed* → Create FollowUp Task Prompt, update Dispatch State.
- *Artifact modification needed:*
  - *Cascade:* Assess affected artifacts, analyze cascade implications (Specifications ↔ Implementation Plan are bidirectional; Standards isolated).
  - *Authority:* Determine scope — bounded Manager authority vs User collaboration for significant changes.
  - *Execute:* Modify artifacts, verify consistency, document with Last Modification attribution. Update Dependency Graph when Implementation Plan Tasks change.
  - *Post-modification:* Update Dispatch State, reassess readiness against updated plan.

**Dispatch State update.** Every outcome path ends with updating the Dispatch State section in Memory Root: completed tasks, readiness changes, merge state. When all Tasks in a Stage are Done and merged, the Stage collapses to a single "Complete" line.

**Batch Report handling.** Each completed Task in a batch is reviewed independently through the Coordination Decision. Unstarted Tasks from a stopped batch re-enter the dispatch pool.

**Parallel report handling.** Reports arrive asynchronously. The Manager processes each as it arrives, makes Coordination Decision, reassesses readiness, and dispatches newly Ready Tasks if any.

#### 7.5.3 Stage Summary and Memory State

**Stage Summary Creation.** After all Tasks in a Stage complete, the Manager reviews all Task Memory Logs for the Stage and appends a Stage Summary to Memory Root. Summaries capture Stage-level outcomes, reference individual logs, and note cross-cutting observations.

**Working Notes.** The Manager and User may maintain Working Notes in Memory Root for ephemeral coordination context — Coordination Decision rationale, User directives, cross-Task observations. Working Notes are inserted and removed as context evolves; they are not permanent records like Stage Summaries.

**Memory Root Initialization.** During Session 1, the Manager updates Memory Root with the project name, confirms Handoff count is 0, and populates the Dispatch State with Stage 1 tasks.

### 7.6 Handoff

**Agents:** Manager, Worker. **Phase:** Implementation.

Handoff transfers context between Sessions of the same Agent when context window limits approach. The Planner does not perform Handoff (single Session).

**Eligibility.** The Manager may only Handoff when no outstanding dispatches exist — all Reports from active Workers must be collected first. Workers may Handoff between Tasks; if during Task Execution, they must include their current execution context in detail in their Handoff Memory Log.

**Handoff is User-initiated.** The User provides the Handoff command when they observe context pressure or the Agent signals it.

**Outgoing Agent actions:**
1. Create Handoff Memory Log capturing working context not recorded elsewhere, including current execution context if during Task Execution and VC state (active branches, worktrees, pending merges) if applicable.
2. Write Handoff Prompt to Handoff Bus instructing the Incoming Agent on Context Reconstruction.

**Incoming Agent actions:**
1. Follow Handoff Prompt to read Handoff Memory Log and relevant Task Memory Logs.
2. Reconstruct working context and resume from where the Outgoing Agent left off.

**Context Reconstruction scope:**
- Incoming Manager reads Memory Root Stage Summaries, Handoff Memory Log, and relevant recent Task Memory Logs.
- Incoming Worker reads current-Stage Task Memory Logs for their Agent. Previous-Stage logs are not loaded for efficiency — the Manager accounts for this when constructing future Task Prompts.

---

## 8. Subagent Usage

Subagents are platform-native spawned agents for isolated, focused work. APM does not control the subagent ecosystem — it defines behavioral expectations and relies on the platform to handle subagent lifecycle and tool access. Users may also use their own custom subagent configurations alongside the ones APM expects.

### 8.1 Subagent Types

The workflow defines two behavioral types used at specific points. These are expectations, not a closed set — platforms and Users may provide additional subagent types as needed.

| Type | Purpose | Expected Access | Spawned By |
|------|---------|-----------------|------------|
| Debug Subagent | Isolate and resolve complex bugs | Full (edit, terminal) | Worker, Manager |
| Research Subagent | Investigate knowledge gaps using current sources | Read-only, web | Worker, Manager, Planner |

### 8.2 Spawning Mechanism

Subagents are spawned through platform-native tools. The build pipeline's placeholder system replaces subagent guidance placeholders in templates with platform-specific tool invocations at build time (e.g., `{PLANNER_SUBAGENT_GUIDANCE}` resolves to the target platform's spawn syntax and tool name). This keeps templates platform-agnostic while producing platform-correct output. The spawning Agent structures a task description and passes it as the prompt parameter per the resolved instructions.

### 8.3 When to Use

- **Debug Subagent** — Bug resists initial fix attempts (2-3 failed corrections), issue spans multiple components, or debugging would consume significant Agent context.
- **Research Subagent** — Current knowledge is outdated or uncertain, official documentation needs verification, knowledge gap cannot be resolved through User clarification, codebase exploration is required, or context reconstruction spans multiple files.

Subagent findings are integrated into the spawning Agent's context and reflected during execution. Workers log Subagent usage in their Task Memory Log.

---

## 9. User Interaction Model

### 9.1 User as Message Carrier

The User carries Bus Files between Agent Sessions. After the Manager writes to a Send Bus, the User references that file in the Worker's session. After the Worker writes to a Report Bus, the User references that file in the Manager's session. The User decides delivery timing and order.

### 9.2 User-Initiated Actions

| Action | When |
|--------|------|
| Start Planning Phase | User initiates Planner Agent session |
| Start Implementation Phase | User initiates first Manager Agent session |
| Start Worker Session | User initiates Worker Agent sessions |
| Carry messages | User references Bus Files in appropriate sessions |
| Trigger Handoff | User provides Handoff command when context pressure observed |
| Approve artifacts | User reviews and approves Coordination Artifacts during Planning |
| Collaborate on modifications | User provides guidance when artifact modifications, project direction, or general decisions exceed Manager authority |

### 9.3 Approval Checkpoints

Checkpoints where the workflow pauses for explicit User approval:

1. **Specifications approval** — After Planner writes Specifications during Work Breakdown.
2. **Implementation Plan approval** — After Planner completes Implementation Plan during Work Breakdown.
3. **Standards approval** — After Planner writes Standards during Work Breakdown.
4. **Manager understanding confirmation** — After Manager Session 1 initialization summary.
5. **Artifact modification collaboration** — When modifications exceed Manager authority.
6. **User validation** — When Tasks specify User validation type, Workers pause for review.

### 9.4 Parallel Session Management

During parallel dispatch, the User manages multiple Worker sessions simultaneously. The Manager provides all pending Send Bus paths and indicates which sessions need delivery. Reports return as Workers complete — the User carries them to the Manager in any order.

---

**End of Workflow Specification**
