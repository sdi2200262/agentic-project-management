# APM {VERSION} - Work Breakdown Guide

This guide covers Work Breakdown: turning the approved understanding into the Spec, the Plan and the Rules, in that order. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers what follows.

The Manager reads the Spec and Plan and copies what each Task needs into a self-contained Task Prompt. Workers read only their Task Prompts and the Rules. So put every piece of gathered context where the work will use it: design decisions and constraints in the Spec, the work's structure and Task detail in the Plan, and conventions for all or most work in the Rules. If you leave something out, say why. Match the level of detail to the work's complexity.

Both the Spec and the Plan end with Notes for the Manager, which it keeps current during implementation. Notes explain observations and their reasons for the Manager's judgement.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan, then the Rules. For each:

1. Present your proposal with its consequential choices and reasons.
2. In the same turn, read the target file and write the document.
3. Stop and ask the User to review it, saying what comes next. Apply corrections and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it.

## 2. Spec

The Spec says what is built and why: decisions where alternatives existed, and the constraints and requirements that shape the work. The Plan must implement every decision in it.

1. Propose the design decisions, constraints, references to source documents and how you will organize them. Explain the choices and assumptions that matter.
2. Write `.apm/spec.md` per §5.1:
   - **Overview:** what this APM session builds.
   - **Workspace:** working targets and read-only references, authoritative documents with paths and sections, and existing `AGENTS.md` content.
   - **Design sections:** organized so the Manager can find each decision and copy it into Task Prompts.
   - **Notes:** what shapes the design without being a decision: version control observations, workspace constraints, User preferences, assumptions, open questions, and the work left for later sessions.

Implementation detail that leaves a design decision unchanged goes in a Task's Guidance, and conventions for all or most work go in the Rules.

## 3. Plan

The Plan divides the work into Workers, Stages and Tasks, with dependencies, guidance, steps, output and validation, so the Manager can build self-contained Task Prompts from it.

1. Propose the Workers and their areas, the Stages and their deliverables, and the Tasks in each. Explain the boundaries, order and dependencies that matter.
2. Define each Task per §5.2, including any User involvement. In Guidance, refer to the relevant Spec or source sections and add Task-specific context.
3. Check the breakdown against the gathered context and the approved Spec: every decision has work, every Task can be validated on its own, workloads are reasonable and dependencies are consistent. A dependency on a Task with a different Worker is Cross-Worker. Fix what you find.
4. Write `.apm/plan.md` per §5.2, with Notes on good dispatch paths, likely blockers, the critical path, where work converges and which Stages may need verification as a whole.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Workers** follow expertise and context. Separate distinct expertise; combine areas that share context and dependencies. When it is balanced, prefer separation and follow the User's preferences.
- **Stages** are milestones in order: Stage N+1 starts after Stage N is complete. Merge artificial divisions, and split unrelated streams or intermediate deliverables that block later work. When it is balanced, prefer fewer, clear Stages. Parallel work belongs in Tasks within a Stage.
- **Tasks** each produce a meaningful deliverable that can be validated on its own, within one Worker's area. Split work that spans areas; combine tiny Tasks whose separation adds only overhead. Where investigation or research is needed, include a step that uses a subagent.
- **Steps** are ordered operations that share the Task's validation. If a step needs its own validation, split the Task.
- **User actions.** Workers work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives concrete pass/fail checks for each deliverable. Separate checks the Worker can run alone from those that need the User, and tell the Worker to pause for them. Keep checks within the Worker's scope; put verification across Tasks in the Plan's Notes.

Prefer boundaries and order that allow independent work, Same-Worker chains and parallel Workers; the Manager chooses the dispatch during implementation.

## 4. Rules

The Rules describe how to work across all or most Tasks. Every Worker reads the whole of `AGENTS.md`, including content outside the `APM_RULES` block.

1. Propose the conventions, drawn from the approved documents and the gathered context. Leave version control conventions to the Manager, which adds them at its first start. Explain what you include or leave out, and which existing standards you refer to.
2. Read `AGENTS.md`, or confirm it does not exist, and write the `APM_RULES` block per §5.3. Keep content outside the block unless the User asks for changes. If you create the file, write only the block.{CLAUDE_ONLY:

   For Claude Code, check whether `AGENTS.md` loads as project instructions. Native loading needs v2.1.277 or later. By default, `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` in the working directory or its ancestors blocks it; the user-level `~/.claude/CLAUDE.md` is exempt. The Project instructions setting can change this behavior. Keep the existing setup when `AGENTS.md` already loads.

   Otherwise, add `@AGENTS.md` to an existing workspace-root `CLAUDE.md`, or `@../AGENTS.md` to an existing `.claude/CLAUDE.md`, preserving its content. If neither exists and native loading is unavailable or blocked, create a workspace-root `CLAUDE.md` containing only `@AGENTS.md`. Keep imports outside code blocks. If project instructions are disabled, ask the User to enable them.

   Explain any new file or import when presenting the Rules. Have the User check `/memory` in a fresh Claude Code chat to confirm the Rules loaded.
}
3. After approval, continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

Each Rule says when it applies, such as "When adding an API route, …", and stands alone without references to the Spec, Plan or design documents. Output strings, formats, schemas and interface contracts describe what is built, so they belong in the Spec or a Task's Guidance even when several Workers need them; when unsure, keep a pattern in Guidance.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`:

```markdown
# APM Spec

## Overview
<In three to five sentences: what this APM session builds, the problem it solves, its scope and its success criteria>

## Workspace
<The folder structure, working and reference repositories, authoritative documents and existing `AGENTS.md` content. The Manager later adds each repository's base branch.>

## <Design Section>
<Design decisions for one part of the work>
...

## Notes
<Observations for the Manager per §2>
```

Between Workspace and Notes, organize the decisions into sections that follow the work's natural structure: its areas, components, boundaries or technical concerns. Related decisions share a section; cross-cutting choices get their own. Make each decision concrete. Refer to User documents by path and section. Use tables for enumerated values, code blocks for schemas and prose for reasons.

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
- **Output:** <Concrete deliverables: files, components, artifacts>
- **Validation:** <Concrete pass/fail checks, and where the User is needed>
- **Guidance:** <Technical constraints, approach, references to existing patterns and Spec sections>

1. <Step>
2. <Step>
```

Stage names reflect the Stage's areas and main deliverables. List only direct dependencies.

Each step is one operation a Worker can carry out directly, in order, referring to patterns, files or earlier work where relevant. Keep context and constraints in Guidance. A subagent step states its purpose, scope and expected findings, such as "Use a subagent to verify the current API authentication patterns."

### 5.3 APM_RULES Block

```text
APM_RULES {

[Conventions for this work below]

} //APM_RULES
```

Write inside the block only, with `##` headings for categories. Each Rule is concrete and actionable, and covers execution conventions shared by all or most Tasks. Refer to relevant existing standards outside the block.
