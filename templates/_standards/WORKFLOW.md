# APM Workflow

This specification defines APM behavior for template authors and maintainers. Change it before changing workflow behavior, then implement the change in runtime skills and guides. Procedures and artifact formats live in their owning runtime files. Terms follow `TERMINOLOGY.md`; authoring follows `WRITING.md` and `STRUCTURE.md`.

## 1. Roles and Scope

APM preserves agreed intent, structured work and reliable history beyond individual conversations. Its central idea is productive friction: useful involvement that helps the User understand and direct the work. The User chooses implementation involvement suited to the work; agents recommend useful participation while avoiding unnecessary work, coordination and interruptions.

Work structure and interaction are distinct. The Spec, ordered Stages, Tasks, dependencies, validation and records remain intact under any execution arrangement. Their required procedures establish the minimum workflow; execution, reporting and collaboration can vary around them. A required internal step does not automatically require a User interaction. By default the User starts conversations, delivers messages and completes Handoffs; other coordination arrangements require explicit agreement.

| Role | Responsibility | Working context |
|---|---|---|
| Planner | Defines and plans the work with the User. | Workspace research and planning conversation. |
| Manager | Assigns Tasks to Workers or undertakes them, reviews results and maintains the APM files. | Spec, Plan, `AGENTS.md`, Tracker and Memory. |
| Worker | Executes, validates and reports assigned Tasks. | Task Prompts, `AGENTS.md` and its own conversation. |

Workers do not read the Spec, Plan, Tracker or Index unless the User widens their scope. The Manager supplies relevant requirements, involvement arrangements and dependency context in self-contained Task Prompts. Native subagents remain within their parent's scope and are distinct from APM Workers and bus delivery. Task Assignment's native-assignment subsection supplies shared delegation guidance to the roles that need it; role files state delegation policy and the relevant procedure supplies its particular context.

Agents follow the prescribed workflow, applicable workspace instructions and permissions unless the User explicitly agrees to a specific change. Requirements, defaults and permitted execution choices remain distinguishable. Choices within agreed authority do not need new approval. Approval requests identify the exact decision and consequential effects in plain language. Agreement covers only what was clearly presented and explicitly accepted; silence, continued discussion and approval of related work do not establish wider agreement. Existing authorization applies within its actual scope, while destructive or irreversible actions require confirmation of their consequences. Required approvals and agreed review points remain in force.

Agents keep current instructions and records aligned with checked progress and the latest agreed decisions. They revise affected content within their scope at consequential changes and pauses, before dependent work or Handoff, combining related updates and passing changes outside their scope through the agreed coordination mechanism.

### 1.1 Entry Formats

APM provides numbered skills and a single-skill research preview, both using the same workflow sources. Numbered command skills require User invocation. The single-skill entry may be loaded for a requested APM action or to assess whether to suggest APM for substantial work. It briefly explains the framework; starting a session requires the User's request or agreement.

Role and procedure files implement the same workflow in both formats. Established agents use their loaded instructions without repeating initiation or switching roles. Each APM agent has its own conversation and permitted sources; loading an entry or role file does not change an established role or Worker identity. Explicit User authorization may widen access or establish different coordination, but neither a file read nor a native delegation does so by itself.

Runtime names below identify the shared sources; `STRUCTURE.md` defines their output locations in each format.

## 2. Phases

A session takes an agreed body of work through planning and implementation: defining outcomes, requirements and approach, then delivering, validating and recording results and remaining work. It may cover a whole goal or a coherent part.

The Planner starts first; the Manager begins after planning, and Workers start as assignments require. Handoffs start the same agent’s next numbered conversation within the session; compaction and recovery preserve its number. Implementation groups related Tasks into ordered Stages.

### 2.1 Planning

Planning follows §6. The Planner reads both guides and defines the work with the User. It obtains approval of its understanding, Spec and Plan in order, resolves workspace guidance and sets up the Message Bus. It reports why guidance changed or remained sufficient, then explains how to start a new Manager conversation in the receiving assistant's APM format.

### 2.2 Implementation

Implementation follows §7. The first Manager introduces taking over the session, reads the approved context and checks the codebases. It presents its understanding of the outcomes and constraints, Stages and assignments, agreed involvement and coordination, and how it will start. If the session uses version control, it explains the setup for the first work and the conventions it will follow throughout (§3.4). It identifies any new proposals and obtains approval before starting. Continuations verify current state and resume without repeating first-start approval. Handoff mechanics are explained where relevant.

