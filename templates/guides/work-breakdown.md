# APM {VERSION} - Work Breakdown Guide

## 1. Overview

**Reading Agent:** Planner

This guide defines the process for Work Breakdown, which transforms gathered context into planning documents (Spec, Plan, and Rules) through visible reasoning (chain-of-thought) - thinking visibly in chat before committing to files.

### 1.1 How to Use This Guide

See §3 Work Breakdown Procedure - execute sequentially. See §2 Operational Standards for decomposition decisions, specification reasoning, plan assessment, and standards extraction. Communication with the User and visible reasoning per `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication.

### 1.2 Objectives

- Translate gathered context into actionable project structure.
- Define Workers based on domain organization.
- Create Tasks with clear objectives, outputs, validation criteria, and dependencies.
- Establish Rules for consistent execution.

### 1.3 Outputs

- *Spec:* Design decisions and constraints that define what is being built. Free-form structure determined by project needs.
- *Plan:* Stage and Task breakdown with agent assignments, validation criteria, dependency chains, and Dependency Graph.
- *`{RULES_FILE}`:* Universal execution-level Rules applied during Task execution.

**Artifact visibility - design for the consumer:**
- *Spec and Plan:* Manager reads directly. Workers do not reference these files - the Manager extracts relevant content into Task Prompts, making them self-contained, and uses the Plan for dispatch and progress tracking. Write for coordination needs - organization, cross-referencing, and extraction efficiency.
- *`{RULES_FILE}`:* Workers access directly during Task execution. Write standards so they are self-contained and actionable without Spec or Plan context.

**Completeness:** All context gathered during Context Gathering must be captured across these three artifacts. Design decisions that shape the project go to the Spec. Implementation details, constraints, domain-specific patterns, and validation specifics go to Task guidance fields in the Plan. Universal execution patterns go to Rules. If gathered context would be lost between artifacts, it is missing from Task guidance.

### 1.4 Scope Adaptation

Decomposition granularity adapts to project size and complexity. Stages, Tasks, and steps are relative concepts - smaller projects warrant lighter breakdown, larger projects may need more detail. Let the actual scope and requirements guide how work units are identified and organized.

---

## 2. Operational Standards

### 2.1 Decomposition Principles

These principles apply across all decomposition levels. Apply with judgment adapted to project scope per §1.4 Scope Adaptation.

**Domains:** Identify logical work domains from Context Gathering. Split when domains involve different expertise or mental models. Combine when domains share tight context and dependencies. When balanced, prefer separation. Integrate User preferences.

**Stages:** Sequential milestone groupings - Stage N+1 begins after Stage N completes. Each Stage delivers coherent value. Split when work streams are unrelated or intermediate deliverables block subsequent work. Combine when separation is artificial. When balanced, prefer fewer Stages with clear milestones. When domains can work in parallel, structure that as parallel Tasks within a single Stage rather than parallel Stages.

**Tasks:** Derive from Stage objectives. Each Task produces a meaningful deliverable, scoped to one agent's domain, with specified validation criteria. Split when a Task spans domains or bundles unrelated deliverables. Combine when micro-tasks create overhead without value. Include subagent steps for investigation or research.

**Steps:** Organize work within a Task for failure tracing. Ordered, discrete, sharing the Task's validation. If a step needs independent validation, split the Task.

**Scope boundaries:** Agent-assignable work is completable within the development environment with autonomous or artifact-based validation. User coordination involves external platforms, credentials, or validation outside the environment - include explicit coordination steps and mark user validation.

**Validation criteria:** Each Task specifies validation: programmatic (automated checks), artifact (output existence and structure), or user (human judgment). Programmatic and artifact allow autonomous iteration; user validation requires pausing. Most Tasks combine multiple approaches. Validation criteria are Worker-scoped - no references to other Stages, Tasks, or coordination-level gates. Workers validate their own deliverables; Stage coordination is the Manager's concern.

### 2.2 Spec Standards

The Spec defines what is being built - design decisions, constraints, and requirements that shape the deliverable. It forms the foundation the Plan builds on: every design decision captured here has corresponding Tasks in the Plan that implement it.

The test for each candidate: would changing this decision reshape the project's design, or only affect a single scope of work? Project-shaping decisions - choices where alternatives existed, affecting what is being built across the project - belong here. Single-scope details and universal execution patterns do not. Within a design topic, capture the decision - not its implementation mechanics. If changing a detail does not change the decision, the detail belongs in Task Guidance. When User documents already authoritatively define requirements, reference them - the Spec captures design decisions layered on existing requirements, not restate them. When the workspace contains multiple repositories or codebases, capture workspace structure in the Spec - which repository is the working target, which are read-only references, and where Workers operate. Structure the Spec so design decisions can be extracted per-Task - the Manager distills relevant content into individual Task Prompts.

### 2.3 Plan Standards

The Plan defines how work is organized - Stages, Tasks, agent assignments, dependencies, and validation criteria. The Manager uses it for dispatch decisions, dependency analysis, coordination, and progress tracking.

**What belongs:** Task-level coordination - objectives, deliverables, agent assignments, validation criteria, dependencies, step-by-step guidance. **What does not:** Design decisions across Tasks (Spec), universal execution patterns (Rules).

**Task self-sufficiency:** Each Task must contain enough context for a Worker to execute from a Task Prompt alone per §1.3 Outputs.

Guidance may reference authoritative sources by path - the Manager reads those sources and integrates relevant content into the Task Prompt. Steps describe the Worker's sequential operations - the Manager transforms them into actionable instructions enriched with Spec content and Guidance.

**Dispatch-aware structuring** → When assignments and Task ordering could go multiple ways, prefer arrangements that maximize dispatch opportunities. Three dispatch modes exist:

- *Batch:* same-agent Task groups dispatchable together (sequential chains or independent groups).
- *Parallel:* independent dispatch units for different agents, dispatchable simultaneously.
- *Single:* a lone Ready Task with no batch or parallel partners.

All three patterns are valid. Structure the Plan to create natural opportunities across all of them rather than forcing one pattern.

### 2.4 `{RULES_FILE}` Standards

`{RULES_FILE}` defines how work is performed - universal execution patterns across all Tasks. Workers access it directly during Task execution.

The test for each candidate: does it describe how work is performed, or what is being built? Output formats, response strings, data schemas, and interface contracts define what is being built - they belong in the Spec even when multiple Workers need them. For candidates that pass as execution patterns: does the pattern apply to every Worker regardless of domain? All Workers read the same file - if the pattern only applies to one domain, it does not belong here.

When uncertain whether something qualifies, prefer placing it in Task guidance - easier to promote later than to demote.

**Self-containedness:** Workers' working context is intentionally scoped to their Task Prompt and `{RULES_FILE}` - the Spec, Plan, and external design artifacts are omitted by design. Standards referencing those documents undermine that scoping. Embed content directly.

---

## 3. Work Breakdown Procedure

Complete each section before proceeding to the next. Present reasoning in chat before writing files - explain your thinking about domain boundaries, Task decomposition, dependency rationale, and specification decisions so the User can follow your logic and redirect before artifacts are written. Cover these aspects when they apply: what you are analyzing and why, key decisions and reasoning, how Context Gathering findings inform each decision, dependencies or risks worth noting. Chat reasoning transforms into structured file entries per §4 Structural Specifications.

**Procedure:**
1. Analyze requirements and write the Spec → set header, write Spec, pause for User approval.
2. Organize work into the Plan → set header, domain analysis, Stage analysis, per-Stage Task breakdown, Plan review, pause for User approval.
3. Define Rules → write Rules, pause for User approval, procedure completion.

### 3.1 Spec Analysis

Perform the following actions per §2.2 Spec Standards.

**Spec Header:**
1. Set `title` in `.apm/spec.md` YAML frontmatter to the project name.
2. Set `modified` field: "Spec creation by the Planner."
3. Fill the `## Overview` section: 3-5 sentences (project type, core problem, essential scope, success criteria).

**Spec Content:**
1. Analyze design decisions from gathered context. Present reasoning in chat:
   - *Design decisions:* each explicit choice and implicit constraint embedded in requirements: what was decided, what alternatives existed, why this direction. Surface assumptions stated as facts that represent actual decisions.
   - *Source documents:* which requirements already have authoritative definitions in User documents; reference rather than duplicate.
   - *Boundary calls:* for each candidate, determine its primary location: Spec (project-level design decisions), Task guidance (Task-scoped details, validation approach, single-domain constraints), or Rules (universal execution patterns). Each item belongs in one primary location. Items are placed during the Plan and Rules Analysis phases.
   - *Decision relationships:* decisions that cascade, constrain, or cluster naturally together.
   - *Structure rationale:* how to organize decisions so the Manager can extract relevant content per Task.
2. Add specification content per §4.1 Spec Format. Let structure follow the decisions identified.
3. Pause for User review:
   - State the Spec is complete and the artifact is created.
   - Ask User to review for accuracy.
   - If modifications needed → Apply and repeat step 3.
   - If approved → Proceed to §3.2 Plan Analysis.

### 3.2 Plan Analysis

Perform the following actions per §2.3 Plan Standards.

**Plan Header:**
1. Set `title` in `.apm/plan.md` YAML frontmatter to the project name (same as Spec).
2. Set `modified` field: "Plan creation by the Planner."

**Domain Analysis** → Perform the following actions per §2.1 Decomposition Principles:
1. Present domain organization reasoning in chat, grounded in the Spec approved above:
   - *Domains identified:* logical work domains and their scope.
   - *Separation rationale:* why domains are separated or combined.
   - *Agent mapping:* how domains map to Workers with proposed names and responsibilities.
2. Update Plan header Agents field.

**Stage Analysis** → Identify all Stages and their Tasks upfront per §2.1 Decomposition Principles:
1. Present stage structure reasoning in chat:
   - *Stage objectives:* what each Stage delivers and its boundary rationale.
   - *Task overview:* identified Tasks per Stage with brief descriptions.
2. Update Plan header Stages field.

**Per-Stage Task Analysis** → For each Stage in order:
1. State context: User requirements and constraints influencing this Stage.
2. For each Task, reason through:
   - *Agent assignment:* which agent and why.
   - *Task Scope:* what is the Task's scope? Is the User involved in any of the Task's steps?
   - *Task Guidance:* what implementation context does this Worker need? Domain-specific patterns (how to structure code, existing patterns to follow), constraints (performance, security, dependencies), technical decisions (library choices, API contracts), single-domain details (validation approach, testing strategy, error handling specifics). Include context classified as Task-scoped per §3.1 Spec Analysis.
   - *Task Validation:* approaches selected from programmatic, artifact, and user (per §4.2 Plan Format), with rationale for inclusion or exclusion. Validation criteria co-define the Task with Guidance.
   - *Dependencies:* enumerate every dependency. Same-agent: `Task N.M` format. Cross-agent: **`Task N.M by <Agent>`** (bolded), specifying the deliverable at the boundary.
   - *Steps:* ordered operations with purpose building towards Task completion.
   Use more detail for complex Tasks and less for straightforward ones. Include all required dimensions. After reasoning through all Tasks in the Stage, assess whether each Task represents independently validatable work per §2.1 Decomposition Principles - combined scopes that need separate validation indicate further decomposition.

**Plan Write** → Write the full Plan per §4.2 Plan Format. Enrich Task details from reasoning. Ensure every cross-agent dependency is bolded at write time. After the write, continue to **Plan Review**.

**Plan Review** → After writing the Plan to file, do an additional review of the final document per §2.3 Plan Standards:
1. *Workload assessment:* Count Tasks per agent. Flag agents with disproportionately large workloads relative to other agents for subdivision review. If subdividing, present reasoning:
   - Sub-domain boundaries - where to split and why.
   - Agent coherence - how sub-agents maintain clear, focused domains.
   Update Plan assignments and emergent Task dependencies.
2. *Cross-agent dependency review:* Verify all cross-agent dependencies are correctly identified and bolded. Cross-check agent assignments - if a dependency's producer differs from the consumer's agent, it must be bolded. Present reasoning:
   - Dependency audit - list every dependency, classify each, flag misclassified entries.
   - Cross-agent chains - provider, consumer, agents, required deliverable.
   - Risk assessment - bottlenecks or coordination complexity.
   Fix any misclassified dependencies.
3. *Dependency Graph generation:* Generate a mermaid graph per §4.2 Plan Format using finalized Tasks, agent assignments, and dependencies. For each edge, verify the type matches: `-->` for same-agent, `-.->` for cross-agent. Write to Plan header.
4. *Plan summary:* Present in chat: agent count, Stage count with names and Task counts, total Tasks, cross-agent dependency count.
5. Pause for User review:
   - State the Plan is complete.
   - Ask User to review the Plan.
   - If modifications needed → Apply and repeat step 5.
   - If approved → Proceed to §3.3 Rules Analysis.

### 3.3 Rules Analysis

Perform the following actions per §2.4 `{RULES_FILE}` Standards:
1. Analyze for universal execution patterns across all planning sources. Present reasoning:
   - **From the Spec:** execution patterns implied by design decisions, not the design content itself. Specific outputs, formats, values, and schemas defined by design decisions remain in the Spec - they reach Workers through Task Prompts.
   - **From the Plan:** patterns recurring across multiple Task guidance fields.
   - **From gathered context:** workflow preferences, conventions, or quality requirements from Context Gathering not yet captured in the Spec or the Plan.
   - **Version control conventions:** commit format and branch naming conventions detected during Context Gathering, specified by the User, or found in existing `{RULES_FILE}` content or project documentation. If no conventions were detected or specified, propose lightweight defaults: `type: description` commits (feat, fix, refactor, docs, test, chore) and `type/short-description` branches (e.g. `feat/user-authentication`). APM does not push to remotes by default; note this and ask if the User wants otherwise. If the User declines version control entirely, flag that parallel dispatch will be unavailable and record the decision. Version control questions are folded into other Round 3 questions or follow-ups, never standalone.
   - **Classification:** which candidates are truly universal vs Task-specific; whether each is self-contained for Workers with no access to the Spec or the Plan. Universal means applicable to every Worker regardless of domain - test each: does it apply to all Workers, or only specific domains? Most projects produce few genuinely universal rules beyond the framework rules below. Project-specific constraints and output specifications belong in the Spec or Task guidance even when they apply to multiple Workers.
   - **Framework rules:** Retain the Framework Rules section from §4.3 APM_RULES Block as-is. Add project-specific standards after it.
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

Spec content follows the YAML frontmatter in `.apm/spec.md`. Structure is free-form - organize around the decisions themselves, not predefined categories or conventional headings. Let the project's actual design landscape shape the document: decisions that cluster naturally share a section, decisions that stand alone get their own. Different projects produce differently structured Specs. Do not pattern-match to common templates (e.g., "Architecture," "Data Model," "API Design") when the project's decisions do not naturally group that way.

**Content rules:** Use markdown headings (`##`) to organize decision groups. Each specification must be concrete and actionable. Structure for extraction - the Manager distills relevant content into individual Task Prompts, so decisions should be locatable and separable. Reference existing User documents rather than duplicating - include file paths and specific sections so the Manager can locate source material during Task Assignment. Use tables for enumerated values, mermaid diagrams for relationships, code blocks for schemas, prose for rationale.

### 4.2 Plan Format

**Plan Header Format** → The Plan header precedes all Stages:
- *Project name:* from the Spec title.
- *Agents table:* `| Agent ID | Domain | Description |` - one row per agent.
- *Stages table:* `| Stage | Name | Tasks | Agents |` - one row per Stage.
- *Dependency Graph:* per **Dependency Graph Format** below.

**Stage Format** → Each Stage in the Plan:
- *Header:* `## Stage N: [Name]`
- *Naming:* Stage names reflect domain(s), objectives, and main deliverables.
- *Contents:* Tasks per **Task Format**, each containing steps per **Step Format**.

**Task Format** → Each Task in the Plan:

*Header:* `### Task <N>.<M>: <Title> - <Domain> Agent`

*Contents:*
```markdown
* **Objective:** [Single-sentence Task goal.]
* **Output:** [Concrete deliverables - files, components, artifacts produced.]
* **Validation:** [Binary pass/fail criteria with approach(es): Programmatic, Artifact, and/or User.]
* **Guidance:** [Technical constraints, approach specifications, references to existing patterns, User collaboration patterns.]
* **Dependencies:** [Prior task outputs required. Format: `Task N.M by <Domain> Agent, ...` Bold cross-agent dependencies. Use "None" when no dependencies exist.]

1. [Step description]
2. [Step description]
```

**Step Format:** Each step is a numbered instruction describing a discrete operation. Include clear, specific instructions that an agent can execute directly. Reference patterns, files, or prior work when relevant. When investigation, exploration, or research is needed, include a subagent step describing purpose and scope (e.g., "Spawn a debug subagent to isolate the rendering issue" or "Spawn a research subagent to verify the current API authentication patterns").

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

Dispatch patterns visible from the graph per §2.3 Plan Standards:
- *Batch candidates:* same-agent Task groups (e.g., T1_1 → T1_2 → T1_3, all same agent).
- *Parallel candidates:* independent Tasks assigned to different agents (e.g., T2_1 and T2_2 above), dispatchable simultaneously.
- *Cross-agent coordination points:* dotted arrows (e.g., T1_2 -.-> T2_1) indicate where one agent's output feeds another agent's input.
- *Single dispatch:* a lone Ready Task with no batch or parallel partners.

*Node format:* `T<Stage>_<Task>["<Task ID> <Title><br/><i><Agent Name></i>"]`

*Edge rules:* Same-agent dependency: `-->` (solid). Cross-agent dependency: `-.->` (dotted). Only direct dependencies - do not draw transitive closure.

*Styling:* Assign each agent a consistent fill color across all its Task nodes. Apply colors via `style T<S>_<T> fill:<color>` statements after all subgraphs, ordered by agent appearance in the Plan Agents field. Use text color #000 and select fill colors with sufficient contrast for readability.

### 4.3 APM_RULES Block

The namespace block structure for `{RULES_FILE}`:

```text
APM_RULES {

[Project-specific standards below]

} //APM_RULES
```

**Content rules:** No content outside the APM_RULES block unless explicitly requested. Use markdown headings (`##`) for categories. Each standard must be concrete and actionable. Only universal execution-level patterns - not architecture decisions, Task-specific guidance, or coordination decisions. Reference existing standards outside the block rather than duplicating.

**Format selection:** Tables for pattern comparisons, code blocks for syntax examples, bulleted lists for rules, numbered lists for sequential steps, prose for context.

---

## 5. Content Guidelines

### 5.1 Quality Standards

**Spec:** Design decisions are concrete and traceable to Context Gathering findings. Reference existing User documents rather than duplicating.

**Plan:** Each Task is understandable without external reference. Use specific language - not "implement properly" but the specific pattern to follow. All fields populated. Consistent naming and terminology.

**`{RULES_FILE}`:** Only genuinely universal patterns. Concrete and actionable - each standard specific enough that violation is detectable. If `{RULES_FILE}` already exists, preserve its content and append the APM_RULES block rather than duplicating existing standards.

### 5.2 Common Mistakes

- *Over-specification:* Implementation details in the Spec that belong in Task guidance - if it only affects one Task, it's Task guidance.
- *Under-specification:* Design decisions left implicit - if it could reasonably go multiple ways, document the chosen direction.
- *Task packing:* Multiple unrelated deliverables in one Task - split them.
- *Over-decomposition:* Excessive small Tasks - combine when they share context and validation.
- *Vague validation:* "Works correctly" - specify what "correctly" means concretely.
- *Missing dependencies:* Tasks requiring prior work not marked - trace prerequisites.
- *Misclassified dependencies:* Cross-agent dependencies not bolded, same-agent dependencies incorrectly bolded, or wrong edge types in the Dependency Graph (`-->` vs `-.->`) - classify at write time by checking whether producer and consumer share the same agent per §3.2 Plan Analysis. Verify during plan review.
- *Duplicating source documents:* Restating requirements from User documents (PRD, specifications) instead of referencing the source. The Spec captures design decisions layered on existing requirements.
- *Non-universal standards:* Task-specific patterns elevated to `{RULES_FILE}` - if it only applies to some Tasks, it's Task guidance.
- *Output specifications as standards:* Elevating response formats, error strings, or interface contracts to `{RULES_FILE}`. These define what is being built and belong in the Spec - universality across Workers does not make them execution patterns.
- *Standards referencing external documents:* The Spec, Plan, and design artifacts are intentionally omitted from Workers' context - referencing them from `{RULES_FILE}` undermines that scoping. See §2.4 `{RULES_FILE}` Standards.

---

**End of Guide**
