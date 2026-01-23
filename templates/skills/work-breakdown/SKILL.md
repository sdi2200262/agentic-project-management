---
name: work-breakdown
description: Decomposition of gathered context into the Implementation Plan with domain analysis, stage definition, and task breakdown. Defines the Work Breakdown procedure for the Planner Agent.
---

# APM {VERSION} - Work Breakdown Skill

## 1. Overview

**Reading Agent:** Planner Agent

This skill defines the methodology for the Work Breakdown procedure, which transforms gathered context into structured project artifacts through forced Chain-of-Thought reasoning, ensuring well-considered task breakdowns.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions to perform. Follow each subsection sequentially. See §3 Work Breakdown Procedure.

**Use Operational Standards for reasoning and decisions.** When making work breakdown decisions, consult the relevant standards subsection (Domain, Stage, Task, or Step Standards) to guide your thinking and apply decision rules. See §2 Operational Standards.

**Present reasoning in chat.** All analysis must be presented in chat before file output. Use the natural language output formats shown in §3 Work Breakdown Procedure to make reasoning visible to the User.

### 1.2 Objectives

- Translate gathered context into actionable project structure
- Define Worker Agents based on domain organization
- Create tasks with clear objectives, outputs, validation criteria, and dependencies
- Establish project standards for consistent Agent behavior

### 1.3 Outputs

**`{AGENTS_FILE}`:** Universal project standards that apply to all Agents. Leverages the always-apply rule pattern in AI Assistants.

**`Specifications.md`:** Coordination-level specifications translated from gathered context. Formalizes design decisions and constraints that inform the Implementation Plan. Free-form structure determined by project needs.

**`Implementation_Plan.md`:** Detailed task breakdown organized by stages, with Agent assignments, validation criteria, and dependency chains for Manager Agent consumption. Implements the specifications.

### 1.4 Scope Adaptation

The breakdown guidance in this skill provides criteria for making decomposition decisions, not fixed definitions. All concepts (domains, stages, tasks, steps) are relative to project scope and complexity.

Stage, task and step definitions should always be adjusted based on the actual size and complexity of the project. Break down the work to provide the right level of detail for the project's needs, applying more granularity when justified by complexity and less when simplicity allows. Let the real scope and requirements guide how work units are identified and organized.

Adapt the methodology to the project based on `{SKILL_PATH:context-gathering}` findings about scale, complexity, and requirements. The guidance in this skill supports your reasoning; the project's actual scope determines appropriate granularity.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for executing Work Breakdown. It guides how to think about domain boundaries, task granularity, dependencies, and workload distribution. The granularity guidance in §2.4 Domain Standards through §2.7 Step Standards should be adapted to the project's actual scope and complexity per §1.4 Scope Adaptation.

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

Work Breakdown requires context from `{SKILL_PATH:context-gathering}` across these categories:

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
Standards define *how work is performed* across the project — conventions and process rules that apply universally regardless of what is being built. Each project defines what standards are relevant.
- Project-wide standards gathered during Context Gathering
- Existing `{AGENTS_FILE}` contents (if found during workspace scan)

**Specification Indicators:**
Specifications define *what is being built* - design decisions, requirements, constraints, and rationale that shape the deliverable itself. Each project defines what specifications are relevant.
- Design decisions and constraints gathered during Context Gathering
- Existing specification documents to reference (if User mentioned any)

**Validation Approach:**
- Programmatic validation patterns (tests, CI, automated checks)
- Artifact validation patterns (deliverables, file outputs)
- User validation triggers (what requires explicit approval)

**Input-to-Output Mapping:**

Each input category translates to specific artifacts:

