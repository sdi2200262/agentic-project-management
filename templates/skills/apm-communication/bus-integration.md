# APM Bus System Integration Guide

## 1. Overview

**Reading agent:** Non-APM participant

Use the Message Bus to contribute work without becoming an APM Worker. Receive assignments and report results; do not write Memory logs, perform Handoff or join the Tracker's Workers table. Your reports carry your contribution to the Manager.

## 2. Setup

Choose a lowercase, hyphenated slug that does not conflict with existing `.apm/bus/` directories. Create `.apm/bus/<your-agent-slug>/` with `task.md` and `report.md`. The slug identifies your messages.

Follow `{SKILL_PATH:apm-communication}` §4: read a bus before writing and clear processed incoming content before an outgoing report.

## 3. Reporting Your Work

1. Write `.apm/bus/<your-agent-slug>/report.md`. In your first report identify yourself, the work and why you are contributing. Give the outcome, evidence, implications and limits needed for the Manager's decision; keep later reports concise.
2. Direct the User to invoke `apm-5-check-reports <your-agent-slug>` in the Manager's chat.

## 4. Receiving Follow-Up Assignments

When the User points you to your Task Bus, read `.apm/bus/<your-agent-slug>/task.md`, execute the assignment, then report and give delivery instructions as above.
