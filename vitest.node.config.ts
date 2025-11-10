import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    
    include: ['packages/react-provider/spamHash.ssr.vitest.ts'],

    globals: true,
  },
});
