# APM Standalone Skills

Optional skills that live outside the main APM bundles. Unlike the skills installed by `apm init`, these are used on demand for specific situations.

## Available Skills

### apm-assist

General-purpose APM assistant - explains concepts, detects installed versions, handles migration from v0.5.x, and answers questions from the live documentation. Works with any supported platform.

Download the skill file into your platform's skill directory. For Claude Code:

```bash
mkdir -p .claude/skills/apm-assist
curl -sL https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/skills/apm-assist/SKILL.md \
  -o .claude/skills/apm-assist/SKILL.md
```

The skill file is the same across all platforms - only the destination directory differs:

| Platform | Skill directory |
|---|---|
| Claude Code | `.claude/skills/apm-assist/` |
| Cursor | `.cursor/skills/apm-assist/` |
| GitHub Copilot | `.github/skills/apm-assist/` |
| Gemini CLI | `.gemini/skills/apm-assist/` |
| OpenCode | `.opencode/skills/apm-assist/` |
| Codex CLI | `.agents/skills/apm-assist/` |

### apm-customization

Guides an AI agent through customizing APM templates, navigating the repository structure, making changes, building, and releasing. No installation needed - this skill is already present in any fork or template of this repository. The AI agent reads it directly from `skills/apm-customization/SKILL.md` when working within the repo. If your platform does not discover it automatically, copy it to the platform's skills directory (e.g., `.claude/skills/apm-customization/SKILL.md`).

## Contributing

To propose a new standalone skill, open an issue or pull request on the [APM repository](https://github.com/sdi2200262/agentic-project-management).
