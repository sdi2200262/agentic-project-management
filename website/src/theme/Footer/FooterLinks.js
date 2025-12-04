import React from 'react';
import Link from '@docusaurus/Link';

/**
 * Footer links section component
 * @param {Array} footerLinks - Array of footer link sections
 * @returns {JSX.Element} Footer links container
 */
export default function FooterLinks({ footerLinks }) {
  if (!footerLinks.length) return null;

  return (
    <div className="footer-links-container">
      {footerLinks.map((section, sectionIndex) => (
        <div key={sectionIndex} className="footer-link-column">
          <h3 className="footer-link-title">{section.title}</h3>
          <ul className="footer-link-list">
            {(section.items || []).map((item, itemIndex) => (
              <li key={itemIndex}>
                {item.to ? (
                  <Link to={item.to} className="footer-link">
                    {item.label}
                  </Link>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="footer-link"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
