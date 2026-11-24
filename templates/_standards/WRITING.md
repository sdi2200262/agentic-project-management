# APM Writing Standards

These standards guide template authors and maintainers in writing complete, concise runtime instructions and specifying their outputs. `WORKFLOW.md` specifies the workflow, `TERMINOLOGY.md` defines terms and `STRUCTURE.md` defines file organization, ownership and formats.

## 1. Write for the Reader

State what the reader needs to do and give the context to do it. Introduce each role's responsibilities and place in the session, then say how to take it on or continue it. Guides identify their readers and procedure. Address the acting agent as "you" and other roles in the third person. Describe workflow behavior by role and address authoring guidance to maintainers.

Write for the sources, authority and responsibilities each reader actually has. Explain an unfamiliar APM concept when the agent first needs it. Use the terms in `TERMINOLOGY.md` consistently and ordinary English elsewhere; do not introduce shorthand as an undefined workflow concept. Distinguish Task state from Task outcome even where both schemas use `status`.

## 2. Keep Instructions Aligned

Use parallel wording for equivalent triggers, actions, waits, approvals and completion conditions, varying only actual role, input or action differences. Keep the shared APM explanation aligned and add each role's place and responsibilities. When changing a rule or contract, check its counterparts and update affected standards, runtime files, formats and examples together.

Shared instructions must be directly usable by every intended reader, without assuming another role's knowledge, authority or place in the workflow. Put brief application notes beside role-specific references when only context differs; keep different responsibilities in their role-specific instructions. In particular, keep shared communication general and explain each role's APM orientation beside its reference to that guidance.

## 3. Use Plain Language

Open with the substance. Use concrete subjects, active verbs and familiar words. Keep each sentence to one main thought and say each point once. Keep related words together and prerequisites before the actions that need them.

Runtime chat follows the User's preferences, with a casually formal default. Communication with other agents and the system is formal and technical, with the same clarity and concision. State claims at the certainty the evidence supports; name consequential uncertainty and its cause. Retained observations keep their conditions and sources rather than becoming universal instructions.

## 4. Make Procedures Actionable

State the trigger, required inputs, action and completion condition. Use numbered steps for sequences and lists for independent items. Keep role-specific responsibilities, scope and operating context in role files; put shared procedural details in their owning guides and link to them. Explain a rule's reason only when it helps the agent use it.

In workflow standards, state the required behavior and identify the responsible role or artifact. In runtime instructions, write required actions as imperatives. Identify defaults and the criteria for choosing differently; use "may" for permitted options. Required procedures remain in force unless the User explicitly agrees to a specific exception. Choices within agreed authority do not need new approval. For approval gates, state the decision, when to wait and how to handle corrections. Follow the shared approval guidance instead of adding a gate to every action.

Keep ordinary transitions in sequence; use section references for other branches. Describe what agents should communicate rather than prescribing exact replies. Include examples only when they resolve ambiguity, and present them as illustrations. Preserve role boundaries, approvals and artifact contracts.

## 5. Request Useful Output

| Reader | Output needs |
|---|---|
| User | Work reports, recaps and useful progress updates explain where the work stands, what results mean and what happens next, within the agent's role and known context. Role instructions specify the relevant APM orientation. Progress updates state a meaningful change and when the User is next needed; reports give results, evidence, consequential limits and next action. Other replies lead with the answer, finding, proposal or question. Explain APM roles, procedures and conversations naturally in relation to the current work; exact IDs and conversation numbers appear where needed to act or distinguish agents. |
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
