---
name: context-gathering
description: Project discovery through structured elicitation of requirements, constraints, and context. Defines the Context Gathering procedure for the Planner Agent.
---

# APM {VERSION} - Context Gathering Skill

## 1. Overview

**Reading Agent:** Planner Agent

This skill defines the discovery methodology for the Context Gathering procedure. The goal is gathering sufficient context to create an accurate Implementation Plan that can be executed by other Agents.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions to perform. Follow each subsection sequentially through all Question Rounds. See §3 Context Gathering Procedure.

**Use Problem Space for reasoning.** When interpreting responses, identifying gaps, or adapting questioning depth, consult the relevant reasoning subsection. See §2 Problem Space.

**Use Policies for decisions.** When encountering branch points (advance vs. follow-up, delegate vs. clarify), apply the relevant policy to determine the appropriate action. See §4 Policies.

**Output only structured blocks.** Present checkpoints, summaries, completions and ask for research delegations using the Checkpoint Block, the Summary Block, the Completion Block and Request Block formats. Do not expose internal deliberation beyond these structured outputs. See §5 Structural Specifications.

### 1.2 Objectives

Gather sufficient context across four categories:
- **Vision:** Project goals, deliverables, success criteria
- **Technical:** Requirements, constraints, environments, dependencies
- **Process:** Workflow preferences, quality standards, coordination requirements
- **Validation:** Success states and criteria, acceptance tests, completion indicators

**Goal:** Sufficient context to create an Implementation Plan that enables a Manager Agent to coordinate effectively and Worker Agents to execute focused tasks.

### 1.3 Methodology Principles

- **Clarity over exhaustion:** Aim for sufficient contextual understanding, not exhaustive interrogation
- **Leverage existing material:** Before beginning Question Round 1, scan the workspace for existing materials (README, PRD, requirements, specs, `{AGENTS_FILE}`). If any are found, prompt the User to confirm which materials are relevant to the project, then read those files and use the findings to avoid asking redundant questions.
- **Adapt to context:** Adapt language and depth to project size, type and user expertise
- **Iterate within Question Rounds:** Use iterative follow-up questions based on User responses to fill gaps in current Question Round - not later
- **Research when blocked:** When user clarification is insufficient, apply the research delegation policy. See §4.2 Research Delegation Policy.

---

## 2. Problem Space

This section establishes the reasoning approach for executing Context Gathering. It guides how to interpret responses, identify gaps, categorize information, and adapt questioning depth.

### 2.1 Planner Agent Role Context

**Maintain natural conversation while operating with internal strategic awareness. YOU ARE THE PLANNER, NOT THE EXECUTOR:**
- **Your Role:** Break down user requirements into a detailed Implementation Plan with actionable tasks that other Agents will execute
- **Manager Agent Role:** Will coordinate project execution using your Implementation Plan and assign tasks to Worker Agents
- **Worker Agent Role:** Will execute individual tasks you (Planner Agent) specify in the plan and the Manager Agent assigns to them

All questions gather context for the Implementation Plan, not how you (Planner Agent) should perform work.

### 2.2 Response Interpretation

When processing User responses, reason through:

**Explicit vs Implicit Information:**
- What did the User directly state? (explicit - high confidence)
- What can be inferred from their response? (implicit - verify if critical)
- What assumptions am I making? (flag for clarification)

**Signal Recognition:**
- Hesitation or uncertainty in response → Potential knowledge gap or undecided requirement
- Detailed, confident answers → Firm requirements, less follow-up needed
- References to existing materials → Read before asking redundant questions
- "I'm not sure" or "maybe" → Probe for preferences vs. genuine uncertainty

**Response Completeness:**
- Did the response address the question asked?
- Did it reveal adjacent information worth noting?
- Did it raise new questions or dependencies?

### 2.3 Gap Identification

A gap exists when information required for the Implementation Plan is missing or ambiguous. Identify gaps by assessing:

**Coverage Gaps:** Required information not yet gathered
- Essential features mentioned but not elaborated
- Dependencies referenced but not detailed
- Success criteria stated vaguely

**Clarity Gaps:** Information provided but unclear
- Ambiguous terms that could mean multiple things
- Conflicting statements across responses
- Scope boundaries not defined

