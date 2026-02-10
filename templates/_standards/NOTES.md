# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Parallel Task Coordination (Standards Complete — Awaiting Template Refactor)

**Context:** The Message Bus architecture (`{SKILL_PATH:apm-communication}`) supports parallel Task execution. Components 1-3 (Batch Task Assignment, Parallel Dispatch, Dependency Graph) have been specified in `_standards/` — WORKFLOW.md defines the procedures and protocols, and the Planning Phase templates (Communication Skill, Work Breakdown guide, Implementation Plan template) have been updated accordingly. However, the Implementation Phase templates (Manager and Worker initiation commands, Task Assignment, Task Execution, Task Logging, Memory Maintenance guides) have not yet been refactored to fully incorporate these specifications.

Additionally, platforms with native multi-agent capabilities (e.g., Claude Code Agent Teams) enable Workers to internally parallelize complex work by spawning sub-teams. APM can leverage this without coupling to any single platform by using the existing conditional placeholder system in the build pipeline.

**Status:** Components 1-3 specified in `_standards/` (ground truth). Planning Phase templates updated. Implementation Phase templates awaiting refactor — the guides currently contain partial parallel support (batch envelope in apm-communication, dispatch standards in task-assignment, merge checkpoints in task-review) but do not yet fully reflect the WORKFLOW.md specification. Component 4 (Claude Code Agent Teams) is optional and unimplemented — depends on an experimental platform feature. Design Principle 5 (source control) is being formalized into the `apm-version-control` skill — see the Version Control Skill entry below. The Implementation Phase template refactor and the Version Control Skill are tightly coupled: parallel dispatch in practice requires version control coordination, so both should be addressed together.

### Design Principles

1. **Platform agnosticism** - Batch Assignment and Parallel Dispatch are platform-agnostic enhancements to the bus protocol and Manager/Worker coordination models. Platform-specific capabilities (Team Execution) are additive and delivered through the existing conditional placeholder system.
2. **Manager abstraction** - The Manager assigns tasks and reviews reports. Whether a Worker executes solo, uses subagents, or spawns a platform-native team is an internal Worker decision invisible to the Manager. Reports and Memory Logs have the same structure regardless.
3. **Individual task logging** - Every task gets its own Memory Log at its own `memory_log_path`, whether executed solo, in a batch, or via a team. Batch and team execution affect user friction and speed, not the Memory System's structure.
4. **Fail-fast on batch** - A Blocked or Failed task in a batch stops execution of remaining tasks. The Worker reports partial results. The Manager makes per-task Coordination Decisions on what completed and re-plans the rest.
5. **Source control and conflict management** - Neither APM nor any known platform provides real file-level locking for concurrent agent edits. When dispatching tasks in parallel, the Manager warns the User about possible file overlaps and overwrites across concurrent Workers. The Manager suggests initializing a git repository if one is not present, or working in branches if already suggested by the Implementation Plan, Specifications, or Standards. The recommended strategy is hierarchical branching: each Worker operates on its own branch off the main branch. If a Worker uses Team Execution (Component 4), each teammate operates on a sub-branch off the Worker's branch. Merges happen hierarchically -- the Worker merges teammate branches before logging and reporting; the Manager merges Worker branches when needed or when requested by the User. Conflicts are resolved by the "merger" at each branching point, as the top instance in that hierarchy has the best context to make resolution decisions. File-partitioned task decomposition (ensuring distinct file ownership per Worker) remains a complementary practice that reduces merge conflicts but does not replace branching. **Note:** This principle is being formalized into the `apm-version-control` skill proposal — see the Version Control Skill entry below — which replaces the loose branching guidance here with a structured skill covering branches, worktrees, merge coordination, and conflict resolution.

### Component 1: Batch Task Assignment ✓

**Status:** Implemented. Added batch envelope format to apm-communication §4.4; batch execution standards to task-execution §2.7; Batch Report format to task-logging §4.3; batch report handling to task-review §2.5 and §3.2.

