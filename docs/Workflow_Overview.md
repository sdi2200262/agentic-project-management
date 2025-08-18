# Workflow Overview - APM v0.4

APM operates through two workflow phases:
1. **Setup Phase**: Comprehensive project discovery and planning
2. **Task Loop Phase**: Coordinated task assignment & execution

Plus **Handover Procedures** as distinct events when agents approach memory limits.

---

## Setup Phase

The Setup Agent conducts comprehensive project initialization through systematic progression gates. Each step must complete before advancing to the next. **Use powerful frontier models with agentic capabilities for the Setup Agent, like Claude Sonnet 4.** 

```mermaid
graph LR
    A[User Initializes<br/>Setup Agent] --> B[Asset<br/>Verification]
    B --> C[Context<br/>Synthesis]
    C --> D[Project<br/>Breakdown]
    D --> E{User Chooses<br/>Review?}
    E -->|Yes| F[Systematic<br/>Review]
    E -->|No| G[Enhancement &<br/>Memory Init]
    F --> G
    G --> H[Bootstrap<br/>Creation]
    H --> I[Manager Agent<br/>Handoff]
    
    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Setup Agent Initialization

The Setup Phase begins when the user initiates the Setup Agent, which then starts a comprehensive 6-step sequence defined below.

### 1. Asset Verification & Workspace Setup
The Asset Verification step ensures that all necessary APM assets are available and the project workspace is properly structured before proceeding.

**User Actions:**
- Clone APM repository or access prompts manually
- Choose workspace directory and storage approach
- Initialize Setup Agent with initiation prompt

**Setup Agent Actions:**
- Verify APM asset availability
- Establish workflow strategy: GitHub repo vs other (describe if `other`)
- Create `<workspace_root>/apm/` directory structure

### 2. Context Synthesis & Project Discovery
After Asset Verification the Setup Agent proceeds to Context Synthesis for project discovery:

**User Actions:**
- Respond to structured discovery questionnaire across four phases
- Provide detailed project information, requirements, and constraints
- Validate Setup Agent's understanding or expand
- Select asset format: Markdown vs JSON (Testing Preview) and approve proceeding to breakdown

**Setup Agent Actions:**
- Conduct systematic discovery through four-phase methodology:
  - **Phase 1**: Existing materials, PRDs, project vision, and scope assessment
  - **Phase 2**: Targeted inquiry across technical requirements, dependencies, constraints
  - **Phase 3**: Process requirements, workflow preferences, quality standards  
  - **Phase 4**: User validation and asset format selection
- Uses mandatory follow-up cycles for each discovery phase until understanding is complete
- Retain insights for systematic breakdown phase

### 3. Project Breakdown & Implementation Plan Creation
After complete contextual understanding has been achieved in Context Synthesis the Setup Agent proceeds to Project Breakdown using a systematic chat-to-file procedure:

**User Actions:**
- Review domain analysis, agent assignments and phase cycles in chat
- Review final holistic review & refinement in chat
- Review structured Implementation Plan file as it develops through phase cycles
- Provide feedback for immediate modifications, tweaks, or gaps.
    - **Tip:** Spend ample time carefully reviewing and refining the Implementation Plan in collaboration with the Setup Agent. When working with AI, it's crucial to be thorough and proactive. Meticulously combing through the plan at this early stage helps prevent roadblocks and issues later. Always plan ahead and ensure the Implementation Plan fully matches your project needs before moving forward.
- Once the Implementation Plan meets the User's project requirements and preferences, the User may choose whether to proceed with systematic agent-driven review or skip to enhancement

**Setup Agent Actions:**
Execute systematic progression through mandatory gates:
  1. **Domain Analysis** (in chat): Identify work domains → Create initial Implementation Agent assignments
  2. **Phase Definition** (in chat): Define phase sequence → Establish project progression logic  
  3. **Phase Cycles** (in chat + file): 
     - Task identification with anti-packing guardrails (in chat)
     - Complete individual analysis for each task (in chat)
     - Initial task dependency assessment (in chat)
     - File appendix in simple format (in file)
  4. **Final Review** (in chat + file): Agent workload balancing + cross-agent dependency marking
  5. **Plan Approval**: Present complete file + chat reasoning for user review

**The Setup Agent employs a systematic chat-to-file procedure carefully designed to address core LLM limitations such as pattern matching, artificial dependencies, and hallucinations.** This approach ensures that the entire Implementation Plan's reasoning and decision-making process is transparently provided in a single, comprehensive response. By ‘forcing’ chain-of-thought (CoT) reasoning, this method unlocks deep reasoning capabilities in powerful ‘non-thinking’ models commonly available across most AI IDEs and subscription tiers.

**Important:** Some AI IDE system prompts or even certain "thinking" models may not follow this chat-to-file procedure as intended. For example, they might split the process into multiple responses, or their two-pane (thinking/response) architecture may disrupt the intended flow. If this occurs, please ensure the entire sequence is completed as described.

**This approach is intentionally crafted for robust, agentic non-thinking models, which are the default in most AI IDEs.** If you encounter issues with multi-step or fragmented outputs, prompt the agent to deliver the full systematic sequence in a single, unified response. 

> If you experience any issues during this process, be sure to thoroughly review the provided Implementation Plan before proceeding making sure it matches yours and APM's standards.

### 4. Implementation Plan Review (Optional)
If the User opts for a systematic review, the Setup Agent highlights plan sections needing extra attention. For the areas the User selects, the Setup Agent reviews for AI-specific planning issues—like task-packing, misclassified tasks, or other LLM-related errors, rather than rechecking the entire project context. Major context gaps may still be flagged if found. This agent-driven review is optional and is intended to optimize workflow clarity, smoothness, and AI-oriented planning practices, rather than to ensure the Implementation Plan fully and accurately reflects the project's actual requirements. **The User should always conduct their own comprehensive review of the Implementation Plan before relying on the Agent's review.**

**User Actions:**
- Select specific phases/tasks for detailed analysis if reviewing
- Review Setup Agent's analytical findings and approve plan modifications

**Setup Agent Actions:**
- Propose high-value review areas based on plan complexity analysis
- Apply analytical testing/review framework to user-selected areas only
- Challenge previous planning decisions through structured questioning
- Apply improvements identified through the review process

### 5. Enhancement & Memory System Initialization
In this exchange the Setup Agent transforms the Implementation Plan into a detailed APM artifact and initializes the Memory System accordingly.

**User Actions:**
- Review enhanced Implementation Plan with detailed task specifications
- Review selected memory system strategy selection and initialization
- Request for modifications on any of the artifacts if needed

**Setup Agent Actions:**
- Transform simple plan into detailed APM artifact with comprehensive task specifications
- Select memory system strategy based on project complexity:
  - **Simple**: ≤8 tasks, single-file Memory Bank
  - **Dynamic-MD**: >8 tasks or multiple phases, directory structure with phase folders
  - **Dynamic-JSON (Testing Preview)**: Designed for advanced testing/validation scenarios (higher token consumption)
- Initialize memory structure and create Memory Root based on selected strategy

### 6. Manager Bootstrap Creation
The final step of the Setup Agent workflow is to generate a comprehensive Bootstrap Prompt for initializing the first Manager Agent chat session.

**User Actions:**
- Review Bootstrap Prompt for completeness and accuracy
- Copy Bootstrap Prompt to the first (already initialized) Manager Agent chat session
- Close Setup Agent session upon successful Manager initialization

**Setup Agent Actions:**
- Generate comprehensive Bootstrap Prompt containing:
  - YAML frontmatter with asset locations and format specifications
  - User intent and requirements summary  
  - Implementation Plan overview and execution guidance
  - Memory system initialization instructions
  - Next action specifications for Manager Agent
- Complete context transfer preparation and end Setup Agent session

---

## Task Loop Phase

Manager and Implementation Agents coordinate through structured task assignment and review cycles until project completion. **While powerful models can enhance performance for these agent instances, APM v0.4 also works effectively with more economical alternatives such as Cursor's Auto model mixture or Copilot's GPT-4.1 base model, providing a viable cost-effective option.**

```mermaid
graph LR
    A[Manager Issues Task<br/>Assignment Prompt] --> B[User Delivers Task<br/>to Implementation Agent]
    B --> C[Implementation Agent<br/>Executes & Logs]
    C --> D[User Returns<br/>to Manager]
    D --> E[Manager Reviews<br/>Task output and Log]
    E --> F{Manager Decides<br/>on Next Actions}
    F -->|Continue| G[Next Task]
    F -->|Task execution<br/>needs corrections| H[Follow-up<br/>Prompt]
    F -->|Plan needs<br/>modifications| I[Modify<br/>Plan]
    G --> A
    H --> A
    I -->|Move to next task<br/>based on modified plan| G
    
    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Manager Agent Initialization
