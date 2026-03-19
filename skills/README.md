# APM Standalone Skills

Standalone skills that can be installed independently from the main APM bundles. These are optional tools for specific situations that fall outside the core APM workflow.

Unlike the skills bundled with APM (installed by `apm init`), standalone skills are installed manually and used on demand.

## Available Skills

| Skill | Description | Installation |
| :--- | :--- | :--- |
| [apm-migration](apm-migration/) | Guides migration from an older APM version to the current release, preserving session artifacts as archives | Manual (curl) |
| [apm-customization](apm-customization/) | Guides customization of APM templates within a forked or templated repository | Included in the repo |

## Installation

Download the skill file into the appropriate skills directory for the AI assistant being used. After installation, reference the skill in the assistant's chat to use it.

**Claude Code:**

```bash
mkdir -p .claude/skills/apm-migration
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-migration/SKILL.md \
  -o .claude/skills/apm-migration/SKILL.md
```

**Cursor:**

```bash
mkdir -p .cursor/skills/apm-migration
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-migration/SKILL.md \
  -o .cursor/skills/apm-migration/SKILL.md
```

**GitHub Copilot:**

```bash
mkdir -p .github/skills/apm-migration
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-migration/SKILL.md \
  -o .github/skills/apm-migration/SKILL.md
```

**Gemini CLI:**

```bash
mkdir -p .gemini/skills/apm-migration
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-migration/SKILL.md \
  -o .gemini/skills/apm-migration/SKILL.md
```

**OpenCode:**

```bash
mkdir -p .opencode/skills/apm-migration
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-migration/SKILL.md \
  -o .opencode/skills/apm-migration/SKILL.md
```

## Contributing

To propose a new standalone skill, open an issue or pull request on the [APM repository](https://github.com/sdi2200262/agentic-project-management).
