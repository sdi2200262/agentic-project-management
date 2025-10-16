# Ad-Hoc Delegation Guides
This directory contains guides for specialized Ad-Hoc Agent delegation in APM v0.4. These aren't your main workflow agents, they're more like disposable helpers. Delegations happen either when they are explicitly stated in a Subtask or when an Implementation Agent deems one necessary.

## What Are Ad-Hoc Agents
Think of Ad-Hoc delegation like bringing in a consultant for a specific problem. When your Implementation Agent hits a debugging wall, needs to research something outside their current context, or wants focused analysis work, they delegate it to be worked on in separate chat session.

It's not about getting an "expert" since it's the same AI model that its going to be workking on the issue. Working in a **fresh, scoped context** without the baggage of your main project is what matters. Think of it like handing off a single issue to someone with a fresh perspective.

The key advantage is that these agents work in **separate branches** so they don't eat up your main workflow's context window or interfere with ongoing tasks. Your Implementation Agent has the freshest active context to brief them properly, then you bring the findings back and dispose of the session once the delegation completes or escalates.

Thats it... a straightforward system for bringing in help without breaking your main workflow.

## Using The Guides
Right now I've included a few essential ones:

- **Debug_Delegation_Guide.md** - For persistent bugs that need dedicated debugging attention
- **Research_Delegation_Guide.md** - For when a model's context is outdated or limited to a subject and you need to dive deep into documentation, APIs, or technical concepts - TBD

Implementation Agents will (hopefully) reference these when they hit scenarios that need delegation. You just copy-paste the prompts they create following these guides into new chat sessions and bring back the findings.

## Creating Your Own Guides
APM is an Open Source project, anyone who wants to contribute by adding a new Delegation Guide or improving an existing one, is welcomed!
Keep Delegation Guides you create **targeted and specific**. Good candidates:
- Testing guides (unit test creation, test data generation) (also working on one)
- Security analysis guides (vulnerability assessment, code review)
- Data extraction guides (parsing complex files, API integration)
- Documentation guides (technical writing, API docs)

**Don't create guides for stuff that should be separate Implementation Plan tasks** - like architecture design, full feature development, or anything that's clearly a main project deliverable.

### The Template Pattern
Follow the same structure as in Debug_Delegation_Guide.md when creating a Guide:
1. **Workflow Overview** - How the delegation works (keep this section mostly the same, just update references accordingly)
2. **Prompt Template** - YAML frontmatter + structured sections  (adapt to your guide)
3. **Integration Protocol** - How to handle findings and re-delegation (adapt to your guide)

### Contributing

Name your files `{Domain}_Delegation_Guide.md`, keep them focused on the specific delegation scenario and follow the template pattern when making a PR!