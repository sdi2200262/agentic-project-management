# APM v0.4 - Manager Agent Handover Guide
This guide defines how Manager Agents execute handover procedures to transfer project coordination context to incoming Manager Agent instances when approaching context window limits.

---

## 1 Handover Protocol Overview
Manager Agent Handover Protocol enables seamless context transfer using a two-artifact system while Manager Agent Context Scope includes full project coordination awareness.
- **Handover File:** active memory context not in formal logs or other artifacts
- **Handover Prompt:** template with embedded instructions for incoming Manager Agent. 


---

## 2 Handover Eligibility and Timing
Handover procedures are only eligible when current critical step is complete. Manager Agent **MUST** have completed: 
- **current Task Assignment issued**
- **Memory Log reviewed**
- **next action decision made** (continue with next task, follow-up prompt, or Implementation Plan update).

### Handover Blocking Scenarios
If the current critical step is not complete tehn Handover requests **MUST** be denied during. When User requests Handover during non-eligible timing: **finish current critical step** then ask if they still want to commence Handover Procedure.

**Denial Response Format:** "Handover not eligible. Currently [specific critical step in progress]. Will confirm handover eligibility upon completion."

---

## 3 Handover Execution Process

### Step 1: Handover Request Validation
Assess current coordination state using section §2 criteria. If not eligible → deny request with completion requirements. If eligible → proceed to context gathering.

### Step 2: Context Synthesis and Validation
Synthesize current project state by reviewing Implementation Plan for phase status, Memory Root for coordination history, recent Memory Logs for agent outputs and dependencies.

### Step 3: Artifact Creation
Create Manager Handover File and Handover Prompt using templates in section §4. Follow file organization in section §5.

### Step 4: User Review and Finalization
Present artifacts to User for review, accept modifications, confirm completeness before User executes handover procedure.

#### Handover Procedure Overview
After confirming completeness, User will open a new chat session, initialize a new Manager Agent instance and paste the Handover Prompt. This chat session will replace you as the Manager Agent for this APM session.

---

## 4 Manager Agent Handover Artifacts
Create Generate Handover Artifacts following these templates:

### Manager Handover Prompt Template
```markdown
# APM Manager Agent Handover - [Project Name]
You are taking over as Manager Agent from [Outgoing Manager Agent ID].

## APM Context Integration Protocol
1. **Read Implementation Plan Guide** ([guides/Implementation_Plan_Guide.md]) to understand Implementation Plan structure and Manager Agent session-maintenance responsibilities, then **read Implementation Plan** ([path/Implementation_Plan.md/json]) for current phase status and task assignments
2. **Read Memory System Guide** ([guides/Memory_System_Guide.md]) to understand Memory System structure and Manager responsibilities, then **read Memory Root** ([path/Memory/Memory_Root.md or Memory_Bank.md]) for phase summaries and coordination history
3. **Read Memory Log Guide** ([guides/Memory_Log_Guide.md]) to understand Memory Log structure and review responsibilities, then **read recent Memory Logs** from current/latest phase ([path/current-phase-directory]) for latest agent outputs and dependencies
4. **Read Task Assignment Guide** ([guides/Task_Assignment_Guide.md]) to understand Task Assignment structure and agent coordination responsibilities
5. **State your understanding of the Project's state and your responsibilities** based on the guides and **await for User confirmation** to proceed to the next step. 
5. **Read Handover File** ([path/Manager_Agent_Handover_File_X.md]) for active memory context of the outgoing agent not captured in formal logs

## Cross-Reference Validation
Compare Handover File active memory against Implementation Plan current state and Memory Log outcomes. Note contradictions for User clarification.

## Current Session State
- **Phase:** [Name/Number] - [X/Y tasks complete]
- **Active Agents:** [Agent_Name with current assignments]
- **Next Priority:** [Task ID - Agent assignment] | [Phase summary] | [Plan update]
- **Recent Directives:** [Unlogged user instructions]
- **Blockers:** [Coordination issues requiring attention]

## User Verification Protocol
After context synthesis: ask 1-2 assurance questions about project state accuracy, if contradictions found ask specific clarification questions, await explicit User confirmation before proceeding.

**Immediate Next Action:** [Specific coordination task]

Acknowledge receipt and begin APM context integration protocol immediately.
```

### Manager Handover File Format
```yaml
---
agent_type: Manager
agent_id: Manager_[X]
handover_number: [X]
current_phase: [Phase <n>: <Name>]
active_agents: [List of active Implementation Agents]
---
```
```markdown
# Manager Agent Handover File - [Project Name]

## Active Memory Context
**User Directives:** [Unlogged instructions, priority changes, Implementation Agent feedback]
**Decisions:** [Coordination choices, assignment rationale, observed User patterns]

## Coordination Status
**Producer-Consumer Dependencies (unordered list):**
- [Task X.Y output] → [Available for Task A.B assignment to Agent_Name] or [Task M.N] → [Blocked waiting for Task P.Q completion]

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

## 5 File Organization and Naming
Store Manager Agent Handover Files in `Memory/Handovers/Manager_Agent_Handovers/` (Dynamic Memory) or `project-root/Handovers/Manager_Agent_Handovers/` (Simple Memory). Use naming: `Manager_Agent_Handover_File_[Number].md`. Handover Prompts are created as markdown code blocks, not stored as files.

---

**End of Guide**