Each Stage ends with a brief account of its result, verification, remaining limits and consequential carryover. The Manager waits for explicit agreement before starting the next Stage unless a different arrangement was explicitly agreed. Completing required records and reviews does not require separate approval at every step.

Implementation ends when all Stages complete or the User stops early; closure follows §8.3. Later sessions use prior results checked against current state, with scope and approach agreed anew and proposed sequences remaining tentative.

## 3. Planning Documents

### 3.1 Spec

`.apm/spec.md` defines intended outcomes, scope, required behavior, design, constraints and acceptance criteria. Its opening states the session goal and success criteria; subject sections keep settled requirements, decisions, reasons and authoritative sources together. The Planner chooses a form the User can review and the Manager can consult during implementation. The Planner lists each note separately and frames it as an observation, not an instruction. Notes cover shared assumptions, reasons, open choices or later-session scope that apply across design subjects. They explain why a relevant alternative still matters, when it applies and whether the choice is open or settled. They reference a procedure only when it explains a design decision or constraint. Notes do not duplicate subject sections or hold live coordination. The Manager maintains the Spec and supplies relevant content to Workers.

### 3.2 Plan

`.apm/plan.md` defines how to deliver and verify the work through ordered Stages and actionable Tasks. It primarily references the Spec rather than restating requirements or design. Its Agents and Stages tables and Task fields follow Work Breakdown. Guidance adds Task-specific approach, context and participation; steps give actions; Validation gives checks and expected results. Dependencies identify earlier outputs and whether responsible agents are the same or different, including the Manager. The Planner writes Notes as observations and recommendations, not instructions to the Manager, with one list item per note. Notes state cross-Task agreements about involvement, coordination, shared constraints and Stage checks as facts. They also record relevant later-session sequencing. They identify which Tasks could run in parallel or be batched and what makes that possible. They describe when a blocker could affect the work and when a recommended option would help. They refer to a procedure only when it explains a session agreement. The Manager decides dispatch within the agreed Plan. Task instructions, dependencies and validation stay in their fields; later-session scope stays in the Spec.

### 3.3 AGENTS.md

`AGENTS.md` holds lasting project orientation, working and read-only repository boundaries and workspace conventions. All roles read it when present. The Planner proposes needed changes to existing guidance or asks the User whether to create a missing file with the proposed contents. The Manager and Workers maintain it under User authorization. Changes extend or replace existing guidance concisely and preserve unrelated content. Orientation states facts; instructions state their scope.

For Claude, when both workspace files exist, `CLAUDE.md` imports `AGENTS.md` outside code blocks, preserving preexisting content and avoiding circular references.

### 3.4 Version Control

The Planner checks repository history and workspace instructions. When discussing how the work will proceed, it agrees with the User on whether and how to use version control. If using it, the Planner proposes applicable branch naming and commit message conventions with examples and explains departures from repository practice. The agreement covers constraints on work locations, commit and integration timing, and APM file tracking. Durable conventions belong in `AGENTS.md`, the session agreement in the Spec, coordination implications in the Plan, and live locations and actions in the Tracker.

When the session uses version control, the Manager explains the proposed setup in its first understanding (§2.2) and applies it after approval, including agreed APM file tracking. The Manager prepares workspaces and handles integration, pushing and cleanup.

- Parallel Tasks in one repository, including Manager Tasks, use separate working copies when the agreed tools support them, such as Git worktrees. Isolation checks cover interference through shared repository state and external resources.
- Tasks running in parallel in a shared working directory must be independent and have disjoint writable paths. Shared reads use stable inputs. Worker prompts and native briefs name the shared directory, writable boundaries, shared resources and when to coordinate or pause.

Overlapping changes, shared generated outputs and test or service operations run in sequence unless isolated. Required dependency outputs, including uncommitted and untracked files, must actually be usable in the assigned workspace.

The CLI relocates linked Git worktrees under `.apm/worktrees/` during archival. Other working copies stay outside `.apm/`, with a record of how their work will be preserved.

Commits follow agreed conventions and timing and may span Tasks. Delegated instructions preserve commit timing and approvals. Logs record commits and uncommitted work. Branches and working copies may span Tasks or Stages. The Manager removes them only when their work is preserved and they are no longer needed. Acceptance is independent of their lifecycle. The Tracker locates work in Branch and Worktree, keeps Next Action current, and records shared arrangements, remaining limitations and pending integration or cleanup in Notes, including for Done Tasks.

### 3.5 Planning Changes

