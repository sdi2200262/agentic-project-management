---
name: delegate-research
description: Research delegation methodology for investigating knowledge gaps. Defines how calling Agents create Research Delegation Prompts.
---

# APM {VERSION} - Research Delegation Skill

## 1. Overview

**Reading Agent:** Worker Agent, Manager Agent, Planner Agent (calling agents)

This skill defines how to delegate research work to a Delegate Agent. The calling Agent creates a Research Delegation Prompt following this methodology; the Delegate Agent receives and executes it.

### 1.1 When to Use Research Delegation

Delegate research when:
- Current knowledge is outdated or uncertain for the task at hand
- Official documentation, API specs, or technical details need verification
- Knowledge gap cannot be resolved through User clarification
- Research scope is bounded and specific

Do NOT delegate when:
- Information is readily available in existing project context
- User can directly provide the answer
- Research scope is too broad (note for Implementation Plan instead)
- The research IS the project deliverable

### 1.2 Objectives

- Provide Delegate Agent with clear research questions and expected sources
- Enable autonomous investigation using web search and official documentation
- Produce current, actionable findings the calling Agent can apply

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

**Current Knowledge State:** What the calling Agent currently knows or assumes versus what is uncertain. This prevents the Delegate from researching already-known information.

**Specific Questions:** Targeted questions that need answers. Vague requests produce vague results; specific questions enable focused research.

**Expected Sources:** Specific documentation sites, official repos, API docs, or authoritative resources to investigate. Directing the Delegate to the right sources improves efficiency and reliability.

**Integration Context:** How findings will be applied. This helps the Delegate provide appropriately detailed and actionable information.

### 2.2 Delegation Framing Standards

**Current Information Focus:** The goal is current, authoritative information-not theoretical knowledge or general guidance. Frame the delegation around accessing official sources.

**Tool Expectations:** Delegates must use web search and fetch tools to access current documentation. Training data may be outdated; official sources are required.

**Verification Standard:** Findings should be cross-referenced across multiple authoritative sources when possible. Single-source information should be noted as such.

**Actionability:** Findings should directly answer the research questions in a form the calling Agent can apply. Summaries of documentation are more useful than links alone.

### 2.3 Prompt Creation Standards

Perform the following actions:

1. Gather the essential context per §2.1 Context Standards.
2. Structure the prompt following §3.1 Research Delegation Prompt Format.
3. Output as a markdown code block with guidance for User to copy to a new Delegate Agent session.
4. Await the Delegation Report from User.

### 2.4 Findings Integration Standards

When User returns with the Delegation Report:

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

### 3.1 Research Delegation Prompt Format

```markdown
# Research Delegation: <Brief Research Topic>

## Goal
Gather current, authoritative information to answer the research questions below. Findings should be actionable for Task continuation.

## Research Purpose
<Why this information is needed and how it will be applied>

## Current Knowledge
<What calling Agent knows/assumes vs what is uncertain or potentially outdated>

## Research Questions
1. <Specific question>
2. <Specific question>
3. <Continue as needed>

## Expected Sources
- <Official documentation site>
- <GitHub repository>
- <API documentation>
- <Other authoritative sources>

## Integration Context
<How findings will be used in Task execution>

## Execution Guidance
- Use web search and fetch tools to access current official documentation
- Do not rely solely on training data-verify against current sources
- Cross-reference multiple sources when possible
- Provide actionable findings that directly answer the questions

## Logging
Upon completion, log findings to Memory per `{SKILL_PATH:memory-logging}` §3.2 Delegation Memory Log Procedure, then output a Delegation Report for User to return to the calling Agent.
```

### 3.2 Prompt Delivery

After creating the Delegation Prompt, output it as a markdown code block and guide the User:

"I've created a Research Delegation Prompt. Please copy this to a new Delegate Agent session (initialize with the delegate initiation command). After the Delegate completes their work and provides a Delegation Report, return here with that report so I can integrate the findings."

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