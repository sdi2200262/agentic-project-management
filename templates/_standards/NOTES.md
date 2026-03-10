# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Claude Code Agent Teams Integration (Future)

**Context:** Claude Code's experimental Agent Teams feature enables Workers to internally spawn a team and parallelize work within their assigned task scope. The Worker becomes the team lead, assigns sub-work to teammates, synthesizes results, and reports back through the standard bus protocol. The Manager is unaware this happened - reports and memory logs have the same structure regardless.

**Status:** Future work. Depends on an experimental platform feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable), disabled by default. Optional and platform-exclusive. Reference: <https://code.claude.com/docs/en/agent-teams>

This applies exclusively to Claude Code and is delivered through the existing conditional placeholder system - a new placeholder (e.g., `{WORKER_TEAM_GUIDANCE}`) resolves to Team Execution Standards for Claude Code and to empty string for all other platforms. No new skill file; the placeholder inserts content into the Task Execution guide as an Operational Standard (§2) and a conditional step (§3.3).

Appropriate for batch assignments with 3+ independent sub-tasks or single complex tasks with multiple independent deliverables touching distinct file groups. Not appropriate for tightly sequential work or where coordination overhead exceeds the benefit. Each teammate operates on a sub-branch off the Worker's branch; the Worker merges teammate branches and resolves conflicts before reporting. All teammates must be shut down and cleaned up before the Worker writes its Task Log and Report - team resources are ephemeral. APM Workers are independent sessions (not teammates), enabling multi-team coordination (e.g., Frontend Team and Backend Team concurrently) without platform-level nested team support.

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
4. Create fresh template artifacts (Plan, Spec, Tracker, Index)
5. Output completion message with archive path

**Archive Structure:**

```markdown
.apm/archives/<name>/
├── plan.md
├── spec.md
├── tracker.md
├── APM_Session_Summary.md    # Only if summarize command was run before continue
└── memory/
```

The bus directory (`.apm/bus/`) is not archived. It contains ephemeral session state (Task Bus, Report Bus, Handoff Bus files) that is meaningless outside the session that created it. A new session will have different Workers and a fresh bus layout.

### Component 2: `/apm-summarize-session` Standalone Command

**What:** A lightweight slash command that any agent on any platform can run to produce a high-level summary of the completed APM session. This is a standalone command, not an APM Agent workflow -- it does not require initiating a Planner, Manager, or Worker. Any agent in any session can run it as a quick summarization pass over the APM artifacts.

**Rationale:** Making this a full APM Agent workflow (with its own initiation command) would add friction to what should be a simple pre-archival step. The command reads existing artifacts, synthesizes a summary, and writes one file. No coordination, no bus communication, no Task Logging.

**Output:** `APM_Session_Summary.md` written to `.apm/`. Contains a point-in-time summary of the session: project scope, stages completed, key outcomes, notable findings, and known issues. Explicitly states that it is a snapshot and the codebase may have diverged.

**Usage:** Optional. Run before `apm continue` if the User wants a summary preserved in the archive. If not run, the archive contains the raw artifacts (Plan, Spec, Tracker, Memory) which are sufficient for a future Planner to examine.

### Component 3: Planner Context Detection

**What:** Additions to the Context Gathering guide that enable the Planner to detect and optionally leverage archived sessions from previous APM runs.

**§0.1 Previous Session Detection:**

1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any of these previous sessions relevant to the current project scope? If so, which ones, and are there any caveats?"
4. User decides: none (proceed with fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if User indicates relevance):**

1. Spawn exploration subagent to examine the indicated archive(s) -- read the Plan, Spec, Session Summary (if present), and Index Stage Summaries
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

## Workflow Runtime Efficiency Improvements

**Context:** Commit `585b2d8` (v1.0.0-test-10) introduced write-side efficiency for the Manager's Tracker update cycle: batched edits, eliminated redundant VC state duplication, Waiting-to-Active lifecycle shortcut, and deferred Memory Notes. This note extends that work to read-side and procedural efficiency across the entire workflow runtime -- terminal command merges, context-aware read avoidance, and edit batching through document structure.

**Status:** Proposed. Affects commands, guides, skills, and the workflow spec.

**Motivation:** Every file operation is a tool call that costs context tokens and wall time. Agents should use the minimum number of tool calls to achieve each procedural step. Three patterns recur: (A) multiple sequential terminal operations that collapse into one invocation, (B) file re-reads of content already in context, and (C) multiple edits to the same file that could be one contiguous edit.

