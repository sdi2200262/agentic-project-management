import React, { useState } from 'react';
import styles from './styles.module.css';
import { ChevronIcon } from '../ui';
import { SUPPORTED_ASSISTANTS, ASSISTANT_DATA } from '../../constants/assistants';

/**
 * Mobile assistants expandable list component
 * @returns {JSX.Element} Mobile assistants component
 */
export default function MobileAssistants() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={styles.mobileAssistants}>
      <button
        className={styles.expandButton}
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span>Supported Assistants</span>
        <ChevronIcon
          className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
        />
      </button>
      <div className={`${styles.assistantsListMobile} ${isExpanded ? styles.assistantsListMobileExpanded : styles.assistantsListMobileCollapsed}`}>
        {SUPPORTED_ASSISTANTS.map((assistant) => {
          const assistantInfo = ASSISTANT_DATA[assistant];
          return (
            <a
              key={assistant}
              href={assistantInfo?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.assistantItemMobile}
            >
              {assistant}
            </a>
          );
        })}
      </div>
    </div>
  );
}
