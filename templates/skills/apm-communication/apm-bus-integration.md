# APM Message Bus Integration Guide

This guide explains how non-APM agents can interact with an APM session through the Message Bus. If you are a standalone agent (not managed by APM's Manager Agent) and need to communicate with APM-managed Workers or the Manager, follow this guide to create your own Agent Channel.

## Creating an Agent Channel

To participate in Message Bus communication, create your own Agent Channel in `.apm/bus/`:

1. Choose an Agent Slug for your identity (lowercase, hyphenated). Example: `external-reviewer`.
2. Create your Agent Channel directory: `.apm/bus/<your-agent-slug>/`.
3. Create the Bus Files you need:
   - To receive messages: `apm-send-to-<your-agent-slug>.md`.
   - To send messages: `apm-report-from-<your-agent-slug>.md`.
   - For Handoff (if applicable): `apm-handoff-<your-agent-slug>.md`.

## File Naming

Bus Files follow a strict naming convention:

| Purpose | File Name |
|---------|-----------|
| Receive from Manager | `apm-send-to-<your-agent-slug>.md` |
| Send to Manager | `apm-report-from-<your-agent-slug>.md` |
| Handoff | `apm-handoff-<your-agent-slug>.md` |

## Clearing Protocol

Before writing a message to your outgoing Bus File, clear your incoming Bus File by truncating it:
```
truncate -s 0 .apm/bus/<your-agent-slug>/apm-send-to-<your-agent-slug>.md
```

Then write your message to the outgoing file.

## Message Format

Bus Files contain message content directly. No YAML frontmatter envelope is used. Write the message content (Task Report, response, etc.) as the entire file content.

## Communication Flow

1. The Manager (or User) writes a message to your Send Bus File.
2. The User references the file in your session.
3. Read the Send Bus File and process the message content.
4. Clear the incoming Send Bus File.
5. Write your response to the Report Bus File.
6. Inform the User to reference the Report Bus File in the Manager session.
