# APM Terminology

This document defines APM's formal terms for template authors and maintainers. Runtime command skills, shared skills and guides teach agents these terms and use them exactly as defined here. `WORKFLOW.md` describes how the workflow uses the terms.

A term is defined when it names a part of the workflow an agent must find, or one of several explicit options an agent must choose between. Formal terms are capitalized. Terms are ordered so that each definition uses only terms defined before it.

---

## Roles

| Term | Definition |
|---|---|
| **Planner** | The agent that plans the work with the User. It works in a single conversation. |
| **Manager** | The agent that coordinates implementation: it assigns work to Workers or undertakes it, reviews results and keeps the APM files current. One Manager works at a time. |
| **Worker** | An agent that carries out the work the Manager assigns in one area of the work. Each Worker has its own conversation with the User. |

---

## Phases

| Term | Definition |
|---|---|
| **Planning Phase** | The Planner works with the User to establish the session’s intended outcomes, requirements and approach, then prepares the approved Spec, Plan and session setup for implementation. |
| **Implementation Phase** | After planning, the Manager coordinates the planned work, with Workers as needed. They carry out and validate the work, recording results and remaining limits until completion or the User stops. |
| **APM session** | An agreed body of work taken through planning and implementation. It may address a larger goal in full or deliver a coherent part of it. It ends when the work is complete or the User stops early; later sessions can build on its results and findings. |

---

## Procedures

Each procedure is a part of the workflow. The first six each have their own guide; Handoff has its own command skills.

| Term | Performed by | Definition |
|---|---|---|
| **Context Gathering** | Planner | Defining the session's work through User exchanges on three discovery topics, with research, analysis, design and preparation as needed, ending with approval of the complete understanding. |
| **Work Breakdown** | Planner | Developing how the work is divided as context is gathered, then turning the approved understanding into the Spec and Plan, each approved separately, and proposing needed updates to `AGENTS.md`. |
| **Task Assignment** | Manager | Choosing which work to start next, assigning it to a Worker or undertaking it itself, and preparing its context. |
| **Task Execution** | Manager, Worker | Carrying out assigned work, validating it and fixing what fails. |
| **Task Logging** | Manager, Worker | Recording a Task's outcome; Workers also report each attempt to the Manager. |
| **Task Review** | Manager | Reviewing reported work, deciding the next action and updating the APM files. |
| **Handoff** | Manager, Worker | Preparing continuation in a new conversation when context runs low or the User asks. The outgoing agent records the context and explains how to continue; by default the User starts the incoming conversation. Each role's conversations are numbered. |

---

## Planning documents

The Planner writes these during Work Breakdown, in this order.

| Term | Definition | Location |
|---|---|---|
| **Spec** | What the session is intended to achieve: outcomes, requirements, design decisions and constraints. | `.apm/spec.md` |
| **Plan** | How to achieve the Spec’s intended outcomes: work divided into Stages and Tasks, ordered and assigned to the Manager or Workers, with dependencies and validation criteria. | `.apm/plan.md` |

---

## Work units

| Term | Definition |
|---|---|
| **Task** | A bounded unit of work in the Plan, assigned to the Manager or one Worker, with an objective, deliverables, validation criteria and dependencies. Its ordered steps share the Task's validation. |
| **Stage** | A group of related Tasks that delivers a coherent part of the work. Stages run in order, with a User pause before advancing unless explicitly agreed otherwise. |

### Task dependencies

A Task depends on another when it needs that Task's output.

| Term | Definition |
|---|---|
| **Same-Worker dependency** | Both Tasks are assigned to the same agent. |
| **Cross-Worker dependency** | The Tasks are assigned to different agents, including the Manager. |

### Task states

| Term | Definition |
|---|---|
| **Waiting** | At least one dependency is not complete. |
| **Ready** | All dependencies are complete, so the assigned agent can start the Task. |
| **Active** | Started by the Manager or sent to its Worker. The Task stays Active through execution and review until the Manager makes a final decision. |
| **Done** | The Manager has made a final decision on the Task. Done is final. |

