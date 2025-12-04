import { useState, useEffect } from 'react';
import { NAVIGATION_SECTIONS, SCROLL_OFFSET, MOBILE_BREAKPOINT } from '../constants/navigation';

/**
 * Custom hook for managing scroll-based navigation indicator
 * @param {boolean} isAnimating - Whether navigation animation is in progress
 * @returns {string} Current active section based on scroll position
 */
export function useScrollIndicator(isAnimating) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Disable scroll indicator on mobile/tablet since nav is hidden
    const isMobileOrTablet = () => window.innerWidth <= MOBILE_BREAKPOINT;

    if (isMobileOrTablet()) {
      return; // Skip scroll handler on mobile/tablet
    }

    let ticking = false; // Flag to prevent multiple queued callbacks

    const handleScroll = () => {
      // Don't update active section while animating from a click
      if (isAnimating) {
        ticking = false;
        return;
      }

      const scrollPosition = window.scrollY + SCROLL_OFFSET;

      for (const sectionId of NAVIGATION_SECTIONS.slice(0, -1)) { // Exclude 'documentation'
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      ticking = false; // Reset flag after processing
    };

    const onScroll = () => {
      if (!ticking) {
        // Queue the handler to run on the next animation frame
        requestAnimationFrame(handleScroll);
        ticking = true; // Set flag to prevent queuing multiple callbacks
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', onScroll);
  }, [isAnimating]);

  return activeSection;
}
