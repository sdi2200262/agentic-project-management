# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM preserves agreed intent, structured work and reliable history beyond individual conversations. Its central idea is productive friction: useful involvement that helps the User understand and direct the work. The User chooses implementation involvement suited to the work; agents recommend useful participation while avoiding unnecessary work, coordination and interruptions.

Work structure and interaction are distinct. The Spec, ordered Stages, Tasks, dependencies, validation and records remain intact under any execution arrangement. Their required procedures establish the minimum workflow; execution, reporting and collaboration can vary around them. A required internal step does not automatically require a User interaction. By default the User starts conversations, delivers messages and completes Handoffs; other coordination arrangements require explicit agreement.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Define and plan the work with the User. | Workspace research and planning conversation. |
| Manager | Assign Tasks to Workers or undertake them, review results and maintain the APM files. | Spec, Plan, `AGENTS.md`, Tracker and Memory. |
| Worker | Execute, validate and report assigned Tasks. | Task Prompts, `AGENTS.md` and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager supplies relevant requirements, involvement arrangements and dependency context in self-contained Task Prompts. Native subagents remain within their parent's scope and are distinct from APM Workers and bus delivery. Task Assignment's native-assignment subsection supplies shared delegation guidance to the roles that need it; role files state delegation policy and the relevant procedure supplies its particular context.

Agents follow the prescribed workflow, applicable workspace instructions and permissions unless the User explicitly agrees to a specific change. Requirements, defaults and permitted execution choices remain distinguishable. Choices within agreed authority do not need new approval. Approval requests identify the exact decision and consequential effects in plain language. Agreement covers only what was clearly presented and explicitly accepted; silence, continued discussion and approval of related work do not establish wider agreement. Existing authorization applies within its actual scope, while destructive or irreversible actions require confirmation of their consequences. Required approvals and agreed review points remain in force.

### 1.1 Entry Formats

APM provides numbered skills and a single-skill research preview, both using the same workflow sources. Numbered command skills require User invocation. The single-skill entry may be loaded for a requested APM action or to assess whether to suggest APM for substantial work. It briefly explains the framework; starting a session requires the User's request or agreement.

Role and procedure files implement the same workflow in both formats. Established agents use their loaded instructions without repeating initiation or switching roles. Each APM agent has its own conversation and permitted sources; loading an entry or role file does not change an established role or Worker identity. Explicit User authorization may widen access or establish different coordination, but neither a file read nor a native delegation does so by itself.

Runtime names below identify the shared sources; `STRUCTURE.md` defines their output locations in each format.

## 2. Phases

A session takes an agreed body of work through planning and implementation: defining outcomes, requirements and approach, then delivering, validating and recording results and remaining work. It may cover a whole goal or a coherent part.

The Planner starts first; the Manager begins after planning, and Workers start as assignments require. Handoffs start the same agent’s next numbered conversation within the session; compaction and recovery preserve its number. Implementation groups related Tasks into ordered Stages.

### 2.1 Planning

Planning follows §6. The Planner reads both guides, defines the work with the User, obtains approval of its understanding, Spec and Plan in order, resolves workspace guidance and completes setup. It reports why guidance changed or remained sufficient, then directs the User to a new Manager conversation.

### 2.2 Implementation

Implementation follows §7. The Manager reads the approved context, checks the codebases and obtains approval of a concise understanding before coordination. This combines intended work, Stages and Tasks, agreed involvement and coordination, any clearly identified proposals and the immediate execution approach. A first Manager introduces taking over the session without explaining irrelevant Handoff mechanics. Continuations resume checked state without repeating first-start approval.

Each Stage ends with a brief account of its result, verification, remaining limits and consequential carryover. The Manager waits for explicit agreement before starting the next Stage unless a different arrangement was explicitly agreed. Completing required records and reviews does not require separate approval at every step.

Implementation ends when all Stages complete or the User stops early; closure follows §8.3. Later sessions use prior results checked against current state, with scope and approach agreed anew and proposed sequences remaining tentative.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines intended outcomes, scope, required behavior, design and constraints. Its opening states the session goal and success criteria; subject sections keep settled requirements, decisions, reasons and authoritative sources together. Notes have dedicated subsections for optional session-specific documents and their specifications, unresolved decisions, alternatives, assumptions and any later-session scope. They do not duplicate subject sections or hold live coordination. The Manager maintains the Spec and supplies relevant content to Workers.

