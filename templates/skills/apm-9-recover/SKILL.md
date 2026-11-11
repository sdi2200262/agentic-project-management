---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recovery

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill rebuilds a Manager's or Worker's working context after compaction or a lost conversation. It continues the same conversation; only a Handoff starts a new one. If you are the Planner or an agent outside APM, tell the User and stop. The User may give a role with this skill: `manager` or a Worker's agent ID.

1. Take your role from what the User gave, or from this conversation. If neither settles it, ask.
2. Read your role's initiation skill in full and follow its Recovery section (§1.3):
   - Manager: `{SKILL_PATH:apm-2-initiate-manager}`.
   - Worker: `{SKILL_PATH:apm-3-initiate-worker}`.
