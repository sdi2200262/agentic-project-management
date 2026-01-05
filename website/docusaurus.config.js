import {themes as prismThemes} from 'prism-react-renderer';

// Helper function to safely load the search plugin
function getSearchPlugin() {
  if (process.env.DISABLE_SEARCH_PLUGIN === 'true') {
    console.warn('\nWarning: Search plugin disabled via DISABLE_SEARCH_PLUGIN environment variable.\n');
    return null;
  }
  
  if (typeof File === 'undefined') {
    console.warn(
      '\nWarning: File API is not available in this environment.\n' +
      'Skipping @easyops-cn/docusaurus-search-local plugin to avoid build errors.\n' +
      'The search functionality will be disabled.\n'
    );
    return null;
  }
  
  try {
    const pluginPath = require.resolve('@easyops-cn/docusaurus-search-local');
    require(pluginPath);
    
    try {
      const fs = require('fs');
      const path = require('path');
      const serverIndexPath = path.join(path.dirname(pluginPath), 'dist', 'server', 'server', 'index.js');
      
      if (fs.existsSync(serverIndexPath)) {
        require(serverIndexPath);
      }
    } catch (serverError) {
      throw serverError;
    }
    
    return [
      pluginPath,
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: 'docs',
      },
    ];
  } catch (error) {
    console.warn(
      '\nWarning: Failed to load @easyops-cn/docusaurus-search-local plugin.\n' +
      'The search functionality will be disabled.\n' +
      `Error: ${error.message}\n` +
      'This is a non-fatal error; the build will continue.\n'
    );
    return null;
  }
}

const searchPlugin = getSearchPlugin();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Agentic Project Management',
  tagline: 'Manage complex projects with a team of AI assistants.',
  favicon: 'img/apm-logo.svg',

  // Set the production url of your site here
  url: 'https://agentic-project-management.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For custom domain, this should be '/'
  baseUrl: '/',

  // Custom domain deployment - no GitHub Pages specific config needed

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Enable Mermaid diagrams
  markdown: {
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Conditionally include search plugin - skip if loading failed
    ...(searchPlugin ? [searchPlugin] : []),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          editUrl:
            'https://github.com/sdi2200262/agentic-project-management/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/apm-social-card.png',
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
      },
      navbar: {
        title: 'Agentic PM',
        logo: {
          alt: 'Agentic Project Management Logo',
          src: 'img/apm-logo.svg',
        },
        items: [
          // Only show search if plugin is loaded
          ...(searchPlugin ? [{
            type: 'search',
            position: 'right',
          }] : []),
          {
            type: 'html',
            position: 'right',
            value: '<a href="https://github.com/sdi2200262/agentic-project-management" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" class="header-github-link" style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; background: none; border: none; text-decoration: none;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation Hub',
                to: '/docs',
              },
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Introduction',
                to: '/docs/introduction',
              },
              {
                label: 'CLI Guide',
                to: '/docs/cli',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Changelog',
                href: 'https://github.com/sdi2200262/agentic-project-management/blob/main/CHANGELOG.md',
              },
              {
                label: 'Versioning',
                href: 'https://github.com/sdi2200262/agentic-project-management/blob/main/VERSIONING.md',
              },
              {
                label: 'NPM',
                href: 'https://www.npmjs.com/package/agentic-pm',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/sdi2200262/agentic-project-management',
              },
              {
                label: 'Issues',
                href: 'https://github.com/sdi2200262/agentic-project-management/issues',
              },
            ],
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
