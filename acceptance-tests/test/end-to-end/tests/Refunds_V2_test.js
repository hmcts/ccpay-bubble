/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');
const assert = require('assert');

// eslint-disable-next-line no-unused-vars

const apiUtils = require('../helpers/utils');
const assertionData = require('../fixture/data/refunds/assertion');
const stringUtil = require('../helpers/string_utils.js');

const testConfig = require('./config/CCPBConfig');

const numberOfRefundsTestRetries = 4;

Feature('CC Pay Bubble Refunds V2 Tests').retry(numberOfRefundsTestRetries);

// Bulk scan cash overpayment refund option, email notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario('Bulk scan cash Over Payment refund, preview RefundWhenContacted email notification and Resend Notification journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const bulkScanPaymentMethod = 'cash';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 500;

    // Create Payment and back date for refund eligibility
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
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
    // Submit refund
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£200.00', 'Over payment', '£300.00', emailAddress, '', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    // I.click('Refund List'); // Refund List menu is hidden on paybubble, navigating to the refund-list page itself -- see above url
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction, true, refundNotificationPreviewDataBeforeRefundApproved);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Verify the email from notify
    const emailResponse = await apiUtils.getEmailFromNotifyWithMaxRetries(emailAddress);
    assert.strictEqual('HMCTS refund request approved', emailResponse.subject);

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly @debug');
