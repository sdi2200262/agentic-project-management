# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-08-19

APM v0.4 represents a complete framework refinement. The v0.3 architecture is enhanced to provide a more sophisticated, scalable approach to multi-agent project management while maintaining the core principles that made APM effective.

### Major Changes

**Architecture Enhancements**
- **Expanded from 2 to 4 agent types**: Added Setup Agent for project initialization and Ad-Hoc Agents for specialized delegation
- **Two-phase workflow**: Setup Phase for comprehensive planning, Task Loop Phase for execution
- **Advanced memory system**: Dynamic Memory Bank with multiple variants and progressive creation
- **Sophisticated dependency management**: Cross-agent coordination with comprehensive context integration
- **Handovers are now practical context repair mechanisms** not just context dumps, with built-in safety and validation steps

**Complete File Structure Overhaul**
- All prompts redesigned and reorganized under new directory structure
- New `docs/` directory with comprehensive updated documentation
- Added `schemas/` directory with experimental JSON asset format for testing/research preview

**Enhanced Capabilities**
- **Systematic project discovery**: 4-phase Context Synthesis with progression gates
- **Advanced task execution**: Single-step and multi-step patterns with dependency context integration
- **Error handling protocol**: Mandatory delegation system for complex debugging scenarios
- **Token optimization**: Economic model proposals and cost-effective strategies

### License Change
- **Updated from MIT to Mozilla Public License 2.0 (MPL-2.0)**
- Ensures community protection while maintaining full commercial compatibility

### Migration Notes
APM v0.4 is not backward compatible with v0.3. assets - **yet**. However:
- **New users** will find v0.4 significantly easier to get started with using the comprehensive documentation
- **v0.3 users** will find the core concepts familiar but greatly enhanced with more sophisticated workflows and capabilities

> **Note:** Existing v0.3 projects should be re-initialized using the new Setup Agent methodology and all v0.3 assets should be removed..

### **Getting Started**
See the complete [documentation suite](docs/) for detailed setup instructions, concepts, and advanced usage. Read [Getting Started](docs/Getting_Started.md) for your first APM v0.4 session.

---

## [0.3.0] - 2025-05-21

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

---

## [0.2.0] - 2025-05-14
### Added
- New Manager Agent Guide for dynamic Memory Bank setup (`02_Memory_Bank_Guide.md`).
- Cursor Rules system with 3 initial rules and `rules/README.md` for MA reliability upon Initiation Phase.
- Enhanced MA Initiation with improved asset verification, file structure display and more.

### Changed
- Refined Manager Agent Initiation Flow (`01_Initiation_Prompt.md`) for Memory Bank, planning, and codebase guidance.
- Comprehensive documentation updates across key files (Root `README.md`, `Getting Started`, `Cursor Integration`, `Core Concepts`, `Troubleshooting`) reflecting all v0.2.0 changes.
- Renumbered core MA guides in `prompts/01_Manager_Agent_Core_Guides/` and updated framework references.

---

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

