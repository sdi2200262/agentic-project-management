# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM coordinates a body of work through planning documents, Memory and a file-based Message Bus. The User starts agents, delivers bus messages by asking agents to check them in their conversations, approves decisions and starts Handoffs.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Define and plan the work with the User. | Workspace research and planning conversation. |
| Manager | Assign Tasks to Workers or undertake them, review results and maintain the APM files. | Spec, Plan, `AGENTS.md`, Tracker and Memory. |
| Worker | Execute, validate and report assigned Tasks. | Task Prompts, `AGENTS.md` and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager includes needed content in Task Prompts. Roles use native subagents where the benefit outweighs context and coordination costs, within their scope and with parent verification. Task Assignment owns native-assignment procedures; Workers use only its shared subsection. The Manager uses subagent workers for substantial implementation unless the User requests direct work, but may handle contained investigation, small corrections and final checks directly. Workers carry out their Tasks directly, delegating selected parts when that improves efficiency or quality. Native subagents are separate from APM Workers and bus delivery.

Role instructions, applicable workspace instructions and permissions agreed with the User govern actions. Approval requests identify the proposed action and why it needs User agreement. Existing authorization avoids repeated requests, except for confirmation of destructive or irreversible actions and their consequences. Required workflow approvals and agreed review points remain in force.

### 1.1 Entry Formats

APM provides numbered skills and a single-skill research preview, both using the same workflow sources. Numbered command skills require User invocation. The single-skill entry may be loaded for a requested APM action or to assess whether to suggest APM for substantial work. It briefly explains the framework; starting a session requires the User's request or agreement.

Role and procedure files own the workflow. Established agents follow their loaded role instructions for ongoing work, including task/report receipt, without reloading the entry. The entry helps locate instructions when needed without repeating initiation. Role introductions describe responsibilities before directing requested initiation to take on or continue the role. Each APM agent has its own conversation. Loading the entry or a role file preserves the established role and Worker identity; agents stay within their permitted files and do not switch to another role or Worker identity. Explicit User authorization may widen file access. Both formats require User-triggered bus delivery.

Runtime names below identify the shared sources; `STRUCTURE.md` defines their output locations in each format.

## 2. Phases

A session takes an agreed body of work through planning and implementation: defining outcomes, requirements and approach, then delivering, validating and recording results and remaining work. It may cover a whole goal or a coherent part.

The Planner starts first; the Manager begins after planning, and Workers start as assignments require. Handoffs start the same agent’s next numbered conversation within the session; compaction and recovery preserve its number. Implementation groups related Tasks into ordered Stages.

### 2.1 Planning

Planning follows §6. The Planner reads both guides, defines the work with the User, obtains approval of its understanding, Spec and Plan in order, resolves workspace guidance and completes setup. It reports why guidance changed or remained sufficient, then directs the User to a new Manager conversation.

### 2.2 Implementation

Implementation follows §7. The Manager introduces its role and, separately, its first or numbered Handoff conversation. It explores the codebases and obtains User approval of its understanding before coordination. It reviews Worker attempts and concludes its own Tasks after reviewing and validating subagent outputs.

Implementation ends when all Stages complete or the User stops early; closure follows §8.3. Later sessions use prior results checked against current state, with scope and approach agreed anew and proposed sequences remaining tentative.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines the intended outcomes, scope, required behavior, design decisions and constraints. Its opening states the session’s goal, scope and success criteria; its subject sections keep authoritative sources and reasons alongside requirements and decisions. Notes hold design assumptions and unresolved questions, with brief context on work left for later sessions when discussed. The Manager maintains it and copies relevant requirements into Task Prompts.

### 3.2 Plan

`.apm/plan.md` explains how the Spec’s work is divided, ordered and assigned, then gives Workers and Stages tables and Task details. Task fields follow `work-breakdown.md` §5.2: Guidance holds approach, context, references and agreed participation or review points; steps hold actions and Validation holds checks. Assignment names the responsible Manager or Worker conversation. Dependencies identify earlier outputs as Same-Worker or Cross-Worker according to the assigned agents, including the Manager. Notes hold cross-Task constraints, reviews, Stage verification and later-session sequencing; Task-specific checks and dependencies stay in their fields. Later-session scope stays in the Spec. The Manager prepares dispatches from the Plan.

