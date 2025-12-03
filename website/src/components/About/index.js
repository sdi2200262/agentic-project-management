import React, { useState } from 'react';
import styles from './styles.module.css';

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
  { name: 'Claude Code', logo: '/agentic-project-management/img/claude-logo.svg' },
  { name: 'Cursor', logo: '/agentic-project-management/img/cursor-logo.svg' },
  { name: 'GitHub Copilot', logo: '/agentic-project-management/img/github-copilot-logo.svg' },
  { name: 'Gemini CLI', logo: '/agentic-project-management/img/gemini-logo.svg' },
  { name: 'Windsurf', logo: '/agentic-project-management/img/windsurf-logo.svg' },
  { name: 'Kilo Code', logo: '/agentic-project-management/img/kilo-code-logo.svg' }
];

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);

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
            Agentic Project Management (APM) is an open-source framework that structures AI-driven software development. 
            It transforms a single, overloaded AI chat session into a coordinated team of specialized <span className={styles.highlight}>AI Agents</span>, 
            enabling complex project execution using AI Assistants. Building on the emerging practice of <span className={styles.highlight}>Agentic Spec-Driven Development</span>, 
            APM adds structured workload distribution and management across a team of specialized Agents.
          </p>
          
          <h3 className={styles.subHeading}>
            <span className={styles.highlight}>Integrates Seamlessly</span> with your favourite AI IDEs.
          </h3>
          
          <p className={styles.paragraph}>
            APM works with any <span className={styles.highlight}>AI assistant</span> that supports chat-based interactions. 
            The framework provides specialized prompts and guides optimized for each platform, ensuring smooth integration 
            with your existing development workflow.
          </p>
        </div>

        {/* Right Column: CLI Replica (Desktop/Tablet only) */}
        <div className={styles.cliReplica}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              <span className={styles.terminalButton}></span>
              <span className={styles.terminalButton}></span>
              <span className={styles.terminalButton}></span>
            </div>
            <span className={styles.terminalTitle}>apm init</span>
          </div>
          <div className={styles.terminalBody}>
            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptText}> apm init</span>
            </div>
            <div className={styles.terminalOutput}>
              <div className={styles.cliMessage}>Which AI assistant are you using?</div>
              <div className={styles.assistantsList}>
                {SUPPORTED_ASSISTANTS.map((assistant, index) => (
                  <div key={assistant} className={styles.assistantItem}>
                    <span className={styles.assistantNumber}>{index + 1}</span>
                    <span className={styles.assistantName}>{assistant}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icons Section (Desktop/Tablet: 6 icons, Mobile: 3 icons) */}
      <div className={styles.iconsSection}>
        {ICON_ASSISTANTS.slice(0, 3).map((assistant) => (
          <div key={assistant.name} className={styles.iconItem}>
            <img 
              src={assistant.logo} 
              alt={assistant.name}
              className={styles.iconImage}
            />
          </div>
        ))}
        {ICON_ASSISTANTS.slice(3, 6).map((assistant) => (
          <div key={assistant.name} className={styles.iconItem}>
            <img 
              src={assistant.logo} 
              alt={assistant.name}
              className={styles.iconImage}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Expandable Assistants List */}
      <div className={styles.mobileAssistants}>
        <button 
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span>Supported Assistants</span>
          <svg 
            className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
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

