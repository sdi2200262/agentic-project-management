# APM {VERSION} - Task Execution Guide

## 1. Overview

**Reading Agent:** Worker Agent

This guide defines how Worker Agents execute Tasks assigned by the Manager Agent via Task Prompts. Task Execution transforms Task Prompts into completed deliverables through context integration, execution, validation, and iteration.

### 1.1 How to Use This Guide

**Execute the Procedure.** The Procedure section contains the actions for each Task Assignment received. Follow subsections sequentially from Task Assignment Receipt through Task Completion. See §3 Task Execution Procedure.

**Use Operational Standards for reasoning and decisions.** When reasoning about iteration, pauses, failures, or complexity — and when encountering decision points (continue vs stop, pause vs continue, status classification) — consult the relevant standards subsection. See §2 Operational Standards.

### 1.2 Objectives

- Execute Tasks following Task Assignment instructions
- Integrate context from dependencies before execution begins
- Validate execution against provided criteria in correct order
- Iterate on failures until success or stop condition
- Handle User collaboration points
- Log outcomes and report to Manager Agent via User

### 1.3 Outputs

**Completed Task Deliverables:** Files, artifacts, or outputs as specified in Expected Output.

**Task Memory Log:** Structured log per `{GUIDE_PATH:task-logging}` §4.1 Task Memory Log Format.

**Task Report:** Concise summary written to Report Bus per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery.

---

## 2. Operational Standards

### 2.1 Context Integration Standards

Workers operate with narrow context — only their Task Assignment and accumulated working context from prior Tasks in this session. Context integration ensures required files, artifacts, and interfaces are understood before execution begins.

**Cross-Agent vs Same-Agent Context** → The Task Assignment's Context from Dependencies section reflects the dependency type:

*Cross-Agent Dependencies:* The Worker has zero familiarity with the producer Task. The Task Assignment provides detailed integration instructions — specific files to read, artifacts to review, interfaces to understand. Follow completely.

*Same-Agent Dependencies:* The Worker completed the producer Task in this session. The Task Assignment provides lighter guidance — recall anchors and file references as additional guidance.

**Integration Issues:** If integration reveals problems — missing files, broken references, conflicts with expectations — the Worker cannot proceed safely.

**Decision Rules:**
- Cross-Agent: missing files, unclear interfaces, or incomplete integration → pause for User guidance
- Same-Agent: minor ambiguities → proceed with best interpretation, note uncertainty; missing expected files → pause for guidance
- Default: Do not execute on an unstable foundation. If Cross-Agent integration cannot complete cleanly, pause.

### 2.2 Validation Standards

Validation confirms that Task Execution achieved the intended outcome.

**Validation Types:**
- *Programmatic:* Automated verification — tests pass, builds succeed, scripts execute correctly. Worker assesses results autonomously.
- *Artifact:* Output existence and structural verification — files exist with required sections, configs valid, outputs match patterns. Worker verifies autonomously.
- *User:* Human judgment required — design approval, content quality, architectural decisions. Worker must pause for User review.

**Ordering Principle:** When a Task has multiple validation types including User, User validation is always performed LAST. Programmatic and Artifact validations complete first to prevent wasting User reviews on execution that would fail automated checks.

**Default:** Fail-fast on autonomous validations to avoid wasted User reviews.

### 2.3 Iteration Standards

When Task Validation fails, the Worker enters an iteration cycle — correct, re-execute, re-validate.

**Decision Rules:**
- **Continue when:** cause identified, fix within scope, measurable progress toward resolution
- **Stop when:** same error 3+ times, fixes causing new issues, requires external resolution

**Pattern Recognition:** A recurring identical error across multiple attempts indicates a pattern that iteration alone won't resolve — perhaps a misunderstanding of requirements, a dependency issue, or a systemic problem.

**Default:** When uncertain, pause and present situation to User with options.

### 2.4 Pause Standards

Pauses interrupt execution flow.

**Obligatory Pauses (always pause):** Explicit User actions in instructions and User Validation Type. See §3.5 Pause Handling.

**Autonomous Pauses (Worker judgment)** → Appropriate when Task scope is large with natural breakpoints, risk of wasted effort is high if direction is wrong, or unexpected complexity emerges.

**Default:** Simple Tasks run continuously. Reserve autonomous pauses for genuinely complex situations.

### 2.5 Failure Status Standards

**Execution Failures** → The Worker cannot complete the instructed work before reaching validation: serious blockers, persistent bugs, missing prerequisites.

