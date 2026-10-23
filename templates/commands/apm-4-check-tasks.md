---
command_name: check-tasks
description: Deliver a Task Prompt to an APM Worker. Use only when the User runs this command.
---

# APM {VERSION} - Worker Check Tasks Command

Read the registered Worker's Task Bus. Planners, Managers and non-APM agents decline without action. An optional `[agent-id]` is ignored after registration; an unregistered Worker needs it to establish identity.

1. If registered, use that bus path. Otherwise require the command argument, resolve it per `{SKILL_PATH:apm-communication}` §4.2, and initialize per `{COMMAND_PATH:apm-3-initiate-worker}` §2.
2. Read `.apm/bus/<agent-slug>/task.md`. If empty, state no Task is pending and await another invocation.
3. Verify the prompt's `agent` against registration. Reject a mismatch and direct the User to the correct Worker. Process a valid prompt or batch per `{GUIDE_PATH:task-execution}` §3.
