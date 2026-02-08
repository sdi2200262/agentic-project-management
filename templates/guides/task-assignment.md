# APM {VERSION} - Task Assignment Guide

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent constructs Task Prompts for Worker Agents. Task Prompts are self-contained prompts that provide Workers with everything needed to execute a Task.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for constructing Task Prompts. See §3 Task Assignment Procedure.

**Use Operational Standards for reasoning and decisions.** When determining Context Dependency scope, extracting Specification content, reasoning about FollowUp Assignments, or handling Delegation steps, consult the relevant standards subsection. See §2 Operational Standards.

**Follow Structural Specifications.** Task Prompts follow the format guidance defined in Structural Specifications. See §4 Structural Specifications.

### 1.2 Objectives

- Construct self-contained Task Prompts that enable Worker execution without access to Coordination Artifacts
- Analyze Task Context Dependencies and provide appropriate context based on producer-consumer relationships
- Account for Worker Handoff state when classifying Context Dependencies
- Extract and include relevant Specification content for Task Execution
- Maintain context scoping boundaries that keep Workers focused on their assigned Task

### 1.3 Outputs

**Task Prompt:** Content written to Send Bus for Worker Agent to receive via User file reference. Contains all context a Worker Agent needs to execute a Task.

**FollowUp Task Prompt:** Task Prompt with DIFFERENT content than the previous failed attempt, issued when Coordination Decision (per `{GUIDE_PATH:memory-maintenance}` §3.5 Coordination Decision) determines "FollowUp needed." Content (Objective, Instructions, Output, Validation) is refined based on what went wrong and what correction is needed, guided by a FollowUp Context section explaining the issue.

### 1.4 Context Scoping Principle

Workers operate with narrow but detailed context. They receive only:
- Their Task Prompt
- Their accumulated working context from previous Task Prompts and their outputs (of the same Worker instance)
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

Tasks may depend on outputs from previous Tasks. Context Dependencies affect how the Manager constructs context in the Task Prompt.

**Context Dependency Types and Depth Rules:**

*Same-Agent Context Dependency:* When the current Worker previously completed the producer Task, they have working familiarity with the outputs.
- **Depth Rule:** Light contextual reference-recall anchors, key artifacts, file paths
- Reference previous work without repeating detailed instructions
- Detail level increases with dependency complexity between Tasks

*Cross-Agent Context Dependency:* When a different Worker completed the producer Task, the current Worker has zero familiarity.
- **Depth Rule:** Comprehensive integration context-file reading instructions, output summaries, integration guidance
- Assume zero familiarity-explain everything needed
- Explicit file reading instructions before main work
- Complete output summaries with integration guidance

*Handoff Context Dependency:* When the Manager has detected that the target Worker performed a Handoff (per `{GUIDE_PATH:memory-maintenance}` §2.3 Handoff Detection Standards), the Continuing Worker Agent only has current Stage Memory Logs loaded. This affects classification:
- Same-Agent Context Dependencies from the **current Stage** → Treat as Same-Agent (Continuing Worker has received working context)
- Same-Agent Context Dependencies from **previous Stages** → Treat as Cross-Agent (Continuing Worker lacks working context)


**Context Dependency Identification** → Check the Task's Dependencies field in the Implementation Plan:
- Format: `Task N.M by <Domain> Agent`
- Cross-Agent Context Dependencies are with **bold font** in the Implementation Plan
- "None" indicates no dependencies

**Context Dependency Chain Reasoning** → Tasks may have dependencies that themselves have dependencies. Not all ancestors are relevant to the current Task. An intermediate node may fully abstract what came before it. Trace the chain upstream; for example:
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

`Specifications.md` contains design decisions and constraints that inform Task Execution or Validation. Workers only receive Task Prompts - the Manager extracts relevant Specification content and contextually integrates it into the Task Prompt to inform Worker decisions.

**Relevance Assessment** → When reviewing Specifications for a Task, consider:
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

**Default:** Never reference `Specifications.md` by path-Workers only receive Task Prompts. Preserve specificity with exact constraints, not summaries.

### 2.3 FollowUp Assignment Standards

FollowUp Task Prompts occur when Coordination Decision (per `{GUIDE_PATH:memory-maintenance}` §3.5 Coordination Decision) determines "FollowUp needed" after investigation.

**Entry Point** → The Manager arrives at FollowUp Task Prompt with:
- The original Task Memory Log findings
- Investigation results (from self-investigation or Delegation)
- Understanding of what went wrong and what refinement is needed
- Potentially, Coordination Artifact modifications that were made

**FollowUp Content Principle:** The FollowUp Task Prompt is a NEW Task Prompt with DIFFERENT content than the previous attempt. Objective, Instructions, Output, and Validation must be refined based on what went wrong. See §3.5 FollowUp Task Prompt Creation.

