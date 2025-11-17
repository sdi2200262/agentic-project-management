import React, {useEffect, useRef} from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import {useLocation, useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DocBreadcrumbsWrapper(props) {
  const location = useLocation();
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  const handlerRef = useRef(null);
  
  useEffect(() => {
    // Check if we're on a docs page
    const isDocsPage = location.pathname.includes('/docs');
    
    if (isDocsPage) {
      const setupBreadcrumbHandler = () => {
        // Find breadcrumb container
        const breadcrumbContainer = document.querySelector('.theme-doc-breadcrumbs') ||
                                   document.querySelector('nav[aria-label="breadcrumbs"]');
        
        if (breadcrumbContainer) {
          // Find the first breadcrumb item (home)
          const firstBreadcrumbItem = breadcrumbContainer.querySelector('.breadcrumbs__item:first-child');
          
          if (firstBreadcrumbItem) {
            const homeLink = firstBreadcrumbItem.querySelector('a');
            
            if (homeLink) {
              // Construct the correct docs URL with baseUrl
              // baseUrl is '/agentic-project-management/', so we want '/agentic-project-management/docs'
              // Remove trailing slash from baseUrl, add 'docs', then add trailing slash
              const baseUrlClean = baseUrl.replace(/\/$/, '');
              const docsUrl = `${baseUrlClean}/docs`;
              
              homeLink.setAttribute('href', docsUrl);
              
              // Remove any existing click handler
              if (handlerRef.current) {
                homeLink.removeEventListener('click', handlerRef.current, true);
              }
              
              // Create new click handler that intercepts navigation
              const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                // Use the full path with baseUrl
                history.push(docsUrl);
                return false;
              };
              
              handlerRef.current = clickHandler;
              // Use capture phase to intercept before React Router
              homeLink.addEventListener('click', clickHandler, true);
            }
          }
        }
      };
      
      // Try multiple times with increasing delays to catch breadcrumbs when they render
      const timeouts = [];
      [50, 100, 200, 500, 1000].forEach((delay) => {
        timeouts.push(setTimeout(setupBreadcrumbHandler, delay));
      });
      
      // Use MutationObserver for dynamic updates
      const observer = new MutationObserver(() => {
        setupBreadcrumbHandler();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      
      return () => {
        timeouts.forEach(clearTimeout);
        observer.disconnect();
        // Clean up event listeners
        if (handlerRef.current) {
          const links = document.querySelectorAll('.theme-doc-breadcrumbs a, nav[aria-label="breadcrumbs"] a');
          links.forEach(link => {
            link.removeEventListener('click', handlerRef.current, true);
          });
        }
      };
    }
  }, [location.pathname, history, baseUrl]);
  
  return <DocBreadcrumbs {...props} />;
}
