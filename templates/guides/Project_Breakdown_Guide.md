# APM {VERSION} - Project Breakdown Guide
This guide defines how Setup Agents transform Context Synthesis findings into structured, agent-assigned task breakdowns. Following systematic high-level-to-detail methodology, it prevents template matching through strategic workflow sequencing and chat-to-file output switching. The guide ensures task breakdown precision required for Implementation Agent success while minimizing Manager Agent coordination overhead.

## 1. Context Integration & Breakdown Overview

### 1.1. Retained Context Synthesis Insights
Project decomposition transforms Context Synthesis findings into structured task breakdown using **retained insights** from discovery phase. These insights provide concrete decision anchors and must be actively integrated into task specifications:

**Technical & Scope Insights:**
- **Domain boundaries** → Create coherent agent assignments (see §2.1) 
- **Complexity flags** → Create appropriately granular tasks (see §4.1)
- **External dependencies** → Plan User guidance for actions outside IDE (see §4.1)
- **Investigation needs** → Add a minimal one-line Ad-Hoc Delegation step where needed in affected multi-step tasks (see §4.2, §4.3)
- **Workflow patterns** → Honor natural progression in dependencies (see §4.5)

**Process & Implementation Insights:**
- **Quality standards and validation requirements** → Convert to explicit task objectives, acceptance criteria, and validation steps
- **Implementation preferences and methodologies** → Specify as mandatory task execution approach and procedural requirements  
- **Process constraints and workflow requirements** → Embed as specific task steps, constraints, and coordination protocols
- **Coordination and tracking requirements** → Structure as explicit user interaction steps and review checkpoints
- **Tool preferences and technical constraints** → Detail in task guidance as mandatory technical specifications

**Integration Verification:** During each phase cycle, audit that emphasized user requirements appear as explicit task components, not background assumptions.

### 1.2. Project Breakdown Sequence
The Setup Agent is to follow this systematic high-level-to-detail progression with mandatory progression gates and integration verification:

1. **Domain Analysis** (§2) → Agent assignments **in chat**
2. **Phase Definition** (§3) → Phase sequence **in chat** 
3. **Phase Cycles** (§4) → Task breakdown **in chat** + documentation **in file** + **integration verification**
4. **Final Review** (§5) → Agent splitting + cross-agent dependency marking + **process requirement validation** **in file**
5. **Plan Approval** (§5.3) → User approval based on file + chat contents

**Progression Gates**: Each step must complete before proceeding to next step
**Integration Verification**: Each phase cycle must validate that Context Synthesis insights are explicitly integrated into task specifications

### 1.3. Chat-to-File Workflow Pattern
Strategic context switching prevents pattern matching:

**Chat Operations**: Domain identification, phase sequence, task breakdown per phase, final review decisions
**File Operations**: Document each completed phase cycle, agent splitting updates, cross-agent dependency additions
**Context Breaks**: File writes interrupt continuous chat writing, providing fresh perspective for each subsequent phases thus avoiding pattern-matching

Simple file format (basic indentation, minimal structure - see §4.6) prevents template formation while preserving content for later formatting through {GUIDE_PATH:Implementation_Plan_Guide.md}

## 2. Domain Analysis & Agent Assignment

### 2.1. Domain Identification from Retained Context
Transform retained domain boundaries from Context Synthesis into logical work domains requiring different mental models and skill sets for Implementation Agent assignment:

#### Skill Area Separation
- Different expertise areas retained → Separate agents requiring distinct knowledge bases
- Different technical environments noted → Domain-specific agents for each technology stack
- Investigation versus execution needs identified → Research-focused versus implementation-focused agent separation
- Process specialization requirements identified → Dedicated agents for quality assurance, validation, or coordination activities

#### Mental Model Boundaries
- User-facing versus system-facing work patterns → Client-side versus server-side domain separation
- Creative versus analytical work streams → Content-oriented versus data-oriented domain boundaries
- Configuration versus development activities → Setup-focused versus feature-focused agent domains
- Execution versus validation workflows → Implementation-focused versus review-focused domain boundaries

#### Domain Coherence Criteria
Evaluate potential domains against coherence requirements for Implementation Agent success:

**Single Mental Model Requirement:**
- All tasks within domain require similar thinking approach and problem-solving methodology
- Domain scope maintains consistent technical knowledge and skill set requirements
- Task progression within domain follows natural workflow patterns without context or mental-model switching
- Process requirements align with domain expertise and workflow patterns