**Log Path Continuity:** FollowUp Task Prompts use the same `memory_log_path` as the original Task Prompt. The Worker's new Task Memory Log overwrites the previous one. The Manager captures iteration patterns in Stage Summaries when relevant.

### 2.4 Delegation Step Standards

Tasks may contain Delegation steps that require Worker to delegate part of the work.

**Identification:**
- Task steps containing "Delegate Agent:" indicate Delegation requirements
- Implementation Plan may include skill references for Delegation type

**Delegation Skill References:**
- Debug: `{SKILL_PATH:debug-delegation}`
- Research: `{SKILL_PATH:research-delegation}`
- Other: Note Delegation purpose; reference skill if available

See §3.5 Task Prompt Creation.

### 2.5 Dispatch Planning Standards

Before constructing individual Task Prompts, the Manager assesses dispatch opportunities across Ready tasks. The Dependency Graph (in the Implementation Plan header) informs these assessments.

**Task Readiness** → A task is Ready when all its dependencies are Complete. The Manager identifies Ready tasks by checking dependency status against completed work.

**Batch Candidacy** → Multiple Ready tasks assigned to the same Worker may be batched if:
- Each task depends only on the previous task in the chain (or on already-Complete tasks)
- No tasks assigned to other Workers depend on intermediate tasks in the chain
- Soft guidance: 3-5 tasks per batch is reasonable; no hard limit

**Parallel Candidacy** → Ready tasks assigned to different Workers may be dispatched in parallel if:
- No unresolved cross-Worker dependencies exist among them
- Tasks are independent enough that concurrent execution won't cause conflicts

**Parallel Dispatch Prerequisites** → Before first parallel dispatch in a session, check:
- Is git initialized? If not, offer to initialize it.
- Inform User that each parallel task will include branch instructions for isolated work.
- Recommend relaxing agent permissions to avoid idle time from approval prompts.

If prerequisites aren't met and User declines setup, dispatch sequentially instead.

**Dispatch Tracking** → When dispatching in parallel, keep track of which Workers have active tasks and which Reports are pending. When a Report arrives, reassess what's Ready and what can be dispatched next.

**Wait State** → When no Ready tasks exist but Workers are still active, communicate the wait state to User: what was processed, what's pending, and what to do when the next Report arrives.

### 2.6 Branch Instructions Standards

When dispatching tasks in parallel, each Task Prompt includes branch instructions so Workers isolate their changes.

**Branch Naming** → Derive branch names from task objectives, not Worker identity. Examples:
- `feat/user-authentication`
- `feat/api-endpoints`
- `fix/validation-logic`

**When to Include** → Include branch instructions when:
- Dispatching multiple tasks in parallel to different Workers
- Project Standards specify branching workflow

**Content** → Branch instructions tell the Worker to:
1. Create and switch to the specified branch
2. Commit work to that branch
3. Note the branch in their Memory Log output section
4. Not merge — Manager coordinates merges

---

## 3. Task Assignment Procedure

This section defines the sequential actions for constructing Task Prompts. The procedure supports single task, batch, and parallel dispatch modes.

**Procedure:**
1. Dispatch Assessment — determine what to dispatch (single, batch, parallel)
2. Per-Task Analysis (for each task in dispatch plan):
   - Context Dependency Analysis
   - Specification Extraction
   - Implementation Plan Context Extraction
3. Task Prompt Creation — construct and write prompts (single or batched)

For FollowUp Task Prompts, see §3.6 FollowUp Task Prompt Creation.

### 3.1 Dispatch Assessment

Assess dispatch opportunities before constructing individual Task Prompts. See §2.5 Dispatch Planning Standards.

Perform the following actions:
1. Identify Ready tasks — tasks whose dependencies are all Complete
2. Group Ready tasks by assigned Worker
3. Assess batch candidacy per §2.5:
   - Same-Worker chains with internal dependencies only
   - No external tasks depending on intermediate tasks
4. Assess parallel candidacy per §2.5:
   - Multiple Workers have Ready tasks
   - No cross-Worker dependencies among Ready tasks
5. If parallel dispatch planned:
   - Check prerequisites (git initialized, User informed about branching)
   - If first parallel dispatch this session, communicate setup per §2.5 Parallel Dispatch Prerequisites
   - Determine branch names for each parallel task per §2.6 Branch Instructions Standards
6. Formulate dispatch plan:
   - Which Workers receive dispatches
   - Single task, batch, or parallel
   - Branch instructions if applicable
7. For each task in the dispatch plan, proceed to §3.2-3.4 (Per-Task Analysis), then §3.5 (Task Prompt Creation)

### 3.2 Context Dependency Analysis

