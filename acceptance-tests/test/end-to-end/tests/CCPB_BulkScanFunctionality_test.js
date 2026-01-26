/* eslint-disable no-alert, no-console, object-curly-newline */
const { Logger } = require('@hmcts/nodejs-logging');

const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const logger = Logger.getLogger('CCPB_BulkScanFunctionality_test.js');

const bulkScanApiCalls = require('../helpers/utils');

const miscUtils = require('../helpers/misc');

const stringUtils = require('../helpers/string_utils');

const testConfig = require('./config/CCPBConfig');
const apiUtils = require("../helpers/utils");
const assertionData = require("../fixture/data/refunds/assertion");

// const successResponse = 202;

// eslint-disable max-len

Feature('CC Pay Bubble Bulk Scan Acceptance Tests').retry(CCPBATConstants.defaultNumberOfRetries);

// #region Normal CCD case bulk scan functional cases
Scenario('Normal ccd case cash payment full allocation', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory }) => {
  // logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '612.00';
  const feeAmount = '612.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  logger.info(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  await I.runAccessibilityTest();
  // I.waitInUrl(`/payment-history/${ccdCaseNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBATConstants.nineSecondWaitTime);
  // I.waitForNavigation(0,"domcontentloaded");
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cash');
  CaseTransaction.allocateToNewFee();
  await AddFees.addFeesAmount(feeAmount, 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount, true);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '1', totalAmount, feeAmount);
  await I.runAccessibilityTest();
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  await I.runAccessibilityTest();
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage(totalAmount, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateCcdPaymentDetails(receiptReference, totalAmount, dcnNumber, 'success', 'Cash', 'FEE0002');
  await I.runAccessibilityTest();
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cheque payment full allocation to existing service request', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '612.00';
  const feeAmount = '612.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  logger.info(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  await I.runAccessibilityTest();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  I.waitForClickable({ xpath: '//button[contains(text() , "Allocate to new service request")]' });
  I.seeElement({ xpath: '//button[contains(text() , "Allocate to existing service request") and contains(@class, "button--disabled")]' });
  I.click('Create service request and pay');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await AddFees.addFeesAmount(feeAmount, 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount, false);
  I.click('Back');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.waitForClickable({ xpath: '//button[contains(text() , "Allocate to existing service request")]' });
  I.seeElement({ xpath: '//button[contains(text() , "Allocate to new service request") and contains(@class, "button--disabled")]' });
  CaseTransaction.allocateToExistingServiceRequest(totalAmount);
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount, true);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '1', totalAmount, feeAmount);
  await I.runAccessibilityTest();
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  await I.runAccessibilityTest();
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage(totalAmount, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateCcdPaymentDetails(receiptReference, totalAmount, dcnNumber, 'success', 'Cheque', 'FEE0002');
  await I.runAccessibilityTest();
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cheque payment partial allocation 2 fees added with a Remission on the first Fee', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, Remission }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '512.00';
  const remissionAmount = '100.00';
  const feeAmount1 = '612.00';
  const feeAmount2 = '22.00';
  const shortfallAmount = '22.00'; //2nd fee is added after totalAmount satisfied with 1st fee and upfront remission 612-100 = 512
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  logger.info(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  // I.waitInUrl(`/payment-history/${ccdCaseNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBATConstants.nineSecondWaitTime);
  // I.waitForNavigation();
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToNewFee();
  await AddFees.addFeesAmount(feeAmount1, 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount1, false);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  FeesSummary.deductRemission();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  Remission.verifyAddRemissionPageText();
  Remission.verifyNoRemissionCodeOrAmountErrorMessages();
  Remission.remissionAmountExceed('1000');
  Remission.processRemission('FEE0002', totalAmount);
  Remission.confirmProcessRemission();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  FeesSummary.verifyFeeSummaryAfterRemission('FEE0002', feeAmount1, remissionAmount, totalAmount);
  FeesSummary.addFeeFromSummary();
  await AddFees.addFees(feeAmount2, 'civil', 'magistrates_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0345', feeAmount2, true);
  I.wait(CCPBATConstants.tenSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '1', totalAmount, feeAmount1, feeAmount1, shortfallAmount);
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0345', '1', totalAmount, feeAmount2, feeAmount2, shortfallAmount);
  ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  await CaseTransaction.validatePaymentDetailsPageForRemission('HWF-A1B-23C', 'FEE0002', remissionAmount);
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cash payment transferred', async({ I, CaseSearch, CaseTransaction, CaseTransferred, PaymentHistory }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '593.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  logger.info(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, totalAmount, 'Cash');
  await I.runAccessibilityTest();
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Transferred');
  await I.runAccessibilityTest();
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage(totalAmount, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, totalAmount, dcnNumber, 'Cash');
  I.Logout();
}).tag('@pipeline @nightly');

