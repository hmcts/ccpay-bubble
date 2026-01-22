// ESLint v9+ flat config for this repo.
//
// Notes:
// - Replaces legacy .eslintrc.json and .eslintrc.js.
// - Carries over ignore patterns from .eslintignore.

const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: [
      '**/dist/*',
      'node_modules',
      'coverage/*',
      'output',
      'acceptance-tests/output',
      'functional-output/*',
      'acceptance-tests/test/end-to-end/pages/case_transactions.js',
      'acceptance-tests/test/end-to-end/tests/Payment_Failure_BounceBack_test.js',
      'acceptance-tests/test/end-to-end/helpers/utils.js',
      'acceptance-tests/test/end-to-end/pages/failure_event_details.js',
      'acceptance-tests/test/end-to-end/pages/refunds_list.js',
      'acceptance-tests/test/end-to-end/pages/payment_history.js',
      'acceptance-tests/test/end-to-end/pages/initiate_refunds.js',
      'acceptance-tests/test/end-to-end/tests/config/CCPBConfig.js',
      'acceptance-tests/test/end-to-end/tests/Refund_Over_Payment_Option_Selection_Journey_test.js',
      'acceptance-tests/test/end-to-end/pages/add_fees.js',
      'acceptance-tests/test/end-to-end/tests/Payment_Failure_BounceBack.js',
      'acceptance-tests/test/end-to-end/helpers/string_utils.js',
      '.yarn/**',
      'dist/**',
      'coverage/**',
      'functional-output/**',
      'acceptance-tests/output/**',
      'src/assets/js/**',
      '**/*.min.js',

      // These are large legacy / test harness areas where the repo historically relied on different linting rules.
      // (Angular projects are already linted via `ng lint` / @angular-eslint.)
      'acceptance-tests/**',
      'smoke-test/**',

      // Don't lint the config files themselves with repo rules
      'eslint.config.js',
    ],
  },

  // Apply the base JS rules only to the JS we actually maintain in this repo.
  {
    files: [
      '*.js',
      'express/**/*.js',
      'scripts/**/*.js',
      'projects/**/karma.conf.js',
      'karma.conf.js',
      'gulpfile.js',
      'server.js',
      'start.js',
    ],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    linterOptions: {
      // Surface warnings for unused eslint-disable comments (useful cleanup signal).
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // Keep this config minimal to avoid forcing large reformat/cleanup PRs.
      'linebreak-style': ['error', 'unix'],

      // NOTE: We intentionally don't enforce quotes/semi/max-len/no-magic-numbers here because
      // this repo has a lot of legacy server/test JS that would fail otherwise.
    },
  },

  // TypeScript rules (derived from the prior .eslintrc.js)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // NOTE: We intentionally don't spread in tsPlugin.configs.recommended.rules here.
      // ESLint loads this config file as plain JS, and some environments choke on the
      // object spread syntax depending on how the runner is invoked.

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // File-specific overrides (from prior .eslintrc.js)
  {
    files: ['examples/**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['src/assets/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
