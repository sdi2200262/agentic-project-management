import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import styles from './styles.module.css';

export default function ContentWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);

  // Helper to get base URL without trailing slash
  const getBaseUrl = () => {
    const baseUrl = siteConfig.baseUrl || '/';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  };

  // Function to copy all docs
  const copyAllDocs = async () => {
    try {
      setCopying(true);
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/apm_full_docs.md`);

      if (!response.ok) {
        throw new Error(`Failed to fetch all docs: ${response.status}`);
      }

      const content = await response.text();
      // Verify we got markdown content, not HTML
      if (content.trim().startsWith('<!DOCTYPE html>') || content.trim().startsWith('<html>')) {
        throw new Error('Received HTML instead of markdown content');
      }

      await navigator.clipboard.writeText(content);
      
      setCopying(false);
      setCopied(true);

      // Close dropdown after a delay to show feedback
      const timeout = setTimeout(() => {
        setDropdownOpen(false);
        setCopied(false);
      }, 2000);
      setCloseTimeout(timeout);
    } catch (error) {
      console.error('Failed to copy all docs:', error);
      alert('Failed to copy all docs. Please try downloading instead.');
      setCopying(false);
    }
  };

  // Function to download all docs
  const downloadAllDocs = () => {
    const baseUrl = getBaseUrl();
    const link = document.createElement('a');
    link.href = `${baseUrl}/apm_full_docs.md`;
    link.download = 'apm_full_docs.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close dropdown after a short delay
    const timeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000);
    setCloseTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <div className={styles.contentContainer}>
      <Content {...props} />

      {/* Get all docs section - integrated into the content area */}
      <div className={styles.getAllDocsSection}>
        <div className={styles.separator} />

        <div className={styles.dropdownContainer}>
          <button
            className={styles.getAllDocsButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Get all docs"
            aria-expanded={dropdownOpen}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.copyIcon}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className={styles.copyButtonText}>Get all docs</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={clsx(styles.dropdownArrow, dropdownOpen && styles.dropdownArrowOpen)}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                onClick={copyAllDocs}
                disabled={copying || copied}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {copied ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </>
                  )}
                </svg>
                <span>{copying ? 'Copying...' : (copied ? 'Copied!' : 'Copy all docs')}</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={downloadAllDocs}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download all docs</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
