---
name: artifact-maintenance
description: Assessment and maintenance of Coordination Artifacts (Specifications, Implementation Plan, Standards) based on implementation findings. Defines the Artifact Maintenance Procedure for the Manager Agent.
---

# APM {VERSION} - Artifact Maintenance Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent assesses and maintains Coordination Artifacts during project execution. When a Coordination Decision determines that Coordination Artifact modification is needed, the Manager follows this skill's methodology for assessment, authority determination, and execution.

### 1.1 How to Use This Skill

**Entry Point:** This skill is entered when the Coordination Decision (per `{SKILL_PATH:memory-maintenance/SKILL.md}` §3.5) determines "Coordination Artifact modification needed."

**Execute the Procedure.** The Procedure section contains the sequential actions for Artifact Maintenance. Begin at §3.1 Entry Point and follow through to §3.5 Modification Execution. See §3 Artifact Maintenance Procedure.

**Use Problem Space for reasoning.** When assessing which Coordination Artifacts need modification, analyzing cascade implications, or determining authority scope, consult the relevant reasoning subsection. See §2 Problem Space.

**Use Policies for decisions.** When determining cascade direction, checking modification authority, or ensuring consistency, apply the relevant policy. See §4 Policies.

**Follow Structural References.** When modifying Coordination Artifacts, follow the structural references to maintain format consistency. See §5 Structural Specifications.

### 1.2 Objectives

- Assess which Coordination Artifacts require modifications based on execution findings
- Analyze cascade implications across the Coordination Artifact hierarchy
- Determine modification authority (Manager autonomy vs User collaboration required)
- Execute modifications while maintaining consistency between Coordination Artifacts
- Document modifications with proper attribution to triggering context

### 1.3 Outputs

**Modified Coordination Artifacts:** Updated `Specifications.md`, `Implementation_Plan.md`, or `{AGENTS_FILE}` reflecting execution findings.

**Modification Documentation:** Last Modification field updates in affected Coordination Artifacts, linking modifications to their triggering context.

### 1.4 Coordination Artifact Hierarchy

The Coordination Artifacts form a hierarchy:

- **Specifications** (`Specifications.md`) — Coordination Level, Architectural: Project-specific design decisions and constraints that inform the Implementation Plan. Content structure is determined by project needs.
- **Implementation Plan** (`Implementation_Plan.md`) — Coordination Level, Implementation: Stage and Task breakdown that implements the Specifications. Translates design decisions into executable work units.
- **Standards** (`{AGENTS_FILE}`) — Execution Level: Universal standards for code quality, documentation, workflow preferences, language tone. Applied during Task Execution, not coordination.

**Cascade Patterns:**
- Specifications ↔ Implementation Plan: Bidirectional. Specification modifications often require Implementation Plan adjustments. Implementation Plan modifications during execution may reveal that Specifications need revision.
- Standards: Generally isolated. Standards govern execution quality, not coordination decisions. Downward cascade from Specifications or Implementation Plan to Standards sometimes occurs when coordination modifications require execution-level standard adjustments. Upward cascade from Standards to Specifications or Implementation Plan is very unlikely. See §2.2 Cascade Patterns Reasoning

---

## 2. Problem Space

This section establishes the reasoning approach for Artifact Maintenance. It guides how to identify affected Coordination Artifacts, assess cascade implications, and determine modification authority.

### 2.1 Modification Assessment Reasoning

A Task Memory Log review may reveal findings that indicate Coordination Artifact modifications are needed. Assess which Coordination Artifact(s) need attention based on the nature of the findings.

**Specification Modification Indicators:**
- Design decisions documented in Specifications proved incorrect or incomplete
- Constraints or assumptions in Specifications were invalidated during execution
- New design decisions emerged that should be formally documented
- Execution revealed gaps in Specifications that affect how Tasks should be approached

**Implementation Plan Modification Indicators:**
- Task definitions or instructions are incorrect or incomplete
- Dependencies were missing or incorrectly specified
- Task scope needs adjustment (too broad, too narrow)
- Task Validation needs adjustment (new criteria revealed in findings)
- New Tasks are needed to address discovered requirements
- Tasks should be removed (no longer relevant)
- Stage boundaries need adjustment

**Standards Modification Indicators:**
- Universal conventions need adjustment based on execution experience
- New project-wide standards emerged from Task Execution
- Existing standards conflict with practical execution needs
- Workflow preferences need refinement

**Multiple Coordination Artifact Indicators:**
- Findings span both design and implementation concerns
- An Implementation Plan modification reveals an underlying Specification issue
- Specification modifications require corresponding Implementation Plan adjustments
- Specification and/or Implementation Plan modifications require execution-level Standards adjustments

### 2.2 Cascade Patterns Reasoning

When modifications are needed, consider the hierarchy to determine the appropriate starting point and cascade direction.

**Bidirectional Coordination Assessment:**

Specifications and Implementation Plan are both coordination-level Coordination Artifacts with bidirectional influence:
- Specification modifications often require Implementation Plan adjustments (Tasks implement the design)
- Implementation Plan modifications during execution may reveal that Specifications need revision (implementation informs design)

When findings suggest issues at either level, assess both. An Implementation Plan modification that ignores an underlying Specification issue creates inconsistency. A Specification update that ignores Implementation Plan impact leaves Tasks misaligned.

**Standards Isolation:**

`{AGENTS_FILE}` contains execution-level Standards and is generally isolated from coordination-level Coordination Artifacts:
- Upward cascade from Standards to Implementation Plan or Specifications is very unlikely; Standards govern execution quality, not coordination decisions
- Downward cascade from Implementation Plan or Specifications to Standards sometimes occurs when coordination modifications require execution-level standard adjustments
- If a Standards modification seems to require coordination-level Coordination Artifact updates, reconsider whether it's truly a universal standard or a project-specific decision that belongs in Specifications or the Implementation Plan

**Independence Assessment:**

Not all modifications cascade. Assess whether the modification is isolated or has implications:
- A Task clarification that doesn't affect the design intent requires no Specification update
- A Specification refinement that doesn't change Task scope requires no Implementation Plan update
- A Standards adjustment that doesn't affect coordination approach requires no other updates

**Cascade Scope:**

When cascade is identified:
- Specification modification → Do any Tasks implement the modified specification? Do Task objectives, outputs, or Validation criteria reference the modified design?
- Implementation Plan modification → Does this indicate the design was incomplete or incorrect? Does it represent a scope adjustment that should be reflected in Specifications?
- Coordination modification → Does this require new execution-level standards? Do existing standards conflict with the new coordination direction?

### 2.3 Modification Authority Reasoning

Assess whether modifications are within Manager authority or require User collaboration. This section guides the reasoning approach; decision rules are in §4.2 Modification Authority Policy.

**Authority Scope Assessment:**

Modification authority depends on scope and impact. Consider:
- How many Tasks or Stages are affected?
- Does the modification preserve original intent or change direction?
- Does it require human judgment on trade-offs?
- Would it affect project goals or timeline?

Bounded modifications (single Task, clarification, isolated addition) typically fall within Manager authority. Significant modifications (multiple Tasks, direction change, scope adjustment, restructure) require User collaboration.

**When uncertain about authority scope, prefer User collaboration.** Unauthorized significant modifications create coordination problems that are harder to fix than a brief pause for User input/guidance.

---

## 3. Artifact Maintenance Procedure

This section defines the sequential actions for Artifact Maintenance. Execute this procedure when the Coordination Decision determines Coordination Artifact modification is needed.

**Procedure:**
1. Entry Point (capture triggering context)
2. Modification Assessment (identify affected Coordination Artifacts)
3. Cascade Analysis (assess cross-Coordination Artifact implications)
4. Modification Authority Check (determine Manager authority vs User collaboration)
5. Modification Execution (execute modifications and document)

### 3.1 Entry Point

Execute when arriving from Coordination Decision (per `{SKILL_PATH:memory-maintenance/SKILL.md}` §3.5).
* **Action 1:** Capture the triggering context:
    - Which Task Memory Log or Delegation Memory Log revealed the findings?
    - What specific findings indicate Coordination Artifact modification is needed?
    - Which flags were set (important_findings, compatibility_issues - if any)?
    - What was the Task Status (Partial, Failed, Blocked)?
    - What was the post-investigation outcome that led here?
* **Action 2:** Note initial assessment of affected Coordination Artifacts:
    - Which Coordination Artifact(s) appear to need modification based on the findings?
    - Is this primarily a Specification, Implementation Plan, or Standards issue?
    - Is this a multiple Coordination Artifact issue?
* **Action 3:** Proceed to §3.2 Modification Assessment.

### 3.2 Modification Assessment

Assess which Coordination Artifact(s) need modification and what modifications are needed.
* **Action 1:** Apply §2.1 Modification Assessment Reasoning to confirm affected Coordination Artifacts:
    - Do findings indicate Specification issues?
    - Do findings indicate Implementation Plan issues?
    - Do findings indicate Standards issues?
    - Do findings indicate multiple Coordination Artifact issues?
* **Action 2:** For each affected Coordination Artifact, identify specific modifications needed:
    - What exactly needs to change?
    - What is the current state vs desired state?
    - What is the rationale for the modification (trace to findings)?
* **Action 3:** Proceed to §3.3 Cascade Pattern Analysis.

### 3.3 Cascade Pattern Analysis

Assess whether modifications in the primary Coordination Artifact affect other Coordination Artifacts.
* **Action 1:** Apply §2.2 Cascade Pattern Reasoning to determine if Cascade Pattern Analysis is needed:
    - If Specification modification: Assess Implementation Plan impact; consider whether Standards need adjustment
    - If Implementation Plan modification: Assess whether Specifications should be updated accordingly; consider whether Standards need adjustment
    - If Standards modification: Upward cascade is unlikely, but assess if the modification indicates a coordination issue
* **Action 2:** Apply §4.1 Cascade Pattern Policy to identify cascade scope:
    - What related Coordination Artifacts might be affected?
    - Is the modification isolated or does it have implications?
* **Action 3:** If cascade is identified, note all affected Coordination Artifacts for Modification Execution.
* **Action 4:** Proceed to §3.4 Modification Authority Check.

### 3.4 Modification Authority Check

Determine whether modifications are within Manager authority or require User collaboration.
* **Action 1:** Apply §4.2 Modification Authority Policy to each identified modification:
    - Check the modification against the Authority Thresholds table
    - Assess overall scope considering all modifications together (including cascades)
* **Action 2:** Determine authority outcome:
    - If ALL modifications are within Manager authority → Proceed to §3.5 Modification Execution
    - If ANY modification requires User collaboration → Continue to Action 3
* **Action 3:** When User collaboration is required, present the situation to the User using the following output:
    ```
    I've identified that Coordination Artifact modifications are needed, but the scope requires your input and guidance.

    **What triggered this:** <Brief description of the Memory Log findings and flags>

    **What probably needs to change:**
    - <Coordination Artifact 1>: <Specific modification needed>
    - <Coordination Artifact 2>: <Specific modification needed> (if cascade identified)
    - ... (include if all 3 Coordination Artifacts need modifications)

    **Why this needs your input:** <Explain why this exceeds Manager authority - multiple Tasks affected, design direction, scope change, etc.>

    **Options I see:**
    1. <Option A>: <Description and trade-offs>
    2. <Option B>: <Description and trade-offs>
    3. <Alternative approach if applicable>

    **My recommendation:** <Recommended option with reasoning>

    How would you like to proceed? Are you considering any other approach that I haven't listed?
    ```
* **Action 4:** Upon receiving User guidance:
    - Integrate User's decision into your understanding
    - Adjust modifications based on User's selected option or alternative direction
    - Proceed to §3.5 Modification Execution

### 3.5 Modification Execution

Execute Coordination Artifact modifications and document them.
* **Action 1:** For each affected Coordination Artifact, make the modifications:
    - For Specifications: Follow existing patterns in the document. See §5.1 Specifications Structural Reference
    - For Implementation Plan: Follow the structural formats already defined. See §5.2 Implementation Plan Structural Reference
    - For Standards: Follow existing patterns in the document and keep modifications within APM_STANDARDS namespace block; See §5.3 Standards Structural Reference
* **Action 2:** Apply §4.3 Consistency Policy during execution:
    - Ensure references remain valid after modifications
    - Update or remove broken references
    - Maintain terminology consistency across Coordination Artifacts
* **Action 3:** Document modifications by updating the **Last Modification** field in Specifications and/or Implementation Plan Coordination Artifacts:
    - Format per §5.4 Last Modification Format
    - Link modifications to triggering Memory Log
    - Keep descriptions concise but traceable
* **Action 4:** Return to coordination workflow:
    - Follow the methodology in `{SKILL_PATH:memory-maintenance/SKILL.md}` §3.5 to continue Manager's coordination duties 
    - Apply judgment based on the nature of the modifications and their impact on remaining work

---

## 4. Policies

This section defines the decision rules that govern Artifact Maintenance.

### 4.1 Cascade Pattern Policy

**Decision Domain:** How to handle modifications that might affect multiple Coordination Artifacts.

**Decision Rule:** Assess cascade implications using §2.2 Cascade Patterns Reasoning. When modifying Specifications, assess Implementation Plan impact. When modifying Implementation Plan, assess whether Specifications should be updated. Standards cascade upward very rarely.

**Distinguishing Cascade Need:** Distinguish execution adjustments within design intent (no cascade) from design assumptions that proved incorrect (cascade warranted).

**Default:** When uncertain whether cascade is needed, assess the related Coordination Artifact rather than assuming isolation.

### 4.2 Modification Authority Policy

**Decision Domain:** When Manager can execute modifications autonomously vs when User collaboration is required.

**Decision Rule:** Assess modification scope using §2.3 Modification Authority Reasoning.

**Manager Authority (bounded modifications):**
- Single Task clarification or correction
- Adding missing dependency
- Isolated Specification addition
- Minor Standards adjustment

**User Collaboration Required (significant modifications):**
- Multiple Tasks affected
- Design direction change
- Scope expansion or reduction
- New Stage or major restructure

**Cumulative Scope:** When multiple modifications are identified (including cascades), assess cumulative impact. Multiple small modifications that together represent significant change require User collaboration.

**Default:** When authority is unclear, prefer User collaboration. Brief pause for User input is less costly than unauthorized significant modifications.

### 4.3 Consistency Policy

**Decision Domain:** How to maintain consistency across Coordination Artifacts after modifications.

**Reference Integrity:**

When modifying a Coordination Artifact, check for references from other Coordination Artifacts:
- Implementation Plan Tasks may reference Specification sections
- Specifications may reference external project documents provided by the User
- Specifications may reference defined Standards
- Standards may reference external standards outside the APM_STANDARDS block
- Task dependencies reference other Tasks

After making modifications, verify that all references remain valid; update or remove any that are broken. If new references are introduced by the changes, add them explicitly to ensure all links between Coordination Artifacts are accurate.

**Terminology Consistency:**

When modifying terminology in one Coordination Artifact, check if the same term appears in related Coordination Artifacts. Inconsistent terminology creates confusion during execution.

**Scope Alignment:**

After Implementation Plan modifications, verify that total Task scope still implements the Specification intent. After Specification modifications, verify that the Implementation Plan still covers the design scope.

---

## 5. Structural Specifications

This section defines the structural references for modifying Coordination Artifacts and the format for documenting modifications.

### 5.1 Specifications Structural Reference

When modifying Specifications, maintain consistency with the existing document structure:

**Header Format:**
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

### 5.2 Implementation Plan Structural Reference

When modifying the Implementation Plan, maintain consistency with the formats established during Work Breakdown. Reference `{SKILL_PATH:work-breakdown/SKILL.md}` §5 Structural Specifications:

**Stage Format:**
- Stage header: `## Stage N: [Title]`
- Stages contain Tasks following the Task Format

**Task Format:**
```
### Task <N.M>: [Title] - <Domain> Agent

* **Objective:** Single-sentence Task goal
* **Output:** Concrete deliverables
* **Validation:** Binary pass/fail criteria (Programmatic, Artifact, User types)
* **Guidance:** Technical constraints, approach specifications
* **Dependencies:** Prior Task requirements (format: `Task N.M by <Domain> Agent`)

1. [Step description]
2. [Step description]
...
```

**When Adding Tasks:**
- Follow the Task Format exactly
- Assign appropriate Agent based on domain
- Specify dependencies explicitly
- Include Validation criteria and Guidance matching the Task's deliverable

**When Modifying Tasks:**
- Preserve format structure
- Update dependencies if scope modifications affect them
- Ensure Validation criteria and Guidance match updated objective
- Verify Specifications intent is preserved 

**When Removing Tasks:**
- Check for dependencies from other Tasks
- Update or remove dependent Task references
- Verify Stage still achieves its objective
- Verify Specifications intent is preserved

### 5.3 Standards Structural Reference

When modifying Standards, maintain consistency with the existing file structure:

**APM_STANDARDS Block:**
```
APM_STANDARDS {

[APM-managed standards content]

} //APM_STANDARDS
```

**Content Patterns:**
- Use markdown headings (`##`) for major categories within the block
- Standards must be concrete and actionable (not vague)
- Only include universal standards that apply to all Agents and Tasks
- Keep modifications within the APM_STANDARDS block; content outside the block is user-managed
- Add, remove or update references to external standards outside the APM_STANDARDS block

### 5.4 Last Modification Format

Update the Last Modification field when modifying the Specifications and Implementation Plan Coordination Artifacts:

**Format:**
```
**Last Modification:** [Brief description of modification] based on [Memory Log reference]. Modified by the Manager Agent.
```

**Examples:**
- `Task 2.3 API Authentication Refactor scope clarified based on Task_Log_02_02_API_Integration.md findings. Modified by the Manager Agent.`
- `Authentication flow specification updated based on Delegation_Log_01_01_Debug_Auth.md. Added token refresh requirement. Modified by the Manager Agent.`
- `Added new Task 3.4 Resilience Error Handling based on compatibility issues in Task_Log_03_01_API_Integration.md. Modified by the Manager Agent.`
- `Introduced Task 4.2 Automated Regression Safety Net to address recurring integration issues identified in Task_Log_04_01_Test_Regression.md. Modified by the Manager Agent.`

---

## 6. Content Guidelines

### 6.1 Assessment Quality

- **Trace to source:** Every modification should link to specific findings from Memory Log review or investigation
- **Assess before acting:** Complete Modification Assessment and Cascade Analysis before executing modifications
- **Consider cascade:** Don't update one Coordination Artifact while ignoring implications for related Coordination Artifacts
- **Preserve structure:** Follow existing patterns in each Coordination Artifact; don't introduce inconsistent formatting

### 6.2 Modification Quality

- **Reference sources:** Include the Memory Log reference that triggered the modification
- **Keep documentation concise:** Last Modification should be a summary, not a detailed changelog
- **Maintain consistency:** After modifications, verify references and terminology remain consistent across Coordination Artifacts

### 6.3 Common Mistakes to Avoid

- **Symptom treatment:** Modifying one Coordination Artifact to work around an issue that should be addressed in another
- **Orphaned references:** Removing or renaming items without updating references from other Coordination Artifacts
- **Scope creep:** Making modifications beyond what the findings warrant
- **Missing cascade:** Updating Specifications or Implementation Plan without assessing impact on the other
- **Unauthorized modifications:** Making significant modifications without User collaboration when required
- **Skipping Entry Point:** Jumping into modifications without capturing triggering context from investigarion breaks traceability
- **Inconsistent terminology:** Using different terms for the same concept across Coordination Artifacts

---

**End of Skill**
