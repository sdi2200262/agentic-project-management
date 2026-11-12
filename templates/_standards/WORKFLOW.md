# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM coordinates a body of work through planning documents, Memory and a file-based Message Bus. The User starts agents, delivers bus messages by asking agents to check them in their conversations, approves decisions and starts Handoffs.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Define and plan the work with the User. | Workspace research and planning conversation. |
| Manager | Assign Tasks to Workers or undertake them, review results and maintain the APM files. | Spec, Plan, `AGENTS.md`, Tracker and Memory. |
| Worker | Execute, validate and report assigned Tasks. | Task Prompts, `AGENTS.md` and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager includes needed content in Task Prompts. Roles use native subagents where the benefit outweighs context and coordination costs, within their scope and with parent verification. The Manager uses subagent workers for substantial implementation unless the User requests direct work, but may handle contained investigation, small corrections and final checks directly. Native subagents are separate from APM Workers and bus delivery.

Role instructions, applicable workspace instructions and permissions agreed with the User govern actions. Approval requests identify the proposed action and why it needs User agreement. Existing authorization avoids repeated requests, except for confirmation of destructive or irreversible actions and their consequences. Required workflow approvals and agreed review points remain in force.

### 1.1 Entry Formats

APM provides numbered skills and a single-skill research preview, both using the same workflow sources. Numbered command skills require User invocation. The single-skill entry may be loaded for a requested APM action or to assess whether to suggest APM for substantial work. It briefly explains the framework; starting a session requires the User's request or agreement.

Role and procedure files own the workflow. Established agents follow their loaded role instructions for ongoing work, including task/report receipt, without reloading the entry. The entry helps locate instructions when needed without repeating initiation. Role introductions describe responsibilities before directing requested initiation to take on or continue the role. Each APM agent has its own conversation. Loading the entry or a role file preserves the established role and Worker identity; agents stay within their permitted files and do not switch to another role or Worker identity. Explicit User authorization may widen file access. Both formats require User-triggered bus delivery.

Runtime names below identify the shared sources; `STRUCTURE.md` defines their output locations in each format.

## 2. Phases

An APM session covers an agreed body of work through planning, then implementation. Planning establishes the intended outcomes, requirements and approach; implementation carries out the work, validates results and records what was achieved and what remains. A session may address a larger goal in full or deliver a coherent part of it.

The Planner works with the User first, in its own conversation. The Manager begins after planning is complete; separate Worker conversations begin as needed for assignments. Each agent has its own conversation. Manager and Worker Handoffs start that agent’s next numbered conversation within the same session; compaction and recovery preserve its conversation and number. Within implementation, Stages group related Tasks into coherent parts of the work.

### 2.1 Planning

The Planner reads both planning guides at initiation and establishes the session's intended outcome with the User. It does the exploration, analysis and design needed to define the work before writing the Spec and Plan. The User approves its understanding summary, then the Spec and Plan separately, in that order. The Planner resolves needed `AGENTS.md` changes under existing User authorization, completes session setup and creates the Message Bus. It communicates the guidance review's result, including a justified no-change conclusion, and directs the User to start a new Manager conversation to coordinate the approved session.

### 2.2 Implementation

The Manager introduces its role plainly, stating separately whether this is its first conversation or a numbered continuation from a Handoff. It explores the working codebases, confirms its understanding with the User and starts dispatching under the approved planning decisions. Workers report attempts for Manager review; the Manager concludes its own Tasks after reviewing and validating subagent workers’ outputs. Stages run in order. The Manager may coordinate its Tasks sequentially or concurrently; Worker dispatches may be single, batch or parallel.

Implementation ends when every Stage is complete or the User stops early. The Manager records the state, reports the outcome and offers a summary and archive. Later sessions can build on earlier results, decisions and findings, checked against the current state. Their intended outcomes and approach are agreed with the User; proposed sequences remain tentative as understanding develops.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines the intended outcomes, scope, required behavior, design decisions and constraints. Its opening states the session’s goal, scope and success criteria; its subject sections keep authoritative sources and reasons alongside requirements and decisions. Notes hold design assumptions and unresolved questions, with brief context on work left for later sessions when discussed. The Manager maintains it and copies relevant requirements into Task Prompts.