**What:** The Manager sends multiple sequential tasks to the same Worker in a single Send Bus message. The Worker executes them in order, logs each individually, and returns one consolidated Batch Report. The User only shuttles files at batch boundaries, not between each task.

**When:** The Manager identifies batch candidates during task assignment: consecutive tasks assigned to the same Worker where each task depends only on the previous task in the chain (or on already-completed tasks), no cross-Agent dependencies exist within the chain, and no tasks assigned to other Workers depend on intermediate tasks in the chain.

**Batch Assessment** - Addition to the Task Assignment guide. Before generating a Task Prompt, the Manager examines remaining tasks in the current Stage for the target Worker and evaluates batch candidacy using the criteria above. If 2+ candidates are identified, generate Task Prompts for all and write them to the Send Bus as a batch. Otherwise, standard single-task assignment. The Manager must verify via the Dependency Graph (Component 3) that no forward dependencies leak across concurrent batches -- for example, if Worker B's batch task 3 depends on Worker A's batch task 2, and both batches are dispatched in parallel, Worker B will hit a dependency gap. The Manager must either exclude the dependent task from the batch or sequence the batches.

**Send Bus Format** - The Send Bus file gains a batch envelope in YAML frontmatter (`batch: true`, `batch_size`, task manifest with `task_ref` and `memory_log_path` per task). Individual Task Prompts follow sequentially in the same file, separated by `---` delimiters. Each Task Prompt retains its own full structure (sections, dependency context, validation criteria) as if it were standalone.

**Worker Execution** - Addition to the Task Execution guide. On receiving a batch, the Worker parses all Task Prompts, validates `agent_id` for each, and executes them sequentially through the standard §3.1-3.8 procedure per task. Each task's Memory Log is written individually at its `memory_log_path` upon that task's completion. If any task results in Blocked or Failed status, the Worker stops the batch, does not proceed to remaining tasks, and writes the Batch Report reflecting partial completion. Workers must pause and report blockers when they encounter context dependency gaps during execution -- missing files, unavailable interfaces, or outputs that should have been produced by another Agent. Workers must NOT attempt to fill these gaps by doing another Agent's work without being asked.

**Batch Report** - Addition to the Task Logging guide. A new report format with YAML frontmatter listing per-task status and a concise body section per completed task (summary + Memory Log reference). Remaining unstarted tasks are listed as "Not started (batch stopped)". Written to the Report Bus as a single message. The Manager processes each task's result independently through the existing Coordination Decision procedure.

**Manager Report Processing** - Addition to the Memory Maintenance guide. On receiving a Batch Report, the Manager reviews each completed task's Memory Log individually and makes independent Coordination Decisions per task. Remaining unstarted tasks from a stopped batch re-enter the assignment pool for the next cycle.

### Component 2: Parallel Dispatch ✓

**Status:** Implemented. Added dispatch planning standards to task-assignment §2.5-2.6; dispatch assessment procedure to task-assignment §3.1; parallel coordination standards to task-review §2.5; branch instructions in Task Prompt format. Workers create branches per task instructions; Manager coordinates merges.

**What:** The Manager writes Task Prompts to multiple Workers' Send Buses before waiting for any Reports. Workers execute concurrently in separate sessions. The User delivers Send Bus files to each Worker session and returns Reports to the Manager as they arrive.

**When:** Tasks in the current Stage are assigned to different Workers and share no unresolved cross-Agent dependencies between them. The Dependency Graph (Component 3) aids this assessment visually; the Manager identifies parallel dispatch opportunities by examining same-stage tasks with independent dependency chains.

**In-Flight Tracking** - The Manager maintains a lightweight in-flight tracker in working context: which Workers have active tasks, which tasks are dispatched, and which Reports are outstanding. This is not a new artifact -- it is part of the Manager's operational reasoning during the Coordination Loop.

