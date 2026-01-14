---
name: work-breakdown
description: Decomposition of gathered context into the Implementation Plan with domain analysis, stage definition, and task breakdown. Defines the Work Breakdown procedure for the Planner Agent.
---

# APM {VERSION} - Work Breakdown Skill

This skill defines the methodology for the Work Breakdown procedure, which transforms gathered context into structured project artifacts through forced Chain-of-Thought reasoning, ensuring well-considered task breakdowns.

## 1. Overview

### 1.1. Objectives

- Translate gathered context into actionable project structure
- Define Worker Agents based on domain organization
- Create tasks with clear objectives, outputs, validation criteria, and dependencies
- Establish project standards for consistent Agent behavior

### 1.2. Outputs

**`{AGENTS_FILE}`:** Universal project standards that apply to all Agents. Leverages the always-apply rule pattern in AI Assistants.

**Implementation Plan:** Detailed task breakdown organized by stages, with Agent assignments, validation criteria, and dependency chains for Manager Agent consumption.

### 1.3. Scope Adaptation

The breakdown frameworks in this skill provide criteria for making decomposition decisions, not fixed definitions. All concepts (domains, stages, tasks, steps) are relative to project scope and complexity.

Stage, task and step definitions should always be adjusted based on the actual size and complexity of the project. Break down the work to provide the right level of detail for the project's needs, applying more granularity when justified by complexity and less when simplicity allows. Let the real scope and requirements guide how work units are identified and organized.

Adapt the methodology to the project based on Context Gathering findings about scale, complexity, and requirements. The frameworks guide your reasoning; the project's actual scope determines appropriate granularity.

## 2. Forced Chain-of-Thought Framework

### 2.1. Methodology

Project Breakdown uses forced Chain-of-Thought (CoT), requiring explicit reasoning in chat before any file output. This methodology prevents pattern-matching by forcing consideration of project-specific context for each decision.

**Principle:** Think in chat, commit to file. Each breakdown decision must be traceable to explicit reasoning presented in the conversation.

**Reasoning triggers:**
- "This task depends on Task X.Y because [specific reason]"
- "Assigning to Agent_Backend because [domain justification]"
- "Breaking into separate tasks because [complexity/scope reason]"
- "Steps are [XYZ] since [reasoning of task contents] and are ordered this way because [dependency/practical reason]"

### 2.2. Chat vs File Separation

**Chat (reasoning):** Domain analysis, stage sequencing, task breakdown reasoning, dependency identification, review decisions. All deliberation happens in chat where User can observey the decision making process and intervene.

**File (output):** Structured definitions only. Clean, actionable specifications without reasoning artifacts.

**Context breaks:** File writes interrupt continuous chat reasoning, providing fresh perspective for subsequent analysis and preventing pattern formation.

## 3. Context Integration Framework

### 3.1. Input Categories

Work Breakdown requires the following context from Context Gathering.

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

### 3.2. Input-to-Output Mapping

Each input category translates to specific artifacts:

**Project Definition → Implementation Plan Structure**
- Vision and goals → Project Overview header field
- Success criteria and deliverables → Stage and Task objectives
- Scope boundaries → Explicit distinction between Agent and User work

**Technical Requirements → Task Definitions**
- Technology stack → Task guidance and constraints
- External dependencies → Dependency markers, User coordination steps
- Complexity indicators → Task granularity decisions
- Environment requirements → Setup and configuration tasks

**Process Requirements → Task Specifications**
- Quality standards → Validation criteria fields
- Workflow preferences → Task guidance sections
- Coordination requirements → Dependency markers, User validation needs

**Domain Organization → Agent Assignments**
- Identified domains → Worker Agent definitions
- Coupling directives → Merged Agent assignments
- Separation directives → Distinct Agent boundaries

**Validation Approach → Task Validation Fields**
- Programmatic patterns → Programmatic validation criteria
- Artifact patterns → Artifact validation criteria
- User triggers → User validation criteria

**Standards Preferences → `{AGENTS_FILE}` Content**
- New universal standards → APM_STANDARDS namespace block
- Existing `{AGENTS_FILE}` contents → Preserved outside APM_STANDARDS block
- Existing standards overlap → Reference from inside block, do not duplicate

