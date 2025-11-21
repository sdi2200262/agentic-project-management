---
id: introduction
slug: /introduction
sidebar_label: Introduction
sidebar_position: 3
---

# APM v0.5 - Agentic Project Management Framework

**A Structured, Multi-Agent Workflow System for Complex Project Execution with AI Assistants**

Agentic Project Management (APM) is an open-source framework that structures AI-driven software development. It transforms a single, overloaded AI chat session into a coordinated team of specialized AI Agents, enabling complex project execution using AI Assistants like Cursor, Windsurf, Copilot and more.

Building on the emerging practice of Spec-Driven Development, which embodies the **first plan, then execute** philosophy with AI Assistants, APM adds structured workload distribution and management across a team of specialized Agents. This enhanced approach is called **Agentic Spec-Driven Development**.

## The Challenge: Context Decay

Managing large projects with AI assistants presents a fundamental systemic challenge: **Context Window Limits**.

As conversations extend, context degrades. The AI loses track of original requirements, produces contradictory code, and hallucinates details. In an AI Assistant, where context is often aggressively pruned to save costs, this leads to a disruption in project continuity.

## The Solution: Structured Multi-Agent Architecture

APM addresses context window limitations and context decay by treating the AI not as a single continuous assistant, but as distinct **Agent Instances** with specific roles and intelligently scoped contexts.

Instead of one long chat history, APM distributes the workload:
1.  **Specialization**: Agents focus on specific domains (Planning, Management, Implementation).
2.  **Persistence**: A file-based Memory System preserves project history outside of the Agent's context, keeping a large context archive.
3.  **Continuity**: Structured Handover Protocols transfer "working memory" between Agents when context limits are reached.

### Visual Workflow Overview

The following diagram illustrates the end-to-end workflow, from the Setup Phase to the Task Loop and Ad-Hoc delegations.

<div align="center">
  <img 
    src={require('@site/static/docs-img/apm-workflow-diagram.png').default} 
    alt="APM v0.5 - Agentic Spec-driven Development" 
    width="1200" 
    style={{ maxWidth: '100%', borderRadius: '14px' }}
  />
</div>

---

## Core Components

APM coordinates four specialized Agent types using a "Manager-Worker" topology.

### 1. The Agents

| Agent Type | Role | Responsibility |
| :--- | :--- | :--- |
| **Setup Agent** | **Architect** | Operates once at the start. Conducts discovery, gathers requirements, and generates the detailed *Implementation Plan*. Tasks in the plan are grouped by field (eg. Frontend, Backend etc.). |
| **Manager Agent** | **Coordinator** | Maintains the "big picture." Assigns tasks, reviews work, manages context dependencies, and orchestrates the project. |
| **Implementation Agent** | **Developer** | Executes specific tasks (coding, writing, design). Receives only tasks from a specific group in the plan, to avoid context creep. Operates in a focused context scope and logs work to Memory. |
| **Ad-Hoc Agent** | **Specialist** | Temporary instances for isolated tasks (debugging, research etc.). They solve specific problems and close, preventing context pollution or overfill of the calling Agent. |

> For a detailed breakdown of Agent capabilities, see [Agent Types](Agent_Types.md).

### 2. Context Management

APM manages the context of multiple Agents with explicit protocols and artifacts:

* **Implementation Plan**: The source of truth for project structure and progress.
* **Dynamic Memory Bank**: A folder structure of Markdown logs where Implementation Agents document their work. Memory Logs are mapped to tasks of the Implementation Plan, keeping an organized context archive of the sesion. The Manager reads these logs to track progress without needing the implementation details, focusing on the big-picture.
* **Handover Protocol**: A distinct procedure to transfer context (user preferences, undocumented insights and working memory) to a fresh Agent instance before the context window fills up.

---

## The Workflow Phases

APM operates in two distinct phases:

### Phase 1: Setup
The **Setup Agent** interviews the user to build a comprehensive context foundation. It systematically breaks the project down into phases, tasks and subtasks, creating a detailed **Implementation Plan**. Tasks are grouped by field, and each field is assigned to an **Implementation Agent** for execution.

### Phase 2: Task Loop
The **Manager Agent** and **Implementation Agents** enter a coordination loop:
1.  **Assign**: Manager creates specific *Task Assignment Prompts* that the User sends to the Implementation Agents
2.  **Execute**: Implementation Agent performs the task and *logs to Memory*.
3.  **Review**: Manager *reviews the Memory Log* and decides the next action.

---

## Installation & Usage

APM is installed via the [`agentic-pm`](https://www.npmjs.com/package/agentic-pm) CLI, which scaffolds the necessary guides and prompt templates into your project workspace. To get started with installation and your first session, see [Getting Started](Getting_Started.md).

---

## Contributing

APM is an Open Source project, and contributions to both the framework and its documentation are encouraged. You can contribute by posting an Issue for bugs, feature requests, or questions, or by submitting a Pull Request (PR) with improvements, fixes, or documentation enhancements/refinements. For details on contributions and guidelines, please see the [CONTRIBUTING.md](https://github.com/sdi2200262/agentic-project-management/blob/main/CONTRIBUTING.md) file.