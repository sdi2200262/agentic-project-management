/**
 * Workflow phase configuration and data
 */

import React from 'react';
import styles from '../components/Workflow/styles.module.css';

/**
 * Setup phase description content
 */
export const SETUP_PHASE_DESCRIPTION = (
  <>
    <p className={styles.phaseDescription}>
      In the first phase, a <span className={styles.highlight}>Setup Agent</span> conducts comprehensive planning after collaborative project discovery. This phase ensures a solid architectural foundation before any code is written.
    </p>
    <p className={styles.phaseDescription}>
      It systematically breaks down your project into phases, tasks, and subtasks, creating a detailed <span className={styles.highlight}>Implementation Plan</span>. Tasks are grouped by domain (e.g., Frontend, Backend) and assigned to specialized <span className={styles.highlight}>Implementation Agents</span>.
    </p>
  </>
);

/**
 * Task loop phase description content
 */
export const TASK_LOOP_PHASE_DESCRIPTION = (
  <>
    <p className={styles.phaseDescription}>
      In the second phase, a <span className={styles.highlight}>Manager Agent</span> coordinates the project by assigning tasks and reviewing the workers' logs to determine next actions.
    </p>
    <p className={styles.phaseDescription}>
      <span className={styles.highlight}>Implementation Agents</span> receive their assigned tasks, carry out the work, and log progress to <span className={styles.highlight}>Memory</span>. This cycle repeats until project completion, with structured handovers ensuring continuity as context limits are reached.
    </p>
  </>
);

/**
 * Workflow phases configuration
 */
export const WORKFLOW_PHASES = [
  {
    phaseNumber: 1,
    title: 'The Setup Phase',
    description: SETUP_PHASE_DESCRIPTION,
    svgPath: '/img/apm-setup-phase-horizontal.svg',
    svgAlt: 'APM Setup Phase Workflow',
    isSetupPhase: true,
    isTaskLoopPhase: false,
  },
  {
    phaseNumber: 2,
    title: 'The Task Loop Phase',
    description: TASK_LOOP_PHASE_DESCRIPTION,
    svgPath: '/img/apm-task-loop-phase.svg',
    svgAlt: 'APM Task Loop Phase Workflow',
    isSetupPhase: false,
    isTaskLoopPhase: true,
  },
];
