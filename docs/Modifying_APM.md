# Modifying APM - APM v0.4

APM is designed to be highly customizable. Whether you're adapting prompts for specific workflows, adding new delegation guides, or integrating powerful MCP tools, this guide shows you how to tailor APM to your project's unique needs.

### Manager Agent Coordination Customization

You can adapt Manager Agent behavior for specific project management and coordination styles.

#### Example: Quality Gate Integration

**File**: `prompts/Manager_Agent/Manager_Agent_Initiation_Prompt.md`

**Suggested addition to Runtime Duties**:
```markdown
### Quality Gate Management
- **Review Checkpoints**: Include mandatory review points in Task Assignment Prompts for critical implementations
- **Cross-Agent Validation**: Require validation from multiple agents for architecture-level decisions
- **Quality Metrics**: Track and report on code quality, test coverage, and documentation completeness
- **Approval Workflows**: Implement approval requirements for tasks that affect system architecture or security
```

#### Example: Dependency-Aware Coordination

**Suggested addition to the Next Action Framework**:
```markdown
### Advanced Dependency Management
- **Blocking Detection**: Proactively identify and communicate when tasks are blocked by dependencies
- **Parallel Execution**: Identify opportunities for parallel task execution to optimize project timeline
- **Resource Conflicts**: Detect and resolve conflicts when multiple agents need the same resources
- **Dependency Updates**: Automatically update dependent tasks when producer tasks are modified
```

---

## GitHub Template Approach

The recommended way to customize APM is to use GitHub's "Use this template" feature rather than direct forking or cloning.

### Setting Up Your Custom APM