- **Project Definition → Implementation Plan Structure:** Vision and goals → Project Overview header field; Success criteria and deliverables → Stage and Task objectives; Scope boundaries → Explicit distinction between Agent and User work
- **Technical Requirements → Task Definitions:** Technology stack → Task guidance and constraints; External dependencies → Dependency markers, User coordination steps; Complexity indicators → Task granularity decisions; Environment requirements → Setup and configuration tasks
- **Process Requirements → Task Specifications:** Quality standards → Validation criteria fields; Workflow preferences → Task guidance sections; Coordination requirements → Dependency markers, User validation needs
- **Domain Organization → Agent Assignments:** Identified domains → Worker Agent definitions; Coupling directives → Merged Agent assignments; Separation directives → Distinct Agent boundaries
- **Validation Approach → Task Validation Fields:** Programmatic patterns → Programmatic validation criteria; Artifact patterns → Artifact validation criteria; User triggers → User validation criteria
- **Standards Preferences → `{AGENTS_FILE}` Content:** New universal standards → APM_STANDARDS namespace block; Existing `{AGENTS_FILE}` contents → Preserved outside APM_STANDARDS block; Existing standards overlap → Reference from inside block, do not duplicate
- **Specification Indicators → `Specifications.md` Content:** Design decisions → Formal specification sections; Existing documents → References rather than duplication; Constraints → Implementation boundaries

### 2.3 Validation Types

Validation criteria gathered during context discovery fall into three types. Most tasks combine multiple types.

**Programmatic:** Automated verification that can be executed without human judgment.
- Tests pass, builds succeed, CI checks pass
- Scripts execute correctly, linting passes, type checking succeeds
- Endpoints return expected responses, data validates against schemas

**Artifact:** File or output existence and structural verification.
- Documentation exists with required sections
- Config files present and valid
- Deliverables have correct format and structure
- Generated outputs match expected patterns

**User:** Human judgment required for subjective or strategic decisions.
- Design approval, content review
- Architectural decisions, approach validation
- Subjective quality assessment

**Execution behavior by type:**
- Programmatic and Artifact validation allow autonomous iteration — Agent can retry on failure
- User validation requires pause after execution — Agent waits for user review before proceeding or logging

### 2.4 Domain Standards

This subsection guides reasoning and decisions about work domains.

**Identification Patterns:**

Identify logical work domains from Context Gathering findings. Each domain represents a distinct area requiring a specific mental model or skill set.

*Skill Area Separation:*
- Different expertise areas → Separate domains requiring distinct knowledge bases
- Different technical environments → Domain-specific boundaries for each technology stack
- Investigation vs execution needs → Research-focused vs implementation-focused separation

*Mental Model Boundaries:*
- User-facing vs system-facing work → Client-side vs server-side separation
- Creative vs analytical work streams → Content-oriented vs data-oriented boundaries
- Configuration vs development activities → Setup-focused vs feature-focused domains

**Granularity Standards:**

Domain granularity requires balancing two failure modes: **over-separation** (too many small domains creating coordination overhead) and **over-consolidation** (merged domains requiring mental model switching).

*Over-consolidation signals (split into separate Agents):*
- Work requires fundamentally different mental models or skill sets
- Context switching would disrupt Worker Agent execution flow
- Domain scope is too broad for consistent technical knowledge requirements
- Separation directives from Context Gathering indicate distinct handling
- User provided separation directives during Context Gathering

*Over-separation signals (combine into single Agent):*
- Domains share the same mental model and skill requirements
- Work naturally builds upon itself with tight dependencies
- Separation would create excessive cross-Agent coordination
- Coupling directives from Context Gathering indicate unified handling
- User provided coupling directives during Context Gathering

*Assessment questions:*
- Do all tasks within this domain require similar thinking approach?
- Does domain scope maintain consistent technical knowledge requirements?
- Would separation reduce or increase Manager coordination overhead?
- Does each domain deliver independent value toward project goals?

**Default:** When signals are balanced, prefer separation to reduce coordination complexity.

### 2.5 Stage Standards

This subsection guides reasoning and decisions about project stages.

**Identification Patterns:**

