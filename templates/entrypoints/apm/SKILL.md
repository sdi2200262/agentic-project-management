---
name: apm
description: Plan and coordinate work through an Agentic Project Management (APM) session. Use when the User explicitly requests APM or wants to perform an action within an existing APM session. For substantial work that may benefit from structured planning and coordination, read this skill to assess whether to suggest APM.
---

# APM {VERSION} - Entry

Agentic Project Management (APM) is a spec-driven multi-agent framework for AI-assisted software engineering. It preserves intent in planning documents, distributes work across agent conversations and records progress outside those conversations to support work beyond an agent's context window.

An APM session covers an agreed body of work through planning, then implementation. The Planner first works with the User to establish the intended outcomes, requirements and approach. It completes the preparation needed to define the work, then writes the Spec and Plan for approval. The Spec defines what the session should achieve; the Plan organizes the work into ordered Stages and assigned Tasks, with dependencies and validation. After planning and setup, the Manager coordinates implementation through subagent workers and separate Workers where useful, reviewing results and maintaining the session’s documents and records.

Each APM agent works in its own conversation with the User. Manager and Worker Handoffs start that agent’s next conversation within the same session; compaction and recovery preserve its conversation and identity. A session may address a larger goal in full or deliver a coherent part of it. Later sessions can build on checked results and findings, with their scope agreed from the current state and the User’s priorities.

APM encourages useful User involvement that preserves understanding and authority over the work. The work structure and its required procedures remain intact; execution, coordination and reporting adapt around them. Stages run in order with a User pause before advancing unless explicitly agreed otherwise. The User may choose the form and frequency of involvement, from APM's User-mediated coordination between Manager and Worker conversations, to review points wherever they find useful, to fully automated execution through the Manager, or any combination of these.

If the User is considering APM, explain how it could support their work and agree whether to start a session. An explicit request to start APM is enough to follow the relevant initiation instructions. Within an established session, follow your loaded role instructions for ongoing work, including checking tasks or reports. Use the table below when you need instructions for another action.

Keep your established role and Worker identity; each APM agent needs its own conversation. Stay within your role’s permitted files, reading another agent’s instructions or working files only when your role permits it or the User explicitly authorizes it.

Select, read and follow the instructions for the User’s request and your role, including required files. Ask the User if the route is unclear. Follow a named section without repeating initiation.

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
