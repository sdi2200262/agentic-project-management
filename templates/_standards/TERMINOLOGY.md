# APM Terminology

This document defines all terms, types, and procedures used in the APM workflow. It serves as the single source of truth for vocabulary across all skills and commands.

All writing conventions follow `WRITING.md`. All structural patterns follow `STRUCTURE.md`.

---

## 1. Foundational Concepts

### 1.1 Agent Model

| Term | Definition |
|------|------------|
| **Agent Type** | Category of agent role. Four types exist: Planner, Manager, Worker, Delegate. |
| **Agent** (Agent Instance) | A named identity within an Agent Type that persists across Sessions. Examples: Manager Agent, Frontend Agent, Backend Agent. |
| **Agent Session** | A continuous execution context for an Agent. Increments on Handoff. Format: `[Agent Name] Session [N]`. |
| **Planner Agent** | Agent Type responsible for Context Gathering and Work Breakdown. Single Agent, single Session per project. |
| **Manager Agent** | Agent Type responsible for coordination and orchestration. Single Agent, multiple Sessions. |
| **Worker Agent** | Agent Type responsible for Task execution. Multiple Agents defined in Implementation Plan, multiple Sessions each. |
| **Delegate Agent** | Agent Type responsible for isolated, focused work. Multiple Agents created on-demand, single Session each. |
| **Calling Agent** | The Agent that initiates a Delegation. Can be Planner, Worker, or Manager. |
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

| Term | Definition | Location |
|------|------------|----------|
| **Coordination Artifact** | Document that guides project coordination. Three types exist. | `.apm/` directory |
| **Specifications** | Project-specific design decisions and constraints that inform the Implementation Plan. | `.apm/Specifications.md` |
| **Implementation Plan** | Stage and Task breakdown with Agent assignments, validation criteria, and dependencies. | `.apm/Implementation_Plan.md` |
| **Standards** | Universal project standards applied during Task execution. Leverages always-apply rules. | `{AGENTS_FILE}` at workspace root |
| **APM_STANDARDS Block** | Namespace block within Standards file containing APM-managed content. | Within `{AGENTS_FILE}` |
| **Last Modification** | Header field documenting most recent artifact change with attribution. | Specifications, Implementation Plan |

**Coordination Artifact Hierarchy:**

| Level | Artifact | Purpose |
|-------|----------|---------|
| Architectural | Specifications | Define what is being built |
| Implementation | Implementation Plan | Define how work is organized |
| Execution | Standards | Define how work is performed |

---

### 1.3 Memory System

| Term | Definition | Location |
|------|------------|----------|
| **Memory System** | Hierarchical storage for project history enabling progress tracking and Handoff continuity. | `.apm/Memory/` |
| **Memory Root** | Central project state document containing overview, Handoff count, and Stage Summaries. | `.apm/Memory/Memory_Root.md` |
| **Stage Directory** | Directory containing all Memory Logs for a Stage. | `.apm/Memory/Stage_<N>_<Slug>/` |
| **Memory Log** | Structured markdown file capturing execution context. Three types exist. | Various locations |
| **Task Memory Log** | Log created by Worker after Task completion. Captures outcome, validation, deliverables, flags. | `Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md` |
| **Delegation Memory Log** | Log created by Delegate after delegation completion. Captures findings and integration notes. | `Stage_<N>_<Slug>/Delegation_Log_<N>_<M>_<Type>_<Slug>.md` |
| **Handoff Memory Log** | Log created during Handoff containing working context not captured elsewhere. | `.apm/Memory/Handoffs/<AgentID>_Handoffs/` |
| **Stage Summary** | Compressed Stage-level outcome appended to Memory Root after Stage completion. | Within Memory Root |

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

### 1.4 Context Dependencies

| Term | Definition |
|------|------------|
| **Context Dependency** | Relationship where a Task requires outputs or context from a prior Task. |
| **Same-Agent Dependency** | Context Dependency where producer and consumer are the same Agent. Requires light context (recall anchors). |
| **Cross-Agent Dependency** | Context Dependency where producer and consumer are different Agents. Requires comprehensive context. |
| **Handoff Context Rule** | Same-Agent dependencies from prior Stages after Handoff are treated as Cross-Agent dependencies. |
| **Task Dependency** | Explicit prerequisite relationship declared in Implementation Plan Dependencies field. |
| **Dependency Chain** | Upstream trace of dependencies from a Task to its producers and their producers. |

**Context Depth by Scenario:**

