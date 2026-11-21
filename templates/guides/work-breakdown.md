# APM {VERSION} - Work Breakdown Guide

The Planner uses this guide to turn the approved understanding into the Spec and Plan and resolve `AGENTS.md` changes.

Write both documents for User review and for the Manager, including later Manager conversations. The Manager keeps them current during implementation and can use them, `AGENTS.md` and referenced sources to prepare self-contained Worker Task Prompts.

Use language the User can review. Record the technical choices and constraints they specify, and describe approaches at the depth they want to review. For choices left open, state the required results, constraints and checks. Preserve consequential findings with brief reasons and source references. The Manager uses those sources and the current workspace to fill in technical context. The implementing agents decide the details left open within the agreement.

## 1. Review Cycle

Write and obtain approval for the Spec, then do the same for the Plan. Use this cycle for each document.

1. Present the proposed organization and consequential choices, reasons and assumptions.
2. In the same turn, read the target file and write the draft. Reuse material that fits after checking it against current sources and decisions. Distinguish agreements, recommendations and open choices.
3. Check the draft against the approved understanding and any document already approved for this session. Use the checks in §2 or §3 and put each detail in the field or document it serves.
4. Present the document in chat as described in §2 or §3. Link it, explain what the User is approving and what comes next, then ask for explicit approval and wait.
5. Apply corrections to all affected documents, including earlier ones. Check the changes, present the revised document and obtain explicit approval before continuing.

After Plan approval, resolve any `AGENTS.md` changes per §4.

## 2. Spec

Write `.apm/spec.md` per §5.1 from the approved understanding of what the session will deliver.

Organize requirements and design choices by subject. Name the working targets and authoritative sources. Record agreed behavior, output formats, schemas, interface contracts, constraints and acceptance criteria with the decisions they concern. Include brief reasons and relevant alternatives. Name who will settle open choices.

Record the session's version control agreement, including branch and commit conventions and constraints on work locations, commits, integration, publication and APM file tracking. Carry its effects on work and sequencing into the Plan.

Use Notes for brief context that applies across subjects, such as assumptions, reasons, open choices or later-session scope. When an alternative still matters, explain why and say whether the choice is open or settled.

Use supporting documents for retained material with a purpose outside the Spec, Plan, Tracker and Memory. Agree each document's purpose, path under `.apm/`, structure, maintainer and readers with the User. Reuse suitable documents and conventions and keep them easy to navigate as they grow. Put each specification in a dedicated Spec Notes subsection and its implementation work in Plan Tasks.

Check that the Spec defines the agreed outcomes and makes clear how to judge the result.

Present the expected behavior and what counts as success. Call out the design choices and constraints the User is approving. Separate decisions that need their judgment from supporting detail the agents will use.

## 3. Plan

Write `.apm/plan.md` per §5.2 from the approved understanding of how the work will proceed and the approved Spec.

Organize the work by assignment, Task result and Stage milestone.

- **Assignments.** Assign each Task to the Manager or one Worker. Weigh expertise, shared context and agreed User involvement. Keep related work together when familiarity helps, accounting for context and coordination costs. The assigned agent remains responsible when the User performs any part of the work.
- **Tasks.** Give each Task a useful result with its setup and checks. Combine small pieces of continuous work. Split work when size, complexity, uncertainty, dependencies, expertise or useful parallelism justify the coordination. Consider which work benefits from batching. For bounded technical investigation, follow `{GUIDE_PATH:context-gathering}` §3 and state the completion checks and affected dependencies.
- **Stages.** Group results that can be assessed together. Use dependencies, shared context and natural sequencing to keep work moving. Prefer fewer Stages for small sessions. In larger sessions, weigh what each milestone makes possible against what it holds back. Use Task dependencies to order work within a Stage and place reviews there when they concern part of the work. Each new Stage starts after the previous one is complete and the User explicitly agrees to advance, unless a different arrangement was explicitly agreed.

Record the agreed delivery approach. The Manager prepares workspaces, integrates work and pushes changes. Workers carry out their Tasks in prepared workspaces, follow agreed commit instructions and may delegate selected parts. The Manager uses subagents for substantial implementation and reviews their results. The Manager may carry out substantial work directly when the User explicitly agrees and the Plan records that arrangement. The Manager may handle contained investigation, small corrections and final checks directly. Let the implementation roles choose and group subagents and arrange routine independent reviews.

