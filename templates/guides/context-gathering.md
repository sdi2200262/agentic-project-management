# APM {VERSION} - Context Gathering Guide

This guide covers the Planner’s Context Gathering: exploring the workspace, questioning the User in three rounds, settling how much of the User's goal this APM session covers, and getting the User's approval of your understanding. `{GUIDE_PATH:work-breakdown}` covers the documents that follow.

Establish the session's intended outcomes, requirements, design choices, constraints and concrete success criteria. Develop the breakdown alongside them. Your findings feed the Spec, Plan and any needed `AGENTS.md` updates. Agree coordination and version control preferences with the User.

## 1. Preparation

1. Use earlier results and findings to inform this session’s intended outcomes. Read relevant archives’ session summaries when present, then `spec.md` and `plan.md` for decisions and work structure, `memory/index.md` for outcomes and patterns, `tracker.md` when states matter, and `metadata.json` for dates. Follow Stage-summary and log links as needed. Identify relevant scope, decisions, completed work, known issues and what may have changed. Verify findings you will use against current sources and workspace state, retaining source paths or verification commands.
2. Explore every codebase relevant to the work, per §3.
3. Read preexisting `AGENTS.md` content, applicable scoped instructions and referenced guidance.{CLAUDE_ONLY: Read preexisting workspace `CLAUDE.md` content too.} Summarize what affects planning and check it against the workspace. Note gaps and inconsistencies to inform proposed additions or corrections during §4 of Work Breakdown. If `AGENTS.md` is missing, ask whether instructions exist elsewhere.

Present what you found with the first round's questions, keeping to what the User needs to answer them.

## 2. Question Rounds

Hold the three rounds in order, each with at least one exchange with the User. The rounds organize discussion; exploration, research, analysis and design continue throughout planning. Scale their depth to the agreed scope, complexity and uncertainty. Use the User's and the domain's own language. Develop proposed Stages, Tasks and assignments as you learn, explaining consequential boundaries and trade-offs. Write the Spec and Plan after understanding approval.

Ask questions that resolve gaps in the intended work. Recommend an approach when evidence, trade-offs or the User's uncertainty make it useful; establish unclear intent before proposing a preferred solution.

In each round:

1. State what you know from the request and exploration, and ask about missing requirements, decisions or constraints the round needs to establish.
2. Apply each answer and do the preparation it calls for per §3 before asking dependent questions. Bring back findings, resolve consequential choices with the User and resume the rounds with updated questions. Distinguish the User's statements from assumptions and confirm consequential inferences. Clarify vague or incomplete answers, point out contradictions neutrally and establish concrete success measures.
3. Follow up until the round's relevant requirements and choices are clear through answers or verified findings. Ask when a topic’s relevance is unclear. Resolve gaps needed to define the work before moving on; handle remaining research per §3.
4. End the round with a short summary of what it established and what remains open, and an open question about anything the focused questions missed. The User may answer that question together with the next round's questions.

Initial context and intermediate work do not skip the remaining rounds. Carry established answers forward; silence is not approval.

### 2.1 Round 1: Existing Materials and Vision

Establish what the User wants this session to deliver, the problem it addresses, essential features, existing materials, skills needed and prior work. Identify what you need to investigate or develop during planning to define the implementation work. For a larger goal, propose a session boundary per §4. Move on when the intended outcome, initial scope and necessary preparation are clear.

### 2.2 Round 2: Technical Requirements

Cover design decisions and constraints, technical and resource needs, dependencies, complexity, risks and validation. Establish:

- Existing structure and behavior to keep or change.
- Environments, delivery targets, external resources and required access.
- What can be done in the development environment and what needs outside action.
- Expected effort, uncertainties, dependencies, hard parts, deadlines and outside input or reviews.
- Technical direction already chosen, choices still open, and what is in or out of scope.

Move on when required behavior and the design choices needed to define the work are established, core requirements have concrete success measures, and remaining questions have defined consequences for the work.

### 2.3 Round 3: Implementation Approach and Quality

Cover technical preferences, quality standards, workflow preferences, outside approvals, domain characteristics and documentation. Establish:

- Required or ruled-out tools, languages and platforms; security, performance and compatibility needs.
- Account or environment actions needed for setup, delivery or validation.
- Required validation, User or outside reviews, sign-offs and acceptance requirements.
- Consistency standards, formats, examples and reference material.
- Areas of expertise, natural boundaries, available agents, parallelism, preferred Task size and review points.
- Proposed Stages, Tasks and assignments, and coordination preferences that affect the plan.
- Version control for each working repository, including whether to use Git and how it supports the planned work.
- Chosen approaches and their reasons, including what ruled alternatives out.

Recommend assignments between the Manager and separate Workers using the gathered context and the assignment principles in `{GUIDE_PATH:work-breakdown}` §3. Bounded work with clear goals and checks often suits Manager execution; important or uncertain work may benefit from closer Worker collaboration. Explain consequential choices.

Propose forms and frequency of User involvement based on the work’s risks and uncertainty and the User’s experience and preferences. Options include Worker collaboration, reviewing changes or test results, manual testing, demonstrations, explanations and progress reports. Name the work and decisions the proposed points or intervals help the User understand or guide. Agree the arrangement and shape Task and Stage boundaries, Task sizes, batches and parallel work around it. Ask whether the User wants to perform any work themselves, with the responsible agent providing context, assistance and validation.

Check repository history and existing workspace instructions, including `AGENTS.md`, for version-control conventions. Propose an arrangement suited to the work and the User’s preferences, explaining any changes to those conventions. Cover where work happens, when changes are committed and integrated, and whether APM files are tracked. Explain that parallel Tasks in the same repository need separate worktrees, and ask whether the proposal meets the User’s needs. Without version control, parallel Worker dispatch is unavailable.

Move on when the proposed Stages, Tasks, assignments, participation, quality standards and approvals describe how the agreed work will proceed.

## 3. Research

When answers or materials raise a question needed for planning, investigate it before asking dependent questions. If the User asks you to defer research, do so and note the resulting limits in your summary.

Research specific questions against relevant files, history, branches or other sources. Match inspection depth to the claim: check relevant implementation, changes or behavior before asserting completeness or compatibility. Investigate contradictions, cite supporting files or commands, and show the User consequential findings and limits, distinguishing verification from inference.

Complete the preparation needed to define the agreed work before writing the Spec and Plan. Investigation within defined work may be a Task: identify its questions, required evidence, completion criteria and dependent decisions or work. Define dependent work to the extent those answers allow, and make the remaining planning limits clear to the User. If findings show the agreed work is too large for one session, revisit its scope per §4.

Present consequential design choices with evidence and trade-offs for the User to decide, recommending an approach where useful. Continue independently on details within agreed decisions.

## 4. Session Scope

Refine the initial session boundary as you learn. If the goal is too large for one session, propose a coherent outcome for this session and a tentative division of the remaining work into later sessions. Explain the boundaries, dependencies and decisions affecting the sequence. Agree the intended outcomes and approach with the User before the Understanding Summary. Develop this session’s requirements and breakdown; keep later sessions tentative and at the level current understanding supports. Record the scope and work left for later sessions in the Spec, and relevant sequencing or prerequisites in the Plan.

For outside replies or approvals, agree what can proceed and what happens if available work ends before a response arrives: pause, defer the affected work or revise scope. Keep pending prerequisites explicit; waiting does not satisfy a dependency or complete a Stage.

## 5. Understanding Summary

1. After Round 3, present your understanding per §6.1, including any limits that are still unresolved. Briefly distinguish what will become Spec outcomes, requirements and design from Plan assignments, sequencing and coordination.
2. Ask the User to review and approve it. Apply corrections, update the summary and ask again.
3. Once approved, continue with `{GUIDE_PATH:work-breakdown}`.

## 6. Formats

### 6.1 Understanding Summary Format

Use Markdown suited to the work, with enough detail for the User to judge whether you understood it and to catch errors. Cover what applies:

- This session's agreed outcomes and scope, and any proposed later sessions.
- Requirements, deliverables and success criteria.
- Design decisions and their reasons; constraints.
- Domains, dependencies and complexity you observed.
- Environments, resources and access.
- Process, quality and approval needs.
- Conventions and existing `AGENTS.md` content.
- Proposed Stages, Tasks and assignments between the Manager and Workers, with reasons for consequential choices.
- Agreed User participation and review points tied to that work.
- Version control.

End with an explicit request for approval.
