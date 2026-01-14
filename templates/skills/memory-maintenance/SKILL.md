---
name: memory-maintenance
description: Memory System management including initialization, directory structure, log review, and stage summaries. Defines Memory maintenance procedures for the Manager Agent.
---

# APM {VERSION} - Memory Maintenance Skill

## 1. Overview
This skill defines how APM Manager Agents maintain the APM Memory System during project execution. The Memory System uses a **Dynamic-MD** architecture to store project history as structured Markdown files. The Manager Agent is responsible for maintaining this system throughout the APM session.

### 1.1. Memory System Architecture

- **Storage Location:** `.apm/Memory/`
- **Root Document:** `Memory_Root.md` - high-level project state, stage summaries and working notes
- **Stage Directories:** `Stage_<StageNum>_<Slug>/` - contain Task Memory Logs and Delegation Memory Logs
- **Handover Storage:** `Handovers/` - contain agent handover files

### 1.2. Directory Structure

```
.apm/Memory/
├── Memory_Root.md
├── Stage_00_Planning/                           # Created only if Planner Agent delegates
│   └── Delegation_Log_00_01_Research_<Slug>.md
├── Stage_01_<Slug>/
│   ├── Task_Log_01_01_<Slug>.md
│   ├── Task_Log_01_02_<Slug>.md
│   └── Delegation_Log_01_01_Debug_<Slug>.md     # Delegation Memory Logs placed side-by-side with Task Memory Logs
├── Stage_02_<Slug>/
│   └── ...
└── Handovers/
    ├── Manager_Handovers/                       # Manager Agent Handovers
    │   └── Manager_Handover_Log_<N>.md
    └── <AgentID>_Handovers/                     # Worker Agent Handovers
        └── <AgentID>_Handover_Log_<N>.md
```

## 2. Memory Artifacts

### 2.1. Memory Root

The `Memory_Root.md` file tracks high-level project state. It is initialized by the CLI with a header template and populated by the Manager Agent.

**Header Fields:**
- **Project Name:** Actual project name (replace `<Project Name>` placeholder)
- **Memory Strategy:** Always `Dynamic-MD`
- **Project Overview:** Concise project summary from Implementation Plan
- **Manager Handovers:** Count of Manager Agent handovers (increment on each handover)

**Stage Summaries:** Appended after each stage completion. See §3.5 Memory Root Management.

### 2.2. Task Memory Logs

Task Memory Logs are written by Worker Agents after task execution. Manager Agents review these logs to track progress and make coordination decisions.

**Naming Convention:** `Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`

**Expected Structure:**

**YAML Frontmatter Fields:**
- `agent`: Worker Agent identifier (e.g., `Frontend Agent`)
- `task_id`: Task reference from Implementation Plan (e.g., `Task 2.1`)
- `status`: `Completed` (all work finished) | `Partial` (some progress, issues identified) | `Blocked` (cannot proceed)
- `validation_result`: `Passed` (criteria met) | `Failed` (criteria not met)
- `failure_point`: `null` (no failure) | `Execution` (task work failed) | `Validation` (work done, validation failed) | `<description>`
- `delegation`: `true` if Delegate Agent delegation occurred during task
- `important_findings`: `true` if discoveries require Manager attention. See §3.4 Log Review Protocol.
- `compatibility_issues`: `true` if output conflicts with existing systems. See §3.4 Log Review Protocol.

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

### 2.3. Delegation Memory Logs

Delegation Memory Logs are written by Delegate Agents after completing delegated work. They are stored side-by-side with Task Memory Logs in the stage directory.

**Naming Convention:** `Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md`

**Expected Structure:**

**YAML Frontmatter Fields:**
- `delegation_type`: `Debug` (isolated debugging) | `Research` (documentation research) | `Refactor` (code restructuring) | `<Custom>`
- `delegating_agent`: Agent that initiated the delegation (e.g., `Backend Agent`, `Manager`)
- `stage`: Stage number where delegation was initiated
- `status`: `Resolved` (issue solved, ready for integration) | `Unresolved` (partial findings) | `Escalated` (requires Manager intervention)

**Markdown Body Sections:**
- `## Summary`: 1-2 sentence delegation outcome description
- `## Delegation Context`: Why delegated, what calling agent was trying to accomplish
- `## Findings`: Key discoveries, solutions, or information gathered
- `## Resolution`: How the issue was resolved, or why it remains unresolved
- `## Integration Notes`: Guidance for how calling agent should integrate findings
- `## Escalation Justification`: (only if `status: Escalated`) Reasoning for Manager intervention

## 3. Manager Agent Responsibilities

### 3.1. Memory Root Initialization (First Session Only)

Before starting first stage execution, fill in the Memory Root header:

- **Action 1:** Read `.apm/Memory/Memory_Root.md`
- **Action 2:** Replace `<Project Name>` with actual project name from Implementation Plan
- **Action 3:** Replace `[To be filled by Manager Agent before first stage execution]` in Project Overview with concise project summary
- **Action 4:** Confirm Manager Handovers is set to `0`
- **Action 5:** Save the updated file

