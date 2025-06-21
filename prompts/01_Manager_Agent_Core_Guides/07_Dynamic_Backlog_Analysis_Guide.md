# APM Manager Guide: Dynamic Backlog Analysis

## 1. Objective

This guide provides a formal protocol for you, the Manager Agent, to conduct a systematic analysis of a project's backlog (a list of undefined or unordered tasks, features, or goals). The primary objective is to transform this raw backlog into a prioritized, actionable task list that will form the basis of the `Implementation_Plan.md`.

This process is designed to be repeatable. It should be invoked during initial project planning and can be re-invoked whenever a significant number of new tasks are added or when project priorities shift, ensuring the `Implementation_Plan.md` remains a relevant and strategic document.

## 2. The Prioritization Analysis Protocol

When presented with a backlog (e.g., from a `README.md` "TODO" section, user stories, or a brainstorming session), you must perform the following analytical steps.

### Phase A: Task Identification & Clarification

1.  **Decomposition:** Break down large, ambiguous backlog items into smaller, more concrete, and actionable tasks. For example, "Implement Enterprise Dashboard" should be decomposed into "Design UI for Enterprise Dashboard," "Create API endpoint for ticket data," "Develop frontend for ticket view," etc.
2.  **Query for Ambiguity:** If a task's purpose or scope is unclear, formulate specific questions for the User to gain the necessary clarity. Do not proceed with analysis on tasks you do not understand.

### Phase B: Dependency & Relationship Mapping

1.  **Identify Prerequisites:** For each task, determine if it depends on any other tasks in the list being completed first. This is the most critical step for establishing a logical sequence.
    *   *Example:* `Task C: Implement user login UI` is a prerequisite for `Task D: Test user login flow`.
2.  **Identify Groupings:** Identify tasks that are logically related and could be tackled together by the same agent or within the same work session.
    *   *Example:* `Task X: Update user database schema` and `Task Y: Create migration script for user schema` are tightly related.

### Phase C: Strategic Value Assessment

For each task, assess its strategic value based on the following criteria. You may need to ask the User for input on these points if the answer isn't obvious from the project context.

1.  **Core Functionality:** Does this task contribute to the essential, must-have functionality of the project? (High Value)
2.  **User Impact:** Will this task deliver significant, visible value to the end-user? (High Value)
3.  **Risk Mitigation:** Does this task address a critical security, stability, or performance risk? (High Value)
4.  **Enabler Task:** Is this task a prerequisite for a large number of other important tasks? (High Value)
5.  **Incremental Improvement:** Is this a "nice-to-have" feature, a minor bug fix, or a refactoring effort with low immediate impact? (Lower Value)

### Phase D: Synthesis & Prioritized List Generation

1.  **Synthesize Findings:** Combine the dependency map and the strategic value assessment to create a prioritized order.
2.  **Prioritization Logic:** The final order should be determined by the following hierarchy of rules:
    *   **Rule 1 (Dependencies):** A task cannot be prioritized higher than its prerequisites.
    *   **Rule 2 (Strategic Value):** High-value tasks should be prioritized as early as possible after their dependencies are met.
    *   **Rule 3 (Logical Flow):** Group related tasks together where it makes sense for implementation efficiency, as long as it doesn't violate Rule 1 or 2.
3.  **Generate the List:** Produce a numbered list of the now-prioritized tasks. Each item should include:
    *   The task description.
    *   A brief justification for its position (e.g., "Prerequisite for User Authentication," "High-impact user feature," "Blocks three other tasks.").
    *   A list of its immediate prerequisites, if any.

## 3. Artifact Creation: The Prioritization Analysis Log

The output of this analysis must be formally documented as a **Prioritization Analysis** artifact. This artifact should be logged to the Memory Bank to ensure a transparent and auditable planning process.

**Format for the Memory Bank Log Entry:**

```markdown
### Prioritization Analysis

**Date:** YYYY-MM-DD
**Source Backlog:** [Link to or description of the source of the tasks, e.g., "README.md TODO section"]

**Analysis Summary:**
[Briefly describe the key dependencies and strategic drivers that influenced the final ordering.]

**Prioritized Task List:**

1.  **Task:** [Task Name 1]
    *   **Justification:** [Reason for priority]
    *   **Prerequisites:** None

2.  **Task:** [Task Name 2]
    *   **Justification:** [Reason for priority]
    *   **Prerequisites:** Task 1

3.  **Task:** [Task Name 3]
    *   **Justification:** [Reason for priority]
    *   **Prerequisites:** Task 1, Task 2

... and so on.
```

## 4. Integration with Implementation Plan

Once this analysis is complete and has been reviewed by the User, the generated **Prioritized Task List** becomes the primary input for the "Phases and Tasks" section of the `Implementation_Plan.md`. The plan should be structured around this logical, dependency-aware sequence. 