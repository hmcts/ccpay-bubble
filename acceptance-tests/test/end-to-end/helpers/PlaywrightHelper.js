/* eslint-disable */
const Helper = codecept_helper;
const testConfig = require('../tests/config/CCPBConfig.js');
const { runAccessibility } = require('./accessibility/runner');

class CustomHelper extends Helper {

  async runAccessibilityTest() {
    if (!testConfig.TestsForAccessibility) {
      return;
    }
    const url = await this.helpers['playwright'].grabCurrentUrl();
    const {page} = await this.helpers['playwright'];

    runAccessibility(url, page);
  }

}

module.exports = CustomHelper;