1. **Visit the APM Repository**: Go to [github.com/sdi2200262/agentic-project-management](https://github.com/sdi2200262/agentic-project-management)
2. **Create Template**: Click "Use this template" → "Create a new repository"
3. **Name Your Version**: Use descriptive names like `apm-for-web-development` or `company-apm-framework`
4. **Clone Your Template**: 
   ```bash
   git clone https://github.com/yourusername/your-apm-template
   cd your-apm-template
   ```

### Benefits of the Template Approach

**Independent Development**: Make changes without affecting the upstream APM project
**Version Control**: Track your customizations and maintain team consistency
**Easy Updates**: Selectively merge improvements from the main APM project
**Sharing**: Distribute your customized version within your organization or team

---

## Customizing Core Prompts

### Setup Agent Customization

The Setup Agent's Context Synthesis phase is highly customizable for domain-specific projects.

#### Example: Web Development Specialization

**File**: `prompts/Setup_Agent/Context_Synthesis_Prompt.md`

**Original Phase 2 Questions**:
```markdown
**Technical and Resource Constraints**  
- Required or prohibited tools, languages, frameworks, or platforms?
- External resources needed? (data sources, APIs, libraries, references)
```

**Example customization for Web Development**:
```markdown
**Web Development Technical Stack**
- Frontend framework preference? (React, Vue, Angular, vanilla JS)
- Backend technology stack? (Node.js, Python, Ruby, PHP, .NET)
- Database requirements? (PostgreSQL, MongoDB, Redis, etc.)
- Deployment platform? (Vercel, Netlify, AWS, Docker)
- CSS framework or styling approach? (Tailwind, Bootstrap, styled-components)
- State management needs? (Redux, Zustand, Context API)
- Authentication requirements? (Auth0, Firebase, custom JWT)
- API architecture? (REST, GraphQL, tRPC)
```

#### Example: Data Science Projects

**Example customization for Data Science**:
```markdown
**Data Science Technical Requirements**
- Data sources and formats? (CSV, JSON, APIs, databases, streaming)
- Analysis framework preference? (pandas, NumPy, Polars, R)
- Machine learning libraries? (scikit-learn, TensorFlow, PyTorch, XGBoost)
- Visualization requirements? (matplotlib, seaborn, plotly, D3.js)
- Deployment environment? (Jupyter, Streamlit, FastAPI, cloud platforms)
- Data storage and processing? (local files, cloud storage, data warehouses)
- Model performance requirements? (accuracy thresholds, real-time vs batch)
- Reproducibility needs? (version control, environment management, seed management)
```

### Implementation Agent Execution Customization

You can tailor Implementation Agent execution behavior for specific development workflows and interaction patterns.

#### Example: Verbose Execution Mode

**File**: `prompts/Implementation_Agent/Implementation_Agent_Initiation_Prompt.md`

**Proposed addition to the Interaction Model section**:
```markdown
### Verbose Execution Protocol
- **Step-by-Step Narration**: Explain each action before performing it during task execution
- **Decision Rationale**: Provide reasoning for technical choices and implementation approaches
- **Progress Updates**: Give detailed progress updates during long-running tasks
- **Error Explanation**: When encountering issues, explain the problem and potential solutions before proceeding
```

#### Example: Minimal Interaction Mode

**Proposed addition to the Operating Rules section**:
```markdown
### Streamlined Execution Protocol
- **Efficiency Focus**: Complete tasks with minimal conversation unless clarification is essential
- **Consolidated Reporting**: Provide comprehensive summaries rather than step-by-step updates
- **Assumption Documentation**: Document assumptions made during execution in Memory Logs
- **Error Recovery**: Attempt automatic error recovery before requesting user intervention
- **Step Combination Authority**: For multi-step tasks, combine adjacent steps when logically coherent to reduce execution time and token consumption
- **Judgment-Based Grouping**: Use professional judgment to group related steps that can be executed together without compromising quality
```

**Proposed addition to the Task Execution Patterns section**:
```markdown
### Enhanced Multi-Step Execution for Minimal Interaction
**Adaptive Step Combination**: 
- Analyze multi-step tasks and identify steps that can be logically combined
- Execute 2-3 related steps together when they share similar context or build upon each other
- Maintain quality standards while reducing the number of confirmation cycles
- Document step combinations in the Memory Log for transparency

**Example Step Combinations**:
- Combine "Setup configuration" + "Install dependencies" + "Initialize project structure"
- Merge "Write function" + "Add error handling" + "Write basic tests" for simple functions
- Group "Create API endpoint" + "Add validation" + "Update documentation" for straightforward APIs

**Combination Guidelines**:
- Only combine steps that don't require user input or design decisions
- Preserve step boundaries for complex or architecture-level implementations
- Fall back to individual steps if any combined execution encounters issues
```

#### Example: Collaborative Review Mode

**Proposed addition to the Interaction Model section**:
```markdown
### Collaborative Execution Protocol
- **Checkpoint Confirmations**: Request confirmation at key decision points during single-step tasks
- **Alternative Proposals**: When multiple implementation approaches exist, present options for user selection
- **Quality Gates**: Pause for review after completing critical components before proceeding
- **User Integration**: Actively seek user input on design decisions and implementation preferences
```

### Task Assignment Prompt Customization

Consider modifying how Manager Agents create Task Assignment Prompts to include domain-specific requirements and task content enhancements.

#### Example: Security-First Task Assignment

**File**: `prompts/guides/Task_Assignment_Guide.md`

**Recommended addition to Task Assignment Prompt Format → Detailed Instructions**:
```markdown
## Security Requirements (Include for all tasks involving data handling or user interaction)
- **Input Validation**: Implement comprehensive input validation and sanitization
- **Authentication Verification**: Ensure proper authentication checks for protected operations  
- **Data Protection**: Follow data protection protocols for sensitive information
- **Dependency Security**: Verify security of third-party libraries and dependencies
- **Error Handling**: Implement secure error handling that doesn't expose sensitive information
```

#### Example: Testing-Integrated Task Assignment

**Recommended addition to the Expected Output section**:
```markdown
## Testing Deliverables (Include for all implementation tasks)
- **Unit Tests**: Create comprehensive unit tests for all new functions and methods
- **Integration Tests**: Develop integration tests for external API interactions
- **Test Coverage**: Achieve minimum 80% code coverage for new implementations
- **Test Documentation**: Document test scenarios and expected behaviors
- **CI/CD Integration**: Ensure tests are compatible with existing CI/CD pipeline
```

#### Example: Documentation-Enhanced Task Assignment

**Recommended addition to the Detailed Instructions section**:
```markdown
## Documentation Requirements (Include for all tasks creating new functionality)
- **Inline Documentation**: Add comprehensive docstrings/comments for all functions and classes
- **API Documentation**: Update API documentation for any new endpoints or modifications
- **Usage Examples**: Provide clear usage examples in documentation
- **README Updates**: Update relevant README files with new functionality
- **Architecture Notes**: Document any architectural decisions or design patterns used
```

#### Example: Performance-Focused Task Assignment

**Recommended new section for the Task Assignment Prompt Format**:
```markdown
## Performance Requirements (Include for performance-critical tasks)
- **Performance Benchmarks**: Establish baseline performance metrics before implementation
- **Optimization Goals**: Define specific performance improvement targets
- **Resource Monitoring**: Monitor CPU, memory, and network usage during implementation
- **Scalability Considerations**: Design implementation to handle expected load increases
- **Performance Testing**: Include performance testing in implementation verification
```

#### Example: Accessibility-Focused Task Assignment

Recommended for frontend-related tasks:
```markdown
## Accessibility Requirements (Include for all UI/UX tasks)
- **WCAG Compliance**: Ensure implementation meets WCAG 2.1 AA standards
- **Keyboard Navigation**: Implement full keyboard navigation support
- **Screen Reader Compatibility**: Test with screen readers and provide appropriate ARIA labels
- **Color Contrast**: Verify color contrast meets accessibility standards
- **Alternative Text**: Provide meaningful alternative text for images and visual elements
```

---

## Creating Custom Delegation Guides

Beyond Debug and Research delegation, you can create specialized guides for context-intensive tasks that benefit from dedicated agent focus.

### Potential Delegation Guide Types

**Testing Delegation**: For comprehensive testing scenarios requiring specialized expertise and extensive test coverage.

**Security Review Delegation**: For thorough security analysis and vulnerability assessments that need deep, focused examination.

**Documentation Delegation**: For extensive documentation tasks requiring research, synthesis, and detailed technical writing.

**Data Analysis Delegation**: For complex data exploration and statistical analysis that would overwhelm Implementation Agent context.

**Performance Optimization Delegation**: For in-depth performance profiling and optimization work requiring iterative testing.

**Integration Testing Delegation**: For complex multi-system integration validation across services and external APIs.

### Contributing Delegation Guides

If you develop delegation guides that could benefit the broader APM community, consider submitting them as Pull Requests to the main repository. **See the README in `prompts/ad-hoc/` for detailed guidance and contribution guidelines.**

---

## MCP Tool Integration

Model Context Protocol (MCP) tools can significantly enhance APM agent capabilities by providing real-time access to external systems and up-to-date information.

### Recommended MCP Tools for APM

#### Development and Documentation

**Context7** - Up-to-date documentation integration
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

**Use Cases in APM**:
- **Setup Agent**: During Context Synthesis, get current documentation for specified tech stacks
- **Implementation Agents**: Access latest API documentation and code examples during task execution
- **Ad-Hoc Research Agents**: Gather current information about libraries and frameworks

**Example Integration in Context Synthesis**:
```markdown
**Enhanced Technical Discovery Questions**:
- What frameworks and libraries will you use? (I'll verify current documentation and best practices)
- Any specific versions or compatibility requirements? (I'll check for known issues and updates)
```

#### Project Management and Documentation

**Notion MCP** - Workspace integration
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx", 
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_TOKEN": "your-integration-token"
      }
    }
  }
}
```

**Use Cases**:
- **Manager Agent**: Create project documentation and track progress in Notion
- **Implementation Agents**: Update task status and document solutions
- **Setup Agent**: Store Implementation Plans and project requirements

**GitHub MCP** - Repository integration
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"], 
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**Use Cases**:
- **Setup Agent**: Analyze existing repository structure during Context Synthesis
- **Implementation Agents**: Create branches, commits, and pull requests
- **Manager Agent**: Track development progress and manage releases

#### Database and Data Management

**Database MCP Servers** - Multiple database support
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@executeautomation/database-server", "--postgresql", "--host", "localhost", "--database", "myproject"],
      "env": {
        "DB_USER": "username",
        "DB_PASSWORD": "password"
      }
    }
  }
}
```

