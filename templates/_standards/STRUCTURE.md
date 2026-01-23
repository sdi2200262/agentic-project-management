# APM Structure Standards

This document defines the file structure for APM skills and commands. It establishes required sections, ordering, and formatting rules.

All terms used in this document are defined in `TERMINOLOGY.md`. Writing conventions follow `WRITING.md`.

---

## 1. Skill Structure

Skills are agent-facing documents containing procedural instructions and operational standards.

### 1.1 YAML Frontmatter

Every skill file begins with YAML frontmatter.

**Schema:**

```yaml
---
name: <skill-name>
description: <one-line description of skill purpose>
---
```

**Field Specifications:**

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| `name` | Yes | kebab-case | Skill identifier. Matches directory name. |
| `description` | Yes | Single sentence | Brief statement of skill purpose. |

**Example:**

```yaml
---
name: task-assignment
description: Construction and delivery of Task Assignment Prompts to Worker Agents.
---
```

---

### 1.2 Section Structure

Skills follow a consistent structure with §1 Overview, §2 Operational Standards, §3 Procedure(s), followed by Structural Specifications and Content Guidelines as the final two sections.

**Required Sections:**

| Section | Number | Purpose |
|---------|--------|---------|
| Overview | §1 | Introduce skill purpose, usage instructions, objectives, and outputs (if applicable). |
| Operational Standards | §2 | Define reasoning approaches and decision rules for the skill. |
| [Procedure Section] | §3 | Define procedures. Single procedure or umbrella section containing multiple procedures as subsections. |
| Structural Specifications | §4 | Define output formats and schemas. Always second-to-last. |
| Content Guidelines | §5 | Define quality standards and common mistakes. Always last. |

**Procedure Section Structure:**

Skills contain either a single procedure or multiple related procedures:

*Single Procedure:* Section title is `## 3. [Procedure Name] Procedure`. Subsections (§3.1, §3.2...) are procedure parts.

*Multiple Procedures:* Section title is `## 3. [Umbrella Term] Procedure` where the umbrella term describes the collective purpose (e.g., "Memory Maintenance", "Task Execution"). Each subsection (§3.1, §3.2...) is a distinct procedure. The umbrella term should match or derive from the skill name.

**Section Template:**

```markdown
# APM {VERSION} - [Skill Name] Skill

## 1. Overview

**Reading Agents:** [Agent Type(s) that use this skill]

[Introductory paragraph describing skill purpose.]

### 1.1 How to Use This Skill

[Three-part guidance: Execute procedures, Use standards, Follow formats.]

### 1.2 Objectives

[Bulleted list of what this skill accomplishes.]

### 1.3 Outputs

[Description of artifacts or deliverables produced. Omit this subsection if the skill produces no artifacts.]

### 1.4 [Optional Context Subsection]

[Additional context specific to this skill. Only include if needed.]

---

## 2. Operational Standards

This section establishes reasoning approaches and decision rules for [skill purpose].

### 2.1 [First Standards Area] Standards

[Standards content with decision rules and defaults.]

### 2.2 [Second Standards Area] Standards

[Continue as needed.]

---

## 3. [Umbrella Term or Single Procedure Name] Procedure

This section defines [what this procedure/these procedures accomplish].

[For single procedure: Subsections are procedure parts.]
[For multiple procedures: Each subsection is a distinct procedure under the umbrella term.]

### 3.1 [First Procedure or Part Name]

Perform the following actions:

1. [Action with specific details.]
2. [Action with specific details.]
3. [Action with specific details.]

### 3.2 [Second Procedure or Part Name]

[Continue as needed.]

---

## 4. Structural Specifications

This section defines output formats for [artifacts produced].

### 4.1 [First Format Name] Format

**Location:** [File path pattern]

**Schema:**

    [YAML or markdown structure using indentation for inner code block]

**Field Descriptions:**

[Table of fields with descriptions.]

### 4.2 [Second Format Name] Format

[Continue as needed.]

---

## 5. Content Guidelines

### 5.1 [First Guideline Area]

[Quality standards for this area.]

### 5.2 Common Mistakes

[Mistakes and corrections relevant to this skill.]

---

**End of Skill**
```

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
| Scope | Cover all reasoning and decision areas for the skill. |
| Structure | One subsection per standards area. |
| Naming | Subsection names should use "[Topic] Standards" pattern. |
| Decision Rules | Include explicit decision rules with conditions and actions. |
| Defaults | Include default behavior statements where ambiguity is possible. |

