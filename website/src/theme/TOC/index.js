import React, {useState} from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';

// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({className, ...props}) {
  const [copied, setCopied] = useState(false);

  // Function to extract markdown content from the page
  const copyPageContent = async () => {
    try {
      // Get the main content area
      const contentElement = document.querySelector('.markdown') || 
                            document.querySelector('article') ||
                            document.querySelector('.theme-doc-markdown');
      
      if (!contentElement) {
        console.warn('Could not find content element');
        return;
      }

      // Clone the element to avoid modifying the original
      const clonedContent = contentElement.cloneNode(true);
      
      // Remove unwanted elements (TOC, buttons, etc.)
      clonedContent.querySelectorAll('.table-of-contents, button, .copy-button').forEach(el => el.remove());
      
      // Convert HTML to markdown-like text
      let markdown = '';
      
      // Process headings
      clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent.trim();
        markdown += '#'.repeat(level) + ' ' + text + '\n\n';
      });
      
      // Process paragraphs
      clonedContent.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        if (text) {
          markdown += text + '\n\n';
        }
      });
      
      // Process code blocks
      clonedContent.querySelectorAll('pre code').forEach(code => {
        const language = code.className.match(/language-(\w+)/)?.[1] || '';
        const codeText = code.textContent;
        markdown += '```' + language + '\n' + codeText + '\n```\n\n';
      });
      
      // Process lists
      clonedContent.querySelectorAll('ul, ol').forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
          const prefix = list.tagName === 'OL' ? `${index + 1}.` : '-';
          markdown += prefix + ' ' + item.textContent.trim() + '\n';
        });
        markdown += '\n';
      });
      
      // Fallback: if markdown is empty, get plain text
      if (!markdown.trim()) {
        markdown = clonedContent.textContent || contentElement.textContent;
      }
      
      // Copy to clipboard
      await navigator.clipboard.writeText(markdown.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
      // Fallback: try to copy the entire page text
      try {
        const text = document.querySelector('.markdown')?.textContent || 
                     document.querySelector('article')?.textContent || '';
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      }
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
        onClick={copyPageContent}
        title={copied ? 'Copied!' : 'Copy page'}
        aria-label="Copy page content"
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
          {copied ? (
            <>
              <polyline points="20 6 9 17 4 12"></polyline>
            </>
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </>
          )}
        </svg>
        <span className={styles.copyButtonText}>
          {copied ? 'Copied!' : 'Copy page'}
        </span>
      </button>
    </div>
  );
}
