import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import { useLocation } from '@docusaurus/router';
import { useBreadcrumbLink } from '../../hooks/useBreadcrumbLink';

/**
 * Enhanced DocBreadcrumbs component with custom home link handling
 * @param {Object} props - Component props
 * @returns {JSX.Element} DocBreadcrumbs wrapper
 */
export default function DocBreadcrumbsWrapper(props) {
  const location = useLocation();

  // Handle breadcrumb link updates
  useBreadcrumbLink(location.pathname);

  return <DocBreadcrumbs {...props} />;
}
