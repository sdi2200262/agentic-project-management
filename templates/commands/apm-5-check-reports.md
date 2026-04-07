---
command_name: check-reports
description: Deliver a Task Report to an APM Manager.
---

# APM {VERSION} - Manager Check Reports Command

Check Report Bus(es) for pending Task Reports. If you are a Planner, Worker, or non-APM agent, concisely decline and take no action. This replaces manual file referencing - scan bus directories or check a specific Worker's Report Bus.

Accepts optional `[agent-id ...]` arguments. With arguments, checks those Workers' Report Buses. Without arguments, checks Workers with active dispatches plus a health check for unexpected content.

**Procedure:**
1. Determine scan scope:
   - If `{ARGS}` provided, resolve each agent-id per `{SKILL_PATH:apm-communication}` §4.2 Agent ID Resolution. Batch-read all targeted Report Buses in a single terminal invocation, e.g., `cat .apm/bus/<slug-1>/report.md .apm/bus/<slug-2>/report.md` (or platform equivalent). Continue to step 3.
   - If no argument, continue to step 2.

2. Scan Report Buses: scan and read all Report Buses in a single terminal invocation, e.g., `for f in .apm/bus/*/report.md; do [ -s "$f" ] && echo "=== $f ===" && cat "$f"; done` (or platform equivalent). This discovers non-empty buses, reads their content, and includes path markers for cross-referencing against active dispatches. If any unexpected bus has content (beyond the actively dispatched Workers), include it and inform the User. If no buses have content, inform User that no pending reports are available. Await next invocation. If one or more have content, continue to step 3 for each.

3. Process report(s): for each Report Bus with content, process per `{GUIDE_PATH:task-review}` §3 Task Review Procedure.

---

**End of Command**
