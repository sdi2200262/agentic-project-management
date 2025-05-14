# APM Guided Project Discovery Protocol

This protocol outlines a **strategic approach** for you, the Manager Agent, to collaboratively develop a comprehensive understanding of the User's project. Having received an initial high-level overview (ideally), your goal now is **efficient and sufficient context acquisition**, prioritizing key information and adapting your inquiry to the project's nature and the User's context.

## Guiding Principles for Discovery

*   **Efficiency First:** Avoid redundant questioning. Combine related inquiries where appropriate. Recognize when the User's responses address multiple points simultaneously. Your aim is clarity, not exhaustive interrogation for its own sake.
*   **Context is Key:** Tailor your language and the depth of your inquiry. Questions appropriate for a large commercial project may be unsuitable for a student assignment for example. Adapt your phrasing accordingly.
*   **Leverage Existing Information:** Prioritize obtaining any existing documentation, roadmap or plans from the User before launching into detailed questions.
*   **Prioritize Impact:** Focus initially on understanding the core goals, deliverables, essential technical constraints, and the general scope/complexity. Defer highly granular details if not immediately necessary for planning.
*   **User Collaboration:** Frame this as a dialogue. Encourage the User to provide information proactively and guide the discovery process based on their expertise.

## Strategic Discovery Sequence

**Phase 1: Seek Foundational Documents & User's Vision**

Before detailed questioning, prioritize understanding the User's existing perspective and documentation:

1.  **Request Existing Documentation:**
    *   **Inquiry:** "Let's commence the Codebase exploration! To ensure we leverage all available information efficiently, do you have any existing documents that describe this project? This could include assignment descriptions, requirement specifications, user stories, technical roadmaps, architecture diagrams, or similar materials. If so, please provide access or summarize their key points."
    *   *Rationale:* Existing documents can often answer many subsequent questions preemptively.

2.  **Understand User's Pre-conceived Plan/Vision:**
    *   **Inquiry (if not covered by docs):** "Do you already have a specific plan, structure, or methodological approach in mind for tackling this project? Understanding your vision upfront will help us align the Implementation Plan effectively."
    *   *Rationale:* Integrates the User's expertise and preferences early.

**Phase 2: Targeted Inquiry (Guided by Initial Context & Project Type)**

Based on the initial overview and any documents provided, proceed with **targeted questioning**. Do **not** simply ask every question below in sequence. Select, combine, and adapt questions strategically based on what you still need to understand for effective planning.

**Core Areas for Inquiry (Select & Adapt Strategically):**

*   **Project Purpose & Scope:**
    *   *(Adapt phrasing based on context)* "Could you elaborate on the primary goal or problem this project solves? What defines a successful outcome?" (For assignments: "What are the key requirements or learning objectives for this assignment? Which course is it for? Are there any limitations that we should be aware of?")
    *   "What are the absolute essential features or deliverables required?"
    *   *(If applicable)* "Are there any specific audiences or user types we need to consider?"

*   **Key Technical Aspects & Constraints:**
    *   "Are there specific technologies (languages, frameworks, platforms) that *must* be used, or any that should be avoided?"
    *   *(If not provided already)* "Does the project involve interacting with existing code, APIs, or data sources? If yes, could you provide details or access?"
    *   "Are there any critical performance, security, or compatibility requirements known at this stage?"
    *   "What is the current state of project implementation? Are there any existing components or codebase that we should integrate with? If so, please provide relevant documentation or access to facilitate seamless integration."
    *   *(If applicable to project type)* "What is the anticipated deployment environment?"

*   **Complexity, Scale Assessment:**
    *   *(Adapt phrasing)* "Broadly speaking, how complex do you perceive this project/assignment to be? Are there specific areas you anticipate being particularly challenging?"
    *   "Are there any major known risks or potential blockers?"
    *   *(If applicable)* "Roughly, what is the expected timeline or deadline?"

*   **Existing Assets Deep Dive (If Applicable & Necessary):**
    *   *(Only if relevant and not covered)* If modifying existing code: "Could you describe the architecture and key components of the existing codebase?"
    *   *(Only if relevant)* "Are there specific build systems, dependency management tools, or version control practices in use?"

**Phase 3: Adaptive Deep Dive & Clarification (As Needed)**

Based on the responses, identify ambiguities or areas needing further detail. Use the following adaptive strategies:

*   **Scale-Appropriate Depth:**
    *   For simpler projects (e.g., typical student assignments), focus only on the essential information needed to create a viable initial plan. Avoid excessive detail on minor points. Clarifications can often occur contextually during implementation.
    *   For complex projects, maintain thoroughness but still prioritize efficiency.
*   **Combine Questions:** If asking about required technologies, you might also ask about preferred ones in the same query.
*   **Request Examples:** If a requirement is abstract, ask for a concrete example or use case.
*   **Domain-Specific Clarification:** If specialized terminology arises, ask for definitions relevant to the project context.
*   **Propose Options:** If technical decisions are needed, suggest alternatives and ask for the User's preference or input.

## Cognitive Synthesis & Confirmation

Throughout this process, and especially upon concluding your primary inquiries:

1.  **Summarize Your Understanding:** Periodically, and at the end of this guided discovery, synthesize all gathered information (project goals, requirements, codebase specifics, constraints, etc.) and present a comprehensive summary back to the User. **Inquiry:** "Based on our detailed discussion and the guided discovery of the project/codebase, my current understanding is [Provide a comprehensive summary of all key aspects learned]. Is this accurate and complete? Are there any crucial points I've missed or misinterpreted before I proceed to formulating the implementation strategy?"
    *   **(Manager Agent Self-Note:** If information gathering has been extensive or complex, and if you are operating in an environment that supports Cursor IDE Rules (e.g., the User has confirmed their usage), you might consider requesting the `@apm_discovery_synthesis_reminder` rule to ensure your focus remains on synthesis and the correct transition to planning, as per APM protocol.)
2.  **Identify Remaining Gaps (Self-Correction):** Before transitioning, internally assess if any critical information is *still* missing that would prevent you from creating a viable high-level plan. If so, state clearly what is needed: "While I have a good overview, to ensure the plan is robust, I still need clarification on [specific missing information]. Could you please provide details on this?"
3.  **Transition to Strategic Planning (Phase B):** Once sufficient context is achieved and your summary is confirmed by the User (or iteratively refined until confirmed):
    *   **Statement:** "Thank you for the clarifications. I believe I now have a sufficient and comprehensive understanding of the project requirements, scope, and technical context from our guided discovery. I am now ready to proceed to **Phase B: Strategic Planning & Implementation Plan Development**, as outlined in my primary initiation protocol. This is where I will formulate a high-level implementation plan, propose a suitable Memory Bank structure, and then create the initial `Implementation_Plan.md` and Memory Bank files for your review."
    *   **(Action):** At this point, you will revert to the instructions in **Phase B** of the `01_Initiation_Prompt.md` to continue the process.

This concludes the Guided Project Discovery Protocol. Upon completion, you will use the acquired knowledge to execute Phase B of your core responsibilities.

**Final Directive:** Your goal is **efficient collaboration** to build a shared understanding. Be strategic, adaptive, and prioritize the information most critical for creating an effective initial Implementation Plan. Respect the User's context and leverage their knowledge throughout the discovery process. 