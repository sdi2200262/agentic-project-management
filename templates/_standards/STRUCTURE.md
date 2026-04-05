# APM Structure Standards

This document defines the organizational structure for APM commands, guides, and skills - required sections, ordering, and document-level formatting. This is a development-time specification: agents do not read this file during runtime. The structural patterns defined here are implemented by template authors in commands, guides, and skills. Content presentation and writing conventions follow [`WRITING.md`](./WRITING.md). All terms are defined in [`TERMINOLOGY.md`](./TERMINOLOGY.md).

---

## 1. Structure Policy

### 1.1 Document Type Matrix

Different document types have different structural needs. This matrix defines the rigidity expectations:

| Document Type | Structure Policy |
| ------------- | ---------------- |
| **Initiation commands** (`apm-1`, `apm-2`, `apm-3`) | Strict structure. Role declaration, initiation, core procedures, operating rules. |
| **Utility commands** (`apm-4`, `apm-5`, `apm-8`) | Lightweight structure. Short trigger or standalone commands - full rigidity adds no clarity. |
| **Handoff commands** (`apm-6`, `apm-7`) | Lightweight structure. Procedure, structural specs for artifacts. |
| **Troubleshooting commands** (`apm-9`) | Lightweight structure. Recovery and diagnostic commands for workflow disruptions. |
| **Guides** | Strict 5-section pattern (§1 Overview through §5 Content Guidelines) by default. Sections may be merged only when there is a clear, justified reduction in cross-referencing overhead - not for cosmetic reasons. |
| **Skills** | Free-form structure. Required: §1 Overview (reading agents, objectives, outputs) and end marker. Internal organization adapts to the skill's nature - skills may contain standards, procedures, reference content, or any combination. |
| **Agents** | Free-form structure. Required: §1 Overview (spawning agents, purpose, outputs) and end marker. Internal organization adapts to the agent's purpose. |

---

## 2. Command Structure

Commands are user-facing prompts that initiate key workflow actions.

### 2.1 YAML Frontmatter

Every command file begins with YAML frontmatter.

**Schema:**

```yaml
---
command_name: <kebab-case-name>
description: <one or two sentence description of command purpose>
---
```

- `command_name` (required, kebab-case): Command identifier.
- `description` (required, one or two sentences): Brief statement of command purpose.

### 2.2 Section Structure

Commands follow a variable structure based on purpose, with required opening and closing sections.

| Section | Position | Purpose |
| ------- | -------- | ------- |
| Overview | §1 (always first) | Introduce agent role, confirm identity, state responsibilities. |
| [Procedures] | §2 through §(N-1) | Primary procedures for this command. Variable based on purpose. |
| Operating Rules | §N (always last numbered) | Boundaries, standards, and constraints for agent behavior. |

### 2.3 Command Profiles

**Initiation commands** (strict profile):

| Section | Content |
| ------- | ------- |
| §1 Overview | Role declaration ("You are the **[Agent Type]**"), role scope, greeting instruction, responsibilities, skill reference. |
| §2 Initiation | First instance vs incoming agent logic, artifact reading. Worker includes identity binding. Exemption: the Planner (`apm-1`) operates as a single instance with no Handoff or incoming agent logic, so §2 is omitted and core Procedures start at §2. |
| §3+ [Core Procedures] | Main procedures for this agent type. |
| §N Operating Rules | Boundaries, communication, subagent usage. |

**Utility and troubleshooting commands** (lightweight profile): One-liner purpose with applicability guard and argument handling. Flat procedure steps handle core logic. No formal sections - title, description paragraph, procedure, end marker.

**Handoff commands** (lightweight profile):

| Section | Content |
| ------- | ------- |
| §1 Overview | Handoff purpose, artifacts produced. |
| §2 Handoff Procedure | Handoff execution actions. |
| §3+ [Structural Sections] | Handoff Log structure, handoff prompt structure. |

---

## 3. Guide Structure

Guides are agent-facing documents containing procedural instructions and operational standards. Each guide is read by only one agent role and omits YAML frontmatter.

### 3.1 Section Structure

Guides follow a consistent structure with §1 Overview, §2 Operational Standards, §3 Procedure(s), §4 Structural Specifications, and §5 Content Guidelines.

| Section | Number | Purpose |
| ------- | ------ | ------- |
| Overview | §1 | Introduce purpose and reading agent. Subsections for objectives and outputs are optional - include when they convey non-obvious information not already clear from the guide title. |
| Operational Standards | §2 | Define reasoning approaches and decision rules for the procedure. |
| [Procedure Section] | §3 | Define the procedure and its parts. |
| Structural Specifications | §4 | Define output formats and schemas. Omit when the guide produces no artifacts or only references formats defined elsewhere. |
| Content Guidelines | §5 | Common Mistakes for genuinely non-obvious error patterns. Omit quality standards subsections that restate §2 Operational Standards. |

