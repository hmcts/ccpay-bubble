/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */


module.exports = {
  fileLogLevel: 'trace',
  // logLevel: 'trace',
  mutator: 'typescript',
  files: [
    './**',
    '!.idea/**',
    '!.nyc_output/**',
    '!.stryker-tmp/**',
    '!.vscode/**',
    '!acceptance-tests/**',
    '!functional-output/**',
    '!node_modules/**',
    '!output/**',
    '!reports/**'
  ],
  mutate: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts'
  ],

  testRunner: 'karma',
  karma: {
    configFile: 'karma.conf.js',
    projectType: 'angular-cli',
    config: { browsers: ['ChromeHeadless'] }
  },
  reporters: ['html', 'clear-text', 'progress'],

  // logLevel: "all",
  thresholds: { high: 95, low: 85, break: 56 },
  timeoutMS: 60000,
  timeoutFactor: 4,
  maxConcurrentTestRunners: 6,
  coverageAnalysis: 'off'
};
