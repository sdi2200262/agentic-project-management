# APM Structure Standards

These standards define source layout, navigation and artifact contracts for template authors. `WRITING.md` covers prose and Markdown presentation; `TERMINOLOGY.md` defines APM terms.

## 1. Organize for use

Open each file with a short paragraph, without a heading, that says what the file covers and what it produces. Command skills establish the agent's role; guides and shared skills, like other skills, describe a procedure or protocol and leave the role to the command skill that loads them.

State each rule once, in the section where the agent applies it. Each section covers one part of the work and holds the steps and rules for it. A rule appears a second time only where testing showed agents skipping it, as a one-sentence reminder at the point of use.

Place artifact contracts in a final Formats section of the file that owns them, with one subsection per artifact. Each contract has one home.

| Document | Content |
|---|---|
| Initiation command skill | An opening that places the role in the system: the other agents, what the role receives and from whom, what it produces and for whom, how messages travel, and its scope. Then identity and loading sequence, behavior at first start and after Handoff, duties and boundaries. The Planner has one conversation and no Handoff. |
| Utility or recovery command skill | Purpose, applicability, arguments, procedure and completion behavior. |
| Handoff command skill | Applicable role, transfer procedure, Handoff Log and Handoff Prompt formats. |
| Guide | Opening paragraph saying what the guide covers, followed by brief context the steps rely on, such as the sections of the input it works from; one numbered section per step of the procedure, in the order the agent acts, each holding its own rules, with subsections for work that happens within a step (troubleshooting and batches within execution); a final Formats section for the contracts the guide owns. A guide stops where the next guide's procedure begins and points to it. |
| Shared skill | Reading roles and purpose, followed by procedures and reference content. |

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

The build resolves placeholders and copies skills with their source frontmatter. Each target installs into its own folder at the workspace root, `.claude/` for Claude Code and `.agents/` for the `agents` target, with skills under `skills/` and guides under `apm-guides/`. The build resolves paths for each target, so templates name exact paths and never ask the agent to work out its folder. The Rules live in `AGENTS.md` for every target; Claude Code-only instructions, such as importing `AGENTS.md` into an existing `CLAUDE.md`, go in `{CLAUDE_ONLY:text}`. Prose refers to command skills by name.

## 3. Navigation and references

Title each runtime file `APM {VERSION} - <Name>`, where the name says what the file is, such as `Worker Initiation`, `Check Reports` or `Task Review Guide`; skill titles do not say "Command". Use one H1 title, H2 major sections and H3 subsections, adding deeper levels when needed. Number sections as `## 1. Title` and `### 1.1 Title`. Headings are short Title Case noun phrases that name the subject, such as `Validation`, `Dependency Context` or `Task Log Format`. Prefer a name that fits any kind of work over a coding-only one, such as `Troubleshooting` over `Debugging`. References give the number only: `§4` within a file, or `{GUIDE_PATH:task-logging} §5.1` across files. When sections are renumbered, update every reference to them.

Use explicit file paths and section references where they help navigation. Cross-file references use the placeholders in §5. A reference is enough only when the reading role can load the target within its normal access boundaries; otherwise state the rule where that role reads it.

## 4. Artifact contracts

Each format definition specifies its location, naming, schema, allowed values, required/conditional fields and the meaning of non-obvious fields. Fenced examples distinguish literal content from values the agent fills in.

- `<value>` marks a value to fill; `[optional]` marks conditional content; `...` shows continuation.
- `<N>` and `<M>` are integers; `<NN>` and `<MM>` are zero-padded identifiers in paths.
- Prose Task IDs use `N.M`, such as Task 2.3. YAML uses integers (`stage: 2`, `task: 3`). Paths use zero padding, such as `stage-02/task-02-03.log.md`.
- APM artifact paths use kebab-case. Task and Handoff Logs use `.log.md`; their runtime guides and skills define the fields and body sections.

Keep APM artifact paths rooted at `.apm/`. Preserve schemas, field names, allowed values, bus separators, identity rules and artifact paths used by other roles or the CLI. Artifact contracts govern required formatting, including YAML delimiters and batch separators.

## 5. Build placeholders and validation

Supported placeholders match `build/processors/placeholders.js` and resolve per target:

| Placeholder | Result |
|---|---|
| `{VERSION}` | Template version |
| `{SKILL_PATH:name}` | `.claude/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md` |
| `{SKILL_DIR:name}` | `.claude/skills/<name>` or `.agents/skills/<name>`, for a skill's support files |
| `{GUIDE_PATH:name}` | `.claude/apm-guides/<name>.md` or `.agents/apm-guides/<name>.md` |
| `{CLAUDE_ONLY:text}` | `text` in the `claude` target, nothing in the others; start `text` with a space when it follows a sentence |

Validate references, artifact contracts, resolved placeholders and resolved paths in both generated bundles after changes.
