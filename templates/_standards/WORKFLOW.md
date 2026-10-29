# APM Workflow

This specification describes APM's workflow for template authors and maintainers. The command skills, shared skills and guides that agents read at runtime implement it. A change to the workflow is made here first, then carried into those files. Terms follow `TERMINOLOGY.md`; prose follows `WRITING.md`.

## 1. Design

APM coordinates agents through planning documents, Memory and the Message Bus. Agents never communicate directly. The User starts each agent, delivers every message by invoking a skill in the receiving agent's chat, approves decisions and starts Handoffs.

An APM session is one APM run of both phases on one body of work. It ends when that work is complete or the User stops early. The User may then summarize the session and archive its `.apm/` files, and later sessions can use the archives as context. A large goal can take several sessions, one after another: the Planner settles with the User how much of it the current session covers (§6.1).

All assistants receive the same instructions in plain English. Each agent carries them out with its own assistant's commands, subagents and way of starting a new chat.

Role instructions define each agent's scope. The Planner holds the context gathered during planning. The Manager holds the coordination context: the planning documents, the Tracker and Memory. A Worker works from its Task Prompts, the Rules and what it has learned in its own conversation. Workers do not read the Spec, Plan, Tracker or Index. Instead, the Manager copies what a Task needs into its Task Prompt. The User can widen a Worker's scope with an explicit request.

Each role may use native subagents for focused work, within its own source, workspace and change boundaries. Delegation is optional throughout APM; the role's initiation skill recommends uses and defines the brief and verification it needs. The parent remains responsible for the result. A subagent is not an APM Worker and does not bypass User-mediated Message Bus delivery.

## 2. Phases

### 2.1 Planning Phase

The Planner reads both planning guides at initiation and develops design and work-structure choices during Context Gathering. The User approves its summary of understanding, then the Planner writes the Spec, Plan and Rules, each approved separately. Finally it creates the Message Bus and tells the User to start the Manager in a new chat.

### 2.2 Implementation Phase

The Manager first reads its Handoff Bus. If the bus holds a Handoff Prompt, the Manager continues after a Handoff; if it is empty, this is the first Manager. The first Manager reads the planning documents and inspects the git state of each working repository. It combines what it finds with the Spec's and Plan's Notes and presents its understanding of the work, proposed version control conventions and any Stages that may need verification. Once the User approves, it records the base branches in the Spec's Workspace section and the conventions in the Rules, sets up Task tracking and begins.

Each Task then passes through Task Assignment, Task Execution, Task Logging and Task Review. Stages run in order. Within a Stage, the Manager uses single, batch or parallel dispatch. It keeps reviewing reports and dispatching Ready Tasks until every Stage is complete or the User stops early, then records the state, presents the session's outcome and offers a session summary and archive. At any point, the User can start a Handoff to move the Manager or a Worker to its next conversation.

## 3. Planning Documents

| Document | Location | Purpose and readers |
|---|---|---|
| Spec | `.apm/spec.md` | What to build: design decisions and constraints. The Manager reads it and copies what each Task needs into its Task Prompt. |
| Plan | `.apm/plan.md` | How the work is organized: Stages, Tasks, Workers, dependencies and validation. The Manager reads it and builds Task Prompts from it. |
| Rules | `APM_RULES` block in `AGENTS.md` at the workspace root | How work is performed. Every agent reads the Rules directly. |

### 3.1 Spec

The Spec records what is built, in a Markdown structure that suits the work. It opens with Overview, Workspace and Notes, before the design sections. Workspace names working and reference repositories and authoritative User documents; the Manager adds each working repository's base branch. Notes hold assumptions, open questions, reasons behind constraints and context for work left to later sessions. Settled requirements and constraints belong in Workspace or the design sections. The Plan is written from the Spec. The Manager keeps both the main content and Notes current when findings or decisions change them.

### 3.2 Plan

