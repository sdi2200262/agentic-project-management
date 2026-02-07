# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Parallel Task Coordination (Future)

**Context:** The Message Bus architecture (implemented in `{SKILL_PATH:apm-communication}`) supports parallel Task execution. The Manager can write Task Prompts to multiple Send Buses before receiving Reports. This requires changes to the Manager's Task Cycle (currently sequential) to support batch assignment and independent Report processing.

Additionally, platforms with native multi-agent capabilities (e.g., Claude Code Agent Teams) enable Workers to internally parallelize complex work by spawning sub-teams. APM can leverage this without coupling to any single platform by using the existing conditional placeholder system in the build pipeline.

**Status:** Future work. Bus infrastructure supports parallel dispatch; Manager coordination model and Worker execution model do not yet support it. This proposal covers three coordinated enhancements: Batch Task Assignment, Parallel Dispatch, and a Dependency Graph for the Implementation Plan, plus an optional Claude Code-specific Team Execution capability.

### Design Principles

1. **Platform agnosticism** - Batch Assignment and Parallel Dispatch are platform-agnostic enhancements to the bus protocol and Manager/Worker coordination models. Platform-specific capabilities (Team Execution) are additive and delivered through the existing conditional placeholder system.
2. **Manager abstraction** - The Manager assigns tasks and reviews reports. Whether a Worker executes solo, uses delegates, or spawns a platform-native team is an internal Worker decision invisible to the Manager. Reports and Memory Logs have the same structure regardless.
3. **Individual task logging** - Every task gets its own Memory Log at its own `memory_log_path`, whether executed solo, in a batch, or via a team. Batch and team execution affect user friction and speed, not the Memory System's structure.
4. **Fail-fast on batch** - A Blocked or Failed task in a batch stops execution of remaining tasks. The Worker reports partial results. The Manager makes per-task Coordination Decisions on what completed and re-plans the rest.
5. **Source control and conflict management** - Neither APM nor any known platform provides real file-level locking for concurrent agent edits. When dispatching tasks in parallel, the Manager warns the User about possible file overlaps and overwrites across concurrent Workers. The Manager suggests initializing a git repository if one is not present, or working in branches if already suggested by the Implementation Plan, Specifications, or Standards. The recommended strategy is hierarchical branching: each Worker operates on its own branch off the main branch. If a Worker uses Team Execution (Component 4), each teammate operates on a sub-branch off the Worker's branch. Merges happen hierarchically -- the Worker merges teammate branches before logging and reporting; the Manager merges Worker branches when needed or when requested by the User. Conflicts are resolved by the "merger" at each branching point, as the top instance in that hierarchy has the best context to make resolution decisions. File-partitioned task decomposition (ensuring distinct file ownership per Worker) remains a complementary practice that reduces merge conflicts but does not replace branching.

### Component 1: Batch Task Assignment

**What:** The Manager sends multiple sequential tasks to the same Worker in a single Send Bus message. The Worker executes them in order, logs each individually, and returns one consolidated Batch Report. The User only shuttles files at batch boundaries, not between each task.

**When:** The Manager identifies batch candidates during task assignment: consecutive tasks assigned to the same Worker where each task depends only on the previous task in the chain (or on already-completed tasks), no cross-Agent dependencies exist within the chain, and no tasks assigned to other Workers depend on intermediate tasks in the chain.

**Batch Assessment** - Addition to the Task Assignment guide. Before generating a Task Prompt, the Manager examines remaining tasks in the current Stage for the target Worker and evaluates batch candidacy using the criteria above. If 2+ candidates are identified, generate Task Prompts for all and write them to the Send Bus as a batch. Otherwise, standard single-task assignment. The Manager must verify via the Dependency Graph (Component 3) that no forward dependencies leak across concurrent batches -- for example, if Worker B's batch task 3 depends on Worker A's batch task 2, and both batches are dispatched in parallel, Worker B will hit a dependency gap. The Manager must either exclude the dependent task from the batch or sequence the batches.

