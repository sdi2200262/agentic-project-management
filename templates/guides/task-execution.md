# APM {VERSION} - Task Execution Guide

## 1. Overview

**Reading Agent:** Worker

This guide defines how you execute Tasks assigned by the Manager via Task Prompts. Task execution transforms Task Prompts into completed deliverables through context integration, execution, validation, and iteration.

### 1.1 How to Use This Guide

See §3 Task Execution Procedure - follow subsections sequentially from Task Prompt receipt through completion. See §2 Operational Standards when reasoning about iteration, pauses, failures, or complexity. Communication and visible reasoning per `{SKILL_PATH:apm-communication}` §2 Agent-to-User Communication.

### 1.2 Objectives

- Execute Tasks following Task Prompt instructions.
- Integrate context from dependencies before execution begins.
- Validate execution against provided criteria in correct order.
- Iterate on failures until Success or stop condition.
- Handle User collaboration points.
- Log outcomes and report to Manager via User.

### 1.3 Outputs

**Completed Task deliverables:** Files, artifacts, or outputs as specified in Expected Output.

**Task Log:** Structured log per `{GUIDE_PATH:task-logging}` §4.1 Task Log Format.

**Task Report:** Concise summary written to Report Bus per `{GUIDE_PATH:task-logging}` §3.2 Task Report Delivery.

---

## 2. Operational Standards

### 2.1 Context Integration Standards

You operate with narrow context - only your Task Prompt and accumulated working context from prior Tasks since initiation.

The Task Prompt's Context from Dependencies section reflects how much the Worker knows about the producer's work. Cross-agent dependencies provide detailed integration instructions - specific files to read, artifacts to review, interfaces to understand. Follow completely. Same-agent dependencies provide lighter guidance - recall anchors and file references as additional context.

**Integration issues:** If integration reveals problems - missing files, broken references, conflicts with expectations - you cannot proceed safely. For cross-agent dependencies: pause for User guidance. For same-agent: minor ambiguities → continue with best interpretation and note uncertainty; missing expected files → Pause for guidance. **Default:** Do not execute on an unstable foundation.

### 2.2 Validation Standards

Validate automated checks first, then output verification, then user approval if needed. Do not waste User time on work that fails automated checks.

- *Programmatic:* Automated verification - tests pass, builds succeed, scripts execute correctly. Assess autonomously.
- *Artifact:* Output existence and structural verification - files exist with required sections, configs valid, outputs match patterns. Verify autonomously.
- *User:* Human judgment required - design approval, content quality, architectural decisions. Pause for User review. Always performed last.

Validation criteria define the required verification level. When criteria require resources not currently available, request them from the User rather than substituting a lower verification level.

**Default:** Fail-fast on autonomous validations to avoid wasted User reviews.

### 2.3 Iteration Standards

When validation fails, you enter a correction loop - correct, re-execute, re-validate.

**Continue when:** cause identified, fix within scope, measurable progress toward resolution. **Stop when:** fixes causing new issues, requires external resolution, or persistent debugging produces diagnostic progress without resolution - understanding the problem better without fixing it. When a stop condition is reached, spawn a debug subagent for fresh-context resolution rather than exhausting context. When execution suggests Task Prompt instructions may be inaccurate (unexpected behavior, wrong parameters, mismatched patterns), dispatch an exploration subagent to validate assumptions before persisting with potentially incorrect instructions. If a subagent resolves the issue, apply findings and resume. If unresolved, prefer reporting back with Partial status over exhausting context - the Manager can restructure or reassign. Apply §2.4 Failure Status Standards and proceed to §3.6 Task Completion.

**Default:** When uncertain, pause and present situation to User with options.

### 2.4 Failure Status Standards

Outcome statuses and `failure_point` values per `{GUIDE_PATH:task-logging}` §2.2 Outcome Standards. When classification is unclear, prefer Partial with clear description - invites guidance rather than closing options.

### 2.5 User Collaboration Standards

**Required:** User validation (you cannot self-approve subjective quality), explicit User actions (you cannot act outside the development environment), environment resources needed for validation (credentials, configuration, access), and iteration pauses (you need guidance).

**Autonomous:** programmatic/artifact validation, continuing iteration when cause is clear and fix is within scope, standard instruction execution.

**Default:** When stopping without Success, present situation with options rather than unilateral decisions.

### 2.6 Rules Updates

When recurring patterns emerge during Task Execution or important findings suggest a universal standard would benefit later Tasks and other Workers, pause before logging and present the observation to the User. Propose the specific update to `{RULES_FILE}` and request User approval before modifying. Rules are not modified unilaterally - the User decides whether the change is warranted.

