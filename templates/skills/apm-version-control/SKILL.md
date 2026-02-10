---
name: apm-version-control
description: Version control coordination for workspace isolation during parallel dispatch.
---

# APM {VERSION} - Version Control Skill

## 1. Overview

**Reading Agent:** Manager Agent, Worker Agent

This skill defines version control operations for workspace isolation during the Implementation Phase. The Manager uses it to initialize git, create branches and worktrees, coordinate merges, and track VC state. Workers use it to understand their workspace context and commit conventions.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for VC initialization, branch operations, worktree operations, merge coordination, and cleanup. See §3 Version Control Procedure.

**Use Operational Standards for reasoning and decisions.** When detecting repository state, choosing between branch-only and worktree dispatch, naming branches, or resolving merge conflicts, consult the relevant standards subsection. See §2 Operational Standards.

**Follow Structural Specifications.** Branch naming, worktree directory layout, and Working Notes VC entries follow the conventions defined in Structural Specifications. See §4 Structural Specifications.

### 1.2 Objectives

- Initialize version control during Manager Session 1 when a git repository is present
- Provide workspace isolation through feature branches and worktrees for parallel dispatch
- Coordinate merges as a dispatch prerequisite — merge completed branches before dispatching dependent Tasks
- Track VC state in Working Notes for Handoff continuity

### 1.3 Outputs

**Feature branches:** One branch per dispatch unit (single Task or batch), created off the base branch. Naming follows project conventions established during VC initialization.

**Worktrees:** Isolated working directories under `.apm/worktrees/` for parallel dispatch. Each worktree is checked out on its own feature branch.

**Working Notes VC Entry:** VC state recorded in Memory Root Working Notes — base branch, active branches, pending merges.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for version control operations.

### 2.1 Repository Detection Standards

The Manager detects existing repository state during Session 1 initialization. Detection is passive — the Manager reads what exists rather than imposing configuration.

**Detection checks:**
- Is git initialized in the project directory? If no, initialize and inform the User.
- What is the current branch? This becomes the base branch unless the User specifies otherwise.
- Where is `.apm/` relative to the repository root? Both paths are recorded for worktree path construction.
- Is `.apm/worktrees/` in `.gitignore`? If not, add it.

**Stale state recovery.** If leftover worktrees or branches from a prior session exist (e.g., crash recovery), the Manager detects and cleans them during initialization — removing worktrees and deleting orphaned feature branches.

### 2.2 Branch Standards

Every dispatch unit (single Task or batch) gets its own feature branch off the base branch. This applies to both sequential and parallel dispatch.
- **Naming convention:** Established during VC initialization based on the project's existing conventions or User preference. Branch names should be descriptive of the work being performed. For batches, the name should reflect the batch scope.
- **One branch per dispatch.** A batch of sequential Tasks assigned to the same Worker shares one branch. The Worker executes all Tasks on it, then the Manager merges after review.

### 2.3 Worktree Standards

Worktrees are created only for parallel dispatch — when multiple Workers need to operate in physically separate directories simultaneously. For sequential dispatch, the Worker operates in the main working directory on their feature branch.
- **Placement:** `.apm/worktrees/<branch-slug>/` where `<branch-slug>` is derived from the branch name (e.g., replacing `/` with `-`).
- **Concurrency limit:** Maximum 3-4 concurrent worktrees. Each worktree contains a full checkout of all tracked files, so disk usage scales linearly with working directory size. The Manager factors this cost into dispatch decisions for large repositories.
- **Lifecycle:** Worktrees are short-lived — created before dispatch, removed promptly after merge. The Manager does not accumulate worktrees across dispatch cycles.
- **Untracked files.** Worktrees contain only tracked files. If a Worker needs untracked assets (data files, local configs), the Manager notes this in the Task Prompt so the Worker can address it.

### 2.4 Merge Standards

Merge state is a dispatch prerequisite. The Manager merges completed feature branches into the base branch at specific coordination points.

**Merge timing:**
- *After successful Task Review:* Merge the completed Task's feature branch.
- *Before dependent dispatch:* If Task B depends on Task A's output and Task A was on a separate branch, merge A before creating B's branch or worktree.
- *Stage-end sweep:* Before transitioning to the next Stage, all current-Stage feature branches must be merged.

**Merge execution.** The Manager performs merges autonomously. Clean merges require no User intervention.

**Conflict resolution.** The Manager resolves merge conflicts using coordination-level context — knowledge of both Tasks' objectives, project design, and Specifications. For complex conflicts, spawn a Debug Subagent or escalate to the User.

**Branch protection adaptation.** If the base branch has protection rules that prevent direct merges, the Manager adapts (creates a PR, merges into an intermediate branch, or asks the User). Discovered reactively and noted in Working Notes for future merges.

### 2.5 User Preference Standards

The Manager respects the User's existing repository setup. The base branch is whatever the User is currently on — not assumed to be `main`. Branch naming, commit conventions, protection rules, PR workflows, and other conventions are detected from the project or established with the User during initialization, then noted in Working Notes.

**Coordination Artifact awareness.** The Planner may have captured VC-relevant preferences during Context Gathering — commit conventions, branching strategies, PR workflows, or other git-related standards. These may appear in Standards (execution patterns), Specifications (project-specific decisions), or Implementation Plan guidance fields. The Manager checks these during VC initialization and incorporates any VC-relevant content into its Working Notes and operational approach.

