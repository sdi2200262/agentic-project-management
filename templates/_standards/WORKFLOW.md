# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM coordinates a body of work through planning documents, Memory and a file-based Message Bus. The User starts agents, delivers bus messages by invoking skills in their chats, approves decisions and starts Handoffs.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Define and plan the work with the User. | Workspace research and planning conversation. |
| Manager | Assign Tasks to Workers or undertake them, review results and maintain the APM files. | Spec, Plan, `AGENTS.md`, Tracker and Memory. |
| Worker | Execute, validate and report assigned Tasks. | Task Prompts, `AGENTS.md` and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager includes needed content in Task Prompts. Every role may use native subagents within its own scope, and the parent verifies their findings. The Manager carries out its Tasks through subagent workers; substantial direct work requires a User request. Native subagents are separate from APM Workers and bus delivery.

Responsibilities defined in role instructions and existing User authorization govern ordinary actions. Approval requests identify the proposed action and why it needs User agreement. Existing authorization avoids repeated requests, except for confirmation of destructive or irreversible actions and their consequences. Explicit workflow reviews and approval checkpoints remain in force.

## 2. Phases

### 2.1 Planning

The Planner reads both planning guides at initiation and develops design and work-structure choices during Context Gathering. The User approves its understanding summary, then the Spec and Plan separately, in that order. Proposed changes to `AGENTS.md` are reviewed against existing User authorization. The Planner creates the Message Bus and directs the User to start the Manager in a new chat.

### 2.2 Implementation

The Manager explores the working codebases, confirms its understanding with the User and starts dispatching under the approved planning decisions. Each Task passes through assignment, execution, logging and review. Stages run in order; Tasks within a Stage may run singly, in batches or in parallel.

Implementation ends when every Stage is complete or the User stops early. The Manager records the state, reports the outcome and offers a summary and archive. A large goal may span several APM sessions; the Planner agrees each session's scope with the User.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines scope, required behavior, design decisions and constraints. It describes this session, with authoritative sources and reasons alongside requirements. Notes hold design assumptions and unresolved questions. The Manager maintains it and copies relevant requirements into Task Prompts.

### 3.2 Plan

`.apm/plan.md` divides deliverables into Workers, ordered Stages and Tasks. Each Task has an objective, assigned agent (`manager` or a Worker slug), dependencies, output, validation, guidance and steps. Dependencies are marked Same-Worker or Cross-Worker. Its Notes hold coordination preferences and review points, shared-resource constraints, likely blockers, integration points, possible batch or parallel dispatches and Stage verification needs. The Manager uses the Plan to prepare dispatches.

### 3.3 AGENTS.md

`AGENTS.md` holds project orientation, working and read-only repository boundaries, and applicable workspace conventions across sessions. All agent roles read it. The Planner proposes needed additions or corrections to preexisting content; the Manager and Workers maintain it as work reveals durable conventions. Content stays concise and useful beyond the current session, without duplicating existing guidance. Orientation states facts; instructions identify the actions or areas to which they apply. Changes follow User authorization and preserve unrelated content.

For Claude, existing workspace `CLAUDE.md` files import `AGENTS.md` outside code blocks, preserving preexisting content and avoiding circular references.

### 3.4 Version Control

The Planner surveys Git state and agrees Git use, base branches, branch and commit conventions, and APM file tracking during Context Gathering. It proposes existing conventions, or `type/short-description` branches and `type: description` commits. Durable repository conventions belong in `AGENTS.md`, session-specific Git setup and constraints in the Spec, and current branches/worktrees in the Tracker.

Each dispatch gets a branch; parallel Workers also get separate worktrees. Workers commit; the Manager creates branches, merges and cleans up.

When `.apm/` is inside a repository, the Planner proposes ignoring it by default and asks whether the User wants APM files tracked. If version control is declined, parallel dispatch is unavailable.

### 3.5 Planning Changes

The Manager keeps the Spec, Plan, `AGENTS.md` and affected Task instructions aligned when findings or decisions change them. New or changed Tasks preserve the agreed User involvement through responsibility, size and review points. It updates affected requirements and Task fields before preparing further work, records pending decisions in the Tracker and preserves consequential decisions with their reasons in Memory.

Contained corrections to a Task, dependency or Spec point may proceed without approval. Workspace convention changes follow User authorization. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. When new design decisions are needed or repeated follow-ups cannot resolve the issue, the Manager presents options for continuing or stopping to replan; the User decides.

Corrections to unreported active work preserve the current dispatch and progress. Reported attempts use review and follow-up Tasks. The User delivers both through the Message Bus.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

Shared communication covers writing to the User, writing self-contained messages for other agents and using the bus. Role-specific questioning and delegation guidance live in role files.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one temporary message. Read before writing, verify outgoing content and clear processed messages before sending replies. A populated Task Bus does not establish whether execution has started; repeated delivery instructions are conditional when delivery is unconfirmed.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | `apm-3-initiate-worker` in a new chat, or `apm-4-check-tasks` in an existing one |
| Task Report | Worker → Manager | `apm-5-check-reports` |
| Handoff Prompt | Outgoing → incoming conversation | The role's initiation skill in a new chat |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

