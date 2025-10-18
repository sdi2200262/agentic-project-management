# APM Slash Commands Manager (Windows PowerShell Version)
# This script installs and uninstalls Cursor slash commands from the APM prompts directory

param(
    [ValidateSet('install', 'uninstall', 'update')]
    [string]$Command = '',
    [Alias('dr')]
    [switch]$DryRun = $false,
    [Alias('h')]
    [switch]$Help = $false
)

# Show help if requested or if no command provided
if ($Help -or [string]::IsNullOrEmpty($Command)) {
    Write-Host "Usage: .\apm-slash-commands.ps1 [install|uninstall|update] [-DryRun|-dr] [-Help|-h]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  install      Install APM slash commands"
    Write-Host "  uninstall    Uninstall all APM slash commands"
    Write-Host "  update       Update APM slash commands (uninstall + install)"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -dr, -DryRun    Show what would be done without actually doing it"
    Write-Host "  -h, -Help       Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\apm-slash-commands.ps1 install          # Install APM commands"
    Write-Host "  .\apm-slash-commands.ps1 uninstall        # Remove all APM commands"
    Write-Host "  .\apm-slash-commands.ps1 update           # Update APM commands (full refresh)"
    Write-Host "  .\apm-slash-commands.ps1 install -dr      # See what would be installed"
    exit 0
}

# Get the project root directory (parent of scripts directory)
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)
$PromptsPath = Join-Path $ProjectRoot "prompts"

# Define the Cursor commands directory
$CursorCommandsPath = Join-Path $env:USERPROFILE ".cursor\commands"

# Define priority order for commands (lower number = appears first)
$PriorityMap = @{
    'Setup_Agent.*Initiation'          = 1   # setup initiation
    'Manager_Agent.*Initiation'        = 2   # manager initiation
    'Implementation_Agent.*Initiation' = 3   # implementation initiation
    'Ad_Hoc.*Initiation'               = 4   # adhoc initiation
    'Manager_Agent.*Handover'          = 5   # manager handover
    'Implementation_Agent.*Handover'   = 6   # implementation handover
    'Research_Delegation'              = 7   # adhoc research delegate
    'Debug_Delegation'                 = 8   # adhoc debug delegate
}

# Function to get priority for a file
function Get-FilePriority {
    param($FileName, $RelativePath)
    
    foreach ($pattern in $PriorityMap.Keys) {
        if ($RelativePath -match $pattern) {
            return $PriorityMap[$pattern]
        }
    }
    return -1  # Default priority for unmatched files
}

