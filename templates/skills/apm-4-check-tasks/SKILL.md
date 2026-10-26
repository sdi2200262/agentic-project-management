---
name: apm-4-check-tasks
description: Deliver a Task Prompt to an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Worker Check Tasks Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

Read the registered Worker's Task Bus. Planners, Managers and non-APM agents decline without action. An optional `[agent-id]` is ignored after registration; an unregistered Worker needs it to establish identity.

1. If registered, use that bus path. Otherwise, if the argument is missing, tell the User that an agent ID is required and ask for it. Once supplied, resolve it per `{SKILL_PATH:apm-communication}` §4.2, and initialize per `{SKILL_PATH:apm-3-initiate-worker}` §2.
2. Read `.apm/bus/<agent-slug>/task.md`. If empty, state no Task is pending and await another invocation.
3. Verify the prompt's `agent` against registration. Reject a mismatch and direct the User to the correct Worker. Process a valid prompt or batch per `{GUIDE_PATH:task-execution}` §3.
