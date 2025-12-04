import React from 'react';

/**
 * Copy page icon SVG component
 * @param {Object} props - Component props
 * @param {boolean} props.copied - Whether content has been copied
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Copy page icon
 */
export default function CopyPageIcon({ copied = false, className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {copied ? (
        <polyline points="20 6 9 17 4 12" />
      ) : (
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
    </svg>
  );
}
