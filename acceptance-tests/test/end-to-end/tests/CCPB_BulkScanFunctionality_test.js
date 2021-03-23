const { Logger } = require('@hmcts/nodejs-logging');

const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const logger = Logger.getLogger('CCPB_BulkScanFunctionality_test.js');

const bulkScanApiCalls = require('../helpers/utils');

const miscUtils = require('../helpers/misc');

const stringUtils = require('../helpers/string_utils');

const nightlyTest = process.env.NIGHTLY_TEST;

const successResponse = 202;

// eslint-disable max-len

Feature('CC Pay Bubble Bulk Scan Acceptance Tests');

BeforeSuite(async I => {
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
});


// #region Normal CCD case bulk scan functional cases
Scenario('Normal ccd case cash payment full allocation @nightly', async(I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 550;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'Cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cash');
    CaseTransaction.allocateToNewFee();
    AddFees.addFees('550.00', 'family', 'family_court');
    FeesSummary.verifyFeeSummaryBulkScan('FEE0002');
    FeesSummary.allocateBulkPayment();
    ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '£550.00', '£550.00');
    ConfirmAssociation.confirmPayment();
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Allocated');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    const receiptReference = await CaseTransaction.getReceiptReference();
    PaymentHistory.navigateToReceiptRefs(receiptReference);
    PaymentHistory.validateCcdPaymentDetails(receiptReference, '£550.00', dcnNumber, 'success', 'Cash', 'FEE0002');
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Normal ccd case cheque payment partial allocation 2 fees add @pipeline1 @nightly', async(I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, Remission) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  const totalAmount = 550;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'Cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
  // firefox failure, dcn number:
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002');
  FeesSummary.deductRemission('FEE0002');
  Remission.noRemissionCodeOrAmount();
  Remission.remissionAmountExceed('600');
  Remission.processRemission('FEE0002', '450');
  Remission.confirmprocessRemission();
  FeesSummary.verifyFeeSummaryAfterRemissionBulkScan('FEE0002', '£100.00', '£450.00');
  FeesSummary.addFeeFromSummary();
  AddFees.addFees('100.00', 'civil', 'magistrates_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0059');
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '£550.00', '£550.00');
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0059', '£550.00', '£100.00');
  ConfirmAssociation.confirmPayment();
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  CaseTransaction.validateTransactionPageForRemission('HWF-A1B-23C', 'FEE0002', '£100.00');
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Normal ccd case cash payment transferred @nightly', async(I, CaseSearch, CaseTransaction, CaseTransferred, PaymentHistory) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 550;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'Cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cash');
    CaseTransaction.allocateToTransferred();
    CaseTransferred.validateTransferredPage(dcnNumber, '550.00', 'Cash');
    CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
    CaseTransferred.confirmPayment();
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Transferred');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    const receiptReference = await CaseTransaction.getReceiptReference();
    PaymentHistory.navigateToReceiptRefs(receiptReference);
    PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, '£550.00', dcnNumber, 'Cash');
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

// #endregion

