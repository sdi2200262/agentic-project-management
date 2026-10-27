---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recovery

Continue only if the User manually invoked this skill, the User asked you to follow it, or another APM skill or guide you are following sent you here. Otherwise, tell the User that this skill exists and stop.

This skill rebuilds a Manager's or Worker's working context after compaction or a lost conversation. It continues the same conversation; only a Handoff starts a new one. If you are the Planner or an agent outside APM, tell the User and stop. The User may give a role with this skill: `manager` or a Worker's agent ID.

1. Take your role from what the User gave, or from this conversation. If neither settles it, ask.
2. Reread `{SKILL_PATH:apm-2-initiate-manager}` or `{SKILL_PATH:apm-3-initiate-worker}` and every file it lists. Skip the greeting and, for a Worker, keep the identity you already registered.
3. Rebuild the current state from those files, the bus and the code. Ask the User about gaps the files cannot settle.
4. Keep your conversation number. As Manager, note the recovery in the Tracker's Workers table or Notes; as a Worker, mention it in your next Task Report. In any later Handoff Log or summary, say that your work before the recovery was rebuilt from files, not remembered.
5. Tell the User what you rebuilt and your next action, then continue.
