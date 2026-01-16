---
name: memory-maintenance
description: Memory System management including initialization, directory structure, log review, and stage summaries. Defines Memory maintenance procedures for the Manager Agent.
---

# APM {VERSION} - Memory Maintenance Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent maintains the Memory System during project execution. The Memory System stores project history as structured Markdown files, enabling progress tracking, coordination decisions, and context preservation across agent handoffs.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions to perform for Memory System maintenance. Follow subsections based on the current maintenance need. See §3 Memory Maintenance Procedure.

**Use Problem Space for interpretation.** When interpreting log content or reasoning about summary scope, consult the relevant reasoning subsection. See §2 Problem Space.

**Use Policies for decisions.** When determining next actions after log review, apply §4.1 Log Review Decision Policy. For scope-based response actions (self-investigation, delegation, or User guidance), see §4.2 Scope Response Policy.

**Output only structured blocks.** Stage summaries, Memory Root updates, and delegation proposals follow the formats defined in Structural Specifications. See §5 Structural Specifications.

### 1.2 Objectives

- Initialize and maintain the Memory System structure throughout project execution
- Review Task Memory Logs to assess completion and determine next actions
- Create stage summaries to preserve high-level progress context
- Enable efficient handoff and onboarding through structured memory artifacts

### 1.3 Memory System Architecture

- **Storage Location:** `.apm/Memory/`
- **Root Document:** `Memory_Root.md` - high-level project state, stage summaries, and working notes
- **Stage Directories:** `Stage_<StageNum>_<Slug>/` - contain Task Memory Logs and Delegation Memory Logs
- **Handoff Storage:** `Handoffs/` - contain agent handoff files

See §5.1 Directory Structure for full layout.

---

## 2. Problem Space

This section establishes the reasoning approach for Memory System maintenance. It guides how to interpret logs, assess completion quality, and write stage summaries.

### 2.1 Log Review Reasoning

The goal is to extract information needed for the next coordination decision and validate Worker Agent performance. This section guides interpretation; decision rules are in §4.1 Log Review Decision Policy.

**Review Focus:**
- What was the outcome? (status and failure_point)
- Are there flags requiring attention? (important_findings, compatibility_issues)
- What affects the next coordination decision? (blockers, dependencies, follow-ups)

**Status Interpretation:**
- `status: Success` — Task objective achieved, all validation passed
- `status: Failed` — Task attempted but validation did not pass; `failure_point` indicates whether Execution or Validation failed
- `status: Partial` — Intermediate state; Worker paused for guidance due to ambiguity, important findings, or lack of progress
- `status: Blocked` — No progress possible due to external factors outside Worker control

For the full Task Memory Log structure, see §5.4 Task Memory Log Structure.

**Flag Interpretation:**
- `important_findings: true` — Worker discovered something with project-wide implications; referenced artifacts contain details
- `compatibility_issues: true` — Output conflicts with existing systems or Implementation Plan assumptions
- `delegation: true` — Worker delegated part of the task; Delegation Memory Log contains context. See §5.5 Delegation Memory Log Structure.

**Investigation Depth:**

When investigation beyond the log is needed, compare expected outputs from the Task Assignment against actual files and directories referenced in the Memory Log. Verify that claimed deliverables exist and match expectations.

Consider scope when reasoning about investigation approach:
- **Small scope:** Few files to check, straightforward verification, or minor clarification needed
- **Bounded scope:** Specific technical issue requiring focused investigation
- **Large scope:** Systemic issues, incorrect assumptions, or impacts across multiple stages

See §4.2 Scope Response Policy for response actions based on scope.

### 2.2 Stage Summary Reasoning

Stage summaries compress stage execution into a coordination-ready format. They serve future Manager Agent instances (after handoff) and project retrospectives.

**Summary Scope:**
- Capture stage outcome, not task-by-task detail
- Note cross-cutting observations that don't belong in individual logs
- Reference log files rather than duplicating their content
- Highlight patterns, blockers, or insights relevant to subsequent stages