**Validation Gaps:** Requirements without success criteria
- Features described without acceptance criteria
- Deliverables without completion indicators
- Quality expectations not quantified

**Gap Resolution Approach:**
- Coverage gaps → Ask directly for missing information
- Clarity gaps → Rephrase and confirm understanding
- Validation gaps → Propose concrete criteria and confirm

### 2.4 Context Categorization

As you receive User input, internally categorize and retain planning implications:

**Complexity Awareness:**
- User describes challenging/complex aspects → Flag for careful breakdown
- User expresses uncertainty about approach → Note investigation and research needs
- User mentions sequential patterns ("first this, then that") → Retain sequential workflow patterns
- User describes parallel work streams → Retain concurrent workflow patterns

**Work Organization Memory:**
- User explains independent vs dependent work → Remember workflow relationships and dependencies
- User describes different skill areas → Retain domain boundaries for agent assignment
- User mentions external dependencies → Flag coordination and environment needs
- User identifies bottlenecks or critical path items → Note priority sequencing requirements
- User provides examples or references → Capture for informed planning decisions

**Domain Organization:**
- User describes distinct but related work areas → Note potential for unified or separated handling
- User mentions tight coupling between domains → Flag for unified assignment consideration
- User expresses preference for coordination style → Retain for domain grouping decisions
- User indicates expertise boundaries → Note for separation consideration
- User describes handoff expectations between areas → Capture coordination preferences

**Process and Implementation Requirements:**
- User mentions workflow preferences → Retain for task specification integration
- User describes validation needs or approval processes → Note explicit verification steps
- User references formatting or style guidelines → Preserve as implementation constraints
- User specifies delivery or documentation standards → Flag for task descriptions
- User describes tool preferences or technical requirements → Note for execution guidance
- User indicates tracking or progress validation requirements → Note as task or stage requirements

**Standards Awareness** (informs `{AGENTS_FILE}` creation):
Watch for any project-wide standards or conventions that should apply universally. Examples of signals (not exhaustive - each project is unique):
- User mentions coding conventions, style guides, or formatting preferences
- User describes testing requirements or coverage expectations
- User specifies documentation format or comment standards
- User mentions commit message format or workflow conventions
- User references linting rules or static analysis requirements

**Specification Awareness** (informs `Specifications.md` creation):
Watch for design decisions and technical details that need formal documentation. Examples of signals (not exhaustive - each project is unique):
- User describes data structures, schemas, or models
- User discusses API design, endpoints, or contracts
- User makes architectural decisions or describes system design
- User mentions existing specification documents (reference rather than duplicate)
- User describes integration requirements or interfaces
- User indicates system boundaries or component relationships
- User discusses design decisions and their rationale

**Validation Awareness:**
- User mentions automated checks (tests, CI, linting) → Note as Programmatic validation
- User describes required outputs or deliverables → Note as Artifact validation
- User indicates approval or review requirements → Note as User validation
- User specifies acceptance criteria or success states → Capture and categorize by validation type

**Scope Understanding:**
- User describes deliverable scale → Carry forward scope implications for workload sizing
- User mentions timeline constraints → Retain urgency factors for planning decisions
- User identifies risk areas → Flag for extra attention during breakdown
- User specifies quality standards or acceptance criteria → Preserve validation requirements

### 2.5 Questioning Depth Adaptation

Adapt questioning depth based on project characteristics and User signals:

**Go Deeper When:**
- Project is large or multi-domain (more coordination complexity)
- User responses reveal dependencies or risks
- Requirements have validation implications
- Domain boundaries are unclear
- User indicates complexity or uncertainty

**Stay Light When:**
- Project is small or single-domain
- User provides clear, complete responses
- Requirements are straightforward with obvious validation
- User demonstrates expertise and confidence
- Time constraints are mentioned

**Depth Calibration Signals:**
- User says "that's all" or similar or gives brief answers → Respect, but verify completeness
- User elaborates extensively → Follow the thread, capture details
- User redirects ("let's move on") → Note current state, proceed
- User asks clarifying questions back → Engage, mutual understanding matters

### 2.6 Planning Perspective

