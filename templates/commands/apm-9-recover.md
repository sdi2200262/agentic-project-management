---
command_name: recover
description: Recover an APM agent's working context after auto-compaction.
---

# APM {VERSION} - Recover Command

This command reconstructs working context after platform auto-compaction. It applies to the Manager and Workers only. If you are a Planner or non-APM agent, concisely decline and take no action.

Accepts an optional `[role]` argument: `manager` or a Worker agent identifier (e.g., `frontend-agent`).

**Procedure:**
1. Determine role from `{ARGS}`: `manager` for the Manager, any other value for a Worker resolved per `{SKILL_PATH:apm-communication}` §4.2 Agent ID Resolution. If no argument, infer from the platform's compaction summary or ask the User.
2. Re-read your initiation command and all documents it references:
   - Manager → `{COMMAND_PATH:apm-2-initiate-manager}`
   - Worker → `{COMMAND_PATH:apm-3-initiate-worker}`
   Follow the document loading instructions to rebuild procedural knowledge and project state. You are recovering, not initializing.
3. Note the recovery event: Manager adds a working note to the Tracker; Worker includes it in the next Task Report. When eventually performing Handoff, note which portions of working context are reconstructed rather than first-hand.
4. Continue with duties.

---

**End of Command**