### 3.2 Plan

`.apm/plan.md` opens with how the work described in the Spec is divided, ordered and assigned, referring to the Spec, then includes Workers and Stages tables before the Task detail. Each Task has an objective, assigned agent (`manager` or a Worker slug), dependencies, output, validation, guidance and steps. Assignment identifies the responsible agent and its APM conversation. Dependencies identify earlier Task outputs, marked Same-Worker for the same assigned agent and Cross-Worker for different agents, including the Manager. Guidance holds Task-specific approach, context, references and agreed participation or review points; steps hold actions and Validation holds checks. Its Notes hold necessary coordination across Tasks, including shared constraints, review points and Stage verification needs. Task-specific dependencies and checks stay in their fields. When later sessions were discussed, Notes briefly record agreed sequencing or prerequisites, referring to the Spec for the work involved. The Manager uses the Plan to prepare dispatches.

### 3.3 AGENTS.md

`AGENTS.md` holds project orientation, working and read-only repository boundaries, and applicable workspace conventions across sessions. All agent roles read it. The Planner proposes needed additions or corrections to preexisting content; the Manager and Workers maintain it as work reveals durable conventions. Guidance is added or revised when useful to future workspace work, extending or replacing existing guidance concisely where possible. Orientation states facts; instructions identify the actions or areas to which they apply. Changes follow User authorization and preserve unrelated content.

For Claude, existing workspace `CLAUDE.md` files import `AGENTS.md` outside code blocks, preserving preexisting content and avoiding circular references.

### 3.4 Version Control

The Planner checks repository history and workspace instructions, proposes a version-control arrangement suited to the work and User preferences, explains changes to existing conventions and asks whether it meets the User’s needs. The agreement covers Git use, work locations, commit and integration timing, and APM file tracking. Durable conventions belong in `AGENTS.md`, the session arrangement in the Spec, coordination implications in the Plan, and live locations and actions in the Tracker.

The Manager prepares workspaces and handles integration, pushing and cleanup under the agreement. Parallel Tasks in the same repository need separate worktrees, including Manager Tasks. APM-managed worktrees stay under `.apm/worktrees/`. Required dependency outputs, including uncommitted and untracked files, must be usable in the assigned workspace. Without version control, parallel Worker dispatch is unavailable.

Commits follow the agreed conventions and timing and may cover several Tasks. Delegated instructions preserve agreed commit timing and approvals. Logs record relevant commits and uncommitted work. Branches and worktrees may serve several Tasks or Stages; acceptance is independent of their lifecycle. They are removed only when no longer needed and their work is preserved. The Tracker’s Branch and Worktree columns locate work. A Task may be Done, including with any explicitly accepted Partial outcome, while integration or cleanup remains pending. Tracker Notes explicitly record remaining limitations and pending integration or cleanup; Next Action stays current. Notes also retain shared arrangements while needed.

### 3.5 Planning Changes

The Manager keeps the Spec, Plan, `AGENTS.md` and affected Task instructions aligned when findings or decisions change them. New or changed Tasks preserve the agreed User involvement through responsibility, size and review points. When revising assignments, the Manager considers progress, knowledge built in each conversation, and current context and coordination demands. Work cancelled, superseded or deferred beyond the session retains its identity and reason, with obsolete instructions clearly withdrawn and affected tables, dependencies and requirements reconciled. After the scope change is agreed, its Task is marked Done with its disposition recorded, distinct from delivered work. Existing logs are preserved; no execution log is invented for unperformed work. It updates affected requirements and Task fields before preparing further work, records pending decisions in the Tracker and preserves consequential decisions with their reasons in Memory.

Contained corrections to a Task, dependency or Spec point may proceed without approval. Workspace convention changes follow User authorization. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. When new design decisions are needed or repeated follow-ups cannot resolve the issue, the Manager presents options for continuing or stopping to replan; the User decides.

When changes affect ongoing work, the Manager checks their effects and coordinates any needed adjustment with whoever performs it, arranging a pause when needed. It carries forward User agreements and resolves further approvals. Corrections preserve valid progress, Task identity, current attempt and workspace. The Manager updates its subagents directly, the User delivers Worker corrections through the Message Bus, and User-performed portions are coordinated with the User. Reported Worker attempts use review and follow-up Tasks.

