# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Parallel Task Coordination (Future)

**Context:** The Message Bus architecture (implemented in `{SKILL_PATH:apm-communication}`) supports parallel Task execution. The Manager can write Task Prompts to multiple Send Buses before receiving Reports. This requires changes to the Manager's Task Cycle (currently sequential) to support batch assignment and independent Report processing.

Additionally, platforms with native multi-agent capabilities (e.g., Claude Code Agent Teams) enable Workers to internally parallelize complex work by spawning sub-teams. APM can leverage this without coupling to any single platform by using the existing conditional placeholder system in the build pipeline.

**Status:** Future work. Bus infrastructure supports parallel dispatch; Manager coordination model and Worker execution model do not yet support it. This proposal covers three coordinated enhancements: Batch Task Assignment, Parallel Dispatch, and a Dependency Graph for the Implementation Plan, plus an optional platform-specific Team Execution capability.

### Design Principles

1. **Platform agnosticism** - Batch Assignment and Parallel Dispatch are platform-agnostic enhancements to the bus protocol and Manager/Worker coordination models. Platform-specific capabilities (Team Execution) are additive and delivered through the existing conditional placeholder system.
2. **Manager abstraction** - The Manager assigns tasks and reviews reports. Whether a Worker executes solo, uses delegates, or spawns a platform-native team is an internal Worker decision invisible to the Manager. Reports and Memory Logs have the same structure regardless.
3. **Individual task logging** - Every task gets its own Memory Log at its own `memory_log_path`, whether executed solo, in a batch, or via a team. Batch and team execution affect user friction and speed, not the Memory System's structure.
4. **Fail-fast on batch** - A Blocked or Failed task in a batch stops execution of remaining tasks. The Worker reports partial results. The Manager makes per-task Coordination Decisions on what completed and re-plans the rest.
5. **File ownership, not file locking** - Neither APM nor any known platform provides real file-level locking for concurrent agent edits. Conflict avoidance is the Manager's responsibility through proper task decomposition ensuring distinct file ownership per Worker (and per teammate, if Team Execution is used).

---

### Component 1: Batch Task Assignment

**What:** The Manager sends multiple sequential tasks to the same Worker in a single Send Bus message. The Worker executes them in order, logs each individually, and returns one consolidated Batch Report. The User only shuttles files at batch boundaries, not between each task.

**When:** The Manager identifies batch candidates during task assignment: consecutive tasks assigned to the same Worker where each task depends only on the previous task in the chain (or on already-completed tasks), no cross-Agent dependencies exist within the chain, and no tasks assigned to other Workers depend on intermediate tasks in the chain.

**Batch Assessment** - Addition to the Task Assignment guide. Before generating a Task Prompt, the Manager examines remaining tasks in the current Stage for the target Worker and evaluates batch candidacy using the criteria above. If 2+ candidates are identified, generate Task Prompts for all and write them to the Send Bus as a batch. Otherwise, standard single-task assignment.

**Send Bus Format** - The Send Bus file gains a batch envelope in YAML frontmatter (`batch: true`, `batch_size`, task manifest with `task_ref` and `memory_log_path` per task). Individual Task Prompts follow sequentially in the same file, separated by `---` delimiters. Each Task Prompt retains its own full structure (sections, dependency context, validation criteria) as if it were standalone.

**Worker Execution** - Addition to the Task Execution guide. On receiving a batch, the Worker parses all Task Prompts, validates `agent_id` for each, and executes them sequentially through the standard §3.1-3.8 procedure per task. Each task's Memory Log is written individually at its `memory_log_path` upon that task's completion. If any task results in Blocked or Failed status, the Worker stops the batch, does not proceed to remaining tasks, and writes the Batch Report reflecting partial completion.

**Batch Report** - Addition to the Memory Logging guide. A new report format with YAML frontmatter listing per-task status and a concise body section per completed task (summary + Memory Log reference). Remaining unstarted tasks are listed as "Not started (batch stopped)". Written to the Report Bus as a single message. The Manager processes each task's result independently through the existing Coordination Decision procedure.

