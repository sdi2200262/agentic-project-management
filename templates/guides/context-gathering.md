# APM {VERSION} - Context Gathering Guide

## 1. Overview

**Reading Agent:** Planner

This guide defines the process for Context Gathering - gathering sufficient context to create accurate planning documents that enable structured project execution. After the User approves the understanding summary at the end of this procedure, you proceed to the Work Breakdown procedure where the gathered context is formalized into three planning documents (Spec, Plan, and Rules).

---

## 2. Operational Standards

### 2.1 Guiding Principles

- *Clarity over exhaustion:* Aim for sufficient understanding, not exhaustive interrogation.
- *Leverage existing material:* Before Round 1, scan the workspace for existing materials (README, PRD, requirements, specs, `{RULES_FILE}`). If found, prompt the User to confirm relevance, read them, and skip redundant questions. When the workspace contains git repositories, check git history and branch structure as project signals alongside other exploration. Note workspace structure: which directories are repositories, which are working targets vs read-only references. Different repositories may have different conventions.
- *Explore on signal:* When User responses reference codebase elements or documentation, proactively explore before continuing questions. See §2.4 Exploration and Research Standards.
- *Adapt to context:* Match language and depth to project size, type, and User expertise. Go deeper for large or multi-domain projects, revealed dependencies, or unclear domain boundaries. Stay light for small projects with clear, complete responses.
- *Signals, not structure:* Identify work structure signals (domains, dependencies, complexity) but do not discuss or decide decomposition until Context Gathering is complete and you are proceeding to Work Breakdown. Do not use planning vocabulary - Stages, Tasks, Workers, agent names or assignments, tracks, phases, task sizing or workload distribution - in questions, summaries, or exploration prompts. Mapping signals to work units happens exclusively during Work Breakdown.
- *Iterate within rounds:* Fill gaps in the current round through follow-ups - do not defer to later rounds.

### 2.2 Response and Gap Assessment

When processing User responses, assess what was explicitly stated, what can be reasonably inferred, and what assumptions you are making. Explicit statements are high-confidence. Inferences on critical points should be verified. Assumptions should be flagged for clarification.

**Extraction lens:** Before flagging a gap, assess whether the technical formalization can be derived from what was described naturally. The standard for gap identification is whether responses are sufficient to inform planning - not whether the User stated requirements in technical terms. Raise a follow-up only when what was gathered is genuinely insufficient.

**Ambiguous responses:**
- *Vague:* Rephrase with concrete interpretations.
- *Incomplete:* Acknowledge the covered part and ask for the remainder.
- *Contradictory:* Surface the contradiction neutrally.
- *Uncertain:* Distinguish preferences (probe further) from genuine unknowns (consider research per §2.4 Exploration and Research Standards).

**Gap assessment:** A gap exists when information needed for planning documents is missing, ambiguous, or lacks validation criteria. After each User response, assess what gaps remain and what follow-ups would resolve them. Gaps are resolved by asking directly (missing info), rephrasing and confirming (ambiguity), or proposing concrete criteria (validation).

### 2.3 Round Advancement

Advance when the current round's focus areas are sufficiently covered and further questions would yield diminishing returns. Continue when gaps remain that affect planning document accuracy. Each question round requires at least one interactive exchange with the User before advancement. Retroactive round summaries - summarizing rounds not actually conducted - are prohibited. "Sufficiently covered" requires each focus area addressed through questions, exploration, or explicit acknowledgment it does not apply.

Before advancing, present a round completion summary in chat covering:
- *Context gathered:* key findings from this round.
- *Planning relevance:* how the findings inform subsequent planning - what type of context they contribute (design decisions, work structure signals, execution patterns).
- *Gaps assessed:* what gaps were identified, how resolved, and any acceptable gaps carried forward.
- *Advancement reasoning:* why this round is complete and what the next round builds on.

Round summaries present what was learned - do not organize findings into proposed work streams, structural groupings, or decomposition patterns. After Round 1 and 2 summaries, immediately begin the next round. After Round 3, continue to the understanding summary.

### 2.4 Exploration and Research Standards

When User responses or existing material reference codebase elements, or signal that relevant context exists, explore proactively. Do not wait for permission. Dispatch subagents autonomously to build deeper context. When subagent exploration answers some focus area questions but not others, ask the remaining unanswered ones. Ask reassurance and preference questions about big decisions or significant context gathered through exploration.

**After exploration.** Reassess gaps: what is now known, what questions are answered, what new gaps emerged. Subsequent questions target the delta. Present critical findings for confirmation.

**Scope assessment:** Research that builds the Planner's understanding of the project belongs in Context Gathering - exploring the codebase, verifying documentation, resolving technical unknowns. Research that is itself a project deliverable belongs in the Plan. Only defer when research is a project deliverable or the User explicitly requests deferral. When the project involves existing codebases that Workers will interact with, exploring those codebases to inform planning documents is Context Gathering work.