### 3.6 Session-Specific Documents

Requirements belong in the Spec, planned work in the Plan, live coordination in the Tracker, and work history in Memory. Supporting documents hold only retained material outside those responsibilities. The Planner or Manager proposes their purpose, paths under `.apm/`, structure, maintenance responsibility and intended readers to the User. They refine the proposal with User feedback and record the agreed arrangement in the Spec for this session only. Any implementation work to create, use or maintain them belongs in Plan Tasks; Workers receive relevant instructions through Task Prompts. Supporting structures remain navigable as the session grows, reusing existing documents and conventions where suitable. Logs link to supporting documents used or updated; Tracker entries link to those used for coordination. New document types or structures follow §3.5.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

Shared communication covers writing to the User, writing self-contained messages for other agents and using the bus. Agents give brief progress updates and group related results, feedback and questions, following agreed User participation, review points and update frequency. Parallel results are grouped using actual progress, while issues needing timely attention are raised promptly. Requests for User action include current instructions and decision context, what is ready or pending and what can continue; progress updates briefly remind the User of pending actions. Waits identify what permits resumption and who is responsible for the next action, where applicable; timing estimates need evidence, and elapsed time grants neither approval nor completion. Role-specific questioning and subagent guidance live in role files.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one temporary message. Agents read before writing, verify outgoing content and clear processed messages before sending replies. A populated Task Bus does not establish whether execution has started; repeated delivery instructions are conditional when delivery is unconfirmed.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | Start a Worker conversation with its agent ID, or ask an existing Worker to check its tasks |
| Task Report | Worker → Manager | Ask the Manager to check the named agents’ reports or all pending reports |
| Handoff Prompt | Outgoing → incoming conversation | Start a new conversation of the same role, supplying the Worker ID when applicable |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

The Tracker is the Manager's live record of Task states, next actions, branches, worktrees and Worker context. Each Task links to its latest reported Worker log or concluding Manager log when one exists. Durable records use stable evidence references rather than transient Tracker notes. Memory preserves original and follow-up Task Logs, Stage summaries, Handoff Logs and lasting findings. Tracker Notes hold current coordination needs and pending decisions. Index Notes preserve findings useful to later work, linked to Stage summaries and supporting evidence. Pending actions link to lasting findings rather than duplicating them; Tracker notes are removed when preserved durably and no longer needed for coordination. Runtime formats define their fields and organization.

The responsible agent logs Success, Partial or Failed; the Manager decides whether the Task becomes Done. Tasks stay Active during investigation, follow-up or pending decisions. Done is final: later fixes need new Tasks referring to the original work.

A Stage completes when its Tasks are Done and its required integration and verification are complete. Accepted Partial outcomes and unrun checks remain qualified in summaries.

Agents flag Important Findings that affect acceptance or may matter to later work, separating evidence from uncertainty. Partial and Failed outcomes always have Important Findings. The Manager resolves their effects on planning and records the decision. Summaries preserve consequential findings, decisions, evidence and limitations with source links.

Worker conversation numbers change at Handoff, not recovery. The Tracker records earlier-Stage Tasks a new Worker conversation has not read and context gaps after recovery. These notes guide context restoration without changing dependency labels.

## 6. Planning

**Runtime:** `apm-1-initiate-planner`, `context-gathering.md` and `work-breakdown.md`.

### 6.1 Context Gathering

The Planner surveys repositories, instructions and existing materials within its scope, using supplied context even when the workspace is empty. It verifies consequential claims against current sources, behavior and changes, distinguishing evidence from descriptions or assumptions; the User's instructions and current evidence establish which sources govern the session. Unclear or conflicting source authority requires clarification. It researches relevant codebases and archives, then follows three question rounds:

1. Existing materials, vision and scope.
2. Technical requirements, constraints, dependencies and success criteria.
3. Implementation approach, quality and coordination preferences.

