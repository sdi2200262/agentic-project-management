# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Supported Assistants (February 2026)

**Context:** APM officially supports AI assistants with autonomous subagent capabilities. This enables the core APM workflow where Workers and Managers can spawn delegate subagents for research, debugging, and specialized work without requiring manual User intervention.

### Officially Supported Platforms

| Assistant | Subagent Tool | Config Location | Notes |
|-----------|---------------|-----------------|-------|
| **Cursor** | `Task(subagent_type=...)` | `.cursor/agents/` | Built-in: `explore`, `generalPurpose`, `bash` |
| **Claude Code** | `Task(subagent_type=...)` | `.claude/agents/` | Built-in: `Explore`, `Plan`, `general-purpose`; native skill injection |
| **GitHub Copilot** | `#runSubagent` | `.github/agents/` | Enable in tools menu; agent can invoke autonomously |
| **Gemini CLI** | `delegate_to_agent(...)` | `.gemini/agents/` | Requires `enableAgents: true` in settings |
| **Qwen Code** | `task(...)` | `.qwen/agents/` | Variable templating supported |
| **opencode** | `Task(subagent_type=...)` | `.opencode/agents/` | JSON config also supported |

### Platforms Without Official Support

The following assistants do not have autonomous subagent capabilities and are not officially supported in APM v1.0.0:

- **Windsurf** - Fast Context auto-triggers only; no custom subagent support
- **Google Antigravity** - Browser subagent only; no custom subagent support
- **Auggie CLI** - User-initiated only; single-process design
- **Roo Code** - Subagent support experimental/unverified
- **Kilo Code** - Subagent support experimental/unverified

Community members may develop and maintain unofficial extensions for these platforms. See CONTRIBUTING.md for details on community extensions.

---

## Custom Subagent Definitions (Implemented)

**Context:** APM ships custom subagent definitions that enable Workers and Managers to spawn specialized delegate agents for research and debugging tasks.

### Architecture

APM defines delegate subagents in `templates/agents/`:

```
templates/agents/
├── research-delegate.md    # Research-focused delegate
└── debug-delegate.md       # Debug-focused delegate
```

These are processed during build and output to platform-specific agent directories:
- Claude Code: `.claude/agents/`
- Cursor: `.cursor/agents/`
- GitHub Copilot: `.github/agents/` (with `.agent.md` extension)
- Gemini CLI: `.gemini/agents/`
- Qwen Code: `.qwen/agents/`
- opencode: `.opencode/agents/`

### Delegation Model

**Key distinction:** Delegation skills teach **Delegating Agents** (Workers, Managers, Planners) HOW to create effective delegation prompts. Delegates RECEIVE those prompts and execute them - they don't need to know how prompts are created.

**What delegates need:**
- The task prompt (provided by the spawning agent)
- Memory-logging capability (to log their findings)

