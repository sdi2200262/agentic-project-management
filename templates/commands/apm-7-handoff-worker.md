---
command_name: handoff-worker
description: Initiates and guides a Worker through the Handoff procedure to transfer execution context to an incoming Worker instance.
---

# APM {VERSION} - Worker Handoff Command

## 1. Overview

This command initiates the Handoff procedure for a Worker approaching context window limits. The outgoing Worker creates two artifacts:
- **Handoff Log:** Working context from the current session, stored in `.apm/memory/handoffs/<agent>/`.
- **Handoff prompt:** Written to the Handoff Bus, instructing the incoming Worker to reconstruct context.

The incoming Worker rebuilds working context from the Handoff Log and current Stage Task Logs - not from the Handoff Log alone.

The incoming Worker must indicate Handoff status in their first Task Report. This triggers the Manager's Handoff detection, which affects dependency context classification for future Task assignments.

---

## 2. Handoff Procedure

Execute when User initiates Handoff.

### 2.1 Handoff Log Creation

Perform the following actions:
1. Determine session numbers: your current session number and incoming Worker session number (yours + 1).
2. Create Handoff Log per §3 Handoff Log Structure, capturing **past actions** - what WAS done:
   - Tasks completed and Stage progress this session.
   - Working context, patterns, and approaches established during this session.
   - Technical notes not captured in Task Logs.
   - If mid-Task, include execution progress framed as past work (steps completed, approaches tried).

**Content focus:** Strictly past tense. What was done, what was tried, what was observed. No current state - current state belongs in the handoff prompt.

### 2.2 Handoff Prompt Creation

Perform the following actions:
1. Create handoff prompt per §4 Handoff Prompt Structure, capturing **current state** - what IS happening.
2. Apply Worker Handoff asymmetry:
   - *Mid-Task:* "Read the Task from `task.md`, I completed steps 1-4, resume from step 5." Reference the intact Task Bus. Include execution progress detail.
   - *Between-Tasks:* "No active Task, await `/apm-4-check-tasks`." State session context and readiness.
3. Include: session takeover statement, Handoff Log path, instructions to read current Stage Task Logs, reminder to indicate incoming Worker status in first Task Report (listing specific Task Log files loaded and noting that previous-Stage logs were not loaded), and continuation guidance.

**Content focus:** Actionable, present-tense, one-time. The incoming Worker processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

### 2.3 User Review and Finalization

Perform the following actions:
1. Write handoff prompt to Handoff Bus per `{SKILL_PATH:apm-communication}` §4.10 Handoff Bus Protocol.
2. Present both artifacts to User: Handoff Log (file path) and handoff prompt (bus path). Request review and direct User to start a new session using `/apm-3-initiate-worker <agent-id>` - the incoming Worker will auto-detect the handoff prompt.
3. If modifications requested, update accordingly. Session ends when User starts the new session.

---

## 3. Handoff Log Structure

Contains working context from this session that supports the incoming Worker's execution. Task Logs contain Task-specific details - this file provides session-level context.

**Location:** `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md`

**YAML Frontmatter Schema:**
```yaml
---
agent: <agent-slug>
outgoing_session: <N>
incoming_session: <N+1>
handoff: <N>
stage: <N>
---
```

**Field Descriptions:**
- `agent`: string, required. Worker identifier (kebab-case).
- `outgoing_session`: integer, required. Current session number.
- `incoming_session`: integer, required. Next session number.
- `handoff`: integer, required. Handoff sequence number.
- `stage`: integer, required. Current Stage number.

**Body:**
- *Title:* `# <Display Name> Handoff <N> (Session <N> → <N+1>)`. Each section uses `##` heading. The display name is the Title Case form of the agent identifier (e.g., `frontend-agent` → `Frontend Agent`).
- *Session Summary:* Tasks completed count, current Stage, Stage progress for this Worker.
- *Working Context:* Patterns, approaches, or context established during this session.
- *Working Notes:* Technical details, environment observations, or other context not captured in Task Logs.
- *Continuation Guidance:* Specific guidance for the incoming Worker about in-progress patterns or upcoming work.

---

## 4. Handoff Prompt Structure

The handoff prompt instructs the incoming Worker to reconstruct context. Written to `.apm/bus/<agent-slug>/handoff.md`.

The incoming Worker processes this prompt during auto-detection in the init command. The prompt is cleared after processing.

**Required content:**
- *Session takeover statement:* "You are taking over from [Display Name] Session [N] as [Display Name] Session [N+1]."
- *Rebuilding context:*
  1. Read Handoff Log - note working context, technical notes, continuation guidance.
  2. Read current Stage Task Logs (this Worker's logs only).
  3. Do not load previous-Stage logs - the Manager provides comprehensive context via Task Prompts for cross-Stage dependencies.
- *Current Session State:* Current Stage, Tasks completed this session, notes.
- *Incoming Worker indication:* Remind incoming Worker to include Handoff status in first Task Report - state session number and list specific Task Log files loaded. This triggers Manager Handoff detection.
- *Immediate Next Action:* Await next Task Prompt from User via `/apm-4-check-tasks`.
- *Closing instruction:* Confirm to User that Handoff Log and Stage context have been read, then state readiness for next Task Prompt.

---

**End of Command**