**Use Cases**:
- **Implementation Agents**: Query database schema, test data operations
- **Ad-Hoc Debug Agents**: Analyze database performance and troubleshoot queries
- **Setup Agent**: Understand existing data structures during project discovery

#### Web and API Integration

**Browser Automation MCP** - Web interaction capabilities
```json
{
  "mcpServers": {
    "browserbase": {
      "command": "npx",
      "args": ["-y", "@browserbasehq/mcp-server-browserbase"],
      "env": {
        "BROWSERBASE_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Use Cases**:
- **Implementation Agents**: Test web applications, verify deployment
- **Ad-Hoc Testing Agents**: Perform end-to-end testing scenarios
- **Setup Agent**: Analyze existing web applications during discovery

### Integrating MCP Tools with APM Agents

#### Setup Agent Integration

**Enhanced Context Synthesis with MCP Tools**:

**File**: `prompts/Setup_Agent/Context_Synthesis_Prompt.md`

**Illustrative addition to Phase 2 questioning**:
```markdown
**Documentation and Verification Phase**:
With MCP tools available, I can:
- Verify current documentation for your specified tech stack (using Context7)
- Analyze your existing codebase structure (using GitHub MCP)
- Check database schemas and current data models (using Database MCP)
- Review current deployment and infrastructure setup

Would you like me to analyze any existing systems or verify documentation for your project requirements?
```

#### Implementation Agent Integration

**File**: `prompts/Implementation_Agent/Implementation_Agent_Initiation_Prompt.md`

**Illustrative addition to core responsibilities**:
```markdown
### MCP Tool Utilization
When MCP tools are available, use them strategically to enhance task execution:

**Documentation Access**: Use Context7 to get current API documentation and code examples
**Repository Operations**: Use GitHub MCP for branch creation, commits, and pull requests  
**Database Operations**: Use Database MCP for schema queries and data operations
**Web Testing**: Use Browser MCP for application testing and verification
**Project Documentation**: Use Notion MCP for task documentation and progress tracking

**MCP Usage Protocol**: 
- Check available MCP tools at task start
- Use tools to gather current information before implementation
- Document tool usage and results in Memory Logs
```

#### Manager Agent Integration

**File**: `prompts/Manager_Agent/Manager_Agent_Initiation_Prompt.md`

**Illustrative addition to runtime duties**:
```markdown
### MCP-Enhanced Coordination
When MCP tools are available, leverage them for enhanced project coordination:

**Project Tracking**: Use Notion MCP to maintain project documentation and progress tracking
**Code Coordination**: Use GitHub MCP to manage repository state and coordinate across Implementation Agents
**Data Management**: Use Database MCP to coordinate data-related tasks and dependencies
**Documentation Verification**: Use Context7 to verify current best practices in Task Assignment Prompts
```

### Custom MCP Tool Configuration Examples

#### Multi-Environment Database Setup
```json
{
  "mcpServers": {
    "dev-db": {
      "command": "npx",
      "args": ["-y", "@executeautomation/database-server", "--postgresql", "--host", "dev-db.company.com", "--database", "myapp_dev"]
    },
    "staging-db": {
      "command": "npx", 
      "args": ["-y", "@executeautomation/database-server", "--postgresql", "--host", "staging-db.company.com", "--database", "myapp_staging"]
    }
  }
}
```

#### Full Documentation Stack
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {"NOTION_API_TOKEN": "your-token"}
    },
    "github": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"}
    }
  }
}
```

---

## Domain-Specific Customization Examples

### Mobile Development APM

**Possible tailoring for React Native/Flutter projects**:

**Possible Context Synthesis additions**:
```markdown
**Mobile Development Requirements**:
- Target platforms? (iOS, Android, both)
- Development framework? (React Native, Flutter, native)
- Device testing strategy? (simulators, physical devices, cloud testing)
- App store deployment requirements? (certificates, signing, store policies)
- Performance requirements? (startup time, memory usage, battery life)
- Offline functionality needs? (local storage, sync strategies)
```

**Possible Implementation Agent specialization**:
```markdown
### Mobile Development Protocol
- **Platform Testing**: Test on both iOS and Android simulators for cross-platform apps
- **Performance Monitoring**: Monitor app performance and memory usage during development
- **Device Compatibility**: Consider different screen sizes and device capabilities
- **App Store Guidelines**: Follow platform-specific guidelines for app store submission
```

### Machine Learning APM

**Possible Context Synthesis prompts for ML projects**:
```markdown
**Machine Learning Project Requirements**:
- Problem type? (classification, regression, clustering, NLP, computer vision)
- Data availability and quality? (size, cleanliness, labeling requirements)
- Model complexity requirements? (interpretability vs accuracy trade-offs)
- Training infrastructure? (local, cloud, distributed training needs)
- Deployment requirements? (real-time inference, batch processing, edge deployment)
- Monitoring and maintenance? (model drift detection, retraining pipelines)
```

### Enterprise Integration APM

**Possible Manager Agent customization for enterprise environments**:
```markdown
### Enterprise Coordination Protocol
- **Compliance Requirements**: Ensure all tasks meet enterprise security and compliance standards
- **Change Management**: Follow enterprise change management processes for deployments
- **Documentation Standards**: Maintain documentation according to enterprise standards
- **Security Reviews**: Include security review checkpoints for sensitive implementations
```

---

## Best Practices for APM Customization

**Documentation**: Consider creating a `CUSTOMIZATIONS.md` file documenting your changes, modified files, added files, and MCP integrations. This helps team members understand your customizations and facilitates maintenance.

**Testing**: It can be helpful to test your modifications with sample projects before deploying custom APM. You might run through Context Synthesis, execute Implementation Agent tasks, verify delegation guides, and ensure MCP integrations function correctly.

**Version Management**: Consider using descriptive commit messages for your modifications and tagging stable versions of your customizations for easier rollback and team coordination.

**Team Distribution**: You might share your customized APM template with team members by pushing to a shared repository and documenting setup instructions for consistent team usage.

---

**APM's modular design makes it highly adaptable to your specific workflow needs. Whether you're customizing prompts for domain expertise, adding new delegation capabilities, or integrating powerful MCP tools, these modifications can significantly enhance your development productivity and project success.**