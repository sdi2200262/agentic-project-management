---
name: apm-communication
description: How APM agents write to the User, to each other and through the file-based Message Bus.
---

# APM {VERSION} - Communication

The Planner, the Manager and Workers read this skill. It covers how you write to the User, how you write messages and APM files for other agents, and the Message Bus. Your role's guides define the formats of the files you write.

## 1. Communicating with the User

Write plain English for the User, with the conversation as their context. Use a casually formal tone, as with a colleague.

Open with what the User asked for or needs: the answer, outcome, finding, proposal or question. Then give only the reasons and details they need to understand it or act, most important first, and end on the last useful point. Keep the whole reply within these defaults, unless the User asks for a different length or level of detail:

| Reply | Word ceiling |
|---|---:|
| Direct answer | 100 |
| Explanation or work report | 250 |
| Broad plan or review | 500 |

Put longer detail in the relevant APM file and point to it. Before sending a longer reply, check that it opens with the substance and fits its ceiling.

- **Wording.** Use everyday words, concrete subjects and active verbs. Keep each sentence to one main thought and say each point once. State claims at the certainty the evidence supports, and put limits beside the claims they qualify.
- **Form.** Use short paragraphs, lists for steps or parallel items and tables for comparisons. Put commands in code blocks, and paths and values in inline code.
- **APM terms.** Explain an APM term, such as Task, Stage, Worker or Handoff, in a few words the first time the User meets it.
- **Reasons.** Explain decisions through their effect on the work: its risks, dependencies and later needs. Refer to APM guides when explaining the workflow itself.
- **Decisions.** Present the proposal or decision first, then the evidence, trade-offs and uncertainty that matter. A question says what you need to know and why, with any real options. At each required approval, stop for the User's decision, apply corrections and ask again.
- **User actions.** When the User has to act, say exactly what to do and where: the skill to invoke, the chat to invoke it in and any argument, for example, `apm-5-check-reports frontend-agent` in the Manager's chat. Name skills without a command prefix, because assistants invoke skills differently. Say when the User needs a new chat. Keep repeated delivery instructions conditional when delivery is unconfirmed, for example with "if you haven't already". A populated Task Bus does not establish whether execution has started.

## 2. Writing for Other Agents

Task Prompts, Task Reports, Handoff Prompts, logs and planning documents are read by an agent that has the files and the workspace, but not your conversation. Write them so they make sense on their own:

- Follow their formats exactly. Other agents and the CLI rely on the field names, values, paths and sections.
- Record the work: what was done, decisions with their reasons, evidence, open issues and the paths the reader needs.
- Give each fact one authoritative home; reports and summaries carry its consequential findings with source paths. Check claims against their source. Separate what you verified from what you assume.
- Keep free text short and use plain words; follow the format where it requires specific labels.

## 3. Message Bus

The Message Bus is a set of files in `.apm/bus/`, one folder per agent. The Planner creates it at the end of planning. Each folder is named by the agent's slug, lowercase and hyphenated, such as `frontend-agent`; the Plan names every Worker by its slug, and a Worker's folder is its identity. A Worker's folder holds `task.md` for Task Prompts, `report.md` for Task Reports and `handoff.md` for a Handoff Prompt; the Manager's folder, `manager/`, holds only `handoff.md`.

A bus file is either empty or holds one temporary message. After you process an incoming message, clear its file before you write your outgoing one. Read a bus file before writing it, compose the new message from the current assignment and findings, and verify the written content before announcing it. The previous message may already have been cleared.

An agent outside APM can join the bus without joining the workflow; `{SKILL_DIR:apm-communication}/bus-integration.md` describes how.

### 3.1 Agent Slugs

Every Task Prompt and Task Report names its Worker by slug in its `agent` field. The Manager's folder is `manager`.

### 3.2 Agent ID Resolution

When the User gives an agent ID with `apm-3-initiate-worker`, `apm-4-check-tasks`, `apm-5-check-reports` or `apm-9-recover`, match it against the bus folder names: an exact match first, then a prefix, then the closest plausible name. Use a unique exact or prefix match directly. Confirm any other single match with the User, and list several plausible matches for the User to choose from. If `.apm/bus/` does not exist, tell the User that planning has not created the Message Bus yet.
