# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Claude Code Agent Teams Integration (Future)

**Context:** Claude Code's experimental Agent Teams feature enables Workers to internally spawn a team and parallelize work within their assigned task scope. The Worker becomes the team lead, assigns sub-work to teammates, synthesizes results, and reports back through the standard bus protocol. The Manager is unaware this happened — reports and memory logs have the same structure regardless.

**Status:** Future work. Depends on an experimental platform feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable), disabled by default. Optional and platform-exclusive. Reference: <https://code.claude.com/docs/en/agent-teams>

This applies exclusively to Claude Code and is delivered through the existing conditional placeholder system — a new placeholder (e.g., `{WORKER_TEAM_GUIDANCE}`) resolves to Team Execution Standards for Claude Code and to empty string for all other platforms. No new skill file; the placeholder inserts content into the Task Execution guide as an Operational Standard (§2) and a conditional step (§3.3).

Appropriate for batch assignments with 3+ independent sub-tasks or single complex tasks with multiple independent deliverables touching distinct file groups. Not appropriate for tightly sequential work or where coordination overhead exceeds the benefit. Each teammate operates on a sub-branch off the Worker's branch; the Worker merges teammate branches and resolves conflicts before reporting. All teammates must be shut down and cleaned up before the Worker writes its Memory Log and Report — team resources are ephemeral. APM Workers are independent sessions (not teammates), enabling multi-team coordination (e.g., Frontend Team and Backend Team concurrently) without platform-level nested team support.

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

## Session Continuation Workflow (Future)

**Context:** Designing a mechanism to close the agentic loop when an APM session completes. Users need to archive completed sessions and start fresh while optionally leveraging previous session context.

When an APM session completes (all stages done, deliverables working), there is no formal continuation mechanism. The Manager can add tasks but lacks the Planner's discovery capabilities. Existing artifacts reflect completed work, not new scope. Users need to start fresh while optionally preserving access to previous session context.

**Status:** Future work. Requires a new CLI command, a new standalone slash command, and additions to the Planner's Context Gathering procedure.

### Design Principles

1. **No programmatic linking** - Archives are storage, not dependency sources. Automatic session linking creates fragile dependency chains -- Session B may invalidate Session A's context without explicit relationship.
2. **User decides relevance** - The Planner asks about archives; it does not assume they are relevant.
3. **Verify before asking** - Context retrieval and codebase verification happen BEFORE the Planner incorporates archived context into question rounds. Stale context is worse than no context.
4. **Snapshot acknowledgment** - Summaries and archives explicitly state their point-in-time nature. The archived context is a snapshot; the codebase is mutable.

### Component 1: `apm continue` CLI Command

**What:** A CLI command that archives the current session's APM artifacts and creates fresh templates for a new session.

**Behavior:**

```markdown
apm continue [-n|--name <name>]
```

1. Prompt for archive name (or use `--name` flag, or generate default)
2. Move coordination artifacts and Memory to `.apm/archives/<name>/`
3. Clear the bus directory entirely (bus state is ephemeral and session-specific; it is not archived)
4. Create fresh template artifacts (Implementation Plan, Specifications, Memory Root)
5. Output completion message with archive path

**Archive Structure:**

```markdown
.apm/archives/<name>/
├── Implementation_Plan.md
├── Specifications.md
├── APM_Session_Summary.md    # Only if summarize command was run before continue
└── Memory/
```

The bus directory (`.apm/bus/`) is not archived. It contains ephemeral session state (Task Bus, Report Bus, Handoff Bus files) that is meaningless outside the session that created it. A new session will have different Workers and a fresh bus layout.

### Component 2: `/apm-summarize-session` Standalone Command

**What:** A lightweight slash command that any agent on any platform can run to produce a high-level summary of the completed APM session. This is a standalone command, not an APM Agent workflow -- it does not require initiating a Planner, Manager, or Worker. Any agent in any session can run it as a quick summarization pass over the APM artifacts.

**Rationale:** Making this a full APM Agent workflow (with its own initiation command) would add friction to what should be a simple pre-archival step. The command reads existing artifacts, synthesizes a summary, and writes one file. No coordination, no bus communication, no Task Logging.

**Output:** `APM_Session_Summary.md` written to `.apm/`. Contains a point-in-time summary of the session: project scope, stages completed, key outcomes, notable findings, and known issues. Explicitly states that it is a snapshot and the codebase may have diverged.

**Usage:** Optional. Run before `apm continue` if the User wants a summary preserved in the archive. If not run, the archive contains the raw artifacts (Implementation Plan, Specifications, Memory) which are sufficient for a future Planner to examine.

### Component 3: Planner Context Detection

**What:** Additions to the Context Gathering guide that enable the Planner to detect and optionally leverage archived sessions from previous APM runs.

**§0.1 Previous Session Detection:**

1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any of these previous sessions relevant to the current project scope? If so, which ones, and are there any caveats?"
4. User decides: none (proceed with fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if User indicates relevance):**

1. Spawn exploration subagent to examine the indicated archive(s) -- read Implementation Plan, Specifications, Session Summary (if present), and Memory Root Stage Summaries
2. Spawn verification subagent to check archived context against the current codebase -- identify what still holds, what has changed, and what has been invalidated
3. Integrate verified findings into question rounds as delta-focused questions (what changed since the archived session, not re-asking what was already established)

### Open Questions

1. **Default archive naming:** Incremental (`session-1`, `session-2`) vs timestamp-based (`2026-02-05`)? Incremental is simpler; timestamps are self-documenting.
2. **Summary command naming:** `/apm-summarize-session` vs `/apm-session-summary`? The verb-first form is consistent with APM command naming patterns.
3. **Stale archive cleanup:** Should there be an `apm archives --prune` command for removing old archives? Or is manual cleanup sufficient?
4. **Multi-archive selection:** Can the User indicate multiple archives as relevant? If so, how does the Planner handle conflicting context across archives?

### Affected Components

| Component | Change Type | Scope |
| ----------- | ------------ | ------- |
| CLI (`src/commands/`) | New `continue` command | CLI |
| Standalone command template | New `/apm-summarize-session` command | All platforms |
| Context Gathering guide | Add §0.1 and §0.2 for archive detection and retrieval | All platforms |
| APM Session Summary template | New `APM_Session_Summary.md` format definition | All platforms |
| `.apm/` directory structure | Archive subdirectory convention | All platforms |

---