Upon initialization, the Manager Agent expects either the Bootstrap Prompt (if it is the first manager of the session) or a Handover Prompt (if it is a subsequent manager in the session). This ensures the Manager Agent receives all necessary context and resources to begin or resume managing the project.

**User Actions:**
- Provide either the Bootstrap Prompt or a Handover Prompt to the new Manager Agent session
- Confirm the Manager Agent's understanding of project scope and responsibilities; provide clarification if issues exist
- Authorize the Manager Agent to begin coordination duties and task execution following established protocols

**Manager Agent Actions:**
- Parse YAML frontmatter for asset locations and format specifications from the received prompt (Bootstrap or Handover)
- Read all required guides and ensure understanding of session responsibilities, procedures and protocols
- Confirm understanding of project context and requirements, and request user authorization before proceeding with coordination duties

### Task Assignment Prompt Creation
Task Assignment Prompts are carefully structured meta-prompts created by the Manager Agent that guide Implementation Agents in executing specific tasks according to the project plan.

**User Actions:**
- Deliver Task Assignment Prompts to appropriate Implementation Agent chat sessions
- Coordinate between Manager and Implementation Agents as communication bridge

**Manager Agent Actions:**
- Examine task contents in the Implementation Plan for dependency declarations and context requirements
- Determine dependency handling approach:
  - **Same-Agent Dependencies**: Simple contextual reference approach
  - **Cross-Agent Dependencies**: Comprehensive integration context approach
