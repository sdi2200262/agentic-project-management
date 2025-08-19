import argparse
import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError


SCHEMA_MAP = {
    "plan": "implementation_plan.schema.json",
    # "log": "memory_log.schema.json", # TBD
    # "task": "task_assignment.schema.json", # TBD
}


def load_json_file(file_path):
    """Load and return JSON data from a file."""
    
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    
    except FileNotFoundError:
        print(f"Error: File not found - {file_path}", file=sys.stderr)
        sys.exit(1)
    
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in file '{file_path}' - {e}", file=sys.stderr)
        sys.exit(1)


def get_schema_path(artifact_type):
    """Return the full path to the schema file for the given artifact type."""
    
    schema_file = SCHEMA_MAP.get(artifact_type)
    
    if not schema_file:
        print(f"Error: Schema for artifact type '{artifact_type}' is not defined yet.", file=sys.stderr)
        print_usage_and_exit()
    
    return Path(__file__).parent / schema_file


def validate_json(instance, schema, file_path, artifact_type):
    """Validate the JSON instance against the schema."""
    
    try:
        validate(instance=instance, schema=schema)
        print(f"Validation successful: '{file_path}' conforms to the '{artifact_type}' schema.")
    
    except ValidationError as e:
        print(f"Validation failed for '{file_path}'!", file=sys.stderr)
        print("---Error Details---", file=sys.stderr)
        print(f"Message: {e.message}", file=sys.stderr)
        print(f"Path in JSON: {list(e.path)}", file=sys.stderr)
        print(f"Validator: {e.validator} = {e.validator_value}", file=sys.stderr)
        sys.exit(1)


def print_usage_and_exit():
    """Print usage information and exit."""
    print("Usage: python validate_schema.py <artifact_type> <file_path>", file=sys.stderr)
    print(f"  <artifact_type>: one of {list(SCHEMA_MAP.keys())}", file=sys.stderr)
    print("  <file_path>: path to the JSON file to validate", file=sys.stderr)
    sys.exit(2)


def parse_args():
    """Parse and return command-line arguments."""
    
    parser = argparse.ArgumentParser(
        description="Validate a JSON file against a predefined APM schema.",
        add_help=False
    )
    
    parser.add_argument(
        "artifact_type",
        choices=SCHEMA_MAP.keys(),
        help=f"The type of artifact to validate. Choices: {list(SCHEMA_MAP.keys())}"
    )
    
    parser.add_argument(
        "file_path",
        help="The path to the JSON file to validate."
    )
    
    parser.add_argument(
        "-h", "--help", action="help", default=argparse.SUPPRESS,
        help="Show this help message and exit."
    )
    
    try:
        args = parser.parse_args()
    
    except Exception:
        print_usage_and_exit()
    
    return args


def main():
    if len(sys.argv) < 3:
        print_usage_and_exit()

    args = parse_args()
    schema_path = get_schema_path(args.artifact_type)
    schema = load_json_file(schema_path)
    instance = load_json_file(args.file_path)
    validate_json(instance, schema, args.file_path, args.artifact_type)

if __name__ == "__main__":
    main()
