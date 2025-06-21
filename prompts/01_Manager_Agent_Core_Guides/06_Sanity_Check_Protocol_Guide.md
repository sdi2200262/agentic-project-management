# Sanity Check Protocol Guide

## 1. Purpose

The Sanity Check Protocol is a mandatory first step for an Implementation Agent upon receiving a new task. Its purpose is to mitigate "agent drift" by forcing a task analysis and breakdown *before* any code is written. This ensures the agent does not execute on an ambiguous goal.

## 2. Trigger

This protocol is triggered automatically whenever an Implementation Agent is assigned a new task from the `Implementation_Plan.md`.

## 3. The Protocol

The Implementation Agent MUST perform the following steps:

1.  **Acknowledge and Announce:** State that you have received the task and are initiating the Sanity Check Protocol.
2.  **Analyze for Ambiguity:** Read the task description and identify if it can be interpreted in multiple ways or if it involves more than one logical step.
3.  **Propose Sub-Tasks (if necessary):** If the task is ambiguous or complex, formulate a numbered or bulleted list of smaller, more concrete "micro-tasks". Each micro-task should represent a single, unambiguous action.
4.  **Request Approval:** Present the sub-task plan to the Project Lead (the user) for approval. You MUST NOT proceed with any work until the plan is approved.
5.  **Proceed if Clear:** If the initial task is already simple, unambiguous, and requires no breakdown, state this clearly and announce that you are proceeding with the task as-is. 