**Manager Report Processing** - Addition to the Memory Maintenance guide. On receiving a Batch Report, the Manager reviews each completed task's Memory Log individually and makes independent Coordination Decisions per task. Remaining unstarted tasks from a stopped batch re-enter the assignment pool for the next cycle.

### Component 2: Parallel Dispatch

**What:** The Manager writes Task Prompts to multiple Workers' Send Buses before waiting for any Reports. Workers execute concurrently in separate sessions. The User delivers Send Bus files to each Worker session and returns Reports to the Manager as they arrive.

**When:** Tasks in the current Stage are assigned to different Workers and share no unresolved cross-Agent dependencies between them. The Dependency Graph (Component 3) aids this assessment visually; the Manager identifies parallel dispatch opportunities by examining same-stage tasks with independent dependency chains.

**In-Flight Tracking** - The Manager maintains a lightweight in-flight tracker in working context: which Workers have active tasks, which tasks are dispatched, and which Reports are outstanding. This is not a new artifact -- it is part of the Manager's operational reasoning during the Task Cycle.

**Dispatch Procedure** - After identifying parallelizable tasks, the Manager generates Task Prompts for each (individually or as batches per Worker) and writes them to respective Send Buses. The Manager informs the User of all pending Send Bus paths and which Worker sessions need them. The Manager then awaits Reports, processing each as it arrives through the standard Coordination Decision procedure.

**Report Collection** - Reports arrive asynchronously as Users return them. The Manager processes each independently. A Blocked result from one Worker does not automatically block other Workers unless their next tasks depend on the blocked output. The Manager reassesses dispatch opportunities after each Report.

**Combination with Batch** - Parallel Dispatch and Batch Assignment compose naturally. The Manager can dispatch batch assignments to Worker A and Worker B simultaneously. Worker A executes its batch of 3 sequential tasks while Worker B executes its batch of 2. Reports return independently.

### Component 3: Dependency Graph

**What:** A mermaid dependency graph generated by the Planner Agent at the end of Work Breakdown (§3.6 Plan Review) and placed in the Implementation Plan header. Provides visual identification of parallelization opportunities, critical path, and cross-stage bottlenecks.

**Layout:** `graph TB` with one `subgraph` per Stage using `direction LR`. Tasks are nodes within their Stage subgraph, flowing left-to-right. Cross-stage dependencies are edges between subgraphs, flowing top-to-bottom. Nodes are color-coded by Agent assignment. Node labels contain Task ID, abbreviated title, and Agent name.

**Placement:** New header field in the Implementation Plan template: `* **Dependency Graph:**` followed by the mermaid code block. Generated after Stage Cycles (§3.5) and before Plan Review (§3.6), since all tasks, dependencies, and agent assignments are finalized by that point.

**Generation Procedure** - Addition to the Work Breakdown guide at §3.6. The Planner:
1. Collects all tasks, their Agent assignments, and their dependencies
2. Groups tasks by Stage into subgraphs
3. Creates intra-stage edges (dependencies within the same stage)
4. Creates cross-stage edges (dependencies spanning stages)
5. Assigns colors by Agent domain (consistent palette across the graph)
6. Outputs the mermaid block into the Implementation Plan header

**Reading the Graph:**
- Horizontal chains within a row: intra-stage sequential dependencies
- Vertical/diagonal edges between rows: cross-stage dependencies (coordination points)
- Same-color consecutive nodes in a row with only chain-internal dependencies: batch candidates
- Nodes with no incoming cross-stage edges: candidates for parallel dispatch
- Nodes with many outgoing edges: critical path bottlenecks

**Scalability:** The stage-row layout scales with project size because each row is bounded by tasks-per-stage (typically 3-8). For projects with 30-40+ tasks, the graph remains readable as stages stack vertically. A Stage with 10+ tasks is itself a signal that the work-breakdown should consider splitting it.

### Component 4: Platform-Specific Team Execution (Optional)

