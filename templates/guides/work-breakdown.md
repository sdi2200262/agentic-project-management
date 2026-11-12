# APM {VERSION} - Work Breakdown Guide

This guide covers the Planner’s Work Breakdown: developing the work structure during Context Gathering, turning the approved understanding into the Spec and Plan, and reviewing needed additions or changes to `AGENTS.md`. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers what follows.

The Manager prepares self-contained Worker Task Prompts from the Spec and Plan; Workers read those prompts and `AGENTS.md`. Match detail to the work’s complexity: requirements and design belong in the Spec, work structure in the Plan, and lasting workspace guidance in `AGENTS.md`.

Both the Spec and the Plan place Notes after their introductory and reference material, before the main body. Spec Notes hold unresolved questions and assumptions; Plan Notes explain coordination across Tasks and refer to relevant Spec questions. The Manager keeps both current during implementation.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan. For each:

1. Present your proposal with its consequential choices and reasons.
2. In the same turn, read the target file and write the document. Check that it defines the agreed outcomes and the work needed to deliver them. Check consistency with the other documents and place each detail in its owning document or field.
3. Stop and ask the User to review it, saying what comes next. Apply corrections, check their effects on earlier documents and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it. After Plan approval, review any needed changes to `AGENTS.md` per §4.

## 2. Spec

The Spec defines what the session is intended to achieve and why, with the requirements, design decisions and constraints that shape the work. State these in the work’s own terms. The Plan explains how to achieve those outcomes through assigned work and validation.

1. Propose the design decisions, constraints, references to source documents and how you will organize them. Explain the choices and assumptions that matter.
2. Write `.apm/spec.md` per §5.1:
   - **Opening:** the session’s goal, scope and success criteria, directly below the title.
   - **Notes:** unresolved questions and assumptions. If later sessions were discussed, briefly record the work left for them and why.
   - **Design sections:** session requirements, design decisions and constraints, with their reasons and authoritative source paths and sections, organized so the Manager can find them and copy them into Task Prompts. Name working targets and references where they define this session's scope. Record the agreed version-control arrangement, including work locations, commit and integration timing, and APM file tracking.

System behavior, output formats, schemas and interface contracts belong in the Spec. Implementation approach that leaves a design decision unchanged goes in a Task's Guidance, operations go in steps, and durable workspace conventions go in `AGENTS.md`.

Keep requirements in the Spec, planned work in the Plan, live coordination in the Tracker, and work history in Memory. Add supporting documents only for retained material outside those responsibilities. Propose their purpose, paths under `.apm/`, structure, maintenance responsibility and intended readers to the User. Refine the proposal with their feedback and record the agreed arrangement in the Spec for this session only. Put any implementation work to create, use or maintain them in the relevant Plan Tasks. Reuse existing supporting documents where suitable.

## 3. Plan

The Plan divides the work into ordered Stages and Tasks for the Manager or Workers, using the fields in §5.2. A Task’s assignment identifies its responsible agent and APM conversation. Workers execute their Tasks with optional delegation; the Manager coordinates subagent workers to execute its Tasks.

1. Refine the breakdown developed during Context Gathering: Worker areas, Stage deliverables and Tasks. Explain consequential boundaries, order and dependencies.
2. Define each Task per §5.2, setting its Agent field to `manager` or a Worker slug per the agreed approach. In Guidance, refer to the relevant Spec or source sections and add Task-specific context, any work the User wants to perform, and agreed review points. The assigned agent remains responsible when the User performs all or part of the work.
3. Check the breakdown against the approved Spec: every agreed outcome is covered by Tasks whose assigned agents can undertake and validate the work. Check assignments, dependencies, Task sizes and review points against the principles below and agreed User involvement. Same-Worker means both Tasks are assigned to the same agent; Cross-Worker means they are assigned to different agents, including the Manager. Fix what you find.
4. Write `.apm/plan.md` per §5.2. Keep Notes to necessary coordination across Tasks: shared constraints, participation or review arrangements, dispatch opportunities and Stage verification. Name affected work and checks. Keep Task-specific dependencies and validation in their fields, and refer to Spec questions. If later sessions were discussed, briefly record relevant sequencing or prerequisites, referring to the Spec for scope.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Assignments** group Tasks between Manager and Worker conversations by the expertise, shared context and User involvement the planned work is likely to need. Keep related work together where familiarity should help, weighing the expected context and coordination demands.
- **Stages** are milestones in order: Stage N+1 starts after Stage N is complete. Choose milestones around dependencies and meaningful review points. Parallel work belongs in Tasks within a Stage.
- **Tasks** define work the Manager or one Worker is responsible for completing, with a clear output and validation. Choose boundaries according to size, complexity, uncertainty, dependencies and expertise. Research, implementation and validation may share a Task or need separate Tasks. Explain the boundaries that affect how the work proceeds. Investigate consequential uncertainty before work that depends on it. For research Tasks, state specific questions, required evidence and completion criteria, and identify dependent decisions or work. Define dependent Tasks to the extent the answers allow; the assigned agent organizes execution according to its role.
- **User actions.** Agents work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives observable checks and expected results for each Task's output, including research or testing results. Separate checks the assigned agent can run alone from those that need the User, and tell that agent to pause affected work for them. Keep checks within the assigned work; put additional Stage verification in the Plan's Notes.

