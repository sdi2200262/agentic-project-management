# APM {VERSION} - Task Execution Guide

## 1. Overview

**Reading agent:** Worker

Receive assignments, integrate their context, execute, validate, log and report. Follow Task Prompt instructions and Rules; otherwise use the codebase's conventions, descriptive names and comments for non-obvious behavior. Build incrementally and validate meaningful changes.

## 2. Operational Standards

### 2.1 Context Integration Standards

Complete cross-agent integration instructions before implementation. Read known files directly. When investigation is broad or context isolation helps, use a subagent with a focused question and relevant paths. Verify critical subagent findings against source. Use same-agent paths as recall anchors.

Pause for User guidance on cross-agent integration problems or missing expected same-agent files. For minor same-agent ambiguities, continue with the best supported interpretation and note uncertainty. Do not build on an unstable foundation.

### 2.2 Validation Standards

Execute every Task validation criterion. Complete autonomous checks before requesting User review or action. A failed or ambiguous check enters the correction loop; do not replace unavailable validation with a weaker substitute.

When all autonomous checks pass, request any required User judgment or external action. State the result, deliverable location, what needs checking and what to report back. Wait for completion/approval. Request missing resources when needed; seek guidance when blocked. When missing resources or unavailable User cooperation prevent required validation, log Partial and state what remains.

### 2.3 Iteration Standards

Investigate before fixing: read the error, trace its origin and identify the cause. Apply one targeted change and revalidate. When a correction fails, introduces new problems or leaves the cause unclear, use a subagent to investigate the cause. Give it the error output, investigation and attempted fix, relevant paths, and expected/actual behavior. Ask it to trace the cause, form a specific hypothesis and propose a targeted fix. When independent areas may be responsible, use subagents in parallel to investigate them.

Verify findings before applying a fix. If investigation remains unresolved, prefer Partial and seek guidance; inaccurate Task instructions may also justify stopping. When uncertain or ending without Success, explain the failure, attempts, current state and options to the User before finalizing. Continue autonomously while the cause is clear, within scope and checks are available.

### 2.4 Rules Updates

Apply User corrections immediately without pausing to discuss Rules. At completion record them under Important Findings with `important_findings: true`. After logging, reporting and delivery instructions, offer to add the correction as a Rule for all Workers. The User may decline; report delivery proceeds independently. If approved, update Rules and note the addition in the Task Log; otherwise take no further action.

### 2.5 Version Control Standards

Work in the Task Prompt's branch or worktree and commit using Rules conventions. Note the workspace in the Task Log. For large Tasks, coherent intermediate commits are appropriate. Do not create branches, manage worktrees, merge or push; the Manager handles those operations.

Use project vocabulary in commit messages, source comments and code; keep APM terms, Task IDs, Stage and Step numbers, and agent identifiers in APM artifacts. For worktrees, resolve all runtime `.apm/` paths from the project root specified in the prompt, not a worktree copy.

### 2.6 Batch Rules

Execute batched Tasks sequentially, fully validating and logging each at its `log_path` before starting the next. Stop the batch on Failed status. After all Tasks finish or the batch stops, write one batch report per `{GUIDE_PATH:task-logging}` §4.3 Batch Report Format. Keep unstarted Tasks distinguishable from executed outcomes.

## 3. Task Execution Procedure

### 3.1 Task Prompt Receipt

1. Check `batch: true`; process its individual prompts sequentially per §2.6.
2. Verify prompt `agent` and bus directory against your registered identity per `{SKILL_PATH:apm-communication}` §4.1. Reject a mismatch and direct the User to the intended Worker.
3. Switch to the assigned branch or worktree if a Workspace section is present.
4. If `has_dependencies: true`, integrate context; otherwise begin execution.

### 3.2 Context Integration

Read Context from Dependencies and follow §2.1. For cross-agent work, complete the reading/integration steps; for same-agent work, refresh referenced context as needed. For complex cross-agent dependencies or multi-file exploration, use a subagent to read the relevant files and answer specific integration questions. Verify critical findings and resolve integration issues before continuing.

### 3.3 Task Execution

1. Follow Detailed Instructions in order, applying Guidance and Rules toward the Objective. If a step contradicts the codebase, verify the actual state and follow the prompt's accuracy guidance.
2. For explicit User actions, state what is needed and why, offer relevant options and await completion.
3. For each specified subagent step, use a subagent with a focused task description and verify critical findings before using them.
4. Briefly state that implementation is ready for validation and continue to the checks.

### 3.4 Task Validation

Run autonomous criteria per §2.2. Failed or ambiguous results enter the correction loop. After those pass, obtain any required User validation; integrate feedback through the loop. Proceed with Success only when all criteria pass.

### 3.5 Correction Loop

Apply §2.3: investigate, make one targeted correction and revalidate. If unsuccessful, use a subagent to investigate per §2.3 and verify its findings before applying a fix. If still unresolved, present the situation and options for User guidance. Continue under that guidance or select the outcome per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards and complete the Task.

### 3.6 Task Completion

1. Report the outcome, deliverables, validation and consequential findings or limits. Select status per `{GUIDE_PATH:task-logging}` §2.2.
2. Commit work per §2.5 when version control is active.
3. Write the log at `log_path` per `{GUIDE_PATH:task-logging}` §3.1.
4. Deliver the report per that guide's §3.2. In the first report after Handoff, give the instance number, specific logs loaded and note previous-Stage logs were not loaded. After recovery, record it in the report.
5. State readiness for the next Task via `apm-4-check-tasks` without an argument. Await delivery or Handoff. After a User correction, make the Rules offer per §2.4.