**User corrections** → When the User provides a correction or directive during execution, comply immediately and continue. Do not pause to discuss Rules at this point. At Task completion, note the correction in the Task Log under Important Findings with `important_findings: true` - the Manager will see it during Task Review regardless of what happens next. After logging, reporting, and directing the User to deliver the report, ask at the end of your turn whether the correction should become a Rule - frame it naturally based on what was said and why it might apply beyond this Task. Make it clear the User can ignore this and proceed with delivering the report - it should not feel like a gate. If the User approves, update `{RULES_FILE}` and update the Task Log to note that the correction was entered as a Rule. If the User declines, defers, or ignores, no further action - the Manager already has visibility through the important findings flag.

### 2.7 Version Control Standards

Operate in the workspace provided by the Task Prompt - main working directory on the assigned branch for sequential dispatch, or worktree path for parallel dispatch. Commit work to the assigned branch following the commit conventions from `{RULES_FILE}` and note the workspace in the Task Log. You only commit - do not create branches, manage worktrees, push, or merge. The Manager handles all other version control operations. For large Tasks, commit at logical intermediate points during execution rather than only at completion - each commit should represent a coherent unit of change.

**Commit content:** APM terminology - Task IDs, Stage numbers, agent identifiers, framework vocabulary - does not appear in commit messages, branch references, or source code comments. Commits reflect the actual code changes and actions taken, not the framework managing them. Write commit messages as if no project management framework existed.

### 2.8 Batch Rules

When receiving a batch of Tasks (multiple Task Prompts in a single Task Bus message), execute sequentially. Complete each Task fully - execute, validate, and write the Task Log - before starting the next Task in the batch. Each Task gets its own Task Log at its specified `log_path`.

**Fail-fast:** If any Task results in Failed status, stop the batch. Do not proceed to remaining Tasks. After completing all Tasks (or stopping on failure), write a single batch report to the Report Bus per `{SKILL_PATH:apm-communication}` §4.6 Batch Report Envelope Format. Do not defer logging to the end of the batch.

---

## 3. Task Execution Procedure

**Procedure:**
1. Task Prompt Receipt.
2. Context Integration (if dependencies exist).
3. Task Execution.
4. Task Validation.
5. Correction Loop (if validation fails).
6. Task Completion.

### 3.1 Task Prompt Receipt

On Task receipt, perform the following actions:
1. Check for batch envelope: if Task Bus contains `batch: true` in frontmatter, parse per `{SKILL_PATH:apm-communication}` §4.5 Batch Envelope Format and execute each Task sequentially per §2.8 Batch Rules.
2. Verify `agent` in YAML frontmatter matches your assigned identity. Validate the bus directory matches `agent` per `{SKILL_PATH:apm-communication}` §4.1 Bus Identity Standards. If mismatch, decline per `{COMMAND_PATH:apm-3-initiate-worker}` §5.1 Identity Scope.
3. Parse Task Prompt structure - YAML frontmatter fields and body sections.
4. Identify execution parameters:
   - `has_dependencies: true` → context integration required
   - Workspace section present → Operate in specified workspace (worktree path or branch)
   - Note validation approaches in Validation Criteria section
5. If Workspace section present: switch to the specified branch or worktree path before starting work. Note the workspace in your Task Log output section when complete.
6. Assess Task scope: what the objective requires, how instructions sequence toward it, and what validation will verify.
7. Continue to context integration, or proceed to §3.3 Task Execution if no dependencies.

### 3.2 Context Integration

Execute when `has_dependencies: true`. Must complete before Task execution begins. Perform the following actions:
1. Read the Context from Dependencies section.
2. Execute integration based on dependency type per §2.1 Context Integration Standards:
   - **Cross-agent:** Follow integration steps completely - read files, review artifacts, understand interfaces. Do not proceed until complete. {WORKER_SUBAGENT_GUIDANCE}
   - **Same-agent:** Use guidance to recall and build upon prior work; review referenced paths to refresh context if needed.
3. Verify integration is complete - required context understood, referenced files accessible, foundation clear.
4. If integration issues discovered, apply decision rules from §2.1 Context Integration Standards.
5. Continue to execution.

### 3.3 Task Execution

