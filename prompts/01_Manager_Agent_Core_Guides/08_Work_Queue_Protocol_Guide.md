# APM Manager Guide: Work Queue Protocol

## 1. Objective

This guide defines the protocol for using the `WORK_QUEUE.md` file as an asynchronous message bus for inter-agent communication. This system replaces the manual copy-pasting of prompts between the User and various agents, streamlining the workflow and creating a persistent, auditable communication record.

## 2. The `WORK_QUEUE.md` File

The `WORK_QUEUE.md` file is the central hub for all agent-to-agent communication. It should be created at the root of the project directory.

*   **Management:** The Manager Agent is responsible for creating and maintaining this file.
*   **User's Role:** The User's role shifts from being a manual copy-paste conduit to a "trigger." The User will now be instructed to simply "Tell Agent X to check the work queue."

## 3. Message Format

All messages posted to the `WORK_QUEUE.md` file **must** adhere to the following Markdown format. This ensures consistency and allows for potential future parsing and automation.

````markdown
---
**ID:** `[Unique Message ID]`
**FROM:** `[Sender Agent ID, e.g., Manager_Agent]`
**TO:** `[Recipient Agent ID, e.g., Agent_Backend_Dev]`
**TIMESTAMP:** `[YYYY-MM-DDTHH:MM:SSZ]`

`[Message Body]`
---
````

*   **ID:** A unique identifier for the message, typically a timestamp-based string or a UUID.
*   **FROM/TO:** The unique identifiers for the sending and receiving agents.
*   **TIMESTAMP:** An ISO 8601 timestamp for when the message was generated.
*   **BODY:** The full content of the message (e.g., a task assignment prompt or a completion report).

## 4. Workflow Protocol

### 4.1. Assigning a Task (Manager -> Implementation Agent)

1.  **Generate Task Prompt:** The Manager Agent generates a complete task assignment prompt as usual.
2.  **Generate Message:** The Manager Agent wraps this prompt in the standard message format, populating the header fields (`ID`, `FROM`, `TO`, `TIMESTAMP`).
3.  **Append to Queue:** The Manager Agent **appends** this new message block to the end of the `WORK_QUEUE.md` file.
4.  **Instruct User:** The Manager Agent then gives a simple instruction to the User: "I have added a new task to the `WORK_QUEUE.md` for `Agent_Backend_Dev`. Please tell them to check the work queue."

### 4.2. Receiving a Task (Implementation Agent)

1.  **Check Queue:** Upon being prompted by the User, the Implementation Agent reads the entire `WORK_QUEUE.md` file.
2.  **Find Task:** The agent scans the file for a message where the `TO:` field matches its own agent ID.
3.  **Process Task:** The agent reads the body of the message and proceeds with the assigned task.

### 4.3. Reporting Completion (Implementation Agent -> Manager)

1.  **Generate Completion Report:** The Implementation Agent generates a standard completion report.
2.  **Generate Message:** The agent wraps this report in the standard message format, with `FROM:` set to its ID and `TO:` set to `Manager_Agent`.
3.  **Remove Task & Append Report:** The Implementation Agent performs two actions on the `WORK_QUEUE.md` file in a single operation:
    *   It **removes** the original task message it just completed.
    *   It **appends** its new completion report message to the end of the file.
4.  **Instruct User:** The agent then gives a simple instruction to the User: "I have completed my task and posted a completion report to the `WORK_QUEUE.md` for the `Manager_Agent`. Please tell them to check the work queue."

### 4.4. Reviewing Work (Manager -> Implementation Agent)

1.  **Check Queue:** Upon being prompted by the User, the Manager Agent reads the `WORK_QUEUE.md` file.
2.  **Find Report:** The Manager scans for messages where `TO:` is `Manager_Agent`.
3.  **Process Report & Review Work:** The Manager processes the report and reviews the deliverables as per the standard review protocol.
4.  **Remove Report:** After successfully reviewing the work, the Manager Agent **removes** the completion report message from the `WORK_QUEUE.md` file, leaving the queue clean for the next cycle.

This protocol ensures that the `WORK_QUEUE.md` file only contains active tasks and pending reports, making it a reliable and up-to-date system of record for ongoing work. 