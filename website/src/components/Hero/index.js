import React from 'react';
import styles from './styles.module.css';
import packageJson from '../../../../package.json';
import { useStats } from '@site/src/hooks/useStats';
import { formatNumber } from '@site/src/utils/format';

export default function Hero() {
  const [copied, setCopied] = React.useState(false);
  const { githubStars, npmDownloads, isLoading } = useStats();

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g agentic-pm');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.heroWrapper}>
      <svg className={styles.blob} viewBox="0 0 1224 644" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blobPattern" x="0" y="0" width="100%" height="100%" patternUnits="objectBoundingBox">
            <image 
            href="/agentic-project-management/img/blobimg.png" 
            x="0" 
            y="0" 
            width="1224" 
            height="644" 
            preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <path
            fill="url(#blobPattern)"
            d="M34.9823 477.878C-99.5032 325.878 181.906 48.6843 489.906 8.18429C962.906 -40.3157 1113.71 155.354 1143.41 187.684C1288.83 345.991 1216.91 550.184 1066.41 619.184C903.139 694.038 895.906 567.184 566.906 574.184C303.706 579.784 106.649 558.878 34.9823 477.878Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M34.9823 477.878C-99.5032 325.878 181.906 48.6843 489.906 8.18429C962.906 -40.3157 1113.71 155.354 1143.41 187.684C1288.83 345.991 1216.91 550.184 1066.41 619.184C903.139 694.038 895.906 567.184 566.906 574.184C303.706 579.784 106.649 558.878 34.9823 477.878Z;
              
              M45.9823 467.878C-89.5032 335.878 191.906 58.6843 499.906 18.18429C972.906 -30.3157 1103.71 165.354 1133.41 197.684C1278.83 355.991 1206.91 540.184 1056.41 609.184C893.139 684.038 885.906 577.184 556.906 584.184C293.706 589.784 96.649 548.878 45.9823 467.878Z;
              
              M34.9823 477.878C-99.5032 325.878 181.906 48.6843 489.906 8.18429C962.906 -40.3157 1113.71 155.354 1143.41 187.684C1288.83 345.991 1216.91 550.184 1066.41 619.184C903.139 694.038 895.906 567.184 566.906 574.184C303.706 579.784 106.649 558.878 34.9823 477.878Z
            "
          />
        </path>
      </svg>
      <div className={styles.heroContent}>
      <div className={styles.topLeft}>
        <h1 className={styles.heroTitle}>
          <div>Agentic</div>
          <div>Project</div>
          <div>Management</div>
        </h1>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.heroVersion}>Currently:</span>
            <span className={styles.statValue}>v{packageJson.version}</span>
          </div>
          {npmDownloads !== null && (
            <div className={styles.statItem}>
              <span className={styles.heroVersion}>NPM:</span>
              <span className={styles.statValue}>
                {formatNumber(npmDownloads)} this week
              </span>
            </div>
          )}
          {githubStars !== null && (
            <div className={styles.statItem}>
              <span className={styles.heroVersion}>GitHub:</span>
              <span className={styles.statValue}>{formatNumber(githubStars)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.centerButtons}>
        <div className={styles.installCommand}>
          <code className={styles.commandText}>$ npm install -g agentic-pm</code>
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
              </svg>
            )}
          </button>
        </div>
        <a
          href="https://github.com/sdi2200262/agentic-project-management"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubButton}
        >
          View on GitHub
        </a>
      </div>

      <p className={styles.bottomRight}>
        Manage complex projects<br />
        with a team of AI assistants,<br />
        smoothly and efficiently.
      </p>
      </div>
    </div>
  );
}