### 3.3. Validation Types

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

## 4. Domain Analysis Framework

The number of domains and their level of detail should be determined by the actual scope and complexity of the project, following the adaptation guidelines in §1.3. Always match domain analysis to what is needed for this project rather than using fixed patterns.

### 4.1. Domain Identification

Identify logical work domains from Context Gathering findings. Each domain represents a distinct area requiring a specific mental model or skill set.

**Identification patterns:**

*Skill Area Separation:*
- Different expertise areas → Separate domains requiring distinct knowledge bases
- Different technical environments → Domain-specific boundaries for each technology stack
- Investigation vs execution needs → Research-focused vs implementation-focused separation

*Mental Model Boundaries:*
- User-facing vs system-facing work → Client-side vs server-side separation
- Creative vs analytical work streams → Content-oriented vs data-oriented boundaries
- Configuration vs development activities → Setup-focused vs feature-focused domains

### 4.2. Domain Granularity Balance

Domain granularity requires balancing two concerns: **over-separation** (too many small domains creating coordination overhead) and **over-consolidation** (merged domains requiring mental model switching).

**Split indicators (over-consolidation):**
- Work requires fundamentally different mental models or skill sets
- Context switching would disrupt Worker Agent execution flow
- Domain scope is too broad for consistent technical knowledge requirements
- Coupling directives from Context Gathering indicate separation

**Combine indicators (over-separation):**
- Domains share the same mental model and skill requirements
- Work naturally builds upon itself with tight dependencies
- Separation would create excessive cross-Agent coordination
- Coupling directives from Context Gathering indicate unified handling

**Granularity decision framework:**
- Do all tasks within this domain require similar thinking approach?
- Does domain scope maintain consistent technical knowledge requirements?
- Would separation reduce or increase Manager coordination overhead?
- Does each domain deliver independent value toward project goals?

### 4.3. Agent Assignment

Assign Worker Agents based on identified domains:

**Assignment criteria:**
- One Worker Agent per identified logical domain
- Descriptive identifiers reflecting domain or domains scope: `[Name] Agent`
- Minimize cross-Agent dependencies through coherent domain boundaries
- Note that workload review may require Agent subdivision; see §8.6 Plan Finalization.

## 5. Stage Analysis Framework

The number and granularity of stages should be based on the actual size and complexity of the project, following the adaptation guidelines in §1.3. Always match stage analysis to what is needed for this project, rather than applying fixed patterns.

### 5.1. Stage Identification

Identify logical project stages from Context Gathering workflow patterns. Each stage represents a milestone grouping of related work.

**Identification patterns:**

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

### 5.2. Stage Granularity Balance

Stage granularity requires balancing two concerns: **over-fragmentation** (too many small stages creating unnecessary checkpoints) and **over-consolidation** (merged stages obscuring natural milestones).

**Split indicators (over-consolidation):**
- Stage contains unrelated work streams with no natural connection
- Extensive research requirements block subsequent work
- Testing and validation requirements warrant dedicated stages
- Bottlenecks and critical path items create natural boundaries
- Stage scope is too broad to deliver coherent value

**Combine indicators (over-fragmentation):**
- Stages are artificially separated with immediate handoffs
- Simple or limited scope doesn't warrant separate stages
- Separation creates unnecessary coordination overhead
- Combined stages would still deliver coherent, independent value

**Granularity decision framework:**
- Does each stage deliver independent value toward project completion?
- Do stage boundaries align with workflow relationships and natural checkpoints?
- Does stage organization reduce or increase coordination complexity?
- Does stage scope support Worker Agent context preservation?

### 5.3. Stage Structure

Each stage in the Implementation Plan contains:

**Stage header:** `## Stage N: [Name]`

**Naming stages:** Stage names should reflect the domain(s), objectives, and main deliverables of the stage. Choose clear, goal-oriented names that describe the key work being accomplished.

**Stage contents:**
- Tasks for the stage (see §6 Task Analysis Framework)
- Each task contains steps (see §7 Step Analysis Framework)
- Task dependencies within and across stages

