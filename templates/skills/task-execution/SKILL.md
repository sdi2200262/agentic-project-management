---
name: task-execution
description: Task execution methodology including context integration, execution, validation, iteration cycles, and delegation handling. Defines the Task Execution procedure for Worker Agents.
---

# APM {VERSION} - Task Execution Skill

## 1. Overview

**Reading Agent:** Worker Agent

This skill defines how Worker Agents execute Tasks assigned by the Manager Agent via Task Assignment Prompts. Task Execution transforms Task Assignments into completed deliverables through context integration, execution, validation, and iteration.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions for each Task Assignment received. Follow subsections sequentially from Task Assignment Receipt through Task Completion. See §3 Task Execution Procedure.

**Use Operational Standards for reasoning and decisions.** When reasoning about iteration, pauses, failures, or complexity-and when encountering decision points (continue vs stop, pause vs continue, status classification)-consult the relevant standards subsection. See §2 Operational Standards.

### 1.2 Objectives

- Execute Tasks following Task Assignment instructions
- Integrate context from dependencies before execution begins
- Validate execution against provided criteria in correct order
- Iterate on failures until success or stop condition
- Handle Delegation steps and User collaboration points
- Log outcomes and report to Manager Agent via User

### 1.3 Outputs

**Completed Task Deliverables:** Files, artifacts, or outputs as specified in Expected Output.

**Task Memory Log:** Structured log per `{SKILL_PATH:memory-logging}` §4.1 Task Memory Log Format.

**Task Report:** Concise summary for User to return to Manager Agent, per `{SKILL_PATH:memory-logging}` §4.3 Task Report Format.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Task Execution. It guides how to think about and decide on context integration, validation, iteration, pauses, failures, and user collaboration.

### 2.1 Context Integration Standards

Context integration establishes the foundation for Task Execution. Workers operate with narrow context-only their Task Assignment and accumulated working context from prior Tasks in this session. When a Task depends on another Agent's work or on prior work from a previous context window (after Handoff), the Worker lacks the foundation needed to execute correctly.

**Why Integration Must Be First:** Context integration ensures required files, artifacts, and interfaces are understood before execution begins. Skipping or rushing integration means building on an unstable foundation-errors compound and the Worker lacks the context to diagnose them.

**Cross-Agent vs Same-Agent Context** → The Task Assignment's Context from Dependencies section reflects the dependency type:

*Cross-Agent Dependencies:* The Worker has zero familiarity with the producer Task as it was executed by a different Worker Agent. The Task Assignment provides detailed integration instructions-specific files to read, artifacts to review, interfaces to understand. These instructions must be followed completely.

*Same-Agent Dependencies:* The Worker completed the producer Task in this session and has working familiarity. The Task Assignment provides lighter guidance-recall anchors and file references. These serve as additional guidance rather than required integration steps.

**Integration Issues:** If integration reveals problems-missing files, broken references, conflicts with expectations-the Worker cannot proceed safely. These require User guidance before execution.

**Decision Rules for Integration Issues:**
- Cross-Agent: missing files, unclear interfaces, or incomplete integration → pause for User guidance before proceeding
- Same-Agent: minor ambiguities → proceed with best interpretation, note uncertainty; missing expected files → pause for guidance
- Default: Do not execute on an unstable foundation. If Cross-Agent integration cannot complete cleanly, pause.

### 2.2 Validation Standards

Validation confirms that Task Execution achieved the intended outcome. Understanding validation types and their characteristics guides correct execution. Some Tasks have multiple validation types.

**Validation Types:**
- *Programmatic:* Automated verification-tests pass, builds succeed, scripts execute correctly. The Worker executes these checks and assesses results autonomously.
- *Artifact:* Output existence and structural verification-files exist with required sections, configs are valid, outputs match patterns. The Worker verifies these autonomously.
- *User:* Human judgment required-design approval, content quality, architectural decisions. The Worker must pause for User review.

**Ordering Principle:** When a Task has multiple validation types including User, the User validation is always performed LAST. Programmatic and Artifact validations complete first-this prevents wasting User reviews on execution that would fail automated checks. See §3.4 Task Validation.

**Default:** Fail-fast on autonomous validations to avoid wasted User reviews.

### 2.3 Iteration Standards

When Task Validation fails, the Worker enters an iteration cycle-correct, re-execute, re-validate. **The key judgment is when to continue versus when to stop.**

**Decision Rules:**
- **Continue when:** cause identified, fix within scope, measurable progress toward resolution
- **Stop when:** same error 3+ times, fixes causing new issues, requires external resolution

**Pattern Recognition:** A recurring identical error across multiple attempts indicates a pattern that iteration alone won't resolve-perhaps a misunderstanding of requirements, a dependency issue, or a systemic problem. Recognizing this pattern early prevents wasted effort and tokens.

**Uncertainty Handling:** When uncertain whether to continue or stop, pausing for User guidance is better than either persisting unproductively or stopping prematurely. The Worker presents the situation with options and lets the User guide the decision.