**Section omission and renumbering:** When a section is omitted, subsequent sections renumber sequentially. For example, if §4 is omitted, §5 becomes §4.

**§5 Content Guidelines elevation:** When Content Guidelines contains only Common Mistakes (no additional quality subsections), the heading becomes `## 5. Common Mistakes` - dropping the "Content Guidelines" container. This elevation applies only to this section, and the section number follows the renumbering rule above.

**Procedure section structure:** Each guide contains one procedure. Section title is `## 3. [Procedure Name] Procedure`. A brief description before the first subsection orients the reader on the procedure's shape - its parts, their order, and any non-sequential flow (loops, conditional branches, approval gates). These describe structure, not duplicate subsection headers verbatim. Subsections (§3.1, §3.2...) define the procedure's flow.

### 3.2 Section Requirements

**§1 Overview:** Introduce the guide's purpose and reading agent. Subsections for navigation, objectives, and outputs are optional and should be omitted when they would restate the guide title or preview content defined in later sections.

**§2 Operational Standards:** One subsection per standards area. Cover reasoning and decision areas for the procedure. Include default behavior statements where ambiguity is possible.

**§3 Procedure:** Single procedure with subsections defining its flow. Cross-references §2 standards when decisions apply. Includes conditional branching where applicable.

**§4 Structural Specifications:** Define formats for all outputs. Specify file path patterns. Provide schemas with field descriptions. Omit type and required annotations for self-documenting fields.

**§5 Content Guidelines:** Common Mistakes is the primary content - include only patterns not already derivable as inversions of §2 Operational Standards. Additional quality or communication subsections are omitted when they restate §2 or the communication skill. When multiple subsections exist, use `###` headings. When only Common Mistakes remains, the heading becomes `## 5. Common Mistakes` (or the renumbered equivalent if §4 was omitted).

---

## 4. Skill Structure

Skills are agent-facing documents with free-form internal organization. Each skill file begins with YAML frontmatter.

### 4.1 YAML Frontmatter

**Schema:**

```yaml
---
name: <skill-name>
description: <one or two sentence description of skill purpose>
---
```

- `name` (required, kebab-case): Skill identifier. Matches directory name.
- `description` (required, one or two sentences): Brief statement of skill purpose.

### 4.2 Section Structure

Skills require §1 Overview (including reading agents) and an end marker. Subsections for objectives and outputs within §1 are optional - include when they convey non-obvious information. Beyond §1, skills organize content freely to match their nature. Skills may contain operational standards, procedures, structural specifications, content guidelines, or any combination - section naming and ordering adapts to the skill's purpose.

**Additional files.** A skill directory may contain additional files alongside `SKILL.md` for supplementary content (integration guides, reference material, scripts). Additional files do not require YAML frontmatter or specific section structure.

---

## 5. Agent Structure

Agents are custom subagent configuration files shipped with APM bundles. Each agent file begins with YAML frontmatter.

### 5.1 YAML Frontmatter

**Schema:**

```yaml
---
name: <agent-name>
description: <one or two sentence description of agent purpose>
---
```

- `name` (required, kebab-case): Agent identifier. Matches filename stem.
- `description` (required, one or two sentences): Brief statement of agent purpose.

### 5.2 Section Structure

Agents require §1 Overview (including spawning agents, purpose, and outputs) and an end marker. Beyond §1, agents organize content freely to match their purpose.

---

## 6. Section Formatting Rules

### 6.1 Heading Levels

| Level | Markdown | Usage |
| ----- | -------- | ----- |
| H1 | `#` | Document title only. One per file. |
| H2 | `##` | Major sections (§1, §2, §3, etc.). |
| H3 | `###` | Subsections (§1.1, §2.3, etc.). |
| Bold | `**text**` | Introduces sub-topics with inline content. |
| Italic | `*text*` | Labels items within lists. |

Deeper hierarchy within subsections uses **bold** to introduce sub-topics and *italic* to label items within lists. See `WRITING.md` §7.1 for formatting patterns.

### 6.2 Section Numbering

| Format | Usage |
| ------ | ----- |
| `## 1. Section Name` | Major sections. |
| `### 1.1 Subsection Name` | Subsections. |

Section numbers in text references use the § symbol with section title: "See §3.2 Dependency Context."

### 6.3 Horizontal Rules

