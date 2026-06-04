import js from '@eslint/js';
import ts from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    extends: [js.configs.recommended, ts.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