### 3.3 AGENTS.md

`AGENTS.md` holds lasting project orientation, working and read-only repository boundaries and workspace conventions. All roles read it. The Planner proposes needed additions or corrections; the Manager and Workers maintain it under User authorization. Changes extend or replace existing guidance concisely and preserve unrelated content. Orientation states facts; instructions state their scope.

For Claude, existing workspace `CLAUDE.md` files import `AGENTS.md` outside code blocks, preserving preexisting content and avoiding circular references.

### 3.4 Version Control

The Planner checks repository history and workspace instructions, proposes a version-control arrangement suited to the work and User preferences, explains changes to existing conventions and asks whether it meets the User’s needs. The agreement covers Git use, work locations, commit and integration timing, and APM file tracking. Durable conventions belong in `AGENTS.md`, the session arrangement in the Spec, coordination implications in the Plan, and live locations and actions in the Tracker.

The Manager prepares workspaces and handles integration, pushing and cleanup under the agreement. Parallel Tasks in the same repository need separate worktrees, including Manager Tasks. APM-managed worktrees stay under `.apm/worktrees/`. Required dependency outputs, including uncommitted and untracked files, must be usable in the assigned workspace. Without version control, parallel Worker dispatch is unavailable.

Commits follow agreed conventions and timing and may span Tasks. Delegated instructions preserve commit timing and approvals. Logs record commits and uncommitted work. Branches and worktrees may span Tasks or Stages; the Manager removes them only when no longer needed and their work is preserved. Acceptance is independent of their lifecycle. The Tracker locates work in Branch and Worktree, keeps Next Action current, and records shared arrangements, remaining limitations and pending integration or cleanup in Notes, including for Done Tasks.

### 3.5 Planning Changes

The Manager aligns the Spec, Plan, `AGENTS.md` and affected assignments before dependent work proceeds. Revisions preserve agreed User involvement through responsibility, size and review points, considering progress, retained knowledge and coordination demands. Work cancelled, superseded or deferred beyond the session retains its ID, reason and any replacement. The Manager reconciles requirements, tables, dependencies and instructions to withdraw obsolete work. It marks the Task Done only after scope agreement, distinguishing it from delivery in the Tracker and Stage summary. Existing logs remain; unperformed work gets no execution log. Pending decisions belong in the Tracker; consequential decisions and reasons remain in Memory.

Contained corrections to a Task, dependency or Spec point may proceed without approval. Workspace convention changes follow User authorization. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. When new design decisions are needed or repeated follow-ups cannot resolve the issue, the Manager presents options for continuing or stopping to replan; the User decides.

For ongoing work, the Manager coordinates adjustments and any needed pause with whoever performs it. Corrections carry User agreements forward, resolve further approvals and preserve valid progress, Task identity, attempt and workspace. It updates subagents directly, coordinates User-held work with the User, and uses User-delivered bus corrections for active Workers. Reported Worker attempts use review and follow-up Tasks.

### 3.6 Session-Specific Documents

Supporting documents hold retained material outside the Spec’s requirements, Plan’s work, Tracker’s coordination and Memory’s history. The Planner or Manager agrees their purpose, paths under `.apm/`, structure, maintainer and readers with the User and records them in the session’s Spec. They reuse existing documents and conventions and keep the structure navigable as it grows. Implementation work belongs in Plan Tasks; Workers receive relevant instructions in their prompts. Logs link to documents used or updated; the Tracker links those needed for coordination. Later structural changes follow §3.5.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

Shared guidance covers User communication, self-contained agent messages and the bus. Reports place the work in the workflow and recall its purpose and state before explaining results, evidence, limits and next actions. Procedure guides add brief communication cues at the relevant workflow actions. Brief progress updates accompany meaningful progress, changed expectations or consequential findings. Combined reports accompany agreed reviews, needed User decisions or actions, and stopping points in authorized work. Agents continue execution and review between these points, collecting related results rather than reporting each operation separately. Grouping follows actual progress without delaying useful results for unrelated work; urgent issues are raised promptly. Agreed participation, update frequency, approvals and role-specific Task Report delivery remain in force. Action requests provide current instructions and decision context. Waits identify pending work, resume conditions and who acts next. Estimates need evidence; elapsed time grants neither approval nor completion. Role files define responsibilities and delegation policy; guides own assignment, execution, review and reporting procedures.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one temporary message. Agents read before writing, verify outgoing content and clear processed messages before sending replies. A populated Task Bus does not establish whether execution has started; repeated delivery instructions are conditional when delivery is unconfirmed.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | Start a Worker conversation with its agent ID, or ask an existing Worker to check its tasks |
| Task Report | Worker → Manager | Ask the Manager to check the named agents’ reports or all pending reports |
| Handoff Prompt | Outgoing → incoming conversation | Start a new conversation of the same role, supplying the Worker ID when applicable |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

