# APM {VERSION} - Context Gathering Guide

The Planner uses this guide to explore three discovery topics with the User, agree session scope and obtain understanding approval. `{GUIDE_PATH:work-breakdown}` covers the documents that follow.

Establish the session's intended outcomes, requirements, design choices, constraints and concrete success criteria. Your findings feed the Spec, Plan and any needed `AGENTS.md` updates. Agree coordination and version control preferences with the User.

## 1. Preparation

Continue from the startup survey in Planner Initiation §2.

1. Use earlier results and findings to inform this session’s intended outcomes. Read relevant archives’ session summaries when present, then `spec.md` and `plan.md` for decisions and work structure, `memory/index.md` for outcomes and patterns, `tracker.md` when states matter, and `metadata.json` for dates. Follow Stage-summary and log links as needed. Identify relevant scope, decisions, completed work, known issues and what may have changed. Verify findings you will use against current sources and workspace state, retaining source paths or verification commands.
2. Explore every codebase relevant to the work, per §3.
3. Read preexisting `AGENTS.md` content, applicable scoped instructions and referenced guidance.{CLAUDE_ONLY: Read preexisting workspace `CLAUDE.md` content too.} Summarize what affects planning and check it against the workspace. Note gaps and inconsistencies to inform proposed additions or corrections during §4 of Work Breakdown. If `AGENTS.md` is missing, ask whether instructions exist elsewhere.

Present relevant findings with the first discovery exchange, keeping to what the User needs to answer.

## 2. Discovery Topics

Give each discovery topic at least one exchange with the User. Use as many exchanges as needed and revisit topics in the order the work calls for. Make clear what you’re trying to settle with the User. When you move to another topic, briefly connect what’s settled or still open to what you need to learn next and why. Invite corrections or additions as you settle each topic. Discuss the work in its own terms during discovery. Develop Stages, Tasks and assignments during Work Breakdown.

Ask about missing requirements, choices or constraints. Group questions the User can answer together. After asking, end the message and wait for the User. If their reply leaves open a choice that affects what they would accept, return to it before planning work that depends on it. If the choice can wait, agree who will decide it and when. Verify consequential inferences and resolve contradictions neutrally. Research, analysis, design, processing and preparation may happen between exchanges; complete what is needed before asking dependent questions. Use the User's and domain's language and carry established answers forward without repetition.

Explain consequential dependencies and trade-offs. Recommend an approach when evidence or uncertainty makes it useful, after establishing unclear intent.

### 2.1 Vision and Existing Materials

Establish the intended session outcome, problem, essential features, existing materials, relevant expertise and prior work. Learn what the User is familiar with and wants to be able to judge. Identify preparation needed to define implementation and propose a coherent session boundary when needed (§4).

When proposing to continue earlier work or reuse its planning documents or arrangements, explain what fits this session, what needs to change and why. Ask the User what to retain or change, building on answers already given.

### 2.2 Requirements and Constraints

Establish required behavior, design choices, dependencies and concrete success measures:

- Existing structure and behavior to keep or change.
- Environments, delivery targets, technical resources and required access.
- What agents can do in their environment and what needs outside action.
- Complexity, risks, effort, timing and external prerequisites.
- Chosen technical direction, unresolved alternatives and scope boundaries.

### 2.3 Implementation Approach, Quality and Coordination

When you have enough technical context to discuss how the work will proceed, briefly tell the User what is settled and which delivery decision you need their input on next.

Establish how the defined work will proceed:

- Tools, languages, platforms, security, performance and compatibility needs.
- Setup, delivery and validation actions requiring accounts or outside access.
- Required validation, User or outside reviews, acceptance and documentation.
- Conventions, formats and reference material.
- Expertise, available agents and how they could work together.
- User involvement, coordination, timing constraints and version control.

Discuss possible responsibilities based on expertise, shared context and useful User involvement. Manager execution through subagents can support automation; separate Workers support close collaboration. Recommend participation suited to risk, uncertainty, experience, availability and deadlines: collaboration, tests, demonstrations, explanations, reviews or reports. The User chooses its form and frequency. Ask whether they want to perform any portion with the responsible agent's assistance and validation, confirming an existing answer rather than asking again.

