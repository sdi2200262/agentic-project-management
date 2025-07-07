# APM Artifact JSON Schemas (Alpha Testing)
This directory contains JSON schemas that define the structure for APM v0.4 artifacts. If you're testing the JSON variants of Implementation Plans, Memory Logs, or Task Assignments, these schemas keep everything properly structured and catch issues before they break your workflow.

## Available Schemas
- **`implementation_plan.schema.json`** - Structure for `Implementation_Plan.json` files (both phased and linear projects). Enforces all the rules from `Implementation_Plan_Guide.md` about tasks, agent assignments, dependencies, and phase summaries.

- **`memory_log.schema.json`** - Structure for Dynamic-JSON Memory Logs. Makes sure your logs follow all the requirements from `Memory_Log_Guide.md`.

- **`task_assignment.schema.json`** - Structure for JSON-format Task Assignment Prompts. Validates all the YAML frontmatter and content sections from `Task_Assignment_Guide.md`.

More schemas will show up here as I (or you) add new JSON variants to the framework.

## Validation Script
I've included `validate_schema.py` for checking your JSON files against these schemas. It's handy for catching structural issues without having to run through the full APM workflow. Hopefully the Manager Agent will use it to validate Setup or evene later Artifacts against their required schemas... if it fails to do so, please instruct it at least for the Implementation Plan JSON Artifact.

### How to Use the Script
Run it from command line with the artifact type and file path:
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

If validation passes, you'll get a confirmation message. If it fails, you'll get detailed error info to fix whatever's broken.

## Examples
The `examples/` folder has sample JSON files that follow the schemas. Use them for helping the Manager Agent with validation or as templates when creating new artifacts.... as the Header says... still Alpha testing.

### What's In Examples
- **`json_plan_example.json`** - Sample phased project (Vite app with Shadcn components)
- **`json_memory_log_example.json`** - Sample Dynamic-JSON memory log for Task 1.1
- **`json_task_example.json`** - Sample Task Assignment Prompt in JSON format

These examples show you exactly how the JSON variants should look when they're properly structured.

**Warning:**
> **Beware when using JSON variants that its still for Alpha testing and also that you are sacrificing ~15% higher token consumption for better LLM parsing and context retention. This means that you should be aware to conduct more frequent Handover Procedures to avoid context loss.**