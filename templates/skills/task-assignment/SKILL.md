---
name: task-assignment
description: Construction and delivery of Task Assignment Prompts to Worker Agents. Defines the Task Assignment procedure for the Manager Agent.
---

# APM {VERSION} - Task Assignment Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent constructs Task Assignment Prompts for Worker Agents. Task Assignments are self-contained prompts that provide Workers with everything needed to execute a task—Workers do not read coordination artifacts directly.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for constructing Task Assignment Prompts. See §3 Task Assignment Procedure.

**Use Problem Space for reasoning.** When determining dependency scope, extracting context, or deciding what to include, consult the relevant reasoning subsection. See §2 Problem Space.

**Use Policies for decisions.** When encountering branch points (dependency depth, specification relevance, delegation handling), apply the relevant policy. See §4 Policies.

**Output only structured blocks.** Task Assignment Prompts follow the format defined in Structural Specifications. See §5 Structural Specifications.

### 1.2 Objectives

- Construct self-contained Task Assignment Prompts that enable Worker execution without access to coordination artifacts
- Analyze task dependencies and provide appropriate context based on producer-consumer relationships
- Extract and include relevant specification content for task execution
- Maintain context scoping boundaries that keep Workers focused on their assigned task

### 1.3 Outputs

**Task Assignment Prompt:** Markdown code block containing all context a Worker Agent needs to execute a task. Delivered to User for copy-paste to Worker Agent session.

**Follow-up Assignment Prompt:** Variant of Task Assignment Prompt issued when a Worker needs to retry or refine work on the same task after Manager review.

### 1.4 Context Scoping Principle

Workers operate with narrow but deep context. They receive only:
- Their Task Assignment Prompt
- Their accumulated working context from previous assignments (same Worker)
- Universal standards from `{AGENTS_FILE}` (always-apply rules in their session)

Workers do NOT have access to:
- `Implementation_Plan.md`
- `Specifications.md`
- `Memory_Root.md`
- Other Workers' Memory Logs (unless instructed in their assignment)

**The Task Assignment IS the Worker's entire operational context for the task.** Manager must include everything the Worker needs.

---

## 2. Problem Space

This section establishes the reasoning approach for Task Assignment construction. It guides how to analyze dependencies, determine context scope, and extract relevant information.

### 2.1 Dependency Reasoning

Tasks may depend on outputs from previous tasks. Dependencies affect how the Manager constructs context in the Task Assignment.

**Dependency Types:**

*Same-Agent Dependency:*
When the current Worker previously completed the producer task, they have working familiarity with the outputs. Context can be lighter—reference previous work and key artifacts.

*Cross-Agent Dependency:*
When a different Worker completed the producer task, the current Worker has zero familiarity. Context must be comprehensive—include file reading instructions, output summaries, and integration guidance.

**Dependency Identification:**

Check the task's Dependencies field in the Implementation Plan:
- Format: `Task N.M by <Domain> Agent`
- Cross-agent dependencies are bolded in the Plan (per `{SKILL_PATH:work-breakdown/SKILL.md}` §3.7)
- "None" indicates no dependencies

**Dependency Chain Reasoning:**

Tasks may have dependencies that themselves have dependencies. Trace the chain upstream:
```
Task 3.2 (current - Consumer)
  └─ depends on Task 2.4 (Producer A)
       └─ depends on Task 2.1 (Producer B)
            └─ depends on Task 1.3 (Producer C)
```

Not all ancestors are relevant to the current task. An intermediate node may fully abstract what came before it—acting as an abstraction boundary.

*Relevance Assessment:*
- Does the ancestor's output directly affect how the current task should be executed?
- Did the ancestor establish patterns, schemas, or contracts the current task must follow?
- Is the ancestor's context already fully captured in the immediate producer's output?

*Chain Tracing Approach:*
1. Start with direct dependencies (immediate producers)
2. For each producer, check if its dependencies are relevant to the current task
3. Stop tracing a branch when an upstream node is not relevant
4. Include all relevant nodes in the dependency context

See §4.1 Dependency Inclusion Policy for decision rules.

### 2.2 Specification Extraction Reasoning

`Specifications.md` contains design decisions and constraints that inform task execution. Workers don't read this file—Manager extracts relevant content and includes it in the Task Assignment.

**Relevance Assessment:**

When reviewing Specifications for a task, consider:
- Does this specification directly constrain how the task should be implemented?
- Does the task's objective reference design decisions documented in Specifications?
- Would the Worker make incorrect assumptions without this specification?