The Plan opens with what the APM session builds, a table of Workers by agent slug, a table of Stages and Notes on dispatch paths, likely blockers and the critical path, which the Planner writes and the Manager keeps current. Each Stage section lists its Tasks. Each Task names its Worker and has an objective, dependencies, output, validation, guidance and ordered steps. Each dependency is marked Same-Worker or Cross-Worker, which shows the Manager which Tasks can go in a batch and which can run in parallel.

Plan Notes explain dispatch choices, likely blockers, the critical path, convergence and why a Stage needs verification. Task dependencies and validation criteria stay in Task fields. The Manager keeps Notes current and removes observations made redundant by settled content. Changes to planning documents follow §3.5.

### 3.3 Rules

The Rules sit in the `APM_RULES` block of `AGENTS.md`. Claude Code loads them natively or through an import, according to the discovery check in §6.2. Content outside the block belongs to the User and is kept; the Rules refer to it where relevant. Every Worker reads the whole file, whatever its area of work, so each Rule applies to all or most work and says when it applies. Patterns specific to one area reach Workers through their Task Prompts. The Manager and Workers may add Rules during implementation, each through its own procedure.

### 3.4 Version Control

Version control belongs to the Manager. At its first start, the Manager confirms the conventions with the User. Without existing conventions, it proposes `type/short-description` branch names and `type: description` commit messages, using feat, fix, refactor, docs, test or chore. APM never pushes to a remote unless the User asks.

When version control is active, each single or batch dispatch gets its own branch. In parallel dispatch, each Worker also gets its own worktree. Workers commit on their assigned branch; the Manager creates branches, merges them and cleans up. The Spec's Workspace section records each repository's base branch, and the Rules hold the branch and commit conventions.

When `.apm/` sits inside a repository, the Manager adds it to `.gitignore` by default and asks whether the User wants any APM files tracked. If the User declines version control, the workflow still runs, but parallel dispatch is unavailable.

### 3.5 Changing Planning Documents

A finding, User correction or change to the Spec, Plan or Rules can affect the others. The Manager checks affected sections, including Notes, Task guidance and validation, and the instructions of dependent or already-dispatched Tasks. It corrects authorized changes together, removing stale or contradictory statements before affected work continues. The same check applies when the Manager confirms version control at first start.

The Manager may make small, contained changes on its own: clarifying or correcting one Task, adding a missing dependency, adding an isolated point to the Spec, or adjusting a Rule. Larger changes need the User: changes to several Tasks, to the design direction or scope, a new Stage, or a major restructuring. Several small changes together can also need the User.

When approval is needed, the Tracker records the affected work, source, pending decision and next action; affected work waits for that decision. For an unreported active Task, the User pauses the Worker and confirms progress, then delivers corrected instructions with `apm-4-check-tasks`. The correction preserves Task identity, log path, branch/worktree and valid batch progress; it is not a new dispatch. Reported attempts use Task Review and follow-up Tasks. The Manager records each planning change and its reason in the Tracker's Notes, and preserves consequential decisions in the Stage summary. Notes explain current context; they do not replace correcting the authoritative content.

Some findings go beyond what a Plan change can handle: a fix needs design decisions the Spec does not cover, a change would rewrite the Spec's Overview or several Stages, or follow-up Tasks keep failing for the same reason. The Manager does not plan the solution itself. It presents the options with a recommendation, such as changing the Plan and continuing, or pausing the session to summarize it, archive it and plan again with a new Planner, and the User decides.

## 4. Communication

**Runtime:** `skills/apm-communication/SKILL.md` and its `bus-integration.md`.

### 4.1 Communicating with the User

A message to the User opens with what the User needs: the answer, outcome, finding, proposal or question. It then gives the evidence, trade-offs, limits and next action the User needs to understand it or act. Replies stay short by default, and the User's requested length or detail takes precedence. An agent explains an APM term the first time the User meets it in the conversation, and gives the User reasons about the work rather than citing APM procedures. The communication skill covers shared writing and bus protocol only. Planner questioning and role-specific delegation belong in the role's files; each procedure adds only what its own messages must contain.

When the User has to act, the agent names the skill to invoke, the chat to invoke it in and any argument. Commands go in code blocks; paths and values go in inline code.

