---
name: apm-4-check-tasks
description: Deliver a Task Prompt to an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Check Tasks

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

This skill delivers a Task Prompt to a Worker. If you are the Planner or the Manager, tell the User and stop.

1. If you have not registered as a Worker in this conversation, you need the agent ID the User gave with this skill. If there is none, ask for it. Then read `{SKILL_PATH:apm-3-initiate-worker}` and follow it from its first step; it finds the waiting Task Prompt. Once you are registered, an agent ID given with this skill is ignored.
2. Read `.apm/bus/<agent-slug>/task.md`. If it is empty, say that no Task is waiting and wait for the User to invoke this skill again.
3. Execute the Task Prompt per `{GUIDE_PATH:task-execution}`.
