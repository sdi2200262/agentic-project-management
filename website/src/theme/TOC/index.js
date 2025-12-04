import React, { useState } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import { copyPageContent } from '../../utils/contentExtractor';
import { CopyPageIcon } from '../../components/ui';
import styles from './styles.module.css';

// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';
const COPY_FEEDBACK_DURATION = 2000;

/**
 * Enhanced Table of Contents component with page copy functionality
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} TOC component
 */
export default function TOC({ className, ...props }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
    const success = await copyPageContent();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
    }
  };


  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      <div className={styles.separator} />
      <button
        className={styles.copyButton}
        onClick={handleCopyPage}
        title={copied ? 'Copied!' : 'Copy page'}
        aria-label="Copy page content"
      >
        <CopyPageIcon copied={copied} className={styles.copyIcon} />
        <span className={styles.copyButtonText}>
          {copied ? 'Copied!' : 'Copy page'}
        </span>
      </button>
    </div>
  );
}
