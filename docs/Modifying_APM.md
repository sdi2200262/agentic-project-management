---
id: modifying-apm
slug: /modifying-apm
sidebar_label: Modifying APM
sidebar_position: 9
---

# Modifying APM - APM v0.5

APM v0.5 is designed to offer a flexible foundation workflow. While the CLI standardizes the installation, the generated assets are yours to modify. You can tailor prompt behaviors, integrate new tools, or enforce specific coding standards by editing the local files directly.

## The Customization Workflow

In APM v0.5, customization is **local-first**. The `apm init` command installs files into your project directory. To customize APM, you edit these files in place.

### Important: Updates & Persistence

The `agentic-pm` CLI manages the `.apm/` directory. Running `apm update` generally overwrites all core guides and prompt templates to ensure compatibility with the latest CLI version. Running `apm init` to install assets for a new AI Assistant will also overwrite all your templates. However, the CLI automatically creates a `.zip` backup of your current configuration before any update.

> **Recommendation:** We strongly suggest committing your `.apm/` directory to a version control system (like Git). This allows you to easily diff changes after an update and restore your customizations. Alternatively, you can manually copy your modified assets to a safe location before running updates.

---

## Modification Targets

To change APM's behavior, you must know which file controls which part of the workflow.

Example of how to approach editing APM's assets:
```text
MyProject/
├── .apm/
│   └── guides/                     
│       ├── Context_Synthesis_Guide.md...    # Edit to change Setup questions
│       ├── Task_Assignment_Guide.md...      # Edit to change how Manager assigns tasks
│       └── ...
├── .cursor/commands/
│   ├── apm-1-initiate-setup.md                      # Edit to change Setup Agent behavior
│   ├── apm-2-initiate-manager.md                    # Edit to change Manager Agent behavior
│   └── ...
```

### 1. Customizing the Setup Phase

To make the Setup Agent ask specific questions about your tech stack, consider modifying `.apm/guides/Context_Synthesis_Guide.md`.

**Example:** Replacing generic questions with a specific **Web Development Stack**:

```markdown
// Replace the "Technical Constraints" section with:
**Web Stack Requirements**
- Frontend: (React, Vue, Svelte?)
- State Management: (Redux, Zustand, Context?)
- Styling: (Tailwind, CSS Modules, Styled Components?)
- API Strategy: (REST, GraphQL, tRPC?)
```

### 2. Customizing Execution Behavior

To make Implementation Agents more verbose or silent depending on your preference, consider modifying `.cursor/commands/apm-3-initiate-implementation.md` (or equivalent).

**Example: YOLO Mode**
Add this to the **Operational Rules** section to save tokens:

```markdown
### Minimal Interaction Mode
- **Consolidated Reporting**: Do not narrate every step. Execute the full task and report only the final result.
- **Assumption Authority**: Make reasonable standard assumptions (e.g., naming conventions) without asking, unless ambiguous.
- **Error Recovery**: Attempt to fix linter errors automatically before reporting a failure.
```

### 3. Customizing Manager Coordination

To enforce strict security or testing standards on every task, consider modifying `.apm/guides/Task_Assignment_Guide.md`.

**Example: Security-First Assignment**
Add this to the **Task Assignment Prompt Template**:

```markdown
## Mandatory Security Requirements
- **Input Validation**: All user inputs must be validated via Zod/Yup schemas.
- **Auth Checks**: Verify authentication middleware on all new endpoints.
- **Sanitization**: Ensure no raw SQL or HTML injection points.
```

---

## MCP Tool Integration

APM Agents can leverage MCP servers to access external data (Docs, GitHub, Databases). To use these, configure the MCP servers in your AI Assistant, and then instruct the Agents to use them directly.

### Recommended MCP Setup

Using MCP tools has proven to be very helpful both during planning and coordination or during task execution. For example:

| Tool | Purpose | Best Used By |
| :--- | :--- | :--- |
| **Context7** | Fetch live documentation for libraries. | Implementation / Ad-Hoc Agent |
| **GitHub MCP** | Read repo history, PRs, and issues. | Setup / Manager Agent |

### Enabling MCP in APM

To make agents aware of these tools, add a capability block to their **Initiation Prompts**:

```markdown
### Tool Usage Protocol (MCP)
You have access to external tools. Use them proactively:
1.  **@context7**: BEFORE writing code, fetch the latest docs for [Library Name] to avoid deprecated methods.
2.  **@github**: Read the PR history if the user references a previous feature.
3.  **@postgres**: Check the live schema before writing SQL queries. Do not guess column names.
```

---

## Creating Custom Delegation Guides

You can create new delegation workflows for specialized tasks (e.g., "Security Review" or "QA Testing").

1.  **Create the Guide:** Create `.cursor/commands/Security_Review_Delegation_Guide.md` (or equivalent)
2.  **Define the Protocol:**
      * **Input:** What does the Implementation Agent provide? (Code paths, threat models).
      * **Process:** What does the Ad-Hoc Agent do? (Scan for vulnerabilities, check auth logic).
      * **Output:** What is the deliverable? (A Markdown Audit Report).
3.  **Register the Delegation:** Add a trigger instruction to the `/apm-3-initiate-implementation` prompt:
      * *"If code involves payments or auth, trigger a Security Delegation using [path_to_guide]."*

> **Contribution:** If you create a valuable guide, consider contributing it to the [APM Repository](https://github.com/sdi2200262/agentic-project-management) to improve the framework.