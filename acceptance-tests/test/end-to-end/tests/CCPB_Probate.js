const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Divorce: One fee and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.onefeeforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.multiplefeesforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.partialremissionforonefeeforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.partialremissionassignforonefeenotassignforanotherfee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.fullremissionforonefee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.fullremissionforonefeenotforanotherfee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.fullremissionforonefeeandonefeeforpartialremission2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount2();
  I.Logout();
});


Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.multiplefeesforpaymentandonefeeremoving2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.onefeeforprobate();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.anotherfeeforprobate();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.anotherfeeforprobate2();
  I.Logout();
});
