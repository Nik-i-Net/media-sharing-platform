import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
        },
      },

      {
        test: {
          name: 'integration',
          include: ['src/**/*.int.ts'],
        },
      },

      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/**/*.e2e.ts'],
          globalSetup: './tests/e2e/global-setup.ts',
          alias: { '@': './src' },
        },
      },
    ],
  },
});