Identify logical project stages from Context Gathering workflow patterns. Each stage represents a milestone grouping of related work.

*Complexity Pattern Analysis:*
- Layered complexity → Hierarchical stages with progressive dependencies
- Sequential patterns → Linear stages following natural workflow
- Concurrent work streams → Parallel stages organized by domain or component

*Start-to-Finish Logic:*
- Project initiation from retained context
- Continuity workflow between stages
- Completion and deliverable boundaries
- Natural progression without forced dependencies
- Parallel, no-dependency stages: order by practical preference

**Granularity Standards:**

Stage granularity requires balancing two failure modes: **over-fragmentation** (too many small stages creating unnecessary checkpoints) and **over-consolidation** (merged stages obscuring natural milestones).

*Over-consolidation signals (split into separate stages):*
- Stage contains unrelated work streams with no natural connection
- Extensive research requirements block subsequent work
- Testing and validation requirements warrant dedicated stages
- Bottlenecks and critical path items create natural boundaries
- Stage scope is too broad to deliver coherent value

*Over-fragmentation signals (combine into single stage):*
- Stages are artificially separated with immediate handoffs
- Simple or limited scope doesn't warrant separate stages
- Separation creates unnecessary coordination overhead
- Combined stages would still deliver coherent, independent value

*Assessment questions:*
- Does each stage deliver independent value toward project completion?
- Do stage boundaries align with workflow relationships and natural checkpoints?
- Does stage organization reduce or increase coordination complexity?
- Does stage scope support Worker Agent context preservation?

**Default:** When signals are balanced, prefer fewer stages with clear milestones over many small checkpoints.

### 2.6 Task Standards

This subsection guides reasoning and decisions about tasks within stages.

**Identification Patterns:**

Derive tasks from stage objectives by identifying distinct work units that advance the stage toward completion.

*Identification process:*
1. Review stage objective and required deliverables
2. Identify what work units are needed to produce those deliverables
3. Group related work that shares context, domain, and validation approach
4. Assess each potential task against granularity considerations

*Work unit characteristics:*
- **Meaningful deliverable:** Produces something concrete — functional code, configured system, documentation artifact, validated integration, research findings — not just "progress" or partial work
- **Domain coherence:** Belongs to a single Agent's domain; requires one consistent skill set or mental model throughout
- **Clear boundaries:** Has identifiable start conditions (dependencies satisfied, inputs available) and end conditions (validation criteria met)
- **Validation coverage:** Can be validated through defined criteria that meaningfully confirm the deliverable is complete and correct

**Granularity Standards:**

Task granularity requires balancing two failure modes: **task packing** (too much in one task) and **over-decomposition** (too many tiny tasks). Neither extreme serves project execution well.

*Validation and iteration:* The validation criteria enable Worker Agents to iterate on failures. Programmatic and Artifact validation allow autonomous correction cycles. User validation provides natural checkpoints where human judgment guides iteration. Task scope should align with the validation approach, matching the iteration pattern to the work's requirements.

*Task packing signals (split into separate tasks):*
- Multiple unrelated deliverables combined
- Work spans multiple Agent domains or skill sets
- Internal dependencies where later steps require earlier steps to be validated first
- Validation criteria cover unrelated concerns
- Complexity significantly exceeds peer tasks in the stage
- Task objective is vague or compound ("implement X and configure Y and document Z")

*Over-decomposition signals (combine into single task):*
- Related work artificially separated into sequential micro-tasks
- Tasks that would require immediate handoff to the same Agent
- Splitting creates coordination overhead without reducing complexity
- Individual "tasks" are single trivial actions rather than meaningful work
- Validation could reasonably cover the combined scope

*Assessment questions:*
- Does the proposed scope produce a meaningful, verifiable deliverable?
- Does the validation approach match the work's actual iteration needs?
- Would splitting reduce complexity, or just add coordination overhead?
- Would combining obscure distinct deliverables, or reflect natural work grouping?

