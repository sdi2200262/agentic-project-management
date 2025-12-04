import React, {useState} from 'react';
import FooterOriginal from '@theme-original/Footer';
import {useThemeConfig} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import APMLogo from '../../components/APMLogo';
import './index.css';

// Export the original Footer for direct use
export {FooterOriginal as Footer};

// Wrapper component (used by Docusaurus theme)
export default function FooterWrapper(props) {
  const {footer} = useThemeConfig();
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = useBaseUrl('/img/cobuter-man-black-and-white-no-bg.png');
  const hoverImageUrl = useBaseUrl('/img/cobuter-man-black-and-white-no-bg-hover.png');

  // Safety check for footer config
  const footerLinks = footer?.links || [];

  return (
    <footer className="footer-custom">
      {/* Top section: Links + Logo */}
      <div className="footer-top">
        {/* Links section with columns */}
        {footerLinks.length > 0 && (
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
        )}
        <div className="footer-logo-container">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div>
              <APMLogo fontSize={16} />
            </div>
          </Link>
          <a 
            href="https://github.com/sdi2200262"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img 
              src={isHovered ? hoverImageUrl : imageUrl}
              alt="Cobuter Man" 
              className={`footer-image ${isHovered ? 'footer-image-hover' : ''}`}
            />
          </a>
        </div>
      </div>

      {/* Separator */}
      <hr className="footer-separator" />

      {/* Copyright */}
      <div className="footer-copyright">
        <p className="footer-copyright-right">Copyright © {new Date().getFullYear()} Agentic Project Management</p>
        <p className="footer-copyright-left">Licensed under the Mozilla Public License 2.0. See the <a href="https://github.com/sdi2200262/agentic-project-management/blob/main/LICENSE">LICENSE</a> file for full details.</p>
      </div>
    </footer>
  );
}
