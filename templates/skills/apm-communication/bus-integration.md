# APM Bus System Integration Guide

## 1. Overview

**Reading Agent:** Any non-APM agent

This guide explains how non-APM agents can interact with an APM session through the Message Bus. If you are a standalone agent (not managed by APM's Manager) and need to communicate with APM-managed Workers or the Manager, follow this guide to create your own bus directory.

### 1.1 Objectives

- Enable non-APM agents to participate in bus communication.
- Provide clear setup and messaging protocols for external integration.

### 1.2 Outputs

- A bus directory in `.apm/bus/` with bus files for the non-APM agent.
- Properly formatted bus messages for communication with APM-managed agents.

---

## 2. Creating a Bus Directory

To participate in bus communication, create your own bus directory in `.apm/bus/`:
1. Choose a slug for your identity (lowercase, hyphenated name). Example: `external-reviewer`.
2. Create your bus directory: `.apm/bus/<your-agent-slug>/`.
3. Create the bus files you need:
   - To receive Tasks: `task.md`.
   - To send Task Reports: `report.md`.
   - For Handoff (if applicable): `handoff.md`.

---

## 3. File Naming

Bus files follow a strict naming convention:

| Purpose | File Name |
| --------- | ---------- |
| Receive from Manager | `task.md` |
| Send to Manager | `report.md` |
| Handoff | `handoff.md` |

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

---

## 6. Communication Flow

1. The Manager (or User) writes a message to your Task Bus file.
2. The User signals you to check your bus (via `/apm-4-check-tasks` or by referencing the file).
3. Read the Task Bus file and process the message content.
4. Clear the incoming Task Bus file.
5. Write the Task Report to the Report Bus file.
6. Inform the User that the Task Report is ready. The User runs `/apm-5-check-reports` in the Manager's chat.

---

**End of Skill**