### 3.2 Plan

`.apm/plan.md` defines how to achieve the Spec through ordered Stages and actionable Tasks. It primarily references the Spec rather than restating requirements or design. Its Workers and Stages tables and Task fields follow Work Breakdown. Guidance adds Task-specific approach, context and participation; steps give actions; Validation gives checks and expected results. Dependencies identify earlier outputs and whether responsible agents are the same or different, including the Manager. Notes hold the agreed involvement and coordination arrangements, cross-Task constraints, Stage checks and relevant later-session sequencing. They are not another runtime manual. Task-specific dependencies and validation stay in their fields; later-session scope stays in the Spec.

### 3.3 AGENTS.md

`AGENTS.md` holds lasting project orientation, working and read-only repository boundaries and workspace conventions. All roles read it. The Planner proposes needed additions or corrections; the Manager and Workers maintain it under User authorization. Changes extend or replace existing guidance concisely and preserve unrelated content. Orientation states facts; instructions state their scope.

For Claude, existing workspace `CLAUDE.md` files import `AGENTS.md` outside code blocks, preserving preexisting content and avoiding circular references.

### 3.4 Version Control

The Planner checks repository history and workspace instructions, proposes a version-control arrangement suited to the work and User preferences, explains changes to existing conventions and asks whether it meets the User’s needs. The agreement covers Git use, work locations, commit and integration timing, and APM file tracking. Durable conventions belong in `AGENTS.md`, the session arrangement in the Spec, coordination implications in the Plan, and live locations and actions in the Tracker.

The Manager prepares workspaces and handles integration, pushing and cleanup under the agreement. The Planner and Manager recommend Git when arranging parallel work: it provides safer isolation and permits overlapping changes that cannot safely share one directory. With Git, parallel Tasks in the same repository use separate worktrees, including Manager Tasks; APM-managed worktrees stay under `.apm/worktrees/`. Without Git, parallel assignments require independent work and clearly separated writable files, directories and other resources. Shared reading must not depend on inputs being changed by another assignment. Overlapping changes, shared generated outputs and non-isolated test or service state require sequencing. Worker prompts and native briefs explicitly identify the no-Git parallel arrangement, writable scope, shared resources and when to coordinate or pause. Git worktrees do not isolate shared external resources. Required dependency outputs, including uncommitted and untracked files, must actually be usable in the assigned workspace.

Commits follow agreed conventions and timing and may span Tasks. Delegated instructions preserve commit timing and approvals. Logs record commits and uncommitted work. Branches and worktrees may span Tasks or Stages; the Manager removes them only when no longer needed and their work is preserved. Acceptance is independent of their lifecycle. The Tracker locates work in Branch and Worktree, keeps Next Action current, and records shared arrangements, remaining limitations and pending integration or cleanup in Notes, including for Done Tasks.

### 3.5 Planning Changes

The Manager aligns the Spec, Plan, `AGENTS.md` and affected assignments before dependent work proceeds. Revisions preserve agreed User involvement through responsibility, size and review points, considering progress, retained knowledge and coordination demands. Work cancelled, superseded or deferred beyond the session retains its ID, reason and any replacement. The Manager reconciles requirements, tables, dependencies and instructions to withdraw obsolete work. It marks the Task Done only after scope agreement, distinguishing it from delivery in the Tracker and Stage summary. Existing logs remain; unperformed work gets no execution log. Pending decisions belong in the Tracker; consequential decisions and reasons remain in Memory.

Contained corrections to a Task, dependency or Spec point may proceed without approval. Workspace convention changes follow User authorization. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. When new design decisions are needed or repeated follow-ups cannot resolve the issue, the Manager presents options for continuing or stopping to replan; the User decides.

For ongoing work, the Manager coordinates adjustments and any needed pause with whoever performs it. Corrections carry User agreements forward, resolve further approvals and preserve valid progress, Task identity, attempt and workspace. It updates subagents directly, coordinates User-held work with the User, and uses User-delivered bus corrections for active Workers. Reported Worker attempts use review and follow-up Tasks.

### 3.6 Session-Specific Documents

