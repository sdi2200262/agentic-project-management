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

**Use Problem Space for reasoning.** When making work breakdown decisions, consult the relevant reasoning subsection (Domain, Stage, Task, or Step Reasoning) to guide your thinking. See §2 Problem Space.

**Use Policies for decisions.** When encountering branch points (split vs. combine, scope boundaries), apply the relevant policy to determine the appropriate action. See §4 Policies.

**Output only structured blocks.** Present reasoning in chat using the Reasoning Block and Summary Block formats. Do not expose internal deliberation beyond these structured outputs—the blocks make your reasoning visible to the User while maintaining clarity. See §5 Structural Specifications.

### 1.2 Objectives

- Translate gathered context into actionable project structure
- Define Worker Agents based on domain organization
- Create tasks with clear objectives, outputs, validation criteria, and dependencies
- Establish project standards for consistent Agent behavior

### 1.3 Outputs

**`{AGENTS_FILE}`:** Universal project standards that apply to all Agents. Leverages the always-apply rule pattern in AI Assistants.

**Implementation Plan:** Detailed task breakdown organized by stages, with Agent assignments, validation criteria, and dependency chains for Manager Agent consumption.

### 1.4 Scope Adaptation

The breakdown guidance in this skill provides criteria for making decomposition decisions, not fixed definitions. All concepts (domains, stages, tasks, steps) are relative to project scope and complexity.

Stage, task and step definitions should always be adjusted based on the actual size and complexity of the project. Break down the work to provide the right level of detail for the project's needs, applying more granularity when justified by complexity and less when simplicity allows. Let the real scope and requirements guide how work units are identified and organized.

Adapt the methodology to the project based on Context Gathering findings about scale, complexity, and requirements. The guidance in this skill supports your reasoning; the project's actual scope determines appropriate granularity.

---

## 2. Problem Space

This section establishes the reasoning approach for executing Work Breakdown. It guides how to think about domain boundaries, task granularity, dependencies, and workload distribution.

### 2.1 Forced Chain-of-Thought Methodology

Work Breakdown uses Forced Chain-of-Thought (CoT), requiring explicit reasoning in chat before any file output. This methodology prevents pattern-matching by forcing consideration of project-specific context for each decision.

**Principle:** Think in chat, commit to file. Each breakdown decision must be traceable to explicit reasoning presented in the conversation.

**Reasoning triggers:**
- "This task depends on Task X.Y because [specific reason]"
- "Assigning to Agent_Backend because [domain justification]"
- "Breaking into separate tasks because [complexity/scope reason]"
- "Steps are [XYZ] since [reasoning of task contents] and are ordered this way because [dependency/practical reason]"

**Chat vs File Output Separation:**

- **Chat (reasoning):** Domain analysis, stage sequencing, task breakdown reasoning, dependency identification, review decisions. All deliberation happens in chat where User can observe the decision making process and intervene.
- **File (output):** Structured definitions only. Clean, actionable specifications without reasoning artifacts.
- **Context breaks:** File writes interrupt continuous chat reasoning, providing fresh perspective for subsequent analysis and preventing pattern formation.

### 2.2 Context Integration

Work Breakdown requires context from Context Gathering across these categories:

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
- Coding conventions and style requirements
- Testing requirements and coverage expectations
- Documentation and commit conventions
- Existing `{AGENTS_FILE}` contents (if found during Context Gathering workspace scan)

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

### 2.4 Domain Reasoning

This subsection guides reasoning about work domains. The number of domains and their level of detail should be determined by the actual scope and complexity of the project, following the adaptation guidelines. See §1.4 Scope Adaptation.

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

**Granularity Considerations:**

Domain granularity requires balancing two concerns: **over-separation** (too many small domains creating coordination overhead) and **over-consolidation** (merged domains requiring mental model switching).

*Split indicators (over-consolidation):*
- Work requires fundamentally different mental models or skill sets
- Context switching would disrupt Worker Agent execution flow
- Domain scope is too broad for consistent technical knowledge requirements
- Separation directives from Context Gathering indicate distinct handling

*Combine indicators (over-separation):*
- Domains share the same mental model and skill requirements
- Work naturally builds upon itself with tight dependencies
- Separation would create excessive cross-Agent coordination
- Coupling directives from Context Gathering indicate unified handling

