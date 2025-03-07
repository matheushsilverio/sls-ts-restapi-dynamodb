/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/src/use-cases/**/*.spec.ts'],
};
