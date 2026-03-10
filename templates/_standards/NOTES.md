# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Claude Code Agent Teams Integration (Future)

**Context:** Claude Code's experimental Agent Teams feature enables Workers to internally spawn a team and parallelize work within their assigned task scope. The Worker becomes the team lead, assigns sub-work to teammates, synthesizes results, and reports back through the standard bus protocol. The Manager is unaware this happened - reports and memory logs have the same structure regardless.

**Status:** Future work. Depends on an experimental platform feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable), disabled by default. Optional and platform-exclusive. Reference: <https://code.claude.com/docs/en/agent-teams>

This applies exclusively to Claude Code and is delivered through the existing conditional placeholder system - a new placeholder (e.g., `{WORKER_TEAM_GUIDANCE}`) resolves to Team Execution Standards for Claude Code and to empty string for all other platforms. No new skill file; the placeholder inserts content into the Task Execution guide as an Operational Standard (§2) and a conditional step (§3.3).

Appropriate for batch assignments with 3+ independent sub-tasks or single complex tasks with multiple independent deliverables touching distinct file groups. Not appropriate for tightly sequential work or where coordination overhead exceeds the benefit. Each teammate operates on a sub-branch off the Worker's branch; the Worker merges teammate branches and resolves conflicts before reporting. All teammates must be shut down and cleaned up before the Worker writes its Task Log and Report - team resources are ephemeral. APM Workers are independent chats (not teammates), enabling multi-team coordination (e.g., Frontend Team and Backend Team concurrently) without platform-level nested team support.

### Open Questions

1. **Cost guidance:** Should APM provide guidance on when Team Execution is cost-effective vs. wasteful, or leave it entirely to Worker judgment?
2. **Batch + FollowUp interaction:** When a batch task fails and the Manager issues a FollowUp, should remaining unstarted tasks be re-batched with the FollowUp or dispatched separately?

### Affected Components

| Component | Change Type | Scope |
| ----------- | ------------ | ------- |
| Task Execution guide | Add conditional Team Execution section (§2 + §3.3) | CC only |
| Build config (`build-config.json`) | Add `teamGuidance` field for Claude Code target | Build system |
| Placeholder processor (`placeholders.js`) | Add `{WORKER_TEAM_GUIDANCE}` replacement | Build system |

---
