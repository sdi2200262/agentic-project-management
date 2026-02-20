---
id: workflow-overview
slug: /workflow-overview
sidebar_label: Workflow Overview
sidebar_position: 6
---

# Workflow Overview

APM operates through two distinct phases: the Planning Phase establishes project structure through planning documents, and the Implementation Phase executes the plan through repeating assignment-execution-review cycles. Each phase has specific procedures, agents, and outcomes that build toward project completion.

---

## Planning Phase

The Planning Phase transforms User requirements into planning documents that guide all subsequent work. The Planner operates once at project start, conducting structured discovery and decomposing gathered context into actionable documents.

```mermaid
graph LR
    A[User Initiates<br/>Planner] --> B[Context<br/>Gathering]
    B --> C[Work<br/>Breakdown]
    C --> D[Planning<br/>Documents Complete]

    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Context Gathering

The Planner conducts structured discovery through three Question Rounds, each focused on progressive refinement:

**Question Round 1: Existing Materials and Vision**

- Project type, problem statement, and scope
- Existing documentation, PRDs, or codebase
- High-level goals and success criteria

**Question Round 2: Technical Requirements**

- Work structure and dependencies
- Technical requirements and constraints
- Validation criteria for each requirement
- Design decisions and constraints

**Question Round 3: Implementation Approach and Quality**

- Technical constraints and preferences
- Workflow patterns and quality standards
- Domain organization and coordination needs
- Finalizing Specifications and Execution Standards

After each round, the Planner iterates on gaps and unclear areas before advancing. When User responses reference codebase elements or documentation, the Planner explores proactively to gather concrete information. Research Subagents may be spawned to avoid consuming the Planner's context during exploration.

After all rounds complete, the Planner presents an Understanding Summary for User review. Modifications loop back through targeted follow-ups until User approval triggers transition to Work Breakdown.

### Work Breakdown

The Planner decomposes gathered context into three planning documents through visible reasoning - reasoning is presented in chat before file output.

**Specifications Creation**

- Surfaces design decisions from gathered context: explicit choices, implicit constraints, and alternatives not taken
- Writes Specifications file with project-specific design decisions; structure follows the decisions identified
- Presents for User review, iterates on feedback until approval

**Implementation Plan Creation**

- Identifies logical work domains and defines Workers
- Identifies all Stages with objectives
- For each Stage, completes detailed Task breakdown with objectives, outputs, validation criteria, guidance, dependencies, and steps
- Assesses workload distribution across agents
- Generates Dependency Graph visualizing Task dependencies and agent assignments
- Presents for User review, iterates on feedback until approval

**Execution Standards Creation**
- Extracts universal execution patterns from three sources: Specifications decisions with execution implications, recurring patterns across Plan Tasks, and workflow conventions from Context Gathering
- Writes APM_STANDARDS block in Execution Standards file
- Presents for User review, iterates on feedback until approval

After all three planning documents receive User approval, the Planning Phase concludes. The User initializes the Manager to begin the Implementation Phase.

---

## Implementation Phase

The Implementation Phase executes the Implementation Plan through repeating assignment-execution-review cycles. The Manager assigns tasks to Workers, reviews completed work, and maintains project state. Each task executes through its own cycle.

```mermaid
graph LR
    A[Task<br/>Assignment] --> B[Task<br/>Execution]
    B --> C[Task<br/>Review]
    C --> D{Review<br/>Outcome}
    D -->|Proceed| E[Next Task]
    D -->|Follow-up| F[Refined<br/>Task Prompt]
    D -->|Document<br/>Modification| G[Update<br/>Documents]
    E --> A
    F --> A
    G -->|Then Proceed<br/>or Follow-up| E

    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Manager Initialization

After the Planning Phase, the User creates a Manager session and runs the initialization command. The Manager:

- Reads all planning documents
- Initializes the Memory System
- Initializes the Message Bus for Agent communication
- Initializes version control if a git repository exists
- Presents understanding summary for User review

After User authorization, the Manager begins coordinating task execution through assignment-execution-review cycles.

### Assignment-Execution-Review Cycle

Each task executes through its own assignment-execution-review cycle containing three parts: Task Assignment, Task Execution, and Task Review. When multiple tasks are dispatched (batch or parallel), each task still has its own cycle - they may run sequentially or concurrently, but the per-task structure remains the same.

