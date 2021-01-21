const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

// #region Normal CCD case bulk scan functional cases
Scenario('Normal ccd case cash payment full allocation', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1610991906890777');
  CaseTransaction.checkBulkCase('1610-9919-0689-0777', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000503', '£550.00', 'Cash');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002')
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0002', '£550.00');
  ConfirmAssociation.cancelPayment();
  FeesSummary.removeFeesFromSummary();
  I.Logout();
});

Scenario('Normal ccd case cheque payment partial allocation 2 fees add', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, Remission) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611157881361585');
  CaseTransaction.checkBulkCase('1611-1578-8136-1585', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000515', '£550.00', 'Cheque');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002')
  FeesSummary.deductRemission('FEE0002');
  Remission.noRemissionCodeOrAmount();
  Remission.remissionAmountExceed('600');
  Remission.processRemission('FEE0002', '450')
  Remission.cancelprocessRemission()
  FeesSummary.addFeeFromSummary();
  AddFees.addFees('100.00', 'civil', 'magistrates_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0059')
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.cancelPayment();
  FeesSummary.removeFeesFromSummary();
  FeesSummary.removeFeesFromSummary();
  I.Logout();
});

Scenario('Normal ccd case cash payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611000300846903');
  CaseTransaction.checkBulkCase('1611-0003-0084-6903', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000504', '£550.00', 'Cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage('700000000000100000504', '550.00', 'Cash');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancelTransferred();
  I.Logout();
});

// #endregion

Scenario('Exception ccd case cash payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611009456795970');
  CaseTransaction.checkBulkCase('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage('700000000000100000505', '550.00', 'Cheque');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancelTransferred();
  I.Logout();
});

Scenario('DCN Search for ccd case associated with exception postal order payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingDcnNumber('700000000000100000513');
  CaseTransaction.checkBulkCase('1611-0180-1444-0086', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000513', '£600.00', 'Postal order');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.validateTransferredPage('700000000000100000513', '600.00', 'Postal Order');
  CaseTransferred.validateAndConfirmTransferred('auto transferred reason', 'Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancelTransferred();
  I.Logout();
});

Scenario('Normal ccd case cash payment transferred when no valid reason or site id selected', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611000300846903');
  CaseTransaction.checkBulkCase('1611-0003-0084-6903', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000504', '£550.00', 'Cash');
  CaseTransaction.allocateToTransferred();
  CaseTransferred.confirmPayment()
  CaseTransferred.whenNoReasonAndSiteid();
  CaseTransferred.selectSiteId('Basildon Combined Court - Crown (W802)');
  CaseTransferred.inputTransferredReason('ab');
  CaseTransferred.confirmPayment();
  CaseTransferred.whenReasonLessThanLimit();
  CaseTransferred.cancelTransferredReason();
  I.Logout();
});

Scenario('Exception Case Cheque Payment Unidentified', (I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611009456795970');
  CaseTransaction.checkBulkCase('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.validateUnidentifiedPage('700000000000100000505', '550.00', 'Cheque');
  CaseUnidentified.validateAndConfirmUnidentified('auto unidentified reason');
  CaseUnidentified.cancelUnidentified();
  I.Logout();
});

Scenario('Exception Case DCN Search Cheque Payment Unidentified when no or less investigation comment provided', (I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingDcnNumber('700000000000100000505');
  CaseTransaction.checkBulkCase('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocateToUnidentified();
  CaseUnidentified.continuePayment();
  CaseUnidentified.whenNoInvestigation()
  CaseUnidentified.inputUnidentifiedComment('ta');
  CaseUnidentified.continuePayment();
  CaseUnidentified.whenCommentLessThanLimit();
  CaseUnidentified.cancelUnidentifiedComment();
  I.Logout();
});

Scenario('Ccd case search with exception record postal order payment shortfall payment', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611013727578439');
  CaseTransaction.checkBulkCase('1611-0137-2757-8439', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000510', '£500.00', 'Postal order');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002')
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0002', '£500.00', '£50.00');
  ConfirmAssociation.cancelPayment();
  FeesSummary.removeFeesFromSummary();
  I.Logout();
});

Scenario('Exception search with ccd record postal order payment surplus payment', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingCcdNumber('1611014377468467');
  CaseTransaction.checkBulkCase('1611-0144-2035-6024', 'CCD reference');
  CaseTransaction.checkUnallocatedPayments('1', '700000000000100000511', '£600.00', 'Postal order');
  CaseTransaction.allocateToNewFee();
  AddFees.addFees('550.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryBulkScan('FEE0002')
  FeesSummary.allocateBulkPayment();
  ConfirmAssociation.verifyConfirmAssociationSurplusPayment('FEE0002', '£550.00', '£50.00');
  ConfirmAssociation.cancelPayment();
  FeesSummary.removeFeesFromSummary();
  I.Logout();
});

Scenario('Payment reference RC search with ccd record associated with exception', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingPaymentRef('RC-1611-0153-2743-2552');
  CaseTransaction.checkBulkCaseSuccessPayment('1611-0122-8484-2170', 'CCD reference', 'Allocated');
  I.Logout();
});

Scenario('Payment reference RC search for exception', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.searchCaseUsingPaymentRef('RC-1611-0169-9283-4106');
  CaseTransaction.checkBulkCaseSuccessPayment('1611-0168-3181-5167', 'Exception reference', 'Transferred');
  I.Logout();
});