**Content Selection:**
- Include: Overall outcome, agents involved, notable findings, compatibility concerns
- Reference: Individual log files for task-specific detail
- Exclude: Implementation details, code specifics, routine operations

See §5.3 Stage Summary Format.

---

## 3. Memory Maintenance Procedure

This section defines the sequential actions for Memory System maintenance. Execute subsections based on the current maintenance need.

**Output Blocks:** Stage summaries use the Stage Summary Format. Delegation proposals use the Delegation Request Block. See §5 Structural Specifications.

**Procedure Flow:**
1. Memory Root Initialization (first session only)
2. Stage Directory Creation (on stage entry)
3. Log Review (after each Task Report)
4. Stage Summary Creation (on stage completion)

### 3.1 Memory Root Initialization

Execute once at the start of the first Manager Agent session, before issuing the first Task Assignment.

**Action 1:** Read `.apm/Memory/Memory_Root.md`

**Action 2:** Update header fields:
- Replace `<Project Name>` with actual project name from Implementation Plan
- Replace `[To be filled by Manager Agent before first stage execution]` in Project Overview with concise project summary from Implementation Plan
- Confirm Manager Handoffs is set to `0`

**Action 3:** Save the updated file

### 3.2 Stage Directory Creation

Execute when entering a new stage, before issuing Task Assignments for that stage.

**Action 1:** Create stage directory: `.apm/Memory/Stage_<StageNum>_<Slug>/`

**Action 2:** Include the `memory_log_dir` path in each Task Assignment Prompt for that stage

Worker Agents create their own Task Memory Logs within this directory. See §5.4 Task Memory Log Structure for the expected format.

**Naming Convention:** Derive stage slug from Implementation Plan stage title. Example: Stage `Stage 2 - API Integration` → `Stage_02_API_Integration/`

### 3.3 Log Review

Execute when User returns with a Task Report.

**Action 1:** Read the Task Memory Log at the provided path

**Action 2:** Interpret log content using §2.1 Log Review Reasoning

**Action 3:** Apply §4.1 Log Review Decision Policy to determine next action

### 3.4 Stage Summary Creation

Execute when all tasks in a stage are completed.

**Action 1:** Review all Task Memory Logs and Delegation Memory Logs for the completed stage. See §5.4 and §5.5 for expected structures.

**Action 2:** Synthesize stage-level observations:
- Overall outcome and deliverables
- Agents involved and their contributions
- Notable findings, patterns, or compatibility concerns
- Undocumented context or working insights

**Action 3:** Append stage summary to Memory Root following §5.3 Stage Summary Format. Keep summary ≤30 lines and reference log files rather than duplicating content.

---

## 4. Policies

This section defines the decision rules that govern choices during Memory System maintenance.

### 4.1 Log Review Decision Policy

**Decision Domain:** What to do after reviewing a Task Memory Log.

**Flag Check:**

Before assessing status, check flags that require immediate investigation:
- `important_findings: true` → Read referenced artifacts before any decision
- `compatibility_issues: true` → Assess Implementation Plan impact before proceeding
- `delegation: true` → Read referenced Delegation Memory Log for full context. See §5.5.

**Status Response:**

| Status | Response |
|--------|----------|
| Success | Proceed to next Task Assignment |
| Failed | Assess scope to determine follow-up and/or escalation |
| Partial | Assess scope to determine follow-up and/or escalation |
| Blocked | Assess scope to determine escalation path |

**Scope Assessment:**

For non-Success status, assess the scope of the issue and apply §4.2 Scope Response Policy:

| Scope | Indicators |
|-------|------------|
| Small | Few files to check, straightforward verification, or Worker needs minor clarification |
| Bounded | Specific technical issue, context-intensive debugging or research needed |
| Large | Systemic issues, incorrect plan assumptions, impacts multiple stages, or requires User decision |

**Default:** When scope is unclear, prefer proposing delegation over immediate User escalation. Delegation preserves User attention for decisions that genuinely require human judgment.

### 4.2 Scope Response Policy

