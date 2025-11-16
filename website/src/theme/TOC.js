import React, { useState } from 'react';
import TOC from '@theme-original/TOC';

function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Get the markdown content of the current page
      const article = document.querySelector('article');
      if (!article) return;

      // Get the markdown file path from the page
      const editButton = document.querySelector('a[href*="github.com"][href*="/tree/main/docs/"]');
      let markdownContent = '';

      if (editButton) {
        const githubUrl = editButton.getAttribute('href');
        const fileName = githubUrl.split('/docs/').pop();
        
        // Fetch the raw markdown from GitHub
        const rawUrl = `https://raw.githubusercontent.com/sdi2200262/agentic-project-management/main/docs/${fileName}`;
        try {
          const response = await fetch(rawUrl);
          if (response.ok) {
            markdownContent = await response.text();
          }
        } catch (error) {
          console.error('Failed to fetch markdown:', error);
        }
      }

      // Fallback: copy the visible text content if markdown fetch fails
      if (!markdownContent) {
        const heading = article.querySelector('h1');
        const content = article.querySelector('.theme-doc-markdown');
        markdownContent = `# ${heading?.textContent || 'Documentation'}\n\n${content?.textContent || article.textContent}`;
      }

      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button 
      className={`copy-page-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      title="Copy page content">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      {copied ? 'Copied!' : 'Copy page'}
    </button>
  );
}

export default function TOCWrapper(props) {
  return (
    <>
      <CopyPageButton />
      <div className="toc-separator"></div>
      <TOC {...props} />
    </>
  );
}