**Dispatch Procedure** - After identifying parallelizable tasks, the Manager generates Task Prompts for each (individually or as batches per Worker) and writes them to respective Send Buses. The Manager informs the User of all pending Send Bus paths and which Worker sessions need them. The Manager then awaits Reports, processing each as it arrives through the standard Coordination Decision procedure.

**Report Collection** - Reports arrive asynchronously as Users return them. The Manager processes each independently. A Blocked result from one Worker does not automatically block other Workers unless their next tasks depend on the blocked output. The Manager reassesses dispatch opportunities after each Report.

**Combination with Batch** - Parallel Dispatch and Batch Assignment compose naturally. The Manager can dispatch batch assignments to Worker A and Worker B simultaneously. Worker A executes its batch of 3 sequential tasks while Worker B executes its batch of 2. Reports return independently.

### Component 3: Dependency Graph ✓

**Status:** Implemented. Added §4.6 Dependency Graph Format and §3.6 step 6 to work-breakdown.md; added header field to Implementation_Plan.md. Also moved stage directory creation from Manager to Worker (task-logging.md §3.1 step 1) to remove a pre-dispatch bottleneck.

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

**What:** On Claude Code, Workers MAY optionally use the Agent Teams feature to internally spawn a team and parallelize work within their assigned task scope. The Worker becomes the team lead, assigns sub-work to teammates, synthesizes results, cleans up the team, and reports back through the standard bus protocol. The Manager is unaware this happened.

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
Hierarchical branching: Workers on own branches, teammates on sub-branches, merges bottom-up. Being formalized into the `apm-version-control` skill — see the Version Control Skill entry below.

**5. Batch size limit?**
Soft guidance of 3-5 tasks per batch, no hard limit. Implemented in task-assignment §2.5.

**6. Dependency Graph maintenance?**
Manager updates the Dependency Graph when modifying the Implementation Plan during Artifact Maintenance. Implemented in WORKFLOW.md §7.7.

**7. Parallel Dispatch + Handoff interaction?**
Manager may only Handoff when no outstanding dispatches exist — all Reports from active Workers must be collected first. Implemented in WORKFLOW.md §7.8.

### Open Questions

1. **Batch + FollowUp interaction:** When a batch task fails and the Manager issues a FollowUp, should remaining unstarted tasks from the original batch be re-batched with the FollowUp, or dispatched separately after the FollowUp succeeds?
2. **Team Execution cost guidance:** Should APM provide guidance on when Team Execution is cost-effective vs. wasteful? Token costs scale with team size. This could be part of the Team Execution Standards or left entirely to Worker judgment.

### Affected Components

| Component | Change Type | Scope |
|-----------|------------|-------|
| Task Assignment guide | Add Batch Assessment procedure | All platforms |
| Task Execution guide | Add batch receipt handling + conditional Team Execution section | All platforms (team: CC only) |
| Task Logging guide | Add Batch Report format | All platforms |
| Communication Skill | Add Batch Delivery protocol | All platforms |
| Memory Maintenance guide | Add batch report review + parallel report collection handling | All platforms |
| Work Breakdown guide | Add Dependency Graph generation step | All platforms |
| Implementation Plan template | Add Dependency Graph header field | All platforms |
| Build config (`build-config.json`) | Add `teamGuidance` field for Claude Code target | Build system |
| Placeholder processor (`placeholders.js`) | Add `{WORKER_TEAM_GUIDANCE}` replacement | Build system |

---

## Version Control Skill (Future)

**Context:** The Implementation Phase's parallel dispatch system (Components 1-3 above) requires source control coordination to prevent file conflicts between concurrent Workers. The current implementation includes lightweight branch instructions in Task Prompts (task-assignment §2.6) and merge checkpoints in task-review §2.5, but these are informal guidance rather than a structured protocol. As parallel dispatch becomes a core workflow pattern, version control operations need formal skill-level treatment — comparable to how `apm-communication` formalizes the Message Bus protocol.

