import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

// Custom blockquote component for GitHub-style notes
function CustomBlockquote({ children, ...props }) {
  // Check if this is a note/warning/tip type blockquote
  const firstChild = React.Children.toArray(children)[0];
  let blockquoteType = 'default';
  let content = children;

  if (firstChild && typeof firstChild === 'object' && firstChild.props) {
    const text = firstChild.props.children;
    if (typeof text === 'string') {
      const lowerText = text.toLowerCase();
      if (lowerText.startsWith('note:') || lowerText.startsWith('> note:')) {
        blockquoteType = 'note';
      } else if (lowerText.startsWith('warning:') || lowerText.startsWith('> warning:')) {
        blockquoteType = 'warning';
      } else if (lowerText.startsWith('tip:') || lowerText.startsWith('> tip:')) {
        blockquoteType = 'tip';
      } else if (lowerText.startsWith('important:') || lowerText.startsWith('> important:')) {
        blockquoteType = 'important';
      }
    }
  }

  return (
    <blockquote className={`custom-blockquote custom-blockquote--${blockquoteType}`} {...props}>
      {children}
    </blockquote>
  );
}

export default {
  ...MDXComponents,
  blockquote: CustomBlockquote,
};
