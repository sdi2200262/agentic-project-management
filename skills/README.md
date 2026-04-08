# APM Standalone Skills

Optional skills that live outside the main APM bundles. Unlike the skills installed by `apm init`, these are used on demand for specific situations.

## Available Skills

| Skill | Purpose | How to use |
| :--- | :--- | :--- |
| [apm-assist](apm-assist/) | General-purpose APM assistant - explains concepts, detects versions, handles migration, answers questions from live docs | Install manually into your project (see below) |
| [apm-customization](apm-customization/) | Guides an AI agent through customizing templates in a forked APM repository | Already present in any fork or template of this repo |

## Installing Skills

Download the skill file into the skills directory for your AI assistant, then reference it in chat to begin. Replace `<skill>` with the skill name (e.g. `apm-assist`):

**Claude Code:**

```bash
mkdir -p .claude/skills/<skill>
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/<skill>/SKILL.md \
  -o .claude/skills/<skill>/SKILL.md
```

**Cursor:**

```bash
mkdir -p .cursor/skills/<skill>
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/<skill>/SKILL.md \
  -o .cursor/skills/<skill>/SKILL.md
```

**GitHub Copilot:**

```bash
mkdir -p .github/skills/<skill>
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/<skill>/SKILL.md \
  -o .github/skills/<skill>/SKILL.md
```

**Gemini CLI:**

```bash
mkdir -p .gemini/skills/<skill>
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/<skill>/SKILL.md \
  -o .gemini/skills/<skill>/SKILL.md
```

**OpenCode / Codex:**

```bash
mkdir -p .<platform>/skills/<skill>
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/<skill>/SKILL.md \
  -o .<platform>/skills/<skill>/SKILL.md
```

## Contributing

To propose a new standalone skill, open an issue or pull request on the [APM repository](https://github.com/sdi2200262/agentic-project-management).