### Cross-Platform Approach

Instructions provide concrete Unix/Linux terminal commands as the primary guidance, with a "(or platform equivalent)" qualifier where needed. This gives agents on Linux/Mac (the majority of APM users) exact patterns to follow while signaling Windows/PowerShell users to adapt. Git commands need no qualifier -- git is cross-platform.

Existing inconsistency to address: §4.5 Bus Initialization prescribes `mkdir -p` and `touch` without qualification; §4.9 Clear-on-Return uses `e.g.` correctly. New instructions should follow the `e.g.` pattern, and §4.5 should be aligned.

### A. Terminal Command Merges

Multiple sequential tool calls that collapse into a single terminal invocation.

**A1. Check Reports no-arg scan** (`commands/apm-5-check-reports.md`, step 2)

*Current:* Separate actions -- list directory contents, check file sizes, then read each bus individually. An agent interprets this as 1 + N tool calls (listing + N reads), including reads of empty buses.

*Proposal:* Merge scanning and reading into a single terminal invocation, e.g., `for f in .apm/bus/*/report.md; do [ -s "$f" ] && echo "=== $f ===" && cat "$f"; done` (or platform equivalent). One tool call discovers non-empty buses, reads their content, and includes path markers so the Manager can cross-reference against active dispatches and flag unexpected content.

**A2. Check Reports targeted scan** (`commands/apm-5-check-reports.md`, step 1)

*Current:* When multiple agent-ids are provided, each Report Bus is checked individually -- N tool calls.

*Proposal:* Batch-read all targeted Report Buses in a single terminal invocation, e.g., `cat .apm/bus/agent-1/report.md .apm/bus/agent-2/report.md` (or platform equivalent). One tool call replaces N.

**A3. Worker Initiation steps 3+4 merge** (`commands/apm-3-initiate-worker.md`, §2.1)

*Current:* Step 3 lists the bus directory to confirm files exist. Step 4 checks handoff.md for content. Two separate operations.

*Proposal:* Merge into one directory listing with file sizes, e.g., `ls -la .apm/bus/<agent-slug>/` (or platform equivalent). File existence is confirmed (step 3) and handoff.md size > 0 means content is present (step 4) -- proceed to §2.2 to read it. Size 0 means no handoff -- skip to §2.3 without ever reading the file. One tool call replaces two; in the common case (new Worker, no handoff), the handoff file is never read.

**A4. VC Cleanup batching at Stage end** (`skills/apm-version-control/SKILL.md`, §3.5)

*Current:* Per-merge cleanup cycle: remove worktree, delete branch, verify clean state -- repeated per branch. N branches = N * 3 operations across multiple tool calls.

*Proposal:* During Stage-end merge sweeps, batch all worktree removals and branch deletions into a single terminal invocation, then verify once: `git worktree remove <path1> && git worktree remove <path2> && git branch -d <branch1> && git branch -d <branch2> && git worktree list && git branch`. One tool call replaces N * 3. Git commands -- no platform qualifier needed.

**A5. VC Stale state detection** (`skills/apm-version-control/SKILL.md`, §2.1)

*Current:* "Detect and clean during initialization" -- detection method unspecified. The Manager may fall back to reading the Tracker and individually verifying each expected branch.

*Proposal:* Specify detection method: `git worktree list && git branch` in a single invocation gives complete VC ground truth -- all worktrees (including dangling) and all branches (including orphaned). Reliable post-crash detection independent of potentially stale Tracker state. Git commands -- no qualifier needed.

**A6. Stage Summary log enumeration** (`guides/task-review.md`, §3.5 step 1)

*Current:* "Review all Task Logs for the completed Stage" -- implies the Manager constructs each path from the Tracker and reads each individually.

*Proposal:* Use a terminal directory listing, e.g., `ls .apm/memory/stage-<NN>/` (or platform equivalent), to enumerate all log files. Serves the Task Log reference list for §4.4 Stage Summary Format, catches logs from dynamically added Tasks that manual path construction might miss, and is 1 tool call instead of N path constructions. Content synthesis uses logs already in context (see B3).

### B. Context-Aware Read Avoidance

