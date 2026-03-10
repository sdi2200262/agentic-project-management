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

- Planner creates planning documents during Planning Phase
- User reviews, requests modifications if needed and approves, then initializes Manager for Implementation Phase
- No ongoing relationship - Planner completes and exits

**Manager ↔ Workers (via User)**

- Manager assigns tasks by writing Task Prompts to Task Bus files
- User runs `/apm-4-check-tasks` in Worker Sessions to deliver assignments
- Workers execute tasks and write Task Reports to Report Bus files
- User runs `/apm-5-check-reports` in Manager Session to deliver reports
- Manager reviews and determines review outcome

**Outgoing Agent → Incoming Agent (via User)**

- Outgoing Agent creates Handoff Log and handoff prompt
- User initializes new Session; incoming Agent auto-detects handoff prompt
- Incoming Agent reconstructs context and continues work

**All Agents ↔ Planning Documents**

- Planner creates all three planning documents
- Manager reads all three, extracts from the Spec and Plan into Task Prompts, may update all three
- Workers read Rules directly (via platform's agents file), receive extracted context via Task Prompts, may update Rules

---

## Bus System

The bus system in `.apm/bus/` provides file-based communication between Agent Sessions. The Planner initializes it at the end of the Planning Phase, creating agent directories for each Worker defined in the Plan. The Manager has a bus directory containing only a Handoff Bus.

### Bus File Types

Each Worker's agent directory contains three bus files:

**Task Bus** (`task.md`)

- Manager writes Task Prompts (single or batched)
- Worker reads to receive assignments
- Direction: Manager → Worker

**Report Bus** (`report.md`)

- Worker writes Task Reports (single or batched)
- Manager reads to review outcomes
- Direction: Worker → Manager

**Handoff Bus** (`handoff.md`)

- Outgoing Agent writes handoff prompt
- Incoming Agent reads to reconstruct context
- Direction: Outgoing Agent → Incoming Agent

### Clear-on-Return Protocol

Before writing to an outgoing bus file, an Agent clears its incoming bus file. This prevents stale messages from accumulating and signals message processing completion.

Example: Worker clears Task Bus before writing to Report Bus.

### Message Flow

All communication requires User as trigger puller. For example:

1. Manager writes Task Prompt to Worker's Task Bus
2. User runs `/apm-4-check-tasks` in Worker Session
3. Worker executes, clears Task Bus, writes Task Report to Report Bus
4. User runs `/apm-5-check-reports` in Manager Session
5. Manager reads Report, clears Report Bus, determines review outcome

This user-mediated model works universally across platforms without requiring tool-specific integrations.

---

## Memory

Memory resides in `.apm/` and tracks project state and execution history through a hierarchical structure. Workers document their work, the Manager reviews logs and tracks coordination state, and all Agents use this archive for context reconstruction during Handoff.

### Tracker

**Location:** `.apm/tracker.md`

Live project state document containing:

- **Task tracking** - Task statuses per Stage (Waiting, Ready, Active, Done), agent assignments, active branches, merge state; updated by Manager after each Task Review
- **Agent tracking** - Agent identifiers, session numbers, and notes; updated when agents are dispatched to or Handoffs are detected
- **Version control state** - Base branch, branch convention, active branches, pending merges
- **Working notes** - Ephemeral coordination notes maintained by Manager and User, inserted and removed as context evolves

The Manager populates the Tracker during Session 1 and updates it after each Task Review.

### Index

**Location:** `.apm/memory/index.md`

Durable project memory containing:

- **Memory notes** - Persistent observations and patterns with lasting value, placed first so incoming Managers encounter durable knowledge immediately
- **Stage summaries** - Stage-level outcomes appended after each Stage completes

The Manager initializes the Index during Session 1 and appends stage summaries as Stages complete.

### Task Logs

**Location:** `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md`

Structured logs created by Workers after Task completion. Each log documents:

- Task status (Success, Partial, Failed, Blocked)
- Validation results per specified criteria
- Deliverables and file changes
- Technical decisions made during execution
- Flags for Manager attention (important_findings, compatibility_issues)

Task Logs serve as context abstraction layer - the Manager reads logs to understand outcomes without reviewing code and other output directly. During Handoff, incoming Agents read relevant logs to reconstruct context.

Workers create the stage directory when writing their first log for that Stage.

### Handoff Logs

**Location:** `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md`

Logs created during Handoff capturing working context not recorded elsewhere:

- Effective workflow patterns discovered during execution
- User preferences observed during collaboration
- Undocumented insights about codebase or project
- Current execution context if Handoff occurs mid-task
- Version control state (active branches, worktrees, pending merges)

Incoming Agents read the Handoff Log during context reconstruction to resume seamlessly.

### Session Archives

**Location:** `.apm/archives/`

Archived sessions preserved for future reference. Each archive contains the session's planning documents, Tracker, Memory, and an optional session summary. Archives accumulate across sessions and are accessible to future Planners during Context Gathering via the `apm-archive-explorer` custom subagent.

### Memory as Context Archive

As the project progresses, Memory becomes a comprehensive archive mapping the Plan to execution history. This structured mapping enables:

- **Efficient Handoff** - Incoming Agents reconstruct context from the Tracker and Index (if Manager), Handoff Log, and relevant Task Logs rather than full session history
- **Cross-Agent Context** - Workers integrate outputs from other Agents by reading specified Task Logs as instructed in Task Prompts
- **Progress Tracking** - Manager assesses project state by reading stage summaries in the Index and task tracking in the Tracker rather than reviewing all code changes

---

## Context Scoping

APM achieves Agent specialization through intentional context boundaries. Each Agent sees only the information relevant to its role.

### Planner

**Access:**

- User-provided requirements and existing documentation
- Codebase if applicable
- Full project vision during Planning Phase
- Session archives (`.apm/archives/`) when present — explored via `apm-archive-explorer` custom subagent

**Does not access:**

- Memory (does not exist yet for current session)
- Bus system (does not exist yet)
- Implementation Phase activities

Single Session, no Handoff.

### Manager

**Access:**

- All planning documents (reads, may update)
- Tracker and Index
- All Task Logs
- Bus system (all Task/Report/Handoff buses)
- Version control state during parallel dispatch

**Does not access:**

- Worker's detailed execution context (reads Task Logs instead of code)
- Task-level implementation details unless investigation requires it or User requests it

Multiple Sessions via Handoff. Each Session continues from where previous left off using Handoff Log and Memory.

### Worker

**Access:**

- Current Task Prompt (includes extracted Spec context, instructions, validation criteria)
- Rules directly (via platform's agents file)
- Accumulated working context from prior same-agent tasks in current Stage
- Specified Task Logs when cross-agent dependencies exist

**Does not reference directly:**

- Spec (receives extracted context via Task Prompt - Manager embeds all necessary content)
- Plan (receives Task definition via Task Prompt)
- Tracker, Index, or stage summaries
- Other Workers' working context unless explicitly provided in Task Prompt

Multiple Sessions via Handoff. After Handoff, incoming Worker reads current-Stage Task Logs for their Agent to reconstruct working context.

---

## Handoff Mechanism

When an Agent's context window approaches limits (70-80% capacity), Handoff transfers working context to a fresh instance. This enables sustained project execution beyond single-session capacity.

### Why Handoff Works

Traditional session compaction accumulates noise - debugging attempts, trial-and-error, intermediate reasoning. Handoff filters this noise through structured artifacts:

- **Memory** (Tracker, Index, Task Logs) preserves execution outcomes and coordination state
- **Handoff Log** preserves working knowledge and undocumented insights

The Incoming Agent inherits clean context without session noise, enabling multiple consecutive handoffs without degradation.

### Handoff Eligibility

**Manager:**

- May Handoff at any point as long as the Handoff Prompt captures comprehensive current state
- Documentation completeness is the requirement, not workflow stage

**Worker:**

- May Handoff between tasks or mid-task
- Must document current execution context in detail in Handoff Log if mid-task

### Two-Artifact Handoff System

**Handoff Log**

- Created by outgoing Agent
- Captures uncommitted knowledge not in formal logs
- Includes working patterns, User preferences, undocumented state, current execution context (if Worker), version control state (if Manager)

**Handoff Prompt**

- Created by outgoing Agent, written to Handoff Bus
- Instructs incoming Agent on context reconstruction
- Specifies which artifacts to read (Handoff Log, relevant Task Logs)
- Includes verification step before resuming operations

### Context Reconstruction

**Incoming Manager reads:**

- All planning documents
- Tracker (task tracking, agent tracking, working notes)
- Index (memory notes, stage summaries)
- Handoff Log
- Relevant recent Task Logs

**Incoming Worker reads:**

- Rules (via platform's agents file)
- Current-Stage Task Logs for their agent
- Handoff Log

Previous-Stage logs are not loaded for efficiency - the Manager accounts for this by treating previous-Stage same-agent dependencies as cross-agent dependencies (providing file reading instructions in Task Prompts).

---

**Next Steps:**

- See orchestration in action in [Getting Started](Getting_Started.md)
- Understand workflow mechanics in [Workflow Overview](Workflow_Overview.md)
- Learn about Agent responsibilities in [Agent Types](Agent_Types.md)
