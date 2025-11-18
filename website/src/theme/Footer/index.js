import React from 'react';
import FooterOriginal from '@theme-original/Footer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import APMLogo from '../../components/APMLogo';
import './index.css';

// Export the original Footer for direct use
export {FooterOriginal as Footer};

// Wrapper component (used by Docusaurus theme)
export default function FooterWrapper(props) {
  const {siteConfig} = useDocusaurusContext();
  const {baseUrl} = siteConfig;

  return (
    <>
      <FooterOriginal {...props} />
      <div className="footer-custom">
        <div className="footer-image">
          <a 
            href="https://github.com/sdi2200262" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="CobuterMan"
          >
            <img 
              src={`${baseUrl}img/cobuter-man.png`} 
              alt="CobuterMan" 
              width="40"
            />
          </a>
        </div>
        <div className="footer-logo">
          <APMLogo fontSize={6} />
        </div>
      </div>
    </>
  );
}
