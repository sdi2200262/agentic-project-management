import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'Agentic Project Management',
  tagline: 'AI-powered project management CLI tool',
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
      {
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
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Agentic PM',
      logo: {
        alt: 'Agentic PM Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
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
              to: '/docs/Getting_Started',
            },
            {
              label: 'Introduction',
              to: '/docs/Introduction',
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
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