## 6. Task Analysis Framework

The number and granularity of tasks and steps should be based on the actual size and complexity of the project, following the adaptation guidelines in §1.3. Always match task and step analysis to what is needed for this project, rather than applying fixed patterns.

### 6.1. Task Identification

Derive tasks from stage objectives by identifying distinct work units that advance the stage toward completion.

**Identification process:**
1. Review stage objective and required deliverables
2. Identify what work units are needed to produce those deliverables
3. Group related work that shares context, domain, and validation approach
4. Assess each potential task against granularity criteria (§6.2)

**Work unit characteristics:**
- **Meaningful deliverable:** Produces something concrete — functional code, configured system, documentation artifact, validated integration, research findings — not just "progress" or partial work
- **Domain coherence:** Belongs to a single Agent's domain; requires one consistent skill set or mental model throughout
- **Clear boundaries:** Has identifiable start conditions (dependencies satisfied, inputs available) and end conditions (validation criteria met)
- **Validation coverage:** Can be validated through defined criteria that meaningfully confirm the deliverable is complete and correct

### 6.2. Task Granularity Balance

Task granularity requires balancing two failure modes: **task packing** (too much in one task) and **over-decomposition** (too many tiny tasks). Neither extreme serves project execution well.

**Validation and iteration:** The validation criteria enable Worker Agents to iterate on failures. Programmatic and Artifact validation allow autonomous correction cycles. User validation provides natural checkpoints where human judgment guides iteration. Task scope should align with the validation approach, matching the iteration pattern to the work's requirements.

**Split indicators (task packing):**
- Multiple unrelated deliverables combined
- Work spans multiple Agent domains or skill sets
- Internal dependencies where later steps require earlier steps to be validated first
- Validation criteria cover unrelated concerns
- Complexity significantly exceeds peer tasks in the stage

**Combine indicators (over-decomposition):**
- Related work artificially separated into sequential micro-tasks
- Tasks that would require immediate handoff to the same Agent
- Splitting creates coordination overhead without reducing complexity
- Individual "tasks" are single trivial actions rather than meaningful work
- Validation could reasonably cover the combined scope

**Granularity decision framework:**
- Does the proposed scope produce a meaningful, verifiable deliverable?
- Does the validation approach match the work's actual iteration needs?
- Would splitting reduce complexity, or just add coordination overhead?
- Would combining obscure distinct deliverables, or reflect natural work grouping?

### 6.3. Task Structure

Each task in the Implementation Plan contains:

**Task Header:** `### Task <N.M>: <Title> - <Domain> Agent`

