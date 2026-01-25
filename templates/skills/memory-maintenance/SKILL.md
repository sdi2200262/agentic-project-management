---
name: memory-maintenance
description: Memory System management including initialization, directory structure, Task Memory Log review, Coordination Decisions, and Stage Summaries. Defines Memory maintenance procedures for the Manager Agent.
---

# APM {VERSION} - Memory Maintenance Skill

## 1. Overview

**Reading Agent:** Manager Agent

This skill defines how the Manager Agent maintains the Memory System during project execution. The Memory System stores project history using Memory Logs (structured Markdown files), enabling progress tracking, Coordination Decisions, and context preservation across Agent Handoffs.

### 1.1 How to Use This Skill

**Execute the Procedure.** The Procedure section contains the actions to perform for Memory System maintenance. Follow subsections based on the current maintenance need. See §3 Memory Maintenance Procedure.

**Use Operational Standards for reasoning and decisions.** When interpreting Task Memory Log content, assessing investigation scope, determining Coordination Decision outcomes, or detecting Worker Handoffs, consult the relevant standards subsection. See §2 Operational Standards.

### 1.2 Objectives

- Initialize and maintain the Memory System structure throughout project execution
- Review Task Reports and Task Memory Logs to assess completion and make Coordination Decisions
- Detect Worker Agent Handoffs and adjust Context Dependency treatment accordingly
- Identify when findings warrant artifact modifications
- Create Stage Summaries to preserve high-level progress context
- Maintain the Memory System to enable seamless Handoff and onboarding through structured Memory artifacts

### 1.3 Outputs

**Memory Root:** Central project state document updated throughout execution. Contains project overview, Handoff count, and Stage Summaries. Location: `.apm/Memory/Memory_Root.md`

**Stage Summaries:** Appended to Memory Root after each Stage completion. Compress Stage execution into coordination-ready format with outcome, notes, and log references.

### 1.4 Memory System Architecture

- **Storage Location:** `.apm/Memory/`
- **Root Document:** `Memory_Root.md` - high-level project state, Stage Summaries, and working notes
- **Stage Directories:** `Stage_<StageNum>_<Slug>/` - contain Task Memory Logs and Delegation Memory Logs
- **Handoff Storage:** `.apm/Memory/Handoffs/` - contain Agent Handoff Files

See §4.1 Directory Structure.

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Memory System maintenance. It guides how to interpret Task Memory Logs, assess Coordination Decision scope, detect Handoffs, and write Stage Summaries.

### 2.1 Task Memory Log Review Standards

The goal is to extract information needed for the next Coordination Decision and evaluate Worker Agent performance.

**Review Focus:**
- What was the outcome? (status and failure_point)
- Are there flags requiring attention? (important_findings, compatibility_issues, Delegation)
- What affects the next Coordination Decision? (blockers, dependencies, follow-ups)

**Status Interpretation:**
- `status: Success` - Task objective achieved, all validation passed
- `status: Partial` - More than 50% of Task Execution and corresponding Validation were successful, but less than 50% either failed Validation or could not be executed/validated. An intermediate state between Success and Fail.
- `status: Failed` - Most or all parts of Task Execution failed Validation or could not be executed
- `status: Blocked` - Similar to Fail, but with serious blockers that the Worker Agent has limited context scope or authority to address. Requires Manager's coordination-level resolution.

**Flag Interpretation** → Workers set flags based on their scoped observations. The Manager interprets these flags with full project awareness to assess actual coordination impact:
- `important_findings: true` - Worker observed something that appeared to have implications beyond their Task scope. Manager assesses whether this affects Coordination Artifacts or other Tasks, otherwise just a false-positive.
- `compatibility_issues: true` - Worker observed conflicts with existing systems they encountered. Manager assesses whether this indicates Implementation Plan, Specification or Standards issues, otherwise just a false-positive.
- `delegation: true` - Worker delegated part of the Task. Task Memory Log contains summary and Delegation Memory Log contains full findings. See `{SKILL_PATH:memory-logging}` §4.2 Delegation Memory Log Format.

**Content Review:** Beyond flags and status, review the log body sections (Summary, Details, Output, Validation, Issues) to understand what happened. See §3.4 Task Memory Log Review and §4.4 Task Memory Log Structure.

### 2.2 Coordination Decision Standards

After reviewing a Task Memory Log, the Manager must make a Coordination Decision. This section guides both reasoning and decision rules through three sequential assessments.

**Assessment 1 - Investigation Need** → Two primary branches based on initial review:
- *Proceed:* Status is Success with no flags raised, log contents support this → Proceed to next Task.
- *Investigation needed:* Flags raised OR status is non-Success (Partial, Fail, Blocked) → Continue to Assessment 2.

