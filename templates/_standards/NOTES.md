# APM Templates Development Notes

This document contains development notes, research findings, and implementation considerations for the APM templates. These notes inform future development decisions and track areas requiring further investigation.

---

## Parallel Task Coordination (Future)

**Context:** The Message Bus architecture (implemented in `{SKILL_PATH:apm-communication}`) supports parallel Task execution. The Manager can write Task Prompts to multiple Send Buses before receiving Reports. This requires changes to the Manager's Task Cycle (currently sequential) to support batch assignment and independent Report processing.

**Status:** Future work. Bus infrastructure supports this; Manager coordination model does not yet.

### Open Questions

1. How does the Manager track which Tasks are "in flight" across multiple Workers?
2. Should parallel assignment be configurable in the Implementation Plan (per-Stage)?
3. How does the User manage multiple Worker sessions simultaneously?
4. Git branching strategy for parallel Workers modifying the same codebase?

---

## Session Continuation Workflow (February 2026)

**Context:** Designing a mechanism to close the agentic loop when an APM session completes. Users need to archive completed sessions and start fresh while optionally leveraging previous session context.

**Problem Statement:** When an APM session completes (all stages done, deliverables working), there's no formal continuation mechanism. The Manager can add tasks but lacks the Planner's discovery capabilities. Existing artifacts reflect completed work, not new scope. Users need to start fresh while optionally preserving access to previous session context.

**Key Constraint:** Archived context is a snapshot; the codebase is mutable. Automatic session linking creates fragile dependency chains-Session B may invalidate Session A's context without explicit relationship.

### Design Principles

1. **No programmatic linking** - Archives are storage, not dependency sources
2. **User decides relevance** - Planner asks, doesn't assume
3. **Verify before asking** - Context retrieval + codebase verification THEN questions
4. **Snapshot acknowledgment** - Summaries explicitly state point-in-time nature

### Components

| Component | Purpose | Actor |
|-----------|---------|-------|
| `apm continue` | Archive current session, create fresh templates | CLI (programmatic) |
| `/apm-summarize-session` | Create high-level summary artifact (optional) | Native agent (no APM layers) |
| Context Detection | Detect archives, ask user about relevance | Planner Agent |
| Context Retrieval | Explore archive + verify against codebase | Subagent |

### `apm continue` Command

**Behavior:**
```
$ apm continue [-n|--name <name>]

1. Prompt for archive name (or use flag/default)
2. Move .apm/* to .apm/archives/<name>/
3. Create fresh template artifacts
4. Output completion message
```

**Archive Structure:**
```
.apm/archives/<name>/
├── Implementation_Plan.md
├── Specifications.md
├── APM_Session_Summary.md    # If summarize was run
└── Memory/
```

### Planner Context Detection (Addition to Context Gathering)

**§0.1 Previous Session Detection:**
1. Check for `.apm/archives/`
2. If archives exist, list to User with basic info (name, date)
3. Ask: "Are any relevant? Which ones and any caveats?"
4. User decides: none (fresh start) or specific session(s) with guidance

**§0.2 Context Retrieval (if user indicates relevance):**
1. Spawn exploration subagent to examine archive
2. Spawn verification subagent to check against current codebase
3. Integrate findings into Question Rounds as delta-focused questions

### Open Questions

1. **Default archive naming:** Incremental (`session-1`, `session-2`) vs timestamp-based?
2. **Summary command naming:** `/apm-summarize-session` vs `/apm-session-summary`?
3. **Stale archive cleanup:** Should there be an `apm archives --prune` command?
4. **Multi-archive selection:** Can user select multiple archives? How does Planner handle conflicts?

### Next Steps

- [ ] Define `apm continue` CLI specification
- [ ] Define `/apm-summarize-session` command procedure
- [ ] Add §0.1 and §0.2 to Context Gathering guide
- [ ] Define APM_Session_Summary.md template structure

---
