---
name: artifact-maintenance
description: Assessment and maintenance of coordination artifacts (Specifications.md, Implementation Plan, {AGENTS_FILE}) based on execution findings. Defines the Artifact Maintenance procedure for the Manager Agent.
---

# APM {VERSION} - Artifact Maintenance Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent assesses and maintains coordination artifacts during project execution. When memory log review reveals findings that affect project artifacts, this skill guides the assessment of what needs updating, the analysis of cascade implications, and the documentation of changes.

### 1.1 How to Use This Skill

**Execute the Procedure.** When memory log review indicates artifact impact (see memory-maintenance §4.1 Log Review Decision Policy), follow the Artifact Maintenance Procedure. See §3 Artifact Maintenance Procedure.

**Use Problem Space for reasoning.** When assessing which artifacts need attention and how changes cascade, consult the relevant reasoning subsection. See §2 Problem Space.

**Use Policies for decisions.** When determining cascade direction or ensuring consistency, apply the relevant policy. See §4 Policies.

**Follow Structural References.** When modifying artifacts, follow the structural references to maintain format consistency. See §5 Structural Specifications.

### 1.2 Objectives

- Assess which coordination artifacts require updates based on execution findings
- Analyze cascade implications across the artifact hierarchy
- Maintain consistency between artifacts when changes occur
- Document changes with proper attribution to triggering context

### 1.3 Outputs

**Updated Artifacts:** Modified `Specifications.md`, `Implementation_Plan.md`, or `{AGENTS_FILE}` with changes reflecting execution findings.

**Change Documentation:** Last Modification field updates in affected artifacts, linking changes to their triggering context.

### 1.4 Artifact Hierarchy

The coordination artifacts form a hierarchy:

- **`Specifications.md`** (Coordination Level - Architectural): Project-specific design decisions and constraints that inform the Implementation Plan. Content structure is determined by project needs—each project defines what specifications are relevant.
- **`Implementation_Plan.md`** (Coordination Level - Implementation): Stage and task breakdown that implements the specifications. Translates design decisions into executable work units.
- **`{AGENTS_FILE}`** (Execution Level - Standards): Universal standards for code quality, documentation, workflow preferences, language tone. Applied during task execution, not coordination.

**Cascade Patterns:**
- Specification ↔ Plan: Bidirectional. Specification changes often require Plan adjustments. Plan changes during execution may also reveal that specifications need revision.
- Standards: Generally isolated. Standards govern execution quality. Upward cascade from Standards to Plan or Specification is very unlikely. Downward cascade from Plan or Specification to Standards sometimes occurs when coordination changes require execution-level standard adjustments.

---

## 2. Problem Space

This section establishes the reasoning approach for artifact maintenance. It guides how to identify affected artifacts, assess cascade implications, and determine change scope.

### 2.1 Change Trigger Reasoning

Memory Log review may reveal findings that suggest artifact updates. Assess which artifact(s) need attention based on the nature of the findings.

**Specification Indicators:**
- Design decisions documented in Specifications proved incorrect or incomplete
- Constraints or assumptions in the Specification were invalidated during execution
- New design decisions emerged that should be formally documented
- Execution revealed gaps in the Specification that affect how tasks should be approached

**Implementation Plan Indicators:**
- Task definitions are incorrect or incomplete
- Dependencies were missing or incorrectly specified
- Task scope needs adjustment (too broad, too narrow)
- Task validation needs adjustment (new criteria revealed in findings)
- New tasks are needed to address discovered requirements
- Tasks should be removed (no longer relevant)
- Stage boundaries need adjustment
- Stage contents need modifications

**Standards Indicators:**
- Universal conventions need adjustment based on execution experience
- New project-wide standards emerged from task execution
- Existing standards conflict with practical execution needs
- Workflow preferences need refinement

**Multiple Artifact Indicators:**
- Findings span both design and implementation concerns
- A Plan change reveals an underlying Specification issue
- Specification changes require corresponding Plan adjustments

### 2.2 Artifact Hierarchy Reasoning

When changes are needed, consider the hierarchy to determine the appropriate starting point and cascade direction.

**Coordination Artifacts (Specification ↔ Plan):**
Specification and Plan are both coordination-level artifacts with bidirectional influence:
- Specification changes often require Plan adjustments (tasks implement the design)
- Plan changes during execution may reveal that Specification needs revision (execution informs design)

When findings suggest issues at either level, assess both. A Plan change that ignores an underlying Specification issue creates inconsistency. A Specification update that ignores Plan impact leaves tasks misaligned.

