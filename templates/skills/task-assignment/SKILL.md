---
name: task-assignment
description: Construction and delivery of Task Assignment Prompts to Worker Agents. Defines the Task Assignment Procedure for the Manager Agent.
---

# APM {VERSION} - Task Assignment Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent constructs Task Assignment Prompts for Worker Agents. Task Assignments are self-contained prompts that provide Workers with everything needed to execute a Task.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for constructing Task Assignment Prompts. See §3 Task Assignment Procedure.

**Use Operational Standards for reasoning and decisions.** When determining Context Dependency scope, extracting Specification content, reasoning about FollowUp Assignments, or handling Delegation steps, consult the relevant standards subsection. See §2 Operational Standards.

**Follow Structural Specifications.** Task Assignment Prompts follow the format guidance defined in Structural Specifications. See §4 Structural Specifications.

### 1.2 Objectives

- Construct self-contained Task Assignment Prompts that enable Worker execution without access to Coordination Artifacts
- Analyze Task Context Dependencies and provide appropriate context based on producer-consumer relationships
- Account for Worker Handoff state when classifying Context Dependencies
- Extract and include relevant Specification content for Task Execution
- Maintain context scoping boundaries that keep Workers focused on their assigned Task

### 1.3 Outputs

**Task Assignment Prompt:** Markdown code block containing all context a Worker Agent needs to execute a Task. Delivered to User for copy-paste to Worker Agent session.

**FollowUp Task Assignment Prompt:** Task Assignment Prompt with DIFFERENT content than the previous failed attempt, issued when Coordination Decision (per `{SKILL_PATH:memory-maintenance}` §3.5 Coordination Decision) determines "FollowUp needed." Content (Objective, Instructions, Output, Validation) is refined based on what went wrong and what correction is needed, guided by a FollowUp Context section explaining the issue.

### 1.4 Context Scoping Principle

Workers operate with narrow but detailed context. They receive only:
- Their Task Assignment Prompt
- Their accumulated working context from previous Task Assignments and their outputs (of the same Worker instance)
- Universal Standards from `{AGENTS_FILE}` (always-apply rules in their session)

Workers do NOT have access to:
- `Implementation_Plan.md`
- `Specifications.md`
- `Memory_Root.md`
- Other Workers' Task Memory Logs (unless explicitly requested to read them)

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Task Assignment creation. It guides how to analyze Context Dependencies, determine Context Scope, extract relevant information from Coordination Artifacts, and handle Delegation steps.

### 2.1 Context Dependency Standards

Tasks may depend on outputs from previous Tasks. Context Dependencies affect how the Manager constructs context in the Task Assignment.

**Context Dependency Types and Depth Rules:**

*Same-Agent Context Dependency:* When the current Worker previously completed the producer Task, they have working familiarity with the outputs.
- **Depth Rule:** Light contextual reference—recall anchors, key artifacts, file paths
- Reference previous work without repeating detailed instructions
- Detail level increases with dependency complexity between Tasks

*Cross-Agent Context Dependency:* When a different Worker completed the producer Task, the current Worker has zero familiarity.
- **Depth Rule:** Comprehensive integration context—file reading instructions, output summaries, integration guidance
- Assume zero familiarity—explain everything needed
- Explicit file reading instructions before main work
- Complete output summaries with integration guidance

*Handoff Context Dependency:* When the Manager has detected that the target Worker performed a Handoff (per `{SKILL_PATH:memory-maintenance}` §2.3 Handoff Detection Standards), the Continuing Worker Agent only has current Stage Memory Logs loaded. This affects classification:
- Same-Agent Context Dependencies from the **current Stage** → Treat as Same-Agent (Continuing Worker has received working context)
- Same-Agent Context Dependencies from **previous Stages** → Treat as Cross-Agent (Continuing Worker lacks working context)

**Context Dependency Identification:**

Check the Task's Dependencies field in the Implementation Plan:
- Format: `Task N.M by <Domain> Agent`
- Cross-Agent Context Dependencies are with **bold font** in the Implementation Plan
- "None" indicates no dependencies

**Context Dependency Chain Reasoning:**

Tasks may have dependencies that themselves have dependencies. Not all ancestors are relevant to the current Task. An intermediate node may fully abstract what came before it. Trace the chain upstream; for example:
```
Task 3.2 (current - Consumer)
  └─ depends on Task 2.4 (Producer A)
       └─ depends on Task 2.1 (Producer B)
            └─ depends on Task 1.3 (Producer C)
```

