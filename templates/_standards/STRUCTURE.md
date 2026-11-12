# APM Structure Standards

These standards define runtime file layout, navigation and artifact contracts for template authors and maintainers. `WRITING.md` covers prose; `TERMINOLOGY.md` defines APM terms.

## 1. Organize for Use

Open each file with its purpose, intended reader and result. Distinguish role initiation from procedures used by an established agent. Keep each section on one part of the work, in the order the agent acts. State each rule once at its point of use; repeat a brief reminder only when testing shows agents miss it.

| File | Content |
|---|---|
| Initiation skill | Role description and place in the session, directions to take on or continue it, inputs, outputs, scope, file loading, identity, first start, continuation, recovery, message receipt and duties. The Planner has no Handoff. |
| Utility or recovery skill | Purpose, applicability, arguments, procedure or route to the owning role procedure, and completion. |
| Handoff skill | Role, transfer procedure, Handoff Log and Prompt formats. |
| Guide | Procedure context, ordered steps and branches, then Formats for its artifacts. End where the next guide begins and point to it. |
| Shared skill | Reading roles, purpose and shared protocol. Role-specific behavior belongs in the role's files. |
| Single-skill entry | Briefly explains APM so an agent can assess its suitability, then directs requested actions to the owning role or procedure. Keep workflow procedures in the shared sources. |

Keep artifact contracts in a final Formats section of their owning file, one subsection per artifact.

## 2. Sources and Frontmatter

Sources live under `templates/`:

| Source | Path | Frontmatter |
|---|---|---|
| Command skill | `skills/apm-<N>-<action>/SKILL.md` | `name`, `description`, `disable-model-invocation: true` |
| Shared skill | `skills/<name>/SKILL.md` | `name`, `description` |
| Skill support file | Beside its `SKILL.md` | As required by its format |
| Guide | `guides/<name>.md` | None |
| Single-skill entry | `entrypoints/apm/SKILL.md` | `name`, `description` |
| Initial artifact | `apm/<path>.md` | As required by its schema |
| Authoring standard | `_standards/<NAME>.md` | None |

Use kebab-case names; each skill's `name` matches its directory. Descriptions identify purpose and activation. Valid YAML frontmatter starts on the first line between `---` delimiters.

Build targets select an assistant family (`agents` or `claude`) and format (`multi-skill` or `single-skill`). The family determines assistant-specific text; configured directories determine installation paths.

- Multi-skill targets install numbered and shared skills under `skills/`, with guides under `apm-guides/`, rooted at `.claude/` or `.agents/`.
- Single-skill targets are a research preview. They install one `skills/apm/SKILL.md` entry. Shared initiation sources become `roles/{planner,manager,worker}.md`. The six guides and Handoff, recovery and summary instructions go under `guides/`; communication and bus support go under `communication/`. Reference documents have no skill frontmatter. Check Tasks/Reports wrappers are omitted; the entry routes to role-owned receipt instructions.

All targets use the same workflow sources, workspace-root `AGENTS.md` and initial `.apm/` artifacts. The build maps paths and strips reference frontmatter without rewriting workflow prose.

## 3. Navigation

Title runtime files `APM {VERSION} - <Name>`. Use one H1, numbered H2 sections (`## 1. Title`) and numbered subsections (`### 1.1 Title`). Use short Title Case headings that fit any kind of work.

References use section numbers: `§4` locally, or `{GUIDE_PATH:task-logging} §5.1` across files. Update references when sections move. Use explicit paths and the placeholders below. Refer to another file only when the reading role may load it; otherwise include the needed instruction locally.

## 4. Artifact Contracts

Define each artifact's location, naming, schema, allowed values, required and conditional fields, and non-obvious field meanings. Initial artifacts match their owning formats.

- `<value>` marks a value to fill; `[optional]` marks conditional content; `...` marks continuation.
- `<N>` and `<M>` are integers; `<NN>` and `<MM>` are zero-padded path identifiers.
- Task IDs use `N.M` in prose, integers in YAML (`stage: 2`, `task: 3`) and zero padding in paths (`stage-02/task-02-03.log.md`).
- APM artifact names use kebab-case; logs end in `.log.md` and summaries in `.summary.md`, including `session.summary.md`.

Root APM artifact paths at `.apm/`. Preserve field names, values, separators and identity rules used by the CLI and other roles. Distinguish literal content from fill-in values in format examples.

Optional supporting documents use the session-specific paths and structures agreed in the Spec. Plan Tasks carry their implementation instructions. Their use follows `WORKFLOW.md` §3.6.

## 5. Build Placeholders and Checks

Supported placeholders resolve through `build/processors/placeholders.js` and the output mapping in `build/processors/paths.js`:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template version |
| `{SKILL_PATH:name}` | The source skill's output file: a skill, role or procedure reference, depending on the target |
| `{SKILL_DIR:name}` | The mapped file's directory, for support files |
| `{GUIDE_PATH:name}` | `<configured guides directory>/<name>.md` |
| `{CLAUDE_ONLY:text}` | Text kept only for the Claude assistant family; start with a space when following a sentence |

Build all four targets after changes. Check schemas, formats, initial artifacts, references, summary links and resolved paths and placeholders. Single-skill bundles contain exactly one `SKILL.md`; existing multi-skill output must remain equivalent to its sources. Unmapped single-skill references fail the build.