**Standards Isolation:**
Standards (`{AGENTS_FILE}`) operate at the execution level and are generally isolated from coordination artifacts. Upward cascade from Standards to Plan or Specification is very unlikely—Standards govern execution quality, not coordination decisions. Downward cascade from Plan or Specification to Standards sometimes occurs when coordination changes require execution-level standard adjustments. Standards change when universal execution conventions need adjustment, whether independently or as a result of coordination changes.

**Independence Assessment:**
Not all changes cascade. A task clarification that doesn't affect the design intent requires no Specification update. A Specification refinement that doesn't change task scope requires no Plan update. Assess whether the change is isolated or has implications for related artifacts.

### 2.3 Cascade Assessment Reasoning

When a change in one artifact might affect others, assess the cascade scope.

**Specification Change → Plan Impact:**
When Specifications change, assess Plan impact:
- Do any tasks implement the changed specification?
- Do task objectives, outputs, or validation criteria reference the changed design?
- Do dependencies assume the previous specification?
- Is the new specification not reflected in the current plan?

If yes to any, identify the affected tasks and assess what Plan adjustments are needed.

**Plan Change → Specification Impact:**
When Plan changes, assess whether Specification should also be updated:
- Does the change indicate the design was incomplete or incorrect?
- Does the change represent a scope adjustment that should be reflected in the Specification?
- Did execution reveal new design decisions that should be documented?

If yes to any, update Specification to reflect the new understanding. The Specification should remain an accurate record of design decisions.

**Plan or Specification Change → Standards Impact:**
When Plan or Specification changes, assess whether Standards need adjustment:
- Does the coordination change require new execution-level standards?
- Do existing standards conflict with the new coordination direction?
- Does the change reveal that universal execution conventions need refinement?

If yes to any, update Standards to align with the coordination changes. This downward cascade sometimes occurs when coordination decisions require execution-level standard adjustments.

**Standards Changes:**
Standards changes are generally isolated. When Standards change:
- Upward cascade to Plan or Specification is very unlikely (Standards govern execution, not coordination)
- If a Standards change seems to require coordination artifact updates, reconsider whether it's truly a universal standard or a project-specific decision that belongs in Specification
- Downward cascade from Plan or Specification to Standards sometimes occurs when coordination changes require execution-level standard adjustments

**Isolated Changes:**
Many changes don't cascade:
- Task clarification that preserves the original design intent
- Adding detail to existing specifications without changing the design
- Dependency adjustments that don't affect other tasks
- Standard refinements that don't change the execution approach

### 2.4 Change Scope Reasoning

Assess whether changes are within Manager authority or require User collaboration.

**Authority Reference:** Memory-maintenance §4.2 Coordination Response Policy defines the authoritative Artifact Update Thresholds table. Consult that table to determine Manager authority vs User collaboration requirements.

**Key distinction:**
- Manager authority: Changes that don't significantly affect project direction (single task clarification, adding missing dependency, isolated specification addition, minor standard adjustment)
- User collaboration: Changes that affect multiple tasks, design direction, scope, or project goals

**When uncertain about scope, prefer User collaboration. Unauthorized significant changes create coordination problems.**

### 2.5 Assessment Structure Reasoning

When assessing artifact changes, structure your reasoning around these elements to ensure comprehensive evaluation:

**Reasoning Elements:**
- **Triggering Context:** Which log revealed the findings? What specific observations indicate artifact impact? What flags were set?
- **Affected Artifacts:** Which of `Specifications.md`, `Implementation_Plan.md`, or `{AGENTS_FILE}` need attention based on §2.1 Change Trigger Reasoning?
- **Cascade Analysis:** Do changes in one artifact imply changes in another based on §2.2 and §2.3?
- **Scope Determination:** Is this within Manager authority or does it require User collaboration based on §2.4?
- **Proposed Changes:** What specific changes are needed in each affected artifact?

This reasoning structure guides the Artifact Maintenance Procedure (§3). When User collaboration is required, these elements inform the Coordination Decision Block (memory-maintenance §5.7).

---

## 3. Artifact Maintenance Procedure

This section defines the sequential actions for artifact maintenance. Execute this procedure when memory log review indicates artifact impact (memory-maintenance §4.2 references this skill for bounded-scope and large-scope responses).

**Progression Gates:** Each action must complete before proceeding to the next. For large-scope changes requiring User collaboration, the Manager presents the situation using memory-maintenance §5.7 Coordination Decision Block and awaits guidance before proceeding.

**Procedure:**
1. Change Assessment (assess which artifacts need attention)
2. Cascade Analysis (assess cross-artifact implications)
3. Update Execution (make changes, with User collaboration if required)
4. Change Documentation (update Last Modification fields)

### 3.1 Change Assessment

Assess which artifact(s) need attention based on findings from memory log review.

* **Action 1:** Identify the triggering context:
    - Which Task Memory Log or Delegation Memory Log revealed the findings?
    - What specific findings indicate artifact impact?
    - What flags were set (important_findings, compatibility_issues)?

* **Action 2:** Assess affected artifacts using §2.1 Change Trigger Reasoning:
    - Do findings indicate Specification issues?
    - Do findings indicate Implementation Plan issues?
    - Do findings indicate Standards issues?

* **Action 3:** Determine scope using memory-maintenance §4.2 Artifact Update Thresholds to identify whether changes are within Manager authority or require User collaboration.

### 3.2 Cascade Analysis

Assess whether changes in the primary artifact affect other artifacts.

* **Action 1:** Apply §2.2 Artifact Hierarchy Reasoning to determine if cascade analysis is needed:
    - If Specification change: Assess Plan impact; consider whether Standards need adjustment
    - If Plan change: Assess whether Specification should be updated; consider whether Standards need adjustment
    - If Standards change: Upward cascade to Plan or Specification is very unlikely, but assess if the change indicates a coordination issue

* **Action 2:** Apply §2.3 Cascade Assessment Reasoning to identify cascade scope:
    - What related artifacts might be affected?
    - Is the change isolated or does it have implications?

* **Action 3:** If cascade is identified, note all affected artifacts for Update Execution.

### 3.3 Update Execution

Execute artifact updates based on assessment findings.

* **Action 1:** Confirm authority using memory-maintenance §4.2 Artifact Update Thresholds:
    - If within Manager authority: Proceed with updates
    - If User collaboration required: Present situation using memory-maintenance §5.7 Coordination Decision Block before proceeding

* **Action 2:** Make artifact changes:
    - For `Specifications.md`: Follow existing patterns in the document (see §5.2)
    - For `Implementation_Plan.md`: Follow the structural formats defined in work-breakdown (see §5.1)
    - For `{AGENTS_FILE}`: Follow existing patterns; keep changes within APM_STANDARDS block if present (see §5.3)

* **Action 3:** If cascade was identified, update related artifacts maintaining consistency per §4.2 Consistency Policy.

### 3.4 Change Documentation

Document changes in affected artifacts.

* **Action 1:** Update the **Last Modification** field in each modified artifact:
    - Format: `[Description of change] based on [Task/Delegation Memory Log reference], by the Manager Agent.`
    - Keep descriptions concise but traceable
    - If multiple artifacts were updated, ensure Last Modification fields cross-reference where appropriate

See §5.4 Last Modification Format for examples.

---

## 4. Policies

This section defines the decision rules that govern artifact maintenance.

### 4.1 Hierarchy Cascade Policy

**Decision Domain:** How to handle changes that might affect multiple artifacts.

**Bidirectional Coordination Assessment:**
Specification and Plan influence each other. When changing either:
- Specification change → Assess Plan impact before considering the change complete
- Plan change → Assess whether Specification should be updated to reflect new understanding

Not every Plan change requires Specification update. Distinguish between:
- Execution adjustments within the design intent (no Specification change)
- Design assumptions that proved incorrect or incomplete (Specification change warranted)

**Standards Isolation:**
Standards are generally independent from coordination artifacts. Upward cascade from Standards to Plan or Specification is very unlikely—Standards govern execution quality, not coordination decisions. Downward cascade from Plan or Specification to Standards sometimes occurs when coordination changes require execution-level standard adjustments. Standards change when universal execution conventions need adjustment, whether independently or as a result of coordination changes. If a Standards change seems to require coordination artifact updates, reconsider whether it belongs in Specification instead.

### 4.2 Consistency Policy

**Decision Domain:** How to maintain consistency across artifacts after changes.

**Reference Integrity:**
When changing an artifact, check for references from other artifacts:
- Plan tasks may reference Specification sections
- Specification may reference Standards conventions
- Task dependencies reference other tasks

Ensure references remain valid after changes. Update or remove broken references.

**Terminology Consistency:**
When changing terminology in one artifact, check if the same term appears in related artifacts. Inconsistent terminology creates confusion during execution.

