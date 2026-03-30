---
command_name: recover
description: Recover an APM agent's working context.
---

# APM {VERSION} - Recover Command

This command reconstructs working context after platform auto-compaction, manual compaction, or when an initiated agent must resume after a cleared or lost conversation. It applies to the Manager and Workers only. If you are a Planner or non-APM agent, concisely decline and take no action. Accepts an optional `[role]` argument: `manager` or a Worker agent identifier (e.g., `frontend-agent`).

The command argument - if provided - will be listed here: `{ARGS}`. If empty, then no argument was provided.

**Procedure:**
1. Determine role: from the command argument if provided (`manager` for the Manager, any other value for a Worker). If no argument, infer from conversation context (compaction summary or the initiation just performed). If conversation context does not reveal your role, ask the User.
2. Re-read your initiation command and all documents it references:
   - Manager → `{COMMAND_PATH:apm-2-initiate-manager}`
   - Worker → `{COMMAND_PATH:apm-3-initiate-worker}`
   Follow the document loading instructions to rebuild procedural knowledge and project state. You are recovering, not initializing.
3. Explore project state from the artifacts listed in your initiation command and the current state of the codebase to reconstruct where work stands. When gaps remain that artifacts cannot fill, ask the User for brief context before continuing.
4. Note the recovery event: if you are the Manager, add a working note to the Tracker; if you are a Worker, include it in the next Task Report. Recovery does not increment the instance number - you continue as the same instance. When eventually performing Handoff, note which portions of working context are reconstructed rather than first-hand.
5. Continue with duties.

---

**End of Command**