*Granularity questions:*
- Do all tasks within this domain require similar thinking approach?
- Does domain scope maintain consistent technical knowledge requirements?
- Would separation reduce or increase Manager coordination overhead?
- Does each domain deliver independent value toward project goals?

### 2.5 Stage Reasoning

This subsection guides reasoning about project stages. The number and granularity of stages should be based on the actual size and complexity of the project, following the adaptation guidelines. See §1.4 Scope Adaptation.

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

**Granularity Considerations:**

Stage granularity requires balancing two concerns: **over-fragmentation** (too many small stages creating unnecessary checkpoints) and **over-consolidation** (merged stages obscuring natural milestones).

*Split indicators (over-consolidation):*
- Stage contains unrelated work streams with no natural connection
- Extensive research requirements block subsequent work
- Testing and validation requirements warrant dedicated stages
- Bottlenecks and critical path items create natural boundaries
- Stage scope is too broad to deliver coherent value

*Combine indicators (over-fragmentation):*
- Stages are artificially separated with immediate handoffs
- Simple or limited scope doesn't warrant separate stages
- Separation creates unnecessary coordination overhead
- Combined stages would still deliver coherent, independent value

*Granularity questions:*
- Does each stage deliver independent value toward project completion?
- Do stage boundaries align with workflow relationships and natural checkpoints?
- Does stage organization reduce or increase coordination complexity?
- Does stage scope support Worker Agent context preservation?

### 2.6 Task Reasoning

This subsection guides reasoning about tasks within stages. The number and granularity of tasks should be based on the actual size and complexity of the project, following the adaptation guidelines. See §1.4 Scope Adaptation.

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

**Granularity Considerations:**

Task granularity requires balancing two failure modes: **task packing** (too much in one task) and **over-decomposition** (too many tiny tasks). Neither extreme serves project execution well.

*Validation and iteration:* The validation criteria enable Worker Agents to iterate on failures. Programmatic and Artifact validation allow autonomous correction cycles. User validation provides natural checkpoints where human judgment guides iteration. Task scope should align with the validation approach, matching the iteration pattern to the work's requirements.

*Split indicators (task packing):*
- Multiple unrelated deliverables combined
- Work spans multiple Agent domains or skill sets
- Internal dependencies where later steps require earlier steps to be validated first
- Validation criteria cover unrelated concerns
- Complexity significantly exceeds peer tasks in the stage

*Combine indicators (over-decomposition):*
- Related work artificially separated into sequential micro-tasks
- Tasks that would require immediate handoff to the same Agent
- Splitting creates coordination overhead without reducing complexity
- Individual "tasks" are single trivial actions rather than meaningful work
- Validation could reasonably cover the combined scope

*Granularity questions:*
- Does the proposed scope produce a meaningful, verifiable deliverable?
- Does the validation approach match the work's actual iteration needs?
- Would splitting reduce complexity, or just add coordination overhead?
- Would combining obscure distinct deliverables, or reflect natural work grouping?

### 2.7 Step Reasoning

This subsection guides reasoning about steps within tasks. The number and granularity of steps should be based on the actual size and complexity of the project, following the adaptation guidelines. See §1.4 Scope Adaptation. Steps organize work within a task and support failure tracing—they are not mini-tasks with independent validation.

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

**Granularity Considerations:**

Step granularity requires balancing two concerns: **over-abstraction** (steps too vague to aid execution) and **micro-decomposition** (trivial actions that add noise without value).

*Validation role:* Steps support the Agent's ability to trace validation failures to specific work. When validation fails, concrete steps help identify which part of the task needs correction. Design steps with this traceability in mind.

*Split indicators (over-abstraction):*
- A step encompasses multiple distinct operations that could fail independently
- Failure tracing would be difficult because the step is too broad
- The step description is vague and doesn't guide execution
- Breaking down would improve the Agent's ability to organize work

*Combine indicators (micro-decomposition):*
- Individual steps are trivial actions that don't warrant separate tracking
- Steps have no meaningful failure modes distinct from adjacent steps
- The granularity adds noise without aiding organization or traceability
- Combined steps would still be concrete enough for failure tracing