**Send Bus Format** - The Send Bus file gains a batch envelope in YAML frontmatter (`batch: true`, `batch_size`, task manifest with `task_ref` and `memory_log_path` per task). Individual Task Prompts follow sequentially in the same file, separated by `---` delimiters. Each Task Prompt retains its own full structure (sections, dependency context, validation criteria) as if it were standalone.

**Worker Execution** - Addition to the Task Execution guide. On receiving a batch, the Worker parses all Task Prompts, validates `agent_id` for each, and executes them sequentially through the standard §3.1-3.8 procedure per task. Each task's Memory Log is written individually at its `memory_log_path` upon that task's completion. If any task results in Blocked or Failed status, the Worker stops the batch, does not proceed to remaining tasks, and writes the Batch Report reflecting partial completion. Workers must pause and report blockers when they encounter context dependency gaps during execution -- missing files, unavailable interfaces, or outputs that should have been produced by another Agent. Workers must NOT attempt to fill these gaps by doing another Agent's work without being asked.

**Batch Report** - Addition to the Memory Logging guide. A new report format with YAML frontmatter listing per-task status and a concise body section per completed task (summary + Memory Log reference). Remaining unstarted tasks are listed as "Not started (batch stopped)". Written to the Report Bus as a single message. The Manager processes each task's result independently through the existing Coordination Decision procedure.

**Manager Report Processing** - Addition to the Memory Maintenance guide. On receiving a Batch Report, the Manager reviews each completed task's Memory Log individually and makes independent Coordination Decisions per task. Remaining unstarted tasks from a stopped batch re-enter the assignment pool for the next cycle.

### Component 2: Parallel Dispatch

**What:** The Manager writes Task Prompts to multiple Workers' Send Buses before waiting for any Reports. Workers execute concurrently in separate sessions. The User delivers Send Bus files to each Worker session and returns Reports to the Manager as they arrive.

**When:** Tasks in the current Stage are assigned to different Workers and share no unresolved cross-Agent dependencies between them. The Dependency Graph (Component 3) aids this assessment visually; the Manager identifies parallel dispatch opportunities by examining same-stage tasks with independent dependency chains.

**In-Flight Tracking** - The Manager maintains a lightweight in-flight tracker in working context: which Workers have active tasks, which tasks are dispatched, and which Reports are outstanding. This is not a new artifact -- it is part of the Manager's operational reasoning during the Task Cycle.

**Dispatch Procedure** - After identifying parallelizable tasks, the Manager generates Task Prompts for each (individually or as batches per Worker) and writes them to respective Send Buses. The Manager informs the User of all pending Send Bus paths and which Worker sessions need them. The Manager then awaits Reports, processing each as it arrives through the standard Coordination Decision procedure.

**Report Collection** - Reports arrive asynchronously as Users return them. The Manager processes each independently. A Blocked result from one Worker does not automatically block other Workers unless their next tasks depend on the blocked output. The Manager reassesses dispatch opportunities after each Report.

**Combination with Batch** - Parallel Dispatch and Batch Assignment compose naturally. The Manager can dispatch batch assignments to Worker A and Worker B simultaneously. Worker A executes its batch of 3 sequential tasks while Worker B executes its batch of 2. Reports return independently.

### Component 3: Dependency Graph ✓

**Status:** Implemented. Added §4.6 Dependency Graph Format and §3.6 step 6 to work-breakdown.md; added header field to Implementation_Plan.md. Also moved stage directory creation from Manager to Worker (memory-logging.md §3.1 step 1) to remove a pre-dispatch bottleneck.

**What:** A mermaid dependency graph generated by the Planner Agent at the end of Work Breakdown and placed in the Implementation Plan header. Provides visual identification of parallelization opportunities, batch candidates, critical path, and cross-stage bottlenecks.

**Placement:** New header field in the Implementation Plan template: `* **Dependency Graph:**` followed by the mermaid code block. Generated after Stage Cycles (§3.5) and during Plan Review (§3.6), since all tasks, dependencies, and agent assignments are finalized by that point.