While maintaining natural conversation, internally consider how gathered information translates to Implementation Plan elements:

- **Task Granularity:** How to break work into focused tasks that Worker Agents can execute independently
- **Agent Specialization:** What domain boundaries make sense for assigning different Worker Agents
- **Domain Organization:** Whether related domains benefit from unified handling (tighter coordination) or separation (parallel progress)
- **Coordination Points:** Where Worker Agents will need Manager Agent coordination or cross-agent collaboration
- **User Involvement Points:** What actions require User input, approval, guidance or external platform/tool access
- **Task Dependencies:** What must be completed before other work can begin
- **Quality Integration:** How to embed user preferences as explicit task requirements
- **Validation Strategy:** How to validate success of each requirement and what criteria apply

### 2.7 Validation Criteria Types

Context Gathering gathers validation criteria that will be categorized into three types for the Implementation Plan:

- **Programmatic**: Automated verification - tests pass, builds succeed, CI checks pass, scripts execute correctly, linting passes, type checking succeeds
- **Artifact**: File/output existence and structure - documentation exists, config files present, deliverables have required format and sections, schemas validate
- **User**: Human judgment required - design approval, content review, architectural decisions, subjective quality assessment

Most requirements combine multiple types (e.g., code changes need Programmatic tests + User review). During discovery, gather the validation criteria and success states depending on the project's requirements.

---

## 3. Context Gathering Procedure

This section defines the sequential actions that accomplish Context Gathering. The procedure transforms User responses into structured context for the Implementation Plan.

**Progression Gates:** Each action must complete before proceeding to the next. No skipping or batching unless explicitly instructed by User.

**Output Blocks:** Round completions use the **Round Completion Block** format. Procedure Checkpoint uses the **Understanding Summary** format. Requests (such as research delegation) use the **Request Block** format. Reasoning content draws from §2 Problem Space for interpretation guidance and §4 Policies for branch point decisions. See §5 Structural Specifications.

**Procedure:**
1. Question Round Protocol → Governs iteration within each round
2. Question Round 1 → Existing Materials and Vision
3. Question Round 2 → Technical Requirements
4. Question Round 3 → Implementation Approach and Quality
5. Procedure Checkpoint → Understanding Summary presentation and modification handling
6. Procedure Completion → Progression Gate to Work Breakdown

### 3.1 Question Round Protocol

This protocol governs how Question Rounds flow. It defines the iteration pattern and validation gathering approach that applies across all rounds.

#### 3.1.1 Iteration Cycle

For each Question Round (1-3), use this iteration cycle:
1. Ask the initial questions defined for the current Round
2. After each User response, assess gaps: What specific gaps remain? What ambiguities need clarification? What follow-ups would gather missing information?
3. Strategic decision: Apply the Round Advancement Policy to determine whether to follow up or advance. See §4.1 Round Advancement Policy.
4. Repeat steps 2-3 until current Round understanding is complete

**Anti-Repetition Guidance:** Track what has been answered across the conversation. Ask only for missing specifics, not topics already covered. Fill gaps in current Round; do not defer to later Rounds. If gaps cannot be resolved through User clarification during iteration, apply the Research Delegation Policy. See §4.2 Research Delegation Policy.

**Efficiency Guidance:** When asking initial questions, combine related items naturally in conversation. Adapt depth based on project complexity - smaller projects need lighter discovery than large multi-domain efforts. See §2.5 Questioning Depth Adaptation.

#### 3.1.2 Validation Criteria Gathering

You must capture and suggest clear success states and criteria for each User requirement to inform Implementation Plan task Validation fields. If the User does not specify how a requirement will be validated, proactively propose concrete success measures and ask if these suggestions align with their expectations.

**Gathering Approach:**
- Use targeted follow-ups based on what the User has described: "You mentioned [feature X]. Would success mean [suggested success state]?", "Would it be complete when [proposed criteria]?"
- If the requirement is subjective (relies on User review or personal judgment), ask how they would determine success, or gently propose acceptance indicators
- Adapt questions to the specific requirement - do not use a fixed question list