Optional session documents have a distinct purpose outside Spec requirements, Plan work, Tracker coordination and Memory history. The Planner or Manager agrees their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents where suitable. Their specification belongs in a dedicated Spec Notes subsection. Relevant implementation work belongs in Tasks; Workers receive their permitted use and updates in prompts. Logs cite documents used, while the Tracker links only those needed for a present coordination action. Changes follow §3.5.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

Shared communication guidance applies to all roles. Work reports, recaps and useful progress updates connect the agent's current APM activity to the actual work and its progress. They name the work alongside any APM labels, within the agent's role and known context. Progress updates state a meaningful change and when the User is next needed; reports give results, evidence, consequential limits and next action. Role and procedure explanations are plain and relevant to the current action, rather than recitations of workflow mechanics.

Brief updates accompany meaningful progress, changed expectations or consequential findings. Related results are grouped at agreed reviews, needed decisions or actions, and meaningful stopping points. Execution and review continue between them without a report for every operation or Task. Grouping does not delay useful results for unrelated work, remove required reporting or hide urgent issues. Action requests supply current instructions and decision context without requiring earlier replies or files. Waits identify pending work, who acts and what permits resumption. Estimates need evidence; elapsed time establishes neither approval nor completion. Communication with agents and the system uses a formal, technical style with the same clarity and concision as User chat.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one temporary message. Agents read before writing, verify outgoing content and clear processed messages before sending replies. A populated Task Bus does not establish whether execution has started; repeated delivery instructions are conditional when delivery is unconfirmed.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | Start a Worker conversation with its agent ID, or ask an existing Worker to check its tasks |
| Task Report | Worker → Manager | Ask the Manager to check the named agents’ reports or all pending reports |
| Handoff Prompt | Outgoing → incoming conversation | Start a new conversation of the same role, supplying the Worker ID when applicable |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

Each document has one authoritative purpose. The Tracker holds current coordination, not an accumulating history. Its Tasks table holds states, next actions and work locations, linking the latest reported Worker attempt or concluding Manager log. Its Agents table includes the Manager and separate Workers, with conversation numbers and unresolved continuation or recovery gaps; it is not a register of temporary subagents. Notes qualify only when they affect the next coordination action or reliable continuation: current blockers, pending decisions or arrangements not already owned elsewhere.

Update material changes in assignments, states, blockers, decisions, locations and next actions, consolidating related changes before dependent work, waits or Handoffs. Preserve consequential decisions before context is lost. Updating includes replacing superseded accounts and removing resolved notes and context gaps, not appending another dated account. Preserve consequential history in its owning log or summary before removing its only record. A brief reference remains only where a present coordination need remains.

Memory preserves outcomes, consequential evidence, decisions and continuation context. Index Notes admit brief findings or limits later work needs, their implications and stable source links; they do not duplicate logs, session summaries, requirements, conventions or live PR status. Retained observations preserve their conditions and evidence rather than becoming universal instructions. Stage distillation uses both Tracker and Task Logs: Stage decisions go to the summary, lasting implications to Index Notes, and current coordination remains in the Tracker. It does not transfer accumulated Tracker prose wholesale into Memory.

The responsible agent logs Success, Partial or Failed; the Manager decides whether the Task becomes Done. Tasks stay Active during investigation, follow-up or pending decisions. Done is final: later fixes need new Tasks referring to the original work.

A Stage completes when its Tasks are Done and its required integration and verification are complete. Accepted Partial outcomes and unrun checks remain qualified in summaries.

Agents flag Important Findings that affect acceptance or may matter to later work, separating evidence from uncertainty. Partial and Failed outcomes always have Important Findings. The Manager resolves their effects on planning and records the decision. Summaries preserve consequential findings, decisions, evidence and limitations with source links.

Manager and Worker conversation numbers change at Handoff, not recovery. Context notes identify missing prior work or reconstruction gaps and are cleared when restored. They guide context restoration without changing dependency labels.

## 6. Planning

**Runtime:** `apm-1-initiate-planner`, `context-gathering.md` and `work-breakdown.md`.

### 6.1 Context Gathering

The Planner surveys repositories, instructions and existing materials within its scope, using supplied context even when the workspace is empty. It verifies consequential claims against current sources, behavior and changes, distinguishing evidence from descriptions or assumptions; the User's instructions and current evidence establish which sources govern the session. Unclear or conflicting source authority requires clarification. It researches relevant codebases and archives and covers three discovery topics:

1. Vision and existing materials.
2. Requirements and constraints.
3. Implementation approach, quality and coordination.

This order is recommended, not mandatory. Every topic requires a User exchange; sufficient supplied context calls for confirmation and an invitation to add or correct information, not omission of the exchange. Topics can be revisited. Research, exploration, analysis, design, processing and substantial preparation continue between exchanges as needed. Their depth follows scope, complexity and uncertainty. Preparation precedes dependent questions; unclear intent is established before recommending a solution. Questions resolve substantive gaps, while recommendations explain consequential evidence, trade-offs or uncertainty. The User decides consequential design choices and agents handle details within them.

The Planner develops tentative Stages, Tasks and assignments during questioning, revising them as it learns. Manager execution through subagent workers supports automation and higher-level collaboration; separate Workers support close implementation collaboration. The Planner asks whether the User wants to perform any portion, with the responsible agent’s assistance.

The User chooses the form and frequency of involvement. The Planner recommends options suited to risk, uncertainty, experience and preferences, explaining how they support understanding and authority: automated Manager execution, User-mediated coordination with Workers, User-led work with assistance, or a combination. Participation may include collaboration, reviews, tests, demonstrations, explanations or progress reports. The Plan records required validation, User or outside review points, timing constraints and agreed update frequency. Task and Stage boundaries, sizes, batches and parallelism support these agreements. Routine update timing and grouping remain execution choices; the Manager proposes adjustments as findings or feedback warrant.

The Planner establishes and refines a coherent session outcome through discovery. It completes preparation needed to define implementation before requesting understanding approval, rather than deferring unfinished requirements, design or planning into implementation Tasks. When later planning depends on future events or implementation results, it preferably recommends a later session from that evidence. Bounded implementation investigation may resolve technical details within defined work, with questions, evidence and completion criteria, rather than substitute for initial planning.

Scope and sequencing account for timing and prerequisites outside agents' control. The Plan identifies independent work, resume conditions and agreed handling when runnable work ends: pause, defer or revise scope. Waiting does not satisfy a prerequisite. The complete understanding distinguishes Spec outcomes and design from Plan work and coordination, including uncertainty and its consequences; User approval starts document writing.

### 6.2 Work Breakdown

Document approvals follow §2.1; corrections carry into earlier documents. Task responsibility, size and review points reflect agreed involvement, and User-performed work keeps its responsible agent.

Assignments balance expertise, shared context and User involvement, keeping related work together where familiarity helps. Stages group coherent outcomes around dependencies and meaningful review. Tasks have clear outputs and checks, with boundaries shaped by size, complexity, uncertainty, dependencies and expertise. Research, implementation and validation may share or span Tasks. Parallelism follows dependencies and constraints. Steps give Task-specific actions and refer to shared procedures for common details.

Before approval, the Spec must define the agreed outcomes and behavior, and each Plan Task must describe work its assigned agent can undertake and validate. Bounded technical investigation within defined implementation identifies its questions, evidence, completion checks and dependent work. It does not postpone requirements, design or preparation needed to define that work; later planning dependent on implementation results follows §6.1. Participation and review points identify the work and decisions they concern. Validation names observable checks and expected results, including required User actions. Routine subagent and independent review arrangements remain execution choices within agreed requirements. Updates to `AGENTS.md` preserve preexisting content except for authorized changes; existing workspace `CLAUDE.md` files import `AGENTS.md`.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager selects Ready work and grouping from dependencies, current state, Plan arrangements and User instructions. It respects ordered Stages and required pauses while choosing execution and reporting within them. Manager Tasks may be divided into coherent native contributions, including individual Tasks, related batches or work spanning Tasks; results return directly without a Message Bus or whole-batch reporting barrier. Contributions retain Task-level outputs and validation. Grouping follows shared context, expertise, isolation and useful parallelism. Related agents can be reused; new agents receive sufficient context.

Separate Worker assignments use Task Prompts and the Message Bus. A single dispatch sends one Task. A batch sends 2–3 independent Ready Tasks or a Same-Worker chain whose other dependencies are complete. Dispatch chains one Task at a time when another Worker needs intermediate results. Parallel assignments meet §3.4 regardless of whether they use separate Workers or native subagents.

