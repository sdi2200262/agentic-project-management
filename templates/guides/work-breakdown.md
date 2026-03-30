# APM {VERSION} - Work Breakdown Guide

## 1. Overview

**Reading Agent:** Planner

This guide defines the process for Work Breakdown, which transforms gathered context into planning documents (Spec, Plan, and Rules) through visible reasoning - presenting analysis in chat for the User to review before committing to files.

### 1.1 Outputs

- *Spec:* Design decisions and constraints that define what is being built. Free-form structure determined by project needs.
- *Plan:* Stage and Task breakdown with Worker assignments, validation criteria, dependency chains, and Dependency Graph.
- *`{RULES_FILE}`:* Universal execution-level Rules applied during Task execution.

All context gathered during Context Gathering must be captured across these three artifacts. If you omit gathered context from all three, justify why it is not needed for execution - the Manager and Workers operate from these documents alone. How context maps to each document is governed by §2.1 Workflow Context. Decomposition granularity adapts to project size and complexity - smaller projects warrant lighter breakdown, larger projects may need more detail.

---

## 2. Operational Standards

### 2.1 Workflow Context

From Context Gathering's §2.1 Workflow Context, you know these documents serve different audiences and that the Manager handles all coordination at runtime. This section deepens that awareness into the placement decisions you make during decomposition.

**How the Spec is used:** The Manager reads the Spec and extracts relevant content per-Task into self-contained Task Prompts for Workers. Design decisions should be at the level the Manager needs for extraction - not implementation mechanics.

**How the Plan is used:** The Manager uses the Plan for coordination and Task Prompt construction. Task guidance provides the domain-specific substance the Manager wraps into Task Prompts. The Manager enriches Task Prompts at runtime with workspace context, findings from completed work, and cross-domain coordination notes. Task guidance provides what planning can determine; the Manager adds what only runtime reveals.

**How Rules are used:** Workers are designed to focus on their Task Prompt and Rules - not because they cannot access other documents, but because their Task Prompts should be sufficient. Rules must be self-contained and applicable to all Workers: embed content directly, do not reference the Spec, Plan, or external authoritative documents by path.

**Coordination is runtime:** How work gets dispatched - sequencing, parallel execution, grouping - is determined by the Manager at runtime based on the Plan's structure. Version control conventions are established by the Manager during the Implementation Phase. The Plan captures work structure; the Manager reads coordination opportunities from it.

**Passing observations to the Manager:** When you have factual observations or User preferences that the Manager should consider but that you have no authority to act on, note them as blockquotes in the relevant header section of the document per §4.1 Spec Format and §4.2 Plan Format - version control and workspace observations under the Spec's Workspace section, coordination observations under the Plan's Dependency Graph section. Only include factual observations with specific evidence and explicit User preferences - not interpretations or recommendations.

### 2.2 Decomposition Principles

These principles apply across all decomposition levels. Adapt granularity to project size and complexity.

**Domains:** Identify logical work domains from Context Gathering. Split when domains involve different expertise or mental models. Combine when domains share tight context and dependencies. When balanced, prefer separation. Integrate User preferences.

**Stages:** Sequential milestone groupings - Stage N+1 begins after Stage N completes. Each Stage delivers coherent value. Split when work streams are unrelated or intermediate deliverables block subsequent work. Combine when separation is artificial. When balanced, prefer fewer Stages with clear milestones. When domains can work in parallel, structure that as parallel Tasks within a single Stage rather than parallel Stages.

**Tasks:** Derive from Stage objectives. Each Task produces a meaningful deliverable, scoped to one Worker's domain, with specified validation criteria. Split when a Task spans domains or bundles unrelated deliverables. Combine when micro-tasks create overhead without value. Include subagent steps for investigation or research.

**Steps:** Organize work within a Task for failure tracing. Ordered, discrete, sharing the Task's validation. If a step needs independent validation, split the Task.

**Scope boundaries:** Worker-assignable work is completable within the development environment and verifiable autonomously. User coordination involves external platforms, credentials, or validation requiring human judgment - include explicit coordination steps and note where User involvement is needed.

**Validation criteria.** Each Task specifies concrete pass/fail criteria tied to its deliverables - what to check and how. Criteria the Worker can verify autonomously (tests pass, outputs exist with correct structure, behavior matches requirements) allow autonomous iteration. Criteria requiring User involvement - judgment (design approval, content quality) or action (running external checks, confirming platform behavior) - require the Worker to pause. Most Tasks combine multiple criteria. Validation criteria are Worker-scoped - no references to other Stages, Tasks, or coordination-level gates. Workers validate their own deliverables; Stage coordination is the Manager's concern.