**Type Awareness:**
When gathering validation criteria, consider which validation type(s) will apply:
- If success can be checked automatically (tests, builds, CI, linting) → Programmatic
- If success means a file or artifact exists with correct and expected structure and data → Artifact
- If success requires human judgment or approval → User

Many requirements need multiple types. Capture all applicable criteria; type categorization happens during Procedure Checkpoint. See §3.5 Procedure Checkpoint.

Integrate validation gathering into your follow-ups within Rounds 2 and 3. Retain agreed-upon success states and criteria for the Implementation Plan task Validation fields.

### 3.2 Question Round 1: Existing Materials and Vision

#### 3.2.1 Focus Areas

Project type and deliverables; problem and purpose; essential features and scope; required skills and expertise areas; existing documentation and materials; current plan or vision; previous work and codebase context.

#### 3.2.2 Initial Questions

1. What type of deliverable(s) are you creating? (document, analysis, codebase, dataset, presentation, etc.)
2. What problem does the project solve? What defines success and completion?
3. What are the essential features, sections, or deliverables?
4. What skills/expertise areas does this involve? (writing, analysis, design, coding, research, visualization, etc.)
5. Do you have existing materials? (PRD, requirements specs, user stories, roadmaps, architecture diagrams, code, research sources, templates)
6. What is your current plan or vision if not already covered by the above?
7. If there is an existing codebase or previous work, what are the important files or documentation?

**Question Delivery:** Combine related questions naturally in conversation rather than asking sequentially. Adapt language to project context and user expertise level. Skip questions already answered by existing materials or previous responses.

**Agent Configuration:** If `{AGENTS_FILE}` was not found during the workspace scan (see §1.3 Methodology Principles), include in your initial questions: "I didn't find an existing `{AGENTS_FILE}` in your workspace. Do you have one elsewhere, or should we create one during Work Breakdown?" If User provides a file, read it and note existing contents for integration. If no existing file, note that it will be created during Work Breakdown.

#### 3.2.3 Gap Assessment Criteria

After each User response, assess:
- **Project Foundation:** Is the project type and deliverable format clear?
- **Problem and Purpose:** Do you understand the problem being solved and success criteria?
- **Essential Scope:** Are the essential features, sections, or deliverables identified?
- **Skills and Expertise:** Are the required skill/expertise areas clear?
- **Existing Context:** Do you understand the existing foundation and what needs to be built?
- **Vision Clarity:** Are there aspects of their vision that need more detail or clarification?
- **Material Understanding:** If existing materials mentioned, do you understand their structure and relevance?

**Research Delegation:** If gaps cannot be resolved through User clarification during iteration, consider delegating bounded research. See §4.2 Research Delegation Policy.

**Continue with targeted follow-ups addressing specific gaps until Question Round 1 understanding is complete. Before proceeding to Round 2, you must understand: project type and deliverable format, problem being solved and success criteria, essential features and scope, required skill/expertise areas, what exists vs. what needs to be created, user's vision and primary goals, relevant existing materials and their role. See §4.1 Round Advancement Policy.**

### 3.3 Question Round 2: Technical Requirements

#### 3.3.1 Focus Areas

Work structure and dependencies; technical and resource requirements; complexity and risk assessment; validation criteria; timeline constraints.

#### 3.3.2 Initial Questions

Select and adapt questions that remain unanswered from these areas:

**Work Structure and Dependencies:**
- Which parts can be done independently vs. need sequential order?
- What are the most challenging or time-consuming aspects?
- Any dependencies between different parts of the work?
- What intermediate deliverables would help track progress?

**Technical and Resource Requirements:**
- Does this work involve different technical environments or platforms?
- What is the deployment/delivery environment?
- External resources needed? (data sources, APIs, libraries, references)
- What actions require access outside the development environment?
- Which deliverables can be prepared/built within development tools vs require external platform interaction?

**Complexity and Risk Assessment:**
- What is the target timeline or deadline?
- What are the anticipated challenging areas or known risks?
- Any parts requiring external input or review before proceeding?

**Existing Assets (if building on previous work):**
- What is the current structure and key components?
- What existing functionality or content should be preserved or modified?

**Question Delivery:** Combine related questions naturally in conversation rather than asking sequentially. Adapt language to project context and user expertise level. Skip questions already answered by existing materials or previous responses.