*Execute for each task in the dispatch plan.*

Analyze the task's Context Dependencies to determine what context the Worker needs. For dependency type definitions and decision rules, see §2.1 Context Dependency Standards.

Perform the following actions:
1. Read the Task's Dependencies field from the Implementation Plan:
   - If "None": Skip to §3.3 Specification Extraction with `has_dependencies: false`
   - If dependencies listed: Continue to step 2
2. Check tracked Handoff state for the target Worker (has this Worker performed a Handoff? From which Stage?)
3. Classify each dependency as Same-Agent, Cross-Agent, or Handoff per §2.1
4. For Cross-Agent/Handoff dependencies, trace the chain upstream:
   - Start with direct dependencies (immediate producers)
   - For each producer, check if its dependencies are relevant to the current Task
   - Stop tracing a branch when an upstream node is not relevant
   - Include all relevant nodes in the Context Dependency context
5. For each relevant dependency, read the producer's Task Memory Log and note key outputs, file paths, and integration details

### 3.3 Specification Extraction

*Execute for each task in the dispatch plan.*

Extract context from Specifications that the Worker needs but cannot access.

Perform the following actions:
1. Review `Specifications.md` for content relevant to this Task:
   - Apply §2.2 Specification Extraction Standards to determine relevance
2. Contextually integrate relevant content into the Task Prompt-do not reference Specifications.md by path
3. Preserve specificity with exact constraints, not summaries
4. Note relevant Specification content for inclusion in prompt

### 3.4 Implementation Plan Context Extraction

*Execute for each task in the dispatch plan.*

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

### 3.5 Task Prompt Creation

Assemble the Task Prompt using extracted context from the Implementation Plan and the Specifications.

Perform the following actions:
1. Construct YAML frontmatter:
   - `stage`: Stage number
   - `task`: Task number within Stage
   - `agent_id`: Worker Agent identifier (lowercase, hyphenated)
   - `memory_log_path`: Full path following convention `.apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md`
   - `has_dependencies`: Boolean indicating Context Dependency context present
   - `has_delegation_steps`: Boolean indicating Delegation steps present (set to `true` if Task contains Delegation steps)
   - `has_branch_instructions`: Boolean indicating branch instructions present (set to `true` for parallel dispatch)
2. Construct prompt body following §4.1 Task Prompt Format:
   - Task Reference section with Task ID and Agent
   - Context from Dependencies section (if `has_dependencies: true`) using appropriate format based on Context Dependency type
   - Objective from Implementation Plan (optionally enhanced with coordination-level resolution context)
   - Detailed Instructions integrating Implementation Plan steps, Guidance content, and relevant Specification content contextually where they inform decisions (optionally enhanced with coordination-level resolution context)
   - Expected Output from Implementation Plan Output field (optionally enhanced with coordination-level resolution context)
   - Validation Criteria from Implementation Plan Validation field (optionally enhanced with coordination-level resolution context)
   - Memory Logging instructions with path
   - Reporting Protocol reference
   - Delegation section (if `has_delegation_steps: true`): Include Delegation section in prompt body; Worker reads referenced delegation skill and spawns delegate subagent per skill methodology; Worker integrates findings and logs Delegation in Task Memory Log
3. If branch instructions apply (per §2.6), include the Branch Instructions section in the prompt body.
4. Write to Send Bus:
   - **Single task:** Write the complete prompt to the Send Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery.
   - **Batch:** Write multiple Task Prompts with batch envelope per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery and §4.4 Batch Envelope Format. Each Task Prompt in the batch retains its full structure.
5. For parallel dispatch, repeat steps 1-4 for each Worker in the dispatch plan, writing to their respective Send Buses.
6. After writing Task Prompt(s) to Send Bus(es), direct the User to reference the file(s) in the respective Worker session(s). {CONTEXT_ATTACH_SYNTAX}

### 3.6 FollowUp Task Prompt Creation

Execute when Coordination Decision (per `{GUIDE_PATH:memory-maintenance}` §3.4 Coordination Decision) determines "FollowUp needed." FollowUp Task Prompts are NEW Task Prompts with DIFFERENT content than the previous failed attempt. Do not copy the previous prompt-refine all content sections based on what went wrong.

Perform the following actions:
1. Capture the FollowUp context from Coordination Decision:
   - What issue did the previous attempt encounter?
   - What did investigation (self or delegated) reveal?
   - What specific refinement or correction is needed?
   - Were any Coordination Artifacts modified that affect this Task?
2. Extract and integrate relevant content from modified Coordination Artifacts (if any):
   - If Specifications.md was modified: Extract relevant Specification content per §3.3 Specification Extraction
   - If Implementation_Plan.md was modified: Extract relevant Task content per §3.4 Implementation Plan Context Extraction
   - Contextually integrate extracted content into the Task Prompt to inform Worker decisions (Workers only receive Task Prompts; artifact changes are brought into the task context when relevant)
