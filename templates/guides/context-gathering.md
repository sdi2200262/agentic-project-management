# APM {VERSION} - Context Gathering Guide

## 1. Overview

**Reading agent:** Planner

Gather enough project context for the User to approve your understanding. Complete three interactive rounds, then obtain approval of the consolidated summary before Work Breakdown. Do not decompose work, assign Workers or propose Stage/Task structure during this procedure.

## 2. Operational Standards

### 2.1 Workflow Context

Your findings feed three documents: the Spec holds project design decisions and constraints, the Plan organizes work, and Rules hold execution standards shared by all or most work. The Manager reads Spec and Plan and extracts relevant content into self-contained Task Prompts. Workers read their prompts and Rules, so gaps in gathered context propagate into execution.

Gather requirements, domain knowledge, technical choices and constraints, and concrete success criteria. The Manager handles runtime coordination, version control conventions, dispatch and holistic verification. Record coordination or version control preferences that surface, but do not elicit those mechanics or decide work organization here. Research needed to understand the project belongs here; research that is itself a deliverable belongs in the later Plan.

### 2.2 Guiding Principles

Use authoritative materials and workspace findings before asking questions. Adapt language and depth to the project and User's expertise. Derive technical requirements from the User’s natural descriptions.

Keep all three rounds in order. Within each round, ask about missing context and present already gathered information as focused confirmation questions. A whole round or part of it can confirm an understanding: state the relevant facts and invite correction. Use supplied documents to focus each round’s interaction on confirmations and gaps.

Keep questions about project substance. Record domains, dependencies and complexity as observed characteristics; do not present proposed tracks, phases, Stages, Tasks, Workers or assignments. Those decisions follow the understanding approval.

### 2.3 Response and Gap Assessment

Distinguish explicit statements, inferences and assumptions. Confirm critical inferences and clarify consequential assumptions. Ask follow-ups only when information needed for accurate planning is missing, ambiguous, contradictory or lacks validation criteria.

For vague answers offer concrete interpretations; for incomplete answers ask for the missing part. Surface contradictions neutrally. Distinguish uncertain preferences from unknowns research can resolve. Propose concrete success measures when requirements lack them, especially in Rounds 2 and 3.

### 2.4 Round Advancement

Each round requires at least one User exchange before advancement. Advance when its focus areas are sufficiently covered by questions, confirmed context, exploration or an explicit statement that they do not apply. Resolve consequential gaps within the current round; do not declare unheld rounds complete.

Briefly summarize what was established or corrected and any remaining limits. After Rounds 1 and 2 begin the next round; after Round 3 present the consolidated understanding summary.

### 2.5 Exploration and Research Standards

Establish authority during initiation before deep exploration. When relevant material or User responses point to code, explore before continuing questions. Read relevant repositories, including history and branches as project signals. Read focused sources directly. For substantial research, use a subagent with specific questions and expected sources; use `apm-communication` §5 Assistant Reference for the call.

Verify critical subagent claims against the referenced files or commands. If verification finds a contradiction or consequential gap, use a subagent for a focused follow-up and verify its findings too. Present verified findings and implications to the User before relying on them. Include them in the next follow-up when gaps remain, or in the round summary when they complete its coverage.

When research reveals several viable architectural or design approaches, present their material trade-offs and a recommendation for the User to choose. When one clear approach emerges, explain its evidence and proceed unless redirected.

## 3. Context Gathering Procedure

Complete pre-round setup, three rounds with follow-ups, and the final understanding approval. Follow the communication skill's guidance for focused questions and evidence-based proposals.

### 3.1 Pre-Round Context

If archives were confirmed relevant during initiation, use a subagent to examine them; use `apm-communication` §5 Assistant Reference for the call. Give it the confirmed archive paths, research questions and these instructions:

- Read each archive's `session-summary.md` first when present. For missing or deeper detail, read `spec.md` and `plan.md` for decisions and work structure.
- Consult `memory/index.md` for outcomes and patterns, and `tracker.md` when Task statuses or Worker states matter. Check `metadata.json` for archival date and installation context.
- Return relevant scope, decisions, completed work and known issues, with file paths, code locations or commands for verification. Distinguish the archived snapshot from current facts and flag conditions that may have changed.

Verify consequential findings against current code before using them in the rounds.

Explore all codebases relevant to the project before the rounds, not just selected ones. Use §2.5 Exploration and Research Standards. Present findings with the opening Round 1 questions or confirmations, keeping them relevant to what the User must answer.

If a Rules file exists, present its contents, explain that Work Breakdown will add an APM_RULES block while preserving and referencing existing content, and ask whether the User wants changes to that existing content. If absent, address its creation in Round 1.

### 3.2 Round Iteration

For each round:

1. Address its focus areas with questions about gaps and confirmations of known context.
2. After each response, incorporate corrections and assess remaining gaps. Research on relevant signals and verify findings as above.
3. Follow up until coverage is sufficient, then summarize briefly and advance.

Before each round's completion, include an open question about aspects its focused questions may have missed. Tailor it to uncovered areas. It need not block advancement: the User may answer it alongside the next round's questions. Keep that distinct from the required exchange and consequential gaps, which must be resolved before advancing.

### 3.3 Question Round 1: Existing Materials and Vision

Cover project type and deliverables, problem and purpose, scope and essential features, skills needed, existing materials, User vision, and prior work/codebase context. Use what exploration already established to ask for confirmation and gaps.

If no Rules file was found, ask whether the User has one elsewhere or wants it created during Work Breakdown. Read a supplied file and note its content for integration. Use the answer from setup when available.

Advance when the project's foundation, intended success, scope and existing context are understood.

### 3.4 Question Round 2: Technical Requirements

Cover design decisions and constraints, technical/resource requirements, dependencies, complexity, risks and validation criteria. Establish:

- Existing structure and functionality to preserve or modify.
- Technical environments, delivery/deployment targets, external resources and required access.
- What can be prepared in the development environment and what requires external action.
- Dependencies and challenging aspects, deadlines, external input or reviews.
- Technical direction already chosen, remaining choices, and what is in or out of scope.

Confirm facts already established and ask only for what remains unresolved. Keep dependencies as project characteristics, not proposed work assignments. Advance when core requirements have concrete success measures and the technical constraints and risks are sufficiently understood.

### 3.5 Question Round 3: Implementation Approach and Quality

Cover technical constraints and preferences, quality standards, workflow preferences, external approvals and coordination needs, domain characteristics and documentation expectations. Establish:

- Required/prohibited tools, languages and platforms; security, performance and compatibility needs.
- Account or environment actions required for setup, delivery or validation.
- Preferred validation, reviews, stakeholder sign-offs and project acceptance requirements.
- Consistency standards, formats, examples and reference material.
- Domain expertise, relationships and natural handoff points, without choosing Workers or decomposition.
- Chosen approaches and their reasons, including principles that ruled alternatives out.

Confirm settled topics and resolve remaining gaps before the final summary.

### 3.6 Finalize Understanding

1. Present the consolidated understanding summary per §4.1. Include consequential limits that remain genuinely unresolved for implementation.
2. Ask the User to review and approve it before planning documents are generated. If corrections are needed, follow up, update the summary and request approval again.
3. After approval, read `{GUIDE_PATH:work-breakdown}` and continue with that procedure.

## 4. Structural Specifications

### 4.1 Understanding Summary Format

Use Markdown suited to the project. The User must be able to assess whether you understand it, with enough detail to catch errors.

Cover relevant requirements, deliverables and success criteria; design decisions and reasons; scope and constraints; observed domains, dependencies and complexity; environments, resources and access; process, quality and approval needs; execution conventions and existing Rules; and coordination/version control preferences that surfaced as observations.

Include categories relevant to the project. Describe work structure signals as observed facts; decomposition follows the understanding approval. Keep the final approval explicit.