*Relevance Assessment:*
- Does the ancestor's output directly affect how the current Task should be executed?
- Did the ancestor establish patterns, schemas, or contracts the current Task must follow?
- Is the ancestor's context already fully captured in the immediate producer's output?

**Default:** When uncertain about inclusion, include rather than risk missing critical information.

### 2.2 Specification Extraction Standards

`Specifications.md` contains design decisions and constraints that inform Task Execution or Validation. Workers only receive Task Assignments — the Manager extracts relevant Specification content and contextually integrates it into the Task Assignment to inform Worker decisions.

**Relevance Assessment:**

When reviewing Specifications for a Task, consider:
- Does this Specification directly constrain how the Task should be implemented?
- Does the Task's objective reference design decisions documented in Specifications?
- Would the Worker make incorrect assumptions without this Specification's context?

**Decision Rules for Inclusion:**

*Include Specification content that:*
- Defines interfaces, schemas, or contracts the Task must implement or consume
- Establishes constraints on approach, technology, or patterns for this Task
- Clarifies design decisions that affect the Task's deliverables

*Exclude Specification content that:*
- Relates to other domains or Stages
- Provides background context without actionable requirements or constraints
- Is already captured in the Task's Guidance field in the Implementation Plan

**Default:** Never reference `Specifications.md` by path—Workers only receive Task Assignments. Preserve specificity with exact constraints, not summaries.

### 2.3 FollowUp Assignment Standards

FollowUp Task Assignments occur when Coordination Decision (per `{SKILL_PATH:memory-maintenance}` §3.5 Coordination Decision) determines "FollowUp needed" after investigation.

**Entry Point:**

The Manager arrives at FollowUp Assignment with:
- The original Task Memory Log findings
- Investigation results (from self-investigation or Delegation)
- Understanding of what went wrong and what refinement is needed
- Potentially, Coordination Artifact modifications that were made

**FollowUp Content Principle:** The FollowUp Task Assignment is a NEW Task Assignment with DIFFERENT content than the previous attempt. Objective, Instructions, Output, and Validation must be refined based on what went wrong. See §3.5 FollowUp Task Assignment Prompt Creation.

**Log Path Continuity:**

FollowUp Task Assignments use the same `memory_log_path` as the original Task Assignment. The Worker's new Task Memory Log overwrites the previous one. The Manager captures iteration patterns in Stage Summaries when relevant.

### 2.4 Delegation Step Standards

Tasks may contain Delegation steps that require Worker to delegate part of the work.

**Identification:**
- Task steps containing "Delegate Agent:" indicate Delegation requirements
- Implementation Plan may include skill references for Delegation type

**Delegation Skill References:**
- Debug: `{SKILL_PATH:delegate-debug}`
- Research: `{SKILL_PATH:delegate-research}`
- Other: Note Delegation purpose; reference skill if available

See §3.4 Task Assignment Prompt Creation.

---

## 3. Task Assignment Procedure

This section defines the sequential actions for constructing Task Assignment Prompts. Execute this procedure when issuing a new Task Assignment Prompt or a FollowUp Task Assignment Prompt.

**Procedure:**
1. Context Dependency Analysis
2. Specification Extraction
3. Implementation Plan Context Extraction
4. Task Assignment Prompt Creation

For FollowUp Task Assignments, see §3.5 FollowUp Task Assignment Prompt Creation.

### 3.1 Context Dependency Analysis

Analyze the Task's Context Dependencies to determine what context the Worker needs. For dependency type definitions and decision rules, see §2.1 Context Dependency Standards.

Perform the following actions:

1. Read the Task's Dependencies field from the Implementation Plan:
   - If "None": Skip to §3.2 Specification Context Extraction with `has_dependencies: false`
   - If dependencies listed: Continue to step 2
2. Check tracked Handoff state for the target Worker (has this Worker performed a Handoff? From which Stage?)
3. Classify each dependency as Same-Agent, Cross-Agent, or Handoff per §2.1
4. For Cross-Agent/Handoff dependencies, trace the chain upstream:
   - Start with direct dependencies (immediate producers)
   - For each producer, check if its dependencies are relevant to the current Task
   - Stop tracing a branch when an upstream node is not relevant
   - Include all relevant nodes in the Context Dependency context