#### Task Assignment

The Manager assesses which tasks are ready based on dependency completion and the Project Tracker. For each ready task:

1. **Dependency Context Analysis** - Classifies dependencies as same-agent (light context with recall anchors) or cross-agent (comprehensive context with file reading instructions). After Worker Handoff, prior-Stage same-agent dependencies are reclassified as cross-agent.

2. **Specification Extraction** - Extracts relevant design decisions from Specifications for contextual integration into the Task Prompt. Workers do not reference Specifications directly - all necessary context is embedded by the Manager.

3. **Task Prompt Construction** - Assembles a self-contained prompt with task reference, context from dependencies, objective, detailed instructions, expected output, validation criteria, memory logging instructions, and reporting instructions.

4. **Delivery via Task Bus** - Writes the Task Prompt to the Worker's Task Bus file. Directs the User to run `/apm-4-check-tasks` in the Worker's session.

**Dispatch Modes:**

- **Single Dispatch** - One task to one Worker
- **Batch Dispatch** - Multiple sequential tasks to the same Worker in a single Task Bus message
- **Parallel Dispatch** - Tasks to multiple Workers simultaneously when no cross-Worker dependencies exist among them

For parallel dispatch, the Manager initializes version control (feature branches and worktrees) for workspace isolation.

#### Task Execution

The Worker receives the Task Prompt and executes through this loop:

1. **Registration** - On first Task Prompt, the Worker binds to the agent identity specified in the prompt. This identity persists across the Worker's Session.

2. **Context Integration** - If cross-agent dependencies exist, the Worker reads specified files to integrate context from prior tasks by other Workers.

3. **Execution** - Works through task instructions step by step according to the Task Prompt.

4. **Validation** - Validates results per specified criteria in order: Programmatic tests, then Artifact checks, then User review. User validation requires pausing for review before proceeding.

5. **Correction Loop** - If validation fails, attempts to correct and re-validates. This loop repeats until success or a stop condition.

6. **Task Memory Logging** - Creates Task Memory Log at specified path documenting outcome, validation results, deliverables, technical decisions, and flags.

7. **Task Reporting** - Clears the Task Bus, writes Task Report to Report Bus summarizing completion status and key findings.

The Worker directs the User to run `/apm-5-check-reports` in the Manager's session.

**Batch Execution:** When receiving a batch, the Worker executes each task sequentially and writes a Task Memory Log immediately after each. If any task results in Blocked or Failed status, the Worker stops execution (fail-fast) and reports partial completion with unstarted tasks listed as "Not started (batch stopped)."

**Subagent Spawning:** Workers may spawn platform-native subagents (Debug Subagent, Research Subagent) for isolated context-heavy work that would pollute the main session. Findings are integrated into the Worker's context after completion.

#### Task Review

The Manager receives the Task Report via Report Bus and reviews the outcome:

1. **Report Processing** - Reads the Task Report from Report Bus (triggered by `/apm-5-check-reports`), clears per Clear-on-Return protocol. If Batch Report, processes each task's outcome individually.

2. **Log Review** - Reads the Task Memory Log referenced in the Report. Interprets task status (Success, Partial, Failed, Blocked), flags (important_findings, compatibility_issues), and log content.

3. **Review Outcome** - Determines next action based on review:
   - **Proceed** - Task successful, no issues detected. Update Project Tracker, check Stage completion, dispatch next task(s).
   - **Follow-up** - Task needs retry with refined approach. Create follow-up Task Prompt with different content (refined objective, updated instructions, follow-up context section explaining what went wrong). Same memory log path - Worker overwrites previous log.
   - **Document Modification** - Execution revealed issues with planning documents (Specifications, Implementation Plan, or Execution Standards). Determine authority scope (bounded Manager authority vs User collaboration for significant changes). Modify documents, verify consistency, update Dependency Graph if Implementation Plan Task relationships change. Then proceed to next task or issue follow-up as needed.

4. **Project Tracker Update** - Every outcome path ends with updating the Project Tracker section in Memory Root: completed tasks, readiness changes, merge state.

5. **Stage Summary** - After all tasks in a Stage complete, the Manager reviews all Task Memory Logs for that Stage and appends a Stage Summary to Memory Root capturing Stage-level outcomes and cross-cutting observations.