The rounds organize discussion while exploration, research, analysis and design continue throughout Context Gathering. Planning depth follows the agreed scope, complexity and uncertainty. Each round includes an exchange with the User, follow-up work, a summary and an open question. When an answer or finding reveals preparation needed for a planning decision, the Planner completes it before dependent questions, then resumes the rounds with updated questions. Initial context and intermediate work do not skip rounds. Questions resolve substantive gaps, including unclear topic relevance; recommendations help with consequential trade-offs or uncertainty rather than pre-empting unclear intent. The Planner resolves consequential design choices with the User and handles details within agreed decisions independently.

The Planner develops tentative Stages, Tasks and assignments during questioning, revising them as it learns. Manager execution through subagent workers supports automation and higher-level collaboration; separate Workers support close implementation collaboration. The Planner asks whether the User wants to perform any portion, with the responsible agent’s assistance.

APM encourages involvement that preserves the User’s understanding of and authority over work they remain responsible for. The Planner proposes forms and frequency based on the work’s risks and uncertainty and the User’s experience and preferences, explaining their purpose. The Plan records required validation, User or outside review points, relevant timing constraints and any agreed update frequency. Routine update timing and grouping of results remain execution choices. The Manager chooses actual coordination within those agreements and proposes adjustments when findings or User feedback make them useful. The User may choose automated Manager execution, User-mediated coordination with Workers, User-led work with assistance, or a combination. Involvement may include collaboration, reviews, testing, demonstrations, explanations or progress reports at agreed points or intervals. Task and Stage boundaries, Task sizes, batches and parallel work support that arrangement.

The Planner establishes the intended session outcome early and refines its boundary through discovery. For a larger goal, it proposes a coherent outcome for this session and a tentative sequence of later sessions, explaining boundaries and dependencies. Scope and sequencing account for timing constraints and dependencies outside the agents’ control. The Plan records what can proceed independently, prerequisites for affected work and the agreed handling if available work ends before they are met: pause, defer affected work or revise scope. Waiting alone does not satisfy a prerequisite. The scope is agreed before the understanding summary. Preparation needed to define the work belongs in planning; bounded investigation within defined work may be a Task with specific questions, evidence, completion criteria and dependent decisions identified. The summary presents the proposed work and assignments, distinguishing Spec requirements and design from Plan structure and coordination. Understanding approval starts document writing.

### 6.2 Work Breakdown

The Planner writes the Spec and Plan in order, obtaining approval for each, then resolves any needed `AGENTS.md` updates with the User. Corrections carry through to affected earlier documents. Task responsibilities, sizes and review points reflect the agreed User involvement. The responsible agent remains the same when the User performs work.

The Planner assigns Tasks between Manager and Worker conversations using the expertise, shared context and User involvement the planned work is likely to need. Related work stays together where familiarity should help, weighing expected context and coordination demands. Stages mark coherent outcomes chosen around dependencies and useful review points, rather than merely grouping work by difficulty. Each Task defines work the Manager or one Worker is responsible for completing, with a clear output and validation. Task boundaries depend on size, complexity, uncertainty, dependencies and expertise; research, implementation and validation may share a Task or need separate Tasks. Parallelism follows the work's dependencies and constraints. Steps are Task-specific operations toward the output, referencing shared procedures for common details.

Before approval, the Spec must define the agreed outcomes and behavior, and each Plan Task must describe work its assigned agent can undertake and validate. Research Tasks identify the questions and decisions they leave open; dependent work is defined to the extent those answers allow. Participation and review points identify the work and decisions they concern. Validation names observable checks and expected results, including required User actions. Updates to `AGENTS.md` preserve preexisting content except for authorized changes; existing workspace `CLAUDE.md` files import `AGENTS.md`.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager selects Ready Tasks and batch sizes using the Plan's coordination preferences and current User instructions, balancing progress with User understanding and control. It follows the agreed forms and frequency of involvement and recommends adjustments when findings or changes make them useful. For Tasks it undertakes, the Manager uses the Plan and Spec directly. Worker assignments use Task Prompts and the Message Bus. A single dispatch holds one Task. A batch holds 2–3 independent Ready Tasks or a Same-Worker chain whose other dependencies are complete. A chain is dispatched one Task at a time when another Worker needs intermediate output. Parallel dispatch requires independent work and isolated worktrees.

