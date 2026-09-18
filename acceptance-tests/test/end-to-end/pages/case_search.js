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
    case_transaction_link: { xpath: '//*[@id="ccd-search-link"]' }
  },

  async getHeaderValue() {
    await I.waitForElement(this.locators.header, CCPBConstants.fiveSecondWaitTime);
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

// done
  async searchCaseUsingCcdNumber(caseNumber) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.ccd_field, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.ccd_field, caseNumber);
    await I.pressKey('Enter');
    await I.wait(CCPBConstants.tenSecondWaitTime);
  },

  async searchCaseUsingDcnNumber(dcnNumber) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.dcn_field, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.dcn_field, dcnNumber);
    await I.pressKey('Enter');
    await I.wait(CCPBConstants.tenSecondWaitTime);
  },

  async searchCaseUsingPaymentRef(payReference) {
    await this.validateSearchPage();
    await I.waitForElement(this.locators.payment_ref_ield, CCPBConstants.twentySecondWaitTime);
    await I.fillField(this.locators.payment_ref_ield, payReference);
    await I.pressKey('Enter');
    await I.wait(CCPBConstants.tenSecondWaitTime);
  },

  validateSearchPage() {
    I.waitForText('Search for a case', CCPBConstants.tenSecondWaitTime);
    I.see('Search for a case');
    I.see('Case Transaction');
    I.see('Payment history');
    I.see('Reports');
    I.see('Logout');
  },

  async navigateToCaseTransaction() {
    await I.click(this.locators.case_transaction_link);
    await this.validateSearchPage();
  }
};
