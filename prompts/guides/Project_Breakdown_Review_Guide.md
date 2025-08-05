# APM v0.4 - Project Breakdown Review Guide
This guide defines how Setup Agents review the initial Implementation Plan to detect and fix critical task quality issues before enhancement. This guide uses phase-by-phase review cycles with enforced testing methodology and systematic fixing protocols.

---

## 1. Review Protocol Overview

### Review Purpose
Conduct systematic review of simple Implementation Plan to identify and fix critical task quality issues:
- Task packing violations (multiple distinct activities in one task)
- Classification errors (wrong single-step vs multi-step designation)
- Template matching patterns (rigid formatting across tasks)
- User requirement compliance failures (Context Synthesis requirements missing)
- Task execution scope errors (external platform assumptions)

### Review Methodology
**Phase-by-Phase Review:** Complete review of one phase before proceeding to next using testing that requires explicit enumeration and evidence-based decisions.

**Review Workflow:**
1. **Test Application**: Apply all 5 tests to each task with explicit enumeration
2. **Critical Fix**: Immediately fix clear violations with reasoning stated in chat
3. **User Collaboration Cataloging**: Document issues requiring user input for later presentation
4. **Phase Completion**: Complete all tests for all tasks and apply any needed modifications in each phase before proceeding to next phase
5. **Holistic Review**: Cross-phase validation after all phases reviewed
6. **User Collaboration Session**: Present all cataloged user collaboration items
7. **Final Plan Update**: Apply all user-requested modifications and complete review

**Progression Gates:** Cannot proceed to next phase without completing all tasks in current phase and applying all needed modifications.

**Error Classification:**
- **Critical Fix**: Clear violations, obvious errors, missing requirements - agent fixes immediately with reasoning stated in chat
- **User Collaboration**: Borderline cases, genuine ambiguity, optimization opportunities, personal preference areas

---

## 2. Enforced Review Tests

### 2.1. Task Packing Test
**Enumeration Requirement**: For each task, explicitly list activities in chat
- **List Activities**: What specific activities does this task accomplish? List each distinct activity in chat.
- **Evaluate Independence**: Would each listed activity deliver independent value if completed separately, excluding sequential workflow dependencies within the same domain? State thinking in chat.
- **Assess Integration Value**: Do activities share common deliverable, context, or workflow coherence? Would splitting create coordination overhead exceeding benefits?
- **Decision**: If multiple truly independent activities exist AND splitting provides clear benefits over coordination costs → task is packed → identify split points and create separate tasks

### 2.2. Classification Test
**Enumeration Requirement**: For each task, explicitly list workflow steps in chat
- **List Steps**: What are the sequential steps required to complete this task? List each step in chat.
- **Evaluate Validation Needs**: For each listed step, does it benefit from user confirmation, validation, or guidance before proceeding to the next step? State thinking in chat.
- **Assess Workflow Efficiency**: Would validation points genuinely improve task success, or would single-step completion with iteration be more efficient?
- **Decision**: If intermediate validation points are **necessary** for task success (not just beneficial) AND provide clear value over workflow interruption → multi-step classification. If completable efficiently without validation points → single-step classification

### 2.3. Template Matching Test
**Enumeration Requirement**: For each task, explicitly list format comparisons in chat
- **List Format Comparison**: How many bullets/steps does this task have? List other tasks in the plan with identical formatting in chat.
- **Evaluate Complexity Match**: Does this task's actual complexity and instruction requirements match the listed tasks with similar formatting? State thinking in chat.
- **Assess Natural Alignment**: Could similar complexity naturally result in similar formatting, or does this represent problematic pattern matching?
- **Decision**: If formatting matches but complexity genuinely differs AND this represents pattern-driven decisions rather than natural complexity alignment → template matching violation → adjust format to reflect actual task complexity

### 2.4. User Requirements Test
**Enumeration Requirement**: For each task, explicitly list applicable requirements in chat
- **List Applicable Requirements**: Which specific user requirements from Context Synthesis apply to this task's domain? List each requirement in chat.
- **Check Task Integration**: For each listed requirement, where in the task specification does it appear as an explicit actionable item? State thinking in chat.
- **Decision**: If emphasized user requirements are absent from task specifications → add requirements as explicit task actions