Each Worker takes one dispatch at a time. The Manager reviews incoming reports and dispatches newly Ready work without waiting for unrelated reports. It waits only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Every dependency names outputs, paths and how to use them. Cross-Worker dependencies name the producer’s accepted Task Log for the Worker to read and supply reading and integration steps; Same-Worker dependencies do too when context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Dependency tracing stops where an intermediate output captures the needed contracts.

Prompts supply the workspace and commit instructions established under §3.4, including the session root for `.apm/` paths. Each needed contract appears once. Follow-ups retain Task identity but receive a new numbered log path from the Manager, per Task. They focus on remaining work and use the Worker's established context, restoring detail where it is missing. Active corrections preserve the current attempt's log path, valid progress and workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-2-initiate-manager`, `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Manager reads the implementation guides and starts its Tasks from the Spec, Plan and dependency evidence. Substantial implementation normally uses subagent workers; contained investigation, small corrections and final checks may be direct, and the User may request direct implementation. Workers execute directly and selectively delegate useful parts. All roles may delegate within scope where benefit outweighs context and coordination cost, including planning research and preparation, debugging and independent checks. Shared delegation guidance defines briefing, grouping, isolation and verification; execution procedures add their particular requirements.

Manager Tasks remain Active through implementation, corrections, review and pending decisions. The Manager verifies contributions and the combined result and writes one concluding Task Log with `agent: manager` and its conversation number. It does not issue itself follow-up Tasks, use Worker attempts or send itself bus reports. Completion requires validated requirements or explicit agreement to remaining limits. Planning changes and integration follow Task Review.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. Role instructions own Task and Report receipt; delivery commands route there. An established Worker retains its identity when checking Tasks. The Manager reads the requested reports, or all pending reports when none are specified, and returns to coordination if none are waiting. The Worker uses its Task Prompt, workspace instructions and knowledge of its area built through earlier assignments and its conversation. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. Session coordination details stay in APM files unless they are part of the work itself. Missing dependencies, unresolved instruction conflicts, repeated attempts without progress and work that substantially exceeds the assignment need guidance. Within an Active Task, missing outputs or failed integration checks pause dependent work; unaffected work may continue within required sequencing. User actions pause only affected work; required approvals and checks remain in force. Workers report relevant findings and possible wider effects from their available context. When that context leaves an issue unclear, they ask the User and recommend local resolution or Manager involvement if broader context or coordination is likely needed, pausing only affected work.

The User may take on or return any portion. The responsible agent briefs and supports them, stops overlapping work, checks returned work and retains validation and logging responsibility. Limited help does not transfer the rest of the work. The arrangement and resume point stay in the Tracker or Worker prompt, with consequential contributions in the log. Assignment, state and attempt are preserved.

Success requires the objective and every validation criterion to pass, including required documentation and affected behavior. Agents resolve known issues and validation gaps within scope and permission before final logs or reports; implementation subagent briefs carry the same validation and guidance requirements. A deliberate deviation or unrun check is not a pass. Agents use evidence for the actual deliverable and request remaining checks. They rerun checks when changes, incomplete evidence or uncertainty warrant it, confirm recurring failures match their established causes and distinguish local, CI and integrated results. User-facing test procedures are checked as written and isolate disposable test state from User data. If required validation or resources are unavailable, unaffected work and available checks continue. If the limits remain at completion, the outcome is Partial. In a Worker batch, each Task is validated and logged before the next; Partial or Failed stops the batch, with remaining Tasks reported as Not started.

Workers apply User corrections immediately and resolve their retention in `AGENTS.md` at completion under existing authorization or a User decision. Other findings may justify guidance updates. Tracked changes use the assigned branch or worktree and agreed commit timing; Important Findings retain changes and paths.

The Worker completes agreed User review and resulting changes, follows agreed commit conventions, writes the Task Log, clears its Task Bus and writes a Task Report pointing to that attempt’s log. Follow-up logs leave earlier attempts unchanged, link to the original and previous follow-up, and record new work, validation and the resolution of earlier findings. Outcomes still assess the whole Task, including unresolved earlier criteria. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager checks results and validation against requirements, including each batch Task. It inspects outputs or runs focused checks where evidence is incomplete or uncertain, and revisits requirements questioned by findings. It investigates Important Findings, unmet criteria and contradictory Success claims before acceptance. Direct corrections follow the role policy in §7.2, with work and validation recorded separately from Worker outcomes. It compares follow-ups with earlier attempts and reassesses stalled or expanded work; further dispatch requires concrete work and a supported approach. Wrong requirements and exceptions follow §3.5. Acceptance requires validated work or User-approved remaining limits, preserving evidence and qualifications.

