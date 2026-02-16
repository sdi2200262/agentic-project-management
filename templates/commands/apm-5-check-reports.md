---
command_name: check-reports
description: Signals the Manager Agent to check Report Buses for pending Task Reports.
---

# APM {VERSION} - Manager Check Reports Command

## 1. Overview

This command signals the Manager Agent to check Report Bus(es) for pending Task Reports. It replaces manual file referencing — the Manager scans bus directories or checks a specific Worker's Report Bus.

Accepts an optional `[agent-id]` argument:
- **Without argument:** Scan all `.apm/bus/*/apm-report.md` files and process all that have content.
- **With argument:** Resolve the agent-id and check only that Worker's Report Bus.

---

## 2. Report Detection

Perform the following actions:

1. **Determine scan scope:**
   - If `{ARGS}` argument is provided → resolve agent-id per `{SKILL_PATH:apm-communication}` §2.6 Agent-ID Resolution Standards. Check only `.apm/bus/<agent-slug>/apm-report.md`. Proceed to step 3.
   - If no argument → scan all Worker Agent Channels. Proceed to step 2.

2. **Scan all Report Buses** (no argument):
   - Read all `.apm/bus/*/apm-report.md` files (excluding the manager channel).
   - Identify which files have content (pending reports).
   - If none have content → inform User that no pending reports are available. Await next invocation.
   - If one or more have content → proceed to step 3 for each.

3. **Process Report(s):**
   - For each Report Bus with content, process per `{GUIDE_PATH:task-review}` §3 Task Review Procedure.

---

## 3. Operating Rules

### 3.1 Communication Standards

- Reference guides and skills by path — do not quote their content.
- Write to Task Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery when dispatching follow-up or next tasks.
- Keep communication concise while maintaining clarity.

---

**End of Command**
