---
command_name: check-tasks
description: Signals a Worker to check its Task Bus for pending Task Prompts.
---

# APM {VERSION} - Worker Check Tasks Command

This command signals a Worker to check its Task Bus for pending Task Prompts. It replaces manual file referencing - the Worker resolves its bus path from its registered identity or from the provided `[agent-id]` argument.

Accepts an optional `[agent-id]` argument. Registered Workers ignore it (bus path already known). Unregistered Workers require it to resolve identity.

**Procedure:**
1. Determine registration state:
   - If registered → Resolve bus path from registration. Continue to step 3.
   - If not registered → `{ARGS}` is required. If no argument provided, inform User that an agent-id is required.

2. Resolve agent-id (unregistered Workers only): resolve `{ARGS}` against `.apm/bus/` directory names per `{SKILL_PATH:apm-communication}` §4.2 Agent ID Resolution. Initialize per `{COMMAND_PATH:apm-3-initiate-worker}` §2 Session Initiation.

3. Read Task Bus at `.apm/bus/<agent-slug>/task.md`.
   - If empty → Inform User that no pending Task is available. Await next invocation.
   - If content present → Continue to step 4.

4. Cross-validate `agent` field in YAML frontmatter against registered identity. Mismatch flags a routing error - inform User. Process the Task per `{GUIDE_PATH:task-execution}` §3 Task Execution Procedure.

**Identity scope:** After registration, only accept Tasks assigned to your registered agent identifier per `{COMMAND_PATH:apm-3-initiate-worker}` §5.1 Identity Scope. When receiving an assignment for a different agent identifier, decline and direct User to the correct Worker session.

---

**End of Command**
