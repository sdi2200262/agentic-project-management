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
