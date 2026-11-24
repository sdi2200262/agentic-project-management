# APM {VERSION} - Work Breakdown Guide

The Planner uses this guide to turn the approved understanding into the Spec and Plan and resolve `AGENTS.md` changes.

Write both documents for User review and for the Manager, including later Manager conversations. The Manager keeps them current during implementation and can use them, `AGENTS.md` and referenced sources to prepare self-contained Worker Task Prompts.

Describe what the deliverable must do and which constraints and agreements apply. Outside assigned Task instructions, do not use imperative language to tell the Manager, a Worker or the User what to do. State who is responsible and frame advice as observations or recommendations. Give direct instructions only in the Task that assigns the work.

Assume the Manager knows the APM workflow. Do not restate standard APM procedures or explain the usual purpose of APM documents. Record the decision, constraint or change that applies to this session. Link the relevant document or procedure when the reader needs it.

Use language the User can review. Record the technical choices and constraints they specify, and describe approaches at the depth they want to review. For choices left open, state the required results, constraints and checks. Preserve consequential findings with brief reasons and source references. The Manager uses those sources and the current workspace to fill in technical context. The implementing agents decide the details left open within the agreement.

## 1. Review Cycle

Before drafting, review the approved understanding. Put agreed outcomes, requirements, design, constraints and acceptance criteria in the Spec. Explicitly reserve assignments, sequencing, coordination and arrangements for verification, User involvement and review for the Plan. When an agreement affects both documents, keep the requirement in the Spec and carry the arrangements for meeting it into the Plan.

Use this cycle for the Spec, then the Plan.

1. Present the proposed organization and consequential choices, reasons and assumptions.
2. In the same turn, read the target file and write the draft using its format in §5. Reuse material that fits after checking it against current sources and decisions. Distinguish agreements, recommendations and open choices.
3. Check the saved file's section order and required fields against its format. Use §2 or §3 to check the content against the approved understanding and any document already approved for this session.
4. Link the file. Briefly summarize its contents per §2 or §3 and explain the reasons for consequential choices. Say what comes next, ask for explicit approval and wait.
5. Apply corrections to all affected documents, including earlier ones. Repeat steps 3 and 4 for revisions.

After Plan approval, resolve any `AGENTS.md` changes per §4.

## 2. Spec

Write `.apm/spec.md` per §5.1 from the approved understanding of what the session will deliver. Reserve delivery arrangements for the Plan (§1).

Group requirements and design choices by subject. Draw on the full range of Markdown, including headings, paragraphs, lists and tables. Choose the forms that make each subject easy for the User to review and the Manager to find during implementation. Name the working targets and authoritative sources. Record agreed behavior, output formats, schemas, interface contracts, constraints and acceptance criteria with the decisions they concern. Include brief reasons and relevant alternatives. Name who will settle open choices.

Record the session's version control agreement, including branch and commit conventions and constraints on work locations, commits, integration, publication and APM file tracking. Carry its effects on work and sequencing into the Plan.

Write each note as a separate list item. Frame notes as observations, not instructions. Include context that applies across design subjects, such as shared assumptions, reasons, open choices or later-session scope. For a relevant alternative, explain why it still matters, when it applies and whether the choice is open or settled.

Use supporting documents for retained material with a purpose outside the Spec, Plan, Tracker and Memory. Agree each document's purpose, path under `.apm/`, structure, maintainer and readers with the User. Reuse suitable documents and conventions and keep them easy to navigate as they grow. When supporting documents are needed, place a Supporting Documents section immediately after Notes. Give each document its own subsection and put its implementation work in Plan Tasks.

Summarize the expected behavior, what counts as success and the choices or constraints that need the User's judgment. Name the delivery agreements from the approved understanding that you will carry into the Plan, such as how the User will take part, when reviews will happen and how the work will be coordinated.

## 3. Plan

Write `.apm/plan.md` per §5.2 from the approved understanding of how the work will proceed and the approved Spec.

Organize the work by assignment, Task result and Stage milestone.