### 2.3 Spec Standards

The Spec defines what is being built - design decisions, constraints, and requirements that shape the deliverable. It forms the foundation the Plan builds on: every design decision captured here has corresponding Tasks in the Plan that implement it.

**Content placement:** The Spec captures project-shaping decisions - choices where alternatives existed, affecting what is being built across the project. Single-scope details belong in Task guidance; universal execution patterns belong in Rules. When a detail supports a design decision but does not change it, place the detail in Task guidance and keep the decision in the Spec.

**Source documents:** When User documents already authoritatively define requirements, reference them rather than restating - the Spec captures design decisions layered on existing requirements.

**Workspace structure:** When the workspace contains multiple repositories or codebases, capture workspace structure in the Spec - which repositories are working targets, which are read-only references, and where Workers operate.

**Extraction structure:** Structure for extraction per §2.1 Workflow Context - decisions should be locatable and separable so the Manager can extract relevant content per-Task into Task Prompts.

### 2.4 Plan Standards

The Plan defines how work is organized - Stages, Tasks, Worker assignments, dependencies, and validation criteria. The Manager uses it for coordination and progress tracking.

**Content placement:** Task-level content - objectives, deliverables, Worker assignments, validation criteria, dependencies, step-by-step guidance. Design decisions across Tasks belong in the Spec; universal execution patterns belong in Rules.

**Task self-sufficiency:** Each Task must contain enough context for a Worker to execute from a Task Prompt alone per §2.1 Workflow Context.

**Guidance and steps:** Guidance may reference authoritative sources by path - the Manager reads those sources and integrates relevant content into the Task Prompt. Steps describe the Worker's sequential operations - the Manager transforms them into actionable instructions enriched with Spec content and guidance.

**Dispatch-aware structuring.** The Manager dispatches work in three modes: single Tasks, batches (sequential same-Worker Tasks grouped together), and parallel (independent dispatch units sent to different Workers simultaneously). When assignments and Task ordering could go multiple ways, prefer arrangements that maximize dispatch opportunities - Tasks that can proceed independently, groups that chain naturally within a domain, work that can happen in parallel across domains. The Manager determines which mode to use at runtime based on the Plan's structure.

### 2.5 `{RULES_FILE}` Standards

`{RULES_FILE}` defines how work is performed - universal execution patterns across all Tasks. Workers receive the entire file during Task execution, not just the APM Rules block. The block is a namespace to separate APM-managed standards from pre-existing content.

**Content placement:** Rules capture how work is performed - not what is being built. Output formats, response strings, data schemas, and interface contracts define what is being built and belong in the Spec even when multiple Workers need them. Execution patterns belong here only when they apply to every Worker regardless of domain - all Workers read the same file, so domain-specific patterns do not belong here. When uncertain, prefer placing it in Task guidance - easier to promote later than to demote.

**Pre-existing content:** When `{RULES_FILE}` already contains User standards, reference relevant pre-existing rules from the APM Rules block rather than duplicating. Do not modify pre-existing content unless the User explicitly requests it.

**Self-containedness:** Workers' working context is intentionally scoped to their Task Prompt and `{RULES_FILE}` - the Spec, Plan, and external design artifacts are omitted by design. Standards referencing those documents undermine that scoping. Embed content directly.

---

## 3. Work Breakdown Procedure

Three sequential documents (Spec, Plan, Rules), each with its own analysis, file write, and User approval gate. Complete each and wait for User approval before starting the next.

Present analysis visibly in chat for the User to review per `{SKILL_PATH:apm-communication}` §2.2 Visible Reasoning. At each approval gate, describe what was written, what comes next if approved, and ask for review.

### 3.1 Spec Analysis

Present reasoning under the header **Spec Analysis:** addressing the aspects below. Perform the following actions per §2.3 Spec Standards.

**Spec Header:**
1. Set `title` in `.apm/spec.md` YAML frontmatter to the project name.
2. Set `modified` field: "Spec creation by the Planner."
3. Fill the `## Overview` section: 3-5 sentences (project type, core problem, essential scope, success criteria).

**Spec Content:**
1. Analyze design decisions from gathered context:
   - *Design decisions.* Each explicit choice and implicit constraint embedded in requirements: what was decided, what alternatives existed, why this direction. Surface assumptions stated as facts that represent actual decisions.
   - *Source documents:* which requirements already have authoritative definitions in User documents; reference rather than duplicate.
   - *Boundary calls.* For each candidate, determine its primary location per §2.1 Workflow Context: Spec (project-level design decisions), Task guidance (Task-scoped details, single-domain constraints), or Rules (universal execution patterns). Each item belongs in one primary location.
   - *Decision relationships:* decisions that cascade, constrain, or cluster naturally together.
   - *Structure rationale:* how to organize decisions so the Manager can extract relevant content per Task.
   - *Workspace.* From the workspace assessment during Context Gathering, document the project environment: directory structure, working repositories, reference repositories, authoritative document locations, existing `{RULES_FILE}` content that was found.
2. Write the full Spec per §4.1 Spec Format. Let structure follow the decisions identified.
3. Pause for User review:
   - State the Spec is complete and the artifact is created.
   - Ask User to review for accuracy.
   - If modifications needed → Apply and repeat step 3.
   - If approved → Proceed to §3.2 Plan Analysis.

### 3.2 Plan Analysis

Present reasoning under the header **Plan Analysis:** with sub-headers **Domain Analysis:**, **Stage Analysis:**, **Stage N Task Analysis:** for each Stage, and **Dependency Analysis:** for the analytical phases. Perform the following actions per §2.4 Plan Standards.

**Plan Header:**
1. Set `title` in `.apm/plan.md` YAML frontmatter to the project name (same as Spec).
2. Set `modified` field: "Plan creation by the Planner."

**Plan Content:**
1. Analyze work structure from gathered context and the approved Spec per §2.2 Decomposition Principles:
   - *Domain Analysis.* Grounded in the Spec approved above:
     - Logical work domains and their scope.
     - Why domains are separated or combined.
     - How domains map to Workers with proposed names and responsibilities.
     Update Plan header Workers field.
   - *Stage Analysis:*
     - What each Stage delivers and its boundary rationale.
     - Why this ordering, what each Stage builds on and what it enables.
     - For each Stage, what distinct deliverables are needed, which Workers produce each, which can be produced independently vs which depend on others. When a deliverable spans domains, split into per-domain Tasks with cross-agent dependencies. When a deliverable is large, split into sequential Tasks that build toward it. Each Task produces a single meaningful deliverable scoped to one Worker's domain.
     Update Plan header Stages field.
   - *Stage N Task Analysis.* For each Stage in order, state context (User requirements and constraints influencing this Stage), then for each Task:
     - *Worker assignment:* which Worker and why.
     - *Task scope:* what is the Task's scope? Is the User involved in any steps?
     - *Task guidance:* implementation context the Worker needs, including domain-specific patterns (how to structure code, existing patterns to follow), constraints (performance, security, dependencies), technical decisions (library choices, API contracts), single-domain details (validation approach, testing strategy, error handling specifics). Include context classified as Task-scoped per §3.1 Spec Analysis.
     - *Task validation:* concrete criteria that verify the Task's deliverables - what to check and how. Note where User involvement is needed. Validation criteria co-define the Task with Guidance.
     - *Dependencies:* same-agent as `Task N.M`, cross-agent as **`Task N.M by <Agent>`** (bolded), specifying the deliverable at the boundary.
     - *Steps:* ordered operations building toward Task completion.
     Every aspect above must be addressed for every Task - none may be skipped. Depth of reasoning varies with complexity, but coverage does not: even a concise Task analysis names the Worker, states scope, provides guidance, specifies validation criteria, and lists dependencies. Steps incorporate all previous aspects. After each Stage, assess whether each Task represents independently validatable work per §2.2 Decomposition Principles.
   - *Dependency Analysis.* After all Tasks are analyzed, verify all cross-agent dependencies are correctly identified and bolded. Cross-check agent assignments - if a dependency's producer differs from the consumer's agent, it must be bolded. Reason through the dependency audit (list, classify, flag misclassified) and cross-agent chains (provider, consumer, agents, required deliverable). Fix any misclassified dependencies. When presenting the dependency audit to the User, describe dependencies by their relationship rather than by graph notation.
2. Write the full Plan per §4.2 Plan Format. Enrich Task details from reasoning. Ensure every cross-agent dependency is bolded at write time. Include the Dependency Graph in the Plan header.
3. Re-read the written Plan and verify under the header **Plan Review:**
   - *Structural check:* Confirm every Task has all required fields (Objective, Output, Validation, Guidance, Dependencies, Steps). Confirm every cross-agent dependency is bolded in both the Task's Dependencies field and the Dependency Graph.
   - *Workload check:* Count Tasks per Worker. Flag disproportionate workloads for subdivision review. If a Worker is clearly overloaded, subdivide autonomously (reason through domain boundaries and Worker coherence, update assignments and dependencies). If the imbalance is borderline or involves judgment calls, present the assessment to the User and ask before modifying.
   - *Consistency check:* Verify that the Dependency Graph correctly distinguishes same-agent from cross-agent dependencies. Confirm Worker names in the Graph match the Workers table.
   Correct any issues found before presenting to the User.
4. Pause for User review:
   - State the Plan is complete and the artifact is created. Present a summary to the User: Worker count, Stage count with names and Task counts, total Tasks, dispatch patterns.
   - Ask User to review the Plan.
   - If modifications needed → Apply and repeat step 4.
   - If approved → Proceed to §3.3 Rules Analysis.

### 3.3 Rules Analysis

Present reasoning under the header **Rules Analysis:** addressing the aspects below.

Perform the following actions per §2.5 `{RULES_FILE}` Standards:
1. Analyze for universal execution patterns across all planning sources:
   - **From the Spec:** execution patterns implied by design decisions, not the design content itself. Specific outputs, formats, values, and schemas defined by design decisions remain in the Spec - they reach Workers through Task Prompts.
   - **From the Plan:** patterns recurring across multiple Task guidance fields.
   - **From gathered context:** workflow preferences, conventions, or quality requirements from Context Gathering not yet captured in the Spec or the Plan. Version control conventions are excluded - the Manager handles those and appends content to Rules during the start of the Implementation Phase.
   - **Classification.** Separate truly universal patterns from Task-specific ones per §2.5 `{RULES_FILE}` Standards. Universal means applicable to every Worker regardless of domain. Most projects produce few genuinely universal rules - project-specific constraints and output specifications belong in the Spec or Task guidance even when they apply to multiple Workers.
   - **Existing standards:** what `{RULES_FILE}` already contains; reference rather than duplicate.
2. Write APM_RULES block to `{RULES_FILE}` per §4.3 APM_RULES Block:
   - If file exists: preserve existing content outside block, append APM_RULES block.
   - If creating new: create file with APM_RULES block only.
3. Pause for User review:
   - State Rules are complete.
   - Ask User to review `{RULES_FILE}` for accuracy.
   - If modifications needed → Apply and repeat step 3.
   - If approved → State Work Breakdown is complete and all planning documents are created. Proceed to `{COMMAND_PATH:apm-1-initiate-planner}` §4 Planning Phase Completion.

---

## 4. Structural Specifications

### 4.1 Spec Format

**Location:** `.apm/spec.md`

**YAML Frontmatter Schema:**
```yaml
---
title: <project name>
modified: <last modification note>
---
```

Below the frontmatter, the document starts with `# APM Spec` followed by two header sections: `## Overview` (3-5 sentences covering project type, core problem, essential scope, and success criteria) and `## Workspace` (project environment from the workspace assessment: directory structure, working repositories, reference repositories, and authoritative document locations). A single horizontal rule separates the header from the design decision content below. No horizontal rules within the content sections - `##` headings provide sufficient visual separation.

- *Planner observations:* Factual observations about version control patterns, workspace conventions, and User preferences noted under `## Workspace` as a blockquote per §2.1 Workflow Context. Format: `> **Notes:** <prose or unordered list>`. These stay in the header, above the separator.

**Content structure.** Free-form below the header. Organize into sections that reflect the project's natural structure - its domains, components, boundaries, or technical concerns. Related design decisions share a section; cross-cutting choices get their own. The Spec should read as a coherent description of what is being built and why, shaped by the project's unique requirements.

**Content rules:** Use markdown headings (`##`) to organize decision groups. Each specification must be concrete and actionable. Structure for extraction - the Manager distills relevant content into individual Task Prompts, so decisions should be locatable and separable. Reference existing User documents rather than duplicating - include file paths and specific sections so the Manager can locate source material during Task Assignment. Use tables for enumerated values, mermaid diagrams for relationships, code blocks for schemas, prose for rationale.

### 4.2 Plan Format

**Location:** `.apm/plan.md`

**YAML Frontmatter Schema:**
```yaml
---
title: <project name>
modified: <last modification note>
---
```

Below the frontmatter, the document starts with `# APM Plan` followed by the Plan header: `## Workers` (table with `| Worker | Domain | Description |`), `## Stages` (table with `| Stage | Name | Tasks | Agents |`), and `## Dependency Graph` (mermaid diagram per **Dependency Graph Format** below). A single horizontal rule separates the header from Stage sections below. No horizontal rules within Stage sections.

- *Planner observations:* Coordination observations (efficient execution opportunities, dependency bottlenecks, workload patterns) noted under `## Dependency Graph` as a blockquote per §2.1 Workflow Context. Format: `> **Notes:** <prose or unordered list>`. These stay in the header, above the separator.

