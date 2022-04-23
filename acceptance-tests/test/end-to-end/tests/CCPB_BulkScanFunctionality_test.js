/* eslint-disable no-alert, no-console */
const {Logger} = require('@hmcts/nodejs-logging');

const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const logger = Logger.getLogger('CCPB_BulkScanFunctionality_test.js');

const bulkScanApiCalls = require('../helpers/utils');

const miscUtils = require('../helpers/misc');

const stringUtils = require('../helpers/string_utils');

const testConfig = require('./config/CCPBConfig');

// const successResponse = 202;

// eslint-disable max-len

Feature('CC Pay Bubble Bulk Scan Acceptance Tests').retry(CCPBATConstants.defaultNumberOfRetries);

/* BeforeSuite(async I => {
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});*/


// #region Normal CCD case bulk scan functional cases
Scenario('Normal ccd case cash payment full allocation', async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory) => {
  // logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  // console.log(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  // I.waitInUrl(`/payment-history/${ccdCaseNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBATConstants.nineSecondWaitTime);
  // I.waitForNavigation(0,"domcontentloaded");
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cash');
  CaseTransaction.allocateToNewFee();
  AddFees.addFeesAmount('593.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', '593.00', true);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '1', '£593.00', '£593.00');
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage('£593.00', receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateCcdPaymentDetails(receiptReference, '£593.00', dcnNumber, 'success', 'Cash', 'FEE0002');
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cheque payment partial allocation 2 fees added with a Remission on the first Fee', async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, Remission) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 493;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  console.log(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  // console.log(`The value of the dcnNumber : ${dcnNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  // I.waitInUrl(`/payment-history/${ccdCaseNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBATConstants.nineSecondWaitTime);
  // I.waitForNavigation();
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£493.00', 'cheque');
  CaseTransaction.allocateToNewFee();
  AddFees.addFeesAmount('593.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', '593.00', false);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  FeesSummary.deductRemission();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  Remission.verifyAddRemissionPageText();
  Remission.verifyNoRemissionCodeOrAmountErrorMessages();
  Remission.remissionAmountExceed('600');
  Remission.processRemission('FEE0002', '493');
  Remission.confirmProcessRemission();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  FeesSummary.verifyFeeSummaryAfterRemissionBulkScan('FEE0002', '£593.00', '£100.00', '£493.00');
  FeesSummary.addFeeFromSummary();
  AddFees.addFees('19.00', 'civil', 'magistrates_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', '19.00', true);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '1', '£493.00', '£593.00', '£593.00', '£19.00');
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0362', '1', '£493.00', '£19.00', '£19.00', '£19.00');
  ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPaymentNotPaid(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  CaseTransaction.validateTransactionPageForRemission('HWF-A1B-23C', 'FEE0002', '£100.00');
  I.Logout();
}).tag('@pipeline @nightly @crossbrowser');

Scenario('Normal ccd case cash payment transferred', async (I, CaseSearch, CaseTransaction, CaseTransferred, PaymentHistory) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  console.log(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, '593.00', 'Cash');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Transferred');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage('£593.00', receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, '£593.00', dcnNumber, 'Cash');
  I.Logout();
}).tag('@pipeline @nightly @crossbrowser');

// #endregion

Scenario.only('Exception ccd case cash payment transferred', async (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA07', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cheque');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, '593.00', 'Cheque');
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

Scenario('DCN Search for ccd case associated with exception postal order payment transferred', async (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 600;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA09', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumber = ccdAndDcn[1];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, dcnNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£600.00', 'postal order');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, '600.00', 'Postal Order');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Transferred');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Normal ccd case cash payment transferred when no valid reason or site id selected', async (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA09', totalAmount, 'cash');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.confirmPayment();
  CaseTransferred.whenNoReasonAndSiteid();
  CaseTransferred.selectSiteId('Basildon Combined Court - Crown (W802)');
  CaseTransferred.inputTransferredReason('ab');
  CaseTransferred.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransferred.whenReasonLessThanLimit();
  CaseTransferred.cancelTransferredReason();
  I.Logout();
}).tag('@nightly');