The Tracker holds live Task states, next actions, work locations and Worker context, linking each Task to its latest reported Worker log or concluding Manager log when available. Updates follow changes in assignments, responsibilities, outcomes, blockers or decisions, or preserve progress needed to resume. They are consolidated before dependent work, waits or Handoffs rather than following each execution step or User report. Notes retain current coordination and pending decisions; superseded notes are revised together. Memory preserves attempts, Stage summaries, Handoffs and lasting findings. Consequential history is preserved before its only record is removed. Durable references point to logs or summaries, not transient Tracker notes; Index Notes link lasting findings to sources. Runtime files own the formats.

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

Each round includes a User exchange, follow-up work, a summary and an open question. Exploration, research, analysis and design continue throughout, at a depth suited to scope, complexity and uncertainty. Preparation needed for a decision precedes dependent questions; supplied context and intermediate work do not skip rounds. Questions resolve substantive gaps and unclear relevance. Recommendations address evidence, trade-offs or uncertainty after intent is established. The User decides consequential design choices; agents handle details within those decisions.

The Planner develops tentative Stages, Tasks and assignments during questioning, revising them as it learns. Manager execution through subagent workers supports automation and higher-level collaboration; separate Workers support close implementation collaboration. The Planner asks whether the User wants to perform any portion, with the responsible agent’s assistance.

The User chooses the form and frequency of involvement. The Planner recommends options suited to risk, uncertainty, experience and preferences, explaining how they support understanding and authority: automated Manager execution, User-mediated coordination with Workers, User-led work with assistance, or a combination. Participation may include collaboration, reviews, tests, demonstrations, explanations or progress reports. The Plan records required validation, User or outside review points, timing constraints and agreed update frequency. Task and Stage boundaries, sizes, batches and parallelism support these agreements. Routine update timing and grouping remain execution choices; the Manager proposes adjustments as findings or feedback warrant.

The Planner establishes session scope early and refines it through discovery. Goals too large for one session need a coherent session outcome and tentative later-session sequence, with boundaries and dependencies explained. Scope accounts for timing and prerequisites outside agents’ control; the Plan records independent work, resume conditions and agreed handling when runnable work ends: pause, defer or revise scope. Waiting does not satisfy a prerequisite. The User agrees scope before the understanding summary, which distinguishes Spec requirements and design from Plan work and coordination. Preparation needed to define work belongs in planning; bounded investigation Tasks identify questions, evidence, completion criteria and dependent decisions. Understanding approval starts document writing.

### 6.2 Work Breakdown

Document approvals follow §2.1; corrections carry into earlier documents. Task responsibility, size and review points reflect agreed involvement, and User-performed work keeps its responsible agent.

Assignments balance expertise, shared context and User involvement, keeping related work together where familiarity helps. Stages group coherent outcomes around dependencies and meaningful review. Tasks have clear outputs and checks, with boundaries shaped by size, complexity, uncertainty, dependencies and expertise. Research, implementation and validation may share or span Tasks. Parallelism follows dependencies and constraints. Steps give Task-specific actions and refer to shared procedures for common details.

