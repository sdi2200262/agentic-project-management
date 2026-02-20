# APM {VERSION} - Work Breakdown Guide

## 1. Overview

**Reading Agent:** Planner

This guide defines the process for Work Breakdown, which transforms gathered context into planning documents (Specifications, Implementation Plan, and Execution Standards) through Chain-of-Thought reasoning - thinking visibly in chat before committing to files.

### 1.1 How to Use This Guide

See §3 Work Breakdown Procedure - execute sequentially. See §2 Operational Standards for decomposition decisions, specification reasoning, plan assessment, and standards extraction. **Present reasoning in chat** before file output - the User sees your thinking and can redirect before artifacts are written. Section references (§N.M) are for your procedural navigation - communicate with the User in natural language.

### 1.2 Objectives

- Translate gathered context into actionable project structure
- Define Workers based on domain organization
- Create Tasks with clear objectives, outputs, validation criteria, and dependencies
- Establish Execution Standards for consistent execution

### 1.3 Outputs

- **`Specifications.md`** - Design decisions and constraints that define what is being built. Free-form structure determined by project needs.
- **`Implementation_Plan.md`** - Stage and Task breakdown with agent assignments, validation criteria, dependency chains, and Dependency Graph.
- **`{AGENTS_FILE}`** - Universal execution-level Execution Standards applied during Task execution.

**Artifact visibility - design for the consumer:**

- **Specifications and Implementation Plan → Manager reads directly.** Workers do not reference these files - the Manager extracts relevant content into Task Prompts, making them self-contained, and uses the plan for dispatch and progress tracking. Write for coordination needs - organization, cross-referencing, and extraction efficiency.
- **`{AGENTS_FILE}` → Workers directly.** Workers access this during Task execution. Write standards so they are self-contained and actionable without Specifications or Implementation Plan context.

### 1.4 Scope Adaptation

Decomposition granularity adapts to project size and complexity. Stages, Tasks, and steps are relative concepts - smaller projects warrant lighter breakdown, larger projects may need more detail. Let the actual scope and requirements guide how work units are identified and organized.

---

## 2. Operational Standards

### 2.1 Visible Reasoning

Work Breakdown uses visible reasoning (chain-of-thought): present your thinking in chat before writing to files. This makes decomposition decisions visible and auditable, and gives the User opportunity to redirect.

**Chat reasoning** is free-form. Explain your thinking about domain boundaries, task decomposition, dependency rationale, and specification decisions. The goal is that the User can follow your logic and agree or disagree before you write files.

**Reasoning frame.** While the format is flexible, cover these aspects when they apply: what you're analyzing and why, key decisions and reasoning, how Context Gathering findings inform each decision, dependencies or risks worth noting.

**File output** uses the structural templates per §4 Structural Specifications. Chat reasoning transforms into structured file entries - the reasoning in chat is the thinking, the file entry is the result.

### 2.2 Decomposition Principles

These principles apply across all decomposition levels. Apply with judgment adapted to project scope per §1.4 Scope Adaptation.

**Domains.** Identify logical work domains from Context Gathering. Split when domains involve different expertise or mental models. Combine when domains share tight context and dependencies. When balanced, prefer separation. Integrate User preferences.

**Stages.** Identify milestone groupings. Each Stage delivers coherent value. Split when work streams are unrelated or intermediate deliverables block subsequent work. Combine when separation is artificial. When balanced, prefer fewer Stages with clear milestones.

**Tasks.** Derive from Stage objectives. Each Task produces a meaningful deliverable, scoped to one agent's domain, with specified validation criteria. Split when a Task spans domains or bundles unrelated deliverables. Combine when micro-tasks create overhead without value. Include subagent steps for investigation or research.

**Steps.** Organize work within a Task for failure tracing. Ordered, discrete, sharing the Task's validation. If a step needs independent validation, split the Task.

**Scope boundaries.** Agent-assignable work is completable within the development environment with autonomous or artifact-based validation. User coordination involves external platforms, credentials, or validation outside the environment - include explicit coordination steps and mark user validation.

**Validation criteria.** Each Task specifies validation: programmatic (automated checks), artifact (output existence and structure), or user (human judgment). Programmatic and artifact allow autonomous iteration; user validation requires pausing. Most Tasks combine multiple approaches.

