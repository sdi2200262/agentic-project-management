import React from 'react';
import styles from './styles.module.css';

function PhaseBox({ phaseNumber }) {
  return (
    <div className={styles.phaseBox}>
      <div className={styles.phaseNumber}>{phaseNumber}</div>
    </div>
  );
}

function Phase({ phaseNumber, title, description, svgPath, svgAlt, isSetupPhase, isTaskLoopPhase }) {
  const isCentered = isSetupPhase || isTaskLoopPhase;
  const isReversed = isTaskLoopPhase;

  return (
    <div className={styles.phase}>
      <div className={`${styles.phaseContent} ${isCentered ? styles.phaseContentCentered : ''} ${isTaskLoopPhase ? styles.phaseContentTaskLoop : ''}`}>
        {isReversed ? (
          <>
            <div className={`${styles.phaseSvg} ${styles.phaseSvgRight}`}>
              <img 
                src={svgPath} 
                alt={svgAlt}
                className={`${styles.svgImage} ${styles.svgImageTaskLoop}`}
              />
            </div>
            <div className={`${styles.phaseTextColumn} ${styles.phaseTextColumnRight}`}>
              <div className={styles.phaseHeader}>
                <PhaseBox phaseNumber={phaseNumber} />
                <h3 className={styles.phaseTitle}>{title}</h3>
              </div>
              {description}
            </div>
          </>
        ) : (
          <>
            <div className={styles.phaseTextColumn}>
              <div className={styles.phaseHeader}>
                <PhaseBox phaseNumber={phaseNumber} />
                <h3 className={styles.phaseTitle}>{title}</h3>
              </div>
              {description}
            </div>
            <div className={styles.phaseSvg}>
              <img 
                src={svgPath} 
                alt={svgAlt}
                className={`${styles.svgImage} ${styles.svgImageSetup}`}
              />
            </div>
          </>
        )}
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
          title="The Setup Phase"
          description={
            <>
              <p className={styles.phaseDescription}>
                In the first phase, a <span className={styles.highlight}>Setup Agent</span> conducts comprehensive planning after collaborative project discovery. This phase ensures a solid architectural foundation before any code is written.
              </p>
              <p className={styles.phaseDescription}>
                It systematically breaks down your project into phases, tasks, and subtasks, creating a detailed <span className={styles.highlight}>Implementation Plan</span>. Tasks are grouped by domain (e.g., Frontend, Backend) and assigned to specialized <span className={styles.highlight}>Implementation Agents</span>.
              </p>
            </>
          }
          svgPath="/agentic-project-management/img/apm-setup-phase-horizontal.svg"
          svgAlt="APM Setup Phase Workflow"
          isSetupPhase={true}
        />
        
        <Phase
          phaseNumber={2}
          title="The Task Loop Phase"
          description={
            <>
              <p className={styles.phaseDescription}>
                In the second phase, a <span className={styles.highlight}>Manager Agent</span> coordinates the project by assigning tasks and reviewing the workers' logs to determine next actions.
              </p>
              <p className={styles.phaseDescription}>
                <span className={styles.highlight}>Implementation Agents</span> receive their assigned tasks, carry out the work, and log progress to <span className={styles.highlight}>Memory</span>. This cycle repeats until project completion, with structured handovers ensuring continuity as context limits are reached.
              </p>
            </>
          }
          svgPath="/agentic-project-management/img/apm-task-loop-phase.svg"
          svgAlt="APM Task Loop Phase Workflow"
          isTaskLoopPhase={true}
        />
      </div>
    </div>
  );
}