**Assessment 2 - Investigation Scope** → When investigation is needed, assess the scope to determine the approach:

*Small Scope Indicators:*
- Few files to check
- Straightforward verification needed
- Minor clarification or simple follow-up would resolve
- Issue is contained to this specific Task

*Large Scope Indicators:*
- Context-intensive debugging or research needed
- Would consume significant Manager context window
- Systemic issues or patterns emerging
- Impacts multiple Tasks or Stages
- Requires deep technical investigation

**Default:** When scope is unclear, prefer Delegation over extensive self-investigation to preserve Manager context. See §3.5 Coordination Decision.

**Assessment 3 - Post-Investigation Outcome** → After investigation (self or delegated), assess the outcome:
- *No issues:* Investigation revealed nothing requiring action (may have been false positives) → Proceed to next Task.
- *FollowUp needed:* Issues require same Worker to retry or refine work → Create FollowUp Task Assignment Prompt with informed instructions.
- *Artifact modification needed:* Coordination Artifacts need updates → Follow `{SKILL_PATH:artifact-maintenance}` §3 Artifact Maintenance Procedure.

The scope determines *how* to investigate, not *what* outcomes are possible-all three outcomes can result from either scope. When artifact modification is needed, note the triggering context (log, findings, flags) and identify affected artifact(s).

**Coordination Artifact Modification Indicators** → When assessing whether Coordination Artifact modification is needed, consider:
- **Implementation Plan:** Task definitions or instructions incorrect, missing dependencies revealed, scope changes needed, Task validation issues, new Tasks needed
- **Specifications:**  Documented design decisions or constraints need revision, new specifications emerged from execution, assumptions invalidated
- **Standards (`{AGENTS_FILE}`):** Universal conventions need adjustment, new project-wide standards identified, existing standards conflict with execution needs

### 2.3 Handoff Detection Standards

**Detection Criteria** → An Incoming Worker Agent (Replacement Agent after Handoff) includes in its Task Report: (1) clear statement it is a new instance after Handoff, (2) list of current Stage Memory Logs read, (3) note that previous Stage logs were not loaded for efficiency. Upon detection, verify the Handoff File exists and integrate in Manager's working context per §3.3 Task Report Review.

**Context Dependency Treatment** → From this point forward, any Same-Agent Context Dependencies from previous Stages for this Incoming Worker Agent must be treated as Cross-Agent Context Dependencies. The Handoff Procedure loads only current Stage Memory Logs for efficiency, meaning the Incoming Worker has no working context from previous Stages even for Tasks completed by its previous instance. Account for this when constructing future Task Assignment Prompts.

### 2.4 Stage Summary Standards

Stage Summaries compress Stage execution details. They serve future Incoming Manager Agent instances (after Handoff) and project retrospectives.

**Summary Scope:**
- Capture Stage outcome, not Task-by-Task detail
- Note cross-cutting observations that don't belong in individual logs
- Reference log files rather than duplicating their content
- Highlight patterns, blockers, or insights relevant to subsequent Stages

**Content Selection:**
- Include: Overall outcome, Agents involved, notable findings, compatibility concerns
- Reference: Individual Memory Log files for Task-specific detail. See §4.3 Stage Summary Format
- Exclude: Implementation details, code specifics, routine operations

---

## 3. Memory Maintenance Procedure

This section defines the sequential actions for Memory System maintenance. Execute subsections based on the current maintenance need.

**Procedure:**
1. Memory Root Initialization (first session only)
2. Stage Directory Creation (on Stage entry)
3. Task Report Review (after receiving Task Report from User)
4. Task Memory Log Review (read and interpret the log)
5. Coordination Decision (determine and execute next action)
6. Stage Summary Creation (on Stage completion)

### 3.1 Memory Root Initialization

Execute once at the start of the First Manager Agent session, before issuing the first Task Assignment.

Perform the following actions:
1. Read `.apm/Memory/Memory_Root.md`
2. Update header fields:
   - Replace `<Project Name>` with actual project name from Implementation Plan
   - Replace `[To be filled by Manager Agent before first stage execution]` in Project Overview with concise project summary from Implementation Plan
   - Confirm Manager Handoffs is set to `0`
3. Save the updated file

### 3.2 Stage Directory Creation

Execute when entering a new Stage, before issuing any Task Assignments for that Stage, create the **empty** Stage directory: `.apm/Memory/Stage_<StageNum>_<Slug>/`

**Naming Convention:** Derive Stage slug from Implementation Plan Stage title. Example: `Stage 2 - API Integration` → `Stage_02_API_Integration/`

### 3.3 Task Report Review

Execute when User returns with a Task Report from a Worker Agent.

