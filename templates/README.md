# APM v0.5 Template Standards

This directory contains the master templates for all APM v0.5 assets. These templates serve as the single source of truth for generating AI assistant-specific bundles.

## Directory Structure

```
templates/
├── Setup_Agent/          # Setup Agent-specific commands and guides
├── Manager_Agent/        # Manager Agent-specific commands and guides
├── Implementation_Agent/ # Implementation Agent-specific commands and guides
├── ad-hoc/              # Ad-hoc agent commands and guides
└── guides/              # Common guides used by multiple agents
```

## Template Categories

Templates are categorized into two types:

1. **Commands**: User-facing prompts that initiate key workflow actions
2. **Guides**: Agent-facing documents containing procedural instructions

### Commands Standard

Command files must include a YAML frontmatter block with the following required metadata:

```yaml
---
priority: <number>        # Controls sort order in AI assistant's command menu
command_name: <string>    # Clean, action-oriented name in kebab-case
description: <string>     # Brief explanation of the command's purpose
---
```

Example:
```yaml
---
priority: 1
command_name: initiate-setup
description: Initializes the Setup Agent to begin project analysis
---
```

### Dynamic Content Placeholders

Templates use the following placeholders that are replaced during the build process:

- `{VERSION}`: Replaced with the current APM release version
- `{GUIDE_PATH:<filename>}`: Replaced with the correct relative path to a specific guide

Example usage:
```markdown
# APM v{VERSION} Setup Agent

Please refer to {GUIDE_PATH:Project_Breakdown_Guide.md} for detailed instructions.
```

## Build Process

These templates are processed by the build script (Phase 3) to generate AI assistant-specific bundles. The script:

1. Processes YAML frontmatter for Commands
2. Replaces dynamic content placeholders
3. Generates appropriate slash commands
4. Creates .zip bundles for each supported AI assistant

## Quality Standards

- All files must use proper Markdown formatting
- Command files must include valid YAML frontmatter
- Use {VERSION} placeholder instead of hardcoding versions
- Use {GUIDE_PATH:<filename>} for all guide references
- Maintain consistent indentation and formatting