Identify what can run independently and what must wait for earlier results. Dispatch opportunities are suggestions; the Manager chooses actual dispatches from the current state within the agreed constraints.

## 4. AGENTS.md

Keep `AGENTS.md` useful across sessions, with brief project orientation, repository paths, working and read-only reference boundaries, and applicable workspace conventions. Every Worker reads the whole file; its instructions must stand alone without requiring the Spec or Plan. The Manager and Workers maintain it under User authorization as the project develops.

1. Review existing `AGENTS.md` and any applicable guidance. Propose concise additions or corrections that help future work, extending or replacing existing guidance where possible. Explain the evidence for changes, or why existing guidance is sufficient. If the file is missing, propose one with the project context and workspace instructions established during discovery.
2. Resolve decisions needing User agreement. Create or update `AGENTS.md` where needed, then check it. Use clear sections, respecting existing organization and unrelated content where present. State orientation as facts and rules as direct instructions, with conditions where needed.{CLAUDE_ONLY: Add an import to an existing workspace `CLAUDE.md` unless it already has one: `@AGENTS.md` at the workspace root, or `@../AGENTS.md` in `.claude/CLAUDE.md`. Keep it outside code blocks and preserve preexisting content. If references would form a cycle, include its correction in the proposal.}

Continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`:

```markdown
# APM Spec

<In three to five sentences: this session’s intended outcomes, the problem it addresses, its scope and its success criteria>

## Notes
<Questions, assumptions and any later-session work per §2>

## <Design Section>
<Design decisions for one part of the work>
...
```

- After Notes, organize the decisions into sections that follow the work's natural structure: its areas, components, boundaries or technical concerns.
- Related decisions share a section; cross-cutting choices get their own. Make each decision concrete.
- Refer to User documents by path and section.
- Use tables for enumerated values, code blocks for schemas and prose for reasons.

### 5.2 Plan Format

The Plan is `.apm/plan.md`.

```markdown
# APM Plan

<One or two sentences on how the work described in the Spec is divided, ordered and assigned, with a reference to the Spec>

## Workers

| Agent | Domain | Description |
|-------|--------|-------------|
| frontend-agent | <Domain> | <What it works on> |

## Stages

| Stage | Name | Tasks | Agents |
|-------|------|-------|--------|
| 1 | <Name> | 1.1–1.3 | frontend-agent, backend-agent |

## Notes
<Coordination across Tasks and any later-session coordination per §3 step 4, referring to the Spec>

## Stage 1: <Name>

### Task 1.1: <Title>

- **Agent:** <worker-slug or manager responsible for the Task>
- **Objective:** <What the Task must achieve>
- **Dependencies:** <Task N.M (Same-Worker); Task N.M by <worker-slug or manager> (Cross-Worker); or None>
- **Output:** <Concrete deliverables and paths>
- **Validation:** <Checks and expected results that establish completion, including checks requiring the User>
- **Guidance:** <Task-specific approach, relevant context and references, and agreed User participation or review points>

1. <Step>
2. <Step>
```

- The Workers table lists only Workers with separate conversations; omit its rows when none are needed.
- Stage names reflect the Stage's areas and main deliverables. List only direct dependencies.
- Steps are ordered actions that produce and validate the deliverables, referring to patterns, files or earlier work where relevant. A research step states its question, sources and required evidence.
- Put each detail in the field or step it serves. Refer to relevant Spec sections for requirements and design decisions.
