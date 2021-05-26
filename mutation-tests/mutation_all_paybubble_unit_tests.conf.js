/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */


module.exports = {
  fileLogLevel: 'trace',
  // logLevel: 'trace',
  mutator: 'typescript',
  transpilers: [],
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
    // Components
    'src/app/components/**/add-fee-detail.component.ts',
    'src/app/components/**/ccd-search.component.spec.ts',
    'src/app/components/**/confirmation.component.ts',
    'src/app/components/**/fee-details.component.ts',
    'src/app/components/**/fee-search.component.ts',
    'src/app/components/**/payment-history.component.ts',
    'src/app/components/**/review-fee-detail.component.ts',
    'src/app/components/**/view-payment.component.ts',
    '!src/app/components/**/*.spec.ts',
    //  Models
    'src/app/models/**/PaymentModel.ts',
    'src/app/models/**/RemissionModel.ts',
    '!src/app/models/**/*.spec.ts',
    '!src/app/models/FeeModel.ts',
    //  Route-Guards
    '!src/app/route-guards/**/*.ts',
    '!src/app/route-guards/**/*.spec.ts',
    //  Services
    'src/app/services/**/add-fee-detail.service.ts',
    'src/app/services/**/paybubble.http.client.ts',
    'src/app/services/**/payment-group.service.ts',
    '!src/app/services/**/*.spec.ts',
    '!src/app/services/caseref/caseref.service.ts',
    //  Shared
    '!src/app/shared/**/*.ts',
    '!src/app/shared/**/*.spec.ts',
    '!src/app/shared/interceptors/auth.dev.interceptor.ts',
    '!src/app/shared/validators/help-with-fees.validator.ts',
    '!src/app/shared/validators/index.ts',
    '!src/app/shared/components/header/header.component.ts'


  ],

  testRunner: 'karma',
  karma: {
    configFile: 'karma.conf.js',
    projectType: 'angular-cli',
    config: { browsers: ['ChromeHeadless'] }
  },
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: { baseDir: 'functional-output/mutation-reports' },

  // logLevel: "all",
  timeoutMS: 600000,
  timeoutFactor: 4,
  maxConcurrentTestRunners: 4,
  coverageAnalysis: 'off'
};
