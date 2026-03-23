# APM {VERSION} - Task Execution Guide

## 1. Overview

**Reading Agent:** Worker

This guide defines how you execute Tasks assigned by the Manager via Task Prompts, from receipt through context integration, execution, validation, iteration, and completion.

---

## 2. Operational Standards

### 2.1 Context Integration Standards

Follow cross-agent integration steps completely - read files, review artifacts, understand interfaces. Use same-agent guidance as recall anchors - review referenced paths to refresh context if needed.

**Integration issues.** Do not execute on an unstable foundation. For cross-agent dependencies: pause for User guidance. For same-agent: minor ambiguities - continue with best interpretation and note uncertainty; missing expected files - pause for guidance.

### 2.2 Validation Standards

Validation criteria in the Task Prompt specify what to check. Execute each criterion as written - run tests, verify outputs exist and match expected structure, confirm behavior meets requirements. Always complete autonomous checks first. If any autonomous check fails, correct it before involving the User - do not request User review or User action while autonomous checks are failing.

When a criterion requires User involvement - judgment the Worker cannot self-assess (design approval, content quality) or action outside the development environment (running external checks, confirming platform behavior) - pause and present work only after all autonomous checks pass. When pausing, communicate clearly per `{SKILL_PATH:apm-communication}` §2.1 Direct Communication: what is needed and why, what the User should expect or verify, and what to report back so execution can continue.

When criteria require resources not currently available, request them from the User rather than substituting a lower verification level.

### 2.3 Iteration Standards

When validation fails, you enter a correction loop - correct, re-execute, re-validate.

Continue when the cause is identified and progress is being made. Stop when fixes are causing new issues, the issue requires external resolution, or debugging is not converging. When execution suggests Task Prompt instructions may be inaccurate, this is also a stop condition. When a stop condition is reached, spawn a subagent for fresh-context resolution rather than exhausting context. If the subagent resolves the issue, apply findings and resume. If unresolved, prefer reporting back with Partial status - the Manager can restructure or reassign. When classification is unclear, prefer Partial with clear description - invites guidance rather than closing options.

**User collaboration:** Pause when criteria require User judgment (you cannot self-approve subjective quality), when explicit User actions are needed (outside the development environment), when environment resources are needed for validation, or when iteration stalls and you need guidance. Continue autonomously when checks can be performed without User involvement and when the cause of failure is clear and the fix is within scope. When uncertain or stopping without Success, pause and present the situation to the User with options rather than making unilateral decisions.

### 2.4 Rules Updates

When the User provides a correction or directive during execution, comply immediately and continue. Do not pause to discuss Rules at this point. At Task completion, note the correction in the Task Log under Important Findings with `important_findings: true` - the Manager will see it during Task Review regardless of what happens next. After logging, reporting, and directing the User to deliver the report, ask at the end of your turn whether the correction should become a Rule for all Workers - frame it naturally based on what was said and why it might apply beyond this Task. Make it clear the User can ignore this and proceed with delivering the report - it should not feel like a gate. If the User approves, update `{RULES_FILE}` and update the Task Log to note that the correction was entered as a Rule. If the User declines, defers, or ignores, no further action - the Manager already has visibility through the important findings flag.

### 2.5 Version Control Standards

Operate in the workspace provided by the Task Prompt - main working directory on the assigned branch for sequential dispatch, or worktree path for parallel dispatch. Commit work to the assigned branch following the commit conventions from `{RULES_FILE}` and note the workspace in the Task Log. You only commit - do not create branches, manage worktrees, push, or merge. The Manager handles all other version control operations. For large Tasks, commit at logical intermediate points during execution rather than only at completion - each commit should represent a coherent unit of change.

**Commit content:** APM terminology - Task IDs, Stage numbers, agent identifiers, framework vocabulary - does not appear in commit messages, branch references, or source code comments. Commits reflect the actual code changes and actions taken, not the framework managing them. Write commit messages as if no project management framework existed.

### 2.6 Batch Rules

When receiving a batch of Tasks (multiple Task Prompts in a single Task Bus message), execute sequentially. Complete each Task fully - execute, validate, and write the Task Log - before starting the next Task in the batch. Each Task gets its own Task Log at its specified `log_path`.

**Fail-fast:** If any Task results in Failed status, stop the batch. Do not proceed to remaining Tasks. After completing all Tasks (or stopping on failure), write a single batch report to the Report Bus per `{SKILL_PATH:apm-communication}` §4.5 Batch Report Envelope Format. Do not defer logging to the end of the batch.

---

## 3. Task Execution Procedure

