import React, { useState } from 'react';
import styles from './styles.module.css';
import APMLogo from '@site/src/components/APMLogo';
import packageJson from '../../../../package.json';

const ASSISTANT_DATA = {
  'Cursor': {
    url: 'https://cursor.com',
    description: 'Optimized for Cursor IDE'
  },
  'GitHub Copilot': {
    url: 'https://github.com/features/copilot',
    description: 'Optimized for GitHub Copilot'
  },
  'Claude Code': {
    url: 'https://www.claude.com/product/claude-code',
    description: 'Optimized for Claude Code'
  },
  'Gemini CLI': {
    url: 'https://geminicli.com',
    description: 'Optimized for Gemini CLI'
  },
  'Qwen Code': {
    url: 'https://qwenlm.github.io/qwen-code-docs/',
    description: 'Optimized for Qwen Code'
  },
  'opencode': {
    url: 'https://opencode.ai',
    description: 'Optimized for opencode'
  },
  'Windsurf': {
    url: 'https://windsurf.com',
    description: 'Optimized for Windsurf'
  },
  'Kilo Code': {
    url: 'https://kilocode.com',
    description: 'Optimized for Kilo Code'
  },
  'Auggie CLI': {
    url: 'https://docs.augmentcode.com/cli/overview',
    description: 'Optimized for Auggie CLI'
  },
  'Roo Code': {
    url: 'https://roocode.com',
    description: 'Optimized for Roo Code'
  }
};

const SUPPORTED_ASSISTANTS = [
  'Cursor',
  'GitHub Copilot',
  'Claude Code',
  'Gemini CLI',
  'Qwen Code',
  'opencode',
  'Windsurf',
  'Kilo Code',
  'Auggie CLI',
  'Roo Code'
];

const ICON_ASSISTANTS = [
  { name: 'Claude Code', logo: '/agentic-project-management/img/claude-logo.svg', url: ASSISTANT_DATA['Claude Code'].url },
  { name: 'Cursor', logo: '/agentic-project-management/img/cursor-logo.svg', url: ASSISTANT_DATA['Cursor'].url },
  { name: 'GitHub Copilot', logo: '/agentic-project-management/img/github-copilot-logo.svg', url: ASSISTANT_DATA['GitHub Copilot'].url },
  { name: 'Kilo Code', logo: '/agentic-project-management/img/kilo-code-logo.svg', url: ASSISTANT_DATA['Kilo Code'].url },
  { name: 'Windsurf', logo: '/agentic-project-management/img/windsurf-logo.svg', url: ASSISTANT_DATA['Windsurf'].url },
  { name: 'Gemini CLI', logo: '/agentic-project-management/img/gemini-logo.svg', url: ASSISTANT_DATA['Gemini CLI'].url }
];

