const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Probate: One fee and one full payment flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.onefeeforpayment2();
  I.clickCaseTransaction();
});

Scenario('Probate: multiple fees and one full payment flow', I => {
  I.multiplefeesforpayment2();
  I.clickCaseTransaction();
});

Scenario('Probate: partial remission for one fee for one payment', I => {
  I.partialremissionforonefeeforpayment2();
  I.clickCaseTransaction();
});

/*Scenario('Probate: partial remission assign for one fee not assign for another fee', I => {
  I.partialremissionassignforonefeenotassignforanotherfee2();
  I.clickCaseTransaction();
});

Scenario('Probate: full remission for one fee', I => {
  I.fullremissionforonefee2();
  I.clickCaseTransaction();
});

Scenario('Probate: full remission for one fee not for another fee', I => {
  I.fullremissionforonefeenotforanotherfee2();
  I.clickCaseTransaction();
});

Scenario('Probate: full remission for one fee and one fee for partial remission', I => {
  I.fullremissionforonefeeandonefeeforpartialremission2();
  I.clickCaseTransaction();
});

Scenario('Probate: full remission for one fee and one fee for partial remission and one fee for full amount ', I => {
  I.fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount2();
  I.clickCaseTransaction();
});

Scenario('Probate: multiple fees for payment and one fee removing', I => {
  I.multiplefeesforpaymentandonefeeremoving2();
  I.clickCaseTransaction();
});

Scenario('Probate: one fee for probate', I => {
  I.onefeeforprobate();
  I.clickCaseTransaction();
});

Scenario('Probate: another fee for probate', I => {
  I.anotherfeeforprobate();
  I.clickCaseTransaction();
});

Scenario('Probate: another fee fo rprobate', I => {
  I.anotherfeeforprobate2();
  I.Logout1();
}); */

