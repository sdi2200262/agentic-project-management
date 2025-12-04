import React from 'react';
import styles from './styles.module.css';
import { ICON_ASSISTANTS, ICONS_TO_DISPLAY } from '../../constants/assistants';

/**
 * Assistant icons grid component
 * @param {Object} props - Component props
 * @param {Function} props.onAssistantHover - Handler for assistant hover
 * @returns {JSX.Element} Assistant icons component
 */
export default function AssistantIcons({ onAssistantHover }) {
  return (
    <div className={styles.iconsSection}>
      {ICON_ASSISTANTS.slice(0, ICONS_TO_DISPLAY).map((assistant) => {
        const isOriginalColor = ['Claude Code', 'Cursor', 'Gemini CLI'].includes(assistant.name);
        return (
          <a
            key={assistant.name}
            href={assistant.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconItem}
            onMouseEnter={() => onAssistantHover(assistant.name)}
            onMouseLeave={() => onAssistantHover('Cursor')}
          >
            <img
              src={assistant.logo}
              alt={assistant.name}
              className={`${styles.iconImage} ${isOriginalColor ? styles.iconImageOriginal : ''}`}
            />
          </a>
        );
      })}
    </div>
  );
}