Before approval, the Spec must define the agreed outcomes and behavior, and each Plan Task must describe work its assigned agent can undertake and validate. Research Tasks identify the questions and decisions they leave open; dependent work is defined to the extent those answers allow. Participation and review points identify the work and decisions they concern. Validation names observable checks and expected results, including required User actions. Routine subagent and independent review arrangements remain execution choices within agreed requirements. Updates to `AGENTS.md` preserve preexisting content except for authorized changes; existing workspace `CLAUDE.md` files import `AGENTS.md`.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager selects Ready Tasks and batch sizes using the Plan's coordination preferences and current User instructions, balancing progress with User understanding and control. It follows the agreed forms and frequency of involvement and recommends adjustments when findings or changes make them useful. For Tasks it undertakes, the Manager uses the Plan and Spec directly. Worker assignments use Task Prompts and the Message Bus. A single dispatch holds one Task. A batch holds 2–3 independent Ready Tasks or a Same-Worker chain whose other dependencies are complete. A chain is dispatched one Task at a time when another Worker needs intermediate output. Parallel dispatch requires independent work and isolated worktrees.

Each Worker takes one dispatch at a time. The Manager reviews incoming reports and dispatches newly Ready work without waiting for unrelated reports. It waits only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Every dependency names outputs, paths and how to use them. Cross-Worker dependencies name the producer’s accepted Task Log for the Worker to read and supply reading and integration steps; Same-Worker dependencies do too when context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Dependency tracing stops where an intermediate output captures the needed contracts.

Prompts supply the workspace and commit instructions established under §3.4, including the session root for `.apm/` paths. Each needed contract appears once. Follow-ups retain Task identity but receive a new numbered log path from the Manager, per Task. They focus on remaining work and use the Worker's established context, restoring detail where it is missing. Active corrections preserve the current attempt's log path, valid progress and workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-2-initiate-manager`, `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Manager reads all four implementation guides, starts its Tasks from the Spec, Plan and dependency evidence, and organizes native contributions under Task Assignment. Execution stays within approved requirements and Task boundaries, with each Task’s outputs and validation traceable. The Manager verifies contributions and the combined result, resolves gaps and writes one concluding Task Log with `agent: manager` and its conversation number. Worker bus and attempt procedures do not apply. Tasks stay Active through iteration or pending decisions; completion requires validated requirements or User agreement to remaining limits. Planning changes and integration follow Task Review.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. Role instructions own Task and Report receipt; delivery commands route there. An established Worker retains its identity when checking Tasks. The Manager reads the requested reports, or all pending reports when none are specified, and returns to coordination if none are waiting. The Worker uses its Task Prompt, workspace instructions and knowledge of its area built through earlier assignments and its conversation. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. Session coordination details stay in APM files unless they are part of the work itself. Missing dependencies, unresolved instruction conflicts, repeated attempts without progress and work that substantially exceeds the assignment need guidance. Within an Active Task, missing outputs or failed integration checks pause dependent work; unaffected work may continue within required sequencing. User actions pause only affected work; required approvals and checks remain in force. Workers report relevant findings and possible wider effects from their available context. When that context leaves an issue unclear, they ask the User and recommend local resolution or Manager involvement if broader context or coordination is likely needed, pausing only affected work.

The User may take on or return any portion. The responsible agent briefs and supports them, stops overlapping work, checks returned work and retains validation and logging responsibility. Limited help does not transfer the rest of the work. The arrangement and resume point stay in the Tracker or Worker prompt, with consequential contributions in the log. Assignment, state and attempt are preserved.

Success requires the objective and every validation criterion to pass, including required documentation and affected behavior. Agents resolve known issues and validation gaps within scope and permission before final logs or reports; implementation subagent briefs carry the same validation and guidance requirements. A deliberate deviation or unrun check is not a pass. Agents use evidence for the actual deliverable and request remaining checks. They rerun checks when changes, incomplete evidence or uncertainty warrant it, confirm recurring failures match their established causes and distinguish local, CI and integrated results. User-facing test procedures are checked as written and isolate disposable test state from User data. If required validation or resources are unavailable, unaffected work and available checks continue. If the limits remain at completion, the outcome is Partial. In a Worker batch, each Task is validated and logged before the next; Partial or Failed stops the batch, with remaining Tasks reported as Not started.

Workers apply User corrections immediately and resolve their retention in `AGENTS.md` at completion under existing authorization or a User decision. Other findings may justify guidance updates. Tracked changes use the assigned branch or worktree and agreed commit timing; Important Findings retain changes and paths.