### 2.3 Specifications Standards

Specifications define what is being built - design decisions, constraints, and requirements that shape the deliverable. They form the foundation the Implementation Plan builds on: every design decision captured here has corresponding Tasks in the Plan that implement it.

**What belongs in Specifications:** Decisions with three properties - they affect what is being built (not how work is executed), they apply across multiple Tasks, and reasonable alternatives existed. **What does not:** Task-specific implementation details (Task guidance), universal execution patterns (Execution Standards). Structure Specifications so design decisions can be extracted per-Task - the Manager distills relevant content into individual Task Prompts.

### 2.4 Implementation Plan Standards

The Implementation Plan defines how work is organized - Stages, Tasks, agent assignments, dependencies, and validation criteria. The Manager uses it for dispatch decisions, dependency analysis, coordination, and progress tracking.

**What belongs:** Task-level coordination - objectives, deliverables, agent assignments, validation criteria, dependencies, step-by-step guidance. **What does not:** Design decisions across Tasks (Specifications), universal execution patterns (Execution Standards).

**Task self-sufficiency.** Each Task must contain enough context for a Worker to execute from a Task Prompt alone. Workers do not reference the full Implementation Plan or Specifications directly - the Manager extracts relevant content during Task Assignment.

**Dispatch-aware structuring.** When assignments and task ordering could go multiple ways, prefer arrangements that maximize dispatch opportunities:

- **Batch candidates** - same-agent Task groups dispatchable together. Two patterns qualify: sequential same-agent chains where each Task depends only on the previous, or multiple independent same-agent Tasks with no same-agent dependencies that become ready simultaneously.
- **Parallel candidates** - independent Tasks ready for dispatch assigned to different agents with no unresolved cross-agent dependencies among them, dispatchable simultaneously.
- **Single dispatch** - a lone ready Task with no batch or parallel partners.

All three patterns are valid. Structure the plan to create natural opportunities across all of them rather than forcing one pattern.

### 2.5 `{AGENTS_FILE}` Standards

`{AGENTS_FILE}` defines how work is performed - universal execution patterns across all Tasks. Workers access it directly during Task execution.

**What belongs:** Patterns recurring across multiple Tasks, User-specified conventions, coding and quality requirements that apply universally. **What does not:** Design decisions (Specifications), task-specific guidance (Implementation Plan).

"Universal" means applicable to every Worker in the project regardless of domain. Because all Workers read the same Execution Standards file - a frontend Worker and a backend Worker receive identical standards - the test is: would this pattern apply to every Worker assigned to this project? If it only applies to one domain, it belongs in Task guidance, not here.

When uncertain whether something is universal, prefer placing it in Task guidance - easier to promote later than to demote.

**Self-containedness.** Workers' working context is intentionally scoped to their Task Prompt and `{AGENTS_FILE}` - Specifications, Implementation Plan, and external design artifacts are omitted by design. Standards referencing those documents undermine that scoping. Embed content directly; if it answers "what is being built", it belongs in Specifications first.

---

## 3. Work Breakdown Procedure

Complete each step before proceeding to the next. Present reasoning in chat before writing files per §2.1 Visible Reasoning.

**Procedure:**

1. Specifications Analysis → write Specifications, **checkpoint: User approval**
2. Implementation Plan Header → set project name and overview
3. Domain Analysis → identify Workers, update header
4. Stage Analysis → identify all Stages with objectives and Tasks upfront, update header
5. Stage Cycles → per Stage: detailed Task breakdown, append to Implementation Plan
6. Plan Review → workload, dependencies, Dependency Graph, **checkpoint: User approval**
7. Standards Analysis → write Execution Standards, **checkpoint: User approval**

### 3.1 Specifications Analysis

Perform the following actions per §2.3 Specifications Standards:

1. Analyze design decisions from gathered context. Present reasoning in chat:
   - **Design decisions** - each explicit choice and implicit constraint embedded in requirements: what was decided, what alternatives existed, why this direction. Surface assumptions stated as facts that represent actual decisions.
   - **Boundary calls** - candidates borderline between Specifications, Plan guidance, and Standards: where each lands and why.
   - **Decision relationships** - decisions that cascade, constrain, or cluster naturally together.
   - **Structure rationale** - how to organize decisions so the Manager can extract relevant content per Task.
