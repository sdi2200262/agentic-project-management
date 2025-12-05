import React from 'react';
import styles from './styles.module.css';
import { useHover } from '../../hooks/useHover';
import { DEFAULT_ASSISTANT } from '../../constants/assistants';
import TerminalReplica from './TerminalReplica';
import MobileAssistants from './MobileAssistants';
import AssistantIcons from './AssistantIcons';

/**
 * About section component showcasing APM features and supported assistants
 * @returns {JSX.Element} About component
 */
export default function About() {
  const [hoveredAssistant, hoverHandlers] = useHover(DEFAULT_ASSISTANT);

  return (
    <div className={styles.aboutSection}>
      <h2 className={styles.mainHeading}>About APM</h2>
      
      <div className={styles.contentGrid}>
        {/* Left Column: Text Content */}
        <div className={styles.textContent}>
          <h3 className={styles.subHeading}>
            Failing to plan, <span className={styles.highlight}>is planning to fail.</span>
          </h3>
          
          <br />
          
          <p className={styles.paragraph}>
            Agentic Project Management (APM) is an open-source framework that structures AI-driven software development. It turns a single, overloaded AI chat session into a coordinated <span className={styles.highlight}>team of specialized AI Agents</span>.<br />
          </p>
          <p className={styles.paragraph}>
            Building on the emerging practice of spec-driven workflows, APM establishes <a href="/docs/introduction"><span className={styles.highlight}>Agentic Spec-Driven Development</span></a>, adding efficient workload distribution and context management to ensure continuity for comlpex projects and long-running development sessions.
          </p>
          
          <div className={styles.integrationBox}>
            <h3 className={styles.subHeading}>
              <span className={styles.highlight}>Integrates Seamlessly</span> with your favourite AI IDEs.
            </h3>
            
            <br />

            <p className={styles.paragraph}>
              APM uses the <a href="https://www.npmjs.com/package/agentic-pm" target="_blank" rel="noopener noreferrer"><span className={styles.highlight}>agentic-pm</span></a> CLI to integrate with your favorite AI assistants. Run <span className={styles.highlight}>apm init</span> to set up optimized prompts and guides for your platform.
            </p>
            
            <AssistantIcons onAssistantHover={hoverHandlers.onMouseEnter} />
          </div>
        </div>

        {/* Right Column: CLI Replica (Desktop/Tablet only) */}
        <TerminalReplica
          hoveredAssistant={hoveredAssistant}
          onAssistantHover={hoverHandlers.onMouseEnter}
        />
      </div>

      {/* Mobile: Expandable Assistants List */}
      <MobileAssistants />
    </div>
  );
}

