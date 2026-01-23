# APM Writing Standards

This document defines how to write content within APM skills and commands. It establishes tone, instruction patterns, output guidance, and terminology usage rules.

All terms used in this document are defined in `TERMINOLOGY.md`. All structural patterns follow `STRUCTURE.md`.

---

## 1. General Principles

### 1.1 Core Standards

| Principle | Description |
|-----------|-------------|
| **Clarity** | Every sentence serves a purpose. Remove filler words and redundant phrases. |
| **Precision** | Use exact terms from `TERMINOLOGY.md`. Avoid synonyms or invented alternatives. |
| **Consistency** | Apply the same patterns across all files. Predictability aids both human readers and agents. |
| **Actionability** | Every instruction must be directly executable. Avoid vague directives. |
| **Completeness** | Cover all cases. Do not leave gaps that require assumptions. |

### 1.2 Token Efficiency

Write for token efficiency while maintaining comprehensiveness when writing skills and commands. This means:
- Prefer prose over tables when conveying the same information
- Avoid excessive spacing and structural padding
- Use compact list formats when listing related items
- Eliminate redundant phrasing and unnecessary elaboration
- Combine related concepts in flowing paragraphs rather than isolated bullets
- Use bold and italic for hierarchy instead of additional heading levels

Token efficiency does not mean sacrificing clarity or completeness. Every necessary detail must remain. The goal is removing waste, not removing substance.

### 1.3 Audience Awareness

Skills and commands serve two audiences:

| Audience | Needs |
|----------|-------|
| **Human Users** | Readable prose, logical flow, clear structure, scannable sections. |
| **AI Agents** | Predictable patterns, explicit instructions, unambiguous terminology. |

Write for both. Use structured formats where appropriate and prose for explanations while maintaining consistent section patterns so agents can reliably parse content.

---

## 2. Tone & Voice

### 2.1 Instructional Tone

Use neutral, direct language. State what to do without hedging.

| Avoid | Use |
|-------|-----|
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

Do not express preference, opinion, or judgment unless defining a standard.

| Avoid | Use Instead |
|-------|-------------|
| "The best approach is..." | "Use X when Y." |
| "Ideally, you should..." | "X is required when Y." |
| "This is important because..." | State the rule. Rationale goes in a separate line if needed. |

---

## 3. Instruction Writing

### 3.1 Imperative Mood

Begin instructions with action verbs.

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
| Proceed | Move to next section or procedure. |

### 3.2 Action Block Format

Use this format for sequential actions:

```
Perform the following actions:

1. First action with specific details.
2. Second action with specific details.
3. Third action with specific details.
```

Rules:
- Numbered lists for sequential actions.
- Each action is a complete, actionable instruction.
- Include specific details (file paths, field names, conditions).
- No sub-numbering beyond one level. If an action needs sub-actions, it may be too complex for a single action.

### 3.3 Conditional Branching

Use arrow notation for conditions:
- If condition A → Proceed to §3.2 Context Integration.
- If condition B → Continue to action 4.

For complex branching with multiple outcomes:

**Determine the outcome:**
- *Outcome 1:* Description → Action to take.
- *Outcome 2:* Description → Action to take.
- *Outcome 3:* Description → Action to take.

### 3.4 Decision Rules

Present decision criteria concisely. Include a **Default** statement when behavior for edge cases matters: "**Default:** When uncertain, prefer X over Y."

---

## 4. Output Guidance

### 4.1 Natural Language Outputs

Agent outputs to Users must use natural language. Do not expose meta-terminology.

| Avoid in Output | Use Instead |
|-----------------|-------------|
| "CHECKPOINT BLOCK:" | State the checkpoint naturally. |
| "REQUEST BLOCK:" | State the request naturally. |
| "Completion Block" | State completion naturally. |
| "[BLOCK_TYPE]" | Do not use block type headers. |

### 4.2 Output Patterns

Three patterns guide output construction. Adapt language to context while including the pattern elements.

**Checkpoint Pattern** (pausing for review/approval):

| Element | Purpose |
|---------|---------|
| Status statement | What is complete. |
| Review content | What needs User attention. |
| Options | Clear choices with consequences. |

Example structure:
```
[Procedure/Phase] complete. [Summary of state].

Please review [specific items].

**If [option A]** → [consequence A].
**If [option B]** → [consequence B].
```