Scenario('Exception ccd case cash payment transferred @nightly', async(I, CaseSearch, CaseTransaction, CaseTransferred) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 550;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA07', totalAmount, 'Cheque');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cheque');
    CaseTransaction.allocateToTransferred();
    CaseTransferred.validateTransferredPage(dcnNumber, '550.00', 'Cheque');
    CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
    CaseTransferred.confirmPayment();
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Transferred');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);

    // Search using receipt number
    const receiptSearch = await CaseTransaction.getReceiptReference();
    CaseSearch.navigateToCaseTransaction();
    CaseSearch.searchCaseUsingPaymentRef(receiptSearch);
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Transferred');

    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('DCN Search for ccd case associated with exception postal order payment transferred @nightly @pipeline', async(I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  const totalAmount = 600;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA09', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumber = ccdAndDcn[1];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  CaseSearch.searchCaseUsingDcnNumber(dcnNumber);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£600.00', 'Postal order');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage(dcnNumber, '600.00', 'Postal Order');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.confirmPayment();
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Transferred');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Normal ccd case cash payment transferred when no valid reason or site id selected @nightly', async(I, CaseSearch, CaseTransaction, CaseTransferred) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 550;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA09', totalAmount, 'Cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cash');
    CaseTransaction.allocateToTransferred();
    CaseTransferred.confirmPayment();
    CaseTransferred.whenNoReasonAndSiteid();
    CaseTransferred.selectSiteId('Basildon Combined Court - Crown (W802)');
    CaseTransferred.inputTransferredReason('ab');
    CaseTransferred.confirmPayment();
    CaseTransferred.whenReasonLessThanLimit();
    CaseTransferred.cancelTransferredReason();
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Exception Case Cheque Payment Unidentified @nightly @pipeline', async(I, CaseSearch, CaseTransaction, CaseUnidentified, PaymentHistory) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  const totalAmount = 550;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA07', totalAmount, 'Cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.validateUnidentifiedPage(dcnNumber, '550.00', 'Cheque');
  CaseUnidentified.validateAndConfirmUnidentified('auto unidentified reason');
  CaseUnidentified.confirmPayment();
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Exception reference', 'Unidentified');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  const receiptReference = await CaseTransaction.getReceiptReference();
  PaymentHistory.navigateToReceiptRefs(receiptReference);
  PaymentHistory.validateTransferredUnidentifiedPaymentDetails(receiptReference, '£550.00', dcnNumber, 'Cheque');
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Exception Case DCN Search Cheque Payment Unidentified when no or less investigation comment provided @nightly', async(I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 550;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'Cheque');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    CaseSearch.searchCaseUsingDcnNumber(dcnNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Exception reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£550.00', 'Cheque');
    CaseTransaction.allocateToUnidentified();
    CaseUnidentified.continuePayment();
    CaseUnidentified.whenNoInvestigation();
    CaseUnidentified.inputUnidentifiedComment('ta');
    CaseUnidentified.continuePayment();
    CaseUnidentified.whenCommentLessThanLimit();
    CaseUnidentified.cancelUnidentifiedComment();
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });


Scenario('Ccd case search with exception record postal order payment shortfall payment @nightly @pipeline', async(I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  const totalAmount = 500;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA08', totalAmount, 'PostalOrder');
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumber = ccdAndDcn[1];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleCcdSearch(CaseSearch, I, ccdCaseNumber);

  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£500.00', 'Postal order');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002');
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '£500.00', '£50.00');
  ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
  ConfirmAssociation.confirmPayment();
  CaseTransaction.checkBulkCaseSurplusOrShortfallSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Allocated', '£50.00');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);

  // Search using receipt number
  const receiptSearch = await CaseTransaction.getReceiptReference();
  CaseSearch.navigateToCaseTransaction();
  CaseSearch.searchCaseUsingPaymentRef(receiptSearch);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Allocated');
  PaymentHistory.navigateToPaymentHistory();
  CaseSearch.searchCaseUsingPaymentRef(receiptSearch);
  PaymentHistory.validatePaymentHistoryPage();
  PaymentHistory.navigateToReceiptRefs(receiptSearch);
  PaymentHistory.validateCcdPaymentDetails(receiptSearch, '£500.00', dcnNumber, 'success', 'Postal order', 'FEE0002');
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Exception search with ccd record postal order payment surplus payment @nightly', async(I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    const totalAmount = 600;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanCcdLinkedToException('AA07', totalAmount, 'PostalOrder');
    const dcnNumber = ccdAndDcn[0];
    const exNumber = ccdAndDcn[2];
    const ccdCaseNumber = ccdAndDcn[1];
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
    await miscUtils.multipleCcdSearch(CaseSearch, I, exNumber);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'CCD reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '£600.00', 'Postal order');
    CaseTransaction.allocateToNewFee();
    AddFees.addFees('550.00', 'family', 'family_court');
    FeesSummary.verifyFeeSummaryBulkScan('FEE0002');
    FeesSummary.allocateBulkPayment();
    ConfirmAssociation.verifyConfirmAssociationSurplusPayment('FEE0002', '£550.00', '£50.00');
    ConfirmAssociation.selectSurplusReasonOtherExplainatoryAndUser('Help with Fees awarded', 'Other explainatory note', 'Auto Comment');
    ConfirmAssociation.confirmPayment();
    CaseTransaction.checkBulkCaseSurplusOrShortfallSuccessPayment(ccdCaseNumberFormatted, 'CCD reference', 'Allocated', '-£50.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Download reports in paybubble @nightly', (I, Reports) => {
  if (nightlyTest) {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    Reports.navigateToReports();
    Reports.validateReportsPage();
    Reports.selectReportAndDownload('Data loss');
    Reports.selectReportAndDownload('Unprocessed transactions');
    Reports.selectReportAndDownload('Processed unallocated');
    Reports.selectReportAndDownload('Shortfalls and surplus');
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });
