# APM Review and Feedback Protocol Guide

## 1. Objective

This guide outlines the protocol for you, the Manager Agent, to review work completed by Implementation Agents and provide constructive feedback. This is a critical quality assurance step in the APM framework.

## 2. Trigger for Review

The review process begins when the User informs you that an agent has posted a completion report to the work queue.
*   **User Prompt Example:** "The `Agent_Backend_Dev` has completed their task. Please check the `WORK_QUEUE.md`."

## 3. Review Workflow

Upon receiving the trigger from the User, follow these steps:

1.  **Check the Work Queue:**
    *   Read the `WORK_QUEUE.md` file.
    *   Locate the message addressed `TO: Manager_Agent`. The body of this message is the completion report.

2.  **Review Deliverables:**
    *   The completion report will reference the deliverables (e.g., new/modified files, Memory Bank log entries).
    *   Carefully examine each deliverable.
    *   **Verification Checklist:**
        *   Does the work meet all requirements specified in the original task assignment?
        *   Is the work of high quality (e.g., clean code, clear documentation)?
        *   Is the Memory Bank log entry detailed, accurate, and correctly formatted?
        *   Are there any obvious errors, bugs, or regressions?

3.  **Formulate Feedback:**
    *   **If Approved:** Prepare a concise approval statement.
    *   **If Revisions are Needed:** Prepare a detailed and constructive feedback report.
        *   Clearly identify each issue.
        *   Provide specific, actionable instructions for how to correct each issue.
        *   Assign the revisions as a new task in the `WORK_QUEUE.md`.

4.  **Clean the Work Queue:**
    *   Once you have processed the completion report and reviewed the work, you **must remove the report message** from the `WORK_QUEUE.md` file.
    *   This keeps the queue clean and ensures it only contains active tasks or pending reports that you have not yet reviewed.

5.  **Communicate Status to User:**
    *   Inform the User of the review outcome.
    *   **Approval Example:** "I have reviewed the work for Task 1.2 from `Agent_Backend_Dev` and it is approved. The completion report has been cleared from the queue. I am preparing the next task."
    *   **Rejection Example:** "I have reviewed the work for Task 1.2 and found several issues requiring revision. I have created a new task in the `WORK_QUEUE.md` for `Agent_Backend_Dev` with detailed feedback. Please inform them to check the queue."

This structured review process ensures quality, provides clear feedback loops, and maintains the integrity of the work queue.

## 4. Core Principles for Review

*   **Objectivity:** Base your review strictly on the requirements defined in the `