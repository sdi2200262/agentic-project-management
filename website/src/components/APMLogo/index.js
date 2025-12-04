import React, {useState, useEffect} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

/**
 * APM Logo component for web display
 * Based on the ASCII art from utils.js, converted to React/SVG
 */
export default function APMLogo({ fontSize = 16, className = '' }) {
  // Safely get color mode - use state with default for SSR
  const [colorMode, setColorMode] = useState('light');
  
  useEffect(() => {
    // Read theme from DOM on client side
    if (ExecutionEnvironment.canUseDOM) {
      const getTheme = () => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      };
      
      setColorMode(getTheme());
      
      // Watch for theme changes
      const observer = new MutationObserver(() => {
        setColorMode(getTheme());
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  // Define colors for each letter based on theme
  const colorA = colorMode === 'dark' ? '#ffffff' : '#2C2C2C';  // white/dark for letter "A"
  const colorP = '#66B5B7';  // teal for letter "P"
  const colorM = '#66B5B7';  // teal for letter "M"
  
  const style = {
    fontFamily: 'monospace',
    fontSize: `${fontSize}px`,
    lineHeight: '1',
    whiteSpace: 'pre',
    display: 'inline-block',
    letterSpacing: '0',
  };

  return (
    <div className={`${styles.logo} ${className}`} style={style}>
      <div>
        <span> </span>
        <span> </span>
        <span> </span>
        <span> </span>
        <span style={{ color: colorA }}>█████╗</span>
        <span> </span>
        <span style={{ color: colorP }}>██████╗</span>
        <span> </span>
        <span style={{ color: colorM }}>███╗   ███╗</span>
      </div>
      <div>
        <span> </span>
        <span> </span>
        <span style={{ color: colorA }}> ██╔══██╗</span>
        <span style={{ color: colorP }}>██╔══██╗</span>
        <span style={{ color: colorM }}>████╗ ████║</span>
      </div>
      <div>
        <span style={{ color: colorP }}>█████████████████╔╝</span>
        <span style={{ color: colorM }}>██╔████╔██║</span>
      </div>
      <div>
        <span style={{ color: colorP }}>╚══</span>
        <span style={{ color: colorA }}>██</span>
        <span style={{ color: colorP }}>═══</span>
        <span style={{ color: colorA }}>██</span>
        <span style={{ color: colorP }}>═██╔═══╝ </span>
        <span style={{ color: colorM }}>██║╚██╔╝██║</span>
      </div>
      <div>
        <span> </span>
        <span> </span>
        <span> </span>
        <span style={{ color: colorA }}>██║  ██║</span>
        <span style={{ color: colorP }}>██║     </span>
        <span style={{ color: colorM }}>██║ ╚═╝ ██║</span>
      </div>
      <div>
        <span> </span>
        <span> </span>
        <span> </span>
        <span style={{ color: colorA }}>╚═╝  ╚═╝</span>
        <span style={{ color: colorP }}>╚═╝     </span>
        <span style={{ color: colorM }}>╚═╝     ╚═╝</span>
      </div>
    </div>
  );
}