**Decision Domain:** How to respond based on assessed scope—self-investigate, delegate, or seek User guidance.

**Scope-Based Approach:**

| Scope | Approach |
|-------|----------|
| Small | Self-investigate and/or issue follow-up to same Worker Agent |
| Bounded | Propose delegation to User. If approved, execute delegation. If declined, note for follow-up or adjust approach. |
| Large | Seek User guidance |

**Self-Investigation Actions:**

For small-scope issues:

**Action 1:** Investigate the issue:
- Identify specific files, artifacts, or clarifications needed
- Use available tools to review referenced files, verify deliverables, or gather context
- Keep scope limited to avoid excessive context consumption

**Action 2:** Based on findings, either issue follow-up Task Assignment to same Worker Agent or proceed to next task

**Delegation Proposal:**

When delegation is appropriate for bounded-scope issues, output a Delegation Request Block. See §5.6 Delegation Request Block.

**If User approves delegation:**

**Action 1:** Read the appropriate delegation skill: `{SKILL_PATH:delegate-debug/SKILL.md}` or `{SKILL_PATH:delegate-research/SKILL.md}`

**Action 2:** Create Delegation Prompt following the skill. Then User opens Delegate Agent session and provides the delegation task. Delegate Agent logs findings to `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md` and returns Delegation Report to User, who then returns to Manager Agent with report. See §5.5 for expected structure.

**Action 3:** Read the Delegation Memory Log and integrate findings into coordination decision

**If User declines delegation:**

Note the issue for follow-up Task Assignment or adjust approach based on User's preference.

**User Guidance Actions:**

For large-scope issues:

**Action 1:** Examine possible routes forward and identify trade-offs for each option

**Action 2:** Present situation, options, and trade-offs to User with a clear recommendation, then await User guidance before proceeding

---

## 5. Structural Specifications

This section defines the formats and structures for Memory System artifacts.

### 5.1 Directory Structure

```
.apm/Memory/
├── Memory_Root.md
├── Stage_00_Planning/                           # Created only if Planner Agent delegates
│   └── Delegation_Log_00_01_Research_<Slug>.md
├── Stage_01_<Slug>/
│   ├── Task_Log_01_01_<Slug>.md
│   ├── Task_Log_01_02_<Slug>.md
│   └── Delegation_Log_01_01_Debug_<Slug>.md     # Delegation Memory Logs placed side-by-side
├── Stage_02_<Slug>/
│   └── ...
└── Handoffs/
    ├── Manager_Handoffs/                        # Manager Agent Handoffs
    │   └── Manager_Handoff_Memory_Log_<N>.md
    └── <AgentID>_Handoffs/                      # Worker Agent Handoffs
        └── <AgentID>_Handoff_Memory_Log_<N>.md
```

### 5.2 Memory Root Format

**Location:** `.apm/Memory/Memory_Root.md`

**Header Fields:**
- **Project Name:** Actual project name (replace `<Project Name>` placeholder)
- **Project Overview:** Concise project summary from Implementation Plan
- **Manager Handoffs:** Count of Manager Agent handoffs (increment on each handoff)

**Body:** Stage summaries appended after each stage completion. See §5.3 Stage Summary Format.

### 5.3 Stage Summary Format

Append this format to Memory Root after each stage completion:

```markdown
## Stage <StageNum> – <Stage Name> Summary

**Outcome:** [Summarize stage results]

**Notes:** [Undocumented context, working insights, important findings, compatibility issues]

**Agents Involved:** [List of Worker Agents who worked on this stage]

**Task Memory Logs:**
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]

**Delegation Memory Logs:**
- [Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md] - [Status] (if any)
```

**Constraints:**
- Keep summaries ≤30 lines
- Reference log files rather than duplicating content
- Include Notes only when there are observations not captured in individual logs

### 5.4 Task Memory Log Structure

Task Memory Logs are written by Worker Agents. Manager Agents review these logs to track progress and make coordination decisions.

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Naming Convention:** Derive from task ID and title, excluding agent assignment. Example: `Task 2.1 - Deploy Updates | Backend Agent` → `Task_Log_02_01_Deploy_Updates.md`

