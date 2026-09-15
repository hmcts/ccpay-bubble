'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {
  locators: {
    ccd_option: { xpath: '//*[@id="CCDorException"]' },
    ccd_field: { xpath: '//*[@id="ccd-search"]' },
    dcn_option: { xpath: '//*[@id="DCN"]' },
    dcn_field: { xpath: '//*[@id="dcn-search"]' },
    payment_option: { xpath: '//*[@id="RC"]' },
    payment_ref_ield: { xpath: '//*[@id="RC-search"]' },
    header: { xpath: '//h1' },
    case_transaction_link: { xpath: '//*[@id="ccd-search-link"]' },
    search_button: { css: 'form button[type="submit"]' }
  },

  async getHeaderValue() {
    await I.waitForElement(this.locators.header, CCPBConstants.fiveSecondWaitTime);
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  // done
  async searchCaseUsingCcdNumber(caseNumber) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.ccd_option, CCPBConstants.twentySecondWaitTime);
    await I.checkOption(this.locators.ccd_option);
    await I.waitForElement(this.locators.ccd_field, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.ccd_field, caseNumber);
    await I.waitForClickable(this.locators.search_button, CCPBConstants.twentySecondWaitTime);
    await I.click(this.locators.search_button);
  },

  async searchCaseUsingDcnNumber(dcnNumber) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.dcn_option, CCPBConstants.twentySecondWaitTime);
    await I.checkOption(this.locators.dcn_option);
    await I.waitForElement(this.locators.dcn_field, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.dcn_field, dcnNumber);
    await I.waitForClickable(this.locators.search_button, CCPBConstants.twentySecondWaitTime);
    await I.click(this.locators.search_button);
  },

  async searchCaseUsingPaymentRef(payReference) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.payment_option, CCPBConstants.twentySecondWaitTime);
    await I.checkOption(this.locators.payment_option);
    await I.waitForElement(this.locators.payment_ref_ield, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.payment_ref_ield, payReference);
    await I.waitForClickable(this.locators.search_button, CCPBConstants.twentySecondWaitTime);
    await I.click(this.locators.search_button);
  },

  async validateSearchPage() {
    await I.waitForText('Search for a case', CCPBConstants.tenSecondWaitTime);
    await I.see('Search for a case');
    await I.see('Case Transaction');
    await I.see('Payment history');
    await I.see('Reports');
    await I.see('Logout');
  },

  async navigateToCaseTransaction() {
    await I.click(this.locators.case_transaction_link);
    await this.validateSearchPage();
  }
};
