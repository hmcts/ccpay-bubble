/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const AddFees = require("../pages/add_fees");
const stringUtils = require("../helpers/string_utils");

Feature('CC Pay Bubble Refund Retro Remission journey test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Refund journey for complete cheque amount(500) with OverPayment option(280), Remission(100) and Refund(120) and Liberata rejected System approved RefundWhenContacted notification',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('220');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    //  Over Payment refund - 280
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.tenSecondWaitTime);
    }
    I.waitForText('Issue refund', 5);
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
    const refundRefOverPayments = await InitiateRefunds.verifyRefundSubmittedPage('280.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    //  remission refund - 100
    // I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    // await I.click('(//*[text()[contains(.,"Review")]])[2]');
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '£500.00', '£220.00', 'FEE0373', 'FEE0373 - Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.',
    //   emailAddress, '', 'SendRefund');
    // InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // InitiateRefunds.verifyRemissionSubmittedPage();
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.click('//*[@id="email"]');
    // I.fillField('//*[@id="email"]', emailAddress);
    // I.click('Continue');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
    // I.wait(CCPBATConstants.tenSecondWaitTime);

    // Refund with reason - 120
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Issue refund', 5);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', '£220.00', '£220.00', '120', '1');
    await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelection(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReason = 'System/technical error';
    await InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, refundReason);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersDataBeforeSubmitRefund2 = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£120.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund2, false, false, false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('120.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve all 3 refunds from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;


    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefOverPayments, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.amOnPage('/refund-list?takePayment=false&refundlist=true');

    // for (let i = 0; i <= 2; i++) {
    //   I.wait(CCPBATConstants.fifteenSecondWaitTime);
    //   if (i == 0) {
    //     refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefOverPayments, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'SendRefund');
    //   }
    //   // if (i == 1) {
    //   //   refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'SendRefund');
    //   // }
    //   // if (i == 2) {
    //   //   refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, refundReason, '£120.00', emailAddress, '', 'payments probate', 'SendRefund');
    //   // }
    //   await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    //   I.wait(CCPBATConstants.twoSecondWaitTime);
    //   InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    //   InitiateRefunds.approverActionForRequestedRefund('Approve');
    //   I.wait(CCPBATConstants.twoSecondWaitTime);
    //   I.amOnPage('/refund-list?takePayment=false&refundlist=true');
    // }

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // // Review approved refunds from Case transactions page
    // I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // await CaseTransaction.validateTransactionPageForOverPaymentsRemissionsRefunds(refundRef, refundRefRemissions, refundRefOverPayments);
    // await I.click(`//td[contains(.,'${refundRefOverPayments}')]/following-sibling::td/a[.=\'Review\'][1]`);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // const reviewOverPaymentRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefOverPayments, paymentRcReference, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'approver probate');
    // await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewOverPaymentRefundDetailsDataAfterApproval);
    // I.click('Back');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    // await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);
    // I.click('Back');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£120.00', emailAddress, '', 'payments probate', 'approver probate');
    // await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval);
    // I.click('Back');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    //
    // // Update refund reference with Rejection (called by Liberata) for System approved RefundWhenContacted email notification verification
    // await apiUtils.updateRefundStatusByRefundReference(refundRef, '', 'ACCEPTED');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // await apiUtils.updateRefundStatusByRefundReference(refundRef, 'Unable to apply refund to Card', 'REJECTED');
    //
    // await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // const reviewRefundDetailsData = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£120.00', emailAddress, '', 'payments probate', 'approver probate');
    // const refundNotificationPreviewData = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRef, '120', 'Due to a technical error a payment was taken incorrectly and has now been refunded');
    //
    // await RefundsList.verifyRefundDetailsAfterLiberataRejection(reviewRefundDetailsData, true, refundNotificationPreviewData);
    //
    // await I.Logout();
    // I.clearCookie();
  }).tag('@pipeline @nightly');

Scenario('Fully Paid Fee with Retro Remission CAN be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 273;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£273.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    AddFees.addFeesAmount('273.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', '273.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0219', '1', '£273.00', '£273.00');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '£100.00');
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    //  remission refund - 100
    await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '173.00', '£273.00', 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'SendRefund');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;


    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly @debug');

Scenario('Partially Paid Fee with Retro Remission resulting in a ZERO Balance Due CAN NOT be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 173;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£173.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    AddFees.addFeesAmount('273.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', '273.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1',
      '£173.00', '£273.00', '£273.00', '£100.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '£100.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    //  remission refund - 100
    await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '173.00', '£273.00', 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'SendRefund');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(false);

    I.click('Return to case');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Payment details', 5);
    // verify that Add refund button is disabled for the remission
    I.dontSeeElement('Add refund')

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly @debug');