Git branching alone does not enable true parallelism. A git repository has one working directory — when Worker A checks out branch-a and Worker B checks out branch-b in separate terminals, B's checkout switches the shared directory out from under A. Git worktrees solve this: each worktree is a separate physical directory checked out on its own branch, sharing the same git database. Worktrees are the standard git mechanism for simultaneous multi-branch work.

**Status:** Future work. This skill introduces version control as a fundamental part of the APM workflow — not an optional add-on. Integration path: (1) define the skill specification and incorporate version control into `_standards/WORKFLOW.md` as a core Implementation Phase concern, (2) build the skill template (`SKILL.md` + `apm-vc-integration.md`), (3) refactor the Implementation Phase templates (task-assignment, task-execution, task-review guides and Manager/Worker commands) to reference and invoke the skill. Steps 2-3 are tightly coupled with the broader Implementation Phase template refactor — the guides that reference version control operations are the same guides being refactored for parallel dispatch.

### Design Principles

1. **Manager owns all git operations** — The Manager initializes git (if needed), creates branches and worktrees, coordinates merges, and cleans up. Workers receive a workspace path and commit instructions — they don't manage branches or worktrees themselves. The User is not asked to perform git operations; the Manager executes them autonomously, respecting the User's existing repository setup and preferences.
2. **Branches always, worktrees when parallel** — Every dispatched task (single or batch) gets its own feature branch off the base branch. For sequential dispatch, the Worker works in the main directory on their branch. For parallel dispatch, the Manager creates worktrees (separate physical directories) so multiple Workers can edit files simultaneously without interference. This is not tiered or optional — branches are the baseline, worktrees are added when parallelism requires them.
3. **Version control drives dispatch** — Merge state is a dispatch prerequisite. If Task B depends on Task A's output and Task A was on a separate branch, the Manager must merge A into the base branch before dispatching B. Merge checkpoints are coordination decisions, not afterthoughts. The Manager factors version control state into every readiness assessment.
4. **Respect User's existing setup** — Most projects already have git initialized, a branching convention, and potentially branch protection rules. The Manager detects the existing configuration and adapts. The base branch is whatever the User is currently on, not assumed to be `main`. Branch protection and PR workflows are handled reactively — if a merge fails due to protection rules, the Manager adapts (e.g., creates a PR instead of direct merge, or asks the User). The skill does not impose a workflow; it operates within the User's environment.
5. **Bounded worktree footprint** — Maximum 3-4 concurrent worktrees. Worktrees create a full checkout of all tracked files, so disk usage scales linearly with working directory size. The Manager is aware of this cost and factors it into dispatch decisions, especially for large repositories. Worktrees are short-lived — created at dispatch, removed promptly after merge.

### Component 1: Git Setup & Configuration

**What:** Manager Session 1 initialization detects existing git state, determines the base branch, and records configuration in Memory Root Working Notes.

**Initialization Procedure:**
1. Check if git is initialized. If yes, proceed. If no, initialize and inform User.
2. Detect current branch — this is the base branch unless User specifies otherwise.
3. Record in Working Notes: base branch name, repo root path, `.apm/` path (may differ from repo root), any User-stated preferences.
4. Add `.apm/worktrees/` to `.gitignore` if not already present.

**Configuration is lightweight.** No config file, no questionnaire. The Manager detects what it can and asks the User only when something is ambiguous. Preferences discovered later (e.g., branch protection encountered during first merge) are noted in Working Notes as they arise.

**Handoff continuity.** Incoming Manager reads VC configuration from Working Notes — base branch, active branches, pending merges. No re-detection needed.

### Component 2: Branch Management (Sequential Dispatch)

**What:** Every dispatched task gets a feature branch. For sequential dispatch, the Worker works in the main directory on that branch. Manager merges after successful review.