**Default:** When uncertain, pause and present situation to User with options.

### 2.4 Pause Standards

Pauses interrupt execution flow. Understanding pause categories guides when to pause and when to continue autonomously.

**Obligatory Pauses (always pause):** Delegation steps, explicit User actions in instructions, and User Validation Type all require pausing. See §3.5 Pause Handling and §3.6 Delegation Handling.

**Autonomous Pauses (Worker judgment)** → Workers may choose to pause at natural breakpoints during complex Tasks. This is appropriate when:
- Task scope is large with distinct parts and natural breakpoints between work clusters
- Risk of wasted effort and tokens is high if direction is wrong
- Unexpected complexity emerges

**Complexity Assessment:** Not all Tasks warrant autonomous pauses. Simple, well-defined Tasks should run continuously and autonomously.

**Default:** Simple Tasks run continuously. Reserve autonomous pauses for genuinely complex situations.

### 2.5 Failure Status Standards

Not all Tasks succeed. Understanding failure types guides appropriate status classification and communication.

**Execution Failures** → The Worker cannot complete the instructed work before reaching validation:
- Serious blockers: external dependencies unavailable, permissions denied
- Persistent bugs: issues that resist multiple fix attempts
- Missing prerequisites: required context or setup not available

**Validation Failures** → The Worker completes execution but validation criteria cannot be met:
- Execution gaps: work missed requirements in validation criteria
- Criteria issues: validation instructions unclear or cannot execute
- Revealed issues: validation exposes problems not apparent during execution

**Status Taxonomy with `failure_point` Values:**
- **Success:** Objective achieved, all validation passed. `failure_point: null`
- **Partial:** Intermediate state-progress made but incomplete; needs guidance on path forward. `failure_point: Execution`, `Validation`, or `<description>`
- **Failed:** Worker attempted but couldn't succeed; issue is within Task scope but beyond Worker's resolution. `failure_point: Execution` or `Validation`
- **Blocked:** External factors prevent progress; requires coordination-level resolution. `failure_point: <description>`

**Distinguishing Statuses:** The distinction lies in where the barrier is: Partial means "I need guidance to continue"; Failed means "I tried everything within my scope"; Blocked means "factors outside my control prevent progress."

**Default:** When classification unclear, prefer Partial with clear description-invites guidance rather than closing options.

### 2.6 User Collaboration Standards

Users facilitate communication between Agents and provide guidance at decision points.

**Required Collaboration:** Some situations require User involvement: User validation (Worker cannot self-approve subjective quality), Delegations (User transfers between sessions), explicit User actions (Worker cannot act outside development environment), and iteration pauses (Worker needs guidance on how to proceed).

**Autonomous Decisions:** Workers decide autonomously on: executing Programmatic/Artifact validation, continuing iteration when cause is clear and fix is within scope, and standard instruction execution.

**Default:** When stopping without Success, present situation with options rather than unilateral decisions. See §3.5 Pause Handling.

---

## 3. Task Execution Procedure

This section defines the actions for executing a Task Assignment.

**Procedure:**
1. Task Assignment Receipt
2. Context Integration (if dependencies exist)
3. Task Execution
4. Task Validation
5. Iteration Cycle (if validation fails)
6. Task Completion

Pause Handling (§3.5 Pause Handling) and Delegation Handling (§3.6 Delegation Handling) are invoked from within the main flow when conditions are met.

### 3.1 Task Assignment Receipt

Perform the following actions:
1. Verify `agent_id` in YAML frontmatter matches your registered instance. If mismatch, decline per `{COMMAND_PATH:worker-agent-initiation.md}` §5.1 Instance Boundaries.
2. Parse Task Assignment structure-YAML frontmatter fields and body sections.
3. Identify execution parameters:
   - `has_dependencies: true` → Context Integration required
   - `has_delegation_steps: true` → Delegation step(s) in instructions
   - Note validation types in Validation Criteria section
4. Proceed to §3.2 Context Integration (or §3.3 Task Execution if no dependencies).

### 3.2 Context Integration

Execute when `has_dependencies: true`. MUST complete before Task Execution begins.

Perform the following actions:
1. Read the `Context from Dependencies` section.
2. Execute integration based on dependency type:
   - **Cross-Agent:** Follow Integration Steps completely-read files, review artifacts, understand interfaces. Do not proceed until complete.
   - **Same-Agent:** Use guidance to recall and build upon prior work; review referenced paths to refresh context if needed.
3. Verify integration is complete-required context understood, referenced files accessible, foundation clear.
4. If integration issues discovered, apply decision rules from §2.1 Context Integration Standards.
5. Proceed to §3.3 Task Execution.

### 3.3 Task Execution

Perform the following actions:
1. Execute Detailed Instructions sequentially, applying Guidance and relevant Standards from `{AGENTS_FILE}`, working toward the Objective.
2. For each instruction step:
   - Standard instruction → execute and continue
   - Delegation step → follow §3.6 Delegation Handling, then resume
   - Explicit User action required → follow §3.5 Pause Handling, await completion, then resume
