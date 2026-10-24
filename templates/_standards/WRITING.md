# APM Writing Standards

These standards guide template authors. Agents receive them through commands, guides and skills, not by reading `_standards/` at runtime. Apply them to both the instructions and the output those instructions request. Terms follow `TERMINOLOGY.md`; document and artifact structure follows `STRUCTURE.md`.

## 1. Write for the reader

Before writing, identify the reader, the decision or action they need to take, and the context they already have. State the rule, condition and required action directly. Keep enough explanation to make the instruction unambiguous.

Trust capable models to apply clear criteria. Define the result and constraints rather than prescribing a thinking process, invented classification system or exhaustive decision tree. Keep enumerated values where artifact schemas require them.

Give each rule one primary home. Refer to it elsewhere instead of repeating its full procedure or listing its inverse as a Common Mistake. A reference is sufficient only when the reading role can load it within its normal access boundaries.

Remove padding, repeated warnings and generic reinforcement. Choose prose, lists or tables for the content, not for a token quota or fixed file length. Preserve conditions, authority, approval gates and artifact contracts when shortening instructions.

## 2. Use plain, precise language

Keep each sentence to one main thought. Prefer concrete subjects, active verbs and familiar words. Keep related words together and put prerequisites before the steps that depend on them. Use the passive when the receiver of an action is the subject that matters.

Use a casually formal tone in chat and match authored prose to its reader and purpose. Remove hype, intensifiers and canned transitions. State claims at the certainty the evidence supports; identify consequential uncertainty and its cause.

Use formal APM terms consistently as defined in `TERMINOLOGY.md`. Ordinary labels and section names do not acquire formal status through capitalization or formatting. Explain unfamiliar concepts before relying on their names.

Runtime instructions address the reading agent as “you”; use third person for other roles. Shared skills distinguish role responsibilities explicitly. Standards describe the workflow in third person and may address maintainers directly.

## 3. Make procedures actionable

Use numbered steps for ordered actions and lists for independent items. State the trigger, prerequisites, decisions, actions and completion condition. Include response handling whenever the agent must pause for the User: what approval allows, how corrections are applied, and when to ask again.

Use natural conditions with a clear action. State a default only when it resolves a consequential edge case. Do not introduce example defaults that conflict with the workflow's validation or authority rules.

Give a rule's reason when it helps the reader apply it correctly. Keep examples for non-obvious cases. Describe ordinary sequential transitions naturally; use section references for navigation and non-sequential jumps.

## 4. Request useful communication

Agents explain decisions through conclusions, supporting evidence, material trade-offs and uncertainty. Do not require disclosure or reconstruction of internal reasoning, scripted thinking headers, or staged “thinking then writing” rituals. Reviewable proposals and approvals remain explicit workflow steps.

Put shared communication principles in `apm-communication`; add only situation-specific guidance in each procedure:

| Situation | What the output should convey |
|---|---|
| Questions | The relevant understanding or gap, a focused question, and any context or options needed to answer. |
| Proposals | The proposed result, consequential choices and their reasons, and the decision or approval needed. |
| Progress | A meaningful finding, change or blocker, plus the next action when relevant. |
| Completion | Outcome, deliverables, validation evidence, limits and any required action. |
| Review | Findings against objectives and evidence, their implications, and the resulting action. |
| Continuity | Current state, decisions and reasons, unresolved issues, source paths and concrete resumption steps. |

Lead with the substance the reader needs. Avoid repeated recaps and closing summaries that add no information. Before sending a substantial reply, check that its opening and length suit the request. Do not impose rigid chat formats where content and User needs vary.

Artifacts serve future readers without conversation context. Follow their schemas, verify concrete claims against source, and keep drafting history out of finished prose. A short log must still record enough evidence and context to support review and continuation.

## 5. References and shared text

Use explicit file paths and section references where they help navigation. Repair references when headings or numbers change. Cross-file template references use supported build placeholders: `{SKILL_PATH:name}`, `{GUIDE_PATH:name}` and `{COMMAND_PATH:name}`.

All six assistants receive identical template text. Refer to commands by name without a prefix. Assistant-specific paths, invocation syntax, argument handling, subagent calls and new-chat steps belong in `apm-communication` §5 Assistant Reference. Shared prose refers to “the Rules file” and “the command argument”; do not restore the removed `{RULES_FILE}` or `{ARGS}` placeholders.

Guide paths resolve from the project root to `.agents/apm-guides/` for every assistant. Skill paths are relative to the assistant's APM folder. Use the reference table to resolve that folder and assistant-specific actions. Keep project artifact paths rooted at `.apm/` as their contracts require.

## 6. Formatting

Use headings for distinct subjects, short paragraphs for explanations, numbered lists for sequences and tables for comparisons or schemas. Leave a blank line before lists and after headings. Avoid unnecessary nesting and decorative hierarchy.

Use inline code for paths, field names and literal values. Put commands the User must run in fenced code blocks. Use fenced blocks with an appropriate language for schemas and examples; use a longer outer fence when showing nested code blocks. Reserve bold for terms or labels readers need to find again, and use italics sparingly.

Preserve exact field names, values, identifiers and required artifact sections. Formatting preferences do not justify changing a contract or a workflow rule.
