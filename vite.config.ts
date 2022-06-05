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
            src: './assets/icons/zinzenlogo-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: './assets/icons/zinzenlogo-512X512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: './',
        background_color: '#3367D6',
        display: 'standalone',
        scope: './',
        related_applications: [
          {
            platform: 'webapp',
            url: 'https://zinzen.me/manifest.webmanifest',
          },
        ],
        theme_color: '#3367D6',
        description: 'ZinZen for purpose',
      },
      workbox: {
        globDirectory: './',
        globPatterns: [
          '**/*.{png,ico,svg,md,json,js,html,txt,ts,scss,tsx,jpg,jpeg,lock}',
        ],
        swDest: 'sw.js',
      },
    }),
  ],
});
