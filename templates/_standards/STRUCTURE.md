# APM Structure Standards

These standards define source layout, navigation and artifact contracts for template authors. `WRITING.md` covers prose and Markdown presentation; `TERMINOLOGY.md` defines APM terms.

## 1. Organize for use

Identify the reader, purpose and outputs near the beginning. Put prerequisites before dependent steps. Give procedures a clear entry point, sequence, branches and completion condition. Place formats and reference material where readers can consult them directly.

| Document | Content |
|---|---|
| Initiation skill | Role and scope, identity and loading sequence, first/incoming-instance behavior, duties and boundaries. The Planner has one instance and no Handoff. |
| Utility or recovery skill | Purpose, applicability, arguments, procedure and completion behavior. |
| Handoff skill | Applicable role, transfer procedure, Handoff Log and prompt formats. |
| Guide | Reading role, operational rules, procedure and output formats as needed. |
| Shared skill | Reading roles and purpose, followed by procedures and reference content. |

Delegation instructions state when to use a subagent, its purpose, inputs and required findings. They refer to `apm-communication` §5 Assistant Reference for the call. The reference remains the last section and supplies assistant-specific behavior for the shared text.

## 2. Source layout and frontmatter

Sources live under `templates/`:

| Source | Path | Frontmatter |
|---|---|---|
| Command skill | `skills/apm-<N>-<action>/SKILL.md` | `name`, `description`, `disable-model-invocation: true` |
| Shared skill | `skills/<skill-name>/SKILL.md` | `name`, `description` |
| Skill support file | Alongside its `SKILL.md` | As its format requires |
| Guide | `guides/<guide-name>.md` | None |
| Initial artifact | `apm/<artifact-path>.md` | As its runtime schema requires |
| Authoring standard | `_standards/<NAME>.md` | None |

Names use kebab-case; each skill's `name` matches its directory. Descriptions briefly identify purpose and activation. YAML frontmatter begins on the first line between `---` delimiters, with valid field names, types and quoting.

The build resolves placeholders and copies skills with their source frontmatter. All six assistants receive identical runtime text. Guides install at project-root `.agents/apm-guides/`; skills install under `skills/` in the assistant's APM folder. The Assistant Reference identifies that folder and invocation details. Shared prose names commands by their skill names.

## 3. Navigation and references

Use one H1 title, H2 major sections and H3 subsections, adding deeper levels when needed. Number referenced sections as `## 1. Title` and `### 1.1 Title`. Keep numbers used by cross-references stable, or update every affected reference during reorganization. A reference such as `§3.2 Title` resolves to its intended section.

Cross-file references use explicit paths or supported placeholders. Resolve guide paths from the project root and skill paths from the assistant's APM folder. Describe native actions through the Assistant Reference.

## 4. Artifact contracts

Each format definition specifies its location, naming, schema, allowed values, required/conditional fields and the meaning of non-obvious fields. Fenced examples distinguish literal content from values the agent fills in.

- `<value>` marks a value to fill; `[optional]` marks conditional content; `...` shows continuation.
- `<N>` and `<M>` are integers; `<NN>` and `<MM>` are zero-padded identifiers in paths.
- Prose Task IDs use `N.M`, such as Task 2.3. YAML uses integers (`stage: 2`, `task: 3`). Paths use zero padding, such as `stage-02/task-02-03.log.md`.
- APM artifact paths use kebab-case. Task and Handoff Logs use `.log.md`; their runtime guides and skills define the fields and body sections.

Preserve schemas, field names, allowed values, bus separators, identity rules and artifact paths used by other roles or the CLI. Artifact contracts govern required formatting, including YAML delimiters and batch separators.

## 5. Build placeholders and validation

Supported placeholders match `build/processors/placeholders.js` and resolve identically for every assistant:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template version |
| `{SKILL_PATH:name}` | `skills/<name>/SKILL.md` |
| `{GUIDE_PATH:name}` | `.agents/apm-guides/<name>.md` |

Shared text uses “the Rules file” and “the command argument”; the Assistant Reference supplies their assistant-specific details. Validate references, artifact contracts, resolved placeholders and shared-file identity in all six generated bundles after changes.