**Graph Structure:**
- Graph type: `graph TB` (top-to-bottom overall flow)
- Each Stage is a `subgraph` with `direction LR` (left-to-right within stage)
- Subgraphs are labeled: `S<N>["Stage <N>: <Stage Name>"]`

**Node Specification:**
- Node ID: `T<Stage>_<Task>` (e.g., `T1_1`, `T2_3`)
- Node label: `"<Task ID> <Abbreviated Title><br/><i><Agent Name></i>"`
- Example: `T2_1["2.1 API Endpoints<br/><i>Backend Agent</i>"]`

**Edge Rules:**
- Intra-stage dependency: `T<S>_<A> --> T<S>_<B>` (within the same subgraph)
- Cross-stage dependency: `T<S1>_<A> --> T<S2>_<B>` (between subgraphs, outside any subgraph block)
- Tasks with no dependencies have no incoming edges (entry points for their stage)
- Only direct dependencies are drawn; transitive dependencies are not (the graph shows the dependency structure, not the full closure)

**Color Assignment:**
- Each Agent domain gets a consistent fill color across all nodes
- Applied via `style T<S>_<T> fill:<color>,stroke:<stroke>` after all subgraphs
- Color palette assigned in order of Agent appearance in the Implementation Plan Agents field

**Generation Procedure** - Addition to the Work Breakdown guide at §3.6:
1. Collect all tasks, their Agent assignments, and their Dependencies fields
2. Assign one color per Agent domain
3. For each Stage, create a `subgraph` block with `direction LR` containing all tasks in that Stage as nodes
4. For each task with dependencies, create edges: intra-stage edges inside the subgraph, cross-stage edges outside all subgraph blocks
5. Append `style` declarations for all nodes
6. Write the mermaid code block into the Implementation Plan header under `* **Dependency Graph:**`

**Reading the Graph:**
- Horizontal chains within a row: intra-stage sequential dependencies
- Vertical/diagonal edges between rows: cross-stage dependencies (coordination points)
- Same-color consecutive nodes in a row with only chain-internal dependencies: batch candidates
- Nodes with no incoming cross-stage edges: candidates for parallel dispatch
- Nodes with many outgoing edges: critical path bottlenecks

**Scalability:** The stage-row layout scales with project size because each row is bounded by tasks-per-stage (typically 3-8). For projects with 30-40+ tasks, the graph remains readable as stages stack vertically. A Stage with 10+ tasks is itself a signal that the work-breakdown should consider splitting it.

### Component 4: Claude Code Agent Teams Integration (Optional)

**What:** On Claude Code, Workers MAY optionally use the Agent Teams feature to internally spawn a team and parallelize work within their assigned task scope. The Worker becomes the team lead, delegates sub-work to teammates, synthesizes results, cleans up the team, and reports back through the standard bus protocol. The Manager is unaware this happened.

**Experimental Status:** Claude Code Agent Teams is an experimental feature, disabled by default, requiring the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable. Because the underlying platform feature is experimental, this APM integration is optional and should be treated as such. Reference: https://code.claude.com/docs/en/agent-teams

**Platform Scope:** This component applies exclusively to Claude Code. It is delivered through the existing conditional placeholder system in the build pipeline -- a new placeholder (e.g., `{WORKER_TEAM_GUIDANCE}`) resolves to a Team Execution Standards subsection for Claude Code and to empty string for all other platforms. If future platforms introduce equivalent multi-agent team capabilities, new placeholder targets can be added without changing the core APM protocol.

**Build Integration:** The placeholder inserts content into the Task Execution guide as an Operational Standard (§2) and a conditional step in the Task Execution Procedure (§3.3). No new skill file; no changes to any other guide. Other platforms see the same task-execution guide they always have.

**When to Use:** Worker judgment based on task complexity. Appropriate for batch assignments with 3+ tasks where sub-tasks have independent file ownership, or single complex tasks with multiple independent deliverables touching distinct file groups. Not appropriate for single-file tasks, tightly sequential steps, or tasks where coordination overhead exceeds the benefit. The Worker should consider the token cost implications -- each teammate is a separate Claude instance.

