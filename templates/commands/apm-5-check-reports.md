---
command_name: check-reports
description: Deliver a Task Report to an APM Manager.
---

# APM {VERSION} - Manager Check Reports Command

This command signals the Manager to check Report Bus(es) for pending Task Reports. If you are a Planner, Worker, or non-APM agent, concisely decline and take no action. It replaces manual file referencing - the Manager scans bus directories or checks a specific Worker's Report Bus.

Accepts optional `[agent-id ...]` arguments. With arguments, checks those Workers' Report Buses. Without arguments, checks Workers with active dispatches plus a health check for unexpected content.

**Procedure:**
1. Determine scan scope:
   - If `{ARGS}` provided → Resolve each agent-id per `{SKILL_PATH:apm-communication}` §4.2 Agent ID Resolution. Check `.apm/bus/<agent-slug>/report.md` for each. Continue to step 3.
   - If no argument → Continue to step 2.

2. Scan Report Buses: read Report Buses for Workers with active dispatches. Before reading, list `.apm/bus/` directory contents and check file sizes - if any unexpected bus has content (beyond the actively dispatched Workers), include it in the scan and inform the User. If no buses have content → Inform User that no pending reports are available. Await next invocation. If one or more have content → Continue to step 3 for each.

3. Process report(s): for each Report Bus with content, process per `{GUIDE_PATH:task-review}` §3 Task Review Procedure.

---

**End of Command**
