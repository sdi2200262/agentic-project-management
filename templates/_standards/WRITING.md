# APM Writing Standards

These standards guide template authors. Authors implement them in the command skills, shared skills and guides agents read at runtime. Apply them to both the instructions and the output those instructions request. Terms follow `TERMINOLOGY.md`; document and artifact structure follows `STRUCTURE.md`.

## 1. Relation to Elements of Style

APM follows the plain-English rules of the Elements of Style skill for agents: open with the substance, say each point once in everyday words, keep sentences to one main thought, state claims at the certainty the evidence supports, and choose prose, lists or tables by the content. APM adapts those rules where its work needs something else:

- **Formal terms.** Elements of Style keeps invented terms out. APM defines a small set of formal terms in `TERMINOLOGY.md` so agents can find each part of the workflow and choose between explicit options. Use them exactly as defined and add no other labels.
- **Fixed formats.** Artifacts and messages follow their contracts, because other agents and the CLI rely on their fields, paths and sections.
- **Agent readers.** Most runtime text is read by an agent that has the files and the workspace but not the writer's conversation. It needs exact paths, conditions and completion criteria.
- **Runtime copy.** Agents never read these standards. The rules agents apply when they write live in the `apm-communication` shared skill, so that skill must stay consistent with this file.

## 2. Write for the Reader

Before writing, identify the reader, the decision or action they need to take, and the context they already have. State the rule, condition and required action directly. Keep enough explanation to make the instruction unambiguous.

Define required results, constraints and decision criteria. Use the enumerated values required by artifact schemas. Preserve authority, approval gates and artifact contracts.

## 3. Use Plain, Precise Language

Keep each sentence to one main thought. Prefer concrete subjects, active verbs and familiar words. Keep related words together and put prerequisites before the steps that depend on them. Use the passive when the receiver of an action is the subject that matters.

Use a casually formal tone in chat and match authored prose to its reader and purpose. State claims at the certainty the evidence supports; identify consequential uncertainty and its cause. Hedge claims about agent behavior, such as "costs may rise and performance may drop".

Use formal APM terms consistently as defined in `TERMINOLOGY.md`. Use ordinary English capitalization for other labels and section names. Where the agent first meets an APM concept, such as a Handoff, a batch or a follow-up Task, explain it in a sentence or two so the agent understands the system it works in, and leave the full detail to the file that owns the concept.

Speak of the work and what the APM session builds, not of a "project": a session may cover only part of a larger goal.

Runtime instructions address the reading agent as "you"; use third person for other roles. Shared skills distinguish role responsibilities explicitly. Standards describe the workflow in third person and may address maintainers directly.

## 4. Make Procedures Actionable

Use numbered steps for ordered actions and lists for independent items. State the trigger, prerequisites, decisions, actions and completion condition. Include response handling whenever the agent must pause for the User: what approval allows, how corrections are applied, and when to ask again.

Write actions as imperatives. Use "must" only for hard requirements on artifacts or conditions, where an imperative doesn't fit. Avoid "should", which reads as optional.

Use natural conditions with a clear action. When an action is required, say so directly and say when it applies. Where the agent must judge, give it signs it can check rather than words such as "substantial" or "when helpful". State a default when it resolves a consequential edge case. When an agent must stop short of acting on its own, say what it does instead, such as presenting options with a recommendation.

Give a rule's reason when it helps the reader apply it correctly. Keep examples for non-obvious cases. Describe ordinary sequential transitions naturally; use section references for navigation and non-sequential jumps.

## 5. Request Useful Communication

Agents write for three readers. Instructions say what each output must contain for its reader; the shared rules live in `apm-communication`, and each procedure adds only what its own messages need.

- **The User.** Replies follow the Elements of Style chat rules: open with the answer, outcome, finding, proposal or question, give only the details needed to understand or act, and stay within the default reply lengths in `apm-communication` §2 unless the User asks otherwise. Explain an APM term the first time the User meets it, and give reasons about the work rather than citing APM procedures.
- **Other agents.** Task Prompts, Task Reports, Handoff Prompts, logs and planning documents are self-contained for a reader without the writer's conversation. Free text is about the work, not the writer's process: outcomes, decisions with reasons, evidence, open issues and paths. Each fact has one home.
- **The system.** Bus files, frontmatter and paths follow their contracts exactly, because the CLI, the bus protocol and other agents parse them.

| Situation | What the output conveys |
|---|---|
| Questions | The relevant understanding or gap, a focused question, and any context or options needed to answer. |
| Proposals | The proposed result, consequential choices and their reasons, and the decision or approval needed. |
| Progress | A meaningful finding, change or blocker, plus the next action when relevant. |
| Completion | Outcome, deliverables, validation evidence, limits and any required action. |
| Review | Findings against objectives and evidence, their implications, and the resulting action. |
| Continuity | Current state, decisions and reasons, unresolved issues, source paths and concrete resumption steps. |

## 6. Skills and Native Actions

Refer to command skills by name, and tell the User to invoke them without a command prefix, such as "invoke `apm-3-initiate-worker` in a new chat". Refer to what the User gives with a skill by what it is, such as "the agent ID the User gave with this skill".

Keep assistant-specific syntax out of templates: describe the action in plain English, such as "use a subagent to research…", and let each agent use its own assistant's way of doing it. Delegation instructions state when to use a subagent, its purpose, inputs and required findings. Name a subagent by its purpose, never by type. Claude Code-only instructions use the `{CLAUDE_ONLY:text}` placeholder in `STRUCTURE.md` §5.

## 7. Formatting

Use headings for distinct subjects, short paragraphs for explanations, numbered lists for sequences and tables for comparisons or schemas. Leave a blank line before lists and after headings.

Use inline code for paths, field names and literal values. Put commands the User must run in fenced code blocks. Use fenced blocks with an appropriate language for schemas and examples; use a longer outer fence when showing nested code blocks. Reserve bold for terms or labels readers need to find again, and use italics sparingly.

Preserve exact field names, values, identifiers and required artifact sections.
