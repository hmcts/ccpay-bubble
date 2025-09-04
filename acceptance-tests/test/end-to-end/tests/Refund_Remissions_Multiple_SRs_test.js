/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const stringUtils = require("../helpers/string_utils");

Feature('CC Pay Bubble Refund Retro Remission journey tests').retry(CCPBATConstants.defaultNumberOfRetries);

// PAY-7868
Scenario('Remissions refunds on Multiple Service requests',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;

    const totalAmount = '1,324.15';
    const totalRemissionAmount = '704.15';
    const serviceRequest1feeAmount = '779.15';
    const serviceRequest1remissionAmount= '259.15';
    const serviceRequest1hwfReference= 'HWF-A1B-23C';

    const serviceRequest2feeAmount = '545.00';
    const serviceRequest2remissionAmount= '445.00';
    const serviceRequest2hwfReference= 'PA21-123456';

    const paymentDetails1 = await apiUtils.createAPBAPayment(serviceRequest1feeAmount, 'FEE0209', '3', 1);
    const ccdCaseNumber = `${paymentDetails1.ccdCaseNumber}`;
    const paymentRCRef1 = `${paymentDetails1.paymentReference}`;

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(serviceRequest1feeAmount, '0', '0.00', '0.00', '0.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.click('Case Transaction');
    const paymentDetails2 = await apiUtils.createAPBAPaymentForExistingCase(serviceRequest2feeAmount, 'FEE0441', '2', 1, ccdCaseNumber);
    const paymentRCRef2 = `${paymentDetails2.payments[1].payment_reference}`;
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');

    // 1st service request Remission refund - 779.15 - 259.15
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[3]');
      I.wait(CCPBATConstants.tenSecondWaitTime);
    }
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, serviceRequest1hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRCRef1, serviceRequest1hwfReference, `£${serviceRequest1remissionAmount}`, `£${serviceRequest1feeAmount}`, `£${serviceRequest1feeAmount}`, 'FEE0209', 'FEE0209 - Money Claims - Claim Amount - 10000.01 up to 200000 GBP. FEE AMOUNT = 5% of claim value',
      emailAddress, '', 'SendRefund', `£${serviceRequest1remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions1 = await InitiateRefunds.verifyRefundSubmittedPage(serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', serviceRequest1remissionAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions1, 'Retrospective remission', serviceRequest1remissionAmount, emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', serviceRequest1remissionAmount);
    await I.click(`//td[contains(.,'${refundRefRemissions1}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefund1DetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions1, paymentRCRef1, 'Retrospective remission', `£${serviceRequest1remissionAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefund1DetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions1, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // 2nd service request Remission refund - 545.00 - 445.00
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', '0.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, serviceRequest2hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData2 = assertionData.checkYourAnswers(paymentRCRef2, serviceRequest2hwfReference, `£${serviceRequest2remissionAmount}`, `£${serviceRequest2feeAmount}`, `£${serviceRequest2feeAmount}`, 'FEE0441', 'FEE0441 - Hearing fee: Fast track case',
      emailAddress, '', 'SendRefund', `£${serviceRequest2remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData2, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData2, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions2 = await InitiateRefunds.verifyRefundSubmittedPage(serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', serviceRequest2remissionAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction2;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction2 = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions2, 'Retrospective remission', `£${serviceRequest2remissionAmount}`, emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction2.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction2);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', serviceRequest2remissionAmount);
    await I.click(`//td[contains(.,'${refundRefRemissions2}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefund2DetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions2, paymentRCRef2, 'Retrospective remission', `£${serviceRequest2remissionAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefund2DetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions2, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');
