/**
 * Content extraction utilities for converting HTML to markdown and copying page content
 */

/**
 * Convert HTML element to markdown-like text
 * @param {HTMLElement} element - The HTML element to convert
 * @returns {string} Markdown-like text representation
 */
export function htmlToMarkdown(element) {
  let markdown = '';

  // Process headings
  element.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent.trim();
    markdown += '#'.repeat(level) + ' ' + text + '\n\n';
  });

  // Process paragraphs
  element.querySelectorAll('p').forEach(p => {
    const text = p.textContent.trim();
    if (text) {
      markdown += text + '\n\n';
    }
  });

  // Process code blocks
  element.querySelectorAll('pre code').forEach(code => {
    const language = code.className.match(/language-(\w+)/)?.[1] || '';
    const codeText = code.textContent;
    markdown += '```' + language + '\n' + codeText + '\n```\n\n';
  });

  // Process lists
  element.querySelectorAll('ul, ol').forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach((item, index) => {
      const prefix = list.tagName === 'OL' ? `${index + 1}.` : '-';
      markdown += prefix + ' ' + item.textContent.trim() + '\n';
    });
    markdown += '\n';
  });

  return markdown.trim();
}

/**
 * Find content element on the page
 * @returns {HTMLElement|null} The main content element or null if not found
 */
export function findContentElement() {
  return document.querySelector('.markdown') ||
         document.querySelector('article') ||
         document.querySelector('.theme-doc-markdown');
}

/**
 * Extract clean text content from page
 * @returns {string} Plain text content
 */
export function extractPlainText() {
  const contentElement = findContentElement();
  return contentElement?.textContent || '';
}

/**
 * Copy page content to clipboard with HTML-to-markdown conversion
 * @returns {Promise<boolean>} Success status
 */
export async function copyPageContent() {
  try {
    const contentElement = findContentElement();

    if (!contentElement) {
      console.warn('Could not find content element');
      return false;
    }

    // Clone the element to avoid modifying the original
    const clonedContent = contentElement.cloneNode(true);

    // Remove unwanted elements (TOC, buttons, etc.)
    clonedContent.querySelectorAll('.table-of-contents, button, .copy-button').forEach(el => el.remove());

    // Convert HTML to markdown
    let markdown = htmlToMarkdown(clonedContent);

    // Fallback: if markdown is empty, get plain text
    if (!markdown) {
      markdown = clonedContent.textContent || extractPlainText();
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    console.error('Failed to copy content:', error);

    // Fallback: try to copy the entire page text
    try {
      const text = extractPlainText();
      await navigator.clipboard.writeText(text);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy also failed:', fallbackError);
      return false;
    }
  }
}
