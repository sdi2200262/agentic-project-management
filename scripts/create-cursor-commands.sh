#!/bin/bash

# APM Cursor Commands Generator (Mac/Unix Version)
# This script creates Cursor commands from the prompts directory

# Default values
DRY_RUN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--dry-run]"
            echo "  --dry-run    Show what would be created without actually creating files"
            echo "  -h, --help   Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Get the project root directory (parent of scripts directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROMPTS_PATH="$PROJECT_ROOT/prompts"

# Define the Cursor commands directory
CURSOR_COMMANDS_PATH="$HOME/.cursor/commands"

# Define priority order for commands (lower number = appears first)
# Function to get priority for a file
get_file_priority() {
    local relative_path="$1"
    
    # Priority patterns (must match the PowerShell version)
    if [[ "$relative_path" =~ Setup_Agent.*Initiation ]]; then
        echo 1
    elif [[ "$relative_path" =~ Manager_Agent.*Initiation ]]; then
        echo 2
    elif [[ "$relative_path" =~ Implementation_Agent.*Initiation ]]; then
        echo 3
    elif [[ "$relative_path" =~ Ad_Hoc.*Initiation ]]; then
        echo 4
    elif [[ "$relative_path" =~ Manager_Agent.*Handover ]]; then
        echo 5
    elif [[ "$relative_path" =~ Implementation_Agent.*Handover ]]; then
        echo 6
    elif [[ "$relative_path" =~ Research_Delegation ]]; then
        echo 7
    elif [[ "$relative_path" =~ Debug_Delegation ]]; then
        echo 8
    else
        echo -1  # Default priority for unmatched files
    fi
}

echo -e "${CYAN}APM Cursor Commands Generator${NC}"
echo -e "${CYAN}==============================${NC}"
echo ""
echo -e "${YELLOW}Prompts Directory: $PROMPTS_PATH${NC}"
echo -e "${YELLOW}Cursor Commands Directory: $CURSOR_COMMANDS_PATH${NC}"
echo ""

# Verify prompts directory exists
if [[ ! -d "$PROMPTS_PATH" ]]; then
    echo -e "${RED}Error: Prompts directory not found: $PROMPTS_PATH${NC}" >&2
    exit 1
fi

