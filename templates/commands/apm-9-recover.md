---
command_name: recover
description: Recover an APM Manager's or Worker's procedural instructions.
---

# APM {VERSION} - Recover Command

This command reconstructs working context after platform auto-compaction. It applies to the Manager and Workers only. If you are a Planner or non-APM agent, concisely decline and take no action.

Accepts a required `[role]` argument: `manager` or an agent identifier (e.g., `frontend-agent`).

**Procedure:**
1. Determine role from `{ARGS}`:
   - If `manager` → Manager scope. Continue to step 2.
   - If any other value → Worker scope. Resolve `{ARGS}` against `.apm/bus/` directory names per `{SKILL_PATH:apm-communication}` §4.2 Agent ID Resolution. Continue to step 2.
   - If no argument → Infer role from the platform's compaction summary. If uncertain, ask the User.
2. Re-read procedural documents:
   - **Manager:** Read `{COMMAND_PATH:apm-2-initiate-manager}` and all documents listed in its §2 step 1 (planning documents) and step 2 (guides and skills).
   - **Worker:** Read `{COMMAND_PATH:apm-3-initiate-worker}` and all documents listed in its §2 step 1 (guides and skills) and step 2 (Rules).
3. Read role-specific state artifacts:
   - **Manager:** `.apm/tracker.md`, `.apm/memory/index.md`, `.apm/plan.md`, `.apm/spec.md`, and `{RULES_FILE}`. Check `.apm/bus/` for active Workers and pending reports.
   - **Worker:** Task Bus at `.apm/bus/<agent-slug>/task.md`, Task Logs in the current Stage directory, and `{RULES_FILE}`.
4. Present a concise summary of reconstructed context to the User: role, current project state, what was in progress, and readiness to continue.
5. Note the recovery event: Manager adds a working note to the Tracker; Worker includes it in the next Task Report. When eventually performing Handoff, note which portions of working context are reconstructed rather than first-hand.
6. Continue with duties.

---

**End of Command**
