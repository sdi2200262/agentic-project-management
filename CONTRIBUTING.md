# Contributing to Agentic Project Management (APM)

## Ways to Contribute

### Reporting Bugs & Workflow Issues

- **Search existing issues** first: [GitHub Issues](https://github.com/sdi2200262/agentic-project-management/issues)
- **For new bug reports**, include:
  - APM CLI version (run `apm --version` or `npm list -g agentic-pm`)
  - Node.js and npm versions (run `node --version` and `npm --version`)
  - AI assistant used and installation target (`agents` or `claude`)
  - Agent role experiencing issues (Planner, Manager, or Worker)
  - Step-by-step reproduction of the issue (if possible, otherwise a detailed description)
  - Expected vs actual behavior

### Suggesting Features & Improvements

- Workflow improvements: procedures, coordination patterns, memory system optimisations
- Documentation improvements: clearer explanations, additional examples, missing use cases
- Platform support: better integration with supported assistants
- Build system: shared templates and installation layouts

### High-Priority Areas

**Workflow Testing & Feedback**
- Run APM sessions on real projects and report issues via [GitHub Issues](https://github.com/sdi2200262/agentic-project-management/issues)
- Test across different assistants and model combinations
- Identify edge cases in coordination, Handoff, and session continuation

**Template Standards**
- Help improve the template authoring standards in `templates/_standards/`
- Resources: WORKFLOW.md, TERMINOLOGY.md, STRUCTURE.md, WRITING.md
- Contributions needed: compliance findings, writing improvements, structural refinements

**Standalone Skills**
- The `skills/` directory contains standalone skills installed independently from APM bundles
- Current skills: [apm-assist](skills/apm-assist/) (APM assistant, migration, docs), [apm-customization](skills/apm-customization/) (customising a forked or templated repository)
- Contributions welcome for new standalone skills that complement the APM workflow

### Community Contributions

- Share adaptations: domain-specific customisations via custom repositories
- Best practices: cost optimisation strategies, effective coordination patterns
- Case studies: real project examples using APM

### Community Extensions

APM supports Claude Code and agents that discover `.agents/skills/` and read `AGENTS.md`, such as Codex, Cursor and GitHub Copilot. The build has two targets: `agents` and `claude`. An agent that reads `.agents/skills/` and `AGENTS.md` does not need its own target.

Community extensions are not officially supported, may lag behind releases, and should be tested thoroughly before use. If you're interested in developing or maintaining an extension, please open an issue to discuss.

## Contribution Process

### Setting Up Your Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/agentic-project-management.git
   cd agentic-project-management
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b feature/description-of-change
   ```

### Making Changes

Edit the source files for the part you are changing:

#### File Locations

- **Templates (command skills, shared skills and guides):** Edit files in `templates/`. This is the core deliverable. All template changes must comply with `templates/_standards/`.
- **Build system:** Edit files in `build/` for processors, config, and generators.
- **CLI source:** Edit files in `src/` for CLI command behavior.
- **Standalone skills:** Edit files in `skills/` for independently installable skills.
- **Documentation:** Docs live in a separate repository: [apm-website](https://github.com/sdi2200262/apm-website) (`docs/` directory). Video walkthroughs covering the v1 workflow are needed. See the apm-website README for details.

**Assistant differences:** Claude Code installs into `.claude/` and every other assistant into `.agents/`. Placeholders in `build/processors/placeholders.js` resolve skill and guide paths for each target, and `{CLAUDE_ONLY:…}` holds Claude Code-only text. The Rules live in `AGENTS.md` for every target. Keep assistant-specific syntax, such as command prefixes or subagent calls, out of the templates: describe the action in plain English and let each assistant carry it out its own way.

Start workflow changes in `WORKFLOW.md`, then update the affected command skills, shared skills and guides. The [customisation skill](skills/apm-customization/SKILL.md) describes the propagation in detail.

#### Building

After modifying files in `templates/` or `build/`, run:

```bash
VERSION=1.1.0 npm run build:release
```

This creates the two template bundles and release manifest in `dist/`.

### Testing Your Changes

**For template changes** (`templates/`):
- Run `VERSION=1.1.0 npm run build:release` to verify the build completes
- Test with actual AI assistants in a real project
- Include example interactions or observations in your PR to speed review

**For CLI or build system changes** (`src/` or `build/`):
- Build templates with the explicit version above and inspect the bundles and manifest
- Exercise affected CLI commands and check the generated files

Use the template version you intend to test. CLI packages can be built locally with `npm pack`; GitHub Releases contain only template ZIPs and `apm-release.json`.

### Pull Requests

1. Ensure your changes are tested.
2. Commit with clear messages in the `type(scope): description` format used in the repository history.
3. Push your branch and create a Pull Request with a clear description.
4. Reference related issues if applicable.
5. Include test instructions for template changes.

### Versioning Considerations

APM uses a decoupled versioning system where the CLI and templates version independently but share the same major version number. See [VERSIONING.md](VERSIONING.md) for details.

## License Requirements

APM uses Mozilla Public License 2.0 (MPL-2.0). By contributing, you agree that:
- Your contributions will be licensed under MPL-2.0
- Improvements to core APM files will remain open source
- Proper attribution is maintained

## Questions & Discussion

- Technical questions: open a GitHub issue
- General inquiries: reach out on Discord at `cobuter_man`
- Collaboration: mention @sdi2200262 in relevant issues or PRs
