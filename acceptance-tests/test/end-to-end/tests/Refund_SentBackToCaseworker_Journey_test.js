/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Refund Sent back to caseworker journey test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('FullPayment Refund Send To Caseworker journey',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const bulkScanPaymentMethod = 'cheque';
    const totalAmount = '500.00';
    const feeAmount = '227.00';
    const fullPaymentRefundAmount = '500.00';
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    let paymentRcReference;
    let refundReference;

    await I.useLoggedInSession('refund-requestor', testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword, '/', async () => {
      await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await CaseTransaction.validateTransactionPageForOverPayments();
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await AddFees.addFeesOverPayment(feeAmount);
      I.wait(CCPBATConstants.tenSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
      if (I.dontSeeElement('Issue refund')) {
        console.log('found disabled button');
        await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
        I.click('Back');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        await I.click('(//*[text()[contains(.,"Review")]])[2]');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
      }
      I.click('Issue refund');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.click('//*[@id="full-payment"]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.click('Continue');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for applications which attract fees 1.1, 1.2', `£${feeAmount}`, `£${totalAmount}`, fullPaymentRefundAmount, '1', '£0.00');
      await InitiateRefunds.verifyProcessRefundSelectionPageForFullPaymentOption(reviewProcessRefundPageData, ccdCaseNumber);
      I.click('Continue');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      const refundReason = 'System/technical error';
      await InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, refundReason);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.click('//*[@id="email"]');
      I.fillField('//*[@id="email"]', emailAddress);
      I.click('Continue');
      I.wait(CCPBATConstants.fiveSecondWaitTime);

      const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, `£${totalAmount}`, '', refundReason, `£${fullPaymentRefundAmount}`, emailAddress, '', 'RefundWhenContacted');
      await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForFullPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund);
      refundReference = await InitiateRefunds.verifyRefundSubmittedPage(fullPaymentRefundAmount);
    });

    // Approve refund
    const refundReason = 'System/technical error';
    await I.useLoggedInSession('refund-approver', testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true', async () => {
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      await InitiateRefunds.verifyRefundsListPage(refundReference);
      I.wait(CCPBATConstants.twoSecondWaitTime);

      const refundReturnText = 'Test Reason Only';
      const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, refundReason, `£${fullPaymentRefundAmount}`, emailAddress, '', 'payments probate', 'RefundWhenContacted');
      InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
      InitiateRefunds.approverActionForRequestedRefund('Return to caseworker', refundReturnText);
    });

    // Review refund from case transaction page
    await I.useLoggedInSession('refund-requestor', testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword, '/', async () => {
      const refundReturnText = 'Test Reason Only';
      await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[3]');
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, `£${fullPaymentRefundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
      await RefundsList.verifyRefundDetailsAfterRefundReturnToCaseWorker(reviewRefundDetailsDataAfterApproval, refundReturnText);
    });
  }).tag('@pipeline @nightly');
