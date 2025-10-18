# APM Scripts Directory

This directory contains utility scripts for the Agentic Project Management (APM) framework.

## APM Slash Commands (Community Contribution)

The `cursor/` subdirectory contains community-contributed scripts that manage APM slash commands for the Cursor IDE.

### What It Does

These scripts install, update, and uninstall Cursor IDE slash commands from APM prompt files, allowing you to:
- Install APM prompts as `/apm-` slash commands in Cursor's chat interface
- Quickly find and paste APM workflow prompts
- Cleanly uninstall all APM commands when needed
- Maintain synchronized commands when prompts are updated

### Available Scripts

- **`cursor/apm-slash-commands.ps1`** - Windows PowerShell version
- **`cursor/apm-slash-commands.sh`** - Mac/Linux bash version

### Usage

#### Windows (PowerShell)
```powershell
# Show help (default if no command provided)
.\scripts\cursor\apm-slash-commands.ps1
.\scripts\cursor\apm-slash-commands.ps1 -Help

# Install APM slash commands
.\scripts\cursor\apm-slash-commands.ps1 install

# Uninstall all APM slash commands
.\scripts\cursor\apm-slash-commands.ps1 uninstall

# Update APM slash commands (uninstall + install)
.\scripts\cursor\apm-slash-commands.ps1 update

# Dry run to see what would be done
.\scripts\cursor\apm-slash-commands.ps1 install -dr
.\scripts\cursor\apm-slash-commands.ps1 uninstall -dr
.\scripts\cursor\apm-slash-commands.ps1 update -dr
```

#### Mac/Linux (Bash)
```bash
# Show help (default if no command provided)
./scripts/cursor/apm-slash-commands.sh
./scripts/cursor/apm-slash-commands.sh --help

# Install APM slash commands
./scripts/cursor/apm-slash-commands.sh install

# Uninstall all APM slash commands
./scripts/cursor/apm-slash-commands.sh uninstall

# Update APM slash commands (uninstall + install)
./scripts/cursor/apm-slash-commands.sh update

# Dry run to see what would be done
./scripts/cursor/apm-slash-commands.sh install -dr
./scripts/cursor/apm-slash-commands.sh uninstall -dr
./scripts/cursor/apm-slash-commands.sh update -dr
```

### Installed Commands

The scripts install prioritized Cursor slash commands in `~/.cursor/commands/` (or `%USERPROFILE%\.cursor\commands\` on Windows):

1. `apm-1-setup-initiation` - Initialize Setup Agent
2. `apm-2-manager-initiation` - Initialize Manager Agent
3. `apm-3-implementation-initiation` - Initialize Implementation Agent
4. `apm-4-adhoc-initiation` - Initialize Ad-hoc Agent
5. `apm-5-manager-handover` - Manager Agent Handover
6. `apm-6-implementation-handover` - Implementation Agent Handover
7. `apm-7-adhoc-research-delegate` - Research Delegation
8. `apm-8-adhoc-debug-delegate` - Debug Delegation

### Using APM Slash Commands in Cursor

1. Open Cursor chat agent
2. Type `/apm-` to see all available APM commands with auto-complete
3. Select the command you want to use
4. The prompt will be loaded automatically

### Managing Commands

- **Install**: Installs all APM slash commands (removes any existing ones first)
- **Uninstall**: Removes all APM slash commands from Cursor
- **Update**: Updates APM slash commands to match current repository state (uninstall + install)
- **Dry Run** (`--dry-run` or `-dr`): Shows what would be done without actually doing it

The **update** command is especially useful when:
- You've pulled the latest changes from the APM repository
- Prompts have been added, removed, or modified
- You want to ensure your Cursor commands are fully synchronized

## Future Roadmap

### APM v0.5: Native Slash-Prompt Support

Starting with APM version 0.5, **slash-prompts will be included as a standard feature** of the framework. This means:

- ✅ **Built-in Integration**: No need for separate community scripts
- ✅ **Standardized Commands**: Consistent `/apm-` command structure across all installations
- ✅ **Automatic Updates**: Commands will update automatically with APM releases
- ✅ **Cross-Platform**: Native support for Windows, Mac, and Linux
- ✅ **IDE Agnostic**: Support for Cursor, VS Code, and other compatible editors

### Migration Path

When v0.5 is released:
1. The community scripts in this directory will be marked as **deprecated**
2. Users will be guided to migrate to the built-in slash-command system
3. Current users can easily transition: run `uninstall` to remove community commands, then use built-in system
4. These scripts will remain available for users on older APM versions

## Community Contributions

We welcome community contributions to improve these scripts! If you have enhancements or find issues:

1. **Report Issues**: Use the project's GitHub Issues
2. **Submit PRs**: Follow the project's contribution guidelines
3. **Share Feedback**: Help us improve the user experience

## Credits

Special thanks to the community members who contributed these Cursor integration scripts, making APM more accessible to Cursor IDE users while we work toward native integration in v0.5.
