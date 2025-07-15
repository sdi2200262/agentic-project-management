# APM v0.4 - Implementation Plan Guide
This guide explains how APM sessions break complex projects into granular tasks and share workload between multiple Agents. It defines two Implementation Plan variants: 
- Markdown
- JSON
Planning duties are split between the *Setup Agent* and the *Manager Agent*.

---

## 1. Implementation Plan Variant Overview
Below follows a summary of the two Implementation Plan variants, their formats and structural characteristics:

- Markdown
    - Format: `Implementation_Plan.md` at workspace root
    - Structure: Phases as level 2 headings, tasks as level 3 headings with meta-fields
    - Default format; human-readable with predictable structure for automated parsing

- JSON
    - Format: `Implementation_Plan.json` at workspace root
    - Structure: Hierarchical JSON with phases array and nested tasks objects
    - Opt-in format for stricter structure validation; follows same logical hierarchy as Markdown

The Implementation Plan serves as the *single source of truth* for project scope, task organization, and agent assignments. Created by Setup Agent after context synthesis, maintained by Manager Agent throughout the session.

----

## 2. Project Decomposition Principles
Transform Context Synthesis outputs into structured Implementation Plans:

### 2.1. Phase Organization
Use retained scope and workflow patterns to determine phase structure, rather than forcing complex structure:

#### Phase Structure Selection
- **Layered complexity flagged** → Hierarchical phases with dependencies (core → advanced → integration)
- **Sequential patterns retained** → Linear phases (foundation → features → deployment)
- **Concurrent work streams noted** → Parallel phases by domain/component

#### Phase Boundary Guidelines
- **Extensive research requirements identified** → Dedicated research phase if research is substanstial and blocks later phases
- **Testing/validation requirements identified** → Separate testing phases or validation checkpoints
- **Retained bottlenecks/critical path items** → Natural phase boundaries
- **Simple scope understanding** → May not need phases at all

### 2.2. Task Scope & Breakdown
Apply retained insights from Context Synthesis to determine task boundaries:

#### Scope Determination
- **Retained complexity flags** → Focus tasks narrowly, avoid overloading
- **Retained sequential patterns** → Break into logical progression steps
- **Retained domain boundaries** → Separate by skill/technical requirements
- **Retained investigation needs** → Include dedicated research tasks preceding implementation tasks or assign Research Ad-Hoc Agent

#### Breakdown Principles
- Each task should have **one clear, achievable objective**
- **Challenging areas flagged in context** → Create focused, well-scoped tasks
- **Sequential workflows retained** → Honor natural progression order
- **Independent work noted** → Allow parallel execution across agents

### 2.3. Task Dependencies
Use retained workflow relationships to determine task sequencing:

#### Dependency Decision Logic
- **Retained "must do A before B" patterns** → Create sequential task dependencies
- **Retained coordination needs** → Establish producer-consumer relationships  
- **Retained independent work streams** → Allow parallel execution
- **Same-agent optimization** → Prefer assigning dependent tasks to same agent when possible

See section §3.5 for dependency declaration formatting requirements.

### 2.4. Agent Assignment Logic
Use retained domain boundaries to determine agent distribution:

#### Domain Separation Guidelines
- **Different skill areas retained** → Separate agents (research vs writing vs analysis vs technical)
- **Different technical stacks/tools noted** → Domain-specific agents for each environment
- **Concurrent work streams identified** → Enable parallel execution with multiple agents

#### Assignment Patterns
- **Document projects:** Agent_Research, Agent_Writing, Agent_Review
- **Web applications:** Agent_Backend, Agent_Frontend, Agent_DevOps  
- **Analysis projects:** Agent_DataGathering, Agent_Analysis, Agent_Visualization
- **Complex systems:** Agent_Architecture, Agent_CoreFeatures, Agent_Integration

#### Assignment Optimization
- **Cross-domain coordination flagged** → Minimize handoffs through strategic agent boundaries
- **Context transfer efficiency** → Reduce overhead by grouping related work

See section §3.5 for dependency optimization principles.

#### Special Considerations
- **Investigation needs retained** → Plan for Ad-Hoc agent delegation in complex tasks
- **Simple scope understanding** → Single agent may suffice for focused projects  
- **Hybrid requirements** → Combine domain and workflow-stage agents when appropriate

