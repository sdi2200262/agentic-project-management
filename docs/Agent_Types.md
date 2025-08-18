# Agent Types - APM v0.4

APM employs four distinct agent types, each with clear responsibilities and carefully scoped context. These agents are **not** "personas" or role-playing characters; they are functional specializations that **leverage modern LLMs' built-in expert capabilities** through focused task assignments and targeted context management.

## Agent Specialization Architecture

Modern LLMs like GPT, Claude, and others utilize **Mixture of Experts (MoE) architecture** with specialized sub-models that automatically route to different capabilities. APM's agent design leverages this existing infrastructure instead of wasting tokens on persona descriptions.

**APM's Approach:**
- **Responsibility-Driven**: Each agent is defined by specific functions, not personality traits
- **Context-Scoped**: Agents receive only information relevant to their work domain  
- **Task-Focused**: Natural LLM specialization activates through targeted task assignment
- **Token-Efficient**: No persona token overhead; just direct, technical instruction

## Quick Agent Comparison

| Agent Type               | Primary Function                                                                                     | When Active            | Key Strengths                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| **Setup Agent**          | Initializes project assets, understands project goals & requirements and creates Implementation Plan | Project start only     | Comprehensive project discovery & planning   |
| **Manager Agent**        | Oversees coordination, makes project decisions, assigns tasks, reviews work                          | Entire project         | Maintains big-picture context                |
| **Implementation Agent** | Executes domain-specific tasks                                                                       | As assigned by Manager | Focused execution, detailed logging          |
| **Ad-Hoc Agent**         | Handles isolated, context-heavy tasks                                                                | Temporary              | Prevents core agent context overload         |

---

## 1. Setup Agent

**Primary Function**: Session asset initialization and comprehensive planning through structured discovery and breakdown.

**Operational Context**: Fresh session initiation with user-provided project requirements. No prior project history.

### Core Responsibilities

1. **Asset Verification**: Establish project storage strategy and workspace organization
2. **Context Synthesis**: Conduct systematic project discovery through guided, strategic questionnaire methodology
3. **Project Breakdown**: Transform project goals & requirements into structured Implementation Plan draft using systematic analysis
4. **Implementation Plan Review (Optional)**: Apply targeted systematic review on User-selected sections of the Implementation Plan draft for quality assurance and task optimization
5. **Enhancement & Memory Root Creation**: Generate detailed APM Implementation Plan artifact and initialize Memory System
6. **Manager Bootstrap**: Create initialization prompt for Manager Agent handoff

### Workflow Pattern

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
4. **Work Review & Evaluation**: Assess Implementation Agent outputs and determine next actions
5. **Cross-Agent Coordination**: Manage dependencies between different Implementation Agent domains
6. **Handover Execution**: Transfer context to replacement Manager instances when approaching context limits

### Workflow Pattern

**Task Loop Management**: Manager Agent operates in Task Loop cycles; Issues Task Assignment → Reviews Memory Log → Makes Next Action Decision. This continues until project completion or context handover requirements.

**Context Integration**: For cross-agent dependencies, Manager Agent provides comprehensive context integration instructions to Implementation Agents, ensuring seamless coordination between different agent instances.

### Key Characteristics
- **Central Coordinator**: Maintains project overview and decision-making authority
- **Memory System Maintenence**: Responsible phase initialization, Memory Log review and phase summary creation
- **Implementation Plan Maintenence**: Responsible for Implementation Plan updates/modifications based on execution findings, project progress or User requests
- **Context Continuity**: Ensures project context coherence across Implementation Agent instances

---

## 3. Implementation Agents

**Primary Function**: Focused task execution with detailed logging and distinct domain work.

**Operational Context**: Receives Task Assignment Prompts from Manager Agent with specific execution instructions and dependency context and context.

### Core Responsibilities

1. **Task Execution**: Execute assigned work following single-step or multi-step patterns as specified
2. **Dependency Integration**: Process cross-agent or same-agent dependency context before main task execution  
3. **User Collaboration**: Coordinate with user for external actions, clarifications and approval/feedback processes
4. **Ad-Hoc Delegation**: Delegate complex debugging, research, or analysis work to specialized Ad-Hoc agents when required or specified
5. **Memory Logging**: Document all work, decisions, and execution outcomes in designated Memory Log using standardized format

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
- **User-Interactive**: Guides and coordinates with the User for any required actions outside the IDE, such as setting up accounts, configuring services, or managing credentials.

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

- **Isolated Context**: Work in separate sessions/ workflow branches to prevent main agent context overload
- **Focused Scope**: Prevent scope creep beyond assigned delegation boundaries
- **Temporary Duration**: Session ends when delegation is complete or escalated

---

**See `Token-Consumption-Tips.md` for best models to use with each agent instance and `Modifying-APM.md` for ways to enhance agent capabilities with custom tools and prompts.**

# Agent Types – APM v0.4

APM employs four distinct agent types, each with clear responsibilities and carefully scoped context. These agents are **not** "personas" or role-playing characters; they are functional specializations that **leverage modern LLMs' built-in expert capabilities** through focused task assignments and targeted context management.

