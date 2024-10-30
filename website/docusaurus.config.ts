// DO NOT EDIT!
// Automatically generated from docusaurus-template-liquid/templates/docusaurus.

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import logger from '@docusaurus/logger';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// ----------------------------------------------------------------------------

function getCustomFields() {
  const pwd = fileURLToPath(import.meta.url);
  // logger.info(pwd);

  // First get the version from the top package.json.
  const topFilePath = path.join(path.dirname(path.dirname(pwd)), 'package.json');
  // logger.info(filePath);
  const topFileContent = fs.readFileSync(topFilePath);

  const topPackageJson = JSON.parse(topFileContent.toString());
  const npmVersion = topPackageJson.version.replace(/[.-]pre/, '');

  logger.info(`package version: ${topPackageJson.version}`);

  const customFields = {}

  return {
    npmVersion,
    docusaurusVersion: require('@docusaurus/core/package.json').version,
    buildTime: new Date().getTime(),
    ...customFields,
  }
}

// ----------------------------------------------------------------------------

const customFields = getCustomFields();
logger.info(customFields);

// ----------------------------------------------------------------------------

const config: Config = {
  title: 'logger - The xPack Logger',
  tagline: 'A Node.js CommonJS/ES6 module with a generic console logger class',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://xpack.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/logger-ts/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'xpack', // Usually your GitHub org/user name.
  projectName: 'logger-ts', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Useful for the sitemap.xml, to avoid redirects, since
  // GitHub redirects all to trailing slash.
  trailingSlash: true,

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
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/xpack/logger-ts/edit/master/',
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/xpack/logger-ts/edit/master/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        sitemap: {
          // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap
          changefreq: 'weekly',
          priority: 0.5,
          // ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      // https://docusaurus.io/docs/next/api/plugins/@docusaurus/plugin-client-redirects#redirects
      '@docusaurus/plugin-client-redirects',
      {
        // fromExtensions: ['html', 'htm'], // /myPage.html -> /myPage
        // toExtensions: ['exe', 'zip'], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          //   // /docs/oldDoc -> /docs/newDoc
          //   {
          //     to: '/docs/newDoc',
          //     from: '/docs/oldDoc',
          //   },
          //   // Redirect from multiple old paths to the new path
          //   {
          //     to: '/docs/newDoc2',
          //     from: ['/docs/oldDocFrom2019', '/docs/legacyDocFrom2016'],
          //   },
        ],
        createRedirects(existingPath) {
          logger.info(existingPath);
          //   if (existingPath.includes('/evenimente')) {
          //     // logger.info(`to ${existingPath} from ${existingPath.replace('/evenimente', '/events')}`);
          //     // Redirect from /events/X to /evenimente/X
          //     return [
          //       existingPath.replace('/evenimente', '/events')
          //     ];
          //   } else if (existingPath.includes('/amintiri')) {
          //     // logger.info(`to ${existingPath} from ${existingPath.replace('/amintiri', '/blog')}`);
          //     // Redirect from /blog/Z to /amintiri/X
          //     return [
          //       existingPath.replace('/amintiri', '/blog')
          //     ];
          //   }
          //   return undefined; // Return a falsy value: no redirect created
          //   },
        }
      }
    ],
    [
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
      // https://tagassistant.google.com
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-T50NMR8JZ1',
        anonymizeIP: false,
      }
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        // https://typedoc-plugin-markdown.org/docs/options#display-options
        blockTagsPreserveOrder: [ "@example" ],
        classPropertiesFormat: "list", // "table" not, it may have examples
        entryPointStrategy: "resolve",
        enumMembersFormat: "table",
        excludeExternals: true,
        excludeInternal: true,
        expandObjects: true,
        expandParameters: true,
        indexFormat: "table",
        interfacePropertiesFormat: "list", // "table" not, it may have examples
        parametersFormat: "table",
        propertyMembersFormat: "table",
        tsconfig: '../tsconfig.json',
        "tableColumnSettings": {
          "leftAlignHeaders": true
        },
        typeDeclarationFormat: "table",
        useCodeBlocks: false, // Nice, but it might be mistaken for examples.
      }
    ],

    // Local plugins.
    './src/plugins/SelectReleasesPlugin',
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',

    metadata: [
      {
        name: 'keywords',
        content: 'xpm, xpack, build, test, dependencies, npm, reproducibility'
      }
    ],
    navbar: {
      // Overriden by i18n/en/docusaurus-theme-classic.
      title: 'The xPack Project',

      logo: {
        alt: 'xPack Logo',
        src: 'img/components-256.png',
        href: 'https://xpack.github.io/',
      },
      items: [
        {
          to: '/',
          // label: 'Home',
          className: 'header-home-link',
          position: 'left'
        },
        {
          type: 'dropdown',
          label: 'Documentation',
          to: 'docs/getting-started',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started'
            },
            {
              label: 'Install Guide',
              to: '/docs/install'
            },
            {
              label: 'User Information',
              to: '/docs/user'
            },
            {
              label: 'Help Centre',
              to: '/docs/support'
            },
            {
              label: 'Releases',
              to: '/docs/releases'
            },
            {
              label: 'About',
              to: '/docs/project/about'
            }
          ],
        },
        {
          to: '/docs/api',
          label: 'API Reference',
          position: 'left',
        },
        {
          type: 'dropdown',
          to: '/blog',
          label: 'Blog',
          position: 'left',
          items: [
            {
              label: 'Recent',
              to: '/blog'
            },
            {
              label: 'Archive',
              to: '/blog/archive'
            },
            {
              label: 'Tags',
              to: '/blog/tags'
            },
          ]
        },
        {
          href: 'https://github.com/xpack/logger-ts/',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          label: `v${customFields.npmVersion}`,
          position: 'right',
          href: `https://www.npmjs.com/package/@xpack/logger/v/${customFields.npmVersion}`,
        },
        {
          href: 'https://github.com/xpack/',
          label: 'xpack',
          position: 'right',
        },
        {
          href: 'https://github.com/xpack-dev-tools/',
          label: 'xpack-dev-tools',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Pages',
          items: [
            {
              label: 'Install',
              to: '/docs/install',
            },
            {
              label: 'Support',
              to: '/docs/support',
            },
            {
              label: 'Releases',
              to: '/docs/releases',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/xpack/logger-ts/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/xpack',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/kbzWaJerFG',
            },
            {
              label: 'X/Twitter',
              href: 'https://twitter.com/xpack_project',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Donate via PayPal',
              href: 'https://www.paypal.com/donate/?hosted_button_id=5MFRG9ZRBETQ8',
            },
            {
              label: 'GitHub logger-ts',
              href: 'https://github.com/xpack/logger-ts/',
            },
            {
              label: 'GitHub xpack',
              href: 'https://github.com/xpack/',
            },
            {
              label: 'GitHub xpack-dev-tools',
              href: 'https://github.com/xpack-dev-tools/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Liviu Ionescu. Built with Docusaurus v${customFields.docusaurusVersion} on ${new Date(customFields.buildTime).toDateString()}.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  customFields: customFields,
};

export default config;