3. Assess for autonomous pause consideration per §2.4 Pause Standards. If warranted, follow §3.5 Pause Handling at a natural breakpoint.
4. When all instructions complete → proceed immediately to §3.4 Task Validation. Do NOT pause between execution and validation.

### 3.4 Task Validation

Perform the following actions:
1. Order validations: Programmatic first, then Artifact, then User-adapt based on which are required. User validation is always performed LAST.
2. Execute Programmatic validations. If any fail → do NOT proceed to User validation-proceed to §3.7 Iteration Cycle. Ambiguous results: treat as failure and iterate; if iteration doesn't resolve, pause for guidance.
3. Execute Artifact validations. If any fail → do NOT proceed to User validation-proceed to §3.7 Iteration Cycle.
4. If User validation present: pause and present work for review. Communicate what was accomplished, what needs review per the criteria, and where deliverables are located. Await response. If approved → proceed to §3.8 Task Completion with Success. If feedback provided → proceed to §3.7 Iteration Cycle with feedback integrated.
5. If all validation passed → proceed to §3.8 Task Completion with Success.

### 3.5 Pause Handling

Invoked when a pause point is reached. See §2.4 Pause Standards.

Perform the following actions:
1. Determine pause type:
   - Obligatory: Delegation (requires creating Delegation Prompt and awaiting findings), explicit User action (requires waiting for User completion), User Validation Type (requires presenting work and awaiting approval)
   - Autonomous: complexity-driven at natural breakpoint
2. Communicate the pause to User. For Delegation, follow to §3.6 Delegation Handling. For other pauses, concisely present:
   - What has been accomplished
   - What issue or decision point was reached (why pausing)
   - What options exist
   - A recommendation if you have a view
3. Await User input.
4. Upon receiving input, integrate any guidance and resume execution at the appropriate point.

### 3.6 Delegation Handling

Invoked when a Delegation step is encountered.

Perform the following actions:
1. Identify Delegation type from the instruction and Delegation section (Debug, Research, or other as specified).
2. Read the relevant Delegation skill.
3. Create Delegation Prompt following the skill's methodology.
4. Output the Delegation Prompt as a markdown code block. Explain that you've reached a delegation step, state the delegation type and purpose, and guide User to copy the prompt to a new Delegate Agent session and return with the Delegation Report.
5. Await Delegation Report from User.
6. Read the Delegation Memory Log at the referenced path. Note status (Resolved/Unresolved).
7. If Resolved → integrate findings, resume execution with next step. If Unresolved → apply §2.5 Failure Status Standards; present the situation to User explaining what was being investigated, what partial findings exist, what remains unclear, and options for proceeding (continue with partial findings, attempt different approach, or escalate). Await guidance.

### 3.7 Iteration Cycle

Invoked when validation fails.

Perform the following actions:
1. Assess the failure-what specifically failed, what is the likely cause, is it correctable?
2. Apply decision rules from §2.3 Iteration Standards to determine action.
3. If continuing: correct the issue, re-execute affected portions, return to §3.4 Task Validation.
4. If stopping: present situation to User explaining what validation failed, what corrections were attempted and their outcomes, why iteration is stopping, current state of the work, and options for proceeding. Include your assessment if you have one. Await guidance.
5. Upon User guidance: if new direction given, integrate and return to appropriate procedure step; if stopping confirmed, apply §2.5 Failure Status Standards and proceed to §3.8 Task Completion.

### 3.8 Task Completion

Perform the following actions:
1. Determine final status per §2.5 Failure Status Standards (Success if all validation passed).
2. Determine `failure_point`: `null` for Success; `Execution` or `Validation` or `<description>` based on where stopped.
3. Create Task Memory Log per `{SKILL_PATH:memory-logging}` §3.1 Task Memory Log Procedure at `memory_log_path`.
4. Output Task Report per `{SKILL_PATH:memory-logging}` §4.3 Task Report Format. Include Continuing Worker indication if this is your first Task after Handoff.
5. Await next Task Assignment or Handoff initiation.

---

## 4. Structural Specifications

### 4.1 Output Format References

**Task Memory Log:** Per `{SKILL_PATH:memory-logging}` §4.1 Task Memory Log Format, at `memory_log_path` from Task Assignment.

**Task Report:** Per `{SKILL_PATH:memory-logging}` §4.3 Task Report Format.

**Delegation Prompt:** Per relevant delegation skill methodology.

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
- Concise Task Reports-detail belongs in Memory Log

### 5.3 Common Mistakes to Avoid

- Skipping context integration for Cross-Agent dependencies
- Pausing too frequently on simple Tasks
- Not pausing when genuinely stuck
- Running User validation before Programmatic/Artifact
- Vague failure descriptions
- Not indicating Continuing Worker status after Handoff
- Proceeding with incomplete Cross-Agent integration
- Conflating pause (temporary) with stop (ends cycle)

---

**End of Skill**
