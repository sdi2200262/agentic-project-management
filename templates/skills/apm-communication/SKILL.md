---
name: apm-communication
description: How APM agents write to the User, to each other and through the file-based Message Bus.
---

# APM {VERSION} - Communication

The Planner, the Manager and Workers read this skill. It covers how you write to the User, how you write messages and APM files for other agents, how you use subagents, and the Message Bus. Your role's guides define the formats of the files you write.

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
- **APM terms.** The first time the User meets an APM term in the conversation, such as Task, Stage, Worker or Handoff, explain it in a few words. Do not cite guides, section numbers or step names to the User. Give reasons about the work, such as a risk, a dependency or what later work needs, not "the procedure says". During the question rounds, follow `{GUIDE_PATH:context-gathering}` §2 for language.
- **Decisions.** Present the proposal or decision first, then the evidence, trade-offs and uncertainty that matter. A question says what you need to know and why, with any real options. A proposal does not replace a required approval: stop at the points your procedure sets, apply corrections and ask again.
- **User actions.** When the User has to act, say exactly what to do and where: the skill to invoke, the chat to invoke it in and any argument, such as "invoke `apm-5-check-reports frontend-agent` in the Manager's chat". Name skills without a command prefix, because assistants invoke skills differently. Say when the User needs a new chat.

## 2. Writing for Other Agents

Task Prompts, Task Reports, Handoff Prompts, logs and planning documents are read by an agent that has the files and the workspace, but not your conversation. Write them so they make sense on their own:

- Follow their formats exactly. Other agents and the CLI rely on the field names, values, paths and sections.
- Write about the work, not your process: what was done, decisions with their reasons, evidence, open issues and the paths the reader needs.
- Give each fact one home, and check claims against their source. Separate what you verified from what you assume.
- Keep free text short. Use plain words rather than procedure names or section labels, except where a format asks for them.

## 3. Subagents

Use your assistant's own way to start subagents and new chats. When you use a subagent for research, tell it to read files and run checks without changing anything. A subagent used for troubleshooting may change files to test fixes. Give each subagent a focused question, the paths it needs and the findings to return, and verify its key findings against the source before you rely on them.

## 4. Message Bus

The Message Bus is a set of files in `.apm/bus/`, one folder per agent. The Planner creates it at the end of planning. A Worker's folder holds `task.md` for Task Prompts, `report.md` for Task Reports and `handoff.md` for a Handoff Prompt; the Manager's folder, `manager/`, holds only `handoff.md`.

A bus file is either empty or holds one message waiting for delivery. After you process an incoming message, clear its file before you write your outgoing one. Read a bus file before writing it, so your file tools accept the write.

An agent outside APM can join the bus without joining the workflow; `{SKILL_DIR:apm-communication}/bus-integration.md` describes how.

### 4.1 Bus Identity

A Worker's identity is its bus folder, `.apm/bus/<agent-slug>/`, set when it registers. Every Task Prompt names the Worker it is for in its `agent` field.

### 4.2 Agent ID Resolution

When the User gives an agent ID with `apm-3-initiate-worker`, `apm-4-check-tasks` or `apm-5-check-reports`, match it against the bus folder names: an exact match first, then a prefix, then the closest plausible name. Use a unique exact or prefix match directly. Confirm any other single match with the User, and list several plausible matches for the User to choose from. If `.apm/bus/` does not exist, tell the User that planning has not created the Message Bus yet.

### 4.3 Agent Slugs

Agent slugs are lowercase and hyphenated, such as `frontend-agent`. The Plan names every Worker by its slug, and the Manager's folder is `manager`.