**What:** On platforms with native multi-agent team capabilities, Workers MAY internally spawn a team to parallelize work within their assigned task scope. The Worker becomes the team lead, delegates sub-work to teammates, synthesizes results, cleans up the team, and reports back through the standard bus protocol. The Manager is unaware this happened.

**Platform Scope:** Currently applicable to Claude Code (Agent Teams feature, experimental). Delivered through the existing conditional placeholder system in the build pipeline. Other platforms receive no team-related content. If future platforms gain equivalent capabilities, new placeholders can be added without changing the core protocol.

**Build Integration:** A new conditional placeholder (e.g., `{WORKER_TEAM_GUIDANCE}`) that resolves to a Team Execution Standards subsection for supported platforms and to empty string for others. Inserted into the Task Execution guide as an Operational Standard (§2) and a conditional step in the Task Execution Procedure (§3.3). No new skill file; no changes to any other guide.

**When to Use:** Worker judgment based on task complexity. Appropriate for batch assignments with 3+ tasks where sub-tasks have independent file ownership, or single complex tasks with multiple independent deliverables touching distinct file groups. Not appropriate for single-file tasks, tightly sequential steps, or tasks where coordination overhead exceeds the benefit.

**Cleanup Protocol:** Before writing the Task Memory Log and Report, the Worker MUST shut down all teammates and run team cleanup. Team resources are ephemeral. The Memory Log captures outcomes; the team context does not persist. This is a hard requirement, not a suggestion.

**Nested Teams Through Composition:** APM Workers are independent sessions, not teammates within a platform team. Each Worker can independently become a team lead on supported platforms. This achieves multi-team coordination (e.g., a Frontend Team and a Backend Team running concurrently) without requiring nested team support from any platform. APM's Manager coordinates across teams at the project level; each Worker's internal team handles domain-level parallelism.

---

### Answered Open Questions (from original proposal)

**1. How does the Manager track which Tasks are "in flight" across multiple Workers?**
Lightweight in-flight tracker in Manager working context (not a new artifact). Tracks which Workers have dispatched tasks, which Reports are outstanding. Updated as part of the coordination cycle. See Component 2.

**2. Should parallel assignment be configurable in the Implementation Plan (per-Stage)?**
No explicit configuration needed. The Implementation Plan already contains dependency information per task. The Manager identifies parallel dispatch and batch opportunities by analyzing dependencies during task assignment. The Dependency Graph (Component 3) provides visual support. Parallelism is implicit in the plan structure, not a per-Stage flag.

**3. How does the User manage multiple Worker sessions simultaneously?**
For Parallel Dispatch: the User delivers Send Bus files to each Worker session after the Manager writes them. Workers execute concurrently in separate sessions. Reports return to the Manager as the User collects them. For Batch Assignment: the User delivers one Send Bus file per Worker and returns one Batch Report -- reduced round-trips. For Team Execution (CC): the Worker spawns and manages teammates autonomously within its session; no additional User management needed.

**4. Git branching strategy for parallel Workers modifying the same codebase?**
Primary strategy: file-partitioned parallelism. The Manager decomposes tasks so each Worker (and each teammate within a team) owns distinct files. This is already the recommended approach and is reinforced by the Dependency Graph making file ownership visible. Branch-per-Worker is a possible future enhancement but is not required for the initial implementation -- file partitioning is sufficient when task decomposition is done well.

### New Open Questions

1. **Batch size limit:** Should there be a maximum batch size (e.g., 5 tasks) to prevent Workers from accumulating excessive context before reporting? Or is the fail-fast principle sufficient?
2. **Batch + FollowUp interaction:** When a batch task fails and the Manager issues a FollowUp, should remaining unstarted tasks from the original batch be re-batched with the FollowUp, or dispatched separately after the FollowUp succeeds?
3. **Dependency Graph maintenance:** Should the Manager update the Dependency Graph when modifying the Implementation Plan (adding/removing tasks), or is it a Planner-only artifact that becomes a point-in-time snapshot?
4. **Team Execution cost guidance:** Should APM provide guidance on when Team Execution is cost-effective vs. wasteful? Token costs scale with team size. This could be part of the Team Execution Standards or left entirely to Worker judgment.
5. **Parallel Dispatch + Handoff interaction:** If the Manager needs a Handoff while multiple Workers have in-flight tasks, should all Reports be collected first, or can the Handoff proceed with in-flight state noted in the Handoff File?

