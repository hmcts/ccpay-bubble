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
      caseTitle : {xpath : '//*[@class = "heading-medium"]'},
      unallocatedPaymentsCount :{xpath : '//table[@class="govuk-table"]/tbody//td[4]'},
      unallocatedPaymentSelectOption : {xpath : '//ccpay-app-unprocessed-payments//tbody/tr[1]//input'},



    },
  // done
  check_bulk_case(case_number, case_title)
  {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validate_transaction_page(case_number);
    I.see(case_title);
  },

   check_bulk_case_success_payment(case_number, case_title,allocation_status)
    {
      I.wait(CCPBConstants.fiveSecondWaitTime);
      this.validate_transaction_page_for_success_payment(case_number,allocation_status);
      I.see(case_title);
    },

  check_for_unallocated_payments(total_dcn, dcn_number,amount,method) {
    I.see(total_dcn);
    I.see(dcn_number);
    I.see(amount);
    I.see(method);

  },

  allocate_to_new_fee() {
    I.checkOption(this.locators.unallocatedPaymentSelectOption)
    I.click('Allocate to a new fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

   allocate_to_transferred() {
      I.checkOption(this.locators.unallocatedPaymentSelectOption)
      I.click('Mark as transferred');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    },

   allocate_to_unidentified() {
          I.checkOption(this.locators.unallocatedPaymentSelectOption)
          I.click('Mark as unidentified');
          I.wait(CCPBConstants.fiveSecondWaitTime);
        },

  validate_transaction_page(case_number)
  {
        I.see(case_number);
        I.see('Total payments');
        I.see('Total remissions');
        I.see('Amount due');
        I.see('Unallocated payments');
        I.see('Unallocated payments');
        I.see('Select');
        I.see('Payment asset number (DCN)');
        I.see('Banked date');
        I.see('Amount');
        I.see('Method');
        I.see('Fees');
        I.see('Code');
        I.see('Description');
        I.see('Volume');
        I.see('Fee amount');
        I.see('Calculated amount');
        I.see('Amount due');
        I.see('Action');
        I.see('No fees recorded');
   },

    validate_transaction_page_for_success_payment(case_number, allocation_status)
     {
           I.see(case_number);
           I.see('Total payments');
           I.see('Total remissions');
           I.see('Amount due');
           I.see('Unallocated payments');
           I.see('Unallocated payments');
           I.see('Select');
           I.see('Payment asset number (DCN)');
           I.see('Banked date');
           I.see('Amount');
           I.see('Method');
           I.see('Fees');
           I.see('Code');
           I.see('Description');
           I.see('Volume');
           I.see('Fee amount');
           I.see('Calculated amount');
           I.see('Amount due');
           I.see('Action');
           I.see(allocation_status);
           I.see('Bulk scan');
           I.see('Success');

      }


}
