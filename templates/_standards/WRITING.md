# APM Writing Standards

These standards guide template authors and maintainers in writing complete, concise runtime instructions and specifying their outputs. `WORKFLOW.md` specifies the workflow, `TERMINOLOGY.md` defines terms and `STRUCTURE.md` defines file organization, ownership and formats.

## 1. Write for the Reader

State what the reader needs to do, with the context needed to do it. Role introductions describe responsibilities and place in the session, then tell an initiating agent to take on or continue the role. Guides identify their readers and procedure. Operating instructions address the applicable agent as "you" and use third person for other roles. Workflow descriptions state what each role does; authoring guidance addresses template authors and maintainers.

Write for the sources, authority and responsibilities each reader actually has. Explain an unfamiliar APM concept when the agent first needs it. Use the terms in `TERMINOLOGY.md` consistently and ordinary English elsewhere; do not introduce shorthand as an undefined workflow concept. Distinguish Task state from Task outcome even where both schemas use `status`.

## 2. Keep Instructions Aligned

Use parallel wording for equivalent triggers, actions, waits, approvals and completion conditions, varying only actual role, input or action differences. Keep the shared APM explanation aligned and add each role's place and responsibilities. Do not make one role translate another's instructions. When changing a rule or contract, check its counterparts and update affected standards, runtime files, formats and examples together.

## 3. Use Plain Language

Open with the substance. Use concrete subjects, active verbs and familiar words. Keep each sentence to one main thought and say each point once. Keep related words together and prerequisites before the actions that need them.

Runtime chat follows the User's preferences, with a casually formal default. Communication with other agents and the system is formal and technical, with the same clarity and concision. State claims at the certainty the evidence supports; name consequential uncertainty and its cause. Retained observations keep their conditions and sources rather than becoming universal instructions.

## 4. Make Procedures Actionable

State the trigger, required inputs, action and completion condition. Use numbered steps for sequences and lists for independent items. Keep role-specific responsibilities, scope and operating context in role files; put shared procedural details in their owning guides and link to them. Explain a rule's reason only when it helps the agent use it.

In runtime instructions, write required actions as imperatives. Identify defaults and the criteria for choosing differently; use "may" for permitted options. Required procedures remain in force unless the User explicitly agrees to a specific exception. Choices within agreed authority do not need new approval. For approval gates, state the decision, when to wait and how to handle corrections. Follow the shared approval guidance instead of adding a gate to every action.

Keep ordinary transitions in sequence; use section references for other branches. Describe what agents should communicate rather than prescribing exact replies. Include examples only when they resolve ambiguity, and present them as illustrations. Preserve role boundaries, approvals and artifact contracts.

## 5. Request Useful Output

| Reader | Output needs |
|---|---|
| User | Chat work reports and progress updates briefly name the relevant APM position and connect it to actual work, then give useful results, evidence, limits and next action. Other replies lead with the answer, finding, proposal or question. Role explanations are plain and relevant to the current action. |
| Other agents | Concise, structured requirements, outcomes, decisions with reasons, evidence, open issues and source paths. Named readers can consult permitted sources, but do not share the writer’s conversation. |
| System | Exact schemas, field names, values, paths and bus separators. |

Name each document's readers, purpose and sources. Define what information qualifies for each section and when it should be replaced or removed. These content contracts supplement the shared writing rule; they do not repeat it. Require concise, explicit outputs using prescribed formats. Preserve essential prompt context for readers without access to its source, and consequential conclusions with links in summaries. Keep validation counts, accepted deviations and unrun checks visible; acceptance does not make an unmet check pass.

Shared writing rules belong in `apm-communication`; procedures add only what their own outputs need.

## 6. Skills and Native Actions

Runtime directions name the action, conversation and any agent ID. Conversations may use different assistants and APM formats, so the sender’s installation does not determine how the receiver is invoked. Keep concrete invocation examples in installation and startup guidance; shared runtime prose describes the requested action.

Describe assistant actions in plain English. Role instructions define delegation policy; procedure guides specify the work and evidence needed. Keep assistant-specific instructions in the supported placeholders defined in `STRUCTURE.md`.

## 7. Formatting

Use headings for distinct subjects, paragraphs for explanations, lists for parallel items or steps and tables for comparisons. Leave a blank line before lists and after headings.

Use inline code for paths, field names and values, and fenced code blocks for commands, schemas and examples. Use a longer outer fence for nested code blocks. Reserve bold for terms or labels the reader needs to find again.