Perform the following actions:
1. Receive the Task Report from User. The Task Report is a concise markdown code block that references the Task Memory Log path.
2. Check for Handoff indication in the Task Report:
   - If the Task Report indicates the Worker is an Incoming Worker Agent (new instance after Handoff):
     - Verify the Handoff File exists by listing the directory `.apm/Memory/Handoffs/<AgentID>_Handoffs/` (list only, do not read the file to preserve context)
     - Integrate the Handoff in Manager's working context: which Worker Agent performed the Handoff, which Stage it occurred in, which Memory Logs the Incoming Worker has loaded (current Stage only)
     - Update Context Dependency treatment for this Worker
   - If no Handoff indication → Proceed to §3.4 Task Memory Log Review.

### 3.4 Task Memory Log Review

Execute after Task Report Review to read and interpret the Task Memory Log.

Perform the following actions:
1. Read the Task Memory Log at the path referenced in the Task Report
2. Interpret log content using §2.1 Task Memory Log Review Standards:
   - Note the status and failure_point
   - Check all flags (important_findings, compatibility_issues, Delegation)
   - Review body sections for context:
     - Summary: Quick understanding of what happened
     - Details: Work performed, decisions made
     - Output: File paths, deliverables created
     - Validation: What was validated and results
     - Issues: Blockers or errors encountered
   - Check if body contents support status and flags

Proceed to §3.5 Coordination Decision with interpreted findings.

### 3.5 Coordination Decision

Execute after Task Memory Log Review to determine and execute the next coordination action.

Perform the following actions:
1. Apply §2.2 Coordination Decision Standards Assessment 1 to determine the decision branch:
   - If status is Success with no flags raised and log contents support this → **Proceed to next Task**
   - If flags are raised OR status is non-Success → **Investigation needed**, continue to step 2
2. Assess investigation scope using §2.2 Coordination Decision Standards Assessment 2:
   - Small scope → Self-investigate (step 3a)
   - Large scope → Request Delegation (step 3b)
3. Investigate based on scope:
   - **3a (Self-Investigation):**
     - Identify specific files, artifacts, Delegation Memory Logs (if any) or areas to examine
     - Use available tools to review referenced files, verify deliverables, and gather context
     - Keep investigation focused to avoid excessive context consumption
     - After investigation, proceed to step 4
   - **3b (Request Delegation):**
     - Determine Delegation type (Debug or Research or other) based on issue nature
     - Request a Delegation from the User using the following output:
       ```
       I'd like to delegate part of this work: <Debug|Research|Other> on <Brief Topic>.

       Here's what's going on: <Describe the specific issue that needs investigation>.

       I'm requesting Delegation because a dedicated investigation will address this issue, and trying to handle it as Manager would use too much context or be inefficient.

       Would you like to approve the Delegation, or would you prefer a different approach?
       ```
     - If User approves: Read the appropriate Delegation skill (`{SKILL_PATH:delegate-debug}` or `{SKILL_PATH:delegate-research}`), create Delegation Prompt, User facilitates Delegate session
     - When User returns with Delegation Report, read the Delegation Memory Log and integrate findings, then proceed to step 4
4. Assess post-investigation outcome using §2.2 Coordination Decision Standards Assessment 3:
   - **No issues** → Proceed to next Task Assignment (return to Task Cycle in initiation command)
   - **FollowUp needed** → Create FollowUp Task Assignment Prompt per `{SKILL_PATH:task-assignment}` §3.5 FollowUp Task Assignment Prompt Creation, output for User
   - **Coordination Artifact modification needed** → Handoff to `{SKILL_PATH:artifact-maintenance}` §3 Artifact Maintenance Procedure

**If proceeding to next Task** and all Tasks in current Stage are complete → Proceed to §3.6 Stage Summary Creation before creating next Task's Task Assignment Prompt.

### 3.6 Stage Summary Creation

Execute when all Tasks in a Stage are completed.

Perform the following actions:
1. Review all Task Memory Logs for the completed Stage
2. Synthesize Stage-level observations:
   - Overall outcome and deliverables
   - Agents involved and their contributions
   - Notable findings, patterns, or compatibility concerns
   - Undocumented context or working insights
3. Append Stage Summary to Memory Root per §4.3 Stage Summary Format. Keep summary ≤30 lines and reference log files rather than duplicating content.

---

## 4. Structural Specifications

This section defines the formats and structures for Memory System artifacts.

### 4.1 Directory Structure

The Memory System organizes project history in a hierarchical directory structure under `.apm/Memory/`:

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
    │   └── Manager_Handoff_Log_<N>.md
    └── <AgentID>_Handoffs/                      # Worker Agent Handoffs
        └── <AgentID>_Handoff_Log_<N>.md
