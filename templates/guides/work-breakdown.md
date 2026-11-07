# APM {VERSION} - Work Breakdown Guide

This guide covers Work Breakdown: developing the work structure during Context Gathering, turning the approved understanding into the Spec and Plan, and reviewing needed additions or changes to `AGENTS.md`. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers what follows.

The Manager reads the Spec and Plan and copies what each Worker-assigned Task needs into a self-contained Task Prompt. Workers read only their Task Prompts and `AGENTS.md`. Put requirements, design decisions and constraints in the Spec, work structure and Task detail in the Plan, and persistent workspace conventions in `AGENTS.md`. Preserve the context each assignment needs, with detail matched to the work's complexity. APM coordination procedures live in the role guides.

Both the Spec and the Plan place Notes after their introductory and reference material, before the main body. Spec Notes explain design assumptions and context; Plan Notes explain coordination choices for the Manager, which keeps both current during implementation. Settled requirements, constraints, dependencies and conventions belong in their authoritative sections; remove Notes made redundant by those sections.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan. For each:

1. Present your proposal with its consequential choices and reasons.
2. In the same turn, read the target file and write the document. Check coverage of the agreed work, consistency with the other documents and whether content belongs in this document.
3. Stop and ask the User to review it, saying what comes next. Apply corrections, check their effects on earlier documents and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it. After Plan approval, review any needed changes to `AGENTS.md` per §4.

## 2. Spec

The Spec says what is built and why: decisions where alternatives existed, and the constraints and requirements that shape the work. State these in the work's own terms. The Plan must implement every decision in it.

1. Propose the design decisions, constraints, references to source documents and how you will organize them. Explain the choices and assumptions that matter.
2. Write `.apm/spec.md` per §5.1:
   - **Overview:** what this APM session builds.
   - **Notes:** design assumptions, unresolved questions and context for work left to later sessions.
   - **Design sections:** session requirements, design decisions and constraints, with their reasons and authoritative source paths and sections, organized so the Manager can find them and copy them into Task Prompts. Name working targets and references where they define this session's scope. Record the agreed Git setup and constraints for the session's repositories, including Git use, base branches and APM file tracking.

System behavior, output formats, schemas and interface contracts belong in the Spec. Implementation approach that leaves a design decision unchanged goes in a Task's Guidance, operations go in steps, and durable workspace conventions go in `AGENTS.md`.

## 3. Plan

The Plan divides the work into Stages and Tasks for the Manager or Workers, with dependencies, guidance, steps, output and validation, so the Manager can build self-contained Task Prompts from it.

1. Carry forward the breakdown developed during Context Gathering. Propose or refine the Workers and their areas, the Stages and their deliverables, and the Tasks in each. Explain the boundaries, order and dependencies that matter.
2. Define each Task per §5.2, setting its Agent field to `manager` or a Worker slug per the agreed approach. In Guidance, refer to the relevant Spec or source sections and add Task-specific context, any work the User wants to perform, and agreed review points. The assigned agent remains responsible when the User performs all or part of the work.
3. Check the breakdown against the gathered context and the approved Spec: every decision has work, each Task's output has clear validation, assignments fit the work, Task sizes and review points match the agreed User involvement, and dependencies are consistent. A dependency on a Task with a different assigned agent is Cross-Worker. Fix what you find.
4. Write `.apm/plan.md` per §5.2, with Notes explaining coordination preferences and review points, unresolved questions and anticipated difficulties, including shared-resource constraints, likely blockers, integration points, possible batch or parallel dispatches and Stage verification. Explain their effects on later work and name the Stages and checks involved. Keep explicit dependencies and validation criteria in Task fields; refer to Spec questions rather than repeating them.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Workers** follow expertise and context. Weigh the benefit of specialization against the context sharing and coordination it requires.
- **Stages** are milestones in order: Stage N+1 starts after Stage N is complete. Choose milestones around dependencies and meaningful review points. Parallel work belongs in Tasks within a Stage.
- **Tasks** define work the Manager or one Worker is responsible for completing, with a clear output and validation. Choose boundaries according to size, complexity, uncertainty, dependencies and expertise. Research, implementation and validation may share a Task or need separate Tasks. Explain the boundaries that affect how the work proceeds. Investigate consequential uncertainty before work that depends on it. Where investigation or research is needed, state the question and required evidence; the executing agent chooses whether to delegate.
- **Steps** are ordered operations toward the Task's output. Their checks contribute to validating that deliverable.
- **User actions.** Agents work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives observable checks and expected results for each Task's output, including research or testing results. Separate checks the assigned agent can run alone from those that need the User, and tell that agent to pause for them. Keep checks within the assigned work; put additional Stage verification in the Plan's Notes.

Identify what can run independently and what must wait for earlier results. Dispatch opportunities are suggestions; the Manager chooses actual dispatches from the current state within the agreed constraints.

## 4. AGENTS.md

Maintain `AGENTS.md` for the project and workspace across sessions: brief orientation, repository paths and working versus read-only reference boundaries, and applicable conventions for coding, testing and commits. Every Worker reads the whole file; its instructions must stand alone without requiring the Spec or Plan. Keep content concise and useful beyond this session, without duplicating existing guidance. The Manager and Workers maintain it as the project develops.

1. Review existing `AGENTS.md` and any applicable guidance. Suggest additions where needed, or corrections when discovery reveals inconsistencies or outdated instructions. Explain the evidence for changes. If the file is missing, propose one with the project context and workspace instructions established during discovery.
2. Present the proposal and resolve decisions needing User agreement. Create or update `AGENTS.md`, then check it. Use clear sections, respecting existing organization and unrelated content where present. State orientation as facts and rules as direct instructions, with conditions where needed.{CLAUDE_ONLY: Add an import to an existing workspace `CLAUDE.md` unless it already has one: `@AGENTS.md` at the workspace root, or `@../AGENTS.md` in `.claude/CLAUDE.md`. Keep it outside code blocks and preserve preexisting content. If references would form a cycle, include its correction in the proposal.}

Continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`:

```markdown
# APM Spec

## Overview
<In three to five sentences: what this APM session builds, the problem it solves, its scope and its success criteria>

## Notes
<Assumptions, unresolved questions and context for the Manager per §2>

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

<One or two sentences on what this APM session builds>

## Workers

| Agent | Domain | Description |
|-------|--------|-------------|
| frontend-agent | <Domain> | <What it works on> |

## Stages

| Stage | Name | Tasks | Agents |
|-------|------|-------|--------|
| 1 | <Name> | 1.1–1.3 | frontend-agent, backend-agent |

## Notes
<Coordination considerations per §3 step 4, and work left for later sessions>

## Stage 1: <Name>

### Task 1.1: <Title>

- **Agent:** <worker-slug or manager>
- **Objective:** <The Task's goal in one sentence>
- **Dependencies:** <Task N.M (Same-Worker); Task N.M by <worker-slug or manager> (Cross-Worker); or None>
- **Output:** <Concrete deliverables and paths>
- **Validation:** <Observable checks and expected results for this output, and where the User is needed>
- **Guidance:** <Task-specific constraints and approach, relevant findings, and Spec or source references>

1. <Step>
2. <Step>
```

- The Workers table lists only Workers with separate conversations; omit its rows when none are needed.
- Stage names reflect the Stage's areas and main deliverables. List only direct dependencies.
- Each step is one operation the assigned agent can carry out or delegate to a subagent, in order, referring to patterns, files or earlier work where relevant. A research step states its question, sources and required evidence.
- Guidance states technical context and approach in the work's own terms, adding only what the other fields and steps do not cover. Use short lists when several checks or findings need separate treatment.