**YAML Frontmatter Fields:**
- `agent`: Worker Agent identifier (e.g., `Frontend Agent`)
- `task_id`: Task reference from Implementation Plan (e.g., `Task 2.1`)
- `status`: `Success` | `Failed` | `Partial` | `Blocked`
- `failure_point`: `null` | `Execution` | `Validation` | `<description>`
- `delegation`: `true` if Delegate Agent delegation occurred during task
- `important_findings`: `true` if discoveries require Manager attention
- `compatibility_issues`: `true` if output conflicts with existing systems

**Markdown Body Sections:**
- `## Summary`: 1-2 sentence outcome description
- `## Details`: Work performed, decisions made, steps taken
- `## Output`: File paths, deliverables, artifacts created
- `## Validation`: Description of validation performed and result
- `## Issues`: Blockers or errors encountered, or "None"
- `## Compatibility Concerns`: (only if `compatibility_issues: true`) Description of issues
- `## Delegation`: (only if `delegation: true`) Summary with Delegation Memory Log reference
- `## Important Findings`: (only if `important_findings: true`) Project-relevant discoveries
- `## Next Steps`: Recommendations for follow-up actions, or "None"

### 5.5 Delegation Memory Log Structure

Delegation Memory Logs are written by Delegate Agents. They are stored side-by-side with Task Memory Logs in the stage directory.

**Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`

**YAML Frontmatter Fields:**
- `delegation_type`: `Debug` | `Research` | `Refactor` | `<Custom>`
- `delegating_agent`: Agent that initiated the delegation (e.g., `Backend Agent`, `Manager`)
- `stage`: Stage number where delegation was initiated
- `status`: `Resolved` | `Unresolved` | `Escalated`

**Markdown Body Sections:**
- `## Summary`: 1-2 sentence delegation outcome description
- `## Delegation Context`: Why delegated, what calling agent was trying to accomplish
- `## Findings`: Key discoveries, solutions, or information gathered
- `## Resolution`: How the issue was resolved, or why it remains unresolved
- `## Integration Notes`: Guidance for how calling agent should integrate findings
- `## Escalation Justification`: (only if `status: Escalated`) Reasoning for Manager intervention

### 5.6 Delegation Request Block

Output this block when proposing delegation for a bounded-scope issue. See §4.2 Scope Response Policy.

```
**DELEGATION REQUEST**: <Debug|Research> - <Brief Topic>

**Issue**: <Specific issue requiring investigation>
**Why Delegation Helps**: <How dedicated investigation will resolve the blocker>
**Why Self-Investigation Insufficient**: <Why this needs focused context, not quick review>

**Options**:
- Approve: I will create a Delegation Prompt for a Delegate Agent
- Decline: I will note this for follow-up Task Assignment or adjust approach
- Self-Investigate: If scope is smaller than assessed, I can investigate myself

Your choice?
```

---

## 6. Content Guidelines

### 6.1 Communication Tone

- **Managerial perspective:** Focus on coordination, progress, and decisions; leave implementation details to logs
- **Concise updates:** When reporting to User, summarize log findings briefly; User can read full logs if needed
- **Actionable framing:** Every status update should conclude with clear next action or decision request
- **Escalation clarity:** When escalating to User, present the situation, options considered, and a clear recommendation

### 6.2 Common Mistakes to Avoid

- **Duplicating log content:** Stage summaries should reference logs, not reproduce them
- **Ignoring flags:** The `important_findings` and `compatibility_issues` flags exist to force deeper review; skipping this breaks the coordination loop
- **Forgetting Memory Root updates:** Stage summaries must be appended after each stage completion
- **Inconsistent naming:** Deviating from the naming conventions breaks cross-referencing between Implementation Plan and Memory
- **Premature User escalation:** Defaulting to "ask User" before considering self-investigation or delegation for bounded issues

---

**End of Skill**
