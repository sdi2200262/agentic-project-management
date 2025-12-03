import React from 'react';
import styles from './styles.module.css';

// PhaseBox Component (modular within Workflow)
function PhaseBox({ phaseNumber }) {
  return (
    <div className={styles.phaseBox}>
      <div className={styles.phaseLabel}>PHASE</div>
      <div className={styles.phaseNumber}>{phaseNumber}</div>
    </div>
  );
}

// Phase Component
function Phase({ phaseNumber, title, description, svgPath, svgAlt }) {
  return (
    <div className={styles.phase}>
      <div className={styles.phaseHeader}>
        <PhaseBox phaseNumber={phaseNumber} />
        <h3 className={styles.phaseTitle}>{title}</h3>
      </div>
      
      <div className={styles.phaseContent}>
        <div className={styles.phaseDescription}>
          <p>{description}</p>
        </div>
        
        <div className={styles.phaseSvg}>
          <img 
            src={svgPath} 
            alt={svgAlt}
            className={styles.svgImage}
          />
        </div>
      </div>
    </div>
  );
}

export default function Workflow() {
  return (
    <div className={styles.workflowSection}>
      <h2 className={styles.mainHeading}>Workflow</h2>
      
      <div className={styles.phasesContainer}>
        <Phase
          phaseNumber={1}
          title="Setup"
          description="The Setup Agent conducts comprehensive project planning through structured discovery. It systematically breaks down your project into phases, tasks, and subtasks, creating a detailed Implementation Plan. Tasks are grouped by domain (e.g., Frontend, Backend) and assigned to specialized Implementation Agents. This phase ensures a solid architectural foundation before any code is written."
          svgPath="/agentic-project-management/img/apm-setup-phase-horizontal.svg"
          svgAlt="APM Setup Phase Workflow"
        />
        
        <Phase
          phaseNumber={2}
          title="Task Loop"
          description="The Manager Agent coordinates the project while Implementation Agents execute the work. The Manager creates Task Assignment Prompts that you deliver to Implementation Agents. After execution, Agents log their work to Memory, and the Manager reviews progress to determine next actions. This cycle repeats until the project is complete, with structured handover procedures maintaining continuity when context limits are reached."
          svgPath="/agentic-project-management/img/apm-task-loop-phase.svg"
          svgAlt="APM Task Loop Phase Workflow"
        />
      </div>
    </div>
  );
}