5. For each relevant dependency, read the producer's Task Memory Log and note key outputs, file paths, and integration details

### 3.2 Specification Context Extraction

Extract context from Specifications that the Worker needs but cannot access.

Perform the following actions:

1. Review `Specifications.md` for content relevant to this Task:
   - Apply §2.2 Specification Extraction Standards to determine relevance
2. Contextually integrate relevant content into the Task Assignment—do not reference Specifications.md by path
3. Preserve specificity with exact constraints, not summaries
4. Note relevant Specification content for inclusion in prompt

### 3.3 Implementation Plan Context Extraction

Extract content from the Implementation Plan Task definition that the Worker needs for execution. Optionally enhance extracted content with Manager's coordination-level resolution context where relevant.

Perform the following actions:

1. Extract Task Objective:
   - Read the Task's Objective field from the Implementation Plan
   - Note the single-sentence task goal for inclusion in prompt
2. Extract Task Steps and Guidance:
   - Read the Task's numbered steps from the Implementation Plan
   - Read the Task's Guidance field (if present)
   - Transform steps into actionable Detailed Instructions, incorporating Guidance or Specification context where relevant
   - Note any Delegation steps (format: "Delegate Agent: <purpose>"); identify Delegation type (Debug, Research, etc.) and prepare skill reference
3. Extract Task Output and Validation:
   - Read the Task's Output field for deliverables
   - Read the Task's Validation field for validation criteria and types
   - Note these for Expected Output and Validation sections construction

### 3.4 Task Assignment Prompt Creation

Assemble the Task Assignment Prompt using extracted context from the Implementation Plan and the Specifications.

Perform the following actions:

1. Construct YAML frontmatter:
   - `stage`: Stage number
   - `task`: Task number within Stage
   - `agent_id`: Worker Agent identifier (lowercase, hyphenated)
   - `memory_log_path`: Full path following convention `.apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md`
   - `has_dependencies`: Boolean indicating Context Dependency context present
   - `has_delegation_steps`: Boolean indicating Delegation steps present (set to `true` if Task contains Delegation steps)
2. Construct prompt body following §4.1 Task Assignment Prompt Format:
   - Task Reference section with Task ID and Agent
   - Context from Dependencies section (if `has_dependencies: true`) using appropriate format based on Context Dependency type
   - Objective from Implementation Plan (optionally enhanced with coordination-level resolution context)
   - Detailed Instructions integrating Implementation Plan steps, Guidance content, and relevant Specification content contextually where they inform decisions (optionally enhanced with coordination-level resolution context)
   - Expected Output from Implementation Plan Output field (optionally enhanced with coordination-level resolution context)
   - Validation Criteria from Implementation Plan Validation field (optionally enhanced with coordination-level resolution context)
   - Memory Logging instructions with path
   - Reporting Protocol reference
   - Delegation section (if `has_delegation_steps: true`): Include Delegation section in prompt body; Worker creates Delegation Prompt per referenced skill when reaching Delegation step; User facilitates Delegate Agent session; Worker integrates findings and logs Delegation in Task Memory Log