| Scenario | Dependency Type | Context Depth |
|----------|-----------------|---------------|
| Same Agent, current Stage | Same-Agent | Light (recall anchors) |
| Same Agent, prior Stage, no Handoff | Same-Agent | Light (recall anchors) |
| Same Agent, prior Stage, after Handoff | Cross-Agent (per Handoff Context Rule) | Comprehensive |
| Different Agent, any Stage | Cross-Agent | Comprehensive |

---

## 2. Planning Phase

The Planning Phase is executed by the Planner Agent. It transforms User requirements into Coordination Artifacts.

### 2.1 Procedures

| Procedure | Skill | Description |
|-----------|-------|-------------|
| **Context Gathering** | context-gathering | Elicit requirements through structured Question Rounds, produce Understanding Summary. |
| **Work Breakdown** | work-breakdown | Decompose gathered context into Standards, Specifications, and Implementation Plan. |

**Context Gathering Parts:**

| Part | Description |
|------|-------------|
| Question Round 1 | Existing materials and vision discovery. |
| Question Round 2 | Technical requirements discovery. |
| Question Round 3 | Implementation approach and quality discovery. |
| Final Validation | Understanding Summary presentation and approval. |

**Work Breakdown Parts:**

| Part | Description |
|------|-------------|
| Standards Analysis | Extract universal standards for `{AGENTS_FILE}`. |
| Specifications Analysis | Extract design decisions for `Specifications.md`. |
| Domain Analysis | Identify domains and assign Worker Agents. |
| Stage Analysis | Define Stages with objectives and Task identification. |
| Stage Cycle | Detailed Task breakdown per Stage. |
| Plan Finalization | Workload distribution and dependency review. |

---

### 2.2 Terms

| Term | Definition |
|------|------------|
| **Question Round** | Iteration cycle within Context Gathering focused on specific discovery areas. |
| **Gap Assessment** | Evaluation of missing or ambiguous information within a Question Round. |
| **Question Round Completion** | Output confirming Question Round understanding is sufficient to advance. |
| **Understanding Summary** | Consolidated context presentation for User review before Work Breakdown. |
| **Domain** | Logical work area requiring specific mental model or skill set. Maps to Agent assignment. |
| **Stage** | Milestone grouping of related Tasks representing a coherent project phase. |
| **Task** | Discrete work unit with objective, deliverables, validation criteria, and dependencies. |
| **Step** | Ordered sub-unit within a Task. Supports failure tracing but has no independent validation. |
| **Forced Chain-of-Thought** | Methodology requiring explicit reasoning in chat before file output. |

---

## 3. Implementation Phase

The Implementation Phase is executed by Manager, Worker, and Delegate Agents. It transforms the Implementation Plan into completed deliverables.

---

### 3.1 Coordination Layer (Manager Agent)

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| Session Initiation | manager-initiation | Initialize session, determine Session number, read Coordination Artifacts. |
| Memory Root Initialization | memory-maintenance | Populate Memory Root header fields. Session 1 only. |
| Stage Directory Creation | memory-maintenance | Create empty Stage directory before first Task Assignment of a Stage. |
| Task Assignment | task-assignment | Construct Task Assignment Prompt with dependencies, specifications, context. |
| Task Report Review | memory-maintenance | Receive Task Report, check for Handoff indication, note log path. |
| Task Memory Log Review | memory-maintenance | Read and interpret Task Memory Log content, flags, status. |
| Coordination Decision | memory-maintenance | Assess investigation need, investigate, determine outcome. |
| FollowUp Task Assignment | task-assignment | Create refined Task Assignment after investigation reveals issues. |
| Artifact Maintenance | artifact-maintenance | Assess modifications, analyze cascade, check authority, execute changes. |
| Stage Summary Creation | memory-maintenance | Synthesize Stage-level summary, append to Memory Root. |
| Manager Handoff | manager-handoff | Create Handoff Memory Log and Handoff Prompt for incoming Session. |

**Terms:**

| Term | Definition |
|------|------------|
| **Task Cycle** | Core coordination loop: assign → execute → report → review → decide → repeat. |
| **Task Assignment Prompt** | Self-contained prompt providing Worker with everything needed to execute a Task. |
| **FollowUp Task Assignment Prompt** | Refined Task Assignment issued after Coordination Decision determines retry needed. |
| **Task Report** | Concise summary output by Worker for User to return to Manager. |
| **Coordination Decision** | Manager's assessment after Task Memory Log review. Three outcomes: Proceed, FollowUp, Artifact Modification. |
| **Investigation** | Deeper review when flags raised or status non-Success. Can be self or delegated. |
| **Self-Investigation** | Manager investigates directly. Appropriate for small scope. |
| **Delegated Investigation** | Manager delegates investigation to Delegate Agent. Appropriate for large scope. |
| **Bounded Modification** | Artifact modification within Manager authority. Single Task, isolated change. |
| **Significant Modification** | Artifact modification requiring User collaboration. Multiple Tasks, direction change. |
| **Modification Assessment** | Determining which Coordination Artifact(s) need changes. |
| **Cascade Analysis** | Assessing cross-artifact implications of modifications. |
| **Consistency Verification** | Ensuring reference integrity, terminology, scope alignment across artifacts. |

