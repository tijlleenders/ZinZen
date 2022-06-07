import path from 'path';
import { Alias, defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa'
import * as tsconfig from './tsconfig.paths.json';

function readAliasFromTsConfig(): Alias[] {
  const pathReplaceRegex = new RegExp(/\/\*$/, '');
  return Object.entries(tsconfig.compilerOptions.paths).reduce(
    (aliases, [fromPaths, toPaths]) => {
      const find = fromPaths.replace(pathReplaceRegex, '');
      const toPath = toPaths[0].replace(pathReplaceRegex, '');
      const replacement = path.resolve(__dirname, toPath);
      aliases.push({ find, replacement });
      return aliases;
    },
    [] as Alias[],
  );
}

export default defineConfig({
  resolve: {
    alias: readAliasFromTsConfig(),
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        short_name: 'ZinZen',
        name: 'ZinZen: Deliver purpose',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'assets/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'assets/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'assets/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'assets/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: '/index.html?source=pwa',
        background_color: '#3367D6',
        display: 'standalone',
        scope: '/',
        related_applications: [
          {
            platform: 'webapp',
            url: 'https://zinzen.me/manifest.webmanifest',
          },
        ],
        theme_color: '#3367D6',
        shortcuts: [
          {
            name: 'ZinZen export',
            short_name: 'ZinZen export',
            description: 'Export your data',
            url: '/export.html?source=pwa',
            icons: [
              {
                src: '/img/icons-192.png',
                sizes: '192x192',
              },
            ],
          },
          {
            name: "What's this week?",
            short_name: 'ZinZen This week',
            description: 'Calendar for the week',
            url: '/tomorrow?source=pwa',
            icons: [
              {
                src: '/img/icons-192.png',
                sizes: '192x192',
              },
            ],
          },
        ],
        description: 'ZinZen for purpose',
        screenshots: [
          {
            src: '/img/screenshot1.jpg',
            type: 'image/png',
            sizes: '540x720',
          },
          {
            src: '/img/screenshot2.jpg',
            type: 'image/jpg',
            sizes: '540x720',
          },
        ],
      },
      injectManifest: {
      },
    }),
  ],
});