The Manager aligns the planning documents, `AGENTS.md` and affected assignments before affected work proceeds. When the User agrees to change ongoing involvement or another arrangement that belongs in the Plan, the Manager records the current agreement there and replaces any previous wording in place. Revisions reflect agreed User involvement through responsibility, size and review points, considering progress, retained knowledge and coordination demands.

Work cancelled, superseded or deferred beyond the session retains its ID, reason and any replacement. The Manager reconciles requirements, tables, dependencies and instructions to withdraw obsolete work. It marks the Task Done only after scope agreement, distinguishing it from delivery in the Tracker and Stage summary. Existing logs remain; unperformed work gets no execution log. Pending decisions belong in the Tracker; consequential decisions and reasons remain in Memory.

Contained corrections to a Task, dependency or Spec point may proceed without approval. Workspace convention changes follow User authorization. Changes to several Tasks, design direction, scope, Stages or overall structure need the User. Several small changes together can also need approval. When new design decisions are needed or repeated follow-ups cannot resolve the issue, the Manager presents options for continuing or stopping to replan; the User decides.

For ongoing work, the Manager coordinates adjustments and any needed pause with whoever performs it. Corrections carry User agreements forward, resolve further approvals and preserve valid progress, Task identity, attempt and workspace. It updates subagents directly, coordinates User-held work with the User, and uses User-delivered bus corrections for active Workers. Reported Worker attempts use review and follow-up Tasks.

### 3.6 Session-Specific Documents

Optional session documents have a distinct purpose outside Spec requirements, Plan work, Tracker coordination and Memory history. The Planner or Manager agrees their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents where suitable. The Spec places the optional Supporting Documents section immediately after Notes, with one subsection per document. Relevant implementation work belongs in Tasks; Workers receive their permitted use and updates in prompts. Logs cite documents used, while the Tracker links only those needed for a present coordination action. Changes follow §3.5.

## 4. Communication

**Runtime:** `apm-communication` and `bus-integration.md`.

All roles keep the User oriented in the work and what happens next. Role instructions explain what to include in updates, reports, instructions and summaries:

- The Planner relates discovery, decisions and documents to the session goal. It uses the first person only for its own planning work. This limit applies to proposals about how implementation could proceed. For implementation, it names the proposed or agreed responsible agent or User, or says the assignment is open.
- The Manager relates Stages and Tasks to outcomes, reviews and upcoming involvement.
- Workers describe their assigned Tasks or batches and known effects.

Agents explain roles, procedures and conversations in relation to the work. They use exact agent IDs and conversation numbers for delivery, disambiguation and records.

Brief updates cover meaningful progress, changed expectations or consequential findings, and say when the User is next needed. Reports give results, evidence, consequential limits and next actions. Agents group related results at agreed reviews, needed decisions or actions, and meaningful stopping points. Work and review continue between reports. Agents share urgent issues promptly, avoid holding useful results for unrelated work and keep required reporting.

Action requests explain what's ready and what remains, the proposed decision or action, its consequences and the steps the User needs. Agents show relevant wording when asking for approval and link to supporting detail. Waits name what's pending, who acts and what permits resumption. Estimates need evidence. Elapsed time establishes neither approval nor completion. Agents write clearly and concisely, using a formal, technical style with other agents and the system.

The Planner creates `.apm/bus/<worker>/` with `task.md`, `report.md` and `handoff.md` for each Worker, and `.apm/bus/manager/` with `handoff.md`. Each file is empty or holds one temporary message. Agents read before writing, verify outgoing content and clear processed messages before sending replies. A Task Prompt still present in `task.md` does not establish whether execution has started; repeated delivery instructions are conditional when delivery is unconfirmed.

| Message | Sender → receiver | User delivery |
|---|---|---|
| Task Prompt | Manager → Worker | The User starts a Worker conversation with its agent ID or asks an existing Worker to check its tasks. |
| Task Report | Worker → Manager | The User asks the Manager to check the named agents’ reports or all pending reports. |
| Handoff Prompt | Outgoing → incoming conversation | The User starts a new conversation for the same role and supplies the Worker ID when applicable. |

Workers are identified by their bus-folder slugs. Skills resolve supplied IDs to those folders. An outside agent can contribute through the bus without becoming a Worker, writing Task Logs or joining Handoffs; its report carries its evidence to the Manager.

## 5. State and Memory