*Granularity questions:*
- Would this step help trace a validation failure to specific work?
- Does the step represent a meaningful segment of execution?
- Would combining adjacent steps lose useful organizational clarity?
- Would splitting this step improve the Agent's ability to execute or debug?

**Delegate Agent Steps:**

When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step.

*Format:* "Delegate Agent: <purpose>"

*Delegation Usage Patterns and Skill References:*
- **Debug delegation:** For complex bugs that require isolated debugging focus. Include skill reference: {SKILL_PATH:delegate-debug/SKILL.md}
- **Research delegation:** For knowledge gaps that require research to inform later steps. Include skill reference: {SKILL_PATH:delegate-research/SKILL.md}
- **Refactor delegation:** For code restructuring or clean-up requiring an isolated refactoring scope. Include skill reference if a relevant skill exists.
- **Other delegation:** For any other context-heavy or investigation step not covered above, clearly describe the specific purpose and scope of the delegation step in the task.

Always include the relevant delegation skill reference for debug and research steps as shown. For other and refactor, add skill references if available and be explicit about the purpose.

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

---

## 3. Work Breakdown Procedure

This section defines the sequential actions that accomplish Work Breakdown. The procedure transforms gathered context into the Implementation Plan and `{AGENTS_FILE}`.

**Progression Gates:** Each action must complete before proceeding to the next. No skipping or batching unless explicitly instructed by User.

**Deliberation Scaling:** Reasoning depth matches decision complexity. All decisions trace to Context Gathering inputs and Problem Space guidance. Use "User specified/requested during Context Gathering" attribution where applicable.

**Output Blocks:** All analysis must be presented using the **Reasoning Block** and **Summary Block** formats. Reasoning content draws from the relevant Problem Space subsection (§2.4-2.8) and decision rules from the relevant Policy (§4.1-4.5). Do not output internal deliberation outside these structured blocks. See §5 Structural Specifications.

**Procedure Flow:**
1. Standards Definition → Write to `{AGENTS_FILE}`
2. Implementation Plan Header → Update Implementation Plan header
3. Domain Definition → Update Implementation Plan header (Agents field)
4. Stage Definition → Identify ALL stages with objectives AND tasks, update header
5. Stage Cycles → Per stage: detailed task breakdown, append to Implementation Plan body
6. Plan Finalization → Workload review, dependency review
7. User Approval → Review and iterate

### 3.1 Standards Definition

**Action 1:** Categorize standards from Context Gathering in chat:
```
- [Category]: [standards] → APM_STANDARDS because User specified [requirement] during Context Gathering / [applies universally]
- [Category]: [standards] → Task guidance because User requested [specific approach] for [certain work]
- ...
```

**Action 2:** Reference `{AGENTS_FILE}` status from Context Gathering:
- If existing file found: Note contents to preserve outside APM_STANDARDS block
- If no existing file: New file will be created with APM_STANDARDS block only

**Action 3:** Write APM_STANDARDS block to `{AGENTS_FILE}`:
- If file exists: Preserve existing content outside block, append APM_STANDARDS block
- If creating new: Create file with APM_STANDARDS block only

**Duplication Avoidance:** If universal standards gathered during Context Gathering overlap with existing file contents, reference them from inside APM_STANDARDS block (e.g., "See [Section] above") rather than duplicating. Only add new standards not already covered.

### 3.2 Implementation Plan Header

**Action 1:** Determine project name from Context Gathering:
- If User specified a project name during Context Gathering: Use that name exactly as provided
- If no name specified: Generate a concise, descriptive name based on project type, deliverable, and primary purpose from Context Gathering findings

**Action 2:** Update Implementation Plan header:
- Replace `<Project Name>` in title with determined project name
- Fill **Project Overview** field with 3-5 sentences synthesizing high-level project description from Context Gathering inputs:
  - Project type and primary deliverable
  - Core problem being solved or goal being achieved
  - Essential scope and key features
  - Success criteria or completion indicators
  - Keep overview concise and focused on what the project accomplishes, not how it will be built
- Fill **Last Modification** field: "Plan creation by the Planner Agent."

### 3.3 Domain Definition

Apply the Domain Reasoning guidance when executing these actions. See §2.4 Domain Reasoning.