**Self-explore vs subagent:** For focused investigation (specific files, targeted questions, quick lookups), self-explore directly. For substantial research (cross-codebase exploration, extensive investigation), {PLANNER_SUBAGENT_GUIDANCE}. Structure the prompt with specific research questions, expected sources, and how findings will be used. Direct the subagent to include verification handles - file paths, commands, or specific locations - alongside findings. After subagent results return, assess whether findings resolve the research questions posed. If critical gaps remain, dispatch a follow-up subagent with targeted questions before continuing. When findings contribute specific details to planning documents, spot-check key claims through the handles provided. When findings inform general understanding - codebase structure, conventions, broad context - accept and synthesize without verification.

---

## 3. Context Gathering Procedure

Complete each step before proceeding to the next.

### 3.1 Archive Context

Before beginning question rounds, check for previous session archives.

1. Check if `.apm/archives/` exists.
   - If it does not exist or is empty → Skip to §3.3 Round Iteration.
2. Read `.apm/archives/index.md` if present. Otherwise, list archive directories in `.apm/archives/`.
3. Present the available archives to the User with basic info (name, date, scope). Ask: "Are any of these previous sessions relevant to the current project? If so, which ones?"
   - If the User indicates none are relevant → Skip to §3.3 Round Iteration.
4. For each indicated archive, {ARCHIVE_EXPLORER_GUIDANCE}. Integrate findings when the agent returns.
5. Verify archived findings against the current codebase: {PLANNER_SUBAGENT_GUIDANCE} with targeted verification questions using the handles the archive explorer provided. Identify what still holds, what has changed, and what has been invalidated.
6. Integrate verified context into question rounds as a baseline - focus subsequent questions on delta (what changed, what is new) rather than re-establishing what was already known.

### 3.2 Workspace Assessment

Before question rounds begin, scan the workspace to map the project environment per §2.1 Guiding Principles.

Perform the following actions:
1. Scan the workspace: list directory structure, identify git repositories (check recent commit history and branch structure), locate existing materials (README, PRD, requirements docs, architecture docs).
2. Check if `{RULES_FILE}` exists. If found, read its contents and present them to the User. Ask whether the existing content is current and relevant to this session, explaining that during Work Breakdown an APM_RULES block will be added to the file where APM-specific standards will go, and that existing content outside the block will be preserved. Ask if the User wants to consider any modifications to the existing content alongside the APM Rules block during Work Breakdown. Note findings for integration. If not found, note its absence for the Agent configuration step in Round 1.
3. If `.apm/` resides inside a repository, note that the default is to gitignore the entire `.apm/` directory. Ask the User if they want to track any `.apm/` artifacts (planning documents, Memory) in git. If `.apm/` is not inside a repository, no action needed.
4. Note the workspace structure: which directories are working targets, which are references, where authoritative documents reside. This feeds into the Spec's Workspace section during Work Breakdown.

Present a brief summary of what was found to the User before starting question rounds. Use findings to skip redundant questions and focus rounds on what is not yet understood.

### 3.3 Round Iteration

These rules apply across all three question rounds.

**Iteration cycle.** For each question round:
1. Ask the initial questions defined for the round.
2. After each User response, assess gaps per §2.2 Response and Gap Assessment.
3. Follow up on gaps or advance per §2.3 Round Advancement.
4. After subagent results return, verify findings per §2.4 Exploration and Research Standards. If critical gaps remain, dispatch a follow-up before continuing.
5. Repeat until the round's focus areas are sufficiently covered.

Combine related questions naturally in conversation. Track what has been answered - ask only for what is missing.

**Open elicitation.** Before each round's completion summary, include a broad open-ended question targeting what the focused questions may have missed. Generate it dynamically from what has not been covered: review what was gathered, identify categories within the round's theme that received no attention, and ask about those gaps specifically. Do not use a fixed set of example topics. The open-ended question should not block round advancement - the User can address it together with the next round's questions if they prefer.

**Validation criteria gathering:** Capture success states and criteria for each requirement. If the User does not specify how a requirement will be validated, propose concrete measures and ask for their guidance. Integrate validation gathering into Rounds 2 and 3 follow-ups.

### 3.4 Question Round 1: Existing Materials and Vision

**Focus areas:** Project type and deliverables, problem and purpose, essential features and scope, required skills and expertise, existing documentation and materials, current plan or vision, previous work and codebase context.

**Initial questions.** Select and adapt from these areas:
1. What type of deliverable(s) are you creating?
2. What problem does the project solve? What defines success and completion?
3. What are the essential features, sections, or deliverables?
4. What skills or expertise areas does this involve?
5. Do you have existing materials? (PRD, requirements, user stories, architecture, code, templates)
6. What is your current plan or vision?
7. If there is an existing codebase or previous work, what are the important files or documentation?

**Agent configuration.** If `{RULES_FILE}` was not found during the workspace assessment (§3.2): "I didn't find an existing `{RULES_FILE}` in your workspace. Do you have one elsewhere, or should we create one during Work Breakdown?" If the User provides a file, read it and note contents for integration. If `{RULES_FILE}` was found during the workspace assessment, it has already been discussed with the User - no need to revisit here.

**Round completion.** Present a round completion summary per §2.3 Round Advancement. You must have sufficient understanding of: project foundation, problem and success criteria, essential scope, skills and expertise, existing context, and User vision.