When recommending any form of User participation, explain what the User would do, why it would help and how it would affect the work. When work depends on their input, agree what must wait and what can continue. If a review or approval could hold up independent work, clarify its timing with the User.

Check repository instructions and recent contribution history. Agree with the User on whether and how to use version control. If using it, propose applicable branch and commit conventions with a sample branch name and commit subject. Explain departures from repository practice. Agree on constraints for work locations, commit and integration timing, and APM file tracking. The Manager prepares the workspaces.

Discuss what can run together, what needs to happen in order, and when it helps for one agent to carry related work through. Explain why those choices fit the work. For parallel work in one repository, prefer separate working copies supported by the agreed tools, such as Git worktrees. In a shared working directory, agree on independent work with separate writable scopes. Account for shared resources and work that must run in sequence in the Plan.

## 3. Research

When answers or materials raise a question needed for planning, investigate it before asking dependent questions. If the User asks you to defer research, do so and note the resulting limits in your summary.

Research specific questions using relevant files, history, branches or other sources. Inspect the implementation, changes or behavior closely enough to support your claims about completeness or compatibility. Explore deeply enough to settle consequential choices, define executable work and identify meaningful checks. Investigate contradictions.

Match what you present to the User's expertise and desired involvement. Show the User findings and limits that affect decisions, with supporting files or commands. Distinguish what you verified from what you inferred.

Complete preparation needed to define work before writing the Spec and Plan. A bounded technical investigation within defined implementation may be a Task with questions, evidence and completion checks. It must not postpone requirements, design or preparation needed to define the work. If later planning depends on actual implementation results, prefer a later session from that evidence rather than an implementation Task for unfinished planning. Revisit scope per §4 if the work is too large.

Present consequential design choices with evidence and trade-offs for the User to decide, recommending an approach where useful. Continue independently on details within agreed decisions.

## 4. Session Scope

Refine scope as you learn. If the goal is too large for one session, propose a coherent session outcome and tentative later sessions, explaining boundaries, dependencies and consequential sequencing choices. Agree scope and approach before understanding approval. Detail this session’s work; keep later sessions at the level current evidence supports. Put scope and later-session work in the Spec, sequencing and prerequisites in the Plan.

Account for timing constraints and dependencies outside the agents’ control when agreeing scope and sequencing. Establish what can proceed independently and what allows affected work to start or resume. Agree what to do if prerequisites remain unmet when available work ends: pause, defer affected work or revise scope. Keep unresolved prerequisites explicit; waiting alone does not satisfy them.

## 5. Understanding Summary

Before presenting the summary, confirm the User's involvement.

1. After an exchange on every discovery topic and sufficient preparation, present a summary of your understanding per §6.1, including any unresolved limits.
2. End with an explicit request for approval. If the User adds or changes anything in the summary, even while approving it, revise it per §6.1. Present the revised summary in full and ask for approval again.
3. Once approved, continue with `{GUIDE_PATH:work-breakdown}`.

## 6. Formats

### 6.1 Understanding Summary Format

Bring the discovery agreements together for approval. First explain what the session will deliver, then how the work will proceed. Choose a structure that makes both easy for the User to review.

- Explain the goal, scope, requirements, design choices and what makes the result acceptable. Use this to write the Spec.
- Explain the agreed delivery approach in terms of the work. Say who will do what, what can run together, what has to wait and why, and how the results will be checked. Include how the User will take part and when their input is needed. Use this to write the Plan.

Include the constraints, reasons and sources needed to review the agreement, including relevant environments, resources and access. Cover agreed version control. Note any lasting workspace guidance that needs attention and any later-session scope that you discussed. Identify open choices and prerequisites, who can resolve them and their effect on the work. Follow Work Breakdown §§2–3 for where the details belong.

Acknowledge the User’s corrections. Ask follow-up questions if the meaning or effect of a correction is unclear. Revise the session outcomes, the delivery approach or both, as the correction requires.
