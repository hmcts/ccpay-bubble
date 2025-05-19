/* eslint-disable */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(({ I }) => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Divorce: One fee and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.onefeeforpayment();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.multiplefeesforpayment();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.partialremissionforonefeeforpayment();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.partialremissionassignforonefeenotassignforanotherfee();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefee();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeenotforanotherfee();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeeandonefeeforpartialremission();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount();
  I.Logout();
});


Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.multiplefeesforpaymentandonefeeremoving();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow', ({ I }) => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.partialremissionformorethanfeeamount();
  I.Logout();
});
