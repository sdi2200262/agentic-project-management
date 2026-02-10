---
priority: 7
command_name: delegate-testing
description: Provides the template for delegating automated testing and verification tasks to an Ad-Hoc agent
---

# APM {VERSION} - Testing Automation Delegation Guide
This guide defines how Implementation Agents delegate focused testing and verification work to Ad-Hoc Testing agents. Use this when a feature or bug fix needs fast, isolated validation, expanded coverage, or regression protection without stalling main task execution.

---

## 1  Delegation Workflow Overview
Ad-Hoc Testing agents operate in **separate chat sessions** managed by the delegating Implementation Agent:

### Branch Management
- **Independent Operation**: Ad-Hoc agents work in isolated branched sessions without access to main project context
- **User Coordination**: User opens new chat session, pastes delegation prompt, returns with runnable tests and results
- **Context Preservation**: Delegation session stays open for re-delegation until tests are accepted or escalated

### Handoff Process
1. **Create Prompt**: Use template below with complete testing scope and environment details
2. **User Opens Session**: User initiates new Ad-Hoc Testing chat and pastes prompt
3. **Tester Works**: Ad-Hoc agent writes/updates tests, executes them, and reports results with commands/logs
4. **User Returns**: User brings test artifacts and findings back for integration

---

## 2  Delegation Prompt Template
Present delegation prompt **in chat as a single markdown code block with YAML frontmatter at the top** for User copy-paste to new Ad-Hoc Testing session

```markdown
---
test_type: [unit|integration|e2e|regression|performance|contract|data_quality|other]
target_scope: [single_module|feature_flow|service_boundary|full_app]
ci_context: [local|ci|both]
delegation_attempt: [1|2|3|...]
---

# Testing Delegation: [Brief Feature/Fix Description]

## Testing Mission
**Primary Goal**: Deliver runnable, maintainable tests that validate the specified behavior and guard against regressions
**Working Output Required**: Provide test files, commands, and expected results that can be executed immediately in the project
**Fail-Fast Reporting**: Surface failing cases with logs, reproduction steps, and suspected root causes
**Coverage Discipline**: Prioritize critical paths, boundaries, and failure modes relevant to the change

## Execution Requirements
**Mandatory Terminal Execution**: Run the provided or newly added tests in your environment and share command outputs.
**Framework Alignment**: Follow the project's existing test framework, file layout, and assertion style.
**Determinism**: Avoid flaky patterns (random seeds, timers, live network) or neutralize them with mocks/fakes.
**Performance Guardrails**: Keep suites efficient; flag any long-running cases and justify them.
**Safety**: Do not mutate production resources; use fixtures, mocks, or isolated test data.

## Code & Test Context
[Summarize relevant code paths, files under test, recent changes, and existing test locations]

## Acceptance Criteria
[Enumerate behaviors that must be validated, including edge cases, error handling, and non-functional needs]

## Required Artifacts
- **Test Changes**: [Files to add or update, including paths]
- **Commands**: [Exact commands used to run tests]
- **Results**: [Pass/fail summary with key logs or stack traces]
- **Gaps/Risks**: [Known untested areas or blockers]

## Environment Details
[Runtime version, frameworks/libraries, env vars, services to mock, and any local/CI differences]

## Previous Delegation Findings
[Only include if delegation_attempt > 1]
[Summarize prior attempts: what was tested, failures observed, and why more work is needed]

## Delegation Execution Note
**Follow your initiation prompt workflow exactly**: Complete Step 1 (scope confirmation), Step 2 (test implementation + execution + confirmation request), and Step 3 (final delivery) as separate responses.
```

### Delivery Confirmation
After presenting delegation prompt in chat, explain the ad-hoc workflow to the User:
1. Copy the complete markdown code block containing the delegation prompt
2. Open new Ad-Hoc agent chat session & initialize it with {COMMAND_PATH:Ad_Hoc_Agent_Initiation_Prompt.md}
3. Paste delegation prompt to start ad-hoc work
4. Return with tests, results, and any residual risks for integration

---

## 3  Integration & Re-delegation Protocol
When the User returns with the Ad-Hoc Agent's outputs follow these steps: 

### Test Integration
- **Apply Test Artifacts**: Add/modify test files and fixtures as provided; keep naming and structure consistent with the suite
- **Verify Locally**: Re-run the shared commands to confirm results in task context
- **Assess Coverage**: Ensure acceptance criteria and high-risk paths are exercised; note remaining gaps
- **Update Memory Log**: Record scenarios covered, commands used, and outcomes

### Re-delegation Decision Framework
**Adequate Coverage**: Close delegation session and proceed with task completion
**Incomplete Coverage**: Refine prompt with uncovered cases, flaky failures, or environment notes and re-delegate:
- **Add Findings**: Update "Previous Delegation Findings" with failing cases and logs
- **Tighten Scope**: Specify exact files/behaviors needing additional tests
- **Increment Counter**: Update `delegation_attempt` field in YAML

### Session Closure Criteria
- **Success**: Tests run cleanly, cover acceptance criteria, and guard key regressions
- **Resource Limit**: After 2-3 iterations with persistent gaps or flakiness
- **Escalation**: If blockers persist (e.g., environment constraints, missing mocks), escalate to Manager Agent with detailed findings

### Memory Logging Requirements
Document in task Memory Log:
- **Test Scope & Goals**: What was validated and why
- **Artifacts Added**: Files, commands, and fixtures applied
- **Results**: Passing suites, failing cases, and logs
- **Residual Risks**: Known gaps, flaky areas, or follow-ups needed

---

**End of Guide**
