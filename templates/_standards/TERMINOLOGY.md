# APM Terminology

This document defines all terms, types, and procedures used in the APM workflow. It serves as the single source of truth for vocabulary across all skills and commands.

Terms defined here are capitalized and formatted consistently across skills and commands. Words not defined in this document are not capitalized or treated as formal terms.

All writing conventions follow `WRITING.md`. All structural patterns follow `STRUCTURE.md`.

---

## 1. Core Concepts

### 1.1 Agent Model

| Term | Definition |
|------|------------|
| **Agent Type** | Category of agent role. Four types exist: Planner, Manager, Worker, Delegate. |
| **Agent** | A named identity within an Agent Type that persists across Sessions. Examples: Manager Agent, Frontend Agent, Backend Agent. |
| **Agent Session** | A continuous execution context for an Agent. Increments on Handoff. Format: `[Agent Name] Session [N]`. |
| **Planner Agent** | Agent Type responsible for Context Gathering and Work Breakdown. Single Agent, single Session per project. |
| **Manager Agent** | Agent Type responsible for coordination and orchestration. Single Agent, multiple Sessions. |
| **Worker Agent** | Agent Type responsible for Task execution. Multiple Agents defined in Implementation Plan, multiple Sessions each. |
| **Delegate Agent** | Agent Type responsible for isolated, focused work. Multiple Agents created on-demand, single Session each. |
| **Delegating Agent** | The Agent that initiates a Delegation. Can be Planner, Worker, or Manager. |
| **Reading Agent** | The Agent Type(s) that use a particular Skill. Declared in Skill Overview. |

**Agent Type Characteristics:**

| Agent Type | Agents per Project | Sessions per Agent | Handoff Capable |
|------------|-------------------|-------------------|-----------------|
| Planner | 1 | 1 | No |
| Manager | 1 | Multiple | Yes |
| Worker | Multiple | Multiple each | Yes |
| Delegate | Multiple | 1 each | No |

---

### 1.2 Coordination Artifacts

**Coordination Artifacts:**

| Term | Definition | Location |
|------|------------|----------|
| **Coordination Artifact** | Document that guides project coordination. Three types exist: Specifications, Implementation Plan, Standards. | `.apm/` directory and workspace root |
| **Specifications** | Project-specific design decisions and constraints that inform the Implementation Plan. | `.apm/Specifications.md` |
| **Implementation Plan** | Stage and Task breakdown with Agent assignments, guides implementation. | `.apm/Implementation_Plan.md` |
| **Standards** | Universal project standards applied during Task Execution. | `AGENTS.md` (or `CLAUDE.md`) at workspace root |
| **APM_STANDARDS Block** | Namespace block within Standards file containing APM-managed content. | Within `AGENTS.md` (or `CLAUDE.md` or equivalent) |
| **Last Modification** | Header field documenting most recent artifact change with attribution. | Specifications, Implementation Plan |

**Coordination Artifact Hierarchy:**

| Level | Artifact | Purpose |
|-------|----------|---------|
| Architectural | Specifications | Define what is being built |
| Coordination | Implementation Plan | Define how work is organized |
| Execution | Standards | Define how work is performed |

### 1.3 Memory System

| Term | Definition | Location |
|------|------------|----------|
| **Memory System** | Hierarchical storage for project history enabling progress tracking and Handoff continuity. | `.apm/Memory/` |
| **Memory Root** | Central project state document containing Handoff count, Stage Summaries and working notes. | `.apm/Memory/Memory_Root.md` |
| **Stage Summary** | Compressed Stage-level outcome appended to Memory Root after Stage completion. | Within Memory Root |
| **Stage Directory** | Directory containing all Memory Logs for a Stage. | `.apm/Memory/Stage_<N>_<Slug>/` |
| **Memory Log** | Structured markdown file capturing execution context. Three types exist: Task Memory Log, Delegation Memory Log, Handoff Memory Log. Contains flags for `important_findings` (discoveries beyond Task scope), `compatibility_issues` (task execution conflicts), and `delegation` (Delegate involvement). | `.apm/Memory/` |
| **Task Memory Log** | Log created by Worker after Task completion. Captures outcome, validation, deliverables, flags. | `Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md` |
| **Delegation Memory Log** | Log created by Delegate after delegation completion. Captures findings and integration notes. | `Stage_<N>_<Slug>/Delegation_Log_<N>_<M>_<Type>_<Slug>.md` |
| **Handoff Memory Log** | Log created during Handoff containing working context not captured elsewhere. | `.apm/Memory/Handoffs/<AgentID>_Handoffs/<AgentID>_Handoff_Log_<N>.md` |

