import js from '@eslint/js';
import ts from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    extends: [js.configs.recommended, ts.configs.recommended],
  },
]);
