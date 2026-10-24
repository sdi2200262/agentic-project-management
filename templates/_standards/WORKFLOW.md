# APM Workflow

This specification defines APM's workflow for template authors. Runtime guides and skills implement it. Terms follow `TERMINOLOGY.md`; prose follows `WRITING.md`.

## 1. Design

APM coordinates agents through planning documents, structured Memory and a file-based Message Bus. The User initiates agents, delivers messages with trigger commands, approves decisions and initiates Handoffs. Agents never communicate directly.

All assistants receive identical instructions. The communication skill's §5 Assistant Reference supplies assistant-specific paths, command prefixes, arguments, subagent calls and new-chat steps.

Roles are scoped through instructions, not file permissions. The Planner gathers project context and plans; the Manager holds coordination context; Workers use self-contained Task Prompts, Rules and accumulated working context. Workers do not read Spec, Plan, Tracker or Index. The Manager embeds relevant coordination content in assignments. Explicit User requests may extend Worker scope.

Agents use subagents for focused work, with read-only access for research and execution access for debugging. Delegation instructions state the condition, required action, inputs and findings, and refer to the communication skill’s §5 for the call. Spawning agents verify and integrate findings; Workers record subagent usage in Task Logs.

## 2. Phases

### 2.1 Planning Phase

The Planner completes Context Gathering, obtains understanding approval, then produces Spec, Plan and Rules with separate approvals. It initializes the Message Bus and directs the User to start a Manager.

### 2.2 Implementation Phase

The Manager reads its Handoff Bus: content selects incoming-instance initiation; an empty bus selects first initiation. The first Manager reads project documents, inspects git state and combines detected conventions with Planner observations. It presents scope, proposed VC conventions and possible Stage verification needs for User approval. On approval it records conventions in Tracker/Rules, initializes Task/Worker tracking and begins coordination.

Work proceeds through Task Assignment, Execution, Logging and Review. Stages are sequential; Tasks within a Stage support single, batch or isolated parallel dispatch. Review and readiness assessment continue until all Stages finish. The Manager then presents project completion and follow-up options. User-initiated Handoff transfers an instance's context when needed.

## 3. Planning Documents

| Document | Location | Purpose and access |
|---|---|---|
| Spec | `.apm/spec.md` | Project design decisions and constraints; Manager reads and extracts relevant content into assignments. |
| Plan | `.apm/plan.md` | Stages, Tasks, Workers, dependencies and validation; Manager reads and constructs assignments. |
| Rules | Rules file at workspace root | Shared execution standards; all agents read directly. |

### 3.1 Spec

The Spec defines what is built in a project-appropriate Markdown structure. It informs the Plan and records workspace structure, including working targets, references and authoritative materials. The Manager may update it when execution findings warrant changes.

### 3.2 Plan

The Plan header identifies the project, Workers, Stages and a Mermaid Dependency Graph. Stage sections contain Tasks with objectives, outputs, validation, guidance, dependencies and ordered steps. Dependencies between different Workers are bolded. The graph supports dispatch and critical-path assessment.

The Manager may modify the Plan during implementation and keeps the graph consistent with Task dependencies and assignments.

### 3.3 Rules

APM execution standards occupy the APM_RULES block in the Rules file. Existing outside content is preserved and referenced where relevant. Rules apply to all or most work and are conditional on the work performed. Domain-specific patterns reach Workers through Task Prompts. Manager and Workers may update Rules during implementation under their respective procedures.

The Manager owns version control conventions. Each dispatch unit gets a feature branch; parallel units use isolated worktrees; Workers commit on assigned branches. Initial conventions require User confirmation. Where none exist, defaults are `type/short-description` branches and `type: description` commits, using feat, fix, refactor, docs, test or chore. APM does not push by default.

When `.apm/` is inside a repository, it is ignored by default; the Manager asks which artifacts the User wants tracked and adjusts entries accordingly. If the User declines version control, parallel dispatch is unavailable. Tracker records per-repository base branches and conventions; only universal commit conventions belong in Rules.

### 3.4 Document Modification

The Manager assesses cascade effects between Spec and Plan; Rules are generally independent. Contained changes are within Manager authority: one Task clarification/correction, a missing dependency, an isolated Spec addition or a minor Rules adjustment.

User collaboration is required for changes affecting multiple Tasks, design direction, scope, a new Stage or major restructuring. Several small modifications can collectively require collaboration.

