# APM Structure Standards

This document defines the organizational structure for APM Skills and Commands—required sections, ordering, and document-level formatting. Content presentation and writing conventions follow [`WRITING.md`](./WRITING.md). All terms are defined in [`TERMINOLOGY.md`](./TERMINOLOGY.md).

---

## 1. Skill Structure

Skills are agent-facing documents containing procedural instructions and operational standards.

### 1.1 YAML Frontmatter

Every skill file begins with YAML frontmatter.

**Schema:**

```yaml
---
name: <skill-name>
description: <one or two sentence description of skill purpose>
---
```

**Field Specifications:**

- `name` (required, kebab-case): Skill identifier. Matches directory name.
- `description` (required, one or two sentences): Brief statement of skill purpose.

**Example:**

```yaml
---
name: task-assignment
description: Construction and delivery of Task Assignment Prompts to Worker Agents.
---
```

---

### 1.2 Section Structure

Skills follow a consistent structure with §1 Overview, §2 Operational Standards, §3 Procedure(s), §4 Structural Specifications and §5 Content Guidelines.

**Required Sections:**
| Section | Number | Purpose |
|---------|--------|---------|
| Overview | §1 | Introduce skill purpose, usage instructions, objectives, and outputs (if applicable). |
| Operational Standards | §2 | Define reasoning approaches and decision rules for the skill's Procedure. |
| [Procedure Section] | §3 | Define the Procedure and its Activities. |
| Structural Specifications | §4 | Define output formats and schemas. |
| Content Guidelines | §5 | Define quality standards and common mistakes. |

**Procedure Section Structure:** Each skill contains one Procedure. Section title is `## 3. [Procedure Name] Procedure`. Subsections (§3.1, §3.2...) are the Procedure's Activities.

---

### 1.3 Section Requirements

**§1 Overview Requirements:**

| Subsection | Required | Content |
|------------|----------|---------|
| §1.1 How to Use This Skill | Yes | Three-part guidance pattern. |
| §1.2 Objectives | Yes | Bulleted list of outcomes. |
| §1.3 Outputs | Conditional | Artifacts or deliverables description. Omit if skill produces no artifacts. |
| §1.N Additional | Optional | Context specific to skill. |

**§2 Operational Standards Requirements:**

| Requirement | Description |
|-------------|-------------|
| Scope | Cover all reasoning and decision areas for the Procedure(s) in the skill. |
| Structure | One subsection per standards area. |
| Naming | Subsection names use the "[Topic] Standards" pattern. |
| Decision Rules | Include explicit decision rules with conditions and actions. |
| Defaults | Include default behavior statements where ambiguity is possible. |

**§3 Procedure Requirements:**

| Requirement | Description |
|-------------|-------------|
| Single Procedure | Each skill contains one Procedure in §3. Subsections (§3.1, §3.2...) are Procedure Activities. |
| Naming | Section title is `## 3. [Procedure Name] Procedure` matching or derived from skill name. |
| Activities | Each subsection defines one Activity with clear purpose and actions. |
| Naming parallel | If §2 has "[X] Standards", corresponding §3 Activities should use matching terminology (e.g., "[X] Analysis", "[X] Assessment"). |
| Actions format | The "Perform the following actions:" format is followed by an ordered list. |
| Cross-references | Reference §2 standards when decisions apply using format: "per §2.N [Title]." |
| Flow control | Include conditional branching where applicable using decision rules from §2 standards. |

**§4 Structural Specifications Requirements:**

| Requirement | Description |
|-------------|-------------|
| Scope | Define formats for all outputs the skill produces. |
| Location | Specify file path patterns where outputs are stored. |
| Schema | Provide complete schema or template for outputs when needed. |
| Fields | Describe all fields with allowed values. |

**§5 Content Guidelines Requirements:**

| Requirement | Description |
|-------------|-------------|
| Quality | Define quality standards specific to this skill's outputs. |
| Common Mistakes | Always include as final subsection. |

---

## 2. Command Structure

Commands are user-facing prompts that initiate key workflow actions.

### 2.1 YAML Frontmatter

Every command file begins with YAML frontmatter.

**Schema:**

```yaml
---
priority: <number>
command_name: <kebab-case-name>
description: <one or two sentence description of command purpose>
---
```

