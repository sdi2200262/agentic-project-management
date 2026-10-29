---
name: apm-9-recover
description: Recover an APM agent's working context. Use only when the User manually invokes this skill.
disable-model-invocation: true
---

# APM {VERSION} - Recovery

Follow this skill only when the User manually invokes it, asks you to follow it, or an APM instruction directs you here. Otherwise, stop.

This skill rebuilds a Manager's or Worker's working context after compaction or a lost conversation. It continues the same conversation; only a Handoff starts a new one. If you are the Planner or an agent outside APM, tell the User and stop. The User may give a role with this skill: `manager` or a Worker's agent ID.

1. Take your role from what the User gave, or from this conversation. If neither settles it, ask.
2. Reread the file lists in `{SKILL_PATH:apm-2-initiate-manager}` §1 or `{SKILL_PATH:apm-3-initiate-worker}` §1 and load those files. Continue with your existing identity and conversation number, starting from the current state rather than initiation.
3. Rebuild the current state from those files, the bus and the code, including pending alignment decisions, accepted limitations and verification gaps with source paths. As a Worker, start from your current prompt, latest relevant own attempt logs and Handoff Log, following earlier-attempt links where needed. Keep the current prompt's `log_path`. Ask the User about gaps the files cannot settle.
4. As Manager, add a note about the recovery to the Tracker's Notes; as a Worker, mention it in your next Task Report. In any later Handoff Log or summary, identify the files or summary you used to rebuild your earlier work.
5. Tell the User what you rebuilt and your next action, then continue.
