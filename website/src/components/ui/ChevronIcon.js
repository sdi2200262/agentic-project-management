import React from 'react';

/**
 * Chevron icon SVG component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.expanded - Whether the chevron should point down (expanded)
 * @returns {JSX.Element} Chevron icon
 */
export default function ChevronIcon({ className = '', expanded = false }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 10L4 6h8l-4 4z"/>
    </svg>
  );
}