**Validation Criteria Gathering:** As requirements emerge, gather validation criteria. See §3.1.2 Validation Criteria Gathering.

#### 3.3.3 Gap Assessment Criteria

After each User response, assess:
- **Work Structure:** Do you understand dependencies, challenging aspects, and intermediate deliverables?
- **Technical and Resource Requirements:** Are environment needs, external resources, and platform requirements clear?
- **Complexity Assessment:** Are challenging areas, timeline constraints, and known risks understood?
- **Validation Criteria Coverage:** Have validation criteria and success states been captured for core requirements?

**Research Delegation:** If gaps cannot be resolved through User clarification during iteration, consider delegating bounded research. See §4.2 Research Delegation Policy.

**Continue with targeted follow-ups addressing specific gaps until Question Round 2 understanding is complete. Before proceeding to Round 3, you must understand: work breakdown structure and dependencies, technical and resource requirements, complexity and risk factors, validation criteria for core requirements. See §4.1 Round Advancement Policy.**

### 3.4 Question Round 3: Implementation Approach and Quality

#### 3.4.1 Focus Areas

Technical constraints and preferences; workflow preferences and methodologies; quality standards and validation approaches; coordination and approval requirements; domain organization preferences; consistency and documentation standards.

#### 3.4.2 Initial Questions

Select and adapt questions that remain unanswered from these areas:

**Technical Constraints and Preferences:**
- Required or prohibited tools, languages, frameworks, or platforms?
- Performance, security, compatibility, or formatting requirements?
- Are there setup, configuration, or deployment steps requiring specific account access?
- What parts involve User-specific accounts, credentials, or manual coordination steps?
- If existing build systems, tools, or processes were mentioned in Round 2, what are they and how should they be used?

**Workflow Preferences and Methodologies:**
- Are there specific workflow patterns, quality standards, or validation approaches you prefer?
- Are there coordination requirements, review processes, or approval gates that should be built into the work structure?

**Consistency and Documentation Standards:**
- Any consistency standards, documentation requirements, or delivery formats I should incorporate?
- Do you have examples, templates, or reference materials that illustrate your preferred approach?

**Domain Organization (if distinct but related domains were identified in earlier Rounds):**
- "I notice [domain A] and [domain B] are related. Would you prefer these handled together for tighter coordination, or separately for parallel progress?"
- "Are [domain A] and [domain B] areas that could be typically handled together, or separate specializations in your view?"
- Are there natural handoff points where one type of work ends and another begins?
- Which parts require deep domain expertise vs general implementation skills?

**Question Delivery:** Combine related questions naturally in conversation rather than asking sequentially. Adapt language to project context and user expertise level. Skip questions already answered by existing materials or previous responses.

**Standards Gathering:** As process preferences and constraints emerge, note standards that should apply universally (these inform `{AGENTS_FILE}` content).

**Validation Criteria Gathering:** Continue gathering validation criteria. See §3.1.2 Validation Criteria Gathering.

#### 3.4.3 Gap Assessment Criteria

After each User response, assess:
- **Technical Constraints:** Are required/prohibited tools, frameworks, platforms, and performance requirements clear?
- **Access and Coordination:** Do you understand account access needs, credential requirements, and manual coordination steps?
- **Workflow Preferences:** Are workflow patterns, quality standards, and coordination approaches clear?
- **Approval Requirements:** Are review processes, approval gates, and collaboration requirements clear?
- **Domain Organization:** If distinct but related domains exist, do you understand User's preference for unified vs separated handling?
- **Standards:** Are coding conventions, documentation requirements, and workflow conventions understood for `{AGENTS_FILE}`?
- **Validation Coverage:** Have validation criteria and success states been gathered for process and quality requirements?

**Research Delegation:** If gaps cannot be resolved through User clarification during iteration, consider delegating bounded research. See §4.2 Research Delegation Policy.

**Continue with targeted follow-ups addressing specific gaps until Question Round 3 understanding is complete. Before proceeding to Procedure Checkpoint, you must understand: technical constraints and preferences, access and coordination requirements, workflow and process preferences, quality and validation standards, coordination and approval requirements, domain organization preferences, documentation and delivery expectations. See §4.1 Round Advancement Policy.**