The Tracker is the Manager's live record of Task states, next actions, branches, worktrees and Worker context. Each Task links to its latest reported Worker log or concluding Manager log. Memory preserves original and follow-up Task Logs, Stage summaries, Handoff Logs and lasting findings. Tracker Notes hold current coordination needs and pending decisions. Index Notes preserve findings useful to later work, linked to Stage summaries and supporting evidence. Pending actions link to lasting findings rather than duplicating them; Tracker notes are removed when preserved durably and no longer needed for coordination. Runtime formats define their fields and organization.

The responsible agent logs Success, Partial or Failed; the Manager decides whether the Task becomes Done. Tasks stay Active during investigation, follow-up or pending decisions. Done is final: later fixes need new Tasks referring to the original work.

A Stage completes when all Tasks are Done, required Stage verification is resolved and, with version control, its branches are merged. Accepted Partial outcomes and unrun checks remain qualified in summaries.

Workers flag Important Findings that affect acceptance or later work. Partial and Failed outcomes always have Important Findings. The Manager resolves their effects on planning and records the decision. Summaries preserve consequential findings, decisions, evidence and limitations with source links.

Worker conversation numbers change at Handoff, not recovery. The Tracker records earlier-Stage Tasks a new Worker conversation has not read; their dependencies count as Cross-Worker. Recovery notes identify when rebuilt context may need fuller dependency instructions.

## 6. Planning

**Runtime:** `apm-1-initiate-planner`, `context-gathering.md` and `work-breakdown.md`.

### 6.1 Context Gathering

The Planner surveys repositories, instructions and existing materials. The Planner may read relevant materials within its scope; the User's instructions and current evidence establish which sources govern the session. Unclear or conflicting source authority requires clarification. It researches relevant codebases and archives, then follows three question rounds:

1. Existing materials, vision and scope.
2. Technical requirements, constraints, dependencies and success criteria.
3. Implementation approach, quality and coordination preferences.

Each round includes an exchange with the User, follow-up research, a summary and an open question. Initial context does not skip a round. The Planner resolves gaps needed to define the work or agrees how planned work will settle them, and confirms consequential assumptions. When several designs are viable, it presents trade-offs and a recommendation for the User to choose.

The Planner may propose tentative Stages, Tasks and Workers during questioning and ask about Task size, available agents, parallelism and review points. It revises the breakdown as it learns and agrees repository conventions with the User. Its recommendations balance efficient Manager work through subagent workers with Worker collaboration that preserves User understanding and control, guided by the User's priorities and desired involvement. It asks whether the User wants to perform any Tasks or parts and agrees review points around consequential results and substantial stretches without User involvement. The Manager chooses actual dispatches during implementation.

Agree the session's scope before the understanding summary. Investigate enough to establish requirements and propose a credible breakdown. Substantial research may be planned work, with its questions and the decisions that depend on its results identified. Understanding approval starts document writing.

### 6.2 Work Breakdown

The Planner writes the Spec and Plan in order, obtaining approval for each, then resolves any needed `AGENTS.md` updates with the User. Corrections carry through to affected earlier documents. Task responsibilities, sizes and review points reflect the agreed User involvement. Task-specific participation and review points belong in Guidance; required checks belong in Validation. The responsible agent remains the same when the User performs work.

Workers group work by expertise and context, weighing specialization against the context sharing and coordination it requires. Stages mark milestones chosen around dependencies and review points. Each Task defines work the Manager or one Worker is responsible for completing, with a clear output and validation. Task boundaries depend on size, complexity, uncertainty, dependencies and expertise; research, implementation and validation may share a Task or need separate Tasks. Parallelism follows the work's dependencies and constraints. Steps are operations toward the Task's output.

Validation names observable checks and expected results, including required User actions. Updates to `AGENTS.md` preserve preexisting content except for authorized changes; existing workspace `CLAUDE.md` files import `AGENTS.md`.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager selects Ready Tasks and batch sizes using the Plan's coordination preferences and current User instructions, balancing progress with User understanding and control. It follows agreed review points and reassesses them as work changes. For Tasks it undertakes, the Manager uses the Plan and Spec directly. Worker assignments use Task Prompts and the Message Bus. A single dispatch holds one Task. A batch holds 2–3 independent Ready Tasks or a Same-Worker chain whose other dependencies are complete. Send a chain singly when another Worker needs intermediate output. Parallel dispatch requires independent work and isolated worktrees.

Each Worker takes one dispatch at a time. Review incoming reports and dispatch newly Ready work without waiting for unrelated reports. Wait only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Same-Worker dependencies name outputs and paths; Cross-Worker dependencies also include reading and integration instructions from the producer's log. Trace upstream until an intermediate output captures the needed contracts. Give recovered Workers fuller context where needed.