2. Update `.apm/Specifications.md`:
   - Replace `<Project Name>` with appropriate project name.
   - Fill **Last Modification** field: "Specifications creation by the Planner."
   - Add specification content per §4.2 Specifications Format. Let structure follow the decisions identified.
3. **Specifications checkpoint.** Pause for User review:
   - State Specifications are complete and the artifact is created.
   - Ask User to review for accuracy.
   - If modifications needed → apply and return to step 3.
   - If approved → Proceed to §3.2 Implementation Plan Header.

### 3.2 Implementation Plan Header

Perform the following actions:

1. Update Implementation Plan header:
   - Replace `<Project Name>` with appropriate project name - same as in `.apm/Specifications.md`.
   - Fill **Project Overview** with 3-5 sentences: project type, core problem, essential scope, success criteria.
   - Fill **Last Modification** field: "Plan creation by the Planner."

### 3.3 Domain Analysis

Perform the following actions per §2.2 Decomposition Principles:

1. Present domain organization reasoning in chat, grounded in the Specifications approved above:
   - **Domains identified** - logical work domains and their scope.
   - **Separation rationale** - why domains are separated or combined.
   - **Agent mapping** - how domains map to Workers with proposed names and responsibilities.
2. Update Implementation Plan header Agents field.

### 3.4 Stage Analysis

Identify all Stages and their Tasks upfront per §2.2 Decomposition Principles - see §3.5 Stage Cycles for detailed Task breakdown. Perform the following actions:

1. Present stage structure reasoning in chat:
   - **Stage objectives** - what each Stage delivers and its boundary rationale.
   - **Task overview** - identified Tasks per Stage with brief descriptions.
2. Update Implementation Plan header Stages field.

### 3.5 Stage Cycles

For each Stage per §3.4 Stage Analysis, complete detailed Task breakdown. Execute in Stage order per §2.2 Decomposition Principles. Perform the following actions:

1. State context for the current Stage: User requirements and constraints influencing it.
2. For each Task, present reasoning in chat:
   - **Agent assignment** - which agent and why.
   - **Validation** - approaches selected and rationale.
   - **Dependencies** - enumerate every dependency. Same-agent: `Task N.M` format. Cross-agent: **`Task N.M by <Agent>`** (bolded), specifying the deliverable at the boundary.
   - **Steps** - ordered operations with purpose.
   Use more detail for complex Tasks and less for straightforward ones. Include all required dimensions.
3. Append the Stage to the Implementation Plan per §4.3 Stage Format and §4.4 Task Format. Enrich Task details based on chat reasoning. Ensure every cross-agent dependency is bolded at write time - do not defer to Plan Review.

### 3.6 Plan Review

After completing all Stage Cycles, review the plan per §2.4 Implementation Plan Standards. Perform the following actions:

1. **Workload assessment.** Count Tasks per agent. Flag agents with disproportionately large workloads relative to other agents for subdivision review. If subdividing, present reasoning:
   - **Sub-domain boundaries** - where to split and why.
   - **Agent coherence** - how sub-agents maintain clear, focused domains.
   Update Implementation Plan assignments and emergent task dependencies.
2. **Cross-agent dependency review.** Verify all cross-agent dependencies are correctly identified and bolded. Cross-check agent assignments - if a dependency's producer differs from the consumer's agent, it must be bolded. Present reasoning:
   - **Dependency audit** - list every dependency, classify each, flag misclassified entries.
   - **Cross-agent chains** - provider, consumer, agents, required deliverable.
   - **Risk assessment** - bottlenecks or coordination complexity.
   Fix any misclassified dependencies.
3. **Dependency Graph generation.** Generate a mermaid graph per §4.6 Dependency Graph Format using finalized Tasks, agent assignments, and dependencies. For each edge, verify the type matches: `-->` for same-agent, `-.->` for cross-agent. Write to Implementation Plan header.
4. **Plan summary.** Present in chat: agent count, Stage count with names and Task counts, total Tasks, cross-agent dependency count.
5. **Implementation Plan checkpoint.** Pause for User review:
   - State Implementation Plan is complete.
   - Ask User to review the plan.
   - If modifications needed → apply and return to 5.
   - If approved → Proceed to §3.7 Standards Analysis.

