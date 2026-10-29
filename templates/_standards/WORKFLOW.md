# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM coordinates a body of work through planning documents, Memory and a file-based Message Bus. The User starts agents, delivers bus messages by invoking skills in their chats, approves decisions and starts Handoffs.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Define and plan the work with the User. | Workspace research and planning conversation. |
| Manager | Assign Tasks, review results and maintain the APM files. | Spec, Plan, Rules, Tracker and Memory. |
| Worker | Execute, validate and report assigned Tasks. | Task Prompts, Rules and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager includes needed content in Task Prompts. Every role may use native subagents within its own scope; delegation is optional, and the parent verifies their findings. Native subagents are separate from APM Workers and bus delivery.

## 2. Phases

### 2.1 Planning

The Planner reads both planning guides at initiation and develops design and work-structure choices during Context Gathering. The User approves its understanding summary, then the Spec, Plan and Rules separately, in that order. The Planner creates the Message Bus and directs the User to start the Manager in a new chat.

### 2.2 Implementation

The Manager explores the working codebases, confirms its understanding with the User and starts dispatching under the approved planning decisions. Each Task passes through assignment, execution, logging and review. Stages run in order; Tasks within a Stage may run singly, in batches or in parallel.

Implementation ends when every Stage is complete or the User stops early. The Manager records the state, reports the outcome and offers a summary and archive. A large goal may span several APM sessions; the Planner agrees each session's scope with the User.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines scope, design decisions and constraints. It identifies working and reference repositories, authoritative User documents and base branches. The Manager maintains it and copies the relevant decisions into Task Prompts.

### 3.2 Plan

`.apm/plan.md` divides the work into Workers, ordered Stages and Tasks. Each Task has an objective, Worker, dependencies, output, validation, guidance and steps. Dependencies are marked Same-Worker or Cross-Worker. The Manager maintains the Plan and uses it to prepare dispatches.

### 3.3 Rules

The workspace-root `AGENTS.md` holds execution conventions shared by all or most work inside `APM_RULES`. Preserve User content outside that block. Area-specific design and output contracts belong in the Spec or Task guidance.

All roles read the Rules. The Planner records agreed version control conventions and adds an `AGENTS.md` import to an existing workspace `CLAUDE.md`, preserving its content. Workers may add User-approved corrections through Task Execution.

### 3.4 Version Control

The Planner surveys Git state and agrees version control with the User during Context Gathering: whether to use it, base branches, conventions and APM file tracking. It proposes existing conventions, or `type/short-description` branches and `type: description` commits, records base branches in the Spec and conventions in the Rules, and initializes missing repositories only with approval. Each dispatch gets a branch; parallel Workers also get separate worktrees. Workers commit; the Manager creates branches, merges and cleans up under the agreed conventions. Push only when the User asks.

When `.apm/` is inside a repository, ignore it by default and ask whether the User wants APM files tracked. If version control is declined, parallel dispatch is unavailable.

### 3.5 Planning Changes

The Manager keeps the Spec, Plan, Rules and affected Task instructions aligned when findings or decisions change them. Correct the affected content before that work continues; record pending decisions and preserve consequential decisions in Memory.

Contained corrections to a Task, dependency, Spec point or Rule may proceed without approval. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. If the change needs new design decisions or repeated follow-ups cannot resolve it, present options for continuing or stopping to replan; the User decides.

Corrections to unreported active work preserve the current dispatch and progress. Reported attempts use review and follow-up Tasks. The User delivers both through the Message Bus.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

Shared communication covers writing to the User, writing self-contained messages for other agents and using the bus. Role-specific questioning and delegation guidance live in role files.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one pending message. Read before writing and clear processed messages before sending replies.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | `apm-3-initiate-worker` in a new chat, or `apm-4-check-tasks` in an existing one |
| Task Report | Worker → Manager | `apm-5-check-reports` |
| Handoff Prompt | Outgoing → incoming conversation | The role's initiation skill in a new chat |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

The Tracker is the Manager's live record of Task states, next actions, branches, worktrees and Worker context. Memory preserves Task Logs, Stage summaries, Handoff Logs and lasting findings. The Index links to Stage summaries. Runtime formats define their fields and organization.

A Worker reports Success, Partial or Failed; the Manager decides whether the Task becomes Done. Tasks stay Active during investigation, follow-up or pending decisions. Done is final: later fixes need new Tasks referring to the original work.

A Stage completes when all Tasks are Done, required Stage verification is resolved and, with version control, its branches are merged. Accepted Partial outcomes and unrun checks remain qualified in summaries.

Workers flag Important Findings that affect acceptance or later work. Partial and Failed outcomes always have Important Findings. The Manager resolves their effects on planning and records the decision. Summaries preserve consequential findings, decisions, evidence and limitations with source links.

Worker conversation numbers change at Handoff, not recovery. The Tracker records earlier-Stage Tasks a new Worker conversation has not read; their dependencies count as Cross-Worker. Recovery notes identify when rebuilt context may need fuller dependency instructions.

## 6. Planning

**Runtime:** `apm-1-initiate-planner`, `context-gathering.md` and `work-breakdown.md`.

