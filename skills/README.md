# APM Standalone Skills

These optional skills help with APM setup and customisation.

| Skill | Purpose |
|---|---|
| [apm-assist](apm-assist/SKILL.md) | Explain APM, answer documentation questions, inspect installations and help with migration. |
| [apm-customization](apm-customization/SKILL.md) | Guide changes to an APM source repository, including builds and custom releases. |

## Installation

Copy a skill's folder into `.agents/skills/` for compatible agents, or `.claude/skills/` for Claude Code. For example:

```bash
mkdir -p .agents/skills/apm-assist
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-assist/SKILL.md \
  -o .agents/skills/apm-assist/SKILL.md
```

When customising this repository, an assistant can read `skills/apm-customization/SKILL.md` directly.

Propose new skills through an [issue or pull request](https://github.com/sdi2200262/agentic-project-management).