**Scope Alignment:**
After Plan changes, verify that total task scope still implements the Specification intent. After Specification changes, verify that the Plan still covers the design scope.

---

## 5. Structural Specifications

This section defines the structural references for modifying artifacts and the format for documenting changes. When User collaboration is required, the Manager uses memory-maintenance §5.7 Coordination Decision Block.

### 5.1 Implementation Plan Structural Reference

When modifying the Implementation Plan, maintain consistency with the formats established during Work Breakdown. Reference work-breakdown §5 Structural Specifications:

**Stage Format (work-breakdown §5.3):**
- Stage header: `## Stage N: [Name]`
- Stages contain tasks following the Task Format

**Task Format (work-breakdown §5.4):**
```
### Task <N.M>: <Title> - <Domain> Agent

* **Objective:** Single-sentence task goal
* **Output:** Concrete deliverables
* **Validation:** Binary pass/fail criteria (Programmatic, Artifact, User types)
* **Guidance:** Technical constraints, approach specifications
* **Dependencies:** Prior task requirements (format: `Task N.M by <Domain> Agent`)

1. [Step description]
2. [Step description]
...
```

**Step Format (work-breakdown §5.5):**
- Numbered instructions describing discrete operations
- Clear, specific, executable by Agent
- If step requires own validation before proceeding, it indicates task packing—should be separate task

**When Adding Tasks:**
- Follow the Task Format exactly
- Assign appropriate Agent based on domain
- Specify dependencies explicitly
- Include validation criteria matching the task's deliverable

**When Modifying Tasks:**
- Preserve format structure
- Update dependencies if scope changes affect them
- Ensure validation criteria match updated objective

**When Removing Tasks:**
- Check for dependencies from other tasks
- Update or remove dependent task references
- Verify stage still achieves its objective

### 5.2 Specifications.md Structural Reference

When modifying Specifications, maintain consistency with the existing document structure:

**Header Format (work-breakdown §5.2):**
```markdown
# <Project Name> – APM Specifications
**Last Modification:** [Date and description]

---

[Specification content]
```

**Content Patterns:**
- Use markdown headings (`##`) for major categories
- Maintain specificity—each specification should be concrete and actionable
- Reference existing documents rather than duplicating content
- Preserve existing section organization when adding content

### 5.3 {AGENTS_FILE} Structural Reference

When modifying Standards, maintain consistency with the existing file structure:

**APM_STANDARDS Block (work-breakdown §5.1):**
```
APM_STANDARDS {

[APM-managed standards content]

} //APM_STANDARDS
```

**Content Patterns:**
- Use markdown headings (`##`) for major categories within the block
- Standards must be concrete and actionable (not vague)
- Only include universal standards that apply to all Agents and tasks
- Keep changes within the APM_STANDARDS block; content outside the block is user-managed

### 5.4 Last Modification Format

Update the Last Modification field when modifying artifacts:

**Format:**
```
**Last Modification:** [Brief description of change] based on [Log reference], by the Manager Agent.
```

**Examples:**
- `Task 2.3 scope clarified based on Task_Log_02_02_API_Integration.md findings.`
- `Authentication flow specification updated based on Delegation_Log_01_01_Debug_Auth.md. Added token refresh requirement.`
- `Added new Task 3.4 for error handling based on compatibility issues in Task_Log_03_01_Validation.md.`

---

## 6. Content Guidelines

### 6.1 Assessment Quality

- **Trace to source:** Every change should link to a specific finding from memory log review
- **Assess before acting:** Complete Change Assessment before making modifications
- **Consider cascade:** Don't update one artifact while ignoring implications for related artifacts
- **Preserve structure:** Follow existing patterns in each artifact; don't introduce inconsistent formatting

### 6.2 Change Documentation

- **Be specific:** "Updated Task 2.3 objective" is better than "Made changes to Plan"
- **Reference sources:** Include the log reference that triggered the change
- **Keep it concise:** Last Modification should be a summary, not a detailed changelog

### 6.3 Common Mistakes to Avoid

- **Symptom treatment:** Changing one artifact to work around an issue that should be addressed in another
- **Orphaned references:** Removing or renaming items without updating references from other artifacts
- **Scope creep:** Making changes beyond what the findings warrant
- **Missing cascade:** Updating Specification or Plan without assessing impact on the other
- **Unauthorized changes:** Making significant changes without User collaboration when required

---

**End of Skill**
