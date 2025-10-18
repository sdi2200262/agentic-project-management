---
priority: 7
command_name: delegate-research
description: Provides the template for delegating a research task to an Ad-Hoc agent
---

# APM {VERSION} - Research Delegation Guide
This guide defines how Implementation Agents delegate research work to Ad-Hoc Research agents. Use this guide when encountering knowledge gaps about current documentation, APIs, SDKs, or technical specifications required for task completion.

---

## 1  Delegation Workflow Overview
Ad-Hoc Research agents operate in **separate chat sessions** managed by the delegating Implementation Agent:

### Branch Management
- **Independent Operation**: Ad-Hoc agents work in isolated branched sessions without access to main project context
- **User Coordination**: User opens new chat session, pastes delegation prompt, returns with findings
- **Context Preservation**: Delegation session remains open for potential re-delegation until formal closure

### Handoff Process
1. **Create Prompt**: Use template below with complete research context
2. **User Opens Session**: User initiates new Ad-Hoc Research chat and pastes prompt
3. **Researcher Works**: Ad-Hoc agent investigates sources and provides current information/findings collaborating with User
4. **User Returns**: User brings findings back to Implementation Agent for integration

---

## 2  Delegation Prompt Template
Present delegation prompt **in chat as a single markdown code block with YAML fronntmatter at the top** for User copy-paste to new Ad-Hoc Research session

```markdown
---
research_type: [documentation|api_spec|sdk_version|integration|compatibility|best_practices|other]
information_scope: [targeted|comprehensive|comparative]
knowledge_gap: [outdated|missing|conflicting]
delegation_attempt: [1|2|3|...]
---

# Research Delegation: [Brief Research Topic]

## Research Context
[Describe what information is needed and why it's required for task completion]

## Research Execution Approach
**Primary Goal**: Gather current, authoritative information that Implementation Agents need to proceed with task execution
**Information Delivery Required**: Provide researched documentation, best practices, or technical specifications for Implementation Agent use
**Current Information Focus**: Access official sources and recent documentation rather than providing theoretical guidance
**Knowledge Transfer**: Deliver structured findings that directly answer Implementation Agent questions to enable task continuation

## Research Execution Requirements
**Mandatory Tool Usage**: You must use web search and web fetch tools to access current official documentation and verify information. Do not rely solely on training data or prior knowledge.
**Current Information Standard**: All findings must be sourced from official documentation, GitHub repositories, or authoritative, credible sources accessed during this research session.
**Verification Protocol**: Cross-reference multiple current sources to ensure accuracy and currency of information.

## Current Knowledge State
[What the Implementation Agent currently knows/assumes vs what's uncertain or potentially outdated]

## Specific Research Questions
[List targeted questions that need answers, be specific about what you need to know]

## Expected Sources
[List specific documentation sites, official GitHub repos, API docs, or credible resources for the Ad-Hoc agent to investigate]

## Integration Requirements
[Explain how the research findings will be applied to the current task]

## Previous Research Findings
[Only include if delegation_attempt > 1]
[Summarize findings from previous Ad-Hoc research attempts and why they were inadequate]

## Delegation Execution Note
**Follow your initiation prompt workflow exactly**: Complete Step 1 (scope assessment/confirmation), Step 2 (execution + findings + confirmation request), and Step 3 (final markdown delivery) as separate responses.
```

### Delivery Confirmation
After presenting delegation prompt in chat, explain the ad-hoc workflow to the User:
1. Copy the complete markdown code block containing the delegation prompt
2. Open new Ad-Hoc agent chat session & initialize it with {COMMAND_PATH:Ad_Hoc_Agent_Initiation_Prompt.md}
3. Paste delegation prompt to start ad-hoc work
4. Return with findings for integration

---

## 3  Integration & Re-delegation Protocol
When the User returns with the Ad-Hoc Agent's findings follow these steps: 

### Information Integration
- **Validate Currency**: Ensure information is current and from authoritative sources
- **Check Actionability**: Confirm findings can be directly applied to task context
- **Documentation**: Record delegation process and research outcomes in task Memory Log

### Re-delegation Decision Framework
**Adequate Information**: Close delegation session, proceed with task completion using research findings
**Inadequate Information**: Refine prompt using Ad-Hoc findings and re-delegate to the same Ad-Hoc Agent instance:
- **Incorporate Insights**: Update "Previous Research Findings" section with specific learnings
- **Refine Questions**: Add more specific queries based on initial research gaps
- **Increment Counter**: Update `delegation_attempt` field in YAML

### Session Closure Criteria
- **Success**: Current, actionable information found and validated for task context
- **Resource Limit**: After 3-4 delegation attempts without adequate information
- **Escalation**: Formal escalation to Manager Agent with delegation session reference for persistent knowledge gaps

### Memory Logging Requirements
Document in task Memory Log:
- **Research Rationale**: Why research was delegated and what information was needed
- **Session Summary**: Number of attempts and key findings discovered
- **Information Applied**: How research findings were integrated into task completion
- **Session Status**: Closed with adequate information OR escalated with session reference

---

**End of Guide**