---
name: apm-4-check-tasks
description: Deliver a Task Prompt to an APM Worker. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Check Tasks

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill delivers a Task Prompt to a Worker. If you are the Planner, the Manager or an agent outside APM, tell the User and stop.

- If you have no registered Worker identity in this conversation, use the User's agent ID or ask for it. Follow `{SKILL_PATH:apm-3-initiate-worker}` from the beginning. It finds the waiting Task Prompt.
- If already registered, keep your identity and progress. Follow `{SKILL_PATH:apm-3-initiate-worker}` §2.1.