Identify what can start together, what needs an earlier result or outside prerequisite, and what lets affected work resume. Record the agreed response if prerequisites remain unresolved. Give each Task observable checks for its own result, with expected results, timing and who runs them. Identify required User or outside reviews, actions and credentials. Say when affected work pauses for their input.

Use Notes to record arrangements spanning Tasks in brief prose. Name the affected work and agreed involvement, review points, timing, update frequency, shared constraints and additional Stage checks. Link to Task fields, Spec sections or shared procedures for details. For later sessions, record relevant sequencing and prerequisites and refer to the Spec for scope.

Present options such as parallel work or batching as recommendations and say when they would help. Describe potential blockers as observations. Say when they could arise and what work they could affect. The Manager decides how to dispatch when the work is ready, within the agreed Plan.

Check that the Tasks deliver and verify every approved Spec outcome and that each assigned agent can carry out and check its work. Check assignments, dependencies, sizes and review points against the agreed approach.

Present the Stages, Task counts, assignments, parallel work and agreed User involvement. Explain what each Stage lets the User assess and what work waits at its boundary.

## 4. AGENTS.md

Keep `AGENTS.md` useful across sessions. Include brief orientation, repository paths, working and read-only boundaries and workspace conventions. The Manager and Workers read it in full and maintain it under User authorization. Write it as a standalone reference for Workers.

1. Review existing `AGENTS.md` and any applicable guidance. Propose concise additions or corrections that help future work, extending or replacing existing guidance where possible. Explain the evidence for changes, or why existing guidance is sufficient. If the file is missing, propose one with the project context and workspace instructions established during discovery.
2. Resolve decisions needing User agreement. Create or update `AGENTS.md` where needed, then check it. Use clear sections, respecting existing organization and unrelated content where present. State orientation as facts and rules as direct instructions, with conditions where needed.{CLAUDE_ONLY: Add an import to an existing workspace `CLAUDE.md` unless it already has one: `@AGENTS.md` at the workspace root, or `@../AGENTS.md` in `.claude/CLAUDE.md`. Keep it outside code blocks and preserve preexisting content. If references would form a cycle, include its correction in the proposal.}

Continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`.

```markdown
# APM Spec

<In three to five sentences: this session’s intended outcomes, the problem it addresses, its scope and its success criteria>

## Notes

<Context that applies across subjects and any supporting document specifications per §2>

## <Design Section>

<Agreed requirements and design for this subject per §2>
...
```

- Refer to User documents by path and section.
- Use tables for enumerated values, code blocks for schemas and prose for reasons.

### 5.2 Plan Format

The Plan is `.apm/plan.md`.

```markdown
# APM Plan

<One or two sentences on how the work described in the Spec is divided, ordered and assigned, with a reference to the Spec>

## Agents

| Agent | Domain | Description |
|-------|--------|-------------|
| manager | <Domain> | <What it works on> |
| <worker-slug> | <Domain> | <What it works on> |

## Stages

| Stage | Name | Tasks | Agents |
|-------|------|-------|--------|
| 1 | <Name> | <Task IDs> | <Assigned agents> |

## Notes

<Arrangements spanning Tasks per §3>

## Stage 1: <Name>

### Task 1.1: <Title>

- **Agent:** <worker-slug or manager responsible for the Task>
- **Objective:** <What the Task must achieve>
- **Dependencies:** <Task N.M (Same-Agent); Task N.M by <worker-slug or manager> (Cross-Agent); or None>
- **Output:** <Concrete deliverables and their paths at Task completion>
- **Validation:** <Checks and expected results that establish completion, including checks requiring the User>
- **Guidance:** <Task-specific approach and context, relevant Spec or source sections, and agreed User work or review points>

1. <Step>
2. <Step>
```

- List `manager` and each Worker in the Agents table. Name each Stage for its main result.
- List only direct dependencies and name the earlier result needed from each. Use Same-Agent when both Tasks have the same assignee and Cross-Agent when they have different assignees.
- Refer to the Spec for requirements and design decisions. Use as many ordered, Task-specific steps as the work needs to produce and check the result. Refer to shared procedures for common details. State the question, sources and required evidence for any research step.
