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
    const totalAmount = 5000;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('220');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
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
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', '£220.00', '£500.00', '500', '1');
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

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£500.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForFullPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('500.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundReturnText = 'Test Reason Only';
    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, refundReason, '£500.00', emailAddress, '', 'payments probate', 'SendRefund');
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Return to caseworker', refundReturnText);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, '£500.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundReturnToCaseWorker(reviewRefundDetailsDataAfterApproval, refundReturnText);

    await I.Logout();
  }).tag('@pipeline @nightly');
