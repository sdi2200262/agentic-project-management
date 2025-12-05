import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ColorModeToggle from '@theme/ColorModeToggle';
import APMLogo from '../APMLogo';
import { GitHubIcon, ChevronDownIcon } from '../ui';
import { useScrollIndicator } from '../../hooks/useScrollIndicator';
import { NAVIGATION_SECTIONS, ANIMATION_DURATION, GITHUB_URL } from '../../constants/navigation';
import NavigationButton from './NavigationButton';
import styles from './styles.module.css';

/**
 * Landing page header component with navigation and theme controls
 * @returns {JSX.Element} Landing header component
 */
export default function LandingHeader() {
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  // State management
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const navRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  // Custom hooks
  const activeSection = useScrollIndicator(isAnimating);

  // Theme management - safely get color mode for SSR
  const [colorMode, setColorModeState] = useState('light');

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const getTheme = () => document.documentElement.getAttribute('data-theme') || 'light';

      setColorModeState(getTheme());

      // Watch for theme changes
      const observer = new MutationObserver(() => setColorModeState(getTheme()));
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });

      return () => observer.disconnect();
    }
  }, []);

  const setColorMode = useCallback((newMode) => {
    if (ExecutionEnvironment.canUseDOM) {
      document.documentElement.setAttribute('data-theme', newMode);
      setColorModeState(newMode);
      try {
        localStorage.setItem('theme', newMode);
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, []);

  // Initialize indicator after mount
  useEffect(() => {
    if (navRef.current && !isInitialized) {
      requestAnimationFrame(() => setIsInitialized(true));
    }
  }, [isInitialized]);

  // Calculate indicator position
  const getIndicatorStyle = useCallback((section) => {
    if (!navRef.current || !isInitialized) return { width: 0, left: 0 };

    const buttons = Array.from(navRef.current.querySelectorAll('button'));
    const index = NAVIGATION_SECTIONS.indexOf(section);

    if (index === -1 || !buttons[index]) return { width: 0, left: 0 };

    const button = buttons[index];
    return {
      width: button.offsetWidth,
      left: button.offsetLeft,
    };
  }, [isInitialized]);

  // Current section for indicator (prioritize active over hover during animation)
  const currentSection = isAnimating ? activeSection : (hoveredSection || activeSection);
  const indicatorStyle = getIndicatorStyle(currentSection);

  // Navigation handlers
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleNavigation = useCallback((target) => {
    setIsAnimating(true);
    setHoveredSection(null);
    setIsMobileMenuOpen(false);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);

    if (target === 'documentation') {
      const docsUrl = `${baseUrl.replace(/\/$/, '')}/docs`;
      history.push(docsUrl);
    } else {
      scrollToSection(target);
    }
  }, [baseUrl, history, scrollToSection]);

  // Cleanup timeout on unmount
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
          <ChevronDownIcon
            className={`${styles.toggleArrow} ${isMobileMenuOpen ? styles.toggleArrowUp : ''}`}
          />
        </button>

        {/* GitHub Link (visible on mobile in retracted header) */}
        <div className={styles.rightActionsMobile}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLinkMobile}
            aria-label="GitHub repository"
          >
            <GitHubIcon size={28} />
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
            <NavigationButton
              section="home"
              label="Home"
              onClick={handleNavigation}
              onMouseEnter={setHoveredSection}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <NavigationButton
              section="about"
              label="About"
              onClick={handleNavigation}
              onMouseEnter={setHoveredSection}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <NavigationButton
              section="workflow"
              label="Workflow"
              onClick={handleNavigation}
              onMouseEnter={setHoveredSection}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <NavigationButton
              section="contributors"
              label="Contributors"
              onClick={handleNavigation}
              onMouseEnter={setHoveredSection}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <NavigationButton
              section="documentation"
              label="Documentation"
              onClick={handleNavigation}
              onMouseEnter={setHoveredSection}
              onMouseLeave={() => setHoveredSection(null)}
            />
          </nav>
        </div>

        {/* GitHub Link and Theme Toggle (desktop) */}
        <div className={styles.rightActions}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="GitHub repository"
          >
            <GitHubIcon size={32} />
          </a>
          <div className={styles.colorModeToggle}>
            <ColorModeToggle
              value={colorMode}
              onChange={setColorMode}
            />
          </div>
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