### 4.2 Writing for Other Agents

Messages and APM files are read by an agent that has the files and the workspace but not the writer's conversation. They follow their formats exactly, because other agents and the CLI rely on the field names and paths. Free text records the work: what was done, decisions with their reasons, evidence, open issues and the paths the reader needs. Each fact has one authoritative home; reports and summaries carry its consequential findings with source paths. Claims are checked against their source.

### 4.3 Message Bus

The Planner creates the Message Bus in `.apm/bus/`. Each Worker's folder holds a Task Bus (`task.md`), a Report Bus (`report.md`) and a Handoff Bus (`handoff.md`). The Manager's folder holds only a Handoff Bus.

| File | From → to | Message |
|---|---|---|
| `task.md` | Manager → Worker | Task Prompt, single or batch |
| `report.md` | Worker → Manager | Task Report, single or batch |
| `handoff.md` | Outgoing → incoming conversation | Handoff Prompt |

A bus file is either empty or holds one message waiting for delivery. Before writing its outgoing message, an agent clears the incoming message it has processed. Agents read a bus file before writing it, so that their file tools accept the write.

`apm-4-check-tasks` delivers a Task Prompt to a Worker, and `apm-5-check-reports` delivers Task Reports to the Manager. Both accept an optional agent ID to target one agent. A batch Task Prompt lists its Tasks in one shared frontmatter, and each Task keeps the body sections of a single Task Prompt.

### 4.4 Message Flow

1. The Manager writes the Task Bus and tells the User how to start or reach the Worker.
2. The User invokes that skill in the Worker's chat.
3. The Worker executes, validates and logs the Task, writes the Report Bus and tells the User how to deliver the report.
4. The User invokes `apm-5-check-reports` in the Manager's chat.
5. The Manager reviews the Task, updates the Tracker and continues.

Each agent tells the User only what to do at its own end of the exchange.

### 4.5 Agents Outside APM

An agent that is not part of APM can join the Message Bus by creating its own bus folder. It receives plain assignments and reports results. It does not write Task Logs, perform Handoffs or appear in the Tracker's Workers table. The Manager reviews its reports, notes its contribution in the Tracker's notes and sends further assignments through its Task Bus. `bus-integration.md` describes the setup.

## 5. Memory and the Tracker

APM Memory records the session's work history and continuation context: Task outcomes, lasting findings, Stage summaries and role handoffs. Its artifacts belong under `.apm/memory/`. The Tracker holds live Task states.

### 5.1 Files

| File | Location | Content |
|---|---|---|
| Tracker | `.apm/tracker.md` | Pending coordination Notes, Task states and next actions with branches and worktrees, and Worker conversations and context. |
| Index | `.apm/memory/index.md` | Lasting findings with sources, followed by Stage outcomes linking to their summaries. |
| Stage summaries | `.apm/memory/stage-<NN>/stage-<NN>.summary.md` | Each completed Stage's outcome, consequential findings, decisions, validation and limits, with source links. |
| Task Logs | `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` | Each Task's outcome, deliverables, validation and Important Findings, written at the `log_path` its Task Prompt gives. Writing a log creates its Stage folder. |
| Handoff Logs | `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md` | The history and working context of each Manager or Worker conversation that ended in a Handoff. |

### 5.2 Tracking Tasks and Workers

The Tracker records each Task's state: Waiting, Ready, Active or Done. A Worker's outcome informs the Manager's decision but does not set the state. A Task stays Active while the Manager investigates or a follow-up Task is pending. It becomes Done when the Manager accepts the outcome or restructures the work. Done is final: if later findings need a fix, the Manager adds a new Task that refers to the original. A Stage is complete when all its Tasks are Done, required Stage verification is resolved and, with version control, their work is merged. Acceptance of a Partial outcome does not turn unmet checks into passing results; summaries preserve the accepted limits.

The Tracker opens with Notes, then Tasks and Workers. Each Task row holds its branch, worktree and Next Action, distinguishing execution, awaiting a report, review, follow-up and merging without adding state values. The Workers table records each Worker's ID and conversation number from its first dispatch. Its Not Read Since Handoff column lists earlier-Stage Tasks the Worker has not read since its last Handoff; dependencies on them count as Cross-Worker. Its Context column records recovery and context reliability, without repeating Task states.

