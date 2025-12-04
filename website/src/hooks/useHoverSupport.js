import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting hover support and managing hover state
 * @returns {Object} Hover support state and handlers
 */
export function useHoverSupport() {
  const [supportsHover, setSupportsHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupportsHover(window.matchMedia('(hover: hover)').matches);
    }
  }, []);

  const hoverHandlers = {
    onMouseEnter: () => supportsHover && setIsHovered(true),
    onMouseLeave: () => supportsHover && setIsHovered(false),
  };

  return {
    supportsHover,
    isHovered,
    hoverHandlers,
  };
}
