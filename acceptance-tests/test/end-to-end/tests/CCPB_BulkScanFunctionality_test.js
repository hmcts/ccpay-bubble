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
  CaseSearch.search_case_using_ccd_number('1610991906890777');
  CaseTransaction.check_bulk_case('1610-9919-0689-0777', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000503', '£550.00', 'Cash');
  CaseTransaction.allocate_to_new_fee();
  AddFees.add_fees('550.00');
  FeesSummary.verify_fee_summary();
  FeesSummary.allocate_bulk_payment();
  ConfirmAssociation.verify_confirm_association_for_full_payment();
  ConfirmAssociation.cancel_payment();
  FeesSummary.remove_fees();
  I.Logout();
});

Scenario('Normal ccd case cash payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611000300846903');
  CaseTransaction.check_bulk_case('1611-0003-0084-6903', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000504', '£550.00', 'Cash');
  CaseTransaction.allocate_to_transferred();
  CaseTransferred.validate_transferred_page('700000000000100000504', '550.00', 'Cash');
  CaseTransferred.validate_and_confirm_transferred('auto transferred reason','Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancel_transferred();
  I.Logout();
});

// #endregion

Scenario('Exception ccd case cash payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611009456795970');
  CaseTransaction.check_bulk_case('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocate_to_transferred();
  CaseTransferred.validate_transferred_page('700000000000100000505', '550.00', 'Cash');
  CaseTransferred.validate_and_confirm_transferred('auto transferred reason','Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancel_transferred();
  I.Logout();
});

Scenario('DCN Search for ccd case associated with exception postal order payment transferred', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_dcn_number('700000000000100000513');
  CaseTransaction.check_bulk_case('1611-0180-1444-0086', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000513', '£600.00', 'Postal order');
  CaseTransaction.allocate_to_transferred();
  CaseTransferred.validate_transferred_page('700000000000100000513', '600.00', 'Postal Order');
  CaseTransferred.validate_and_confirm_transferred('auto transferred reason','Basildon Combined Court - Crown (W802)');
  CaseTransferred.cancel_transferred();
  I.Logout();
});

Scenario('Normal ccd case cash payment transferred when no valid reason or site id selected', (I, CaseSearch, CaseTransaction, CaseTransferred) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611000300846903');
  CaseTransaction.check_bulk_case('1611-0003-0084-6903', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000504', '£550.00', 'Cash');
  CaseTransaction.allocate_to_transferred();
  CaseTransferred.confirm_payment()
  CaseTransferred.error_message_when_no_reason_and_siteid();
  CaseTransferred.select_site_id('Basildon Combined Court - Crown (W802)');
  CaseTransferred.input_transferred_reason('ab');
  CaseTransferred.confirm_payment();
  CaseTransferred.error_message_when_reason_less_than_limit();
  CaseTransferred.cancel_transferred_reason();
  I.Logout();
});

Scenario('Exception Case Cheque Payment Unidentified', (I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611009456795970');
  CaseTransaction.check_bulk_case('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocate_to_unidentified();
  CaseUnidentified.validate_unidentified_page('700000000000100000505', '550.00', 'Cheque');
  CaseUnidentified.validate_and_confirm_unidentified('auto unidentified reason');
  CaseUnidentified.cancel_unidentified();
  I.Logout();
});

Scenario('Exception Case DCN Search Cheque Payment Unidentified when investigation comment provided', (I, CaseSearch, CaseTransaction, CaseUnidentified) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_dcn_number('700000000000100000505');
  CaseTransaction.check_bulk_case('1611-0094-5679-5970', 'Exception reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000505', '£550.00', 'Cheque');
  CaseTransaction.allocate_to_unidentified();
  CaseUnidentified.continue_payment();
  CaseUnidentified.error_message_when_no_investigation()
  CaseUnidentified.input_unidentified_comment('ta');
  CaseUnidentified.continue_payment();
  CaseUnidentified.error_message_when_comment_less_than_limit();
  CaseUnidentified.cancel_unidentified_comment();
  I.Logout();
});

Scenario('Ccd case search with exception record postal order payment shortfall payment', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611013727578439');
  CaseTransaction.check_bulk_case('1611-0137-2757-8439', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000510', '£500.00', 'Postal order');
  CaseTransaction.allocate_to_new_fee();
  AddFees.add_fees('550.00');
  FeesSummary.verify_fee_summary();
  FeesSummary.allocate_bulk_payment();
  ConfirmAssociation.verify_confirm_association_for_short_fall_payment();
  ConfirmAssociation.cancel_payment();
  FeesSummary.remove_fees();
  I.Logout();
});

Scenario('Exception search with ccd record postal order payment surplus payment', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_ccd_number('1611014377468467');
  CaseTransaction.check_bulk_case('1611-0144-2035-6024', 'CCD reference');
  CaseTransaction.check_for_unallocated_payments('1','700000000000100000511', '£600.00', 'Postal order');
  CaseTransaction.allocate_to_new_fee();
  AddFees.add_fees('550.00');
  FeesSummary.verify_fee_summary();
  FeesSummary.allocate_bulk_payment();
  ConfirmAssociation.verify_confirm_association_for_surplus_payment();
  ConfirmAssociation.cancel_payment();
  FeesSummary.remove_fees();
  I.Logout();
});

Scenario('Payment reference RC search with ccd record associated with exception', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_payment_ref('RC-1611-0153-2743-2552');
  CaseTransaction.check_bulk_case_success_payment('1611-0122-8484-2170', 'CCD reference','Allocated');
  I.Logout();
});

Scenario('Payment reference RC search for exception', (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  CaseSearch.search_case_using_payment_ref('RC-1611-0169-9283-4106');
  CaseTransaction.check_bulk_case_success_payment('1611-0168-3181-5167', 'Exception reference','Transferred');
  I.Logout();
});