The Tracker and Memory, including the Index, Stage summaries and logs, are the coordination documents. The planning documents and Tracker reflect the latest agreements and verified state. Agents update affected content in place and align related Task instructions before affected work starts or resumes, and before a wait or Handoff. Memory preserves the session's results, decisions, evidence and context for later work.

A note about a consequential document update briefly records what the document said before, what it says now, why it changed and what the change means for the work. The note links to the updated section.

Each document has one authoritative purpose. The Tracker holds current coordination.

- Tasks lists states, next actions and work locations. It links each Task to the latest reported Worker attempt or concluding Manager log.
- Agents lists the Manager and separate Workers, their conversation numbers and unresolved continuation or recovery gaps.
- Notes explains current blockers, pending decisions, cross-Task arrangements and resume conditions. It also holds tentative observations about User preferences and coordination proposals while they affect current work. Each note gives its conditions, present consequences and sources. Earlier events stay only while they explain current coordination, with dates, Task IDs or sources to distinguish them as needed.

The Manager consolidates related Tracker updates when assignments, states, blockers, decisions, locations or next actions change. It revises affected Task rows and Notes together, replaces superseded accounts and removes resolved notes and context gaps during ordinary updates. Consequential history stays in its owning log or Stage summary before its only account is removed, with a brief reference retained where coordination still needs it. Consequential decisions are preserved before context is lost.

Index Notes hold brief findings, limits, established User preferences and agreed changes that later work needs. They give scope and implications with source links and preserve the conditions and evidence of observations. The Manager revises the notes when their implications for later work change. Current agreements stay in their owning documents. Live status stays in the Tracker. At Stage completion, the Manager uses the Tracker and Task Logs to record Stage decisions in the summary and lasting implications in Index Notes. The Index's Stage outcome table summarizes results and material limits.

A session summary gives a short, dated account of the whole session and points future Planners to relevant files when they consult the archive. For a small session, the archived records may be easy to follow on their own.

The responsible agent logs Success, Partial or Failed; the Manager decides whether the Task becomes Done. Tasks stay Active during investigation, follow-up or pending decisions. Done is final: later fixes need new Tasks referring to the original work.

A Stage completes when its Tasks are Done and its required integration and verification are complete. The Manager keeps its summary current until the next Stage starts or the session closes, revising affected results and checks in place and preserving earlier decisions. The Manager records changes made in a later Stage in that Stage's summary and links to the earlier work. Accepted Partial outcomes and unrun checks remain qualified in summaries.

Agents flag Important Findings that affect acceptance or may matter to later work, separating evidence from uncertainty. Partial and Failed outcomes always have Important Findings. The Manager resolves their effects on planning and records the decision. Summaries preserve consequential findings, decisions, evidence and limitations with source links.

Manager and Worker conversation numbers change at Handoff, not recovery. Context notes identify missing prior work or reconstruction gaps and are cleared when restored. They guide context restoration without changing dependency labels.

## 6. Planning

**Runtime:** `apm-1-initiate-planner`, `context-gathering.md` and `work-breakdown.md`.

### 6.1 Context Gathering

The Planner surveys repositories, instructions and existing materials within its scope, using supplied context even when the workspace is empty. It verifies consequential claims against current sources, behavior and changes, distinguishing evidence from descriptions or assumptions; the User's instructions and current evidence establish which sources govern the session. Unclear or conflicting source authority requires clarification. After the survey, the Planner orients the User to the session and starts discovery from relevant findings. It researches relevant codebases and archives and covers three discovery topics:

1. Vision and existing materials.
2. Requirements and constraints.
3. Implementation approach, quality and coordination.

This order is recommended, not mandatory. Each topic requires at least one User exchange and can continue or recur as needed. The Planner makes clear what it is trying to settle with the User. When moving to another topic, it briefly connects what is settled or still open to what it needs to learn next and why. It invites corrections or additions as it settles each topic. Research, exploration, analysis, design, processing and substantial preparation continue between exchanges as needed. Their depth follows scope, complexity and uncertainty. The User's expertise and desired involvement guide how the Planner presents its findings. Preparation precedes dependent questions; unclear intent is established before recommending a solution. Questions address substantive gaps and group decisions the User can make together. The Planner returns to unanswered choices that affect acceptance before planning dependent work, or agrees with the User who will decide them and when. Recommendations explain consequential evidence, trade-offs or uncertainty. The User decides consequential design choices and agents handle details within them.

When proposing to continue earlier work or reuse earlier planning documents or arrangements, the Planner explains what fits this session, what needs to change and why. It explicitly asks the User what to retain or change during discovery, building on answers already given.