**§3 Procedure Requirements:**

| Requirement | Description |
|-------------|-------------|
| Single section | All procedures are contained within §3. |
| Single procedure | If skill has one procedure, subsections (§3.1, §3.2...) are procedure parts. |
| Multiple procedures | If skill has multiple procedures, subsections (§3.1, §3.2...) are distinct procedures under an umbrella term. |
| Umbrella naming | For multiple procedures, section title uses umbrella term matching or derived from skill name (e.g., "Memory Maintenance Procedure" for memory-maintenance skill). |
| Naming parallel | If §2 has "[X] Standards", corresponding §3 procedures/parts should use matching terminology (e.g., "[X] Analysis", "[X] Assessment"). |
| Actions format | Use "Perform the following actions:" pattern. |
| Cross-references | Reference §2 standards when decisions apply using format: "Apply §2.1 [Standards Name]." |
| Flow control | Include conditional branching where applicable. |

**§4 Structural Specifications Requirements:**

| Requirement | Description |
|-------------|-------------|
| Position | Always second-to-last section (§4). |
| Scope | Define formats for all outputs the skill produces. |
| Location | Specify file path patterns where outputs are stored. |
| Schema | Provide complete schema or template. |
| Fields | Describe all fields with allowed values. |

**§5 Content Guidelines Requirements:**

| Requirement | Description |
|-------------|-------------|
| Position | Always last section (§5). |
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
description: <one-line description of command purpose>
---
```

**Field Specifications:**

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| `priority` | Yes | Integer | Controls sort order in command menu. Lower numbers appear first. |
| `command_name` | Yes | kebab-case | Command identifier. Used in slash command. |
| `description` | Yes | Single sentence | Brief statement of command purpose. |

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
| [Procedures] | §2 through §(N-1) | Primary procedures for this command. Variable based on purpose. |
| Operating Rules | §N (always last numbered) | Boundaries, standards, and constraints for agent behavior. |

**Section Template:**

```markdown
# APM {VERSION} — [Agent Type] [Action] Command

## 1. Overview

You are the **[Agent Type]** for an Agentic Project Management (APM) Session. **[One-sentence role description.]**

Greet the User and confirm you are the [Agent Type]. [State primary responsibilities or procedures.]

[Additional overview content as needed.]

## 2. [Primary Procedure Name]

[Procedure content with subsections as needed.]

### 2.1 [First Part Name]

Perform the following actions:

1. [Action with specific details.]
2. [Action with specific details.]

### 2.2 [Second Part Name]

[Continue as needed.]

## 3. [Second Procedure Name]

[Continue with additional procedures as needed for this command.]

## N. Operating Rules

### N.1 [First Rule Category]

[Rules and boundaries for this category.]

### N.2 [Second Rule Category]

[Continue as needed.]

---

**End of Command**
```

---

### 2.3 Section Requirements

**§1 Overview Requirements:**

| Requirement | Description |
|-------------|-------------|
| Role declaration | Begin with "You are the **[Agent Type]**" statement. |
| Role scope | One sentence defining what this agent does and does not do. |
| Greeting instruction | Instruct agent to greet User and confirm identity. |
| Responsibilities | State primary responsibilities or procedure names. |
| Skill reference | Note that skills are available in the skills directory. |

**§2-§(N-1) Procedure Requirements:**

| Requirement | Description |
|-------------|-------------|
| Variable structure | Number and names of sections vary by command purpose. |
| Action format | Use "Perform the following actions:" pattern. |
| Skill references | Reference skills for detailed procedures using format: "Follow {SKILL_PATH:skill-name} §N.M Section Title." |
| Conditional paths | Include branching for different scenarios (e.g., Session 1 vs Continuing Session). |

**§N Operating Rules Requirements:**

| Requirement | Description |
|-------------|-------------|
| Position | Always the last numbered section. |
| Categories | Organize rules into logical subsections. |
| Boundaries | Define what the agent does and does not do. |
| Communication | Include communication standards if applicable. |
| Cross-references | Reference relevant skill sections for detailed standards. |

---

### 2.4 Command Type Variations

**Initiation Commands:**

| Section Pattern | Content |
|-----------------|---------|
| §1 Overview | Role declaration, responsibilities. |
| §2 Session Initiation | Session 1 vs Continuing Session logic, artifact reading. |
| §3+ [Core Procedures] | Main procedures for this agent type. |
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

For deeper hierarchy within subsections, use **bold** for sub-topics and *italic* for items within sub-topics. This is more token-efficient than additional heading levels.

### 3.2 Section Numbering

| Format | Usage |
|--------|-------|
| `## 1. Section Name` | Major sections. |
| `### 1.1 Subsection Name` | Subsections. |

