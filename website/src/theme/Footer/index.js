import React from 'react';
import FooterOriginal from '@theme-original/Footer';

// Export the original Footer for direct use
export {FooterOriginal as Footer};

// Wrapper component (used by Docusaurus theme)
export default function FooterWrapper(props) {
  return <FooterOriginal {...props} />;
}