**Parallel Report Handling:** During parallel dispatch, Reports arrive asynchronously. The Manager processes each as it arrives, determines the review outcome, merges the completed task's branch, reassesses readiness, and dispatches newly ready tasks if any. When no ready tasks exist but Workers are still active, the Manager communicates what is pending and waits.

### Memory System

The Memory System in `.apm/Memory/` tracks project state and execution history:

- **Memory Root** (`Memory_Root.md`) - Central project state containing Project Tracker, Working Notes, and Stage Summaries

- **Project Tracker** (section within Memory Root) - Tracks task statuses per Stage (ready, active, done, waiting), agent assignments, active branches, and merge state. Updated by the Manager after each Task Review.

- **Task Memory Logs** (`Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md`) - Structured logs created by Workers after each task completion. Serve as context abstraction layer between Manager's coordination view and Worker's execution details.

- **Handoff Memory Logs** (`Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md`) - Logs created during Handoff containing working context not captured elsewhere.

- **Working Notes** (section within Memory Root) - Ephemeral coordination notes maintained by the Manager and User during the Implementation Phase. Inserted and removed as context evolves.

### Message Bus

The Message Bus in `.apm/bus/` enables file-based communication between Agent Sessions:

- **Task Bus** (`apm-task.md`) - Manager-to-Worker communication containing Task Prompts
- **Report Bus** (`apm-report.md`) - Worker-to-Manager communication containing Task Reports
- **Handoff Bus** (`apm-handoff.md`) - Outgoing-to-Incoming Agent communication containing Handoff Prompts

The User triggers bus checks using commands (`/apm-4-check-tasks`, `/apm-5-check-reports`) — there is no direct Manager-Worker communication. The Clear-on-Return protocol ensures each Agent clears its incoming Bus File before writing to its outgoing Bus File, preventing stale messages.

---

## Handoff

When an Agent's context window approaches limits (70-80% capacity), a Handoff transfers context to a fresh instance of the same Agent. Handoff applies to Manager and Workers only - the Planner operates in a single Session.

```mermaid
graph LR
    A[Context Limits<br/>Approaching] --> B[Outgoing Agent<br/>Creates Artifacts]
    B --> C[User Opens<br/>New Session]
    C --> D[Incoming Agent<br/>Reconstructs Context]
    D --> E{Understanding<br/>Verified?}
    E -->|No| F[Clarify]
    F --> D
    E -->|Yes| G[Resume<br/>Operations]

    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Handoff Process

**Eligibility**

- Manager may Handoff at any point as long as the Handoff Prompt captures comprehensive current state
- Workers may Handoff between tasks or mid-task; must include current execution context in detail in their Handoff Memory Log

**Outgoing Agent**

1. Creates Handoff Memory Log capturing working context not recorded elsewhere (effective patterns, User preferences, undocumented insights, current execution context if mid-task, version control state if applicable)
2. Writes Handoff Prompt to Handoff Bus instructing the Incoming Agent on context reconstruction
3. Directs User to start a new session using the initialization command — the Incoming Agent auto-detects the Handoff Prompt

**Incoming Agent**

1. User creates new session for the same agent role (e.g., "Manager session 2" or "Frontend Worker session 2")
2. User runs initialization command (`/apm-2-initiate-manager` or `/apm-3-initiate-worker`)
3. Agent auto-detects Handoff Prompt from Handoff Bus, follows instructions to read Handoff Memory Log and relevant Task Memory Logs
4. Agent reconstructs working context and presents understanding summary
5. User verifies accuracy and authorizes Agent to resume from where Outgoing Agent left off

**Context Reconstruction Scope**

- Incoming Manager reads Memory Root Stage Summaries, Handoff Memory Log, and relevant recent Task Memory Logs
- Incoming Worker reads current-Stage Task Memory Logs for their agent. Previous-Stage logs are not loaded for efficiency - the Manager accounts for this when constructing future Task Prompts by treating prior-Stage same-agent dependencies as cross-agent dependencies.

---

**Next Steps:**

- See the complete workflow mechanics in [Getting Started](Getting_Started.md)
- Understand Agent responsibilities in [Agent Types](Agent_Types.md)
- Learn about Agent communication and memory in [Agent Orchestration](Agent_Orchestration.md)