When the Planner has enough technical context to discuss how the work will proceed, it briefly tells the User what is settled and which delivery decision needs their input next. It agrees on version control and discusses User involvement. Manager execution through subagent workers supports automation and higher-level collaboration; separate Workers support close implementation collaboration. The Planner asks whether the User wants to perform any portion, with the responsible agent’s assistance.

The User chooses the form and frequency of involvement. The Planner recommends options suited to risk, uncertainty, experience and preferences, explaining how they support understanding and authority: automated Manager execution, User-mediated coordination with Workers, User-led work with assistance, or a combination. Participation may include collaboration, reviews, tests, demonstrations, explanations or progress reports. The Plan records required validation, User or outside review points, timing constraints and agreed update frequency. Routine update timing and grouping remain execution choices; the Manager proposes adjustments as findings or feedback warrant.

The Planner explains what can run together, what needs to happen in order, and when it helps for one agent to carry related work through. Dependencies, shared context and safe isolation shape those choices. The Planner agrees with the User on what must wait for their input and what can continue. It clarifies timing when a review or approval could hold up independent work. It confirms the User's involvement before presenting its understanding. It develops Stages, Tasks and assignments during Work Breakdown.

The Planner establishes and refines a coherent session outcome through discovery. It completes preparation needed to define implementation before requesting understanding approval, rather than deferring unfinished requirements, design or planning into implementation Tasks. When later planning depends on future events or implementation results, it preferably recommends a later session from that evidence. Bounded implementation investigation may resolve technical details within defined work, with questions, evidence and completion criteria, rather than substitute for initial planning.

Scope and sequencing account for timing and prerequisites outside agents' control. The Plan identifies independent work, resume conditions and agreed handling when runnable work ends: pause, defer or revise scope. Waiting does not satisfy a prerequisite.

The Understanding Summary brings the discovery agreements together for approval in a structure the User can easily review. The first part covers the goal, scope, requirements, design and acceptance criteria for the Spec. The second covers who does what, what can run together, what must wait and why, and how the work will be checked. It includes how the User will take part. This agreement guides the Plan. The summary identifies remaining uncertainty and its consequences. If the User adds or changes anything in the summary, even while approving it, the Planner presents the full revised summary and asks for approval again. User approval of the current summary starts document writing.

### 6.2 Work Breakdown

Before drafting, the Planner identifies which parts of the approved understanding belong in the Spec and which belong in the Plan per §§3.1–3.2.

Document approvals follow §2.1. The Planner checks each saved document against its required format and the approved understanding. For approval, it links the file and briefly summarizes its contents and the reasons for consequential choices. At Spec review, it names the delivery agreements from the approved understanding reserved for the Plan. It checks that the relevant Tasks or Notes carry those agreements forward. At Plan review, it explains how the work and checks cover the approved Spec outcomes. Corrections carry into affected documents and revisions follow the same review.

The Planner reuses earlier material where it fits and is verified against current sources. Task responsibility, size and review points reflect agreed involvement, and User-performed work keeps its responsible agent.

Both documents state requirements, constraints and agreements as facts and frame advice as observations or recommendations. Only assigned Task instructions direct an agent or the User to act. The Planner assumes the Manager knows the APM workflow. It records session-specific decisions, constraints and changes and links relevant procedures or documents when needed, without restating standard procedures or document purposes. Both documents use language the User can review. They record the technical choices and constraints the User specifies, and describe approaches at the depth the User wants to review. Where the User leaves choices open, the documents state required results, constraints and checks. They preserve consequential decisions and findings with brief reasons and sources where useful. The Manager uses the documents, their sources and the current workspace to establish the technical context needed for implementation. The implementing agents decide details left open within the agreed boundaries.

Assignments balance expertise, shared context and User involvement, keeping related work together where familiarity helps. Each Task has a result its assigned agent can deliver and check. The Planner prefers to keep continuous work together when it uses the same context. The Planner splits work when size, complexity, uncertainty, different expertise or independently verifiable parallel results justify the coordination. Routine reviews, approvals and delivery actions stay with the work they concern unless they involve substantial work with its own result. Steps give Task-specific actions and refer to shared procedures for common details.

Stages group Tasks around a result the User can assess. The Planner prefers fewer Stages for small sessions. A boundary is useful when the result guides what happens next or the User wants to assess it before further work starts. The Planner weighs that benefit against the work that would have to wait. Within a Stage, one Task depends on another when it needs its result. Stage advancement follows §2.2.