**What delegates DON'T need:**
- Delegation methodology (that's for the Delegating Agent)
- Knowledge of how to construct delegation prompts

This eliminates content duplication between `skills/` and `agents/` directories.

### Platform-Specific Handling

**Claude Code** has native skill injection via the `skills:` frontmatter field. Delegate definitions reference `memory-logging` skill by name, and Claude Code automatically injects the skill content at subagent startup.

**Other platforms** do not have native skill injection. Delegates are instructed to read the memory-logging guide directly from the guides directory.

### Workflow

1. Worker encounters a delegation step in Task instructions
2. Worker reads the relevant delegation skill (`research-delegation` or `debug-delegation`) to understand the methodology
3. Worker constructs a task prompt following the skill's format and standards
4. Worker spawns a delegate subagent with the task prompt
5. Delegate executes autonomously, logs findings to Memory, and returns a summary
6. Worker integrates findings and continues Task execution

This eliminates the manual copy-paste workflow previously required for delegation.

---

## APM Message Bus Specification (Future)

**Context:** Designing a file-based message bus to reduce friction in Agent-to-Agent communication. Currently, APM requires Users to manually copy-paste markdown code blocks (Task Prompts, Task Reports) between agent sessions. A file-based system where agents write to files and Users reference them with `@` notation would reduce this friction significantly.

**Status:** Future work. Not implemented in current release.

### Design Principles

APM workflows are strictly sequential-Manager sends one task, waits for one report, then sends the next. This means only ONE message is ever "in flight" in each direction, making a simple file-based buffer sufficient.

### Proposed Directory Structure

```
.apm/bus/
├── to_{agent_id}.md        # Manager → Worker (Task Assignments)
├── from_{agent_id}.md      # Worker → Manager (Task Reports)
└── handoff_{agent_id}.md   # Handoff Prompts (when applicable)
```

**Agent ID Derivation:** Slugified from Implementation Plan agent names.
- `Frontend Agent` → `frontend_agent`
- `Backend Agent` → `backend_agent`

**Bus Creation:** Manager creates files on first Task Assignment to that agent.

### Message Format Specification

All bus files use consistent format:

```markdown
---
message_id: <sequential or timestamp>
timestamp: <ISO 8601>
from: <agent_id or role>
to: <agent_id or role>
type: <task_assignment | task_report | handoff_prompt>
task_ref: <Task ID if applicable>
---

# <Message Title>

<Message content - the actual prompt/report>
```

**Consumed State:** After reading, receiver overwrites with:

```markdown
---
status: consumed
consumed_by: <agent_id>
consumed_at: <ISO 8601>
previous_type: <type of consumed message>
---

Message delivered and consumed. Awaiting next communication.
```

### Protocol Rules

**Sending Protocol:**
1. Sender writes message with full frontmatter
2. Sender informs User: "Message ready in `{file_path}`"
3. Sender awaits response in their receive channel

**Receiving Protocol:**
1. Receiver reads file when User references it
2. Receiver validates message is not `status: consumed` (stale read protection)
3. Receiver processes message content
4. Receiver IMMEDIATELY clears file (writes consumed state)
5. Receiver proceeds with task

### Open Questions

1. **Bus initialization:** Should Planner create `.apm/bus/` directory, or Manager on first use?
2. **Validation:** Should receiving agent validate message `to:` field matches their identity?
3. **Error recovery:** What if User references wrong bus file? Agent should detect and inform.

### Next Steps

- [ ] Implement message bus protocol in guides
- [ ] Test clear-after-consume protocol in practice
- [ ] Update handoff commands for bus integration
- [ ] Create `guides/message-bus.md`

---

## Session Continuation Workflow (February 2026)

**Context:** Designing a mechanism to close the agentic loop when an APM session completes. Users need to archive completed sessions and start fresh while optionally leveraging previous session context.

**Problem Statement:** When an APM session completes (all stages done, deliverables working), there's no formal continuation mechanism. The Manager can add tasks but lacks the Planner's discovery capabilities. Existing artifacts reflect completed work, not new scope. Users need to start fresh while optionally preserving access to previous session context.

**Key Constraint:** Archived context is a snapshot; the codebase is mutable. Automatic session linking creates fragile dependency chains-Session B may invalidate Session A's context without explicit relationship.

### Design Principles

1. **No programmatic linking** - Archives are storage, not dependency sources
2. **User decides relevance** - Planner asks, doesn't assume
3. **Verify before asking** - Context retrieval + codebase verification THEN questions
4. **Snapshot acknowledgment** - Summaries explicitly state point-in-time nature

### Components

| Component | Purpose | Actor |
|-----------|---------|-------|
| `apm continue` | Archive current session, create fresh templates | CLI (programmatic) |
| `/apm-summarize-session` | Create high-level summary artifact (optional) | Native agent (no APM layers) |
| Context Detection | Detect archives, ask user about relevance | Planner Agent |
| Context Retrieval | Explore archive + verify against codebase | Subagent |

### `apm continue` Command

**Behavior:**
```
$ apm continue [-n|--name <name>]

1. Prompt for archive name (or use flag/default)
2. Move .apm/* to .apm/archives/<name>/
3. Create fresh template artifacts
4. Output completion message
```

**Archive Structure:**
```
.apm/archives/<name>/
├── Implementation_Plan.md
├── Specifications.md
├── APM_Session_Summary.md    # If summarize was run
└── Memory/
```

### Planner Context Detection (Addition to Context Gathering)

**§0.1 Previous Session Detection:**
1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any relevant? Which ones and any caveats?"
4. User decides: none (fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if user indicates relevance):**
1. Spawn exploration subagent to examine archive
2. Spawn verification subagent to check against current codebase
3. Integrate findings into Question Rounds as delta-focused questions

### Open Questions

1. **Default archive naming:** Incremental (`session-1`, `session-2`) vs timestamp-based?
2. **Summary command naming:** `/apm-summarize-session` vs `/apm-session-summary`?
3. **Stale archive cleanup:** Should there be an `apm archives --prune` command?
4. **Multi-archive selection:** Can user select multiple archives? How does Planner handle conflicts?

### Next Steps

- [ ] Define `apm continue` CLI specification
- [ ] Define `/apm-summarize-session` command procedure
- [ ] Add §0.1 and §0.2 to Context Gathering guide
- [ ] Define APM_Session_Summary.md template structure

---

## Platform Subagent Capabilities Reference

Research findings on custom subagent support across AI coding assistants.

| Platform | Config Location | Custom Subagents | Skill Injection | Task Tool Syntax |
|----------|----------------|------------------|-----------------|------------------|
| **Claude Code** | `.claude/agents/*.md` | Yes | **Native** (`skills:` field) | `Task(subagent_type="name", prompt="...")` |
| **Cursor** | `.cursor/agents/*.md` | Yes | Embedded in body | `Task(subagent_type="name", prompt="...")` |
| **GitHub Copilot** | `.github/agents/*.agent.md` | Yes | Embedded in body | `#runSubagent` |
| **Gemini CLI** | `.gemini/agents/*.md` | Yes | Experimental | `delegate_to_agent(agent_name="name", objective="...")` |
| **Qwen Code** | `.qwen/agents/*.md` | Yes | Embedded in body | `task(subagent_type="name", prompt="...")` |
| **opencode** | `.opencode/agents/*.md` | Yes | Embedded in body | `Task(subagent_type="name", prompt="...")` |

### Key Findings

**Claude Code** is the only platform with native skill injection-the `skills:` frontmatter field automatically loads skill content into the subagent's context at startup. This is ideal for APM's delegation workflow.

**Other platforms** require skill content to be embedded directly in the subagent definition body. The APM build system handles this automatically during template processing.

**All supported platforms** can define custom subagent types beyond built-in options, enabling APM to ship `research-delegate` and `debug-delegate` subagents that Workers can spawn as needed.

---
