# APM Structure Standards

These standards guide authors of commands, guides, skills and agents. Runtime agents read the resulting templates. Writing follows `WRITING.md`; terms follow `TERMINOLOGY.md`.

## 1. Organize for use

Identify each document's reader, purpose and outputs near its beginning. Put prerequisites before dependent steps. Give each procedure a clear entry point, sequence, branches and completion condition. Keep formats and reference material where readers can find them without rereading a procedure.

Document structure is flexible; artifact contracts are precise. Do not require empty sections, mirrored Common Mistakes, fixed section counts or end markers. Retain section numbers where references depend on them and update all affected references when reorganizing. A heading should help navigation rather than announce a thinking stage.

| Document | Structure |
|---|---|
| Initiation command | Role and scope, identity/loading sequence, first/incoming-instance behavior where applicable, duties and boundaries. Planner has one instance and no Handoff. |
| Utility or recovery command | Purpose and applicability, arguments, procedure and completion behavior. |
| Handoff command | Applicable role, transfer procedure and formats for the Handoff Log and prompt. |
| Guide | Reading role, operational rules, procedure and output formats as needed. Combine related material when this avoids repetition and extra navigation. |
| Skill | Reading roles and purpose, then procedures or reference content suited to its use. |
| Agent | Spawning roles, purpose, input expectations and output requirements. |

The communication skill's §5 Assistant Reference stays last. It defines assistant-specific behavior for the otherwise identical shared text.

## 2. Template files and frontmatter

| Source | Naming | Required frontmatter |
|---|---|---|
| Command | `commands/apm-<N>-<action>.md` | `command_name`, `description` |
| Guide | `guides/<guide-name>.md` | None |
| Skill | `skills/<skill-name>/SKILL.md` | `name`, `description` |
| Agent | `agents/<agent-name>.md` | `name`, `description` |

Names use kebab-case. Skill names match their directory; agent names match their filename. Descriptions briefly identify purpose and activation. Supporting skill files need no frontmatter. Build processing adapts source frontmatter to the installed file type without changing shared instruction text.

Frontmatter starts at the beginning of the file, between `---` lines. Use valid YAML, consistent field names and types, and quotes where YAML requires them. These are source formats, not permission to change runtime artifact schemas.

## 3. Markdown and references

Use one H1 title, H2 major sections and H3 subsections; add deeper structure only when readers need it. Number referenced sections as `## 1. Title` and `### 1.1 Title`. A reference such as `§3.2 Title` must resolve to the intended section.

Use horizontal rules only when they clarify a document boundary or a required artifact layout. End markers are optional prose conventions, not delimiters used by the build. Bus batch separators and YAML delimiters remain required parts of their formats.

All six assistants receive the same commands, guides and skills. Build-resolved paths are relative to the assistant's APM folder, given in the communication skill's Assistant Reference. Commands are installed as skills; shared prose names them without an invocation prefix. Native agent locations and calls are resolved through that reference rather than interpolated into shared text.

## 4. Artifact contracts

Each format definition specifies its location, naming, frontmatter or body schema, allowed values, required/conditional fields and the meaning of non-obvious fields. Use fenced YAML or Markdown examples and concise explanations. Preserve distinctions between literals and values the agent fills in.

- `<value>` marks a value to fill; `[optional]` marks conditional content; `...` shows continuation.
- `<N>` and `<M>` are integers; `<NN>` and `<MM>` are zero-padded identifiers in paths.
- Task identifiers in prose use `N.M`, such as Task 2.3. YAML uses integers (`stage: 2`, `task: 3`). Paths use zero padding, such as `stage-02/task-02-03.log.md`.
- APM artifact paths use kebab-case. Task and Handoff Logs use `.log.md`. Their locations, fields and body sections are defined by their runtime guides/commands.

Formatting simplification must not alter a schema, field name, allowed value, bus separator, identity rule or artifact path relied on by another role or the CLI.

## 5. Supported build placeholders

Build placeholders resolve identically for every assistant. Match their implementation in `build/processors/placeholders.js`.

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template version |
| `{SKILL_PATH:name}` | `skills/<name>/SKILL.md` |
| `{GUIDE_PATH:name}` | `apm-guides/<name>.md` |
| `{COMMAND_PATH:name}` | `skills/<name>/SKILL.md` |
| `{SKILLS_DIR}`, `{GUIDES_DIR}` | `skills`, `apm-guides` |
| `{PLANNER_SUBAGENT_GUIDANCE}` | Shared Planner research instructions referring to the Assistant Reference |
| `{MANAGER_SUBAGENT_GUIDANCE}` | Shared Manager investigation instructions referring to the Assistant Reference |
| `{WORKER_SUBAGENT_GUIDANCE}` | Shared Worker exploration instructions referring to the Assistant Reference |
| `{SUBAGENT_GUIDANCE}` | Shared standalone subagent instructions referring to the Assistant Reference |
| `{ARCHIVE_EXPLORER_GUIDANCE}` | Instruction to spawn the archive explorer by name |

Use “the Rules file” and “the command argument” in shared text, with assistant-specific details in the reference. Do not add per-assistant replacements. Validate the six generated bundles and their shared-file identity after changes.