## 4. Communication System

**Runtime:** `skills/apm-communication/SKILL.md` and its `bus-integration.md`.

### 4.1 Communication Models

User-facing messages lead with the answer, outcome, finding, proposal or question. They provide the evidence, material trade-offs, limits and action needed to proceed. Shared writing and reply-length defaults live in the communication skill; procedures specify their own output content.

When action is required, agents identify the command, target chat and arguments, using §5 Assistant Reference for invocation details. Commands to run use fenced blocks; paths and values use inline code. Artifacts and messages follow their defined schemas.

### 4.2 Message Bus

The Planner initializes `.apm/bus/`. Every Worker directory contains `task.md`, `report.md` and `handoff.md`; the Manager directory contains only `handoff.md`.

| File | Direction | Content |
|---|---|---|
| `task.md` | Manager → Worker | Single or batched Task Prompts |
| `report.md` | Worker → Manager | Task or batch reports |
| `handoff.md` | Outgoing → incoming instance | Handoff prompt |

A file is empty or contains a pending message. Before writing an outgoing message, the agent clears its processed incoming message. Agents read a bus before writing so file tools recognize it.

`apm-4-check-tasks` delivers pending work to a Worker; `apm-5-check-reports` delivers reports to the Manager. Optional agent identifiers target delivery. Batched prompts retain each Task's standalone structure.

### 4.3 Communication Flow

1. Manager writes the Task Bus and gives the User the Worker initiation/delivery action.
2. User invokes it in the intended Worker chat.
3. Worker executes, validates, logs and writes a Report Bus message, then gives report-delivery instructions.
4. User invokes `apm-5-check-reports` in the Manager chat.
5. Manager reviews evidence, updates state and continues coordination.

Each agent gives actionable guidance for its end of the User-mediated exchange.

### 4.4 Non-APM Agent Participation

An independent agent can create its own bus directory and receive plain assignments or report contributions. It does not log to Memory, perform Handoff or join Worker tracking. The Manager assesses its reports, records its contribution in working notes and sends follow-ups through its Task Bus. The bus integration guide defines setup.

## 5. Memory

### 5.1 Structure

| Artifact | Location | Content and maintenance |
|---|---|---|
| Tracker | `.apm/tracker.md` | Live Task/Worker state, VC state and working notes; maintained by Manager. |
| Index | `.apm/memory/index.md` | Durable Memory notes followed by Stage summaries. |
| Task Logs | `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` | Worker outcomes, deliverables, validation and flags; written at assignment `log_path`. |
| Handoff Logs | `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md` | Instance history and working context. |

Task tracking uses Waiting, Ready, Active and Done as defined in `TERMINOLOGY.md` §4. Worker tracking records slugs, uninitialized/Instance N state, Handoffs and recovery. Cross-agent overrides below the Worker table identify dependencies affected by Handoff.

Working notes hold evolving coordination context. Stale notes are removed. At Stage end, durable findings become Index Memory notes and historical observations become Stage-summary prose; notes still needed for the next Stage remain active. Task Log writes create Stage directories as needed.

### 5.2 Task Log Flags

Workers set `important_findings` for potentially project-relevant discoveries beyond Task scope and `compatibility_issues` for dependency/system conflicts. When uncertain, they set the flag true. The Manager assesses implications for planning documents and other work.

### 5.3 Task Outcome Status

| Status | Result |
|---|---|
| Success | Objective achieved and all validation passed. |
| Partial | Progress made; guidance needed to continue. |
| Failed | Objective not achieved despite attempts to resolve it. |

## 6. Planning Phase

### 6.1 Context Gathering

**Runtime:** Planner initiation and `guides/context-gathering.md`.

The Planner first scans directory/repository structure, history, branches, materials and archives, and reads Rules for orientation. Initiation context can establish document authority; otherwise the User confirms discovered materials/archives before their content is read. Once authority and the Context Gathering guide are established, the Planner explores all relevant codebases and confirmed archives before the rounds.

Three ordered rounds cover:

1. Existing materials and vision: deliverables, purpose, success, scope, skills, documentation and prior work.
2. Technical requirements: design/constraints, dependencies, resources, complexity, risks and validation.
3. Implementation approach and quality: technical preferences, quality, external approvals/coordination, domain characteristics and documentation.