### 3.5 Procedure Checkpoint

After completing the three Question Rounds, present the gathered context for User review and handle any modification requests before proceeding to Work Breakdown.

* **Action 1:** Present the Understanding Summary Block consolidating all gathered context. See §5.2 Understanding Summary Block.

* **Action 2:** Immediately after the summary, output the Checkpoint Block:
  ```
  **CHECKPOINT:** Context Gathering complete. Understanding presented [updated if after modifications].

  Please review my understanding carefully. I want to ensure I have understood your requirements correctly before generating the Plan.

  **Your options:**
  - **Modifications needed** → Describe any misunderstandings, missing requirements or constraints and I will update.
  - **All looks good** → I will proceed to the Work Breakdown Procedure.
  ```

* **Action 3:** Handle User response:
  - If User requests modifications → Identify which Question Round's focus area the modification relates to → Use that Round's questioning approach for targeted follow-ups → Update relevant summary sections → Return to Action 1 with updated summary
  - If User approves (or indicates no modifications needed) → Proceed to §3.6 Procedure Completion

### 3.6 Procedure Completion

Output the Completion Block. This is a **Progression Gate** - do NOT proceed to Work Breakdown until this block is output.

* **Action 1:** Output the Completion Block:
  ```
  **COMPLETE:** Context Gathering Procedure
  Summary: All Question Rounds completed. Project context gathered and validated.
  Next: Work Breakdown Procedure
  ```

**Procedure Control Returns:** Control returns to the Planner Agent Initiation Prompt. Proceed to Work Breakdown Procedure.

---

## 4. Policies

This section defines the decision rules that govern choices at branch points during Context Gathering execution.

### 4.1 Round Advancement Policy

**Decision Domain:** When to advance to the next Question Round vs. continue with follow-ups in the current Round.

**Advance to Next Round When:**
- All gap assessment criteria for the current Round are satisfied
- No ambiguities remain that would affect Implementation Plan accuracy
- Further questions would be redundant or yield diminishing returns

**Continue Current Round When:**
- Gap assessment criteria reveal missing information
- User responses contain ambiguities requiring clarification
- Critical requirements lack validation criteria

**Round Completion Requirements:**

Before advancing to the next Round (Rounds 1-3 only), output a Round Completion Block. See §5.1 Round Completion Block.

**Round-Specific Completion Criteria:**
- **Round 1**: Project foundation, problem and purpose, essential scope, required skills, existing materials, vision clarity
- **Round 2**: Work structure, dependencies, technical and resource requirements, complexity assessment, validation criteria
- **Round 3**: Technical constraints and preferences, process preferences, coordination needs, domain organization, standards

After completing Rounds 1 and 2 and displaying the Round Completion Block, immediately begin the next Question Round's Initial Questions.

After completing Round 3 and displaying the Round Completion Block, immediately proceed to Procedure Checkpoint. See §3.5 Procedure Checkpoint.

### 4.2 Research Delegation Policy

**Decision Domain:** When to delegate research to a Delegate Agent vs. continue with User clarification vs. defer to Implementation Plan.

**Research IS appropriate when:**
- User cannot answer (genuinely doesn't know, not just hasn't considered)
- Further clarification questions won't resolve the gap
- The gap is specific and bounded
- The answer enables better planning

**Research is NOT appropriate when:**
- User should decide (preferences, requirements, acceptance criteria)
- Scope is too broad (would require multiple delegations)
- Research IS the project deliverable (belongs in Implementation Plan, not Planning Phase)

**Research Approach Decision:**

Choose approach based on scope:
- **Self-Research:** Small scope, can be completed quickly using available tools (e.g., explore existing codebase documentation or architecture)
- **Delegation:** Bounded scope, specific question, needs dedicated focus (e.g., research best practices for a specific technology or existing codebase too large to explore quickly)
- **Note for Plan:** Large scope, multiple questions, or research is central to project (leave as research task in Implementation Plan)

**Delegation Actions:**

When delegation is appropriate output a Delegation Request Block. See §5.3 Delegation Request Block

