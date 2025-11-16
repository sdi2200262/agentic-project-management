import React, { useState } from 'react';
import DocSidebar from '@theme-original/DocSidebar';

function DownloadDocsButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/agentic-project-management/all_docs.md';
    link.download = 'apm-documentation.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDropdown(false);
  };

  const handleCopyAll = async () => {
    try {
      const response = await fetch('/agentic-project-management/all_docs.md');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      alert('All documentation copied to clipboard!');
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to copy all docs:', error);
      alert('Failed to copy documentation');
    }
  };

  return (
    <div className="docs-sidebar-actions">
      {showDropdown && (
        <div className="download-dropdown show">
          <button className="download-dropdown-item" onClick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download all docs
          </button>
          <button className="download-dropdown-item" onClick={handleCopyAll}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy all docs
          </button>
        </div>
      )}
      <button 
        className="download-docs-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Download or copy all documentation">
        <span>All Docs</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ 
            transform: showDropdown ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease'
          }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default function DocSidebarWrapper(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <DocSidebar {...props} />
      </div>
      <DownloadDocsButton />
    </div>
  );
}
