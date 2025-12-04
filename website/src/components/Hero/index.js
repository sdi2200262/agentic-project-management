import React, { useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import packageJson from '../../../../package.json';
import { useStats } from '@site/src/hooks/useStats';
import { formatNumber } from '@site/src/utils/format';
import { canvasPath, wigglePreset } from 'blobs/v2/animate';
import { CopyIcon, CheckIcon } from '../ui';
import { BLOB_CONFIG, ANIMATION_CONFIG, COPY_COMMAND, GITHUB_URL, COPY_FEEDBACK_DURATION } from '../../constants/hero';
import { useBlobAnimation } from '../../hooks/useBlobAnimation';

/**
 * Hero section component with animated blob background
 * @returns {JSX.Element} Hero component
 */
export default function Hero() {
  const [copied, setCopied] = React.useState(false);
  const { githubStars, npmDownloads, isLoading } = useStats();
  const { canvasRef, blobReady } = useBlobAnimation();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(COPY_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }, []);


  return (
    <div className={styles.heroWrapper}>
      <canvas
        ref={canvasRef}
        className={`${styles.blob} ${blobReady ? styles.blobVisible : ''}`}
      />
      <div className={styles.heroContent}>
        <div className={styles.topLeft}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Agentic</span>
            <span className={styles.titleLine2}>Project</span>
            <span className={styles.titleLine3}>Management</span>
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
            <code className={styles.commandText}>$ {COPY_COMMAND}</code>
            <button className={styles.copyButton} onClick={handleCopy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubButton}
          >
            View on GitHub
          </a>
        </div>

        <div className={styles.quoteContainer}>
          <p className={styles.bottomRight}>
            Manage complex projects<br />
            with a team of AI assistants,<br />
            smoothly and efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}
