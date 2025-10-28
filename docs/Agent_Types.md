# Agent Types - APM v0.5

APM employs four distinct agent types, each with clear responsibilities and carefully scoped context. These agents are **not** "personas" or role-playing characters; they are functional specializations that **leverage modern LLMs' built-in expert capabilities** through focused task assignments and targeted context management.

## Table of Contents

- [Agent Specialization Architecture](#agent-specialization-architecture)
- [Quick Agent Comparison](#quick-agent-comparison)
- [1. Setup Agent](#1-setup-agent)
- [2. Manager Agent](#2-manager-agent)
- [3. Implementation Agents](#3-implementation-agents)
- [4. Ad-Hoc Agents](#4-ad-hoc-agents)

## Agent Specialization Architecture

**APM achieves agent specialization by providing each agent with carefully scoped, task-relevant context**, rather than relying on artificial personas. Agents develop expertise organically from the information and responsibilities assigned to them, without relying on character-based role-play.

**APM's Approach:**
- **Context-Driven Specialization**: Agents develop domain expertise through exposure to focused, relevant context; not personalitty traits
- **Responsibility-Based Emergence**: Specialization emerges from the specific tasks and decisions each agent handles
- **Natural Adaptation**: Models naturally adapt their responses based on the scoped context they receive
- **Token-Efficient**: No wasted tokens on persona descriptions; every token serves the actual work needed

## Quick Agent Comparison

| Agent Type               | Primary Function                                                                                     | When Active            | Key Strengths                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| **Setup Agent**          | Initializes project assets, understands project goals & requirements and creates Implementation Plan | Project start only     | Comprehensive project discovery & planning   |
| **Manager Agent**        | Oversees coordination, makes project decisions, assigns tasks, reviews work                          | Entire project         | Maintains big-picture context                |
| **Implementation Agent** | Executes domain-specific tasks                                                                       | As assigned by Manager | Focused execution, detailed logging          |
| **Ad-Hoc Agent**         | Handles isolated, context-heavy tasks                                                                | Temporary              | Prevents core agent context overload         |

---

## 1. Setup Agent

**Primary Function**: Session asset initialization and comprehensive planning through structured project discovery and breakdown.

**Operational Context**: Fresh session initiation with user-provided project information. No prior project history.

### Core Responsibilities

1. **Context Synthesis**: Conduct systematic project discovery through guided, strategic questionnaire methodology
2. **Project Breakdown**: Transform project goals & requirements into structured Implementation Plan draft using systematic analysis
3. **Implementation Plan Review (Optional)**: Apply targeted systematic review on User-selected sections of the Implementation Plan draft for quality assurance and task optimization
4. **Implementation Plan Enhancement & Finalization**: Generate detailed APM Implementation Plan artifact.
5. **Manager Bootstrap**: Create initialization prompt for Manager Agent handoff

### Operational Workflow

**Sequential Process**: Setup Agent operates through mandatory progression gates; each phase must complete before advancing to the next. This prevents incomplete planning and ensures comprehensive project foundation.

**Context Transfer**: Upon completion, Setup Agent generates Manager Bootstrap Prompt containing all project context, User intent, Implementation Plan and Memory System initialization. Setup Agent session ends when Manager Agent assumes control.

### Key Characteristics
- **Temporary Instance**: Operates only during project initialization
- **Comprehensive Scope**: Full project understanding and planning authority
- **Systematic Methodology**: Reads structured guides during project discovery, planning, review and enhancement for consistent quality

---

## 2. Manager Agent

**Primary Function**: Project coordination and decision-making, task assignment and review, and workflow orchestration throughout the APM session.

**Operational Context**: Receives Bootstrap Prompt or Handover context. Maintains project oversight through Implementation Plan and Memory System management. Coordinates Implementation Agent instances through Task Assignment Prompts.

### Core Responsibilities

1. **Session Context Management**: Process Bootstrap or Handover prompts to establish operational awareness
2. **Implementation Plan Maintenance**: Review, validate, and update project structure as requirements evolve
3. **Task Assignment Creation**: Generate detailed Task Assignment Prompts with dependency context and execution specifications
4. **Work Review & Evaluation**: Assess Implementation Agent log entries and task outputs and determine next actions
5. **Cross-Agent Coordination**: Manage context dependencies between different Implementation Agent instances
6. **Handover Execution**: Transfer context to replacement Manager Agent instances when approaching context limits

### Operational Workflow

**Task Loop Management**: Manager Agent operates in Task Loop cycles. This continues until project completion or context handover requirements.
> Issues Task Assignment → Reviews Memory Log → Makes Next Action Decision

**Context Integration**: For cross-agent dependencies, Manager Agent provides comprehensive context integration instructions to Implementation Agents, ensuring seamless coordination between different agent instances.

### Key Characteristics
- **Central Coordinator**: Maintains project overview and decision-making authority
- **Memory System Maintenence**: Responsible phase initialization, Memory Log review and phase summary creation
- **Implementation Plan Maintenence**: Responsible for Implementation Plan updates/modifications based on execution findings, project progress or User requests
- **Context Continuity**: Ensures project context coherence across Implementation Agent instances

---

## 3. Implementation Agents

**Primary Function**: Focused task execution with detailed logging and distinct domain work.

**Operational Context**: Receives Task Assignment Prompts from Manager Agent with specific execution and context integration instructions.

### Core Responsibilities

1. **Task Execution**: Execute assigned work following single-step or multi-step patterns as specified
2. **Dependency Integration**: Process cross-agent or same-agent dependency context before main task execution  
3. **User Collaboration**: Coordinate with user for external actions, clarifications and approval/feedback processes
4. **Ad-Hoc Delegation**: Delegate complex debugging, research, or analysis work to specialized Ad-Hoc agents when required or specified
5. **Memory Logging**: Document all work, decisions, and execution outcomes in designated Memory Log using standardized format
6. **Handover Execution**: Transfer context to replacement Implementation Agent instances when approaching context limits

### Execution Patterns

**Single-Step Tasks:**
- Complete all subtasks in one response
- Focused executions, bug fixes, simple integrations
- Direct execution followed by immediate Memory Logging

**Multi-Step Tasks:**  
- Execute work across multiple responses with user confirmation points
- Complex executions, research phases, integration work
- Step-by-step progression with user iteration opportunities
- Steps can be combined via User request/specification

**Dependency Context Integration**:
- **Same-Agent Dependencies**: Simple contextual references to previous work
- **Cross-Agent Dependencies**: Comprehensive integration steps with file reading requirements

### Error Handling Protocol

**Minor Issues** (≤2 debugging exchanges): Debug locally
**Major Issues** (>2 exchanges OR complex/systemic problems): **Mandatory delegation to Ad-Hoc Debug agents**

**Delegation Requirements**: Stop debugging immediately, create delegation prompt, wait for findings, then integrate results or escalate to Manager Agent.

### Key Characteristics

- **Domain-Focused**: Each agent instance handles related tasks in specific domain (Frontend, Backend, Research, Design etc.)
- **Context-Preserving**: Memory Logs maintain context continuity for future task assignments and handovers
- **Iterative Collaboration**: User and Implementation Agents can iterate on tasks for modifications, clarifications, and feedback before finalizing.
- **User-Interactive**: Guides and cooperates with the User for any required actions outside the IDE, such as setting up accounts, configuring services, or managing credentials.
- **Technical Guidance**: Provide detailed technical explanations of approach and implementation when requested by the User

---

## 4. Ad-Hoc Agents  

**Primary Function**: Temporary agent instances for isolated, context-intensive work outside main workflow.

**Operational Context**: Minimal scoped context in separate chat sessions working on distinct workflow branches. Assigned by Implementation Agents for focused delegation work.

### Core Responsibilities

1. **Temporary Specialization**: Handle focused delegation work within assigned scope boundaries
2. **Workflow Integration**: Maintain APM session integrity for seamless findings integration back to the Implementation Agent's context
3. **Scope Respect**: Work only within delegation boundaries without expanding into project coordination

### Operational Workflow

**3-Step Process**:
1. **Assessment**: Scope assessment and confirmation with clarification questions if needed
2. **Execution**: Complete delegation work + present findings + request confirmation (all in one response)
3. **Delivery**: Provide final results in markdown code block format for copy-paste integration back to the Implementation Agent's chat session

### Key Characteristics

- **Isolated Context**: Work in separate chat sessions/workflow branches to prevent main agent context overload
- **Focused Scope**: Avoid scope creep beyond assigned delegation boundaries
- **Temporary Duration**: Session ends when delegation is complete or escalated

---

**See [`Token_Consumption_Tips.md`](Token_Consumption_Tips.md) for best models to use with each agent instance and [`Modifying_APM.md`](Modifying_APM.md) for ways to enhance agent capabilities with custom tools and prompts.**