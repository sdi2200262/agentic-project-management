---
name: apm-recover
description: >
  Recovers an APM agent's working context after platform auto-compaction
  or conversation loss. Reconstructs procedural knowledge and project
  state for Manager or Worker roles.
model: opus
tools: Read, Bash, Grep, Glob
disallowedTools: Write, Edit, Agent
replaces: recover
argument-hint: "[manager | agent-id]"
---

# APM {VERSION} - Recover

This skill reconstructs working context after platform auto-compaction or when an initiated agent needs to resume after a cleared or lost conversation. It applies to the Manager and Workers only. If you are a Planner or non-APM agent, concisely decline and take no action. Accepts an optional `[role]` argument: `manager` or a Worker agent identifier (e.g., `frontend-agent`).

The command argument - if provided - will be listed here: `$ARGUMENTS`. If empty, then no argument was provided.

**Procedure:**
1. Determine role: from the command argument if provided (`manager` for the Manager, any other value for a Worker). If no argument, infer from conversation context (compaction summary or the initiation just performed). If conversation context does not reveal your role, ask the User.
2. Re-read your role's primary document and all documents it references:
   - Manager -> `{SKILL_PATH:apm-manager}` (or `{COMMAND_PATH:apm-2-initiate-manager}` if the skill is not available)
   - Worker -> `{GUIDE_PATH:task-execution}` and `{GUIDE_PATH:task-logging}`
   Follow the document loading instructions to rebuild procedural knowledge and project state. You are recovering, not initializing.
3. Explore project state from the artifacts listed in your role's documents and the current state of the codebase to reconstruct where work stands. When gaps remain that artifacts cannot fill, ask the User for brief context before continuing.
4. Note the recovery event: if you are the Manager, add a working note to the Tracker; if you are a Worker, include it in the next Task Report. Recovery does not increment the instance number - you continue as the same instance. When eventually performing Handoff, note which portions of working context are reconstructed rather than first-hand.
5. Continue with duties.

---

**End of Skill**
