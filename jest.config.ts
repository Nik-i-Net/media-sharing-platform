import type { Config } from 'jest';

const config: Config = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@src/(.*)\\.js$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  testMatch: ['tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