Horizontal rules (`---`) separate major sections (## headings) only. Horizontal rules are not used within sections or between subsections.

**Planning documents** (Spec, Plan) use a single horizontal rule to separate the document header from content. No other horizontal rules appear in planning documents — `##` and `###` headings provide sufficient visual separation.

---

## 7. YAML Frontmatter Rules

### 7.1 General Rules

| Rule | Description |
| ---- | ----------- |
| Position | Always at the very beginning of the file. |
| Delimiters | Begin and end with `---` on their own lines. |
| Indentation | No indentation for top-level fields. |
| Quotes | Strings containing special characters are quoted. |

### 7.2 Field Naming

| Rule | Description |
| ---- | ----------- |
| Case | Field names use snake_case. |
| Clarity | Field names are descriptive. |
| Consistency | Field names are consistent across all files of the same type. |

### 7.3 Field Values

| Type | Format |
| ---- | ------ |
| Strings | No quotes unless containing special characters. |
| Numbers | No quotes. |
| Lists | Comma-separated in a single line, or YAML list syntax. |
| Booleans | `true` or `false` (lowercase). |

---

## 8. Structural Specifications Rules

These rules govern output format definitions in structural specifications sections of skills and guides. Tables are the appropriate format for structural specifications, schemas, format definitions, and enumerated field descriptions. Prose remains preferred for explanatory and instructional content per `WRITING.md` §1.3.

### 8.1 Format Definition Structure

Each format definition includes: location (file path pattern with placeholders), naming convention (explanation of path components), schema (YAML frontmatter and/or markdown body structure), and field descriptions (type, required status, allowed values, purpose).

### 8.2 Schema Representation

**YAML Schemas:** Use fenced code blocks with `yaml` language tag:

````markdown
**YAML Frontmatter Schema:**

```yaml
---
field_one: <type or allowed values>
field_two: <type or allowed values>
---
```

**Field Descriptions:**

- `field_one`: string, required, specifies [purpose].
- `field_two`: enum, required, indicates [purpose]. Allowed values are `A`, `B`, or `C`.
````

**Markdown Body Templates:** Use fenced code blocks with `markdown` language tag.

### 8.3 Placeholder Notation

Value placeholders use `<placeholder>` for values to fill, `[optional]` for conditional content, `...` for pattern continuation, `<N>`/`<M>` for integer values, and `<NN>`/`<MM>` for zero-padded numeric identifiers. Cross-reference placeholders (`{SKILL_PATH:name}`, `{GUIDE_PATH:name}`, `{COMMAND_PATH:name}`, `{AGENT_PATH:name}`, `{SKILLS_DIR}`, `{GUIDES_DIR}`, `{AGENTS_DIR}`, `{RULES_FILE}`, `{VERSION}`, `{TIMESTAMP}`, `{ARGS}`) are resolved during build.

---

## 9. File Naming Conventions

### 9.1 Command Files

| Component | Convention |
| --------- | ---------- |
| Directory | `commands/` |
| File | `apm-<N>-<action>.md` |
| Prefix | `apm-<N>-` where N is sort order |
| Names | kebab-case throughout |

### 9.2 Guide Files

| Component | Convention |
| --------- | ---------- |
| Directory | `guides/` |
| File | `<guide-name>.md` |
| Guide name | kebab-case |

### 9.3 Skill Files

| Component | Convention |
| --------- | ---------- |
| Directory | `skills/<skill-name>/` |
| File | `SKILL.md` (uppercase) |
| Skill name | kebab-case, matches directory name |

### 9.4 APM Artifact Files

| Component | Convention |
| --------- | ---------- |
| Paths | kebab-case throughout |
| Logs | `.log.md` suffix for Task Logs and Handoff Logs |
| Directories | `stage-<NN>/`, `handoffs/<agent>/` |

### 9.5 Task Identifiers

Tasks are identified by Stage number and Task number using the compound `N.M` format (e.g., Task 2.3) in markdown prose. YAML frontmatter uses plain integers (`stage: 1`, `task: 2`) as the natural machine-format data type. File paths use zero-padded numbers (`stage-01/task-01-02.log.md`) for lexicographic sorting so Stages and Tasks sort correctly in the user's file system.

### 9.6 Agent Files

| Component | Convention |
| --------- | ---------- |
| Directory | `agents/` |
| File | `<agent-name>.md` |
| Agent name | kebab-case, matches filename stem |

---

## 10. End Markers

Every command, guide, skill, and agent file ends with an end marker followed by a blank line.

**Commands:**

```text
---

**End of Command**

```

**Guides:**

```text
---

**End of Guide**

```

**Skills:**

```text
---

**End of Skill**

```

**Agents:**

```text
---

**End of Agent**

```

The end marker follows a horizontal rule, uses bold formatting, and is followed by a blank line.

---

**End of Structure Standards**