Section numbers in text references use the § symbol with section title: "See §3.2 Context Integration."

### 3.3 Horizontal Rules

Use horizontal rules (`---`) to separate major sections (## headings) only. Do not use horizontal rules within sections or between subsections.

### 3.4 Spacing

**Bold sub-topics:** Place bold title on same line with content, lists directly under with no blank line:

```
**Title:** Content begins here on same line.
- List item one
- List item two
```

**Between paragraphs:** One blank line.

**Between bold and italic hierarchy:** One blank line.

**After code blocks:** One blank line.

### 3.5 Lists

**Numbered lists:** Use for sequential actions. Begin each item with capital letter, end with period.

**Bulleted lists:** Use for non-sequential items or options. Begin each item with capital letter, end with period.

**Nested lists:** Avoid nesting beyond one level. Restructure content if deeper nesting seems necessary.

---

## 4. YAML Frontmatter Rules

### 4.1 General Rules

| Rule | Description |
|------|-------------|
| Position | Always at the very beginning of the file. |
| Delimiters | Begin and end with `---` on their own lines. |
| Indentation | No indentation for top-level fields. |
| Quotes | Use quotes for strings containing special characters. |

### 4.2 Field Naming

| Rule | Description |
|------|-------------|
| Case | Use snake_case for field names. |
| Clarity | Use descriptive names. |
| Consistency | Use the same field names across all files of the same type. |

### 4.3 Field Values

| Type | Format |
|------|--------|
| Strings | No quotes unless containing special characters. |
| Numbers | No quotes. |
| Lists | Comma-separated in a single line, or YAML list syntax. |
| Booleans | `true` or `false` (lowercase). |

---

## 5. Structural Specifications Rules

When defining output formats in Structural Specifications sections of skills, follow these rules.

### 5.1 Format Definition Structure

Each format definition includes:

| Component | Description |
|-----------|-------------|
| Location | File path pattern with placeholders. |
| Naming Convention | Explanation of path components. |
| Schema | YAML frontmatter and/or markdown body structure. |
| Field Descriptions | Table of fields with types and descriptions. |

### 5.2 Schema Representation

**YAML Schemas:** Use triple backticks for the outer block and 4-space indentation for the inner schema:

```markdown
**YAML Frontmatter Schema:**

    ---
    field_one: <type or allowed values>
    field_two: <type or allowed values>
    ---

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `field_one` | String | Description of field. |
| `field_two` | Enum | Allowed values: `A`, `B`, `C`. |
```

**Markdown Body Templates:** Use triple backticks for outer block, 4-space indentation for template content:

```markdown
**Markdown Body Template:**

    # [Title]

    ## Section One

    [Description of section content.]

    ## Section Two

    [Description of section content.]
```

### 5.3 Placeholder Notation

| Notation | Meaning |
|----------|---------|
| `<placeholder>` | Value to be filled in. |
| `[optional]` | Content included conditionally. |
| `...` | Pattern continues. |
| `N`, `M` | Numeric placeholders. |
| `<Slug>` | Descriptive identifier derived from title. |

### 5.4 Path Patterns

| Pattern | Description |
|---------|-------------|
| `Stage_<N>_<Slug>/` | Stage directory with number and slug. |
| `Task_Log_<N>_<M>_<Slug>.md` | Task Memory Log with stage, task, and slug. |
| `<AgentID>_Handoffs/` | Agent-specific Handoff directory. |

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

### 6.3 Standards Files

| Component | Convention |
|-----------|------------|
| Directory | `_standards/` |
| Files | `UPPERCASE.md` |

**Files:**
- `_standards/TERMINOLOGY.md`
- `_standards/WRITING.md`
- `_standards/STRUCTURE.md`

---

## 7. End Markers

Every skill and command file ends with an end marker.

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

The end marker follows a horizontal rule and uses bold formatting.

---

**End of Structure Standards**
