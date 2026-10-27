# APM {VERSION} - Work Breakdown Guide

## 1. Overview

**Reading agent:** Planner

Turn approved project context into the Spec, Plan and Rules, in that order. Present concrete proposals with consequential choices and reasons, write each artifact, and obtain its approval before starting the next.

Capture all gathered context where execution will use it: Spec for design decisions and constraints, Plan for work structure and Task detail, Rules for broadly applicable execution standards. Explain any omission. Match detail to project complexity.

## 2. Operational Standards

### 2.1 Workflow Context

The Manager reads Spec and Plan, extracts their content into self-contained Task Prompts, and adds runtime workspace/dependency findings. Workers read their prompts and Rules. They do not read coordination documents.

Put project decisions in locatable Spec sections. Task guidance adds domain-specific constraints and implementation context; reference relevant Spec or authoritative User-document sections. The Manager embeds that content when assigning work. Rules must stand alone without references to Spec, Plan or external design documents.

The Manager handles dispatch, version control conventions and holistic verification. Record observations for its judgment in the Notes sections of the Spec and the Plan; the Manager keeps both current during implementation. The Spec's Notes cover what shapes the design without being a decision: version control observations, workspace constraints, User preferences, and assumptions or open questions. The Plan's Notes cover the work's structure: good dispatch paths, likely blockers, the critical path, convergence points and Stages that may need verification as a whole. Notes explain observations and reasons, not runtime directives.

### 2.2 Decomposition Principles

- Domains reflect expertise and context. Separate distinct expertise; combine tightly shared context and dependencies. When balanced, prefer separation and account for User preferences.
- Stages are sequential milestones: Stage N+1 follows completion of Stage N. Combine artificial divisions; split unrelated streams or intermediate deliverables that block later work. When balanced, prefer fewer clear milestones. Parallel work belongs in Tasks within a Stage.
- Each Task produces a meaningful, independently validatable deliverable within one Worker's domain. Split cross-domain or unrelated work; combine micro-tasks when separation adds only overhead. Include scoped subagent steps for necessary investigation or research.
- Steps are ordered operations sharing the Task's validation. If a step needs independent validation, split the Task.
- Worker work is executable in the development environment. Identify external actions, credentials or human judgment as explicit User coordination needs.
- Validation gives concrete pass/fail measures for each deliverable. Separate autonomous checks from User-dependent criteria and instruct the Worker to pause for required User action or judgment. Keep criteria within the Worker's scope; record holistic verification observations in Plan notes for the Manager.

### 2.3 Spec Standards

The Spec defines what is built and why: choices where alternatives existed, constraints and requirements shaping the project. Its decisions must be implemented by corresponding Plan work. Place supporting implementation detail that leaves a design decision unchanged in Task guidance, and broadly applicable execution patterns in Rules. Decide Worker, Stage and Task structure during the Plan proposal in §3.2.

Reference authoritative requirement documents with paths/sections. Record the workspace structure, distinguishing working targets from read-only references. Organize decisions so the Manager can find and extract relevant content.

### 2.4 Plan Standards

The Plan defines Stages, Tasks, Workers, dependencies, guidance, steps, outputs and validation. Task definitions must supply enough planning substance for the Manager to construct self-contained assignments.

Keep guidance separate from ordered steps. Reference relevant Spec/source sections for design content and add domain-specific context. Prefer boundaries and ordering that support independent work, Same-Worker chains and Cross-Worker parallelism where appropriate; the Manager chooses dispatch modes at runtime.

### 2.5 Rules Standards

Rules describe how to work across all or most Tasks. Output strings, formats, schemas and interface contracts describe what is built and belong in Spec or Task guidance, even when several Workers need them. When uncertain whether a pattern is broadly applicable, keep it in Task guidance.

State the situation each rule applies to, such as “When adding an API route, …”. All Workers read the whole `AGENTS.md`, including content outside APM_RULES. Preserve pre-existing content outside APM_RULES unless the User requests changes; reference relevant existing standards. Keep APM rules self-contained within the Worker's normal context.

## 3. Work Breakdown Procedure

Handle one document at a time, in order: Spec, then Plan, then Rules. For each, present the proposal and material choices and write the file in the same turn, reading the target file first to preserve its existing state. Then stop and ask the User to review it, explaining what comes next. Apply corrections and ask again. Begin the next document only after approval, so problems in one document are caught before the next is written.

