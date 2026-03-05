---
name: apm-bus-integration
description: Standalone bus integration guide for agents operating outside APM's Manager coordination.
---

# APM Bus System Integration Guide

This guide explains how non-APM agents can interact with an APM session through the bus system. If you are a standalone agent (not managed by APM's Manager) and need to communicate with APM-managed Workers or the Manager, follow this guide to create your own bus directory.

---

## 1. Creating a Bus Directory

To participate in bus communication, create your own bus directory in `.apm/bus/`:
1. Choose a slug for your identity (lowercase, hyphenated name). Example: `external-reviewer`.
2. Create your bus directory: `.apm/bus/<your-agent-slug>/`.
3. Create the bus files you need:
   - To receive Tasks: `apm-task.md`.
   - To send Task Reports: `apm-report.md`.
   - For Handoff (if applicable): `apm-handoff.md`.

---

## 2. File Naming

Bus files follow a strict naming convention:

| Purpose | File Name |
| --------- | ---------- |
| Receive from Manager | `apm-task.md` |
| Send to Manager | `apm-report.md` |
| Handoff | `apm-handoff.md` |

---

## 3. Clear-on-Return

Before writing a message to your outgoing bus file, clear your incoming bus file by truncating it:

```bash
truncate -s 0 .apm/bus/<your-agent-slug>/apm-task.md
```

Then write your message to the outgoing file.

---

## 4. Message Format

Bus files contain message content directly. No YAML frontmatter envelope is used. Write the message content (Task Report, etc.) as the entire file content.

---

## 5. Communication Flow

1. The Manager (or User) writes a message to your Task Bus file.
2. The User signals you to check your bus (via `/apm-4-check-tasks` or by referencing the file).
3. Read the Task Bus file and process the message content.
4. Clear the incoming Task Bus file.
5. Write the Task Report to the Report Bus file.
6. Inform the User that the Task Report is ready. The User runs `/apm-5-check-reports` in the Manager's session.

---

**End of Skill**
