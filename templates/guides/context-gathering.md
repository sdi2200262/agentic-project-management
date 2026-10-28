# APM {VERSION} - Context Gathering Guide

This guide covers Context Gathering: exploring the workspace, questioning the User in three rounds, settling how much of the User's goal this APM session covers, and getting the User's approval of your understanding. `{GUIDE_PATH:work-breakdown}` covers the documents that follow.

Your findings feed three documents: the Spec holds design decisions and constraints, the Plan organizes the work, and the Rules hold conventions shared by all or most work. Gather requirements, domain knowledge, technical choices, constraints and concrete success criteria. Leave dispatch, version control and verification to the Manager: note any preferences the User mentions about them, but do not ask about them. Research needed to understand the work belongs here; research that is itself a deliverable becomes planned work.

## 1. Preparation

1. If the User confirmed relevant archives, use a subagent to examine them. Give it the archive paths and your questions, and tell it to read each archive's `session-summary.md` first, then `spec.md` and `plan.md` for decisions and work structure, `memory/index.md` for outcomes and patterns, `tracker.md` when Task or Worker states matter, and `metadata.json` for the archive date. Ask for relevant scope, decisions, completed work and known issues, with paths or commands to verify them, and for anything that may have changed since. Verify the findings you will rely on against the current code.
2. Explore every codebase relevant to the work, per §3.
3. If `AGENTS.md` exists, summarize it for the User, explain that planning adds a separate Rules section and keeps the existing content, and ask whether they want that content changed.{CLAUDE_ONLY: Summarize any applicable `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` instructions too, and ask the same. Preserve their content; the Rules go in `AGENTS.md`.} If there is no `AGENTS.md`, ask in Round 1 whether the User has one elsewhere or wants it created.

Present what you found with the first round's questions, keeping to what the User needs to answer them.

## 2. Question Rounds

Hold the three rounds in order, each with at least one exchange with the User. Use the User's and the domain's own language in questions, summaries and subagent prompts. Leave Stages, Tasks, Workers and task sizing for Work Breakdown; record domains, dependencies and complexity as characteristics of the work.

In each round:

1. Ask about what is missing, and state what you already know from documents and exploration so the User can confirm or correct it.
2. After each answer, apply corrections and research what it raises per §3. Separate what the User stated from what you inferred or assumed, and confirm the inferences that matter. For a vague answer, offer concrete interpretations; for an incomplete one, ask for the missing part. Point out contradictions neutrally. Propose concrete success measures for requirements that have none.
3. Follow up until the round's topics are covered, by answers, confirmed context, exploration or the User saying they do not apply. Resolve gaps that would affect planning before you move on.
4. End the round with a short summary of what it established and what remains open, and an open question about anything the focused questions missed. The User may answer that question together with the next round's questions.

Context the User gives up front does not skip a round, and silence is not approval.

### 2.1 Round 1: Existing Materials and Vision

Cover what is being made and its deliverables, the problem and purpose, scope and essential features, skills needed, existing materials, the User's vision and prior work. Move on when the foundation, what success looks like, the scope and the existing context are clear.

### 2.2 Round 2: Technical Requirements

Cover design decisions and constraints, technical and resource needs, dependencies, complexity, risks and validation. Establish:

- Existing structure and behavior to keep or change.
- Environments, delivery targets, external resources and required access.
- What can be done in the development environment and what needs outside action.
- Dependencies, hard parts, deadlines and outside input or reviews.
- Technical direction already chosen, choices still open, and what is in or out of scope.

Move on when the core requirements have concrete success measures and the constraints and risks are clear.

### 2.3 Round 3: Implementation Approach and Quality

Cover technical preferences, quality standards, workflow preferences, outside approvals, domain characteristics and documentation. Establish:

- Required or ruled-out tools, languages and platforms; security, performance and compatibility needs.
- Account or environment actions needed for setup, delivery or validation.
- Preferred validation, reviews, sign-offs and acceptance requirements.
- Consistency standards, formats, examples and reference material.
- Areas of expertise and natural boundaries in the work, without choosing Workers.
- Chosen approaches and their reasons, including what ruled alternatives out.

Move on when the approach, quality standards and approvals are clear.

## 3. Research

When the User's answers or the materials point to code, explore it before you continue the questions. If the User asks you to defer research, do so and note the resulting limits in your summary.

Read a single document or a few known files yourself. For broader research, such as how a codebase is built, its history and branches, or a question that spans many files, use a subagent: give it specific questions and the sources to check, and ask for findings with file references. Check each finding you will rely on against the files or commands it cites. If that turns up a contradiction or an important gap, send a focused follow-up and verify it too. Show the User what you verified before relying on it.

When research shows several viable designs, present their trade-offs with a recommendation and let the User choose. When one approach is clearly best, explain the evidence and continue unless the User redirects you.

## 4. Session Scope

As context grows, judge how large the User's goal is. If it is too large for one APM session, for example because later parts depend on decisions that only earlier work can settle, propose how far this session goes and what is left for later sessions. Propose it as soon as the size is clear, and settle it before the Understanding Summary. Once the User agrees, plan around this session's scope, and keep the rest for the Spec's and Plan's Notes.

## 5. Understanding Summary

1. After Round 3, present your understanding per §6.1, including any limits that are still unresolved.
2. Ask the User to review and approve it. Apply corrections, update the summary and ask again.
3. Once approved, read `{GUIDE_PATH:work-breakdown}` and continue there.

## 6. Formats

### 6.1 Understanding Summary Format

Use Markdown suited to the work, with enough detail for the User to judge whether you understood it and to catch errors. Cover what applies:

- This session's scope, and what is left for later sessions.
- Requirements, deliverables and success criteria.
- Design decisions and their reasons; constraints.
- Domains, dependencies and complexity you observed.
- Environments, resources and access.
- Process, quality and approval needs.
- Conventions and existing `AGENTS.md` content.
- Version control or coordination preferences the User mentioned.

End with an explicit request for approval.