**Task Packing Detection:** Review each task for packing signals. If any step is actually a separate deliverable, if validation criteria cover unrelated concerns, or if task scope significantly exceeds peers, split the task. See §3.6 Stage Cycle Protocol.

**Default:** When signals are balanced, prefer fewer, more substantial tasks over many small ones.

### 2.7 Step Standards

This subsection guides reasoning and decisions about steps within tasks. Steps organize work within a task and support failure tracing—they are not mini-tasks with independent validation.

**Identification Patterns:**

Derive steps from task objectives by identifying the ordered sub-units of work needed to produce the task's deliverable.

*Identification process:*
1. Review task objective and required outputs
2. Identify distinct operations that advance toward the deliverable
3. Order operations by dependency, preference, or practical sequence
4. Assess each potential step against granularity considerations

*Step characteristics:*
- **Ordered:** Follow logical sequence (dependency, preference, or practicality)
- **Discrete:** Each step has a clear outcome that advances the task
- **Referenced:** Numbering allows specific step references in communication and failure tracing
- **Shared validation:** Steps contribute to the task's validation criteria, not their own independent validation

**Granularity Standards:**

Step granularity requires balancing two failure modes: **over-abstraction** (steps too vague to aid execution) and **micro-decomposition** (trivial actions that add noise without value).

*Validation role:* Steps support the Agent's ability to trace validation failures to specific work. When validation fails, concrete steps help identify which part of the task needs correction. Design steps with this traceability in mind.

*Over-abstraction signals (split into separate steps):*
- A step encompasses multiple distinct operations that could fail independently
- Failure tracing would be difficult because the step is too broad
- The step description is vague and doesn't guide execution
- Breaking down would improve the Agent's ability to organize work

*Micro-decomposition signals (combine into single step):*
- Individual steps are trivial actions that don't warrant separate tracking
- Steps have no meaningful failure modes distinct from adjacent steps
- The granularity adds noise without aiding organization or traceability
- Combined steps would still be concrete enough for failure tracing

*Assessment questions:*
- Would this step help trace a validation failure to specific work?
- Does the step represent a meaningful segment of execution?
- Would combining adjacent steps lose useful organizational clarity?
- Would splitting this step improve the Agent's ability to execute or debug?

**Step vs Sub-Task Check:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing—the "step" is actually a separate task. See §2.6 Task Standards.

**Default:** When signals are balanced, prefer concrete steps that aid failure tracing over vague or trivial ones.

**Delegate Agent Steps:**

When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step using format: "Delegate Agent: <purpose>". See §4.5 Step Format.

### 2.8 Workload Distribution

During plan finalization, assess workload distribution across Agents to ensure no single Agent is overloaded.

**Overload Indicators:**
- Agent assigned 8+ tasks → Review for subdivision opportunity
- Tasks span multiple sub-domains within the Agent's scope
- Clear boundaries exist between task clusters

**Subdivision Reasoning:**

When considering Agent subdivision:
- Identify natural sub-domain boundaries within the overloaded Agent's work
- Ensure each sub-Agent has coherent, related tasks
- Use descriptive names reflecting the sub-domain scope
- Update all task dependencies to reflect new Agent instances

### 2.9 Scope Boundary Standards

Handle work that falls at the boundary between Agent scope and User scope.

**Assign to Agent When:**
- Work can be completed within the development environment
- No external accounts, credentials, or platform access required
- Validation can be performed autonomously or with artifact inspection

**Mark as User Coordination When:**
- Work requires external platform interaction (deployment, publishing, account setup)
- Credentials or account access are User-specific
- Validation requires access outside the development environment

**Task Specification:** When User coordination is required, include explicit coordination step in task. See §3.6 Stage Cycle Protocol.

---

## 3. Work Breakdown Procedure

