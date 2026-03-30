# APM Bus System Integration Guide

## 1. Overview

**Reading Agent:** Any non-APM agent

This guide explains how non-APM agents can interact with an APM session through the Message Bus. If you are a standalone agent (not managed by APM's Manager) and need to communicate with APM-managed Workers or the Manager, follow this guide to create your own bus directory.

You participate at the communication level only - you receive work through the bus, execute it, and report back. You are not a Worker: you do not log to `.apm/memory/`, do not perform Handoff, and are not tracked in the Tracker. Your reports are your sole contribution to the session.

### 1.1 Objectives

- Enable non-APM agents to participate in bus communication.
- Provide clear setup and messaging protocols for external integration.

### 1.2 Outputs

- A bus directory in `.apm/bus/` with bus files for the non-APM agent.
- Properly formatted bus messages for communication with APM-managed agents.

---

## 2. Creating a Bus Directory

To participate in bus communication, create your own bus directory in `.apm/bus/`:
1. Choose a slug for your identity (lowercase, hyphenated name) that does not conflict with existing directories in `.apm/bus/`. Example: `external-reviewer`. This slug is your identifier for all bus communication - the Manager uses it to find your reports.
2. Create your bus directory: `.apm/bus/<your-agent-slug>/`.
3. Create the bus files you need:
   - To receive assignments: `task.md`.
   - To send reports: `report.md`.

---

## 3. File Naming

Bus files follow a strict naming convention:

| Purpose | File Name |
| --------- | ---------- |
| Receive assignments | `task.md` |
| Send reports | `report.md` |

---

## 4. Clear-on-Return

Before writing a message to your outgoing bus file, clear your incoming bus file by truncating it:

```bash
truncate -s 0 .apm/bus/<your-agent-slug>/task.md
```

Then write your message to the outgoing file.

---

## 5. Message Format

For simple single-Task communication, write the message content directly as the entire file content. When participating in batch operations (multiple Tasks in one dispatch), the Manager uses YAML frontmatter envelopes per the APM communication skill's batch protocol.

**Report content:** The Manager may not know you exist - your bus directory was not created during planning. Your first report must clearly explain who you are, what you did, and why you are participating in the session. Include enough context for the Manager to assess the situation and integrate your contribution into the project's coordination. Subsequent reports can be concise.

---

## 6. Communication Flow

**Reporting your work.** When you have completed work relevant to the APM session:
1. Write your report to the Report Bus file.
2. Direct the User to deliver the report: `/apm-5-check-reports <your-agent-slug>` in the Manager's chat.

**Receiving follow-up assignments.** The Manager may assign follow-up work through your Task Bus after processing your initial report:
1. The User signals you to check your bus (by referencing the Task Bus file).
2. Read the Task Bus file and process the assignment.
3. Clear the Task Bus file.
4. Write your report to the Report Bus and direct the User to deliver it.

---

**End of Skill**
