# APM {VERSION} - Bus Integration

This guide is for an agent outside APM that contributes work through the Message Bus without becoming a Worker. You receive assignments and report results. You do not write Task Logs, perform Handoffs or appear in the Manager's Tracker; your reports carry your contribution to the Manager.

## 1. Setup

Choose a lowercase, hyphenated slug that no folder in `.apm/bus/` already uses. Create `.apm/bus/<your-slug>/` with empty `task.md` and `report.md`. Follow the bus rules in `{SKILL_PATH:apm-communication}` §4: read a bus file before writing it, and clear an incoming message after you process it.

## 2. Reporting

1. Write your report to `.apm/bus/<your-slug>/report.md`. In your first report, say who you are, what the work is and why you are contributing. Give the outcome, the evidence, what it changes and its limits, so the Manager can decide what to do with it.
2. Tell the User to invoke `apm-5-check-reports <your-slug>` in the Manager's chat.

## 3. Further Assignments

When the User points you to your Task Bus, read `.apm/bus/<your-slug>/task.md`, do the assignment, clear the file, then report as in §2.
