# APM {VERSION} - Bus Integration

Use this guide to receive assignments and report results through the Message Bus as an outside agent. Your report carries your contribution to the Manager. Worker Task Logs, Handoffs and Tracker registration do not apply.

## 1. Setup

Choose a lowercase, hyphenated slug that no folder in `.apm/bus/` already uses. Create `.apm/bus/<your-slug>/` with empty `task.md` and `report.md`. Follow the bus rules in `{SKILL_PATH:apm-communication}` §3: read a bus file before writing it, and clear an incoming message after you process it.

## 2. Reporting

1. Write your report to `.apm/bus/<your-slug>/report.md`. In your first report, say who you are, what the work is and why you are contributing. Give the outcome, the evidence, what it changes and its limits, so the Manager can decide what to do with it.
2. Tell the User to ask the Manager to check your report in its conversation, giving your agent ID.

## 3. Further Assignments

When the User says a new assignment is waiting, read `.apm/bus/<your-slug>/task.md`, do the assignment, clear the file, then report as in §2.