**If User approves delegation:**
* **Action 1:** Check if `.apm/Memory/Stage_00_Planning/` exists. If not, create it (first delegation only). This directory stores delegation logs during the Planning Phase.
* **Action 2:** Read the Research Delegation skill: {SKILL_PATH:delegate-research/SKILL.md}
* **Action 3:** Provide the User the Delegation Prompt following the skill. User then opens Delegate Agent Session and provides delegated research task.
* **Action 5:** Delegate Agent logs findings to `.apm/Memory/Stage_00_Planning/Delegation_Log_00_<SequentialNum>_Research_<Slug>.md`
* **Action 6:** Delegate Agent returns Delegation Report to User.
* **Action 7:** User returns to Planner Agent with report.
* **Action 8:** Read the Delegation Memory Log at provided path.
* **Action 9:** Integrate findings into current Question Round.

**If User declines:**
* **Action 1:** Note the research question as Implementation Plan requirement.
* **Action 2:** Continue with current Question Round using available information.

**If User selects self-research:**
Only appropriate when scope is small and can be completed quickly. Prioritize context preservation; if research requires reading many files or extensive exploration, recommend delegation or note as Implementation Plan requirement.
* **Action 1:** Identify the specific question to answer.
* **Action 2:** Use available tools to explore codebase, read documentation.
* **Action 3:** Stop if scope expands beyond initial estimate; recommend delegation.
* **Action 4:** Integrate findings into current Question Round.

### 4.3 Ambiguous Response Policy

**Decision Domain:** How to handle User responses that are unclear, incomplete, or contradictory.

**When Response is Vague:**
- Rephrase and ask for specifics: "When you say [X], do you mean [interpretation A] or [interpretation B]?"
- Propose concrete examples: "For instance, would that include [specific example]?"

**When Response is Incomplete:**
- Acknowledge what was provided, ask for remainder: "I understand [covered part]. Could you also clarify [missing part]?"
- Do not assume; flag uncertainty if critical

**When Response Contains Contradiction:**
- Surface the contradiction neutrally: "Earlier you mentioned [X], but just now [Y]. Could you help me understand which applies?"
- Do not resolve contradictions by assumption

**When User Says "I Don't Know":**
- Distinguish between "haven't decided" (probe for preferences) and "genuinely unknown" (consider research delegation)
- For undecided items, propose options and ask for preference
- For unknown items, assess if research would help or if it should be deferred to Implementation Plan

### 4.4 Additional Materials Policy

**Decision Domain:** When to request existing documentation or materials from the User.

**Request Materials When:**
- User references existing documentation (PRD, specs, architecture docs)
- Project involves existing codebase with documentation
- User mentions templates, examples, or reference materials
- Standards or conventions are described as "documented somewhere"

**Request Format:**
- Be specific: "Could you point me to the [specific document type]?"
- Offer to read and summarize: "If you share that file, I can review it and incorporate the relevant details"
- Confirm relevance: "Is [mentioned document] current and relevant to this project?"

**After Receiving Materials:**
- Read the provided files before continuing questions
- Acknowledge what was learned: "From [document], I see [key points]"
- Skip questions already answered by the materials
- Ask clarifying questions only for gaps or ambiguities in the materials

---

## 5. Structural Specifications

This section defines the output formats for blocks used during Context Gathering.

### 5.1 Round Completion Block

Output this Completion Block before advancing from Rounds 1, 2, or 3 to the next Round:
```
## Question Round [N] Complete:

**Context Gathered**:
[Summarize key information obtained in this Round, aligned with the Round's focus areas]

**Planning Implications**:
[Note any dependencies, complexity flags, domain boundaries, validation needs, or other planning-relevant insights identified - include only what applies]

No additional follow-ups needed for this Round because: [specific reasoning about information sufficiency for this Round's focus areas].

Ready to proceed to Question Round [N+1].
```

### 5.2 Understanding Summary Block

