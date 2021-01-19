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
      unidentifiedInvestigation : {xpath : '//*[@id="investicationDetail"]'},
    },


  validate_unidentified_page(dcn_number, amount, method)
  {
    I.see('Mark payment as unidentified');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Give a reason for marking this payment as unidentified.');
    I.see("Include any investigations you've made.");
    I.see(dcn_number);
    I.see(amount);
    I.see(method);
  },

   continue_payment()
    {
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    },

    input_unidentified_comment(unidentified_investigation)
    {
     I.fillField(this.locators.unidentifiedInvestigation, unidentified_investigation);
    },

   validate_unidentified_confirmation_page(unidentified_investigation)
      {
        I.see('Investigations');
        I.see(unidentified_investigation);
        I.see('Are you sure you want to mark this payment as unidentified?');
      },

      validate_and_confirm_unidentified(unidentified_investigation)
      {
          this.input_unidentified_comment(unidentified_investigation);
          this.continue_payment();
          I.wait(CCPBConstants.fiveSecondWaitTime);
          this.validate_unidentified_confirmation_page(unidentified_investigation)

      },

      cancel_unidentified()
      {
        I.click('Cancel');
        I.wait(CCPBConstants.fiveSecondWaitTime);
        I.click('Cancel');
        I.wait(CCPBConstants.fiveSecondWaitTime);
        I.see('Are you sure you want to cancel?');
        I.click('Yes');
      },

      cancel_unidentified_comment()
      {
              I.click('Cancel');
              I.wait(CCPBConstants.fiveSecondWaitTime);
              I.see('Are you sure you want to cancel?');
              I.click('Yes');
      },

      error_message_when_no_investigation()
      {
       I.see('Enter a reason for marking this payment as unidentified.');
       },

      error_message_when_comment_less_than_limit()
            {
             I.see('Reason should be at least 3 characters.');
            },
      }