Agents are LLMs. Their context window IS their working memory. When a file is read at session start, its content remains in context until autocompaction evicts it. Re-reading an unmodified file produces identical content already present -- pure waste. The only time a re-read has genuine value is when the file changed since last read. The read-before-edit pattern (mandatory for edit tooling) already handles this: whenever an agent modifies a file, it reads the file first, so the latest version is automatically at the top of context after any modification.

These changes clarify that procedural "review" instructions mean cognitive extraction from context, not file read operations.

**B1. Per-Task Spec extraction** (`guides/task-assignment.md`, §3.2 step 4)

*Current:* "Review the Spec for content relevant to this Task" -- ambiguously implies a file read per Task during dispatch.

*Proposal:* Clarify that the Manager extracts from the Spec already in context. The Spec was read at session start and is refreshed automatically whenever the Manager modifies it (read-before-edit is mandatory). Per-Task file reads of an unmodified Spec are redundant. A re-read is warranted only at the start of a new Stage's first dispatch as a reasonable attention refresh, not per Task.

**B2. Cross-agent dependency log de-duplication** (`guides/task-assignment.md`, §3.2 step 3)

*Current:* "For cross-agent dependencies, read the producer's Task Log" -- if Tasks 2.1, 2.2, and 2.3 all depend on Task 1.5, the log is read three times during per-Task analysis.

*Proposal:* Clarify that unique producer Task Logs are read once per dispatch cycle. Subsequent Tasks referencing the same producer extract from content already in context.

**B3. Stage Summary log synthesis** (`guides/task-review.md`, §3.5 step 1)

*Current:* "Review all Task Logs for the completed Stage" -- implies re-reading all logs when the Manager already reviewed each one during individual §3.2 Task Log Reviews throughout the Stage.

*Proposal:* Clarify that synthesis is from logs already reviewed. Combined with A6: directory listing for file enumeration (reference list), context for content (prose summary).

### C. Edit Efficiency Through Document Structure

The edit tool works as line-level diffs -- it matches a unique string and replaces it. Changing N scattered locations requires N edit calls. Changing one contiguous block requires 1 edit call. Document organization determines edit efficiency.

**C1. Index contiguous edit** (`guides/task-review.md`, §3.5 steps 2+4)

*Current:* Two modifications to the Index during Stage Summary: add Memory Notes (step 2), append Stage Summary (step 4). These could be interpreted as two separate edits.

*Proposal:* Explicitly note that the Index structure (Memory Notes section above Stage Summaries section) enables both modifications in a single contiguous edit -- match from `## Memory Notes` through end of file, replace with the updated content. Combined with one Tracker edit (removing distilled Working Notes), the entire §3.5 touches each file exactly once.

### Open Questions

1. **Existing §4.5 inconsistency:** Bus Initialization already prescribes `mkdir -p` and `touch` without platform qualification. Should this be aligned with the "(or platform equivalent)" pattern as part of this work, or addressed separately?
2. **Autocompaction and re-reads:** The B-category proposals assume content stays in context until Handoff. In practice, autocompaction may compress earlier reads. Should procedures include guidance for extended sessions where autocompaction is likely, or is Handoff the right mechanism for context degradation?
3. **A1 health check specifics:** The current Check Reports no-arg scan includes a health check for "unexpected content" in non-active Worker buses. The merged terminal invocation naturally covers this (it scans all buses, not just active ones), but should the procedure explicitly state how the Manager should handle unexpected reports?

### Affected Components

| Component | Change Type | Category |
| --------- | ----------- | -------- |
| `commands/apm-5-check-reports.md` | Merge scan + read into single invocation (steps 1-2) | A1, A2 |
| `commands/apm-3-initiate-worker.md` | Merge steps 3+4 into single listing (§2.1) | A3 |
| `skills/apm-version-control/SKILL.md` | Batch cleanup (§3.5), specify stale detection (§2.1) | A4, A5 |
| `guides/task-review.md` | Log enumeration (§3.5), synthesis from context (§3.5), contiguous Index edit (§3.5) | A6, B3, C1 |
| `guides/task-assignment.md` | Context extraction language (§3.2 steps 3-4) | B1, B2 |
| `_standards/WORKFLOW.md` | Platform approach note in §4.2 bus system description | Cross-cutting |
| `skills/apm-communication/SKILL.md` | Align §4.5 Bus Initialization with platform pattern (if Q1 resolved) | Cross-cutting |

---
