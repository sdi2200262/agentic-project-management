---
name: research-delegation
description: Defines research delegation methodology and research-delegate subagent spawning. Use when knowledge is outdated or uncertain, official documentation needs verification, or a bounded technical question requires dedicated investigation.
---

# APM {VERSION} - Research Delegation Skill

## 1. Overview

**Reading Agent:** Worker Agent, Manager Agent, Planner Agent (Delegating Agents)

This skill defines how to delegate research work to a `research-delegate` subagent. It covers structuring the task input and spawning the delegate.

### 1.1 Typical Use Cases

- Current knowledge is outdated or uncertain for the task at hand
- Official documentation, API specs, or technical details need verification
- Knowledge gap cannot be resolved through User clarification
- Research scope is bounded and specific

### 1.2 Objectives

- Provide Delegate Agent with clear research questions and expected sources
- Enable autonomous investigation using web search and official documentation
- Produce current, actionable findings the Delegating Agent can apply

### 1.3 Delegation Scope

Research delegations are bounded investigations. The Delegate Agent should:
- Focus on the specific questions provided
- Use web search and fetch tools to access current official sources
- Verify information across multiple authoritative sources
- Deliver structured findings that directly answer the questions

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for Research Delegation. It guides how to construct effective delegation prompts and integrate findings.

### 2.1 Context Standards

A Research Delegation Prompt must provide enough context for the Delegate to research effectively:

**Research Purpose:** Why this information is needed and how it will be used. This helps the Delegate prioritize and frame findings appropriately.

**Current Knowledge State:** What the Delegating Agent currently knows or assumes versus what is uncertain. This prevents the Delegate from researching already-known information.

**Specific Questions:** Targeted questions that need answers. Vague requests produce vague results; specific questions enable focused research.

**Expected Sources:** Specific documentation sites, official repos, API docs, or authoritative resources to investigate. Directing the Delegate to the right sources improves efficiency and reliability.

**Integration Context:** How findings will be applied. This helps the Delegate provide appropriately detailed and actionable information.

### 2.2 Delegation Framing Standards

**Current Information Focus:** The goal is current, authoritative information-not theoretical knowledge or general guidance. Frame the delegation around accessing official sources.

**Tool Expectations:** Delegates must use web search and fetch tools to access current documentation. Training data may be outdated; official sources are required.

**Verification Standard:** Findings should be cross-referenced across multiple authoritative sources when possible. Single-source information should be noted as such.

**Actionability:** Findings should directly answer the research questions in a form the Delegating Agent can apply. Summaries of documentation are more useful than links alone.

### 2.3 Delegation Standards

Perform the following actions:
1. Gather the essential context per §2.1 Context Standards.
2. Spawn a `research-delegate` subagent per §3.2, structuring the task input per §3.1.
3. Await the delegate's findings.

### 2.4 Findings Integration Standards

When the delegate subagent returns findings:

**If Resolved:**
- Read the Delegation Memory Log for full findings
- Validate findings are current and from authoritative sources
- Apply information to Task context
- Continue execution

**If Unresolved:**
- Read the Delegation Memory Log for partial findings
- Assess whether to: refine questions and re-delegate, proceed with partial information (noting uncertainty), or escalate
- If re-delegating, incorporate previous findings and refine questions

---

## 3. Structural Specifications

### 3.1 Task Input Structure

The following structure defines what to include in the `prompt` parameter when spawning the delegate. Pass this content directly to the spawn tool - do not output it as a separate document.

```
Research Delegation: <Brief Research Topic>

Goal: Gather current, authoritative information to answer the research questions below. Findings should be actionable for Task continuation.

Research Purpose: <Why this information is needed and how it will be applied>

Current Knowledge: <What Delegating Agent knows/assumes vs what is uncertain or potentially outdated>

Research Questions:
1. <Specific question>
2. <Specific question>
3. <Continue as needed>

Expected Sources:
- <Official documentation site>
- <GitHub repository>
- <API documentation>
- <Other authoritative sources>

Integration Context: <How findings will be used in Task execution>

Execution Guidance:
- Use web search and fetch tools to access current official documentation
- Do not rely solely on training data-verify against current sources
- Cross-reference multiple sources when possible
- Provide actionable findings that directly answer the questions
```

### 3.2 Spawning

{DELEGATE_SPAWN_INSTRUCTION:research-delegate}

Pass the task input (structured per §3.1) as the prompt parameter. The delegate executes autonomously and returns findings directly.

---

## 4. Content Guidelines

### 4.1 Prompt Quality

- **Specific questions:** Targeted questions enable focused research; vague requests produce vague results
- **Authoritative sources:** Direct the Delegate to official documentation, repos, and API docs
- **Clear integration context:** Explain how findings will be applied

### 4.2 Common Mistakes to Avoid

- **Vague research requests:** "Research React" vs "What is the current React 18 Suspense API for data fetching?"
- **Relying on training data:** Always verify against current official sources
- **Single-source information:** Cross-reference when possible; note single-source findings
- **Broad scope:** Research should be bounded; note broad topics for Implementation Plan instead

---

**End of Skill**