### 6.1 Context Gathering

The Planner surveys repositories, instructions and existing materials. The User's opening context may establish which documents and archives are authoritative; otherwise the Planner asks before reading discovered planning materials. It researches relevant codebases and confirmed archives, then follows three question rounds:

1. Existing materials, vision and scope.
2. Technical requirements, constraints, dependencies and success criteria.
3. Implementation approach, quality and coordination preferences.

Each round includes an exchange with the User, follow-up research, a summary and an open question. Initial context does not skip a round. The Planner resolves important gaps and confirms consequential assumptions. When several designs are viable, it presents trade-offs and a recommendation for the User to choose.

The Planner may propose tentative Stages, Tasks and Workers during questioning and ask about Task size, available agents, parallelism and review points. It revises the breakdown as it learns and agrees repository conventions with the User. The Manager chooses actual dispatches during implementation.

Agree the session's scope before the understanding summary. Research needed to understand the work happens during planning; research that is itself a deliverable becomes planned work. Understanding approval starts document writing.

### 6.2 Work Breakdown

Carry the gathered choices into the Spec, Plan and Rules. Propose, write and obtain approval for each before starting the next. Apply corrections to affected earlier documents.

Workers follow expertise and context. Stages are coherent milestones in sequence. Tasks produce independently verifiable deliverables within one Worker's area; steps share the Task's validation. Prefer boundaries that allow independent work and useful dependency chains. Research steps define the question and evidence rather than requiring delegation.

Record concrete validation and any outside resources, User actions or approvals needed. Rules cover shared execution conventions, not component design. Preserve existing workspace instructions and import `AGENTS.md` from an existing workspace `CLAUDE.md`.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager dispatches Ready Tasks to free Workers. A single dispatch holds one Task. A batch holds 2–3 independent Ready Tasks or a Same-Worker chain whose other dependencies are complete. Send a chain singly when another Worker needs intermediate output. Parallel dispatch requires independent work and isolated worktrees.

Each Worker takes one dispatch at a time. Review incoming reports and dispatch newly Ready work without waiting for unrelated reports. Wait only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Same-Worker dependencies name outputs and paths; Cross-Worker dependencies also include reading and integration instructions from the producer's log. Trace upstream until an intermediate output captures the needed contracts. Give recovered Workers fuller context where needed.

Prompts name the working directory, branch/worktree and workspace root for `.apm/` paths. Follow-ups retain Task identity and log path, refining the work from review findings. Active corrections preserve valid progress and the existing workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. Missing dependencies, unresolved instruction conflicts and problems beyond the Task need guidance.

Success requires the objective and every validation criterion to pass. A deliberate deviation or unrun check is not a pass. In a batch, validate and log each Task before the next; stop at the first Failed outcome and report unstarted Tasks.

Apply User corrections immediately. At completion, ask whether corrections that apply to later Tasks should become Rules. Update the existing workspace Rules, using the assigned branch or worktree copy when tracked in the Task's repository. Commit those tracked additions with the Task; record every approved addition and its path in Important Findings.

The Worker commits, writes the Task Log, clears its Task Bus and writes a Task Report. Reports surface consequential deviations and decisions; logs hold the detail. Follow-up logs replace earlier attempts while retaining consequential findings and their resolution. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager reviews each reported Task against its log and deliverables, including individual Tasks in a batch. Investigate Important Findings, unmet criteria and contradictory Success claims before accepting work. Resolve incorrect requirements or proposed exceptions through §3.5. The User may accept a Partial outcome; preserve the evidence and remaining limits.

Review results lead to acceptance, a follow-up or a planning change. Keep pending work Active, record the decision and update the Tracker. Merge accepted branches before dependent work and before the next Stage; clean up merged worktrees and branches.

Verify the Stage when the User requested it, the Plan calls for it, or any Task needed a follow-up or reported Important Findings. Otherwise record why verification was skipped. Resolve issues, write the Stage summary, link it in the Index and retain the context needed for later work.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

At the User's request, the outgoing role checks current files and Git, writes a Handoff Log and Prompt, and obtains User approval before ending. The Prompt identifies the next conversation, source reading, current state and next action, including pending decisions and validation gaps.

The incoming Manager reads coordination records and needed Task Logs. The incoming Worker reads its Handoff Log and own current-Stage Task Logs. It resumes pending work or waits for the next delivery. The Handoff Bus is cleared after loading.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery rereads the role's initiation files and rebuilds current state from files, bus and code without changing conversation number. Preserve pending decisions and validation limits, ask about unresolved gaps and record what was recovered.

### 8.3 Summary and Archive

**Runtime:** `apm-8-summarize-session`.

A new conversation may summarize a session at any point; the Manager may do so at completion or early stopping. Before summarizing or archiving, pause active writers and record unfinished work and Git state. The optional `.apm/session.summary.md` records outcomes, consequential findings, decisions, limitations and attribution, checked against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

Archiving is optional and needs User approval. It preserves session records and remaining worktrees with their uncommitted contents, verifies preservation, then clears active APM files and installed instructions. Worktrees remain attached to source repositories. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

The archive index links to summaries. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
