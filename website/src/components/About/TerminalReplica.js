import React from 'react';
import styles from './styles.module.css';
import APMLogo from '@site/src/components/APMLogo';
import packageJson from '../../../../package.json';
import { useHover } from '../../hooks/useHover';
import {
  SUPPORTED_ASSISTANTS,
  ASSISTANT_DATA,
  DEFAULT_ASSISTANT
} from '../../constants/assistants';

/**
 * Terminal replica component simulating APM CLI interface
 * @param {Object} props - Component props
 * @param {string} props.hoveredAssistant - Currently hovered assistant
 * @param {Function} props.onAssistantHover - Handler for assistant hover
 * @returns {JSX.Element} Terminal replica component
 */
export default function TerminalReplica({ hoveredAssistant, onAssistantHover }) {
  const getDescription = () => {
    return ASSISTANT_DATA[hoveredAssistant]?.description || ASSISTANT_DATA[DEFAULT_ASSISTANT].description;
  };

  return (
    <div className={styles.cliReplica}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={styles.terminalButton}></span>
          ))}
        </div>
      </div>
      <div className={styles.terminalBody}>
        {/* Terminal prompt line */}
        <div className={styles.terminalPromptLine}>
          <span className={styles.highlight}>$</span> npm install -g agentic-pm
        </div>
        <div className={styles.terminalPromptLine}>added 65 packages in 3s</div>
        <div className={styles.terminalPromptLine}>
          <span className={styles.highlight}>$</span> apm init
        </div>
        {/* APM Logo and Version - Centered */}
        <div className={styles.logoContainer}>
          <div className={styles.bannerLogo}>
            <APMLogo fontSize={12} />
          </div>
          <div className={styles.bannerVersion}>
            Agentic Project Management v{packageJson.version}
          </div>
        </div>

        {/* Assistants List */}
        <div className={styles.cliPrompt}>
          <span className={styles.promptQuestion}>?</span>
          <span className={styles.cliMessage}> Which AI assistant are you using?</span>
        </div>

        <div className={styles.assistantsList}>
          {SUPPORTED_ASSISTANTS.map((assistant) => {
            const isHovered = hoveredAssistant === assistant;
            const assistantInfo = ASSISTANT_DATA[assistant];
            return (
              <a
                key={assistant}
                href={assistantInfo?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.assistantItem} ${isHovered ? styles.assistantItemHovered : ''}`}
                onMouseEnter={() => onAssistantHover(assistant)}
                onMouseLeave={() => onAssistantHover(DEFAULT_ASSISTANT)}
              >
                <span className={`${styles.assistantArrow} ${isHovered ? styles.assistantArrowVisible : ''}`}>{'>'}</span>
                <span className={styles.assistantName}>{assistant}</span>
              </a>
            );
          })}
        </div>

        <div className={styles.assistantDescription}>
          {getDescription()}
        </div>
      </div>
    </div>
  );
}