Align agent assignments with retained domain patterns rather than arbitrary task distribution.

---

## 3. Implementation Plan Structure Specifications

### 3.1. Document Header (Lines 1‑15)
```markdown
# <Project Name> – Implementation Plan 

**Memory Strategy:** simple | dynamic-md | dynamic-json  
**Last Modification:** [Summary of last modification by Manager Agent here]
**Project Overview:** [High-level project overview here]
```
Keep this header < 15 lines so diff tools can catch version bumps cheaply.

### 3.2. Phase Sections
- Use level 2 headings (`##`) for phases: `## Phase <n>: <Name>`.
- Each phase groups related tasks (e.g., refactoring, feature rollout).
- For small or strictly linear projects, omit phases and list tasks directly under the header.

### 3.3. Task Blocks
- Use a level 3 heading (`###`) for each task, assigned to one agent:  
    `### Task <n.m> – <Title> │ <Agent_<Domain>>`
- Each task is a focused, actionable step for an Implementation Agent with one clear objective
- Directly under the heading, add an unordered list with these meta-fields:
    - **Objective:** One-sentence task goal.
    - **Output:** Concrete deliverable (e.g., function, module, PR).
    - **Guidance:** Key constraints or special requirements (e.g., library, API contract).

### 3.4. Sub-Task Decomposition
Sub-tasks break down a parent task into logical steps and must be included for every task. Choose format based on work characteristics rather than arbitrary rules.

#### Format Selection Logic
Determine subtask format based on task workflow requirements:

**Single-step [unordered list(`-`)]:** Work completed in one focused exchange (one response)
- No internal sequential dependencies between steps
- Can be approached directly and completed without staged progression
- All subtask components can be addressed simultaneously

**Multi-step [ordered list (`1.`, `2.`, ...)]:** Work requiring sequential progression (multiple responses)
- Has natural "first this, then that" internal workflow
- Benefits from user confirmation between progression steps
- Same focused task scope but needs staged execution for success

#### Ad-Hoc Agent Delegation Steps
Implementation Agents reference `ad-hoc/` directory guides for delegation execution.
For multi-step tasks requiring specialized knowledge or investigation, include delegation steps:
- **Research delegation**: When current documentation, SDKs, or APIs may be outdated/unknown
- **Debug delegation**: When complex bugs are anticipated that may require dedicated debugging or the task revolve about bug solving
- **Format**: "Assign [research/debugging] of [specific topic] to an Ad-Hoc agent to [expected outcome]."

**Example (single-step format):**
```markdown
### Task 2.3 - Add Input Validation │ Agent_Backend
- **Objective:** Add validation middleware to existing API endpoints.
- **Output:** Updated middleware with comprehensive input validation.
- **Guidance:** Follow existing validation patterns in auth middleware.

- Extend current validation framework with new rules for user inputs.
- Add comprehensive error handling for invalid data types.
- Update existing middleware tests to cover new validation rules.
```

**Example (multi-step format with Ad-Hoc Agent):**
```markdown
### Task 2.1 - Migrate Auth Middleware │ Agent_Backend
- **Objective:** Replace legacy session-based authentication with JWT middleware.
- **Output:** Merged PR with updated `/auth/login` endpoint and passing tests.
- **Guidance:** Preserve existing URL slugs for backward compatibility.

1. **Research SDK:** Assign research of `Acme-JWT` v2 to an Ad-Hoc agent to determine integration requirements.
2. **Implement Middleware:** Create middleware and integrate into `/auth/login`, replacing session logic.
3. **Update Tests:** Modify unit tests for JWT flow and edge cases from research.
4. **Submit PR:** Create a pull request for review, linking to this task.
```

### 3.5. Cross-Agent Task Dependencies
Use retained coordination needs to determine when tasks require dependency relationships:

#### Dependency Assessment
Determine dependency needs based on Context Synthesis retention:
- **Retained coordination needs flagged** → Tasks require explicit dependency declarations
- **Retained sequential "A before B" patterns** → Producer-consumer relationships needed
- **Independent work streams noted** → Avoid artificial dependencies between parallel work
- **Retained bottlenecks identified** → Critical dependencies requiring careful coordination

