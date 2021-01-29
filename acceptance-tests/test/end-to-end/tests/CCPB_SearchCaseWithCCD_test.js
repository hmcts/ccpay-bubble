const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

Before(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.thirtySecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

After(I => {
  I.Logout();
});

Scenario('Search for a case with dummy case number', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.searchForCCDdummydata();
});

Scenario('Search for a case with actual case number from CCD', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('What do you want to search for?');
  I.see('CCD case reference or exception record');
  I.see('Payment Asset Number (DCN)');
  I.see('Case Transaction');
  I.see('Payment history');
  I.see('Reports');
  I.searchForCorrectCCDNumber();
});

Scenario('Search for a case with actual case for Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.caseforTelephonyFlow();
});

Scenario('Amount Due case for Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.AmountDueCaseForTelephonyFlow();
});

Scenario('Remove fee from case transaction page Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.removeFeeFromCaseTransactionPageTelephonyFlow();
});
