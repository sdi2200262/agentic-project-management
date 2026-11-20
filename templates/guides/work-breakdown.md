# APM {VERSION} - Work Breakdown Guide

The Planner uses this guide to turn the approved understanding into the Spec and Plan and resolve `AGENTS.md` changes. `{SKILL_PATH:apm-1-initiate-planner}` §4 covers completion.

Write the Spec and Plan for the Manager and later Manager conversations, with User review and approval. The Manager can consult `AGENTS.md` and referenced sources when preparing self-contained Worker Task Prompts. Use the approved understanding of what the session will deliver to write the Spec and how the work will be delivered to write the Plan. Put lasting workspace guidance in `AGENTS.md`.

Use language the User can review. Record the technical choices and constraints they specify, and describe approaches at the depth they want to review. For choices the User leaves open, state the required results, constraints and checks. Preserve the decisions and findings the Manager needs to coordinate, verify results or brief Workers. Give brief reasons and point to sources for supporting detail that would take significant effort to recover. The Manager uses those sources and the current workspace to fill in the technical context, and the implementing agents decide the details left open within the agreed boundaries.

Use the required formats to express this session's agreed work and decisions. Reuse earlier material that fits, checking it against current sources and decisions. Use Notes for brief context that applies across sections. Distinguish agreements, recommendations and open decisions. Link to the section or source that owns the detail.

The Manager keeps the Spec and Plan current during implementation.

## 1. Review Cycle

Write one document at a time: the Spec, then the Plan. For each:

1. Present the proposed organization and consequential choices, reasons and assumptions.
2. In the same turn, read the target file and write the document. Check it against the approved understanding. When writing the Plan, check that its Tasks can deliver and verify the approved Spec. Check consistency with the other documents and place each detail in its owning document or field.
3. Present each document for approval in chat. For the Spec, explain the outcomes, constraints, consequential design choices and success criteria in terms the User can judge. Distinguish the decisions that need the User’s judgment from supporting detail the agents will use. For Plan approval, summarize the Stages, Tasks, assignments and agreed User involvement. State what the User is approving, link the document, explain what comes next and wait for their review. Apply corrections to all affected documents, including earlier ones, and ask again.

Start the next document only after approval, so a problem in one document is caught before the next is built on it. After Plan approval, review any needed changes to `AGENTS.md` per §4.

## 2. Spec

Define what the session must deliver and what makes the result acceptable. In the work's own terms, record agreed behavior, requirements, delivery outcomes, consequential design choices, and policies or constraints on the result. Name working targets and references that define scope. Include reasons and relevant alternatives where they help the reader understand a decision. For open decisions, name who will settle them.

Write `.apm/spec.md` per §5.1, following the review cycle in §1:

- **Opening:** the session’s goal, scope and success criteria, directly below the title.
- **Notes:** use brief prose for cross-cutting assumptions, rationale, open choices or relevant later-session scope. Use dedicated subsections for agreed supporting document specifications.
- **Design sections:** group requirements and decisions by subject. State the expected behavior and acceptance criteria concretely, with relevant reasons, alternatives and authoritative sources. Record agreed version control conventions, including branch naming and commit message style where applicable, and any constraints on work locations, commits, integration, publication and APM file tracking. Reflect those constraints in the Plan's work and sequencing. The Manager works out the workspace setup.

System behavior, output formats, schemas and interface contracts belong in the Spec. Record how the work will proceed and be checked in the Plan, following the Spec's requirements and constraints. Put Task-specific approach in Guidance and operations in steps.

Keep requirements in the Spec, work in the Plan, live coordination in the Tracker and history in Memory. Supporting documents hold only retained material outside these responsibilities. Agree their purpose, paths under `.apm/`, structure, maintainer and readers with the User, reusing existing documents and conventions and keeping them navigable as the session grows. Record the specification in a dedicated Spec Notes subsection and any implementation work in Plan Tasks. Do not create a second owner for requirements, coordination or history.

## 3. Plan

