---
name: apm-5-check-reports
description: Deliver a Task Report to an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Check Reports

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill delivers Task Reports to the Manager. If you are not the Manager, tell the User and stop. The User may give one or more agent IDs with this skill to read only those Workers' reports.

1. With agent IDs, match each to a bus folder per `{SKILL_PATH:apm-communication}` §3.2 and read those Workers' `report.md` files. Without them, read every non-empty `.apm/bus/*/report.md`. Note each report's path. Tell the User about any content you did not expect, such as a report from a Worker with no dispatched Task.
2. If no Task Report is waiting, say so and wait for the User to invoke this skill again.
3. Review each report per `{GUIDE_PATH:task-review}`.
