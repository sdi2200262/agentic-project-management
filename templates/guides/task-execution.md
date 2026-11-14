# APM {VERSION} - Task Execution Guide

The Manager and Workers use this guide to integrate dependencies, carry out Tasks, validate results and fix failures. Worker receipt and batch procedures are §§1 and 3.2; the Manager uses the Spec, Plan and dependency evidence as its inputs and starts at §2. `{GUIDE_PATH:task-logging}` covers recording results and Worker reports.

## 1. Task Receipt

For a Worker, the Task Prompt has these sections:

- **Objective:** the Task's goal.
- **Instructions:** the steps to take.
- **Context from Dependencies:** only when the Task builds on earlier Tasks.
- **Workspace:** where to work.
- **Output:** the deliverables.
- **Validation:** the checks the work must pass.

Objective and Output define the result; Validation defines its checks. Verify questionable instructions, prerequisites or assumptions against relevant sources and clarify unresolved questions per §3.

1. Check that the prompt's `agent` matches your registered identity and bus folder. If it does not, reject the prompt and tell the User which Worker it is for.
2. If the frontmatter lists `tasks`, the prompt is a batch: execute its Tasks per §3.2.
3. If the title starts with `APM Follow-Up Task`, this is another attempt at the same Task. The revised prompt says what remains and supplies a new `log_path` and links to earlier logs. Keep the Task ID and use that path.
4. Work where the Workspace section says. With version control, switch to its branch or worktree. In a worktree, do the work there but use the workspace root given in the prompt for every `.apm/` path.
5. If the prompt has a Context from Dependencies section, integrate it per §2. Otherwise start the work per §3.

For corrected instructions, keep Task identity, branch, worktree and valid progress, including batch progress; do not restart logged Tasks. Check what changed and what comes next. Ask the User to resolve conflicts with your checked workspace before affected work proceeds.

## 2. Dependency Context

Use your dependency context: a Worker reads the logs and outputs named in its prompt; the Manager uses the Plan, Spec and accepted dependency evidence. Follow earlier-attempt links as needed and complete required integration before dependent work. Investigate questions against the actual outputs.

Pause dependent work when an output is missing or fails its integration check. Continue unaffected work within the Active Task, preserving required sequencing. Handle unresolved questions per §3. For a minor ambiguity in your own earlier work, continue with the best-supported reading and note the uncertainty in the Task Log.

## 3. Execution

Follow the Task's defined steps and guidance in order, applying `AGENTS.md` toward its objective. Where neither covers something, follow the codebase's existing conventions, use descriptive names and comment non-obvious behavior. Build in small increments and check each meaningful change.

Report consequential findings and possible wider effects, distinguishing evidence from uncertainty. Ask the User when your available context or authority cannot settle a decision. Pause only affected work and retain the decision and result for review.

When work is delegated, review the actual outputs against the Task requirements, resolve remaining issues and validate the combined result.

Use the shared communication guidance for brief progress updates, grouped findings and clear User actions. Pause only affected work for a required User action, and continue from the result when it is available.

Use the work's own vocabulary in commits, code and comments. Keep APM coordination details out of deliverables unless they are part of the work itself.

### 3.1 Troubleshooting

When a check fails or the work does not behave as expected, investigate before fixing: read the error, trace where it comes from and identify the cause. Make one targeted fix, then validate again.

If a fix fails, causes problems or leaves the cause unclear, use errors, prior attempts, relevant paths and expected and actual behavior to test a specific hypothesis before another fix.

Continue while attempts produce new evidence or close validation gaps within the Task. Ask the User when attempts repeat without progress, work substantially exceeds scope or instructions conflict with Objective, Output or Validation. Explain the likely cause or uncertainty, attempts, remaining work and options. Pause only affected work while awaiting the User’s reply. Then follow their guidance or choose the outcome per `{GUIDE_PATH:task-logging}` §1.

### 3.2 Batch Execution

A batch Task Prompt sends several of your Tasks in one file, to run in order. Its frontmatter lists each Task with its own `log_path`, and the body holds the Tasks one after another, each starting at its `# Task` heading.

Execute the Tasks in order, following §1 steps 3–5 for each, except that you send one report for the whole batch. Validate each Task and write its Task Log before starting the next. Stop the batch if a Task ends with Partial or Failed, and mark the remaining Tasks Not started. When all Tasks are done or the batch stops, report per `{GUIDE_PATH:task-logging}` §4.

### 3.3 Working with the User

The User may perform a Task or part of it, take over while work is underway, or ask you to continue or finish it. You remain responsible for supporting them, validating the result and logging the Task.

When the User takes over, stop your own and any subagents' overlapping work and preserve progress. Brief them on progress and pending checks. Stay available for help without taking over work they have kept.

When the User returns work, check their changes and results against the Task requirements, then continue from the current state. Keep the same Task and attempt throughout these changes.

## 4. Validation

Validate actual deliverables against the Task objective, required outputs and every validation criterion, including required documentation and affected behavior. Inspect outputs and use focused checks to resolve gaps in the evidence. Reuse evidence that applies to the current deliverable; rerun checks affected by changes, incomplete evidence or uncertainty. Never replace a check you cannot run with a weaker one. Confirm recurring failures match their established causes, and distinguish local, CI and integrated results.

1. Run available checks, resolve failures or unclear results per §3.1, and recheck corrections. Do not finalize a Task Log or Task Report while known issues or validation gaps remain that you can resolve within scope and permission.
2. When they pass, check any results the User has already supplied against the current deliverable. Ask for remaining checks that need their judgement or an outside action. Verify the User-facing procedure as written, isolating disposable test state from their data. Say what is ready, where to run the checks, the commands or actions, expected results and what to report back. Pause work that depends on those results, continuing unaffected work. Handle any problem the results reveal through §3.1.
3. Ask for missing resources when you need them. If a required check or resource is unavailable, continue unaffected work and available checks. If it remains unavailable at completion, use Partial and state what remains.

Success requires every check to pass, including required live checks and exact matches. Raise conflicts between the required behavior, instructions and rules in `AGENTS.md` and the Task instructions for guidance.

## 5. AGENTS.md Updates

Apply User corrections immediately. At completion, resolve whether corrections to workspace practices should be retained in `AGENTS.md`, using the User’s existing instructions or asking if the decision remains open. You may also propose guidance that will help future work, including corrections to outdated instructions. Keep Task-specific requirements in Task instructions.

Before editing, reread the file. Under User authorization, extend or replace relevant guidance concisely, state its scope and preserve unrelated content. If tracked in the Task’s repository, edit the assigned branch or worktree copy; otherwise use the shared file’s actual path. Follow agreed commit conventions. Record the change, path, User decision, reasons and observed or possible effects under Important Findings.

## 6. Completion

1. At an agreed review or the next useful chat reporting point, briefly identify the Task or batch and its actual result, with evidence and consequential limits. Do not require a separate chat report for every intermediate Task completion. Choose the outcome per `{GUIDE_PATH:task-logging}` §1. Explain remaining limits and options. Recommend acceptance when requested or when evidence clarifies a consequential trade-off. When proposing acceptance of remaining limits, explain their effects within your context and why accepting them is preferable to further work or a planning change. Record any User agreement and the limits it covers.
2. Complete agreed User review and resulting changes before recording or reporting the result. Resolve workspace-guidance updates per §5.
3. Follow agreed commit conventions. Record relevant commits and uncommitted work in the Task Log.

Then record the result per `{GUIDE_PATH:task-logging}`.