Prompts name the working directory, branch/worktree and workspace root for `.apm/` paths. Include each needed contract once. Follow-ups retain Task identity but receive a new numbered log path from the Manager, per Task. They focus on remaining work and use the Worker's established context, restoring detail where it is missing. Active corrections preserve the current attempt's log path, valid progress and workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-2-initiate-manager`, `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Manager reads all four implementation guides. It starts its own Tasks from the Plan, Spec and dependency evidence, and supplies subagent workers with the context, boundaries and checks needed for their contributions. It verifies their output, resolves validation gaps and writes the final Task Log itself. Its Tasks use `agent: manager` and its conversation number. Iteration and pauses remain part of the same Active Task; the Manager writes one log when concluding it. The Manager records completion directly after validation, keeps unfinished Tasks Active and obtains User agreement before accepting Partial work. Planning changes and merging follow Task Review.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. Missing dependencies, unresolved instruction conflicts, repeated attempts without progress and work that substantially exceeds the assignment need guidance.

The User may perform any Task or part, take over during execution, and return work to its responsible agent at any time. That agent briefs and supports the User, stops overlapping execution, checks returned work and remains responsible for validation and logging. Limited help does not transfer the rest of the work. Current participation and the resume point belong in the Manager’s Tracker or the Worker’s current Task Prompt; the Task Log records contributions and consequential changes in who performed the work. Participation changes preserve the assignment, Task state and current attempt.

Success requires the objective and every validation criterion to pass. A deliberate deviation or unrun check is not a pass. In a batch, validate and log each Task before the next; stop at the first Failed outcome and report unstarted Tasks.

The Worker applies User corrections immediately and resolves whether they should persist in `AGENTS.md` at completion, using existing User instructions or asking when that decision remains open. Other findings may also prompt proposed additions or corrections. Authorized changes use the assigned branch or worktree when tracked and are committed with the Task. Important Findings record the changes and their paths.

The Worker commits, writes the Task Log, clears its Task Bus and writes a Task Report pointing to that attempt's log. Follow-up logs leave earlier attempts unchanged, link to the original and previous follow-up, and record new work, validation and the resolution of earlier findings. Outcomes still assess the whole Task, including unresolved earlier criteria. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager reviews each reported Task against its log and deliverables, including individual Tasks in a batch. Investigate Important Findings, unmet criteria and contradictory Success claims before accepting work. The Manager may resolve contained questions, complete small amounts of remaining work, including code changes, and run final validation within the existing objective when its context makes this more efficient than another dispatch. Substantial direct implementation by the Manager requires a User request. Record the Manager's work and validation separately from the Worker's outcome. Compare follow-ups with earlier attempts; another dispatch needs concrete remaining work and a supported approach. Revisit the approach or requirement when attempts stall or remaining work substantially expands. Resolve incorrect requirements or proposed exceptions through §3.5. The Manager may accept work completed and validated during review; accepting remaining Partial work needs the User. Preserve the evidence and remaining limits.

Review results lead to acceptance, a follow-up or a planning change. Keep pending work Active, record the decision and update the Tracker. Merge accepted branches before dependent work and before the next Stage; clean up merged worktrees and branches.

Verify the Stage when the User requested it, the Plan calls for it, or any Task needed a follow-up or recorded Important Findings. Otherwise record why verification was skipped. Use relevant checks on the Stage's combined result, keep reference inputs separate from generated results, and preserve usable evidence paths through cleanup. Fixes to Done work need new Tasks. Resolve issues, write the Stage summary, link it in the Index and retain the context needed for later work.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

At the User's request, the outgoing role checks current files and Git, writes a Handoff Log and Prompt, and obtains User approval before ending. The Prompt identifies the next conversation, source reading, current state and next action, including pending decisions and validation gaps.

The incoming Manager reads coordination records and needed Task Logs. The incoming Worker reads its Handoff Log and latest relevant own Task Logs from the current Stage. Earlier attempts are read through links where needed. It resumes pending work using the current prompt's log path or waits for the next delivery. The Handoff Bus is cleared after loading.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery rereads the role's initiation files and rebuilds current state from files, bus and code without changing conversation number. Workers start from their current prompt, latest relevant own Task Logs and Handoff Log, following earlier-attempt links where needed. Preserve pending decisions and validation limits, ask about unresolved gaps and record what was recovered.

### 8.3 Summary and Archive

**Runtime:** `apm-8-summarize-session`.

A new conversation may summarize a session at any point; the Manager may do so at completion or early stopping. Before summarizing or archiving, pause active writers and record unfinished work and Git state. The optional `.apm/session.summary.md` records outcomes, consequential findings, decisions, limitations and attribution, checked against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

Archiving is optional and needs User approval. It preserves session records and remaining worktrees with their uncommitted contents, verifies preservation, then clears active APM files and installed instructions. Worktrees remain attached to source repositories. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

The archive index links to summaries. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
