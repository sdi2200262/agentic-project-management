import React, {useState, useEffect} from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ColorModeToggle from '@theme/ColorModeToggle';
import APMLogo from '../APMLogo';
import styles from './styles.module.css';

export default function LandingHeader() {
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = React.useRef(null);
  const animationTimeoutRef = React.useRef(null);
  
  // Safely get color mode - use state with default for SSR
  const [colorMode, setColorModeState] = useState('light');
  
  useEffect(() => {
    // Read theme from DOM on client side
    if (ExecutionEnvironment.canUseDOM) {
      const getTheme = () => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      };
      
      setColorModeState(getTheme());
      
      // Watch for theme changes
      const observer = new MutationObserver(() => {
        setColorModeState(getTheme());
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  const setColorMode = (newMode) => {
    if (ExecutionEnvironment.canUseDOM) {
      document.documentElement.setAttribute('data-theme', newMode);
      setColorModeState(newMode);
      // Also update localStorage if available
      try {
        localStorage.setItem('theme', newMode);
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Don't update active section while animating from a click
      if (isAnimating) return;
      
      const scrollSections = ['home', 'about', 'workflow', 'contributors'];
      const scrollPosition = window.scrollY + 200; // Offset for header

      for (const sectionId of scrollSections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const {offsetTop, offsetHeight} = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAnimating]);

  // Initialize indicator after mount
  useEffect(() => {
    if (navRef.current && !isInitialized) {
      // Force a rerender after DOM is ready
      requestAnimationFrame(() => {
        setIsInitialized(true);
      });
    }
  }, [isInitialized]);

  const getIndicatorStyle = (section) => {
    if (!navRef.current || !isInitialized) return { width: 0, left: 0 };
    
    const buttons = Array.from(navRef.current.querySelectorAll('button'));
    const sectionMap = ['home', 'about', 'workflow', 'contributors', 'documentation'];
    const index = sectionMap.indexOf(section);
    
    if (index === -1 || !buttons[index]) return { width: 0, left: 0 };
    
    const button = buttons[index];
    return {
      width: button.offsetWidth,
      left: button.offsetLeft,
    };
  };

  // If animating (clicked), ignore hover. Otherwise allow hover to override active.
  const currentSection = isAnimating ? activeSection : (hoveredSection || activeSection);
  const indicatorStyle = getIndicatorStyle(currentSection);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigation = (target) => {
    // Start animation lock
    setIsAnimating(true);
    setHoveredSection(null); // Clear hover state on click
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Release animation lock after transition completes
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 400); // Match transition duration
    
    if (target === 'documentation') {
      const docsUrl = `${baseUrl.replace(/\/$/, '')}/docs`;
      history.push(docsUrl);
    } else {
      scrollToSection(target);
      setActiveSection(target);
    }
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className={`${styles.header} ${isMobileMenuOpen ? styles.headerExpanded : ''}`}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logoSection} onClick={() => handleNavigation('home')}>
          <APMLogo fontSize={6} className={styles.apmLogo} />
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className={`${styles.toggleArrow} ${isMobileMenuOpen ? styles.toggleArrowUp : ''}`}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>

        {/* Theme Toggle and GitHub Link (visible on mobile) */}
        <div className={styles.rightActionsMobile}>
          <div className={styles.colorModeToggleMobile}>
            <ColorModeToggle
              value={colorMode}
              onChange={setColorMode}
            />
          </div>
          <a
            href="https://github.com/sdi2200262/agentic-project-management"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLinkMobile}
            aria-label="GitHub repository"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>

        {/* Center wrapper for nav and github */}
        <div className={styles.centerWrapper}>
          {/* Navigation */}
          <nav ref={navRef} className={styles.nav}>
          <div 
            className={styles.navIndicator} 
            style={{
              width: indicatorStyle.width ? `${indicatorStyle.width}px` : '0px',
              left: indicatorStyle.left ? `${indicatorStyle.left}px` : '0px',
            }}
          />
          <button 
            onClick={() => handleNavigation('home')} 
            onMouseEnter={() => setHoveredSection('home')}
            onMouseLeave={() => setHoveredSection(null)}
            className={styles.navButton}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('about')} 
            onMouseEnter={() => setHoveredSection('about')}
            onMouseLeave={() => setHoveredSection(null)}
            className={styles.navButton}
          >
            About
          </button>
          <button 
            onClick={() => handleNavigation('workflow')} 
            onMouseEnter={() => setHoveredSection('workflow')}
            onMouseLeave={() => setHoveredSection(null)}
            className={styles.navButton}
          >
            Workflow
          </button>
          <button 
            onClick={() => handleNavigation('contributors')} 
            onMouseEnter={() => setHoveredSection('contributors')}
            onMouseLeave={() => setHoveredSection(null)}
            className={styles.navButton}
          >
            Contributors
          </button>
          <button 
            onClick={() => handleNavigation('documentation')} 
            onMouseEnter={() => setHoveredSection('documentation')}
            onMouseLeave={() => setHoveredSection(null)}
            className={styles.navButton}
          >
            Documentation
          </button>
        </nav>
        </div>

        {/* Theme Toggle and GitHub Link (desktop) */}
        <div className={styles.rightActions}>
          <div className={styles.colorModeToggle}>
            <ColorModeToggle
              value={colorMode}
              onChange={setColorMode}
            />
          </div>
          <a
            href="https://github.com/sdi2200262/agentic-project-management"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="GitHub repository"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        <button onClick={() => handleNavigation('home')} className={styles.mobileNavButton}>
          Home
        </button>
        <button onClick={() => handleNavigation('about')} className={styles.mobileNavButton}>
          About
        </button>
        <button onClick={() => handleNavigation('workflow')} className={styles.mobileNavButton}>
          Workflow
        </button>
        <button onClick={() => handleNavigation('contributors')} className={styles.mobileNavButton}>
          Contributors
        </button>
        <button onClick={() => handleNavigation('documentation')} className={styles.mobileNavButton}>
          Documentation
        </button>
        <div className={styles.mobileThemeToggle}>
          <ColorModeToggle
            value={colorMode}
            onChange={setColorMode}
          />
        </div>
      </div>
    </header>
  );
}
