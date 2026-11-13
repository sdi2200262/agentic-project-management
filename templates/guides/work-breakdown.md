# APM {VERSION} - Work Breakdown Guide

The Planner uses this guide to develop the breakdown during Context Gathering, turn the approved understanding into the Spec and Plan, and resolve `AGENTS.md` changes. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers completion.

Write the Spec and Plan for the Manager and later Manager conversations, with User review and approval. They can consult `AGENTS.md` and referenced sources; keep agreed requirements and decisions explicit and link supporting detail. The Manager supplies self-contained Worker Task Prompts. Requirements and design belong in the Spec, work structure in the Plan, and lasting guidance in `AGENTS.md`.

The Manager keeps the Spec and Plan current during implementation.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan. For each:

1. Present the proposed organization and consequential choices, reasons and assumptions.
2. In the same turn, read the target file and write the document. Check that it defines the agreed outcomes and the work needed to deliver them. Check consistency with the other documents and place each detail in its owning document or field.
3. Stop and ask the User to review it, saying what comes next. Apply corrections, check their effects on earlier documents and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it. After Plan approval, review any needed changes to `AGENTS.md` per §4.

## 2. Spec

The Spec states intended outcomes, requirements, design and constraints with their reasons, in the work’s own terms. The Plan assigns work and validation to achieve them.

Write `.apm/spec.md` per §5.1, following the review cycle in §1:

- **Opening:** the session’s goal, scope and success criteria, directly below the title.
- **Notes:** unresolved questions and assumptions. If later sessions were discussed, briefly record the work left for them and why.
- **Design sections:** session requirements, policies, design decisions and constraints, with their reasons and authoritative source paths and sections, organized so the Manager can find them and copy them into Task Prompts. Name working targets and references where they define this session's scope. Record the agreed version-control arrangement, including work locations, commit and integration timing, and APM file tracking.

System behavior, output formats, schemas and interface contracts belong in the Spec. Implementation approach that leaves a design decision unchanged goes in a Task's Guidance, operations go in steps, and durable workspace conventions go in `AGENTS.md`.

Keep requirements in the Spec, work in the Plan, live coordination in the Tracker and history in Memory. Supporting documents hold only retained material outside these responsibilities. Agree their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents and conventions and keeping them navigable as the session grows. Record the arrangement in this session’s Spec and any implementation work in Plan Tasks.

## 3. Plan

The Plan divides the work into ordered Stages and Tasks for the Manager or Workers, using the fields in §5.2. A Task’s assignment identifies its responsible agent and APM conversation. Workers carry out their Tasks directly, delegating selected parts where useful; the Manager uses subagent workers for substantial implementation and may handle small corrections and final checks directly.

1. Refine the breakdown developed during Context Gathering: Worker areas, Stage deliverables and Tasks. Explain consequential boundaries, order and dependencies.
2. Define each Task per §5.2, setting its Agent field to `manager` or a Worker slug per the agreed approach. In Guidance, refer to the relevant Spec or source sections and add Task-specific context, any work the User wants to perform, and agreed review points. The assigned agent remains responsible when the User performs all or part of the work.
3. Check that Tasks cover every Spec outcome and that their assigned agents can execute and validate them. Check assignments, dependencies, sizes and review points against the principles below and agreed involvement. Keep workspace preparation, integration and pushing with the Manager; Workers use prepared workspaces and agreed commit instructions. Same-Worker dependencies have the same assigned agent; Cross-Worker dependencies have different agents, including the Manager. Correct any mismatch.
4. Write `.apm/plan.md` per §5.2. Keep Notes to necessary coordination across Tasks: shared constraints, participation or review arrangements, dispatch opportunities and Stage verification. Name affected work and checks. Keep Task-specific dependencies and validation in their fields, and refer to Spec questions. If later sessions were discussed, briefly record relevant sequencing or prerequisites, referring to the Spec for scope.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Assignments** group Tasks between Manager and Worker conversations by the expertise, shared context and User involvement the planned work is likely to need. Keep related work together where familiarity should help, weighing the expected context and coordination demands.
- **Stages** are ordered milestones: Stage N+1 starts after Stage N is complete. Choose boundaries around coherent outcomes or meaningful review. Keep independent Tasks together when no useful milestone requires a barrier.
- **Tasks** give one responsible agent a clear output and validation. Boundaries reflect size, complexity, uncertainty, dependencies and expertise; research, implementation and validation may share or span Tasks. Explain consequential boundaries. Investigate consequential uncertainty before dependent work; research Tasks need questions, evidence, completion criteria and dependent decisions identified. Define dependent Tasks as far as answers allow; assigned agents organize execution within their roles.
- **User actions.** Agents work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives observable checks and expected results for each Task's output, including research or testing results. Separate checks the assigned agent can run alone from those that need the User, and tell that agent to pause affected work for them. Keep checks within the assigned work; put additional Stage verification in the Plan's Notes.

Identify what can run independently and what depends on earlier results or external prerequisites. Record the agreed handling of unresolved prerequisites. Label required validation and User or outside review points clearly, including relevant timing constraints and agreed update frequency. Dispatch opportunities are suggestions; the Manager chooses actual coordination within the agreed constraints. Leave routine subagent and independent review arrangements to the implementation roles.

## 4. AGENTS.md

Keep `AGENTS.md` useful across sessions: brief orientation, repository paths, working and read-only boundaries and workspace conventions. Workers read it in full, so it must stand alone without access to the Spec or Plan. The Manager and Workers maintain it under User authorization.

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
| <worker-slug> | <Domain> | <What it works on> |

## Stages

| Stage | Name | Tasks | Agents |
|-------|------|-------|--------|
| 1 | <Name> | <Task IDs> | <Assigned agents> |

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
- Write ordered, Task-specific actions that produce and validate the deliverables, referencing shared procedures for common details. Shared coordination belongs in Notes. A research step states its question, sources and required evidence.
- Put each detail in the field or step it serves. Refer to relevant Spec sections for requirements and design decisions.