#### Dependency Declaration
When dependencies are needed:
- **Producer Task**: Specify concrete deliverables in the `Output` field for consumer task integration
- **Consumer Task**: Reference dependency in `Guidance` field using format: "Depends on: Task X.Y Output"
- **Manager coordination required**: Cross-agent dependencies need explicit context transfer by the Manager Agent
- **Same-agent dependencies**: Handle through logical task ordering within agent assignments

#### Dependency Guidelines
- **Minimize unnecessary dependencies** → Only declare when work genuinely requires previous outputs
- **Same-agent optimization** → When dependencies exist, prefer assigning both producer and consumer tasks to the same agent when possible to reduce context transfer overhead
- **Cross-agent dependencies** → Declare explicitly in Guidance field ("Depends on: Task X.Y Output")
- **Avoid excessive dependency chains** → Use intermediate checkpoints for complex sequential workflows

This declaration enables Manager Agent to coordinate proper context handoff between tasks

**Example with Cross-Agent Dependency (Subtasks are omitted for brevity):**

```markdown
### Task 2.1 - Create User API │ Agent_Backend
- **Objective:** Implement user authentication endpoints
- **Output:** API endpoints at `src/api/auth.js` with login/logout functionality and API documentation at `docs/auth-api.md`
- **Guidance:** Use JWT for token generation

### Task 2.2 - Build Login UI │ Agent_Frontend
- **Objective:** Create React login component
- **Output:** Login component at `src/components/Login.jsx`
- **Guidance:** Depends on: Task 2.1 Output. Follow existing UI patterns.
```

### 3.6. Phase Summary Procedure (Manager Agent)
At phase completion, append summaries to:
1. **Memory Root**: Detailed narrative per Memory System Guide
2. **Implementation Plan**: Concise summary before next phase following this format:

```markdown
## Phase <n>: <Name> Summary
> Delivered: Tasks <n.m>, <n.k>
> Outstanding: Tasks <n.x>, ...
> Blockers: ...
> Common Bugs/Issues: ...
> Compatibility Notes: ...
```

---

## 4. JSON Variant Specification
JSON Implementation Plans follow identical rules and structure as Markdown but use schema validation at `/prompts/schemas/implementation_plan.schema.json`. All requirements for task meta-fields, agent assignments, dependencies, summaries, and policies apply as described above. 

---

## 5. Setup Agent Responsibilities
Below follows the main responsibilities of the Setup Agent when creating the Implementation Plan for an APM session:

1. Variant Selection
    - Choose MD/JSON based on user preference from Context Synthesis Phase (default: Markdown)

2. Project Analysis & Decomposition
    - Apply retained Context Synthesis insights using section §2
    - Determine phase organization based on retained workflow patterns (sequential, parallel, hierarchical)
    - Create focused, well-scoped tasks using retained complexity flags and domain boundaries
    - Make reasoning-based decisions rather than applying rigid templates

3. Document Construction
    - Follow Section 3 structure specifications for formatting
    - Assign agent slugs based on retained domain boundaries (Agent_<Domain>)
    - Define task meta-fields using retained insights: Objective, Output, Guidance
    - Apply dependency declarations per section §3.5 when coordination needs were retained

4. Quality Assurance
    - Validate JSON structure against schema if JSON variant selected
    - Present completed plan for user review and feedback
    - Iterate based on user input until plan is explicitly approved
    - Ensure plan reflects user's actual project needs rather than template matching

## 6. Manager Agent Responsibilities
Below are the main responsibilities of the Manager Agent when maintaining the Implementation Plan during an APM session:

1. Plan Validation & Improvement
    - Read guide, evaluate plan
    - Validate JSON if used
    - Suggest improvements only for integrity issues
    - Confirm understanding before execution

2. Live Plan Maintenance
    - Sync plan with project changes
    - Add/remove/modify phases and tasks as needed
    - Update "Last Modification" for all changes
    - Keep task numbering and dependencies consistent

3. Execution Coordination
    - Manage cross-agent handoffs per dependencies
    - Extract producer task outputs, inject into consumer task assignments
    - Issue task prompts per plan

4. Phase Management
    - Track phase completion
    - Write detailed phase summaries in Memory Root
    - Add concise phase summaries to plan before next phase following Memory System Guide

---

**End of Guide**