The Tracker's Notes explain pending decisions, blockers and alignment changes, naming affected work, sources and who needs to act. Task-specific next actions stay in Task rows. Stale Notes are removed; lasting discoveries, accepted constraints and unresolved limitations move to the Index with sources, and Stage-specific findings and decisions go into the Stage summary. Notes the next Stage still needs stay in the Tracker. Completed merged Stages are reduced to a completion line linking to their summary.

### 5.3 Important Findings

Workers set `important_findings` when they find something that may matter beyond the Task, including a conflict with existing code, dependencies or systems. It is always true for a Partial or Failed outcome, and when unsure, Workers set it. The Manager decides what each finding means for the planning documents and other work.

## 6. Planning Phase

### 6.1 Context Gathering

**Runtime:** `apm-1-initiate-planner` and `guides/context-gathering.md`.

At initiation, the Planner reads the communication skill and both planning guides in full. It then surveys the workspace: its folders and repositories, their history and branches, existing materials and archives. It reads `AGENTS.md` and applicable Claude instructions at the workspace root and its ancestors, including `CLAUDE.md`, `.claude/CLAUDE.md` and `CLAUDE.local.md`, for orientation. The User's opening message can establish which documents are authoritative. Otherwise, the User confirms which discovered materials and archives are current before the Planner reads them. The Planner explores every relevant codebase and confirmed archive before asking questions.

Three rounds follow, in order:

1. **Existing materials and vision:** deliverables, purpose, what success looks like, scope, required skills, documentation and prior work.
2. **Technical requirements:** design decisions and constraints, dependencies, resources, complexity, risks and validation.
3. **Implementation approach and quality:** technical preferences, quality standards, external approvals and coordination, domain characteristics and documentation.

Each round needs at least one exchange with the User. Where the Planner already knows something, it asks the User to confirm it; where it does not, it asks. It resolves important gaps before moving to the next round, then summarizes what the round established and what remains open. Each round ends with an open question about anything the focused questions missed; the User may answer it together with the next round. Context the User supplies up front does not skip a round, and silence is not approval.

The Planner researches what the conversation raises, directly or through optional subagents within its role's boundaries. It checks important findings against the files or commands they cite, follows up on contradictions and gaps, and shows the User what it verified before relying on it. When several designs are viable, it presents the options with a recommendation and the User chooses. For each requirement it records how success will be checked, proposing concrete measures when the User has none.

Questions connect the work to design and coordination choices. The Planner can propose tentative Stages, Tasks and Workers, with reasons, and ask about available agents, parallelism, Task size, review points and version control preferences. It revises the breakdown as context develops. The Manager confirms repository conventions and chooses actual dispatches. Research needed to understand the work happens now; research that is itself a deliverable becomes planned work.

As context grows, the Planner judges how large the User's goal is. If it is too large for one session, for example because later parts depend on decisions that only earlier work can settle, the Planner proposes how far this session goes. Once the User agrees, it plans around that scope and keeps the rest as notes for later sessions in the Spec and Plan.

After the three rounds, the Planner presents a summary of its understanding, including proposed work structure and coordination preferences where developed. The User corrects it until it is right, and approval allows document writing under the already-read Work Breakdown guide.

### 6.2 Work Breakdown

**Runtime:** `apm-1-initiate-planner` and `guides/work-breakdown.md`.

The Planner carries forward the design and breakdown choices developed during Context Gathering. It proposes, writes and gets approval for each document in turn, checking corrections against earlier documents:

1. **Spec:** design decisions, constraints, references to source documents and the workspace. Its Notes section holds assumptions, open questions, reasons behind constraints and context for work left to later sessions.
2. **Plan:** Workers and their areas, Stages in order, Tasks, guidance, dependencies and validation. The Planner checks coverage and dependencies before writing. Its Notes section covers dispatch paths, likely blockers, the critical path, where work converges and which Stages may need verification.
3. **Rules:** execution patterns that apply to all or most work, keeping any existing content outside `APM_RULES`. Version control conventions are left to the Manager, which adds them to the Rules at its first start.