### 3.5 Question Round 2: Technical Requirements

**Focus areas:** Design decisions and constraints, work structure and dependencies, technical and resource requirements, complexity and risk assessment, validation criteria.

**Initial questions.** Select and adapt from these areas:

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

**Round completion.** Present a round completion summary per §2.3 Round Advancement. You must have sufficient understanding of: design decisions and constraints, work structure and dependencies, technical requirements, complexity and risk factors, and validation criteria for core requirements.

### 3.6 Question Round 3: Implementation Approach and Quality

**Focus areas:** Technical constraints and preferences, workflow preferences (including version control conventions if not already detected during exploration), quality standards, project-level coordination and approval requirements (external reviews or validation, stakeholder sign-offs, approval gates), domain organization, finalizing the Spec and Rules.

**Initial questions.** Select and adapt from these areas:

*Technical Constraints and Preferences:*
- Required or prohibited tools, languages, frameworks, or platforms?
- Performance, security, compatibility requirements?
- Setup, configuration, or deployment steps requiring specific account access?

*Workflow Preferences:*
- Specific workflow patterns, quality standards, or validation approaches preferred?
- Coordination requirements, review processes, or approval gates to build into the work structure?
- Version control preferences? Commit message conventions, branching strategy, or other git workflow rules? Skip if conventions were already detected during workspace exploration. If the User declines version control, note that parallel dispatch will be unavailable and confirm.

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

**Round completion.** Present a round completion summary per §2.3 Round Advancement. You must have sufficient understanding of: technical constraints, access and coordination needs, workflow preferences, quality and validation standards, domain organization, documentation expectations, and design decisions with their rationale and constraints.

### 3.7 Finalize Understanding

After completing the three question rounds, present gathered context for User review.

Perform the following actions:
1. Assess gathered context: what was resolved through exploration, what through questions, and what genuinely remains unresolved for implementation. Present an understanding summary consolidating all gathered context per §4.1 Understanding Summary Format.
2. Pause for User review. Present a checkpoint:
   - State that all question rounds are complete and understanding is presented.
   - Ask the User to review carefully before planning document generation.
   - Offer options: modifications needed (describe issues) or approved (proceed to Work Breakdown).
   - If modifications needed → Apply targeted follow-ups, update summary, and repeat step 1.
   - If approved → Continue to step 3.
3. Output procedure completion stating Context Gathering is complete. The next step is the Work Breakdown procedure per `{GUIDE_PATH:work-breakdown}` §3 Work Breakdown Procedure.

---

## 4. Structural Specifications

### 4.1 Understanding Summary Format

The understanding summary is presented per §3.7 Finalize Understanding for User review. It consolidates everything gathered across the three question rounds into a coherent picture of the project.

**Structure:** Use free-form markdown. Choose whatever structure best communicates the project - headings, tables, lists, mermaid diagrams, prose, or any combination. Adapt the format to the project's nature and complexity.

**Required coverage** (order and presentation are flexible):

- *Requirements and deliverables:* essential features, scope, success criteria
- *Design decisions and constraints:* choices made where alternatives existed, rationale, constraints that bound what's being built
- *Work structure signals:* identified domains, dependency relationships, complexity indicators, parallelism or sequencing constraints the User specified. Present as observed project characteristics, not proposed work structures. Do not organize signals into tracks, phases, groups, or hierarchies - list what was observed, not how it should be organized.
- *Technical context:* environments, resources, constraints, access needs
- *Process and quality:* workflow preferences, coordination requirements, approval gates, validation approach
- *Execution conventions:* universal patterns or coding standards the User has specified; note whether an existing `{RULES_FILE}` was found; version control conventions detected or established

The understanding summary captures what was gathered - not how it will be decomposed. Decomposition happens in the next procedure. Use diagrams for relationships, tables for structured comparisons, prose for narrative context. Do not force entries for categories where nothing emerged. The summary should be something the User can review and say "yes, you understand my project" or point out what's wrong.

---

## 5. Content Guidelines

### 5.1 Communication Quality

Distinguish User requirements (constraints) from preferences (guidance). Requirements are non-negotiable; preferences allow judgment during planning.

### 5.2 Common Mistakes

- *Over-questioning:* Excessive detail on minor aspects while missing critical gaps.
- *Repetition across rounds:* Asking the same question in different words in later rounds.
- *Skipping validation:* Accepting requirements without understanding success criteria.
- *Premature decomposition:* Using decomposition vocabulary or organizing findings into work structures per §2.1 Guiding Principles (e.g., "Track A/B/C" hierarchies, "separate Workers," "task sizing").
- *Ignoring existing materials:* Asking questions already answered by workspace materials per §2.1 Guiding Principles.
- *Deferring exploration:* Waiting to research while signals indicate relevant context exists per §2.4 Exploration and Research Standards.
- *Agent coordination questions:* Asking about Worker blocker handling, dispatch strategy, or escalation protocols - these are framework-defined, not project context. Round 3 coordination focuses on project-level needs (external reviews, approval gates), not agent coordination.

---

**End of Guide**
