'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const {I} = inject();

const RANDOM_NUMBER = 9999999999999999;

const CCDNumber = faker.random.number(RANDOM_NUMBER);

module.exports =  {
  verify_fee_summary()
  {
           I.see('Fee Summary');
           I.see('FEE0002');
           I.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
           I.see('Fee amount');
           I.see('Volume');
           I.see('Fee total');
           I.see('Remission amount');
           I.see('Total after remission');
           I.see('Total payment');
           I.see('Total outstanding amount');
           I.dontSee('What service is this fee for?');
  },

   allocate_bulk_payment()
   {
     I.click('Allocate payment');
     I.wait(CCPBConstants.fiveSecondWaitTime);
   },

   remove_fees()
   {
         I.click('remove fee');
         I.wait(CCPBConstants.fiveSecondWaitTime);
         I.see('Are you sure you want to delete this fee?');
         I.click('Remove');
         I.wait(CCPBConstants.fiveSecondWaitTime);
   }



}