Before approval, the Spec must define the agreed outcomes and behavior, and each Plan Task must describe work its assigned agent can undertake and validate. Bounded technical investigation within defined implementation identifies its questions, evidence, completion checks and dependent work. It does not postpone requirements, design or preparation needed to define that work; later planning dependent on implementation results follows §6.1. Participation and review points identify the work and decisions they concern. Validation names observable checks and expected results, including required User actions. Routine subagent and independent review arrangements remain execution choices within agreed requirements. Workspace guidance follows §3.3.

## 7. Implementation

### 7.1 Assignment

**Runtime:** `task-assignment.md` and `apm-4-check-tasks`.

The Manager selects Ready work and grouping from dependencies, current state, Plan arrangements and User instructions. It checks dependencies against the results each Task needs and verifies external prerequisites. It resolves dependency mismatches in the Plan and Tracker before affected work starts (§3.5). It respects ordered Stages and required pauses while choosing execution and reporting within them. Manager Tasks may be divided into coherent native contributions, including individual Tasks, related batches or work spanning Tasks; results return directly without a Message Bus or whole-batch reporting barrier. Contributions retain Task-level outputs and validation. Grouping follows shared context, expertise, isolation and useful parallelism. Related agents can be reused; new agents receive sufficient context.

Separate Worker assignments use Task Prompts and the Message Bus. A single dispatch sends one Task. A batch sends 2–3 independent Ready Tasks or a Same-Agent chain whose other dependencies are complete. The Manager dispatches chains one Task at a time when another Worker needs intermediate results. Parallel assignments meet §3.4 regardless of whether they use separate Workers or native subagents.

Each Worker takes one dispatch at a time. The Manager reviews incoming reports and dispatches newly Ready work without waiting for unrelated reports. It waits only when the sole pending report would make a Waiting Task Ready for the Worker about to receive work.

Task Prompts include the relevant Spec decisions, constraints, prerequisite versions and validation directly, along with Tracker context, lasting Index findings and corrections from earlier Tasks. Every dependency names outputs, paths and how to use them. Cross-Agent dependencies name the producer’s accepted Task Log for the Worker to read and supply reading and integration steps; Same-Agent dependencies do too when context is missing after Handoff or recovery from a lost, corrupted or compacted conversation. Dependency tracing stops where an intermediate output captures the needed contracts.

Prompts supply the workspace and commit instructions established under §3.4, including the session root for `.apm/` paths. Each needed contract appears once. Follow-ups retain Task identity but receive a new numbered log path from the Manager, per Task. They focus on remaining work and use the Worker's established context, restoring detail where it is missing. Active corrections preserve the current attempt's log path, valid progress and workspace.

### 7.2 Execution and Logging

**Runtime:** `apm-2-initiate-manager`, `apm-3-initiate-worker`, `task-execution.md` and `task-logging.md`.

The Manager reads the implementation guides and starts its Tasks from the Spec, Plan and dependency evidence. The Manager focuses on coordination and review, using subagent workers for substantial implementation in its Tasks. Direct implementation of that work requires an approach explicitly agreed with the User and recorded in the Plan. The Planner reflects this in Manager assignments. Contained investigation, small corrections and final checks may be direct. Workers execute directly and selectively delegate useful parts. All roles may delegate within scope where benefit outweighs context and coordination cost, including planning research and preparation, debugging and independent checks. Shared delegation guidance defines briefing, grouping, isolation and verification; execution procedures add their particular requirements.

Manager Tasks remain Active through implementation, corrections, review and pending decisions. The Manager verifies contributions and the combined result and writes one concluding Task Log with `agent: manager` and its conversation number. It does not issue itself follow-up Tasks, use Worker attempts or send itself bus reports. Completion requires validated requirements or explicit agreement to remaining limits. Planning changes and integration follow Task Review.

The Worker confirms its identity, handles any Handoff and starts its waiting prompt. Role instructions own Task and Report receipt; delivery commands route there. An established Worker retains its identity when checking Tasks.

The Manager reads the requested reports, or all pending reports when none are specified, and returns to coordination if none are waiting. It matches Worker reports to the expected dispatch and attempt before applying outcomes.

The Worker uses its Task Prompt, workspace instructions and knowledge of its area built through earlier assignments and its conversation. It integrates dependencies, follows instructions, validates the work and investigates failures before making targeted fixes. The Manager and Workers write for the intended readers and follow the project's writing conventions. If the style is unclear, they consult similar examples when available. Session coordination details stay in APM files unless they are part of the work itself.

