import React from 'react';
import FooterOriginal from '@theme-original/Footer';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useHoverSupport } from '../../hooks/useHoverSupport';
import FooterLinks from './FooterLinks';
import FooterLogo from './FooterLogo';
import FooterCopyright from './FooterCopyright';
import './index.css';

// Export the original Footer for direct use
export { FooterOriginal as Footer };

/**
 * Enhanced Footer wrapper component with hover effects and organized sections
 * @param {Object} props - Component props
 * @returns {JSX.Element} Footer wrapper component
 */
export default function FooterWrapper(props) {
  const { footer } = useThemeConfig();
  const { isHovered, hoverHandlers } = useHoverSupport();

  // Safety check for footer config
  const footerLinks = footer?.links || [];

  return (
    <footer className="footer-custom">
      {/* Top section: Links + Logo */}
      <div className="footer-top">
        <FooterLinks footerLinks={footerLinks} />
        <FooterLogo isHovered={isHovered} hoverHandlers={hoverHandlers} />
      </div>

      {/* Separator */}
      <hr className="footer-separator" />

      {/* Copyright */}
      <FooterCopyright />
    </footer>
  );
}