**Memory System Structure:**

```
.apm/Memory/
├── Memory_Root.md
├── Stage_01_<Slug>/
│   ├── Task_Log_01_01_<Slug>.md
│   ├── Task_Log_01_02_<Slug>.md
│   └── Delegation_Log_01_01_<Type>_<Slug>.md
├── Stage_02_<Slug>/
│   └── ...
└── Handoffs/
    ├── Manager_Handoffs/
    │   └── Manager_Handoff_Log_<N>.md
    └── <AgentID>_Handoffs/
        └── <AgentID>_Handoff_Log_<N>.md
```

---

### 1.4 Communications

| Term | Definition |
|------|------------|
| **Communication** | Structured markdown message transferred by the User between Agents. Two types exist: Prompt, Report. |
| **Prompt** | Communication passed TO an Agent to initiate or continue work. Four types exist: Task Assignment, FollowUp Task Assignment, Delegation, Handoff. |
| **Task Assignment Prompt** | Self-contained prompt providing Worker with everything needed to execute a Task. Flags: `has_dependencies` (includes Context Dependencies), `has_delegation_steps` (includes Delegation). |
| **FollowUp Task Assignment Prompt** | Refined Task Assignment issued after Coordination Decision determines retry needed. |
| **Delegation Prompt** | Prompt providing Delegate with context and instructions for isolated work. |
| **Handoff Prompt** | Prompt instructing Incoming Agent how to reconstruct context. |
| **Report** | Communication passed BACK to an Agent after work completion. Two types exist: Task, Delegation. |
| **Task Report** | Concise summary output by Worker for User to return to Manager. |
| **Delegation Report** | Summary output by Delegate for User to return to Delegating Agent. |

---

### 1.5 Work Units

| Term | Definition |
|------|------------|
| **Stage** | Milestone grouping of related Tasks representing a coherent project progression. |
| **Task** | Discrete work unit with objective, deliverables, validation criteria, and dependencies. |
| **Step** | Ordered sub-unit within a Task. Supports failure tracing but has no independent validation. |
| **Delegation** | Isolated work unit assigned to a Delegate Agent by a Delegating Agent. |
| **Delegation Type** | Category of delegated work. Two primary types exist: Debug, Research. Custom types use Delegation Prompt description. |
| **Debug Delegation** | Delegation for isolating and resolving complex bugs. Uses delegate-debug skill. |
| **Research Delegation** | Delegation for investigating knowledge gaps using current sources. Uses delegate-research skill. |

---

### 1.6 Document Structure

| Term | Definition |
|------|------------|
| **Skill** | Agent-facing document containing procedural instructions and operational standards. Located in `skills/<skill-name>/SKILL.md`. |
| **Command** | User-facing prompt that initiates workflow actions. Located in `commands/apm-<N>-<action>.md`. |
| **Procedure** | Structured sequence of actions within a Skill or Command. Uses "Perform the following actions:" format with numbered steps. |
| **Activity** | Named unit of work within a Procedure. Activities are either sequential, executed in order or distinct, independent operations that together comprise the Procedure. |

---

## 2. Planning Phase

| Term | Definition |
|------|------------|
| **Planning Phase** | First phase of APM workflow. Planner Agent transforms User requirements into Coordination Artifacts through Context Gathering and Work Breakdown. |

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| **Planner Initiation** | planner-initiation | Initialize Planner session and begin Context Gathering. |
| **Context Gathering** | context-gathering | Elicit requirements through structured Question Rounds, produce Understanding Summary. |
| **Work Breakdown** | work-breakdown | Decompose gathered context into Standards, Specifications, and Implementation Plan. |