**Extraction Scope:**

Include specification content that:
- Defines interfaces, schemas, or contracts the task must implement or consume
- Establishes constraints on approach, technology, or patterns for this task
- Clarifies design decisions that affect the task's deliverables

Exclude specification content that:
- Relates to other domains or stages
- Provides background context without actionable constraints
- Is already captured in the task's Guidance field

### 2.3 Follow-up Assignment Reasoning

Follow-up assignments occur when Manager review (per `{SKILL_PATH:memory-maintenance/SKILL.md}` §4.2) determines the Worker should retry or refine work on the same task.

**Follow-up Context:**

The follow-up assignment must provide:
- What issue the previous attempt encountered
- What specific refinement or correction is needed
- Any additional guidance based on Manager's investigation

**Log Path Continuity:**

Follow-up assignments use the same `memory_log_path` as the original assignment. The Worker's new log overwrites the previous one—the Memory System captures final outcomes, not iteration history. Manager captures iteration patterns in Stage Summaries when relevant.

---

## 3. Task Assignment Procedure

This section defines the sequential actions for constructing Task Assignment Prompts. Execute this procedure when issuing a new task or follow-up assignment.

**Output Blocks:** Task Assignment Prompts use the **Task Assignment Prompt Format**. Follow-up assignments use the same format with follow-up context added. See §5 Structural Specifications.

**Procedure:**
1. Dependency Analysis
2. Context Extraction
3. Prompt Construction

For follow-up assignments, see §3.4 Follow-up Assignment.

### 3.1 Dependency Analysis

Analyze the task's dependencies to determine what context the Worker needs.

* **Action 1:** Read the task's Dependencies field from the Implementation Plan:
  - If "None": Skip to §3.2 Context Extraction with `has_dependencies: false`
  - If dependencies listed: Continue to Action 2

* **Action 2:** For each dependency, determine the dependency type:
  - Check if producer task was assigned to the same Worker Agent (same-agent) or different Worker Agent (cross-agent)
  - Cross-agent dependencies are bolded in the Plan

* **Action 3:** For cross-agent dependencies, trace the dependency chain:
  - Read the producer task's Dependencies field
  - Assess relevance of each upstream dependency per §2.1 Dependency Chain Reasoning
  - Continue tracing until reaching non-relevant nodes or chain end
  - Record all relevant nodes for context extraction

* **Action 4:** For each relevant dependency (direct and upstream):
  - Read the producer's Task Memory Log at `.apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md`
  - Note key outputs, file paths, and integration-relevant details

### 3.2 Context Extraction

Extract context from coordination artifacts that the Worker needs but cannot access.

* **Action 1:** Extract relevant specification content:
  - Review `Specifications.md` for content relevant to this task
  - Apply §2.2 Specification Extraction Reasoning to determine relevance
  - Copy relevant specification content for inclusion in prompt

* **Action 2:** Prepare dependency context based on dependency type:

  *For same-agent dependencies:*
  - Prepare contextual reference to previous work
  - Include key file paths and outputs to recall
  - Detail level varies based on complexity and time gap

  *For cross-agent dependencies:*
  - Prepare comprehensive integration context per §5.4 Cross-Agent Dependency Context Format
  - Include file reading instructions, output summaries, and integration requirements
  - Include all relevant upstream dependencies identified in §3.1

* **Action 3:** Check for delegation steps in the task:
  - Scan task steps for "Delegate Agent:" entries
  - If present, note delegation type (Debug, Research, etc.) and prepare skill reference

### 3.3 Prompt Construction

Assemble the Task Assignment Prompt using extracted context.

* **Action 1:** Construct YAML frontmatter:
  - `stage`: Stage number
  - `task`: Task number within stage
  - `agent_id`: Worker Agent identifier (lowercase, hyphenated)
  - `memory_log_path`: Full path per `{SKILL_PATH:memory-maintenance/SKILL.md}` §3.2
  - `has_dependencies`: Boolean indicating dependency context present
  - `has_delegation_steps`: Boolean indicating delegation steps present

* **Action 2:** Construct prompt body following §5.1 Task Assignment Prompt Format:
  - Task Reference section with task ID and agent
  - Context from Dependencies section (if `has_dependencies: true`)
  - Specifications section (if relevant specifications extracted)
  - Objective from Implementation Plan
  - Detailed Instructions from Implementation Plan steps and Guidance
  - Expected Output from Implementation Plan Output and Validation fields
  - Memory Logging instructions with path
  - Reporting Protocol reference
  - Delegation section (if `has_delegation_steps: true`)

