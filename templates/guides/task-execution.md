# APM {VERSION} - Task Execution Guide

This guide covers Task Execution: integrating dependencies, doing the work, validating it and fixing failures. `{GUIDE_PATH:task-logging}` covers recording the result.

## 1. Task Receipt

A Task Prompt has these sections:

- **Objective:** the Task's goal.
- **Instructions:** the steps to take.
- **Context from Dependencies:** only when the Task builds on earlier Tasks.
- **Workspace:** where to work.
- **Output:** the deliverables.
- **Validation:** the checks the work must pass.

The Objective and Output are authoritative. Check questionable instructions, prerequisites or assumptions against the codebase or other relevant sources, then use the findings and clarification guidance below to proceed.

1. Check that the prompt's `agent` matches your registered identity and bus folder. If it does not, reject the prompt and tell the User which Worker it is for.
2. If the frontmatter lists `tasks`, the prompt is a batch: execute its Tasks per §3.2.
3. If the title starts with `APM Follow-Up Task`, this is another attempt at the same Task. The revised prompt says what remains and supplies a new `log_path` and links to earlier logs. Keep the Task ID and use that path.
4. Work where the Workspace section says. With version control, switch to its branch or worktree. In a worktree, do the work there but use the workspace root given in the prompt for every `.apm/` path.
5. If the prompt has a Context from Dependencies section, integrate it per §2. Otherwise start the work per §3.

If the User delivers corrected instructions for your current Task, keep the same Task identity, branch and worktree. Check what changed and what the prompt says to do next. Preserve valid completed work and batch progress; do not restart logged Tasks. If the stated progress conflicts with your checked workspace, ask the User to resolve it before proceeding with affected work.

Report relevant findings and possible wider effects, separating evidence from uncertainty. When the Task Prompt and available context leave an issue unclear, ask the User how to proceed and recommend a local resolution or Manager involvement if broader context or coordination is likely needed. Pause only affected work, and record the decision and result for Manager review.

## 2. Dependency Context

Read the named dependency outputs and complete any supplied integration steps before starting the work. Investigate integration questions against the named files.

Do not start the work while a dependency's output is missing or fails its integration check. Ask the User for guidance when another agent's output does not integrate as the Task instructions describe, or when an expected file from your own earlier work is missing. For a minor ambiguity in your own earlier work, continue with the best-supported reading and note the uncertainty in the Task Log.

## 3. Execution

Follow the Task’s instructions in order, applying `AGENTS.md` toward the Objective. Where neither covers something, follow the codebase's existing conventions, use descriptive names and comment non-obvious behavior. Build in small increments and check each meaningful change.

When work is delegated, review the actual outputs against the Task requirements, resolve remaining issues and validate the combined result.

When an instruction needs the User to act, say what is needed and why, offer the options and wait for the result.

Use the work's own vocabulary in commits, code and comments. APM terms, Task IDs, Stage numbers and agent names belong only in APM files.

### 3.1 Troubleshooting

When a check fails or the work does not behave as expected, investigate before fixing: read the error, trace where it comes from and identify the cause. Make one targeted fix, then validate again.

If the fix fails, causes new problems or leaves the cause unclear, investigate further. Use the error output, what you tried, relevant paths and expected and actual behavior to test a specific hypothesis before applying another targeted fix.

Continue while attempts produce new evidence or close a validation gap within the Task. Ask the User when attempts repeat without progress, the remaining work substantially exceeds the assignment, or the Task's instructions conflict with its Objective, Output or required validation. Lead with the likely cause, or say that it is still unclear, then give what you tried, what remains and the options, and wait for the User's reply. Then continue under their guidance, or choose the outcome per `{GUIDE_PATH:task-logging}` §1.

### 3.2 Batch Execution

A batch Task Prompt sends several of your Tasks in one file, to run in order. Its frontmatter lists each Task with its own `log_path`, and the body holds the Tasks one after another, each starting at its `# Task` heading.

Execute the Tasks in order, following §1 steps 3–5 for each, except that you send one report for the whole batch. Validate each Task and write its Task Log before starting the next. Stop the batch if a Task ends with Partial or Failed, and mark the remaining Tasks Not started. When all Tasks are done or the batch stops, report per `{GUIDE_PATH:task-logging}` §4.

### 3.3 Working with the User

The User may perform a Task or part of it, take over while work is underway, or ask you to continue or finish it. You remain responsible for supporting them, validating the result and logging the Task.

When the User takes over, stop your own and any subagents' overlapping work and preserve progress. Brief them on progress and pending checks. Stay available for help without taking over work they have kept.

When the User returns work, check their changes and results against the Task requirements, then continue from the current state. Keep the same Task and attempt throughout these changes.

## 4. Validation

Run every check in the Task's Validation section. Never replace a check you cannot run with a weaker one.

1. Run all checks you can do on your own first. A failed or unclear result goes to §3.1.
2. When they pass, check any results the User has already supplied against the current deliverable. Ask for remaining checks that need their judgement or an outside action. Say what the result is, where the deliverable is, what to check and what to report back. Wait for the answer, and handle any problem it reveals through §3.1.
3. Ask for missing resources when you need them. If the User says a required check or resource is not available, the outcome is Partial; state what remains.

Success requires every check to pass, including required live checks and exact matches. Raise conflicts between the required behavior, instructions and rules in `AGENTS.md` and the Task instructions for guidance.

## 5. AGENTS.md Updates

Apply User corrections immediately. At completion, resolve whether corrections to workspace practices should be retained in `AGENTS.md`, using the User’s existing instructions or asking if the decision remains open. You may also propose guidance that will help future work, including corrections to outdated instructions. Keep Task-specific requirements in Task instructions.

Before editing, reread the file. Under User authorization, extend or replace relevant guidance concisely, state its scope and preserve unrelated content. If tracked in the Task’s repository, edit the assigned branch or worktree copy; otherwise use the shared file’s actual path. Follow agreed commit conventions. Record the change, path, User decision, reasons and observed or possible effects under Important Findings.

## 6. Completion

1. Present the outcome, deliverables, validation and important findings or limits. Choose the outcome per `{GUIDE_PATH:task-logging}` §1. When work or required validation remains, explain the limits and available options. Recommend acceptance only when you have enough context to explain its consequences, and record any User agreement with the Partial outcome.
2. Complete agreed User review and resulting changes before writing the Task Log and Task Report. Resolve any workspace-guidance updates per §5.
3. Follow the agreed commit conventions. Record relevant commits and any uncommitted work in the Task Log.

Then record the result per `{GUIDE_PATH:task-logging}`.
