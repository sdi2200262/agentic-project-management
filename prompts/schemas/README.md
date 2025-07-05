# APM Artifact Schemas

This directory contains the JSON schemas that define the structure of various artifacts used within the Agentic Project Management (APM) framework. These schemas are critical for ensuring data integrity, consistency, and compatibility between different agents and system components.

## Available Schemas

- `implementation_plan.schema.json`: Defines the structure for both phased and linear `Implementation_Plan.json` files. It enforces rules for task definitions, agent assignments, dependencies, and phase summaries as described in the `Implementation_Plan_Guide.md`.

*More schemas for other artifacts (e.g., Memory Logs, Task Assignments) will be added here as they are developed.*

---

## Validation Script

This directory includes a Python script, `validate_schema.py`, for validating JSON artifacts against their corresponding schemas. This allows for automated, non-LLM-based verification of artifact integrity.

### How to Use

The script is run from the command line and requires two arguments: the artifact type and the path to the JSON file to validate.

**Usage:**
```bash
python path/to/validate_schema.py <artifact_type> <file_path>
```

**Arguments:**
- `<artifact_type>`: The type of artifact to validate. Currently supported: `plan`.
- `<file_path>`: The path to the JSON file you want to validate.

**Example:**
To validate the example implementation plan, run the following command from the `schemas/` directory:
```bash
cd path/to/validate_schema.py
python validate_schema.py plan examples/json_plan_example.json
```
A successful validation will print a confirmation message. If validation fails, the script will output detailed error information and exit with a non-zero status code.

---

## Examples

The `examples/` subdirectory contains sample JSON files that conform to the schemas. These can be used for testing the validation script or as a reference when generating new artifacts.

### Current Examples

- `json_plan_example.json`: A simple, phased project to create a Vite application with Shadcn components.

---
