---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recovery

Follow these instructions only when the User requests recovery or an APM instruction directs you here. Otherwise, stop.

Recovery rebuilds a Manager's or Worker's working context after compaction or a lost conversation. It continues the same conversation; only a Handoff starts a new one. If you are the Planner or an agent outside APM, tell the User and stop. The User may give a role with the request: `manager` or a Worker's agent ID.

1. Identify the role being recovered from this conversation or the User’s supplied identity. Preserve any established role and Worker identity; ask if the available information conflicts or leaves the identity unclear.
2. Read your role's instructions in full and follow its Recovery section (§1.3):
   - Manager: `{SKILL_PATH:apm-2-initiate-manager}`.
   - Worker: `{SKILL_PATH:apm-3-initiate-worker}`.
