/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars = {
  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'introduction',
        'getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'agent-types',
        'workflow-overview',
        'cli',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      collapsed: true,
      items: [
        'context-and-memory-management',
        'context-and-prompt-engineering',
      ],
    },
    {
      type: 'category',
      label: 'Reference & Guides',
      collapsed: true,
      items: [
        'modifying-apm',
        'token-consumption-tips',
        'troubleshooting-guide',
      ],
    },
  ],
};

export default sidebars;