// #endregion

Scenario('Exception ccd case cash payment transferred', async({ I, CaseSearch, CaseTransaction, CaseTransferred }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '593.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, totalAmount, 'Cheque');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Transferred');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  // Search using receipt number
  const receiptSearch = await CaseTransaction.getReceiptReference();
  CaseSearch.navigateToCaseTransaction();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptSearch);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Transferred');
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('DCN Search for ccd case associated with exception postal order payment transferred', async({ I, CaseSearch, CaseTransaction, CaseTransferred }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '600.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA09', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumber = ccdAndDcn[1];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, dcnNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'postal order');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, totalAmount, 'Postal Order');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Transferred');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cash payment transferred when no valid reason or site id selected', async({ I, CaseSearch, CaseTransaction, CaseTransferred }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '593.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.confirmPayment();
  CaseTransferred.whenNoReasonAndSiteid();
  CaseTransferred.selectSiteId('Basildon Combined Court - Crown (W802)');
  await I.runAccessibilityTest();
  CaseTransferred.inputTransferredReason('ab');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransferred.whenReasonLessThanLimit();
  CaseTransferred.cancelTransferredReason();
  await I.runAccessibilityTest();
  I.Logout();
}).tag('@nightly');

Scenario('Exception Case Cheque Payment Unidentified', async({ I, CaseSearch, CaseTransaction, CaseUnidentified, PaymentHistory }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '593.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.validateUnidentifiedPage(dcnNumber, totalAmount, 'Cheque');
  await I.runAccessibilityTest();
  CaseUnidentified.validateAndConfirmUnidentified('auto unidentified reason');
  CaseUnidentified.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Unidentified');
  await I.runAccessibilityTest();
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage(totalAmount, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, totalAmount, dcnNumber, 'Cheque');
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Exception Case DCN Search Cheque Payment Unidentified when no or less investigation comment provided', async({ I, CaseSearch, CaseTransaction, CaseUnidentified }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '593.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, dcnNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.continuePayment();
  CaseUnidentified.whenNoInvestigation();
  CaseUnidentified.inputUnidentifiedComment('ta');
  CaseUnidentified.continuePayment();
  await I.runAccessibilityTest();
  CaseUnidentified.whenCommentLessThanLimit();
  CaseUnidentified.cancelUnidentifiedComment();
  I.Logout();
}).tag('@nightly');

Scenario('Ccd case search with exception record postal order payment shortfall payment',
  async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary,
    ConfirmAssociation, PaymentHistory }) => {
    I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
    const feeAmount = '612.00';
    const totalAmount = '512.00';
    const shortFallAmount = '100.00';
    const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA08', totalAmount, 'PostalOrder');
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    logger.info(`The DCN Number from the Test : ${dcnNumber}`);
    logger.info(`The Real CCD Case Number from the Test : ${ccdCaseNumber}`);
    logger.info(`The Exception CCD Case Number from the Test : ${ccdAndDcn[2]}`);
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'postal order');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount(feeAmount, 'family', 'family_court');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '1',
      totalAmount, feeAmount, feeAmount, shortFallAmount);
    ConfirmAssociation.confirmPayment();
    ConfirmAssociation.verifyConfirmAssociationShortfallPaymentErrorMessages();
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', shortFallAmount);
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    // Search using receipt number
    const receiptSearch = await CaseTransaction.getReceiptReference();
    CaseSearch.navigateToCaseTransaction();
    logger.info(`The value of the Payment Reference : ${receiptSearch}`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptSearch);
    CaseTransaction.checkBulkCaseSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid');
    PaymentHistory.navigateToPaymentHistory();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptSearch);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    PaymentHistory.verifyPaymentHistoryPage(totalAmount, receiptSearch);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@nightly @pipeline');

