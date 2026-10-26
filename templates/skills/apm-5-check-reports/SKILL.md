---
name: apm-5-check-reports
description: Deliver a Task Report to an APM Manager. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Manager Check Reports Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

Read pending Report Buses as Manager. Planners, Workers and non-APM agents decline without action. Optional `[agent-id ...]` arguments select Workers; without them, scan all buses and check for unexpected content beyond active dispatches.

1. With arguments, resolve each per `{SKILL_PATH:apm-communication}` §4.2 and batch-read targeted Report Buses in one terminal invocation. Without arguments, scan and read every non-empty `.apm/bus/*/report.md` in one invocation, identifying each source path. Include unexpected content and inform the User.
2. If no content is found, state that no reports are pending and await another invocation.
3. Process each report per `{GUIDE_PATH:task-review}` §3.