Independent review is the default for substantial implementation or consequential uncertainty, not a separate reviewer for every contribution. The Manager chooses proportionate coverage using importance, complexity, existing evidence and remaining uncertainty, preserving required reviews. Normally one reviewer covers a coherent group of related Tasks or integrated results; distinct consequential questions or expertise may warrant more. Small, well-understood changes with adequate evidence usually need no independent reviewer. Complete required review before dependent work relies on the result. Reviewers remain separate from implementers and receive requirements, changes, evidence, accepted exceptions and scope. They assess completeness and validation against requirements. The Manager verifies findings and resolves confirmed gaps.

For corrections and Worker follow-ups, the Manager chooses direct verification or subagent review by their size, complexity and remaining uncertainty. It reuses the previous reviewer when useful and repeats broad review only where changed work or unresolved risk warrants it. Existing evidence remains valid where it applies. Any recommendation to accept remaining limits explains their effects and why acceptance is preferable to further work or replanning. An agreement made with a Worker is retained within its explicit scope; the Manager asks only about new consequences or an unclear decision.

Broader design or scope questions need viable options and approval per §3.5. Review leads to acceptance, follow-up or planning change. Pending Tasks stay Active. The Manager consolidates Tracker updates per §5, preserving decisions and recovery state, and resolves investigation and alignment before dependent work; unrelated Ready work continues. Integration and cleanup remain independent of acceptance (§3.4).

Stage verification preserves required User and Plan checks and addresses combined behavior, integration or uncertainty not established by Task validation and review. A follow-up or Important Finding alone does not require another full review. The Manager records checks performed or skipped and why, separates reference inputs from generated results, preserves evidence through cleanup and resolves findings. Fixes to Done work need new Tasks. After distilling the Stage summary and Index, the Manager reports the Stage result and consequential carryover and pauses before the next Stage per §2.2.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

At the User's request, the outgoing agent checks files and Git where used, pauses its running subagents and collects progress, outputs and pending checks. It writes a Handoff Log and Prompt preserving User-held work, required assistance, reviews, accepted limits and resume conditions. The Prompt identifies the next conversation, checked current state, pending decisions, validation gaps, sources and next action. Handoff records name any compaction or recovery, the sources used to rebuild context and affected uncertainty or unverified claims; reconstruction does not automatically invalidate all recorded facts. Workers claim only integration state supported by their workspace evidence.

The outgoing agent gives a small chat recap of what passes on and how the User starts the next conversation. File links are optional; there is no mandatory file inspection or approval. By default it then waits and the User completes delivery. An alternative mechanism requires an explicit coordination agreement.

The incoming Manager reads coordination records and needed Task Logs; the Worker reads its Handoff Log, latest relevant own logs from the current Stage and dependency logs needed to resume, following earlier-attempt links as needed. Both check records against current state, preserve User-held work, ask about gaps and clear the Handoff Bus. The Worker resumes with the current prompt’s log path or awaits delivery.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery routes to the role's recovery responsibilities. It reloads the role's instructions and required sources and checks permitted files, messages and deliverables without repeating initiation or changing identity or conversation number. The Manager uses session coordination and Memory; Workers use their current prompt, latest relevant own logs and Handoff Logs, following earlier attempts as needed. The recovering agent preserves the current attempt, User-held work, decisions, accepted limits and validation gaps, asks about unresolved gaps and records its reconstruction sources.

### 8.3 Summary and Archive

**Runtime:** `apm-8-summarize-session`.

A new conversation may summarize without adopting a role; the Manager may summarize at completion or early stopping. Normal completion reports results. Early closure pauses Tasks and subagents, asks the User to pause other active work, and records checked unfinished state without changing Task states. Summary and archive preparation uses current stop confirmation or collects missing state from the User. The optional summary checks outcomes, findings, decisions, limits and attribution against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

Archiving is optional and needs User approval. It preserves session records and remaining APM-managed worktrees with their uncommitted contents, verifies preservation, then clears active APM files and installed instructions. Worktrees remain attached to source repositories; ordinary project-directory changes remain in place. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

The archive index links to summaries. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