**Validation Failures** → The Worker completes execution but validation criteria cannot be met: execution gaps, criteria issues, revealed issues.

**Status Taxonomy with `failure_point` Values:**
- **Success:** Objective achieved, all validation passed. `failure_point: null`
- **Partial:** Intermediate state — progress made but incomplete; needs guidance. `failure_point: Execution`, `Validation`, or `<description>`
- **Failed:** Worker attempted but couldn't succeed; issue within Task scope but beyond resolution. `failure_point: Execution` or `Validation`
- **Blocked:** External factors prevent progress; requires coordination-level resolution. `failure_point: <description>`

**Distinguishing Statuses:** Partial means "I need guidance to continue"; Failed means "I tried everything within my scope"; Blocked means "factors outside my control prevent progress."

**Default:** When classification unclear, prefer Partial with clear description — invites guidance rather than closing options.

### 2.6 User Collaboration Standards

**Required Collaboration:** User validation (Worker cannot self-approve subjective quality), explicit User actions (Worker cannot act outside development environment), and iteration pauses (Worker needs guidance on how to proceed).

**Autonomous Decisions:** Workers decide autonomously on: executing Programmatic/Artifact validation, continuing iteration when cause is clear and fix is within scope, and standard instruction execution.

**Default:** When stopping without Success, present situation with options rather than unilateral decisions.

### 2.7 Batch Execution Standards

When receiving a batch of tasks (multiple Task Prompts in a single Send Bus message), execute them sequentially and report consolidated results.

**Sequential Execution:** Execute tasks in order. Complete each fully (including validation and logging) before starting the next.

**Individual Logging:** Each task gets its own Task Memory Log at its specified `memory_log_path`.

**Fail-Fast:** If any task results in Blocked or Failed status, stop the batch. Do not proceed to remaining tasks.

**Batch Report:** After completing all tasks (or stopping on failure), write a single Batch Report to the Report Bus per `{GUIDE_PATH:task-logging}` §4.2 Batch Report Format.

---

## 3. Task Execution Procedure

**Procedure:**
1. Task Assignment Receipt
2. Context Integration (if dependencies exist)
3. Task Execution
4. Task Validation
5. Iteration Cycle (if validation fails)
6. Task Completion

Pause Handling (§3.5) and Subagent Handling (§3.6) are invoked from within the main flow when conditions are met.

### 3.1 Task Assignment Receipt

Perform the following actions:
1. Check for batch envelope: If Send Bus contains `batch: true` in frontmatter, parse per `{SKILL_PATH:apm-communication}` §4.4 Batch Envelope Format and execute each task sequentially per §2.7 Batch Execution Standards.
2. Verify `agent_id` in YAML frontmatter matches your registered instance. If received via Send Bus, validate the filename matches `agent_id` per `{SKILL_PATH:apm-communication}` §2.3 Bus Identity Standards. If mismatch, decline per `{COMMAND_PATH:apm-3-initiate-worker}` §5.1 Instance Boundaries.
3. Parse Task Assignment structure — YAML frontmatter fields and body sections.
4. Identify execution parameters:
   - `has_dependencies: true` → Context Integration required
   - Workspace section present → operate in specified workspace (worktree path or branch)
   - Note validation types in Validation Criteria section
5. If Workspace section present: follow the workspace instructions — switch to the specified branch or worktree path before starting work. Note the workspace in your Memory Log output section when complete.
6. Proceed to §3.2 Context Integration (or §3.3 Task Execution if no dependencies).

### 3.2 Context Integration

Execute when `has_dependencies: true`. MUST complete before Task Execution begins.

Perform the following actions:
1. Read the `Context from Dependencies` section.
2. Execute integration based on dependency type:
   - **Cross-Agent:** Follow Integration Steps completely — read files, review artifacts, understand interfaces. Do not proceed until complete. {WORKER_SUBAGENT_GUIDANCE}
   - **Same-Agent:** Use guidance to recall and build upon prior work; review referenced paths to refresh context if needed.
3. Verify integration is complete — required context understood, referenced files accessible, foundation clear.
4. If integration issues discovered, apply decision rules from §2.1 Context Integration Standards.
5. Proceed to §3.3 Task Execution.

### 3.3 Task Execution

Perform the following actions:
1. Execute Detailed Instructions sequentially, applying Guidance and relevant Standards from `{AGENTS_FILE}`, working toward the Objective.
2. For each instruction step:
   - Standard instruction → execute and continue
   - Explicit User action required → follow §3.5 Pause Handling, await completion, then resume
