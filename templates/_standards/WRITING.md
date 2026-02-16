# APM Writing Standards

This document defines how to write content within APM skills and commands. It establishes tone, instruction patterns, output guidance, and terminology usage rules.

All terms used in this document are defined in `TERMINOLOGY.md`. All structural patterns follow `STRUCTURE.md`.

---

## 1. General Principles

### 1.1 Core Standards

| Principle | Description |
|-----------|-------------|
| **Clarity** | Every sentence serves a purpose. Filler words and redundant phrases are excluded. |
| **Precision** | Terms match `TERMINOLOGY.md` exactly. Synonyms and invented alternatives are not used. |
| **Consistency** | The same patterns are applied across all files. Predictability aids both human readers and agents. |
| **Actionability** | Every instruction is directly executable. Vague directives are not permitted. |
| **Completeness** | All cases are covered. Gaps requiring assumptions are not acceptable. |

### 1.2 Token Efficiency

Skills, guides, and commands are written for token efficiency while maintaining comprehensiveness. This means:
- Prose is preferred over tables when conveying the same information.
- Excessive spacing and structural padding are avoided.
- Compact list formats are used when listing related items.
- Redundant phrasing and unnecessary elaboration are eliminated.
- Related concepts are combined in flowing paragraphs rather than isolated bullets.
- Bold and italic introduce hierarchy inline instead of using additional heading levels.

Token efficiency does not mean sacrificing clarity or completeness. Every necessary detail must remain. The goal is removing waste, not removing substance.

### 1.3 Audience Awareness

Skills, guides, and commands serve two audiences:

| Audience | Needs |
|----------|-------|
| **Human Users** | Readable prose, logical flow, clear structure, scannable sections. |
| **AI Agents** | Predictable patterns, explicit instructions, unambiguous terminology. |

Content serves both audiences. Structured formats appear where appropriate and prose for explanations, with consistent section patterns for reliable agent parsing.

### 1.4 Simplicity Standards

Skills and commands are written for capable models that reason well from clear, concise instructions. The following standards govern content density and instructional approach:

**Trust model reasoning.** State rules and criteria clearly; do not enumerate every possible violation or edge case. Guide the agent's assessment process rather than dictating decisions. Prefer "assess X considering Y" over exhaustive if/then trees covering every scenario.

**Guardrail restraint.** One clear statement of a rule is sufficient. Do not restate the same constraint in multiple forms, provide extensive negative examples of what not to do, or pad instructions with cautionary variations. Agents that understand the rule once do not benefit from seeing it three times.

**Example economy.** Include examples only when the pattern is genuinely non-obvious — a structural schema, an unfamiliar format, or a counterintuitive convention. One well-chosen example is better than three that illustrate the same point. Omit examples when prose alone conveys the instruction.

**Target conciseness and compactness.** Skills, guides and commands should not exceed ~500 lines. When approaching this ceiling, reduce descriptive and guardrail content before reducing structural specifications or procedural steps. The core operations and output formats are the substance; the surrounding prose is the variable.

**Reasoning over prescription.** When agents face ambiguous situations, provide the reasoning framework (what to consider, what matters, what the tradeoffs are) rather than pre-decided answers for every case. The agent's judgment, applied to the specific situation, will outperform a generic lookup table written in advance.

---

## 2. Tone & Voice

### 2.1 Instructional Tone

Neutral, direct language is required. Statements specify actions without hedging.

| Avoided | Preferred |
|---------|-----------|
| "You might want to consider..." | "Consider..." |
| "It would be a good idea to..." | "Do X." |
| "Perhaps you could..." | "X when Y." |
| "Please note that..." | State the fact directly. |

### 2.2 Voice Standards

| Standard | Description |
|----------|-------------|
| **Active voice** | "The Manager creates a Task Assignment." Not "A Task Assignment is created." |
| **Second person for procedures** | "Perform the following actions" addresses the reading agent directly. |
| **Third person for descriptions** | "The Worker Agent executes Tasks" describes behavior. |
| **No anthropomorphization** | Agents "execute" and "perform." They do not "want," "feel," or "think." |

### 2.3 Neutrality

Preference, opinion, and judgment are not expressed unless defining a standard.

| Avoided | Preferred |
|---------|-----------|
| "The best approach is..." | "Use X when Y." |
| "Ideally, you should..." | "X is required when Y." |
| "This is important because..." | State the rule. Rationale goes in a separate line if needed. |

---

## 3. Instruction Writing

### 3.1 Imperative Mood

Instructions begin with action verbs.

| Verb | Usage |
|------|-------|
| Perform | Introduce a sequence of actions. |
| Execute | Run a procedure or process. |
| Read | Access a file or section. |
| Create | Produce a new artifact. |
| Update | Modify an existing artifact. |
| Output | Present content to the User. |
| Determine | Make a decision based on criteria. |
| Assess | Evaluate against standards. |
| Apply | Use a standard or rule. |
| Continue | Flow within current context to next step or action. |
| Proceed | Jump to a different section, procedure, or activity. |

### 3.2 Action Block Format

Sequential actions follow this format:

```
Perform the following actions:
1. First action with specific details.
2. Second action with specific details.
3. Third action with specific details.
```

Rules:
- No blank line between introductory sentence and list.
- Numbered lists are used for sequential actions.
- Each action is a complete, actionable instruction.
- Specific details (file paths, field names, conditions) are included.
- Sub-numbering beyond one level is not used. If an action needs sub-actions, it may be too complex for a single action.
- Pause actions include or are immediately followed by instructions for handling User response.

### 3.3 Conditional Branching