### Affected Components

| Component | Change Type | Scope |
|-----------|------------|-------|
| Task Assignment guide | Add Batch Assessment procedure | All platforms |
| Task Execution guide | Add batch receipt handling + conditional Team Execution section | All platforms (team: CC only) |
| Memory Logging guide | Add Batch Report format | All platforms |
| Communication Skill | Add Batch Delivery protocol | All platforms |
| Memory Maintenance guide | Add batch report review + parallel report collection handling | All platforms |
| Work Breakdown guide | Add Dependency Graph generation step | All platforms |
| Implementation Plan template | Add Dependency Graph header field | All platforms |
| Build config (`build-config.json`) | Add `teamGuidance` field for supported platforms | Build system |
| Placeholder processor (`placeholders.js`) | Add `{WORKER_TEAM_GUIDANCE}` replacement | Build system |

---

## Session Continuation Workflow (February 2026)

**Context:** Designing a mechanism to close the agentic loop when an APM session completes. Users need to archive completed sessions and start fresh while optionally leveraging previous session context.

**Problem Statement:** When an APM session completes (all stages done, deliverables working), there's no formal continuation mechanism. The Manager can add tasks but lacks the Planner's discovery capabilities. Existing artifacts reflect completed work, not new scope. Users need to start fresh while optionally preserving access to previous session context.

**Key Constraint:** Archived context is a snapshot; the codebase is mutable. Automatic session linking creates fragile dependency chains-Session B may invalidate Session A's context without explicit relationship.

### Design Principles

1. **No programmatic linking** - Archives are storage, not dependency sources
2. **User decides relevance** - Planner asks, doesn't assume
3. **Verify before asking** - Context retrieval + codebase verification THEN questions
4. **Snapshot acknowledgment** - Summaries explicitly state point-in-time nature

### Components

| Component | Purpose | Actor |
|-----------|---------|-------|
| `apm continue` | Archive current session, create fresh templates | CLI (programmatic) |
| `/apm-summarize-session` | Create high-level summary artifact (optional) | Native agent (no APM layers) |
| Context Detection | Detect archives, ask user about relevance | Planner Agent |
| Context Retrieval | Explore archive + verify against codebase | Subagent |

### `apm continue` Command

**Behavior:**
```
$ apm continue [-n|--name <name>]

1. Prompt for archive name (or use flag/default)
2. Move .apm/* to .apm/archives/<name>/
3. Create fresh template artifacts
4. Output completion message
```

**Archive Structure:**
```
.apm/archives/<name>/
├── Implementation_Plan.md
├── Specifications.md
├── APM_Session_Summary.md    # If summarize was run
└── Memory/
```

### Planner Context Detection (Addition to Context Gathering)

**§0.1 Previous Session Detection:**
1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any relevant? Which ones and any caveats?"
4. User decides: none (fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if user indicates relevance):**
1. Spawn exploration subagent to examine archive
2. Spawn verification subagent to check against current codebase
3. Integrate findings into Question Rounds as delta-focused questions

### Open Questions

1. **Default archive naming:** Incremental (`session-1`, `session-2`) vs timestamp-based?
2. **Summary command naming:** `/apm-summarize-session` vs `/apm-session-summary`?
3. **Stale archive cleanup:** Should there be an `apm archives --prune` command?
4. **Multi-archive selection:** Can user select multiple archives? How does Planner handle conflicts?

### Next Steps

- [ ] Define `apm continue` CLI specification
- [ ] Define `/apm-summarize-session` command procedure
- [ ] Add §0.1 and §0.2 to Context Gathering guide
- [ ] Define APM_Session_Summary.md template structure

---