**Planner Initiation Activities:**

| Activity | Description |
|----------|-------------|
| Session Initiation | Initialize session, greet User, begin Context Gathering Procedure. |

**Context Gathering Activities:**

| Activity | Description |
|----------|-------------|
| Question Round 1 | Existing materials and vision discovery. |
| Question Round 2 | Technical requirements discovery. |
| Question Round 3 | Implementation approach and quality discovery. |
| Context Finalization | Understanding Summary presentation and approval. |

**Work Breakdown Activities:**

| Activity | Description |
|----------|-------------|
| Standards Analysis | Extract universal standards for `AGENTS.md`. |
| Specifications Analysis | Extract design decisions for `Specifications.md`. |
| Domain Analysis | Identify domains and assign Worker Agents. |
| Stage Analysis | Define Stages with objectives and Task identification. |
| Stage Cycle | Detailed Task breakdown per Stage. |
| Plan Review | Workload distribution and cross-Agent dependency review. |
| Artifact Finalization | User approval and procedure completion. |

**Terms:**

| Term | Definition |
|------|------------|
| **Question Round** | Iteration cycle within Context Gathering focused on specific discovery areas. |
| **Gap Assessment** | Evaluation of missing or ambiguous information within a Question Round. |
| **Understanding Summary** | Consolidated context presentation for User review before Work Breakdown. |
| **Domain** | Logical work area requiring specific mental model or skill set. Maps to Agent assignment. |
| **Forced Chain-of-Thought** | Methodology requiring explicit reasoning in chat before file output. |

Planner Agent can initiate Delegations during Planning Phase. See §1.4 Work Units for Delegation terminology.

---

## 3. Implementation Phase

| Term | Definition |
|------|------------|
| **Implementation Phase** | Second phase of APM workflow. Manager, Worker, and Delegate Agents transform the Implementation Plan into completed deliverables through coordinated Task execution. |

---

### 3.1 Coordination Layer (Manager Agent)

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| **Manager Initiation** | manager-initiation | Initialize Manager session and read Coordination Artifacts. |
| **Memory Maintenance** | memory-maintenance | Manage Memory System including Memory Root, Stage directories, and log review. |
| **Task Assignment** | task-assignment | Construct and deliver Task Assignment Prompts to Worker Agents. |
| **Artifact Maintenance** | artifact-maintenance | Assess and execute modifications to Coordination Artifacts. |
| **Manager Handoff** | manager-handoff | Transfer context to Incoming Agent when context window limits approach. |

**Manager Initiation Activities:**

| Activity | Description |
|----------|-------------|
| Session Initiation | Initialize session, determine Session number, read Coordination Artifacts. |

**Memory Maintenance Activities:**

| Activity | Description |
|----------|-------------|
| Memory Root Initialization | Populate Memory Root header fields. Manager Agent Session 1 only. |
| Stage Directory Creation | Create empty Stage directory before first Task Assignment of a Stage. |
| Task Report Review | Receive Task Report, check for Handoff indication, note log path. |
| Task Memory Log Review | Read and interpret Task Memory Log content, flags, status. |
| Coordination Decision | Assess investigation need, investigate, decide next action. |
| Stage Summary Creation | Synthesize Stage-level summary, append to Memory Root. |

**Task Assignment Activities:**

| Activity | Description |
|----------|-------------|
| Task Assignment | Construct Task Assignment Prompt with dependency context, specifications, execution instructions and validation criteria. |
| FollowUp Task Assignment | Create refined Task Assignment after investigation reveals issues. |

**Artifact Maintenance Activities:**

| Activity | Description |
|----------|-------------|
| Artifact Maintenance | Assess modifications, analyze cascade issues, check modification authority, execute changes. |

**Manager Handoff Activities:**

