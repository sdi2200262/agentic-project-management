import { useEffect, useRef } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Custom hook for managing breadcrumb home link updates
 * @param {string} pathname - Current pathname to check if we're in docs
 * @returns {void}
 */
export function useBreadcrumbLink(pathname) {
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  const handlerRef = useRef(null);
  const processedLinksRef = useRef(new WeakSet());

  useEffect(() => {
    if (!pathname.includes('/docs')) return;

    const docsUrl = `${baseUrl.replace(/\/$/, '')}/docs`;

    const updateHomeLink = () => {
      const container = document.querySelector('.theme-doc-breadcrumbs') ||
                       document.querySelector('nav[aria-label="breadcrumbs"]');
      const homeLink = container?.querySelector('.breadcrumbs__item:first-child a');

      if (homeLink && !processedLinksRef.current.has(homeLink)) {
        homeLink.setAttribute('href', docsUrl);

        // Create click handler
        const clickHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          history.push(docsUrl);
          return false;
        };

        // Remove any existing handlers by cloning the node
        const newLink = homeLink.cloneNode(true);
        homeLink.parentNode.replaceChild(newLink, homeLink);
        newLink.addEventListener('click', clickHandler, true);

        processedLinksRef.current.add(newLink);
        handlerRef.current = clickHandler;
      }
    };

    // Try multiple times to ensure breadcrumbs are rendered
    const timeouts = [50, 100, 200, 500, 1000].map(delay =>
      setTimeout(updateHomeLink, delay)
    );

    // Watch for dynamic updates
    const observer = new MutationObserver(updateHomeLink);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      processedLinksRef.current = new WeakSet();
    };
  }, [pathname, history, baseUrl]);
}
