---
name: apm-version-control
description: Version control coordination for workspace isolation during parallel dispatch.
---

# APM {VERSION} - Version Control Skill

## 1. Overview

**Reading Agent:** Manager, Worker

This skill defines version control operations for workspace isolation during the Implementation Phase. The Manager uses it to initialize git, create branches and worktrees, coordinate merges, and track VC state. Workers use it to understand their workspace context and commit conventions.

### 1.1 How to Use This Skill

See §3 Version Control Procedure for initialization, branch operations, worktree operations, merge coordination, and cleanup. See §2 Operational Standards when detecting repository state, choosing dispatch modes, naming branches, or resolving merge conflicts. See §4 Structural Specifications for branch naming, worktree layout, and the Tracker VC entry format.

### 1.2 Objectives

- Initialize version control during Manager session 1 when a git repository is present.
- Provide workspace isolation through feature branches and worktrees for parallel dispatch.
- Coordinate merges as a dispatch prerequisite - merge completed branches before dispatching dependent Tasks.
- Track VC state in the Tracker for Handoff continuity.

### 1.3 Outputs

**Feature branches:** One branch per dispatch unit (single Task or batch), created off the base branch. Naming follows project conventions established during VC initialization.

**Worktrees:** Isolated working directories under `.apm/worktrees/` for parallel dispatch. Each worktree is checked out on its own feature branch.

**Tracker VC entry:** VC configuration recorded in the Version Control table within the Tracker - base branch and naming convention. Branch state is tracked per-task in the task table.

---

## 2. Operational Standards

### 2.1 Repository Detection Standards

The Manager detects existing repository state during session 1 initialization. Detection is passive - read what exists rather than imposing configuration.

**Detection checks:** Which directory is the working repository? (check the Spec for workspace structure - navigate there before other checks). Is git initialized? (if not, initialize and inform User). What is the current branch? (becomes base branch unless User specifies otherwise). Where is `.apm/` relative to repository root? (both paths recorded for worktree path construction). Is `.apm/worktrees/` in `.gitignore`? (if `.apm/` is inside the repository, add it if absent; if `.apm/` is outside the repository, no `.gitignore` modification needed).

**Stale state recovery:** If leftover worktrees or branches from a prior session exist (e.g., crash recovery), detect and clean during initialization - remove worktrees and delete orphaned feature branches.

### 2.2 Branch Standards

Every dispatch unit (single Task or batch) gets its own feature branch off the base branch. Naming per §4.1 Branch Naming. APM terminology (Task IDs, Stage numbers, agent identifiers) does not appear in branch names, commit messages, or worktree directory names - these reflect the actual work, not the framework managing it. A batch of sequential Tasks assigned to the same Worker shares one branch.

### 2.3 Worktree Standards

Worktrees are created only for parallel dispatch - when multiple Workers need physically separate directories simultaneously. For sequential dispatch, the Worker operates in the main working directory on their feature branch.

Directory layout per §4.2 Worktree Directory Layout. **Concurrency limit:** Maximum 3-4 concurrent worktrees - disk usage scales linearly with working directory size. **Lifecycle:** Short-lived - created before dispatch, removed promptly after merge. **Untracked files:** Worktrees contain only tracked files; if a Worker needs untracked assets, note this in the Task Prompt.

### 2.4 Merge Standards

Merge state is a dispatch prerequisite. The Manager merges completed feature branches into the base branch at specific coordination points.

**Merge timing:** After successful Task Review, merge the completed branch. Before dependent dispatch, merge if the dependent Task needs the completed Task's output. At Stage end, all current-Stage feature branches must be merged.

**Merge execution:** The Manager performs merges autonomously. Clean merges require no User intervention.

**Conflict resolution:** Resolve using coordination-level context - knowledge of both Tasks' objectives, project design, and the Spec. For complex conflicts, spawn a debug subagent or escalate to the User.

**Branch protection adaptation:** If the base branch has protection rules preventing direct merges, adapt (create a PR, merge into an intermediate branch, or ask the User). Discovered reactively and noted in working notes.

### 2.5 User Preference Standards

The Manager respects the User's existing repository setup. The base branch is whatever the User is currently on - not assumed to be `main`. These conventions are detected from the project or established with the User during initialization, then noted in working notes: branch naming, commit conventions, protection rules, PR workflows.

**Planning document awareness:** The Planner may have captured VC-relevant preferences during Context Gathering - commit conventions, branching strategies, PR workflows. These may appear in Rules, the Spec, or Plan guidance fields. The Manager checks these during VC initialization and incorporates relevant content into working notes.

---

## 3. Version Control Procedure

**Procedure:**
1. VC Initialization (Manager session 1).
2. Branch Operations (per dispatch).
3. Worktree Operations (parallel dispatch only).
4. Merge Coordination (after Task Review).
5. Cleanup (after merge).

### 3.1 VC Initialization