3. Assess for autonomous pause consideration per §2.4 Pause Standards. If warranted, follow §3.5 Pause Handling at a natural breakpoint.
4. When all instructions complete → proceed immediately to §3.4 Task Validation. Do NOT pause between execution and validation.

### 3.4 Task Validation

Perform the following actions:
1. Order validations: Programmatic first, then Artifact, then User — adapt based on which are required. User validation is always performed LAST.
2. Execute Programmatic validations. If any fail → do NOT proceed to User validation — proceed to §3.7 Iteration Cycle. Ambiguous results: treat as failure and iterate; if iteration doesn't resolve, pause for guidance.
3. Execute Artifact validations. If any fail → do NOT proceed to User validation — proceed to §3.7 Iteration Cycle.
4. If User validation present: pause and present work for review. Communicate what was accomplished, what needs review, and where deliverables are located. If approved → proceed to §3.8 Task Completion with Success. If feedback provided → proceed to §3.7 Iteration Cycle with feedback integrated.
5. If all validation passed → proceed to §3.8 Task Completion with Success.

### 3.5 Pause Handling

Invoked when a pause point is reached per §2.4 Pause Standards.

Perform the following actions:
1. Determine pause type:
   - Obligatory: Explicit User action or User Validation Type
   - Autonomous: complexity-driven at natural breakpoint
2. Communicate concisely: what has been accomplished, why pausing, what options exist, and a recommendation if you have one.
3. Await User input.
4. Upon receiving input, integrate guidance and resume execution at the appropriate point.

### 3.6 Subagent Handling

Invoked when a task requires spawning a subagent for isolated, focused work (e.g., debugging, research). {WORKER_SUBAGENT_GUIDANCE}

Perform the following actions:
1. Identify the subagent type needed based on the instruction context (Debug, Research, or other as specified).
2. Spawn the subagent, passing a structured task description with relevant context.
3. Integrate the subagent's findings:
   - **If resolved:** Apply findings to current Task context and resume execution.
   - **If unresolved:** Apply §2.5 Failure Status Standards — assess whether to continue with partial findings, attempt a different approach, or pause for User guidance.

### 3.7 Iteration Cycle

Invoked when validation fails.

Perform the following actions:
1. Assess the failure — what specifically failed, what is the likely cause, is it correctable?
2. Apply decision rules from §2.3 Iteration Standards.
3. If continuing: correct the issue, re-execute affected portions, return to §3.4 Task Validation.
4. If stopping: present situation to User explaining what validation failed, what corrections were attempted, why iteration is stopping, current state, and options for proceeding. Await guidance.
5. Upon User guidance: if new direction given, integrate and return to appropriate procedure step; if stopping confirmed, apply §2.5 Failure Status Standards and proceed to §3.8 Task Completion.

### 3.8 Task Completion

Perform the following actions:
1. Determine final status per §2.5 Failure Status Standards (Success if all validation passed).
2. Determine `failure_point`: `null` for Success; `Execution`, `Validation`, or `<description>` based on where stopped.
3. Create Task Memory Log per `{GUIDE_PATH:task-logging}` §3.1 Task Memory Log Procedure at `memory_log_path`.
4. Write Task Report to Report Bus per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery. Include Continuing Worker indication if this is your first Task after Handoff. Inform User to reference the Report Bus file in the Manager session.
5. Await next Task Assignment or Handoff initiation.

---

## 4. Structural Specifications

### 4.1 Output Format References

**Task Memory Log:** Per `{GUIDE_PATH:task-logging}` §4.1 Task Memory Log Format, at `memory_log_path` from Task Assignment.

**Task Report:** Per `{SKILL_PATH:apm-communication}` §3.3 Task Report Delivery.

---

## 5. Content Guidelines

### 5.1 Execution Quality

- Follow instructions precisely as written
- Apply Standards from `{AGENTS_FILE}` consistently
- Keep the Objective as the target throughout
- Document decisions and rationale in work products

### 5.2 Communication Quality

- Clear status when pausing or stopping
- Specific issue descriptions (not vague)
- Actionable options with trade-offs when requesting guidance
- Concise Task Reports — detail belongs in Memory Log

### 5.3 Common Mistakes

- Skipping context integration for Cross-Agent dependencies
- Pausing too frequently on simple Tasks
- Not pausing when genuinely stuck
- Running User validation before Programmatic/Artifact
- Vague failure descriptions
- Not indicating Continuing Worker status after Handoff
- Proceeding with incomplete Cross-Agent integration
- Conflating pause (temporary) with stop (ends iteration cycle)

---

**End of Guide**
