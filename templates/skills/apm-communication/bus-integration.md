# APM Bus System Integration Guide

## 1. Overview

**Reading Agent:** Any non-APM agent

This guide explains how non-APM agents can participate in an APM session through the Message Bus. If you are a standalone agent (not managed by APM's Manager) and need to communicate with APM-managed Workers or the Manager, follow this guide.

You participate at the communication level only - you receive work through the bus, execute it, and report back. You are not a Worker: you do not log to `.apm/memory/`, do not perform Handoff, and are not tracked in the Tracker. Your reports are your sole contribution to the session.

---

## 2. Setup

Create your own bus directory in `.apm/bus/`:
1. Choose a slug for your identity (lowercase, hyphenated name) that does not conflict with existing directories in `.apm/bus/`. Example: `external-reviewer`. This slug is your identifier for all bus communication - the Manager uses it to find your reports.
2. Create your bus directory: `.apm/bus/<your-agent-slug>/`.
3. Create two bus files: `task.md` (to receive assignments) and `report.md` (to send reports).

---

## 3. Reporting Your Work

When you have completed work relevant to the APM session:
1. Write your report to `.apm/bus/<your-agent-slug>/report.md`. Your first report must clearly explain who you are, what you did, and why you are participating in the session - the Manager has no record of your participation. Include enough context for the Manager to assess the situation. Subsequent reports can be concise.
2. Direct the User to deliver the report: `/apm-5-check-reports <your-agent-slug>` in the Manager's chat.

---

## 4. Receiving Follow-Up Assignments

The Manager may assign follow-up work through your Task Bus after processing your initial report:
1. The User signals you to check your bus (by referencing the Task Bus file).
2. Read `.apm/bus/<your-agent-slug>/task.md` and process the assignment.
3. Write your report to the Report Bus and direct the User to deliver it.