**Branching with Teams:** Per Design Principle 5, when Team Execution is used, each teammate operates on a sub-branch off the Worker's branch. The Worker (as team lead) merges teammate branches and resolves any conflicts before writing the Task Memory Log and reporting to the Manager. This ensures the Worker's branch is clean and merge-ready when the Manager processes the report.

**Cleanup Protocol:** Before writing the Task Memory Log and Report, the Worker MUST shut down all teammates and run team cleanup. Team resources are ephemeral. The Memory Log captures outcomes; the team context does not persist. This is a hard requirement, not a suggestion.

**Nested Teams Through Composition:** APM Workers are independent sessions, not teammates within a platform team. Each Worker can independently become a Claude Code team lead. This achieves multi-team coordination (e.g., a Frontend Team and a Backend Team running concurrently) without requiring nested team support from the platform -- a feature Claude Code does not offer. APM's Manager coordinates across Workers at the project level; each Worker's internal team handles domain-level parallelism.

### Answered Open Questions

**1. How does the Manager track which Tasks are "in flight" across multiple Workers?**
Lightweight in-flight tracker in Manager working context (not a new artifact). Tracks which Workers have dispatched tasks, which Reports are outstanding. Updated as part of the coordination cycle. See Component 2.

**2. Should parallel assignment be configurable in the Implementation Plan (per-Stage)?**
No explicit configuration needed. The Implementation Plan already contains dependency information per task. The Manager identifies parallel dispatch and batch opportunities by analyzing dependencies during task assignment. The Dependency Graph (Component 3) provides visual support. Parallelism is implicit in the plan structure, not a per-Stage flag.

**3. How does the User manage multiple Worker sessions simultaneously?**
For Parallel Dispatch: the User delivers Send Bus files to each Worker session after the Manager writes them. Workers execute concurrently in separate sessions. Reports return to the Manager as the User collects them. For Batch Assignment: the User delivers one Send Bus file per Worker and returns one Batch Report -- reduced round-trips. For Team Execution (CC): the Worker spawns and manages teammates autonomously within its session; no additional User management needed.

**4. Git branching strategy for parallel Workers modifying the same codebase?**
Recommended strategy: hierarchical branching. Each Worker operates on its own branch; teammates (if Team Execution is used) operate on sub-branches off the Worker's branch. Merges happen bottom-up: teammates into Worker branch, Worker branches into main. The merger at each level has the best context to resolve conflicts. File-partitioned task decomposition complements this by reducing the frequency and severity of merge conflicts. The Manager suggests this strategy to the User when dispatching parallel work and warns about overlap risks. The final choice is the User's.

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
| Build config (`build-config.json`) | Add `teamGuidance` field for Claude Code target | Build system |
| Placeholder processor (`placeholders.js`) | Add `{WORKER_TEAM_GUIDANCE}` replacement | Build system |

---

## Session Continuation Workflow (Future)

**Context:** Designing a mechanism to close the agentic loop when an APM session completes. Users need to archive completed sessions and start fresh while optionally leveraging previous session context.

When an APM session completes (all stages done, deliverables working), there is no formal continuation mechanism. The Manager can add tasks but lacks the Planner's discovery capabilities. Existing artifacts reflect completed work, not new scope. Users need to start fresh while optionally preserving access to previous session context.

**Status:** Future work. Requires a new CLI command, a new standalone slash command, and additions to the Planner's Context Gathering procedure.

### Design Principles

1. **No programmatic linking** - Archives are storage, not dependency sources. Automatic session linking creates fragile dependency chains -- Session B may invalidate Session A's context without explicit relationship.
2. **User decides relevance** - The Planner asks about archives; it does not assume they are relevant.
3. **Verify before asking** - Context retrieval and codebase verification happen BEFORE the Planner incorporates archived context into Question Rounds. Stale context is worse than no context.
4. **Snapshot acknowledgment** - Summaries and archives explicitly state their point-in-time nature. The archived context is a snapshot; the codebase is mutable.