* **Action 3:** Output the complete prompt as a markdown code block for User copy-paste.

### 3.4 Follow-up Assignment

When `{SKILL_PATH:memory-maintenance/SKILL.md}` §4.2 Coordination Response Policy indicates a follow-up assignment to the same Worker:

* **Action 1:** Identify the issue from Task Memory Log review:
  - What specifically needs refinement or correction?
  - What guidance will help the Worker succeed?

* **Action 2:** Construct follow-up prompt using the same format as §3.3, with additions:
  - Same `memory_log_path` as original assignment (Worker overwrites)
  - Add Follow-up Context section after Task Reference explaining the issue and required refinement
  - Include any additional guidance from Manager's investigation

* **Action 3:** Output as markdown code block for User copy-paste.

---

## 4. Policies

This section defines the decision rules that govern choices during Task Assignment construction.

### 4.1 Dependency Inclusion Policy

**Decision Domain:** What dependencies to include and how deep to trace chains.

**Always Include:**
- All direct dependencies (immediate producers listed in Dependencies field)
- Cross-agent dependencies require comprehensive context regardless of complexity

**Chain Tracing Rules:**
- Trace upstream from each direct dependency
- Stop tracing a branch when upstream node is not relevant to current task
- Non-relevant node acts as abstraction boundary—assume it captured what came before

**Relevance Criteria:**
- Relevant: Upstream output directly affects current task execution (schemas, contracts, patterns)
- Not relevant: Upstream output fully consumed/transformed by intermediate node

**Manager Override:**
If Manager has specific reason to believe an ancestor is relevant despite intermediate being non-relevant, include it. Document reasoning in dependency context.

**Same-Agent vs Cross-Agent:**

| Dependency Type | Context Depth | Rationale |
|-----------------|---------------|-----------|
| Same-agent | Light contextual reference | Worker has working familiarity |
| Cross-agent | Comprehensive integration context | Worker has zero familiarity |

### 4.2 Specification Inclusion Policy

**Decision Domain:** What specification content to include in Task Assignment.

**Include When:**
- Specification directly constrains task implementation approach
- Task objective references design decisions in Specifications
- Worker would make incorrect assumptions without this content
- Specification defines interfaces or contracts task must implement

**Exclude When:**
- Specification relates to other domains or stages
- Content already captured in task's Guidance field
- Specification provides background without actionable constraints

**Extraction Approach:**
- Copy relevant content directly into Task Assignment
- Do not reference `Specifications.md` by path—Worker cannot access it
- Preserve specificity—include exact constraints, not summaries

### 4.3 Delegation Step Handling Policy

**Decision Domain:** How to handle tasks containing delegation steps.

**Identification:**
- Task steps containing "Delegate Agent:" indicate delegation requirements
- Implementation Plan may include skill references for delegation type

**Inclusion Requirements:**
- Set `has_delegation_steps: true` in YAML frontmatter
- Include Delegation section in prompt body
- Reference appropriate delegation skill:
  - Debug: `{SKILL_PATH:delegate-debug/SKILL.md}`
  - Research: `{SKILL_PATH:delegate-research/SKILL.md}`
  - Other: Note delegation purpose; reference skill if available

**Worker Responsibility:**
Worker creates Delegation Prompt per referenced skill when reaching delegation step. User facilitates Delegate Agent session. Worker integrates findings and logs delegation in Task Memory Log.

---

## 5. Structural Specifications

This section defines the output formats for Task Assignment Prompts.

