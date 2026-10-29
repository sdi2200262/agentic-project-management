# APM Structure Standards

These standards define runtime file layout, navigation and artifact contracts. `WRITING.md` covers prose; `TERMINOLOGY.md` defines APM terms.

## 1. Organize for Use

Open each file with its purpose and result. Keep each section on one part of the work, in the order the agent acts. State each rule once at its point of use; repeat a brief reminder only when testing shows agents miss it.

| File | Content |
|---|---|
| Initiation skill | Role, inputs, outputs, scope, file loading, identity, first start, continuation and duties. The Planner has no Handoff. |
| Utility or recovery skill | Purpose, applicability, arguments, procedure and completion. |
| Handoff skill | Role, transfer procedure, Handoff Log and Prompt formats. |
| Guide | Procedure context, ordered steps and branches, then Formats for its artifacts. End where the next guide begins and point to it. |
| Shared skill | Reading roles, purpose and shared protocol. Role-specific behavior belongs in the role's files. |

Keep artifact contracts in a final Formats section of their owning file, one subsection per artifact.

## 2. Sources and Frontmatter

Sources live under `templates/`:

| Source | Path | Frontmatter |
|---|---|---|
| Command skill | `skills/apm-<N>-<action>/SKILL.md` | `name`, `description`, `disable-model-invocation: true` |
| Shared skill | `skills/<name>/SKILL.md` | `name`, `description` |
| Skill support file | Beside its `SKILL.md` | As required by its format |
| Guide | `guides/<name>.md` | None |
| Initial artifact | `apm/<path>.md` | As required by its schema |
| Authoring standard | `_standards/<NAME>.md` | None |

Use kebab-case names; each skill's `name` matches its directory. Descriptions identify purpose and activation. Valid YAML frontmatter starts on the first line between `---` delimiters.

Each build target installs skills under `skills/` and guides under `apm-guides/`, rooted at `.claude/` or `.agents/`. Initial artifacts become `.apm/`. Rules live in workspace-root `AGENTS.md` for both targets.

## 3. Navigation

Title runtime files `APM {VERSION} - <Name>`. Use one H1, numbered H2 sections (`## 1. Title`) and numbered subsections (`### 1.1 Title`). Use short Title Case headings that fit any kind of work.

References use section numbers: `§4` locally, or `{GUIDE_PATH:task-logging} §5.1` across files. Update references when sections move. Use explicit paths and the placeholders below. Refer to another file only when the reading role may load it; otherwise include the needed instruction locally.

## 4. Artifact Contracts

Define each artifact's location, naming, schema, allowed values, required and conditional fields, and non-obvious field meanings. Initial artifacts match their owning formats.

- `<value>` marks a value to fill; `[optional]` marks conditional content; `...` marks continuation.
- `<N>` and `<M>` are integers; `<NN>` and `<MM>` are zero-padded path identifiers.
- Task IDs use `N.M` in prose, integers in YAML (`stage: 2`, `task: 3`) and zero padding in paths (`stage-02/task-02-03.log.md`).
- Artifact names use kebab-case with `.log.md` for logs and `.summary.md` for summaries, including `session.summary.md`.

Root APM artifact paths at `.apm/`. Preserve field names, values, separators and identity rules used by the CLI and other roles. Distinguish literal content from fill-in values in format examples.

## 5. Build Placeholders and Checks

Supported placeholders match `build/processors/placeholders.js`:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template version |
| `{SKILL_PATH:name}` | `.claude/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md` |
| `{SKILL_DIR:name}` | The skill's directory, for support files |
| `{GUIDE_PATH:name}` | `.claude/apm-guides/<name>.md` or `.agents/apm-guides/<name>.md` |
| `{CLAUDE_ONLY:text}` | Text kept only in the Claude target; start with a space when following a sentence |

Build both targets after changes. Check schemas, formats, initial artifacts, references, summary links and resolved paths and placeholders.