```

### 4.2 Memory Root Format

**Location:** `.apm/Memory/Memory_Root.md`

**Header Fields:**
- **Project Name:** Actual project name (replace `<Project Name>` placeholder)
- **Project Overview:** Concise project summary from Implementation Plan
- **Manager Handoffs:** Count of Manager Agent Handoffs (increment on each Handoff)

**Body:** Stage Summaries appended after each Stage completion. See §4.3 Stage Summary Format.

### 4.3 Stage Summary Format

Append this format to Memory Root after each Stage completion:
```markdown
## Stage <StageNum> – <Stage Name> Summary

**Outcome:** [Summarize Stage results]

**Notes:** [Undocumented context, working insights, important findings, compatibility issues]

**Agents Involved:** [List of Worker Agents who worked on this Stage]

**Task Memory Logs:**
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]
- [Task_Log_<StageNum>_<SequentialNum>_<Slug>.md] - [Status]

**Delegation Memory Logs:**
- [Delegation_Log_<StageNum>_<SequentialNum>_<Type>_<Slug>.md] - [Status] (if any)
```

**Constraints:**
- Keep summaries ≤30 lines
- Reference Task Memory Logs rather than duplicating content
- Include Notes only when there are observations not captured in individual logs or if requested by the User

### 4.4 Task Memory Log Structure

Task Memory Logs are written by Worker Agents. Manager Agents review them to evaluate Task Execution and Validation and make Coordination Decisions:
- **Location:** `.apm/Memory/Stage_<StageNum>_<Slug>/Task_Log_<StageNum>_<SequentialNum>_<Slug>.md`
- **Naming Convention:** Derive from Task ID and title, excluding Agent assignment. Example: `Task 2.1 - Deploy Updates | Backend Agent` → `Task_Log_02_01_Deploy_Updates.md`

**YAML Frontmatter Fields:**
- `agent`: Worker Agent identifier (e.g., `Frontend Agent`)
- `task_id`: Task reference from Implementation Plan (e.g., `Task 2.1`)
- `status`: `Success` | `Partial` | `Fail` | `Blocked`
- `failure_point`: `null` | `Execution` | `Validation` | `<description>`
- `Delegation`: `true` if Delegation occurred during Task
- `important_findings`: `true` if discoveries require Manager attention
- `compatibility_issues`: `true` if output conflicts with existing systems

**Markdown Body Sections:**
- `## Summary`: 1-2 sentence outcome description
- `## Details`: Work performed, decisions made, steps taken
- `## Output`: File paths, deliverables, artifacts created
- `## Validation`: Description of validation performed and result
- `## Issues`: Blockers or errors encountered, or "None"
- `## Compatibility Concerns`: (only if `compatibility_issues: true`) Description of issues
- `## Delegation`: (only if `Delegation: true`) Summary with Delegation Memory Log reference
- `## Important Findings`: (only if `important_findings: true`) Project-relevant discoveries
- `## User Notes`: (only if User specifically requested) User's working notes during Task Execution and Validation

---

## 5. Content Guidelines

### 5.1 Communication Tone

- **Managerial perspective:** Focus on coordination, progress, and decisions; leave implementation details to Worker Agents
- **Concise updates:** When reporting to User, summarize log findings briefly; User can read full logs if needed or ask for details otherwise
- **Delegation requests:** When requesting Delegation, use the specified format (§3.5 Action 3b) and clearly explain why delegation is needed versus self-investigation, including scope assessment rationale
- **Investigation outcomes:** When reporting investigation findings, clearly state the outcome (no issues, FollowUp needed, or artifact modification needed) and provide structured rationale; acknowledge false positives when Worker flags don't indicate real coordination issues

### 5.2 Common Mistakes to Avoid

- **Duplicating log content:** Stage Summaries should reference logs, not reproduce them
- **Ignoring flags:** The `important_findings` and `compatibility_issues` flags exist to force deeper review; skipping this breaks the coordination loop
- **False positives:** Worker Agents may raise flags incorrectly due to limited context; these do not always indicate real issues.
- **Fake Success Status:** If a Worker claims Success but log content doesn't support it, treat as investigation needed.
- **Skipping Handoff Detection:** When a Task Report indicates an Incoming Worker, failing to verify and track the Handoff leads to incorrect Context Dependency treatment
- **Premature self-investigation on large scope:** Extensive self-investigation on complex issues consumes Manager context; prefer Delegation for large-scope investigation
- **Forgetting Memory Root updates:** Stage Summaries must be appended after each Stage completion
- **Inconsistent naming:** Deviating from the naming conventions breaks cross-referencing between Implementation Plan and Memory

---

**End of Skill**