**Natural Workflow Groupings:**
- Tasks within domain build upon each other logically with minimal external dependencies
- Domain boundaries align with retained workflow relationships from Context Synthesis
- Work progression within domain maintains context continuity for Implementation Agent execution
- Quality standards and validation requirements support coherent domain organization**

**Boundary Validation:**
- Domain separation reduces Manager coordination overhead and avoids Implementation Agent confusion
- Each domain delivers independent value while supporting overall project goals
- Process constraints and quality requirements are consistently applicable within domain boundaries

### 2.2. Initial Implementation Agent Team Creation
Transform identified domains into initial Implementation Agent assignments:

#### Assignment Process
Present complete agent team with domain rationale:
- Create one Implementation Agent per identified logical domain from §2.1 analysis
- Assign descriptive agent identifiers reflecting domain scope: `Agent_<Domain>`
- Consider process requirements when defining agent specialization and coordination needs
- Estimate likely cross-agent dependencies (see §5.2) and minimize through coherent domain boundaries
- Note that workload distribution review occurs later (see §5.1) and may require agent subdivision

#### First Chat Action
Upon reading the guide, immediately write **in chat** domain analysis and initial agent assignments before proceeding to phase definition (see §3). This establishes the implementation agent team foundation for subsequent task assignments.

## 3. Phase Sequence Definition  

### 3.1. Phase Identification from Retained Workflow Patterns
Transform retained workflow patterns from Context Synthesis into logical project progression structure:

#### Phase Structure Determination
Use retained scope and workflow patterns to determine appropriate phase organization:

**Complexity Pattern Analysis:**
- Layered complexity flagged → Hierarchical phases with progressive dependencies
- Sequential patterns retained → Linear phases following natural workflow progression  
- Concurrent work streams noted → Parallel phases organized by domain or component boundaries
- Process requirements identified → Dedicated validation, review, or quality assurance phases when workflow constraints require them

**Start-to-Finish Logic:**
- Identify project initiation requirements from retained context
- Define continuity workflow maintaining momentum between phases
- Establish completion criteria and final deliverable boundaries
- Ensure natural project progression without forced dependencies
- Integrate process constraints and quality checkpoints into phase progression

#### Phase Boundary Assessment
- Extensive research requirements identified → Dedicated research phases when investigation blocks subsequent work
- Testing and validation requirements identified → Separate validation phases or integrated checkpoints
- Retained bottlenecks and critical path items → Natural phase boundaries at project constraints
- Simple scope understanding → Linear task progression without phase organization
- Quality standards and review requirements → Additional phase boundaries or extended phase scope for validation activities

#### Phase Scope Criteria
Evaluate phase necessity and boundaries against project requirements:
- Each phase delivers independent value toward project completion
- Phase boundaries align with retained workflow relationships and natural checkpoints
- Phase organization reduces cross-agent coordination complexity
- Phase scope supports Implementation Agent context preservation within domains
- Process requirements and quality standards support coherent phase organization and validation workflows

### 3.2. Phase Progression Logic
Transform defined project sequence in §3.1 into phased project structure:

#### Presentation Process
Present the full phase sequence with supporting rationale:
- List phases in execution order, providing justification based on retained workflow patterns: `Phase X: <Phase_Name>`
- Note phase dependencies and deliverable handoff points between phases
- Confirm that phase organization aligns with Context Synthesis insights and project requirements
- Ensure phase boundaries support natural workflow progression and minimize cross-phase coordination complexity
- Validate that process requirements and quality standards are appropriately integrated into phase structure
- Proceed to phase cycle execution (see §4) following the established sequence

#### Second Chat Action
After presenting agent team assignments (see §2.2), immediately write **in chat** phase sequence analysis before beginning phase cycles (see §4). This establishes project structure foundation for systematic task breakdown.

### 3.3. Implementation Plan File Initialization
All phase content will be appended to the **existing empty** `.apm/Implementation_Plan.md` file created by the `apm init` CLI tool. Proceed to phase cycles (see §4). 

## 4. Phase Cycle Execution

### 4.1. Phase Context Integration & Task Identification
**Context Integration Statement**: Before task identification, explicitly state **in chat** relevant retained insights for current phase: "From Context Synthesis, I retained [specific requirements/constraints/preferences]. For this phase, these influence task creation by [specific considerations or 'provide general project context but no direct task-level requirements']."

**Task Identification with Anti-Packing Guardrails**:
While identifying tasks for this phase, apply these tests for each potential task:

