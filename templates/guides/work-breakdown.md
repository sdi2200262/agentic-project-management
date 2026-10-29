# APM {VERSION} - Work Breakdown Guide

This guide covers Work Breakdown: developing the work structure during Context Gathering, then turning the approved understanding into the Spec, the Plan and the Rules, in that order. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers what follows.

The Manager reads the Spec and Plan and copies what each Task needs into a self-contained Task Prompt. Workers read only their Task Prompts and the Rules. Put requirements, design decisions and constraints in the Spec, work structure and Task detail in the Plan, and shared Worker execution conventions in the Rules. Preserve the context each assignment needs, with detail matched to the work's complexity. APM coordination procedures live in the role guides.

Both the Spec and the Plan place Notes after their introductory and reference material, before the main body. Spec Notes explain design assumptions and context; Plan Notes explain coordination choices for the Manager, which keeps both current during implementation. Settled requirements, constraints, dependencies and conventions belong in their authoritative sections; remove Notes made redundant by those sections.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan, then the Rules. For each:

1. Present your proposal with its consequential choices and reasons.
2. In the same turn, read the target file and write the document. Check coverage of the agreed work, consistency with the other documents and whether content belongs in this document.
3. Stop and ask the User to review it, saying what comes next. Apply corrections, check their effects on earlier documents and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it.

## 2. Spec

The Spec says what is built and why: decisions where alternatives existed, and the constraints and requirements that shape the work. State these in the work's own terms. The Plan must implement every decision in it.

1. Propose the design decisions, constraints, references to source documents and how you will organize them. Explain the choices and assumptions that matter.
2. Write `.apm/spec.md` per §5.1:
   - **Overview:** what this APM session builds.
   - **Workspace:** working targets and read-only references, agreed Git use, base branches, branch naming and APM file tracking, authoritative documents with paths and sections, and existing `AGENTS.md` content.
   - **Notes:** design assumptions, open questions, reasons behind constraints and context for work left to later sessions.
   - **Design sections:** settled design decisions and constraints, organized so the Manager can find them and copy them into Task Prompts.

Implementation detail that leaves a design decision unchanged goes in a Task's Guidance, and shared Worker execution conventions go in the Rules.

## 3. Plan

The Plan divides the work into Workers, Stages and Tasks, with dependencies, guidance, steps, output and validation, so the Manager can build self-contained Task Prompts from it.

1. Carry forward the breakdown developed during Context Gathering. Propose or refine the Workers and their areas, the Stages and their deliverables, and the Tasks in each. Explain the boundaries, order and dependencies that matter.
2. Define each Task per §5.2, including any User involvement. In Guidance, refer to the relevant Spec or source sections and add Task-specific context.
3. Check the breakdown against the gathered context and the approved Spec: every decision has work, each Task's output has clear validation, assignments match each Worker's domain and dependencies are consistent. A dependency on a Task with a different Worker is Cross-Worker. Fix what you find.
4. Write `.apm/plan.md` per §5.2, with Notes explaining project-specific dispatch choices, shared-resource constraints, likely blockers, integration points and Stage verification. Name the Stages and checks involved. Keep explicit dependencies and validation criteria in Task fields.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Workers** follow expertise and context. Weigh the benefit of specialization against the context sharing and coordination it requires.
- **Stages** are milestones in order: Stage N+1 starts after Stage N is complete. Choose milestones around dependencies and meaningful review points. Parallel work belongs in Tasks within a Stage.
- **Tasks** define work one Worker can carry out and report for review, with a clear output and validation. Choose boundaries according to size, complexity, uncertainty, dependencies and expertise. Research, implementation and validation may share a Task or need separate Tasks. Explain the boundaries that affect how the work proceeds. Where investigation or research is needed, state the question and required evidence; the executing agent chooses whether to delegate.
- **Steps** are ordered operations toward the Task's output. Their checks contribute to validating that deliverable.
- **User actions.** Workers work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives observable checks and expected results for each Task's output, including research or testing results. Separate checks the Worker can run alone from those that need the User, and tell the Worker to pause for them. Keep checks within the assigned work; put additional Stage verification in the Plan's Notes.

Identify what can run independently and what must wait for earlier results. The Manager chooses dispatches during implementation within the agreed constraints.

## 4. Rules

The Rules hold shared Worker execution conventions. Every Worker reads the whole of `AGENTS.md`, including content outside the `APM_RULES` block. Rules give each Worker enough context to apply these conventions without reading the Spec or Plan.

1. Propose the conventions, drawn from the approved documents and the gathered context, including the agreed commit conventions for each working repository. Explain what you include or leave out, and which existing standards you refer to.
2. Read `AGENTS.md`, or confirm it does not exist, and write the `APM_RULES` block per §5.3. Keep content outside the block unless the User asks for changes. If you create the file, write only the block.{CLAUDE_ONLY: If the workspace has an existing `CLAUDE.md`, add an import of the workspace-root `AGENTS.md` unless it already has one. Use `@AGENTS.md` in a workspace-root `CLAUDE.md`, or `@../AGENTS.md` in `.claude/CLAUDE.md`. Preserve existing content and keep the import outside code blocks.}
3. After approval, apply the repository setup and APM file tracking agreed in the Spec's Workspace section. Initialize missing repositories only where approved. Then continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

Each Rule states when it applies and the execution practice to follow, standing alone without references to the Spec or Plan. System behavior, output formats, schemas and interface contracts belong in the Spec; Task-specific implementation approach belongs in Guidance.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`:

```markdown
# APM Spec

## Overview
<In three to five sentences: what this APM session builds, the problem it solves, its scope and its success criteria>

## Workspace
<The folder structure, working and reference repositories, agreed Git use, base branches, branch naming and APM file tracking, authoritative documents and existing `AGENTS.md` content>

## Notes
<Assumptions and context for the Manager per §2>

## <Design Section>
<Design decisions for one part of the work>
...
```

After Notes, organize the decisions into sections that follow the work's natural structure: its areas, components, boundaries or technical concerns. Related decisions share a section; cross-cutting choices get their own. Make each decision concrete. Refer to User documents by path and section. Use tables for enumerated values, code blocks for schemas and prose for reasons.

### 5.2 Plan Format

The Plan is `.apm/plan.md`. Name Workers by agent slug, such as `frontend-agent`, everywhere in it.

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
<Observations for the Manager per §3 step 4, and work left for later sessions>

## Stage 1: <Name>

### Task 1.1: <Title>

- **Agent:** <agent-slug>
- **Objective:** <The Task's goal in one sentence>
- **Dependencies:** <Task N.M (Same-Worker); Task N.M by <agent-slug> (Cross-Worker); or None>
- **Output:** <Concrete deliverables and paths>
- **Validation:** <Observable checks and expected results for this output, and where the User is needed>
- **Guidance:** <Task-specific constraints and approach, relevant findings, and Spec or source references>

1. <Step>
2. <Step>
```

Stage names reflect the Stage's areas and main deliverables. List only direct dependencies.

Each step is one operation a Worker can carry out directly, in order, referring to patterns, files or earlier work where relevant. Guidance states technical context and approach in the work's own terms. Use short lists when several checks or findings need separate treatment. A research step states its question, sources and required evidence, such as "Verify the current API authentication patterns against the route handlers and tests."

### 5.3 APM_RULES Block

```text
APM_RULES {

[Shared Worker execution conventions]

} //APM_RULES
```

Write inside the block only, with `##` headings for categories. Each Rule is concrete and actionable, and covers shared Worker execution conventions. Refer to relevant existing standards outside the block.
