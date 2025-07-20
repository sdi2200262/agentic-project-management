# APM v0.4 - Implementation Plan Review Guide
This guide defines mandatory post-creation validation procedures for Implementation Plans. Use this guide immediately after creating an Implementation Plan to force systematic detection of structural violations and ensure compliance with decomposition principles defined in `Implementation_Plan_Creation_Guide.md`.

---

## 1. Review Execution Requirements
This review is MANDATORY and must be completed systematically. No validation step can be skipped.

### Mandatory Validation Protocol
1. **Data Extraction**: Extract specific measurable data from your created plan
2. **Pattern Detection**: Identify uniformity, repetition, or standardization patterns
3. **Guide Principle Re-Application**: Re-apply original guide criteria to detected patterns
4. **Violation Documentation**: Document violations where plan doesn't match guide principles
5. **Systematic Revision**: Apply guide principles to correct all identified violations

### Context Synthesis Compliance Check
Before proceeding, confirm your plan addresses retained Context Synthesis insights:
- List how challenging areas (Shadcn integration, design replication) are addressed in task scope
- Confirm sequential workflow patterns are honored in task dependencies
- Verify user preferences (simplicity, GitHub Pages, commit tracking) are reflected in plan structure

---

## 2. Phase Organization Data Extraction (§2.1 Reference)

### Mandatory Phase Analysis
**Extract phase data**: List each phase with objective count:
- Phase 1: [Name] - [X] tasks
- Phase 2: [Name] - [Y] tasks  
- Phase 3: [Name] - [Z] tasks
- Phase 4: [Name] - [W] tasks

**Pattern Detection**: If any phases have identical task counts, apply §2.1 Phase Boundary Guidelines to each phase independently and verify natural boundaries.

**Dependency Verification**: For each phase transition, apply §2.1 Sequential Pattern Validation - quote specific outputs from previous phase that next phase requires per retained workflow dependencies.

---

## 3. Task Scope Boundary Extraction (§2.2 Reference)

### Mandatory Objective Analysis
**List each task objective**: Extract the exact objective statement for each task:
- Task X.Y: "[Quote exact objective]"
- Task X.Z: "[Quote exact objective]"

**Multiple Objective Detection**: If any task objective contains multiple goals, apply §2.2 Objective Decomposition principle - assess whether each goal represents a separate achievable objective.

**Completion Unit Validation**: For each task, apply §2.2 Unit of Work Decomposition - verify task delivers independent value as one focused completion unit.

### Packed Task Detection Protocol
**Extract task components**: For each task, list all subtask activities:
- Task X.Y: Activity A, Activity B, Activity C, Activity D
- Task X.Z: Activity A, Activity B, Activity C

**Parallel Activity Test**: For each task with multiple activities, apply §2.2 Parallel Activity Detection criteria - determine if activities can be completed independently by different agents on different days. If yes, violation of Unit of Work principle detected.

---

## 4. Subtask Format Classification Verification (§2.3 Reference)

### Mandatory Format Data Extraction
**List format types**: Extract format used for each task:
- Task 1.1: [Multi-step/Single-step] - [X] items
- Task 1.2: [Multi-step/Single-step] - [Y] items
- Task 2.1: [Multi-step/Single-step] - [Z] items
- [Continue for all tasks]

### Step Count Pattern Detection
**Count analysis**: After listing above, apply §2.3 Natural Step Count Principles:
- If more than 50% of tasks have identical item counts: Apply §2.3 Template Matching Prevention - re-assess each task's organic workflow structure independently
- If ALL tasks have identical item counts: This violates §2.3 "Do not standardize step counts across tasks" - mandatory revision required

### Format Logic Verification
**Multi-step validation**: For each multi-step task, apply §2.3 Sequential Dependency Test:
- Re-verify: "Does Subtask B become impossible or meaningless without Subtask A completion?" 
- Quote specific evidence of sequential dependencies for each step transition

**Single-step validation**: For each single-step task, apply §2.3 Simultaneous Approach Test:
- Re-verify: "Can all subtask activities be approached within one focused exchange?"
- Quote evidence that no "first this, then that" progression is required

**Format Misclassification Detection**: If single-step tasks contain apparent sequential patterns, apply §2.3 Format Decision Logic - verify no user confirmation benefits exist between activities.

---

## 5. Task Dependencies Data Extraction (§2.4 Reference)

### Mandatory Dependency Analysis
**List all dependencies**: Extract every "Depends on: Task X.Y Output" declaration:
- Task A.B depends on: [List all dependencies or "None"]
- Task C.D depends on: [List all dependencies or "None"]

**Missing Dependency Detection**: For each task, apply §2.4 Dependency Assessment Criteria:
- Apply "Does Task A need Task B's output to begin or succeed?" test to all task pairs
- For any task requiring previous outputs without dependency declaration: Document violation

**Cross-Agent Dependency Verification**: Apply §2.4 Producer-Consumer Relationship requirements - verify proper Output field specifications and "Depends on: Task X.Y Output" declarations for all cross-agent coordination.

---

## 6. Task Execution Scope Verification (§2.5 Reference)

### Mandatory External Action Detection
**List external platform actions**: For each task, apply §2.5 External Platform Action Identification criteria:
- Apply "Does this require accessing interfaces outside the IDE environment?" test
- Apply "Does this require user authentication or account permissions?" test
- Apply "Does this involve navigating web interfaces or settings panels?" test

**Task Language Audit**: Apply §2.5 Guidance Task Approach principles:
- Identify any task language using execution verbs ("configure," "deploy," "setup") for external platforms
- Apply Language Patterns principle - verify use of "guide," "provide instructions," "prepare documentation" for external actions

---

## 7. Agent Assignment Pattern Analysis (§2.6 Reference)

### Mandatory Agent Distribution Extract
**List agent assignments**: Extract all agent assignments with task counts:
- Agent_X: Tasks [list] - [count] total
- Agent_Y: Tasks [list] - [count] total

**Domain Boundary Verification**: For each agent, apply §2.6 Domain Separation Guidelines:
- Apply "Do tasks require fundamentally different mental models or skill sets?" test
- Verify all assigned tasks match retained domain boundaries from Context Synthesis

**Context Switching Detection**: Apply §2.6 Context Preservation principle - identify any agents handling tasks requiring different technical domains.

---

## 8. Ad-Hoc Delegation Requirements Check (§2.3 Reference)

### Research Opportunity Detection
**Technology Assessment**: For each task involving current technologies, apply §2.3 Ad-Hoc Delegation Assessment:
- Apply "Do tasks involve technologies, APIs, or approaches that may require current documentation research?" criteria
- Apply "Would dedicated research significantly improve Implementation Agent success?" test

**Investigation Requirement Assessment**: For tasks marked as challenging in Context Synthesis, apply §2.3 Research Delegation criteria to verify adequate preparation.

---

## 9. Template Matching Detection Protocol

### Mandatory Pattern Analysis
**Extract all numerical patterns**:
- Step counts across all tasks: [List exact numbers]
- Subtask counts per format type: Single-step: [counts], Multi-step: [counts]
- Agent task distribution: [List task counts per agent]

**Uniformity Detection**: If ANY identical patterns exist across 60%+ of tasks:
- Apply §2.3 Template Matching Prevention: "Do not standardize step counts across tasks"
- Apply §2.3 Natural Workflow principle: "Let task complexity follow actual requirements, avoid forcing artificial consistency"
- If patterns violate these principles: Mandatory revision required

### Artificial Consistency Check
**Apply §2.3 Organic Structure principles**: Re-assess each task independently using §2.3 Natural Step Count Principles - verify step counts reflect actual workflow requirements rather than predetermined patterns.

---

## 10. Mandatory Revision Protocol

### Violation Processing
**Document all violations**: List every violation where plan doesn't comply with specific guide principles identified above.

**Priority Revision Order**:
1. Template matching patterns (§2.3 violations)
2. Format misclassifications (§2.3 Sequential Dependency Test failures)
3. Missing dependencies (§2.4 criteria violations)
4. Task scope violations (§2.2 Unit of Work violations)

### Change Implementation Requirements
**For each violation**:
- Re-apply the specific violated guide principle correctly
- Document which §X.Y principle was applied to make the correction
- Re-verify the correction complies with guide criteria

**Completion Verification**: After all revisions, re-run steps 4-9 using guide principle re-application to confirm all violations are resolved.

---

**Validation cannot be considered complete until all guide principles are properly re-applied and compliance is verified through systematic re-assessment.**