---

### 3.2 Execution Layer (Worker Agent)

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| Session Initiation | worker-initiation | Initialize session, await prompt, register Agent identity. |
| Task Assignment Receipt | task-execution | Verify agent_id, parse structure, identify execution parameters. |
| Context Integration | task-execution | Execute integration actions for Cross-Agent dependencies. |
| Task Execution | task-execution | Execute instructions sequentially, handle delegation and pauses. |
| Task Validation | task-execution | Execute validations in order: Programmatic → Artifact → User. |
| Iteration Cycle | task-execution | Correct failures, re-execute, re-validate until success or stop condition. |
| Pause Handling | task-execution | Communicate pause reason, await input, resume execution. |
| Delegation Handling | task-execution | Create Delegation Prompt, await report, integrate findings. |
| Memory Logging | memory-logging | Populate Task Memory Log at specified path. |
| Task Reporting | memory-logging | Output Task Report for User to return to Manager. |
| Worker Handoff | worker-handoff | Create Handoff Memory Log and Handoff Prompt for incoming Session. |

**Terms:**

| Term | Definition |
|------|------------|
| **Instance Registration** | Process of binding a Worker session to a specific Agent identity from the first prompt received. |
| **Context Integration** | Pre-execution action where Worker reads and understands dependency outputs. |
| **Validation Ordering** | Required sequence: Programmatic → Artifact → User. User validation always last. |
| **Iteration Cycle** | Correction loop when validation fails: correct → re-execute → re-validate. |
| **Obligatory Pause** | Required pause for Delegation, explicit User actions, or User Validation. |
| **Autonomous Pause** | Optional pause at natural breakpoints during complex Tasks. Worker judgment. |
| **Failure Point** | Indicator of where/why Task didn't succeed. Values: `null`, `Execution`, `Validation`, or description. |
| **Continuing Worker Indication** | Statement in first Task Report after Handoff identifying Session number and loaded logs. |

---

### 3.3 Delegation Layer (Delegate Agent)

**Procedures:**

| Procedure | Skill/Command | Description |
|-----------|---------------|-------------|
| Delegation Execution | delegate-initiation + delegation skill | Execute delegated work following Delegation Prompt methodology. |
| Memory Logging | memory-logging | Create Delegation Memory Log with findings and integration notes. |
| Delegation Reporting | memory-logging | Output Delegation Report for User to return to Calling Agent. |

**Terms:**

| Term | Definition |
|------|------------|
| **Delegation** | Isolated work assigned to a Delegate Agent by a Calling Agent. |
| **Delegation Prompt** | Prompt providing Delegate with context and instructions for isolated work. |
| **Delegation Report** | Summary output by Delegate for User to return to Calling Agent. |
| **Delegation Type** | Category of delegated work. Primary types: Debug, Research. Custom types allowed. |
| **Debug Delegation** | Delegation for isolating and resolving complex bugs. |
| **Research Delegation** | Delegation for investigating knowledge gaps using current sources. |
| **Resolved** | Delegation status indicating issue addressed, findings ready for integration. |
| **Unresolved** | Delegation status indicating issue not fully resolved, partial findings available. |

---

### 3.4 Handoff Operations

Handoff transfers context between Sessions of the same Agent when context window limits approach. Applies to Manager and Worker Agents only.

**Procedures:**

| Procedure | Agent | Description |
|-----------|-------|-------------|
| Handoff Eligibility Check | Manager, Worker | Verify current work cycle is complete before Handoff proceeds. |
| Handoff Memory Log Creation | Manager, Worker | Create log containing working context not captured in other artifacts. |
| Handoff Prompt Creation | Manager, Worker | Create prompt instructing incoming Session to reconstruct context. |
| Context Reconstruction | Manager, Worker | Incoming Session reads artifacts and logs to rebuild working context. |
| Handoff Detection | Manager | Identify Worker Handoff from Task Report indication, adjust dependency treatment. |

**Terms:**

