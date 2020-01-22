const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.wait(CCPBATConstants.twoSecondWaitTime);
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Search case with CCD paybubble flow', I => {
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

Scenario('Search case with CCD paybubble flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.wait(CCPBATConstants.tenSecondWaitTime);
  I.waitForText('Search for a case', CCPBATConstants.tenSecondWaitTime);
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.searchForCorrectCCDNumber();
  I.Logout();
});
