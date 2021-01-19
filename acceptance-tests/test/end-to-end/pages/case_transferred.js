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
      transferredReason : {xpath : '//*[@id="reason"]'},
      receivingSiteId : {xpath : '//*[@id="responsibleOffice"]'},
    },


  validate_transferred_page(dcn_number, amount, method)
  {
    I.see('Mark payment as transferred');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Reason for payment being marked as transferred');
    I.see("Receiving Site ID (Receiving court/Bulk centre site ID)");
    I.see(dcn_number);
    I.see(amount);
    I.see(method);
  },

  cancel_payment()
  {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

   confirm_payment(transferred_reason,site_id)
    {
      I.click('Confirm');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    },

    input_transferred_reason(transferred_reason)
    {
     I.fillField(this.locators.transferredReason, transferred_reason);
    },

    select_site_id(site_id)
    {
      I.selectOption(this.locators.receivingSiteId,site_id);
    },

    validate_transferred_confirmation_page(transferred_reason, site_id)
      {
        I.see('Reason');
        I.see('Receiving site ID');
        I.see('Are you sure you want to mark this payment as transferred?');
        I.see(transferred_reason);
        I.see(site_id);
      },

      validate_and_confirm_transferred(transferred_reason, site_id)
      {
          this.input_transferred_reason(transferred_reason);
          this.select_site_id(site_id);
          this.confirm_payment();
          I.wait(CCPBConstants.fiveSecondWaitTime);
          this.validate_transferred_confirmation_page(transferred_reason, site_id)

      },

      cancel_transferred()
      {
        I.click('Cancel');
        I.wait(CCPBConstants.fiveSecondWaitTime);
        I.click('Cancel');
        I.wait(CCPBConstants.fiveSecondWaitTime);
        I.see('Are you sure you want to cancel?');
        I.click('Yes');
      },

      cancel_transferred_reason()
      {
              I.click('Cancel');
              I.wait(CCPBConstants.fiveSecondWaitTime);
              I.see('Are you sure you want to cancel?');
              I.click('Yes');
      },

      error_message_when_no_reason_and_siteid()
      {
       I.see('Enter a reason for marking this payment as transferred.');
       I.see('Please select Receiving Site ID');
      },

      error_message_when_reason_less_than_limit()
            {
             I.see('Reason should be at least 3 characters.');
            },
      }
