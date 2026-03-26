# APM Standalone Skills

Optional skills that live outside the main APM bundles. Unlike the skills installed by `apm init`, these are used on demand for specific situations.

## Available Skills

| Skill | Purpose | How to use |
| :--- | :--- | :--- |
| [apm-migration](apm-migration/) | Guides an AI agent through migrating a pre-v1.0.0 installation to the current release | Install manually into your project (see below) |
| [apm-customization](apm-customization/) | Guides an AI agent through customizing templates in a forked APM repository | Already present in any fork or template of this repo |

## Installing the Migration Skill

Download the skill file into the skills directory for your AI assistant, then reference it in chat to begin.

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