### Task outcomes

The Manager records an outcome when concluding its Task; a Worker records one for each reported attempt.

| Term | Definition |
|---|---|
| **Success** | The objective is achieved and every validation criterion passed. |
| **Partial** | Some work or required validation remains. |
| **Failed** | The objective was not achieved despite attempts to fix the problem. |

### Task Dispatch

Task Dispatch is how the Manager sends Ready Tasks to Workers. It takes one of three forms.

| Term | Definition |
|---|---|
| **Single dispatch** | One Task sent to one Worker. |
| **Batch dispatch** | Several Tasks sent to the same Worker together, executed in order. |
| **Parallel dispatch** | Tasks or batches sent to different Workers at the same time. |

---

## Memory and state

| Term | Definition | Location |
|---|---|---|
| **Task Log** | The responsible agent's record of the work: outcome, validation, deliverables and findings. The Manager writes one log when concluding its Task; Worker follow-ups have separate numbered logs linked to earlier attempts. | `.apm/memory/stage-<NN>/`; filenames in Task Logging §5.1 |
| **Handoff Log** | The record a Manager or Worker conversation writes at its Handoff: what it did and the working knowledge that the Task Logs do not hold. | `.apm/memory/handoffs/<agent-slug>/handoff-<NN>.log.md` |
| **Index** | The overview of the APM session's history: lasting findings with sources and a table of Stage outcomes linking to their summaries. | `.apm/memory/index.md` |
| **Memory** | The APM session's work history and continuation context: Task outcomes, lasting findings, Stage summaries and Handoff Logs. | `.apm/memory/` |
| **Tracker** | The Manager's current coordination: Task states, next actions and work locations; pending decisions and blockers; Manager and Worker conversation numbers and context gaps. Resolved history belongs in Memory. | `.apm/tracker.md` |

---

## Message Bus

| Term | Definition | Location |
|---|---|---|
| **Message Bus** | The file-based system through which agents exchange messages. Each agent has its own folder, each file holds at most one message, and the User delivers messages by default unless another coordination arrangement is explicitly agreed. | `.apm/bus/` |
| **Task Prompt** | The Manager's message giving a Worker everything needed to execute and validate a Task or batch. | |
| **Task Report** | The Worker's short message to the Manager with a Task's outcome and the path to its Task Log, or with the outcomes of a batch. | |
| **Handoff Prompt** | The outgoing agent's message telling the incoming agent the current state, what to read and what to do next. | |
| **Task Bus** | The file that carries Task Prompts to a Worker. | `<worker>/task.md` |
| **Report Bus** | The file that carries a Worker's Task Reports to the Manager. | `<worker>/report.md` |
| **Handoff Bus** | The file that carries a Handoff Prompt to the incoming agent. | `<agent-slug>/handoff.md` |

---

## Plain terms

These terms keep ordinary lowercase but have a fixed meaning in APM templates.

| Term | Definition |
|---|---|
| **conversation** | One chat with the Planner, Manager or a particular Worker within a session. Each agent has its own conversation; Manager and Worker Handoffs start that agent’s next numbered conversation in the same session. Compaction and recovery preserve its conversation and number. |
| **recovery** | Rebuilding a Manager's or Worker's working context after compaction or a lost conversation. It keeps the role's conversation number. |
| **follow-up Task** | Another Worker attempt at a Task after review, delivered through a revised Task Prompt. It keeps its Task ID and stays Active. |
| **archive** | A snapshot of an APM session's `.apm/` files, stored in `.apm/archives/`. Archiving is optional; later sessions can use archives as context. |
| **session summary** | An optional document, `.apm/session.summary.md`, describing an APM session's scope, outcomes, consequential findings, accepted limitations, open issues and current state. |