- Create structured Task Assignment Prompt containing:
  - YAML frontmatter with execution type and dependency flags
  - Task reference from Implementation Plan
  - Context from dependencies (adjusted approach)
  - Detailed instructions based on Implementation Plan specifications
  - Expected outputs and success criteria
  - Memory logging path and instructions

### Implementation Agent Task Execution
The Implementation Agent executes assigned tasks according to Task Assignment Prompts and project plan, following clear execution and logging protocols. Tasks contain dependency context integration instructions and can be single-step or multi-step depending on execution requirements:

**Dependency Integration**:
- **Cross-Agent**: Complete all integration steps + Step 1 of main task (or full task if single-step)
- **Same-Agent**: Minimal context reference, direct task execution

**Single-Step Tasks:**
- Complete all subtasks in one response
- Direct execution → immediate Memory Logging

**Multi-Step Tasks:**
- Execute Step 1 → user confirmation → Step 2 → confirmation → continue
- User iteration/feedback/guidance opportunities at each step
- **Step combination available**: Adjacent steps can be combined when requested by user or pre-specified in Task Assignment Prompt for efficiency
- Final step completion → Memory Logging

```mermaid
graph LR
    A[Task Assignment] --> B{Task Format?}
    
    B -->|Bullet List| C[Single-Step<br/>Execution]
    C --> D[Memory Logging]
    
    B -->|Numbered List| E[Multi-Step<br/>Execution]
    E --> F[User Confirmations]
    F --> D
    
    G[Dependencies] --> H{Type?}
    H -->|Same-Agent| I[Already Active Context]
    H -->|Cross-Agent| J[Cohesive Context Integration Steps]
    I --> A
    J --> A
    
    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Error Handling & Ad-Hoc Debugger Delegation

**Error Escalation Protocol**:
- **Minor Issues** (≤2 debugging exchanges): Debug locally
- **Major Issues** (>2 exchanges OR complex/systemic): **Mandatory Ad-Hoc Debugger delegation**

**Ad-Hoc Delegation Workflow**:

1. **Implementation Agent**: Stop debugging, create delegation prompt using appropriate Debug Delegation guide
2. **User**: Open new Ad-Hoc agent session, paste delegation prompt  
3. **Ad-Hoc Agent**: Execute 3-step workflow (Bug Assessment/ Reproduction → Execution → Delivery)
4. **User**: Return findings to Implementation Agent session
5. **Implementation Agent**: Integrate solution or escalate to Manager

```mermaid
graph LR
    A[Implementation Agent<br/>Major Issue] --> B{Issue Complexity?}
    B -->|Simple| C[Debug Locally]
    B -->|Complex| D[Delegate to<br/>Ad-Hoc Agent]
    
    D --> E[User Opens<br/>Ad-Hoc Session]
    E --> F[Ad-Hoc Agent<br/>Attempts to Fix Bug]
    F --> G[User Returns<br/>with Findings]
    G --> H[Implementation Agent<br/>Integrates Findings]
    H --> I{Resolved?}
    I -->|Yes| J[Continue Task]
    I -->|No| K[Escalate to Manager]
    
    C --> L[Continue Task]
    
    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### Memory Logging & Review