| Activity | Description |
|----------|-------------|
| Manager Handoff | Create Handoff Memory Log and Handoff Prompt for Incoming Agent. |

**Terms:**

| Term | Definition |
|------|------------|
| **Task Cycle** | Core coordination loop: assign → execute → report → review → decide → repeat. |
| **Coordination Decision** | Manager's assessment after Task Memory Log review. Outcomes: Proceed (continue to next Task), FollowUp (retry with refined instructions), Artifact Modification (update Coordination Artifacts). |
| **Investigation** | Deeper review when flags raised or status non-Success. Scope determines approach: small (few files, single Task) uses Self-Investigation; large (context-intensive, multiple Tasks) uses Delegated Investigation. |
| **Self-Investigation** | Manager investigates directly. For small scope. |
| **Delegated Investigation** | Manager delegates to Delegate Agent. For large scope. |
| **Bounded Modification** | Artifact modification within Manager authority. Single Task, isolated change etc. Manager executes directly. |
| **Significant Modification** | Artifact modification requiring User collaboration. Multiple Tasks, direction change etc. Manager presents options, User decides. |
| **Modification Assessment** | Determining which Coordination Artifact(s) need changes. |
| **Cascade Analysis** | Assessing cascading implications of modifications within the same artifact and across related artifacts. |

---

### 3.2 Execution Layer (Worker Agent)

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| **Worker Initiation** | worker-initiation | Initialize Worker session and register Agent identity. |
| **Task Execution** | task-execution | Execute Task instructions, handle validation, iteration, and delegation. |
| **Memory Logging** | memory-logging | Create Task Memory Log and output Task Report. |
| **Worker Handoff** | worker-handoff | Transfer context to Incoming Agent when context window limits approach. |

**Worker Initiation Activities:**

| Activity | Description |
|----------|-------------|
| Session Initiation | Initialize session, await prompt, register Agent identity. |

**Task Execution Activities:**

| Activity | Description |
|----------|-------------|
| Context Integration | Execute integration actions for Cross-Agent dependencies. |
| Task Execution | Execute instructions sequentially, handle delegation and pauses. |
| Task Validation | Execute validations in order: Programmatic → Artifact → User. |
| Iteration Cycle | Correct failures, re-execute, re-validate until success or stop condition. |
| Pause Handling | Communicate pause reason, await input, resume execution. |
| Delegation Handling | Create Delegation Prompt, await report, integrate findings. |

**Memory Logging Activities:**

| Activity | Description |
|----------|-------------|
| Memory Logging | Populate Task Memory Log at specified path. |
| Task Reporting | Output Task Report for User to return to Manager. |

**Worker Handoff Activities:**

| Activity | Description |
|----------|-------------|
| Worker Handoff | Create Handoff Memory Log and Handoff Prompt for Incoming Agent. |

**Context Dependencies:**

| Term | Definition |
|------|------------|
| **Context Dependency** | Relationship where a Task requires outputs or context from a prior Task. |
| **Same-Agent Dependency** | Context Dependency where producer and consumer are the same Agent. Requires light context (recall anchors). |
| **Cross-Agent Dependency** | Context Dependency where producer and consumer are different Agents. Requires comprehensive context. |
| **Handoff Dependency** | Same-Agent dependencies from prior Stages after Handoff are treated as Cross-Agent dependencies. |
| **Task Dependency** | Explicit prerequisite relationship declared in Implementation Plan Dependencies field. |
| **Dependency Chain** | Upstream trace of dependencies from a Task to its producers and their producers. |

**Context Dependency by Scenario:**

| Scenario | Dependency Type |
|----------|-----------------|
| Same Agent, current Stage | Same-Agent |
| Same Agent, prior Stage, no Handoff | Same-Agent |
| Same Agent, prior Stage, after Handoff | Cross-Agent |
| Different Agent, any Stage | Cross-Agent |

**Terms:**