3. Refine Task Assignment content using Manager's coordination-level resolution:
   - Refine Objective based on what went wrong and what correction is needed
   - Refine Detailed Instructions to guide Worker toward successful completion
   - Refine Expected Output if deliverables need adjustment
   - Refine Validation Criteria based on failure patterns or new requirements or constraints
   - Include a FollowUp Context section explaining what issue the previous attempt encountered, what specific refinement or correction is needed, and any additional guidance based on Manager's investigation
4. Construct FollowUp prompt using the same format as §3.5 Task Prompt Creation, with modifications:
   - Use title "APM FollowUp Task: <Task Title>" instead of "APM Task"
   - Same `memory_log_path` as original Task Prompt (Worker overwrites previous log)
   - Add FollowUp Context section after Task Reference explaining the issue and required refinement
   - Include refined Objective, Instructions, Output, and Validation (not the original content)
   - Contextually integrate extracted content from modified Coordination Artifacts in appropriate sections
5. Write the complete prompt to the Send Bus file (`apm-send-to-<agent-slug>.md`) per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery.
6. After writing the FollowUp Task Prompt to the Send Bus, direct the User to reference the Send Bus file in the Worker session. {CONTEXT_ATTACH_SYNTAX}

---

## 4. Structural Specifications

This section defines the format guidance for Task Prompts.

### 4.1 Task Prompt Format

Task Prompts are markdown files that follow this general structure. Adapt based on Task needs - not all sections are required for every Task.

**YAML Frontmatter Structure:**
```yaml
---
stage: <N>
task: <M>
agent_id: <domain>-agent
memory_log_path: ".apm/Memory/Stage_<N>_<Slug>/Task_Log_<N>_<M>_<Slug>.md"
has_dependencies: true | false
has_delegation_steps: true | false
has_branch_instructions: true | false
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
[Provide actionable instructions to validate task execution and outputs - directly executable criteria enabling Worker to verify work meets requirements]

## Memory Logging
Upon completion, log your work to: `<memory_log_path>`
Follow `{GUIDE_PATH:memory-logging}` §3.1 Task Memory Log Procedure.

## Task Report
After logging, output a **Task Report** for User to return to Manager Agent.

## Delegation
[Include only if has_delegation_steps: true]
This Task includes Delegation step(s). When you reach a Delegation step:
- **Type:** <Debug|Research|Other>
- **Skill Reference:** `{SKILL_PATH:delegate-<type>}`
- Read the skill and spawn delegate subagent per skill's §3.2, structuring task input per §3.1
- Integrate findings and log Delegation in your Task Memory Log

## Branch Instructions
[Include only if has_branch_instructions: true]
Work in an isolated branch for this task:

\`\`\`bash
git checkout -b <branch-name>
\`\`\`

Commit your work to this branch. Note the branch name in your Memory Log output section. Do not merge — the Manager will coordinate merges.
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
- Assume Worker has zero familiarity
- Always comprehensive but don't duplicate existing content
- Include explicit file paths and what to look for
- Document all relevant interfaces and contracts
- Include upstream dependencies when relevant per §2.1 Context Dependency Standards

### 4.2 FollowUp Assignment Format

FollowUp Task Prompts are NEW Task Prompts with DIFFERENT content than the previous failed attempt. They use the same structure as §4.1 Task Prompt Format, with these modifications:

**Title:** `APM FollowUp Task: <Task Title>`

**FollowUp Context Section** → Add after Task Reference:
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
- Assume zero familiarity-explain everything needed
- Explicit file reading instructions before main work
- Complete output summaries with integration guidance

### 5.3 Common Mistakes to Avoid

- **Referencing inaccessible Coordination Artifacts:** Never tell Worker to "see Specifications.md" or "check Implementation Plan"-they can't access these
- **Under-scoped Cross-Agent context:** Cross-Agent Context Dependencies require comprehensive context regardless of perceived simplicity
- **Ignoring Worker Handoff state:** For Continuing Worker Agents, previous Stage dependencies must be treated as Cross-Agent even if same Worker domain
- **Missing Context Dependency chain:** Failing to trace upstream when ancestors are relevant
- **Vague instructions:** "Implement the feature properly" vs "Implement POST /api/users with email validation using express-validator, returning 201 on success"
- **Forgetting Delegation references:** Tasks with Delegation steps need skill references for Worker to create proper Delegation Prompts
- **Wrong memory_log_path on FollowUp:** FollowUp Task Prompts must use the same path as the original-Worker overwrites, not creates new

---

**End of Skill**