Scenario('Exception search with ccd record postal order payment surplus payment', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '700.00';
  const feeAmount = '612.00';
  const surplusAmount = '88.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA07', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const exNumber = ccdAndDcn[2];
  const ccdCaseNumber = ccdAndDcn[1];
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, exNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'postal order');
  CaseTransaction.allocateToNewFee();
  await AddFees.addFeesAmount(feeAmount, 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', feeAmount, true);
  // FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationSurplusPayment('FEE0002', feeAmount, surplusAmount);
  ConfirmAssociation.selectSurplusReasonOtherExplainatoryAndUser('Help with Fees awarded', 'Other explainatory note', 'Auto Comment');
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSurplusOrShortfallSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Fully Paid Fee with Upfront Remission can not have upfront remission refunded but the payment', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, Remission, InitiateRefunds }) => {
  I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
  const totalAmount = '200.00';
  const feeAmount = '300.00';
  const remissionAmount = '100.00';
  const bulkScanPaymentMethod = 'cheque';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  logger.info(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToNewFee();
  await AddFees.addFeesAmount('300.00', 'family', 'probate_registry');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', feeAmount, false);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  FeesSummary.deductRemission();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  Remission.processRemission('FEE0219', totalAmount);
  Remission.confirmProcessRemission();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  FeesSummary.verifyFeeSummaryAfterRemission('FEE0219', feeAmount, remissionAmount, totalAmount);
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0219', '1', totalAmount, feeAmount);
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '0.00');
  await CaseTransaction.validatePaymentDetailsPageForRemission('HWF-A1B-23C', 'FEE0219', remissionAmount);
  I.click('Back');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  //  remission refund - 100
  await I.click('(//*[text()[contains(.,"Review")]])[2]');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
  if (I.dontSeeElement('Issue refund')) {
    console.log('found disabled button');
    await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }
  I.dontSeeElement('Add remission');
  I.dontSeeElement('Add refund');
  I.seeElement({ xpath: '//button[contains(text(), "Issue refund")]' });
  I.click('Issue refund');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£300.00', '£300.00', '200', '1', '£100.00');
  await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelectionWithRemissionAmount(reviewProcessRefundPageData, ccdCaseNumber);
  I.click('Continue');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const refundDropDownReason = 'Other - CoP';
  const reasonText = 'Auto test';
  await InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasonsAndContinue(ccdCaseNumber, refundDropDownReason, reasonText);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click('//*[@id="contact-2"]');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.click('//*[@id="address-postcode"]');
  const postcode = 'TW4 7EZ';
  I.fillField('//*[@id="address-postcode"]', postcode);
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.click('Find address');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
  I.click('Continue');
  I.wait(CCPBATConstants.fiveSecondWaitTime);

  const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£200.00', '', refundDropDownReason + '-' + reasonText, '£200.00', '', postcode, 'RefundWhenContacted');
  const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, 'RF-****-****-****-****', '200', 'Other', bulkScanPaymentMethod);

  await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, false, false, refundNotificationPreviewDataBeforeRefundRequest);
  await InitiateRefunds.verifyRefundSubmittedPage('200.00');
  await I.Logout();
}).tag('@pipeline @nightly');

//Scenario('Download reports in paybubble', ({ I, Reports }) => {
//  logger.info('Here is the Logger');
//  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
//  Reports.navigateToReports();
//  Reports.validateReportsPage();
//  Reports.selectReportAndDownload('Data loss');
//  Reports.selectReportAndDownload('Unprocessed transactions');
//  Reports.selectReportAndDownload('Processed unallocated');
//  Reports.selectReportAndDownload('Under payment and Over payment');
//  Reports.selectReportAndDownload('Payment failure event');
//  Reports.selectReportAndDownload('Telephony Payments');
//  Reports.selectReportAndDownload('Refunds');
//  I.Logout();
//}).tag('@pipeline @nightly');
