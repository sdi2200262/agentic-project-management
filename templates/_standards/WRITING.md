# APM Writing Standards

These standards guide template authors. Authors implement them in the command skills, shared skills and guides agents read at runtime. Apply them to both the instructions and the output those instructions request. Terms follow `TERMINOLOGY.md`; document and artifact structure follows `STRUCTURE.md`.

## 1. Write for the reader

Before writing, identify the reader, the decision or action they need to take, and the context they already have. State the rule, condition and required action directly. Keep enough explanation to make the instruction unambiguous.

Define required results, constraints and decision criteria. Use the enumerated values required by artifact schemas.

Choose prose, lists or tables to suit the content. State each requirement with the conditions and detail needed to apply it; `STRUCTURE.md` says where it goes. Preserve authority, approval gates and artifact contracts.

## 2. Use plain, precise language

Keep each sentence to one main thought. Prefer concrete subjects, active verbs and familiar words. Keep related words together and put prerequisites before the steps that depend on them. Use the passive when the receiver of an action is the subject that matters.

Use a casually formal tone in chat and match authored prose to its reader and purpose. State claims at the certainty the evidence supports; identify consequential uncertainty and its cause.

Use formal APM terms consistently as defined in `TERMINOLOGY.md`. Use ordinary English capitalization for other labels and section names. Explain unfamiliar concepts before relying on their names. Where the agent first meets an APM concept, such as a Handoff, a batch or a follow-up Task, explain it in a sentence or two so the agent understands the system it works in, and leave the full detail to the file that owns the concept.

Runtime instructions address the reading agent as “you”; use third person for other roles. Shared skills distinguish role responsibilities explicitly. Standards describe the workflow in third person and may address maintainers directly.

## 3. Make procedures actionable

Use numbered steps for ordered actions and lists for independent items. State the trigger, prerequisites, decisions, actions and completion condition. Include response handling whenever the agent must pause for the User: what approval allows, how corrections are applied, and when to ask again.

Write actions as imperatives. Use “must” only for hard requirements on artifacts or conditions, where an imperative doesn't fit. Avoid “should”, which reads as optional.

Use natural conditions with a clear action. When an action is required, say so directly and say when it applies; avoid qualifiers such as “substantial” or “when helpful” that leave a required step to the agent's judgement. State a default when it resolves a consequential edge case. Examples follow the workflow's validation and authority rules.

Give a rule's reason when it helps the reader apply it correctly. Keep examples for non-obvious cases. Describe ordinary sequential transitions naturally; use section references for navigation and non-sequential jumps.

## 4. Request useful communication

Agents explain decisions through conclusions, supporting evidence, material trade-offs and uncertainty. Proposals provide a concrete result for User review, with approval at the required workflow gates.

Put shared communication principles in the `apm-communication` shared skill; add only situation-specific guidance in each procedure:

| Situation | What the output should convey |
|---|---|
| Questions | The relevant understanding or gap, a focused question, and any context or options needed to answer. |
| Proposals | The proposed result, consequential choices and their reasons, and the decision or approval needed. |
| Progress | A meaningful finding, change or blocker, plus the next action when relevant. |
| Completion | Outcome, deliverables, validation evidence, limits and any required action. |
| Review | Findings against objectives and evidence, their implications, and the resulting action. |
| Continuity | Current state, decisions and reasons, unresolved issues, source paths and concrete resumption steps. |

Lead with the substance the reader needs. Apply the reply-length defaults in the `apm-communication` shared skill §2.1, with User-specified length and detail taking precedence. Supporting artifacts carry the detail required by their schemas. Before sending, check the opening and total reply length.

Artifacts provide self-contained context for future readers. Follow their schemas and verify concrete claims against source. Logs record the outcome, evidence and context needed for review and continuation.

## 5. Skills and native actions

Refer to command skills by name, and tell the User to invoke them without a command prefix, such as “invoke `apm-3-initiate-worker` in a new chat”. Refer to what the User gives with a skill by what it is, such as “the agent ID the User gave with this skill”.

Keep assistant-specific syntax out of templates: describe the action in plain English, such as “use a subagent to research…”, and let each agent use its own assistant's way of doing it. Delegation instructions state when to use a subagent, its purpose, inputs and required findings. Name a subagent by its purpose, never by type. Claude Code-only instructions use the `{CLAUDE_ONLY:text}` placeholder in `STRUCTURE.md` §5.

## 6. Formatting

Use headings for distinct subjects, short paragraphs for explanations, numbered lists for sequences and tables for comparisons or schemas. Leave a blank line before lists and after headings. Keep related information together at a level readers can scan.

Use inline code for paths, field names and literal values. Put commands the User must run in fenced code blocks. Use fenced blocks with an appropriate language for schemas and examples; use a longer outer fence when showing nested code blocks. Reserve bold for terms or labels readers need to find again, and use italics sparingly.

Preserve exact field names, values, identifiers and required artifact sections. Formatting follows the artifact contract and workflow rules.
