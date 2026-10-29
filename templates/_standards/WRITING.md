# APM Writing Standards

Write runtime instructions for the agent that must act on them. Apply these standards to both the instructions and the output they request. `WORKFLOW.md` defines behavior, `TERMINOLOGY.md` defines terms and `STRUCTURE.md` defines file structure and formats.

## 1. Write for the Reader

State what the reader needs to do, with the context needed to do it. Runtime instructions address the reading agent as "you" and use third person for other roles. Standards address template authors and maintainers.

Explain an unfamiliar APM concept when the agent first needs it. Use the terms in `TERMINOLOGY.md` consistently and ordinary English elsewhere.

## 2. Keep Instructions Aligned

Use the same wording for equivalent instructions and workflow branches. Vary only the role, inputs or actions that differ. When changing an instruction or contract, check its counterparts and update affected standards, runtime files, formats and examples together.

## 3. Use Plain Language

Open with the substance. Use concrete subjects, active verbs and familiar words. Keep each sentence to one main thought and say each point once. Keep related words together and prerequisites before the actions that need them.

Write casually formal chat replies and match documents to their reader and purpose. State claims at the certainty the evidence supports; name consequential uncertainty and its cause.

## 4. Make Procedures Actionable

State the trigger, required inputs, action and completion condition. Use numbered steps for sequences and lists for independent items. Put each rule where the agent applies it. Explain a rule's reason only when it helps the agent use it.

Write required actions as imperatives. Use "may" for options. For choices, give criteria the agent can check. For approval gates, state what needs approval, when to wait and how to handle corrections.

Keep ordinary transitions in sequence; use section references for other branches. Include examples only when they resolve ambiguity. Preserve role boundaries, approvals and artifact contracts.

## 5. Request Useful Output

| Reader | Output needs |
|---|---|
| User | Answer, outcome, finding, proposal or question first; then the evidence, limits and next action needed. Follow the shared reply lengths unless the User asks otherwise. |
| Other agents | Self-contained outcomes, decisions with reasons, evidence, open issues and source paths. The reader has the workspace, not the writer's conversation. |
| System | Exact schemas, field names, values, paths and bus separators. |

Give each fact one authoritative home. Reports and summaries preserve consequential findings with source paths. Keep validation counts, accepted deviations and unrun checks visible; acceptance does not make an unmet check pass.

Shared writing rules belong in `apm-communication`; procedures add only what their own outputs need.

## 6. Skills and Native Actions

Tell the User which skill to invoke, in which chat and with which argument. Name skills without a command prefix, since assistants invoke them differently.

Describe assistant actions in plain English. Each role's initiation skill owns its optional delegation guidance; procedure steps specify the work and evidence needed. Keep assistant-specific instructions in the supported placeholders defined in `STRUCTURE.md`.

## 7. Formatting

Use headings for distinct subjects, paragraphs for explanations, lists for parallel items or steps and tables for comparisons. Leave a blank line before lists and after headings.

Use inline code for paths, field names and values, and fenced code blocks for commands, schemas and examples. Use a longer outer fence for nested code blocks. Reserve bold for terms or labels the reader needs to find again.