Sequential flow from Task Prompt receipt through completion. Task Validation and the Correction Loop form a cycle that repeats until success or a stop condition.

### 3.1 Task Prompt Receipt

On Task receipt, perform the following actions:
1. Check for batch envelope: if Task Bus contains `batch: true` in frontmatter, parse per `{SKILL_PATH:apm-communication}` §4.4 Batch Envelope Format and execute each Task sequentially per §2.6 Batch Rules.
2. Verify `agent` in YAML frontmatter matches your assigned identity. Validate the bus directory matches `agent` per `{SKILL_PATH:apm-communication}` §4.1 Bus Identity Standards. If mismatch, decline per `{COMMAND_PATH:apm-3-initiate-worker}` §5.1 Identity Scope.
3. If Workspace section present: switch to the specified branch or worktree path before starting work.
4. If `has_dependencies: true` - continue to §3.2 Context Integration. Otherwise - proceed to §3.3 Task Execution.

### 3.2 Context Integration

Perform the following actions:
1. Read the Context from Dependencies section.
2. Execute integration based on dependency type per §2.1 Context Integration Standards:
   - **Cross-agent:** Follow integration steps completely - read files, review artifacts, understand interfaces. {WORKER_SUBAGENT_GUIDANCE}
   - **Same-agent:** Use guidance to recall and build upon prior work; review referenced paths to refresh context if needed.
3. If integration issues discovered, apply decision rules from §2.1 Context Integration Standards.

### 3.3 Task Execution

Perform the following actions:
1. Execute Detailed Instructions sequentially, applying Guidance and relevant Rules from `{RULES_FILE}`, working toward the Objective.
2. When an instruction requires explicit User action, communicate what needs doing, why, and what options exist. Await completion, then resume.
3. When an instruction includes a subagent step, spawn the relevant subagent with a structured task description. Integrate findings and continue. {WORKER_SUBAGENT_GUIDANCE}
4. When all instructions complete, continue to §3.4 Task Validation.

### 3.4 Task Validation

Perform the following actions:
1. Execute autonomous checks from the Task Prompt's validation criteria per §2.2 Validation Standards: run tests, verify builds, confirm outputs exist and match expected structure. If any fail, continue to the correction loop. Ambiguous results: treat as failure and iterate; if iteration doesn't resolve, pause for guidance.
2. If criteria require User involvement: pause and present work per §2.2 Validation Standards. Communicate what was accomplished, what needs the User's review or action, where deliverables are located, and what to report back. If approved or completed, proceed to §3.6 Task Completion with Success status. If feedback provided, continue to the correction loop with feedback integrated.
3. If all criteria passed, proceed to §3.6 Task Completion with Success status.

### 3.5 Correction Loop

Assess the failure per §2.3 Iteration Standards. If continuing: correct the issue, re-execute affected portions, and return to §3.4 Task Validation. If stopped: spawn a subagent for fresh-context resolution. If the subagent resolves the issue, apply findings and resume. If unresolved, present the situation to the User with what validation failed, what corrections were attempted, why stopping, current state, and options for proceeding. Upon User guidance: integrate the new direction and proceed to the appropriate procedure step, or apply outcome status per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards and continue to §3.6 Task Completion.

### 3.6 Task Completion

Perform the following actions:
1. Assess visibly in chat: whether all objectives are met and deliverables are ready, whether any important findings or compatibility issues arose, and determine the Task's outcome status per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards.
2. Commit work to the assigned branch per §2.5 Version Control Standards.
3. Create Task Log per `{GUIDE_PATH:task-logging}` §3.1 Task Log Procedure at `log_path`.
4. Write Task Report per `{GUIDE_PATH:task-logging}` §3.2 Task Report Delivery. Include relevant status indications:
   - *After Handoff.* If this is the first Task after Handoff initialization, include incoming Worker indication: state instance number, list the specific Task Log files loaded, and note that previous-Stage logs were not loaded.
   - *After recovery:* If auto-compaction occurred and recovery was performed via `/apm-9-recover`, note it in the Task Report so the Manager is aware.
5. Await `/apm-4-check-tasks` or Handoff initiation.

---

## 4. Common Mistakes

- *Task Prompt metadata in code:* Step numbers, Task IDs, and APM terminology do not belong in project source files, comments, or commit messages.
- *Missing Handoff indication:* Not indicating incoming Worker status after Handoff.
- *Incomplete cross-agent integration:* Proceeding without fully reading and understanding cross-agent dependency context.
- *Premature Partial:* Partial is for pausing to seek guidance, not for giving up early. Continue iterating when validation failed but the cause is clear and fixable.

---

**End of Guide**