**Request Pattern** (asking for input/decision):

| Element | Purpose |
|---------|---------|
| Situation | What is happening. |
| Need | Why input is required. |
| Options | Available choices with recommendation. |

Example structure:
```
I've identified [situation].

[Why this needs User input].

**Options:**
1. [Option A]: [description and trade-offs]
2. [Option B]: [description and trade-offs]

**Recommendation:** [preferred option with reasoning]

How would you like to proceed?
```

**Completion Pattern** (finishing a procedure):

| Element | Purpose |
|---------|---------|
| Confirmation | What is done. |
| Result | What is ready or produced. |
| Next action | What happens next. |

Example structure:
```
[Procedure] complete. [Artifacts/outputs] ready.

Next: [what to do or what will happen].
```

### 4.3 Options Presentation

When presenting options to Users:
- Use bold for option labels.
- Use arrow (→) to indicate consequence.
- Keep option descriptions concise.
- Place recommendation last if included.

```
**If modifications needed** → Describe the issues and I will update.
**If no modifications** → Proceed to [next phase/procedure].
```

---

## 5. Reference Standards

### 5.1 Same-Skill References

Format: "See §N.M Section Title" where N.M is the section number and Section Title is the exact heading text.

Examples:
- See §2.1 Context Dependency Standards.
- Apply §3.2 Context Integration.

### 5.2 Cross-Skill References

Format: "See {SKILL_PATH:skill-name} §N.M Section Title" where skill-name is the skill directory name.

Examples:
- See {SKILL_PATH:memory-logging} §3.1 Task Memory Log Procedure.
- Follow {SKILL_PATH:task-assignment} §4.1 Task Assignment Prompt Format.

Adapt nearby sentences so references fit naturally. Instead of "For details, see...", integrate the reference: "Create the Task Memory Log following {SKILL_PATH:memory-logging} §3.1 Task Memory Log Procedure."

### 5.3 Command References

Format: "See {COMMAND_PATH:command-name}" where command-name is the command file name without extension. Most references within skills point to other skills, not commands.

### 5.4 Cross-Document References

When referencing content in another document, state the file name or use the placeholder format with specific section. Do not duplicate content—reference it.

---

## 6. Terminology Usage

### 6.1 Exact Terms

Use terms exactly as defined in `TERMINOLOGY.md`. Do not use synonyms.

| Term | Do Not Use |
|------|------------|
| Agent | Bot, assistant, AI |
| Task | Job, work item, action |
| Stage | Phase (except "Planning Phase" / "Implementation Phase") |
| Coordination Artifact | Document, file (when referring to the three specific artifacts) |
| Memory Log | Log file, record |
| Handoff | Handover, transfer, switch |
| Session | Instance (when referring to execution context) |

### 6.2 Capitalization Rules

| Category | Rule | Examples |
|----------|------|----------|
| Agent Types | Capitalize | Planner Agent, Manager Agent, Worker Agent, Delegate Agent |
| Agent names | Capitalize | Frontend Agent, Backend Agent |
| Coordination Artifacts | Capitalize | Specifications, Implementation Plan, Standards |
| Procedures | Capitalize | Context Gathering, Task Assignment, Coordination Decision |
| Memory artifacts | Capitalize type | Task Memory Log, Stage Summary, Memory Root |
| Status values | Capitalize | Success, Partial, Failed, Blocked |
| Validation types | Capitalize | Programmatic, Artifact, User |
| Generic terms | Lowercase | task, stage, step, dependency |

### 6.3 Singular vs Plural

| Context | Form |
|---------|------|
| Referring to the concept | Singular: "The Worker Agent executes Tasks." |
| Referring to multiple instances | Plural: "Worker Agents operate independently." |
| Coordination Artifacts as a group | Plural: "Read the Coordination Artifacts." |
| A specific artifact | Singular: "Update the Implementation Plan." |

---

## 7. Section Naming

### 7.1 Standard Section Names

| Section Type | Naming Pattern | Examples |
|--------------|----------------|----------|
| Procedure sections | `[Name] Procedure` | Task Assignment Procedure, Context Gathering Procedure |
| Standards sections | `[Topic] Standards` | Operational Standards, Validation Standards |
| Format sections | `[Name] Format` | Task Memory Log Format, Stage Summary Format |
| Rules sections | `[Topic] Rules` | Operating Rules, Formatting Rules |
| Guidelines sections | `[Topic] Guidelines` | Content Guidelines, Communication Guidelines |

