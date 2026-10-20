import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: false,
    fileParallelism: false,
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
