---
name: delegate-debug
description: Debug delegation methodology for isolating and resolving complex bugs. Defines how Delegating Agents create Debug Delegation Prompts.
---

# APM {VERSION} - Debug Delegation Skill

## 1. Overview

**Reading Agent:** Worker Agent, Manager Agent (Delegating Agents)

This skill defines how to delegate complex debugging work to a Delegate Agent. The Delegating Agent creates a Debug Delegation Prompt following this methodology; the Delegate Agent receives and executes it.

### 1.1 When to Use Debug Delegation

Delegate debugging when:
- Bug resists initial fix attempts (2-3 failed corrections)
- Issue appears systemic or spans multiple components
- Debugging would consume significant Delegating Agent context
- Isolated focus would benefit the investigation

Do NOT delegate when:
- Bug has obvious cause with clear fix
- Quick iteration would likely resolve it
- Issue is within normal Task execution scope

### 1.2 Objectives

- Provide Delegate Agent with complete context to reproduce and investigate the bug
- Enable autonomous debugging without requiring constant User coordination
- Produce actionable findings (working fix or clear diagnosis) for Delegating Agent integration

### 1.3 Delegation Scope

Debug delegations are bounded investigations. The Delegate Agent should:
- Focus on the specific bug described
- Actively use available tools (terminal, file system) to reproduce and debug
- Pursue resolution within reasonable effort
- Document findings whether resolved or not

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Debug Delegation. It guides how to construct effective delegation prompts and integrate findings.

### 2.1 Context Standards

A Debug Delegation Prompt must provide enough context for the Delegate to work autonomously:

**Bug Description:** What is happening versus what should happen. Include exact error messages, stack traces, or failure symptoms-not paraphrased descriptions.

**Reproduction Path:** Step-by-step instructions to trigger the bug. Include specific inputs, conditions, files, and commands. The Delegate should be able to reproduce without guessing.

**Environment Context:** Language, framework versions, OS, relevant dependencies, recent changes. Environmental factors often matter for debugging.

**Code Context:** Relevant file paths, code snippets, configuration. Point the Delegate to where the bug manifests and related components.

**Prior Attempts:** What the Delegating Agent already tried and what happened. This prevents the Delegate from repeating failed approaches and provides diagnostic clues.

### 2.2 Delegation Framing Standards

**Goal Clarity:** The primary goal is a working fix, not research about the problem. Frame the delegation around resolution.

**Tool Expectations:** Delegates have terminal and file system access. The prompt should encourage active debugging using available tools rather than defaulting to User collaboration.

**Autonomy Boundaries:** The Delegate works autonomously but may collaborate with User when reproduction requires environment access or information outside their reach.

**Outcome Expectations:** Either a working solution the Delegating Agent can apply, or documented findings explaining what was discovered and why resolution wasn't achieved.

### 2.3 Prompt Creation Standards

Perform the following actions:
1. Gather the essential context per §2.1 Context Standards.
2. Structure the prompt following §3.1 Debug Delegation Prompt Format.
3. Output as a markdown code block with guidance for User to copy to a new Delegate Agent session.
4. Await the Delegation Report from User.

### 2.4 Findings Integration Standards

When User returns with the Delegation Report:

**If Resolved:**
- Read the Delegation Memory Log for full context
- Apply the provided fix
- Verify resolution in Task context
- Continue Task execution

**If Unresolved:**
- Read the Delegation Memory Log for findings
- Assess whether to: re-attempt with refined context, try a different approach, or escalate
- If re-delegating, incorporate previous findings into an updated prompt

---

## 3. Structural Specifications

### 3.1 Debug Delegation Prompt Format

```markdown
# Debug Delegation: <Brief Bug Description>

## Goal
Resolve this bug to enable Task continuation. Provide a working fix or, if unresolvable, document findings for escalation.

## Bug Context
<What the code/system should do, where the bug occurs, what Task is blocked>

## Current Behavior
<Exact error messages, stack traces, failure symptoms-verbatim, not paraphrased>

## Expected Behavior
<What should happen for Task to continue>

## Reproduction Steps
1. <Step with specific commands, inputs, files>
2. <Continue with precise instructions>
3. <Include any setup or preconditions>

## Environment
<Language, framework versions, OS, dependencies, recent changes>

## Relevant Code/Files
<File paths, code snippets, configuration involved in the bug>

## Prior Debugging Attempts
<What Delegating Agent tried and outcomes-prevents repeating failed approaches>

## Execution Guidance
- Use terminal and file system access to reproduce and debug actively
- Collaborate with User when environment access or specific information is needed
- Focus on resolution; if unresolvable after reasonable effort, document findings clearly

## Logging
Upon completion, log findings to Memory per `{GUIDE_PATH:memory-logging}` §3.2 Delegation Memory Log Procedure, then output a Delegation Report for User to return to the Delegating Agent.
```

### 3.2 Prompt Delivery

After creating the Delegation Prompt, output it as a markdown code block and guide the User:

"I've created a Debug Delegation Prompt. Please copy this to a new Delegate Agent session (initialize with the delegate initiation command). After the Delegate completes their work and provides a Delegation Report, return here with that report so I can integrate the findings."

---

## 4. Content Guidelines

### 4.1 Prompt Quality

- **Complete reproduction context:** The Delegate should be able to reproduce without guessing
- **Exact error messages:** Include verbatim errors, not paraphrased descriptions
- **Prior attempts documented:** Prevent repeating failed approaches

### 4.2 Common Mistakes to Avoid

- **Vague bug descriptions:** "Something's broken" vs "POST /api/users returns 500 with error: TypeError at line 42"
- **Missing reproduction steps:** Assumptions about environment or state the Delegate cannot verify
- **Paraphrasing errors:** Stack traces and error messages should be copied exactly
- **Omitting prior attempts:** The Delegate may waste effort repeating failed fixes

---

**End of Skill**