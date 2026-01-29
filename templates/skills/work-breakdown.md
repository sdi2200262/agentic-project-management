---
name: work-breakdown
description: Decomposition of gathered context into the Implementation Plan with domain analysis, stage definition, and task breakdown. Defines the Work Breakdown procedure for the Planner Agent.
---

# APM {VERSION} - Work Breakdown Skill

## 1. Overview

**Reading Agent:** Planner Agent

This skill defines the methodology for the Work Breakdown procedure, which transforms gathered context into structured project artifacts through forced Chain-of-Thought reasoning, ensuring well-considered task breakdowns.

### 1.1 How to Use This Skill

**Execute the Procedure:** The Procedure section contains the actions to perform. Follow each subsection sequentially. See §3 Work Breakdown Procedure.

**Use Operational Standards for reasoning and decisions:** When making work breakdown decisions, consult the relevant standards subsection (Domain, Stage, Task, or Step Standards) to guide your thinking and apply decision rules. See §2 Operational Standards.

**Present reasoning in chat:** All analysis must be presented in chat before file output. Use the natural language output formats shown in §3 Work Breakdown Procedure to make reasoning visible to the User.

### 1.2 Objectives

- Translate gathered context into actionable project structure
- Define Worker Agents based on domain organization
- Create tasks with clear objectives, outputs, validation criteria, and dependencies
- Establish project standards for consistent Agent behavior

### 1.3 Outputs

**`{AGENTS_FILE}`** → Universal project standards that apply to all Agents. Leverages the always-apply rule pattern in AI Assistants.

**`Specifications.md`** → Coordination-level specifications translated from gathered context. Formalizes design decisions and constraints that inform the Implementation Plan. Free-form structure determined by project needs.

**`Implementation_Plan.md`** → Detailed task breakdown organized by stages, with Agent assignments, validation criteria, and dependency chains for Manager Agent consumption. Implements the specifications.

### 1.4 Scope Adaptation

The breakdown guidance in this skill provides criteria for making decomposition decisions, not fixed definitions. All concepts (domains, stages, tasks, steps) are relative to project scope and complexity.

Stage, task and step definitions should always be adjusted based on the actual size and complexity of the project. Break down the work to provide the right level of detail for the project's needs, applying more granularity when justified by complexity and less when simplicity allows. Let the real scope and requirements guide how work units are identified and organized.

Adapt the methodology to the project based on `{SKILL_PATH:context-gathering}` findings about scale, complexity, and requirements. The guidance in this skill supports your reasoning; the project's actual scope determines appropriate granularity.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for executing Work Breakdown. It guides how to think about domain boundaries, task granularity, dependencies, and workload distribution. The granularity guidance in §2.5 Domain Standards through §2.8 Step Standards should be adapted to the project's actual scope and complexity per §1.4 Scope Adaptation.

### 2.1 Forced Chain-of-Thought Methodology

Work Breakdown uses Forced Chain-of-Thought (CoT), requiring explicit reasoning in chat before any file output. This methodology prevents pattern-matching by forcing consideration of project-specific context for each decision.

**Principle:** Think in chat, commit to file. Each breakdown decision must be traceable to explicit reasoning presented in the conversation.

**Reasoning triggers:**
- "This task depends on Task X.Y because [specific reason]"
- "Assigning to Agent_Backend because [domain justification]"
- "Breaking into separate tasks because [complexity/scope reason]"
- "Steps are [XYZ] since [reasoning of task contents] and are ordered this way because [dependency/practical reason]"

**Output Separation Principle:** Reasoning happens in chat; file output contains structured definitions only. File writes interrupt continuous reasoning, providing fresh perspective for subsequent analysis.

### 2.2 Context Integration

Work Breakdown requires context from ``{SKILL_PATH:context-gathering}`` across these categories:

**Project Definition:**
- Project vision, goals, and success criteria
- Essential features, scope boundaries, and deliverables
- Priority indicators and constraints

**Technical Requirements:**
- Technology stack and platform constraints
- External dependencies and integrations
- Complexity indicators and risk areas

**Process Requirements:**
- Quality standards and validation requirements
- Workflow preferences and methodologies
- Coordination and approval requirements

**Domain Organization:**
- Identified work domains and boundaries
- Coupling directives (domains that should share an Agent)
- Separation directives (domains that must remain distinct)

**Standards Preferences:**
Standards define *how work is performed* across the project - conventions and process rules that apply universally regardless of what is being built. Each project defines what standards are relevant.
- Project-wide standards gathered during Context Gathering
- Existing ``{AGENTS_FILE}`` contents (if found during workspace scan)