### 3.1 Spec Proposal

1. Propose the design decisions, constraints, source references and organization needed for the Spec. Explain consequential choices, assumptions and content-placement boundaries. Include workspace structure from Context Gathering.
2. Read `.apm/spec.md` and write the Spec per §4.1.
3. Ask the User to review the artifact. Apply requested corrections and ask again; on approval continue to the Plan.

### 3.2 Plan Proposal

1. Propose Workers and their domains, sequential Stages and deliverables, and the Tasks needed for each. Explain material boundaries, sequencing and dependencies so the User can assess the breakdown.
2. Define each Task's Worker, objective/scope, guidance, output, validation, dependencies and ordered steps. Include needed User involvement. Reference Spec/source sections for design content and add Task-specific implementation context. Identify the deliverable at each dependency boundary.
3. Verify coverage against gathered context and the approved Spec, independent Task validation, reasonable workload distribution and dependency consistency. A producer with a different Worker is a Cross-Worker dependency. Correct misclassifications and missing work; prepare useful Plan notes.
4. Read `.apm/plan.md` and write it per §4.2.
5. Ask for review with a brief overview of Workers, Stages, Task counts and which work can run in parallel. Correct and repeat review as needed; on approval continue to Rules.

### 3.3 Rules Proposal

1. Propose execution patterns that apply across all or most work, drawing from the approved documents and gathered context. Keep design/output content in Spec or Task guidance; leave version control conventions to the Manager, which adds them to the Rules at its first start. Explain consequential inclusions or exclusions and identify existing standards to reference.
2. Read `AGENTS.md` or confirm its absence. Write the APM_RULES block per §4.3, preserving outside content. If creating the file, write only the block.{CLAUDE_ONLY: If the project has a `CLAUDE.md`, add `@AGENTS.md` at its top so Claude Code loads the Rules.}
3. Ask the User to review. Apply corrections and request approval again as needed. After approval, continue to `{SKILL_PATH:apm-1-initiate-planner}` §5 Planning Phase Completion.

## 4. Structural Specifications

### 4.1 Spec Format

The Spec is `.apm/spec.md`. An APM session may build a whole project or one part of it, so the Spec describes what this session builds.

```markdown
# APM Spec

## Overview
<In three to five sentences: what this APM session builds, the problem it solves, its scope and its success criteria>

## Workspace
<The directory structure, working and reference repositories, authoritative documents and existing `AGENTS.md` content. The Manager later adds each repository's base branch.>

## <Design Section>
<Design decisions for one part of the work>
...

## Notes
<Observations for the Manager per §2.1: version control, workspace constraints, User preferences, assumptions and open questions>
```

Between Workspace and Notes, organize the decisions into sections that follow the work's natural structure: its domains, components, boundaries or technical concerns. Related decisions share a section; cross-cutting choices get their own. Make each decision concrete and easy to find, since the Manager extracts it into Task Prompts. Reference User documents by path and section. Use tables for enumerated values, code blocks for schemas and prose for reasons.

### 4.2 Plan Format

The Plan is `.apm/plan.md`. Name Workers by agent slug, such as `frontend-agent`, everywhere in the Plan.

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
<Observations for the Manager per §2.1: good dispatch paths, likely blockers, the critical path, convergence points and Stages that may need verification as a whole>

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

Stage names reflect the Stage's domains, objectives and main deliverables. List only direct dependencies.

Each step is one operation, in order. Guidance holds the context and constraints that shape the steps; keep it out of the steps themselves. Write steps a Worker can carry out directly, referring to patterns, files or earlier work where relevant. When the Task needs investigation or research, include a step that uses a subagent and states its purpose, scope and expected findings, such as "Use a subagent to verify the current API authentication patterns."

### 4.3 APM_RULES Block

The namespace block structure for `AGENTS.md`:

```text
APM_RULES {

[Project-specific standards below]

} //APM_RULES
```

**Content rules:** Write APM content inside the block; preserve pre-existing content outside it unless the User requests changes. Use markdown headings (`##`) for categories. Each standard must be concrete and actionable. Only universal execution-level patterns - not architecture decisions, Task-specific guidance, or coordination decisions. Reference relevant existing standards outside the block.

---