Each round requires at least one User exchange. Known context becomes focused confirmation questions; gaps receive questions and follow-ups. Consequential gaps are resolved before advancement. A brief round summary records established facts and limits. An open question addresses overlooked areas; the User may answer it alongside the next round. Supplied context does not skip rounds or make silence approval.

The Planner researches on relevant signals, uses subagents for substantial exploration and verifies consequential findings against referenced files/commands. Contradictions or gaps prompt focused follow-up research and verification. Verified findings are presented before use. Multiple viable architectural/design approaches require alternatives, a recommendation and User choice. Validation criteria are captured per requirement, with concrete measures proposed when missing.

Questions cover project substance. Version control and coordination observations are recorded for later placement. The Planner does not propose decomposition, Stages, Tasks or Worker assignments here. Technical research needed for accurate understanding is resolved during Context Gathering; research deliverables are planned later.

After three rounds, the Planner presents a consolidated understanding summary. Corrections receive follow-ups and a revised summary; User approval permits Work Breakdown.

### 6.2 Work Breakdown

**Runtime:** Planner initiation and `guides/work-breakdown.md`.

The Planner proposes, writes and obtains approval for each document in order:

1. Spec: design decisions, constraints, source references and workspace context. Optional blockquote notes after the header separator describe environment, VC observations and User preferences for the Manager.
2. Plan: domains/Workers, sequential Stages, Tasks, guidance, dependencies and validation. Coverage and dependencies are checked before writing. Optional notes explain boundaries, sequencing, critical paths, convergence and useful Stage verification points.
3. Rules: universal execution patterns, preserving existing content outside APM_RULES. Initial version control conventions remain the Manager's responsibility.

Each completed document requires approval before the next begins. Tasks produce meaningful, independently validatable deliverables within one Worker's domain. Their ordered steps share Task-level validation and support failure tracing. Necessary research/investigation has scoped subagent steps. Detail and granularity match project complexity.

## 7. Implementation Phase

### 7.1 Task Assignment

**Runtime:** `guides/task-assignment.md` and `apm-4-check-tasks`.

The Manager reads readiness from Tracker and the graph, groups work by Worker and forms dispatch units:

- Single: one Ready Task.
- Batch: sequential same-Worker Tasks with internal/already-complete dependencies, or independent same-Worker Tasks all Ready. Intermediate results needed by other Workers may favor individual dispatch.
- Parallel: independent units assigned to different Workers, with no unresolved cross-agent dependencies and VC workspace isolation. The Manager recommends suitable tool approvals to reduce execution waits.

A pending report may justify waiting when it would unlock a useful combination at little cost. Otherwise Ready work is dispatched. When none is Ready but Workers remain active, the Manager explains the wait and next report needed.

Prompts embed Task definitions, exact Spec/authoritative-source constraints and relevant runtime findings. Workers read Rules directly; Rules are not included in prompts. Coordination-document paths are excluded. Codebase material is supplied through targeted file reads.

Same-agent dependencies get recall anchors and paths; cross-agent dependencies get producer output summaries, reading/integration instructions and relevant upstream contracts. Tracker overrides account for Handoffs; reconstructed recovery context may need more detail. Upstream tracing stops where an intermediate output fully abstracts earlier contracts.

Each prompt includes identity/Task metadata, log path, dependency indicator and the objective, instructions, output, validation and necessary execution/logging/reporting guidance. Branch/worktree instructions identify the working location and project-root `.apm/` paths. Workers commit and record their workspace; the Manager creates branches, merges and cleans up.

The Manager writes the Task Bus and gives each User action: new-chat initiation for an uninitialized Worker, delivery for an existing one, batch scope/order or each parallel Worker's action. Follow-ups refine objectives, instructions, outputs and validation with investigation findings, retaining the original log path for overwrite.

### 7.2 Task Execution

**Runtime:** Worker initiation, `guides/task-execution.md` and `guides/task-logging.md`.

The Worker binds identity from the initiation argument resolved against bus directories. Assignment metadata cross-validates that identity. Handoff content is processed first; pending Task Bus content then starts/resumes execution, otherwise the Worker awaits delivery.

The Worker integrates dependencies, executes sequentially and validates autonomously before requesting User-dependent checks. Failure prompts investigation, one targeted correction and revalidation. After an unsuccessful correction, the Worker uses a subagent to investigate and verifies findings before applying them. Specified subagent steps are executed and verified too.

