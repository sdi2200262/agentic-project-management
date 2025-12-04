import React from 'react';

/**
 * Chevron down icon SVG component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Icon size (width and height)
 * @returns {JSX.Element} Chevron down icon
 */
export default function ChevronDownIcon({ className = '', size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
    </svg>
  );
}
