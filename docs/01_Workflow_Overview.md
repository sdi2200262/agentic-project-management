# APM Workflow Overview

This document provides a visual overview of the key processes and interactions within the Agentic Project Management (APM) framework using Mermaid diagrams. It complements the detailed textual explanations found in other documentation files.

## Core APM Cycle

This flowchart illustrates the main life cycle of task management within an APM project, highlighting the collaboration between the User, Manager Agent, and Implementation Agents.

```mermaid
graph LR
    A[Manager: Prepares Task Prompt] --> B(User: Receives & Delivers Prompt);
    B --> C(Imp. Agent: Executes Task);
    C --> D(Imp. Agent: Reports Status/Output to User);
    D --> E(User: Confirms Log & Reports to Manager);
    E --> F(Manager: Evaluates Log/Work);
    F -- Task Successful/Next Task --> A;
    F -- Blocker/Issue Needs Re-prompt --> A;
    F -- Project/Phase Complete --> G[End/Next Phase];

    classDef manager fill:#87CEFA,stroke:#333,stroke-width:1.5px,color:#000; 
    classDef user fill:#F0E68C,stroke:#333,stroke-width:1.5px,color:#000; 
    classDef implementer fill:#00FA9A,stroke:#333,stroke-width:1.5px,color:#000; 

    class A,F manager;
    class B,E user;
    class C,D implementer;
    class G default;

    linkStyle default stroke:#ccc,stroke-width:1px;
```

**Explanation:**

1.  The **Manager Agent** prepares the `Task Assignment Prompt` (often with User input/review).
2.  The **User** receives this prompt and delivers it to the designated **Implementation Agent**.
3.  The **Implementation Agent** executes the assigned task.
4.  The **Implementation Agent** reports its status, any outputs, or blockers back to the **User**.
5.  The **User** confirms if/how to log the work and relays this information along with the agent's report to the **Manager Agent**.
6.  The **Manager Agent** evaluates the logged work and the reported status.
7.  Based on the evaluation, the cycle either loops back for the **Manager** to prepare the next task, addresses issues, or concludes the current phase/project.

## Handover Protocol Flow

This flowchart shows the high-level process for transferring context when an agent needs to be replaced (e.g., due to context limits).

```mermaid
graph LR
    H_A(Incumbent Agent) -- Needs Handover --> H_B{Prepare Handover Artifacts};
    H_B -- Handover_File.md --> H_C;
    H_B -- Handover_Prompt.md --> H_C;
    H_C(User Initiates New Agent) --> H_D(New Agent);
    H_D -- Reads Artifacts --> H_E{Confirm Understanding};
    H_E -- Ready --> H_F[Resume Tasks];

    style H_A fill:#87CEFA,stroke:#333,stroke-width:1px,color:#000; 
    style H_D fill:#00FA9A,stroke:#333,stroke-width:1px,color:#000; 
    style H_C fill:#F0E68C,stroke:#333,stroke-width:2px,color:#000; 
    style H_F fill:#C0C0C0,stroke:#333,stroke-width:1px,color:#000; 

    linkStyle default stroke:#ccc,stroke-width:1px;
```

**Explanation:**

1.  The **Incumbent Agent** (or User/Manager) identifies the need for a handover.
2.  The necessary handover artifacts (`Handover_File.md` for context, `Handover_Prompt.md` for initialization) are prepared (usually by the Manager or outgoing agent with help).
3.  The **User** starts the **New Agent** instance using the prepared artifacts.
4.  The **New Agent** processes the handover context.
5.  The **New Agent** confirms its understanding to the **User**.
6.  Once confirmed, the **New Agent** takes over and resumes the project tasks.


## Memory Bank Concept

This diagram shows how multiple agents contribute to and read from the central Memory Bank(s), inspired by the visual layout.

```mermaid
graph LR
    subgraph sg_agents [Agents]
        direction TB
        MA(Manager Agent)
        IA(Implementation Agent A)
        IB(Implementation Agent B / Specialized Agent X) 
        ID(...)
    end

    subgraph sg_context [Shared Context]
        MB[Memory_Bank.md]
    end

    MA -- Reads/Reviews --> MB;
    MB -- Provides Context --> MA;
    IA -- Logs --> MB;
    IB -- Logs --> MB;
    ID -- Logs --> MB;
    
    
    
    style MA fill:#87CEFA,stroke:#5F9EA0,color:#000; 
    style IA fill:#00FA9A,stroke:#3CB371,color:#000; 
    style IB fill:#00FA9A,stroke:#3CB371,color:#000; 
    style ID fill:#00FA9A,stroke:#3CB371,color:#000; 
    style MB fill:#F5DEB3,stroke:#BDB76B,stroke-width:2px,color:#000; 

    linkStyle default stroke:#ccc,stroke-width:1px;
```

**Explanation:**

*   All task-executing agents (**Implementation Agent A**, **Implementation Agent B / Specialized Agent X**, etc.) write their structured logs to the central **Memory Bank(s)**.
*   The **Manager Agent** reads from the **Memory Bank** to review work, track progress, and maintain overall project context.
*   The **Memory Bank** effectively provides context back to the **Manager Agent** for its coordination and planning functions.

These diagrams provide a simplified visual guide to understanding the flow and interactions within the APM framework. For detailed explanations of each component and procedure, please refer to the other documents in this `/docs` directory and the prompt guides in the `/prompts` directory.
