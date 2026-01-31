# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Subagent Capability Research (January 2026)

**Context:** Determining which supported AI assistants have TRUE agent-mediated autonomous subagent delegation (agent can call a tool to spawn a subagent) vs. user-initiated mode switching (user must manually trigger mode changes).

### Confirmed: Agent-Mediated Autonomous Delegation

| Assistant | Tool Name | Notes |
|-----------|-----------|-------|
| **Cursor** | `Task` tool, `subagent_type` param | Built-in: `explore`, `generalPurpose`, `bash`, `browser` |
| **Claude Code** | `Task` tool, `subagent_type` param | Built-in: `Explore`, `Plan`, `general-purpose` |
| **GitHub Copilot** | `#runSubagent` tool | Enable in tools menu; agent can invoke autonomously |
| **opencode** | `Task` tool | Built-in: `General`, `Explore` |
| **Qwen Code** | `task()` tool | Architecturally supported; model may underutilize |

### Conditional/Partial Support

| Assistant | Tool Name | Notes |
|-----------|-----------|-------|
| **Gemini CLI** | `delegate_to_agent` | Defaults to `ask_user`; requires `--yolo` flag or policy override for autonomous |
| **Roo Code** | `new_task` tool | Agent-callable per docs; needs practical verification |
| **Kilo Code** | `new_task` tool | Fork of Roo Code pattern; needs practical verification |

### Confirmed: NO Autonomous Delegation

| Assistant | Limitation |
|-----------|------------|
| **Windsurf** | Fast Context auto-triggers only; no user-spawnable subagents |
| **Google Antigravity** | Browser subagent only; no custom subagent support yet |
| **Auggie CLI** | User-initiated only; single-process design; no tool-call mechanism |

### Implications for APM

For assistants with autonomous delegation support, we can inject platform-specific guidance encouraging the Planner Agent to use subagents for exploration during Context Gathering rather than deferring research to the Implementation Plan.

For assistants without this capability, the existing APM delegation workflow (user-mediated) remains the appropriate fallback.

**Next Steps:**
- Finalize verification of uncertain assistants
- Design placeholder system for build pipeline (`{SUBAGENT_GUIDANCE}` or similar)
- Create per-assistant injection text in build config

---

## Tiered APM Architecture & File-Based Message Bus Specification (January 2026)

**Context:** Designing a file-based message bus to replace manual copy-paste of Agent Communication code blocks. The bus leverages APM's sequential workflow while accommodating platform differences in subagent support.

**Problem Statement:** Current APM workflow requires Users to manually copy-paste markdown code blocks (Task Assignment Prompts, Task Reports, Delegation Prompts, etc.) between agent sessions. This creates friction. A file-based system where agents write to files and Users reference them with `@` notation reduces this friction significantly.

**Key Insight:** APM workflows are strictly sequential—Manager sends one task, waits for one report, then sends the next. This means only ONE message is ever "in flight" in each direction, making a simple file-based buffer sufficient.

---

### Tier Classification

Based on subagent capability research, APM will support two tiers:

| Tier | Name | Subagent Support | Delegation Model | Target Assistants |
|------|------|------------------|------------------|-------------------|
| **1** | APM Optimized | Full autonomous | Delegates as subagents | Cursor, Claude Code, GitHub Copilot, OpenCode, Roo Code |
| **2** | APM Standard | None/Limited | Delegates as main actors | Windsurf, Cline, Aider, Kilo Code, others |

