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
  I.onefeeforpayment();
  I.clickCaseTransaction();
});

Scenario('Divorce: multiple fees and one full payment flow', I => {
  I.multiplefeesforpayment();
  I.clickCaseTransaction();
});

Scenario('Divorce: partial remission for one fee for one payment', I => {
  I.partialremissionforonefeeforpayment();
  I.clickCaseTransaction();
});

Scenario('Divorce: partial remission assign for one fee not assign for another fee', I => {
  I.partialremissionassignforonefeenotassignforanotherfee();
  I.clickCaseTransaction();
});

Scenario('Divorce: full remission for one fee', I => {
  I.fullremissionforonefee();
  I.clickCaseTransaction();
});

Scenario('Divorce: full remission for one fee not for another fee', I => {
  I.fullremissionforonefeenotforanotherfee();
  I.clickCaseTransaction();
});

Scenario('Divorce: full remission for one fee and one fee for partial remission', I => {
  I.fullremissionforonefeeandonefeeforpartialremission();
  I.clickCaseTransaction();
});

Scenario('Divorce: full remission for one fee and one fee for partial remission and one fee for full amount', I => {
  I.fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount();
  I.clickCaseTransaction();
});


Scenario('Divorce: multiple fees for payment and one fee removing', I => {
  I.multiplefeesforpaymentandonefeeremoving();
  I.clickCaseTransaction();
});

Scenario('Divorce: partial remission for more than fee amount', I => {
  I.partialremissionformorethanfeeamount();
  I.Logout1();
});
