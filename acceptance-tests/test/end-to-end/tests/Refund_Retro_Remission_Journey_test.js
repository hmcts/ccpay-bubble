/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const stringUtils = require("../helpers/string_utils");

Feature('CC Pay Bubble Refund Retro Remission journey tests').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Fully Paid Fee with Retro Remission CAN have Full Remission Refunded',
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
    await AddFees.addFeesAmount('273.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', '273.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0219', '1', '£273.00', '£273.00');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails('£273.00', '0', '£0.00', '£0.00', '£0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '273.00', '£273.00', 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
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
    await CaseTransaction.validateCaseTransactionsDetails('£273.00', '0', '£100.00', '£0.00', '£100.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

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
    await CaseTransaction.validateCaseTransactionsDetails('£273.00', '0', '£100.00', '£0.00', '£100.00');
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£273.00', '0', '£100.00', '£0.00', '£0.00');

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a ZERO Balance Due CAN NOT be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 173;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£173.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount('273.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', '273.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1',
      '£173.00', '£273.00', '£273.00', '£100.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '£100.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails('£173.00', '0', '£0.00', '£100.00', '£0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
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
    await CaseTransaction.validateCaseTransactionsDetails('£173.00', '0', '£100.00', '£0.00', '£0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Payment details', 5);
    // verify that Add refund button is disabled for the remission
    I.dontSeeElement('Add refund')

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a NEGATIVE Balance Due CAN NOT be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 150;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£150.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount('273.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', '273.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1',
      '£150.00', '£273.00', '£273.00', '£123.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '£123.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails('£150.00', '0', '£0.00', '£123.00', '£0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '150.00', '£273.00', 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'SendRefund');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(false);

    I.click('Return to case');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await CaseTransaction.validateCaseTransactionsDetails('£150.00', '0', '£100.00', '£23.00', '£0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Payment details', 5);
    // verify that Add refund button is disabled for the remission
    I.dontSeeElement('Add refund')

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a POSITIVE Balance Due CAN have the Remission Refunded - (positive balance value)',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 200;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£200.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount('237.00', 'civil', 'civil');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0475', '237.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0475', '1',
      '£200.00', '£237.00', '£237.00', '£37.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '£37.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    //  remission refund - 100
    await CaseTransaction.validateCaseTransactionsDetails('£200.00', '0', '£0.00', '£37.00', '£0.00');
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '200.00', '£237.00', 'FEE0475', 'FEE0475 - Where the party filing the request is legally aided',
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
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('63.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£200.00', '0', '£100.00', '£0.00', '£63.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£63.00', emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£200.00', '0', '£100.00', '£0.00', '£63.00');
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£63.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£200.00', '0', '£100.00', '£0.00', '£0.00');

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');
