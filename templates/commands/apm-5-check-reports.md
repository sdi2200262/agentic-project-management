---
command_name: check-reports
description: Signals the Manager to check Report Buses for pending Task Reports.
---

# APM {VERSION} - Manager Check Reports Command

This command signals the Manager to check Report Bus(es) for pending Task Reports. It replaces manual file referencing - the Manager scans bus directories or checks a specific Worker's Report Bus.

Accepts an optional `[agent-id]` argument. Without an argument, scans all Workers. With an argument, checks only that Worker's Report Bus.

**Procedure:**

1. Determine scan scope:
   - If `{ARGS}` provided → resolve agent-id per `{SKILL_PATH:apm-communication}` §2.2 Agent ID Resolution. Check only `.apm/bus/<agent-slug>/apm-report.md`. Skip to step 3.
   - If no argument → scan all Worker bus directories. Proceed to step 2.

2. Scan all Report Buses: read all `.apm/bus/*/apm-report.md` files (excluding the Manager bus directory). Identify which files have content. If none have content → inform User that no pending reports are available. Await next invocation. If one or more have content → proceed to step 3 for each.

3. Process report(s): for each Report Bus with content, process per `{GUIDE_PATH:task-review}` §3 Task Review Procedure.

---

**End of Command**