### 3.2. Stage Directory Management

On stage entry:

- **Action 1:** Create stage directory if missing: `.apm/Memory/Stage_<StageNum>_<Slug>/`
- **Action 2:** Create empty Task Memory Log files for all tasks in the stage (see §3.3)
- **Action 3:** Proceed with first Task Assignment for the stage

**Naming Convention:** Use task ID and title from Implementation Plan, excluding agent assignment. Example: Task `Task 2.1 - Deploy Updates | Backend Agent` → `Task_Log_02_01_Deploy_Updates.md`

### 3.3. Empty Log Creation

Create **completely empty** Memory Log files for all stage tasks before issuing Task Assignments.

- Create one empty `.md` file per task in the stage directory
- Do NOT populate any content - Worker Agents fill the entire structure
- Include the `memory_log_path` in each Task Assignment Prompt

### 3.4. Log Review Protocol

When User returns with a Task Report:

- **Action 1:** Read the Task Memory Log at the provided path

- **Action 2:** Check YAML frontmatter flags:
    - If `important_findings: true` → **MUST** read referenced source files/artifacts before deciding
    - If `compatibility_issues: true` → **MUST** evaluate plan implications before proceeding

- **Action 3:** Assess task status:
    - `Completed` + `validation_result: Passed` → Task successful, proceed to next action
    - `Completed` + `validation_result: Failed` → Review `failure_point`, determine follow-up
    - `Partial` → Review Issues section, determine follow-up or Delegate Agent delegation
    - `Blocked` → Review Issues section, determine Escalation path

- **Action 4:** Determine next action:
    - Continue with next Task Assignment
    - Issue follow-up prompt to same agent
    - Update Implementation Plan if needed
    - Initiate Delegate Agent delegation if technical blocker persists

**Escalation Path Determination:**

When a task is `Blocked` or repeated follow-ups fail to resolve issues:
- **Delegation candidate:** Technical blocker that isolated debugging/research could resolve → Initiate Delegate Agent delegation
- **Plan modification candidate:** Blocker reveals incorrect assumptions, missing dependencies, or scope, requirements or constraints issues → Update Implementation Plan accordingly before continuing
- **User decision required:** Blocker requires external action, access, or decision outside Agent capabilities → Present options to User with clear recommendation(s)
- **Scope exceeds current stage:** Blocker affects multiple stages or requires architectural changes → Pause current stage, reassess plan structure with User

### 3.5. Memory Root Management

At stage completion, append a stage summary to Memory Root:

```markdown
## Stage <StageNum> – <Stage Name> Summary
**Outcome:** [Summarize stage results]
**Agents Involved:** [List of Worker Agents who worked on this stage]
**Task Memory Logs:**
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]
**Delegation Memory Logs:**
- [Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md] - [Status] (if any)
**Notes:** [Include undocumented context, working insights, important findings, compatibility issues]
```

Keep summaries ≤30 lines. Reference log files rather than duplicating content.

## 4. Content Guidelines

### 4.1. Memory Root Management

- **Project Overview:** Copy the exact Project Overview paragraph from the Implementation Plan header
- **Stage Summaries:** Keep to ≤30 lines; reference log files rather than duplicating their content
- **Notes field:** Capture undocumented context, working insights, and cross-stage observations that don't belong in individual logs

### 4.2. Stage Directory Organization

- **Naming consistency:** Always derive slugs from Implementation Plan task/stage titles
- **Empty log creation:** Create all empty logs of a stage before its first Task Assignment
- **Delegation logs placement:** Store side-by-side with Task Memory Logs in the same stage directory


### 4.3. Log Review Standards

- **Flag-driven depth:** When `important_findings` or `compatibility_issues` flags are true, you MUST investigate beyond the log itself
- **Status-driven decisions:** Use the status+validation_result matrix in §3.4 Log Review Protocol to determine next action; do not improvise
- **Plan alignment:** Any insight that affects project scope, requirements, constraints, or approach must be reflected in Implementation Plan updates
- **Escalation discipline:** Follow the Escalation Path Determination framework in §3.4 Log Review Protocol; do not skip directly to User escalation when delegation or plan modification could resolve the issue


### 4.4. Communication Tone on Log Review

- **Managerial perspective:** Focus on coordination, progress, and decisions; leave implementation details to logs
- **Concise updates:** When reporting to User, summarize log findings briefly; User can read full logs if needed
- **Actionable framing:** Every status update should conclude with clear next action or decision request
- **Escalation clarity:** When escalating to User, present the situation, options considered, and a clear recommendation

### 4.5. Common Mistakes to Avoid

- **Duplicating log content:** Stage summaries should reference logs, not reproduce them
- **Ignoring flags:** The `important_findings` and `compatibility_issues` flags exist to force deeper review; skipping this breaks the coordination loop
- **Forgetting Memory Root updates:** Stage summaries must be appended after each stage completion
- **Inconsistent naming:** Deviating from the naming conventions breaks cross-referencing between Implementation Plan and Memory
- **Premature User escalation:** Defaulting to "ask User" before considering delegation or plan modification options

---

**End of Skill**
