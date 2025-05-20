# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - YYYY-MM-DD

### Added
- New section in `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Format.md` for "Recent Conversational Context & Key User Directives" in the `Handover_File.md`.

### Changed
- **Memory System Robustness (High Priority):**
  - Updated `prompts/01_Manager_Agent_Core_Guides/02_Memory_Bank_Guide.md` to mandate strict adherence to `Implementation_Plan.md` for all directory/file naming and to include a validation step before creation. Phase and Task naming conventions clarified.
  - Significantly revised `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md` to emphasize conciseness, provide clear principles for achieving it, and added concrete examples of good vs. overly verbose log entries.
  - Updated `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md` to instruct Manager Agents to explicitly remind specialized agents of their obligations regarding Memory Bank structure and log quality (this earlier change remains valid alongside the newer one below).
- **Handover Protocol Enhancement:**
  - Modified `prompts/01_Manager_Agent_Core_Guides/05_Handover_Protocol_Guide.md` to include a new mandatory step for the Outgoing Manager Agent: review recent conversational turns with the User and incorporate a summary of unlogged critical directives or contextual shifts into the handover artifacts.
- **Implementation Plan and Task Assignment Process:**
  - Enhanced `prompts/01_Manager_Agent_Core_Guides/01_Implementation_Plan_Guide.md` to:
    - Emphasize and clarify the requirement for explicit agent assignment per task.
    - Mandate the inclusion of brief "Guiding Notes" (e.g., key methods, libraries, parameters) within task action steps to ensure inter-task consistency and provide clearer direction.
  - Updated `prompts/01_Manager_Agent_Core_Guides/03_Task_Assignment_Prompts_Guide.md` to ensure Manager Agents incorporate and expand upon these "Guiding Notes" from the `Implementation_Plan.md` when creating detailed task assignment prompts for Implementation Agents.
- **Handover Artifacts Refinement:**
  - Restructured and clarified `prompts/02_Utility_Prompts_And_Format_Definitions/Handover_Artifact_Format.md` for better usability and understanding.

### Removed
- Removed the `Complex_Task_Prompting_Best_Practices.md` guide to maintain a more general framework.
- Removed explicit guidelines for Jupyter Notebook cell generation from `prompts/02_Utility_Prompts_And_Format_Definitions/Imlementation_Agent_Onboarding.md` to keep agent guidance general.

## [0.2.0] - 2025-05-14
### Added
- New Manager Agent Guide for dynamic Memory Bank setup (`02_Memory_Bank_Guide.md`).
- Cursor Rules system with 3 initial rules and `rules/README.md` for MA reliability upon Initiation Phase.
- Enhanced MA Initiation with improved asset verification, file structure display and more.

### Changed
- Refined Manager Agent Initiation Flow (`01_Initiation_Prompt.md`) for Memory Bank, planning, and codebase guidance.
- Comprehensive documentation updates across key files (Root `README.md`, `Getting Started`, `Cursor Integration`, `Core Concepts`, `Troubleshooting`) reflecting all v0.2.0 changes.
- Renumbered core MA guides in `prompts/01_Manager_Agent_Core_Guides/` and updated framework references.


## [0.1.0] - 2025-05-12
### Added
- Initial framework structure
- Defined Memory Bank log format and Handover Artifact formats.
- Created core documentation: Introduction, Workflow Overview, Getting Started, Glossary, Cursor Integration Guide, Troubleshooting.
- Established basic repository files: README, LICENSE, CONTRIBUTING, CHANGELOG, CODE OF CONDUCT.
- Added initial GitHub issue template for bug reports.


## [Unreleased]
### Added
- Placeholder for future changes.

