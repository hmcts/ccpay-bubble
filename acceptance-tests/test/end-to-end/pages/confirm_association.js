'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const {I} = inject();

const RANDOM_NUMBER = 9999999999999999;

const CCDNumber = faker.random.number(RANDOM_NUMBER);

module.exports =  {

    verify_confirm_association_for_full_payment()
        {
           I.see('Confirm association');
           I.see('Amount to be allocated: £550.00');
           I.see('Code');
           I.see('Description');
           I.see('Volume');
           I.see('Fee amount');
           I.see('Calculated amount');
           I.see('Amount Due')
           I.see('FEE0002');
           I.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
           I.see('£550.00');
           I.see('Amount left to be allocated £0.00');
           I.see('Confirm');

  },

  verify_confirm_association_for_short_fall_payment()
          {
             I.see('Confirm association');
             I.see('Amount to be allocated: £500.00');
             I.see('Code');
             I.see('Description');
             I.see('Volume');
             I.see('Fee amount');
             I.see('Calculated amount');
             I.see('Amount Due')
             I.see('FEE0002');
             I.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
             I.see('£550.00');
             I.see('There is a shortfall of £50.00');
             I.see('Provide a reason');
             I.see('Help with Fees (HWF) application declined');
             I.see('ncorrect payment received');
             I.see('Other');
             I.see('Provide an explanatory note');
             I.see('I have put a stop on the case and contacted the applicant requesting the balance of payment');
             I.see('I have put a stop on the case. The applicant needs to be contacted to request the balance of payment');
             I.see('Enter your name');
             I.see('Confirm');

    },

   verify_confirm_association_for_surplus_payment()
           {
              I.see('Confirm association');
              I.see('Amount to be allocated: £550.00');
              I.see('Code');
              I.see('Description');
              I.see('Volume');
              I.see('Fee amount');
              I.see('Calculated amount');
              I.see('Amount Due')
              I.see('FEE0002');
              I.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
              I.see('£550.00');
              I.see('There is a surplus of £50.00');
              I.see('Provide a reason. This will be used in the Refund process.');
              I.see('Help with Fees (HWF) awarded. Please include the HWF reference number in the explanatory note');
              I.see('Incorrect payment received');
              I.see('Unable to issue case');
              I.see('Other');
              I.see('Provide an explanatory note');
              I.see('Details in case notes. Refund due');
              I.see('Details in case notes. No refund due');
              I.see('No case created. Refund due');
              I.see('Enter your name');
              I.see('Confirm');

     },

  cancel_payment()
  {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }

}