After every Task Assignment, a Memory Log must be created to capture all key information about task execution: outcome, issues, next steps etc following a standardized format. This ensures the Manager Agent has a complete, structured record of what occurred.

**User Actions:**
- If prompted, confirm task completion quality before authorizing Memory Logging
- Report completed tasks and Memory Log completion to Manager Agent session
- Facilitate communication between Implementation and Manager Agents

**Implementation Agent Actions:**
- Complete standardized Memory Log format with:
  - Status, outputs, issues, and next steps documentation
  - Detailed work summary and decision rationale
- Report completion status to user for Manager review coordination

**Manager Agent Actions:**
- Analyze Memory Logs for completion status, quality, and outputs
- Make next action decisions:
  - **Continue Forward**: Issue next Task Assignment Prompt
  - **Request Corrections**: Create follow-up prompt for same agent
    - **Assign Debugging**: Engage Ad-Hoc agents for complex issues
  - **Update Plan**: Modify Implementation Plan based on execution findings
- Create phase summaries when phases complete
- Maintain memory system organization per selected strategy

---

## Handover Procedures

Context transfer protocols when agents approach memory limits, maintaining project continuity across agent instances. **Handover procedures can be used with any model tier, as they primarily involve structured context transfer rather than complex reasoning. However, more capable models will provide better context synthesis and verification.**

```mermaid
graph LR
    A[Agent Context<br/>Limits Reached] --> B[Create Handover<br/>Artifacts]
    B --> C[User Reviews &<br/>Opens New Session]
    C --> D[New Agent Processes<br/>Handover Context]
    D --> E[User Verifies<br/>Understanding]
    E --> F{Context<br/>Accurate?}
    F -->|No| G[Provide<br/>Clarifications]
    G --> D
    F -->|Yes| H[Resume<br/>Operations]
    H --> I[Archive Previous<br/>Session]
    
    classDef default fill:#434343,stroke:#888888,stroke-width:2px,color:#ffffff
    linkStyle default stroke:#9A9A9A,stroke-width:2px
```

### When to Consider Handovers

**Proactive handover timing is critical for maintaining project quality.** Don't wait until an agent completely fails or starts hallucinating. By then, the context transfer may already be compromised.

**Context Window Awareness:**
- **Visual Indicators**: Most AI IDEs have some kind of context usage visualization; initiate handover at 80-90% capacity
- **General Rule of Thumb:**
    - **Implementation Agents**: Consider handover after 5-10 task cycles, depending on task complexity
    - **Manager Agents**: Consider handover after 10-15 task cycles for first Manager (context gathering burden), 15-20 for replacement Managers