- **Single Focus Test**: "Can this be completed by one agent in one focused work session without context/mental mode switching?"
- **Domain Boundary Test**: "Does this involve multiple unrelated technical domains or skill sets?"  
- **Independent Value Test**: "If I split this into components, would each component deliver independent value?"
- **Single Unit of Work Deliverable Test**: "Does completion of this task result in a deliverable that can be accomplished as a single unit of work?"
- **Complexity Consistency Test**: "Does this task's complexity match others in the phase, or is it significantly more complex?"

**If any test suggests splitting, create separate tasks during identification.**

**Task Identification Process**: Transform phase objectives into focused tasks using retained Context Synthesis insights. Apply anti-packing guardrails continuously during identification. Each task should deliver independent value toward phase completion. No tasks should be heavy-packed and contain multiple deliverables and goals.

**Present Task List**: After applying guardrails, present **in chat** complete task list for phase: "Task X.1: [Name], Task X.2: [Name]..." before proceeding to individual analysis.

**Ad-Hoc Delegation Precheck:** While listing tasks, quickly flag any task requiring ad-hoc delegation based on retained insights. Use an inline marker after the task name: "(ad-hoc: <purpose>)". Keep it to five words or fewer; no reasoning here.

### 4.2. Individual Task Complete Analysis
**CRITICAL**: Analyze each task from 4.1 individually with complete reasoning before proceeding to next task. Never batch process multiple tasks.**For each identified task, complete the following systematic analysis in chat:**

```
#### **Task [X.Y]: [Task Name]**

**Scope Analysis:** 
This task accomplishes [specific goal] and requires [detailed scope analysis]. The deliverables are [clearly defined outputs or artifacts].

**Execution Assessment:**
Analyze what this task requires:
- **Agent Capabilities**: Code writing, file operations, terminal commands, IDE configuration, testing, documentation, tool-call actions
- **User Coordination**: External platforms, account authentication, repository settings, deployment configuration, design approval, feedback checkpoints
- **Mixed Requirements**: Separate agent vs user components in logical order

*State your assessment:* "This task requires [specific agent actions vs user coordination]. Evidence for agent execution: [specific IDE capabilities]. Evidence for user coordination: [external dependencies, account access needs]."

**Classification Decision:**
Evaluate the workflow structure:
- **Single-step criteria**: Cohesive work completable in one exchange, no internal dependencies, no validation points needed
- **Multi-step criteria**: Internal sequential dependencies, user confirmation needs, ad-hoc delegation needs, progressive validation requirements, complex implementation with natural breakpoints
- **Edge cases**: External platform coordination = multi-step, research needs = multi-step with ad-hoc delegation, complex technical work with breakpoints = multi-step

*State your reasoning:* "Task [X.Y] involves [workflow description]. Based on [Context Synthesis insights, workflow factors, validation needs, technical dependencies], this requires [single/multi]-step execution because [specific reasoning]."

**Content Specification:**
Determine appropriate task content:
- **Natural variation**: Base count on actual complexity, not pattern matching
- **Single-step guidelines**: Up to 4 bullets based on instruction complexity
- **Multi-step guidelines**: Up to 6 steps based on workflow dependencies  
- **Quality focus**: Content should match individual task complexity

*Justify your choice:*
- **If Single-step**: "This needs [X] bullet points because [complexity analysis]. Each bullet addresses [implementation guidance needs]."
- **If Multi-step**: "This needs [X] steps because [workflow dependency analysis]. Each step represents [natural progression]."

**Content Definition:**
- If flagged in §4.1, first add an ad-hoc delegation step: "Ad-Hoc Delegation – <purpose>" (optional ref to {COMMAND_PATH:Research_Delegation_Guide.md} or {COMMAND_PATH:Debug_Delegation_Guide.md}), then continue
- [Present actual bullets or steps with applied reasoning]

**Task [X.Y] analysis complete** ← State this before proceeding to next task
```

**Repeat this complete analysis for every task identified in 4.1.**

### 4.3. Phase Dependency Assessment
**After completing individual analysis for all phase tasks**, conduct holistic dependency review:

**Dependency Identification**: Look for retained "must do A before B" patterns from Context Synthesis for current phase. Identify genuine producer-consumer relationships between tasks analyzed in §4.2.

**Dependency Analysis**: Define dependencies based on real workflow requirements and process constraints, not artificial ones. Include process dependencies such as quality gates, validation requirements, and review checkpoints.

**Dependency List Presentation**: Present **in chat** complete dependency list with rationale using simple notation: "Task X.Y depends on Task Z.W output because [explicit reasoning]"

