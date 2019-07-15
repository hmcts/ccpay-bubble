// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const karmaJasmine = require('karma-jasmine');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaPhantomJsLauncher = require('karma-phantomjs-launcher');
const karmaIntlShim = require('karma-intl-shim');
const karmaCoverageInstanbulReporter = require('karma-coverage-istanbul-reporter');
const karmaAngularPluginsKarma = require('@angular-devkit/build-angular/plugins/karma');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaCustomLogger = require('karma-spec-reporter');


module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'intl-shim'],
    plugins: [
      karmaJasmine,
      karmaJasmineHtmlReporter,
      karmaPhantomJsLauncher,
      karmaIntlShim,
      // require('./en-us.js'),
      karmaCoverageInstanbulReporter,
      karmaAngularPluginsKarma,
      karmaChromeLauncher,
      karmaCustomLogger
    ],
    // leave Jasmine Spec Runner output visible in browser
    client: { clearContext: false },
    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    coverageReporter: {
      dir: 'coverage/',
      type: 'lcov',
      fixWebpackSourcePaths: true
    },
    reporters: ['spec', 'kjhtml', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: [ 'ChromeHeadless' ],
    singleRun: true,
    watch: false
  });
};