### 5.1 Task Assignment Prompt Format
```markdown
---
stage: <N>
task: <M>
agent_id: <domain>-agent
memory_log_path: ".apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md"
has_dependencies: true | false
has_delegation_steps: true | false
---

# APM Task Assignment: <Task Title>

## Task Reference
**Task <N>.<M>: <Title>** assigned to **<Domain> Agent**

## Context from Dependencies
[Only include if has_dependencies: true]
[Content per §5.3 or §5.4 based on dependency type]

## Specifications
[Only include if relevant specifications extracted]
[Extracted specification content relevant to this task]

## Objective
[Single-sentence task goal from Implementation Plan Objective field]

## Detailed Instructions
[Transform Implementation Plan steps into actionable instructions]
[Include relevant content from Guidance field]
[Specify: what to do, how to approach, where to implement, constraints]

1. [Instruction]
2. [Instruction]
...

## Expected Output
**Deliverables:** [From Implementation Plan Output field]

**Validation Criteria:**
- Programmatic: [Automated checks if applicable]
- Artifact: [File/output verification if applicable]
- User: [Human review if applicable - indicates pause for review]

## Memory Logging
Upon completion, log your work to: `<memory_log_path>`
Follow `{SKILL_PATH:memory-logging/SKILL.md}` §3.1 Task Memory Log Procedure.

## Reporting Protocol
After logging, output a **Task Report** for User to return to Manager Agent.

## Delegation
[Only include if has_delegation_steps: true]
This task includes delegation step(s). When you reach a delegation step:
- **Type:** <Debug|Research|Other>
- **Skill Reference:** `{SKILL_PATH:delegate-<type>/SKILL.md}`
- Create Delegation Prompt per the skill and coordinate with User
- Integrate findings and log delegation in your Task Memory Log
```

### 5.2 Follow-up Assignment Prompt Format

Same structure as §5.1, with addition after Task Reference:
```markdown
## Follow-up Context
**Previous Issue:** [What issue the previous attempt encountered]
**Required Refinement:** [Specific correction or improvement needed]
**Additional Guidance:** [Any new guidance from Manager investigation]

Note: This is a follow-up assignment. Your new log will replace the previous attempt at the same path.
```

### 5.3 Same-Agent Dependency Context Format

For dependencies where current Worker completed the producer task:
```markdown
## Context from Dependencies
Building on your previous work:

**From Task <N.M> (<Title>):**
- Key outputs: [File paths and artifacts to use]
- [Additional recall points based on complexity]

**Integration Approach:**
[Brief guidance on how to build on previous work]
```

**Guidelines:**
- Reference previous work without repeating detailed instructions
- Include specific file paths for outputs to use or extend
- Detail level increases with dependency complexity and time gap between tasks

### 5.4 Cross-Agent Dependency Context Format

For dependencies where different Worker completed the producer task:
```markdown
## Context from Dependencies
This task depends on work completed by <Producer Agent>:

**Integration Steps (complete before main task work):**
1. Read [specific file] at `[path]` to understand [aspect]
2. Review [implementation files] at `[paths]` to understand [patterns/structures]
3. [Additional integration steps as needed]

**Producer Output Summary:**
- **[Key feature/component]:** [Description of what was built]
- **[Important files]:** [Locations and purposes]
- **[Interfaces/contracts]:** [Data formats, APIs, schemas]
- **[Constraints]:** [Important limitations or requirements]

**Integration Requirements:**
- [Specific requirement for how to integrate]
- [Usage patterns to follow]
- [Constraints to observe]

[If upstream dependencies are also relevant:]
**Upstream Context:**
This work also builds on Task <X.Y> by <Agent>:
- [Key outputs and relevance to current task]
```

**Guidelines:**
- Always comprehensive—assume Worker has zero familiarity
- Include explicit file paths and what to look for
- Document all relevant interfaces and contracts
- Include upstream dependencies when relevant per §4.1

---

## 6. Content Guidelines

### 6.1 Prompt Quality Standards

- **Self-contained:** Worker should never need to ask "where do I find X?"
- **Specific:** Avoid vague instructions; specify files, patterns, constraints
- **Actionable:** Every instruction should be directly executable
- **Scoped:** Include only what's relevant to this task; avoid information overload

### 6.2 Dependency Context Quality

**Same-Agent:**
- Reference previous work concisely
- Assume working familiarity, provide recall anchors
- Include file paths for concrete reference

**Cross-Agent:**
- Assume zero familiarity—explain everything needed
- Explicit file reading instructions before main work
- Complete output summaries with integration guidance

### 6.3 Common Mistakes to Avoid

- **Referencing inaccessible artifacts:** Never tell Worker to "see Specifications.md" or "check Implementation Plan"—they can't access these
- **Under-scoped cross-agent context:** Cross-agent dependencies require comprehensive context regardless of perceived simplicity
- **Missing dependency chain:** Failing to trace upstream when ancestors are relevant
- **Vague instructions:** "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success"
- **Forgetting delegation references:** Tasks with delegation steps need skill references for Worker to create proper Delegation Prompts

---

**End of Skill**