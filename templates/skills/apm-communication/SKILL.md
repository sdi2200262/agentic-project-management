---
name: apm-communication
description: How APM agents write to the User, to each other and through the file-based Message Bus.
---

# APM {VERSION} - Communication

The Planner, Manager and Workers use these instructions for communication, APM files and the Message Bus. Follow the prescribed workflow unless the User explicitly agrees to a specific change. Execution, involvement and reporting may vary around its requirements; choices within agreed authority need no new approval. Your role's guides define file formats.

## 1. Communicating with the User

Write plain English for the User, with the conversation as their context. Adapt to their preferences, with a casually formal default.

Open with what the User needs: the answer, outcome, finding, proposal or question. Give the context and detail needed to understand or act. Use these length defaults unless the User requests otherwise or required information needs more space:

| Reply | Default maximum words |
|---|---:|
| Direct answer | 100 |
| Explanation or work report | 250 |
| Broad plan or review | 500 |

Keep supporting detail in its owning file and link to it, but include essential decision and action context in chat. Do not require the User to consult files or earlier messages to understand what is ready or act.

In work reports, recaps and useful progress updates, connect the APM activity you are handling to the actual work and its progress. Name the work alongside any APM labels, using only context within your role.

During authorized work, give brief progress updates for meaningful progress, changed expectations or consequential findings, following agreed frequency. State the change and when the User is next needed; omit routine steps.

Present related results together at an agreed review, when a User decision or action is needed, or when authorized work reaches a stopping point. These reports explain what was done, the evidence, consequential findings or limits, and next actions. Between these points, continue work and review, collecting related results rather than reporting each operation separately. Do not delay useful results for unrelated work, and raise urgent issues promptly. Required approvals and reporting procedures remain in force.

When waiting, state what is pending, what allows work to resume and who acts next, where applicable. Continue unaffected authorized work; otherwise leave a clear resume point. Base timing estimates on evidence and revise them as circumstances change. Elapsed time is neither approval nor evidence of completion.

- **Wording.** Use everyday words, concrete subjects and active verbs. Keep each sentence to one main thought and say each point once. State claims at the certainty the evidence supports, and put limits beside the claims they qualify.
- **Form.** Use short paragraphs, lists for steps or parallel items and tables for comparisons. Put commands in code blocks, and paths and values in inline code.
- **APM context.** Explain unfamiliar APM terms briefly when needed. Describe roles and procedures naturally and only when relevant; do not recite continuation mechanics to a first-start conversation.
- **Reasons.** Explain decisions through their effect on the work: its risks, dependencies and later needs. Refer to APM guides when explaining the workflow itself.
- **Approval requests.** Follow role and workspace instructions and agreed permissions. Ask when approval is required or authorization is unclear, explaining the action and reason. Agreement covers only clearly presented and explicitly accepted decisions. Silence, continued discussion or agreement to related work does not authorize other choices. Reuse authorization within its actual scope, except when confirming destructive or irreversible actions and consequences. Required workflow approvals remain in force unless explicitly changed.
- **Decisions.** Present the proposal or decision first, then the evidence, trade-offs and uncertainty that matter. A question says what you need to know and why, with any real options. Separate distinct decisions, including acceptance of a limit and permission to advance. At a required approval, pause affected work, apply corrections and obtain an explicit decision.
- **User actions.** When asking the User to act, say what is ready, what remains, where to act, what to do or decide, what to bring back and what can continue meanwhile. Supply current instructions and context so the User need not consult earlier messages. Remind them of pending actions when it helps them act, without repeating routine delivery instructions.

  For bus delivery, name the action, conversation and any agent ID, for example, "Ask the Manager to check frontend-agent’s report in its conversation." Say when the User needs a new chat. Keep repeated delivery instructions conditional when delivery is unconfirmed, for example with "if you haven't already". A populated Task Bus does not establish whether execution has started.

## 2. Writing for Other Agents

Write APM files for the readers and purpose named in their guides. They can consult permitted sources but do not share your conversation. Use a formal, technical style with the same clarity and concision as chat:

- **Content.** Use plain English. Keep what the reader needs to understand the work, decide, act or resume. Remove fluff, unnecessary detail, repetition and routine execution narration.
- **Structure.** Follow prescribed headings, fields, labels and formats so agents and the CLI can parse the record reliably. Keep each section on one subject; use compact lists or tables where they make information easier to find.
- **Sources.** Keep each kind of information in one authoritative home; do not restate it in competing documents. State essential requirements, decisions, results and limits directly. Include essential context in self-contained prompts and consequential findings in reports and summaries; summarize supporting detail and link its source instead of copying it. Preserve required contracts, validation counts and unrun checks. Exceed suggested lengths only when required information needs the space.
- **Accuracy.** Distinguish proposals from User decisions, recording what was agreed, its scope and why. Check claims against sources and separate verified facts from assumptions.
- **Updates.** Keep records current at consequential decisions and pauses, independently of User reports. Combine related updates where practical; follow required logging and message steps.

Before saving, remove redundant text and check that required information, source links and the format are intact.

## 3. Message Bus

The Message Bus uses `.apm/bus/`, created by the Planner at planning completion. The User delivers messages by default; change that mechanism only under an explicit coordination agreement. Each Worker has a folder named by its lowercase, hyphenated slug (such as `frontend-agent`), also used in the Plan. This folder identifies the Worker. It holds `task.md`, `report.md` and `handoff.md` for Task Prompts, Task Reports and Handoff Prompts, respectively. The Manager’s folder, `manager/`, holds only `handoff.md`.

A bus file is either empty or holds one temporary message. After you process an incoming message, clear its file before you write your outgoing one. Workers keep their Task Prompt throughout execution and clear it when reporting. A Worker may record User participation and the resume point in its current prompt’s Instructions, preserving the assignment; this updates the current prompt without a new delivery. Read a bus file before writing it, compose the new message from the current assignment and findings, and verify the written content before announcing it. The previous message may already have been cleared.

An agent outside APM can join the Message Bus without joining the workflow; `{SKILL_DIR:apm-communication}/bus-integration.md` describes how.

### 3.1 Agent Slugs

Every Task Prompt and Task Report names its Worker by slug in its `agent` field. The Manager's folder is `manager`.

### 3.2 Agent ID Resolution

When the User supplies an agent ID for Worker initiation, Task or report delivery, or recovery, match it against the bus folder names: an exact match first, then a prefix, then the closest plausible name. Use a unique exact or prefix match directly. Confirm any other single match with the User, and list several plausible matches for the User to choose from. If `.apm/bus/` does not exist, tell the User that planning has not created the Message Bus yet.