Arrow notation is used for conditions:
- If condition A → Proceed to §3.2 Context Integration.
- If condition B → Continue to action 4.

For complex branching with multiple outcomes:

**Determine the outcome:**
- *Outcome 1:* Description → Action to take.
- *Outcome 2:* Description → Action to take.
- *Outcome 3:* Description → Action to take.

**Pause with response handling:**
```
3. Pause for User review.
   - If approved → Continue to action 4.
   - If modifications needed → Apply changes and repeat action 2.
```

### 3.4 Decision Rules

Decision rules define criteria for choosing between outcomes. Each condition maps to a specific action. A **Default** statement is included when behavior for edge cases matters.

**Structure:**
- Conditions are presented concisely with clear outcomes.
- Arrow notation connects conditions to actions.
- Default handles ambiguous or edge cases.

**Example:**

**Determine validation result:**
- *All checks pass:* → Proceed to §3.4 Completion.
- *Minor issues:* → Document issues and continue.
- *Critical failures:* → Pause for User review.

**Default:** When severity is ambiguous, treat as minor.

---

## 4. Output Guidance

Agent outputs to Users use natural language adapted to the situation. Internal terminology from skills and commands is not exposed — this includes section references (§N.M), procedure names, and structural labels, which agents translate into natural language for Users. Agents use contextually appropriate phrasing - there are no rigid templates. When pausing, communicating status, requesting input, or completing a procedure, adapt the phrasing to what the situation requires while conveying the necessary information (what is done, what needs attention, what options exist, what happens next).

**Reasoning templates.** When procedures require visible reasoning in chat (round summaries, analysis presentations, checkpoint communications), guides provide light templates — named aspects to cover and general shape. These make reasoning auditable and expectable while allowing the agent to adapt presentation to the situation. Light templates specify required coverage, not exact formatting.

---

## 5. Reference Standards

References use "See" or "per" exclusively. Nearby sentences are adapted so references fit naturally. References appear inline within prose or as standalone sentences; references are not list items.

**Same-Document:** "See §N.M Section Title" or "per §N.M Section Title" where N.M is the section number and Section Title is the exact heading text. Applies to skills, guides, and commands referencing their own sections. Examples: "See §2.1 Context Dependency Standards." or "Integrate dependent context per §3.2 Context Integration."

**Cross-Skill:** "See `{SKILL_PATH:skill-name}` §N.M Section Title" or "per `{SKILL_PATH:skill-name}` §N.M Section Title" where skill-name is the skill directory name. Example: "Write to Task Bus per `{SKILL_PATH:apm-communication}` §3.2 Task Prompt Delivery."

**Cross-Guide:** "See `{GUIDE_PATH:guide-name}` §N.M Section Title" or "per `{GUIDE_PATH:guide-name}` §N.M Section Title" where guide-name is the guide file name without extension. Example: "See `{GUIDE_PATH:work-breakdown}` §3 Work Breakdown Procedure."

**Command:** "See `{COMMAND_PATH:command-name}`" where command-name is the command file name without extension.

**Cross-Document:** The file name or placeholder format with specific section is stated. Content is referenced, not duplicated.

---

## 6. Terminology Usage

Terms are used exactly as defined in `TERMINOLOGY.md`. Synonyms are not used. Terms defined in `TERMINOLOGY.md` are capitalized; words not defined there are not capitalized or treated as formal terms. Singular form is used when referring to the concept; plural when referring to multiple instances.

---

## 7. Content Formatting

Document-level structure (heading levels, section numbering, horizontal rules) is defined in `STRUCTURE.md`. This section covers content presentation within sections.

### 7.1 Inline Hierarchy

Bold and italic create hierarchy within subsections (H3 > Bold > Italic). Punctuation after labels determines content structure.

**Label punctuation:**
- *Colon (`Label:`)* - Content follows directly (list or inline prose)
- *Arrow (`Label →`)* - Prose follows; use when prose ends with colon to avoid two colons on one line
- *Dash (`Label` —)* - Descriptive prose follows. Used in reasoning templates and named aspect lists within procedures.

**Colon rule:** Avoid two colons on one line. When prose after a label ends with colon, the label uses arrow.

**Examples:**
```
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

- **Aspect** — Description of aspect.   # Dash label in reasoning template
```

### 7.2 Spacing

- No blank line between label and its content (list or prose).
- No blank line between introductory sentence and its list.
- One blank line between paragraphs and between distinct sub-topics.
- One blank line after code blocks.

**Grouping headers:** When a bold label groups multiple italic sub-topics (not direct content), one blank line separates the bold header from the first italic sub-topic:
```
**Grouping Header:**

*Subtopic A:*
- Item one

*Subtopic B:*
- Item one
```

### 7.3 Lists

**Numbered lists:** Used for sequential actions. Each item begins with capital letter and ends with period.

**Bulleted lists:** Used for non-sequential items or options. Each item begins with capital letter and ends with period.

**Nested lists:** Maximum two levels of nesting (three total depth). Content is restructured if deeper nesting seems necessary.

### 7.4 Dashes

Only hyphens (`-`) are used. Em-dashes (`-`) and en-dashes (`–`) are not permitted.

When hyphen is used for inline separation, no space appears between words: "sentence ends here-next sentence begins here". This applies to inline definitions and compact descriptions.

### 7.5 Code Blocks

Triple backticks are used for output templates, file structure examples, YAML schemas, and multi-line code. Inline backticks are used for file paths, field names, values, and section references.

When code blocks appear inside code blocks (such as examples showing template usage), triple backticks are used for the outer block and 4-space indentation for the inner block.

---

**End of Writing Standards**