Each Worker takes one dispatch at a time. The Manager reviews incoming reports and dispatches newly Ready work without waiting for unrelated reports. It waits only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Every dependency names outputs, paths and how to use them. Cross-Worker dependencies include reading and integration instructions from accepted logs; Same-Worker dependencies do too when context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Dependency tracing stops where an intermediate output captures the needed contracts.

Prompts supply the workspace and commit instructions established under §3.4, including the session root for `.apm/` paths. Each needed contract appears once. Follow-ups retain Task identity but receive a new numbered log path from the Manager, per Task. They focus on remaining work and use the Worker's established context, restoring detail where it is missing. Active corrections preserve the current attempt's log path, valid progress and workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-2-initiate-manager`, `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Manager reads all four implementation guides. It applies result review and acceptance to its subagent contributions without using Worker bus or attempt procedures. It starts its own Tasks from the Plan, Spec, dependency evidence and implementation context built through coordination and review, refining execution detail within approved requirements and Task boundaries. It gives one subagent worker a whole coherent Task or divides it into logical contributions covering the objective and validation. Dependent contributions are sequenced; independent ones may run together. Research or debugging subagents may support focused investigation before implementation continues. The Manager supplies the context, boundaries and checks for each contribution. It verifies their output, resolves validation gaps and writes the final Task Log itself. Its concluding log uses `agent: manager` and its conversation number. Tasks remain Active through iteration or pending decisions; completion requires validated requirements or User agreement to remaining limits. Planning changes and merging follow Task Review.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. Role instructions own Task and Report receipt; delivery commands route there. An established Worker retains its identity when checking Tasks. The Manager reads the requested reports, or all pending reports when none are specified, and returns to coordination if none are waiting. The Worker uses its Task Prompt, workspace instructions and knowledge of its area built through earlier assignments and its conversation. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. Session coordination details stay in APM files unless they are part of the work itself. Missing dependencies, unresolved instruction conflicts, repeated attempts without progress and work that substantially exceeds the assignment need guidance. Within an Active Task, missing outputs or failed integration checks pause dependent work; unaffected work may continue within required sequencing. User actions pause only affected work; required approvals and checks remain in force. Workers report relevant findings and possible wider effects from their available context. When that context leaves an issue unclear, they ask the User and recommend local resolution or Manager involvement if broader context or coordination is likely needed, pausing only affected work.

The User may perform any Task or part, take over during execution, and return work to its responsible agent at any time. That agent briefs and supports the User, stops overlapping execution, checks returned work and remains responsible for validation and logging. Limited help does not transfer the rest of the work. Current participation and the resume point belong in the Manager’s Tracker or the Worker’s current Task Prompt; the Task Log records contributions and consequential changes in who performed the work. Participation changes preserve the assignment, Task state and current attempt.

Success requires the objective and every validation criterion to pass. A deliberate deviation or unrun check is not a pass. Agents use valid evidence for the current deliverable and request remaining checks. They rerun checks when changes, incomplete evidence or uncertainty warrant it, confirm recurring failures match their established causes and distinguish local, CI and integrated results. User-facing test procedures are checked as written and isolate disposable test state from User data. If required validation or resources are unavailable, unaffected work and available checks continue. If the limits remain at completion, the outcome is Partial. In a Worker batch, each Task is validated and logged before the next; Partial or Failed stops the batch, with remaining Tasks reported as Not started.

The Worker applies User corrections immediately and resolves whether they should persist in `AGENTS.md` at completion, using existing User instructions or asking when that decision remains open. Other findings may also prompt proposed additions or corrections. Authorized changes use the assigned branch or worktree when tracked and follow agreed commit timing. Important Findings record the changes and their paths.

The Worker completes agreed User review and resulting changes, follows agreed commit conventions, writes the Task Log, clears its Task Bus and writes a Task Report pointing to that attempt’s log. Follow-up logs leave earlier attempts unchanged, link to the original and previous follow-up, and record new work, validation and the resolution of earlier findings. Outcomes still assess the whole Task, including unresolved earlier criteria. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager compares each reported result and validation evidence with the Task requirements, including individual Tasks in a batch. It inspects outputs or runs focused checks where evidence is incomplete or uncertain, and revisits relevant Spec and Plan sections when findings question requirements or assumptions. Important Findings, unmet criteria and contradictory Success claims are investigated before acceptance. The Manager may resolve contained corrections and checks directly under §1. The Manager records its work and validation separately from the Worker's outcome. It compares follow-ups with earlier attempts; another dispatch needs concrete remaining work and a supported approach. Stalled attempts or substantially expanded work prompt reassessment of the approach or requirement. Incorrect requirements or proposed exceptions follow §3.5. The Manager may accept work completed and validated during review; accepting remaining Partial work needs the User. Evidence and remaining limits are preserved.

