import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import APMLogo from '../../../components/APMLogo';

export default function NavbarLogo() {
  const logoLink = useBaseUrl('/');

  return (
    <Link to={logoLink} className="navbar__brand" style={{ textDecoration: 'none' }}>
      <div style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
        <APMLogo
          fontSize={8}
          className="navbar__logo"
        />
      </div>
    </Link>
  );
}
