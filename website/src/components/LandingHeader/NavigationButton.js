import React from 'react';
import styles from './styles.module.css';

/**
 * Navigation button component for header navigation
 * @param {Object} props - Component props
 * @param {string} props.section - Section identifier
 * @param {string} props.label - Button label text
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onMouseEnter - Mouse enter handler
 * @param {Function} props.onMouseLeave - Mouse leave handler
 * @returns {JSX.Element} Navigation button
 */
export default function NavigationButton({
  section,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave
}) {
  return (
    <button
      onClick={() => onClick(section)}
      onMouseEnter={() => onMouseEnter(section)}
      onMouseLeave={onMouseLeave}
      className={styles.navButton}
    >
      {label}
    </button>
  );
}
