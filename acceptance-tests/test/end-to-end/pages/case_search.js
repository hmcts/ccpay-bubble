'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const {I} = inject();

module.exports = {
  locators: {
    ccd_option: {xpath: '//*[@id="CCDorException"]'},
    ccd_field: {xpath: '//*[@id="ccd-search"]'},
    dcn_option: {xpath: '//*[@id="DCN"]'},
    dcn_field: {xpath: '//*[@id="dcn-search"]'},
    payment_option: {xpath: '//*[@id="RC"]'},
    payment_ref_ield: {xpath: '//*[@id="RC-search"]'}

  },
  // done
  searchCaseUsingCcdNumber(case_number) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage()
    I.checkOption(this.locators.ccd_option)
    I.fillField(this.locators.ccd_field, case_number);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  searchCaseUsingDcnNumber(dcn_number) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage()
    I.checkOption(this.locators.dcn_option)
    I.fillField(this.locators.dcn_field, dcn_number);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  searchCaseUsingPaymentRef(pay_reference) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateSearchPage();
    I.checkOption(this.locators.payment_option);
    I.fillField(this.locators.payment_ref_ield, pay_reference);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validateSearchPage() {
    I.see('Search for a case');
    I.see('Search');
    I.see('Case Transaction');
    I.see('Payment history');
  }

}
