# APM Artifact JSON Schemas (Testing Preview)
This directory contains JSON schemas that define the structure for APM v0.4 artifacts. If you're testing the JSON variants of Implementation Plans, Memory Logs, or Task Assignments, these schemas keep everything properly structured and catch issues before they break your workflow.

## **Testing Preview - Not for Production**
The JSON asset format is designed for advanced testing scenarios requiring strict workflow validation and maximum LLM parsing fidelity. It is intended for:
- Contributors seeking to experiment and provide feedback on asset structure
- Users with high token budgets unconcerned with token consumption willing to test this feature

**WARNING: JSON assets consume 2-3x more tokens than Markdown equivalents (minimum 15% overhead, often reaching 5x for complex structures). This dramatically accelerates context window saturation, forcing frequent handovers and significantly increasing session costs. NOT recommended for production use.**

## Available Schemas
- **`implementation_plan.schema.json`** - Structure for `Implementation_Plan.json` files (both phased and linear projects). Enforces all the rules from `Implementation_Plan_Guide.md` about tasks, agent assignments, dependencies, and phase summaries.

- **`memory_log.schema.json`** - Structure for Dynamic-JSON Memory Logs. Makes sure your logs follow all the requirements from `Memory_Log_Guide.md`.

- **`task_assignment.schema.json`** - Structure for JSON-format Task Assignment Prompts. Validates all the YAML frontmatter and content sections from `Task_Assignment_Guide.md`.

More schemas will be added as new JSON variants are developed for the framework.

## Validation Script
The included `validate_schema.py` script checks your JSON files against these schemas, catching structural issues without requiring full APM workflow execution. Manager Agents should use this for Implementation Plan validation when using JSON variants.

### How to Use the Script
Run from command line with the artifact type and file path:
```bash
python validate_schema.py <artifact_type> <file_path>
```

**Supported artifact types:**
- `plan` - for Implementation Plans
- `log` - for Memory Logs  
- `task` - for Task Assignments

**Examples:**
```bash
# Validate an implementation plan
python validate_schema.py plan examples/json_plan_example.json

# Validate a memory log
python validate_schema.py log examples/json_memory_log_example.json

# Validate a task assignment
python validate_schema.py task examples/json_task_example.json
```

If validation passes, you'll get a confirmation message. If it fails, you'll get detailed error information for fixes.

## Examples
The `examples/` folder contains sample JSON files demonstrating proper schema compliance. Use these as templates or for Manager Agent validation reference.

### What's In Examples
- **`json_plan_example.json`** - Sample phased project (Vite app with Shadcn components)
- **`json_memory_log_example.json`** - Sample Dynamic-JSON memory log for Task 1.1
- **`json_task_example.json`** - Sample Task Assignment Prompt in JSON format

These examples demonstrate exactly how JSON variants should be structured for schema compliance.

## Cost & Usage Considerations
**Recommended for testing and feedback only.** The significant token overhead makes JSON variants impractical for most production workflows. Use Markdown variants for normal APM sessions unless specifically testing structured data approaches or contributing to JSON format development.