Missing dependencies, unresolved instruction conflicts, repeated attempts without progress and work that substantially exceeds the assignment need guidance. Within an Active Task, missing outputs or failed integration checks pause dependent work; unaffected work may continue within required sequencing. User actions pause only affected work; required approvals and checks remain in force.

Workers report relevant findings and possible wider effects from their available context. When that context leaves an issue unclear, they ask the User and recommend local resolution or Manager involvement if broader context or coordination is likely needed, pausing only affected work.

When a User review or action is required, the responsible agent explains what to look for or do, what response it needs and what happens next.

The User may take on or return any portion. The responsible agent briefs and supports them, stops overlapping work, checks returned work and retains validation and logging responsibility. Limited help does not transfer the rest of the work. The arrangement and resume point stay in the Tracker or Worker prompt, with consequential contributions in the log. Assignment, state and attempt are preserved.

Success requires the objective and every validation criterion to pass, including required documentation and affected behavior. Agents resolve known issues and validation gaps within scope and permission before final logs or reports; implementation subagent briefs carry the same validation and guidance requirements. A deliberate deviation or unrun check is not a pass. Agents use evidence tied to the actual deliverable and environment, checking that reused outputs and results still apply. They rerun checks when changes, incomplete evidence or uncertainty warrant it, confirm recurring failures match their established causes and distinguish local, CI and integrated results.

Agents explain what validation has established and ask for the remaining checks that need the User's judgement or an outside action. User-facing test procedures are checked as written and isolate disposable test state from User data. If required validation or resources are unavailable, unaffected work and available checks continue. If the limits remain at completion, the outcome is Partial.

When the agreement requires explicit User acceptance, the responsible agent shows the result with any requested changes and waits for the User to accept it before continuing.

In a Worker batch, each Task is validated and logged before the next; Partial or Failed stops the batch, with remaining Tasks reported as Not started.

Workers apply User corrections immediately and resolve their retention in `AGENTS.md` at completion under existing authorization or a User decision. Other findings may justify guidance updates. Tracked changes use the assigned branch or working copy and agreed commit timing. Important Findings retain changes and paths.

The Worker completes agreed User review and resulting changes, follows agreed commit conventions, writes the Task Log, clears its Task Bus and writes a Task Report pointing to that attempt’s log. Follow-up logs leave earlier attempts unchanged, link to the original and previous follow-up, and record new work, validation and the resolution of earlier findings. Outcomes still assess the whole Task, including unresolved earlier criteria. The Worker tells the User how to deliver the report, then waits.

### 7.3 Review

**Runtime:** `task-review.md` and `apm-5-check-reports`.

The Manager checks results and validation against requirements, including each batch Task. It inspects outputs or runs focused checks where evidence is incomplete or uncertain, and revisits requirements questioned by findings. It investigates Important Findings, unmet criteria and contradictory Success claims before acceptance. Direct corrections follow the role policy in §7.2, with work and validation recorded separately from Worker outcomes. It compares follow-ups with earlier attempts and reassesses stalled or expanded work; further dispatch requires concrete work and a supported approach. Wrong requirements and exceptions follow §3.5. Acceptance requires validated work or User-approved remaining limits, preserving evidence and qualifications.

For continued work, the Manager uses relevant earlier logs and outputs to establish what was addressed and what still applies to the current result. It checks whether reported User feedback also applies to related deliverables still in progress or awaiting review. It preserves consequential findings, remaining limits and their implications with supporting evidence in the Task Log or Stage summary.

Independent review is the default for substantial implementation or consequential uncertainty. The Manager chooses coverage by importance, complexity, existing evidence and remaining uncertainty, preserving required reviews. One reviewer normally covers a group of related Tasks or integrated results. Distinct consequential questions or expertise may warrant more. Small, well-understood changes with adequate evidence usually need no independent reviewer.

Reviewers work separately from implementers. They receive requirements, changes, evidence, accepted exceptions and scope, and assess completeness and validation against requirements. The Manager verifies findings, resolves confirmed gaps and completes required review before dependent work relies on the result.

For corrections and Worker follow-ups, the Manager chooses direct verification or subagent review by their size, complexity and remaining uncertainty. It reuses the previous reviewer when useful and repeats broad review only where changed work or unresolved risk warrants it. Existing evidence remains valid where it applies. Any recommendation to accept remaining limits explains their effects and why acceptance is preferable to further work or replanning. An agreement made with a Worker is retained within its explicit scope; the Manager asks only about new consequences or an unclear decision.

