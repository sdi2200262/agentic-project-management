# Research: GitButler Integration for APM Parallel Dispatch

## Executive Summary

This report evaluates [GitButler](https://github.com/gitbutlerapp/gitbutler) as a potential tool for managing parallel task execution in APM's Implementation Phase. The analysis covers GitButler's capabilities, how they map to APM's parallel dispatch requirements, and provides a recommendation for integration strategy.

**Conclusion:** GitButler is a strong optional enhancement for APM parallel dispatch, but should not replace vanilla git as the base layer. The recommended approach is a tiered `apm-version-control` universal skill with git as the foundation and GitButler as an opt-in accelerator.

---

## 1. GitButler Overview

GitButler is a Rust-based git client that introduces **virtual branches** — the ability to work on multiple branches simultaneously in a single working directory without switching. It provides both a desktop GUI (Tauri/Svelte) and a standalone CLI called `but`.

### 1.1 Core Capabilities

| Capability | Description | APM Relevance |
|---|---|---|
| **Virtual Branches** | Multiple branches coexist in one working directory; hunks are assigned ownership to specific branches | Eliminates worktree directory management |
| **`but` CLI** | Full Rust CLI with `--json` output on all commands | Scriptable by agents, no GUI needed |
| **MCP Server** | `but mcp` exposes GitButler operations to AI agents via Model Context Protocol | Direct agent integration path |
| **Claude Code Hooks** | `but claude pre-tool` / `but claude post-tool` / `but claude stop` — automatic branch isolation per agent session | Built for multi-agent parallel editing |
| **Hunk Ownership** | File-level and hunk-level assignment of changes to branches | Granular conflict prevention |
| **Operations Log** | All operations logged with full undo/restore capability | Safety net for agent operations |
| **Stacked Branches** | Dependent branch chains with automatic restacking on amend | Maps to APM's dependency chains |
| **Conflict Handling** | Rebases always succeed; conflicts are marked for resolution rather than blocking | Prevents agent workflow interruption |

### 1.2 How Virtual Branches Work (Technical)

1. A **target branch** is set (e.g., `origin/main`) — all work is defined as diffs from this target
2. Working directory changes are decomposed into **hunks** (changed line groups)
3. Each hunk is assigned **ownership** to a virtual branch
4. Multiple virtual branches coexist in the **same working directory**
5. On commit, GitButler builds **in-memory trees** per branch, isolating each branch's changes
6. A `gitbutler/workspace` integration branch maintains `git status` / `git diff` compatibility
7. Pushed commits appear on remotes as if only that branch's changes existed

This is fundamentally different from `git worktree`, which creates separate directories per branch. GitButler's approach means no directory management overhead — but it also means changes share a single filesystem, relying on hunk-level tracking for isolation rather than physical separation.

### 1.3 CLI (`but`) Command Surface

Key commands relevant to agentic workflows:

| Command | Purpose |
|---|---|
| `but init` | Initialize GitButler in a repo |
| `but status` | Show virtual branch status (default command) |
| `but branch` / `but branch new` | Create and manage virtual branches |
| `but rub` | Assign file hunks to specific branches |
| `but mark` / `but unmark` | Set auto-assignment rules for files |
| `but commit` | Commit changes (all or only assigned via `-o`) |
| `but push` / `but publish` | Push branches to remote |
| `but absorb` | Auto-absorb uncommitted changes into logical commits |
| `but oplog` / `but undo` / `but restore` | Operations log and undo |
| `but mcp` | Start MCP server for AI agent integration |
| `but claude pre-tool` / `post-tool` / `stop` | Claude Code hooks for automatic branch isolation |

All commands support `--json` / `-j` for machine-readable structured output.

### 1.4 Installation & Dependencies

| Method | Platform | Notes |
|---|---|---|
| `brew install gitbutler` | macOS, Linux (Linuxbrew) | CLI only, no GUI needed |
| `curl -fsSL https://gitbutler.com/install.sh \| sh` | macOS, Linux | Script install |
| Build from source (`cargo build`) | Any with Rust toolchain | Requires Rust only for CLI |

The `but` CLI is a standalone Rust binary. It does **not** require the desktop GUI, Node.js, or Tauri. For headless/server environments, building from source via `cargo` is viable.

**License:** Fair Source (non-compete clause, becomes MIT after 2 years).

---

## 2. APM's Current Parallel Dispatch Model

### 2.1 What WORKFLOW.md Specifies

APM's parallel dispatch (§7.3) relies on:

1. **Dispatch Assessment** — Manager identifies Ready Tasks, groups by Worker, evaluates batch and parallel candidacy
2. **Branch-Based Isolation** — Each parallel Worker creates their own branch off main
3. **File-Partitioned Decomposition** — Planner ensures distinct file ownership per Worker where possible (complementary to branching, not a replacement)
4. **Hierarchical Merging** — Manager coordinates bottom-up merges: teammates → Worker branch → main
5. **No Built-In Locking** — APM has no file-level locking mechanism; conflict prevention is structural

### 2.2 Current Git Usage

APM currently has **no git automation tooling or skill**. Git operations are:
- Included as **plain-text instructions** in Task Prompts (e.g., "create branch `feat/user-auth`")
- Executed by **Worker agents** directly (running `git checkout -b`, `git commit`, etc.)
- **Merge coordination** is Manager-directed but not automated — Manager tells User when merges are needed

### 2.3 Pain Points the Parallel Dispatch Model Creates

1. **Worktree Management Burden** — If using `git worktree` for true parallel isolation, Workers and/or Users must create, navigate, and clean up separate directories
2. **No Automated Conflict Detection** — Conflicts only surface at merge time
3. **Manual Branch Lifecycle** — Branch creation, switching, committing, and merging are all manual steps embedded in Task Prompts
4. **Merge Coordination Complexity** — Manager must track which branches exist, which are ready to merge, and direct the User or Workers to execute merges
5. **Context Overhead** — Branch instructions consume Task Prompt space and add cognitive load to Workers

---

## 3. Fit Analysis: GitButler for APM

### 3.1 Where GitButler Addresses APM Pain Points

| APM Pain Point | GitButler Solution | Effectiveness |
|---|---|---|
| Worktree directory management | Virtual branches — single directory, multiple branches | **Strong** — eliminates the problem entirely |
| No automated conflict detection | Hunk ownership tracking detects overlaps immediately | **Strong** — conflicts visible at edit time, not merge time |
| Manual branch lifecycle | `but branch new`, `but commit -o`, `but push` — streamlined commands | **Moderate** — still requires commands, but fewer and simpler |
| Merge coordination | In-memory tree construction means branches are always merge-ready | **Strong** — reduces merge complexity significantly |
| Branch instructions in Task Prompts | Could be handled by skill, removing boilerplate from prompts | **Strong** — if wrapped in a universal skill |

### 3.2 Where GitButler Introduces Concerns

| Concern | Details | Severity |
|---|---|---|
| **Additional dependency** | Requires `but` binary installed; not part of standard git | **Medium** — acceptable if optional |
| **Platform agnosticism** | APM is platform-agnostic by design; GitButler is a specific tool | **Medium** — mitigated by making it optional |
| **Shared working directory risk** | Virtual branches share one directory — concurrent file writes by different agent processes could still conflict at the OS level | **High** — virtual branches solve git-level isolation, but not filesystem-level race conditions from truly simultaneous writes |
| **Learning curve for agents** | Agents need to understand `but` commands and hunk ownership model | **Low** — can be fully specified in skill document |
| **Maturity** | `but` CLI is relatively new (2024-2025); less battle-tested than git | **Medium** — active development, but potential for breaking changes |
| **License** | Fair Source with non-compete clause (becomes MIT after 2 years) | **Low** — unlikely to affect APM usage |

### 3.3 Critical Architectural Consideration

**Virtual branches vs. worktrees for truly parallel agents:**

GitButler's virtual branches solve the problem of *one developer* working on multiple branches. They assume a single actor making changes, with GitButler tracking which changes belong to which branch.

APM's parallel dispatch involves **multiple independent agent processes** potentially editing files simultaneously. This creates two distinct isolation requirements:

1. **Git-level isolation** (which branch owns which changes) — GitButler handles this well
2. **Filesystem-level isolation** (preventing concurrent writes to the same file) — GitButler does **not** solve this, because all virtual branches share one working directory

For truly concurrent agent execution (multiple Claude Code sessions running simultaneously), `git worktree` actually provides stronger isolation because each agent operates in a physically separate directory. GitButler's virtual branches are better suited for **sequential** multi-branch work or for scenarios where file ownership is pre-partitioned (which APM already recommends).

**However**, GitButler's Claude Code hooks (`but claude pre-tool` / `but claude post-tool`) are specifically designed to handle this — they coordinate file writes between multiple simultaneous Claude Code sessions by automatically assigning each session's edits to a separate branch. This means the hooks layer adds the filesystem coordination that virtual branches alone don't provide.

---

## 4. Proposed Integration: `apm-version-control` Universal Skill

### 4.1 Design Approach: Tiered Architecture

```
┌─────────────────────────────────────────────┐
│          apm-version-control Skill          │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │     Tier 1: Git Base (Required)       │  │
│  │                                       │  │
│  │  - Branch creation & switching        │  │
│  │  - Committing with conventions        │  │
│  │  - Worktree management (parallel)     │  │
│  │  - Merge coordination protocol        │  │
│  │  - Conflict resolution guidance       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Tier 2: GitButler Enhanced (Optional)│  │
│  │                                       │  │
│  │  - Virtual branch management          │  │
│  │  - Hunk ownership assignment          │  │
│  │  - Simplified merge via but CLI       │  │
│  │  - Operations log & undo safety net   │  │
│  │  - Auto-assignment rules (but mark)   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 4.2 How It Would Work Within APM

**Skill Loading:** Like `apm-communication`, the `apm-version-control` skill would be loaded by both Manager and Worker agents. The Manager uses it for merge coordination and branch strategy. Workers use it for branch operations during task execution.

**Tier Detection:** On first use, the skill checks for `but` availability. If present, Tier 2 operations are available. If not, Tier 1 (vanilla git) is used. This is transparent to the workflow.

**Integration Points with Existing APM Flow:**

1. **Manager Session 1 (Initiation):**
   - Skill detects git state and available tooling
   - Initializes branch strategy (worktree-based or virtual-branch-based)
   - Records chosen tier in Memory Root for consistency across Handoffs

2. **Task Assignment (Manager):**
   - Skill generates branch instructions for Task Prompts (replaces current manual inclusion)
   - For parallel dispatch: creates branches/worktrees or virtual branches per Worker
   - Tracks active branches and pending merges

3. **Task Execution (Worker):**
   - Worker invokes skill to enter assigned branch/worktree
   - Commits work per conventions defined in skill
   - Reports branch state in Task Memory Log

4. **Task Review (Manager):**
   - Skill assists with merge readiness assessment
   - Coordinates merge execution at dependency points
   - Handles conflict resolution guidance

5. **Stage Transitions:**
   - Skill ensures all parallel branches are merged before Stage completion
   - Cleans up worktrees or virtual branches

### 4.3 Skill Structure (Following STRUCTURE.md Conventions)

```
templates/skills/apm-version-control/
├── SKILL.md                  # Main skill document (both tiers)
└── apm-vc-integration.md     # Integration guide for non-APM agents
```

**SKILL.md Sections:**
- §1 Overview — How to use, objectives, outputs, tier system
- §2 Operational Standards — Branch naming, commit conventions, merge rules, tier detection, conflict resolution
- §3 Procedure — Branch initialization, task branch operations, merge coordination, cleanup
- §4 Structural Specifications — Branch naming patterns, commit message format, worktree layout
- §5 Content Guidelines — Common mistakes, tier-specific guidance

### 4.4 Parallel Dispatch Flow Comparison

**Current (No Skill, Manual Instructions):**
```
Manager                          Worker A                    Worker B
────────                         ────────                    ────────
Write branch instructions
in Task Prompt A
Write branch instructions
in Task Prompt B
                                 Read instructions           Read instructions
                                 git checkout -b feat/a      git checkout -b feat/b
                                 ... execute task ...        ... execute task ...
                                 git add && git commit       git add && git commit
                                 Report branch name          Report branch name
Read reports
Figure out merge order
Direct User to merge
User executes merges
```

**With Skill, Tier 1 (Vanilla Git + Worktrees):**
```
Manager                          Worker A (worktree-a/)      Worker B (worktree-b/)
────────                         ──────────────────────      ──────────────────────
Skill: create worktrees
Skill: generate branch
  instructions (automated)
                                 Skill: enter worktree       Skill: enter worktree
                                 ... execute task ...        ... execute task ...
                                 Skill: commit & report      Skill: commit & report
Skill: assess merge readiness
Skill: coordinate merges
Skill: cleanup worktrees
```

**With Skill, Tier 2 (GitButler Virtual Branches):**
```
Manager                          Worker A (same dir)         Worker B (same dir)
────────                         ─────────────────           ─────────────────
Skill: but branch new per-task
Skill: but mark file ownership
                                 Skill: verify branch        Skill: verify branch
                                 ... execute task ...        ... execute task ...
                                 Skill: but commit -o        Skill: but commit -o
Skill: assess merge readiness
Skill: but push per branch
Skill: merge via standard git
```

---

## 5. Recommendation

### 5.1 Use Git as the Base, GitButler as Optional Enhancement

**Rationale:**

1. **Platform agnosticism is an APM core principle.** Git is universally available. GitButler adds a dependency that may not be installable in all environments. Making git the base respects this principle.

2. **Git worktrees provide stronger physical isolation.** For truly concurrent agent processes writing files simultaneously, separate directories are safer than virtual branches in a shared directory. Worktrees are native git — no additional tooling required.

3. **GitButler's value is real but situational.** When file ownership is clearly partitioned (which APM already recommends), GitButler's virtual branches reduce overhead significantly. The hunk ownership model, operations log, and simplified merge flow are genuine improvements over manual git workflows.

4. **The `but` CLI is agent-friendly.** JSON output, MCP server, and Claude Code hooks demonstrate first-class support for agentic workflows. This is not an afterthought — it's a design goal of GitButler.

5. **Risk is manageable as optional.** If `but` breaks or isn't available, the skill falls back to git. No workflow is blocked.

### 5.2 What Should Not Be Done

- **Do not make GitButler required.** It would violate platform agnosticism and add a hard dependency.
- **Do not replace git worktrees with virtual branches for truly concurrent agents.** Virtual branches in a shared directory have filesystem race condition risks that worktrees avoid.
- **Do not implement this skill before the Implementation Phase refactor.** The skill needs to integrate with the refactored task-assignment and task-execution guides. Building it against the current unrefactored Implementation Phase procedures would create rework.

### 5.3 Implementation Priority

This skill should be built **after** the Implementation Phase refactor is complete (task-assignment.md, task-execution.md, memory-maintenance.md guides are finalized), because:

1. The skill's integration points (Task Prompt generation, Worker branch operations, merge coordination) are defined by those guides
2. The parallel dispatch protocol in task-assignment.md will determine exactly what branch operations the skill needs to support
3. Building the skill first would mean retrofitting it to match the refactored guides

### 5.4 Suggested Next Steps

1. Complete Implementation Phase refactor (task-assignment, task-execution guides)
2. Design the `apm-version-control` skill specification (following STRUCTURE.md skill format)
3. Implement Tier 1 (vanilla git + worktrees) as the base
4. Implement Tier 2 (GitButler enhancement) as optional overlay
5. Update task-assignment guide to reference the skill for branch instruction generation
6. Update task-execution guide to reference the skill for branch operations
7. Test both tiers in a parallel dispatch scenario

---

## 6. Sources

All research was conducted using official documentation:

- [GitButler GitHub Repository](https://github.com/gitbutlerapp/gitbutler)
- [GitButler Official Documentation](https://docs.gitbutler.com/)
- [GitButler CLI Overview](https://docs.gitbutler.com/cli-overview)
- [GitButler CLI Commands](https://docs.gitbutler.com/commands/commands-overview)
- [GitButler Virtual Branches](https://docs.gitbutler.com/features/branch-management/virtual-branches)
- [GitButler Integration Branch](https://docs.gitbutler.com/features/virtual-branches/integration-branch)
- [GitButler MCP Server](https://docs.gitbutler.com/features/ai-integration/mcp-server)
- [GitButler Claude Code Hooks](https://docs.gitbutler.com/features/ai-integration/claude-code-hooks)
- [GitButler Agents Tab](https://docs.gitbutler.com/features/agents-tab)
- [Blog: Building Virtual Branches](https://blog.gitbutler.com/building-virtual-branches)
- [Blog: Introducing the but CLI](https://blog.gitbutler.com/but-cli)
- [Blog: Git Worktrees and GitButler](https://blog.gitbutler.com/git-worktrees)
- APM Internal: `_standards/WORKFLOW.md`, `_standards/NOTES.md`, `_standards/STRUCTURE.md`, `_standards/TERMINOLOGY.md`
- APM Internal: `skills/apm-communication/SKILL.md`, `skills/apm-communication/apm-bus-integration.md`

---

**End of Research Document**