3. Output the complete prompt **as a markdown code block** for User copy-paste.
   - **Critical:** Ensure the prompt content contains NO embedded ``` code blocks, as this would break the outer code block boundaries and fragment the prompt. Use indented code blocks (4 spaces) or inline code formatting for code examples instead.
4. Immediately after outputting the Task Assignment Prompt code block, provide User guidance:
   ```
   Copy this Task Assignment Prompt and paste it to the [Agent's Name] input. After [Agent's Name] logs to Memory, return here with their Task Report.
   ```

### 3.5 FollowUp Task Assignment Prompt Creation

Execute when Coordination Decision (per `{SKILL_PATH:memory-maintenance}` §3.5 Coordination Decision) determines "FollowUp needed."

FollowUp Task Assignments are NEW Task Assignments with DIFFERENT content than the previous failed attempt. Do not copy the previous prompt—refine all content sections based on what went wrong.

Perform the following actions:

1. Capture the FollowUp context from Coordination Decision:
   - What issue did the previous attempt encounter?
   - What did investigation (self or delegated) reveal?
   - What specific refinement or correction is needed?
   - Were any Coordination Artifacts modified that affect this Task?
2. Extract and integrate relevant content from modified Coordination Artifacts (if any):
   - If Specifications.md was modified: Extract relevant Specification content per §3.2 Specification Context Extraction
   - If Implementation_Plan.md was modified: Extract relevant Task content per §3.3 Implementation Plan Context Extraction
   - Contextually integrate extracted content into the Task Assignment to inform Worker decisions (Workers only receive Task Assignments; artifact changes are brought into the task context when relevant)
3. Refine Task Assignment content using Manager's coordination-level resolution:
   - Refine Objective based on what went wrong and what correction is needed
   - Refine Detailed Instructions to guide Worker toward successful completion
   - Refine Expected Output if deliverables need adjustment
   - Refine Validation Criteria based on failure patterns or new requirements or constraints
   - Include a FollowUp Context section explaining what issue the previous attempt encountered, what specific refinement or correction is needed, and any additional guidance based on Manager's investigation
4. Construct FollowUp prompt using the same format as §3.4 Task Assignment Prompt Creation, with modifications:
   - Use title "APM FollowUp Task Assignment: <Task Title>" instead of "APM Task Assignment"
   - Same `memory_log_path` as original Task Assignment (Worker overwrites previous log)
   - Add FollowUp Context section after Task Reference explaining the issue and required refinement
   - Include refined Objective, Instructions, Output, and Validation (not the original content)
   - Contextually integrate extracted content from modified Coordination Artifacts in appropriate sections
5. Output **as a markdown code block** for User copy-paste.
   - **Critical:** Ensure the prompt content contains NO embedded ``` code blocks, as this would break the outer code block boundaries and fragment the prompt. Use indented code blocks (4 spaces) or inline code formatting for code examples instead.
6. Immediately after outputting the FollowUp Task Assignment Prompt code block, provide User guidance:
   ```
   Copy this FollowUp Task Assignment Prompt and paste it to the [Agent's Name] input. After [Agent's Name] logs to Memory, return here with their Task Report.
   ```

---

## 4. Structural Specifications

This section defines the format guidance for Task Assignment Prompts.

### 4.1 Task Assignment Prompt Format

Task Assignment Prompts are markdown files that follow this general structure. Adapt based on Task needs - not all sections are required for every Task.

**Critical Format Constraint:** Task Assignment Prompts are delivered as markdown code blocks for User copy-paste. **MUST NOT contain embedded ``` code blocks** inside the prompt content, as this would break the outer code block boundaries and fragment the prompt. When code examples, file paths, or formatted content are needed, use indented code blocks (4 spaces) or inline code formatting instead.

**YAML Frontmatter Structure:**
```yaml
---
stage: <N>
task: <M>
agent_id: <domain>-agent
memory_log_path: ".apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md"
has_dependencies: true | false
has_delegation_steps: true | false
---
```

**Prompt Body Structure:**
```markdown
# APM Task Assignment: <Task Title>

## Task Reference
**Task <N>.<M>: <Title>** assigned to **<Domain> Agent**

## Context from Dependencies
[Include only if has_dependencies: true]
[Use Same-Agent or Cross-Agent format based on Context Dependency type]

## Objective
[Single-sentence Task goal from Implementation Plan Objective field, optionally enhanced with coordination-level resolution context]

## Detailed Instructions
[Transform Implementation Plan steps into actionable instructions]
[Contextually integrate relevant Specification content and Guidance field content where they inform specific decisions, requirements or constrain approach]
[Optionally enhance with coordination-level resolution context]
[Specify: what to do, how to approach, where to implement, constraints]

## Expected Output
**Deliverables:** [From Implementation Plan Output field, optionally enhanced with coordination-level resolution context]

## Validation Criteria
[From Implementation Plan Validation field, optionally enhanced with coordination-level resolution context]
[Indicate Validation Type: Programmatic, Artifact, or User]
[Provide actionable instructions to validate task execution and outputs — directly executable criteria enabling Worker to verify work meets requirements]

## Memory Logging
Upon completion, log your work to: `<memory_log_path>`
Follow `{SKILL_PATH:memory-logging}` §3.1 Task Memory Log Procedure.

## Task Report
After logging, output a **Task Report** for User to return to Manager Agent.

## Delegation
[Include only if has_delegation_steps: true]
This Task includes Delegation step(s). When you reach a Delegation step:
- **Type:** <Debug|Research|Other>
- **Skill Reference:** `{SKILL_PATH:delegate-<type>}`
- Create Delegation Prompt per the skill and coordinate with User
- Integrate findings and log Delegation in your Task Memory Log
```

**Context from Dependencies - Same-Agent Format:**

When the Worker previously completed the producer Task (same instance):
```markdown
## Context from Dependencies
Building on your previous work:

**From Task <N.M> (<Title>):**
- Key outputs: [File paths and artifacts to use]
- [Additional recall points based on complexity]

**Integration Approach:**
[Brief guidance on how to build on previous work]
```
- Reference previous work without repeating detailed instructions
- Include specific file paths for outputs to use or extend
- Detail level increases with dependency complexity between Tasks

**Context from Dependencies - Cross-Agent Format:**

When a different Worker completed the producer Task, or when Handoff:
```markdown
## Context from Dependencies
This Task depends on work completed by <Producer Agent>:

**Integration Steps (complete before main Task work):**
1. Read [specific file] at `[path]` to understand [aspect]
2. Review [implementation files] at `[paths]` to understand [patterns/structures]
3. [Additional integration steps as needed]

**Integration Requirements:**
- [Specific requirement for how to integrate]
- [Usage patterns to follow]
- [Constraints to observe]

**Producer Output Summary:**
- **[Key feature/component]:** [Description of what was built]
- **[Important files]:** [Locations and purposes]
- **[Interfaces/contracts]:** [Data formats, APIs, schemas]
- **[Constraints]:** [Important limitations or requirements]

[If upstream dependencies are also relevant:]
**Upstream Context:**
This work also builds on Task <X.Y> by <Agent>:
- [Key outputs and relevance to current Task]
```
— Assume Worker has zero familiarity
- Always comprehensive but don't duplicate existing content
- Include explicit file paths and what to look for
- Document all relevant interfaces and contracts
- Include upstream dependencies when relevant per §2.1 Context Dependency Standards

### 4.2 FollowUp Assignment Format

FollowUp Task Assignment Prompts are NEW Task Assignments with DIFFERENT content than the previous failed attempt. They use the same structure as §4.1 Task Assignment Prompt Format, with these modifications:

**Title:** `APM FollowUp Task Assignment: <Task Title>`

**FollowUp Context Section:** Add after Task Reference:
```markdown
## FollowUp Context
**Previous Issue:** [What issue the previous attempt encountered]
**Investigation Findings:** [What Manager's investigation revealed]
**Required Refinement:** [Specific correction or improvement needed]
**Additional Guidance:** [Any new guidance from investigation or contextually integrated content from modified Coordination Artifacts to inform relevant decisions]
```

**Content Sections:** All content sections (Objective, Detailed Instructions, Expected Output, Validation Criteria) must be REFINED based on what went wrong, not copied from the previous attempt. The FollowUp Context guides what changes are needed.

---

## 5. Content Guidelines

### 5.1 Prompt Quality

- **Self-contained:** Worker should never need to ask "where do I find X?"
- **Specific:** Avoid vague instructions; specify files, patterns, constraints
- **Actionable:** Every instruction should be directly executable
- **Scoped:** Include only what's relevant to this Task; avoid information overload

### 5.2 Context Quality

**Same-Agent Context:**
- Reference previous work concisely
- Assume working familiarity, provide recall anchors
- Include file paths for concrete reference

**Cross-Agent Context (including Handoff):**
- Assume zero familiarity—explain everything needed
- Explicit file reading instructions before main work
- Complete output summaries with integration guidance

### 5.3 Common Mistakes to Avoid

- **Referencing inaccessible Coordination Artifacts:** Never tell Worker to "see Specifications.md" or "check Implementation Plan"—they can't access these
- **Under-scoped Cross-Agent context:** Cross-Agent Context Dependencies require comprehensive context regardless of perceived simplicity
- **Ignoring Worker Handoff state:** For Continuing Worker Agents, previous Stage dependencies must be treated as Cross-Agent even if same Worker domain
- **Missing Context Dependency chain:** Failing to trace upstream when ancestors are relevant
- **Vague instructions:** "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success"
- **Forgetting Delegation references:** Tasks with Delegation steps need skill references for Worker to create proper Delegation Prompts
- **Wrong memory_log_path on FollowUp:** FollowUp Task Assignments must use the same path as the original—Worker overwrites, not creates new
- **Embedded code blocks:** Including ``` code blocks inside Task Assignment Prompts breaks the outer code block boundaries, fragmenting the prompt and breaking User copy-paste workflow. Use indented code blocks (4 spaces) or inline code formatting instead.

---

**End of Skill**
