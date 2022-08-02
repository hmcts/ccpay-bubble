/* eslint-disable */
const Helper = codecept_helper;
const testConfig = require('../tests/config/CCPBConfig.js');
const { runAccessibility } = require('./accessibility/runner');

class CustomHelper extends Helper {

  async runAccessibilityTest() {
    if (!testConfig.TestsForAccessibility) {
      return;
    }
    const url = await this.helpers['Puppeteer'].grabCurrentUrl();
    const {page} = await this.helpers['Puppeteer'];

    runAccessibility(url, page);
  }

}

module.exports = CustomHelper;