### 2.5. Execution Scope Test
**Enumeration Requirement**: For each task, explicitly list external dependencies in chat
- **List External Dependencies**: Which actions in this task require access to external platforms, dashboards, or systems outside the IDE? List each external dependency in chat.
- **Categorize Capabilities**: For each listed action, can Implementation Agents execute it using available IDE tools, or does it require user coordination? State thinking in chat.
- **Decision**: If external platform actions are present → specify user coordination steps and separate from agent-executable work

---

## 3. Phase Review Cycle Execution

### 3.1. Phase Review Process
**For each phase in the Implementation Plan, conduct systematic review:**

#### Phase Analysis Setup
**Before reviewing phase tasks:**
- State phase being reviewed: "Reviewing Phase X: [Phase Name]"
- Note total tasks in phase for tracking
- Initialize critical fixes counter and user collaboration items list

#### Task-by-Task Testing
**For each task in current phase, apply ALL 5 tests systematically:**

**Task [X.Y]: [Task Name] - Review**

1. **Task Packing Test Application**:
   - List Activities: [enumerate all distinct activities]
   - Independence Analysis: [evaluate each activity]
   - Integration Value Assessment: [evaluate workflow coherence and coordination costs]
   - Decision: [packed/properly scoped + reasoning including cost-benefit analysis]

