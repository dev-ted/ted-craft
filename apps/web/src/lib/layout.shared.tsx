import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, browseRoute, docsRoute, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      {
        text: 'Browse',
        url: browseRoute,
        active: 'nested-url',
      },
      {
        text: 'Docs',
        url: docsRoute,
        active: 'nested-url',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