**Task Contents:**
```
* **Objective:** Single-sentence task goal — what this task accomplishes.
* **Output:** Concrete deliverables — files, components, artifacts functionality produced.
* **Validation:** Binary pass/fail criteria using types defined in §3.3. Most tasks combine multiple types.
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

## 7. Step Analysis Framework

The number and granularity of steps should be based on the actual size and complexity of the project, following the adaptation guidelines in §1.3. Always match step analysis to what is needed for this project rather than using fixed patterns. Steps organize work within a task and support failure tracing—they are not mini-tasks with independent validation.

### 7.1. Step Identification

Derive steps from task objectives by identifying the ordered sub-units of work needed to produce the task's deliverable.

**Identification process:**
1. Review task objective and required outputs
2. Identify distinct operations that advance toward the deliverable
3. Order operations by dependency, preference, or practical sequence
4. Assess each potential step against granularity criteria (§7.2)

**Step characteristics:**
- **Ordered:** Follow logical sequence (dependency, preference, or practicality)
- **Discrete:** Each step has a clear outcome that advances the task
- **Referenced:** Numbering allows specific step references in communication and failure tracing
- **Shared validation:** Steps contribute to the task's validation criteria, not their own independent validation

### 7.2. Step Granularity Balance

Step granularity requires balancing two concerns: **over-abstraction** (steps too vague to aid execution) and **micro-decomposition** (trivial actions that add noise without value).

**Validation role:** Steps support the Agent's ability to trace validation failures to specific work. When validation fails, concrete steps help identify which part of the task needs correction. Design steps with this traceability in mind.

**Split indicators (over-abstraction):**
- A step encompasses multiple distinct operations that could fail independently
- Failure tracing would be difficult because the step is too broad
- The step description is vague and doesn't guide execution
- Breaking down would improve the Agent's ability to organize work

**Combine indicators (micro-decomposition):**
- Individual steps are trivial actions that don't warrant separate tracking
- Steps have no meaningful failure modes distinct from adjacent steps
- The granularity adds noise without aiding organization or traceability
- Combined steps would still be concrete enough for failure tracing

**Granularity decision framework:**
- Would this step help trace a validation failure to specific work?
- Does the step represent a meaningful segment of execution?
- Would combining adjacent steps lose useful organizational clarity?
- Would splitting this step improve the Agent's ability to execute or debug?

### 7.3. Step Structure

Each step in a task contains:

**Step format:** Numbered instruction describing a discrete operation.

**Step contents:**
- Clear, specific instruction that an Agent can execute directly
- Optional action outcome if needed
- Optional relevant context where non-obvious
- References to patterns, files, or prior work when relevant

**Steps vs sub-tasks:** If a step requires its own validation before subsequent steps can proceed, it indicates task packing. The "step" is actually a separate task. Split accordingly.

### 7.4. Delegate Agent Steps

When investigation, exploration, research or generally context-heavy and isolated work is needed within a task, include a delegation step.

**Format:** "Delegate Agent: <purpose>"

**Delegation Usage Patterns and Skill References:**
- **Debug delegation:** For complex bugs that require isolated debugging focus. Include skill reference: {SKILL_PATH:delegate-debug}
- **Research delegation:** For knowledge gaps that require research to inform later steps. Include skill reference: {SKILL_PATH:delegate-research}
- **Refactor delegation:** For code restructuring or clean-up requiring an isolated refactoring scope. Include skill reference if a relevant skill exists.
- **Other delegation:** For any other context-heavy or investigation step not covered above, clearly describe the specific purpose and scope of the delegation step in the task.

**Note:** Always include the relevant delegation skill reference for debug and research steps as shown. For 'other' and 'refactor', add skill references if available and be explicit about the purpose.

## 8. Work Breakdown Protocol

**Progression Gates:** Each action must complete before proceeding to the next. No skipping or batching unless explicitly instructed by User.

**Deliberation Scaling:** Reasoning depth matches decision complexity. All decisions trace to Context Gathering inputs and framework criteria (§4-7). Use "User specified/requested during Context Gathering" attribution where applicable.

**Output Blocks:** This protocol uses **Reasoning Blocks** and **Summary Blocks** to present analysis in chat. Each analysis type (Domain Analysis, Stage Analysis, Task Analysis, etc.) follows the Reasoning Block format.

**Protocol Flow:**
- Standards Definition → Write to `{AGENTS_FILE}`
- Implementation Plan Header Initialization → Update Implementation Plan header (Project Name and Project Overview)
- Domain Analysis → Update Implementation Plan header (Agents field)
- Stage & Task Analysis → Identify ALL stages with objectives AND tasks, update Implementation Plan header (Stages field)
- Stage Cycles → Per stage: detailed task analysis for identified tasks, append to Implementation Plan body
- Plan Finalization → Workload review, dependency review
- User Approval → Review and iterate

### 8.1. Standards Definition

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

**Namespace block structure:**
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

### 8.2. Implementation Plan Header Initialization

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

### 8.3. Domain Analysis Protocol

**Action 1:** Present domain decisions in chat (applying §4.1-4.2):
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

### 8.4. Stage Analysis Protocol

Identify all stages and their tasks upfront. Detailed task analysis occurs in §8.5 Stage Cycles.

**Action 1:** Present stage structure with task identification in chat. For each stage (applying §5.1-5.2, §6.1-6.2):

```
**Stage Analysis:**
* **Stage [N]:** [Name]
- **Objective:** [stage goal]
- **Boundary:** [start condition] → [end milestone] because [workflow/dependency reasoning]
- **Tasks:**
  - **Task N.1:** [Name] - delivers [output] because [task necessity reasoning per §6.1-6.2]
  - **Task N.2:** [Name] - delivers [output] because [task necessity reasoning]
  - ...