### 7.2 Avoid Generic Names

| Avoid | Use Instead |
|-------|-------------|
| Miscellaneous | Group by specific topic or omit |
| Other | Name the specific category |
| Notes | Integrate into relevant sections |
| Additional Information | Name what the information is about |

### 7.3 Parallel Naming

When §2 contains "[X] Standards" subsections, §3 procedure subsections that reference those standards should use matching terminology. If §2.1 is "Context Dependency Standards", then §3.1 referencing that content should be "Context Dependency Analysis" or similar, establishing clear connection between standards and their application.

---

## 8. Formatting Conventions

### 8.1 Hierarchy Levels

| Level | Markdown | Usage |
|-------|----------|-------|
| H1 | `#` | Document title only. One per file. |
| H2 | `##` | Major sections (§1, §2, §3, etc.). |
| H3 | `###` | Subsections (§1.1, §2.3, etc.). |
| Bold | `**text**` | Sub-topics within subsections. |
| Italic | `*text*` | Items within sub-topics. |

For deeper hierarchy within subsections, use **bold** for sub-topics and *italic* for items within sub-topics. This is more token-efficient than additional heading levels.

### 8.2 Horizontal Rules

Use horizontal rules (`---`) to separate major sections (## headings) only. Do not use horizontal rules within sections or between subsections.

### 8.3 Spacing

**Bold sub-topics:** Place bold title on same line with content, lists directly under with no blank line:

```
**Title:** Content begins here on same line.
- List item one
- List item two
```

**Between paragraphs:** One blank line.

**Between bold and italic hierarchy:** One blank line.

**After code blocks:** One blank line.

### 8.4 Lists

**Numbered lists:** Use for sequential actions. Begin each item with capital letter, end with period.

**Bulleted lists:** Use for non-sequential items or options. Begin each item with capital letter, end with period.

**Nested lists:** Avoid nesting beyond one level. Restructure content if deeper nesting seems necessary.

### 8.5 Dashes

When using dash for sentence separation, use no space between words: "sentence ends here-next sentence begins here". This applies to inline definitions and compact descriptions.

### 8.6 Code Blocks

Use triple backticks (```) for output templates, file structure examples, YAML schemas, and multi-line code. Use inline backticks for file paths (`{AGENTS_FILE}`), field names (`status`), values (`Success`), and section references (`§3.2`).

When code blocks appear inside code blocks (such as examples showing template usage), use triple backticks for the outer block and 4-space indentation for the inner block:

```
**Example showing nested code:**

    # This inner content uses indentation
    ## Because it's inside an outer code block
```

---

## 9. Common Mistakes

### 9.1 Vague Instructions

| Mistake | Correction |
|---------|------------|
| "Handle the task appropriately." | Specify what "appropriately" means. |
| "Update the file as needed." | Specify what updates and when. |
| "Consider the implications." | State what to consider and what action to take. |
| "Review and proceed." | State what to review and criteria for proceeding. |

### 9.2 Inconsistent Terminology

| Mistake | Correction |
|---------|------------|
| Using "handover" and "handoff" interchangeably. | Use "Handoff" consistently. |
| Calling Memory Logs "log files" or "records." | Use "Memory Log" or specific type. |
| Referring to "the bot" or "the AI." | Use "Agent" or specific Agent Type. |

### 9.3 Missing Cross-References

| Mistake | Correction |
|---------|------------|
| "Follow the format defined elsewhere." | State the specific section: "Follow §4.1 Task Memory Log Format." |
| "As mentioned before." | Reference the specific section. |
| "See the other skill." | Provide the skill path using standard format. |

### 9.4 Balance Issues

| Mistake | Correction |
|---------|------------|
| Rigid templates with no adaptation guidance. | Provide templates with notes on adaptation. |
| "Use your judgment" without criteria. | Provide decision rules or standards. |
| Fixed wording for all contexts. | Provide patterns with context-specific examples. |

### 9.5 Exposing Meta-Language

| Mistake | Correction |
|---------|------------|
| "Output the Checkpoint Block:" | Integrate checkpoint naturally into prose. |
| "Use the Request Pattern here." | Write the request naturally following the pattern. |
| "[INSERT STATUS HERE]" | Provide example text or describe what goes there. |

---

**End of Writing Standards**
