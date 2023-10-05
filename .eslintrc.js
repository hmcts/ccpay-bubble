// .eslintrc.js example
module.exports = {
  ignorePatterns: ['src/main/views/govuk/**', "**/*.js"],
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "env": {
    "jest": true
  }
}