The Worker completes agreed User review and resulting changes, follows agreed commit conventions, writes the Task Log, clears its Task Bus and writes a Task Report pointing to that attempt’s log. Follow-up logs leave earlier attempts unchanged, link to the original and previous follow-up, and record new work, validation and the resolution of earlier findings. Outcomes still assess the whole Task, including unresolved earlier criteria. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager checks results and validation against requirements, including each batch Task. It inspects outputs or runs focused checks where evidence is incomplete or uncertain, and revisits requirements questioned by findings. It investigates Important Findings, unmet criteria and contradictory Success claims before acceptance. Direct corrections follow §1, with work and validation recorded separately from Worker outcomes. It compares follow-ups with earlier attempts and reassesses stalled or expanded work; further dispatch requires concrete work and a supported approach. Wrong requirements and exceptions follow §3.5. Acceptance requires validated work or User-approved remaining limits, preserving evidence and qualifications.

The Manager decides whether independent subagent review is needed and chooses its scope and reviewer count by importance, complexity, uncertainty and needed expertise, preserving required reviews. Related outputs may share one review; distinct consequential questions may warrant separate reviews. Reviews may cover a Task, related Tasks or integrated results. Reviewers remain separate from implementers and receive requirements, evidence, accepted exceptions and the review’s scope. They challenge completeness and validation; the Manager verifies findings and resolves confirmed gaps through the applicable procedure. Reviewers may continue for targeted follow-up; further review depends on remaining risk or uncertainty, reusing valid evidence. Recommendations help when the User requests guidance or evidence clarifies a consequential trade-off. Any proposed acceptance of remaining limits explains their effects on the session and dependent work and why acceptance is preferable to further work or a planning change. Agreement may originate in the Worker conversation; the Manager checks whether it covers the limits and wider consequences, asking again only for new consequences or an unclear decision.

Broader design or scope questions need viable options and approval per §3.5. Review leads to acceptance, follow-up or planning change. Pending Tasks stay Active. The Manager consolidates Tracker updates per §5, preserving decisions and recovery state, and resolves investigation and alignment before dependent work; unrelated Ready work continues. Integration and cleanup remain independent of acceptance (§3.4).

The Manager verifies a Stage when the User requested it, the Plan calls for it, or any Task needed a follow-up or recorded Important Findings. Otherwise the Stage summary records why verification was skipped. Verification uses relevant checks on the combined result, separates reference inputs from generated results and preserves usable evidence paths through cleanup. Fixes to Done work need new Tasks. The Manager resolves issues, writes the Stage summary, links it in the Index and retains context needed for later work.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

At the User’s request, the outgoing agent checks files and Git, writes a Handoff Log and Prompt, and obtains approval before ending. It tells the User, pauses running subagents and collects progress, outputs and pending checks first. Workers report only integration state supported by their workspace evidence. Records preserve User-held work, assistance needed, reviews, limitations and resume conditions. The Prompt names the next conversation, source reading, checked state and next action, including pending decisions and validation gaps.

The incoming Manager reads coordination records and needed Task Logs; the Worker reads its Handoff Log, latest relevant own logs from the current Stage and dependency logs needed to resume, following earlier-attempt links as needed. Both check records against current state, preserve User-held work, ask about gaps and clear the Handoff Bus. The Worker resumes with the current prompt’s log path or awaits delivery.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery routes to the role procedure, reloads its instructions and required files, and checks permitted records, buses and deliverables without repeating initiation or changing identity or number. Workers use their current prompt and latest relevant own Task Logs and Handoff Logs, following earlier attempts as needed. Recovery preserves the attempt, User-held work, decisions and validation limits; the agent asks about gaps and records recovery sources.

### 8.3 Summary and Archive

**Runtime:** `apm-8-summarize-session`.

A new conversation may summarize without adopting a role; the Manager may summarize at completion or early stopping. Normal completion reports results. Early closure pauses Tasks and subagents, asks the User to pause other active work, and records checked unfinished state without changing Task states. Summary and archive preparation uses current stop confirmation or collects missing state from the User. The optional summary checks outcomes, findings, decisions, limits and attribution against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

Archiving is optional and needs User approval. It preserves session records and remaining APM-managed worktrees with their uncommitted contents, verifies preservation, then clears active APM files and installed instructions. Worktrees remain attached to source repositories; ordinary project-directory changes remain in place. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

The archive index links to summaries. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