### 3.7 Standards Analysis

Perform the following actions per §2.5 `{AGENTS_FILE}` Standards:

1. Analyze for universal execution patterns across all planning sources. Present reasoning:
   - **From Specifications** - design decisions with execution implications: decisions that translate into rules Workers must always follow.
   - **From the Plan** - patterns recurring across multiple Task guidance fields.
   - **From gathered context** - workflow preferences, conventions, or quality requirements from Context Gathering not yet captured in Specifications or the Plan.
   - **Classification** - which candidates are truly universal vs task-specific; whether each is self-contained for Workers with no access to Specifications or the Plan. Universal means applicable to every Worker regardless of domain - test each: does it apply to all Workers, or only specific domains?
   - **Existing standards** - what `{AGENTS_FILE}` already contains; reference rather than duplicate.
2. Write APM_STANDARDS block to `{AGENTS_FILE}` per §4.1 APM_STANDARDS Block:
   - If file exists: preserve existing content outside block, append APM_STANDARDS block.
   - If creating new: create file with APM_STANDARDS block only.
3. **Standards checkpoint.** Pause for User review:
   - State Execution Standards are complete.
   - Ask User to review `{AGENTS_FILE}` for accuracy.
   - If modifications needed → apply and return to step 3.
   - If approved → Proceed to §3.8 Procedure Completion.

### 3.8 Procedure Completion

After all three checkpoints are approved, output procedure completion stating Work Breakdown is complete, all planning documents are created, and the next step is initializing the Manager using `/apm-2-initiate-manager`.

---

## 4. Structural Specifications

### 4.1 APM_STANDARDS Block

The namespace block structure for `{AGENTS_FILE}`:

```text
APM_STANDARDS {

[APM-managed standards content]

} //APM_STANDARDS
```

**Content rules:** No content outside the APM_STANDARDS block unless explicitly requested. Use markdown headings (`##`) for categories. Each standard must be concrete and actionable. Only universal execution-level patterns - not architecture decisions, task-specific guidance, or coordination decisions. Reference existing standards outside the block rather than duplicating.

**Format selection:** Tables for pattern comparisons, code blocks for syntax examples, bulleted lists for rules, numbered lists for sequential steps, prose for context.

### 4.2 Specifications Format

The structure for `.apm/Specifications.md`:

```markdown
# <Project Name> - APM Specifications
**Last Modification:** [Description]

---

[Specification content using appropriate structural elements]
```

**Content rules:** Use markdown headings (`##`) for categories. Free-form structure determined by project context. Each specification must be concrete and actionable. Reference existing User documents rather than duplicating. Use tables for enumerated values, mermaid diagrams for relationships, code blocks for schemas, prose for rationale.

### 4.3 Stage Format

Each Stage in the Implementation Plan:

- **Header:** `## Stage N: [Name]`
- **Naming:** Stage names reflect domain(s), objectives, and main deliverables.
- **Contents:** Tasks per §4.4 Task Format, each containing steps per §4.5 Step Format.

### 4.4 Task Format

Each Task in the Implementation Plan:

**Header:** `### Task <N.M>: <Title> - <Domain> Agent`

**Contents:**

```markdown
* **Objective:** [Single-sentence task goal.]
* **Output:** [Concrete deliverables - files, components, artifacts produced.]
* **Validation:** [Binary pass/fail criteria with approach(es): Programmatic, Artifact, and/or User.]
* **Guidance:** [Technical constraints, approach specifications, references to existing patterns, User collaboration patterns.]
* **Dependencies:** [Prior task outputs required. Format: `Task N.M by <Domain> Agent, ...` Bold cross-agent dependencies. Use "None" when no dependencies exist.]

1. [Step description]
2. [Step description]
```

### 4.5 Step Format

Each step is a numbered instruction describing a discrete operation. Include clear, specific instructions that an agent can execute directly. Reference patterns, files, or prior work when relevant. When investigation, exploration, or research is needed, include a subagent step describing purpose and scope (e.g., "Spawn a debug subagent to isolate the rendering issue" or "Spawn a research subagent to verify the current API authentication patterns").