**Specification Indicators:**
Specifications define *what is being built* - design decisions, requirements, constraints, and rationale that shape the deliverable itself. Each project defines what specifications are relevant.
- Design decisions and constraints gathered during Context Gathering
- Existing specification documents to reference (if User mentioned any)

**Validation Approach:**
- Programmatic validation patterns (tests, CI, automated checks)
- Artifact validation patterns (deliverables, file outputs)
- User validation triggers (what requires explicit approval)

**Input-to-Output Mapping** → Each input category translates to specific artifacts:
- **Project Definition → Implementation Plan Structure:** Vision and goals → Project Overview header field; Success criteria and deliverables → Stage and Task objectives; Scope boundaries → Explicit distinction between Agent and User work
- **Technical Requirements → Task Definitions:** Technology stack → Task guidance and constraints; External dependencies → Dependency markers, User coordination steps; Complexity indicators → Task granularity decisions; Environment requirements → Setup and configuration tasks
- **Process Requirements → Task Specifications:** Quality standards → Validation criteria fields; Workflow preferences → Task guidance sections; Coordination requirements → Dependency markers, User validation needs
- **Domain Organization → Agent Assignments:** Identified domains → Worker Agent definitions; Coupling directives → Merged Agent assignments; Separation directives → Distinct Agent boundaries
- **Validation Approach → Task Validation Fields:** Programmatic patterns → Programmatic validation criteria; Artifact patterns → Artifact validation criteria; User triggers → User validation criteria
- **Standards Preferences → `{AGENTS_FILE}` Content:** New universal standards → APM_STANDARDS namespace block; Existing `{AGENTS_FILE}` contents → Preserved outside APM_STANDARDS block; Existing standards overlap → Reference from inside block, do not duplicate
- **Specification Indicators → `Specifications.md` Content:** Design decisions → Formal specification sections; Existing documents → References rather than duplication; Constraints → Implementation boundaries

### 2.3 Validation Types

Validation criteria gathered during context discovery fall into three types. Most tasks combine multiple types.

**Programmatic** → Automated verification that can be executed without human judgment:
- Tests pass, builds succeed, CI checks pass
- Scripts execute correctly, linting passes, type checking succeeds
- Endpoints return expected responses, data validates against schemas

**Artifact** → File or output existence and structural verification:
- Documentation exists with required sections
- Config files present and valid
- Deliverables have correct format and structure
- Generated outputs match expected patterns

**User** → Human judgment required for subjective or strategic decisions:
- Design approval, content review
- Architectural decisions, approach validation
- Subjective quality assessment

**Execution behavior by type:**
- Programmatic and Artifact validation allow autonomous iteration - Agent can retry on failure
- User validation requires pause after execution - Agent waits for user review before proceeding or logging

### 2.4 Specifications Standards

This subsection guides reasoning and decisions about project specifications during Specifications Analysis. Specifications define WHAT is being built - design decisions, constraints, and requirements that shape the deliverable itself.

**Identification Patterns** → Identify specification content from Context Gathering findings. Each specification captures a design decision or constraint that informs implementation:

*Content Sources:*
- Explicit User design decisions → Direct specifications
- Implicit requirements from project type → Derived specifications
- Constraints mentioned during Context Gathering → Constraint specifications
- Existing documents User referenced → Reference specifications (don't duplicate)

*Relevance Signals:*
- Information that affects multiple tasks → Likely specification-worthy
- Design choices that could reasonably go multiple ways → Document the decision
- Constraints that limit implementation options → Must be captured
- Information only relevant to one task → Task guidance, not specification

**Universal Dimensions** → Analyze gathered context across these dimensions. Relevance varies by project - assess each dimension and elaborate only on what applies:

*Scope Boundaries:*
- What functionality is explicitly included vs excluded?
- Where are the edges of what this project delivers?

*Core Entities:*
- What are the primary things this project creates, manages, or processes?
- How are these entities defined and distinguished?

*Behavioral Rules:*
- What logic governs how entities behave?
- What rules or constraints apply to entity operations?

*Relationships:*
- How do entities connect to each other?
- What dependencies or associations exist between components?

*Constraints:*
- What technical, business, or regulatory limitations apply?
- What cannot be changed or must be accommodated?

*External Interfaces:*
- How does the project connect to external systems?
- What protocols, formats, or APIs are involved?

**Granularity Standards** → Specification granularity requires balancing two failure modes: **over-specification** (documenting implementation details that belong in task guidance) and **under-specification** (leaving design decisions implicit):

*Over-specification signals (move to task guidance):*
- Detail only relevant to a single task
- Implementation approach rather than design decision
- Information that would change during normal task iteration

*Under-specification signals (add to specifications):*
- Design decision that affects multiple tasks
- Constraint that limits implementation options across the plan
- Information Worker Agents need before starting related tasks

*Assessment questions:*
- Would a Worker Agent need this before starting any related task?
- Does this represent a decision that could reasonably go multiple ways?
- Is this design-level (what/why) or implementation-level (how)?

**Default:** When signals are balanced, prefer including in specifications - easier to reference than to reconstruct.

**Relevance Assessment** → For each dimension, determine: High (central to project), Medium (relevant but secondary), Low (minor consideration), or N/A (not applicable). Only elaborate on High and Medium dimensions in the specifications artifact.

**Structure Element Selection** → Choose format based on content type per §4.2 Specifications Format. Tables for enumerated values, diagrams for relationships, code blocks for schemas, prose for rationale.

### 2.5 Domain Standards

**Identification Patterns** → Identify logical work domains from Context Gathering. Each domain requires a specific mental model or skill set:
- Different expertise areas or technical environments → Separate domains
- User-facing vs system-facing, creative vs analytical → Mental model boundaries
- Investigation vs execution needs → Research-focused vs implementation-focused separation

**Granularity Standards** → Balance **over-separation** (coordination overhead) and **over-consolidation** (mental model switching):

*Split signals:* Different mental models/skill sets, context switching disrupts flow, User separation directives.

*Combine signals:* Shared mental model, tight dependencies, User coupling directives.

*Assessment:* Similar thinking approach across tasks? Consistent knowledge requirements? Separation reduces or increases coordination overhead?

**Default:** When balanced, prefer separation to reduce coordination complexity.

### 2.6 Stage Standards

**Identification Patterns** → Identify stages from Context Gathering workflow patterns. Each stage is a milestone grouping:
- Layered complexity → Hierarchical stages with progressive dependencies
- Sequential patterns → Linear stages following natural workflow
- Concurrent work streams → Parallel stages by domain or component
- Parallel, no-dependency stages → Order by practical preference

**Granularity Standards** → Balance **over-fragmentation** (unnecessary checkpoints) and **over-consolidation** (obscured milestones):

*Split signals:* Unrelated work streams, research blocks subsequent work, validation warrants dedicated stage, scope too broad for coherent value.

*Combine signals:* Artificially separated with immediate handoffs, simple scope, combined still delivers coherent value.

*Assessment:* Independent value per stage? Boundaries align with natural checkpoints? Stage scope supports context preservation?

**Default:** When balanced, prefer fewer stages with clear milestones.

### 2.7 Task Standards

**Identification Patterns** → Derive tasks from stage objectives. Each task is a distinct work unit:

*Identification process:* Review stage objective → Identify work units for deliverables → Group related work sharing context, domain, validation → Assess against granularity.

*Work unit characteristics:*
- **Meaningful deliverable:** Concrete output (code, artifact, findings) - not just "progress"
- **Domain coherence:** Single Agent's domain, consistent skill set throughout
- **Clear boundaries:** Identifiable start (dependencies met) and end (validation criteria met)
- **Validation coverage:** Criteria meaningfully confirm deliverable completeness

**Granularity Standards** → Balance **task packing** (too much) and **over-decomposition** (too many tiny tasks):

*Validation and iteration:* Task scope should align with validation approach. Programmatic/Artifact allow autonomous iteration. User validation provides natural checkpoints.

*Packing signals (split):* Multiple unrelated deliverables, spans domains, internal dependencies need validation first, vague compound objective.

*Over-decomposition signals (combine):* Artificially separated micro-tasks, immediate same-Agent handoffs, trivial individual actions.

*Assessment:* Meaningful verifiable deliverable? Validation matches iteration needs? Splitting reduces complexity or adds overhead?

**Task Packing Detection:** If step is actually separate deliverable, or validation covers unrelated concerns, split. See §3.5 Stage Cycle Protocol.

**Default:** When balanced, prefer fewer substantial tasks over many small ones.

### 2.8 Step Standards

Steps organize work within a task and support failure tracing - not mini-tasks with independent validation.

**Identification Patterns** → Derive steps from task objectives:

*Process:* Review task objective → Identify distinct operations → Order by dependency/preference → Assess granularity.

*Characteristics:* Ordered (logical sequence), discrete (clear outcome), referenced (numbering for tracing), shared validation (contribute to task validation, not own).

**Granularity Standards** → Balance **over-abstraction** (too vague) and **micro-decomposition** (trivial noise):

*Validation role:* Steps help trace failures to specific work. Design with traceability in mind.

*Split signals:* Multiple distinct operations that fail independently, vague description, failure tracing difficult.

*Combine signals:* Trivial actions, no distinct failure modes, noise without value.

*Assessment:* Helps trace validation failure? Meaningful execution segment? Splitting improves execution/debug?

**Step vs Sub-Task Check:** If step requires own validation before next step, it's task packing. See §2.7 Task Standards.

**Default:** When balanced, prefer concrete steps aiding failure tracing.

**Delegate Agent Steps:** When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step using format: "Delegate Agent: <purpose>". See §4.5 Step Format.

### 2.9 Plan Review Standards

This subsection guides reasoning and decisions during Plan Review after all stages are documented.

**Workload Distribution** → Assess workload across Agents to ensure no single Agent is overloaded:

*Overload Indicators:*
- Agent assigned 8+ tasks → Review for subdivision opportunity
- Tasks span multiple sub-domains within the Agent's scope
- Clear boundaries exist between task clusters

*Subdivision Reasoning:*
- Identify natural sub-domain boundaries within the overloaded Agent's work
- Ensure each sub-Agent has coherent, related tasks
- Use descriptive names reflecting the sub-domain scope
- Update all task dependencies to reflect new Agent instances

**Scope Boundaries** → Handle work at the boundary between Agent scope and User scope:

*Assign to Agent When:*
- Work can be completed within the development environment
- No external accounts, credentials, or platform access required
- Validation can be performed autonomously or with artifact inspection

*Mark as User Coordination When:*
- Work requires external platform interaction (deployment, publishing, account setup)
- Credentials or account access are User-specific
- Validation requires access outside the development environment

When User coordination is required, include explicit coordination step in task.

**Cross-Agent Dependencies** → Identify and document dependencies where tasks assigned to different Agents require coordination:

*Identification:*
- For each task, check if dependencies are from a different Agent
- Record provider (task producing output) and consumer (task needing it)
- Document the specific deliverable or context required at the boundary

*Documentation:*
- Bold cross-Agent dependencies in the Dependencies field for visual distinction
- Ensure the dependency chain is traceable for Manager Agent coordination

### 2.10 Execution Standards

This subsection guides reasoning and decisions about execution-level standards during Standards Analysis. Standards define HOW work is performed - universal patterns that apply across all tasks regardless of what is being built.

**Identification Patterns** → Extract execution-level standards from Implementation Plan patterns and Context Gathering findings:

*Content Sources:*
- Patterns that recur across multiple tasks → Universal standards
- User-specified conventions during Context Gathering → Explicit standards
- Existing ``{AGENTS_FILE}`` contents → Preserve and integrate
- Task guidance that appears in many tasks → Candidate for elevation

*Distinction from Other Artifacts:*
- **Specifications:** Design decisions (WHAT) → NOT standards
- **Implementation Plan task guidance:** Task-specific instructions → NOT standards
- **Standards:** Universal execution patterns (HOW) → Yes, include

**Universal Dimensions** → Assess which categories apply to this project:

*Code Conventions:*
- Naming patterns, formatting rules, code organization
- File structure patterns, module organization

*Quality Requirements:*
- Testing expectations, coverage requirements
- Review processes, approval thresholds

*Process Standards:*
- Workflow patterns that must always be followed
- Documentation requirements for deliverables

*Prohibited Patterns:*
- Explicitly forbidden approaches or technologies
- Anti-patterns and practices to avoid

*Tool/Technology Standards:*
- Required tools, versions, configurations
- Build, deploy, integration requirements

**Granularity Standards** → Standards must be universal and actionable:

*Include when:*
- Pattern applies to ALL tasks, not just some
- Guidance is concrete enough to follow
- Violation would be detectable

*Exclude when:*
- Pattern only applies to specific domain or task type
- Guidance is too vague to be actionable ("write good code")
- Specification or coordination decision, not execution pattern

**Default:** When uncertain whether something is universal, lean toward task guidance in the Implementation Plan - easier to promote later than to demote.

---

## 3. Work Breakdown Procedure

This section defines the sequential actions that accomplish Work Breakdown. The procedure transforms gathered context into Coordination Artifacts: Specifications, Implementation Plan, and Standards.

**Progression Gates:** Each action must complete before proceeding to the next. No skipping or batching unless explicitly instructed by User.

**Deliberation Scaling:** Reasoning depth matches decision complexity. All decisions trace to Context Gathering inputs and Operational Standards guidance. Use "User specified/requested during Context Gathering" attribution where applicable.

**Forced Chain-of-Thought Output:** All analysis must be presented in chat before file output-think in chat, commit to file. Use reasoning triggers like "This task depends on X because [reason]" or "Assigning to Agent because [justification]" per §2.1 Forced Chain-of-Thought Methodology. Reasoning draws from the relevant Operational Standards subsection (§2.4-2.10). Each procedure step shows the expected output format.

**Procedure:**
1. Specifications Analysis → Create `Specifications.md`, pause for User approval
2. Implementation Plan Header → Update Implementation Plan header
3. Domain Analysis → Update Implementation Plan header (Agents field)
4. Stage Analysis → Identify ALL stages with objectives AND tasks, update header (Stages field)
5. Stage Cycles → Per stage: detailed task breakdown, append to Implementation Plan body
6. Plan Review → Workload distribution, cross-Agent dependency review
7. Standards Analysis → Write to ``{AGENTS_FILE}``
8. Artifact Finalization → User approval of Plan and Standards, procedure completion

### 3.1 Specifications Analysis

Apply the Specifications Standards guidance and Specifications Format when executing these actions. See §2.4 Specifications Standards and §4.2 Specifications Format.

Perform the following actions:
1. Analyze specifications from Context Gathering using universal dimensions. Present reasoning in chat:
   ```
   **Specifications Analysis:**

   **Relevance Assessment:**
   - Scope Boundaries: [High/Medium/Low/N/A] - [reasoning from Context Gathering]
   - Core Entities: [relevance] - [reasoning]
   - Behavioral Rules: [relevance] - [reasoning]
   - Relationships: [relevance] - [reasoning]
   - Constraints: [relevance] - [reasoning]
   - External Interfaces: [relevance] - [reasoning]

   **Design Decisions:**
   - [Category]: [decision] → Formalizing because [Context Gathering finding]
   - [Category]: [decision] → Reference [existing doc] because already specified
   - ...

   **Structure Element Selection:**
   - [Content type] → [format] because [reasoning per §4.2]
   ```
2. Update `.apm/Specifications.md`:
   - Replace `<Project Name>` in title with project name
   - Fill **Last Modification** field: "Plan creation by the Planner Agent."
   - Add specification content for High and Medium relevance dimensions
   - Use appropriate structural elements per §4.2 Specifications Format

**Specifications Checkpoint:**
3. Pause for User review. Output the specifications checkpoint:
   ```
   Specifications complete. Artifact created.

   Please review `.apm/Specifications.md` for design decisions and constraints accuracy.

   **If modifications needed** → Describe issues and I will iterate.
   **If approved** → Proceeding to Implementation Plan creation.
   ```
   - If User requests modifications → Update specifications → Return to step 3
   - If User approves → Continue to §3.2 Implementation Plan Header
**Duplication Avoidance:** If User has existing specification documents, reference them rather than duplicating. Use format: "See [document name], [section] for [specification type]."

### 3.2 Implementation Plan Header

Perform the following actions:
1. Determine project name from Context Gathering:
   - If User specified a project name during Context Gathering: Use that name exactly as provided
   - If no name specified: Generate a concise, descriptive name based on project type, deliverable, and primary purpose from Context Gathering findings
2. Update Implementation Plan header:
   - Replace `<Project Name>` in title with determined project name
   - Fill **Project Overview** field with 3-5 sentences synthesizing high-level project description from Context Gathering inputs:
     - Project type and primary deliverable
     - Core problem being solved or goal being achieved
     - Essential scope and key features
     - Success criteria or completion indicators
     - Keep overview concise and focused on what the project accomplishes, not how it will be built
   - Fill **Last Modification** field: "Plan creation by the Planner Agent."

### 3.3 Domain Analysis

Apply the Domain Standards guidance when executing these actions. See §2.5 Domain Standards.

Perform the following actions:
1. Present domain decisions in chat:
   ```
   **Domain Analysis:**
   - [Domain]: requires [mental model/skill set] → separate because User specified [separation directive] during Context Gathering / [distinct expertise reasoning]
   - [Domain]: requires [mental model/skill set] → combined with [X] because User requested [coupling directive] during Context Gathering / [shared model reasoning]
   - ...
   ```
2. Present Worker Agent assignments:
   ```
   **Proposed Worker Agents:**
   - [Name] Agent: [domains] - [responsibility, scope]
   - [Name] Agent: [domains] - [responsibility, scope]
   - ...
   ```
3. Update Implementation Plan header (Agents field):
   ```
   * **Agents:** [Name] Agent, [Name] Agent ...
   ```

### 3.4 Stage Analysis

Apply the Stage Standards and Task Standards guidance when executing these actions. See §2.6 Stage Standards and §2.7 Task Standards. Identify all stages and their tasks upfront. Detailed task breakdown occurs later. See §3.5 Stage Cycle Protocol.

Perform the following actions:
1. Present stage structure with task identification in chat. For each stage:
   ```
   **Stage Analysis:**
   * **Stage [N]:** [Name]
   - **Objective:** [stage goal]
   - **Boundary:** [start condition] → [end milestone] because [workflow/dependency reasoning]
   - **Tasks:**
     - **Task N.1:** [Name] - delivers [output] because [task necessity reasoning]
     - **Task N.2:** [Name] - delivers [output] because [task necessity reasoning]
     - ...

   **Note:** If a stage requires foundational research before other tasks can proceed, include a Delegate Agent Research task at position N.1. Only include research tasks when genuine uncertainty or knowledge gaps exist.
   ```
2. Update Implementation Plan header:
   - Fill **Stages** field with count and list

### 3.5 Stage Cycle Protocol

This protocol governs stage documentation cycles. For each stage from §3.4 Stage Analysis, complete task breakdown. Execute in stage order. Apply §2.7 Task Standards and §2.8 Step Standards.

**Complexity Indicators** → Use full reasoning template when task has:
- Cross-agent dependencies
- Multiple validation types with User validation
- Domain boundary questions
- Task packing signals

Perform the following actions:
1. State context for current stage:
   ```
   **Stage [N]: [Name]**
   Context: [User requirements/constraints influencing this stage]
   ```
2. Complete task analysis. Use compressed format for straightforward tasks, full format when complexity indicators present:

   *Compressed format (straightforward tasks):*
   ```
   **Task N.M:** [Name] → [Agent] | Validation: [types] | Deps: [list or None]
   Steps: [brief description per step]
   ```

   *Full format (when complexity indicators present):*
   ```
   **Task N.M:** [Name]
   - **Complexity Note:** [what triggered full analysis]
   - **Agent:** [Name] Agent because [reasoning]
   - **Validation:** [types] because [reasoning]. User validation → pauses for review.
   - **Dependencies:** [list with reasoning] | None
   - **Steps:** [numbered list with purpose]
   ```

   **Task Packing Correction:** If detected (per §2.7), split into separate tasks with proper dependencies.
   **User Coordination:** When required (per §2.9), include explicit step and mark User validation.
3. Append stage to Implementation Plan per §4.4 Task Format.

**Proceed to next stage. Repeat steps 1-3 until all stages documented.**

### 3.6 Plan Review

After completing all Stage Cycles, review the plan for workload distribution and cross-Agent dependencies.

Perform the following actions:
1. **Workload Assessment:** Count tasks per Agent. Flag Agents with 8+ tasks for subdivision review per §2.9 Plan Review Standards.
2. **Agent Subdivision (if needed):**
   - Analyze overloaded Agent's tasks for sub-domain boundaries
   - Create coherent sub-Agents using descriptive names following `[Name] Agent` convention
   - Present redistribution reasoning in chat:
     ```
     **Agent Subdivision:**
     * **Overloaded Agent:** [Name] Agent ([count] tasks)
     * **Sub-Domain Boundaries:** [identified boundaries]
     * **Proposed Sub-Agents:**
       - [Name] Agent: [domains] - [responsibility, scope]
       - [Name] Agent: [domains] - [responsibility, scope]
     * **Redistribution Rationale:** [reasoning for subdivision]
     ```
3. **Update Assignments (if subdivided):** Update Implementation Plan with revised Agent assignments. Preserve all task content during reassignment. Update all task dependencies to reflect the new Agent instances accordingly.
4. **Cross-Agent Dependency Review:**
   - Identify all cross-Agent dependencies: For each case where a task (N.M) assigned to Agent A depends on a task (X.Y) assigned to Agent B (A ≠ B), record it as a cross-Agent dependency.
   - For each cross-Agent dependency, explicitly trace:
     - Which task and Agent is the dependency *from* (provider)
     - Which task and Agent is the dependency *to* (consumer)
     - The specific deliverable, artifact, or prerequisite required at the boundary
   - Summarize the reasoning for why this dependency requires explicit cross-Agent handling (i.e., what context, artifact, or validation requires Agent collaboration or handoff).
   - Present in chat before updating file:
     ```
     **Cross-Agent Dependencies Review:**
     * **Total Identified:** [count]
     * **Detailed List:**
       - From: Task [X.Y] by [Agent B]
         To:   Task [N.M] by [Agent A]
         * Required deliverable/context: [artifact or input needed]
         * Reason for cross-Agent dependency: [brief reasoning, e.g., domain knowledge boundary, validation responsibility, process handoff, etc.]
       - ...
     ```
5. **Update Cross-Agent Dependencies (if any identified):** Only after completing the reasoning step in step 4, update the Implementation Plan by bolding the existing "Task N.M by [Name] Agent" notation in the Dependencies field for all identified cross-Agent dependencies to make them visually distinct from same-Agent dependencies.
6. **Plan Summary** → Present in chat:
   ```
   **Implementation Plan Summary:**
   * **Agents:** [count] ([list names])
   * **Stages:** [count] ([list names with task counts])
   * **Total Tasks:** [count]
   * **Cross-Agent Dependencies:** [count]
   ```

### 3.7 Standards Analysis

After Plan Review, extract execution-level standards from the Implementation Plan context. Apply the Execution Standards guidance and APM_STANDARDS Block format. See §2.10 Execution Standards and §4.1 APM_STANDARDS Block.

Perform the following actions:
1. Analyze the Implementation Plan for patterns that should apply universally. Present reasoning in chat:
   ```
   **Standards Extraction:**
   - Existing ``{AGENTS_FILE}``: [Yes - contents to preserve / No - new file]
   - [Pattern from tasks] → APM_STANDARDS because [universal execution-level reasoning]
   - [Constraint] → Task guidance because [task-specific, not universal]

   **Relevance Check:**
   - Code Conventions: [what emerged / N/A]
   - Quality Requirements: [what emerged / N/A]
   - Process Standards: [what emerged / N/A]
   - Prohibited Patterns: [what emerged / N/A]
   - Tool/Technology Standards: [what emerged / N/A]
   - Other project-specific categories
   ```
2. Write APM_STANDARDS block to ``{AGENTS_FILE}``:
   - If file exists: Preserve existing content outside block, append APM_STANDARDS block
   - If creating new: Create file with APM_STANDARDS block only
   - Only include execution-level standards (not coordination decisions or task-specific guidance)

**Execution vs Coordination Check:** Standards define HOW work is performed universally. Coordination decisions (agent assignments, task dependencies, stage boundaries) belong in the Implementation Plan, not Standards.

### 3.8 Artifact Finalization

After Standards Analysis, present Implementation Plan and Standards for User approval and complete the procedure.

Perform the following actions:
1. Pause for User review. Output the plan and standards checkpoint:
   ```
   Implementation Plan and Standards complete. Artifacts created [updated if after modifications].

   **Please review:**
   - **``{AGENTS_FILE}``** for execution-level standards accuracy
   - **Implementation Plan** (.apm/Implementation_Plan.md) with [N] stages and [M] tasks

   Verify consistency across all three Coordination Artifacts:
   - Specifications decisions reflected in Plan guidance
   - Standards applicable to actual tasks defined
   - No contradictions between artifacts

   **If modifications needed** → Describe issues and I will iterate.
   **If approved** → Planning Phase complete. Proceed to initialize the Manager Agent using the `/apm-2-initiate-manager` command.
   ```
   - If User requests modifications → Update artifacts → Return to step 1
   - If User approves → Output procedure completion:
     ```
     **Work Breakdown Procedure complete.** All Coordination Artifacts created and validated.

     Next: Initialize Manager Agent using the `/apm-2-initiate-manager` command.
     ```

---

## 4. Structural Specifications

This section defines the output formats for artifacts produced during Work Breakdown.

### 4.1 APM_STANDARDS Block

The namespace block structure for ``{AGENTS_FILE}``:
```
APM_STANDARDS {

[APM-managed standards content]

} //APM_STANDARDS
```

**Content Rules:**
- **Structure:** Use markdown headings (`##`) for major categories
- **Specificity:** Each standard must be concrete and actionable (avoid vague terms like "write good code")
- **Consistency:** Use consistent terminology and formatting across all standards
- **Scope** → Only universal standards that apply to all Agents and tasks:
  - **Include:** Coding conventions, testing requirements, documentation standards, version control practices, universal constraints (security, accessibility, performance)
  - **Exclude:** Architecture decisions (Manager scope), task-specific guidance (Implementation Plan scope), progress tracking (Memory System scope)

**Structural Elements** → Select format based on content type:
- **Allowed/disallowed patterns, naming conventions** → Table
- **Syntax examples, code patterns to follow** → Code block
- **Individual standards and rules** → Bulleted list
- **Sequential steps within a standard** → Numbered list
- **Explanations when rule needs context** → Prose

**Default:** Bulleted lists for rules, tables for pattern comparisons, code blocks for examples.

### 4.2 Specifications Format

The structure for `.apm/Specifications.md`:
```markdown
# <Project Name> – APM Specifications
**Last Modification:** [Date and description]

---

[Specification content using appropriate structural elements]
```

**Content Rules:**
- **Structure:** Use markdown headings (`##`) for major categories, determine relevant sections based on gathered context
- **Specificity:** Each specification must be concrete and actionable
- **Consistency:** Use consistent terminology and formatting across all specifications
- **Scope:** Project-specific design decisions and constraints that inform the Implementation Plan. Content categories vary by project-include what is relevant to this project's coordination needs.
  - **Exclude:** Universal standards (``{AGENTS_FILE}`` scope), task-specific guidance (Implementation Plan scope)
- **References:** When User has existing specification documents, reference them rather than duplicating content

**Structural Elements** → Select format based on content type:
- **Enumerated values, allowed options, field definitions** → Table
- **Relationships, state transitions, flows** → Mermaid diagram (`flowchart`, `stateDiagram-v2`, or `erDiagram`)
- **Schemas, file structures, code patterns** → Code block
- **Rationale, explanations, context** → Prose
- **Non-sequential related items** → Bulleted list
- **Sequential related items** → Numbered list

**Default:** Tables for structured data with multiple attributes, bulleted list and/or prose for explanations, mermaid for relationships.

### 4.3 Stage Format

Each stage in the Implementation Plan follows this format:
* **Stage header:** `## Stage N: [Name]`
* **Naming stages:** Stage names should reflect the domain(s), objectives, and main deliverables of the stage. Choose clear, goal-oriented names that describe the key work being accomplished.
* **Stage contents:**
  - Tasks for the stage following the Task Format. See §4.4 Task Format.
  - Each task contains steps following the Step Format. See §4.5 Step Format.
  - Task dependencies within and across stages

### 4.4 Task Format

Each task in the Implementation Plan follows this format:
* **Task Header:** `### Task <N.M>: <Title> - <Domain> Agent`
* **Task Contents:**
```
* **Objective:** Single-sentence task goal - what this task accomplishes.
* **Output:** Concrete deliverables - files, components, artifacts functionality produced.
* **Validation:** Binary pass/fail criteria. Specify type(s): Programmatic, Artifact, and/or User per §2.3 Validation Types.
* **Guidance:** Technical constraints, approach specifications, references to existing patterns.
* **Dependencies:** Prior task knowledge, outputs or deliverables required.
    - **Format:** List dependencies as `Task N.M by <Domain> Agent, Task X.Y <Domain> Agent, ...`
    - **No dependencies:** Use "None" explicitly.

1. [Step description]
2. [Step description]
3. [Step description]
```

### 4.5 Step Format

Each step in a task follows this format:
* **Step format:** Numbered instruction describing a discrete operation.
* **Step contents:**
  - Clear, specific instruction that an Agent can execute directly
  - Optional action outcome if needed
  - Optional relevant context where non-obvious
  - References to patterns, files, or prior work when relevant
* **Steps vs sub-tasks:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing. The "step" might actually be separate task. See §2.7 Task Standards.

**Delegate Agent Steps:**

When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step.

* **Format:** "Delegate Agent: <purpose>"
* **Delegation Usage Patterns and Skill References:**
  - **Debug delegation:** For complex bugs that require isolated debugging focus. Include skill reference: `{SKILL_PATH:delegate-debug}`
  - **Research delegation:** For knowledge gaps that require research to inform later steps. Include skill reference: `{SKILL_PATH:delegate-research}`
  - **Refactor delegation:** For code restructuring or clean-up requiring an isolated refactoring scope. Include skill reference if a relevant skill exists.
  - **Other delegation:** For any other context-heavy or investigation step not covered above, clearly describe the specific purpose and scope of the delegation step in the task.
* **Skill Reference Requirement:** Always include the relevant delegation skill reference for debug and research steps as shown. For other and refactor, add skill references if available and be explicit about the purpose.

---

## 5. Content Guidelines

### 5.1 Quality Standards

**Implementation Plan:**
- Each task understandable without external reference
- Specific language (avoid "implement properly" → specify the pattern to follow)
- All fields populated, no placeholders
- Consistent naming and terminology

**``{AGENTS_FILE}``:**
- Only genuinely universal standards
- Concrete and actionable (not "write good code")
- No duplication of existing project standards in the file; reference instead

### 5.2 Common Mistakes

- **Task packing:** Multiple deliverables in one task → See §2.7 Task Standards.
- **Over-decomposition:** Excessive tiny tasks → Tasks should be meaningful work units. See §2.7 Task Standards.
- **Vague validation:** "Works correctly" → Specify what "correctly" means
- **Missing dependencies:** Tasks requiring prior work unmarked → Trace prerequisites

---

**End of Skill**