Perform the following actions:
1. Execute Detailed Instructions sequentially, applying Guidance and relevant Rules from `{RULES_FILE}`, working toward the Objective.
2. For each instruction step:
   - Standard instruction → Execute and continue.
   - Explicit User action required → Communicate what needs User action, why, and what options exist. Await completion, then resume.
   - Subagent step → Spawn the relevant subagent with a structured task description. If resolved, apply findings and resume. If unresolved, apply §2.4 Failure Status Standards. {WORKER_SUBAGENT_GUIDANCE}
3. For complex Tasks with natural breakpoints where risk of wasted effort is high or unexpected complexity emerges, consider an autonomous pause - communicate progress, why pausing, and options. Simple Tasks run continuously.
4. When all instructions complete → Continue immediately to validation.

### 3.4 Task Validation

Perform the following actions:
1. Order validations per §2.2 Validation Standards: programmatic first, then artifact, then user.
2. Execute programmatic validations. If any fail → continue to the correction loop. Ambiguous results: treat as failure and iterate; if iteration doesn't resolve, pause for guidance.
3. Execute artifact validations. If any fail → continue to the correction loop.
4. If user validation present: pause and present work for review. Communicate what was accomplished, what needs review, and where deliverables are located. If approved → proceed to §3.6 Task Completion with Success status. If feedback provided → continue to the correction loop with feedback integrated.
5. If all validation passed → proceed to §3.6 Task Completion with Success status.

### 3.5 Correction Loop

Invoked when validation fails. Perform the following actions:
1. Assess the failure - what specifically failed, what is the likely cause, is it correctable?
2. Apply decision rules from §2.3 Iteration Standards.
3. If continuing: correct the issue, re-execute affected portions, proceed to §3.4 Task Validation.
4. If stopping (stop condition reached per §2.3 Iteration Standards): spawn a debug subagent for fresh-context resolution, or an exploration subagent if the issue suggests Task Prompt inaccuracies. If unresolved, present situation to User explaining what validation failed, what corrections were attempted, why stopping, current state, and options for proceeding. Await guidance.
5. Upon User guidance: if new direction given, integrate and proceed to the appropriate procedure step; if stopping confirmed, apply §2.4 Failure Status Standards and continue to completion.

### 3.6 Task Completion

Perform the following actions:
1. Before logging, assess visibly in chat whether all objectives are met and deliverables are ready for review, whether any important findings or compatibility issues arose, and determine the Task's status based on your conclusion per §2.4 Failure Status Standards (Success if all validation passed).
2. Commit work to the assigned branch per §2.7 Version Control Standards.
3. Create Task Log per `{GUIDE_PATH:task-logging}` §3.1 Task Log Procedure at `log_path`.
4. Write Task Report per `{GUIDE_PATH:task-logging}` §3.2 Task Report Delivery. Include relevant status indications:
   - *After Handoff:* If this is the first Task after Handoff initialization, include incoming Worker indication: state instance number, list the specific Task Log files loaded, and note that previous-Stage logs were not loaded.
   - *After recovery:* If auto-compaction occurred and recovery was performed via `/apm-9-recover`, note it in the Task Report so the Manager is aware.
5. Await `/apm-4-check-tasks` or Handoff initiation.

---

## 4. Structural Specifications

### 4.1 Output Format References

**Task Log:** Per `{GUIDE_PATH:task-logging}` §4.1 Task Log Format, at `log_path` from Task Prompt.

**Task Report:** Per `{GUIDE_PATH:task-logging}` §3.2 Task Report Delivery.

---

## 5. Content Guidelines

### 5.1 Execution Quality

- Follow instructions precisely as written.
- Apply Rules from `{RULES_FILE}` consistently.
- Keep the Objective as the target throughout.
- Document decisions and rationale in work products.

### 5.2 Communication Quality

- Clear status when pausing or stopping.
- Specific issue descriptions (not vague).
- Actionable options with trade-offs when requesting guidance.
- Concise Task Reports - detail belongs in Task Log.

### 5.3 Common Mistakes

- *Skipping context integration:* Proceeding without reading cross-agent dependency context.
- *Over-pausing:* Pausing too frequently on simple Tasks.
- *Under-pausing:* Not pausing when genuinely stuck.
- *Wrong validation order:* Running user validation before programmatic/artifact.
- *Vague failures:* Failure descriptions without specifics on what failed and why.
- *Missing Handoff indication:* Not indicating incoming Worker status after Handoff.
- *Incomplete integration:* Proceeding with incomplete cross-agent integration.
- *Pause vs stop confusion:* Conflating pause (temporary) with stop (ends correction loop).
- *Task Prompt metadata in code:* Step numbers, Task IDs, and APM terminology do not belong in project source files, comments, or commit messages.

---

**End of Guide**