### 4.6 Dependency Graph Format

The Dependency Graph is a mermaid diagram in the Implementation Plan header that visualizes Task dependencies, agent assignments, and execution flow. It enables the Manager to identify batch candidates, parallel dispatch opportunities, critical path bottlenecks, and coordination points.

**Graph structure:**

```mermaid
graph TB

subgraph S1["Stage 1: <Name>"]
  direction LR
  T1_1["1.1 <Title><br/><i><Agent A></i>"] --> T1_2["1.2 <Title><br/><i><Agent A></i>"]
end

subgraph S2["Stage 2: <Name>"]
  direction LR
  T2_1["2.1 <Title><br/><i><Agent B></i>"]
  T2_2["2.2 <Title><br/><i><Agent C></i>"]
end

T1_2 -.-> T2_1
T1_2 -.-> T2_2

style T1_1 fill:#2d6a4f,color:#000
style T1_2 fill:#2d6a4f,color:#000
style T2_1 fill:#f4a261,color:#000
style T2_2 fill:#a8dadc,color:#000
```

**Dispatch patterns visible from the graph:**

- **Batch candidates** - same-agent Task groups dispatchable together. Two patterns qualify:
  - *Sequential chain:* each Task depends only on the previous (e.g., T1_1 → T1_2 → T1_3, all same agent).
  - *Independent group:* same-agent Tasks with no same-agent dependencies, all ready simultaneously.
- **Parallel candidates** - independent Tasks ready for dispatch assigned to different agents (e.g., T2_1 and T2_2 above), dispatchable simultaneously.
- **Cross-agent coordination points** - dotted arrows (e.g., T1_2 -.-> T2_1) indicate where one agent's output feeds another agent's input.
- **Single dispatch** - a lone ready Task with no batch or parallel partners.

**Node format:** `T<Stage>_<Task>["<Task ID> <Title><br/><i><Agent Name></i>"]`

**Edge rules:** Same-agent dependency: `-->` (solid). Cross-agent dependency: `-.->` (dotted). Only direct dependencies - do not draw transitive closure.

**Styling:** Assign each agent a consistent fill color across all its Task nodes. Apply colors via `style T<S>_<T> fill:<color>` statements after all subgraphs, ordered by agent appearance in the Implementation Plan Agents field. Use text color #000 and select fill colors with sufficient contrast for readability.

---

## 5. Content Guidelines

### 5.1 Quality Standards

**Specifications:** Design decisions are concrete and traceable to Context Gathering findings. Reference existing User documents rather than duplicating.

**Implementation Plan:** Each Task is understandable without external reference. Use specific language - not "implement properly" but the specific pattern to follow. All fields populated. Consistent naming and terminology.

**`{AGENTS_FILE}`:** Only genuinely universal patterns. Concrete and actionable - each standard specific enough that violation is detectable. If `{AGENTS_FILE}` already exists, preserve its content and append the APM_STANDARDS block rather than duplicating existing standards.

### 5.2 Common Mistakes

- **Over-specification:** Implementation details in Specifications that belong in Task guidance - if it only affects one Task, it's Task guidance.
- **Under-specification:** Design decisions left implicit - if it could reasonably go multiple ways, document the chosen direction.
- **Task packing:** Multiple unrelated deliverables in one Task - split them.
- **Over-decomposition:** Excessive small Tasks - combine when they share context and validation.
- **Vague validation:** "Works correctly" - specify what "correctly" means concretely.
- **Missing dependencies:** Tasks requiring prior work not marked - trace prerequisites.
- **Misclassified dependencies:** Cross-agent dependencies not bolded, same-agent dependencies incorrectly bolded, or wrong edge types in the Dependency Graph (`-->` vs `-.->`) - classify at write time per §3.5 Stage Cycles by checking whether producer and consumer share the same agent. Verify per §3.6 Plan Review.
- **Non-universal standards:** Task-specific patterns elevated to `{AGENTS_FILE}` - if it only applies to some Tasks, it's Task guidance.
- **Standards referencing external documents:** Specifications, planning documents, and design artifacts are intentionally omitted from Workers' context - referencing them from `{AGENTS_FILE}` undermines that scoping. See §2.5 `{AGENTS_FILE}` Standards.

---

**End of Guide**