This section defines the sequential actions that accomplish Work Breakdown. The procedure transforms gathered context into the Implementation Plan and `{AGENTS_FILE}`.

**Progression Gates:** Each action must complete before proceeding to the next. No skipping or batching unless explicitly instructed by User.

**Deliberation Scaling:** Reasoning depth matches decision complexity. All decisions trace to Context Gathering inputs and Operational Standards guidance. Use "User specified/requested during Context Gathering" attribution where applicable.

**Forced Chain-of-Thought Output:** All analysis must be presented in chat before file output—think in chat, commit to file. Use reasoning triggers like "This task depends on X because [reason]" or "Assigning to Agent because [justification]" per §2.1 Forced Chain-of-Thought Methodology. Reasoning draws from the relevant Operational Standards subsection (§2.4-2.9). Each procedure step shows the expected output format.

**Procedure:**
1. Standards Analysis → Write to `{AGENTS_FILE}`
2. Specifications Analysis → Create `Specifications.md`
3. Implementation Plan Header → Update Implementation Plan header
4. Domain Analysis → Update Implementation Plan header (Agents field)
5. Stage Analysis → Identify ALL stages with objectives AND tasks, update header (Stages field)
6. Stage Cycles → Per stage: detailed task breakdown, append to Implementation Plan body
7. Plan Finalization → Workload review, dependency review
8. User Approval → Direct to review
9. Procedure Checkpoint → Present artifacts, handle modifications or complete session

### 3.1 Standards Analysis

Apply the APM_STANDARDS Block format when executing these actions. See §4.1 APM_STANDARDS Block.

Perform the following actions:

1. Analyze standards from Context Gathering and present reasoning in chat:
   ```
   **Standards Analysis:**
   - Existing `{AGENTS_FILE}`: [Yes - contents to preserve outside APM_STANDARDS block / No - new file will be created]
   - [Category]: [standards] → APM_STANDARDS because User specified [requirement] during Context Gathering / [applies universally]
   - [Category]: [standards] → Task guidance because User requested [specific approach] for [certain work]
   - ...
   ```
2. Write APM_STANDARDS block to `{AGENTS_FILE}`:
   - If file exists: Preserve existing content outside block, append APM_STANDARDS block
   - If creating new: Create file with APM_STANDARDS block only
   - Use markdown headings for categories, determine relevant sections based on gathered context

**Duplication Avoidance:** If universal standards gathered during Context Gathering overlap with existing file contents, reference them from inside APM_STANDARDS block (e.g., "See [Section] above") rather than duplicating. Only add new standards not already covered.

### 3.2 Specifications Analysis

Apply the Specifications Format when executing these actions. See §4.2 Specifications Format.

Perform the following actions:

1. Analyze specifications from Context Gathering and present reasoning in chat:
   ```
   **Specifications Analysis:**
   - Existing spec documents to reference: [List if any, otherwise "None"]
   - [Category]: [specification items] → Specifications.md because [reasoning from Context Gathering]
   - [Category]: [specification items] → Reference existing doc because User mentioned [document]
   - ...
   - Approach: [Reference existing docs / Create new specifications / Hybrid]
   ```
2. Update `.apm/Specifications.md`:
   - Replace `<Project Name>` in title with project name (same as Implementation Plan)
   - Fill **Last Modification** field: "Plan creation by the Planner Agent."
   - Add specification content below the header separator
   - Use markdown headings for categories, determine relevant sections based on gathered context

**Duplication Avoidance:** If User has existing specification documents, reference them rather than duplicating. Use format: "See [document name], [section] for [specification type]." Only add new specifications not already covered elsewhere.

### 3.3 Implementation Plan Header

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

### 3.4 Domain Analysis

Apply the Domain Standards guidance when executing these actions. See §2.4 Domain Standards.

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

### 3.5 Stage Analysis

Apply the Stage Standards and Task Standards guidance when executing these actions. See §2.5 Stage Standards and §2.6 Task Standards.