**Field Specifications:**

- `priority` (required, integer): Controls sort order in command menu. Lower numbers appear first.
- `command_name` (required, kebab-case): Command identifier. Used in slash command.
- `description` (required, one or two sentences): Brief statement of command purpose.

**Example:**

```yaml
---
priority: 2
command_name: initiate-manager
description: Initializes a Manager Agent to coordinate project execution.
---
```

---

### 2.2 Section Structure

Commands follow a variable structure based on purpose, with required opening and closing sections.

**Required Sections:**

| Section | Position | Purpose |
|---------|----------|---------|
| Overview | §1 (always first) | Introduce agent role, confirm identity, state responsibilities. |
| [Procedures] | §2 through §(N-1) | Primary Procedures for this command. Variable based on purpose. |
| Operating Rules | §N (always last numbered) | Boundaries, standards, and constraints for agent behavior. |

---

### 2.3 Section Requirements

**§1 Overview Requirements:**

| Requirement | Description |
|-------------|-------------|
| Role declaration | Begins with "You are the **[Agent Type]**" statement. |
| Role scope | One sentence defining what this agent does and does not do. |
| Greeting instruction | Instructs agent to greet User and confirm identity. |
| Responsibilities | States primary responsibilities or Procedure names. |
| Skill reference | Notes that skills are available in the skills directory. |

**§2-§(N-1) Procedure Requirements:**

| Requirement | Description |
|-------------|-------------|
| Variable structure | Number and names of sections vary by command purpose. |
| Action format | Follows the "Perform the following actions:" pattern. |
| Skill references | References skills for detailed Procedures using format: "per {SKILL_PATH:skill-name} §N.M Section Title." |
| Conditional paths | Includes branching for different scenarios (e.g., first Session vs Incoming Agent after Handoff). |

**§N Operating Rules Requirements:**

| Requirement | Description |
|-------------|-------------|
| Position | Always the last numbered section. |
| Categories | Rules are organized into logical subsections. |
| Boundaries | Defines what the agent does and does not do. |
| Communication | Includes communication standards if applicable. |
| Cross-references | References relevant skill sections for detailed standards. |

---

### 2.4 Command Type Variations

**Initiation Commands:**

| Section Pattern | Content |
|-----------------|---------|
| §1 Overview | Role declaration, responsibilities. |
| §2 Session Initiation | First Session vs Incoming Agent logic, artifact reading. Worker Agent includes Worker Registration. |
| §3+ [Core Procedures] | Main Procedures for this agent type. |
| §N Operating Rules | Boundaries, communication, delegation capability. |

**Handoff Commands:**

| Section Pattern | Content |
|-----------------|---------|
| §1 Overview | Handoff purpose, artifacts produced. |
| §2 Handoff Eligibility | Requirements, blocking scenarios, denial handling. |
| §3 Handoff Procedure | Handoff execution actions. |
| §4+ [Structural Sections] | Handoff Memory Log structure, Handoff Prompt structure. |

---

## 3. Section Formatting Rules

### 3.1 Heading Levels

| Level | Markdown | Usage |
|-------|----------|-------|
| H1 | `#` | Document title only. One per file. |
| H2 | `##` | Major sections (§1, §2, §3, etc.). |
| H3 | `###` | Subsections (§1.1, §2.3, etc.). |
| Bold | `**text**` | Sub-topics within subsections. |
| Italic | `*text*` | Items within sub-topics. |

Deeper hierarchy within subsections uses **bold** for sub-topics and *italic* for items within sub-topics.

### 3.2 Section Numbering

| Format | Usage |
|--------|-------|
| `## 1. Section Name` | Major sections. |
| `### 1.1 Subsection Name` | Subsections. |

Section numbers in text references use the § symbol with section title: "See §3.2 Context Integration."

### 3.3 Horizontal Rules

