---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recovery

Follow these instructions only when the User requests recovery or an APM instruction directs you here. Otherwise, stop.

Recovery rebuilds a Manager's or Worker's working context after compaction or a lost conversation. It keeps the same role, conversation and number. If you are the Planner or outside APM, tell the User and stop.

1. Use your established role and identity or the User's supplied `manager` or Worker ID. Ask if the identity is unclear or conflicts with the established one.
2. Read your role's instructions in full and follow its Recovery section (§1.3):
   - Manager: `{SKILL_PATH:apm-2-initiate-manager}`.
   - Worker: `{SKILL_PATH:apm-3-initiate-worker}`.