Execute once during Manager session 1 initiation, after Memory initialization. Perform the following actions:
1. Check the Spec for workspace structure - identify which directory is the working repository. If the Spec specifies a repository directory, navigate there before proceeding.
2. Check if git is initialized in the working repository directory. If not, run `git init` and inform the User.
3. Detect the current branch - record as base branch.
4. Record the repository root path and `.apm/` path (they may differ).
5. Check planning documents (Rules, Spec, Plan) for VC-relevant guidance - commit conventions, branching strategies, PR workflows. Incorporate findings.
6. Detect branch naming conventions from existing branches, planning document guidance, or establish with User. Record in the Tracker Version Control table.
7. Check `.gitignore` for `.apm/worktrees/`. If `.apm/` is inside the repository directory, add it if absent. If `.apm/` is outside the repository, `.gitignore` modification is not needed.
8. Check for stale worktrees or orphaned feature branches from prior sessions. Clean if found.
9. Write VC state to the Version Control table in the Tracker per §4.3 Tracker VC Entry Format.

### 3.2 Branch Operations

Execute per dispatch unit when constructing Task Prompts. Perform the following actions:
1. Create a feature branch off the base branch using the naming convention established during initialization.
2. For sequential dispatch: the Worker operates in the main directory on this branch. Include the branch name in the Task Prompt.
3. For parallel dispatch: proceed to §3.3 Worktree Operations instead.
4. Record the branch name in the task row's Branch column when updating the Tracker.

### 3.3 Worktree Operations

Execute for parallel dispatch when multiple Workers need isolated workspaces. Perform the following actions:
1. Create a worktree with a new feature branch:

   ```
   git worktree add .apm/worktrees/<branch-slug> -b <branch-name>
   ```

2. Include the worktree path as the Worker's workspace in the Task Prompt - all file operations happen in that directory.
3. Record the branch name and worktree path in the task row's Branch column when updating the Tracker.

### 3.4 Merge Coordination

Execute after a successful Task Review with no outstanding follow-ups. Perform the following actions:
1. Switch to the base branch: `git checkout <base-branch>`.
2. Merge the completed feature branch: `git merge <branch-name>`.
3. If conflicts arise, resolve per §2.4 Merge Standards.
4. If this merge unblocks dependent Tasks, note readiness for the next dispatch cycle.
5. Clear the Branch column for the merged task row when updating the Tracker.

**Stage-end merge sweep:** After all Tasks in a Stage complete and are reviewed, verify all Stage feature branches are merged. Merge any that were deferred.

### 3.5 Cleanup

Execute after a successful merge. Perform the following actions:
1. If a worktree exists for the merged branch: `git worktree remove .apm/worktrees/<branch-slug>`.
2. Delete the merged feature branch: `git branch -d <branch-name>`.
3. Verify clean state - no dangling worktrees or branches for completed Tasks.

---

## 4. Structural Specifications

### 4.1 Branch Naming

Branch naming follows the project's existing conventions or is established with the User during VC initialization. The Manager records the agreed convention in the Tracker Version Control table. Branch names are descriptive; for batches, the name reflects the batch scope.

### 4.2 Worktree Directory Layout

Worktrees are placed under `.apm/worktrees/`. Each subdirectory name is derived from the branch name (e.g., replacing `/` with `-`). Each worktree directory contains a full checkout of all tracked files. Untracked files are not present.

### 4.3 Tracker VC Entry Format

The Manager records VC configuration in the Version Control table within the Tracker. Branch state is tracked per-task in the task table's Branch column - an incoming Manager reads task rows to rebuild working VC context.

**Format:**

```markdown
## Version Control

| Field | Value |
|-------|-------|
| Base Branch | <branch-name> |
| Branch Convention | <agreed naming convention> |
```

---

## 5. Content Guidelines

### 5.1 Role Boundaries

**Manager responsibilities:** All VC operations - initialization, branch creation, worktree creation, merge coordination, cleanup, and state tracking. The Manager is the sole VC coordinator.

**Worker responsibilities:** Operate in the workspace provided (main directory or worktree path), commit work to the assigned branch, and note the workspace in the Task Log. Workers do not create branches, manage worktrees, or merge.

### 5.2 Common Mistakes

- *Worker attempting to merge:* Workers commit to their branch. The Manager coordinates all merges.
- *Dispatching before merging dependencies:* If Task B depends on Task A's output and A was on a separate branch, A must be merged before B's branch is created.
- *Accumulating worktrees:* Worktrees are short-lived. Remove promptly after merge.
- *Assuming base branch name:* Detect the current branch during initialization. Do not assume `main` or `master`.
- *Forgetting VC state in Handoff:* Ensure task rows reflect current branch state before Handoff. Include active branches, worktrees, and pending merges in the Handoff Log.
- *Committing build artifacts:* Do not commit generated files (compiled binaries, object files, build output). Create or update `.gitignore` for build directories.

---

**End of Skill**
