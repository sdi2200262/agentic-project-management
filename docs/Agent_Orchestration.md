---
id: agent-orchestration
slug: /agent-orchestration
sidebar_label: Agent Orchestration
sidebar_position: 7
---

# Agent Orchestration

APM coordinates multiple Agent Sessions through file-based communication and structured memory. This architecture enables Agents to work together without direct programmatic connection, making the workflow platform-agnostic and all interactions auditable.

---

## Agent Relationships

The framework establishes a coordination hierarchy where Agents interact through defined channels:

**Planner ↔ User → Manager**
- Planner creates Coordination Artifacts during Planning Phase
- User reviews, requests modifications if needed and approves, then initializes Manager for Implementation Phase
- No ongoing relationship - Planner completes and exits

**Manager ↔ Workers (via User)**
- Manager assigns tasks by writing Task Prompts to Send Bus files
- User carries Send Bus files to Worker Sessions
- Workers execute tasks and write Task Reports to Report Bus files
- User carries Report Bus files back to Manager
- Manager reviews and makes Coordination Decisions

**Outgoing Agent → Incoming Agent (via User)**
- Outgoing Agent creates Handoff Memory Log and Handoff Prompt
- User initializes new Session and delivers Handoff Prompt
- Incoming Agent reconstructs context and continues work

**All Agents ↔ Coordination Artifacts**
- Planner creates all three Coordination Artifacts
- Manager reads all three, extracts from Specifications and Implementation Plan into Task Prompts, may update all three
- Workers read Standards directly, receive extracted context via Task Prompts, may update Standards

---

## Message Bus

The Message Bus in `.apm/bus/` provides file-based communication between Agent Sessions. The Manager initializes the Bus during Session 1, creating Agent Channels (subdirectories) for each Worker defined in the Implementation Plan.

### Bus File Types

Each Agent Channel contains three Bus Files:

**Send Bus** (`apm-send-to-<agent-slug>.md`)
- Manager writes Task Prompts (single or batched)
- Worker reads to receive assignments
- Direction: Manager → Worker

**Report Bus** (`apm-report-from-<agent-slug>.md`)
- Worker writes Task Reports (single or batched)
- Manager reads to review outcomes
- Direction: Worker → Manager

**Handoff Bus** (`apm-handoff-<agent-slug>.md`)
- Outgoing Agent writes Handoff Prompt
- Incoming Agent reads to reconstruct context
- Direction: Outgoing Agent → Incoming Agent

### Clear-on-Return Protocol

Before writing to an outgoing Bus File, an Agent clears its incoming Bus File. This prevents stale messages from accumulating and signals message processing completion.

Example: Worker clears Send Bus before writing to Report Bus.

### Message Flow

All communication requires User as carrier. For example:

1. Manager writes Task Prompt to Worker's Send Bus
2. User references Send Bus file in Worker Session
3. Worker executes, clears Send Bus, writes Task Report to Report Bus
4. User references Report Bus file in Manager Session
5. Manager reads Report, clears Report Bus, makes Coordination Decision

This user-mediated model works universally across platforms without requiring tool-specific integrations.

---

## Memory System

The Memory System in `.apm/Memory/` tracks project state and execution history through a hierarchical structure. Workers document their work, Managers review logs and track coordination state, and all Agents use this archive for context reconstruction during Handoff.

### Memory Root

**Location:** `.apm/Memory/Memory_Root.md`

Central project state document containing:

- **Handoff Count** - Tracks total handoffs across all Agents for reference
- **Dispatch State** - Task statuses per Stage (Ready, Active, Done, Blocked), agent assignments, active branches, merge state
- **Working Notes** - Ephemeral coordination notes maintained by Manager and User, inserted and removed as context evolves
- **Stage Summaries** - Compressed Stage-level outcomes appended after each Stage completes

The Manager initializes Memory Root during Session 1 and updates it after each Task Review.

### Task Memory Logs

**Location:** `.apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md`

Structured logs created by Workers after Task completion. Each log documents:

- Task status (Success, Partial, Failed, Blocked)
- Validation results per specified criteria
- Deliverables and file changes
- Technical decisions made during execution
- Flags for Manager attention (important_findings, compatibility_issues)

Task Memory Logs serve as context abstraction layer - the Manager reads logs to understand outcomes without reviewing code and other output directly. During Handoff, Incoming Agents read relevant logs to reconstruct context.

Workers create the Stage Directory when writing their first log for that Stage.

### Handoff Memory Logs

**Location:** `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`

Logs created during Handoff capturing working context not recorded elsewhere:

- Effective workflow patterns discovered during execution
- User preferences observed during collaboration
- Undocumented insights about codebase or project
- Current execution context if Handoff occurs mid-task
- Version control state (active branches, worktrees, pending merges)

Incoming Agents read the Handoff Memory Log during context reconstruction to resume seamlessly.

### Memory as Context Archive

As the project progresses, the Memory System becomes a comprehensive archive mapping the Implementation Plan to execution history. This structured mapping enables:

- **Efficient Handoff** - Incoming Agents reconstruct context from Memory Root (if Manager), Handoff Memory Log, and relevant Task Memory Logs rather than full session history
- **Cross-Agent Context** - Workers integrate outputs from other Agents by reading specified Task Memory Logs as instructed in Task Prompts
- **Progress Tracking** - Manager assesses project state by reading Stage Summaries and Dispatch State rather than reviewing all code changes

---

## Context Scoping

APM achieves Agent specialization through intentional context boundaries. Each Agent sees only the information relevant to its role.

### Planner Agent

**Access:**
- User-provided requirements and existing documentation
- Codebase if applicable
- Full project vision during Planning Phase

**Does not access:**
- Memory System (does not exist yet)
- Message Bus (does not exist yet)
- Implementation Phase activities

Single Session, no Handoff.

### Manager Agent

**Access:**
- All Coordination Artifacts (reads, may update)
- Memory System (Memory Root with Dispatch State and Stage Summaries, all Task Memory Logs)
- Message Bus (all Send/Report/Handoff buses)
- Version control state during parallel dispatch

**Does not access:**
- Worker's detailed execution context (reads Task Memory Logs instead of code)
- Task-level implementation details unless investigation requires it or User requests it

Multiple Sessions via Handoff. Each Session continues from where previous left off using Handoff Memory Log and Memory System.

### Worker Agent

**Access:**
- Current Task Prompt (includes extracted Specifications context, instructions, validation criteria)
- Standards file directly
- Accumulated working context from prior same-Agent tasks in current Stage
- Specified Task Memory Logs when Cross-Agent Dependencies exist

**Does not access:**
- Specifications file directly (receives extracted context via Task Prompt)
- Implementation Plan file directly (receives Task definition via Task Prompt)
- Memory Root, Stage Summaries, or Dispatch State
- Other Workers' working context unless explicitly provided in Task Prompt

Multiple Sessions via Handoff. After Handoff, Incoming Worker reads current-Stage Task Memory Logs for their Agent to reconstruct working context.

---

## Handoff Mechanism

When an Agent's context window approaches limits (70-80% capacity), Handoff transfers working context to a fresh instance. This enables sustained project execution beyond single-session capacity.

### Why Handoff Works

Traditional session compaction accumulates noise - debugging attempts, trial-and-error, intermediate reasoning. Handoff filters this noise through structured artifacts:

- **Memory System** preserves execution outcomes and coordination state
- **Handoff Memory Log** preserves working knowledge and undocumented insights

The Incoming Agent inherits clean context without session noise, enabling multiple consecutive handoffs without degradation.

### Handoff Eligibility

**Manager:**
- May only Handoff when no outstanding dispatches exist
- All Reports from active Workers must be collected first
- Clean coordination state required

**Worker:**
- May Handoff between tasks (preferred)
- May Handoff during Task Execution if necessary (must document current execution context in detail in Handoff Memory Log)

### Two-Artifact Handoff System

**Handoff Memory Log**
- Created by Outgoing Agent
- Captures uncommitted knowledge not in formal logs
- Includes working patterns, User preferences, undocumented state, current execution context (if worker), version control state (if manager)

**Handoff Prompt**
- Created by Outgoing Agent, written to Handoff Bus
- Instructs Incoming Agent on context reconstruction
- Specifies which artifacts to read (Handoff Memory Log, relevant Task Memory Logs)
- Includes verification step before resuming operations

### Context Reconstruction

**Incoming Manager reads:**
- All Coordination Artifacts
- Memory Root (Dispatch State, Stage Summaries, Working Notes)
- Handoff Memory Log
- Relevant recent Task Memory Logs

**Incoming Worker reads:**
- Standards file
- Current-Stage Task Memory Logs for their Agent
- Handoff Memory Log

Previous-Stage logs are not loaded for efficiency - the Manager accounts for this by treating prior-Stage Same-Agent Dependencies as Cross-Agent Dependencies (providing file reading instructions in Task Prompts).

---

**Next Steps:**

- See orchestration in action in [Getting Started](Getting_Started.md)
- Understand workflow mechanics in [Workflow Overview](Workflow_Overview.md)
- Learn about Agent responsibilities in [Agent Types](Agent_Types.md)
