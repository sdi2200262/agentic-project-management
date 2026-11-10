---
name: apm-5-check-reports
description: Deliver a Task Report to an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Check Reports

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill delivers Task Reports to the Manager. If you are not the Manager, tell the User and stop. The User may give one or more agent IDs with this skill to read only those Workers' reports.

Follow `{SKILL_PATH:apm-2-initiate-manager}` §2.2 to receive the reports, using any agent IDs the User supplied.
