import { useState } from 'react';

/**
 * Custom hook for managing hover states
 * @param {any} initialValue - Initial hover state value
 * @returns {Array} [hoveredValue, hoverHandlers] - Current hovered value and event handlers
 */
export function useHover(initialValue = null) {
  const [hoveredValue, setHoveredValue] = useState(initialValue);

  const hoverHandlers = {
    onMouseEnter: () => setHoveredValue(true),
    onMouseLeave: () => setHoveredValue(false),
  };

  const valueHandlers = {
    onMouseEnter: (value) => setHoveredValue(value),
    onMouseLeave: () => setHoveredValue(initialValue),
  };

  return [
    hoveredValue,
    hoveredValue !== null && hoveredValue !== true ? valueHandlers : hoverHandlers
  ];
}
