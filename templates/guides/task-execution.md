# APM {VERSION} - Task Execution Guide

This guide covers Task Execution, from receiving a Task Prompt through integrating its dependencies, doing the work, validating it and fixing failures. `{GUIDE_PATH:task-logging}` covers the Task Log and Task Report that follow.

A Task Prompt has these sections:

- **Objective:** the Task's goal.
- **Instructions:** the steps to take.
- **Context from Dependencies:** only when the Task builds on earlier Tasks.
- **Workspace:** where to work.
- **Output:** the deliverables.
- **Validation:** the checks the work must pass.

The Objective and Output are authoritative. When an instruction, prerequisite or assumption in the prompt looks wrong, check it against the codebase or other relevant sources, such as documentation. If that does not settle it, ask the User for direction. Then use what you learn to reach the Objective.

## 1. Task Receipt

1. Check that the prompt's `agent` matches your registered identity and bus folder. If it does not, reject the prompt and tell the User which Worker it is for.
2. If the frontmatter lists `tasks`, the prompt is a batch: execute its Tasks per §3.2.
3. If the title starts with `APM Follow-Up Task`, this is another attempt at the same Task. The revised prompt says what remains and supplies a new `log_path` and links to earlier logs. Keep the Task ID and use that path.
4. Work where the Workspace section says. With version control, switch to its branch or worktree. In a worktree, do the work there but use the workspace root given in the prompt for every `.apm/` path.
5. If the prompt has a Context from Dependencies section, integrate it per §2. Otherwise start the work per §3.

If the User delivers corrected instructions for your paused current Task, keep the same Task identity, branch and worktree. Check what changed and where the prompt says to resume. Preserve valid completed work and batch progress; do not restart logged Tasks. If the stated progress conflicts with your checked workspace, ask the User to resolve it before resuming.

## 2. Dependency Context

Some Tasks build on the output of earlier Tasks. The prompt's Context from Dependencies section names that output and says how to use it. It treats each dependency in one of two ways:

- **Same-Worker dependency:** your own earlier work, which you remember. The prompt points to its output; refresh what you need from the named paths.
- **Cross-Worker dependency:** work you have not seen, by another Worker or by you before a Handoff. The prompt gives reading and integration steps. Complete them all before you start the work. Read the named files and investigate any integration questions before proceeding.

Do not start the work while a dependency's output is missing or fails its integration check. Ask the User for guidance when another Worker's output does not integrate as the prompt describes, or when an expected file from your own earlier work is missing. For a minor ambiguity in your own earlier work, continue with the best-supported reading and note the uncertainty in the Task Log.

## 3. Execution

Follow the Instructions in order, applying the Rules toward the Objective. Where neither covers something, follow the codebase's existing conventions, use descriptive names and comment non-obvious behavior. Build in small increments and check each meaningful change.

When an instruction needs the User to act, say what is needed and why, offer the options and wait for the result.

Use the work's own vocabulary in commits, code and comments. APM terms, Task IDs, Stage numbers and agent names belong only in APM files.

### 3.1 Troubleshooting

When a check fails or the work does not behave as expected, investigate before fixing: read the error, trace where it comes from and identify the cause. Make one targeted fix, then validate again.

If the fix fails, causes new problems or leaves the cause unclear, investigate further. Use the error output, what you tried, relevant paths and expected and actual behavior to test a specific hypothesis before applying another targeted fix.

Continue while attempts produce new evidence or close a validation gap within the Task. Ask the User when attempts repeat without progress, the remaining work substantially exceeds the assignment, or the prompt's instructions conflict with its Objective, Output or required validation. Lead with the likely cause, or say that it is still unclear, then give what you tried, what remains and the options, and wait for the User's reply. Then continue under their guidance, or choose the outcome per `{GUIDE_PATH:task-logging}` §1.

### 3.2 Batch Execution

A batch Task Prompt sends several of your Tasks in one file, to run in order. Its frontmatter lists each Task with its own `log_path`, and the body holds the Tasks one after another, each starting at its `# Task` heading.

Execute the Tasks in order, following §1 steps 3–5 for each, except that you send one report for the whole batch. Validate each Task and write its Task Log before starting the next. Stop the batch at the first Failed outcome. When all Tasks are done or the batch stops, report per `{GUIDE_PATH:task-logging}` §4.

## 4. Validation

Run every check in the prompt's Validation section. Never replace a check you cannot run with a weaker one.

1. Run all checks you can do on your own first. A failed or unclear result goes to §3.1.
2. When they pass, ask the User for any check that needs their judgement or an outside action. Say what the result is, where the deliverable is, what to check and what to report back. Wait for the answer, and handle any problem it reveals through §3.1.
3. Ask for missing resources when you need them. If the User says a required check or resource is not available, the outcome is Partial; state what remains.

Success requires every check to pass, including required live checks and exact matches. Raise conflicts between the required behavior, Rules and prompt instructions for guidance.

## 5. Rules Updates

Apply User corrections immediately. At completion, ask whether corrections to shared execution practices should become Rules, and wait for the answer. Add approved corrections inside `APM_RULES` in the workspace-root `AGENTS.md` you read at initiation. If that file is tracked in the Task's repository, update its copy on your assigned branch or worktree and commit it with the Task; otherwise update the shared file at its actual path. Reread it before editing and preserve other content. Log the correction, file path and User's decision under Important Findings.

## 6. Completion

1. Tell the User the outcome, the deliverables, how you validated them, and any important findings or limits. Choose the outcome per `{GUIDE_PATH:task-logging}` §1.
2. For corrections that apply to later Tasks, follow §5.
3. With version control, commit your work on the assigned branch, following the commit conventions in the Rules. A large Task may also have intermediate commits, each a coherent change. Do not create branches, manage worktrees, merge or push; the Manager does that.

Then write the Task Log and Task Report per `{GUIDE_PATH:task-logging}`.
