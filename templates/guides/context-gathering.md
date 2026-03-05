# APM {VERSION} - Context Gathering Guide

## 1. Overview

**Reading Agent:** Planner

This guide defines the process for Context Gathering - gathering sufficient context to create accurate planning documents (Specifications, Implementation Plan, and Execution Standards) that enable structured project execution.

### 1.1 How to Use This Guide

See §3 Context Gathering Procedure - execute sequentially through all question rounds. See §2 Operational Standards when interpreting responses, assessing gaps, or deciding on exploration. Communication with the User and visible reasoning follow `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication. Round summaries and exploration context are visible to the User; internal categorization is not.

### 1.2 Objectives

Gather sufficient context across:

- *Vision:* Project goals, deliverables, success criteria
- *Technical:* Requirements, constraints, environments, dependencies
- *Process:* Workflow preferences, quality standards, coordination requirements
- *Validation:* Success states, acceptance criteria, completion indicators

Context gathering targets three planning documents, each consumed differently during the Implementation Phase - the Manager coordinates using Specifications and the Implementation Plan, while Workers execute using `{AGENTS_FILE}` alone:

- *Specifications* (what is being built): design decisions and constraints: choices made where alternatives existed, the rationale behind them, and constraints that bound what's being built.
- *Implementation Plan* (how work is organized): work domains, dependency chains, complexity indicators, validation criteria, sequential vs parallel work streams, coordination points.
- *Execution Standards* (how work is performed): coding conventions, quality requirements, process rules, prohibited patterns, tool constraints. Universal patterns across all Tasks.

### 1.3 Outputs

**Understanding summary:** Consolidated presentation of all gathered context for User review before Work Breakdown. Presented per §3.5 Finalize Understanding, structured per §4.1 Understanding Summary Guidelines.

---

## 2. Operational Standards

### 2.1 Guiding Principles

- *Clarity over exhaustion:* Aim for sufficient understanding, not exhaustive interrogation.
- *Leverage existing material:* Before Round 1, scan the workspace for existing materials (README, PRD, requirements, specs, `{AGENTS_FILE}`). If found, prompt the User to confirm relevance, read them, and skip redundant questions.
- *Explore on signal:* When User responses reference codebase elements or documentation, proactively explore before continuing questions. See §2.4 Exploration and Research Standards.
- *Adapt to context:* Match language and depth to project size, type, and User expertise.
- *Signals, not structure:* Identify work structure signals (domains, dependencies, complexity) but do not discuss or decide decomposition - Stages, Tasks, and agent assignments wait for Work Breakdown.
- *Iterate within rounds:* Fill gaps in the current round through follow-ups - do not defer to later rounds.

### 2.2 Response and Gap Assessment

When processing User responses, assess what was explicitly stated, what can be reasonably inferred, and what assumptions you are making. Explicit statements are high-confidence. Inferences on critical points should be verified. Assumptions should be flagged for clarification.

**Extraction lens:** Before flagging a gap, assess whether the technical formalization can be derived from what was described naturally. The standard for gap identification is whether responses are sufficient to formalize into planning document language - not whether the User stated requirements in technical terms. Raise a follow-up only when what was gathered is genuinely insufficient to formalize.

**Ambiguous responses:**

- *Vague:* Rephrase with concrete interpretations.
- *Incomplete:* Acknowledge the covered part and ask for the remainder.
- *Contradictory:* Surface the contradiction neutrally.
- *Uncertain:* Distinguish preferences (probe further) from genuine unknowns (consider research per §2.4 Exploration and Research Standards).

**Gap assessment:** A gap exists when information needed for planning documents is missing, ambiguous, or lacks validation criteria. After each User response, assess what gaps remain and what follow-ups would resolve them. Gaps are resolved by asking directly (missing info), rephrasing and confirming (ambiguity), or proposing concrete criteria (validation).

**Round advancement** → Advance when the current round's focus areas are sufficiently covered and further questions would yield diminishing returns. Continue when gaps remain that affect planning document accuracy. Before advancing, present a round completion summary in chat covering:

- *Context gathered:* key findings from this round.
- *Planning document relevance:* which planning documents the findings inform and what type of content they contribute (design decisions, work structure signals, execution patterns).
- *Gaps assessed:* what gaps were identified, how resolved, and any acceptable gaps carried forward.
- *Advancement reasoning:* why this round is complete and what the next round builds on.

Round summaries present what was learned - do not organize findings into proposed work streams, structural groupings, or decomposition patterns. Describe signals and constraints; work organization happens strictly during Work Breakdown.

After Round 1 and 2 summaries, immediately begin the next round. After Round 3, continue to the understanding summary.

### 2.3 Questioning Depth

Adapt questioning depth to the project and User signals:

- *Go deeper:* For large/multi-domain projects, revealed dependencies or risks, unclear domain boundaries, indicated complexity.
- *Stay light:* For small/single-domain projects, clear and complete responses, straightforward requirements, demonstrated expertise.
- Brief answers warrant completeness verification. Extensive elaboration warrants following the thread. When the User references existing materials or codebase artifacts, read them before asking redundant questions.

### 2.4 Exploration and Research Standards

When User responses reference codebase elements, existing materials, or signal that relevant context exists, explore proactively. Do not wait for permission.

**After exploration** → Reassess gaps: what is now known, what questions are answered, what new gaps emerged. Subsequent questions target the delta - what's still missing given the new information. Do not ask about what exploration already revealed.

**Scope assessment** → The key distinction is purpose: research that builds the Planner's understanding of the project belongs in Context Gathering - exploring the codebase, verifying documentation, checking external systems, resolving technical unknowns. This includes research that informs the current question round, subsequent rounds, or planning document creation. Research that is itself a project deliverable belongs in the Implementation Plan. Only defer when research is a project deliverable or the User explicitly requests deferral. When the project involves existing codebases that Workers will interact with, exploring those codebases to inform the planning documents is Context Gathering work - not a deliverable for the Implementation Plan.

For focused investigation (specific files, targeted questions, quick lookups), self-explore directly. For substantial research (cross-codebase exploration, extensive investigation), {PLANNER_SUBAGENT_GUIDANCE}. Structure the prompt with specific research questions, expected sources, and how findings will be used.

---

## 3. Context Gathering Procedure

Complete each step before proceeding to the next.

**Procedure:**
1. Round Iteration - governs iteration within each round.
2. Question Round 1 - Existing Materials and Vision.
3. Question Round 2 - Technical Requirements.
4. Question Round 3 - Implementation Approach and Quality.
5. Finalize Understanding - understanding summary, User review, procedure completion.

### 3.1 Round Iteration

These rules apply across all three question rounds.

**Iteration cycle** → For each question round:
1. Ask the initial questions defined for the round.
2. After each User response, assess gaps per §2.2 Response and Gap Assessment.
3. Follow up on gaps or advance per §2.2 Response and Gap Assessment.
4. Repeat until the round's focus areas are sufficiently covered.

Combine related questions naturally in conversation. Adapt depth per §2.3 Questioning Depth. Track what has been answered - ask only for what is missing.

**Validation criteria gathering:** Capture success states and criteria for each requirement. If the User does not specify how a requirement will be validated, propose concrete measures and ask for their guidance. Integrate validation gathering into Rounds 2 and 3 follow-ups. Retain criteria for Implementation Plan Task Validation fields.

### 3.2 Question Round 1: Existing Materials and Vision

**Focus areas:** Project type and deliverables, problem and purpose, essential features and scope, required skills and expertise, existing documentation and materials, current plan or vision, previous work and codebase context.

**Initial questions** → Select and adapt from these areas:
1. What type of deliverable(s) are you creating?
2. What problem does the project solve? What defines success and completion?
3. What are the essential features, sections, or deliverables?
4. What skills or expertise areas does this involve?
5. Do you have existing materials? (PRD, requirements, user stories, architecture, code, templates)
6. What is your current plan or vision?
7. If there is an existing codebase or previous work, what are the important files or documentation?

**Agent configuration** → If `{AGENTS_FILE}` was not found during the workspace scan (per §2.1 Guiding Principles), include: "I didn't find an existing `{AGENTS_FILE}` in your workspace. Do you have one elsewhere, or should we create one during Work Breakdown?" If the User provides a file, read it and note contents for integration.

**Round completion** → Before proceeding to Round 2, present a round completion summary per §2.2 Response and Gap Assessment. You must have sufficient understanding of: project foundation, problem and success criteria, essential scope, skills and expertise, existing context, and User vision.

### 3.3 Question Round 2: Technical Requirements

**Focus areas:** Design decisions and constraints, work structure and dependencies, technical and resource requirements, complexity and risk assessment, validation criteria.

**Initial questions** → Select and adapt from these areas:

*Work Structure and Dependencies:*
- Which parts can be done independently vs need sequential order?
- What are the most challenging aspects?
- Any dependencies between different parts of the work?

*Technical and Resource Requirements:*
- Does this work involve different technical environments or platforms?
- What is the deployment/delivery environment?
- External resources needed? (data sources, APIs, libraries)
- What actions require access outside the development environment?
- Which deliverables can be prepared/built within the development environment vs require external platform interaction?

*Complexity and Risk Assessment:*
- What is the target timeline or deadline?
- What are the anticipated challenging areas or known risks?
- Any parts requiring external input or review before proceeding?

*Existing Assets (if building on previous work):*
- What is the current structure and key components?
- What existing functionality should be preserved or modified?

*Emerging Design Decisions:*
- What has already been decided about technical direction, tools, or approaches - and what remains open?
- Are there things that are definitely in or out of scope?

**Planning document mapping:** As requirements emerge, track how information maps to planning documents per §1.2 Objectives. Gather validation criteria per §3.1 Round Iteration.

**Round completion** → Before proceeding to Round 3, present a round completion summary per §2.2 Response and Gap Assessment. You must have sufficient understanding of: design decisions and constraints, work structure and dependencies, technical requirements, complexity and risk factors, and validation criteria for core requirements.

### 3.4 Question Round 3: Implementation Approach and Quality

**Focus areas:** Technical constraints and preferences, workflow preferences, quality standards, coordination and approval requirements, domain organization, finalizing design decisions and Execution Standards.

**Initial questions** → Select and adapt from these areas:

*Technical Constraints and Preferences:*
- Required or prohibited tools, languages, frameworks, or platforms?
- Performance, security, compatibility requirements?
- Setup, configuration, or deployment steps requiring specific account access?

*Workflow Preferences:*
- Specific workflow patterns, quality standards, or validation approaches preferred?
- Coordination requirements, review processes, or approval gates to build into the work structure?

*Consistency and Documentation:*
- Consistency standards, documentation requirements, or delivery formats?
- Examples, templates, or reference materials illustrating preferred approach?

*Domain Organization (if distinct domains identified in earlier rounds):*
- Would related domains benefit from unified handling or separate parallel progress?
- Natural handoff points between different types of work?
- Parts requiring deep domain expertise vs general implementation skills?

*Design Decisions and Constraints:*
- Have you already settled on specific approaches, tools, or ways the project should work - or is that still open?
- Is there anything that's definitely in or out of scope?
- Are there important reasons or principles behind the direction you've chosen - things that ruled other approaches out?

**Round completion** → Before proceeding to §3.5, present a round completion summary per §2.2 Response and Gap Assessment. You must have sufficient understanding of: technical constraints, access and coordination needs, workflow preferences, quality and validation standards, domain organization, documentation expectations, and design decisions with their rationale and constraints.

### 3.5 Finalize Understanding

After completing the three question rounds, present gathered context for User review.

Perform the following actions:
1. Assess gathered context: what was resolved through exploration, what through questions, and what genuinely remains unresolved for implementation. Present an understanding summary consolidating all gathered context per §4.1 Understanding Summary Guidelines.
2. Pause for User review. Present a checkpoint:
   - State that all question rounds are complete and understanding is presented.
   - Ask the User to review carefully before planning document generation.
   - Offer options: modifications needed (describe issues) or approved (proceed to Work Breakdown).
   - If modifications needed → Apply targeted follow-ups, update summary, and repeat step 1.
   - If approved → Continue to step 3.
3. Output procedure completion stating context gathering is complete. The next step is the Work Breakdown procedure per `{GUIDE_PATH:work-breakdown}` §3 Work Breakdown Procedure.

---

## 4. Structural Specifications

### 4.1 Understanding Summary Guidelines

The understanding summary is presented per §3.5 Finalize Understanding for User review. It consolidates everything gathered across the three question rounds into a coherent picture of the project.

**Structure:** Use free-form markdown. Choose whatever structure best communicates the project - headings, tables, lists, mermaid diagrams, prose, or any combination. Adapt the format to the project's nature and complexity.

**Required coverage** (order and presentation are flexible):

- *Requirements and deliverables:* essential features, scope, success criteria
- *Design decisions and constraints:* choices made where alternatives existed, rationale, constraints that bound what's being built
- *Work structure signals:* identified domains, dependency relationships, complexity indicators, parallelism or sequencing constraints the User specified
- *Technical context:* environments, resources, constraints, access needs
- *Process and quality:* workflow preferences, coordination requirements, approval gates, validation approach
- *Execution conventions:* universal patterns or coding standards the User has specified; note whether an existing `{AGENTS_FILE}` was found

The understanding summary captures signals that inform Work Breakdown - domains, dependencies, constraints. Concrete decomposition into Stages, Tasks, and agent assignments happens after reading `{GUIDE_PATH:work-breakdown}` and applying its reasoning framework.

Prioritize clarity and completeness. Use diagrams for relationships, tables for structured comparisons, prose for narrative context. Do not force entries for categories where nothing emerged. The summary should be something the User can review and say "yes, you understand my project" or point out what's wrong.

---

## 5. Content Guidelines

### 5.1 Communication Quality

- *Conversational but purposeful:* Maintain natural dialogue while systematically gathering information. All questions gather context for planning documents - not for the Planner's own execution approach.
- *Adaptive formality:* Match the User's communication style and expertise level.
- *Collaborative framing:* Frame questions as partnership - propose interpretations rather than interrogating.
- *Facts vs preferences:* Distinguish User requirements (constraints) from preferences (guidance). Requirements are non-negotiable; preferences allow judgment during Work Breakdown.
- *Extraction over elicitation:* Derive technical requirements and design decisions from what the User describes naturally - do not ask Users to produce technical specifications directly. Technical formalization happens during Work Breakdown, not in the dialogue.

### 5.2 Common Mistakes

- *Over-questioning:* Excessive detail on minor aspects while missing critical gaps.
- *Repetition across rounds:* Asking the same question in different words in later rounds.
- *Skipping validation:* Accepting requirements without understanding success criteria.
- *Ignoring existing materials:* Asking questions already answered in provided documentation.
- *Deferring exploration:* Waiting to research when signals indicate relevant context exists now.
- *Premature decomposition:* Discussing or deciding decomposition structures (Stages, Tasks, agent assignments) during Context Gathering - these wait for Work Breakdown per §2.1 Guiding Principles.
- *Technical elicitation:* Asking Users to define schemas, interfaces, or technical specifications in precise terms rather than gathering requirements conversationally and performing the technical formalization during Work Breakdown.

---

**End of Guide**