---

## Quick Agent Comparison

| Agent Type               | Primary Function                                           | When Active            | Key Strengths                        |
| ------------------------ | ---------------------------------------------------------- | ---------------------- | ------------------------------------ |
| **Setup Agent**          | Initializes project assets and creates Implementation Plan | Project start only     | Comprehensive discovery & planning   |
| **Manager Agent**        | Oversees coordination, assigns tasks, reviews work         | Entire project         | Maintains big-picture context        |
| **Implementation Agent** | Executes domain-specific tasks                             | As assigned by Manager | Focused execution, detailed logging  |
| **Ad-Hoc Agent**         | Handles isolated, context-heavy tasks                      | Temporary              | Prevents core agent context overload |

---

## Agent Specialization Architecture

Modern LLMs like GPT and Claude use **Mixture of Experts (MoE)** architecture — specialized sub-models automatically routed to different capabilities. APM’s agent design builds on this, **using role clarity and scoped context instead of token-costly personas**.

**APM’s Approach**

- **Responsibility-Driven** – Agents are defined by specific functions, not personality traits.
- **Context-Scoped** – Each agent receives only the information relevant to its work domain.
- **Task-Focused** – Specialization emerges through targeted task assignment.
- **Token-Efficient** – Avoids persona overhead by using direct, technical instructions.

---

## 1. Setup Agent

**Primary Function** – Project session initialization and comprehensive planning through structured discovery and breakdown.

**Operational Context** – Starts in a fresh session with user-provided requirements and no prior project history.

**Core Responsibilities**

1. Verify project storage strategy and workspace organization.
2. Conduct systematic project discovery using guided questionnaires.
3. Break down project goals into a structured **Implementation Plan** draft.
4. Optionally review selected sections for quality and optimization.
5. Finalize the Implementation Plan and initialize the **Memory System**.
6. Generate the **Manager Bootstrap Prompt** for handoff.

**Workflow Pattern**

- Proceeds through required steps in sequence to ensure complete planning.
- At completion, transfers all context to the Manager Agent and ends its session.

**Key Characteristics**

- Temporary instance, active only during setup.
- Full planning authority with a structured methodology.

---

## 2. Manager Agent

**Primary Function** – Project coordination, decision-making, task assignment, and review.

**Operational Context** – Receives context from the **Bootstrap Prompt** or **Handover Procedure** and maintains oversight through the **Implementation Plan** and **Memory System**.

**Core Responsibilities**

1. Process startup or handover prompts to establish operational awareness.
2. Maintain and update the Implementation Plan as requirements evolve.
3. Create detailed **Task Assignment Prompts** with execution specs.
4. Review Implementation Agent outputs and determine next actions.
5. Manage dependencies between agent domains.
6. Execute handovers to new Manager instances when needed.

**Workflow Pattern**

- Operates in a continuous **Task Loop**: assign → review → decide next step.
- Provides integration instructions for cross-agent dependencies.

**Key Characteristics**

- Central coordinator with decision authority.
- Maintains both Memory System and Implementation Plan.
- Ensures context continuity across agents.

---

## 3. Implementation Agents

**Primary Function** – Execute assigned tasks with detailed logging and domain focus.

**Operational Context** – Receive **Task Assignment Prompts** from the Manager Agent with relevant dependency context.

**Core Responsibilities**

1. Perform assigned work in single-step or multi-step execution patterns.
2. Integrate dependency context before execution.
3. Collaborate with the user for clarifications and approvals.
4. Delegate complex debugging, research, or analysis to **Ad-Hoc Agents**.
5. Document all outputs in the **Memory Log**.

**Execution Patterns**

- **Single-Step** – Complete all subtasks in one response, then log.
- **Multi-Step** – Progress in phases with user confirmation points.
- **Dependencies** – Integrate same-agent (simple) or cross-agent (comprehensive) context.

**Error Handling**

- Minor issues (≤2 exchanges): debug locally.
- Major issues (>2 exchanges or systemic problems): delegate to Ad-Hoc Debug Agents.

**Key Characteristics**

- Domain-specific work (e.g., frontend, backend, research, design).
- Preserves context via Memory Logs.
- Works iteratively with the user.

---

## 4. Ad-Hoc Agents

**Primary Function** – Temporary agents for isolated, context-intensive tasks outside the main workflow.

**Operational Context** – Minimal scoped context in separate sessions, typically assigned by Implementation Agents.

**Core Responsibilities**

1. Handle focused delegation work within defined boundaries.
2. Return findings for seamless integration into the main session.
3. Avoid expanding into project coordination.

**Operational Workflow**

1. Assess and confirm scope.
2. Execute task, present findings, and request confirmation in one response.
3. Deliver results in markdown format for easy integration.

**Key Characteristics**

- Isolated context to avoid main-agent overload.
- Strict scope control.
- Ends session when delegation is complete.

---

**See:**

- [`Token-Consumption-Tips.md`](../Token-Consumption-Tips.md) – Best model selection for each agent type.
- [`Modifying-APM.md`](../Modifying-APM.md) – Enhancing agent capabilities with custom tools and prompts.