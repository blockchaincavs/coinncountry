import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'coverage/', 'dist/', '.astro/', '**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // The core must stay pure: no Node built-ins, network, clock, randomness or env access.
    // Time and randomness are passed in as arguments, so every rule is deterministic and testable.
    // Lint enforces this so neither a human nor Claude can quietly break it.
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['node:*', 'fs', 'http', 'https', 'net', 'child_process', '../adapters/*'] },
      ],
      'no-restricted-globals': ['error', 'fetch', 'process', 'XMLHttpRequest', 'WebSocket'],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Pass `now` in as an argument.' },
        { object: 'Math', property: 'random', message: 'Pass an `rng` in as an argument.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Pass `now` in as an argument.',
        },
      ],
    },
  },
);
