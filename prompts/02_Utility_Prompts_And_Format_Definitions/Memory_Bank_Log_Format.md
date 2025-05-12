# APM Memory Bank Log Format & Logging Instructions

## 1. Purpose

This document defines the standard format for all entries made to the project's `Memory_Bank.md` file(s) within the Agentic Project Management (APM) framework. It also provides direct instructions for any agent tasked with logging their work.

**Adherence to this format is mandatory** to ensure consistency, facilitate review by the Manager Agent and User, enable effective context handovers, maintain a clear project history, and provide traceability between tasks and outcomes.

## 2. Instructions for Logging Agents (Implementation, Specialized, etc.)

*   **When to Log:** You MUST add an entry to the designated `Memory_Bank.md` file IMMEDIATELY upon completing any assigned task or sub-task, reaching a significant milestone (e.g., completing a major function, finishing a complex module setup), encountering a blocker, or generating a notable result/output pertinent to your task. **Crucially, you will need to inform the User about the state of your task and he shall decide whether to log and report back to the Manager or not.**
*   **Consult Your Prompt:** Your task assignment prompt, provided by the Manager Agent via the User, should explicitly instruct you to log your work according to this guide upon completion. Refer back to it if unsure about task scope.
*   **Locate the Memory Bank:** The Manager Agent or User will specify the path to the correct `Memory_Bank.md` file (there might be multiple for large projects). If unsure, ask for clarification. Log entries should typically be appended to the end of the file.
*   **Use the Defined Format:** Structure your log entry precisely according to the Markdown format outlined in Section 3 below. Pay close attention to required fields and formatting.
*   **Be Clear and Concise:** Provide enough detail for the Manager Agent to understand *what* you did, *why* (linking to task requirements), *what* the outcome was, and any issues encountered. Avoid excessive verbosity but ensure all critical information is present.
*   **Use Exact Task Reference:** Copy the *exact* Task Identifier (e.g., `Phase 1 / Task A / Item 2`) from the `Implementation_Plan.md` or your assignment prompt into the `Task Reference` field.
*   **Code Changes:** When logging code modifications, use standard code blocks (` ` and ``` ```). Clearly indicate the file modified. Providing the changed snippets is often more useful than the entire file. Use diff-like syntax (`+` for additions, `-` for deletions) within the code block *if it adds clarity*, but do not use the specific `diff` language specifier in the code block fence (```diff).
*   **Errors and Blockers:** If the log is about an error or a blockage then clearly state any errors encountered or reasons why a task could not be completed. Provide relevant error messages or stack traces within the `Output/Result` or `Issues/Blockers` section. If blocked, explain the blocker clearly so the Manager Agent can understand the impediment.

## 3. Memory Bank Entry Format (Markdown)

Each log entry must be clearly separated from the previous one using a Markdown horizontal rule (`---`) and must follow this structure:

```markdown
---
**Agent:** [Your Assigned Agent ID, e.g., Agent B, Debugger 1 - Use the identifier assigned by the Manager Agent]
**Task Reference:** [Exact reference from Implementation_Plan.md, e.g., Task B, Sub-task 2 OR Phase 1 / Task C / Item 3]

**Summary:**
[A brief (1-2 sentence) high-level summary of the action taken or the result logged. What was the main point?]

**Details:**
[More detailed explanation of the work performed. Include:
    - Steps taken in logical order.
    - Rationale for significant decisions made during the task (especially if deviating or making choices).
    - Link actions back to specific requirements mentioned in the task description if applicable.
    - Observations or key findings.]

**Output/Result:**
[Include relevant outputs here. Use Markdown code blocks (```) for code snippets, terminal logs, or command outputs. Indicate file paths for created/modified files. For code changes, show the relevant snippet. Textual results or summaries can be placed directly. If output is large, consider saving to a separate file and referencing the path here.]
```[code snippet, command output, file path reference, or textual result]```

**Status:** [Choose ONE:
    - **Completed:** The assigned task/sub-task was finished successfully according to requirements.
    - **Partially Completed:** Significant progress made, but the task is not fully finished. Explain what remains in Details or Next Steps.
    - **Blocked:** Unable to proceed due to an external factor or prerequisite not being met. Explain in Issues/Blockers.
    - **Error:** An error occurred that prevented successful completion. Explain in Issues/Blockers and provide error details in Output/Result.
    - **Information Only:** Logging a finding, decision, or observation not tied to direct task completion.]

**Issues/Blockers:**
[Describe any issues encountered, errors that occurred (if not fully detailed in Output), or reasons for being blocked. Be specific and provide actionable information if possible. State "None" if no issues.]

**Next Steps (Optional):**
[Note any immediate follow-up actions required from you or expected from others, or the next logical task if partially completed. Useful for guiding the Manager Agent. Otherwise, state "None" or omit.]

```

## 4. Example Entry

```markdown
---
**Agent:** Agent A
**Task Reference:** Phase 1 / Task A / Item 2 (Implement Registration Endpoint)

**Summary:**
Implemented the backend API endpoint for user registration (`POST /api/users/register`), including input validation and password hashing.

**Details:**
- Created the API route `POST /api/users/register` in `routes/user.js` as specified.
- Added input validation using `express-validator` library to check for valid email format and minimum password length (8 characters), matching requirements.
- Integrated `bcrypt` library (cost factor 12) for secure password hashing before storage, as per security best practices.
- Wrote logic to store the new user record in the PostgreSQL database using the configured ORM (`User` model).
- Ensured only non-sensitive user data (ID, email, name) is returned upon successful registration to prevent data leakage. Tested endpoint locally with sample valid and invalid data.

**Output/Result:**
```javascript
// Snippet from routes/user.js showing validation and hashing logic
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password','Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  async (req, res) => {
    // ... validation error handling ...
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }
      user = new User({ name, email, password });
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Return JWT or user object (omitting password)
      // ... token generation logic ...
      res.json({ token }); // Example response
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
```

**Status:** Completed

**Issues/Blockers:**
None

**Next Steps (Optional):**
Ready to proceed with Task A / Item 3 (Implement Login Endpoint).
```

---