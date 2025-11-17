import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Agentic Project Management',
  tagline: 'Manage complex projects with a team of AI assistants.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://sdi2200262.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/agentic-project-management/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sdi2200262', // Usually your GitHub org/user name.
  projectName: 'agentic-project-management', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Agentic PM',
        items: [
          {
            to: '/docs',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/sdi2200262/agentic-project-management',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Introduction',
                to: '/docs/introduction',
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
          {
            title: 'More',
            items: [
              {
                label: 'NPM',
                href: 'https://www.npmjs.com/package/agentic-pm',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Agentic Project Management. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