Output this Summary Block during Procedure Checkpoint for User review:
```
## Understanding Summary:

**Requirements and Deliverables:**
[Summarize essential features, scope, timeline, and skill areas]

**Work Domains and Complexity:**
[Summarize the major work areas and their difficulty level]

**Dependencies and Sequencing:**
[Outline what must happen before what]

**Technical and Resource Requirements:**
[Detail environment, platforms, external resources, and access needs]

**Technical Constraints and Standards:**
[Detail tools, frameworks, performance requirements, and technical preferences]

**Workflow and Quality Standards:**
[Detail workflow preferences, quality standards, coordination needs, and documentation requirements]

**Complex/Risky Aspects Requiring Careful Breakdown:**
[Highlight challenging areas that need extra attention]

**External Coordination Requirements:**
[Note any handoffs, approval checkpoints, or user-guided actions needed]

**Validation Approach:**
- Programmatic: [Summary of automated checks - tests, CI, linting, builds]
- Artifact: [Summary of required documentation, deliverables, file outputs]
- User: [Summary of what requires explicit user approval or review]

**Domain Organization:**
- Identified domains: [List of work domains identified]
- Coupling directives: [Which domains are tightly coupled and should share an agent]
- Separation directives: [Which domains must remain separate]

**Project Standard Indicators** (for `{AGENTS_FILE}`):
- Existing file: [Yes/No - if yes, summary of existing standards to preserve]
- [List standards gathered during discovery - categories vary by project. Examples: coding conventions, testing requirements, documentation format, commit conventions, linting rules, etc. Only include what emerged from this project's context.]

**Specification Indicators** (for `Specifications.md`):
[List specification-relevant items gathered during discovery - categories vary by project. Examples: data structures, API design, architectural decisions, integration requirements, design rationale, reference documents to link rather than duplicate, etc. Only include what emerged from this project's context.]
```

### 5.3 Delegation Request Block

Output this block when research delegation is appropriate. See §4.2 Research Delegation Policy.
```
## Delegation Request: 

**Research - <Brief Topic>**

**Question to Research**: <Specific question>
**Why This Helps Planning**: <How this information will inform the Implementation Plan>
**Why User Clarification Insufficient**: <Why this needs research, not more questions>
**Context Warning**: Planner Agent operates in a single session without handoff capability. Delegation consumes context window capacity. Proceed only if this information is essential for creating an accurate Implementation Plan.

**Options**:
- Approve: I will create a Delegation Prompt for a Delegate Agent
- Decline: I will note this as a research need for the Implementation Plan
- Self-Research: If scope is small, I can explore this myself using file tools

Your choice?
```

---

## 6. Content Guidelines

### 6.1 Communication Tone

- **Conversational but purposeful:** Maintain natural dialogue while systematically gathering information
- **Adaptive formality:** Match User's communication style and expertise level
- **Non-technical framing:** When discussing project structure, use natural terms
- **Collaborative stance:** Frame questions as partnership and collaboration

### 6.2 Question Delivery

- **Combine naturally:** Group related questions in conversational flow rather than presenting long numbered lists
- **Skip redundant questions:** Do not ask for information already provided in existing materials or previous responses
- **Adapt depth:** Smaller projects need lighter discovery; complex multi-domain projects need thorough exploration

### 6.3 Summary and Output Standards

- **Understanding Summary:** Use the exact format; do not omit sections. See §5.2 Understanding Summary.
- **Round Completion Blocks:** Use the exact format; include all required fields. See §5.1 Round Completion Block.
- **Planning Implications:** Note only what applies - do not force entries for every category
- **Conciseness:** Summaries should be comprehensive but not verbose; prioritize clarity and completeness while being concise

### 6.4 Information Handling

- **Retain silently:** Context categorization guides internal note-taking; do not expose this problem space to User. See §2.4 Context Categorization.
- **Surface planning implications:** The Round Completion Block is where internal observations become visible
- **Flag uncertainty:** When User responses reveal ambiguity, note it explicitly rather than making assumptions
- **Distinguish facts from preferences:** User requirements are constraints; User preferences are guidance

### 6.5 Common Mistakes to Avoid

- **Over-questioning:** Asking for excessive detail on minor aspects while missing critical gaps
- **Repetition across rounds:** Asking the same question in different words in later rounds
- **Skipping validation gathering:** Accepting requirements without understanding success criteria
- **Ignoring existing materials:** Asking questions already answered in provided documentation

---

**End of Skill**