**Stage Format.** Each Stage in the Plan:
- *Header:* `## Stage N: [Name]`
- *Naming:* Stage names reflect domain(s), objectives, and main deliverables.
- *Contents:* Tasks per **Task Format**, each containing steps per **Step Format**.

**Task Format.** Each Task in the Plan:

*Header:* `### Task <N>.<M>: <Title> - <Domain> Agent`

*Contents:*
```markdown
* **Objective:** [Single-sentence Task goal.]
* **Output:** [Concrete deliverables - files, components, artifacts produced.]
* **Validation:** [Concrete pass/fail criteria. Note where User involvement is needed.]
* **Guidance:** [Technical constraints, approach specifications, references to existing patterns, User collaboration patterns.]
* **Dependencies:** [Prior Task outputs required. Format: `Task N.M by <Domain> Agent, ...` Bold cross-agent dependencies. Use "None" when no dependencies exist.]

1. [Step description]
2. [Step description]
```

**Step Format:** Each step is a numbered instruction describing a discrete operation. Include clear, specific instructions that a Worker can execute directly. Reference patterns, files, or prior work when relevant. When investigation, exploration, or research is needed, include a subagent step describing purpose and scope (e.g., "Spawn a debug subagent to isolate the rendering issue" or "Spawn a research subagent to verify the current API authentication patterns").

**Dependency Graph Format:** The Dependency Graph is a mermaid diagram in the Plan header that visualizes Task dependencies, agent assignments, and execution flow. It enables the Manager to identify batch candidates, parallel dispatch opportunities, critical path bottlenecks, and coordination points.

*Graph structure:*
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

The graph makes dispatch patterns visible to the Manager: same-agent chains indicate batch candidates, independent cross-agent nodes indicate parallel candidates, and dotted edges mark cross-agent coordination points where one Worker's output feeds another's input.

*Node format:* `T<Stage>_<Task>["<Task ID> <Title><br/><i><Agent Name></i>"]`

*Edge rules.* Same-agent dependencies use `-->` (solid). Cross-agent dependencies use `-.->` (dotted). Only direct dependencies - do not draw transitive closure.

*Styling:* Assign each agent a consistent fill color across all its Task nodes. Apply colors via `style T<S>_<T> fill:<color>` statements after all subgraphs, ordered by Worker appearance in the Plan Workers field. Use text color #000 and select fill colors with sufficient contrast for readability.

### 4.3 APM_RULES Block

The namespace block structure for `{RULES_FILE}`:

```text
APM_RULES {

[Project-specific standards below]

} //APM_RULES
```

**Content rules:** No content outside the APM_RULES block unless explicitly requested. Use markdown headings (`##`) for categories. Each standard must be concrete and actionable. Only universal execution-level patterns - not architecture decisions, Task-specific guidance, or coordination decisions. Reference existing standards outside the block rather than duplicating.

---

## 5. Content Guidelines

### 5.1 Quality Standards

**Spec:** Design decisions are concrete and traceable to Context Gathering findings. Reference existing User documents rather than duplicating.

**Plan:** Each Task is understandable without external reference. Use specific language - not "implement properly" but the specific pattern to follow. All fields populated. Consistent naming and terminology.

**`{RULES_FILE}`.** Only genuinely universal patterns. Concrete and actionable - each standard specific enough that violation is detectable. If `{RULES_FILE}` already exists, preserve its content and append the APM_RULES block rather than duplicating existing standards. Format selection: tables for pattern comparisons, code blocks for syntax examples, bulleted lists for rules, numbered lists for sequential steps, prose for context.

### 5.2 Common Mistakes
- *Under-specification:* Design decisions left implicit - if it could reasonably go multiple ways, document the chosen direction.
- *Vague validation:* "Works correctly" is not a criterion - specify what "correctly" means concretely.
- *Missing dependencies:* Tasks requiring prior work not marked - trace prerequisites.
- *Misclassified dependencies:* Cross-agent dependencies not bolded, same-agent dependencies incorrectly bolded, or wrong edge types in the Dependency Graph - classify at write time by checking whether producer and consumer share the same agent. Verify during Plan Review.
- *Duplicating source documents:* Restating requirements from User documents instead of referencing the source. The Spec captures design decisions layered on existing requirements.
- *Collapsed phases:* Producing all three documents in one reasoning block instead of following the sequential analyze-write-approve cycle. Each document has a distinct approval gate - the User reviews each before the next begins.
- *Skipped approval gate:* Completing an internal review and proceeding to the next document without pausing for User approval. The Planner's review and the User's approval are separate steps.

---

**End of Guide**
