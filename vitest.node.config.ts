import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/react-provider/spamHash.ssr.vitest.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      'core': path.resolve(__dirname, './packages/core'),
      'watcher': path.resolve(__dirname, './packages/watcher'),
      'reaction': path.resolve(__dirname, './packages/reaction'),
      'react-provider': path.resolve(__dirname, './packages/react-provider'),
      'repka': path.resolve(__dirname, './packages/repka'),
    },
  },
});
