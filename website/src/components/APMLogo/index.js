import React from 'react';
import styles from './styles.module.css';

/**
 * APM Logo component for web display
 * Based on the ASCII art from utils.js, converted to React/SVG
 */
export default function APMLogo({ fontSize = 16, className = '' }) {
  // Define colors for each letter
  const colorA = '#ffffff';  // white for letter "A"
  const colorP = '#00d9ff';  // cyan for letter "P" 
  const colorM = '#00d9ff';  // cyan for letter "M"
  
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

