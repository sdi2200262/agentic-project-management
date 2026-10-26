---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recover Command

Continue only if the User manually invoked this skill or asked you to follow it. Otherwise, tell the User that this skill exists and stop.

Rebuild context after compaction or a cleared/lost conversation. Applies only to initiated Managers and Workers; Planners and non-APM agents decline without action. Optional `[role]` is `manager` or a Worker identifier.

1. Determine role from the command argument, or infer it from conversation/initiation context. Ask the User if unknown.
2. Reread `{SKILL_PATH:apm-2-initiate-manager}` or `{SKILL_PATH:apm-3-initiate-worker}` and every document in its loading sequence: guides, skills and artifacts. Skip identity determination and the greeting.
3. Reconstruct progress from those artifacts and the codebase. Ask focused User questions for gaps the files cannot resolve.
4. Keep the same instance number. Record recovery in the Tracker for Managers or the next Task Report for Workers. In an eventual Handoff, identify reconstructed context rather than presenting it as first-hand.
5. Resume duties.
