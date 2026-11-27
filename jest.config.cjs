/** Jest config. Coverage thresholds fail the run if not met (see AGENTS.md Definition of Done). */
/** @type {import('jest').Config} */
module.exports = {
  // Tests compile with tsconfig.base.json (CommonJS), separate from Astro's own settings.
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.base.json' }] },
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  // Tests live only in tests/, mirroring src/ (e.g. src/core/math.ts -> tests/core/math.test.ts).
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  // site-data.ts and src/pages/ only wire the real folder to the core; they're covered by running the site.
  collectCoverageFrom: ['src/**/*.ts', '!**/index.ts', '!src/site-data.ts', '!src/pages/**'],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
    // The pure core is the heart of the app: every line must be tested. Never lower this to pass.
    './src/core/': { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
};