Identify all stages and their tasks upfront. Detailed task breakdown occurs later. See §3.6 Stage Cycle Protocol.

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

### 3.6 Stage Cycle Protocol

This protocol governs how stage documentation cycles flow. For each stage defined earlier, complete detailed task breakdown. See §3.5 Stage Analysis for the stage list. Execute this cycle in stage order, completing all tasks for the current stage before proceeding to the next.

Apply the Task Standards and Step Standards guidance when executing these actions. See §2.6 Task Standards and §2.7 Step Standards.

**Output Protocol:** Reasoning happens in chat; file output contains structured definitions only. File writes interrupt continuous reasoning, providing fresh perspective for subsequent analysis.

Perform the following actions:

1. State context integration for current stage:
   ```
   **Stage Context:**
   * **Stage [N]:** [Name]
   * **Context Gathering Inputs:** User specified [requirements/constraints] that influence task execution
   ```
2. Complete task analysis for each task defined earlier for this stage (see §3.5 Stage Analysis):
   ```
   **Task Analysis:**
   * **Task [X.Y]:** [Name] (identified in §3.5 Stage Analysis)
   - **Scope:** [goal] → [deliverables]
   - **Context Input:** User specified [requirement] during Context Gathering / [relevant constraints]
   - **Agent:** [Name] Agent because [domain fit] / User requested [agent preference]
   - **Validation:** [Type(s) from §2.3] because [deliverable] requires [automated check / artifact verification / user judgment]. If User type: Agent pauses for review.
   - **Dependencies:** Task [A.B] by [Agent] for [what's needed] | None
   - **Steps** (applying §2.7 Step Standards):
     1. [Step] - [purpose if non-obvious]
     2. [Step]
     ...
   - **Granularity Check:** [concrete for tracing / adjustment needed]

   * **Task [X.Y]:** [Name] (identified in §3.5 Stage Analysis)
   - ...
   ```
   **Task Packing Correction:** If task packing is detected (per §2.6 Task Standards), correct by:
   1. Identify the natural boundaries within the packed task
   2. Create separate tasks for each distinct deliverable
   3. Establish dependencies between the new tasks
   4. Distribute validation criteria to appropriate tasks
   5. Update Agent assignments if split tasks span domains

   **User Coordination:** When User coordination is required (per §2.9 Scope Boundary Standards):
   - Include explicit coordination step in task: "User: [specific action required]"
   - Mark as User validation type if User must verify the outcome
   - Note the dependency clearly so Manager Agent can coordinate timing
3. Append stage to Implementation Plan body:
   - Stage header: `## Stage N: [Name]`
   - Task blocks following the format in §4.4 Task Format
   - Single write operation per stage cycle

**Proceed to next stage. See §3.5 Stage Analysis for the stage list. Repeat steps 1-3 until all stages documented.**

### 3.7 Plan Finalization

Perform the following actions:

1. **Workload Assessment:** Count tasks per Agent. Flag Agents with 8+ tasks for subdivision review. See §2.8 Workload Distribution.
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
6. **Plan Summary:** Present in chat:
   ```
   **Implementation Plan Summary:**
   * **Agents:** [count] ([list names])
   * **Stages:** [count] ([list names with task counts])
   * **Total Tasks:** [count]
   * **Cross-Agent Dependencies:** [count]
   ```

### 3.8 User Approval

Perform the following actions:

1. Direct User to review:
   - `{AGENTS_FILE}` for universal standards
   - `Specifications.md` for design decisions and constraints
   - Implementation Plan for task breakdown
   - Chat history for reasoning trace
2. Proceed to §3.9 Procedure Checkpoint.

### 3.9 Procedure Checkpoint & Completion

After completing `{AGENTS_FILE}`, `Specifications.md`, and the Implementation Plan, output the checkpoint. This Procedure Checkpoint also serves as the Completion for the Procedure, the Session and Planning Phase.

