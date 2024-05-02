/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Refund Rejected journey test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('OverPayment Refund Rejected journey',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 500;
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
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£220.00', 'Over payment', '£280.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('280.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'SendRefund');
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Reject');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterRejection = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundRejected(reviewRefundDetailsDataAfterRejection);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');