Broader design or scope questions need viable options and approval per §3.5. Review leads to acceptance, follow-up or planning change. Pending Tasks stay Active. The Manager consolidates Tracker updates per §5, preserving decisions and recovery state, and resolves investigation and alignment before dependent work; unrelated Ready work continues. Integration and cleanup remain independent of acceptance (§3.4).

Stage verification includes required User and Plan checks and uses Task validation and review evidence that still applies. Further review focuses on gaps that could affect acceptance. The Manager records checks performed or skipped and why, separates reference inputs from generated results, preserves evidence through cleanup and resolves findings. Fixes to Done work need new Tasks. After writing the Stage summary and updating the Index, the Manager reports the Stage result and consequential carryover and pauses before the next Stage per §2.2.

## 8. Continuity and Closure

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

The current Manager or the registered Worker prepares its own Handoff in its outgoing conversation. At the User's request, it checks files and any version control state, pauses running subagents and collects progress, outputs and pending checks. It writes a Handoff Log and Prompt that preserve User-held work, required assistance, reviews, accepted limits and resume conditions. The Prompt identifies the next conversation, checked state, pending decisions, validation gaps, sources and next action. The records identify any compaction or recovery and name reconstruction sources and the specific uncertainty or unverified claims that remain. Workers use workspace evidence for claims about integration.

The outgoing agent gives a small chat recap of what passes on and how the User starts the next conversation. File links are optional; there is no mandatory file inspection or approval. By default it then waits and the User completes delivery. An alternative mechanism requires an explicit coordination agreement.

The incoming Manager reads coordination records and needed Task Logs; the Worker reads its Handoff Log, latest relevant own logs from the current Stage and dependency logs needed to resume, following earlier-attempt links as needed. Both check records against current state, preserve User-held work, ask about gaps and clear the Handoff Bus. The Worker resumes with the current prompt’s log path or awaits delivery.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Managers and Workers resuming after a compaction of their context follow their role's recovery responsibilities before continuing work. Recovery reloads the role's instructions and required sources and checks permitted files, messages and deliverables without repeating initiation or changing identity or conversation number. The Manager uses session coordination and Memory; Workers use their current prompt, latest relevant own logs and Handoff Logs, following earlier attempts as needed. The recovering agent preserves the current attempt, User-held work, decisions, accepted limits and validation gaps, asks about unresolved gaps and records its reconstruction sources. A User request can also trigger recovery.

### 8.3 Summary and Archive

**Runtime:** `apm-2-initiate-manager` and `apm-8-summarize-session`.

A new conversation may summarize without adopting a role; the Manager may summarize at completion or early stopping. Normal completion reports results. Early closure pauses Tasks and subagents, asks the User to pause other active work, and records checked unfinished state without changing Task states. Summary and archive preparation uses current stop confirmation or collects missing state from the User. The optional summary checks outcomes, findings, decisions, limits and attribution against sources and deliverables. Completion counts describe workflow progress, not universal validation success.

At session close, the Manager updates Index Notes with any remaining information that may help in a later session and links to the evidence. The Manager then clears obsolete coordination notes and context from the Tracker, keeping the checked final state and what is needed to resume unfinished work.

The Manager asks first about a saved Session Summary and then, in the same message, about archival with or without a summary. It explains how each would help the User or a later session. The agent that writes a summary links it, briefly presents its conclusions and applies any User corrections.

Archiving is optional and requires the User's approval. The agent explains what archival would do in this session before requesting approval and reuses prior approval that covered those effects. The CLI copies active session records from `.apm/` to the same relative paths under `.apm/archives/<name>/`. It moves linked Git worktrees from `.apm/worktrees/` to the archive’s `worktrees/` directory at the same relative paths and verifies the moves before clearing active APM files and installed instructions. Worktrees keep their uncommitted changes and links to their source repositories. Other working copies outside `.apm/` stay in place, as do ordinary project-directory changes. Failure preserves recoverable state and reports the paths needing attention. Completing Tasks, committing and merging are separate decisions.

When an agent archives a session, it adds an archive index entry linking to the saved summary or, without a summary, to the archive folder. The CLI lists archives from their metadata. A new installation starts another session; its Planner can use relevant archives after checking current evidence. Archive deletion asks for confirmation describing the files, worktrees and uncommitted work to be deleted; `-f` skips that confirmation. A failed deletion stops and warns that cleanup may be partial.
