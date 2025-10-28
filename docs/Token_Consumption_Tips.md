# Token Consumption Tips - APM v0.5

APM is designed to be token-efficient through focused agent interactions and structured workflows, but multi-agent coordination does involve meta-prompting overhead. This guide provides strategies for optimizing cost while maintaining APM effectiveness across different subscription tiers and model access levels.

> **Note:** All percentages, numbers, and statistics related to token consumption in this document are approximate estimates.

## Table of Contents

- [Economic Models for APM Usage](#economic-models-for-apm-usage)
  - [Cost-Minimization Approach](#cost-minimization-approach-recommended-for-cost-conscious-users)
  - [Performance-First Approach](#performance-first-approach-recommended-for-quality-first-users)
  - [Hybrid Approach](#hybrid-approach-sweet-spot-for-complex-projects)
- [Model Recommendations by Agent Type](#model-recommendations-by-agent-type)
  - [Setup Agent (Highest Impact Investment)](#setup-agent-highest-impact-investment)
  - [Manager Agent (Coordination Efficiency)](#manager-agent-coordination-efficiency)
  - [Implementation Agents (Task-Specific Optimization)](#implementation-agents-task-specific-optimization)
  - [Ad-Hoc Agents (Delegation-Specific)](#ad-hoc-agents-delegation-specific)
- [Token Consumption Optimization](#token-consumption-optimization)
  - [Setup Phase (Highest Token Consumption)](#setup-phase-highest-token-consumption)
  - [Handover Procedures (Context Transfer Overhead)](#handover-procedures-context-transfer-overhead)
- [General Token Optimization Considerations](#general-token-optimization-considerations)
  - [Pre-Session Planning](#pre-session-planning)
  - [Session Management](#session-management)

---

## Economic Models for APM Usage

### Cost-Minimization Approach (Recommended for Cost-Conscious Users)

**Philosophy**: Use premium models only where they provide the highest impact, rely on cost-effective options for routine execution.

**Model Assignment Strategy**:
- **Setup Agent**: Premium model for critical planning phase
- **Manager Agent**: Mid-tier agentic model for coordination  
- **Implementation Agents**: Budget models for most tasks, upgrade selectively
- **Ad-Hoc Agents**: Match model tier to delegation complexity

**Expected Cost Profile**: Significant cost reduction compared to premium-only approach while maintaining acceptable output quality. Recommended for personal side-projects, vibe coding sessions, and semi-complicated production apps.

### Performance-First Approach (Recommended for Quality-First Users)

**Philosophy**: Use top-tier models throughout for maximum quality and consistency.

**Model Assignment Strategy**:
- **All Agents**: Claude Sonnet 4, Claude Sonnet 4.5, Gemini 2.5 Pro, or equivalent frontier models; avoid "thinking" models
- **Consistent Experience**: No model switching, premium reasoning throughout

**Expected Cost Profile**: Highest token costs, but delivers the best consistency and quality. Recommended for users or organizations where cost is not a primary concern, such as research labs or enterprise teams prioritizing output quality.

### Hybrid Approach (Sweet Spot for Complex Projects)

**Philosophy**: Strategic model deployment based on agent responsibilities and task complexity.

**Model Assignment Strategy**:
- **Setup Agent**: Premium model (most critical for project success)
- **Manager Agent**: Mid-tier agentic model with premium upgrade for complex coordination
- **Implementation Agents**: Budget for routine tasks, premium for complex/creative work
- **Ad-Hoc Agents**: Match model tier to delegation complexity

**Expected Cost Profile**: Adequate cost reduction with minimal quality impact. Recommended for users with experience in AI-driven development who can adapt model selection to match project complexity and requirements.

---

## Model Recommendations by Agent Type

### Setup Agent (Highest Impact Investment)

**Best Performing Models**:
- **Claude Sonnet 4** - Outstanding project breakdown and systematic reasoning
- **Gemini 2.5 Pro** - Excellent for complex project planning

**Cost-Effective Alternatives**:
- **Cursor Auto** - Surprisingly good for structured breakdown tasks; lacks reasoning capabilities

**Why Premium Models Matter Here**:
The Setup Agent creates your project foundation. Poor planning cascades through the entire session, causing more expensive fixes later. **Invest in quality here to save tokens downstream.**

**Model Switching Considerations**:
> **Warning**: Avoid model switching during Setup Agent sessions. Context gaps from token caching disruptions can compromise project breakdown quality. Stick with one model throughout the entire Setup Phase.

**Thinking Models Warning**:
> **Warning**: Avoid "thinking" models during project breakdown. "Thinking Mode" often disrupts the 'forced CoT' chat-to-file planning technique used there. They're great for Context Synthesis, but switching models mid-breakdown risks context loss.

**Best Model During Testing (August 2025):**
> **Claude Sonnet 4** was the clear top performer for Setup Agent, consistently delivering the best project breakdowns and systematic planning during testing.

---

### Manager Agent (Coordination Efficiency)

**Best Performing Models**:
- **Claude Sonnet 4** - Best reasoning for complex coordination decisions
- **Gemini 2.5 Pro** - Strong cross-agent dependency management

**Effective Budget Options**:
- **Cursor Auto** - Outstanding performance during testing despite low cost
- **Claude Sonnet 3.7** - Acceptable for straightforward projects

**Model Switching Considerations**:
> **Warning**: While model switching during Manager Agent sessions is not encouraged, real-world testing showed that context gaps and disruptions were generally manageable and did not break sessions. If a model switch is necessary (e.g., for a complex coordination task), proceed with caution and monitor for any context loss. For best results, stick with a single model throughout the Manager Agent session when possible.

**Best Models During Testing (August 2025):**
> **Claude Sonnet 4** was the best overall performer for Manager Agent coordination, providing the most reliable reasoning, decision making, and context management for complex project scenarios.
> **Cursor Auto** delivered outstanding Manager Agent performance during extensive real-world testing. Even after recent pricing updates, it remains the most cost-effective choice for project coordination, especially when leveraging the structured Task Assignment format.

---

### Implementation Agents (Task-Specific Optimization)

**Best Performing Models**:
Premium models such as **Claude Sonnet 4**, **Chat GPT-5** and **Gemini 2.5 Pro** deliver the highest performance for demanding implementation tasks. Consider using these models when your task involves:
- Complex algorithm design, where advanced reasoning and error detection are critical
- Creative or design-oriented work, such as UI/UX prototyping or generating novel solutions
- Architecture decisions that require deep analysis, tradeoff evaluation, or synthesizing multiple requirements

**Budget Models Excel Here**:
- **GPT-4.1 in Copilot** - Excellent for focused, granular tasks
- **Cursor Auto** - Strong general-purpose choice
- **Windsurf SWE-1** - Excellent coordination capabilities  
- **Grok Code Fast 1** - Excellent for focused, granular tasks
- **Qwen / Kimi K2** - Exceptional value for routine implementation
- **Grok Code Fast** - Great performance considering super low costs


For these scenarios, the superior reasoning, creativity, and context management of premium models can significantly improve outcomes and reduce the risk of costly mistakes. While budget models excel for routine implementation, investing in premium models for these high-impact tasks is often worthwhile.

**Step Combination Efficiency**:
Implementation Agents can combine adjacent steps in multi-step tasks when requested by Users or specified in Task Assignment Prompts. This reduces confirmation overhead and effectively token consumption. Particularly valuable for credit-billed subscriptions and workflow acceleration. Request combinations for related setup/configuration steps while preserving individual steps for complex implementations requiring validation or for steps requiring User guidance/feedback.

**Task Assignment Context Enhancement**:
For single-step tasks, enhance Task Assignment Prompts with additional context to reduce file-reading overhead. Either ask the Manager Agent to include more details in the prompt, or manually add information when pasting the prompt into the Implementation Agent's input. For example, if the prompt's context integration instructions require reading a file, attach it directly using your IDE's context tools. This allows the agent to skip the file read step and focus entirely on the main task, saving tokens.

**Iterative Improvement for Multi-Step Tasks**:
If a step in a multi-step task doesn't meet your expectations, ask the agent to revise and retry before proceeding to the next step. Using the natural checkpoints in multi-step tasks for feedback prevents costly rework later and ensures each step builds on a solid foundation.

**Request Explanations Strategically**:
At any stage of task execution, request agents to clarify their reasoning and outputs. This practice helps you catch potential issues early, especially for tasks outside your expertise. While it may add some tokens upfront, preventing misunderstandings saves significantly more tokens than fixing problems later. Use the natural checkpoints in multi-step tasks for these clarification requests.

**Model Switching Strategy**:
> **Implementation Agents handle model switching well.** In general, model switching **is not advised** due to potential context loss in agent sessions. However, during testing, frequent model switching based on task domain (Cursor Auto for routine tasks, Sonnet 4 for complex work) proved to be both cost-efficient and effective, and the tightly scoped task context makes this strategy viable with minimal context gaps observed. Proceed thoughtfully and monitor for any subtle context loss or unexpected behavior to avoid costly mistakes.

**Best Models During Testing (August 2025):**
> **Claude Sonnet 4** and **Gemini 2.5 Pro** tied as the top performers for complex or creative implementation tasks, each excelling in advanced reasoning and error detection.
> **Cursor Auto** and **Windsurf SWE-1** also provided very strong results for routine implementation work, and as of August 2025 their extremely low (essentially free at the time of testing) cost makes them highly attractive for most tasks.

---

### Ad-Hoc Agents (Delegation-Specific)

**Debug Delegation**:
- **Budget Models**: Simple bugs, environment issues
- **Premium Models**: Complex systemic issues, architecture problems

**Research Delegation**:
- **Budget Models**: Data gathering, documentation review
- **Premium Models**: Web research, data analysis, strategic recommendations

**Specialized Tasks**:
- Match model capability to delegation complexity
- Short ad-hoc sessions make premium model costs manageable

---

## Token Consumption Optimization

### Setup Phase (Highest Token Consumption)
The Setup Phase is where the majority of high token consumption occurs during an APM session, as the Setup Agent gathers context and plans the project. Each Setup Phase step has its own token usage patterns. Use the following targeted tips to optimize tokens at every stage without sacrificing quality.

**Context Synthesis**:
- Prepare materials beforehand (PRDs, requirements, existing code references)
- Use structured responses to guide the agent efficiently  
- Avoid excessive back-and-forth by being comprehensive in your responses

**Project Breakdown**:
- This is inherently token-heavy due to the systematic chat-to-file systematic sequence
- Consider this your largest token investment in the project
- **Don't cut corners here**:  An inadequate breakdown will lead to more costly fixes later
- **Review Saves Tokens**: Perform a thorough end-to-end Implementation Plan review. Request corrections/modifications to match your needs. Fixes at this stage are far cheaper than downstream changes after enhancement or during execution.

**Review Phase**:
- Use only for complex projects or first-time APM usage
- **Skip if budget-constrained** and you've thoroughly reviewed the Implementation Plan manually
- Carefully select specific sections rather than full systematic review

**Enhancement Phase**:
- No optimization opportunities; this is necessary formatting work

### Handover Procedures (Context Transfer Overhead)

**Why Handovers Are Expensive**:
Context 'repair' and validation during a handover requires the agent to process and reconcile multiple Memory Logs, the Handover File, and the Handover Prompt. This procedure is token-intensive because the agent must reconstruct context, verify consistency, and ensure no critical information is lost or misinterpreted. As a result, handovers can quickly become expensive operations in terms of token consumption, especially when the outgoing agent has completed a significant amount of work that must be transferred.

**Strategic Handover Timing**:

**Conservative Approach (Recommended for New Users)**:
- Handover at 70-80% context capacity
- Prioritize session continuity over token optimization
- 'Better safe than sorry' with context preservation

**Experienced User Optimization**:
- Push to 85-95% context capacity if you are able to properly time
- Monitor for performance degradation indicators:
  - Repetitive questions about known information
  - Generic responses lacking project specifics
  - Contradicting previous decisions

**Proactive Handover Planning**:
Strategic timing of handovers can significantly reduce token overhead and ensure smoother transitions:
- **Track Context Usage**: Proactively monitor context usage during the session, either by using your IDE's context window visualization feature if available, or relying on the recommended capacity thresholds above
- **Natural Break Points**: Plan handovers to occur at natural project breakpoints; ensure current task cycles are finished before initiating a handover to preserve context continuity
- **Time for Complexity**: If a complex or multi-step task is ahead, initiate the handover early so the new agent has enough context window to finish uninterrupted. Avoid disrupting critical operations, but don't wait until performance declines
- **Lower-Complexity Windows**: Initiate handovers during periods of lower task complexity for smoother transitions and reduced context reconstruction overhead

---

## General Token Optimization Considerations

### Pre-Session Planning

**Economic Model Selection**: Consider your desired session output when choosing a model strategy. If you want the absolute best possible results, using premium models for all agents will maximize output quality. However, if you are experienced with AI-assisted coding and are comfortable guiding the process, the Budget-Conscious or Hybrid approaches can deliver strong results while reducing costs. Choose premium models universally only if top-tier output is your highest priority and budget is less of a concern.

**Material Preparation**: Prepare Context Synthesis materials beforehand: PRDs, requirements documents, relevant codebase excerpts, and technical specifications. Having these ready reduces back-and-forth exchanges during the expensive Setup Phase and ensures that planning with the Setup Agent results in a high-quality Implementation Plan, saving token consumption downstream.

### Session Management

**Focus Maintenance**: Keep each agent focused only on their assigned work to avoid unnecessary context expansion. Cross-contamination between agent sessions wastes tokens, reduces effectiveness and could potentially result in session break.

**Context Preservation**: Use Memory Logs and Handover procedures as designed rather than trying to manually maintain context through extended sessions. The structured approach is more token-efficient than fighting context window limits.

**Memory Logging Optimization**: Memory Logs serve dual purposes: they provide the Manager Agent with context for task review and serve as critical resources during handovers. Enhance Memory Log effectiveness by instructing Implementation Agents to:
- **Include Manager-Relevant Context**: Add details that will help the Manager Agent during task review, reducing the need for clarification exchanges
- **Document Insights for Handovers**: Record important insights such as workflow preferences, special considerations, or learned patterns so future agents can easily reference them during handovers, reducing context reconstruction overhead

---

APM's structured approach enables excellent results even with budget models. The key is strategic model deployment and efficient session management. **Invest tokens where they have the highest impact, usually the Setup Agent and complex Implementation tasks.**