Perform the following actions:

1. Present the work breakdown results to the User using the following output block:
   ```
   Work Breakdown complete. Artifacts created [updated if after modifications].

   Please review the following artifacts:
   - **`{AGENTS_FILE}`** for project standards accuracy and completeness
   - **`Specifications.md`** for design decisions and constraints accuracy
   - **Implementation Plan** (.apm/Implementation_Plan.md) with [N] stages and [M] tasks

   Your manual review catches problems that automated checks cannot.

   **If modifications needed** → Describe the issues and I will iterate until artifacts meet your requirements.

   **If no modifications** → Planning Phase is complete. Proceed to initialize the Manager Agent using the `/apm-2-initiate-manager` command.
   ```
2. Handle User response:
   - If User requests modifications → Update artifacts → Return to step 1 with updated state
   - If User proceeds to Manager Agent (or indicates no modifications) → Session is complete, no further output needed

---

## 4. Structural Specifications

This section defines the output formats for artifacts produced during Work Breakdown.

### 4.1 APM_STANDARDS Block

The namespace block structure for `{AGENTS_FILE}`:
```
APM_STANDARDS {

[APM-managed standards content]

} //APM_STANDARDS
```

**Content Rules:**
- **Structure:** Use markdown headings (`##`) for major categories and unordered lists (`-`) for individual standards
- **Specificity:** Each standard must be concrete and actionable (avoid vague terms like "write good code")
- **Consistency:** Use consistent terminology and formatting across all standards
- **Scope:** Only universal standards that apply to all Agents and tasks:
  - **Include:** Coding conventions, testing requirements, documentation standards, version control practices, universal constraints (security, accessibility, performance)
  - **Exclude:** Architecture decisions (Manager scope), task-specific guidance (Implementation Plan scope), progress tracking (Memory System scope)

### 4.2 Specifications Format

The structure for `.apm/Specifications.md`:
```markdown
# <Project Name> – APM Specifications
**Last Modification:** [Date and description]

---

[Free-form specification content]
```

**Content Rules:**
- **Structure:** Use markdown headings (`##`) for major categories, determine relevant sections based on gathered context
- **Specificity:** Each specification must be concrete and actionable
- **Consistency:** Use consistent terminology and formatting across all specifications
- **Scope:** Project-specific design decisions and constraints that inform the Implementation Plan. Content categories vary by project—include what is relevant to this project's coordination needs.
  - **Exclude:** Universal standards (`{AGENTS_FILE}` scope), task-specific guidance (Implementation Plan scope)
- **References:** When User has existing specification documents, reference them rather than duplicating content

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
* **Objective:** Single-sentence task goal — what this task accomplishes.
* **Output:** Concrete deliverables — files, components, artifacts functionality produced.
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
* **Steps vs sub-tasks:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing. The "step" might actually be separate task. See §2.6 Task Standards.

**Delegate Agent Steps:**

When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step.

* **Format:** "Delegate Agent: <purpose>"
* **Delegation Usage Patterns and Skill References:**
  - **Debug delegation:** For complex bugs that require isolated debugging focus. Include skill reference: {SKILL_PATH:delegate-debug}
  - **Research delegation:** For knowledge gaps that require research to inform later steps. Include skill reference: {SKILL_PATH:delegate-research}
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

**`{AGENTS_FILE}`:**
- Only genuinely universal standards
- Concrete and actionable (not "write good code")
- No duplication of existing project standards in the file; reference instead

### 5.2 Common Mistakes

- **Task packing:** Multiple deliverables in one task → See §2.6 Task Standards.
- **Over-decomposition:** Excessive tiny tasks → Tasks should be meaningful work units. See §2.6 Task Standards.
- **Vague validation:** "Works correctly" → Specify what "correctly" means
- **Missing dependencies:** Tasks requiring prior work unmarked → Trace prerequisites

---

**End of Skill**