**Action 1:** Present domain decisions in chat:
```
**Domain Analysis:**
- [Domain]: requires [mental model/skill set] → separate because User specified [separation directive] during Context Gathering / [distinct expertise reasoning]
- [Domain]: requires [mental model/skill set] → combined with [X] because User requested [coupling directive] during Context Gathering / [shared model reasoning]
- ...
```

**Action 2:** Present Worker Agent assignments:
```
**Proposed Worker Agents:**
- [Name] Agent: [domains] - [responsibility, scope]
- [Name] Agent: [domains] - [responsibility, scope]
- ...
```

**Action 3:** Update Implementation Plan header (Agents field):
```
* **Agents:** [Name] Agent, [Name] Agent ...
```

### 3.4 Stage Definition

Apply the Stage Reasoning and Task Reasoning guidance when executing these actions. See §2.5 Stage Reasoning and §2.6 Task Reasoning.

Identify all stages and their tasks upfront. Detailed task breakdown occurs later. See §3.5 Stage Cycle Protocol.

**Action 1:** Present stage structure with task identification in chat. For each stage:

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

**Action 2:** Update Implementation Plan header:
- Fill **Stages** field with count and list

### 3.5 Stage Cycle Protocol

This protocol governs how stage documentation cycles flow. For each stage defined earlier, complete detailed task breakdown. See §3.4 Stage Definition for the stage list. Execute this cycle in stage order, completing all tasks for the current stage before proceeding to the next.

Apply the Task Reasoning and Step Reasoning guidance when executing these actions. See §2.6 Task Reasoning and §2.7 Step Reasoning.

**Action 1:** State context integration for current stage:
```
**Stage Context:**
* **Stage [N]:** [Name]
* **Context Gathering Inputs:** User specified [requirements/constraints] that influence task execution
```

**Action 2:** Complete task analysis for each task defined earlier for this stage. See §3.4 Stage Definition:

```
**Task Analysis:**
* **Task [X.Y]:** [Name] (identified in §3.4)
- **Scope:** [goal] → [deliverables]
- **Context Input:** User specified [requirement] during Context Gathering / [relevant constraints]
- **Agent:** [Name] Agent because [domain fit] / User requested [agent preference]
- **Validation:** [Type(s) from §2.3] because [deliverable] requires [automated check / artifact verification / user judgment]. If User type: Agent pauses for review.
- **Dependencies:** Task [A.B] by [Agent] for [what's needed] | None
- **Steps** (applying §2.7):
  1. [Step] - [purpose if non-obvious]
  2. [Step]
  ...
- **Granularity Check:** [concrete for tracing / adjustment needed]

* **Task [X.Y]:** [Name] (identified in §3.4)
- ...
```

**Action 3:** Append stage to Implementation Plan body:
- Stage header: `## Stage N: [Name]`
- Task blocks following the format in §5.3 Task Format
- Single write operation per stage cycle

**Proceed to next stage. See §3.4 Stage Definition for the stage list. Repeat Actions 1-3 until all stages documented.**

### 3.6 Plan Finalization

**Action 1 - Workload Assessment:** Count tasks per Agent. Flag Agents with 8+ tasks for subdivision review. See §2.8 Workload Distribution.

**Action 2 - Agent Subdivision (if needed):**
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

**Action 3 - Update Assignments (if subdivided):** Update Implementation Plan with revised Agent assignments. Preserve all task content during reassignment. Update all task dependencies to reflect the new Agent instances accordingly.

**Action 4 - Cross-Agent Dependency Review:**
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

**Action 5 - Update Cross-Agent Dependencies (if any identified):** Only after completing the reasoning step in Action 4, update the Implementation Plan by bolding the existing "Task N.M by [Name] Agent" notation in the Dependencies field for all identified cross-Agent dependencies to make them visually distinct from same-Agent dependencies.

**Action 6 - Plan Summary:** Present in chat:
```
**Implementation Plan Summary:**
* **Agents:** [count] ([list names])
* **Stages:** [count] ([list names with task counts])
* **Total Tasks:** [count]
* **Cross-Agent Dependencies:** [count]
```

### 3.7 User Approval

**Action 1:** Direct User to review:
- `{AGENTS_FILE}` for universal standards
- Implementation Plan for task breakdown
- Chat history for reasoning trace

**Action 2:** Handle modification requests through targeted revisions. Iterate until explicit User approval.

