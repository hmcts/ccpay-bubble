module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-array-constructor':'off',
    '@typescript-eslint/no-this-alias':'off',
    '@typescript-eslint/no-explicit-any':'off',
    '@typescript-eslint/no-unused-vars':'off',
  },
  overrides: [
    {
      files: ['examples/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