**Dispatch flow:**
1. Manager creates branch off base: `git checkout -b <branch-name>`
2. Task Prompt includes branch name — Worker is on the branch when they start
3. Worker executes task, commits work to the branch
4. Worker reports; Manager reviews
5. On success: Manager merges branch into base, deletes branch
6. On FollowUp: branch persists, Worker continues on it

**Branch naming** is derived from task objective (e.g., `feat/user-authentication`, `feat/api-endpoints`). Readable, descriptive, traceable to the task.

**Batch dispatch** follows the same pattern — the batch gets one branch, Worker executes all tasks sequentially on it, Manager merges after the batch completes.

### Component 3: Worktree Management (Parallel Dispatch)

**What:** For parallel dispatch, the Manager creates worktrees under `.apm/worktrees/` so multiple Workers operate in physically separate directories. Each worktree is on its own branch.

**Worktree mechanics:** A git worktree is a full checkout of the repository in a separate directory. All tracked files are physically present (real files, real directories). Worktrees share the git database (history, objects) with the main working directory — they don't duplicate the `.git` storage. Untracked files (data, local configs, build artifacts) exist only in the directory where they were created and are not present in worktrees.

**Dispatch flow:**
1. Manager creates worktrees before writing Task Prompts:
   ```
   git worktree add .apm/worktrees/<branch-slug> -b <branch-name>
   ```
2. Task Prompt includes the worktree path as the Worker's workspace — all file operations happen in that directory
3. Worker commits work in their worktree
4. Worker reports; Manager reviews
5. On success: Manager merges branch into base, removes worktree (`git worktree remove`), deletes branch
6. On FollowUp: worktree persists, Worker continues in it

**Constraints:**
- Maximum 3-4 concurrent worktrees
- Worktrees live under `.apm/worktrees/`, which is gitignored
- Worktrees are short-lived — created at dispatch, removed after merge
- Each worktree contains all tracked files. For large repositories, the Manager notes disk cost when first proposing parallel dispatch and lets the User decide whether to proceed or fall back to sequential
- If untracked assets are needed by a Worker in a worktree, the Manager notes this in the Task Prompt (Worker can symlink or copy as needed)

**Directory structure (`.apm/` inside repo):**
```
project/
├── .apm/
│   ├── worktrees/
│   │   ├── feat-auth/        # Worker A's worktree
│   │   └── feat-api/         # Worker B's worktree
│   ├── bus/
│   └── Memory/
├── src/
└── ...
```

**Directory structure (`.apm/` outside repo):**
```
root/
├── .apm/
│   ├── worktrees/
│   │   ├── feat-auth/        # Worktree of project/
│   │   └── feat-api/         # Worktree of project/
│   ├── bus/
│   └── Memory/
└── project/                  # Git repo, main working directory
```

The worktree command is run from the git repo root; the output path points into `.apm/worktrees/`. The Manager bridges these paths using the repo root and `.apm/` paths recorded during initialization.

### Component 4: Merge Coordination

**What:** The Manager merges branches into the base branch after successful Task Review. Merge timing is a coordination decision driven by the dependency graph and dispatch readiness.

