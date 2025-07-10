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

### 2.1. Phase Structure
Use deliverable type from Context Synthesis to determine phase organization:
- **Linear:** Single deliverable → Sequential phases (research → draft → review)
- **Parallel:** Multiple components → Component-based phases  
- **Hierarchical:** Complex systems → Foundation → features → integration

### 2.2. Task Sizing
Use complexity assessment from Context Synthesis:
- **Simple work:** 3-5 response tasks
- **Moderate complexity:** 2-3 response tasks  
- **High complexity:** 1-2 response tasks
- **Rule:** >5 responses = split into smaller tasks

### 2.3. Task Dependencies  
Use dependency information from Context Synthesis:
- **Sequential work:** Ordered sub-tasks within phases
- **Independent work:** Parallel tasks across agents
- **Review checkpoints:** Phase boundaries
- **Rule:** Every Task must include subtasks (see section §3.4)

### 2.4. Agent Assignment Strategy
Use project context from Context Synthesis to determine optimal agent boundaries and assignments:

#### Domain Separation
- Assign separate agents for:
    - Different technical stacks (e.g., Agent_Frontend, Agent_Backend)
    - Distinct skill types (e.g., Agent_Research, Agent_Writing, Agent_Analysis)
    - Divergent working styles (e.g., Agent_Architecture, Agent_Implementation)

#### Task Volume Guidelines
- 1–3 related tasks: Assign to a single specialized agent
- 4–6 tasks in a domain: Use a dedicated domain agent
- 7 or more tasks, or high complexity: Split by sub-domain or workflow stage

#### Assignment Patterns
- Document projects: Agent_Research, Agent_Writing, Agent_Review
- Web applications: Agent_Backend, Agent_Frontend, Agent_DevOps
- Analysis projects: Agent_DataGathering, Agent_Analysis, Agent_Visualization
- Complex systems: Agent_Architecture, Agent_CoreFeatures, Agent_Integration, Agent_Testing

#### Dependency Optimization
- Assign producer-consumer task pairs to the same agent when feasible 
- Reduce context transfer overhead and integration complexity
- Example: API creation + API integration → same Agent_Backend

#### Special Cases
- Ad-Hoc agents: Assign for one-off research or investigation steps within multi-step tasks
- Single agent projects: Use when all tasks are closely related and fewer than 6 total
- Hybrid workflows: Combine domain agents with workflow-stage agents when both are relevant

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
- Each task is a focused, actionable step for an Implementation Agent, completed in 1 to 5 responses.
- Directly under the heading, add an unordered list with these meta-fields:
    - **Objective:** One-sentence task goal.
    - **Output:** Concrete deliverable (e.g., function, module, PR).
    - **Guidance:** Key constraints or special requirements (e.g., library, API contract).

### 3.4. Sub-Task Decomposition
Sub-tasks break down a parent task into logical steps and must be included for every task. Use the appropriate format based on the task's workflow requirements.

#### Single-step  
Use an **unordered list** (`-`) for atomic work done in one response, no sequential dependencies.

#### Multi-step
Use an **ordered list** (`1.`, `2.`, ...) for work with sequential dependencies; each step is a separate exchange.

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
When tasks depend on outputs from other tasks, explicitly declare dependencies in the Implementation Plan:

#### Dependency Declaration
- **Producer Task**: Specify concrete deliverables in the `Output` field
- **Consumer Task**: Reference dependency in `Guidance` field using format: "Depends on: Task X.Y Output"

This declaration enables Manager Agent to coordinate proper context handoff between tasks.

**Example (Subtasks are omitted for brevity):**

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

**Dependency Limit:** Avoid dependency chains exceeding 3 sequential tasks without intermediate checkpoints.


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
    - Review context for complexity, scope, timeline
    - Split complex projects into phases (task groupings)
    - Break phases into granular, actionable tasks

3. Document Construction
    - Follow Section 3 structure
    - Assign agent slugs (Agent_<Domain>)
    - Define task meta-fields: Objective, Output, Guidance
    - Map dependencies using handoff patterns

4. Quality Assurance
    - Validate JSON if used
    - Present plan for user review and feedback
    - Iterate until approved

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
    - Extract producer task outputs, inject into consumer taska assignments
    - Issue task prompts per plan

4. Phase Management
    - Track phase completion
    - Write detailed phase summaries in Memory Root
    - Add concise phase summaries to plan before next phase following Memory System Guide

---

**End of Guide**