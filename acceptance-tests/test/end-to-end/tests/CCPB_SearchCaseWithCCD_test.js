const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const nightlyTest = process.env.NIGHTLY_TEST;

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
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
  I.Logout();
});

Scenario('Search for a case with actual case number from CCD @nightly', I => {
  if (nightlyTest === 'true') {
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
    I.Logout();
  }
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
  I.Logout();
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
  I.Logout();
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
  I.Logout();
});