2. **Classification Test Application**:
   - List Steps: [enumerate all workflow steps]
   - Validation Analysis: [evaluate each step's validation needs]
   - Workflow Efficiency Assessment: [evaluate necessity vs interruption cost]
   - Decision: [single-step/multi-step + reasoning including efficiency considerations]

3. **Template Matching Test Application**:
   - List Format Comparison: [enumerate similar tasks and their formatting]
   - Complexity Analysis: [evaluate complexity match]
   - Natural Alignment Assessment: [evaluate if similarity is coincidental vs problematic]
   - Decision: [natural formatting/template matching + reasoning]

4. **User Requirements Test Application**:
   - List Applicable Requirements: [enumerate relevant Context Synthesis requirements]
   - Integration Check: [locate requirements in task specification]
   - Decision: [requirements integrated/missing + reasoning]

5. **Execution Scope Test Application**:
   - List External Dependencies: [enumerate external platform actions]
   - Capability Analysis: [categorize agent vs user actions]
   - Decision: [proper scope/needs coordination + reasoning]

**Catalog any critical fixes or user collaboration items identified for current task.**
**Task Review Conclusion**: State "Task [X.Y] review complete - [critical fixes identified/no issues found]"

### 3.2. Critical Fix Execution
**For clear violations identified through testing, catalog for systematic application:**

#### Critical Fix Categories
- **Clear Task Packing Violations**: Tasks with multiple independent activities where splitting provides clear benefits over coordination costs
- **Obvious Classification Errors**: Tasks where user validation needs clearly don't match current format
- **Genuine Template Matching Violations**: Pattern-driven formatting that doesn't reflect actual task complexity
- **Missing User Requirements**: Emphasized requirements absent from task specifications
- **Execution Scope Errors**: External platform actions not properly separated from agent-executable work

#### Critical Fix Documentation
**For each critical fix identified:**
- **Issue Identified**: [Specific problem found through testing]
- **Evidence**: [Enumerated list that revealed the problem]
- **Fix Required**: [Specific changes needed for task]
- **Reasoning**: [Why this fix would improve task execution]

**State in chat**: "Critical fix identified for Task [X.Y]: [fix description and reasoning]"

### 3.3. User Collaboration Cataloging
**Document borderline issues requiring user input for later presentation:**

#### User Collaboration Categories
- **Borderline Packing**: Tasks that could reasonably be split but have integration value
- **Classification Ambiguity**: Tasks that could work as either single-step or multi-step
- **Formatting Preferences**: Template matching cases where user preference matters
- **Granularity Options**: Tasks that could be more/less granular based on user workflow preference
- **Agent Workload Balance**: Uneven task distribution that could be redistributed

**State in chat**: "User collaboration item cataloged: Task [X.Y] - [issue description]"

### 3.4. Phase Review Completion
**After completing all tasks in current phase:**

#### Phase Summary
- **Tasks Reviewed**: [total number]
- **Critical Fixes Identified**: [count and brief description]
- **User Collaboration Items**: [count for later presentation]
- **Phase Integrity Check**: Verify phase maintains logical structure after proposed fixes

#### Phase-End Critical Fix Application
**Apply all cataloged critical fixes systematically:**
- Review all identified critical fixes for consistency
- Apply fixes to Implementation Plan with proper documentation
- Update task numbering and dependencies as needed
- Verify no conflicts between fixes

**State completion**: "Phase [X] review complete - [X] critical fixes applied, [Y] user collaboration items cataloged"

**Progression Gate**: Cannot proceed to next phase without completing all tasks and applying critical fixes.

---

## 4. Holistic Review and Final Validation

### 4.1. Cross-Phase Validation
**After completing all individual phase reviews:**

#### Cross-Phase Dependency Check
- **Dependency Integrity**: Verify critical fixes don't break dependencies between phases
- **Reference Updates**: Ensure task references updated after splitting or modification
- **Workflow Continuity**: Confirm logical progression maintained across phases

#### Plan-Wide Pattern Analysis
- **Template Matching Scan**: Review entire plan for remaining rigid formatting patterns
- **Agent Workload Assessment**: Evaluate final task distribution after all critical fixes
- **User Requirement Coverage**: Verify all emphasized Context Synthesis requirements integrated somewhere in plan

**State completion**: "Holistic review complete - plan integrity verified"

### 4.2. User Collaboration Session
**Present ALL cataloged user collaboration items from entire plan:**

#### Comprehensive User Collaboration Presentation
**Present items systematically with clear options:**
- **Borderline Packing Issues**: "Task X.Y could be split into [A] and [B] or remain combined. Split provides [benefits] but combination offers [integration value]. Preference?"
- **Classification Ambiguity**: "Task X.Y could be single-step (complete in one exchange) or multi-step (user validation between steps). Based on your workflow preference, which approach?"
- **Agent Workload Options**: "Current distribution: Agent_A ([X] tasks), Agent_B ([Y] tasks). Redistribute for balance or maintain specialization?"
- **Granularity Preferences**: "Task X.Y could be [more granular approach] or [current approach]. Which fits your project management style?"

#### Iterative User Collaboration
**Work with user until explicit confirmation:**
1. **Present All Options**: Provide clear alternatives with pros/cons for each cataloged issue
2. **User Decision Collection**: Allow user to address items they have preferences on
3. **Iterative Refinement**: Address follow-up questions and additional user requests
4. **Completeness Check**: Ensure all significant user collaboration items addressed
5. **Explicit Confirmation**: Obtain clear user confirmation to proceed to enhancement phase

### 4.3. Final Implementation Plan Update
**Apply all decisions and complete review process:**

#### Decision Implementation
1. **Critical Fix Integration**: Ensure all critical fixes properly applied to Implementation Plan
2. **User Decision Application**: Apply all user choices systematically to plan
3. **Consistency Validation**: Verify all changes work harmoniously together
4. **File Modification**: Update Implementation Plan file with complete review results
5. **Final Integrity Check**: Confirm plan ready for Enhancement phase

#### Review Completion Summary
**Document comprehensive review outcomes:**
- **Total Tasks Reviewed**: [number across all phases]
- **Critical Fixes Applied**: [count and categories of fixes]
- **User Collaboration Items Resolved**: [count and types addressed]
- **Template Matching Corrections**: [formatting improvements made]
- **User Requirement Integration**: [requirements added to task specifications]
- **Execution Scope Corrections**: [coordination requirements clarified]

**Review Completion Confirmation**: "Implementation Plan review complete. All critical issues fixed, user collaboration items addressed. Plan ready for Enhancement phase."

---

**End of Guide**