| Term | Definition |
|------|------------|
| **Worker Registration** | Process of binding a Worker session to a specific Agent identity from the first prompt received. |
| **Context Integration** | Pre-execution action where Worker reads and understands dependency outputs. |
| **Validation Types** | Methods for verifying Task completion. Three types exist: Programmatic, Artifact, User. Executed in Validation Ordering sequence. |
| **Validation Ordering** | Required sequence: Programmatic → Artifact → User. User Validation always last. |
| **Programmatic Validation** | Automated tests and builds. Autonomous iteration allowed on failure. |
| **Artifact Validation** | Output existence and structure verification. Autonomous iteration allowed on failure. |
| **User Validation** | Human judgment required. Must pause for review. No autonomous iteration. |
| **Iteration Cycle** | Correction loop when validation fails: correct → re-execute → re-validate. |
| **Pause** | Suspension of Task execution for input or review. Two types exist: Obligatory, Autonomous. |
| **Obligatory Pause** | Required pause for Delegation, explicit User actions, or User Validation. |
| **Autonomous Pause** | Optional pause at natural breakpoints during complex Tasks. Worker judgment. |
| **Task Status** | Outcome of Task execution. Success (objective achieved), Partial (progress made but incomplete, needs guidance), Failed (attempted but couldn't succeed, issue within Task scope), Blocked (external factors prevent progress, requires coordination-level resolution). |
| **Handoff Indication** | Statement in first Task Report after Handoff identifying Session number and loaded logs. |

---

### 3.3 Delegation Layer (Delegate Agent)

Delegation applies to both Planning Phase (Planner as Delegating Agent) and Implementation Phase (Manager or Worker as Delegating Agent). See §1.4 Work Units for Delegation terminology.

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| **Delegate Initiation** | delegate-initiation | Initialize Delegate session and execute delegated work. |
| **Delegation Skill** | delegate-debug, delegate-research | Type-specific methodology for delegated work (Debug or Research). |
| **Memory Logging** | memory-logging | Create Delegation Memory Log and output Delegation Report. |

**Delegate Initiation Activities:**

| Activity | Description |
|----------|-------------|
| Delegation Execution | Execute delegated work following Delegation Prompt methodology. |

**Memory Logging Activities:**

| Activity | Description |
|----------|-------------|
| Memory Logging | Create Delegation Memory Log with findings and integration notes. |
| Delegation Reporting | Output Delegation Report for User to return to Delegating Agent. |

**Terms:**

| Term | Definition |
|------|------------|
| **Resolved** | Delegation status indicating issue addressed, findings ready for integration. |
| **Unresolved** | Delegation status indicating issue not fully resolved, partial findings available. |

---

### 3.4 Handoff Operations

Handoff transfers context between Sessions of the same Agent when context window limits approach. Applies to Manager and Worker Agents only.

**Procedures:**

| Procedure | Agent | Description |
|-----------|-------|-------------|
| Handoff Eligibility Check | Manager, Worker | Verify current work cycle is complete before Handoff proceeds. |
| Handoff Memory Log Creation | Manager, Worker | Outgoing Agent creates log containing working context not captured in other artifacts. |
| Handoff Prompt Creation | Manager, Worker | Outgoing Agent creates prompt instructing Incoming Agent to reconstruct context. |
| Context Reconstruction | Manager, Worker | Incoming Agent reads artifacts and logs to rebuild working context. |
| Handoff Detection | Manager | Identify Worker Handoff from Task Report indication, adjust dependency treatment. |

**Terms:**

| Term | Definition |
|------|------------|
| **Handoff** | Context transfer between Sessions of the same Agent. |
| **Handoff Eligibility** | Requirements that must be met before Handoff can proceed. Varies by Agent Type. |
| **Outgoing Agent** | The Agent performing Handoff when context window limits approach. Creates Handoff artifacts. |
| **Incoming Agent** | The replacement Agent that receives Handoff. Reconstructs context from artifacts. Applied as "Incoming Worker Agent" or "Incoming Manager Agent" depending on Agent Type. |
| **Context Reconstruction** | Process by which Incoming Agent rebuilds working context. |

---

**End of Terminology**