# Create Cursor commands directory if it doesn't exist
if [[ ! -d "$CURSOR_COMMANDS_PATH" ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}[DRY RUN] Would create directory: $CURSOR_COMMANDS_PATH${NC}"
    else
        mkdir -p "$CURSOR_COMMANDS_PATH"
        echo -e "${GREEN}Created Cursor commands directory: $CURSOR_COMMANDS_PATH${NC}"
    fi
fi

# Purge existing APM commands
EXISTING_COMMANDS=($(find "$CURSOR_COMMANDS_PATH" -name "apm-*.md" 2>/dev/null || true))
if [[ ${#EXISTING_COMMANDS[@]} -gt 0 ]]; then
    PURGE_COUNT=${#EXISTING_COMMANDS[@]}
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}[DRY RUN] Would purge $PURGE_COUNT existing APM command(s)${NC}"
    else
        rm -f "${EXISTING_COMMANDS[@]}"
        echo -e "${CYAN}Purged $PURGE_COUNT existing APM command(s)${NC}"
    fi
    echo ""
fi

# Find all markdown files in prompts directory
CREATED_COUNT=0
SKIPPED_COUNT=0

while IFS= read -r -d '' file; do
    # Get relative path from prompts directory
    RELATIVE_PATH="${file#$PROMPTS_PATH/}"
    
    # Create a command name based on the directory structure
    DIRECTORY_PATH="$(dirname "$RELATIVE_PATH")"
    FILE_NAME="$(basename "$file" .md)"
    
    # Create shorter, kebab-case command names
    # Simplify directory names first
    if [[ "$DIRECTORY_PATH" != "." ]]; then
        DIR_NAME="$DIRECTORY_PATH"
        DIR_NAME="${DIR_NAME//Implementation_Agent/implementation}"
        DIR_NAME="${DIR_NAME//Manager_Agent/manager}"
        DIR_NAME="${DIR_NAME//Setup_Agent/setup}"
        DIR_NAME="${DIR_NAME//ad-hoc/adhoc}"
        DIR_NAME="${DIR_NAME//_/-}"
        DIR_NAME="${DIR_NAME//\//-}"
    else
        DIR_NAME=""
    fi
    
    # Simplify file names and remove redundant prefixes
    SHORT_NAME="$FILE_NAME"
    SHORT_NAME="${SHORT_NAME//Implementation_Agent_/}"
    SHORT_NAME="${SHORT_NAME//Manager_Agent_/}"
    SHORT_NAME="${SHORT_NAME//Setup_Agent_/}"
    SHORT_NAME="${SHORT_NAME//Ad_Hoc_Agent_/}"
    SHORT_NAME="${SHORT_NAME//_Agent_Initiation_Prompt/-initiation}"
    SHORT_NAME="${SHORT_NAME//_Initiation_Prompt/-initiation}"
    SHORT_NAME="${SHORT_NAME//Initiation/initiation}"
    SHORT_NAME="${SHORT_NAME//_Agent_Handover_Guide/-handover}"
    SHORT_NAME="${SHORT_NAME//_Handover_Guide/-handover}"
    SHORT_NAME="${SHORT_NAME//Handover/handover}"
    SHORT_NAME="${SHORT_NAME//_Delegation_Guide/-delegate}"
    SHORT_NAME="${SHORT_NAME//Delegation/delegate}"
    SHORT_NAME="${SHORT_NAME//_Guide/}"
    SHORT_NAME="${SHORT_NAME//_Prompt/}"
    SHORT_NAME="${SHORT_NAME//Implementation_Plan/plan}"
    SHORT_NAME="${SHORT_NAME//Implementation/implementation}"
    SHORT_NAME="${SHORT_NAME//Memory_Log/memory-log}"
    SHORT_NAME="${SHORT_NAME//Memory_System/memory-system}"
    SHORT_NAME="${SHORT_NAME//Project_Breakdown_Review/project-review}"
    SHORT_NAME="${SHORT_NAME//Project_Breakdown/project-breakdown}"
    SHORT_NAME="${SHORT_NAME//Task_Assignment/task-assign}"
    SHORT_NAME="${SHORT_NAME//Context_Synthesis/context}"
    SHORT_NAME="${SHORT_NAME//Debug/debug}"
    SHORT_NAME="${SHORT_NAME//Research/research}"
    SHORT_NAME="${SHORT_NAME//README/readme}"
    SHORT_NAME="${SHORT_NAME//_/-}"
    
    # Build command name
    if [[ -n "$DIR_NAME" ]]; then
        COMMAND_NAME="apm-${DIR_NAME}-${SHORT_NAME}"
    else
        COMMAND_NAME="apm-${SHORT_NAME}"
    fi
    
    # Clean up multiple hyphens and convert to lowercase
    COMMAND_NAME="${COMMAND_NAME//--*/-}"
    COMMAND_NAME="${COMMAND_NAME%-}"
    COMMAND_NAME=$(echo "$COMMAND_NAME" | tr '[:upper:]' '[:lower:]')
    
    # Get priority for this file
    PRIORITY=$(get_file_priority "$RELATIVE_PATH")
    
    # Skip files that don't have priority 1-8 (only include numbered priority items)
    if [[ "$PRIORITY" -eq -1 ]]; then
        ((SKIPPED_COUNT++))
        continue
    fi
    
    # Create command name in format "apm-#-name" (insert priority after apm-)
    COMMAND_NAME_WITH_PRIORITY="${COMMAND_NAME/apm-/apm-${PRIORITY}-}"
    
    # Create the command file path
    COMMAND_FILE_PATH="$CURSOR_COMMANDS_PATH/${COMMAND_NAME_WITH_PRIORITY}.md"
    
    # Read the original file content
    CONTENT=$(cat "$file")
    
    # Add metadata header for the cursor command
    CURSOR_COMMAND_CONTENT="---
description: $FILE_NAME (APM: $RELATIVE_PATH)
---

$CONTENT"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}[DRY RUN] Would create: ${COMMAND_NAME_WITH_PRIORITY}.md${NC}"
        echo -e "${GRAY}           Priority: $PRIORITY | Source: $RELATIVE_PATH${NC}"
        ((CREATED_COUNT++))
    else
        # Write the command file
        echo "$CURSOR_COMMAND_CONTENT" > "$COMMAND_FILE_PATH"
        echo -e "${GREEN}[CREATED] ${COMMAND_NAME_WITH_PRIORITY}.md${NC}"
        echo -e "${GRAY}          Priority: $PRIORITY | Source: $RELATIVE_PATH${NC}"
        ((CREATED_COUNT++))
    fi
done < <(find "$PROMPTS_PATH" -name "*.md" -type f -print0)

# Summary
echo ""
echo -e "${CYAN}==============================${NC}"
echo -e "${CYAN}Summary:${NC}"
if [[ ${#EXISTING_COMMANDS[@]} -gt 0 ]]; then
    echo -e "${CYAN}  Commands purged: ${#EXISTING_COMMANDS[@]}${NC}"
fi
echo -e "${GREEN}  Commands created: $CREATED_COUNT${NC}"
echo -e "${YELLOW}  Commands skipped: $SKIPPED_COUNT${NC}"

if [[ "$DRY_RUN" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}This was a DRY RUN. No files were created.${NC}"
    echo -e "${YELLOW}Run without --dry-run to create the commands.${NC}"
fi

echo ""
echo -e "${CYAN}To use these commands in Cursor:${NC}"
echo -e "${WHITE}  1. Open Cursor chat agent${NC}"
echo -e "${WHITE}  2. Type '/apm-' to see all APM commands${NC}"
echo -e "${WHITE}  3. Select the command you want to use${NC}"
