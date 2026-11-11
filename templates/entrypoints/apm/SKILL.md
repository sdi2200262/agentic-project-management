---
name: apm
description: Plan and coordinate work through an Agentic Project Management (APM) session. Use when the User explicitly requests APM or wants to perform an action within an existing APM session. For substantial work that may benefit from structured planning and coordination, read this skill to assess whether to suggest APM.
---

# APM {VERSION} - Entry

Agentic Project Management (APM) is a spec-driven multi-agent framework for AI-assisted software engineering. It preserves intent in planning documents, distributes work across agent conversations and records progress outside those conversations to support work beyond an agent's context window.

An APM session has two phases. During planning, a Planner works with the User to write the Spec, which defines what to build, and the Plan, which divides the work into Stages and Tasks, for the User's approval. During implementation, a Manager coordinates the work through subagent workers and separate Worker conversations where useful, reviews results and maintains the session's planning documents, progress tracking and Memory.

APM encourages User involvement that preserves understanding and authority over the work. The User may choose its form and frequency, from APM's User-mediated coordination between Manager and Worker conversations, to review checkpoints wherever they find useful, to fully automated execution through the Manager, or any combination of these.

If the User is considering APM, explain how it could support their work and agree whether to start a session. An explicit request to start APM is enough to follow the relevant initiation instructions. Within an established session, follow your loaded role instructions for ongoing work, including checking tasks or reports. Use the table below when you need instructions for another action.

Select the instructions for the User's request and your role in this conversation. If you cannot determine which instructions apply, ask the User.

Once initiated, continue as the same APM agent in this conversation, preserving your role and Worker identity. Stay within the files permitted by your role's instructions. Read another agent's instructions or working files only when your role's instructions permit it or the User explicitly authorizes it. Do not switch to another role or Worker identity; each APM agent needs its own conversation.

Read the selected instructions and follow them, including their required files. When the table names a section, follow that section without repeating initiation.

| Requested action | Instructions |
|---|---|
| Start planning | `{SKILL_PATH:apm-1-initiate-planner}` |
| Start or continue as Manager in a new conversation | `{SKILL_PATH:apm-2-initiate-manager}` |
| Start or continue as a Worker in a new conversation | `{SKILL_PATH:apm-3-initiate-worker}`; use the User's agent ID |
| Check tasks as a registered Worker | `{SKILL_PATH:apm-3-initiate-worker}` §2.1 |
| Check tasks before Worker registration | `{SKILL_PATH:apm-3-initiate-worker}`; use the User's agent ID |
| Check reports as Manager | `{SKILL_PATH:apm-2-initiate-manager}` §2.2; use any agent IDs the User supplied |
| Prepare a Manager Handoff | `{SKILL_PATH:apm-6-handoff-manager}` |
| Prepare a Worker Handoff | `{SKILL_PATH:apm-7-handoff-worker}` |
| Recover an APM agent's working context | `{SKILL_PATH:apm-9-recover}` |
| Summarize this APM session | `{SKILL_PATH:apm-8-summarize-session}`; a new conversation needs no APM role |
| Join the Message Bus as an agent outside APM | `{SKILL_DIR:apm-communication}/bus-integration.md` |
