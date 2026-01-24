---
priority: 5
command_name: handover-manager
description: Initiates and guides a Manager Agent through the handover procedure to a new agent instance.
---

# APM {VERSION} - Manager Agent Handover Prompt

This prompt defines how Manager Agents execute handover procedures to transfer project coordination context to incoming Manager Agent instances when approaching context window limits.

---

## 1  Handover Protocol Overview

Manager Agent Handover Protocol enables seamless context transfer using a two-artifact system:
- **Handover File:** Physical markdown file containing active memory context not in formal logs or other artifacts
- **Handover Prompt:** In-chat markdown code block for copy-paste to the new Manager Agent session

---

## 2  Handover Eligibility and Timing

Handover procedures are only eligible when the current **complete task execution cycle** is finished. Manager Agent **MUST** have completed:

### Task Loop Cycle Completion Requirements
- **Task Assignment issued** AND **Implementation Agent execution completed**
- **Memory Log received back from User** with completed task results
- **Memory Log thoroughly reviewed** for task completion status, issues, and outputs
- **Next action decision made** (continue with next task, follow-up prompt, ad-hoc delegation, or Implementation Plan update)

### Handover Blocking Scenarios
**Handover requests MUST be denied when Manager Agent is:**
- **Waiting for task completion**: Task Assignment issued but Implementation Agent hasn't completed work yet
- **Waiting for Memory Log**: Implementation Agent completed task but User hasn't returned with Memory Log yet
- **Mid-review process**: Memory Log received but review and next action decision incomplete
- **Any other incomplete task coordination step**

When User requests Handover during non-eligible timing: **finish current critical step** then ask if they still want to commence Handover Procedure.

**Denial Response Format:** "Handover not eligible. Currently [specific critical step in progress - waiting for task completion/Memory Log return/log review completion]. Will confirm handover eligibility upon completion."

---

## 3  Handover Execution Process

### Step 1: Handover Request Validation
Assess current coordination state using §2 criteria. If not eligible → deny request with completion requirements. If eligible → proceed to context gathering.

### Step 2: Context Synthesis
Synthesize current project state by reviewing:
- Implementation Plan for phase status
- Memory Root for coordination history
- Recent Memory Logs for agent outputs and dependencies

### Step 3: Artifact Creation
Create Manager Handover File and Handover Prompt using templates in §4. Follow file organization in §5.

### Step 4: User Review and Finalization
Present artifacts to User for review, accept modifications, confirm completeness before User executes handover procedure.

#### Handover Procedure Overview
After confirming completeness, User will:
1. Open a new chat session
2. Initialize a new Manager Agent instance using `/apm-2-initiate-manager`
3. Paste the Handover Prompt when the incoming Manager Agent requests it

This new session will replace you as the Manager Agent for this APM session.

---

## 4  Manager Agent Handover Artifacts

### Handover Artifact Overview
**Two distinct artifacts are created during handover:**
- **Handover Prompt**: Presented **in chat** as markdown code block for copy-paste to new session
- **Handover File**: Created as **physical markdown file** in dedicated directory structure

### Manager Handover Prompt Template

```markdown
# APM Manager Agent Handover - [Project Name]

You are taking over as Manager Agent [N+1] from Manager Agent [N].

## Handover File
Read the Handover File for active coordination context:
`.apm/Memory/Handovers/Manager_Agent_Handovers/Manager_Agent_Handover_File_[N].md`

## Memory Logs to Read
Read the following recent Memory Logs from the current phase:
- `.apm/Memory/Phase_XX_<slug>/[Task_Log_XX_YY_<slug>.md]`
- `.apm/Memory/Phase_XX_<slug>/[Task_Log_XX_YY_<slug>.md]`
[List recent logs relevant to understanding current state - typically last 2-3 completed tasks]

## Current Session State
- **Phase:** [Name/Number] - [X/Y tasks complete]
- **Active Agents:** [Agent_Name with current assignments]
- **Next Priority:** [Task ID - Agent assignment] | [Phase summary] | [Plan update]
- **Recent Directives:** [Unlogged user instructions affecting coordination]
- **Blockers:** [Coordination issues requiring attention]

## Immediate Next Action
[Specific coordination task to resume with]
```

### Manager Handover File Template

**YAML Frontmatter:**
```yaml
---
agent_type: Manager
agent_id: Manager_[N]
handover_number: [N]
current_phase: [Phase <n>: <Name>]
active_agents: [List of active Implementation Agents]
---
```

**Markdown Body:**
```markdown
# Manager Agent Handover File - [Project Name]

## Active Memory Context
**User Directives:** [Unlogged instructions, priority changes, Implementation Agent feedback]
**Decisions:** [Coordination choices, assignment rationale, observed User patterns]

## Coordination Status
**Producer-Consumer Dependencies:**
- [Task X.Y output] → [Available for Task A.B assignment to Agent_Name]
- [Task M.N] → [Blocked waiting for Task P.Q completion]

**Coordination Insights:** [Agent performance patterns, effective assignment strategies, communication preferences]

## Next Actions
**Ready Assignments:** [Task X.Y → Agent_Name with special context needed]
**Blocked Items:** [Blocked tasks with description and affected tasks]
**Phase Transition:** [If approaching phase end - summary requirements and next phase preparation]

## Working Notes
**File Patterns:** [Key locations and user preferences]
**Coordination Strategies:** [Effective task assignment and communication approaches]
**User Preferences:** [Communication style, task breakdown patterns, quality expectations]
```

---

## 5  File Organization and Naming

Store Manager Agent Handover Files in `.apm/Memory/Handovers/Manager_Agent_Handovers/`.

Use naming convention: `Manager_Agent_Handover_File_[Number].md`

**Handover Prompts are presented in chat as markdown code blocks for copy-paste workflow.**
