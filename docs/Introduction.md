# APM v0.4 - Agentic Project Management Framework

**A Structured, Multi-Agent Workflow System for Complex Project Execution with AI Assistants**

## What is APM?

Agentic Project Management (APM) is a structured multi-agent workflow for managing complex projects within AI IDE environments. It applies real-world project management principles to AI-driven workflows including task breakdown, role assignment, progress tracking, and seamless handoffs between team members.

APM utilizes chat sessions in your AI IDE as separate agent instances, each with its own context scope and memory. This allows for more focused interactions, reduces the cognitive load and produces more consistent results.

Dividing the project workload among multiple agents minimizes the risk of context loss and reduces hallucinations, leading to more reliable and consistent results.

## The Problem APM Solves

Managing large projects with AI assistants presents systematic challenges. Extended conversations frequently lead to context degradation where the AI loses track of original requirements, produces contradictory suggestions, or generates inaccurate details. These issues arise from fundamental limitations of LLMs: **Context Window Limits**

This constraint feels "heavier" within AI IDEs, when often times Context Windows are shrunk even further to maintain profitable interactions with the model's provider. As conversations grow, the AI struggles to keep track of everything, leading to confusion, errors, and wasted time.

APM addresses these issues by providing a clear framework that prioritizes structured interaction, explicit context management and integration, and efficient, targeted cross-agent communication through meta-prompting.

## APM's Approach

The framework uses multiple AI agent instances, each with a specific role and clear responsibilities, coordinated through structured protocols and persistent memory/context management.

The result is a workflow that feels more like working with a well organized team than wrestling with a single overloaded AI assistant.

> Think of APM like running a software development team. You have a project manager who understands the big picture, developers who focus on specific tasks, and clear documentation that keeps everyone aligned. Developers document each task execution, and the manager reviews the logs for coordination. The difference is that your "team members" are AI assistants in separate chat sessions.

---

## Multi-Agent Coordination

APM v0.4 employs a sophisticated multi-agent system built around four specialized agent types:

*   **1. Setup Agent:** Initiates the project session, creating the needed APM assets. The Setup Agent conducts comprehensive project discovery, transforms requirements into a detailed Implementation Plan, and initializes the Memory System that enables effective coordination. Once session is initialized it passes control to the Manager Agent.

*   **2. Manager Agent:** Coordinates the project session and makes all the important decisions. The Manager Agent maintains the big picture, creates targeted task assignments for Implementation Agents, reviews completed work, and orchestrates the overall project flow while preserving context continuity between agent instances.

*   **3. Implementation Agents:** Execute focused task assignments by the Manager. Task domains vary: coding, design, analysis, writing, research etc. while Implementation Agent instances are assigned groups of same-domain tasks. They always log their work to preserve context and ensure project continuation.

*   **4. Ad-Hoc Agents:** Temporary agents for isolated tasks (e.g., debugging, research, analysis) outside the main workflow as workflow "branches". They run in separate chat sessions with minimal scoped context, are assigned by Implementation Agents, and return findings for integration. Ad-Hoc Agents don’t make project decisions, just solve a specific problem, report back, and close, preventing context overload in core agents.

> Agent types in APM are **not specialized "personas"**. Their specialization comes from well defined responsibilities and carefully scoped context for each agent instance. Modern LLMs already adapt to user requests by employing specialized sub-models; APM builds on this strength, enabling precise and effective task execution through focused, strategic agent interactions.

### Context Management
APM preserves context with a carefully designed adaptation of the traditional Memory Bank and a context Handover Procedure. For tasks that require isolated, context-intensive work (such as research or debugging), Ad-Hoc Agent instances handle these activities separately, preventing unnecessary strain on the core agents' context.

*   **Dynamic Memory Memory Bank**: An adaptation of the traditional single-file Memory Bank that maps Memory Log files to the tasks of an Implementation Plan. For complex projects Memory Logs are stored in a directory structure with folders mapped to the Implementation Plan's phases. For simple projects, a single-file traditional Memory Bank is used.

*   **Ad-Hoc Agent Delegation**: Workflow branches for handling debugging, research, or analysis tasks through temporary agent instances that work in isolated context scopes.

