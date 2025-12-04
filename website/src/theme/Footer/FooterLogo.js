import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import APMLogo from '../../components/APMLogo';

/**
 * Footer logo section component
 * @param {Object} hoverState - Hover state from useHoverSupport hook
 * @returns {JSX.Element} Footer logo container
 */
export default function FooterLogo({ isHovered, hoverHandlers }) {
  const imageUrl = useBaseUrl('/img/cobuter-man-black-and-white-no-bg.png');
  const hoverImageUrl = useBaseUrl('/img/cobuter-man-black-and-white-no-bg-hover.png');

  return (
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
        {...hoverHandlers}
      >
        <img
          src={isHovered ? hoverImageUrl : imageUrl}
          alt="Cobuter Man"
          className={`footer-image ${isHovered ? 'footer-image-hover' : ''}`}
        />
      </a>
    </div>
  );
}