Horizontal rules (`---`) separate major sections (## headings) only. Horizontal rules are not used within sections or between subsections.

---

## 4. YAML Frontmatter Rules

### 4.1 General Rules

| Rule | Description |
|------|-------------|
| Position | Always at the very beginning of the file. |
| Delimiters | Begin and end with `---` on their own lines. |
| Indentation | No indentation for top-level fields. |
| Quotes | Strings containing special characters are quoted. |

### 4.2 Field Naming

| Rule | Description |
|------|-------------|
| Case | Field names use snake_case. |
| Clarity | Field names are descriptive. |
| Consistency | Field names are consistent across all files of the same type. |

### 4.3 Field Values

| Type | Format |
|------|--------|
| Strings | No quotes unless containing special characters. |
| Numbers | No quotes. |
| Lists | Comma-separated in a single line, or YAML list syntax. |
| Booleans | `true` or `false` (lowercase). |

---

## 5. Structural Specifications Rules

These rules govern output format definitions in Structural Specifications sections of skills.

### 5.1 Format Definition Structure

Each format definition includes:

- **Location:** File path pattern with placeholders.
- **Naming Convention:** Explanation of path components.
- **Schema:** YAML frontmatter and/or markdown body structure.
- **Field Descriptions:** Prose description of each field, including its type, required status, allowed values, and purpose.

### 5.2 Schema Representation

**YAML Schemas:** YAML schemas use triple backticks for the outer block and 4-space indentation for the inner schema:

```markdown
**YAML Frontmatter Schema:**

    ---
    field_one: <type or allowed values>
    field_two: <type or allowed values>
    ---

**Field Descriptions:**

- `field_one`: string, required, specifies [purpose]. 
- `field_two`: enum, required, indicates [purpose]. Allowed values are `A`, `B`, or `C`.
```

**Markdown Body Templates:** Markdown body templates use triple backticks for the outer block and 4-space indentation for template content:

```markdown
**Markdown Body Template:**

    # [Title]

    ## Section One

    [Description of section content.]

    ## Section Two

    [Description of section content.]
```

### 5.3 Placeholder Notation

**Value Placeholders:**

| Notation | Meaning |
|----------|---------|
| `<placeholder>` | Value to be filled in. |
| `[optional]` | Content included conditionally. |
| `...` | Pattern continues. |
| `N`, `M` | Numeric placeholders. |
| `<Slug>` | Descriptive identifier derived from title. |

**Cross-Reference Placeholders:** Used when referencing content from other files. Resolved during build.

| Placeholder | Purpose |
|-------------|---------|
| `{SKILL_PATH:skill-name}` | Path to skill directory. |
| `{COMMAND_PATH:command-name}` | Path to command file. |
| `{SKILLS_DIR}` | Skills directory path. |
| `{AGENTS_FILE}` | Platform-specific agents file (CLAUDE.md or AGENTS.md). |
| `{VERSION}` | Package version. |
| `{TIMESTAMP}` | Build timestamp (ISO format). |
| `{ARGS}` | Arguments placeholder ($ARGUMENTS for markdown, {{args}} for toml). |

### 5.4 Path Patterns

| Pattern | Description |
|---------|-------------|
| `Stage_<N>_<Slug>/` | Stage directory with number and slug. |
| `Task_Log_<N>_<M>_<Slug>.md` | Task Memory Log with stage, task, and slug. |
| `Delegation_Log_<N>_<M>_<Type>_<Slug>.md` | Delegation Memory Log with stage, task, type, and slug. |
| `<AgentID>_Handoffs/` | Agent-specific Handoff directory. |
| `<AgentID>_Handoff_Log_<N>.md` | Handoff Memory Log with agent ID and session number. |

---

## 6. File Naming Conventions

### 6.1 Skill Files

| Component | Convention |
|-----------|------------|
| Directory | `skills/<skill-name>/` |
| File | `SKILL.md` (uppercase) |
| Skill name | kebab-case, matches directory name |

**Example:** `skills/task-assignment/SKILL.md`

### 6.2 Command Files

| Component | Convention |
|-----------|------------|
| Directory | `<agent-type>-agent/` |
| File | `<agent-type>-agent-<action>.md` |
| Names | kebab-case throughout |

**Examples:**
- `manager-agent/manager-agent-initiation.md`
- `manager-agent/manager-agent-handoff.md`
- `worker-agent/worker-agent-initiation.md`

---

## 7. End Markers

Every skill and command file ends with an end marker followed by a blank line.

**Skills:**
```
---

**End of Skill**

```

**Commands:**
```
---

**End of Command**

```

The end marker follows a horizontal rule, uses bold formatting, and is followed by a blank line.

---

**End of Structure Standards**