*   **Handover Protocol**: A context transfer mechanism using structured handover files and prompts to seamlessly transition between agent instances when context limits are reached.

## The APM Workflow

APM v0.4 operates through two workflow phases:

1. **Setup Phase**: Comprehensive project discovery and planning through the Setup Agent & initialization of session assets
2. **Task Loop Phase**: Coordinated task assignment & execution via Manager and Implementation Agents

Plus **Handover Procedure**: as distinct events for seamless context transfer when agents approach memory limits

---

## Core Framework (`/prompts`)
The `/prompts` directory contains all core user prompts, guides, and schemas for APM agents and workflows. Each subdirectory focuses on a specific agent type, process guide, or in the case of `schemas/`, the JSON asset format variant.

> **Testing/Research Preview:** The JSON asset format variant is part of ongoing research into structured prompting and improved LLM parsing efficiency with commercial AI Assistants. It is specifically designed for better LLM parsing and prompt structure, and is intended for token-wealthy users or APM contributors interested in testing and providing feedback. This format is experimental and not recommended for production or resource-constrained scenarios due to significantly higher token consumption.

| Subdirectory                                                         | Purpose                                                                                    | Notes                                                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
|  [`/prompts/Setup_Agent/`](../prompts/Setup_Agent/)                  | Initialization Prompt & Context Synthesis Prompt for the Setup Agent                       | For project discovery, planning, and memory system setup                                                                    |
| [`/prompts/Manager_Agent/`](../prompts/Manager_Agent/)               | Initialization Prompt & Handover Guide for the Manager Agent                               | Guides task assignment and context continuity                                                                               |
| [`/prompts/Implementation_Agent/`](../prompts/Implementation_Agent/) | Initialization Prompt & Handover Guide for Implementation Agents                           | Ensures focused execution and seamless task handover                                                                        |
| [`/prompts/ad-hoc/`](../prompts/ad-hoc/)                             | Initialization Prompt & Delegation Guides for Ad-Hoc Agents                                | Supports temporary, isolated tasks outside the main workflow                                                                |
| [`/prompts/schemas/`](../prompts/schemas/)                           | JSON schema definitions for Implementation Plans, Memory Logs, and Task Assignment Prompts | Includes README, examples, and Python validation script                                                                     |
| [`/prompts/guides/`](../prompts/guides/)                             | Guides for APM processes and protocols                                                     | Covers project breakdown, memory management, task assignment, review, and handover                                          |


## Documentation (`/docs`)
The `/docs` directory contains comprehensive documentation covering the APM framework, including agent roles, workflow processes, memory management strategies, prompt engineering techniques, and optimization tips to help you effectively implement and customize APM for your projects.

| File                                                                                       | Purpose                                                                                   |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------|
| **[Agent_Types.md](Agent_Types.md)**                                                       | Learn about Setup, Manager, and Implementation Agent roles and Ad-Hoc Agent Delegations   |
| **[Workflow_Overview.md](Workflow_Overview.md)**                                           | Complete APM process walkthrough                                                          |
| **[Getting_Started.md](Getting_Started.md)**                                               | Step-by-step guide to launching your first APM session                                    |
| **[Token_Consumption_Tips.md](Token_Consumption_Tips.md)**                                 | Strategies for reducing token usage; economic model proposal                              |
| **[Modifying_APM.md](Modifying_APM.md)**                                                   | Instructions for customizing APM assets to match your needs                               |
| **[Context_and_Memory_Management.md](Context_and_Memory_Management.md) <br/>(Advanced)**   | Explains how APM handles context scope and memory of the agent instances                  |
| **[Context_and_Prompt_Engineering.md](Context_and_Prompt_Engineering.md) <br/>(Advanced)** | Explains context and prompt engineering techniques utilized throughout APM                |


---

APM is an Open Source project, and contributions to both the framework and its documentation are encouraged. You can contribute by posting an Issue for bugs, feature requests, or questions, or by submitting a Pull Request (PR) with improvements, fixes, or documentation enhancements/refinements. For details on contributions and guidelines, please see the [CONTRIBUTING.md](../CONTRIBUTING.md) file.