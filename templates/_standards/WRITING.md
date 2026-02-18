# APM Writing Standards

This document defines how to write content within APM skills and commands. It establishes tone, instruction patterns, output guidance, and terminology usage rules.

All terms used in this document are defined in `TERMINOLOGY.md`. All structural patterns follow `STRUCTURE.md`.

---

## 1. General Principles

### 1.1 Core Standards

**Clarity** - every sentence serves a purpose. **Precision** - terms match `TERMINOLOGY.md` exactly. **Consistency** - the same patterns across all files. **Actionability** - every instruction is directly executable. **Completeness** - all cases covered, no gaps requiring assumptions.

### 1.2 Enforcement Tiers

**Hard requirements (must enforce):** Token efficiency and condensation practices. Markdown formatting rules. Direct actionable instruction style - imperative mood, no hedging. Output and schema fidelity. Terminology capitalization - only terms in `TERMINOLOGY.md` are capitalized. De-duplication - one primary explanation per concept.

All files must be aligned with markdownlint rules and pass markdownlint checks.

**Soft guidance (reasoning-oriented):** Phrasing style preferences. Narrative flow suggestions. Optional presentation patterns (tables vs prose, list vs paragraph).

### 1.3 Token Efficiency

Skills, guides, and commands are written for token efficiency while preserving comprehensiveness:

- Prose is preferred over tables when conveying the same information.
- Excessive spacing and structural padding are avoided.
- Compact list formats are used when listing related items.
- Redundant phrasing and unnecessary elaboration are eliminated.
- Related concepts are combined in flowing paragraphs rather than isolated bullets.
- Bold and italic introduce hierarchy inline instead of using additional heading levels.

Token efficiency does not mean sacrificing clarity or completeness. Remove waste and tighten expression, not substance.

### 1.4 Audience Awareness

Skills, guides, and commands serve two audiences: **Human Users** (readable prose, logical flow, clear structure, scannable sections) and **AI Agents** (predictable patterns, explicit instructions, unambiguous terminology). Content serves both - structured formats where appropriate, prose for explanations, consistent section patterns for reliable parsing.

### 1.5 Simplicity Standards

Skills and commands are written for capable models that reason well from clear, concise instructions:

**Trust model reasoning.** State rules and criteria clearly. Guide assessment rather than dictating decisions. Prefer reasoning frameworks over exhaustive if/then trees or lookup tables.

**Guardrail restraint.** One clear statement of a rule is sufficient. Do not restate the same constraint in multiple forms or pad instructions with cautionary variations. Include examples only when the pattern is genuinely non-obvious. Skills, guides, and commands should not exceed ~500 lines - reduce descriptive content before reducing structural specifications or procedural steps.

**Reasoning over classification.** Describe concepts through their implications rather than defining named categories for agents to classify into. Taxonomies are appropriate only for output schema fields where agents select from enumerated values.

### 1.6 De-Duplication Rule

Each concept has one primary explanation in one location, with brief references elsewhere. Other files should reference it ("per [location]" or "see [location]") instead of repeating full explanations.

---

## 2. Tone & Voice

### 2.1 Instructional Tone

Neutral, direct language. No hedging: "Consider..." not "You might want to consider...". "Do X." not "It would be a good idea to...". State facts directly without "Please note that..." framing.

### 2.2 Voice Standards

Active voice ("The Manager creates..." not "is created"). Second person for procedures ("Perform the following..."). Third person for descriptions ("The Worker executes..."). No anthropomorphization - agents execute and perform, they do not want, feel, or think.

### 2.3 Neutrality

No preference, opinion, or judgment unless defining a standard. "Use X when Y" not "The best approach is...". "X is required when Y" not "Ideally, you should...". State rules directly - rationale in a separate line if needed.

---

## 3. Instruction Writing

### 3.1 Imperative Mood

Instructions begin with action verbs: **Perform** (sequence of actions), **Execute** (run procedure), **Read** (access file/section), **Create** (new artifact), **Update** (modify existing), **Output** (present to User), **Determine** (decision based on criteria), **Assess** (evaluate against standards), **Apply** (use standard/rule), **Continue** (flow to next step within current context), **Proceed** (jump to different section or procedure).

### 3.2 Action Block Format

Sequential actions follow this format:

```text
Perform the following actions:
1. First action with specific details.
2. Second action with specific details.
3. Third action with specific details.
```

No blank line between introductory sentence and list. Numbered lists for sequential actions. Each action is complete and actionable with specific details (file paths, field names, conditions). No sub-numbering beyond one level. Pause actions include or are immediately followed by instructions for handling User response.

### 3.3 Conditional Branching

Arrow notation for conditions:

- If condition A → Proceed to §3.2 Dependency Context.
- If condition B → Continue to action 4.

For complex branching with multiple outcomes:

**Determine the outcome:**

- *Outcome 1:* Description → Action to take.
- *Outcome 2:* Description → Action to take.

**Pause with response handling:**