Scenario('Exception Case Cheque Payment Unidentified', async (I, CaseSearch, CaseTransaction, CaseUnidentified, PaymentHistory) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA07', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.validateUnidentifiedPage(dcnNumber, '593.00', 'Cheque');
  CaseUnidentified.validateAndConfirmUnidentified('auto unidentified reason');
  CaseUnidentified.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Unidentified');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToPaymentHistory();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.verifyPaymentHistoryPage('£593.00', receiptReference);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, '£593.00', dcnNumber, 'Cheque');
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Exception Case DCN Search Cheque Payment Unidentified when no or less investigation comment provided', async (I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 593;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, dcnNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£593.00', 'cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.continuePayment();
  CaseUnidentified.whenNoInvestigation();
  CaseUnidentified.inputUnidentifiedComment('ta');
  CaseUnidentified.continuePayment();
  CaseUnidentified.whenCommentLessThanLimit();
  CaseUnidentified.cancelUnidentifiedComment();
  I.Logout();
}).tag('@nightly');

Scenario('Ccd case search with exception record postal order payment shortfall payment',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary,
         ConfirmAssociation, PaymentHistory) => {
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    const totalAmount = 493;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA08', totalAmount, 'PostalOrder');
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    console.log(`The DCN Number from the Test : ${dcnNumber}`);
    console.log(`The Real CCD Case Number from the Test : ${ccdCaseNumber}`);
    console.log(`The Exception CCD Case Number from the Test : ${ccdAndDcn[2]}`);
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£493.00', 'postal order');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    AddFees.addFeesAmount('593.00', 'family', 'family_court');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', '593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '1',
      '£493.00', '£593.00', '£593.00', '£100.00');
    ConfirmAssociation.confirmPayment();
    ConfirmAssociation.verifyConfirmAssociationShortfallPaymentErrorMessages();
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseSurplusOrShortfallSuccessPaymentNotPaid(ccdCaseNumberFormatted, 'Case reference', 'Allocated', '£100.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    // Search using receipt number
    const receiptSearch = await CaseTransaction.getReceiptReference();
    CaseSearch.navigateToCaseTransaction();
    // console.log(`The value of the Payment Reference : ${receiptSearch}`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptSearch);
    CaseTransaction.checkBulkCaseSuccessPaymentNotPaid(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
    PaymentHistory.navigateToPaymentHistory();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, receiptSearch);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    PaymentHistory.verifyPaymentHistoryPage('£493.00', receiptSearch);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@nightly');

Scenario('Exception search with ccd record postal order payment surplus payment', async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const totalAmount = 600;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA07', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const exNumber = ccdAndDcn[2];
  const ccdCaseNumber = ccdAndDcn[1];
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, exNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£600.00', 'postal order');
  CaseTransaction.allocateToNewFee();
  AddFees.addFeesAmount('593.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0002', '593.00', true);
  // FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationSurplusPayment('FEE0002', '£593.00', '£7.00');
  ConfirmAssociation.selectSurplusReasonOtherExplainatoryAndUser('Help with Fees awarded', 'Other explainatory note', 'Auto Comment');
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCaseSurplusOrShortfallSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).tag('@pipeline @nightly');

Scenario('Download reports in paybubble', (I, Reports) => {
  logger.info('Here is the Logger');
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  Reports.navigateToReports();
  Reports.validateReportsPage();
  Reports.selectReportAndDownload('Data loss');
  Reports.selectReportAndDownload('Unprocessed transactions');
  Reports.selectReportAndDownload('Processed unallocated');
  Reports.selectReportAndDownload('Under payment and Over payment');
  I.Logout();
}).tag('@nightly @crossbrowser');
