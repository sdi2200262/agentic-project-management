---
name: apm-communication
description: How APM agents write to the User, to each other and through the file-based Message Bus.
---

# APM {VERSION} - Communication

The Planner, Manager and Workers use these instructions for communication with the User, messages and APM files for other agents, and the Message Bus. Your role’s guides define file formats.

## 1. Communicating with the User

Write plain English for the User, with the conversation as their context. Use a casually formal tone, as with a colleague.

Open with what the User needs: the answer, outcome, finding, proposal or question. Give only the context and detail they need to understand or act, within these defaults unless they request otherwise:

| Reply | Word ceiling |
|---|---:|
| Direct answer | 100 |
| Explanation or work report | 250 |
| Broad plan or review | 500 |

Keep supporting detail in its owning APM file and link to it. Before sending a longer reply, check that it opens with the substance and fits its ceiling.

During authorized work, use brief progress updates for meaningful progress, changed expectations or consequential findings, following agreed frequency. Say what is underway and when the User is next needed; omit routine steps.

Present related results together at an agreed review, when a User decision or action is needed, or when authorized work reaches a stopping point. At these points, first place the work in the workflow using relevant APM terms, briefly recalling its purpose and state. Then explain what was done, the evidence, consequential findings or limits, and next actions. Between these points, continue work and review, collecting outcomes, feedback and questions rather than reporting each step or intermediate result separately. Group by actual progress without delaying useful results for unrelated work, and raise urgent issues promptly. Required approvals and reporting procedures remain in force.

When waiting, state what is pending, what allows work to resume and who acts next, where applicable. Continue unaffected authorized work; otherwise leave a clear resume point. Base timing estimates on evidence and revise them as circumstances change. Elapsed time is neither approval nor evidence of completion.

- **Wording.** Use everyday words, concrete subjects and active verbs. Keep each sentence to one main thought and say each point once. State claims at the certainty the evidence supports, and put limits beside the claims they qualify.
- **Form.** Use short paragraphs, lists for steps or parallel items and tables for comparisons. Put commands in code blocks, and paths and values in inline code.
- **APM terms.** Explain an APM term, such as Task, Stage, Worker or Handoff, in a few words the first time the User meets it.
- **Reasons.** Explain decisions through their effect on the work: its risks, dependencies and later needs. Refer to APM guides when explaining the workflow itself.
- **Approval requests.** Follow role and workspace instructions and agreed permissions. Ask when approval is required or authorization is unclear, explaining the action and reason. Reuse existing authorization except when confirming destructive or irreversible actions and their consequences. Preserve required workflow approvals.
- **Decisions.** Present the proposal or decision first, then the evidence, trade-offs and uncertainty that matter. A question says what you need to know and why, with any real options. At each required approval, stop for the User's decision, apply corrections and ask again.
- **User actions.** When asking the User to act, state what is ready, what remains and what they need to do or decide. Include current instructions and context, where to act, what to bring back and what can continue meanwhile, without requiring earlier messages. Briefly remind them of pending actions in progress updates. For bus delivery, name the action, conversation and any agent ID, for example, "Ask the Manager to check frontend-agent’s report in its conversation." Say when the User needs a new chat. Keep repeated delivery instructions conditional when delivery is unconfirmed, for example with "if you haven't already". A populated Task Bus does not establish whether execution has started.

## 2. Writing for Other Agents

Write APM files for the readers and purpose named in their guides. They can consult permitted workspace files and referenced sources, but do not share your conversation:

- **Content.** Be concise, direct and to the point. Use plain English; remove fluff, unnecessary detail, repetition and routine execution narration. Keep what the reader needs to understand the work, decide, act or resume.
- **Structure.** Follow prescribed headings, fields, labels and formats so agents and the CLI can parse the record reliably. Keep each section on one subject; use compact lists or tables where they make information easier to find.
- **Sources.** Give each fact one authoritative home. State essential requirements, decisions, results and limits directly; summarize supporting detail and link its source instead of copying it. Preserve required contracts, validation counts and unrun checks. Exceed suggested lengths only when required information needs the space.
- **Accuracy.** Distinguish proposals from User decisions, recording what was agreed, its scope and why. Check claims against sources and separate verified facts from assumptions.
- **Updates.** Keep records current at consequential decisions and pauses, independently of User reports. Combine related updates where practical; follow required logging and message steps.

Before saving, remove redundant text and check that required information, source links and the format are intact.

## 3. Message Bus

The Message Bus is a set of files in `.apm/bus/`, one folder per agent. The Planner creates it at the end of planning. Each folder is named by the agent's slug, lowercase and hyphenated, such as `frontend-agent`; the Plan names every Worker by its slug, and a Worker's folder is its identity. A Worker's folder holds `task.md` for Task Prompts, `report.md` for Task Reports and `handoff.md` for a Handoff Prompt; the Manager's folder, `manager/`, holds only `handoff.md`.

A bus file is either empty or holds one temporary message. After you process an incoming message, clear its file before you write your outgoing one. Keep a Task Prompt throughout execution and clear it when reporting. A Worker may record User participation and the resume point in its current prompt’s Instructions, preserving the assignment; this updates the current prompt without a new delivery. Read a bus file before writing it, compose the new message from the current assignment and findings, and verify the written content before announcing it. The previous message may already have been cleared.

An agent outside APM can join the bus without joining the workflow; `{SKILL_DIR:apm-communication}/bus-integration.md` describes how.

### 3.1 Agent Slugs

Every Task Prompt and Task Report names its Worker by slug in its `agent` field. The Manager's folder is `manager`.

### 3.2 Agent ID Resolution

When the User supplies an agent ID for Worker initiation, Task or report delivery, or recovery, match it against the bus folder names: an exact match first, then a prefix, then the closest plausible name. Use a unique exact or prefix match directly. Confirm any other single match with the User, and list several plausible matches for the User to choose from. If `.apm/bus/` does not exist, tell the User that planning has not created the Message Bus yet.