const ICONS_TO_DISPLAY = 6;
const DEFAULT_ASSISTANT = 'Cursor';
const TERMINAL_BUTTON_COUNT = 3;

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredAssistant, setHoveredAssistant] = useState(DEFAULT_ASSISTANT);
  
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  const getDescription = () => {
    return ASSISTANT_DATA[hoveredAssistant]?.description || ASSISTANT_DATA[DEFAULT_ASSISTANT].description;
  };

  return (
    <div className={styles.aboutSection}>
      <h2 className={styles.mainHeading}>About APM</h2>
      
      <div className={styles.contentGrid}>
        {/* Left Column: Text Content */}
        <div className={styles.textContent}>
          <h3 className={styles.subHeading}>
            Failing to plan, <span className={styles.highlight}>is planning to fail.</span>
          </h3>
          
          <p className={styles.paragraph}>
            Agentic Project Management (APM) is an open-source framework that structures AI-driven software development. It turns a single, overloaded AI chat session into a coordinated <span className={styles.highlight}>team of specialized AI Agents</span>.<br />
          </p>
          <p className={styles.paragraph}>
            Building on the emerging practice of spec-driven workflows, APM establishes <span className={styles.highlight}>Agentic Spec-Driven Development</span>, adding efficient workload distribution and context management to ensure continuity for comlpex projects and long-running development sessions.
          </p>
          
          <h3 className={styles.subHeading} style={{ paddingTop: '1.25rem' }}>
            <span className={styles.highlight}>Integrates Seamlessly</span> with your favourite AI IDEs.
          </h3>
          
          <p className={styles.paragraph}>
            APM integrates with your favorite <span className={styles.highlight}>AI assistants</span> via the <span className={styles.highlight}>agentic-pm</span> CLI.<br />
            Run <span className={styles.highlight}>apm init</span> to set up optimized prompts and guides for your platform.
          </p>
          
          {/* Icons Section - 3x2 grid */}
          <div className={styles.iconsSection}>
            {ICON_ASSISTANTS.slice(0, ICONS_TO_DISPLAY).map((assistant) => {
              const isOriginalColor = ['Claude Code', 'Cursor', 'Gemini CLI'].includes(assistant.name);
              return (
                <a
                  key={assistant.name}
                  href={assistant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconItem}
                  onMouseEnter={() => setHoveredAssistant(assistant.name)}
                  onMouseLeave={() => setHoveredAssistant(DEFAULT_ASSISTANT)}
                >
                  <img 
                    src={assistant.logo} 
                    alt={assistant.name}
                    className={`${styles.iconImage} ${isOriginalColor ? styles.iconImageOriginal : ''}`}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: CLI Replica (Desktop/Tablet only) */}
        <div className={styles.cliReplica}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              {Array.from({ length: TERMINAL_BUTTON_COUNT }).map((_, i) => (
                <span key={i} className={styles.terminalButton}></span>
              ))}
            </div>
            {/*<span className={styles.terminalTitle}>agentic-pm</span>*/}
          </div>
          <div className={styles.terminalBody}>
            {/* Terminal prompt line */}
            <div className={styles.terminalPromptLine}> <span className={styles.highlight}>$</span> apm init</div>
            {/* APM Logo and Version - Centered */}
            <div className={styles.logoContainer}>
              <div className={styles.bannerLogo}>
                <APMLogo fontSize={12} />
              </div>
              <div className={styles.bannerVersion}>
                Agentic Project Management v{packageJson.version}
              </div>
            </div>
            
            {/* Assistants List */}
            <div className={styles.cliPrompt}>
              <span className={styles.promptQuestion}>?</span>
              <span className={styles.cliMessage}> Which AI assistant are you using?</span>
            </div>
            
            <div className={styles.assistantsList}>
              {SUPPORTED_ASSISTANTS.map((assistant) => {
                const isHovered = hoveredAssistant === assistant;
                const assistantInfo = ASSISTANT_DATA[assistant];
                return (
                  <a
                    key={assistant}
                    href={assistantInfo?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.assistantItem} ${isHovered ? styles.assistantItemHovered : ''}`}
                    onMouseEnter={() => setHoveredAssistant(assistant)}
                    onMouseLeave={() => setHoveredAssistant(DEFAULT_ASSISTANT)}
                  >
                    <span className={`${styles.assistantArrow} ${isHovered ? styles.assistantArrowVisible : ''}`}>{'>'}</span>
                    <span className={styles.assistantName}>{assistant}</span>
                  </a>
                );
              })}
            </div>
            
            <div className={styles.assistantDescription}>
              {getDescription()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Expandable Assistants List */}
      <div className={styles.mobileAssistants}>
        <button 
          className={styles.expandButton}
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <span>Supported Assistants</span>
          <svg 
            className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 10L4 6h8l-4 4z"/>
          </svg>
        </button>
        {isExpanded && (
          <div className={styles.assistantsListMobile}>
            {SUPPORTED_ASSISTANTS.map((assistant) => (
              <div key={assistant} className={styles.assistantItemMobile}>
                {assistant}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