**Procedure Complete:** The Work Breakdown Procedure is complete when the User approves both `{AGENTS_FILE}` and the Implementation Plan.

---

## 4. Policies

This section defines the decision rules that govern choices at branch points during Work Breakdown execution.

### 4.1 Domain Split/Combine Policy

**Decision Domain:** When to split domains into separate Agents vs. combine into unified handling.

**Split into Separate Agents When:**
- Work requires fundamentally different mental models or skill sets
- Context switching would disrupt Worker Agent execution flow
- Domain scope is too broad for consistent technical knowledge requirements
- User provided separation directives during Context Gathering indicating domains must remain distinct

**Combine into Single Agent When:**
- Domains share the same mental model and skill requirements
- Work naturally builds upon itself with tight dependencies
- Separation would create excessive cross-Agent coordination
- User provided coupling directives during Context Gathering indicating unified handling

**Default:** When indicators are balanced, prefer separation to reduce coordination complexity.

### 4.2 Stage Split/Combine Policy

**Decision Domain:** When to split work into separate stages vs. combine into a single stage.

**Split into Separate Stages When:**
- Stage contains unrelated work streams with no natural connection
- Extensive research or investigation requirements block subsequent work
- Testing and validation requirements warrant dedicated focus
- Bottlenecks or critical path items create natural boundaries
- Stage scope is too broad to deliver coherent value

**Combine into Single Stage When:**
- Stages are artificially separated with immediate handoffs
- Simple or limited scope doesn't warrant separate stages
- Separation creates unnecessary coordination overhead
- Combined stages would still deliver coherent, independent value

**Default:** When indicators are balanced, prefer fewer stages with clear milestones over many small checkpoints.

### 4.3 Task Split/Combine Policy

**Decision Domain:** When to split work into separate tasks vs. combine into a single task.

**Split into Separate Tasks When:**
- Multiple unrelated deliverables would be combined
- Work spans multiple Agent domains or skill sets
- Internal dependencies exist where later steps require earlier steps to be validated first
- Validation criteria would cover unrelated concerns
- Complexity significantly exceeds peer tasks in the stage
- Task objective is vague or compound ("implement X and configure Y and document Z")

**Combine into Single Task When:**
- Related work is artificially separated into sequential micro-tasks
- Tasks would require immediate handoff to the same Agent
- Splitting creates coordination overhead without reducing complexity
- Individual "tasks" are single trivial actions rather than meaningful work
- Validation could reasonably cover the combined scope

**Task Packing Detection:** Review each task for packing indicators:
- If any step is actually a separate deliverable → split
- If validation criteria cover unrelated concerns → split
- If task scope significantly exceeds peers → split

**Correction Actions:**
1. Identify the natural boundaries within the packed task
2. Create separate tasks for each distinct deliverable
3. Establish dependencies between the new tasks
4. Distribute validation criteria to appropriate tasks
5. Update Agent assignments if split tasks span domains

**Default:** When indicators are balanced, prefer fewer, more substantial tasks over many small ones.

### 4.4 Step Split/Combine Policy

**Decision Domain:** When to split work into separate steps vs. combine into a single step.

**Split into Separate Steps When:**
- A step encompasses multiple distinct operations that could fail independently
- Failure tracing would be difficult because the step is too broad
- The step description is vague and doesn't guide execution
- Breaking down would improve the Agent's ability to organize work

**Combine into Single Step When:**
- Individual steps are trivial actions that don't warrant separate tracking
- Steps have no meaningful failure modes distinct from adjacent steps
- The granularity adds noise without aiding organization or traceability
- Combined steps would still be concrete enough for failure tracing

**Step vs Sub-Task Check:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing—the "step" is actually a separate task. See §4.3 Task Split/Combine Policy.

**Default:** When indicators are balanced, prefer concrete steps that aid failure tracing over vague or trivial ones.

### 4.5 Scope Boundary Policy

**Decision Domain:** How to handle work that falls at the boundary between Agent scope and User scope.

**Assign to Agent When:**
- Work can be completed within the development environment
- No external accounts, credentials, or platform access required
- Validation can be performed autonomously or with artifact inspection

**Mark as User Coordination When:**
- Work requires external platform interaction (deployment, publishing, account setup)
- Credentials or account access are User-specific
- Validation requires access outside the development environment

