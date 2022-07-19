const {getAccessibilityTestResult} = require('./accessibility/runner');
const {generateAccessibilityReport} = require('../accessibility-reporter/customReporter');
const testConfig = require('../tests/config/CCPBConfig.js');

class AccessibilityReportingHelper extends Helper {

  _finishTest() {
    if (!testConfig.TestsForAccessibility) {
      return;
    }
    generateAccessibilityReport(getAccessibilityTestResult());
  }

}
module.exports = AccessibilityReportingHelper;
