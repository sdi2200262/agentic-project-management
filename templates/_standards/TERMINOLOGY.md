# APM Terminology

This document defines APM's formal terms for template authors and maintainers. Agents never read `_standards/` files at runtime. They learn the terms from the command skills, shared skills and guides, so those files use each term exactly as defined here. `WORKFLOW.md` describes how the workflow uses the terms.

A term is defined when it names a part of the workflow an agent must find, or one of several explicit options an agent must choose between. Formal terms are capitalized. Terms are ordered so that each definition uses only terms defined before it.

---

## Roles

| Term | Definition |
|---|---|
| **Planner** | The agent that plans the project with the User. It works in a single conversation. |
| **Manager** | The agent that coordinates implementation: it assigns work, reviews results and keeps the project records. One Manager works at a time. |
| **Worker** | An agent that carries out the work the Manager assigns in one area of the project. Each area has its own Worker. |

---

## Phases

| Term | Definition |
|---|---|
| **Planning Phase** | The Planner works with the User to define the project and plan its work. |
| **Implementation Phase** | The Manager and Workers carry out the planned work until the project is complete. |
| **APM session** | One run of both phases on one set of `.apm/` files, from planning until the implementation is complete. |

---

## Procedures

Each procedure is a part of the workflow. The first six each have their own guide; Handoff has its own command skills.

| Term | Performed by | Definition |
|---|---|---|
| **Context Gathering** | Planner | Exploring the project and questioning the User in three rounds, ending with a summary that the User approves. |
| **Work Breakdown** | Planner | Turning the gathered context into the documents that define what to build, how the work is divided and how it is performed. |
| **Task Assignment** | Manager | Choosing which work to send next and to which Worker, and writing its instructions. |
| **Task Execution** | Worker | Carrying out assigned work, validating it and fixing what fails. |
| **Task Logging** | Worker | Recording the outcome of assigned work and reporting it to the Manager. |
| **Task Review** | Manager | Reviewing reported work, deciding the next action and updating the project records. |
| **Handoff** | Manager, Worker | Moving a role from its current conversation to a new one when context runs low or the User asks. The outgoing agent records what the incoming agent needs to continue. Each role's conversations are numbered, so a Handoff goes from Manager conversation 1 to Manager conversation 2. |

---

## Planning documents

The Planner writes these during Work Breakdown, in this order.

| Term | Definition | Location |
|---|---|---|
| **Spec** | What to build: design decisions and constraints. | `.apm/spec.md` |
| **Plan** | How the work is divided, ordered and assigned to Workers, with validation criteria and dependencies. | `.apm/plan.md` |
| **Rules** | Conventions that apply to all or most of the work. They are kept in the `APM_RULES` block of `CLAUDE.md` for Claude Code, or of `AGENTS.md` for other assistants. | Project root |

---

## Work units

| Term | Definition |
|---|---|
| **Task** | A bounded unit of work in the Plan, assigned to one Worker, with an objective, deliverables, validation criteria and dependencies. Its steps are ordered but not validated separately. |
| **Stage** | A group of related Tasks that delivers a coherent part of the project. Stages run in order. |

### Task dependencies

A Task depends on another when it needs that Task's output.

| Term | Definition |
|---|---|
| **Same-Worker dependency** | The Worker that did the earlier Task also does the dependent one, so it has already worked with the output. |
| **Cross-Worker dependency** | A different Worker did the earlier Task, so the dependent Task's Worker has not seen the output. |

### Task states

| Term | Definition |
|---|---|
| **Waiting** | At least one dependency is not complete. |
| **Ready** | All dependencies are complete, so the Task can be sent to its Worker. |
| **Active** | Sent to its Worker. The Task stays Active through execution and review until the Manager makes a final decision. |
| **Done** | The Manager has made a final decision on the Task. Done is final. |

### Task outcomes

The Worker records one outcome when it finishes a Task.

| Term | Definition |
|---|---|
| **Success** | The objective is achieved and every validation criterion passed. |
| **Partial** | Some progress is made, and the Worker needs guidance to continue. |
| **Failed** | The Worker could not achieve the objective. |

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
| **Task Log** | The Worker's record of one Task: outcome, validation, deliverables and findings. | `.apm/memory/stage-<NN>/task-<NN>-<MM>.log.md` |
| **Handoff Log** | The outgoing agent's record, during Handoff, of working knowledge that the Task Logs do not hold. | `.apm/memory/handoffs/<agent>/handoff-<NN>.log.md` |
| **Index** | The overview of project history: durable notes and a summary of each completed Stage. | `.apm/memory/index.md` |
| **Memory** | The folder of project history: the Index, Task Logs and Handoff Logs. | `.apm/memory/` |
| **Tracker** | The Manager's live record of the project: Task states, each Worker's current conversation, version control and short-lived notes. | `.apm/tracker.md` |

---

## Message Bus

| Term | Definition | Location |
|---|---|---|
| **Message Bus** | The file-based system through which agents exchange messages. Each agent has its own folder, each file holds at most one message, and the User delivers every message. | `.apm/bus/` |
| **Task Prompt** | The Manager's message giving a Worker everything needed to execute and validate a Task or batch. | |
| **Task Report** | The Worker's short message to the Manager with a Task's outcome and the path to its Task Log. | |
| **Handoff Prompt** | The outgoing agent's message telling the incoming agent the current state, what to read and what to do next. | |
| **Task Bus** | The file that carries Task Prompts to a Worker. | `<worker>/task.md` |
| **Report Bus** | The file that carries a Worker's Task Reports to the Manager. | `<worker>/report.md` |
| **Handoff Bus** | The file that carries a Handoff Prompt to the incoming agent. | `<agent>/handoff.md` |

---

## Plain terms

These terms keep ordinary lowercase but have a fixed meaning in APM templates.

| Term | Definition |
|---|---|
| **recovery** | Rebuilding a Manager's or Worker's working context after compaction or a lost conversation. It does not start the role's next numbered conversation. |
| **dependency graph** | The diagram in the Plan showing Tasks, their Workers and their dependencies. |
| **follow-up Task** | A Task that Task Review sends back to the same Worker with a revised Task Prompt. It keeps its Task ID and stays Active. |
| **archive** | A snapshot of an APM session's `.apm/` files, stored in `.apm/archives/`. |
| **session summary** | An optional document, `.apm/session-summary.md`, describing an APM session's scope, outcomes, findings, open issues and current state. |