### Component 1: `apm continue` CLI Command

**What:** A CLI command that archives the current session's APM artifacts and creates fresh templates for a new session.

**Behavior:**

```
$ apm continue [-n|--name <name>]
```

1. Prompt for archive name (or use `--name` flag, or generate default)
2. Move coordination artifacts and Memory to `.apm/archives/<name>/`
3. Clear the bus directory entirely (bus state is ephemeral and session-specific; it is not archived)
4. Create fresh template artifacts (Implementation Plan, Specifications, Memory Root)
5. Output completion message with archive path

**Archive Structure:**
```
.apm/archives/<name>/
├── Implementation_Plan.md
├── Specifications.md
├── APM_Session_Summary.md    # Only if summarize command was run before continue
└── Memory/
```

The bus directory (`.apm/bus/`) is not archived. It contains ephemeral session state (Send Bus, Report Bus, Handoff Bus files) that is meaningless outside the session that created it. A new session will have different Workers and a fresh bus layout.

### Component 2: `/apm-summarize-session` Standalone Command

**What:** A lightweight slash command that any agent on any platform can run to produce a high-level summary of the completed APM session. This is a standalone command, not an APM Agent workflow -- it does not require initiating a Planner, Manager, or Worker. Any agent in any session can run it as a quick summarization pass over the APM artifacts.

**Rationale:** Making this a full APM Agent workflow (with its own initiation command) would add friction to what should be a simple pre-archival step. The command reads existing artifacts, synthesizes a summary, and writes one file. No coordination, no bus communication, no Memory Logging.

**Output:** `APM_Session_Summary.md` written to `.apm/`. Contains a point-in-time summary of the session: project scope, stages completed, key outcomes, notable findings, and known issues. Explicitly states that it is a snapshot and the codebase may have diverged.

**Usage:** Optional. Run before `apm continue` if the User wants a summary preserved in the archive. If not run, the archive contains the raw artifacts (Implementation Plan, Specifications, Memory) which are sufficient for a future Planner to examine.

### Component 3: Planner Context Detection

**What:** Additions to the Context Gathering guide that enable the Planner to detect and optionally leverage archived sessions from previous APM runs.

**§0.1 Previous Session Detection:**
1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any of these previous sessions relevant to the current project scope? If so, which ones, and are there any caveats?"
4. User decides: none (proceed with fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if User indicates relevance):**
1. Spawn exploration subagent to examine the indicated archive(s) -- read Implementation Plan, Specifications, Session Summary (if present), and Memory Root Stage Summaries
2. Spawn verification subagent to check archived context against the current codebase -- identify what still holds, what has changed, and what has been invalidated
3. Integrate verified findings into Question Rounds as delta-focused questions (what changed since the archived session, not re-asking what was already established)

### Open Questions

1. **Default archive naming:** Incremental (`session-1`, `session-2`) vs timestamp-based (`2026-02-05`)? Incremental is simpler; timestamps are self-documenting.
2. **Summary command naming:** `/apm-summarize-session` vs `/apm-session-summary`? The verb-first form is consistent with APM command naming patterns.
3. **Stale archive cleanup:** Should there be an `apm archives --prune` command for removing old archives? Or is manual cleanup sufficient?
4. **Multi-archive selection:** Can the User indicate multiple archives as relevant? If so, how does the Planner handle conflicting context across archives?

### Affected Components

| Component | Change Type | Scope |
|-----------|------------|-------|
| CLI (`src/commands/`) | New `continue` command | CLI |
| Standalone command template | New `/apm-summarize-session` command | All platforms |
| Context Gathering guide | Add §0.1 and §0.2 for archive detection and retrieval | All platforms |
| APM Session Summary template | New `APM_Session_Summary.md` format definition | All platforms |
| `.apm/` directory structure | Archive subdirectory convention | All platforms |

---