**Task Specification:** When User coordination is required:
- Include explicit coordination step in task: "User: [specific action required]"
- Mark as User validation type if User must verify the outcome
- Note the dependency clearly so Manager Agent can coordinate timing

---

## 5. Structural Specifications

This section defines the output formats for artifacts produced during Work Breakdown.

### 5.1 APM_STANDARDS Block

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

### 5.2 Stage Format

Each stage in the Implementation Plan follows this format:

**Stage header:** `## Stage N: [Name]`

**Naming stages:** Stage names should reflect the domain(s), objectives, and main deliverables of the stage. Choose clear, goal-oriented names that describe the key work being accomplished.

**Stage contents:**
- Tasks for the stage following the Task Format. See §5.3 Task Format.
- Each task contains steps following the Step Format. See §5.4 Step Format.
- Task dependencies within and across stages

### 5.3 Task Format

Each task in the Implementation Plan follows this format:

**Task Header:** `### Task <N.M>: <Title> - <Domain> Agent`

**Task Contents:**
```
* **Objective:** Single-sentence task goal — what this task accomplishes.
* **Output:** Concrete deliverables — files, components, artifacts functionality produced.
* **Validation:** Binary pass/fail criteria using types in §2.3 Validation Types. Most tasks combine multiple types.
    - **Programmatic:** Automated checks (tests, builds, CI, linting)
    - **Artifact:** File/output existence and structure verification
    - **User:** Human judgment required — triggers pause for review after execution
* **Guidance:** Technical constraints, approach specifications, references to existing patterns.
* **Dependencies:** Prior task knowledge, outputs or deliverables required.
    - **Format:** List dependencies as `Task N.M by <Domain> Agent, Task X.Y <Domain> Agent, ...`
    - **No dependencies:** Use "None" explicitly.

1. [Step description]
2. [Step description]
3. [Step description]
```

### 5.4 Step Format

Each step in a task follows this format:

**Step format:** Numbered instruction describing a discrete operation.

**Step contents:**
- Clear, specific instruction that an Agent can execute directly
- Optional action outcome if needed
- Optional relevant context where non-obvious
- References to patterns, files, or prior work when relevant

**Steps vs sub-tasks:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing. The "step" is actually a separate task. See §4.3 Task Split/Combine Policy.

### 5.5 Reasoning Block

Documents structured reasoning during analysis phases. Reasoning draws from §2 Problem Space for identification and granularity guidance, and from §4 Policies for split/combine decisions.

```
**<Analysis Type>:**
- <item>: <reasoning and conclusion>
- <item>: <reasoning and conclusion>
- ...
```

**Usage:** Domain Analysis, Stage Analysis, Task Analysis, Agent Subdivision, Cross-Agent Dependencies Review.

**Reasoning Sources by Analysis Type:**
- Domain Analysis → §2.4 Domain Reasoning + §4.1 Domain Split/Combine Policy
- Stage Analysis → §2.5 Stage Reasoning + §4.2 Stage Split/Combine Policy
- Task Analysis → §2.6 Task Reasoning + §4.3 Task Split/Combine Policy
- Step definition → §2.7 Step Reasoning + §4.4 Step Split/Combine Policy

### 5.6 Summary Block

Presents consolidated information for User review:

```
**<Topic> Summary:**
* **<Field>:** [value]
* **<Field>:** [value]
...
```

**Usage:** Implementation Plan Summary after Plan Finalization.

---

## 6. Content Guidelines

### 6.1 Quality Standards

**Implementation Plan:**
- Each task understandable without external reference
- Specific language (avoid "implement properly" → specify the pattern to follow)
- All fields populated, no placeholders
- Consistent naming and terminology

**`{AGENTS_FILE}`:**
- Only genuinely universal standards
- Concrete and actionable (not "write good code")
- No duplication of existing project standards in the file; reference instead

### 6.2 Common Mistakes

- **Task packing:** Multiple deliverables in one task → See §4.3 Task Split/Combine Policy.
- **Over-decomposition:** Excessive tiny tasks → Tasks should be meaningful work units. See §4.3 Task Split/Combine Policy.
- **Vague validation:** "Works correctly" → Specify what "correctly" means
- **Missing dependencies:** Tasks requiring prior work unmarked → Trace prerequisites

---

**End of Skill**
