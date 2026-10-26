---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recover Command

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

Rebuild context after compaction or a cleared/lost conversation. Applies only to initiated Managers and Workers; Planners and non-APM agents decline without action. Optional `[role]` is `manager` or a Worker identifier.

1. Determine role from the command argument, or infer it from conversation/initiation context. Ask the User if unknown.
2. Reread `{SKILL_PATH:apm-2-initiate-manager}` or `{SKILL_PATH:apm-3-initiate-worker}` and every file it lists in §2: guides, skills and artifacts. Skip identity determination and the greeting.
3. Reconstruct progress from those artifacts and the codebase. Ask focused User questions for gaps the files cannot resolve.
4. Keep the same instance number. Record recovery in the Tracker for Managers or the next Task Report for Workers. In any later Handoff Log or summary, say that your work before this recovery was rebuilt from files, not remembered.
5. Resume duties.
