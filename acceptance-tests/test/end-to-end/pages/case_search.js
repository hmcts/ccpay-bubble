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
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },


  // done
  searchCaseUsingCcdNumber(caseNumber) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage();
    I.checkOption(this.locators.ccd_option);
    I.fillField(this.locators.ccd_field, caseNumber);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  searchCaseUsingDcnNumber(dcnNumber) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage();
    I.checkOption(this.locators.dcn_option);
    I.fillField(this.locators.dcn_field, dcnNumber);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  searchCaseUsingPaymentRef(payReference) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage();
    I.checkOption(this.locators.payment_option);
    I.fillField(this.locators.payment_ref_ield, payReference);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validateSearchPage() {
    I.see('Search for a case');
    I.see('Search');
    I.see('Case Transaction');
    I.see('Payment history');
  },

  navigateToCaseTransaction() {
    I.click(this.locators.case_transaction_link);
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }


};
