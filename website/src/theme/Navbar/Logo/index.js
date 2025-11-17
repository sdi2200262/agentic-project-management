import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import APMLogo from '../../APMLogo';

export default function NavbarLogo() {
  const { siteConfig } = useDocusaurusContext();
  const { title } = siteConfig;
  const logoLink = useBaseUrl('/');

  return (
    <Link to={logoLink} className="navbar__brand">
      <div style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
        <APMLogo
          fontSize={8}
          className="navbar__logo"
        />
      </div>
      <span className="navbar__title text--truncate">{title}</span>
    </Link>
  );
}