**Merge rules:**
- *After successful review:* Manager merges the completed task's branch into base.
- *Before dependent dispatch:* If an upcoming task depends on a completed parallel task's output, the Manager merges that branch before creating the dependent task's branch or worktree (so the dependent task starts with the latest code).
- *Stage-end sweep:* Before transitioning to the next Stage, all branches from the current Stage must be merged.
- *Automated by default:* The Manager performs merges autonomously. No User intervention for clean merges.
- *Escalation for conflicts:* When merge conflicts arise, the Manager resolves them using coordination-level context (knowledge of both tasks' objectives, project design, specifications). For complex conflicts requiring deeper investigation, the Manager spawns a Debug Subagent or escalates to the User.
- *Branch protection adaptation:* If the base branch has protection rules that prevent direct merges, the Manager adapts — creates a PR, merges into an intermediate branch, or asks the User how they want to handle it. Discovered reactively, noted in Working Notes for future merges.

**Hierarchical merging with Teams:** When a Worker uses Team Execution (Parallel Task Coordination Component 4), teammates operate on sub-branches off the Worker's branch. The Worker merges teammate branches before reporting — the Manager only sees the Worker's clean, merged branch.

### Component 5: Skill Structure

**What:** The skill follows the standard APM skill structure per `STRUCTURE.md`. Universal skill loaded by both Manager and Worker, like `apm-communication`.

**Skill directory:**
```
templates/skills/apm-version-control/
├── SKILL.md                  # Main skill document
└── apm-vc-integration.md     # Integration guide for non-APM agents
```

**Skill sections:**
- §1 Overview — Purpose, how to use, objectives, outputs
- §2 Operational Standards — Base branch detection, branch naming, worktree placement, merge rules, conflict resolution, large repo awareness, User preference handling
- §3 Version Control Procedure — Git initialization, branch operations, worktree operations, merge coordination, cleanup
- §4 Structural Specifications — Branch naming patterns, worktree directory layout, Working Notes VC entry format
- §5 Content Guidelines — Common mistakes, role-specific guidance

**Role-specific usage:** Both Manager and Worker load the skill. The Manager uses it for setup, branch/worktree creation, merge coordination, and cleanup. The Worker uses it to understand their workspace (branch or worktree path), commit conventions, and what not to do (no merging, no branch management). The guide-level commentary in task-assignment, task-execution, and task-review shapes each Agent's understanding based on their role.

**Integration file:** `apm-vc-integration.md` provides a lightweight guide for non-APM agents — how to identify the base branch, create and work on a branch, commit conventions, and how to signal readiness for merge. Parallels `apm-bus-integration.md`.

### Open Questions

1. **Branch naming convention:** Should branch names be derived from task objectives (e.g., `feat/user-authentication`) or task IDs (e.g., `apm/2.1`)? Objective-based is more readable; ID-based is guaranteed unique and traceable. Could be hybrid (`apm/2.1-user-auth`).
2. **Merge strategy:** Should the skill specify a default merge strategy (merge commit vs rebase vs squash)? Or leave it to the Manager's judgment per-merge? This may also depend on User preferences.
3. **Stale worktree recovery:** If a session crashes mid-workflow, worktrees may be left behind. Should the Manager detect and clean stale worktrees during initialization? Or is this a User concern?
4. **Worktree path when `.apm/` is not in repo root:** When the User's setup has `.apm/` at a different level than the git repo root, the `git worktree add` command must be run from the repo root but the output path could be under `.apm/worktrees/`. Both paths are recorded during initialization — is this sufficient, or does the skill need explicit path-bridging logic?
5. **Untracked file handling:** Should the skill provide a standard mechanism for making untracked assets available in worktrees (e.g., symlinks, documented copy steps), or handle it as an edge case the Manager addresses per-situation in the Task Prompt?

### Affected Components

| Component | Change Type | Scope |
|-----------|------------|-------|
| New skill: `apm-version-control` | New SKILL.md and apm-vc-integration.md | All platforms |
| Task Assignment guide | Replace §2.6 Branch Instructions with skill reference; update §3.1 dispatch to invoke VC operations | All platforms |
| Task Execution guide | Update `has_branch_instructions` handling to support worktree paths; add VC skill reference | All platforms |
| Memory Maintenance guide | Update §2.5 Merge Checkpoints with skill reference; integrate merge coordination into Task Review flow | All platforms |
| WORKFLOW.md | Update §7.3 branch instructions to reference VC skill; add version control to Implementation Phase description | All platforms |
| Manager initiation command | Add VC initialization step to Session 1 procedure | All platforms |

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

**Rationale:** Making this a full APM Agent workflow (with its own initiation command) would add friction to what should be a simple pre-archival step. The command reads existing artifacts, synthesizes a summary, and writes one file. No coordination, no bus communication, no Task Logging.

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
