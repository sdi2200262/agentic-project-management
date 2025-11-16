import React from 'react';
import Link from '@docusaurus/Link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="apm-footer">
      <div className="apm-footer__inner">
        <div className="apm-footer__section">
          <h4 className="apm-footer__title">Docs</h4>
          <ul className="apm-footer__list">
            <li><Link to="/docs/getting-started">Getting Started</Link></li>
            <li><Link to="/docs/introduction">Introduction</Link></li>
          </ul>
        </div>

        <div className="apm-footer__section">
          <h4 className="apm-footer__title">Community</h4>
          <ul className="apm-footer__list">
            <li>
              <a href="https://github.com/sdi2200262/agentic-project-management" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <li>
              <a href="https://github.com/sdi2200262/agentic-project-management/issues" target="_blank" rel="noopener noreferrer">Issues</a>
            </li>
          </ul>
        </div>

        <div className="apm-footer__section">
          <h4 className="apm-footer__title">More</h4>
          <ul className="apm-footer__list">
            <li>
              <a href="https://www.npmjs.com/package/agentic-pm" target="_blank" rel="noopener noreferrer">NPM</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="apm-footer__copyright">
        Copyright © {year} Agentic Project Management. Built with Docusaurus.
      </div>
    </footer>
  );
}
