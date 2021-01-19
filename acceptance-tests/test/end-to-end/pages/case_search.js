'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const {I} = inject();

const RANDOM_NUMBER = 9999999999999999;

const CCDNumber = faker.random.number(RANDOM_NUMBER);

module.exports =  {
    locators :{
      ccdOption : {xpath : '//*[@id="CCDorException"]'},
      ccdField : {xpath : '//*[@id="ccd-search"]'},
      dcnOption : {xpath : '//*[@id="DCN"]'},
      dcnField : {xpath : '//*[@id="dcn-search"]'},
      paymentOption : {xpath : '//*[@id="RC"]'},
      paymentRefField : {xpath : '//*[@id="RC-search"]'}

    },
  // done
  search_case_using_ccd_number(case_number) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validate_search_page()
    I.checkOption(this.locators.ccdOption)
    I.fillField(this.locators.ccdField, case_number);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  search_case_using_dcn_number(dcn_number) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validate_search_page()
    I.checkOption(this.locators.dcnOption)
    I.fillField(this.locators.dcnField, dcn_number);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  search_case_using_payment_ref(pay_reference) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validate_search_page();
    I.checkOption(this.locators.paymentOption);
    I.fillField(this.locators.paymentRefField, pay_reference);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validate_search_page()
  {
    I.see('Search for a case');
    I.see('Search');
    I.see('Case Transaction');
    I.see('Payment history');
  }

}