The Manager chooses independent subagent review during implementation according to the work’s importance, complexity and uncertainty. Reviews may cover a Task, related Tasks or integrated results. Reviewers remain separate from implementers and receive requirements, evidence, accepted exceptions and the review’s scope. They challenge completeness and validation; the Manager verifies findings and resolves confirmed gaps through the applicable procedure. Reviewers may continue for targeted follow-up; further review depends on remaining risk or uncertainty, reusing valid evidence. Recommendations help when the User requests guidance or evidence clarifies a consequential trade-off. Any proposed acceptance of remaining limits explains their effects on the session and dependent work and why acceptance is preferable to further work or a planning change. Agreement may originate in the Worker conversation; the Manager checks whether it covers the limits and wider consequences, asking again only for new consequences or an unclear decision.

The Manager investigates broader design or scope questions enough to present viable options, resolving contained corrections under §3.5 and agreeing broader changes with the User. Review results lead to acceptance, a follow-up or a planning change. Pending work stays Active; the Manager records the decision and updates the Tracker with review and dispatch decisions, preserving recovery state and pending decisions. Needed investigation and document alignment precede affected downstream work; unrelated Ready work continues. Integration and cleanup follow §3.4 independently of Task acceptance.

The Manager verifies a Stage when the User requested it, the Plan calls for it, or any Task needed a follow-up or recorded Important Findings. Otherwise the Stage summary records why verification was skipped. Verification uses relevant checks on the combined result, separates reference inputs from generated results and preserves usable evidence paths through cleanup. Fixes to Done work need new Tasks. The Manager resolves issues, writes the Stage summary, links it in the Index and retains context needed for later work.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

At the User’s request, the outgoing role checks current files and Git, writes a Handoff Log and Prompt, and obtains User approval before ending. If subagents are running, it tells the User, pauses them and collects progress, outputs and pending checks first. Workers check their assigned workspace, commits and uncommitted work, recording integration state only where supported by available evidence. Records carry any User-held work, assistance the User may need, resume conditions and agreed reviews or limitations. The Prompt identifies the next conversation, source reading, current state and next action, including pending decisions and validation gaps.

The incoming Manager reads coordination records and needed Task Logs. The incoming Worker reads its Handoff Log and latest relevant own Task Logs from the current Stage. Earlier attempts are read through links where needed. It resumes pending work using the current prompt's log path or waits for the next delivery. The incoming agent checks recorded progress against current state, preserves User-held work and asks about gaps the records cannot settle. The Handoff Bus is cleared after loading.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

The shared Recovery skill routes to the role's recovery procedure. Recovery reloads the full role instructions and their required files, then rebuilds current state from permitted files, bus and code without repeating initiation or changing conversation number. Workers start from their current prompt, latest relevant own Task Logs and Handoff Log, following earlier-attempt links where needed. Recovery preserves the current attempt, User-held work, pending decisions and validation limits. The agent asks about unresolved gaps and records what was recovered.

### 8.3 Summary and Archive

**Runtime:** `apm-8-summarize-session`.

A new conversation may summarize a session at any point without initiating an APM role; the Manager may do so at completion or early stopping. At normal completion the Manager presents results. For early closure it pauses active Tasks, stops their subagents, asks the User to pause other active work, and records checked unfinished state without changing Task states. Summary or archive preparation uses current confirmation that active work has stopped; missing or changed state is collected from the User. The optional `.apm/session.summary.md` records outcomes, consequential findings, decisions, limitations and attribution, checked against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

Archiving is optional and needs User approval. It preserves session records and remaining APM-managed worktrees with their uncommitted contents, verifies preservation, then clears active APM files and installed instructions. Worktrees remain attached to source repositories; ordinary project-directory changes remain in place. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

The archive index links to summaries. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