**Note:** If a stage requires foundational research before other tasks can proceed, include a Delegate Agent Research task at position N.1. Only include research tasks when genuine uncertainty or knowledge gaps exist.
```

**Action 2:** Update Implementation Plan header:
- Fill **Stages** field with count and list

### 8.5. Stage Cycles Protocol

For each stage identified in §8.4, complete detailed task analysis for the tasks identified within that stage. Execute this cycle in stage order, completing all tasks for the current stage before proceeding to the next.

**Action 1:** State context integration for current stage:
```
**Stage Context:**
* **Stage [N]:** [Name]
* **Context Gathering Inputs:** User specified [requirements/constraints] that influence task execution
```

**Action 2:** Complete task analysis for each task identified in §8.4 for this stage:

```
**Task Analysis:**
* **Task [X.Y]:** [Name] (identified in §8.4)
- **Scope:** [goal] → [deliverables]
- **Context Input:** User specified [requirement] during Context Gathering / [relevant constraints]
- **Agent:** [Name] Agent because [domain fit] / User requested [agent preference]
- **Validation:** [Type(s) from §3.3] because [deliverable] requires [automated check / artifact verification / user judgment]. If User type: Agent pauses for review.
- **Dependencies:** Task [A.B] by [Agent] for [what's needed] | None
- **Steps** (§7.1-7.2):
  1. [Step] - [purpose if non-obvious]
  2. [Step]
  ...
- **Granularity Check:** [concrete for tracing / adjustment needed]

* **Task [X.Y]:** [Name] (identified in §8.4)
- ...
```

**Action 3:** Append stage to Implementation Plan body:
- Stage header: `## Stage N: [Name]`
- Task blocks following format from §6.3 Task Structure
- Single write operation per stage cycle

**Proceed to next stage from §8.4. Repeat Actions 1-3 until all stages documented.**

### 8.6. Plan Finalization

**Action 1 - Workload Assessment:** Count tasks per Agent. Flag Agents with 8+ tasks for subdivision review.

**Action 2 - Agent Subdivision (if needed):**
- Analyze overloaded Agent's tasks for sub-domain boundaries
- Create coherent sub-Agents using descriptive names following `[Name] Agent` convention (§4.3 Agent Assignment)
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

### 8.7. User Approval

**Action 1:** Direct User to review:
- `{AGENTS_FILE}` for universal standards
- Implementation Plan for task breakdown
- Chat history for reasoning trace

**Action 2:** Handle modification requests through targeted revisions. Iterate until explicit User approval.

## 9. Procedure Completion

After Work Breakdown is complete and the User approves both `{AGENTS_FILE}` and the Implementation Plan:

1. **Procedure Checkpoint**: The calling command (Planner Agent Initiation Prompt) handles the Checkpoint Block and Procedure Review Cycle
2. **Procedure Completion**: After User approval, the calling command outputs a **Completion Block**
3. **Progression Gate**: The agent must NOT proceed to the next phase until the Completion Block is output

The Work Breakdown procedure is complete when:
- `{AGENTS_FILE}` has been created/updated with project standards
- Implementation Plan has been populated with all stages and tasks
- Plan Finalization review (workload and dependencies) has been completed
- The Completion Block has been output by the calling command

## 10. Content Guidelines

### 10.1. Quality Standards

**Implementation Plan:**
- Each task understandable without external reference
- Specific language (avoid "implement properly" → specify the pattern to follow)
- All fields populated, no placeholders
- Consistent naming and terminology

**`{AGENTS_FILE}`:**
- Only genuinely universal standards
- Concrete and actionable (not "write good code")
- No duplication of existing project standards in the file; reference instead

### 10.2. Common Mistakes

- **Task packing:** Multiple deliverables in one task → Split with dependencies
- **Over-decomposition:** Excessive tiny tasks → Tasks should be meaningful work units
- **Vague validation:** "Works correctly" → Specify what "correctly" means
- **Missing dependencies:** Tasks requiring prior work unmarked → Trace prerequisites

---

**End of Skill**
