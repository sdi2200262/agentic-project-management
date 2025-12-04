import React from 'react';

/**
 * Footer copyright section component
 * @returns {JSX.Element} Footer copyright container
 */
export default function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-copyright">
      <p className="footer-copyright-right">
        Copyright © {currentYear} Agentic Project Management
      </p>
      <p className="footer-copyright-left">
        Licensed under the Mozilla Public License 2.0. See the{' '}
        <a href="https://github.com/sdi2200262/agentic-project-management/blob/main/LICENSE">
          LICENSE
        </a>{' '}
        file for full details.
      </p>
    </div>
  );
}
