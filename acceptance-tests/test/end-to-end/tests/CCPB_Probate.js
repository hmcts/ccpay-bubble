/* eslint-disable */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const testConfig = require('./config/CCPBConfig');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(({ I }) => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Divorce: One fee and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.onefeeforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.multiplefeesforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.partialremissionforonefeeforpayment2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.partialremissionassignforonefeenotassignforanotherfee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeenotforanotherfee2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeeandonefeeforpartialremission2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount2();
  I.Logout();
});


Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.multiplefeesforpaymentandonefeeremoving2();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.onefeeforprobate();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.anotherfeeforprobate();
  I.Logout();
});

Scenario('Divorce: multiple fees and one full payment flow',({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment History');
  I.anotherfeeforprobate2();
  I.Logout();
});