| Term | Definition |
|------|------------|
| **Handoff** | Context transfer between Sessions of the same Agent. |
| **Handoff Eligibility** | Requirements that must be met before Handoff can proceed. Varies by Agent Type. |
| **Handoff Denial** | Response when Handoff requested but eligibility requirements not met. |
| **Outgoing Session** | The Session performing Handoff. Creates Handoff artifacts. |
| **Incoming Session** | The Session receiving Handoff. Reconstructs context from artifacts. |
| **Context Reconstruction** | Process by which incoming Session rebuilds working context. |
| **Handoff Prompt** | Prompt instructing incoming Session how to reconstruct context. |
| **Current Stage Logs** | Memory Logs from the active Stage. Loaded during Handoff for efficiency. |
| **Prior Stage Logs** | Memory Logs from completed Stages. Not loaded during Handoff. Read on-demand when dependencies require. |

---

## 4. Types Reference

### 4.1 Agent Types

| Type | Description |
|------|-------------|
| Planner | Planning Phase coordination. Single Agent, single Session. |
| Manager | Implementation Phase coordination. Single Agent, multiple Sessions. |
| Worker | Implementation Phase execution. Multiple Agents, multiple Sessions each. |
| Delegate | Isolated focused work. Multiple Agents, single Session each. |

---

### 4.2 Task Status Types

| Status | Definition | Failure Point |
|--------|------------|---------------|
| **Success** | Objective achieved, all validation passed. | `null` |
| **Partial** | Intermediate state. Progress made but incomplete, needs guidance. | `Execution`, `Validation`, or description |
| **Failed** | Worker attempted but couldn't succeed. Issue within Task scope. | `Execution` or `Validation` |
| **Blocked** | External factors prevent progress. Requires coordination-level resolution. | Description of blocker |

---

### 4.3 Delegation Status Types

| Status | Definition |
|--------|------------|
| **Resolved** | Delegated issue addressed. Findings ready for integration. |
| **Unresolved** | Issue not fully resolved. Partial findings available. |

---

### 4.4 Validation Types

| Type | Definition | Iteration Behavior |
|------|------------|-------------------|
| **Programmatic** | Automated verification. Tests pass, builds succeed, scripts execute. | Autonomous iteration allowed. |
| **Artifact** | Output existence and structure verification. Files exist with required format. | Autonomous iteration allowed. |
| **User** | Human judgment required. Design approval, content quality, decisions. | Must pause for review. |

---

### 4.5 Coordination Decision Outcomes

| Outcome | Definition | Next Action |
|---------|------------|-------------|
| **Proceed** | No issues found. Investigation revealed false positive or Success confirmed. | Continue to next Task. |
| **FollowUp** | Issues require Worker to retry with refined instructions. | Create FollowUp Task Assignment Prompt. |
| **Artifact Modification** | Issues require Coordination Artifact updates. | Execute Artifact Maintenance Procedure. |

---

### 4.6 Investigation Scope Types

| Scope | Definition | Approach |
|-------|------------|----------|
| **Small** | Few files, straightforward verification, contained to single Task. | Self-investigation by Manager. |
| **Large** | Context-intensive, systemic issues, impacts multiple Tasks. | Delegated investigation. |

---

### 4.7 Context Dependency Types

| Type | Definition | Context Depth |
|------|------------|---------------|
| **Same-Agent** | Producer and consumer are the same Agent. | Light (recall anchors, file paths). |
| **Cross-Agent** | Producer and consumer are different Agents. | Comprehensive (full context, integration actions). |

---

### 4.8 Delegation Types

| Type | Definition | Skill Reference |
|------|------------|-----------------|
| **Debug** | Isolating and resolving complex bugs. | delegate-debug |
| **Research** | Investigating knowledge gaps using current sources. | delegate-research |
| **Custom** | Other isolated work not covered by primary types. | Described in Delegation Prompt |

---

### 4.9 Memory Log Flag Types

| Flag | Definition | When True |
|------|------------|-----------|
| **important_findings** | Discoveries with implications beyond current Task scope. | Manager attention needed. |
| **compatibility_issues** | Output conflicts with existing systems. | Integration concerns exist. |
| **delegation** | Delegate Agent delegation occurred during Task. | Delegation section required in log. |

---

### 4.10 Task Assignment Flag Types

| Flag | Definition | Effect |
|------|------------|--------|
| **has_dependencies** | Task Assignment includes Context Dependencies. | Context from Dependencies section included. |
| **has_delegation_steps** | Task Assignment includes Delegation. | Delegation section included in prompt. |

---

### 4.11 Modification Authority Types

| Type | Definition | Action |
|------|------------|--------|
| **Bounded** | Within Manager authority. Single Task, isolated change. | Manager executes directly. |
| **Significant** | Requires User collaboration. Multiple Tasks, direction change. | Manager presents options, User decides. |

---

**End of Terminology**
