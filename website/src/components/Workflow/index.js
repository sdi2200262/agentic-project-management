import React from 'react';
import styles from './styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Phase from './Phase';
import { WORKFLOW_PHASES } from '../../constants/workflow';

/**
 * Workflow section component displaying APM's two-phase process
 * @returns {JSX.Element} Workflow component
 */
export default function Workflow() {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  const docsUrl = `${baseUrl.replace(/\/$/, '')}/docs`;

  return (
    <div className={styles.workflowSection}>
      <h2 className={styles.mainHeading}>Workflow</h2>
      <div className={styles.phasesContainer}>
        {WORKFLOW_PHASES.map((phase) => (
          <Phase
            key={phase.phaseNumber}
            {...phase}
            docsUrl={phase.isTaskLoopPhase ? docsUrl : undefined}
          />
        ))}
      </div>
    </div>
  );
}