In batches, each Task is validated and logged before the next begins. Failed stops the batch. One final batch report covers executed outcomes and unstarted Tasks.

User corrections are applied immediately and recorded as important findings at completion. After logging/reporting/delivery instructions, the Worker offers to add a correction as a Rule for all Workers; this is optional for the User and does not block delivery. Approval updates Rules and the log.

Completion includes commits under Rules conventions, a Task Log, incoming-bus clearing and an outgoing report. Delivery guidance offers both targeted and general report-check commands for concurrent results. Large Tasks may have coherent intermediate commits.

### 7.3 Task Review

**Runtime:** `guides/task-review.md` and `apm-5-check-reports`.

The Manager reads reports and logs, assessing objectives, validation, flags and consistency. Each executed batch outcome is reviewed individually; unstarted Tasks return to dispatch assessment.

The first report after Handoff identifies instance and loaded logs. The Manager verifies the Handoff Log, updates Worker tracking and compares loaded logs with prior completed work, recording overrides for omitted context. Recovery notes retain the instance and call for suitable future context depth.

Supported Success proceeds; successful uncommitted work can be committed by the Manager under Rules conventions. Flags, non-Success or inconsistencies require investigation, directly for contained checks or through subagents for context-intensive issues. Results lead to acceptance, a refined follow-up or document modification under §3.4. Non-Success follow-ups identify uncommitted work. Deficiencies in Done work create new Tasks; Done is terminal.

Every path updates Tracker. Successful reviewed branches merge before dependent dispatch, and all current-Stage branches merge before the next Stage. Reports are processed asynchronously; review, merge, readiness and new dispatch continue in one turn when possible.

After Stage Tasks are Done, the Manager assesses holistic verification using User agreement, review findings and Planner notes. It resolves contained issues, delegates investigation, creates Tasks for Worker-level work or seeks User direction as appropriate. After verification concludes, it appends an Index Stage summary with outcome, Workers, findings and Task Log references, distilling working notes per §5.1.

## 8. Handoff and Continuity

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

Handoff is User-initiated and applies to Manager/Workers. It creates a persistent Handoff Log of history, decisions and approaches, plus an ephemeral Handoff Bus prompt with identity, current state, required reads and a concrete next action. The incoming instance processes and clears the bus.

Mid-Task Worker prompts point to the intact Task Bus and completed/resume steps. Mid-batch prompts account for completed/logged, active and unstarted work. Between Tasks, the Worker awaits new delivery. Manager handoffs describe outstanding assignments fully because Worker Task Buses may be cleared.

Incoming Managers read Handoff Log, Tracker, Index and relevant recent Task Logs. Incoming Workers read Handoff Log and only their current-Stage logs, identifying unloaded previous-Stage context for Manager dependency treatment.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery rebuilds an initiated Manager/Worker's context after compaction or conversation loss. The User invokes recovery with an optional role argument; otherwise context or a User question resolves the role. The agent rereads initiation and its loading sequence, then reconstructs state from artifacts/code. Identity retains its instance number. Recovery is recorded in Tracker or the next Worker report and in eventual Handoff context.

### 8.3 Session Continuation

**Runtime:** `apm-8-summarize-session` and `guides/context-gathering.md`.

A standalone summarization agent may create `.apm/session-summary.md` at any session state. It records scope, outcomes, deliverables, findings, issues and verified codebase/artifact differences as a dated snapshot. The Manager recommends this command in a new chat at completion; it offers optional archival, which is also directly available through the CLI.

With User approval, archival snapshots all `.apm/` except `archives/` into `.apm/archives/<name>/`, then removes active files, templates and metadata while preserving archives. Default names are `session-YYYY-MM-DD-NNN`; custom names are supported. Archive `metadata.json` is the canonical marker and contains installation metadata plus archival time. The optional session summary accompanies the raw artifacts. The summarizer creates/repairs the archive index and adds date, scope, Stage/Task counts and name.

A fresh CLI `apm init` or `apm custom` starts another session with archives retained. During discovery, the Planner asks about relevant archives, uses a subagent to explore confirmed ones and verifies findings against current code before use. The dispatch prompt defines the archive inputs and required findings.

Archives accumulate directly under `.apm/archives/`. Cleanup uses `apm archive --delete <name>`, `apm archive --clear` or manual removal.