- **Assignments.** Assign each Task to the Manager or one Worker. Weigh expertise, shared context and agreed User involvement. Keep related work together when familiarity helps, accounting for context and coordination costs. The assigned agent remains responsible when the User performs any part of the work.
- **Tasks.** Give each Task a result its assigned agent can deliver and check. Prefer to keep continuous work together when it uses the same context. Split work when its size, complexity, uncertainty, need for different expertise or opportunity to deliver and check separate results in parallel justifies the coordination. Keep routine reviews, approvals and delivery actions with the work they concern. Give them a separate Task when they involve substantial work with its own result. For bounded technical investigation, follow `{GUIDE_PATH:context-gathering}` §3 and state the completion checks and affected dependencies.
- **Stages.** Group Tasks around a result the User can assess. Prefer fewer Stages for small sessions. Add a Stage boundary when the result guides what happens next or the User wants to assess it before further work starts. Weigh that benefit against the work that would have to wait. Within a Stage, use a Task dependency when one Task needs another’s result. Each new Stage starts after the previous one is complete and the User explicitly agrees to advance, unless a different arrangement was explicitly agreed.

Record the agreed delivery approach. The Manager prepares workspaces, integrates work and pushes changes. Workers carry out their Tasks in prepared workspaces, follow agreed commit instructions and may delegate selected parts. The Manager uses subagents for substantial implementation and reviews their results. The Manager may carry out substantial work directly when the User explicitly agrees and the Plan records that arrangement. The Manager may handle contained investigation, small corrections and final checks directly. Let the implementation roles choose and group subagents and arrange routine independent reviews.

Identify what can start together, what needs an earlier result or outside prerequisite, and what lets affected work resume. Record the agreed response if prerequisites remain unresolved. Give each Task observable checks for its own result, with expected results, timing and who runs them. Identify required User or outside reviews, actions and credentials. Say when affected work pauses for their input.

Write each note as a separate list item. Frame notes as observations and recommendations, not instructions to the Manager. State agreed involvement, review points, timing, update frequency, shared constraints and additional Stage checks as facts when they span Tasks. Keep Task instructions in their fields and link to those fields or the Spec for details. For later sessions, record relevant sequencing and prerequisites and refer to the Spec for scope.

Note which Tasks could run in parallel or be batched and what makes that possible. For a potential blocker, say when it could arise and what work it could affect. If you recommend an option, explain when it would help. The Manager decides how to dispatch ready work within the agreed Plan.

Check that the Tasks deliver and verify every approved Spec outcome and that each assigned agent can carry out and check its work. Check assignments, dependencies and sizes against the agreed approach. Verify that the relevant Tasks or Notes carry forward the agreed delivery and review arrangements.

Summarize how the planned work and checks cover the approved Spec outcomes. Give the Stages, Task counts, assignments, parallel work and agreed User involvement. Explain what each Stage lets the User assess and what work waits at its boundary.

## 4. AGENTS.md

Keep `AGENTS.md` useful across sessions. Include brief orientation, repository paths, working and read-only boundaries and workspace conventions. The Manager and Workers read it in full and maintain it under User authorization. Write it as a standalone reference for Workers.

1. Review existing `AGENTS.md` and any applicable guidance. Propose concise additions or corrections that help future work, extending or replacing existing guidance where possible. Explain the evidence for changes, or why existing guidance is sufficient. If `AGENTS.md` is missing, propose its contents from discovery and ask the User whether to create it.
2. Resolve decisions needing User agreement. Make and check the agreed changes to `AGENTS.md`. Use clear sections, respecting existing organization and unrelated content where present. State orientation as facts and rules as direct instructions, with conditions where needed.{CLAUDE_ONLY: If `AGENTS.md` exists, add its import to an existing workspace `CLAUDE.md` unless it already has one: `@AGENTS.md` at the workspace root, or `@../AGENTS.md` in `.claude/CLAUDE.md`. Keep it outside code blocks and preserve preexisting content. If references would form a cycle, include its correction in the proposal.}

Continue with `{SKILL_PATH:apm-1-initiate-planner}` §4.

## 5. Formats

### 5.1 Spec Format

The Spec is `.apm/spec.md`.

```markdown
# APM Spec

<In three to five sentences: this session’s intended outcomes, the problem it addresses, its scope and its success criteria>

## Notes

- <Observation that applies across subjects per §2>

## Supporting Documents

### <Document name>

<Agreed purpose, path under `.apm/`, structure, maintainer and readers>

## <Design Section>

<Agreed requirements and design for this subject per §2>
...
```

- Include Supporting Documents only when the session needs them.
- Refer to User documents by path and section.

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

- <Agreement, observation or recommendation that spans Tasks per §3>

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