**Tier 1 Criteria:**
- Assistant has tool-callable subagent spawning (Task, new_task, #runSubagent, etc.)
- Subagents run in isolated context windows
- No User intervention required for delegation

**Tier 2 Criteria:**
- No autonomous subagent capability, OR
- Subagent support is experimental/unreliable, OR
- Subagents lack full context isolation

---

### Message Bus Protocol

#### Tier 1: Per-Worker-ID Bus (Optimized)

**Directory Structure:**
```
.apm/bus/
├── to_{agent_id}.md        # Manager → Worker (Task Assignments)
├── from_{agent_id}.md      # Worker → Manager (Task Reports)
└── handoff_{agent_id}.md   # Handoff Prompts (when applicable)
```

**Agent ID Derivation:** Slugified from Implementation Plan agent names.
- `Frontend Agent` → `frontend_agent`
- `Backend Agent` → `backend_agent`
- `API Integration Agent` → `api_integration_agent`

**Bus Creation:** Manager creates `to_{agent_id}.md` and `from_{agent_id}.md` on first Task Assignment to that agent.

**Delegation Handling:** Workers spawn Delegate subagents internally using platform's subagent tool. No delegation buses needed—delegation happens within Worker's session context.

**Message Flow:**
```
1. Manager writes Task Assignment     → to_{agent_id}.md
2. User references file to Worker     → @.apm/bus/to_{agent_id}.md
3. Worker reads, clears file, executes task
   └── If delegation needed: Worker spawns subagent internally
4. Worker writes Task Report          → from_{agent_id}.md
5. User references file to Manager    → @.apm/bus/from_{agent_id}.md
6. Manager reads, clears file, makes coordination decision
7. Repeat
```

#### Tier 2: Simple 2-File Bus (Standard)

**Directory Structure:**
```
.apm/bus/
├── apm_send.md      # Downward: Assignments, Delegation Prompts, Handoffs
└── apm_report.md    # Upward: Task Reports, Delegation Reports
```

**Delegation Handling:** Delegates remain main conversation actors. Worker writes Delegation Prompt to `apm_send.md`, User delivers to Delegate session, Delegate writes report to `apm_report.md`, User returns to Worker.

**Message Flow:**
```
1. Manager writes Task Assignment     → apm_send.md
2. User references to Worker          → @.apm/bus/apm_send.md
3. Worker reads, clears, executes
   └── If delegation needed:
       a. Worker writes Delegation Prompt → apm_send.md
       b. User references to Delegate     → @.apm/bus/apm_send.md
       c. Delegate reads, clears, executes
       d. Delegate writes report          → apm_report.md
       e. User references to Worker       → @.apm/bus/apm_report.md
       f. Worker reads, clears, continues
4. Worker writes Task Report          → apm_report.md
5. User references to Manager         → @.apm/bus/apm_report.md
6. Manager reads, clears, coordinates
7. Repeat
```

---

### Message Format Specification

All bus files use consistent format:

```markdown
---
message_id: <sequential or timestamp>
timestamp: <ISO 8601>
from: <agent_id or role>
to: <agent_id or role>
type: <task_assignment | task_report | delegation_prompt | delegation_report | handoff_prompt>
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

---

### Protocol Rules

#### Sending Protocol
1. Sender writes message with full frontmatter
2. Sender informs User: "Message ready in `{file_path}`"
3. Sender awaits response in their receive channel

#### Receiving Protocol
1. Receiver reads file when User references it
2. Receiver validates message is not `status: consumed` (stale read protection)
3. Receiver processes message content
4. Receiver IMMEDIATELY clears file (writes consumed state)
5. Receiver proceeds with task

#### Clear-After-Consume Rationale
- Prevents stale reads if User accidentally re-references
- Makes "pending vs. consumed" state visible
- Previous message already processed, overwriting is safe

---

### Handoff Edge Case Handling

**Problem:** If User forces mid-task handoff, `apm_send.md` (Tier 2) or `to_{agent_id}.md` (Tier 1) may contain incomplete task assignment that gets overwritten by Handoff Prompt.

**Solution:** Handoff procedure MUST capture incomplete task state:

```markdown
# In Handoff Memory Log, add section if mid-task:

## Incomplete Task Context

**Task ID:** Task 2.3
**Original Assignment:**
[Full content of task assignment that was in progress]

**Progress at Interruption:**
- [Completed step 1]
- [Completed step 2]
- [In progress: step 3]

**Remaining Work:**
- [Step 3 continuation]
- [Step 4]
- [Step 5]

**Files Modified (uncommitted):**
- path/to/file1.ts
- path/to/file2.ts
```

**Incoming Worker Protocol:**
1. Read Handoff Memory Log
2. Check for `## Incomplete Task Context` section
3. If present: Resume incomplete task before awaiting new assignments
4. If absent: Normal handoff, await next Task Assignment

---

### Template Architecture (Hybrid Approach)

**Rationale:** Shared core with tier-specific extensions minimizes duplication while keeping tier differences clear.

```
templates/
├── core/                           # Shared across all tiers
│   ├── commands/
│   │   ├── apm-1-planner.md
│   │   ├── apm-2-manager.md
│   │   └── apm-3-worker.md
│   ├── guides/
│   │   ├── task-assignment.md      # {MESSAGE_BUS_SEND} placeholder
│   │   ├── task-execution.md       # {DELEGATION_PROTOCOL} placeholder
│   │   └── memory-maintenance.md   # {MESSAGE_BUS_RECEIVE} placeholder
│   └── skills/
│       └── ...
│
├── extensions/
│   ├── tier1/
│   │   ├── guides/
│   │   │   └── message-bus.md      # Per-worker-ID protocol
│   │   ├── skills/
│   │   │   └── subagent-delegation.md
│   │   └── injections/
│   │       ├── message-bus-send.md
│   │       ├── message-bus-receive.md
│   │       └── delegation-protocol.md
│   │
│   └── tier2/
│       ├── commands/
│       │   └── apm-4-delegate.md   # Only Tier 2 needs this
│       ├── guides/
│       │   └── message-bus.md      # Simple 2-file protocol
│       ├── skills/
│       │   ├── delegate-research.md
│       │   └── delegate-debug.md
│       └── injections/
│           ├── message-bus-send.md
│           ├── message-bus-receive.md
│           └── delegation-protocol.md
│
└── _standards/                     # Shared standards
```

**Build Process:**
1. Merge `core/` with `extensions/tier{N}/`
2. Replace placeholders with tier-specific injections
3. Include/exclude files per tier config
4. Output to `dist/{assistant_name}/`

---

### Build Configuration Schema

```yaml
# build/config.yaml

tiers:
  tier1:
    description: "APM Optimized - Full subagent support"
    exclude_files:
      - commands/apm-4-delegate.md
    injections:
      MESSAGE_BUS_SEND: tier1/injections/message-bus-send.md
      MESSAGE_BUS_RECEIVE: tier1/injections/message-bus-receive.md
      DELEGATION_PROTOCOL: tier1/injections/delegation-protocol.md

  tier2:
    description: "APM Standard - User-mediated delegation"
    include_files:
      - commands/apm-4-delegate.md
    injections:
      MESSAGE_BUS_SEND: tier2/injections/message-bus-send.md
      MESSAGE_BUS_RECEIVE: tier2/injections/message-bus-receive.md
      DELEGATION_PROTOCOL: tier2/injections/delegation-protocol.md

assistants:
  cursor:
    tier: tier1
    subagent_tool: "Task tool"
    custom_injections:
      SUBAGENT_TOOL_NAME: "Task"

  claude_code:
    tier: tier1
    subagent_tool: "Task tool"
    custom_injections:
      SUBAGENT_TOOL_NAME: "Task"

  github_copilot:
    tier: tier1
    subagent_tool: "#runSubagent"
    custom_injections:
      SUBAGENT_TOOL_NAME: "#runSubagent"

  windsurf:
    tier: tier2

  generic:
    tier: tier2
    description: "Fallback for unknown assistants"
```

---

### Key Behavioral Differences by Tier

| Behavior | Tier 1 (Optimized) | Tier 2 (Standard) |
|----------|-------------------|-------------------|
| Delegate command file | Not included | Included |
| Worker delegation | "Spawn subagent using {TOOL}" | "Write prompt to apm_send.md, await User" |
| Manager task assignment | "Write to `to_{agent_id}.md`" | "Write to `apm_send.md`" |
| Manager report reading | "Read from `from_{agent_id}.md`" | "Read from `apm_report.md`" |
| User conversation switches | Manager ↔ Workers only | Manager ↔ Workers ↔ Delegates |
| Parallel workflow potential | Yes (future) | No |

---

### Implementation Phases

**Phase 1: Tier 2 Implementation (Foundation)**
- Implement simple 2-file bus in existing templates
- Add message format specification
- Add clear-after-consume protocol
- Update handoff procedure for mid-task edge case
- Test with current sequential workflow

**Phase 2: Tier 1 Implementation**
- Create tier1 extension with per-worker-ID bus
- Create subagent-delegation skill
- Update build config for tier separation
- Test with Cursor/Claude Code

**Phase 3: Build Pipeline**
- Implement template merging logic
- Implement placeholder injection
- Create assistant-specific outputs
- Document build process

---

### Open Questions

1. **Bus initialization:** Should Planner create `.apm/bus/` directory, or Manager on first use?
2. **Handoff buses:** Separate `handoff_{agent_id}.md` files, or reuse main bus with type flag?
3. **Multi-project:** If User has multiple APM projects, how to avoid bus collision? (Probably fine—each project has its own `.apm/`)
4. **Validation:** Should receiving agent validate message `to:` field matches their identity?
5. **Error recovery:** What if User references wrong bus file? Agent should detect and inform.

---

### Next Steps

- [ ] Implement Phase 1 (Tier 2 simple bus) as proof of concept
- [ ] Test clear-after-consume protocol in practice
- [ ] Update handoff commands for incomplete task capture
- [ ] Create `guides/message-bus.md` for Tier 2
- [ ] Design subagent-delegation skill for Tier 1
- [ ] Build config schema implementation

---