The Manager does not impose a workflow. It operates within the User's environment, incorporates Planning Phase context, and adapts when constraints are discovered.

---

## 3. Version Control Procedure

This section defines the sequential actions for version control operations.

**Procedure:**
1. VC Initialization (Manager Session 1)
2. Branch Operations (per dispatch)
3. Worktree Operations (parallel dispatch only)
4. Merge Coordination (after Task Review)
5. Cleanup (after merge)

### 3.1 VC Initialization

Execute once during Manager Agent Session 1 Initiation, after Memory System initialization. Perform the following actions:

1. Check if git is initialized. If not, run `git init` and inform the User.
2. Detect the current branch — record as base branch.
3. Record the repository root path and `.apm/` path (they may differ).
4. Check Coordination Artifacts (Standards, Specifications, Implementation Plan) for VC-relevant guidance — commit conventions, branching strategies, PR workflows. Incorporate findings.
5. Detect branch naming conventions from existing branches, Coordination Artifact guidance, or establish with User. Record in Working Notes.
6. Check `.gitignore` for `.apm/worktrees/`. If absent, add it.
7. Check for stale worktrees or orphaned feature branches from prior sessions. Clean if found.
8. Write a VC entry in Memory Root Working Notes per §4.3 Working Notes VC Entry Format.

### 3.2 Branch Operations

Execute per dispatch unit when constructing Task Prompts. Perform the following actions:

1. Create a feature branch off the base branch using the naming convention established during initialization.
2. For sequential dispatch: the Worker operates in the main directory on this branch. Include the branch name in the Task Prompt.
3. For parallel dispatch: proceed to §3.3 Worktree Operations instead.
4. Update the Working Notes VC entry with the active branch.

### 3.3 Worktree Operations

Execute for parallel dispatch when multiple Workers need isolated workspaces. Perform the following actions:

1. Create a worktree with a new feature branch:
   ```
   git worktree add .apm/worktrees/<branch-slug> -b <branch-name>
   ```
2. Include the worktree path as the Worker's workspace in the Task Prompt — all file operations happen in that directory.
3. Update the Working Notes VC entry with the active branch and worktree path.

### 3.4 Merge Coordination

Execute after a successful Task Review when the Coordination Decision is Proceed. Perform the following actions:

1. Switch to the base branch: `git checkout <base-branch>`.
2. Merge the completed feature branch: `git merge <branch-name>`.
3. If conflicts arise, resolve per §2.4 Merge Standards.
4. If this merge unblocks dependent Tasks, note readiness for the next dispatch cycle.
5. Update the Working Notes VC entry — remove the merged branch from active branches.

**Stage-end merge sweep.** After all Tasks in a Stage complete and are reviewed, verify all Stage feature branches are merged. Merge any that were deferred.

### 3.5 Cleanup

Execute after a successful merge. Perform the following actions:

1. If a worktree exists for the merged branch: `git worktree remove .apm/worktrees/<branch-slug>`.
2. Delete the merged feature branch: `git branch -d <branch-name>`.
3. Verify clean state — no dangling worktrees or branches for completed Tasks.

---

## 4. Structural Specifications

### 4.1 Branch Naming

Branch naming follows the project's existing conventions or is established with the User during VC initialization. The Manager records the agreed convention in Working Notes. Branch names should be descriptive of the work being performed. For batches, the name should reflect the batch scope.

### 4.2 Worktree Directory Layout

Worktrees are placed under `.apm/worktrees/`. Each subdirectory name is derived from the branch name (e.g., replacing `/` with `-`).

**Contents:** Each worktree directory contains a full checkout of all tracked files. Untracked files are not present.

### 4.3 Working Notes VC Entry Format

The Manager records VC state in Memory Root Working Notes. This entry is the source of truth for Handoff continuity — an Incoming Manager reads it to reconstruct VC context.

**Format:**
```markdown
### Version Control

- **Base Branch:** <branch-name>
- **Repo Root:** <path>
- **Branch Convention:** <agreed naming convention>
- **Active Branches:** <list of current feature branches, or "none">
- **Pending Merges:** <branches awaiting merge after review, or "none">
- **Notes:** <branch protection rules, User preferences, or other VC observations>
```

---

## 5. Content Guidelines

### 5.1 Role Boundaries

**Manager responsibilities:** All VC operations — initialization, branch creation, worktree creation, merge coordination, cleanup, and state tracking. The Manager is the sole VC coordinator.

**Worker responsibilities:** Operate in the workspace provided (main directory or worktree path), commit work to the assigned branch, and note the workspace in the Task Memory Log. Workers do not create branches, manage worktrees, or merge.

### 5.2 Common Mistakes

- **Worker attempting to merge:** Workers commit to their branch. The Manager coordinates all merges.
- **Dispatching before merging dependencies:** If Task B depends on Task A's output and A was on a separate branch, A must be merged into the base branch before B's branch is created.
- **Accumulating worktrees:** Worktrees are short-lived. Remove them promptly after merge to control disk usage.
- **Assuming base branch name:** Detect the current branch during initialization. Do not assume `main` or `master`.
- **Forgetting VC state in Handoff:** Include active branches, worktrees, and pending merges in the Handoff Memory Log.

---

**End of Skill**