For Claude Code, the Planner checks Rules discovery against the installed version, Project instructions setting and applicable local or ancestor instructions. It preserves a setup that already loads `AGENTS.md`. Otherwise it imports `@AGENTS.md` in an existing workspace-root `CLAUDE.md`, or `@../AGENTS.md` in `.claude/CLAUDE.md`, preserving content and keeping imports outside code blocks. If neither exists and native loading is unavailable or blocked, it creates a workspace-root `CLAUDE.md` containing only `@AGENTS.md`. Disabled project instructions require the User to enable them. The Planner explains added imports or files at Rules review and asks the User to verify loading with `/memory` in a fresh chat.

Each document needs the User's approval before the next begins. Each Task produces a meaningful deliverable that can be validated on its own, within one Worker's area. Its steps share the Task's validation and help locate failures. Where research or investigation is needed, the Plan states the question and required evidence; the executing agent chooses whether to delegate. The level of detail matches the work's complexity.

## 7. Implementation Phase

### 7.1 Task Assignment

**Runtime:** `guides/task-assignment.md` and `apm-4-check-tasks`.

The Manager finds Ready Tasks from the Tracker and the Plan's dependencies, groups them by Worker and chooses the dispatch. A Worker takes one dispatch at a time; its other Ready Tasks wait until the current one is reviewed.

- **Single dispatch:** one Ready Task.
- **Batch dispatch:** several Tasks for the same Worker. They either form a chain whose dependencies are inside the batch or already complete, or are independent and all Ready. Batches usually hold 2–3 Tasks. When other Workers wait on a chain's intermediate results, the Manager sends those Tasks one at a time instead.
- **Parallel dispatch:** Tasks or batches for different Workers at the same time, when no unresolved Cross-Worker dependencies exist between them and version control gives each Worker its own workspace. The Manager suggests tool approvals that reduce the Workers' waiting time.

Waiting for a pending report is worthwhile only when it would unlock a useful combination at little cost; otherwise the Manager dispatches what is Ready. When nothing is Ready but Workers are busy, the Manager tells the User what it is waiting for and which report to bring next.

A Task Prompt contains the Task's definition, the exact constraints from the Spec and authoritative documents, and relevant findings from earlier work. It never refers the Worker to the coordination documents. The Rules are not copied in, because Workers read them directly. Code is supplied as instructions to read specific files.

The kind of dependency sets how much context the Task Prompt gives. For a Same-Worker dependency, it points to the earlier output and its paths. For a Cross-Worker dependency, it summarizes the earlier output and gives reading and integration steps and any relevant upstream contracts. Tasks listed in the Tracker as unread since a Worker's Handoff count as Cross-Worker. A Worker that recovered after compaction may need more detail, because its rebuilt context is thinner. Tracing upstream stops where an intermediate output fully captures the earlier contracts.

Each Task Prompt carries the Task's metadata and log path, and gives the objective, instructions, output and validation, with Context from Dependencies only when the Task builds on earlier Tasks. It adds execution, logging or reporting guidance only when that guidance is specific to the Task; general rules live in the Worker's guides. Its Workspace section names the working directory; with version control, it names the branch or worktree and tells the Worker to use the workspace root for all `.apm/` paths.

The Manager writes the Task Bus and tells the User what to do: start a new chat for a Worker that has not started, or deliver to an existing one. For a batch it gives the Tasks and their order; for parallel dispatch it gives each Worker's action. A follow-up Task refines the objective, instructions, output and validation using what review found, and keeps the original log path so the new log replaces the old one.

### 7.2 Task Execution and Logging

**Runtime:** `apm-3-initiate-worker`, `guides/task-execution.md` and `guides/task-logging.md`.

A Worker takes its identity from the agent ID it was started with, matched against the bus folders. The `agent` field of each Task Prompt is checked against that identity. At start, the Worker first processes any Handoff Prompt. It then executes a Task Prompt already waiting in its Task Bus, or waits for one.