### 4.4. Phase Documentation Procedure
**CRITICAL WORKFLOW SEQUENCE**: Complete ALL individual task analyses from §4.2 and dependency assessment from §4.3 before any file operations.

#### File Creation Process
1. **Complete Phase Analysis in Chat First**: Present all individual task analyses and dependencies **in chat** before proceeding to file documentation
2. **File Operation Timing**: Append to `Implementation_Plan.md` only after complete phase cycle is presented **in chat**
3. **Single write operation**: Each phase cycle results in **exactly one** file append containing only current phase content

#### Content Translation Format
Translate completed individual analyses from §4.2-4.3 into structured file format, ensuring all reasoning insights and process requirements are preserved in task descriptions:

**File Structure Requirements:**
- Phase header with name and all assigned agents: `Phase <n>: <Phase_Name> - <All_Agents_Assigned>`
- Task entries with agent assignments (and dependency notations if any): `Task <n.1>: <Task_Name> - Agent_<Domain>`
- Multi-step tasks use numbered list format (1, 2, 3...)
- Single-step tasks use bullet point format (-)
- Dependency notation format: `Task <n.2>: <Task_Name> - Agent_<Domain> - Depends on Task <n.1> output`
- Preserve all individual analysis insights, process requirements, and implementation specifications from chat breakdown
- Preserve content descriptions exactly as justified in individual analysis
- Ad-Hoc delegation steps: prefix with `Ad-Hoc Delegation – <Purpose>` as a single line (optional short guide ref); no extended content in file

## 5. Final Review & Cross-Agent Integration

### 5.1. Agent Workload Assessment & Sub-domain Splitting
Conduct first holistic review to assess agent workload distribution across entire plan. Overloaded Agents (8+ tasks) must be subdivided:

#### Agent Workload Assessment
- Count total tasks assigned to each agent across all completed phases
- Identify agents with 8+ task assignments requiring subdivision
- Review task distribution for logical coherence within agent domains and process requirements

#### Sub-domain Splitting Process
For overloaded agents requiring subdivision:
- Analyze tasks within agent domain for logical sub-domain boundaries
- Create coherent sub-agents based on natural task groupings and process specialization needs: Agent_<Domain>_<Subdomain>
- Redistribute tasks from overloaded agents to appropriate sub-agents based on logical boundaries and implementation requirements
- Maintain domain coherence principles from §2.1 and process alignment within sub-domain splits

#### Agent Reassignment File Update
Update `Implementation_Plan.md` with revised agent assignments:
- Modify all affected task entries with new sub-agent assignments
- Preserve exact task content, dependencies, instruction/step definitions, and process specifications during reassignment
- Ensure file reflects **final agent assignment** before proceeding to §5.2

### 5.2. Cross-Agent Dependency Marking
Conduct second holistic review to identify and mark cross-agent dependencies using **final agent assignments** from §5.1:

#### Cross-Agent Dependency Identification
- Review entire plan with final agent assignments to identify cross-agent dependencies
- Mark dependencies as cross-agent only if producer and consumer tasks are assigned to different agents
- Tasks with "Depends on Task X.Y" are cross-agent dependent if Task X.Y's agent ≠ current task's agent
- Include process dependencies such as quality validation, review checkpoints, or coordination requirements
- Present all cross-agent dependencies identified **in chat** before proceeding to editing the file 

#### Dependency Notation File Update
Update `Implementation_Plan.md` with enhanced dependency notations:
- Add "by Agent Y" notation exclusively to cross-agent dependencies
- Preserve simple "Depends on Task X.Y output" format for same-agent dependencies

### 5.3. Conceptual Plan Presentation & User Approval
Present plan overview and request User approval based on complete file and chat context:

#### Overview Summary Presentation
Present **in chat** high-level plan statistics:
- Number of agents and domains
- Total phases with names and task count
- Total task count, and total task count per task type
- Cross-agent dependency count
- Summary of process requirements and implementation specifications integrated

#### User Review & Approval Process
- Direct User to review complete structured plan in `Implementation_Plan.md`
- Reference detailed breakdown reasoning from previous chat exchanges (§2-§4)
- Confirm that Context Synthesis insights, including process requirements and quality standards, are reflected in task specifications
- Handle modification requests through targeted revisions to affected plan sections
- Iterate until explicit User approval to proceed to {GUIDE_PATH:Project_Breakdown_Review_Guide.md}

**End of Guide**