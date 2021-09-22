'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    payment_success_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' }
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyCaseTransactionPage(entrypoint) {
    I.waitForText('Case transactions','5');
    I.see('Payments');
    I.see('Refunds');
    if (entrypoint == 'Payments') {
      I.click(this.locator.payment_success_review);
    } else {
      I.click(service_requests_review);
    }
    I.wait(CCPBConstants.twoSecondWaitTime);
  },

  verifyPaymentDetailsPage(typeOfRefund) {
      I.waitForText('Payment details','5');
      I.waitForText('Payment status history','5');
      I.see('Issue refund');
      I.waitForText('Fee and remission details','5');
      I.click(typeOfRefund);
      I.wait(CCPBConstants.twoSecondWaitTime);
    },

  verifyProcessRefundPage() {
      I.waitForText('Process refund','5');
      I.see('Why are you making this refund','5');
      //I.selectOption('','Amended claim');
      I.click('Continue');
    },

  verifyCheckYourAnswersPageForIssueRefund(reasonForRefund, paymentReference, paymentAmount) {
      I.waitForText('Check your answers','5');
      I.waitForText('Reason for refund','5');
      I.see(reasonForRefund);
      I.waitForText('Payment reference','5');
      I.see(paymentReference);
      I.waitForText('Payment Amount','£'+paymentAmount);
      I.click('Submit refund');
    },

    verifyRefundConfirmationPage(paymentAmount) {
      I.waitForText('Refund Submitted','5');
      I.see('Refund reference:RF-');
      I.see('A refund request for £'+paymentAmount+'has been passed to a team leader to approve');
      I.see('Return to case');
      I.click('Return to case');
    },

    verifyServiceRequestPage() {
      I.waitForText('Service request','5');
      I.see('Total reductions: £');
      I.see('Total fees to pay: £')
      I.see('Payments');
      I.see('Total left to pay: £')
      I.click('Issue refund');
    },

    verifyServiceRequestPage() {
      I.waitForText('Service request','5');
      I.see('Total reductions: £');
      I.see('Total fees to pay: £')
      I.see('Payments');
      I.see('Total left to pay: £')
      I.click('Issue refund');
    },

    verifyProcessRemissionHWFCodePage(ccd_case_number, hwfReference) {
      I.waitForText('Process remission','5');
      I.see('#'+ccd_case_number);
      I.see('Enter help with fees or remission reference')
      I.see('For example: HWF-A1B-23C');
      this.fillField('textarea[id="remissionCode"]', hwfReference);
      I.click('Continue');
    },

    verifyProcessRemissionAmountPage(ccd_case_number,remissionAmount) {
        I.waitForText('Process remission','5');
        I.see('#'+ccd_case_number);
        I.see('Enter the amount to be refunded')
        this.fillField('textarea[id="amount"]', remissionAmount);
        I.click('Continue');
    },

    verifyCheckYourAnswersPageForAddRemission(paymentReference, paymentAmount, hwfReference, refundAmount) {

        I.waitForText('Check your answers','5');
        I.see('Payment reference');
        I.see(paymentReference);
        I.see('Payment amount');
        I.see('£'+paymentAmount);
        I.see('Payment status');
        I.see('Success');
        I.see('Fee');
        I.see('FEE0226 - Personal Application for grant of Probate');
        I.see('Help with fees or remission reference');
        I.see(hwfReference);
        I.see('Refund amount');
        I.see('£'+refundAmount);
        this.click({xpath: '//td[.="'+hwfReference+'"]/following-sibling::td/a[.="Change"]'});
        //TODO - Verify Populated Process Remission HWF Code Page.
        verifyProcessRemissionHWFCodePage('','HWF-A1B-23D');
        //TODO - Verify Populated Process Remission Amount Page.
        this.click({xpath: '//td[.="'+hwfReference+'"]/following-sibling::td/a[.="Change"]'});
        verifyProcessRemissionAmountPage('','10.00')
        I.click('Add remission');

    },

    verifyProcessRemissionAmountPage(ccd_case_number,remissionAmount) {
        I.waitForText('Process remission','5');
        I.see('#'+ccd_case_number);
        I.see('Enter the amount to be refunded')
        this.fillField('textarea[id="amount"]', remissionAmount);
        I.click('Continue');
    },

    issueRefundJourney(entrypoint) {

      verifyCaseTransactionPage(entrypoint);
      verifyPaymentDetailsPage('Issue Refund');
      verifyProcessRefundPage();
      verifyCheckYourAnswersPageForIssueRefund();
      verifyRefundConfirmationPage();
   },

   addRemissionRefundJourney(entrypoint) {
      verifyCaseTransactionPage(entrypoint);
      verifyPaymentDetailsPage('Add remission');
   }
};