The Plan divides the work into ordered Stages and Tasks for the Manager or Workers, using the fields in §5.2. A Task’s assignment identifies its responsible agent and APM conversation. Workers carry out their Tasks directly, delegating selected parts where useful. The Manager remains responsible for its Tasks, using subagent workers for substantial implementation and reviewing their results. Direct implementation of that work requires an approach explicitly agreed with the User and recorded in the Plan; contained investigation, small corrections and final checks may be direct.

1. Turn the approved delivery approach into a breakdown. Use what you learned about dependencies, independent progress and shared context to choose assignments, Task results and Stage milestones. Explain boundaries and ordering that affect delivery.
2. Define each Task per §5.2, setting its Agent field to `manager` or a Worker slug per the agreed approach. In Guidance, refer to the relevant Spec or source sections and add Task-specific context, any work the User wants to perform, and agreed review points. The assigned agent remains responsible when the User performs all or part of the work.
3. Check that Tasks cover every Spec outcome and that their assigned agents can execute and validate them. Check assignments, dependencies, sizes and review points against the principles below and agreed involvement. Keep workspace preparation, integration and pushing with the Manager; Workers use prepared workspaces and agreed commit instructions. Same-Worker dependencies have the same assigned agent; Cross-Worker dependencies have different agents, including the Manager. Correct any mismatch.
4. Write `.apm/plan.md` per §5.2. Use brief prose in Notes for arrangements spanning Tasks. Name the affected Tasks and any agreed participation, review points, timing or shared constraints. Describe when suggested coordination options would help. Link to Task fields or Spec sections for details. For later sessions, record relevant sequencing or prerequisites and refer to the Spec for scope.
5. When you ask for review, give a short overview of the Workers, Stages, Task counts and what can run in parallel.

Break the work down by these principles:

- **Assignments** group Tasks between Manager and Worker conversations by the expertise, shared context and User involvement the planned work is likely to need. Keep related work together where familiarity should help, weighing the expected context and coordination demands.
- **Tasks** give one responsible agent a useful result. Include the setup and validation that result needs. Combine small pieces of continuous work. Split work when size, complexity, uncertainty, dependencies, expertise or useful parallelism justify the extra coordination. Consider what is useful to batch and what can proceed independently. Follow Context Gathering §3 for bounded technical investigation. If it belongs in a Task, name its questions, evidence, completion checks and affected dependencies.
- **Stages** group results that can be assessed together. Use dependencies, shared context and natural sequencing to choose groups that keep work moving. Prefer fewer Stages for small sessions. In larger sessions, use meaningful milestones and weigh what each boundary makes possible against what it holds back. Use Task dependencies to order work within a Stage and put reviews there when they concern part of its work. Stage N+1 starts after Stage N is complete and the User explicitly agrees to advance, unless a different arrangement is explicitly agreed.
- **User actions.** Agents work in the development environment. Name outside actions, credentials or human judgement as explicit points where the User is needed.
- **Validation** gives observable checks and expected results for each Task's output, including research or testing results. Separate checks the assigned agent can run alone from those that need the User, and tell that agent to pause affected work for them. Keep checks within the assigned work; put additional Stage verification in the Plan's Notes.

Identify what can start together and which steps depend on earlier results or external prerequisites. Record the agreed handling of unresolved prerequisites. Label required validation and User or outside review points clearly, including relevant timing constraints and agreed update frequency. Dispatch opportunities are suggestions; the Manager chooses actual coordination within the agreed constraints. Leave routine subagent and independent review arrangements to the implementation roles.

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
<Brief cross-cutting assumptions, rationale, open choices or later-session scope. Use dedicated subsections for supporting document specifications per §2.>

## <Design Section>
<Agreed behavior, constraints and acceptance criteria for this part of the work, with relevant decisions, reasons and sources>
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
<Affected Tasks, agreed User involvement or shared constraints, and any conditions that make a coordination option useful. Link to details per §3 step 4.>

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
- Name each Stage for its main result. List only direct dependencies.
- Write ordered, Task-specific actions that produce and validate the deliverables, referencing shared procedures for common details. Shared coordination belongs in Notes. A research step states its question, sources and required evidence.
- Put each detail in the field or step it serves. Refer to relevant Spec sections for requirements and design decisions.
