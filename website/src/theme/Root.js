import React, { useEffect } from 'react';
import Root from '@theme-original/Root';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';

function FloatingHeader() {
  return (
    <div className="floating-header">
      <Link to="/" className="floating-header-logo">
        Agentic PM
      </Link>
      <span style={{ color: '#ccc' }}>|</span>
      <Link 
        to="/docs" 
        style={{ 
          textDecoration: 'none', 
          color: 'var(--ifm-font-color-base)',
          fontSize: '0.95rem'
        }}>
        Documentation
      </Link>
    </div>
  );
}

export default function RootWrapper(props) {
  // Show scrollbars only while actively scrolling
  useEffect(() => {
    let timeoutId;
    const addFlag = () => {
      document.documentElement.classList.add('is-scrolling');
      document.body.classList.add('is-scrolling');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
        document.body.classList.remove('is-scrolling');
      }, 700);
    };

    // Capture scroll events from window and scrollable descendants
    window.addEventListener('scroll', addFlag, { passive: true });
    document.addEventListener('scroll', addFlag, { passive: true, capture: true });

    return () => {
      window.removeEventListener('scroll', addFlag, { passive: true });
      document.removeEventListener('scroll', addFlag, { capture: true });
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <FloatingHeader />
      <Root {...props} />
    </>
  );
}
