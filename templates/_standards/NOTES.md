# APM Development Notes

These notes describe unimplemented ideas. They do not change the workflow in `WORKFLOW.md` or authorize new runtime behavior.

## Worker-managed teams

A possible future extension would let a Worker delegate independent parts of its assigned scope to a team, integrate their work and report through the existing bus. APM Workers would remain independent conversations; the team would operate within one Worker's scope.

Before implementing this idea, establish platform support, cleanup and branch responsibilities, cost guidance, and behavior when a batch stops or needs follow-up. Preserve Worker validation, logging and reporting obligations.

The earlier proposal used per-assistant build placeholders. That approach conflicts with the shared-content layout. Any future design must keep assistant-specific calls in the communication skill's Assistant Reference and shared instructions identical across bundles. No team-execution placeholder or team workflow is currently specified.