# Function to update APM commands (uninstall + install)
function Update-Commands {
    Write-Host "APM Slash Commands Manager - Update" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will uninstall all existing APM commands and install the latest versions" -ForegroundColor Yellow
    Write-Host ""
    
    # Perform uninstall first
    if ($DryRun) {
        Write-Host "Step 1: Uninstall existing commands" -ForegroundColor Cyan
        Write-Host "Cursor Commands Directory: $CursorCommandsPath" -ForegroundColor Yellow
        
        # Check if directory exists and find existing commands
        if (Test-Path $CursorCommandsPath) {
            $ExistingCommands = Get-ChildItem -Path $CursorCommandsPath -Filter "apm-*.md" -ErrorAction SilentlyContinue
            if ($ExistingCommands) {
                Write-Host "[DRY RUN] Would uninstall $($ExistingCommands.Count) existing APM command(s)" -ForegroundColor Yellow
            } else {
                Write-Host "No existing APM commands found to uninstall" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Cursor commands directory does not exist" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "Step 2: Install latest commands" -ForegroundColor Cyan
    } else {
        Write-Host "Step 1: Uninstalling existing commands..." -ForegroundColor Cyan
        
        # Check if directory exists and find existing commands
        if (Test-Path $CursorCommandsPath) {
            $ExistingCommands = Get-ChildItem -Path $CursorCommandsPath -Filter "apm-*.md" -ErrorAction SilentlyContinue
            if ($ExistingCommands) {
                $ExistingCommands | Remove-Item -Force
                Write-Host "Uninstalled $($ExistingCommands.Count) existing APM command(s)" -ForegroundColor Green
            } else {
                Write-Host "No existing APM commands found to uninstall" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Cursor commands directory does not exist" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "Step 2: Installing latest commands..." -ForegroundColor Cyan
    }
    
    # Now perform install (reuse the install logic)
    # Verify prompts directory exists
    if (-not (Test-Path $PromptsPath)) {
        Write-Error "Prompts directory not found: $PromptsPath"
        exit 1
    }

    # Create Cursor commands directory if it doesn't exist
    if (-not (Test-Path $CursorCommandsPath)) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would create directory: $CursorCommandsPath" -ForegroundColor Yellow
        }
        else {
            New-Item -ItemType Directory -Path $CursorCommandsPath -Force | Out-Null
            Write-Host "Created Cursor commands directory: $CursorCommandsPath" -ForegroundColor Green
        }
    }

    # Find all markdown files in prompts directory
    $MarkdownFiles = Get-ChildItem -Path $PromptsPath -Filter "*.md" -Recurse

    # Counter for installed commands
    $InstalledCount = 0
    $SkippedCount = 0

    foreach ($File in $MarkdownFiles) {
        # Get relative path from prompts directory
        $RelativePath = $File.FullName.Substring($PromptsPath.Length + 1)
        
        # Create a command name based on the directory structure
        $DirectoryPath = Split-Path $RelativePath -Parent
        $FileName = $File.BaseName
        
        # Create shorter, kebab-case command names
        # Simplify directory names first
        $DirName = if ($DirectoryPath) { 
            $DirectoryPath `
                -replace 'Implementation_Agent', 'implementation' `
                -replace 'Manager_Agent', 'manager' `
                -replace 'Setup_Agent', 'setup' `
                -replace 'ad-hoc', 'adhoc' `
                -replace '_', '-' `
                -replace '\\', '-'
        }
        else { '' }
        
        # Simplify file names and remove redundant prefixes
        $ShortName = $FileName `
            -replace '^Implementation_Agent_', '' `
            -replace '^Manager_Agent_', '' `
            -replace '^Setup_Agent_', '' `
            -replace '^Ad_Hoc_Agent_', '' `
            -replace '_Agent_Initiation_Prompt$', '-initiation' `
            -replace '_Initiation_Prompt$', '-initiation' `
            -replace 'Initiation', 'initiation' `
            -replace '_Agent_Handover_Guide$', '-handover' `
            -replace '_Handover_Guide$', '-handover' `
            -replace 'Handover', 'handover' `
            -replace '_Delegation_Guide$', '-delegate' `
            -replace 'Delegation', 'delegate' `
            -replace '_Guide$', '' `
            -replace '_Prompt$', '' `
            -replace 'Implementation_Plan', 'plan' `
            -replace 'Implementation', 'implementation' `
            -replace 'Memory_Log', 'memory-log' `
            -replace 'Memory_System', 'memory-system' `
            -replace 'Project_Breakdown_Review', 'project-review' `
            -replace 'Project_Breakdown', 'project-breakdown' `
            -replace 'Task_Assignment', 'task-assign' `
            -replace 'Context_Synthesis', 'context' `
            -replace 'Debug', 'debug' `
            -replace 'Research', 'research' `
            -replace 'README', 'readme' `
            -replace '_', '-'
        
        # Build command name
        if ($DirName) {
            $CommandName = "apm-${DirName}-${ShortName}"
        }
        else {
            $CommandName = "apm-${ShortName}"
        }
        
        # Clean up multiple hyphens and convert to lowercase
        $CommandName = $CommandName -replace '--+', '-' -replace '-$', ''
        $CommandName = $CommandName.ToLower()
        
        # Get priority for this file
        $Priority = Get-FilePriority -FileName $FileName -RelativePath $RelativePath
        
        # Skip files that don't have priority 1-8 (only include numbered priority items)
        if ($Priority -eq -1) {
            $SkippedCount++
            continue
        }
        
        # Create command name in format "apm-#-name" (insert priority after apm-)
        $CommandNameWithPriority = $CommandName -replace '^apm-', "apm-${Priority}-"
        
        # Create the command file path
        $CommandFilePath = Join-Path $CursorCommandsPath "${CommandNameWithPriority}.md"
        
        # Read the original file content with UTF-8 encoding
        $Content = Get-Content $File.FullName -Raw -Encoding UTF8
        
        # Add metadata header for the cursor command
        $CursorCommandContent = @"
---
description: $FileName (APM: $RelativePath)
---

$Content
"@
        
        if ($DryRun) {
            Write-Host "[DRY RUN] Would install: ${CommandNameWithPriority}.md" -ForegroundColor Yellow
            Write-Host "           Priority: $Priority | Source: $RelativePath" -ForegroundColor Gray
            $InstalledCount++
        }
        else {
            # Write the command file with UTF-8 encoding (no BOM)
            $Utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($CommandFilePath, $CursorCommandContent, $Utf8NoBom)
            Write-Host "[INSTALLED] ${CommandNameWithPriority}.md" -ForegroundColor Green
            Write-Host "            Priority: $Priority | Source: $RelativePath" -ForegroundColor Gray
            $InstalledCount++
        }
    }

    # Summary
    Write-Host ""
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host "Update Summary:" -ForegroundColor Cyan
    if ($ExistingCommands) {
        Write-Host "  Commands uninstalled: $($ExistingCommands.Count)" -ForegroundColor Cyan
    }
    Write-Host "  Commands installed: $InstalledCount" -ForegroundColor Green
    Write-Host "  Commands skipped: $SkippedCount" -ForegroundColor Yellow

    if ($DryRun) {
        Write-Host ""
        Write-Host "This was a DRY RUN. No files were modified." -ForegroundColor Yellow
        Write-Host "Run without -DryRun to update the commands." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "APM slash commands have been updated to match the current repository state." -ForegroundColor Cyan
}

# Function to uninstall APM commands
function Uninstall-Commands {
    Write-Host "APM Slash Commands Manager - Uninstall" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Cursor Commands Directory: $CursorCommandsPath" -ForegroundColor Yellow
    Write-Host ""

    # Check if directory exists
    if (-not (Test-Path $CursorCommandsPath)) {
        Write-Host "Cursor commands directory does not exist: $CursorCommandsPath" -ForegroundColor Yellow
        Write-Host "No APM commands to uninstall." -ForegroundColor Green
        return
    }

    # Find all APM command files
    $ExistingCommands = Get-ChildItem -Path $CursorCommandsPath -Filter "apm-*.md" -ErrorAction SilentlyContinue
    
    if (-not $ExistingCommands) {
        Write-Host "No APM commands found to uninstall." -ForegroundColor Yellow
        return
    }

    $UninstallCount = $ExistingCommands.Count
    
    if ($DryRun) {
        Write-Host "[DRY RUN] Would uninstall $UninstallCount APM command(s):" -ForegroundColor Yellow
        foreach ($cmd in $ExistingCommands) {
            Write-Host "  $($cmd.Name)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "Uninstalling $UninstallCount APM command(s)..." -ForegroundColor Cyan
        $ExistingCommands | Remove-Item -Force
        Write-Host "Successfully uninstalled $UninstallCount APM command(s)" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host "Uninstall Summary:" -ForegroundColor Cyan
    Write-Host "  Commands removed: $UninstallCount" -ForegroundColor Green

    if ($DryRun) {
        Write-Host ""
        Write-Host "This was a DRY RUN. No files were removed." -ForegroundColor Yellow
        Write-Host "Run without -DryRun to uninstall the commands." -ForegroundColor Yellow
    }
}

# Function to install APM commands
function Install-Commands {
    Write-Host "APM Slash Commands Manager - Install" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Prompts Directory: $PromptsPath" -ForegroundColor Yellow
    Write-Host "Cursor Commands Directory: $CursorCommandsPath" -ForegroundColor Yellow
    Write-Host ""

    # Verify prompts directory exists
    if (-not (Test-Path $PromptsPath)) {
        Write-Error "Prompts directory not found: $PromptsPath"
        exit 1
    }

    # Create Cursor commands directory if it doesn't exist
    if (-not (Test-Path $CursorCommandsPath)) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would create directory: $CursorCommandsPath" -ForegroundColor Yellow
        }
        else {
            New-Item -ItemType Directory -Path $CursorCommandsPath -Force | Out-Null
            Write-Host "Created Cursor commands directory: $CursorCommandsPath" -ForegroundColor Green
        }
    }

    # Purge existing APM commands
    $ExistingCommands = Get-ChildItem -Path $CursorCommandsPath -Filter "apm-*.md" -ErrorAction SilentlyContinue
    if ($ExistingCommands) {
        $PurgeCount = $ExistingCommands.Count
        if ($DryRun) {
            Write-Host "[DRY RUN] Would purge $PurgeCount existing APM command(s)" -ForegroundColor Yellow
        }
        else {
            $ExistingCommands | Remove-Item -Force
            Write-Host "Purged $PurgeCount existing APM command(s)" -ForegroundColor Cyan
        }
        Write-Host ""
    }

    # Find all markdown files in prompts directory
    $MarkdownFiles = Get-ChildItem -Path $PromptsPath -Filter "*.md" -Recurse

    # Counter for installed commands
    $InstalledCount = 0
    $SkippedCount = 0

    foreach ($File in $MarkdownFiles) {
        # Get relative path from prompts directory
        $RelativePath = $File.FullName.Substring($PromptsPath.Length + 1)
        
        # Create a command name based on the directory structure
        $DirectoryPath = Split-Path $RelativePath -Parent
        $FileName = $File.BaseName
        
        # Create shorter, kebab-case command names
        # Simplify directory names first
        $DirName = if ($DirectoryPath) { 
            $DirectoryPath `
                -replace 'Implementation_Agent', 'implementation' `
                -replace 'Manager_Agent', 'manager' `
                -replace 'Setup_Agent', 'setup' `
                -replace 'ad-hoc', 'adhoc' `
                -replace '_', '-' `
                -replace '\\', '-'
        }
        else { '' }
        
        # Simplify file names and remove redundant prefixes
        $ShortName = $FileName `
            -replace '^Implementation_Agent_', '' `
            -replace '^Manager_Agent_', '' `
            -replace '^Setup_Agent_', '' `
            -replace '^Ad_Hoc_Agent_', '' `
            -replace '_Agent_Initiation_Prompt$', '-initiation' `
            -replace '_Initiation_Prompt$', '-initiation' `
            -replace 'Initiation', 'initiation' `
            -replace '_Agent_Handover_Guide$', '-handover' `
            -replace '_Handover_Guide$', '-handover' `
            -replace 'Handover', 'handover' `
            -replace '_Delegation_Guide$', '-delegate' `
            -replace 'Delegation', 'delegate' `
            -replace '_Guide$', '' `
            -replace '_Prompt$', '' `
            -replace 'Implementation_Plan', 'plan' `
            -replace 'Implementation', 'implementation' `
            -replace 'Memory_Log', 'memory-log' `
            -replace 'Memory_System', 'memory-system' `
            -replace 'Project_Breakdown_Review', 'project-review' `
            -replace 'Project_Breakdown', 'project-breakdown' `
            -replace 'Task_Assignment', 'task-assign' `
            -replace 'Context_Synthesis', 'context' `
            -replace 'Debug', 'debug' `
            -replace 'Research', 'research' `
            -replace 'README', 'readme' `
            -replace '_', '-'
        
        # Build command name
        if ($DirName) {
            $CommandName = "apm-${DirName}-${ShortName}"
        }
        else {
            $CommandName = "apm-${ShortName}"
        }
        
        # Clean up multiple hyphens and convert to lowercase
        $CommandName = $CommandName -replace '--+', '-' -replace '-$', ''
        $CommandName = $CommandName.ToLower()
        
        # Get priority for this file
        $Priority = Get-FilePriority -FileName $FileName -RelativePath $RelativePath
        
        # Skip files that don't have priority 1-8 (only include numbered priority items)
        if ($Priority -eq -1) {
            $SkippedCount++
            continue
        }
        
        # Create command name in format "apm-#-name" (insert priority after apm-)
        $CommandNameWithPriority = $CommandName -replace '^apm-', "apm-${Priority}-"
        
        # Create the command file path
        $CommandFilePath = Join-Path $CursorCommandsPath "${CommandNameWithPriority}.md"
        
        # Read the original file content with UTF-8 encoding
        $Content = Get-Content $File.FullName -Raw -Encoding UTF8
        
        # Add metadata header for the cursor command
        $CursorCommandContent = @"
---
description: $FileName (APM: $RelativePath)
---

$Content
"@
        
        if ($DryRun) {
            Write-Host "[DRY RUN] Would install: ${CommandNameWithPriority}.md" -ForegroundColor Yellow
            Write-Host "           Priority: $Priority | Source: $RelativePath" -ForegroundColor Gray
            $InstalledCount++
        }
        else {
            # Write the command file with UTF-8 encoding (no BOM)
            $Utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($CommandFilePath, $CursorCommandContent, $Utf8NoBom)
            Write-Host "[INSTALLED] ${CommandNameWithPriority}.md" -ForegroundColor Green
            Write-Host "            Priority: $Priority | Source: $RelativePath" -ForegroundColor Gray
            $InstalledCount++
        }
    }

    # Summary
    Write-Host ""
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host "Install Summary:" -ForegroundColor Cyan
    if ($ExistingCommands) {
        Write-Host "  Commands purged: $PurgeCount" -ForegroundColor Cyan
    }
    Write-Host "  Commands installed: $InstalledCount" -ForegroundColor Green
    Write-Host "  Commands skipped: $SkippedCount" -ForegroundColor Yellow

    if ($DryRun) {
        Write-Host ""
        Write-Host "This was a DRY RUN. No files were installed." -ForegroundColor Yellow
        Write-Host "Run without -DryRun to install the commands." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "To use these commands in Cursor:" -ForegroundColor Cyan
    Write-Host "  1. Open Cursor chat agent" -ForegroundColor White
    Write-Host "  2. Type '/apm-' to see all APM commands" -ForegroundColor White
    Write-Host "  3. Select the command you want to use" -ForegroundColor White
}

# Main execution based on command
switch ($Command) {
    'install' { Install-Commands }
    'uninstall' { Uninstall-Commands }
    'update' { Update-Commands }
    default {
        Write-Error "Invalid command '$Command'"
        Write-Host "Use '.\apm-slash-commands.ps1 -Help' for usage information"
        exit 1
    }
}
