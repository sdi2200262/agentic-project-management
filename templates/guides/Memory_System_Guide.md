# APM {VERSION} - Memory System Guide
This guide defines how Manager Agents maintain the APM Memory System during project execution.

## 1. Overview

The Memory System uses a **Dynamic-MD** architecture to store project history as structured Markdown files. The Manager Agent is responsible for maintaining this system throughout the APM session.

### 1.1. Memory System Architecture

- **Storage Location:** `.apm/Memory/`
- **Root Document:** `Memory_Root.md` - high-level project state and phase summaries
- **Phase Directories:** `Phase_<NN>_<Slug>/` - contain Task Memory Logs and Delegation Logs
- **Handover Storage:** `Handovers/` - contain agent handover files

### 1.2. Directory Structure

```
.apm/Memory/
├── Memory_Root.md
├── Phase_00_Setup/                              # Created only if Setup Agent delegates
│   └── Delegation_00_01_Research_<Slug>.md
├── Phase_01_<Slug>/
│   ├── Task_01_01_<Slug>.md
│   ├── Task_01_02_<Slug>.md
│   └── Delegation_01_01_Debug_<Slug>.md         # Side-by-side with Task logs
├── Phase_02_<Slug>/
│   └── ...
└── Handovers/
    ├── Manager_Handovers/
    │   └── Manager_Handover_<N>.md
    └── <Agent_ID>_Handovers/
        └── <Agent_ID>_Handover_<N>.md
```

---

## 2. Memory Artifacts

### 2.1. Memory Root

The `Memory_Root.md` file tracks high-level project state. It is initialized by the CLI with a header template and populated by the Manager Agent.

**Header Fields:**
- **Project Name:** Actual project name (replace `<Project Name>` placeholder)
- **Memory Strategy:** Always `Dynamic-MD`
- **Project Overview:** Concise project summary from Implementation Plan
- **Manager Handovers:** Count of Manager Agent handovers (increment on each handover)

**Phase Summaries:** Appended after each phase completion (see §4.5).

### 2.2. Task Memory Logs

Task Memory Logs are written by Implementation Agents after task execution. Manager Agents review these logs to track progress and make coordination decisions.

**Expected Structure:**

```yaml
---
agent: <Agent_ID>
task_ref: <Task_ID>
status: Completed | Partial | Blocked
validation_result: Passed | Failed
failure_point: null | Execution | Validation | <description>
delegation: true | false
important_findings: true | false
compatibility_issues: true | false
---
```

**Key Sections to Review:**
- **Summary:** 1-2 sentence outcome description
- **Output:** File paths, deliverables, artifacts created
- **Issues:** Blockers or errors encountered
- **Validation Result:** Whether task passed its defined validation criteria
- **Important Findings:** Flag `true` requires deeper artifact inspection
- **Compatibility Issues:** Flag `true` requires plan review consideration

### 2.3. Delegation Logs

Delegation Logs are written by Ad-Hoc Agents after completing delegated work. They are stored side-by-side with Task Memory Logs in the phase directory.

**Naming Convention:** `Delegation_<PhaseNum>_<SequentialNum>_<Type>_<Slug>.md`

**Expected Structure:**

```yaml
---
delegation_type: Debug | Research | Refactor | <Custom>
delegating_agent: <Agent_ID>
phase: <Phase_Number>
status: Resolved | Unresolved | Escalated
---
```

**Key Sections to Review:**
- **Summary:** Delegation outcome
- **Findings:** Key discoveries or solutions
- **Resolution:** How the issue was resolved or why it remains unresolved
- **Integration Notes:** How calling agent should integrate findings

---

## 3. Manager Agent Responsibilities

### 3.1. Memory Root Initialization (First Session Only)

Before starting first phase execution, fill in the Memory Root header:

**Action 1:** Read `.apm/Memory/Memory_Root.md`
**Action 2:** Replace `<Project Name>` with actual project name from Implementation Plan
**Action 3:** Replace `[To be filled by Manager Agent before first phase execution]` in Project Overview with concise project summary
**Action 4:** Confirm Manager Handovers is set to `0`
**Action 5:** Save the updated file

### 3.2. Phase Directory Management

On phase entry:

**Action 1:** Create phase directory if missing: `.apm/Memory/Phase_<NN>_<Slug>/`
**Action 2:** Create empty Task Memory Log files for all tasks in the phase (see §3.3)
**Action 3:** Proceed with first Task Assignment for the phase

**Naming Convention:** Use task ID and title from Implementation Plan, excluding agent assignment.
- Example: Task `Task 2.1 - Deploy Updates | Agent_Backend` → `Task_02_01_Deploy_Updates.md`

### 3.3. Empty Log Creation

Create **completely empty** Memory Log files for all phase tasks before issuing Task Assignments.

- Create one empty `.md` file per task in the phase directory
- Do NOT populate any content - Implementation Agents fill the entire structure
- Include the `memory_log_path` in each Task Assignment Prompt

### 3.4. Log Review Protocol

When User returns with completed task:

**Action 1:** Read the Task Memory Log at the provided path

**Action 2:** Check YAML frontmatter flags:
- If `important_findings: true` → **MUST** read referenced source files/artifacts before deciding
- If `compatibility_issues: true` → **MUST** evaluate plan implications before proceeding

**Action 3:** Assess task status:
- `Completed` + `validation_result: Passed` → Task successful, proceed to next action
- `Completed` + `validation_result: Failed` → Review failure_point, determine follow-up
- `Partial` → Review Issues section, determine follow-up or delegation
- `Blocked` → Review Issues section, determine escalation path

**Action 4:** Determine next action:
- Continue with next Task Assignment
- Issue follow-up prompt to same agent
- Update Implementation Plan if needed
- Initiate Ad-Hoc delegation if technical blocker persists

### 3.5. Phase Summary Creation

At phase completion, append summary to Memory Root:

```markdown
## Phase <NN> – <Phase Name> Summary
**Outcome:** [≤200 words summarizing phase results]
**Agents Involved:** [List of Implementation Agents who worked on this phase]
**Task Logs:**
- [Task_NN_MM_Slug.md] - [Status]
- [Task_NN_MM_Slug.md] - [Status]
**Delegation Logs:**
- [Delegation_NN_MM_Type_Slug.md] - [Status] (if any)
```

Keep summaries ≤30 lines. Reference log files rather than duplicating content.

---

**End of Guide**