The Worker integrates its dependencies, follows the steps in order and runs every check it can on its own before asking the User for a check that needs them. When a check fails, it investigates, makes one targeted fix and checks again. If the fix does not work, it investigates further, with optional subagents, and verifies the findings before applying them. A required check that fails or remains unverified means the outcome cannot be Success, even when the difference was deliberate.

In a batch, the Worker validates and logs each Task before starting the next, and stops at the first Failed outcome. One batch Task Report covers every Task executed and lists those not started.

When the User corrects how the Worker works, the Worker applies the correction at once. When the Task is done, and before writing the Task Log, it asks whether a correction that applies to later Tasks should become a Rule, and waits for the answer. With version control, an approved Rule is committed with the Task. The Task Log records the correction and the User's answer under important findings.

To finish, the Worker commits under the Rules' conventions, writes the Task Log with the workspace it used, clears its Task Bus and writes its Task Report. It gives the User both the targeted and the general command to deliver the report, since several Workers may finish at once. A large Task may also have intermediate commits, each a coherent unit of change.

### 7.3 Task Review

**Runtime:** `guides/task-review.md` and `apm-5-check-reports`.

The Manager reads each report and its Task Log, and checks the outcome against the objective, validation and Important Findings. It reviews each executed Task of a batch on its own; Tasks a batch did not start return to dispatch.

Every Task Report gives the Worker's conversation number. When the number rises, the Manager checks the Handoff Log, updates the Workers table, and lists the Worker's Tasks from earlier Stages, whose logs the new conversation did not load. A recovery note keeps the conversation number and tells the Manager that later Task Prompts may need more context.

A Success that the log supports is accepted. If the work succeeded but was not committed, the Manager commits it under the Rules' conventions. Important Findings, an outcome other than Success, or a log that contradicts itself lead to investigation: directly for contained checks, with optional subagents when the issue needs a lot of context. The result is one of three decisions: accept the outcome, send a follow-up Task, or change the planning documents within the limits in §3.5. When a finding needs more than a Plan change, the Manager proposes how the session continues, as §3.5 describes. The Manager records each consequential finding as fixed, accepted with the required authority, pending, or outside current scope, and aligns affected documents before dependent work proceeds. It preserves the Worker's recorded evidence rather than rewriting it to match acceptance. A follow-up Task notes any uncommitted work; its replacement log retains consequential earlier findings and their resolution.

Once a report's review is decided, the Manager clears that Report Bus. Every decision updates the Tracker. When a Stage completes, the Manager adds the next Stage's Tasks to the Tracker. With version control, the Manager merges a reviewed branch before dispatching Tasks that depend on it, and merges every branch of a Stage before the next Stage begins. Reports can arrive in any order. Where possible, the Manager reviews, merges, reassesses readiness and dispatches in the same turn.

When every Task in a Stage is Done, the Manager verifies the Stage when the User requested it, the Plan's Notes name it, or any Task needed a follow-up Task or reported Important Findings. Otherwise it may skip verification and records why. It fixes contained issues, investigates with optional subagents, adds Tasks for Worker work, or asks the User for direction. It writes a Stage summary with the outcome, consequential findings and decisions, validation and limits, and links to Task Logs and evidence. It adds an Index row linking to the summary and sorts Notes per §5.2.

## 8. Handoff and Continuity

### 8.1 Handoff

**Runtime:** `apm-6-handoff-manager` and `apm-7-handoff-worker`.

The User starts a Handoff for the Manager or a Worker. The outgoing agent first checks the current state in the bus files and, with version control, in git. It then writes a Handoff Log with the history, decisions and approaches of its conversation, which stays in Memory. It also writes a Handoff Prompt with its identity, the current state, what to read and the next action. The incoming agent processes the Handoff Prompt and clears the Handoff Bus.

What a Worker's Handoff Prompt says depends on when the Handoff happens:

- **During a Task:** the Task Prompt is still in the Task Bus. The Handoff Prompt says what is done and where to resume.
- **During a batch:** the batch is still in the Task Bus. The Handoff Prompt lists the Tasks already logged, the one in progress and those not started.
- **Between Tasks:** the incoming Worker waits for the next delivery.

A Manager's Handoff Prompt names reports awaiting review, Workers with dispatched Tasks, pending merges, alignment decisions and verification gaps, with source paths; the incoming Manager reads the Plan and Spec for the Tasks themselves.

Both roles preserve accepted limitations and unresolved contract questions with source paths. An incoming Manager reads the Handoff Log, the Tracker, the Index and relevant recent Task Logs. An incoming Worker reads the Handoff Log and only its own Task Logs from the current Stage. The Manager therefore treats dependencies on its earlier-Stage Tasks as Cross-Worker.

### 8.2 Recovery

**Runtime:** `apm-9-recover`.

Recovery rebuilds a started Manager's or Worker's context after compaction or a lost conversation. The User invokes `apm-9-recover`, optionally naming the role; otherwise the agent works out its role from the conversation or asks. The agent rereads its initiation command skill and the files it lists, then rebuilds the current state from the APM files and code, including pending alignment, accepted limitations and verification gaps. Its conversation number does not change. It records the recovery in the Tracker or in its next Task Report, and mentions it in any later Handoff Log.

### 8.3 Session Summary and Archive

**Runtime:** `apm-8-summarize-session`.

An agent can write a session summary, `.apm/session.summary.md`, at any point in an APM session, usually when the work is complete or the User stops early. It is a dated snapshot of scope, outcomes, main deliverables, consequential findings and decisions, accepted limitations, open issues and verified differences between the code and the APM files. It checks these claims against source logs and preserves validation counts and limits. Completed Stage counts describe workflow progress, not proof that every requirement passed. It also says which parts the writer remembers doing and which it took from files. When the work is complete or the User stops early, the Manager offers to write the summary in its own chat or to have the User invoke the skill in a new chat; at other times, a new chat writes it. The summarising agent then offers to archive the session, which the CLI can also do directly. Archiving is optional.

Closing starts by stopping writes: the Manager asks the User to pause active Workers and waits for confirmation and their current state, then records unfinished Tasks, branches, worktrees and uncommitted work. A requested summary checks relevant unfinished deliverables and Git state in those worktrees, treating their copied APM artifacts as part of the same session. Direct CLI archival tells the User to stop writing agents before confirmation.

With the User's approval, archiving reserves a new `.apm/archives/<name>/`, stages a snapshot of the session records, and uses `git worktree move` in each owning repository to preserve remaining worktrees under the archive's `worktrees/`. Staged, unstaged, untracked and ignored work and checked-out branches are preserved. The archive records old and new worktree locations and verifies the checkouts and Git registrations before clearing active files, installed templates and installation metadata. Finishing Tasks, committing unfinished work and merging branches are separate decisions.

An existing custom name is rejected; default dated names advance on a collision. If preservation fails, active records stay available, moved worktrees are restored where possible, and the CLI reports any remaining locations and the obstacle. Locked worktrees, unsupported moves and unexpected contents require resolution before closure. Existing archives are kept. The default name is `session-YYYY-MM-DD-NNN`; the User may choose another. Each archive's `metadata.json` marks it as an archive and holds the installation metadata and archive time. The summarising agent also creates or repairs `.apm/archives/index.md` and adds the new archive's date, scope, Stage and Task counts and name linking to its session summary.

Preserved worktrees remain registered with their source repositories. An archive preserves the local session state; it relies on those repositories for Git history and branch operations.

`apm init` or `apm custom` then starts a new APM session, keeping the archives. While surveying the workspace, the next Planner asks which archives are relevant, explores the confirmed ones directly or through optional subagents and checks the findings against the current code before using them.

Archives stay in `.apm/archives/` until the User removes them with `apm archive --delete <name>` or `apm archive --clear`. The CLI removes registered archived worktrees through Git before their containing archive. Discarding dirty preserved work needs explicit authorization, separate from the confirmation bypass supplied by `--force`.