**Performance Warning Signs:**
- Repetitive questions about information provided earlier
- Contradicting previous decisions or advice
- Generic responses lacking project-specific context
- Forgotten project details or requirements
- Misremembering task assignments or project structure

### Handover Eligibility Requirements

**Critical:** Handovers can only occur during specific workflow states. Requests during active work are denied with completion requirements.

**Implementation Agent Handover Eligibility:**
- Complete task execution cycle finished
- Task work completed OR blocked with clear identification  
- Ad-Hoc delegation completed and findings integrated (if any)
- Memory Log thoroughly completed following standard format
- User reporting of task status completed

**Manager Agent Handover Eligibility:**
- Complete task loop cycle finished
- Task Assignment issued AND Implementation Agent execution complete
- Memory Log received back from User with task results
- Memory Log reviewed and next action decision made

**Important:** Some AI IDE system prompts or models may not respect handover timing restrictions. If an agent agrees to handover during ineligible periods, complete the current critical step first, then manually verify eligibility before proceeding.

### Handover Artifact Creation

**The two-artifact handover system ensures comprehensive context transfer while maintaining structured initialization for replacement agents.**

**User Actions:**
- Review handover artifacts for completeness and accuracy
- Verify that the Handover File & Prompt captures current project state and working context before new session initialization
    - **Tip:** Take time to review the Handover File & Prompt content; if the current agent missed important context, the replacement agent will inherit those gaps.

**Current Agent Actions:**
- Create comprehensive two-artifact system when approaching context limits:
  - **Handover File** (`<Agent>_Handover_File_<X>.md`): Current project status, recent work completed, key decisions and rationale, known issues/blockers, user preferences and effective approaches, working insights not captured in Memory Logs
  - **Handover Prompt** (presented in chat as markdown code block): APM framework onboarding instructions for replacement agent, Handover File reading and context integration protocols, current session state and immediate next actions, user verification requirements before proceeding

**The Handover File serves as active memory context that formal Memory Logs don't capture:** user preferences, working insights, effective approaches, and project intuition developed during the session. By combining a context dump in the Handover File for non-workflow context retained in collaboration with the actual accurate context history from Memory Logs, we achieve a complete context transfer to the next agent instance.

### Handover Execution Process

**Context transfer requires careful verification to ensure replacement agents understand both the technical project state and the working relationship established with the user.**

**User Actions:**
- Validate current agent's handover artifacts for completeness and project accuracy
- Open new replacement agent session (same agent type, clear naming) & initialize
- Paste Handover Prompt as the very first message to new agent
- **Carefully verify** new agent's context understanding through examining their understanding summary and/or asking clarification questions before authorizing operations
    - **Important:** Be thorough in verification; replacement agents may confidently misunderstand context while appearing knowledgeable
- Archive/close previous agent session only after successful handover verification

**Current Agent Actions:**
- Prepare comprehensive handover artifacts following established guide protocols
- Ensure complete context transfer preparation, including working insights and user interaction patterns

**New Agent Actions:**
- Process Handover File thoroughly for complete context integration
- Demonstrate understanding of project state, recent progress, immediate priorities, and working relationship with user
- Ask specific clarification questions about any ambiguous context points
    - **Never** proceed with operations until receiving explicit user authorization

### Common Handover Issues

**Common Handover Issues:**
- **Overconfident Replacement**: New agents may claim understanding without thoroughly processing context; address during verification
- **Context Gaps**: If the outgoing agent missed important information, the replacement inherits those gaps; address during verification
- **Model Variations**: Different models may interpret handover context differently; be prepared to provide clarifications
- **Working Relationship**: Replacement agents need to rebuild understanding of your communication style and preferences

**Recovery Protocol:**
If handover verification reveals significant context gaps or misunderstandings:
1. Provide specific clarifications to address gaps
2. Reference relevant Memory Logs or project files for additional context
3. If gaps are extensive, consider returning to the previous agent session (if still available) for improved handover artifacts
4. In extreme cases, restart from a recent phase boundary with clear context establishment

---

**APM workflow ensures systematic project progression through structured agent coordination, comprehensive context management, and seamless continuity during context transfers.**