```text
3. Pause for User review.
   - If approved → Continue to action 4.
   - If modifications needed → Apply changes and repeat action 2.
```

### 3.4 Decision Rules

Decision rules define criteria for choosing between outcomes. Each condition maps to a specific action. Include a **Default** when behavior for edge cases matters.

**Determine validation result:**

- *All checks pass:* → Proceed to §3.4 Completion.
- *Minor issues:* → Document issues and continue.
- *Critical failures:* → Pause for User review.

**Default:** When severity is ambiguous, treat as minor.

---

## 4. Output Guidance

Agent outputs to Users use natural language adapted to the situation. Internal terminology from skills and commands is not exposed - this includes section references (§N.M), procedure names, and structural labels, which agents translate into natural language for Users. Agents use contextually appropriate phrasing - there are no rigid templates. When pausing, communicating status, requesting input, or completing a procedure, adapt the phrasing to what the situation requires while conveying the necessary information (what is done, what needs attention, what options exist, what happens next).

**Reasoning templates.** When procedures require visible reasoning in chat (round summaries, analysis presentations, checkpoint communications), guides provide light templates - named aspects to cover and general shape. These make reasoning auditable and expectable while allowing the agent to adapt presentation to the situation.

---

## 5. Reference Standards

References use "See" or "per" exclusively. References appear inline within prose or as standalone sentences - not as list items.

**Same-Document:** "See §N.M Section Title" or "per §N.M Section Title." Example: "See §2.1 Context Integration Standards."

**Cross-Skill:** "See `{SKILL_PATH:skill-name}` §N.M Section Title." Example: "Write to Task Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery."

**Cross-Guide:** "See `{GUIDE_PATH:guide-name}` §N.M Section Title." Example: "See `{GUIDE_PATH:work-breakdown}` §3 Work Breakdown Procedure."

**Command:** "See `{COMMAND_PATH:command-name}`."

**Cross-Document:** State file name or placeholder with specific section. Reference content, do not duplicate.

---

## 6. Terminology Usage

Terms are used exactly as defined in `TERMINOLOGY.md`. Synonyms are not used. Only formal terms listed in `TERMINOLOGY.md` are capitalized; all other words are written in lowercase. Defined concepts (same-agent/cross-agent dependencies, dispatch modes) are explained clearly but written in lowercase. Singular form is used when referring to the concept; plural when referring to multiple instances.

---

## 7. Content Formatting

Document-level structure (heading levels, section numbering, horizontal rules) is defined in `STRUCTURE.md`. This section covers content presentation within sections.

### 7.1 Inline Hierarchy

Bold and italic create hierarchy within subsections (H3 > Bold > Italic). Punctuation after labels determines content structure.

**Label punctuation:**

- *Colon (`Label:`)* - Content follows directly (list or inline prose)
- *Arrow (`Label →`)* - Prose follows; use when prose ends with colon to avoid two colons on one line

**Colon rule:** Avoid two colons on one line. When prose after a label ends with colon, the label uses arrow.

**Examples:**

```text
**Topic:**                              # Direct list follows
- Item one
- Item two

**Topic:** Inline content here.         # Inline prose follows

**Topic** → Prose introducing list:     # Prose-to-list bridge (avoids two colons)
- Item one
- Item two

*Subtopic:*                             # Italic direct list
- Item one

*Subtopic* → Prose introducing list:    # Italic prose-to-list bridge
- Item one

- *Option:* Description → Action.       # Italic list item label
```

### 7.2 Spacing

- No blank line between label and its content (list or prose).
- No blank line between introductory sentence and its list.
- One blank line between paragraphs and between distinct sub-topics.
- One blank line after code blocks.

**Grouping headers:** When a bold label groups multiple italic sub-topics (not direct content), one blank line separates the bold header from the first italic sub-topic:

```text
**Grouping Header:**

*Subtopic A:*
- Item one

*Subtopic B:*
- Item one
```

### 7.3 Lists

**Numbered lists:** Sequential actions. Capital letter, period. **Bulleted lists:** Non-sequential items. Capital letter, period. **Nested lists:** Maximum two levels of nesting (three total depth). Restructure if deeper nesting seems necessary.

### 7.4 Hyphens

Only hyphens (`-`) are used for inline separation. Em-dashes (`—`) and en-dashes (`–`) are not permitted. Use hyphens with surrounding spaces (`word - word`) for inline separation between clauses or label-description pairs.

### 7.5 Code Blocks

Fenced code blocks (triple backticks) are used for output templates, file structure examples, YAML schemas, markdown body templates, and multi-line code. Inline backticks are used for file paths, field names, values, and section references.

When code blocks appear inside code blocks (such as examples showing template usage), indent the inner code block by 4 spaces. The outer block uses triple backticks; the indented inner block uses triple backticks at the indented level.

**Example:**

```text
Example output template:

    ```yaml
    task_id: string
    status: string
    ```
```

---

**End of Writing Standards**
